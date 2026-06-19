import React from 'react';
import { Modal, Pressable, Text, View } from "react-native";
import { setWaterGoalModalStyle } from "../styles/styles";

const SuccessModal = ({ visible, onClose, message }) => {
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
                        Success!
                    </Text>
                    <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 }}>
                        {message || "Your goal has been updated successfully."}
                    </Text>

                    <View style={{ width: '100%' }}>
                        <Pressable
                            style={setWaterGoalModalStyle.button}
                            onPress={onClose}
                        >
                            <Text style={setWaterGoalModalStyle.textStyle}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default SuccessModal;
