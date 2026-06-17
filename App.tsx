import * as React from 'react';
import {AuthProvider} from "./src/context/AuthContext";
import {FirebaseProvider} from "./src/context/FirebaseContext";
import {WeatherProvider} from "./src/context/WeatherContext";
import AppNavigationContext from "./src/AppNavigationContext";

export default function App() {
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
