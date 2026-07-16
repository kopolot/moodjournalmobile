import React, { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nProvider } from '@/contexts/I18nContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FeedbackProvider } from '@/contexts/FeedbackContext';
import { AuthProvider } from '@/contexts/AuthContext';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

type WrapperProps = { children: ReactNode };

function CoreProviders({ children }: WrapperProps) {
  return (
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <I18nProvider>
        <ThemeProvider>
          <FeedbackProvider>{children}</FeedbackProvider>
        </ThemeProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

function AllProviders({ children }: WrapperProps) {
  return (
    <CoreProviders>
      <AuthProvider>{children}</AuthProvider>
    </CoreProviders>
  );
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: CoreProviders, ...options });
}

export function renderWithAuth(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export function authWrapper({ children }: WrapperProps) {
  return <AllProviders>{children}</AllProviders>;
}
