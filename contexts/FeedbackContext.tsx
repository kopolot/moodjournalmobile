import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand } from '@/styles/colors';
import { gameFonts } from '@/styles/gameStyles';
import PrimaryButton from '@/components/game/PrimaryButton';

export type ToastTone = 'success' | 'error' | 'info';

export type ToastInput = {
  title?: string;
  message: string;
  tone?: ToastTone;
  durationMs?: number;
};

export type ConfirmInput = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type FeedbackContextValue = {
  showToast: (input: ToastInput | string) => void;
  showConfirm: (input: ConfirmInput) => Promise<boolean>;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

type ToastState = {
  id: number;
  title?: string;
  message: string;
  tone: ToastTone;
};

type ConfirmState = ConfirmInput & {
  resolve: (value: boolean) => void;
};

const toneColors: Record<ToastTone, { bg: string; border: string }> = {
  success: { bg: Brand.green, border: Brand.greenDark },
  error: { bg: Brand.red, border: '#C93434' },
  info: { bg: Brand.blue, border: '#1490C8' },
};

let toastSeq = 0;

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 24, duration: 180, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) setToast(null);
    });
  }, [opacity, translateY]);

  const showToast = useCallback(
    (input: ToastInput | string) => {
      const payload: ToastInput = typeof input === 'string' ? { message: input } : input;
      if (hideTimer.current) clearTimeout(hideTimer.current);

      setToast({
        id: ++toastSeq,
        title: payload.title,
        message: payload.message,
        tone: payload.tone ?? 'info',
      });

      opacity.setValue(0);
      translateY.setValue(24);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();

      hideTimer.current = setTimeout(() => hideToast(), payload.durationMs ?? 2800);
    },
    [hideToast, opacity, translateY]
  );

  const showConfirm = useCallback((input: ConfirmInput) => {
    return new Promise<boolean>((resolve) => {
      setConfirm({ ...input, resolve });
    });
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const value = useMemo(() => ({ showToast, showConfirm }), [showToast, showConfirm]);

  const closeConfirm = (accepted: boolean) => {
    confirm?.resolve(accepted);
    setConfirm(null);
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      {toast ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.toastWrap,
            {
              bottom: Math.max(insets.bottom, 12) + 64,
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <Pressable
            onPress={hideToast}
            style={[
              styles.toast,
              {
                backgroundColor: toneColors[toast.tone].bg,
                borderBottomColor: toneColors[toast.tone].border,
              },
            ]}
          >
            {toast.title ? <Text style={styles.toastTitle}>{toast.title}</Text> : null}
            <Text style={styles.toastMessage}>{toast.message}</Text>
          </Pressable>
        </Animated.View>
      ) : null}

      <Modal transparent visible={!!confirm} animationType="fade" onRequestClose={() => closeConfirm(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{confirm?.title}</Text>
            {confirm?.message ? (
              <Text style={styles.modalMessage}>{confirm.message}</Text>
            ) : null}
            <View style={styles.modalActions}>
              <PrimaryButton
                title={confirm?.cancelLabel ?? 'Cancel'}
                variant="secondary"
                onPress={() => closeConfirm(false)}
                style={{ flex: 1 }}
              />
              <PrimaryButton
                title={confirm?.confirmLabel ?? 'OK'}
                onPress={() => closeConfirm(true)}
                style={{
                  flex: 1,
                  ...(confirm?.destructive
                    ? { backgroundColor: Brand.red, borderBottomColor: '#C93434' }
                    : null),
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  toastWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 4,
  },
  toastTitle: {
    fontFamily: gameFonts.extra,
    fontSize: 15,
    color: '#fff',
    marginBottom: 2,
  },
  toastMessage: {
    fontFamily: gameFonts.semi,
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 22,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  modalTitle: {
    fontFamily: gameFonts.extra,
    fontSize: 22,
    color: Brand.ink,
    marginBottom: 8,
  },
  modalMessage: {
    fontFamily: gameFonts.regular,
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
});
