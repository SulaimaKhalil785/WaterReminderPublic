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

export const smartHydrationSummaryStyle = StyleSheet.create({
    card: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: '#364F6B',
        paddingVertical: 20,
        paddingHorizontal: 24,
        marginHorizontal: 18,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardInfo: {
        flex: 1,
    },
    loadingCard: {
        justifyContent: 'center',
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    emoji: {
        fontSize: 18,
        marginRight: 8,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: 13,
        opacity: 0.8,
    },
    premiumBadge: {
        backgroundColor: '#FC5185',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    premiumText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export const smartHydrationScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
        backgroundColor: '#F5F5F5',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#364F6B',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        alignSelf: 'center',
        width: '100%',
    },
    weatherCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 30,
        marginTop: 10,
        marginBottom: 20,
        borderLeftWidth: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    weatherHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    weatherEmoji: {
        fontSize: 50,
        marginRight: 25,
    },
    weatherHeaderText: {
        flex: 1,
    },
    weatherLocation: {
        fontSize: 14,
        color: '#7A7A7A',
        marginBottom: 2,
    },
    weatherTemp: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#364F6B',
    },
    weatherDesc: {
        fontSize: 14,
        color: '#7A7A7A',
        textTransform: 'capitalize',
    },
    weatherStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 20,
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: '#7A7A7A',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#364F6B',
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 25,
        marginBottom: 15,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#364F6B',
        marginBottom: 20,
    },
    intakeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    intakeBlock: {
        alignItems: 'center',
        minWidth: 150,
    },
    intakeLabel: {
        fontSize: 13,
        color: '#7A7A7A',
        marginBottom: 8,
    },
    intakeValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#364F6B',
    },
    intakeArrow: {
        fontSize: 24,
        color: '#7A7A7A',
        marginHorizontal: 50,
    },
    message: {
        fontSize: 14,
        lineHeight: 24,
        color: '#364F6B',
    },
    tipsCard: {
        backgroundColor: '#FFF9E6',
        borderRadius: 15,
        padding: 25,
        marginBottom: 25,
        borderLeftWidth: 4,
        borderLeftColor: '#FFB700',
    },
    tipsTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FF8A00',
        marginBottom: 12,
    },
    tip: {
        fontSize: 14,
        color: '#364F6B',
        lineHeight: 22,
        marginBottom: 8,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    dismissButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
        marginRight: 15,
    },
    dismissButtonText: {
        color: '#7A7A7A',
        fontWeight: '600',
        fontSize: 15,
    },
    applyButton: {
        flex: 2,
        backgroundColor: '#FC5185',
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    errorCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 25,
        marginTop: 10,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#FC5185',
        elevation: 2,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#364F6B',
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#7A7A7A',
        lineHeight: 22,
        marginBottom: 16,
    },
    retryButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#364F6B',
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 18,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    premiumLockCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 50,
        marginTop: 40,
        alignItems: 'center',
        elevation: 3,
    },
    premiumLockTitle: {
        marginTop: 20,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#364F6B',
    },
    premiumLockText: {
        marginTop: 12,
        fontSize: 15,
        color: '#7A7A7A',
        textAlign: 'center',
        lineHeight: 22,
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
        paddingVertical: 20,
        paddingHorizontal: 24,
        marginHorizontal: 18,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.secondary,
    },
    title: {
        color: colorPalette.background,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    text: {
        color: colorPalette.background,
        fontSize: 13,
        opacity: 0.8,
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

export const signOffCardStyle = StyleSheet.create({
    card: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: colorPalette.tertiary,
        paddingVertical: 20,
        paddingHorizontal: 24,
        marginHorizontal: 18,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
    title: {
        color: colorPalette.background,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    text: {
        color: colorPalette.background,
        fontSize: 13,
        opacity: 0.8,
    }
});
