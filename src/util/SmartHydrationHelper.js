/**
 * Smart Hydration Helper
 *
 * Orchestrates weather fetching, recommendation calculation, and context updates.
 */

import { weatherActions } from '../context/WeatherContext';
import { fetchWeatherForCurrentLocation, isWeatherDataStale } from './WeatherHelper';
import { calculateHydrationRecommendation } from './HydrationCalculator';
import { scheduleHydrationReminders } from './ReminderHelper';
import { saveWaterGoal } from './FirebaseHelper';

const normalizeGoal = (goal) => Number(goal) || 0;

let smartHydrationRequest = null;

const recommendationsMatch = (currentRec, newRec) => {
    if (!currentRec || !newRec) {
        return false;
    }

    return (
        Number(currentRec.recommendedIntake) === Number(newRec.recommendedIntake) &&
        Number(currentRec.reminderFrequency) === Number(newRec.reminderFrequency) &&
        normalizeGoal(currentRec.currentGoal) === normalizeGoal(newRec.currentGoal) &&
        Number(currentRec.goalDifference) === Number(newRec.goalDifference) &&
        currentRec.hydrationLevel === newRec.hydrationLevel
    );
};

/**
 * Fetch weather and update hydration recommendation in WeatherContext
 */
export const fetchAndUpdateSmartHydration = async (weatherDispatch, currentGoal, options = {}) => {
    if (!options.isPremiumUser) {
        return;
    }

    if (smartHydrationRequest) {
        return smartHydrationRequest;
    }

    weatherDispatch(weatherActions.fetchWeatherStart());

    smartHydrationRequest = (async () => {
        const weatherData = await fetchWeatherForCurrentLocation();
        if (!weatherData) {
            throw new Error('Weather data is unavailable.');
        }

        weatherDispatch(weatherActions.fetchWeatherSuccess(weatherData));

        const normalizedGoal = normalizeGoal(currentGoal);
        const recommendation = calculateHydrationRecommendation(weatherData, normalizedGoal);
        weatherDispatch(weatherActions.updateRecommendation(recommendation));
    })();

    try {
        await smartHydrationRequest;
    } catch (error) {
        console.error('Smart hydration fetch failed:', error);
        weatherDispatch(weatherActions.fetchWeatherError(error.message || 'Failed to fetch weather data'));
    } finally {
        smartHydrationRequest = null;
    }
};

/**
 * Refresh weather only if existing data is stale or missing
 */
export const refreshSmartHydrationIfNeeded = (weatherState, weatherDispatch, currentGoal, isPremiumUser = true) => {
    const normalizedGoal = normalizeGoal(currentGoal);
    const isStale = !weatherState.weatherData || isWeatherDataStale(weatherState.lastUpdated);

    if (weatherState.error && !weatherState.isLoading) {
        return;
    }

    if (isStale && !weatherState.isLoading) {
        fetchAndUpdateSmartHydration(weatherDispatch, normalizedGoal, { isPremiumUser });
        return;
    }

    if (!weatherState.weatherData) {
        return;
    }

    const newRecommendation = calculateHydrationRecommendation(weatherState.weatherData, normalizedGoal);

    // If recommendation is current, don't update
    if (weatherState.recommendation && recommendationsMatch(weatherState.recommendation, newRecommendation)) {
        return;
    }

    weatherDispatch(weatherActions.updateRecommendation(newRecommendation));
};

export { isWeatherDataStale };

/**
 * Accept a hydration recommendation
 */
export const acceptHydrationRecommendation = async (recommendation, firebaseDispatch, weatherDispatch, userId) => {
    if (!userId) {
        console.warn('User not signed in. Cannot update goal.');
        return;
    }

    await saveWaterGoal(firebaseDispatch, userId, recommendation.recommendedIntake);
    weatherDispatch(weatherActions.acceptRecommendation(recommendation));

    scheduleHydrationReminders(recommendation.reminderFrequency).catch((error) => {
        console.warn('Reminder scheduling failed, goal was still updated:', error);
    });
};

/**
 * Dismiss the current hydration recommendation
 */
export const dismissHydrationRecommendation = async (weatherDispatch) => {
    weatherDispatch(weatherActions.dismissRecommendation());
};
