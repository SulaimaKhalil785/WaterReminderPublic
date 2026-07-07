import React from 'react';
import { Modal, Pressable, Text, View } from "react-native";
import { setWaterGoalModalStyle } from "../styles/styles";

const SignOutModal = ({ visible, onClose, onConfirm }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={setWaterGoalModalStyle.centeredView}>
                <View style={setWaterGoalModalStyle.modalView}>
                    <Text style={setWaterGoalModalStyle.modalText}>
                        Sign Out
                    </Text>
                    <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 }}>
                        Are you sure you want to log out of your account?
                    </Text>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <Pressable
                            style={[setWaterGoalModalStyle.button, { flex: 1, marginRight: 10, backgroundColor: '#EEE' }]}
                            onPress={onClose}
                        >
                            <Text style={[setWaterGoalModalStyle.textStyle, { color: '#666' }]}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            style={[setWaterGoalModalStyle.button, { flex: 1 }]}
                            onPress={onConfirm}
                        >
                            <Text style={setWaterGoalModalStyle.textStyle}>Yes</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default SignOutModal;
