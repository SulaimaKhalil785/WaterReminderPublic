import {Alert, Modal, Pressable, Text, TextInput, View} from "react-native";
import * as React from "react";
import {useEffect, useState} from "react";
import {setWaterGoalModalStyle} from "../styles/styles";
import {useAuthContext} from "../context/AuthContext";
import {useFirebaseContext} from "../context/FirebaseContext";
import {saveWaterGoal} from "../util/FirebaseHelper";

const SetWaterGoalModal = ({oldWaterGoal, modalVisible, action}) => {
    const [authState] = useAuthContext();
    const [, dispatch] = useFirebaseContext();
    const [waterGoal, setWaterGoal] = useState<any>('');
    const userId = authState.user?.uid;

    useEffect(() => {
        setWaterGoal(oldWaterGoal ?? '');
    }, [oldWaterGoal]);

    const submitWaterGoal = () => {
        const numericGoal = Number(waterGoal);

        if (!userId) {
            Alert.alert("Error", "You must be signed in");
            return false;
        }

        if (Number.isNaN(numericGoal)) {
            Alert.alert("Error", "Must input numbers");
            return false;
        } else {
            saveWaterGoal(dispatch, userId, numericGoal);
            action();
        }
    }

    const isPressable = () => {
        return Number.isNaN(Number(waterGoal));
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={action}
        >
            <View style={setWaterGoalModalStyle.centeredView}>
                <View style={setWaterGoalModalStyle.modalView}>
                    <TextInput
                        style={waterGoal ? setWaterGoalModalStyle.input : setWaterGoalModalStyle.inputBlank}
                        placeholder="New Water Goal"
                        placeholderTextColor="#003f5c"
                        onChangeText={value => setWaterGoal(value)}
                        keyboardType="number-pad"
                        autoFocus={true}
                        value={String(waterGoal)}
                    />
                    <Pressable
                        style={!isPressable() ? setWaterGoalModalStyle.button : setWaterGoalModalStyle.disabledButton}
                        onPress={submitWaterGoal}
                        disabled={isPressable()}
                    >
                        <Text style={setWaterGoalModalStyle.textStyle}>Save</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

export default SetWaterGoalModal;
