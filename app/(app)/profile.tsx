import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import { apiClient } from '@/services/apiClient';
import { API_CONFIG, APP_CONFIG } from '@/config/appConfig';
import { MoodService, MoodStats } from '@/services/moodService';
import { NotificationService } from '@/services/notificationService';
import { PreferencesService } from '@/services/preferencesService';
import PrimaryButton from '@/components/game/PrimaryButton';
import XpBar from '@/components/game/XpBar';
import StreakFlame from '@/components/game/StreakFlame';
import { gameFonts, gameStyles } from '@/styles/gameStyles';
import { Brand } from '@/styles/colors';
import { useFeedback } from '@/contexts/FeedbackContext';
import { LANGUAGE_OPTIONS, AppLanguage } from '@/utils/preferences';

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const { darkMode, setDarkMode, colors, scheme } = useTheme();
  const { showToast, showConfirm } = useFeedback();
  const router = useRouter();
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [firstname, setFirstname] = useState(user?.firstname ?? '');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [dailyNotifications, setDailyNotifications] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setFirstname(user?.firstname ?? '');
      MoodService.getStats().then(setStats);
      NotificationService.isEnabled().then(setDailyNotifications);
      if (typeof user?.preferences?.darkMode === 'boolean') {
        // keep local ThemeContext; already hydrated on login
      }
      if (typeof user?.preferences?.dailyNotifications === 'boolean') {
        setDailyNotifications(user.preferences.dailyNotifications);
      }
    }, [user?.firstname, user?.preferences?.dailyNotifications, user?.preferences?.darkMode])
  );

  const handleLogout = async () => {
    const ok = await showConfirm({
      title: t('profile.logout'),
      message: t('profile.logoutConfirm'),
      confirmLabel: t('profile.logout'),
      cancelLabel: t('common.cancel'),
      destructive: true,
    });
    if (!ok) return;
    try {
      await logout();
    } catch {
      showToast({ tone: 'error', title: t('error'), message: t('profile.logoutError') });
    }
  };

  const saveProfile = async () => {
    const trimmed = firstname.trim();
    if (trimmed.length < 2) {
      showToast({ tone: 'error', title: t('error'), message: t('profile.nameInvalid') });
      return;
    }
    try {
      setSaving(true);
      const response = await apiClient.patch(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, {
        firstname: trimmed,
      });
      if (!response.success) {
        showToast({
          tone: 'error',
          title: t('error'),
          message: t(response.message?.[0] || 'profile.saveError'),
        });
        return;
      }
      await refreshUser?.();
      setEditing(false);
      showToast({ tone: 'success', title: t('success'), message: t('profile.saveSuccess') });
    } catch {
      showToast({ tone: 'error', title: t('error'), message: t('profile.saveError') });
    } finally {
      setSaving(false);
    }
  };

  const selectLanguage = async (code: AppLanguage) => {
    await setLanguage(code);
    const response = await PreferencesService.setLanguage(code);
    if (!response.success) {
      showToast({ tone: 'error', message: t('profile.prefSyncError') });
      return;
    }
    await refreshUser?.();
  };

  const toggleNotifications = async (enabled: boolean) => {
    setDailyNotifications(enabled);
    const ok = await NotificationService.setEnabled(enabled);
    const response = await PreferencesService.setDailyNotifications(enabled);
    if (!response.success) {
      showToast({ tone: 'info', message: t('profile.prefSyncError') });
    } else {
      await refreshUser?.();
    }
    if (enabled && !NotificationService.isSupported()) {
      showToast({ tone: 'info', message: t('profile.notificationsExpoGo') });
      return;
    }
    if (enabled && !ok) {
      setDailyNotifications(false);
      await PreferencesService.setDailyNotifications(false);
      showToast({ tone: 'info', message: t('profile.notificationsDenied') });
      return;
    }
    showToast({
      tone: 'success',
      message: enabled ? t('profile.notificationsOn') : t('profile.notificationsOff'),
    });
  };

  const toggleDarkMode = async (enabled: boolean) => {
    await setDarkMode(enabled);
    const response = await PreferencesService.setDarkMode(enabled);
    if (!response.success) {
      showToast({ tone: 'info', message: t('profile.prefSyncError') });
      return;
    }
    await refreshUser?.();
    showToast({
      tone: 'success',
      message: enabled ? t('profile.darkModeOn') : t('profile.darkModeOff'),
    });
  };

  return (
    <ScrollView
      style={[gameStyles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={gameStyles.scrollContent}
    >
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={[gameStyles.topBar, { paddingHorizontal: 0, backgroundColor: colors.background }]}>
        <Text style={[gameStyles.brand, { color: colors.text }]}>{t('profile.title')}</Text>
      </View>

      <View style={[gameStyles.heroPanel, { backgroundColor: Brand.blue }]}>
        <Text style={gameStyles.heroTitle}>{user?.firstname || '—'}</Text>
        <Text style={gameStyles.heroSubtitle}>{user?.email}</Text>
        <View style={gameStyles.row}>
          <StreakFlame streak={stats?.currentStreak ?? 0} />
          <View style={styles.statChip}>
            <Text style={styles.statChipText}>LVL {stats?.level ?? 1}</Text>
          </View>
        </View>
      </View>

      <View style={[gameStyles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <XpBar
          level={stats?.level ?? 1}
          xpIntoLevel={stats?.xpIntoLevel ?? 0}
          xpPerLevel={stats?.xpPerLevel ?? 100}
        />
        <Text style={[gameStyles.panelText, { marginTop: 10, color: colors.muted }]}>
          {t('home.bestStreak', { count: stats?.longestStreak ?? 0 })}
        </Text>
      </View>

      <View style={[gameStyles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[gameStyles.panelTitle, { color: colors.text }]}>{t('profile.editName')}</Text>
        {editing ? (
          <>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                },
              ]}
              value={firstname}
              onChangeText={setFirstname}
              maxLength={50}
            />
            <View style={[gameStyles.row, { marginTop: 10 }]}>
              <PrimaryButton
                title={t('common.cancel')}
                variant="secondary"
                onPress={() => {
                  setFirstname(user?.firstname ?? '');
                  setEditing(false);
                }}
                style={{ flex: 1 }}
              />
              <PrimaryButton
                title={t('common.save')}
                onPress={saveProfile}
                loading={saving}
                style={{ flex: 1 }}
              />
            </View>
          </>
        ) : (
          <PrimaryButton
            title={t('profile.changeName')}
            variant="secondary"
            onPress={() => setEditing(true)}
          />
        )}
      </View>

      <View style={[gameStyles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[gameStyles.panelTitle, { color: colors.text }]}>{t('profile.languageTitle')}</Text>
        <Text style={[gameStyles.panelText, { color: colors.muted, marginBottom: 10 }]}>
          {t('profile.languageHint')}
        </Text>
        <View style={styles.langRow}>
          {LANGUAGE_OPTIONS.map((opt) => {
            const active = language?.startsWith(opt.code);
            return (
              <TouchableOpacity
                key={opt.code}
                style={[
                  styles.langChip,
                  {
                    borderColor: active ? Brand.green : colors.border,
                    backgroundColor: active ? Brand.greenSoft : colors.inputBackground,
                  },
                ]}
                onPress={() => selectLanguage(opt.code)}
              >
                <Text
                  style={[
                    styles.langChipText,
                    { color: active ? Brand.greenDark : colors.text },
                  ]}
                >
                  {t(opt.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={[gameStyles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[gameStyles.row, { justifyContent: 'space-between' }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[gameStyles.panelTitle, { color: colors.text }]}>
              {t('profile.darkMode')}
            </Text>
            <Text style={[gameStyles.panelText, { color: colors.muted }]}>
              {t('profile.darkModeHint')}
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ true: Brand.green, false: '#CFCFCF' }}
          />
        </View>
      </View>

      <View style={[gameStyles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[gameStyles.row, { justifyContent: 'space-between' }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[gameStyles.panelTitle, { color: colors.text }]}>
              {t('profile.dailyNotifications')}
            </Text>
            <Text style={[gameStyles.panelText, { color: colors.muted }]}>
              {t('profile.dailyNotificationsHint')}
            </Text>
          </View>
          <Switch
            value={dailyNotifications}
            onValueChange={toggleNotifications}
            trackColor={{ true: Brand.green, false: '#CFCFCF' }}
          />
        </View>
      </View>

      <View style={[gameStyles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[gameStyles.panelTitle, { color: colors.text }]}>
          {t('changePassword.title')}
        </Text>
        <PrimaryButton
          title={t('profile.changePassword')}
          variant="secondary"
          onPress={() => router.push('/(app)/change-password')}
        />
      </View>

      <View style={gameStyles.lockedBanner}>
        <Text style={gameStyles.panelTitle}>
          {t('profile.planTitle', { tier: (stats?.subscriptionTier || 'free').toUpperCase() })}
        </Text>
        <Text style={gameStyles.panelText}>{t('profile.plusTeaser')}</Text>
        <PrimaryButton
          title={t('profile.manageSubscription')}
          variant="light"
          onPress={() => router.push('/(app)/subscription')}
          style={{ marginTop: 12 }}
        />
      </View>

      <TouchableOpacity
        onPress={() =>
          showToast({
            tone: 'info',
            title: t('profile.aboutTitle'),
            message: t('profile.aboutBody', { version: APP_CONFIG.VERSION }),
            durationMs: 4000,
          })
        }
      >
        <Text style={[styles.aboutLink, { color: colors.link }]}>{t('profile.about')}</Text>
      </TouchableOpacity>

      <PrimaryButton
        title={t('profile.logout')}
        onPress={handleLogout}
        style={{ backgroundColor: Brand.red, borderBottomColor: '#C93434', marginTop: 8 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statChip: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statChipText: {
    fontFamily: gameFonts.extra,
    color: '#fff',
    fontSize: 14,
  },
  input: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 12,
    fontFamily: gameFonts.semi,
    fontSize: 16,
  },
  aboutLink: {
    fontFamily: gameFonts.bold,
    textAlign: 'center',
    marginVertical: 14,
    fontSize: 15,
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  langChip: {
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  langChipText: {
    fontFamily: gameFonts.bold,
    fontSize: 15,
  },
});
