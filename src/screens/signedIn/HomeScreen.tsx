import * as React from 'react';
import {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import ProgressCircle from 'react-native-progress/Circle';
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {useAuthContext} from "../../context/AuthContext";
import {useFirebaseContext} from "../../context/FirebaseContext";
import {useWeatherContext} from "../../context/WeatherContext";
import {fetchWaterGoal, fetchWaterRecords, saveWaterRecord} from "../../util/FirebaseHelper";
import {refreshSmartHydrationIfNeeded} from "../../util/SmartHydrationHelper";
import {isWeatherDataStale} from "../../util/WeatherHelper";
import {getHydrationLevelDetails} from "../../util/HydrationCalculator";
import AddWaterButton from "../../components/AddWaterButton";
import {colorPalette} from "../../constants/color";
import {commonStyle, homeStyle, smartHydrationSummaryStyle} from "../../styles/styles";
import {getData, storeData} from "../../util/StorageHelper";
import moment from "moment";
import WaterHistoryList from "../../components/WaterHistoryList";

const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const [authState] = useAuthContext();
    const [state, dispatch] = useFirebaseContext();
    const [weatherState, weatherDispatch] = useWeatherContext();
    const [progress, setProgress] = useState(0);

    const isPremiumUser = Boolean(authState.user?.isPremiumUser);
    const userId = authState.user?.uid;
    const currentGoal = state.waterGoal?.waterGoal || 0;

    useEffect(() => {
        if (!userId) {
            return;
        }

        const unsubscribeWaterRecords = fetchWaterRecords(dispatch, userId);
        const unsubscribeWaterGoal = fetchWaterGoal(dispatch, userId);

        return () => {
            unsubscribeWaterRecords();
            unsubscribeWaterGoal();
        };
    }, [dispatch, userId]);

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

        refreshSmartHydrationIfNeeded(weatherState, weatherDispatch, currentGoal);
    }, [isPremiumUser, currentGoal]);

    useEffect(() => {
        calculateCircle();
    }, [state.dailyWaterRecord, state.waterGoal]);

    const calculateCircle = () => {
        if (state.dailyWaterRecord == undefined || state.waterGoal == undefined || state.waterGoal.waterGoal === 0) {
            setProgress(0);
        } else {
            const dailyWaterSizeRecord = state.dailyWaterRecord.map(waterRecord => {
                const sizeStr = waterRecord?.data?.size;
                if (typeof sizeStr === 'string') {
                    return Number(sizeStr.substring(0, 3)) || 0;
                } else if (typeof sizeStr === 'number') {
                    return sizeStr;
                }
                return 0;
            });
            const waterRecord = dailyWaterSizeRecord.reduce((a, b) => a + b, 0);
            if (waterRecord >= state.waterGoal.waterGoal) {
                setProgress(1);
                updateGoalHistory();
            } else {
                setProgress(waterRecord / state.waterGoal.waterGoal);
            }
        }
    }

    const updateGoalHistory = () => {
        getData("goalHistory").then(res => {
            const today = moment().format("YYYY-MM-DD");
            try {
                let goalHistory = [];
                if (res) {
                    const parsed = JSON.parse(res);
                    if (Array.isArray(parsed)) {
                        goalHistory = parsed;
                    }
                }
                if (!goalHistory.includes(today)) {
                    const updatedHistory = [...goalHistory, today];
                    storeData("goalHistory", JSON.stringify(updatedHistory));
                }
            } catch (e) {
                console.warn("Failed to update goalHistory:", e);
            }
        });
    }

    const renderSmartHydrationCard = () => {
        const recommendation = weatherState.recommendation;
        const emoji = (recommendation && isPremiumUser) ? getHydrationLevelDetails(recommendation.hydrationLevel).emoji : '✨';

        return (
            <TouchableOpacity
                style={smartHydrationSummaryStyle.card}
                onPress={() => navigation.navigate('calendar', { screen: 'smartHydration' })}
            >
                <View style={smartHydrationSummaryStyle.cardInfo}>
                    <View style={smartHydrationSummaryStyle.titleRow}>
                        <Text style={smartHydrationSummaryStyle.title}>
                            {emoji} Smart Hydration
                        </Text>
                        {!isPremiumUser && (
                            <View style={smartHydrationSummaryStyle.premiumBadge}>
                                <Text style={smartHydrationSummaryStyle.premiumText}>PREMIUM</Text>
                            </View>
                        )}
                    </View>

                    {weatherState.isLoading ? (
                        <Text style={smartHydrationSummaryStyle.subtitle}>Fetching insights...</Text>
                    ) : (recommendation && isPremiumUser) ? (
                        <Text style={smartHydrationSummaryStyle.subtitle}>
                            {recommendation.displayTemperature} - {recommendation.recommendedIntake} ml recommended · {recommendation.goalDifference > 0 ? '+' : ''}{recommendation.goalDifference} ml
                        </Text>
                    ) : (
                        <Text style={smartHydrationSummaryStyle.subtitle}>
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

    return (
        <View style={homeStyle.container}>
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

            <WaterHistoryList dailyWaterRecord={state.dailyWaterRecord}/>
            <AddWaterButton dispatch={dispatch} action={saveWaterRecord} userId={userId}/>
        </View>
    );
}

export default HomeScreen;
