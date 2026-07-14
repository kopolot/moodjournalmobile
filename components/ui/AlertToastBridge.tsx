import { useEffect } from 'react';
import { useFeedback } from '@/contexts/FeedbackContext';
import { registerAlertToastHandler } from '@/utils/alert';

/** Routes legacy `showAlert` calls into the in-app toast. */
export function AlertToastBridge() {
  const { showToast } = useFeedback();

  useEffect(() => {
    registerAlertToastHandler((title, message) => {
      const isError = /error|błąd|fail/i.test(title);
      const isSuccess = /success|sukces/i.test(title);
      showToast({
        title,
        message: message || title,
        tone: isError ? 'error' : isSuccess ? 'success' : 'info',
      });
    });
    return () => registerAlertToastHandler(null);
  }, [showToast]);

  return null;
}
