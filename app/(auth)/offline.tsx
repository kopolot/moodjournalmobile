import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useI18n } from '@/contexts/I18nContext';

export default function Offline() {
    const { t } = useI18n();
    console.log('Offline screen');
    return (
        <View style={styles.container}>
            <Text>{t('app.offline.title')}</Text>
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