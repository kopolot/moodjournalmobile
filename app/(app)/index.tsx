import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { MoodService, MoodStats } from '@/services/moodService';
import { gameStyles } from '@/styles/gameStyles';
import { useGameStyles } from '@/hooks/useGameStyles';
import PrimaryButton from '@/components/game/PrimaryButton';
import XpBar from '@/components/game/XpBar';
import StreakFlame from '@/components/game/StreakFlame';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useI18n();
  const { styles, statusBar } = useGameStyles();
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const next = await MoodService.getStats();
    setStats(next);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const loggedToday = stats?.loggedToday ?? false;

  return (
    <View style={styles.screen}>
      <StatusBar style={statusBar} />
      <View style={styles.topBar}>
        <Text style={styles.brand}>
          Mood<Text style={gameStyles.brandAccent}>Dic</Text>
        </Text>
        <StreakFlame streak={stats?.currentStreak ?? 0} compact />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={gameStyles.heroPanel}>
          <Text style={gameStyles.heroTitle}>
            {t('home.greeting', { name: user?.firstname || '!' })}
          </Text>
          <Text style={gameStyles.heroSubtitle}>
            {loggedToday ? t('home.doneToday') : t('home.questToday')}
          </Text>
          <PrimaryButton
            title={loggedToday ? t('home.addAnother') : t('home.startCheckin')}
            onPress={() => router.push('/(app)/mood-note')}
            variant="light"
          />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{t('home.progress')}</Text>
          <XpBar
            level={stats?.level ?? 1}
            xpIntoLevel={stats?.xpIntoLevel ?? 0}
            xpPerLevel={stats?.xpPerLevel ?? 100}
          />
          <Text style={[styles.panelText, { marginTop: 10 }]}>
            {t('home.totalXp', { xp: stats?.xpTotal ?? 0 })}
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{t('home.weekPulse')}</Text>
          <Text style={styles.panelText}>
            {stats?.averageOverall7d != null
              ? t('home.average', { value: stats.averageOverall7d.toFixed(1) })
              : t('home.noAverage')}
          </Text>
          <Text style={[styles.panelText, { marginTop: 6 }]}>
            {t('home.entries', { count: stats?.entryCount ?? 0 })} ·{' '}
            {t('home.bestStreak', { count: stats?.longestStreak ?? 0 })}
          </Text>
        </View>

        <View style={styles.lockedBanner}>
          <Text style={styles.panelTitle}>✨ {t('home.aiTitle')}</Text>
          <Text style={styles.panelText}>
            {stats?.aiAnalysisUnlocked ? t('home.aiUnlocked') : t('home.aiTeaser')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
