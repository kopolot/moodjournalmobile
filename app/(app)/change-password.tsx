import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useI18n } from '@/contexts/I18nContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AuthService } from '@/services/authService';
import PrimaryButton from '@/components/game/PrimaryButton';
import { gameFonts, gameStyles } from '@/styles/gameStyles';
import { Brand } from '@/styles/colors';

export default function ChangePasswordScreen() {
  const { t } = useI18n();
  const { showToast } = useFeedback();
  const { colors, scheme } = useTheme();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!currentPassword || password.length < 6) {
      showToast({ tone: 'error', message: t('changePassword.errorFields') });
      return;
    }
    if (password !== repeatPassword) {
      showToast({ tone: 'error', message: t('register.passwordMismatch') });
      return;
    }
    try {
      setLoading(true);
      const response = await AuthService.changePassword(
        currentPassword,
        password,
        repeatPassword
      );
      if (!response.success) {
        showToast({
          tone: 'error',
          message: t(response.message?.[0] || 'changePassword.error'),
        });
        return;
      }
      showToast({ tone: 'success', message: t('changePassword.success') });
      router.back();
    } catch {
      showToast({ tone: 'error', message: t('changePassword.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[gameStyles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={gameStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={[gameStyles.topBar, { backgroundColor: colors.background, paddingHorizontal: 0 }]}>
        <Text style={[gameStyles.brand, { color: colors.text }]}>{t('changePassword.title')}</Text>
      </View>
      <View style={[gameStyles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[gameStyles.panelText, { color: colors.muted, marginBottom: 12 }]}>
          {t('changePassword.subtitle')}
        </Text>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.border }]}
          placeholder={t('changePassword.current')}
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.border }]}
          placeholder={t('changePassword.next')}
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.border }]}
          placeholder={t('changePassword.repeat')}
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={repeatPassword}
          onChangeText={setRepeatPassword}
        />
        <PrimaryButton
          title={t('changePassword.submit')}
          onPress={submit}
          loading={loading}
          style={{ marginTop: 8 }}
        />
        <PrimaryButton
          title={t('common.cancel')}
          variant="secondary"
          onPress={() => router.back()}
          style={{ marginTop: 10 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 12,
    fontFamily: gameFonts.semi,
    fontSize: 16,
    marginBottom: 10,
    borderColor: Brand.mist,
  },
});
