/**
 * Hydration Thresholds and Recommendation Constants
 * 
 * These constants define temperature ranges and corresponding water intake recommendations
 * for the Smart Hydration Recommendation feature.
 * 
 * Temperature ranges are in Celsius:
 * - Cold: Below 10°C
 * - Cool: 10-15°C
 * - Moderate: 15-25°C
 * - Warm: 25-30°C
 * - Hot: Above 30°C
 */

export const TEMPERATURE_RANGES = {
    COLD: { min: -Infinity, max: 10, label: 'Cold' },
    COOL: { min: 10, max: 15, label: 'Cool' },
    MODERATE: { min: 15, max: 25, label: 'Moderate' },
    WARM: { min: 25, max: 35, label: 'Warm' },
    HOT: { min: 35, max: Infinity, label: 'Hot' }
};

/**
 * Base water intake recommendations in milliliters
 * Default (2500ml) is standard for moderate conditions
 */
export const HYDRATION_RECOMMENDATIONS = {
    COLD: 1500,      // Lower activity, less sweating
    COOL: 2000,      // Slightly reduced from normal
    MODERATE: 2500,  // Standard recommendation
    WARM: 3000,      // Increased due to activity and heat
    HOT: 3500        // Significantly increased for hot weather
};

/**
 * Reminder frequency adjustments in minutes
 * Used to adjust how often users receive hydration reminders
 * Default is 60 minutes
 */
export const REMINDER_FREQUENCY = {
    COLD: 120,       // Every 2 hours - less frequent
    COOL: 90,        // Every 1.5 hours
    MODERATE: 60,    // Every 1 hour - standard
    WARM: 45,        // Every 45 minutes
    HOT: 30          // Every 30 minutes - more frequent
};

/**
 * Get hydration recommendation level based on temperature
 * @param {number} temperature - Temperature in Celsius
 * @returns {string} - Recommendation level key (COLD, COOL, MODERATE, WARM, HOT)
 */
export const getHydrationLevel = (temperature) => {
    if (temperature < TEMPERATURE_RANGES.COLD.max) return 'COLD';
    if (temperature < TEMPERATURE_RANGES.COOL.max) return 'COOL';
    if (temperature < TEMPERATURE_RANGES.MODERATE.max) return 'MODERATE';
    if (temperature < TEMPERATURE_RANGES.WARM.max) return 'WARM';
    return 'HOT';
};

/**
 * Get recommended water intake based on temperature
 * @param {number} temperature - Temperature in Celsius
 * @returns {number} - Recommended daily water intake in milliliters
 */
export const getRecommendedIntake = (temperature) => {
    const level = getHydrationLevel(temperature);
    return HYDRATION_RECOMMENDATIONS[level];
};

/**
 * Get reminder frequency based on temperature
 * @param {number} temperature - Temperature in Celsius
 * @returns {number} - Reminder frequency in minutes
 */
export const getReminderFrequency = (temperature) => {
    const level = getHydrationLevel(temperature);
    return REMINDER_FREQUENCY[level];
};

/**
 * Get color indicator based on temperature level
 * @param {number} temperature - Temperature in Celsius
 * @returns {string} - Color code for UI display
 */
export const getTemperatureColor = (temperature) => {
    const level = getHydrationLevel(temperature);
    const colorMap = {
        COLD: '#3FC1C9',      // Cool blue
        COOL: '#4FA3D1',      // Light blue
        MODERATE: '#364F6B',  // Primary dark
        WARM: '#FC9845',      // Orange
        HOT: '#FC5185'        // Red/Pink (tertiary)
    };
    return colorMap[level];
};