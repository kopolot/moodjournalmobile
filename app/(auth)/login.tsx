import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import useStyles from '@/hooks/useStyles';
import { useThemeColor } from '@/hooks/useThemeColor';
import useAuthStyles from '@/styles/authStyles';
import { useI18n } from '@/contexts/I18nContext';
import { useFeedback } from '@/contexts/FeedbackContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { forms, buttons } = useStyles();
  const textColor = useThemeColor({}, 'text');
  const linkColor = useThemeColor({}, 'link');
  const styles = useAuthStyles();
  const { t } = useI18n();
  const { showToast } = useFeedback();

  const handleLogin = async () => {
    if (!email || !password) {
      showToast({ tone: 'error', title: t('error'), message: t('login.errorFields') });
      return;
    }

    try {
      setIsLoading(true);
      const response = await login(email, password, true);
      if (!response.success) {
        showToast({
          tone: 'error',
          title: t('error'),
          message: t(response.message?.[0] || 'login.error'),
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast({ tone: 'error', title: t('error'), message: t('login.error') });
    } finally {
      setIsLoading(false);
    }
  };

  const i18nEmail = t('login.email');
  const i18nPassword = t('login.password');

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar style="auto" />

      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>MoodDic</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>{t('login.title')}</Text>
        <Text style={styles.subtitle}>{t('login.subtitle')}</Text>

        <TextInput
          style={forms.input}
          placeholder={i18nEmail}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
          placeholderTextColor={textColor}
        />

        <TextInput
          style={forms.input}
          placeholder={i18nPassword}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
          placeholderTextColor={textColor}
        />

        <TouchableOpacity
          style={[buttons.primary, isLoading && buttons.disabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={buttons.buttonText}>{t('login.submit')}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
          <Text style={{ color: textColor }}>{t('login.noAccount')} </Text>
          <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
            <Text style={{ color: linkColor }}>
              {t('login.register')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
