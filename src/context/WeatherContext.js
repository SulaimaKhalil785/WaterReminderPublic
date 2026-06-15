/**
 * Weather Context and Provider
 * 
 * Manages weather data, hydration recommendations, and related state
 * throughout the application using React Context API and useReducer.
 * 
 * State Structure:
 * {
 *   weatherData: Object|null - Current weather information,
 *   recommendation: Object|null - Current hydration recommendation,
 *   isLoading: boolean - Loading state for weather fetch,
 *   error: string - Error message if fetch fails,
 *   lastUpdated: Date|null - Timestamp of last weather update,
 *   recommendationAccepted: boolean - Whether user accepted recommendation
 * }
 */

import React, { createContext, useContext, useReducer } from "react";

export const weatherActions = {
    // Fetch and update weather
    fetchWeatherStart: () => ({
        type: 'fetch_weather_start'
    }),
    fetchWeatherSuccess: (payload) => ({
        type: 'fetch_weather_success',
        payload: payload
    }),
    fetchWeatherError: (payload) => ({
        type: 'fetch_weather_error',
        payload: payload
    }),
    
    // Update recommendation
    updateRecommendation: (payload) => ({
        type: 'update_recommendation',
        payload: payload
    }),
    acceptRecommendation: (payload) => ({
        type: 'accept_recommendation',
        payload: payload
    }),
    dismissRecommendation: () => ({
        type: 'dismiss_recommendation'
    }),
    
    // Clear state
    clearWeatherData: () => ({
        type: 'clear_weather_data'
    }),
    
    // Set location preference
    setLocation: (payload) => ({
        type: 'set_location',
        payload: payload
    })
};

const weatherReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_weather_start':
            return {
                ...state,
                isLoading: true,
                error: null
            };
        
        case 'fetch_weather_success':
            return {
                ...state,
                weatherData: action.payload,
                isLoading: false,
                error: null,
                lastUpdated: new Date()
            };
        
        case 'fetch_weather_error':
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                weatherData: null
            };
        
        case 'update_recommendation':
            if (
                state.recommendation?.currentGoal === action.payload?.currentGoal &&
                state.recommendation?.temperature === action.payload?.temperature
            ) {
                return state;
            }

            return {
                ...state,
                recommendation: action.payload
            };
        
        case 'accept_recommendation':
            return {
                ...state,
                recommendationAccepted: true,
                lastAcceptedRecommendation: action.payload,
                lastAcceptedTime: new Date()
            };
        
        case 'dismiss_recommendation':
            return {
                ...state,
                recommendationAccepted: false,
                recommendationDismissed: true
            };
        
        case 'clear_weather_data':
            return {
                ...initialState
            };
        
        case 'set_location':
            return {
                ...state,
                location: action.payload
            };
        
        default:
            return state;
    }
};

const initialState = {
    weatherData: null,
    recommendation: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
    recommendationAccepted: false,
    recommendationDismissed: false,
    lastAcceptedRecommendation: null,
    lastAcceptedTime: null,
    location: null
};

const WeatherContext = createContext(undefined);
const WeatherDispatchContext = createContext(undefined);

/**
 * WeatherProvider Component
 * Wraps the application and provides weather state and dispatch to all children
 * @param {Object} props - React component props
 * @param {React.ReactNode} props.children - Child components
 */
const WeatherProvider = ({ children }) => {
    const [state, dispatch] = useReducer(weatherReducer, initialState);

    return (
        <WeatherContext.Provider value={state}>
            <WeatherDispatchContext.Provider value={dispatch}>
                {children}
            </WeatherDispatchContext.Provider>
        </WeatherContext.Provider>
    );
};

/**
 * Hook to use Weather Context
 * Returns [state, dispatch] tuple
 * 
 * Usage:
 * const [weatherState, weatherDispatch] = useWeatherContext();
 * 
 * @returns {Array} - [state, dispatch] tuple
 * @throws {Error} - If used outside WeatherProvider
 */
const useWeatherContext = () => {
    const state = useContext(WeatherContext);
    const dispatch = useContext(WeatherDispatchContext);
    
    if (state === undefined || dispatch === undefined) {
        throw new Error('useWeatherContext must be used within a WeatherProvider');
    }
    
    return [state, dispatch];
};

export { WeatherProvider, useWeatherContext };
