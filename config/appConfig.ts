/**
 * Konfiguracja aplikacji
 * Zawiera ustawienia globalne, adresy URL API i inne stałe
 */

import Constants from 'expo-constants';

// Konfiguracja środowisk
interface EnvironmentConfig {
  API_URL: string;
  API_TIMEOUT: number;
  AUTH_TOKEN_KEY: string;
  USER_DATA_KEY: string;
  DEBUG: boolean;
  USER_TOKEN_KEY: string;
}

// Konfiguracje dla różnych środowisk
const environments: Record<string, EnvironmentConfig> = {
  dev: {
    API_URL: 'http://local.moodjournal.com',
    API_TIMEOUT: 10000, // 10 sekund
    AUTH_TOKEN_KEY: '',
    USER_DATA_KEY: 'mood_app_user_data',
    USER_TOKEN_KEY: 'mood_app_user_token',
    DEBUG: true,
  },
  stage: {
    API_URL: 'https://api-staging.moodapp.example.com/v1',
    API_TIMEOUT: 15000, // 15 sekund
    AUTH_TOKEN_KEY: 'mood_app_auth_token',
    USER_DATA_KEY: 'mood_app_user_data',
    USER_TOKEN_KEY: 'mood_app_user_token',
    DEBUG: true,
  },
  prod: {
    API_URL: 'https://api.moodapp.example.com/v1',
    API_TIMEOUT: 30000, // 30 sekund
    AUTH_TOKEN_KEY: 'mood_app_auth_token',
    USER_DATA_KEY: 'mood_app_user_data',
    USER_TOKEN_KEY: 'mood_app_user_token',
    DEBUG: false,
  },
};

// Określenie aktywnego środowiska na podstawie konfiguracji Expo
const ACTIVE_ENV = Constants.expoConfig?.extra?.environment || 'dev';

// Logowanie aktywnego środowiska (tylko w trybie dev)
if (__DEV__) {
  console.log(`App running in ${ACTIVE_ENV} environment`);
  console.log(`API URL: ${environments[ACTIVE_ENV].API_URL}`);
}

/**
 * Konfiguracja API
 */
export const API_CONFIG = {
  // Bazowy URL API
  BASE_URL: environments[ACTIVE_ENV].API_URL,
  
  // Timeout dla żądań (w milisekundach)
  TIMEOUT: environments[ACTIVE_ENV].API_TIMEOUT,
  
  // Ścieżki do endpointów API
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/user/login',
      REGISTER: '/user/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: 'user/resetpassword',
    },
    USER: {
        PROFILE: '/user/get',
        UPDATE_PROFILE: '',
        CHANGE_PASSWORD: '',
        
    },
    CONTENT: {

    },
  },
  
  // Nagłówki HTTP
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'Authorization': `Bearer ${environments[ACTIVE_ENV].AUTH_TOKEN_KEY}`,
    'X-Api-Key': environments[ACTIVE_ENV].AUTH_TOKEN_KEY,
  },
};

/**
 * Konfiguracja lokalnego przechowywania danych
 */
export const STORAGE_CONFIG = {
    USER_DATA_KEY: environments[ACTIVE_ENV].USER_DATA_KEY,
    USER_TOKEN_KEY: environments[ACTIVE_ENV].USER_TOKEN_KEY,
};

/**
 * Ogólna konfiguracja aplikacji
 */
export const APP_CONFIG = {
  DEBUG: environments[ACTIVE_ENV].DEBUG,
  VERSION: '0.0.0',
  APP_NAME: 'Mood App',
  ENVIRONMENT: ACTIVE_ENV,
  
  // Ustawienia związane z UI
  UI: {
    ANIMATION_DURATION: 300, // ms
    LOAD_TIMEOUT: 30000, // 30 sekund
    DEFAULT_TRANSITION: 'ease',
  },
  DEV: {
    // FORCE_OFFLINE: true
  }
};