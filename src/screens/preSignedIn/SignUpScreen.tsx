import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../../context/AuthContext';
import { signUp } from '../../util/AuthHelper';
import { authActions } from '../../constants/authActions';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colorPalette } from '../../constants/color';

const SignUpScreen = ({ navigation }) => {
    const [authState, dispatch] = useAuthContext();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    // Reset errors when screen mounts
    useEffect(() => {
        dispatch(authActions.throwError(''));
    }, [dispatch]);

    // Turn off loading spinner if context returns an error
    useEffect(() => {
        if (authState.errorMsg) {
            setLocalLoading(false);
        }
    }, [authState.errorMsg]);

    const getPasswordStrength = (pass: string) => {
        if (!pass) return { score: 0, label: '', color: '#E2E8F0', width: '0%' };
        let score = 0;
        if (pass.length >= 6) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (score <= 1) return { score: 1, label: 'Weak 🔴', color: '#FC5185', width: '33%' };
        if (score <= 3) return { score: 2, label: 'Medium 🟡', color: '#FFB700', width: '66%' };
        return { score: 3, label: 'Strong 🟢', color: '#4CAF50', width: '100%' };
    };

    const validateForm = () => {
        let isValid = true;

        if (!name.trim()) {
            setNameError('Full name is required');
            isValid = false;
        } else if (name.trim().length < 2) {
            setNameError('Name must be at least 2 characters');
            isValid = false;
        } else {
            setNameError('');
        }

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

        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            isValid = false;
        } else if (confirmPassword !== password) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        return isValid;
    };

    const handleOnSignUp = () => {
        if (validateForm()) {
            setLocalLoading(true);
            dispatch(authActions.throwError('')); // Clear existing errors
            signUp(dispatch, email, password);
        }
    };

    const handleOnSignIn = () => {
        navigation.navigate('signin');
    };

    const strength = getPasswordStrength(password);

    return (
        <AuthLayout
            title="Create Your Account"
            subtitle="Start building healthier hydration habits today."
        >
            <View style={styles.form}>
                {/* Full Name Input */}
                <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    iconName="person-outline"
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        if (nameError) setNameError('');
                    }}
                    error={nameError}
                    autoComplete="name"
                />

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

                {/* Password Strength Indicator */}
                {password ? (
                    <View style={styles.strengthContainer}>
                        <View style={styles.strengthBarBg}>
                            <View 
                                style={[
                                    styles.strengthBarFill, 
                                    { width: strength.width, backgroundColor: strength.color }
                                ]} 
                            />
                        </View>
                        <Text style={[styles.strengthText, { color: strength.color }]}>
                            Strength: {strength.label}
                        </Text>
                    </View>
                ) : null}

                {/* Confirm Password Input */}
                <Input
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    iconName="lock-closed-outline"
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (confirmPasswordError) setConfirmPasswordError('');
                    }}
                    error={confirmPasswordError}
                    isPassword
                />

                {/* Auth Context Global Errors */}
                {authState.errorMsg ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={18} color="#FC5185" style={styles.errorIcon} />
                        <Text style={styles.globalErrorText}>{authState.errorMsg}</Text>
                    </View>
                ) : null}

                {/* Submit Buttons */}
                <View style={styles.actionContainer}>
                    <Button
                        title="Create Account"
                        variant="primary"
                        loading={localLoading}
                        onPress={handleOnSignUp}
                    />

                    <Button
                        title="Already have an account? Sign In"
                        variant="text"
                        onPress={handleOnSignIn}
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
    strengthContainer: {
        width: '100%',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    strengthBarBg: {
        height: 6,
        width: '100%',
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 6,
    },
    strengthBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    strengthText: {
        fontSize: 12,
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
        marginTop: 8,
        marginBottom: 16,
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
        marginTop: 16,
        width: '100%',
    },
});

export default SignUpScreen;