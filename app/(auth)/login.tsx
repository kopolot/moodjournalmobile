import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import useStyles from '@/hooks/useStyles';
import { useThemeColor } from '@/hooks/useThemeColor';
import useAuthStyles from '@/styles/authStyles';

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { forms, buttons } = useStyles();
  const textColor = useThemeColor({}, 'text');
  const linkColor = useThemeColor({}, 'link');
  const styles = useAuthStyles();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola');
      return;
    }

    try {
      // tutaj trzeba logikę verify dodać
      setIsLoading(true);
      const success = await login(email, password, true);
      if (!success) {
        Alert.alert('Błąd logowania', 'Nieprawidłowe dane logowania. Spróbuj ponownie.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Błąd', 'Wystąpił problem podczas logowania. Spróbuj ponownie.  ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar style="auto" />

      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Mood App</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Witaj ponownie!</Text>
        <Text style={styles.subtitle}>Zaloguj się, aby kontynuować</Text>

        <TextInput
          style={forms.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
          placeholderTextColor={textColor}
        />

        <TextInput
          style={forms.input}
          placeholder="Hasło"
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
            <Text style={buttons.buttonText}>Zaloguj się</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
          <Text style={{color: textColor}}>Nie masz jeszcze konta? </Text>
          <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
            <Text style={{color: linkColor}}>
              Zarejestruj się
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}