import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola');
      return;
    }

    try {
      // tutaj trzeba logikę verify dodać
      const success = await login(email, password, true);
      if (!success) {
        Alert.alert('Błąd logowania', 'Nieprawidłowe dane logowania. Spróbuj ponownie.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Błąd', 'Wystąpił problem podczas logowania. Spróbuj ponownie.');
    }
  };

  return (
    <View style={styles.container}>
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
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Hasło"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Zaloguj się</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Nie masz jeszcze konta?</Text>
          <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
            <Text style={[styles.registerLink, isLoading && styles.textDisabled]}>
              Zarejestruj się
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
    height: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#7fb6e1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#777',
    fontSize: 14,
  },
  registerLink: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  textDisabled: {
    color: '#999',
  },
});