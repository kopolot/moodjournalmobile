import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';

export default function Offline() {
    console.log('Offline screen');
    return (
        <View style={styles.container}>
            <Text>Brak połączenia z internetem :(</Text>
            {/* <Button title="Spróbuj ponownie" onPress={() => router.push('/(auth)/login')} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    }
});