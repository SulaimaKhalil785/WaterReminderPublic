import * as React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { colorPalette } from '../constants/color';
import { smartHydrationSummaryStyle } from '../styles/styles';
import { getHydrationLevelDetails } from '../util/HydrationCalculator';

const SmartHydrationSummaryCard = ({
    recommendation,
    isLoading,
    error,
    onPress,
}) => {
    if (isLoading) {
        return (
            <View style={[smartHydrationSummaryStyle.card, smartHydrationSummaryStyle.loadingCard]}>
                <ActivityIndicator size="small" color={colorPalette.background} />
                <Text style={smartHydrationSummaryStyle.loadingText}>Loading weather insights...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <TouchableOpacity style={smartHydrationSummaryStyle.card} onPress={onPress} activeOpacity={0.85}>
                <View style={smartHydrationSummaryStyle.cardInfo}>
                    <View style={smartHydrationSummaryStyle.titleRow}>
                        <Text style={smartHydrationSummaryStyle.title}>Smart Hydration</Text>
                        <View style={smartHydrationSummaryStyle.premiumBadge}>
                            <Text style={smartHydrationSummaryStyle.premiumText}>PREMIUM</Text>
                        </View>
                    </View>
                    <Text style={smartHydrationSummaryStyle.subtitle}>Weather unavailable — tap to retry</Text>
                </View>
                <Entypo name="chevron-thin-right" size={28} color={colorPalette.background} />
            </TouchableOpacity>
        );
    }

    if (!recommendation) {
        return null;
    }

    const levelDetails = getHydrationLevelDetails(recommendation.hydrationLevel);
    const goalChange =
        recommendation.goalDifference !== 0
            ? ` · ${recommendation.goalDifference > 0 ? '+' : ''}${recommendation.goalDifference} ml`
            : '';

    return (
        <TouchableOpacity style={smartHydrationSummaryStyle.card} onPress={onPress} activeOpacity={0.85}>
            <View style={smartHydrationSummaryStyle.cardInfo}>
                <View style={smartHydrationSummaryStyle.titleRow}>
                    <Text style={smartHydrationSummaryStyle.emoji}>{levelDetails.emoji}</Text>
                    <Text style={smartHydrationSummaryStyle.title}>Smart Hydration</Text>
                    <View style={smartHydrationSummaryStyle.premiumBadge}>
                        <Text style={smartHydrationSummaryStyle.premiumText}>PREMIUM</Text>
                    </View>
                </View>
                <Text style={smartHydrationSummaryStyle.subtitle}>
                    {recommendation.displayTemperature} · {recommendation.recommendedIntake} ml recommended{goalChange}
                </Text>
            </View>
            <Entypo name="chevron-thin-right" size={28} color={colorPalette.background} />
        </TouchableOpacity>
    );
};

export default SmartHydrationSummaryCard;
