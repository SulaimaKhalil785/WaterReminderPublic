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
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from '@expo/vector-icons';
import { useAuthContext } from '../../context/AuthContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { useWeatherContext } from '../../context/WeatherContext';
import { fetchWaterGoal } from '../../util/FirebaseHelper';
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

import SuccessModal from '../../components/SuccessModal';

const DISMISS_KEY = 'smartHydrationDismissedDate';

const SmartHydrationScreen = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const isWide = width > 768;
    const isSmall = width < 380;

    const [authState] = useAuthContext();
    const [firebaseState, firebaseDispatch] = useFirebaseContext();
    const [weatherState, weatherDispatch] = useWeatherContext();
    const [isGoalApplying, setIsGoalApplying] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const isPremiumUser = Boolean(authState.user?.isPremiumUser);
    const userId = authState.user?.uid;

    const currentGoal = Number(firebaseState.waterGoal?.waterGoal) || 0;
    const recommendation = weatherState.recommendation;
    const isGoalAlreadyApplied = recommendation
        ? currentGoal === recommendation.recommendedIntake
        : false;

    const navigateHome = useCallback(() => {
        navigation.getParent()?.navigate('home');
    }, [navigation]);

    useEffect(() => {
        if (!userId) {
            return undefined;
        }

        return fetchWaterGoal(firebaseDispatch, userId);
    }, [firebaseDispatch, userId]);

    useEffect(() => {
        if (isPremiumUser && userId) {
            refreshSmartHydrationIfNeeded(weatherState, weatherDispatch, currentGoal, isPremiumUser);
        }
    }, [isPremiumUser, userId, currentGoal, weatherState, weatherDispatch]);

    const handleRetry = useCallback(() => {
        if (!isPremiumUser || !userId) {
            return;
        }
        fetchAndUpdateSmartHydration(weatherDispatch, currentGoal, { isPremiumUser });
    }, [weatherDispatch, currentGoal, isPremiumUser, userId]);

    const handleAccept = useCallback(() => {
        if (!recommendation || !isPremiumUser || !userId || isGoalApplying || isGoalAlreadyApplied) {
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
                setShowSuccessModal(true);
            })
            .catch((error) => {
                setIsGoalApplying(false);
                Alert.alert('Update Failed', error?.message || 'Could not update goal.');
            });
    }, [recommendation, isGoalApplying, isGoalAlreadyApplied, firebaseDispatch, weatherDispatch, userId, navigateHome, isPremiumUser]);

    const handleDismiss = useCallback(async () => {
        await dismissHydrationRecommendation(weatherDispatch);
        await storeData(DISMISS_KEY, moment().format('YYYY-MM-DD'));
        navigateHome();
    }, [weatherDispatch, navigateHome]);

    const temperatureColor = recommendation
        ? getTemperatureColor(recommendation.temperature)
        : colorPalette.secondary;
    const levelDetails = recommendation
        ? getHydrationLevelDetails(recommendation.hydrationLevel)
        : null;

    const isAcceptButtonDisabled =
        isGoalApplying ||
        isGoalAlreadyApplied;

    if (!isPremiumUser || !userId) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
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
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                        isWide && { maxWidth: 1000 }
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {weatherState.isLoading && (
                        <View style={smartHydrationScreenStyle.loadingState}>
                            <ActivityIndicator size="large" color="#364F6B" />
                            <Text style={smartHydrationScreenStyle.loadingText}>Fetching local weather...</Text>
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
                                <View style={[
                                    smartHydrationScreenStyle.intakeRow,
                                    isSmall && { flexDirection: 'column' }
                                ]}>
                                    <View style={[
                                        smartHydrationScreenStyle.intakeBlock,
                                        isSmall && { flex: 0, marginVertical: 4 }
                                    ]}>
                                        <Text style={smartHydrationScreenStyle.intakeLabel} numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75 }>Current Goal</Text>
                                        <Text style={smartHydrationScreenStyle.intakeValue} numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75 }>{recommendation.currentGoal} ml</Text>
                                    </View>
                                    <Text style={[
                                        smartHydrationScreenStyle.intakeArrow,
                                        isSmall && { marginVertical: 8, marginHorizontal: 0 }
                                    ]}>
                                        {isSmall ? '↓' : '→'}
                                    </Text>
                                    <View style={[
                                        smartHydrationScreenStyle.intakeBlock,
                                        isSmall && { flex: 0, marginVertical: 4 }
                                    ]}>
                                        <Text style={smartHydrationScreenStyle.intakeLabel} numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75}>Recommended</Text>
                                        <Text style={[smartHydrationScreenStyle.intakeValue, { color: '#FC5185' }]} numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75}>{recommendation.recommendedIntake} ml</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={smartHydrationScreenStyle.section}>
                                <Text style={smartHydrationScreenStyle.sectionTitle}>Why this recommendation?</Text>
                                <Text style={smartHydrationScreenStyle.message}>
                                    <Text style={{ fontSize: 16 }}>{levelDetails.emoji}</Text> {recommendation.message}
                                </Text>
                            </View>

                            <View style={smartHydrationScreenStyle.tipsCard}>
                                <Text style={smartHydrationScreenStyle.tipsTitle}>Tips for {levelDetails.label}</Text>
                                {levelDetails.tips.map((tip, index) => (
                                    <Text key={index} style={smartHydrationScreenStyle.tip}>• {tip}</Text>
                                ))}
                            </View>

                            <View style={[
                                smartHydrationScreenStyle.actions,
                                isWide && { marginBottom: 50 },
                                isSmall && { flexDirection: 'column-reverse' }
                            ]}>
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
                                            {isGoalAlreadyApplied
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

            <SuccessModal
                visible={showSuccessModal}
                message={`Your daily water goal is now ${recommendation?.recommendedIntake} ml.`}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigateHome();
                }}
            />
        </SafeAreaView>
    );
};

export default SmartHydrationScreen;
