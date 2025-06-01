import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function useAuthStyles() {
    const backgroundColor = useThemeColor({}, 'background'),
        backgroundSecondary = useThemeColor({}, 'backgroundSecondary'),
        textColor = useThemeColor({}, 'text'),
        shadowColor = useThemeColor({}, 'shadow'),
        primaryButton = useThemeColor({}, 'primaryButton');

    return useMemo(() => StyleSheet.create({
        container: {
            flexGrow: 1,
            padding: 20,
            backgroundColor: backgroundColor,
        },
        formContainer: {
            backgroundColor: backgroundSecondary,
            borderRadius: 10,
            padding: 20,
            shadowColor: shadowColor,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: textColor,
            marginBottom: 5,
        },
        subtitle: {
            fontSize: 16,
            color: textColor,
            marginBottom: 30,
        },
        button: {
            backgroundColor: primaryButton,
            borderRadius: 8,
            padding: 15,
            alignItems: 'center',
            marginVertical: 10,
            height: 50,
            justifyContent: 'center',
        },
        buttonText: {
            color: textColor,
            fontSize: 16,
            fontWeight: 'bold',
        },
        loginText: {
            color: textColor,
            fontSize: 14
        },
        bottomContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
        },
        logoContainer: {
            alignItems: 'center',
            marginTop: 60,
            marginBottom: 30,
        },
        logo: {
            width: 80,
            height: 80,
        },
        appName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: textColor,
            marginTop: 10,
        },
    }), [backgroundColor, backgroundSecondary, textColor, shadowColor, primaryButton]);
}