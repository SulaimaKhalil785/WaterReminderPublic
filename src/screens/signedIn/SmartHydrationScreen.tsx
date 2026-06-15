import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from '@expo/vector-icons';
import { useAuthContext } from '../../context/AuthContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { useWeatherContext } from '../../context/WeatherContext';
import { colorPalette } from '../../constants/color';
import { getTemperatureColor } from '../../constants/hydrationThresholds';
import { smartHydrationScreenStyle } from '../../styles/styles';
import { getHydrationLevelDetails } from '../../util/HydrationCalculator';
import {
    acceptHydrationRecommendation,
    dismissHydrationRecommendation,
    fetchAndUpdateSmartHydration,
    refreshSmartHydrationIfNeeded,
} from '../../util/SmartHydrationHelper';
import { storeData } from '../../util/StorageHelper';
import moment from 'moment';

const DISMISS_KEY = 'smartHydrationDismissedDate';

const SmartHydrationScreen = ({ navigation }) => {
    const [authState] = useAuthContext();
    const [firebaseState, firebaseDispatch] = useFirebaseContext();
    const [weatherState, weatherDispatch] = useWeatherContext();
    const [isGoalApplying, setIsGoalApplying] = useState(false);
    const [isGoalApplied, setIsGoalApplied] = useState(false);

    const isPremiumUser = Boolean(authState.user?.isPremiumUser);
    const userId = authState.user?.uid;

    const currentGoal = firebaseState.waterGoal?.waterGoal || 2500;

    useEffect(() => {
        if (!isPremiumUser || !userId) {
            return;
        }

        if (!weatherState.recommendationAccepted) {
            refreshSmartHydrationIfNeeded(weatherState, weatherDispatch, currentGoal, { isPremiumUser });
        }
    }, [
        currentGoal,
        weatherState.weatherData,
        weatherState.lastUpdated,
        weatherState.isLoading,
        weatherState.recommendationAccepted,
        weatherDispatch,
        isPremiumUser,
        userId
    ]);

    const handleRetry = useCallback(() => {
        if (!isPremiumUser || !userId) {
            return;
        }

        fetchAndUpdateSmartHydration(weatherDispatch, currentGoal, { isPremiumUser });
    }, [weatherDispatch, currentGoal, isPremiumUser, userId]);

    const handleAccept = useCallback(() => {
        const recommendation = weatherState.recommendation;
        if (!recommendation || !isPremiumUser || !userId || isGoalApplying || isGoalApplied) {
            return;
        }

        setIsGoalApplying(true);

        acceptHydrationRecommendation(
            recommendation,
            firebaseDispatch,
            weatherDispatch,
            userId
        )
            .then(() => {
                setIsGoalApplying(false);
                setIsGoalApplied(true);
                Alert.alert(
                    'Goal Updated!',
                    `Your daily water goal is now ${recommendation.recommendedIntake} ml.\nReminders will notify you every ${recommendation.reminderFrequency} minutes.`,
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            })
            .catch((error) => {
                setIsGoalApplied(false);
                setIsGoalApplying(false);
                Alert.alert(
                    'Update Failed',
                    error?.message || 'Could not update your water goal. Please try again.',
                    [{ text: 'OK' }]
                );
            });
    }, [weatherState.recommendation, isGoalApplying, isGoalApplied, firebaseDispatch, weatherDispatch, userId, navigation]);

    const handleDismiss = useCallback(async () => {
        await dismissHydrationRecommendation(weatherDispatch);
        await storeData(DISMISS_KEY, moment().format('YYYY-MM-DD'));
        navigation.goBack();
    }, [weatherDispatch, navigation]);

    const recommendation = weatherState.recommendation;
    const temperatureColor = recommendation
        ? getTemperatureColor(recommendation.temperature)
        : colorPalette.secondary;
    const levelDetails = recommendation
        ? getHydrationLevelDetails(recommendation.hydrationLevel)
        : null;
    const hasSignificantChange = recommendation
        ? Math.abs(recommendation.percentageChange) >= 20
        : false;

    const isGoalAlreadyApplied = recommendation
        ? currentGoal >= recommendation.recommendedIntake
        : false;

    const isAcceptButtonDisabled =
        isGoalApplying ||
        isGoalApplied ||
        weatherState.recommendationAccepted ||
        isGoalAlreadyApplied;

    if (!isPremiumUser || !userId) {
        return (
            <View style={smartHydrationScreenStyle.container}>
                <View style={smartHydrationScreenStyle.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={smartHydrationScreenStyle.backButton}>
                        <Entypo name="chevron-thin-left" size={30} color={colorPalette.primary} />
                    </TouchableOpacity>
                    <Text style={smartHydrationScreenStyle.headerTitle}>Hydration Insights</Text>
                </View>
                <ScrollView
                    style={smartHydrationScreenStyle.scroll}
                    contentContainerStyle={smartHydrationScreenStyle.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={smartHydrationScreenStyle.premiumLockCard}>
                        <Entypo name="lock" size={48} color={colorPalette.tertiary} />
                        <Text style={smartHydrationScreenStyle.premiumLockTitle}>Premium Feature</Text>
                        <Text style={smartHydrationScreenStyle.premiumLockText}>
                            Smart Hydration Recommendation is available only for Premium users.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={smartHydrationScreenStyle.container}>
            <View style={smartHydrationScreenStyle.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={smartHydrationScreenStyle.backButton}>
                    <Entypo name="chevron-thin-left" size={30} color={colorPalette.primary} />
                </TouchableOpacity>
                <Text style={smartHydrationScreenStyle.headerTitle}>Hydration Insights</Text>
            </View>

            <ScrollView
                style={smartHydrationScreenStyle.scroll}
                contentContainerStyle={smartHydrationScreenStyle.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {weatherState.isLoading && (
                    <View style={smartHydrationScreenStyle.centeredState}>
                        <ActivityIndicator size="large" color={colorPalette.primary} />
                        <Text style={smartHydrationScreenStyle.stateText}>Fetching weather data...</Text>
                    </View>
                )}

                {!weatherState.isLoading && weatherState.error && (
                    <View style={smartHydrationScreenStyle.errorCard}>
                        <Text style={smartHydrationScreenStyle.errorTitle}>Weather Unavailable</Text>
                        <Text style={smartHydrationScreenStyle.errorText}>{weatherState.error}</Text>
                        <Text style={smartHydrationScreenStyle.errorSubtext}>
                            Check your location settings and try again.
                        </Text>
                        <TouchableOpacity style={smartHydrationScreenStyle.retryButton} onPress={handleRetry}>
                            <Text style={smartHydrationScreenStyle.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!weatherState.isLoading && !weatherState.error && recommendation && levelDetails && (
                    <>
                        <View style={[smartHydrationScreenStyle.weatherCard, { borderLeftColor: temperatureColor }]}>
                            <View style={smartHydrationScreenStyle.weatherHeader}>
                                <Text style={smartHydrationScreenStyle.weatherEmoji}>{levelDetails.emoji}</Text>
                                <View style={smartHydrationScreenStyle.weatherHeaderText}>
                                    <Text style={smartHydrationScreenStyle.weatherLocation}>
                                        {recommendation.location}
                                    </Text>
                                    <Text style={smartHydrationScreenStyle.weatherTemp}>
                                        {recommendation.displayTemperature}
                                    </Text>
                                    <Text style={smartHydrationScreenStyle.weatherDesc}>
                                        {recommendation.weatherDescription}
                                    </Text>
                                </View>
                            </View>
                            <View style={smartHydrationScreenStyle.weatherStats}>
                                <View style={smartHydrationScreenStyle.stat}>
                                    <Text style={smartHydrationScreenStyle.statLabel}>Humidity</Text>
                                    <Text style={smartHydrationScreenStyle.statValue}>{recommendation.humidity}%</Text>
                                </View>
                                <View style={smartHydrationScreenStyle.stat}>
                                    <Text style={smartHydrationScreenStyle.statLabel}>Feels Like</Text>
                                    <Text style={smartHydrationScreenStyle.statValue}>{recommendation.feelsLike}°C</Text>
                                </View>
                                <View style={smartHydrationScreenStyle.stat}>
                                    <Text style={smartHydrationScreenStyle.statLabel}>Reminder</Text>
                                    <Text style={smartHydrationScreenStyle.statValue}>
                                        Every {recommendation.reminderFrequency}m
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={smartHydrationScreenStyle.section}>
                            <Text style={smartHydrationScreenStyle.sectionTitle}>Recommended Intake</Text>
                            <View style={smartHydrationScreenStyle.intakeRow}>
                                <View style={smartHydrationScreenStyle.intakeBlock}>
                                    <Text style={smartHydrationScreenStyle.intakeLabel}>Current Goal</Text>
                                    <Text style={smartHydrationScreenStyle.intakeValue}>
                                        {recommendation.currentGoal} ml
                                    </Text>
                                </View>
                                <Text style={smartHydrationScreenStyle.intakeArrow}>→</Text>
                                <View style={smartHydrationScreenStyle.intakeBlock}>
                                    <Text style={smartHydrationScreenStyle.intakeLabel}>Recommended</Text>
                                    <Text style={[smartHydrationScreenStyle.intakeValue, { color: temperatureColor }]}>
                                        {recommendation.recommendedIntake} ml
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={smartHydrationScreenStyle.section}>
                            <Text style={smartHydrationScreenStyle.sectionTitle}>Why this recommendation?</Text>
                            <Text style={smartHydrationScreenStyle.message}>{recommendation.message}</Text>
                        </View>

                        {hasSignificantChange && levelDetails && levelDetails.tips && (
                            <View style={smartHydrationScreenStyle.tipsCard}>
                                <Text style={smartHydrationScreenStyle.tipsTitle}>Tips for {levelDetails.label}</Text>
                                {levelDetails.tips.slice(0, 3).map((tip, index) => (
                                    <Text key={index} style={smartHydrationScreenStyle.tip}>• {tip}</Text>
                                ))}
                            </View>
                        )}

                        <View style={smartHydrationScreenStyle.actions}>
                            <TouchableOpacity
                                style={smartHydrationScreenStyle.dismissButton}
                                onPress={handleDismiss}
                                disabled={isGoalApplying || isGoalApplied}
                            >
                                <Text style={smartHydrationScreenStyle.dismissButtonText}>Not Now</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    smartHydrationScreenStyle.applyButton,
                                    { backgroundColor: temperatureColor },
                                    isAcceptButtonDisabled && smartHydrationScreenStyle.buttonDisabled,
                                ]}
                                onPress={() => !isAcceptButtonDisabled && handleAccept()}
                                disabled={isAcceptButtonDisabled}
                            >
                                {isGoalApplying ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={smartHydrationScreenStyle.applyButtonText}>
                                        {weatherState.recommendationAccepted || isGoalAlreadyApplied
                                            ? 'Goal Current'
                                            : 'Apply Recommendation'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
        </SafeAreaView>
    );
};

export default SmartHydrationScreen;
