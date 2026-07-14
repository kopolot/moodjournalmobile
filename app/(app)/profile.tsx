import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { appScreensStyles } from '@/styles/appScreensStyles';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Przekierowanie nastąpi automatycznie przez AuthContext
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Błąd wylogowania', 'Nie udało się wylogować. Spróbuj ponownie.');
    }
  };

  return (
    <ScrollView style={appScreensStyles.container}>
      <StatusBar style="auto" />
      <View style={appScreensStyles.header}>
        <View style={appScreensStyles.avatarContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={appScreensStyles.avatar}
          />
        </View>
        <Text style={appScreensStyles.username}>{user?.username}</Text>
        <Text style={appScreensStyles.email}>{user?.email}</Text>
      </View>
      <View style={appScreensStyles.section}>
        <Text style={appScreensStyles.sectionTitle}>Mój profil</Text>
        <TouchableOpacity style={appScreensStyles.menuItem}>
          <Text style={appScreensStyles.menuItemText}>Edytuj dane osobowe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={appScreensStyles.menuItem}>
          <Text style={appScreensStyles.menuItemText}>Zmień hasło</Text>
        </TouchableOpacity>
        <TouchableOpacity style={appScreensStyles.menuItem}>
          <Text style={appScreensStyles.menuItemText}>Preferencje powiadomień</Text>
        </TouchableOpacity>
      </View>
      <View style={appScreensStyles.section}>
        <Text style={appScreensStyles.sectionTitle}>Aplikacja</Text>
        <TouchableOpacity
          style={appScreensStyles.menuItem}
          onPress={() => Alert.alert('Informacja', 'Wersja aplikacji: 1.0.0')}
        >
          <Text style={appScreensStyles.menuItemText}>O aplikacji</Text>
        </TouchableOpacity>
        <TouchableOpacity style={appScreensStyles.menuItem}>
          <Text style={appScreensStyles.menuItemText}>Zgłoś problem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={appScreensStyles.menuItem}>
          <Text style={appScreensStyles.menuItemText}>Pomoc</Text>
        </TouchableOpacity>
      </View>
      <View style={appScreensStyles.logoutContainer}>
        <TouchableOpacity
          style={appScreensStyles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={appScreensStyles.logoutButtonText}>Wyloguj się</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}