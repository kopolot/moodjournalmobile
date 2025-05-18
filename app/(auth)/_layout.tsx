import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthLayout() {
  const { isLoggedIn, isLoading, isConnected } = useAuth();

  // Jeśli trwa ładowanie, pokaż spinner
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }
  
  // Jeśli użytkownik jest zalogowany, przekieruj do aplikacji
  if (isLoggedIn) {
    return <Redirect href="/(app)" />;
  }else if (!isConnected) {
    // Jeśli użytkownik nie jest połączony z internetem, przekieruj do offline
    return <Redirect href="/(auth)/offline" />;
  }

  // W przeciwnym razie pokaż ekrany logowania
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="offline" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}