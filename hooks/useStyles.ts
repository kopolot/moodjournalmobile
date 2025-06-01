import { StyleSheet } from 'react-native';
import { spacing, radius } from '../styles/styles';
import { useThemeColor } from './useThemeColor';

export default function useStyles() {

    // Typografia
    const typography = StyleSheet.create({
        h1: {
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: spacing.md,
            color: useThemeColor({}, 'text'),
        },
        h2: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: spacing.sm,
            color: useThemeColor({}, 'text'),
        },
        h3: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: spacing.sm,
            color: useThemeColor({}, 'text'),
        },
        body: {
            fontSize: 16,
            lineHeight: 24,
            color: useThemeColor({}, 'text'),
        },
        bodySmall: {
            fontSize: 14,
            lineHeight: 20,
            color: useThemeColor({}, 'text'),
        },
        caption: {
            fontSize: 12,
            lineHeight: 16,
            opacity: 0.7,
            color: useThemeColor({}, 'muted'),
        },
    });

    // Przyciski
    const buttons = StyleSheet.create({
        primary: {
            backgroundColor: useThemeColor({}, 'primaryButton'),
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: radius.md,
            alignItems: 'center',
            justifyContent: 'center',
        },
        secondary: {
            backgroundColor: 'transparent',
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: radius.md,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: useThemeColor({}, 'tint'),
        },
        danger: {
            backgroundColor: useThemeColor({}, 'error'),
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: radius.md,
            alignItems: 'center',
            justifyContent: 'center',
        },
        disabled: {
            backgroundColor: useThemeColor({}, 'secondaryButton'),
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: radius.md,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.7,
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        buttonTextSecondary: {
            color: useThemeColor({}, 'tint'),
            fontWeight: 'bold',
            fontSize: 16,
        },
    });

    // Karty i kontenery
    const containers = StyleSheet.create({
        card: {
            backgroundColor: useThemeColor( {}, 'card'),
            borderRadius: radius.md,
            padding: spacing.md,
            shadowColor: useThemeColor({}, 'shadow'),
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            marginVertical: spacing.sm,
        },
        section: {
            marginBottom: spacing.xl,
        },
        divider: {
            height: 1,
            backgroundColor: useThemeColor({}, 'border'),
            width: '100%',
            marginVertical: spacing.md,
        },
    });

    // Formularze
    const forms = StyleSheet.create({
        input: {
            backgroundColor: useThemeColor({}, 'inputBackground'),
            borderRadius: radius.sm,
            padding: spacing.md,
            fontSize: 16,
            marginBottom: spacing.md,
            borderWidth: 1,
            borderColor: useThemeColor({}, 'border'),
            color: useThemeColor({}, 'text'),
        },
        inputFocused: {
            borderColor: useThemeColor({}, 'tint'),
            backgroundColor: useThemeColor({}, 'background'),
        },
        inputError: {
            borderColor: useThemeColor({}, 'error'),
        },
        errorText: {
            color: useThemeColor({}, 'error'),
            fontSize: 12,
            marginTop: -spacing.sm,
            marginBottom: spacing.sm,
        },
        label: {
            fontSize: 14,
            fontWeight: '500',
            marginBottom: spacing.xs,
            color: useThemeColor({}, 'text'),
        },
        checkbox: {
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: useThemeColor({}, 'border'),
            borderRadius: 3,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        checkboxChecked: {
            backgroundColor: useThemeColor({}, 'tint'),
        },
    });

    // Elementy powiadomień i komunikatów
    const alerts = StyleSheet.create({
        success: {
            backgroundColor: useThemeColor({}, 'success'),
            color: '#fff',
            padding: spacing.md,
            borderRadius: radius.md,
            marginVertical: spacing.sm,
        },
        warning: {
            backgroundColor: useThemeColor({}, 'warning'),
            color: '#fff',
            padding: spacing.md,
            borderRadius: radius.md,
            marginVertical: spacing.sm,
        },
        error: {
            backgroundColor: useThemeColor({}, 'error'),
            color: '#fff',
            padding: spacing.md,
            borderRadius: radius.md,
            marginVertical: spacing.sm,
        },
        info: {
            backgroundColor: useThemeColor({}, 'info'),
            color: '#fff',
            padding: spacing.md,
            borderRadius: radius.md,
            marginVertical: spacing.sm,
        },
        offlineBar: {
            backgroundColor: useThemeColor({}, 'error'),
            padding: spacing.sm,
            width: '100%',
            alignItems: 'center',
            zIndex: 1000,
        },
        offlineText: {
            color: '#fff',
            fontWeight: 'bold',
        },
    });

    // Układy i pozycjonowanie
    const layout = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        spaceBetween: {
            justifyContent: 'space-between',
        },
        center: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        fullWidth: {
            width: '100%',
        },
        fullHeight: {
            height: '100%',
        },
        screenContainer: {
            flex: 1,
            padding: spacing.md,
        },
    });


    return {
        typography,
        buttons,
        containers,
        forms,
        alerts,
        layout,
        spacing,
        radius,
    };
}