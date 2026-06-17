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
    weatherDispatch(weatherActions.fetchWeatherStart());

    try {
        const weatherData = await fetchWeatherForCurrentLocation();
        weatherDispatch(weatherActions.fetchWeatherSuccess(weatherData));

        const normalizedGoal = normalizeGoal(currentGoal);
        const recommendation = calculateHydrationRecommendation(weatherData, normalizedGoal);
        weatherDispatch(weatherActions.updateRecommendation(recommendation));
    } catch (error) {
        console.error('Smart hydration fetch failed:', error);
        weatherDispatch(weatherActions.fetchWeatherError(error.message || 'Failed to fetch weather data'));
    }
};

/**
 * Refresh weather only if existing data is stale or missing
 */
export const refreshSmartHydrationIfNeeded = (weatherState, weatherDispatch, currentGoal) => {
    const normalizedGoal = normalizeGoal(currentGoal);
    const isStale = !weatherState.weatherData || isWeatherDataStale(weatherState.lastUpdated);

    if (isStale && !weatherState.isLoading) {
        fetchAndUpdateSmartHydration(weatherDispatch, normalizedGoal);
        return;
    }

    if (!weatherState.weatherData) {
        return;
    }

    const newRecommendation = calculateHydrationRecommendation(weatherState.weatherData, normalizedGoal);

    if (recommendationsMatch(weatherState.recommendation, newRecommendation)) {
        return;
    }

    weatherDispatch(weatherActions.updateRecommendation(newRecommendation));
};

/**
 * Accept a hydration recommendation
 */
export const acceptHydrationRecommendation = async (recommendation, firebaseDispatch, weatherDispatch, userId) => {
    if (!userId) {
        throw new Error('You must be signed in to update your water goal.');
    }

    await saveWaterGoal(firebaseDispatch, userId, recommendation.recommendedIntake);
    weatherDispatch(weatherActions.acceptRecommendation(recommendation));

    try {
        await scheduleHydrationReminders(recommendation.reminderFrequency);
    } catch (error) {
        console.warn('Reminder scheduling failed, goal was still updated:', error);
    }
};

/**
 * Dismiss the current hydration recommendation
 */
export const dismissHydrationRecommendation = async (weatherDispatch) => {
    weatherDispatch(weatherActions.dismissRecommendation());
};
