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

/**
 * Fetch weather and update hydration recommendation in WeatherContext
 * @param {Function} weatherDispatch - Weather context dispatch
 * @param {number} currentGoal - User's current daily water goal in ml
 * @param {Object} options - Optional settings
 * @param {boolean=} options.forceRefresh - Skip staleness check and always fetch
 * @param {boolean=} options.isPremiumUser - Whether the current user can access Smart Hydration
 */
export const fetchAndUpdateSmartHydration = async (weatherDispatch, currentGoal, options = {}) => {
    if (!options.isPremiumUser) {
        return;
    }

    weatherDispatch(weatherActions.fetchWeatherStart());

    try {
        const weatherData = await fetchWeatherForCurrentLocation();
        weatherDispatch(weatherActions.fetchWeatherSuccess(weatherData));

        const recommendation = calculateHydrationRecommendation(weatherData, currentGoal);
        weatherDispatch(weatherActions.updateRecommendation(recommendation));
    } catch (error) {
        console.error('Smart hydration fetch failed:', error);
        weatherDispatch(weatherActions.fetchWeatherError(error.message || 'Failed to fetch weather data'));
    }
};

/**
 * Refresh weather only if existing data is stale or missing
 * @param {Object} weatherState - Current weather context state
 * @param {Function} weatherDispatch - Weather context dispatch
 * @param {number} currentGoal - User's current daily water goal in ml
 * @param {Object} options - Optional settings
 * @param {boolean=} options.isPremiumUser - Whether the current user can access Smart Hydration
 */
export const refreshSmartHydrationIfNeeded = (weatherState, weatherDispatch, currentGoal, options = {}) => {
    if (!options.isPremiumUser) {
        return;
    }

    const isStale = !weatherState.weatherData || isWeatherDataStale(weatherState.lastUpdated);
    if (isStale && !weatherState.isLoading) {
        fetchAndUpdateSmartHydration(weatherDispatch, currentGoal, options);
    } else if (weatherState.weatherData && currentGoal) {
        const recommendation = calculateHydrationRecommendation(weatherState.weatherData, currentGoal);
        weatherDispatch(weatherActions.updateRecommendation(recommendation));
    }
};

/**
 * Accept a hydration recommendation: update goal and reminder schedule
 * @param {Object} recommendation - Recommendation object from calculator
 * @param {Function} firebaseDispatch - Firebase context dispatch
 * @param {Function} weatherDispatch - Weather context dispatch
 * @param {string} userId - Authenticated user id
 */
export const acceptHydrationRecommendation = async (recommendation, firebaseDispatch, weatherDispatch, userId) => {
    if (!userId) {
        throw new Error('You must be signed in to update your water goal.');
    }

    await saveWaterGoal(firebaseDispatch, userId, recommendation.recommendedIntake);
    weatherDispatch(weatherActions.acceptRecommendation(recommendation));

    scheduleHydrationReminders(recommendation.reminderFrequency).catch((error) => {
        console.warn('Reminder scheduling failed, goal was still updated:', error);
    });
};

/**
 * Dismiss the current hydration recommendation for today
 * @param {Function} weatherDispatch - Weather context dispatch
 */
export const dismissHydrationRecommendation = async (weatherDispatch) => {
    weatherDispatch(weatherActions.dismissRecommendation());
};
