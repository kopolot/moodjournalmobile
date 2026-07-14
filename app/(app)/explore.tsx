import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { appScreensStyles } from '@/styles/appScreensStyles';

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
    <View style={appScreensStyles.container}>
      <StatusBar style="auto" />
      <View style={appScreensStyles.header}>
        <Text style={appScreensStyles.headerTitle}>Przeglądaj</Text>
        <Text style={appScreensStyles.headerSubtitle}>Odkryj nową zawartość</Text>
      </View>
      <ScrollView style={appScreensStyles.content} contentContainerStyle={appScreensStyles.contentContainer}>
        {exploreItems.map((item) => (
          <TouchableOpacity key={item.id} style={appScreensStyles.exploreCard}>
            <View style={appScreensStyles.cardContent}>
              <Text style={appScreensStyles.cardTitle}>{item.title}</Text>
              <Text style={appScreensStyles.cardDescription}>{item.description}</Text>
            </View>
            <View style={appScreensStyles.cardIcon}>
              <IconSymbol name="arrow.right" size={24} color="#3498db" />
            </View>
          </TouchableOpacity>
        ))}
        <View style={appScreensStyles.infoSection}>
          <Text style={appScreensStyles.infoTitle}>Co nowego?</Text>
          <Text style={appScreensStyles.infoText}>
            Ta sekcja będzie się wypełniać nową zawartością dostosowaną do Twoich preferencji.
            Eksploruj różne kategorie, aby otrzymywać spersonalizowane treści.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}