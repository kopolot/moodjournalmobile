import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import offline from "@/app/(auth)/offline";
import { router } from "expo-router";
import { APP_CONFIG } from "@/config/appConfig";
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function testComponents() {
    const DevButton = () => {
      if ( APP_CONFIG.ENVIRONMENT !== 'dev') return null;
      
      return (
        <View>
          <TouchableOpacity 
            style={styles.devButton}
            onPress={() => router.push( '/(dev)' )}
          >
            <Text style={styles.devButtonText}>DEV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.devButton}
            onPress={() => router.push( '/(auth)' )}
          >
            <Text style={styles.devButtonText}>AUTH</Text>
          </TouchableOpacity>
        </View>
      );
    };
  return (
    <View>
      <DevButton />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen name="/(auth)/offline" options={{ title: 'Offline' }} />
        </Drawer>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  devButton: {
    backgroundColor: '#ff0000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  devButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});