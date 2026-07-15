import { apiClient } from './apiClient';
import { API_CONFIG } from '@/config/appConfig';
import { toApiLanguage } from '@/utils/preferences';

export type PreferencesPatch = {
  language?: string;
  darkMode?: boolean;
  dailyNotifications?: boolean;
};

export class PreferencesService {
  static async patch(preferences: PreferencesPatch) {
    return apiClient.patch(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, { preferences });
  }

  static async setLanguage(appLang: string) {
    return this.patch({ language: toApiLanguage(appLang) });
  }

  static async setDarkMode(darkMode: boolean) {
    return this.patch({ darkMode });
  }

  static async setDailyNotifications(dailyNotifications: boolean) {
    return this.patch({ dailyNotifications });
  }
}
