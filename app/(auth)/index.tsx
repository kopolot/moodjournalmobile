import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, ActivityIndicator, ScrollView, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);

  const handleRegister = async () => {
    if (!firstname || !email || !password || !repeatPassword) {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola');
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert('Błąd', 'Hasła nie są identyczne');
      return;
    }

    if( !acceptPrivacyPolicy){
      Alert.alert('Błąd', 'Proszę zaakceptować regulamin i politykę prywatności');
      return;
    }
    
    try {
      const success = await register(email, password, repeatPassword, firstname, acceptPrivacyPolicy);
      if (success) {
        Alert.alert(
          'Sukces',
          'Konto zostało utworzone. Możesz się teraz zalogować.',
          [{ text: 'OK', onPress: () => router.replace('/') }]
        );
      } else {
        Alert.alert('Błąd rejestracji', 'Nie udało się utworzyć konta. Spróbuj ponownie.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Błąd', 'Wystąpił problem podczas rejestracji. Spróbuj ponownie.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Dołącz do nas!</Text>
        <Text style={styles.subtitle}>Stwórz nowe konto</Text>

        <TextInput
          style={styles.input}
          placeholder="Imię"
          value={firstname}
          onChangeText={setFirstname}
          autoCapitalize="none"
          editable={!isLoading}
        />

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

        <TextInput
          style={styles.input}
          placeholder="Potwierdź hasło"
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableWithoutFeedback
          onPress={() => setAcceptPrivacyPolicy(!acceptPrivacyPolicy)}
        >
          <View style={styles.checkbox}>
            <View style={[
              {
                width: 20,
                height: 20,
                borderWidth: 1,
                borderColor: '#999',
                borderRadius: 3,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: acceptPrivacyPolicy ? '#3498db' : 'transparent'
              }
            ]}>
              {acceptPrivacyPolicy && (
                <Text style={{ color: '#fff', fontSize: 14 }}>✓</Text>
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              Akceptuję regulamin i politykę prywatności
            </Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Zarejestruj się</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Masz już konto?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={isLoading}>
            <Text style={[styles.loginLink, isLoading && styles.textDisabled]}>
              Zaloguj się
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
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
    marginTop: 40,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#777',
    fontSize: 14,
  },
  loginLink: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  textDisabled: {
    color: '#999',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
});