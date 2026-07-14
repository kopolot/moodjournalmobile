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
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { apiClient } from '@/services/apiClient';
import { API_CONFIG, APP_CONFIG } from '@/config/appConfig';
import { MoodService, MoodStats } from '@/services/moodService';
import PrimaryButton from '@/components/game/PrimaryButton';
import XpBar from '@/components/game/XpBar';
import StreakFlame from '@/components/game/StreakFlame';
import { gameFonts, gameStyles } from '@/styles/gameStyles';
import { Brand } from '@/styles/colors';
import { showAlert } from '@/utils/alert';

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [firstname, setFirstname] = useState(user?.firstname ?? '');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setFirstname(user?.firstname ?? '');
      MoodService.getStats().then(setStats);
    }, [user?.firstname])
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      showAlert(t('error'), t('profile.logoutError'));
    }
  };

  const saveProfile = async () => {
    const trimmed = firstname.trim();
    if (trimmed.length < 2) {
      showAlert(t('error'), t('profile.nameInvalid'));
      return;
    }
    try {
      setSaving(true);
      const response = await apiClient.patch(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, {
        firstname: trimmed,
      });
      if (!response.success) {
        showAlert(t('error'), t(response.message?.[0] || 'profile.saveError'));
        return;
      }
      await refreshUser?.();
      setEditing(false);
      showAlert(t('success'), t('profile.saveSuccess'));
    } catch {
      showAlert(t('error'), t('profile.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const toggleLanguage = async (toPl: boolean) => {
    await setLanguage(toPl ? 'pl' : 'en');
  };

  return (
    <ScrollView style={gameStyles.screen} contentContainerStyle={gameStyles.scrollContent}>
      <StatusBar style="dark" />
      <View style={[gameStyles.topBar, { paddingHorizontal: 0 }]}>
        <Text style={gameStyles.brand}>{t('profile.title')}</Text>
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

      <View style={gameStyles.panel}>
        <XpBar
          level={stats?.level ?? 1}
          xpIntoLevel={stats?.xpIntoLevel ?? 0}
          xpPerLevel={stats?.xpPerLevel ?? 100}
        />
        <Text style={[gameStyles.panelText, { marginTop: 10 }]}>
          {t('home.bestStreak', { count: stats?.longestStreak ?? 0 })}
        </Text>
      </View>

      <View style={gameStyles.panel}>
        <Text style={gameStyles.panelTitle}>{t('profile.editName')}</Text>
        {editing ? (
          <>
            <TextInput
              style={styles.input}
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

      <View style={gameStyles.panel}>
        <View style={[gameStyles.row, { justifyContent: 'space-between' }]}>
          <Text style={gameStyles.panelTitle}>{t('profile.languagePl')}</Text>
          <Switch
            value={language?.startsWith('pl')}
            onValueChange={toggleLanguage}
            trackColor={{ true: Brand.green, false: '#CFCFCF' }}
          />
        </View>
      </View>

      <View style={gameStyles.lockedBanner}>
        <Text style={gameStyles.panelTitle}>🚀 MoodDic Plus</Text>
        <Text style={gameStyles.panelText}>{t('profile.plusTeaser')}</Text>
      </View>

      <TouchableOpacity onPress={() => showAlert(t('profile.aboutTitle'), t('profile.aboutBody', { version: APP_CONFIG.VERSION }))}>
        <Text style={styles.aboutLink}>{t('profile.about')}</Text>
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
    borderColor: '#E5E5E5',
    borderRadius: 14,
    padding: 12,
    fontFamily: gameFonts.semi,
    fontSize: 16,
    color: Brand.ink,
    backgroundColor: '#fff',
  },
  aboutLink: {
    fontFamily: gameFonts.bold,
    color: Brand.blue,
    textAlign: 'center',
    marginVertical: 14,
    fontSize: 15,
  },
});
