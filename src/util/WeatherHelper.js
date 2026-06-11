/**
 * Weather Helper Utility
 * 
 * This utility handles fetching weather data from OpenWeatherMap API
 * and provides methods to get weather information based on location coordinates
 * or location name.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get a free API key from https://openweathermap.org/api
 * 2. Add weatherApiKey to app.json under expo.extra
 * 3. Or set WEATHER_API_KEY in your environment
 * 
 * Without an API key, mock data is used for development.
 */

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

const OPENWEATHER_API_KEY =
    Constants.expoConfig?.extra?.weatherApiKey ||
    process.env.WEATHER_API_KEY ||
    '';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetch weather data by geographic coordinates
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object>} - Weather data object with temperature, description, etc.
 * @throws {Error} - If API call fails or API key is not configured
 */
export const fetchWeatherByCoordinates = async (latitude, longitude) => {
    try {
        if (!OPENWEATHER_API_KEY) {
            console.warn('Weather API key not configured. Using mock data.');
            return getMockWeatherData();
        }

        const url = `${OPENWEATHER_BASE_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`;
        const response = await fetch(url);

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
 * Fetch weather data by city name
 * @param {string} cityName - City name (e.g., "London", "New York")
 * @returns {Promise<Object>} - Weather data object
 * @throws {Error} - If city not found or API fails
 */
export const fetchWeatherByCity = async (cityName) => {
    try {
        if (!OPENWEATHER_API_KEY) {
            console.warn('Weather API key not configured. Using mock data.');
            return getMockWeatherData();
        }

        const url = `${OPENWEATHER_BASE_URL}?q=${cityName}&units=metric&appid=${OPENWEATHER_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City "${cityName}" not found`);
            }
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
        console.error('Error fetching weather by city:', error);
        throw new Error(`Failed to fetch weather for "${cityName}": ${error.message}`);
    }
};

/**
 * Get device location using expo-location (native) or navigator (web fallback)
 * @returns {Promise<Object>} - Object with latitude and longitude
 * @throws {Error} - If geolocation is not available or denied
 */
export const getDeviceLocation = async () => {
    if (Platform.OS === 'web') {
        return getWebLocation();
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        throw new Error('Location permission denied. Enable location access to get weather-based recommendations.');
    }

    const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
    });

    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    };
};

const getWebLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported on this device'));
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
                reject(new Error(`Geolocation error: ${error.message}`));
            }
        );
    });
};

/**
 * Fetch weather for device's current location
 * @returns {Promise<Object>} - Weather data for current location
 * @throws {Error} - If location cannot be determined or API fails
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
 * Mock weather data for development/testing
 * Returns realistic weather data for testing without API key
 * 
 * @returns {Object} - Mock weather object
 */
const getMockWeatherData = () => {
    const temperatures = [5, 12, 18, 28, 35]; // Various temperature ranges
    const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
    const descriptions = ['Clear sky', 'Partly cloudy', 'Overcast', 'Light rain', 'Sunny'];
    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];

    return {
        temperature: randomTemp,
        feelsLike: randomTemp - 2,
        humidity: Math.floor(Math.random() * 40 + 40),
        description: randomDesc,
        icon: '01d',
        location: 'Mock City',
        country: 'XX',
        timestamp: new Date(),
        isMocked: true
    };
};

/**
 * Check if weather data is stale (older than specified minutes)
 * @param {Date} timestamp - Timestamp of weather data
 * @param {number} maxAgeMinutes - Maximum age in minutes (default: 30)
 * @returns {boolean} - True if data is stale
 */
export const isWeatherDataStale = (timestamp, maxAgeMinutes = 30) => {
    if (!timestamp) return true;
    const ageInMinutes = (new Date() - new Date(timestamp)) / 1000 / 60;
    return ageInMinutes > maxAgeMinutes;
};

/**
 * Format weather data for display
 * @param {Object} weatherData - Weather data object from API
 * @returns {Object} - Formatted weather data with display strings
 */
export const formatWeatherForDisplay = (weatherData) => {
    return {
        ...weatherData,
        displayTemperature: `${weatherData.temperature}°C`,
        displayLocation: `${weatherData.location}, ${weatherData.country}`,
        displayDescription: weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1)
    };
};
