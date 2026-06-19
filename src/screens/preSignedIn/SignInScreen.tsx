import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../../context/AuthContext';
import { signIn } from '../../util/AuthHelper';
import { authActions } from '../../constants/authActions';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colorPalette } from '../../constants/color';

const SignInScreen = ({ navigation }) => {
    const [authState, dispatch] = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);

    // Reset errors when component mounts
    useEffect(() => {
        dispatch(authActions.throwError(''));
    }, [dispatch]);

    // Turn off loading spinner if context returns an error
    useEffect(() => {
        if (authState.errorMsg) {
            setLocalLoading(false);
        }
    }, [authState.errorMsg]);

    const validateForm = () => {
        let isValid = true;

        if (!email.trim()) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email address');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleOnSignIn = () => {
        if (validateForm()) {
            setLocalLoading(true);
            dispatch(authActions.throwError('')); // Clear existing errors
            signIn(dispatch, email, password);
        }
    };

    const handleOnSignUp = () => {
        navigation.navigate('signup');
    };

    const handleForgotPassword = () => {
        if (!email.trim()) {
            Alert.alert('Password Reset', 'Please enter your email address in the email field first.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            Alert.alert('Password Reset', 'Please enter a valid email address.');
            return;
        }
        Alert.alert(
            'Reset Password',
            `A password reset link has been sent to ${email}.`,
            [{ text: 'OK' }]
        );
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Track your hydration journey and stay healthy every day."
        >
            <View style={styles.form}>
                {/* Email Input */}
                <Input
                    label="Email"
                    placeholder="Enter your email"
                    iconName="mail-outline"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        if (emailError) setEmailError('');
                    }}
                    error={emailError}
                    keyboardType="email-address"
                    autoComplete="email"
                />

                {/* Password Input */}
                <Input
                    label="Password"
                    placeholder="Enter your password"
                    iconName="lock-closed-outline"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        if (passwordError) setPasswordError('');
                    }}
                    error={passwordError}
                    isPassword
                />

                {/* Remember Me & Forgot Password */}
                <View style={styles.optionsRow}>
                    <TouchableOpacity
                        onPress={() => setRememberMe(!rememberMe)}
                        style={styles.checkboxRow}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={rememberMe ? 'checkbox' : 'square-outline'}
                            size={20}
                            color={rememberMe ? '#FC5185' : '#7A7A7A'}
                        />
                        <Text style={styles.checkboxLabel}>Remember Me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                {/* Auth Context Global Errors */}
                {authState.errorMsg ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={18} color="#FC5185" style={styles.errorIcon} />
                        <Text style={styles.globalErrorText}>{authState.errorMsg}</Text>
                    </View>
                ) : null}

                {/* Submit Action Buttons */}
                <View style={styles.actionContainer}>
                    <Button
                        title="Sign In"
                        variant="primary"
                        loading={localLoading}
                        onPress={handleOnSignIn}
                    />

                    <Button
                        title="Create an Account"
                        variant="text"
                        onPress={handleOnSignUp}
                    />
                </View>
            </View>
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    form: {
        width: '100%',
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
        width: '100%',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxLabel: {
        fontSize: 13,
        color: '#4A5568',
        marginLeft: 8,
        fontWeight: '500',
    },
    forgotPasswordText: {
        fontSize: 13,
        color: '#364F6B',
        fontWeight: '600',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        borderWidth: 1,
        borderColor: '#FED7D7',
        borderRadius: 12,
        padding: 12,
        marginTop: 16,
        width: '100%',
    },
    errorIcon: {
        marginRight: 8,
    },
    globalErrorText: {
        fontSize: 13,
        color: '#FC5185',
        flex: 1,
        fontWeight: '500',
    },
    actionContainer: {
        marginTop: 24,
        width: '100%',
    },
});

export default SignInScreen;