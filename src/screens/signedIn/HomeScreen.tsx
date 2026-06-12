import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, Dimensions } from 'react-native';
import ProgressCircle from 'react-native-progress/Circle';
import { useAuthContext } from '../../context/AuthContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { useWeatherContext } from '../../context/WeatherContext';
import { Alert } from 'react-native';
import { fetchWaterGoal, fetchWaterRecords, saveWaterRecord } from '../../util/FirebaseHelper';
import { refreshSmartHydrationIfNeeded } from '../../util/SmartHydrationHelper';
import { restoreHydrationReminders } from '../../util/ReminderHelper';
import AddWaterButton from '../../components/AddWaterButton';
import SmartHydrationSummaryCard from '../../components/SmartHydrationSummaryCard';
import { colorPalette } from '../../constants/color';
import { commonStyle, homeStyle } from '../../styles/styles';
import { getData, storeData } from '../../util/StorageHelper';
import moment from 'moment';
import WaterHistoryList from '../../components/WaterHistoryList';

const { width } = Dimensions.get('window');
const circleSize = 180; 

const HomeScreen = ({ navigation }) => {
    const [authState] = useAuthContext();
    const [state, dispatch] = useFirebaseContext();
    const [weatherState, weatherDispatch] = useWeatherContext();
    const [progress, setProgress] = useState(0);

    const isPremiumUser = Boolean(authState.user?.isPremiumUser);

    useEffect(() => {
        fetchWaterRecords(dispatch, authState.user?.uid);
        fetchWaterGoal(dispatch, authState.user?.uid);
        restoreHydrationReminders();
    }, [authState.user?.uid, dispatch]);

    useEffect(() => {
        calculateCircle();
    }, [state]);

    useEffect(() => {
        if (isPremiumUser && state.waterGoal?.waterGoal) {
            refreshSmartHydrationIfNeeded(weatherState, weatherDispatch, state.waterGoal.waterGoal, { isPremiumUser });
        }
    }, [state.waterGoal?.waterGoal, weatherState, weatherDispatch, isPremiumUser]);

    const calculateCircle = () => {
        if (state.dailyWaterRecord == undefined || state.waterGoal == undefined) {
            setProgress(0);
        } else {
            const dailyWaterSizeRecord = state.dailyWaterRecord.map(waterRecord =>
                Number(waterRecord.data.size.substring(0, 3))
            );
            const waterRecord = dailyWaterSizeRecord.reduce((a, b) => a + b, 0);
            if (waterRecord >= state.waterGoal.waterGoal) {
                setProgress(1);
                updateGoalHistory();
            } else {
                setProgress(waterRecord / state.waterGoal.waterGoal);
            }
        }
    };

    const updateGoalHistory = () => {
        getData('goalHistory').then(res => {
            const today = moment().format('YYYY-MM-DD');
            if (!res) {
                storeData('goalHistory', JSON.stringify([today]));
            } else if (!JSON.parse(res).includes(today)) {
                storeData('goalHistory', JSON.stringify([...JSON.parse(res), today]));
            }
        });
    };

    const openSmartHydration = () => {
        if (!isPremiumUser) {
            return;
        }

        navigation.navigate('smartHydration');
    };

    return (
        <View style={homeStyle.container}>
            <Text style={commonStyle.header}>Water Reminder</Text>

            <View style={homeStyle.progress}>
                <ProgressCircle size={circleSize} progress={progress} showsText color={colorPalette.primary} />
            </View>

            <SmartHydrationSummaryCard
                recommendation={weatherState.recommendation}
                isLoading={weatherState.isLoading}
                error={weatherState.error}
                onPress={openSmartHydration}
                isPremium={isPremiumUser}
            />

            <WaterHistoryList dailyWaterRecord={state.dailyWaterRecord} />
            <AddWaterButton dispatch={dispatch} action={saveWaterRecord} userId={authState.user?.uid} />
        </View>
    );
};

export default HomeScreen;
