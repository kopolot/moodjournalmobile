import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import useStyles from '@/hooks/useStyles';
import Checkbox from '@/components/form/Checkbox';
import { useThemeColor } from '@/hooks/useThemeColor';
import useAuthStyles from '@/styles/authStyles';
import { useI18n } from '@/contexts/I18nContext';
import { useFeedback } from '@/contexts/FeedbackContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { t } = useI18n();
  const { showToast } = useFeedback();
  const [isLoading, setIsLoading] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);
  const { forms, buttons } = useStyles();
  const styles = useAuthStyles();
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'text');
  const linkColor = useThemeColor({}, 'link');

  const handleRegister = async () => {
    if (!firstname || !email || !password || !repeatPassword) {
      showToast({ tone: 'error', title: t('error'), message: t('register.errorFields') });
      return;
    }

    if (password !== repeatPassword) {
      showToast({ tone: 'error', title: t('error'), message: t('register.passwordMismatch') });
      return;
    }

    if (!acceptPrivacyPolicy) {
      showToast({ tone: 'error', title: t('error'), message: t('register.privacyPolicyError') });
      return;
    }

    try {
      setIsLoading(true);
      const response = await register(email, password, repeatPassword, firstname, acceptPrivacyPolicy);
      if (response.success) {
        showToast({
          tone: 'success',
          title: t('success'),
          message: t(response.message?.[0] || 'register.success'),
          durationMs: 4000,
        });
        router.replace('/(auth)/login');
      } else {
        showToast({
          tone: 'error',
          title: t('error'),
          message: t(response.message?.[0] || 'register.error'),
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast({ tone: 'error', title: t('error'), message: t('register.error') });
    } finally {
      setIsLoading(false);
    }
  };

  const i18nFirstname = t('register.firstname');
  const i18nEmail = t('register.email');
  const i18nPassword = t('register.password');
  const i18nRepeatPassword = t('register.repeatPassword');

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar style="auto" />

      <View style={styles.logoContainer}>
        <Text style={styles.appName}>MoodDic</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>{t('register.title')}</Text>
        <Text style={styles.subtitle}>{t('register.subtitle')}</Text>

        <TextInput
          style={forms.input}
          placeholder={i18nFirstname}
          value={firstname}
          onChangeText={setFirstname}
          autoCapitalize="none"
          editable={!isLoading}
          placeholderTextColor={placeholderColor}
        />

        <TextInput
          style={forms.input}
          placeholder={i18nEmail}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
          placeholderTextColor={placeholderColor}
        />

        <TextInput
          style={forms.input}
          placeholder={i18nPassword}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
          placeholderTextColor={placeholderColor}
        />

        <TextInput
          style={forms.input}
          placeholder={i18nRepeatPassword}
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          secureTextEntry
          editable={!isLoading}
          placeholderTextColor={placeholderColor}
        />
        
        <Checkbox
          checked={acceptPrivacyPolicy}
          onToggle={() => setAcceptPrivacyPolicy(!acceptPrivacyPolicy)}
          label={t('register.privacyPolicy')}
          disabled={isLoading}
        />

        <TouchableOpacity
          style={[buttons.primary, isLoading && buttons.disabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={buttons.buttonText}>{t('register.submit')}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
          <Text style={{ color: textColor }}>{t('register.alreadyHaveAccount')} </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={isLoading}>
            <Text style={{ color: linkColor }}>
              {t('register.login')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}