import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const PREF_KEY = 'mood_dic_daily_notifications';
const HOUR = 20;
const MINUTE = 0;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async isEnabled(): Promise<boolean> {
    const value = await AsyncStorage.getItem(PREF_KEY);
    return value !== '0';
  }

  static async setEnabled(enabled: boolean): Promise<boolean> {
    await AsyncStorage.setItem(PREF_KEY, enabled ? '1' : '0');
    if (enabled) {
      return this.scheduleDailyReminder();
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  }

  static async ensurePermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return false;
    }

    const current = await Notifications.getPermissionsAsync();
    if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
      return true;
    }

    const asked = await Notifications.requestPermissionsAsync();
    return !!asked.granted;
  }

  static async scheduleDailyReminder(): Promise<boolean> {
    if (Platform.OS === 'web') {
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
    if (Platform.OS === 'web') return;
    const enabled = await this.isEnabled();
    if (enabled) {
      await this.scheduleDailyReminder();
    }
  }
}
