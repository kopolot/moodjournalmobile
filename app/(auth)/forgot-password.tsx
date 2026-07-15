import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import useStyles from '@/hooks/useStyles';
import { useThemeColor } from '@/hooks/useThemeColor';
import useAuthStyles from '@/styles/authStyles';
import { useI18n } from '@/contexts/I18nContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { AuthService } from '@/services/authService';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { forms, buttons } = useStyles();
  const mutedColor = useThemeColor({}, 'muted');
  const linkColor = useThemeColor({}, 'link');
  const styles = useAuthStyles();
  const { t } = useI18n();
  const { showToast } = useFeedback();

  const submit = async () => {
    if (!email.trim()) {
      showToast({ tone: 'error', message: t('login.errorFields') });
      return;
    }
    try {
      setLoading(true);
      const response = await AuthService.forgotPassword(email.trim());
      if (!response.success) {
        showToast({
          tone: 'error',
          message: t(response.message?.[0] || 'forgot.error'),
        });
        return;
      }
      showToast({
        tone: 'success',
        title: t('success'),
        message: t('forgot.success'),
        durationMs: 4500,
      });
      router.back();
    } catch {
      showToast({ tone: 'error', message: t('forgot.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar style={styles.statusBar} />
      <View style={styles.formContainer}>
        <Text style={styles.title}>{t('forgot.title')}</Text>
        <Text style={styles.subtitle}>{t('forgot.subtitle')}</Text>
        <TextInput
          style={forms.input}
          placeholder={t('login.email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
          placeholderTextColor={mutedColor}
        />
        <TouchableOpacity
          style={[buttons.primary, loading && buttons.disabled]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={buttons.buttonText}>{t('forgot.submit')}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/reset-password')} disabled={loading}>
          <Text style={{ color: linkColor, marginTop: 16, textAlign: 'center' }}>
            {t('forgot.haveToken')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} disabled={loading}>
          <Text style={[styles.loginText, { marginTop: 12, textAlign: 'center' }]}>
            {t('common.back')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
