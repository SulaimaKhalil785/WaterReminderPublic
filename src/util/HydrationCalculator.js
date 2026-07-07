/**
 * Hydration Recommendation Calculator
 * 
 * This utility calculates personalized hydration recommendations based on
 * weather conditions and provides detailed insights about hydration needs.
 */

import {
    getHydrationLevel,
    getRecommendedIntake,
    getReminderFrequency,
    getTemperatureColor,
    TEMPERATURE_RANGES,
    HYDRATION_RECOMMENDATIONS,
    REMINDER_FREQUENCY
} from '../constants/hydrationThresholds';

/**
 * Get suggested reminder interval in minutes based on temperature and goal
 * @param {number} temperature - Temperature in Celsius
 * @param {number} currentGoal - Current goal in ml
 * @returns {number} - Reminder interval in minutes
 */
export const getSuggestedReminderInterval = (temperature, currentGoal = 0) => {
    const reminderFrequency = getReminderFrequency(temperature);
    if (currentGoal > 3000) {
        return Math.max(reminderFrequency - 10, 15);
    }
    return reminderFrequency;
};

/**
 * Calculate complete hydration recommendation based on weather
 * @param {Object} weatherData - Weather data object with temperature, humidity, etc.
 * @param {number} currentGoal - User's current water goal in ml (optional)
 * @returns {Object} - Recommendation object with all details
 */
export const calculateHydrationRecommendation = (weatherData, currentGoal = 0) => {
    if (!weatherData || weatherData.temperature === undefined) {
        console.warn('Invalid weather data provided to calculator');
        return null;
    }

    const temperature = weatherData.temperature;
    const hydrationLevel = getHydrationLevel(temperature);
    const recommendedIntake = getRecommendedIntake(temperature);
    const reminderFrequency = getSuggestedReminderInterval(temperature, recommendedIntake);
    const temperatureColor = getTemperatureColor(temperature);

    // Calculate difference from current goal
    const goalDifference = recommendedIntake - currentGoal;
    const percentageChange = currentGoal > 0
        ? Math.round((goalDifference / currentGoal) * 100)
        : 0;

    // Generate recommendation message
    const message = generateRecommendationMessage(
        temperature,
        hydrationLevel,
        recommendedIntake,
        currentGoal,
        weatherData.humidity
    );

    return {
        temperature,
        hydrationLevel,
        recommendedIntake,
        currentGoal,
        goalDifference,
        percentageChange,
        reminderFrequency,
        temperatureColor,
        message,
        weatherDescription: weatherData.description,
        humidity: weatherData.humidity,
        feelsLike: weatherData.feelsLike,
        location: weatherData.location,
        displayTemperature: `${temperature}°C`,
        displayLocation: weatherData.country
            ? `${weatherData.location}, ${weatherData.country}`
            : weatherData.location,
        timestamp: weatherData.timestamp,
        isMocked: weatherData.isMocked || false
    };
};

/**
 * Generate human-readable recommendation message
 * @param {number} temperature - Temperature in Celsius
 * @param {string} hydrationLevel - Level (COLD, COOL, MODERATE, WARM, HOT)
 * @param {number} recommendedIntake - Recommended intake in ml
 * @param {number} currentGoal - Current goal in ml
 * @param {number} humidity - Humidity percentage
 * @returns {string} - Recommendation message
 */
const generateRecommendationMessage = (temperature, hydrationLevel, recommendedIntake, currentGoal, humidity) => {
    const goalDifference = recommendedIntake - currentGoal;

    const levelMessages = {
        COLD: 'Cold weather detected! Your body loses less water, so you can maintain a lower hydration goal.',
        COOL: 'Cool weather conditions. Stick to your regular hydration routine.',
        MODERATE: 'Perfect weather conditions for maintaining your regular hydration goal.',
        WARM: 'Warm weather detected! Increase your hydration to stay healthy and active.',
        HOT: '🔥 Hot weather alert! Significantly increase your water intake to prevent dehydration.'
    };

    let baseMessage = levelMessages[hydrationLevel] || levelMessages.MODERATE;

    if (goalDifference > 0) {
        const percentChange = currentGoal > 0
            ? Math.abs(Math.round((goalDifference / currentGoal) * 100))
            : 100;
        baseMessage += ` We recommend increasing your goal by ${Math.abs(goalDifference)}ml (${percentChange}%).`;
    } else if (goalDifference < 0) {
        const percentChange = currentGoal > 0
            ? Math.abs(Math.round((goalDifference / currentGoal) * 100))
            : 0;
        baseMessage += ` You can reduce your goal by ${Math.abs(goalDifference)}ml (${percentChange}%).`;
    }

    if (humidity > 70) {
        baseMessage += ` High humidity (${humidity}%) means more sweating - stay extra hydrated!`;
    }

    return baseMessage;
};

