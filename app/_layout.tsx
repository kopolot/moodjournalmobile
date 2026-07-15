import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from 'expo-router/react-navigation';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { FeedbackProvider } from '@/contexts/FeedbackContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Brand } from '@/styles/colors';
import { AlertToastBridge } from '@/components/ui/AlertToastBridge';
import { NotificationService } from '@/services/notificationService';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      NotificationService.bootstrap().catch(() => undefined);
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Brand.green} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <I18nProvider>
        <FeedbackProvider>
          <AlertToastBridge />
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </FeedbackProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </NavThemeProvider>
  );
}
