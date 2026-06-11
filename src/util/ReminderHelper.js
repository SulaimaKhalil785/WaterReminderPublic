/**
 * Reminder Helper
 *
 * Schedules local hydration reminders based on smart recommendation intervals.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { storeData, getData } from './StorageHelper';

const REMINDER_INTERVAL_KEY = 'reminderInterval';
const REMINDER_ENABLED_KEY = 'reminderEnabled';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

/**
 * Request notification permissions and configure Android channel
 * @returns {Promise<boolean>} - Whether permissions were granted
 */
export const requestReminderPermissions = async () => {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('hydration-reminders', {
            name: 'Hydration Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus === 'granted') {
        return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
};

/**
 * Schedule repeating hydration reminders at the given interval
 * @param {number} intervalMinutes - Minutes between reminders
 * @returns {Promise<boolean>} - Whether reminders were scheduled
 */
export const scheduleHydrationReminders = async (intervalMinutes) => {
    await storeData(REMINDER_INTERVAL_KEY, String(intervalMinutes));

    if (Platform.OS === 'web') {
        console.warn('Push reminders are not supported on web. Interval saved locally.');
        return false;
    }

    try {
        const granted = await requestReminderPermissions();
        if (!granted) {
            console.warn('Notification permissions not granted');
            return false;
        }

        await Notifications.cancelAllScheduledNotificationsAsync();

        const intervalSeconds = Math.max(intervalMinutes * 60, 60);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: '💧 Time to hydrate!',
                body: 'Stay on track with your daily water goal.',
                sound: true,
            },
            trigger: {
                seconds: intervalSeconds,
                repeats: true,
                channelId: Platform.OS === 'android' ? 'hydration-reminders' : undefined,
            },
        });

        await storeData(REMINDER_ENABLED_KEY, 'true');
        return true;
    } catch (error) {
        console.warn('Failed to schedule reminders:', error);
        return false;
    }
};

/**
 * Restore reminders from stored interval (e.g. on app launch)
 */
export const restoreHydrationReminders = async () => {
    if (Platform.OS === 'web') {
        return;
    }

    const enabled = await getData(REMINDER_ENABLED_KEY);
    if (enabled !== 'true') {
        return;
    }

    const interval = await getData(REMINDER_INTERVAL_KEY);
    if (interval) {
        await scheduleHydrationReminders(Number(interval));
    }
};

/**
 * Cancel all scheduled hydration reminders
 */
export const cancelHydrationReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await storeData(REMINDER_ENABLED_KEY, 'false');
};
