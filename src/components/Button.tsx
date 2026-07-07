import React, { useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View
} from 'react-native';
import { colorPalette } from '../constants/color';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'text';
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    loading = false,
    style,
    disabled,
    ...props
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
            speed: 50,
            bounciness: 0
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 30,
            bounciness: 10
        }).start();
    };

    const isButtonDisabled = disabled || loading;

    // Determine styles based on variant
    let buttonStyle = styles.primaryButton;
    let textStyle = styles.primaryText;

    if (variant === 'secondary') {
        buttonStyle = styles.secondaryButton;
        textStyle = styles.secondaryText;
    } else if (variant === 'text') {
        buttonStyle = styles.textButton;
        textStyle = styles.textText;
    }

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.wrapper]}>
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isButtonDisabled}
                style={[
                    styles.button,
                    buttonStyle,
                    isButtonDisabled && styles.disabledButton,
                    style
                ]}
                activeOpacity={0.85}
                {...props}
            >
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={variant === 'primary' ? '#FFFFFF' : '#364F6B'}
                    />
                ) : (
                    <Text style={[styles.text, textStyle, isButtonDisabled && styles.disabledText]}>
                        {title}
                    </Text>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        marginVertical: 8,
    },
    button: {
        width: '100%',
        height: 52,
        borderRadius: 26, // fully rounded pill
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
    },
    primaryButton: {
        backgroundColor: '#FC5185', // primary vibrant coral/pink
        shadowColor: '#FC5185',
        shadowOpacity: 0.25,
    },
    primaryText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#364F6B', // themed dark teal
        shadowColor: '#364F6B',
        shadowOpacity: 0.05,
    },
    secondaryText: {
        color: '#364F6B',
        fontWeight: '700',
    },
    textButton: {
        backgroundColor: 'transparent',
        height: 'auto',
        paddingVertical: 12,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },
    textText: {
        color: '#7A7A7A',
        fontWeight: '600',
        fontSize: 14,
    },
    disabledButton: {
        opacity: 0.6,
        shadowOpacity: 0,
        elevation: 0,
    },
    disabledText: {
        opacity: 0.8,
    },
    text: {
        fontSize: 16,
    },
});

export default Button;
