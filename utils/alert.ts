import { Alert, AlertButton, Platform } from 'react-native';

/**
 * Alert.alert is a no-op / unreliable on React Native Web.
 * Optional buttons work on native; on web only first destructive/confirm is approximated.
 */
export function showAlert(
  title: string,
  message?: string,
  buttons?: AlertButton[]
): void {
  const text = message ? `${title}\n\n${message}` : title;

  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      const confirm = buttons.find((b) => b.style === 'destructive') ?? buttons[buttons.length - 1];
      const ok =
        typeof window !== 'undefined' && typeof window.confirm === 'function'
          ? window.confirm(text)
          : true;
      if (ok) {
        confirm?.onPress?.();
      } else {
        buttons.find((b) => b.style === 'cancel')?.onPress?.();
      }
      return;
    }

    if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      window.alert(text);
    } else {
      console.warn('[alert]', text);
    }
    return;
  }

  Alert.alert(title, message, buttons);
}
