import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import { gameFonts } from '@/styles/gameStyles';

export default function Offline() {
  const { t } = useI18n();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>{t('app.offline.title')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    fontFamily: gameFonts.bold,
    fontSize: 18,
    textAlign: 'center',
  },
});
