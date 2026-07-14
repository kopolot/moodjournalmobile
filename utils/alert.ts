/**
 * @deprecated Use `useFeedback()` toast / confirm instead.
 * Kept as a thin runtime shim for any leftover call sites.
 */
import { Alert, AlertButton, Platform } from 'react-native';

let toastHandler: ((title: string, message?: string) => void) | null = null;

export function registerAlertToastHandler(
  handler: ((title: string, message?: string) => void) | null
) {
  toastHandler = handler;
}

export function showAlert(
  title: string,
  message?: string,
  buttons?: AlertButton[]
): void {
  if ((!buttons || buttons.length <= 1) && toastHandler) {
    toastHandler(title, message);
    return;
  }

  const text = message ? `${title}\n\n${message}` : title;

  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      const confirm =
        buttons.find((b) => b.style === 'destructive') ?? buttons[buttons.length - 1];
      const ok =
        typeof window !== 'undefined' && typeof window.confirm === 'function'
          ? window.confirm(text)
          : true;
      if (ok) confirm?.onPress?.();
      else buttons.find((b) => b.style === 'cancel')?.onPress?.();
      return;
    }

    if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      window.alert(text);
    }
    return;
  }

  Alert.alert(title, message, buttons);
}
