import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import Offline from './offline';
import useStyles from '@/hooks/useStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  const { isLoggedIn, isConnected } = useAuth();
  const { containers, layout } = useStyles();
  
  // Jeśli użytkownik jest zalogowany, przekieruj do aplikacji
  if (isLoggedIn) {
    return <Redirect href="/(app)" />;
  }else if (!isConnected) {
    return <Offline />;
  }

  // W przeciwnym razie pokaż ekrany logowania
  // paddingTop: 0
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}