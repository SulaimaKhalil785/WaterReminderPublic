/**
 * Smart Hydration Recommendation Card Component
 * 
 * Displays personalized hydration recommendations based on current weather conditions.
 * Allows users to:
 * - View weather-based water intake recommendation
 * - See detailed information about their hydration needs
 * - Accept the recommendation to update their daily goal
 * - Dismiss the recommendation
 * 
 * Features:
 * - Shows current temperature and weather description
 * - Displays recommended water intake with comparison to current goal
 * - Color-coded for different weather conditions
 * - Easy accept/dismiss buttons
 * - Error handling for weather API failures
 */

import React from 'react';
import { View, Text, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';
import { colorPalette } from '../constants/color';
import { getTemperatureColor } from '../constants/hydrationThresholds';
import { getHydrationLevelDetails } from '../util/HydrationCalculator';

const SmartHydrationCard = ({ 
    recommendation,
    isLoading,
    isAccepting = false,
    error,
    onAccept,
    onDismiss,
    onRetry,
    isMocked = false
}) => {
    if (isLoading) {
        return (
            <View style={styles.card}>
                <ActivityIndicator size="large" color={colorPalette.primary} />
                <Text style={styles.loadingText}>Fetching weather data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.card}>
                <Text style={styles.errorTitle}>⚠️ Weather Unavailable</Text>
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.errorSubtext}>
                    Unable to fetch weather data. Please check your location settings or try again later.
                </Text>
                {onRetry && (
                    <Pressable style={[styles.button, styles.acceptButton, { marginTop: 16 }]} onPress={onRetry}>
                        <Text style={styles.acceptButtonText}>Try Again</Text>
                    </Pressable>
                )}
            </View>
        );
    }

    if (!recommendation) {
        return null;
    }

    const levelDetails = getHydrationLevelDetails(recommendation.hydrationLevel);
    const temperatureColor = getTemperatureColor(recommendation.temperature);
    const goalIncrease = recommendation.goalDifference > 0;
    const hasSignificantChange = Math.abs(recommendation.percentageChange) >= 20;

    const handleAccept = () => {
        if (!isAccepting && onAccept && recommendation) {
            onAccept(recommendation);
        }
    };

    const handleDismiss = () => {
        if (!isAccepting && onDismiss) {
            onDismiss();
        }
    };

    return (
        <View style={styles.card}>
            {/* Header with emoji and temperature */}
            <View style={styles.header}>
                <Text style={styles.emoji}>{levelDetails.emoji}</Text>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Smart Hydration Recommendation</Text>
                    <Text style={styles.weatherDescription}>
                        {recommendation.location} • {recommendation.displayTemperature}
                    </Text>
                </View>
            </View>

            {/* Recommendation message */}
            <View style={styles.messageContainer}>
                <Text style={styles.message}>{recommendation.message}</Text>
            </View>

            {/* Recommendation details */}
            <View style={[styles.detailsContainer, { borderLeftColor: temperatureColor }]}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Current Goal:</Text>
                    <Text style={styles.detailValue}>{recommendation.currentGoal} ml</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Recommended:</Text>
                    <Text style={[
                        styles.detailValue,
                        { color: temperatureColor, fontWeight: 'bold' }
                    ]}>
                        {recommendation.recommendedIntake} ml
                    </Text>
                </View>
                
                {/* Change indicator */}
                {recommendation.goalDifference !== 0 && (
                    <View style={styles.changeRow}>
                        <Text style={styles.changeLabel}>
                            {goalIncrease ? '📈 Increase' : '📉 Decrease'}
                        </Text>
                        <Text style={[
                            styles.changeValue,
                            { color: goalIncrease ? '#FF6B6B' : '#51CF66' }
                        ]}>
                            {goalIncrease ? '+' : ''}{recommendation.goalDifference} ml 
                            ({recommendation.percentageChange > 0 ? '+' : ''}{recommendation.percentageChange}%)
                        </Text>
                    </View>
                )}

                {/* Weather conditions */}
                <View style={styles.weatherConditions}>
                    <View style={styles.condition}>
                        <Text style={styles.conditionLabel}>Humidity</Text>
                        <Text style={styles.conditionValue}>{recommendation.humidity}%</Text>
                    </View>
                    <View style={styles.condition}>
                        <Text style={styles.conditionLabel}>Feels Like</Text>
                        <Text style={styles.conditionValue}>{recommendation.feelsLike}°C</Text>
                    </View>
                    <View style={styles.condition}>
                        <Text style={styles.conditionLabel}>Reminder</Text>
                        <Text style={styles.conditionValue}>
                            Every {recommendation.reminderFrequency}m
                        </Text>
                    </View>
                </View>
            </View>

            {/* Tips section */}
            {hasSignificantChange && (
                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>💡 Tips for {levelDetails.label}:</Text>
                    {levelDetails.tips.slice(0, 2).map((tip, index) => (
                        <Text key={index} style={styles.tip}>
                            • {tip}
                        </Text>
                    ))}
                </View>
            )}

            {/* Mock data warning */}
            {isMocked && (
                <View style={styles.mockWarning}>
                    <Text style={styles.mockText}>
                        ⓘ Using mock data. Configure your Weather API key for real weather data.
                    </Text>
                </View>
            )}

            {/* Action buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.dismissButton]}
                    onPress={handleDismiss}
                    disabled={isAccepting}
                    activeOpacity={0.7}
                >
                    <Text style={styles.dismissButtonText}>Not Now</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.acceptButton,
                        { backgroundColor: temperatureColor },
                        isAccepting && styles.buttonDisabled
                    ]}
                    onPress={handleAccept}
                    disabled={isAccepting}
                    activeOpacity={0.7}
                >
                    {isAccepting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.acceptButtonText}>
                            Accept & Update Goal
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colorPalette.background,
        borderRadius: 12,
        padding: 16,
        marginVertical: 12,
        marginHorizontal: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    
    emoji: {
        fontSize: 40,
        marginRight: 12
    },
    
    headerContent: {
        flex: 1
    },
    
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colorPalette.primary,
        marginBottom: 4
    },
    
    weatherDescription: {
        fontSize: 13,
        color: colorPalette.disabled,
        fontStyle: 'italic'
    },
    
    messageContainer: {
        backgroundColor: '#F9F9F9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16
    },
    
    message: {
        fontSize: 14,
        color: colorPalette.primary,
        lineHeight: 20,
        fontWeight: '500'
    },
    
    detailsContainer: {
        backgroundColor: '#FFFFFF',
        borderLeftWidth: 4,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16
    },
    
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    
    detailLabel: {
        fontSize: 14,
        color: colorPalette.disabled,
        fontWeight: '600'
    },
    
    detailValue: {
        fontSize: 14,
        color: colorPalette.primary,
        fontWeight: 'bold'
    },
    
    changeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0'
    },
    
    changeLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colorPalette.primary
    },
    
    changeValue: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    
    weatherConditions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0'
    },
    
    condition: {
        alignItems: 'center'
    },
    
    conditionLabel: {
        fontSize: 12,
        color: colorPalette.disabled,
        marginBottom: 4
    },
    
    conditionValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colorPalette.primary
    },
    
    tipsContainer: {
        backgroundColor: '#FFF9E6',
        borderLeftWidth: 3,
        borderLeftColor: '#FFB700',
        padding: 12,
        marginBottom: 16,
        borderRadius: 6
    },
    
    tipsTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FF8A00',
        marginBottom: 8
    },
    
    tip: {
        fontSize: 12,
        color: colorPalette.primary,
        marginBottom: 4,
        lineHeight: 16
    },
    
    mockWarning: {
        backgroundColor: '#E3F2FD',
        borderLeftWidth: 3,
        borderLeftColor: '#2196F3',
        padding: 12,
        marginBottom: 16,
        borderRadius: 6
    },
    
    mockText: {
        fontSize: 12,
        color: '#1976D2',
        fontStyle: 'italic'
    },
    
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        zIndex: 10
    },
    
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44
    },
    
    dismissButton: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: colorPalette.disabled,
        marginRight: 6
    },
    
    dismissButtonText: {
        color: colorPalette.primary,
        fontWeight: '600',
        fontSize: 14
    },
    
    acceptButton: {
        backgroundColor: colorPalette.secondary,
        marginLeft: 6
    },

    buttonDisabled: {
        opacity: 0.7
    },
    
    acceptButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14
    },
    
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: colorPalette.primary,
        textAlign: 'center'
    },
    
    errorTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colorPalette.tertiary,
        marginBottom: 8
    },
    
    errorText: {
        fontSize: 14,
        color: colorPalette.tertiary,
        marginBottom: 8,
        fontWeight: '600'
    },
    
    errorSubtext: {
        fontSize: 12,
        color: colorPalette.disabled,
        lineHeight: 16
    }
});

export default SmartHydrationCard;
