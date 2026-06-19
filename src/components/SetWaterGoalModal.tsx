import {Modal, Pressable, Text, TextInput, View, ActivityIndicator} from "react-native";
import * as React from "react";
import {useEffect, useState} from "react";
import {setWaterGoalModalStyle} from "../styles/styles";
import {useAuthContext} from "../context/AuthContext";
import {useFirebaseContext} from "../context/FirebaseContext";
import {saveWaterGoal} from "../util/FirebaseHelper";

const SetWaterGoalModal = ({oldWaterGoal, modalVisible, action}) => {
    const [authState,] = useAuthContext();
    const [, dispatch] = useFirebaseContext();
    const [waterGoal, setWaterGoal] = useState<any>('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (modalVisible) {
            setWaterGoal(oldWaterGoal);
            setIsSaving(false);
        }
    }, [oldWaterGoal, modalVisible]);

    const submitWaterGoal = () => {
        const goalNum = Number(waterGoal);
        if (isNaN(goalNum) || goalNum <= 0) {
            alert("Please enter a valid number");
            return;
        }

        setIsSaving(true);

        // Trigger the save (Optimistic Update is already handled in saveWaterGoal)
        saveWaterGoal(dispatch, authState.user?.uid, goalNum);

        // Close the modal almost immediately to make it feel super fast
        setTimeout(() => {
            setIsSaving(false);
            action();
        }, 300);
    }

    const isInvalid = isNaN(waterGoal) || waterGoal === '' || Number(waterGoal) <= 0;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={action}
        >
            <View style={setWaterGoalModalStyle.centeredView}>
                <View style={setWaterGoalModalStyle.modalView}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#364F6B' }}>
                        Set Daily Goal
                    </Text>

                    <TextInput
                        style={waterGoal ? setWaterGoalModalStyle.input : setWaterGoalModalStyle.inputBlank}
                        placeholder="e.g. 2500"
                        placeholderTextColor="#999"
                        onChangeText={value => setWaterGoal(value)}
                        keyboardType="number-pad"
                        autoFocus={true}
                        value={String(waterGoal)}
                        editable={!isSaving}
                    />

                    <View style={{ flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'space-between' }}>
                        <Pressable
                            style={[setWaterGoalModalStyle.button, { flex: 1, marginRight: 10, backgroundColor: '#EEE' }]}
                            onPress={action}
                            disabled={isSaving}
                        >
                            <Text style={[setWaterGoalModalStyle.textStyle, { color: '#666' }]}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            style={[
                                (isInvalid || isSaving) ? setWaterGoalModalStyle.disabledButton : setWaterGoalModalStyle.button,
                                { flex: 2 }
                            ]}
                            onPress={submitWaterGoal}
                            disabled={isInvalid || isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text style={setWaterGoalModalStyle.textStyle}>Save Goal</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default SetWaterGoalModal;
