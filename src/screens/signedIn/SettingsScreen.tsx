import * as React from 'react';
import {useEffect, useState} from 'react';
import {Text, View, ScrollView} from 'react-native';
import {commonStyle, settingsStyle, signOffCardStyle} from "../../styles/styles";
import SetWaterGoalCard from "../../components/SetWaterGoalCard";
import SetWaterGoalModal from "../../components/SetWaterGoalModal";
import {fetchWaterGoal} from "../../util/FirebaseHelper";
import {useAuthContext} from "../../context/AuthContext";
import {useFirebaseContext} from "../../context/FirebaseContext";
import {auth} from "../../../firebaseConfig";
import {signOut} from "firebase/auth";
import SignOutCard from "../../components/SignOutCard";
import {Ionicons} from "@expo/vector-icons";
import {colorPalette} from "../../constants/color";

const SettingsScreen = () => {
    const [authState] = useAuthContext();
    const [state, dispatch] = useFirebaseContext();
    const [modalVisible, setModalVisible] = useState(false);

    const isPremium = authState.user?.isPremiumUser;
    const userId = authState.user?.uid;

    useEffect(() => {
        if (!userId) {
            return;
        }

        const unsubscribe = fetchWaterGoal(dispatch, userId);
        return unsubscribe;
    }, [userId, dispatch]);

    const submitWaterGoal = () => {
        setModalVisible(false);
    }

    return (
        <View style={settingsStyle.container}>
            <Text style={commonStyle.header}>
                Water Reminder
            </Text>

            <ScrollView
                style={{width: '100%'}}
                contentContainerStyle={{alignItems: 'center', paddingBottom: 30}}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Set Water Goal Card */}
                {
                    state.waterGoal && state.waterGoal.waterGoal !== undefined &&
                    <SetWaterGoalCard waterGoal={state.waterGoal.waterGoal}
                                      action={() => {
                                          setModalVisible(true)
                                      }}/>
                }

                {/* 2. Go Premium Button (Disabled as requested) */}
                <View
                    style={[
                        signOffCardStyle.card,
                        {
                            backgroundColor: isPremium ? colorPalette.secondary : '#E0E0E0',
                            marginTop: 0, // Using standard margins from signOffCardStyle
                            opacity: 0.8
                        }
                    ]}
                >
                    <View style={signOffCardStyle.cardInfo}>
                        <Text style={[signOffCardStyle.title, {color: isPremium ? '#FFF' : '#7A7A7A'}]}>
                            {isPremium ? 'Premium Active' : 'Go Premium'}
                        </Text>
                        <Text style={[signOffCardStyle.text, {color: isPremium ? '#FFF' : '#7A7A7A'}]}>
                            {isPremium ? 'Enjoy all smart features' : 'Coming Soon'}
                        </Text>
                    </View>
                    <Ionicons
                        name={isPremium ? "checkmark-circle" : "lock-closed"}
                        size={24}
                        color={isPremium ? colorPalette.background : '#7A7A7A'}
                    />
                </View>

                {/* 3. Sign Out Card (Moved to top group) */}
                <SignOutCard action={() => {
                    signOut(auth);
                }}/>
            </ScrollView>

            <SetWaterGoalModal oldWaterGoal={state.waterGoal?.waterGoal}
                               modalVisible={modalVisible}
                               action={submitWaterGoal}
            />
        </View>
    );
}

export default SettingsScreen;
