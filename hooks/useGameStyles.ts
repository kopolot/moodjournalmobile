import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Brand } from '@/styles/colors';
import { gameFonts } from '@/styles/gameStyles';

/** Themed variants of the static gameStyles tokens used across app screens. */
export function useGameStyles() {
  const { colors, scheme } = useTheme();

  return useMemo(
    () => ({
      fonts: gameFonts,
      scheme,
      colors,
      statusBar: scheme === 'dark' ? ('light' as const) : ('dark' as const),
      styles: StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollContent: {
          paddingHorizontal: 20,
          paddingBottom: 120,
        },
        topBar: {
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.background,
        },
        brand: {
          fontFamily: gameFonts.extra,
          fontSize: 28,
          color: colors.text,
          letterSpacing: -0.5,
        },
        panel: {
          backgroundColor: colors.card,
          borderRadius: 20,
          padding: 18,
          marginBottom: 14,
          borderWidth: 2,
          borderColor: colors.border,
        },
        panelTitle: {
          fontFamily: gameFonts.bold,
          fontSize: 17,
          color: colors.text,
          marginBottom: 6,
        },
        panelText: {
          fontFamily: gameFonts.regular,
          fontSize: 15,
          color: colors.muted,
          lineHeight: 21,
        },
        sectionTitle: {
          fontFamily: gameFonts.extra,
          fontSize: 20,
          color: colors.text,
          marginBottom: 10,
          marginTop: 8,
        },
        emptyTitle: {
          fontFamily: gameFonts.extra,
          fontSize: 22,
          color: colors.text,
          marginBottom: 8,
          textAlign: 'center',
        },
        emptyText: {
          fontFamily: gameFonts.regular,
          fontSize: 15,
          color: colors.muted,
          textAlign: 'center',
          lineHeight: 22,
          marginBottom: 20,
        },
        pill: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          borderRadius: 999,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 2,
          borderColor: colors.border,
          gap: 6,
        },
        pillText: {
          fontFamily: gameFonts.extra,
          fontSize: 14,
          color: colors.text,
        },
        lockedBanner: {
          backgroundColor: scheme === 'dark' ? '#3A3420' : Brand.creamWash,
          borderRadius: 20,
          padding: 18,
          borderWidth: 2,
          borderColor: Brand.gold,
          marginBottom: 14,
        },
        secondaryBtn: {
          backgroundColor: colors.card,
          borderRadius: 16,
          paddingVertical: 14,
          paddingHorizontal: 18,
          alignItems: 'center',
          borderWidth: 2,
          borderColor: colors.border,
          borderBottomWidth: 4,
        },
        secondaryBtnText: {
          fontFamily: gameFonts.extra,
          fontSize: 16,
          color: colors.text,
        },
        footer: {
          backgroundColor: colors.background,
        },
        input: {
          borderWidth: 2,
          borderColor: colors.border,
          borderRadius: 16,
          padding: 14,
          fontFamily: gameFonts.regular,
          fontSize: 16,
          color: colors.text,
          backgroundColor: colors.inputBackground,
        },
      }),
    }),
    [colors, scheme]
  );
}
