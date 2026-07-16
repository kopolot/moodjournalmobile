import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Brand, Colors } from '@/styles/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import OfflineBar from '@/components/ui/OfflineBar';
import { useI18n } from '@/contexts/I18nContext';
import { gameFonts } from '@/styles/gameStyles';

export default function AppLayout() {
  const { isLoggedIn, isConnected } = useAuth();
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorScheme];
  const { t } = useI18n();

  if (!isLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {!isConnected && <OfflineBar />}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.tint,
          tabBarInactiveTintColor: theme.tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarLabelStyle: {
            fontFamily: gameFonts.bold,
            fontSize: 12,
          },
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              borderTopWidth: 2,
              borderTopColor: theme.border,
              backgroundColor: theme.card,
            },
            default: {
              borderTopWidth: 2,
              borderTopColor: theme.border,
              backgroundColor: theme.card,
              height: 64,
              paddingBottom: 8,
              paddingTop: 6,
            },
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.home'),
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: t('tabs.history'),
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="book.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="mood-note"
          options={{
            title: t('tabs.checkin'),
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="plus.circle.fill" color={color || Brand.green} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t('tabs.profile'),
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="subscription"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="ai-coach"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="change-password"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}