/**
 * Get hydration level details including tips and warnings
 * @param {string} hydrationLevel - Hydration level (COLD, COOL, MODERATE, WARM, HOT)
 * @returns {Object} - Details object with tips and warnings
 */
export const getHydrationLevelDetails = (hydrationLevel) => {
    const details = {
        COLD: {
            label: 'Cold Weather',
            emoji: '❄️',
            tips: [
                'You might feel less thirsty in cold weather',
                'Don\'t skip hydration - your body still needs water',
                'Warm beverages like tea can help you stay hydrated',
                'Indoor heating can still cause dehydration'
            ],
            activityLevel: 'Low to Moderate',
            sweatingLevel: 'Minimal'
        },
        COOL: {
            label: 'Cool Weather',
            emoji: '🌤️',
            tips: [
                'Maintain regular hydration habits',
                'Light activities are more comfortable',
                'You\'ll sweat less, so drink moderately'
            ],
            activityLevel: 'Moderate',
            sweatingLevel: 'Low'
        },
        MODERATE: {
            label: 'Moderate Weather',
            emoji: '☀️',
            tips: [
                'Perfect conditions for outdoor activities',
                'Maintain your regular hydration goal',
                'Balance your water intake throughout the day'
            ],
            activityLevel: 'High',
            sweatingLevel: 'Moderate'
        },
        WARM: {
            label: 'Warm Weather',
            emoji: '☀️',
            tips: [
                'Increase water intake to stay ahead of thirst',
                'Drink water regularly throughout the day',
                'Perfect for light outdoor activities',
                'Keep a water bottle handy at all times'
            ],
            activityLevel: 'High',
            sweatingLevel: 'Moderate to High'
        },
        HOT: {
            label: 'Extremely Hot',
            emoji: '🔥',
            tips: [
                'Critical: Significantly increase water intake',
                'Drink water constantly - don\'t wait until thirsty',
                'Take frequent breaks in shaded or cool areas',
                'Avoid strenuous activities during peak sun hours',
                'Watch for signs of heat exhaustion or dizziness'
            ],
            activityLevel: 'Very High',
            sweatingLevel: 'Extreme'
        }
    };

    return details[hydrationLevel] || details.MODERATE;
};

/**
 * Determine if recommendation is significantly different from current goal
 * @param {number} recommendedIntake - Recommended intake in ml
 * @param {number} currentGoal - Current goal in ml
 * @param {number} threshold - Percentage threshold for "significant" difference (default: 20%)
 * @returns {boolean} - True if difference exceeds threshold
 */
export const isSignificantChange = (recommendedIntake, currentGoal, threshold = 20) => {
    const percentageChange = Math.abs((recommendedIntake - currentGoal) / currentGoal) * 100;
    return percentageChange > threshold;
};

/**
 * Get hydration recommendation for multiple days (forecast)
 * Note: This is a placeholder for future weather forecast integration
 * @param {Array} weatherForecast - Array of weather data objects
 * @returns {Array} - Array of recommendation objects
 */
export const calculateForecastRecommendations = (weatherForecast) => {
    if (!Array.isArray(weatherForecast)) {
        console.warn('Weather forecast must be an array');
        return [];
    }

    return weatherForecast.map((weatherData, index) => ({
        day: index,
        ...calculateHydrationRecommendation(weatherData)
    }));
};

/**
 * Calculate hydration progress recommendation
 * Shows how much water user should have consumed by a certain time
 * @param {number} recommendedIntake - Daily recommended intake in ml
 * @param {Date} targetTime - Time to check progress for (default: now)
 * @returns {Object} - Expected consumption at target time
 */
export const getHydrationProgressTarget = (recommendedIntake, targetTime = new Date()) => {
    const hour = targetTime.getHours();
    const wakeUpHour = 7;
    const sleepHour = 23;

    // Calculate active hours in the day
    const activeHours = sleepHour - wakeUpHour;
    const hoursAwake = hour - wakeUpHour;

    if (hoursAwake < 0) {
        return { expected: 0, message: 'Start your day with hydration!' };
    }

    const expectedPercentage = Math.min((hoursAwake / activeHours) * 100, 100);
    const expectedConsumption = Math.round(recommendedIntake * (expectedPercentage / 100));

    return {
        expected: expectedConsumption,
        percentage: Math.round(expectedPercentage),
        message: `By ${targetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, you should have consumed ${expectedConsumption}ml.`
    };
};