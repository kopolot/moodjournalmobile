import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Brand } from '@/styles/colors';
import { gameFonts } from '@/styles/gameStyles';

export default function useAuthStyles() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryButton = useThemeColor({}, 'primaryButton');

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          padding: 20,
          backgroundColor: backgroundColor,
        },
        formContainer: {
          backgroundColor: '#fff',
          borderRadius: 20,
          padding: 22,
          borderWidth: 2,
          borderColor: '#E5E5E5',
        },
        title: {
          fontSize: 26,
          fontFamily: gameFonts.extra,
          color: textColor,
          marginBottom: 6,
        },
        subtitle: {
          fontSize: 15,
          fontFamily: gameFonts.regular,
          color: '#777',
          marginBottom: 24,
          lineHeight: 21,
        },
        button: {
          backgroundColor: primaryButton,
          borderRadius: 16,
          padding: 15,
          alignItems: 'center',
          marginVertical: 10,
          height: 54,
          justifyContent: 'center',
          borderBottomWidth: 4,
          borderBottomColor: Brand.greenDark,
        },
        buttonText: {
          color: '#fff',
          fontSize: 17,
          fontFamily: gameFonts.extra,
        },
        loginText: {
          color: textColor,
          fontSize: 14,
          fontFamily: gameFonts.semi,
        },
        bottomContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 20,
          flexWrap: 'wrap',
          gap: 6,
        },
        logoContainer: {
          alignItems: 'center',
          marginTop: 56,
          marginBottom: 24,
        },
        logo: {
          width: 88,
          height: 88,
        },
        appName: {
          fontSize: 32,
          fontFamily: gameFonts.extra,
          color: Brand.ink,
          marginTop: 10,
        },
      }),
    [backgroundColor, textColor, primaryButton]
  );
}
