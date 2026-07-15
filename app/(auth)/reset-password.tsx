import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import useStyles from '@/hooks/useStyles';
import { useThemeColor } from '@/hooks/useThemeColor';
import useAuthStyles from '@/styles/authStyles';
import { useI18n } from '@/contexts/I18nContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { AuthService } from '@/services/authService';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string }>();
  const [token, setToken] = useState(typeof params.token === 'string' ? params.token : '');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { forms, buttons } = useStyles();
  const mutedColor = useThemeColor({}, 'muted');
  const styles = useAuthStyles();
  const { t } = useI18n();
  const { showToast } = useFeedback();

  const submit = async () => {
    if (!token.trim() || password.length < 6) {
      showToast({ tone: 'error', message: t('reset.errorFields') });
      return;
    }
    if (password !== repeatPassword) {
      showToast({ tone: 'error', message: t('register.passwordMismatch') });
      return;
    }
    try {
      setLoading(true);
      const response = await AuthService.resetPassword(token.trim(), password, repeatPassword);
      if (!response.success) {
        showToast({
          tone: 'error',
          message: t(response.message?.[0] || 'reset.error'),
        });
        return;
      }
      showToast({ tone: 'success', message: t('reset.success') });
      router.replace('/(auth)/login');
    } catch {
      showToast({ tone: 'error', message: t('reset.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar style={styles.statusBar} />
      <View style={styles.formContainer}>
        <Text style={styles.title}>{t('reset.title')}</Text>
        <Text style={styles.subtitle}>{t('reset.subtitle')}</Text>
        <TextInput
          style={forms.input}
          placeholder={t('reset.token')}
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
          editable={!loading}
          placeholderTextColor={mutedColor}
        />
        <TextInput
          style={forms.input}
          placeholder={t('reset.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
          placeholderTextColor={mutedColor}
        />
        <TextInput
          style={forms.input}
          placeholder={t('reset.repeatPassword')}
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          secureTextEntry
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
            <Text style={buttons.buttonText}>{t('reset.submit')}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} disabled={loading}>
          <Text style={[styles.loginText, { marginTop: 16, textAlign: 'center' }]}>
            {t('common.back')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
