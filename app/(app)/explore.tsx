import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface ExploreItem {
  id: string;
  title: string;
  description: string;
  image?: string;
}

export default function ExploreScreen() {
  const exploreItems: ExploreItem[] = [
    {
      id: '1',
      title: 'Kategoria 1',
      description: 'Odkryj zawartość kategorii 1',
    },
    {
      id: '2',
      title: 'Kategoria 2',
      description: 'Odkryj zawartość kategorii 2',
    },
    {
      id: '3',
      title: 'Kategoria 3',
      description: 'Odkryj zawartość kategorii 3',
    },
    {
      id: '4',
      title: 'Kategoria 4',
      description: 'Odkryj zawartość kategorii 4',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Przeglądaj</Text>
        <Text style={styles.headerSubtitle}>Odkryj nową zawartość</Text>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {exploreItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.exploreCard}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
            <View style={styles.cardIcon}>
              <IconSymbol name="arrow.right" size={24} color="#3498db" />
            </View>
          </TouchableOpacity>
        ))}
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Co nowego?</Text>
          <Text style={styles.infoText}>
            Ta sekcja będzie się wypełniać nową zawartością dostosowaną do Twoich preferencji.
            Eksploruj różne kategorie, aby otrzymywać spersonalizowane treści.
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
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  exploreCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#777',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    backgroundColor: '#e1f5fe',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0277bd',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#0277bd',
    lineHeight: 20,
  },
});