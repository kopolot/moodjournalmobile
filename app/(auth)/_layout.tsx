import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Offline from './offline';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  const { isLoggedIn, isConnected } = useAuth();
  const { colors } = useTheme();

  if (isLoggedIn) {
    return <Redirect href="/(app)" />;
  }
  if (!isConnected) {
    return <Offline />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
      </Stack>
    </SafeAreaView>
  );
}