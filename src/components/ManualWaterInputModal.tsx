import React, { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View, ActivityIndicator } from "react-native";
import { setWaterGoalModalStyle } from "../styles/styles";

const ManualWaterInputModal = ({ visible, onClose, onSave }) => {
    const [amount, setAmount] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            alert("Please enter a valid amount in ml");
            return;
        }

        setIsSaving(true);
        try {
            await onSave(`${numAmount} ml`);
            setAmount('');
            onClose();
        } catch (error) {
            alert("Failed to save. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

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
                        Manual Water Intake
                    </Text>

                    <TextInput
                        style={setWaterGoalModalStyle.input}
                        placeholder="Amount in ml"
                        placeholderTextColor="#999"
                        onChangeText={setAmount}
                        keyboardType="number-pad"
                        autoFocus={true}
                        value={amount}
                        editable={!isSaving}
                    />

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <Pressable
                            style={[setWaterGoalModalStyle.button, { flex: 1, marginRight: 10, backgroundColor: '#EEE' }]}
                            onPress={onClose}
                            disabled={isSaving}
                        >
                            <Text style={[setWaterGoalModalStyle.textStyle, { color: '#666' }]}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            style={[setWaterGoalModalStyle.button, { flex: 1 }]}
                            onPress={handleSave}
                            disabled={isSaving || !amount}
                        >
                            {isSaving ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text style={setWaterGoalModalStyle.textStyle}>Add</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ManualWaterInputModal;
