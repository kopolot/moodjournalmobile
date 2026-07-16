import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { useI18n } from '@/contexts/I18nContext';
import {
  MoodAnalysis,
  MoodAspectInsight,
  MoodService,
} from '@/services/moodService';
import PrimaryButton from '@/components/game/PrimaryButton';
import { useGameStyles } from '@/hooks/useGameStyles';
import { Brand } from '@/styles/colors';
import { gameFonts, gameStyles } from '@/styles/gameStyles';

function aspectLabel(t: (key: string) => string, aspect: string): string {
  const key = `mood-note.aspects.${aspect}.title`;
  const label = t(key);
  return label === key ? aspect.replace(/_/g, ' ') : label;
}

function tipText(
  t: (key: string, params?: Record<string, unknown>) => string,
  key: string,
  params?: Record<string, string | number>
): string {
  const mapped = { ...params } as Record<string, unknown>;
  if (typeof params?.aspect === 'string') {
    mapped.aspect = aspectLabel(t, params.aspect);
  }
  const value = t(key, mapped);
  return value === key ? key : value;
}

export default function AiCoachScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const { styles, statusBar, colors } = useGameStyles();
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    const result = await MoodService.getAnalysis(refresh);
    setLocked(result.locked);
    setAnalysis(result.analysis);
    setError(result.locked ? null : result.message || null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load(false).finally(() => setLoading(false));
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  };

  const renderAspectRow = (insight: MoodAspectInsight) => {
    const pct = Math.max(8, Math.min(100, (insight.average / 6) * 100));
    const barColor =
      insight.status === 'strength'
        ? Brand.green
        : insight.status === 'focus'
          ? Brand.streak
          : Brand.blue;

    return (
      <View key={insight.aspect} style={local.aspectRow}>
        <View style={local.aspectHeader}>
          <Text style={[local.aspectName, { color: colors.text }]}>
            {aspectLabel(t, insight.aspect)}
          </Text>
          <Text style={[local.aspectAvg, { color: colors.muted }]}>
            {insight.average.toFixed(1)}/6
          </Text>
        </View>
        <View style={[local.barTrack, { backgroundColor: colors.border }]}>
          <View style={[local.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar style={statusBar} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[local.back, { color: Brand.greenDark }]}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>
          {t('analysis.title')}
        </Text>
        <View style={{ width: 48 }} />
      </View>

      {loading ? (
        <View style={local.center}>
          <ActivityIndicator color={Brand.green} size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {locked && (
            <View style={styles.lockedBanner}>
              <Text style={styles.panelTitle}>✨ {t('home.aiTitle')}</Text>
              <Text style={styles.panelText}>{t('home.aiTeaser')}</Text>
              <PrimaryButton
                title={t('profile.manageSubscription')}
                onPress={() => router.push('/(app)/subscription')}
                style={{ marginTop: 12 }}
              />
            </View>
          )}

          {!locked && analysis && !analysis.ready && (
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>{t('analysis.needMoreTitle')}</Text>
              <Text style={styles.panelText}>
                {t('analysis.needMoreBody', {
                  count: analysis.entryCount,
                  min: analysis.minEntries,
                })}
              </Text>
              <PrimaryButton
                title={t('home.startCheckin')}
                onPress={() => router.push('/(app)/mood-note')}
                style={{ marginTop: 12 }}
              />
            </View>
          )}

          {!locked && analysis?.ready && (
            <>
              <View style={gameStyles.heroPanel}>
                <Text style={gameStyles.heroTitle}>
                  {analysis.narrative?.headline ||
                    tipText(t, analysis.summary?.headlineKey || 'analysis.summary.stable')}
                </Text>
                <Text style={gameStyles.heroSubtitle}>
                  {analysis.narrative?.detail ||
                    tipText(
                      t,
                      analysis.summary?.detailKey || 'analysis.summary.detail',
                      analysis.summary?.params
                    )}
                </Text>
                <Text style={[local.meta, { color: colors.onPrimary ?? '#fff' }]}>
                  {t('analysis.meta', {
                    entries: analysis.entryCount,
                    days: analysis.windowDays,
                    trend: t(`analysis.trend.${analysis.trend}`),
                  })}
                  {analysis.engine === 'pattern+llm' ? ` · ${t('analysis.engineLlm')}` : ''}
                </Text>
              </View>

              {analysis.narrative?.tips && analysis.narrative.tips.length > 0 ? (
                <View style={styles.panel}>
                  <Text style={styles.panelTitle}>{t('analysis.narrativeTips')}</Text>
                  {analysis.narrative.tips.map((tip, idx) => (
                    <Text key={`n-${idx}`} style={[styles.panelText, { marginTop: idx ? 8 : 0 }]}>
                      • {tip}
                    </Text>
                  ))}
                </View>
              ) : null}

              <View style={styles.panel}>
                <Text style={styles.panelTitle}>{t('analysis.highlights')}</Text>
                {analysis.highlights.map((h, idx) => (
                  <Text key={`${h.type}-${idx}`} style={[styles.panelText, { marginTop: idx ? 8 : 0 }]}>
                    • {tipText(t, h.titleKey, h.params as Record<string, string | number>)}
                  </Text>
                ))}
              </View>

              <View style={styles.panel}>
                <Text style={styles.panelTitle}>{t('analysis.aspects')}</Text>
                {analysis.aspectInsights.map(renderAspectRow)}
              </View>

              <View style={styles.panel}>
                <Text style={styles.panelTitle}>{t('analysis.coaching')}</Text>
                {analysis.coachingTips.map((tip) => (
                  <View key={tip.id} style={local.tipCard}>
                    <Text style={[local.tipTitle, { color: colors.text }]}>
                      {tipText(t, tip.titleKey, tip.params)}
                    </Text>
                    <Text style={[styles.panelText, { marginTop: 4 }]}>
                      {tipText(t, tip.bodyKey, tip.params)}
                    </Text>
                  </View>
                ))}
              </View>

              <PrimaryButton
                title={t('analysis.refresh')}
                onPress={onRefresh}
                variant="secondary"
              />
            </>
          )}

          {!locked && !analysis && (
            <View style={styles.panel}>
              <Text style={styles.panelText}>{error ? t(error) : t('analysis.loadError')}</Text>
              <PrimaryButton title={t('analysis.refresh')} onPress={onRefresh} style={{ marginTop: 12 }} />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const local = StyleSheet.create({
  back: {
    fontFamily: gameFonts.bold,
    fontSize: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    marginTop: 10,
    fontFamily: gameFonts.regular,
    fontSize: 13,
    opacity: 0.9,
  },
  aspectRow: {
    marginTop: 12,
  },
  aspectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  aspectName: {
    fontFamily: gameFonts.bold,
    fontSize: 14,
    flex: 1,
    paddingRight: 8,
  },
  aspectAvg: {
    fontFamily: gameFonts.bold,
    fontSize: 13,
  },
  barTrack: {
    height: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 8,
  },
  tipCard: {
    marginTop: 12,
    paddingTop: 4,
  },
  tipTitle: {
    fontFamily: gameFonts.extra,
    fontSize: 16,
  },
});
