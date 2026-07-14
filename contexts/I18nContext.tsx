import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Importuj pliki z tłumaczeniami
import en from '../locales/en.json';
import pl from '../locales/pl.json';

const resources = {
    en: {
        translation: en
    },
    pl:{
        translation: pl
    }
}

// Inicjalizacja i18next
i18n.use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
    });

interface I18nContextProps {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string, options?: any) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState('en');
    const { t } = useTranslation();

    useEffect(() => {
        // Pobierz zapisany język lub wykryj język urządzenia
        const getLanguage = async () => {
            try {
                const storedLang = await AsyncStorage.getItem('@language');
                if (storedLang) {
                    setLanguage(storedLang);
                } else {
                    const deviceLang = Localization.getLocales()?.[0].languageCode || 'en';
                    setLanguage(deviceLang);
                }
            } catch (error) {
                console.error('Failed to get language', error);
            }
        };

        getLanguage();
    }, []);

    const setLanguage = async (lang: string) => {
        try {
            await i18n.changeLanguage(lang);
            await AsyncStorage.setItem('@language', lang);
            setLanguageState(lang);
        } catch (error) {
            console.error('Failed to set language', error);
        }
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};