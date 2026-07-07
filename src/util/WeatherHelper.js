/**
 * Weather Helper Utility
 * 
 * This utility handles fetching weather data from OpenWeatherMap API
 * and provides methods to get weather information based on location coordinates
 * or location name.
 */

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

const getEnvWeatherKey = () => {
    try {
        const env = (typeof window !== 'undefined' ? window : global)?.process?.env;
        if (env && env.WEATHER_API_KEY) {
            return env.WEATHER_API_KEY;
        }
    } catch (e) {
        // Ignore
    }
    return '';
};

const OPENWEATHER_API_KEY =
    Constants.expoConfig?.extra?.weatherApiKey ||
    getEnvWeatherKey();
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const REQUEST_TIMEOUT_MS = 12000;
const DEFAULT_LOCATION = { latitude: 30.1575, longitude: 71.5249 };

const withTimeout = (promise, timeoutMessage) => {
    let timeoutId;

    const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), REQUEST_TIMEOUT_MS);
    });

    return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
};

/**
 * Fetch weather data by geographic coordinates
 */
export const fetchWeatherByCoordinates = async (latitude, longitude) => {
    try {
        if (!OPENWEATHER_API_KEY) {
            console.warn('Weather API key not configured.');
            return null;
        }

        const url = `${OPENWEATHER_BASE_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`;
        const response = await withTimeout(
            fetch(url),
            'Weather request timed out. Please check your internet connection.'
        );

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            location: data.name,
            country: data.sys.country,
            timestamp: new Date()
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
};

/**
 * Check if weather data is stale (older than 1 hour)
 */
export const isWeatherDataStale = (lastUpdated) => {
    if (!lastUpdated) return true;
    const now = new Date();
    const lastUpdateDate = new Date(lastUpdated);
    const diffInHours = (now - lastUpdateDate) / (1000 * 60 * 60);
    return diffInHours > 1;
};

/**
 * Fetch weather for device's current location
 */
export const fetchWeatherForCurrentLocation = async () => {
    try {
        const location = await getDeviceLocation();
        return await fetchWeatherByCoordinates(location.latitude, location.longitude);
    } catch (error) {
        console.error('Error fetching weather for current location:', error);
        throw error;
    }
};

/**
 * Get device location using expo-location (native) or navigator (web fallback)
 */
export const getDeviceLocation = async () => {
    if (Platform.OS === 'web') {
        return getWebLocation();
    }

    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Location permission denied.');
        }

        const position = await withTimeout(
            Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            }),
            'Location request timed out.'
        );

        return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };
    } catch (e) {
        // Fallback to mock coordinates for Multan if location fails
        return DEFAULT_LOCATION;
    }
};

const getWebLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            resolve(DEFAULT_LOCATION); // Default to Multan
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                resolve(DEFAULT_LOCATION); // Default to Multan
            }
        );
    });
};

/**
 * Mock weather data for development/testing
 */
let mockTemp = 37;

export const setMockTemperature = (temp) => {
    mockTemp = temp;
};

const getMockWeatherData = () => {
    const isCold = mockTemp < 15;
    return {
        temperature: mockTemp,
        feelsLike: mockTemp - 1,
        humidity: isCold ? 45 : 23,
        description: isCold ? 'Clear Sky' : 'Scattered Clouds',
        icon: isCold ? '13d' : '01d',
        location: isCold ? 'Murree' : 'Multan',
        country: 'PK',
        timestamp: new Date(),
        isMocked: true
    };
};
