import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import useStyles from '@/hooks/useStyles';
import Checkbox from '@/components/form/Checkbox';
import { useThemeColor } from '@/hooks/useThemeColor';
import useAuthStyles from '@/styles/authStyles';
import { useI18n } from '@/contexts/I18nContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { t } = useI18n();
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
      Alert.alert(t('error'), t('register.errorFields'));
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert(t('error'), t('register.passwordMismatch'));
      return;
    }

    if( !acceptPrivacyPolicy){
      Alert.alert(t('error'), t('register.privacyPolicyError'));
      return;
    }
    
    try {
      const response = await register(email, password, repeatPassword, firstname, acceptPrivacyPolicy);
      if (response.success) {
        Alert.alert(
          t('success'),
          t( response.message?.[0] || 'register.success'),
          [{ text: 'OK', onPress: () => router.replace('/') }]
        );
        router.replace('/(auth)/login');
      } else {
        Alert.alert(t('error'), t( response.message?.[0] || 'register.error'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(t('error'), t('register.error'));
    }
  };

  const i18nFirstname = t('register.firstname');
  const i18nEmail = t('register.email');
  const i18nPassword = t('register.password');
  const i18nRepeatPassword = t('register.repeatPassword');

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar style="auto" />

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