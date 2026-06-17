import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
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
    const { width } = useWindowDimensions();
    const isWide = width > 768;

    const [authState] = useAuthContext();
    const [firebaseState, firebaseDispatch] = useFirebaseContext();
    const [weatherState, weatherDispatch] = useWeatherContext();
    const [isGoalApplying, setIsGoalApplying] = useState(false);
    const [isGoalApplied, setIsGoalApplied] = useState(false);

    const isPremiumUser = Boolean(authState.user?.isPremiumUser);
    const userId = authState.user?.uid;

    const currentGoal = firebaseState.waterGoal?.waterGoal || 2500;
    const navigateHome = useCallback(() => {
        navigation.getParent()?.navigate('home');
    }, [navigation]);

    useEffect(() => {
        if (isPremiumUser && userId && !weatherState.recommendationAccepted) {
            refreshSmartHydrationIfNeeded(weatherState, weatherDispatch, currentGoal);
        }
    }, [isPremiumUser, userId, currentGoal]); // Removed weatherState to prevent infinite loops

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
                    `Your daily water goal is now ${recommendation.recommendedIntake} ml.`,
                    [{ text: 'OK', onPress: navigateHome }]
                );
            })
            .catch((error) => {
                setIsGoalApplied(false);
                setIsGoalApplying(false);
                Alert.alert('Update Failed', error?.message || 'Could not update goal.');
            });
    }, [weatherState.recommendation, isGoalApplying, isGoalApplied, firebaseDispatch, weatherDispatch, userId, navigateHome, isPremiumUser]);

    const handleDismiss = useCallback(async () => {
        await dismissHydrationRecommendation(weatherDispatch);
        await storeData(DISMISS_KEY, moment().format('YYYY-MM-DD'));
        navigateHome();
    }, [weatherDispatch, navigateHome]);

    const recommendation = weatherState.recommendation;
    const temperatureColor = recommendation
        ? getTemperatureColor(recommendation.temperature)
        : colorPalette.secondary;
    const levelDetails = recommendation
        ? getHydrationLevelDetails(recommendation.hydrationLevel)
        : null;

    const isGoalAlreadyApplied = recommendation
        ? currentGoal === recommendation.recommendedIntake
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
                    <TouchableOpacity onPress={navigateHome} style={smartHydrationScreenStyle.backButton}>
                        <Entypo name="chevron-left" size={32} color={colorPalette.primary} />
                    </TouchableOpacity>
                    <Text style={smartHydrationScreenStyle.headerTitle}>Hydration Insights</Text>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={smartHydrationScreenStyle.scrollContent}
                >
                    <View style={smartHydrationScreenStyle.premiumLockCard}>
                        <Entypo name="lock" size={60} color="#FC5185" />
                        <Text style={smartHydrationScreenStyle.premiumLockTitle}>Premium Feature</Text>
                        <Text style={smartHydrationScreenStyle.premiumLockText}>
                            Smart Hydration Recommendations are available only for Premium users.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={smartHydrationScreenStyle.container}>
            <View style={smartHydrationScreenStyle.header}>
                <TouchableOpacity onPress={navigateHome} style={smartHydrationScreenStyle.backButton}>
                    <Entypo name="chevron-left" size={32} color="#364F6B" />
                </TouchableOpacity>
                <Text style={smartHydrationScreenStyle.headerTitle}>Hydration Insights</Text>
            </View>

            <ScrollView
                style={smartHydrationScreenStyle.scroll}
                contentContainerStyle={[
                    smartHydrationScreenStyle.scrollContent,
                    isWide && { paddingHorizontal: '10%', maxWidth: 1200 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                {weatherState.isLoading && (
                    <View style={{paddingVertical: 100, alignItems: 'center'}}>
                        <ActivityIndicator size="large" color="#364F6B" />
                        <Text style={{marginTop: 10, color: '#364F6B'}}>Fetching local weather...</Text>
                    </View>
                )}

                {!weatherState.isLoading && weatherState.error && (
                    <View style={smartHydrationScreenStyle.errorCard}>
                        <Text style={smartHydrationScreenStyle.errorTitle}>Weather Unavailable</Text>
                        <Text style={smartHydrationScreenStyle.errorText}>{weatherState.error}</Text>
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
                                    <Text style={smartHydrationScreenStyle.weatherLocation}>{recommendation.location}</Text>
                                    <Text style={smartHydrationScreenStyle.weatherTemp}>{recommendation.displayTemperature}</Text>
                                    <Text style={smartHydrationScreenStyle.weatherDesc}>{recommendation.weatherDescription}</Text>
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
                                    <Text style={smartHydrationScreenStyle.statValue}>Every {recommendation.reminderFrequency}m</Text>
                                </View>
                            </View>
                        </View>

                        <View style={smartHydrationScreenStyle.section}>
                            <Text style={smartHydrationScreenStyle.sectionTitle}>Recommended Intake</Text>
                            <View style={smartHydrationScreenStyle.intakeRow}>
                                <View style={smartHydrationScreenStyle.intakeBlock}>
                                    <Text style={smartHydrationScreenStyle.intakeLabel}>Current Goal</Text>
                                    <Text style={smartHydrationScreenStyle.intakeValue}>{recommendation.currentGoal} ml</Text>
                                </View>
                                <Text style={smartHydrationScreenStyle.intakeArrow}>→</Text>
                                <View style={smartHydrationScreenStyle.intakeBlock}>
                                    <Text style={smartHydrationScreenStyle.intakeLabel}>Recommended</Text>
                                    <Text style={[smartHydrationScreenStyle.intakeValue, { color: '#FC5185' }]}>{recommendation.recommendedIntake} ml</Text>
                                </View>
                            </View>
                        </View>

                        <View style={smartHydrationScreenStyle.section}>
                            <Text style={smartHydrationScreenStyle.sectionTitle}>Why this recommendation?</Text>
                            <Text style={smartHydrationScreenStyle.message}>
                                <Text style={{fontSize: 16}}>{levelDetails.emoji}</Text> {recommendation.message}
                            </Text>
                        </View>

                        <View style={smartHydrationScreenStyle.tipsCard}>
                            <Text style={smartHydrationScreenStyle.tipsTitle}>Tips for {levelDetails.label}</Text>
                            {levelDetails.tips.map((tip, index) => (
                                <Text key={index} style={smartHydrationScreenStyle.tip}>• {tip}</Text>
                            ))}
                        </View>

                        <View style={[smartHydrationScreenStyle.actions, isWide && { marginBottom: 50 }]}>
                            <TouchableOpacity
                                style={smartHydrationScreenStyle.dismissButton}
                                onPress={handleDismiss}
                            >
                                <Text style={smartHydrationScreenStyle.dismissButtonText}>Not Now</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    smartHydrationScreenStyle.applyButton,
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
    );
};

export default SmartHydrationScreen;
