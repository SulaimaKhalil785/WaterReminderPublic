import * as React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressCircle from 'react-native-progress/Circle';
import { useAuthContext } from '../../context/AuthContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { useWeatherContext } from '../../context/WeatherContext';
import { fetchWaterGoal, fetchWaterRecords, saveWaterRecord } from '../../util/FirebaseHelper';
import { refreshSmartHydrationIfNeeded } from '../../util/SmartHydrationHelper';
import { restoreHydrationReminders } from '../../util/ReminderHelper';
import AddWaterButton from '../../components/AddWaterButton';
import SmartHydrationSummaryCard from '../../components/SmartHydrationSummaryCard';
import { colorPalette } from '../../constants/color';
import { commonStyle, homeStyle } from '../../styles/styles';
import { getData, storeData } from '../../util/StorageHelper';
import moment from 'moment';
import WaterHistoryList from '../../components/WaterHistoryList';

const circleSize = 180; 

const HomeScreen = ({ navigation }) => {
    const [authState] = useAuthContext();
    const [state, dispatch] = useFirebaseContext();
    const [weatherState, weatherDispatch] = useWeatherContext();

    const isPremiumUser = Boolean(authState.user?.isPremiumUser);
    const userId = authState.user?.uid;
    const waterGoal = state.waterGoal?.waterGoal || 0;
    const today = useMemo(() => moment().format('YYYY-MM-DD'), []);

    useEffect(() => {
        if (!userId) {
            return;
        }

        const unsubscribeRecords = fetchWaterRecords(dispatch, userId);
        const unsubscribeGoal = fetchWaterGoal(dispatch, userId);
        const reminderTimer = setTimeout(() => {
            restoreHydrationReminders();
        }, 1000);

        return () => {
            unsubscribeRecords?.();
            unsubscribeGoal?.();
            clearTimeout(reminderTimer);
        };
    }, [userId, dispatch]);

    const totalWater = useMemo(() => {
        if (!state.dailyWaterRecord) {
            return 0;
        }

        return state.dailyWaterRecord.reduce((total, waterRecord) => {
            return total + (parseInt(waterRecord.data.size, 10) || 0);
        }, 0);
    }, [state.dailyWaterRecord]);

    const progress = useMemo(() => {
        if (!waterGoal) {
            return 0;
        }

        return Math.min(totalWater / waterGoal, 1);
    }, [totalWater, waterGoal]);

    useEffect(() => {
        if (totalWater < waterGoal) {
            return;
        }

        getData('goalHistory').then(res => {
            if (!res) {
                storeData('goalHistory', JSON.stringify([today]));
            } else if (!JSON.parse(res).includes(today)) {
                storeData('goalHistory', JSON.stringify([...JSON.parse(res), today]));
            }
        });
    }, [today, totalWater, waterGoal]);

    useEffect(() => {
        if (isPremiumUser) {
            refreshSmartHydrationIfNeeded(weatherState, weatherDispatch, waterGoal, { isPremiumUser });
        }
    }, [
        isPremiumUser,
        waterGoal,
        weatherState.weatherData,
        weatherState.lastUpdated,
        weatherState.isLoading,
        weatherDispatch
    ]);

    const openSmartHydration = useCallback(() => {
        if (isPremiumUser) {
            navigation.navigate('SmartHydration');
        }
    }, [isPremiumUser, navigation]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={homeStyle.container}>
            <Text style={commonStyle.header}>Water Reminder</Text>

            <View style={homeStyle.progress}>
                <ProgressCircle size={circleSize} progress={progress} showsText color={colorPalette.primary} />
            </View>

            <SmartHydrationSummaryCard
                recommendation={weatherState.recommendation}
                isLoading={weatherState.isLoading}
                error={weatherState.error}
                onPress={openSmartHydration}
                isPremium={isPremiumUser}
            />

            <WaterHistoryList dailyWaterRecord={state.dailyWaterRecord} />
            <AddWaterButton dispatch={dispatch} action={saveWaterRecord} userId={authState.user?.uid} />
        </View>
        </SafeAreaView>
    );
};

export default HomeScreen;
