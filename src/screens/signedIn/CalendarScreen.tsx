import * as React from 'react';
import {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {commonStyle, settingsStyle} from "../../styles/styles";
import {Calendar} from "react-native-calendars/src";
import {colorPalette} from "../../constants/color";
import {getData} from "../../util/StorageHelper";
import {useIsFocused} from "@react-navigation/native";
import {useFirebaseContext} from "../../context/FirebaseContext";
import {useAuthContext} from "../../context/AuthContext";
import {fetchGoalHistory} from "../../util/FirebaseHelper";

const CalendarScreen = ({navigation}) => {
    const [authState] = useAuthContext();
    const [firebaseState, dispatch] = useFirebaseContext();
    const [goalHistory, setGoalHistory] = useState<any>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && authState.user?.uid) {
            const unsubscribe = fetchGoalHistory(dispatch, authState.user.uid);
            return () => unsubscribe();
        }
    }, [isFocused, authState.user?.uid]);

    useEffect(() => {
        if (firebaseState.goalHistory) {
            const tempGoalHistory = firebaseState.goalHistory.reduce((acc, curr) => (acc[curr] = {
                selected: true,
                selectedColor: colorPalette.primary
            }, acc), {});
            setGoalHistory(tempGoalHistory);
        } else {
            // Fallback to local storage if firebase data hasn't arrived
            getGoalHistoryLocal();
        }
    }, [firebaseState.goalHistory]);

    const getGoalHistoryLocal = () => {
        getData("goalHistory").then(res => {
            if (res && !firebaseState.goalHistory) {
                const tempGoalHistory = JSON.parse(res as string).reduce((acc, curr) => (acc[curr] = {
                    selected: true,
                    selectedColor: colorPalette.primary
                }, acc), {});
                setGoalHistory(tempGoalHistory);
            }
        });
    }

    const goToGoalHistoryDetail = (day) => {
        navigation.navigate("calendarDetail", {date: day.dateString});
    }

    return (
        <View style={settingsStyle.container}>
            <Text style={commonStyle.header}>
                Water Reminder
            </Text>
            <View style={{
                alignSelf: 'stretch'
            }}>
                <Calendar
                    theme={{
                        calendarBackground: colorPalette.background,
                        arrowColor: colorPalette.tertiary,
                        monthTextColor: colorPalette.primary,
                        indicatorColor: colorPalette.primary,
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16,
                    }}
                    onDayPress={day => {
                        goToGoalHistoryDetail(day);
                    }}
                    firstDay={1}
                    onPressArrowLeft={subtractMonth => subtractMonth()}
                    onPressArrowRight={addMonth => addMonth()}
                    disableAllTouchEventsForDisabledDays={true}
                    horizontal={true}
                    pagingEnabled={true}
                    markedDates={{
                        ...goalHistory
                    }}
                />
            </View>
        </View>
    );
}

export default CalendarScreen;