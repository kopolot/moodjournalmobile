import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthService } from '@/services/authService';
import NetInfo from '@react-native-community/netinfo';
import { makeUser } from '../testUtils/fixtures';

jest.mock('@/services/authService', () => ({
  AuthService: {
    isAuthenticated: jest.fn(),
    loadCurrentUser: jest.fn(),
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock('@/services/notificationService', () => ({
  NotificationService: { hydrateEnabled: jest.fn(() => Promise.resolve()) },
}));

jest.mock('@/contexts/I18nContext', () => ({
  useI18n: () => ({
    language: 'en',
    setLanguage: jest.fn(() => Promise.resolve()),
    t: (key: string) => key,
  }),
}));

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    darkMode: false,
    scheme: 'light' as const,
    colors: require('@/styles/colors').Colors.light,
    setDarkMode: jest.fn(() => Promise.resolve()),
    hydrateDarkMode: jest.fn(),
  }),
}));

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(() => jest.fn()),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('Auth flow — e2e (provider level)', () => {
  const user = makeUser();

  beforeEach(() => {
    jest.clearAllMocks();
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, isInternetReachable: true });
  });

  it('cold start → login → authenticated home state', async () => {
    (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(false);
    (AuthService.login as jest.Mock).mockResolvedValue({
      success: true,
      data: { jwt_token: 'jwt-e2e' },
    });
    (AuthService.loadCurrentUser as jest.Mock).mockResolvedValue(user);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoggedIn).toBe(false));

    await act(async () => {
      const response = await result.current.login(user.email, 'Test@1234', true);
      expect(response.success).toBe(true);
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user?.email).toBe(user.email);
    expect(AuthService.loadCurrentUser).toHaveBeenCalled();
  });

  it('logout returns app to guest state', async () => {
    (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(true);
    (AuthService.loadCurrentUser as jest.Mock).mockResolvedValue(user);
    (AuthService.logout as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoggedIn).toBe(true));

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
