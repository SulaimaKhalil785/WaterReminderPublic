import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colorPalette } from '../constants/color';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    isPassword?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    iconName,
    isPassword = false,
    style,
    onFocus,
    onBlur,
    secureTextEntry,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const isSecure = isPassword && !isPasswordVisible;

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    error ? styles.inputContainerError : null
                ]}
            >
                {iconName && (
                    <Ionicons
                        name={iconName}
                        size={20}
                        color={error ? '#FC5185' : isFocused ? '#364F6B' : '#A0AEC0'}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={[styles.input, style]}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={isSecure}
                    placeholderTextColor="#A0AEC0"
                    autoCapitalize="none"
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.rightButton}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color="#A0AEC0"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
        marginBottom: 6,
        paddingLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
    },
    inputContainerFocused: {
        borderColor: '#364F6B',
        backgroundColor: '#FFFFFF',
    },
    inputContainerError: {
        borderColor: '#FC5185',
        backgroundColor: '#FFF5F5',
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#2D3748',
        fontSize: 15,
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            web: {
                outlineStyle: 'none',
                outlineWidth: 0,
                backgroundColor: '#FFFFFF',
            }
        })
    },
    rightButton: {
        padding: 4,
    },
    errorText: {
        fontSize: 12,
        color: '#FC5185',
        marginTop: 4,
        paddingLeft: 4,
        fontWeight: '500',
    },
});

export default Input;
