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
import { AdvancedMoodReport, MoodService } from '@/services/moodService';
import PrimaryButton from '@/components/game/PrimaryButton';
import { useGameStyles } from '@/hooks/useGameStyles';
import { Brand, MoodScale } from '@/styles/colors';
import { gameFonts } from '@/styles/gameStyles';

function aspectLabel(t: (key: string) => string, aspect: string): string {
  const key = `mood-note.aspects.${aspect}.title`;
  const label = t(key);
  return label === key ? aspect.replace(/_/g, ' ') : label;
}

export default function ReportsScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const { styles, statusBar, colors } = useGameStyles();
  const [days, setDays] = useState<30 | 90>(30);
  const [report, setReport] = useState<AdvancedMoodReport | null>(null);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (range: 30 | 90) => {
    const result = await MoodService.getAdvancedReport(range);
    setLocked(result.locked);
    setReport(result.report);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load(days).finally(() => setLoading(false));
    }, [load, days])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load(days);
    setRefreshing(false);
  };

  const maxWeekAvg = Math.max(
    1,
    ...(report?.weeklySeries.map((w) => w.average ?? 0) ?? [1])
  );
  const maxDist = Math.max(1, ...(report?.moodDistribution.map((d) => d.count) ?? [1]));
  const maxAspect = Math.max(1, ...(report?.aspectAverages.map((a) => a.average) ?? [1]));

  return (
    <View style={styles.screen}>
      <StatusBar style={statusBar} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[local.back, { color: Brand.greenDark }]}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>{t('reports.title')}</Text>
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
          <View style={local.rangeRow}>
            {([30, 90] as const).map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  local.rangeChip,
                  {
                    backgroundColor: days === value ? Brand.green : colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setDays(value)}
              >
                <Text
                  style={{
                    fontFamily: gameFonts.bold,
                    color: days === value ? '#fff' : colors.text,
                  }}
                >
                  {t('reports.rangeDays', { days: value })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {locked && (
            <View style={styles.lockedBanner}>
              <Text style={styles.panelTitle}>{t('reports.lockedTitle')}</Text>
              <Text style={styles.panelText}>{t('reports.lockedBody')}</Text>
              <PrimaryButton
                title={t('profile.manageSubscription')}
                onPress={() => router.push('/(app)/subscription')}
                style={{ marginTop: 12 }}
              />
            </View>
          )}

          {!locked && report && (
            <>
              <View style={styles.panel}>
                <Text style={styles.panelTitle}>{t('reports.overview')}</Text>
                <Text style={styles.panelText}>
                  {report.averageOverall != null
                    ? t('reports.average', { value: report.averageOverall.toFixed(1) })
                    : t('reports.noData')}
                </Text>
                <Text style={[styles.panelText, { marginTop: 6 }]}>
                  {t('reports.entries', { count: report.entryCount })} · {report.from} → {report.to}
                </Text>
                {report.bestDay && (
                  <Text style={[styles.panelText, { marginTop: 6 }]}>
                    {t('reports.bestDay', {
                      date: report.bestDay.date,
                      score: report.bestDay.score,
                    })}
                  </Text>
                )}
                {report.worstDay && (
                  <Text style={[styles.panelText, { marginTop: 4 }]}>
                    {t('reports.worstDay', {
                      date: report.worstDay.date,
                      score: report.worstDay.score,
                    })}
                  </Text>
                )}
              </View>

              <View style={styles.panel}>
                <Text style={styles.panelTitle}>{t('reports.weekly')}</Text>
                {report.weeklySeries.length === 0 ? (
                  <Text style={styles.panelText}>{t('reports.noData')}</Text>
                ) : (
                  <View style={local.chartRow}>
                    {report.weeklySeries.map((week) => {
                      const height = week.average != null ? (week.average / maxWeekAvg) * 100 : 4;
                      return (
                        <View key={week.weekStart} style={local.barCol}>
                          <View
                            style={[
                              local.vBar,
                              {
                                height,
                                backgroundColor: week.average != null ? Brand.green : colors.border,
                              },
                            ]}
                          />
                          <Text style={[local.barLabel, { color: colors.muted }]}>
                            {week.weekStart.slice(5)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>

              <View style={styles.panel}>
                <Text style={styles.panelTitle}>{t('reports.distribution')}</Text>
                {report.moodDistribution.map((bucket) => {
                  const widthPct = (bucket.count / maxDist) * 100;
                  const color =
                    MoodScale.find((m) => m.level === bucket.score)?.color || Brand.blue;
                  return (
                    <View key={bucket.score} style={local.hBarRow}>
                      <Text style={[local.hBarLabel, { color: colors.text }]}>{bucket.score}</Text>
                      <View style={[local.hTrack, { backgroundColor: colors.border }]}>
                        <View
                          style={[
                            local.hFill,
                            { width: `${Math.max(bucket.count ? 6 : 0, widthPct)}%`, backgroundColor: color },
                          ]}
                        />
                      </View>
                      <Text style={[local.hCount, { color: colors.muted }]}>{bucket.count}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.panel}>
                <Text style={styles.panelTitle}>{t('reports.aspects')}</Text>
                {report.aspectAverages.length === 0 ? (
                  <Text style={styles.panelText}>{t('reports.noData')}</Text>
                ) : (
                  report.aspectAverages.map((row) => (
                    <View key={row.aspect} style={local.hBarRow}>
                      <Text style={[local.aspectLabel, { color: colors.text }]} numberOfLines={1}>
                        {aspectLabel(t, row.aspect)}
                      </Text>
                      <View style={[local.hTrack, { backgroundColor: colors.border }]}>
                        <View
                          style={[
                            local.hFill,
                            {
                              width: `${(row.average / maxAspect) * 100}%`,
                              backgroundColor: Brand.blue,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[local.hCount, { color: colors.muted }]}>
                        {row.average.toFixed(1)}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            </>
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
  rangeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  rangeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 16,
    height: 120,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  vBar: {
    width: '70%',
    borderRadius: 8,
    minHeight: 4,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 10,
    fontFamily: gameFonts.regular,
  },
  hBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  hBarLabel: {
    width: 18,
    fontFamily: gameFonts.bold,
    fontSize: 13,
  },
  aspectLabel: {
    width: 110,
    fontFamily: gameFonts.bold,
    fontSize: 12,
    paddingRight: 6,
  },
  hTrack: {
    flex: 1,
    height: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  hFill: {
    height: '100%',
    borderRadius: 8,
  },
  hCount: {
    width: 28,
    textAlign: 'right',
    fontFamily: gameFonts.bold,
    fontSize: 12,
    marginLeft: 6,
  },
});
