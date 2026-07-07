import { StyleSheet } from "react-native";
import { colorPalette } from "../constants/color";

export const commonStyle = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        fontSize: 36,
        marginTop: 12,
        padding: 24,
        color: colorPalette.primary,
        textAlign: "center",
        alignSelf: "stretch"
    },
});

export const homeStyle = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.background
    },
    progress: {
        margin: 16
    },
    list: {
        alignSelf: 'stretch',
        flexGrow: 1
    },
});

export const settingsStyle = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.background
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        alignSelf: "stretch",
        marginTop: 12,
        padding: 24,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 24,
        color: colorPalette.primary,
    },
});

export const waterRecordItemStyle = StyleSheet.create({
    item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 32
    },
    detailText: {
        fontWeight: 'bold',
        color: colorPalette.secondary,
    }
});

export const signInStyle = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.primary
    },
    header: {
        fontWeight: 'bold',
        fontSize: 36,
        marginTop: 12,
        padding: 24,
        marginLeft: -80,
        color: colorPalette.background
    },
    inputContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    input: {
        marginLeft: 36,
        marginTop: 9,
        marginRight: 36,
        padding: 16,
        borderWidth: 1,
        borderColor: 'none',
        borderRadius: 15,
        marginBottom: 10,
        alignSelf: 'stretch',
        backgroundColor: colorPalette.background
    },
    signInButton: {
        marginLeft: 36,
        marginTop: 48,
        marginRight: 36,
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        alignSelf: 'stretch',
        backgroundColor: colorPalette.tertiary,
    },
    signInText: {
        color: colorPalette.background
    },
    errorText: {
        color: colorPalette.tertiary
    },
    loadingContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.secondary
    },
});

export const setWaterGoalCardStyle = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.secondary,
        padding: 16,
        marginHorizontal: 18,
        borderRadius: 16,
        marginBottom: 6,
        minHeight: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardInfo: {
        flex: 1,
    },
    title: {
        color: colorPalette.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 13,
    }
});

export const smartHydrationScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E293B',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 60,
        alignSelf: 'center',
        width: '100%',
        flexGrow: 1,
    },
    loadingState: {
        flex: 1,
        minHeight: 420,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#364F6B',
        textAlign: 'center',
    },
    premiumLockCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    premiumLockTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1E293B',
        marginTop: 24,
        marginBottom: 16,
    },
    premiumLockText: {
        fontSize: 17,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 26,
    },
    errorCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#991B1B',
        marginBottom: 8,
    },
    errorText: {
        fontSize: 15,
        color: '#B91C1C',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#1E293B',
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 30,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
    weatherCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        borderLeftWidth: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    weatherHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    weatherEmoji: {
        fontSize: 56,
        marginRight: 20,
    },
    weatherHeaderText: {
        flex: 1,
    },
    weatherLocation: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    weatherTemp: {
        fontSize: 48,
        fontWeight: '900',
        color: '#1E293B',
        marginVertical: 2,
    },
    weatherDesc: {
        fontSize: 17,
        fontWeight: '500',
        color: '#475569',
        textTransform: 'capitalize',
    },
    weatherStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 24,
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94A3B8',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 16,
        marginLeft: 4,
    },
    intakeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    intakeBlock: {
        flex: 1,
        alignItems: 'center',
    },
    intakeLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94A3B8',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    intakeValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
    },
    intakeArrow: {
        fontSize: 24,
        color: '#CBD5E1',
        marginHorizontal: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#334155',
        lineHeight: 26,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    tipsCard: {
        backgroundColor: '#FFFBEB',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    tipsTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: '#92400E',
        marginBottom: 16,
    },
    tip: {
        fontSize: 16,
        color: '#B45309',
        marginBottom: 10,
        lineHeight: 24,
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    dismissButton: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dismissButtonText: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '700',
    },
    applyButton: {
        flex: 2,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FC5185',
        shadowColor: "#FC5185",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#CBD5E1',
        shadowOpacity: 0,
        elevation: 0,
    },
    applyButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '700',
    },
});

export const smartHydrationSummaryStyle = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.primary,
        padding: 16,
        marginHorizontal: 18,
        borderRadius: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardInfo: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    premiumBadge: {
        backgroundColor: colorPalette.tertiary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    premiumText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 13,
    },
});

export const setWaterGoalModalStyle = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '90%',
        maxWidth: 360,
        backgroundColor: colorPalette.background,
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    button: {
        borderRadius: 25,
        padding: 12,
        elevation: 2,
        alignSelf: "stretch",
        backgroundColor: colorPalette.tertiary,
        height: 50,
        justifyContent: 'center',
    },
    disabledButton: {
        borderRadius: 25,
        padding: 12,
        elevation: 2,
        alignSelf: "stretch",
        backgroundColor: colorPalette.disabled,
        height: 50,
        justifyContent: 'center',
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colorPalette.primary,
        marginBottom: 20,
        textAlign: "center"
    },
    input: {
        width: '100%',
        padding: 16,
        borderWidth: 1.5,
        borderColor: colorPalette.primary,
        borderRadius: 15,
        marginBottom: 20,
        backgroundColor: colorPalette.background,
        fontSize: 24,
        textAlign: 'center'
    },
    inputBlank: {
        width: '100%',
        padding: 16,
        borderWidth: 1.5,
        borderColor: '#DDD',
        borderRadius: 15,
        marginBottom: 20,
        backgroundColor: colorPalette.background,
        fontSize: 24,
        textAlign: 'center'
    },
});

export const signOffCardStyle = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.tertiary,
        padding: 16,
        marginHorizontal: 18,
        borderRadius: 16,
        marginBottom: 6,
        minHeight: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardInfo: {
        flex: 1,
    },
    title: {
        color: colorPalette.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 13,
    }
});
