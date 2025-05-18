import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>Witaj, {user?.username}!</Text>
        <Text style={styles.subtitle}>Co nowego dzisiaj?</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Główny ekran aplikacji</Text>
          <Text style={styles.cardText}>
            Jesteś zalogowany jako użytkownik: {user?.username}
          </Text>
          <Text style={styles.cardText}>
            Email: {user?.email}
          </Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informacja</Text>
          <Text style={styles.infoText}>
            Ten ekran jest widoczny tylko dla zalogowanych użytkowników.
            Możesz teraz korzystać ze wszystkich funkcji aplikacji.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
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
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: '#e1f5fe',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0277bd',
  },
  infoText: {
    fontSize: 14,
    color: '#0277bd',
    lineHeight: 20,
  },
});