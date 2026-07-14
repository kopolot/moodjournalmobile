import { Alert, Platform } from 'react-native';

/**
 * Alert.alert is a no-op / unreliable on React Native Web.
 * Use this helper so login/register errors actually show in the browser.
 */
export function showAlert(title: string, message?: string): void {
  const text = message ? `${title}\n\n${message}` : title;

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      window.alert(text);
    } else {
      console.warn('[alert]', text);
    }
    return;
  }

  Alert.alert(title, message);
}
