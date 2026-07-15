import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { useI18n } from '@/contexts/I18nContext';
import { MoodEntry, MoodService } from '@/services/moodService';
import { MoodScale, Brand } from '@/styles/colors';
import { gameFonts, gameStyles } from '@/styles/gameStyles';
import PrimaryButton from '@/components/game/PrimaryButton';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function HistoryScreen() {
  const { t, language } = useI18n();
  const { showToast, showConfirm } = useFeedback();
  const { colors, scheme } = useTheme();
  const router = useRouter();
  const [items, setItems] = useState<MoodEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const result = await MoodService.list(50, 0);
    setItems(result.items);
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

  const onDelete = async (entry: MoodEntry) => {
    const accepted = await showConfirm({
      title: t('history.deleteTitle'),
      message: t('history.deleteBody'),
      confirmLabel: t('history.deleteConfirm'),
      cancelLabel: t('common.cancel'),
      destructive: true,
    });
    if (!accepted) return;

    const ok = await MoodService.remove(entry.id);
    if (ok) {
      setItems((prev) => prev.filter((item) => item.id !== entry.id));
      showToast({ tone: 'success', message: t('history.deleteSuccess') });
    } else {
      showToast({ tone: 'error', title: t('error'), message: t('history.deleteError') });
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(language === 'pl' ? 'pl-PL' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <View style={[gameStyles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={[gameStyles.topBar, { backgroundColor: colors.background }]}>
        <Text style={[gameStyles.brand, { color: colors.text }]}>{t('history.title')}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          gameStyles.scrollContent,
          items.length === 0 && { flexGrow: 1 },
        ]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={gameStyles.emptyState}>
            <Text style={gameStyles.emptyEmoji}>📓</Text>
            <Text style={gameStyles.emptyTitle}>{t('history.emptyTitle')}</Text>
            <Text style={gameStyles.emptyText}>{t('history.emptyBody')}</Text>
            <PrimaryButton
              title={t('home.startCheckin')}
              onPress={() => router.push('/(app)/mood-note')}
            />
          </View>
        }
        renderItem={({ item }) => {
          const scale = MoodScale[Math.max(0, Math.min(5, item.overallMood - 1))];
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() =>
                router.push({ pathname: '/(app)/mood-note', params: { id: item.id } })
              }
              onLongPress={() => onDelete(item)}
              delayLongPress={350}
            >
              <View style={[styles.badge, { backgroundColor: scale.color }]}>
                <Text style={styles.badgeEmoji}>{scale.emoji}</Text>
              </View>
              <View style={styles.body}>
                <Text style={[styles.title, { color: colors.text }]}>
                  {t(scale.labelKey)} · {item.overallMood}/6
                </Text>
                <Text style={[styles.meta, { color: colors.muted }]}>{formatDate(item.createdAt)}</Text>
                {item.note ? (
                  <Text style={[styles.note, { color: colors.muted }]} numberOfLines={2}>
                    {item.note}
                  </Text>
                ) : null}
              </View>
              <View style={styles.xpChip}>
                <Text style={styles.xpText}>+{item.xpEarned}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: { fontSize: 28 },
  body: { flex: 1 },
  title: {
    fontFamily: gameFonts.extra,
    fontSize: 16,
    color: Brand.ink,
  },
  meta: {
    fontFamily: gameFonts.semi,
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  note: {
    fontFamily: gameFonts.regular,
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  xpChip: {
    backgroundColor: '#FFF4CC',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: Brand.gold,
  },
  xpText: {
    fontFamily: gameFonts.extra,
    fontSize: 13,
    color: Brand.ink,
  },
});
