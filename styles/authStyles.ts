import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Brand } from '@/styles/colors';
import { gameFonts } from '@/styles/gameStyles';

export default function useAuthStyles() {
  const { colors, scheme } = useTheme();

  return useMemo(() => {
    const styles = StyleSheet.create({
      container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: colors.background,
      },
      formContainer: {
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 22,
        borderWidth: 2,
        borderColor: colors.border,
      },
      title: {
        fontSize: 26,
        fontFamily: gameFonts.extra,
        color: colors.text,
        marginBottom: 6,
      },
      subtitle: {
        fontSize: 15,
        fontFamily: gameFonts.regular,
        color: colors.muted,
        marginBottom: 24,
        lineHeight: 21,
      },
      button: {
        backgroundColor: colors.primaryButton,
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
        color: colors.onPrimary,
        fontSize: 17,
        fontFamily: gameFonts.extra,
      },
      loginText: {
        color: colors.text,
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
        color: colors.text,
        marginTop: 10,
      },
      appNameAccent: {
        color: Brand.green,
      },
    });

    return {
      ...styles,
      statusBar: (scheme === 'dark' ? 'light' : 'dark') as 'light' | 'dark',
    };
  }, [colors, scheme]);
}
