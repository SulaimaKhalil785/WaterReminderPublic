import * as React from 'react';
import {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {commonStyle, settingsStyle} from "../../styles/styles";
import SetWaterGoalCard from "../../components/SetWaterGoalCard";
import SetWaterGoalModal from "../../components/SetWaterGoalModal";
import SignOutModal from "../../components/SignOutModal";
import {fetchWaterGoal} from "../../util/FirebaseHelper";
import {useAuthContext} from "../../context/AuthContext";
import {useFirebaseContext} from "../../context/FirebaseContext";
import {signOut} from "../../util/AuthHelper";
import SignOutCard from "../../components/SignOutCard";
import {colorPalette} from "../../constants/color";
import {Ionicons} from "@expo/vector-icons";

const SettingsScreen = ({ navigation }) => {
    const [authState, authDispatch] = useAuthContext();
    const [state, dispatch] = useFirebaseContext();
    const [modalVisible, setModalVisible] = useState(false);
    const [signOutModalVisible, setSignOutModalVisible] = useState(false);

    const isPremiumUser = Boolean(authState.user?.isPremiumUser);

    useEffect(() => {
        if (authState.user?.uid) {
            fetchWaterGoal(dispatch, authState.user.uid);
        }
    }, [authState.user?.uid]);

    const submitWaterGoal = () => {
        setModalVisible(false);
    }

    const handleSignOut = () => {
        setSignOutModalVisible(false);
        signOut(authDispatch);
    }

    const renderPremiumCard = () => {
        return (
            <View style={[
                localStyles.premiumCard,
                isPremiumUser ? localStyles.premiumActive : localStyles.premiumInactive,
                !isPremiumUser && { opacity: 0.6 }
            ]}>
                <View style={localStyles.premiumCardInfo}>
                    <View style={localStyles.titleRow}>
                        <Ionicons
                            name={isPremiumUser ? "star" : "star-outline"}
                            size={24}
                            color={isPremiumUser ? "#FFD700" : "#E0E0E0"}
                        />
                        <Text style={localStyles.premiumTitle}>
                            {isPremiumUser ? "Premium Member" : "Smart Hydration"}
                        </Text>
                    </View>
                    <Text style={localStyles.premiumSubtitle}>
                        {isPremiumUser
                            ? "All features unlocked! Smart AI hydration is active."
                            : "Unlock AI-powered hydration goals and weather insights."}
                    </Text>
                </View>
                {isPremiumUser ? (
                    <Ionicons name="checkmark-circle" size={32} color="#FFFFFF" />
                ) : (
                    <Ionicons name="lock-closed" size={24} color="#FFFFFF" />
                )}
            </View>
        );
    }

    return (
        <View style={settingsStyle.container}>
            <Text style={commonStyle.header}>
                Water Reminder
            </Text>

            {renderPremiumCard()}

            {
                state.waterGoal &&
                <>
                    <SetWaterGoalCard waterGoal={state.waterGoal.waterGoal}
                                      action={() => {
                                          setModalVisible(true)
                                      }}/>
                    <SetWaterGoalModal oldWaterGoal={state.waterGoal.waterGoal}
                                       modalVisible={modalVisible}
                                       action={submitWaterGoal}
                    />
                </>
            }
            <SignOutCard action={() => setSignOutModalVisible(true)} />

            <SignOutModal
                visible={signOutModalVisible}
                onClose={() => setSignOutModalVisible(false)}
                onConfirm={handleSignOut}
            />
        </View>
    );
}

const localStyles = StyleSheet.create({
    premiumCard: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        padding: 16,
        marginHorizontal: 18,
        borderRadius: 16,
        marginBottom: 8,
        minHeight: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    premiumActive: {
        backgroundColor: colorPalette.primary,
    },
    premiumInactive: {
        backgroundColor: '#9E9E9E',
    },
    premiumCardInfo: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    premiumTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    premiumSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 13,
    },
    freeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    freeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default SettingsScreen;
