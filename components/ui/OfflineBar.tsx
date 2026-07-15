import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@/contexts/I18nContext';
import { gameFonts } from '@/styles/gameStyles';

export default function OfflineBar() {
  const { t } = useI18n();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineText}>{t('app.offline.banner')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  offlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    color: '#fff',
    fontFamily: gameFonts.bold,
    fontSize: 14,
    textAlign: 'center',
  },
});
