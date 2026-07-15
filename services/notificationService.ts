import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const PREF_KEY = 'mood_dic_daily_notifications';
const HOUR = 20;
const MINUTE = 0;

/** Expo Go on Android no longer supports the push path used by expo-notifications. */
const isExpoGoAndroid =
  Platform.OS === 'android' && Constants.appOwnership === 'expo';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModule: NotificationsModule | null | undefined;

async function loadNotifications(): Promise<NotificationsModule | null> {
  if (Platform.OS === 'web' || isExpoGoAndroid) {
    return null;
  }
  if (notificationsModule !== undefined) {
    return notificationsModule;
  }
  try {
    const mod = await import('expo-notifications');
    mod.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    notificationsModule = mod;
    return mod;
  } catch {
    notificationsModule = null;
    return null;
  }
}

export class NotificationService {
  static isSupported(): boolean {
    return Platform.OS !== 'web' && !isExpoGoAndroid;
  }

  static async isEnabled(): Promise<boolean> {
    const value = await AsyncStorage.getItem(PREF_KEY);
    return value !== '0';
  }

  static async setEnabled(enabled: boolean): Promise<boolean> {
    await AsyncStorage.setItem(PREF_KEY, enabled ? '1' : '0');
    if (!enabled) {
      const Notifications = await loadNotifications();
      if (Notifications) {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
      return true;
    }
    // Expo Go Android: store the preference, skip remote push path.
    if (!this.isSupported()) {
      return true;
    }
    return this.scheduleDailyReminder();
  }

  /** Sync preference from API without forcing a permission prompt. */
  static async hydrateEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(PREF_KEY, enabled ? '1' : '0');
    if (!this.isSupported()) return;
    if (!enabled) {
      const Notifications = await loadNotifications();
      if (Notifications) {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
      return;
    }
    const Notifications = await loadNotifications();
    if (!Notifications) return;
    const current = await Notifications.getPermissionsAsync();
    if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
      await this.scheduleDailyReminder();
    }
  }

  static async ensurePermissions(): Promise<boolean> {
    const Notifications = await loadNotifications();
    if (!Notifications) {
      return false;
    }

    const current = await Notifications.getPermissionsAsync();
    if (
      current.granted ||
      current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    ) {
      return true;
    }

    const asked = await Notifications.requestPermissionsAsync();
    return !!asked.granted;
  }

  static async scheduleDailyReminder(): Promise<boolean> {
    const Notifications = await loadNotifications();
    if (!Notifications) {
      return false;
    }

    const enabled = await this.isEnabled();
    if (!enabled) {
      return false;
    }

    const ok = await this.ensurePermissions();
    if (!ok) {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-checkin', {
        name: 'Daily check-in',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'MoodDic',
        body: 'Czas na dzienny check-in — chroń swoją serię 🔥',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: HOUR,
        minute: MINUTE,
        channelId: Platform.OS === 'android' ? 'daily-checkin' : undefined,
      },
    });

    return true;
  }

  static async bootstrap(): Promise<void> {
    if (!this.isSupported()) return;
    const enabled = await this.isEnabled();
    if (enabled) {
      await this.scheduleDailyReminder();
    }
  }
}
