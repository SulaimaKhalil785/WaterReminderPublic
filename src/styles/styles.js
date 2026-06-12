import {StyleSheet} from "react-native";
import {colorPalette} from "../constants/color";

export const commonStyle = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        fontSize: 36,
        marginTop: 12,
        padding: 24,
        alignSelf: 'center',
        width: '100%',
        textAlign: 'center',
        color: colorPalette.primary,
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
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16
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
        borderColor: 'black',
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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.secondary,
        color: colorPalette.background,
        padding: 36,
        margin: 18,
        borderRadius: 30,
    },
    cardInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'start',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.secondary,
        color: colorPalette.background,
    },
    title: {
        color: colorPalette.background,
        fontSize: 24
    },
    text: {
        color: colorPalette.background
    }
});

export const setWaterGoalModalStyle = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        alignSelf: "stretch",
    },
    modalView: {
        margin: 20,
        backgroundColor: colorPalette.background,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignSelf: "stretch",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 40,
        alignSelf: "stretch",
        backgroundColor: colorPalette.tertiary
    },
    disabledButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 40,
        alignSelf: "stretch",
        backgroundColor: colorPalette.disabled
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    input: {
        marginLeft: 36,
        marginTop: 9,
        marginRight: 36,
        padding: 16,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
        marginBottom: 10,
        alignSelf: 'stretch',
        backgroundColor: colorPalette.background,
        fontSize: 36
    },
    inputBlank: {
        marginLeft: 36,
        marginTop: 9,
        marginRight: 36,
        padding: 16,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
        marginBottom: 10,
        alignSelf: 'stretch',
        backgroundColor: colorPalette.background,
        fontSize: 18
    },
});

export const smartHydrationSummaryStyle = StyleSheet.create({
    card: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.primary,
        paddingVertical: 20,
        paddingHorizontal: 24,
        marginHorizontal: 18,
        marginTop: 4,
        marginBottom: 8,
        borderRadius: 30,
    },
    loadingCard: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: {
        flex: 1,
        marginRight: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 4,
    },
    emoji: {
        fontSize: 18,
        marginRight: 6,
    },
    title: {
        color: colorPalette.background,
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    subtitle: {
        color: colorPalette.background,
        fontSize: 14,
        opacity: 0.9,
    },
    loadingText: {
        color: colorPalette.background,
        fontSize: 14,
        marginLeft: 10,
    },
    premiumBadge: {
        backgroundColor: colorPalette.tertiary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    premiumText: {
        color: colorPalette.background,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export const smartHydrationScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorPalette.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 8,
    },
    backButton: {
        marginRight: 12,
    },
    headerTextGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colorPalette.primary,
        marginRight: 10,
    },
    premiumBadge: {
        backgroundColor: colorPalette.tertiary,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    premiumText: {
        color: colorPalette.background,
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    scroll: {
        flex: 1,
        alignSelf: 'stretch',
    },
    scrollContent: {
        paddingHorizontal: 18,
        paddingBottom: 32,
    },
    premiumLockCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginTop: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    premiumLockTitle: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: 'bold',
        color: colorPalette.primary,
        textAlign: 'center',
    },
    premiumLockText: {
        marginTop: 8,
        fontSize: 14,
        color: colorPalette.disabled,
        textAlign: 'center',
        lineHeight: 20,
    },
    centeredState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    stateText: {
        marginTop: 12,
        fontSize: 14,
        color: colorPalette.primary,
    },
    errorCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginTop: 12,
        borderLeftWidth: 4,
        borderLeftColor: colorPalette.tertiary,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colorPalette.tertiary,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: colorPalette.primary,
        marginBottom: 8,
    },
    errorSubtext: {
        fontSize: 13,
        color: colorPalette.disabled,
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: colorPalette.secondary,
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
    },
    retryButtonText: {
        color: colorPalette.background,
        fontWeight: 'bold',
        fontSize: 14,
    },
    weatherCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginTop: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
    },
    weatherHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    weatherEmoji: {
        fontSize: 44,
        marginRight: 16,
    },
    weatherHeaderText: {
        flex: 1,
    },
    weatherLocation: {
        fontSize: 14,
        color: colorPalette.disabled,
        marginBottom: 2,
    },
    weatherTemp: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colorPalette.primary,
    },
    weatherDesc: {
        fontSize: 14,
        color: colorPalette.primary,
        textTransform: 'capitalize',
        marginTop: 2,
    },
    weatherStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 16,
    },
    stat: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: colorPalette.disabled,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colorPalette.primary,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colorPalette.primary,
        marginBottom: 12,
    },
    intakeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    intakeBlock: {
        flex: 1,
        alignItems: 'center',
    },
    intakeLabel: {
        fontSize: 12,
        color: colorPalette.disabled,
        marginBottom: 4,
    },
    intakeValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colorPalette.primary,
    },
    intakeArrow: {
        fontSize: 24,
        color: colorPalette.disabled,
        marginHorizontal: 8,
    },
    message: {
        fontSize: 14,
        lineHeight: 22,
        color: colorPalette.primary,
    },
    tipsCard: {
        backgroundColor: '#FFF9E6',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: '#FFB700',
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF8A00',
        marginBottom: 10,
    },
    tip: {
        fontSize: 13,
        color: colorPalette.primary,
        lineHeight: 20,
        marginBottom: 4,
    },
    mockBanner: {
        backgroundColor: '#E3F2FD',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
    },
    mockText: {
        fontSize: 12,
        color: '#1976D2',
        fontStyle: 'italic',
    },
    actions: {
        flexDirection: 'row',
        marginTop: 8,
    },
    dismissButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: colorPalette.disabled,
        borderRadius: 20,
        paddingVertical: 14,
        alignItems: 'center',
        marginRight: 8,
    },
    dismissButtonText: {
        color: colorPalette.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    applyButton: {
        flex: 2,
        borderRadius: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
});

export const signOffCardStyle = StyleSheet.create({
    card: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.tertiary,
        color: colorPalette.background,
        padding: 36,
        margin: 18,
        borderRadius: 30,
    },
    cardInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'start',
        alignSelf: 'stretch',
        color: colorPalette.background,
    },
    title: {
        color: colorPalette.background,
        fontSize: 24
    },
    text: {
        color: colorPalette.background
    }
});
