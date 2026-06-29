import * as React from 'react';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressCircle from 'react-native-progress/Circle';
import { useAuthContext } from "../../context/AuthContext";
import { useFirebaseContext } from "../../context/FirebaseContext";
import { useWeatherContext } from "../../context/WeatherContext";
import { fetchWaterGoal, fetchWaterRecords, saveWaterRecord, saveGoalReached } from "../../util/FirebaseHelper";
import AddWaterButton from "../../components/AddWaterButton";
import CelebrationModal from "../../components/CelebrationModal";
import { colorPalette } from "../../constants/color";
import { commonStyle, homeStyle, smartHydrationSummaryStyle } from "../../styles/styles";
import { getData, storeData } from "../../util/StorageHelper";
import moment from "moment";
import WaterHistoryList from "../../components/WaterHistoryList";
import { Ionicons } from "@expo/vector-icons";
import { getHydrationLevelDetails } from "../../util/HydrationCalculator";
import { isWeatherDataStale, refreshSmartHydrationIfNeeded } from "../../util/SmartHydrationHelper";

const HomeScreen = ({ navigation }) => {
    const [authState] = useAuthContext();
    const [state, dispatch] = useFirebaseContext();
    const [weatherState, weatherDispatch] = useWeatherContext();
    const [progress, setProgress] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [hasCelebratedToday, setHasCelebratedToday] = useState(true);
    const [totalConsumed, setTotalConsumed] = useState(0);
    const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));

    const isPremiumUser = Boolean(authState.user?.isPremiumUser);
    const userId = authState.user?.uid;
    const currentGoal = Number(state.waterGoal?.waterGoal) || 0;

    useEffect(() => {
        if (!userId) {
            return;
        }

        const unsubscribeWaterRecords = fetchWaterRecords(dispatch, userId, currentDate);
        const unsubscribeWaterGoal = fetchWaterGoal(dispatch, userId);

        return () => {
            unsubscribeWaterRecords();
            unsubscribeWaterGoal();
        };
    }, [dispatch, userId, currentDate]);

    useEffect(() => {
        const interval = setInterval(() => {
            const today = moment().format("YYYY-MM-DD");
            setCurrentDate(previousDate => previousDate === today ? previousDate : today);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkCelebrationStatus = async () => {
            try {
                const lastCelebrated = await getData("lastCelebratedDate");
                if (lastCelebrated === currentDate) {
                    setHasCelebratedToday(true);
                } else {
                    setHasCelebratedToday(false);
                }
            } catch (e) {
                console.warn("Failed to check lastCelebratedDate:", e);
                setHasCelebratedToday(false);
            }
        };
        if (userId) {
            checkCelebrationStatus();
        }
    }, [userId, currentDate]);

    useEffect(() => {
        if (!isPremiumUser) {
            return;
        }

        const normalizedGoal = Number(currentGoal) || 0;
        const recommendation = weatherState.recommendation;

        if (
            weatherState.weatherData &&
            recommendation &&
            Number(recommendation.currentGoal) === normalizedGoal &&
            !isWeatherDataStale(weatherState.lastUpdated)
        ) {
            return;
        }

        refreshSmartHydrationIfNeeded(weatherState, weatherDispatch, normalizedGoal, isPremiumUser);
    }, [isPremiumUser, currentGoal, weatherState.lastUpdated, weatherDispatch]);

    useEffect(() => {
        calculateCircle();
    }, [state.dailyWaterRecord, state.waterGoal, hasCelebratedToday]);

    const calculateCircle = () => {
        if (state.dailyWaterRecord == undefined || state.waterGoal == undefined) {
            setProgress(0);
            setTotalConsumed(0);
        } else {
            const dailyWaterSizeRecord = state.dailyWaterRecord.map(waterRecord => Number(waterRecord.data.size.substring(0, 3)));
            const waterRecord = dailyWaterSizeRecord.reduce((a, b) => a + b, 0);
            setTotalConsumed(waterRecord);

            const goalVal = state.waterGoal.waterGoal;
            if (goalVal <= 0) {
                setProgress(0);
                return;
            }

            if (waterRecord >= goalVal) {
                setProgress(1);
                updateGoalHistory();

                if (goalVal > 0 && !hasCelebratedToday) {
                    storeData("lastCelebratedDate", currentDate);
                    setHasCelebratedToday(true);
                    setShowCelebration(true);
                }
            } else {
                setProgress(waterRecord / goalVal);
            }
        }
    }

    const updateGoalHistory = () => {
        const today = currentDate;

        // 1. Save to Firebase (New Persistent way)
        saveGoalReached(userId, today).catch(e => console.warn("Failed to save goal to firebase:", e));

        // 2. Keep Local Storage for fallback/offline
        getData("goalHistory").then(res => {
            if (!res) {
                const goalHistory = [today];
                storeData("goalHistory", JSON.stringify(goalHistory));
            } else if (!JSON.parse(res).includes(today)) {
                const goalHistory = [...JSON.parse(res), today];
                storeData("goalHistory", JSON.stringify(goalHistory));
            }
        });
    }

    const renderSmartHydrationCard = () => {
        const recommendation = weatherState.recommendation;
        const emoji = (recommendation && isPremiumUser) ? getHydrationLevelDetails(recommendation.hydrationLevel).emoji : '✨';
        const styles = smartHydrationSummaryStyle || {};

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('calendar', { screen: 'smartHydration' })}
            >
                <View style={styles.cardInfo}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>
                            {emoji} Smart Hydration
                        </Text>
                        {!isPremiumUser && (
                            <View style={styles.premiumBadge}>
                                <Text style={styles.premiumText}>PREMIUM</Text>
                            </View>
                        )}
                    </View>

                    {weatherState.isLoading ? (
                        <Text style={styles.subtitle}>Fetching insights...</Text>
                    ) : (recommendation && isPremiumUser) ? (
                        <Text style={styles.subtitle}>
                            {recommendation.displayTemperature} - {recommendation.recommendedIntake} ml recommended · {recommendation.goalDifference > 0 ? '+' : ''}{recommendation.goalDifference} ml
                        </Text>
                    ) : (
                        <Text style={styles.subtitle}>
                            {isPremiumUser
                                ? "Tap to see today's hydration insights"
                                : "Get AI-powered water goals based on weather"}
                        </Text>
                    )}
                </View>
                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        );
    }

    const renderHydrationFeedback = () => {
        if (currentGoal <= 0 || totalConsumed < currentGoal) {
            return null;
        }

        const ratio = totalConsumed / currentGoal;
        let cardStyle = localStyles.feedbackCaseA;
        let text1Style = localStyles.feedbackCaseAText1;
        let text2Style = localStyles.feedbackCaseAText2;
        let text1 = "✅ You have reached today's hydration goal.";
        let text2 = "Maintain hydration based on thirst and activity level.";

        if (totalConsumed === currentGoal) {
            text1 = "✅ You have reached today's hydration goal.";
            text2 = "Maintain hydration based on thirst and activity level.";
            cardStyle = localStyles.feedbackCaseA;
            text1Style = localStyles.feedbackCaseAText1;
            text2Style = localStyles.feedbackCaseAText2;
        } else if (ratio <= 1.20) {
            text1 = "💧 Great hydration!";
            text2 = "You are slightly above today's goal and still within a healthy range.";
            cardStyle = localStyles.feedbackCaseB;
            text1Style = localStyles.feedbackCaseBText1;
            text2Style = localStyles.feedbackCaseBText2;
        } else {
            text1 = "⚠️ You have exceeded your hydration goal significantly.";
            text2 = "Unless you are exercising heavily, in extreme heat, or advised by a healthcare professional, avoid forcing additional water intake.\n\nMonitor hydration naturally and avoid excessive consumption.";
            cardStyle = localStyles.feedbackCaseC;
            text1Style = localStyles.feedbackCaseCText1;
            text2Style = localStyles.feedbackCaseCText2;
        }

        return (
            <View style={[localStyles.feedbackCard, cardStyle]}>
                <Text style={text1Style}>{text1}</Text>
                <Text style={text2Style}>{text2}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colorPalette.background }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={[homeStyle.container, localStyles.mainContainer]}>
                    <Text style={commonStyle.header}>
                        Water Reminder
                    </Text>

                    <View style={homeStyle.progress}>
                        <ProgressCircle
                            size={200}
                            progress={progress}
                            showsText
                            color={colorPalette.primary}
                            thickness={12}
                        />
                    </View>

                    {renderSmartHydrationCard()}
                    {renderHydrationFeedback()}

                    <WaterHistoryList dailyWaterRecord={state.dailyWaterRecord} />
                </View>
            </ScrollView>

            <AddWaterButton dispatch={dispatch} action={saveWaterRecord} userId={userId} />

            <CelebrationModal
                visible={showCelebration}
                onClose={() => setShowCelebration(false)}
                onViewInsights={() => {
                    setShowCelebration(false);
                    navigation.navigate('calendar', { screen: 'smartHydration' });
                }}
                consumed={totalConsumed}
                goal={currentGoal}
            />
        </SafeAreaView>
    );
};

