import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colorPalette } from '../constants/color';

interface CelebrationModalProps {
    visible: boolean;
    onClose: () => void;
    onViewInsights: () => void;
    consumed: number;
    goal: number;
}

const CONFETTI_COLORS = [
    '#FC5185', // pink
    '#364F6B', // dark blue
    '#4CAF50', // green
    '#FFC107', // amber
    '#00BCD4', // cyan
    '#9C27B0', // purple
    '#FF5722'  // deep orange
];

const CelebrationModal: React.FC<CelebrationModalProps> = ({
    visible,
    onClose,
    onViewInsights,
    consumed,
    goal
}) => {
    const { width, height } = useWindowDimensions();
    const isSmall = width < 380;

    // Animations
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(0.3)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const checkmarkScale = useRef(new Animated.Value(0)).current;

    // Confetti particles state
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        if (visible) {
            // Generate confetti particles
            const generated = Array.from({ length: 45 }).map((_, index) => {
                const startX = Math.random() * width;
                const endX = startX + (Math.random() * 100 - 50); // slight drift
                const size = Math.random() * 8 + 6;
                const isCircle = Math.random() > 0.5;
                const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
                
                return {
                    id: index,
                    startX,
                    endX,
                    size,
                    isCircle,
                    color,
                    animY: new Animated.Value(-20),
                    animX: new Animated.Value(startX),
                    animRotate: new Animated.Value(0)
                };
            });
            setParticles(generated);

            // Animate Modal entrance
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true
                }),
                Animated.timing(cardOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }),
                Animated.spring(cardScale, {
                    toValue: 1,
                    friction: 7,
                    tension: 40,
                    useNativeDriver: true
                })
            ]).start(() => {
                // Success Checkmark spring scale-up
                Animated.spring(checkmarkScale, {
                    toValue: 1,
                    friction: 5,
                    tension: 50,
                    useNativeDriver: true
                }).start();
            });

            // Start confetti animation
            generated.forEach((particle) => {
                const duration = Math.random() * 2000 + 2000; // 2-4 seconds fall
                const delay = Math.random() * 800; // staggered start

                Animated.sequence([
                    Animated.delay(delay),
                    Animated.parallel([
                        Animated.timing(particle.animY, {
                            toValue: height + 20,
                            duration: duration,
                            useNativeDriver: true
                        }),
                        Animated.timing(particle.animX, {
                            toValue: particle.endX,
                            duration: duration,
                            useNativeDriver: true
                        }),
                        Animated.timing(particle.animRotate, {
                            toValue: Math.random() * 720 + 360,
                            duration: duration,
                            useNativeDriver: true
                        })
                    ])
                ]).start();
            });
        } else {
            // Reset animations on hide
            backdropOpacity.setValue(0);
            cardScale.setValue(0.3);
            cardOpacity.setValue(0);
            checkmarkScale.setValue(0);
            setParticles([]);
        }
    }, [visible, width, height]);

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Backdrop overlay */}
                <Animated.View 
                    style={[
                        styles.backdrop, 
                        { opacity: backdropOpacity }
                    ]} 
                />

                {/* Confetti container */}
                <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
                    {particles.map((particle) => {
                        const rotate = particle.animRotate.interpolate({
                            inputRange: [0, 360],
                            outputRange: ['0deg', '360deg']
                        });

                        return (
                            <Animated.View
                                key={particle.id}
                                style={[
                                    styles.confetti,
                                    {
                                        width: particle.size,
                                        height: particle.isCircle ? particle.size : particle.size * 1.5,
                                        borderRadius: particle.isCircle ? particle.size / 2 : 2,
                                        backgroundColor: particle.color,
                                        transform: [
                                            { translateX: particle.animX },
                                            { translateY: particle.animY },
                                            { rotate: rotate }
                                        ]
                                    }
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Modal Container */}
                <Animated.View 
                    style={[
                        styles.container, 
                        { 
                            opacity: cardOpacity,
                            transform: [{ scale: cardScale }]
                        }
                    ]}
                >
                    {/* Success Icon */}
                    <Animated.View style={[styles.iconContainer, { transform: [{ scale: checkmarkScale }] }]}>
                        <Ionicons name="checkmark-circle" size={88} color="#4CAF50" />
                    </Animated.View>

                    <Text style={styles.title}>🎉 Goal Completed!</Text>
                    <Text style={styles.body}>
                        Amazing job! You reached your hydration goal for today.
                    </Text>

                    {/* Stats display */}
                    <View style={styles.statsCard}>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Water Consumed</Text>
                            <Text style={[styles.statValue, { color: colorPalette.primary }]}>
                                {consumed} ml
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Goal</Text>
                            <Text style={styles.statValue}>{goal} ml</Text>
                        </View>
                    </View>

                    <Text style={styles.tipText}>
                        Keep maintaining healthy hydration habits.
                    </Text>

                    {/* Buttons */}
                    <View style={[styles.buttonRow, isSmall && styles.buttonColumn]}>
                        <TouchableOpacity 
                            style={[styles.button, styles.secondaryButton, isSmall && styles.fullWidthButton]} 
                            onPress={onClose}
                        >
                            <Text style={styles.secondaryButtonText}>Continue</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.button, styles.primaryButton, isSmall && styles.fullWidthButton]} 
                            onPress={onViewInsights}
                        >
                            <Text style={styles.primaryButtonText}>View Insights</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(54, 79, 107, 0.4)', // tint matching primary color palette
    },
    confetti: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 99,
    },
    container: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#364F6B',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#364F6B',
        marginBottom: 8,
        textAlign: 'center',
    },
    body: {
        fontSize: 14,
        color: '#7A7A7A',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    statsCard: {
        width: '100%',
        backgroundColor: '#F5F7FA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#7A7A7A',
    },
    statValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#364F6B',
    },
    divider: {
        height: 1,
        backgroundColor: '#EAEAEA',
        marginVertical: 8,
    },
    tipText: {
        fontSize: 12,
        color: '#A0A0A0',
        fontStyle: 'italic',
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonColumn: {
        flexDirection: 'column-reverse',
        gap: 12,
    },
    button: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullWidthButton: {
        width: '100%',
        flex: 0,
    },
    primaryButton: {
        backgroundColor: '#FC5185',
        marginLeft: 8,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        marginRight: 8,
    },
    secondaryButtonText: {
        color: '#7A7A7A',
        fontWeight: '600',
        fontSize: 14,
    }
});

export default CelebrationModal;
