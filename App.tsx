import * as React from 'react';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from "./src/context/AuthContext";
import { FirebaseProvider } from "./src/context/FirebaseContext";
import AppNavigationContext from "./src/AppNavigationContext";
import { WeatherProvider } from './src/context/WeatherContext';

// Keep the splash screen visible
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
    useEffect(() => {
        SplashScreen.hideAsync().catch(() => {});
    }, []);

    return (
        <AuthProvider>
            <FirebaseProvider>
                <WeatherProvider>
                    <AppNavigationContext/>
                </WeatherProvider>
            </FirebaseProvider>
        </AuthProvider>
    );
}
