import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { appScreensStyles } from '@/styles/appScreensStyles';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <View style={appScreensStyles.container}>
      <StatusBar style="auto" />

      <View style={appScreensStyles.header}>
        <Text style={appScreensStyles.headerTitle}>Witaj, {user?.firstname}!</Text>
        <Text style={appScreensStyles.headerSubtitle}>Co nowego dzisiaj?</Text>
      </View>

      <ScrollView style={appScreensStyles.content}>
        <View style={appScreensStyles.card}>
          <Text style={appScreensStyles.cardTitle}>Główny ekran aplikacji</Text>
          <Text style={appScreensStyles.cardText}>
            Jesteś zalogowany jako użytkownik: {user?.firstname}
          </Text>
          <Text style={appScreensStyles.cardText}>
            Email: {user?.email}
          </Text>
        </View>

        <View style={appScreensStyles.infoCard}>
          <Text style={appScreensStyles.infoTitle}>Informacja</Text>
          <Text style={appScreensStyles.infoText}>
            Ten ekran jest widoczny tylko dla zalogowanych użytkowników.
            Możesz teraz korzystać ze wszystkich funkcji aplikacji.
          </Text>
        </View>
        <View>
          <Text
            style={{ color: '#3498db', fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}
            onPress={() => router.push('/(app)/mood-note')}
          >
            Przejdź do wieloetapowego formularza
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}