const localStyles = StyleSheet.create({
    mainContainer: {
        paddingBottom: 100,
        alignSelf: 'stretch',
    },
    feedbackCard: {
        padding: 16,
        marginHorizontal: 18,
        borderRadius: 16,
        marginTop: 4,
        marginBottom: 10,
        borderWidth: 1,
        alignSelf: 'stretch',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    feedbackCaseA: {
        backgroundColor: '#E8F5E9',
        borderColor: '#C8E6C9',
    },
    feedbackCaseAText1: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 6,
    },
    feedbackCaseAText2: {
        fontSize: 13,
        color: '#388E3C',
        lineHeight: 18,
    },
    feedbackCaseB: {
        backgroundColor: '#E3F2FD',
        borderColor: '#BBDEFB',
    },
    feedbackCaseBText1: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1565C0',
        marginBottom: 6,
    },
    feedbackCaseBText2: {
        fontSize: 13,
        color: '#1976D2',
        lineHeight: 18,
    },
    feedbackCaseC: {
        backgroundColor: '#FFF3E0',
        borderColor: '#FFE0B2',
    },
    feedbackCaseCText1: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 6,
    },
    feedbackCaseCText2: {
        fontSize: 13,
        color: '#F57C00',
        lineHeight: 18,
    },
});

export default HomeScreen;
