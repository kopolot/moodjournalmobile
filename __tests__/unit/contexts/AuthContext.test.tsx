import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthService } from '@/services/authService';
import NetInfo from '@react-native-community/netinfo';
import { makeUser } from '../../testUtils/fixtures';

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

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
  NotificationService: {
    hydrateEnabled: jest.fn(() => Promise.resolve()),
  },
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
  addEventListener: jest.fn(),
}));

const mockUser = makeUser();

describe('AuthContext — unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (NetInfo.addEventListener as jest.Mock).mockReturnValue(jest.fn());
  });

  it('starts logged out when there is no session', async () => {
    (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(false);
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, isInternetReachable: true });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.isConnected).toBe(true);
    });

    expect(result.current.user).toBeNull();
    expect(AuthService.isAuthenticated).toHaveBeenCalled();
  });

  it('hydrates user when session exists', async () => {
    (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(true);
    (AuthService.loadCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, isInternetReachable: true });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(true);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('falls back to cached user when profile fetch fails', async () => {
    (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(true);
    (AuthService.loadCurrentUser as jest.Mock).mockRejectedValue(new Error('offline'));
    (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('login stores user after successful API response', async () => {
    (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(false);
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, isInternetReachable: true });
    (AuthService.login as jest.Mock).mockResolvedValue({ success: true, data: { jwt_token: 'x' } });
    (AuthService.loadCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoggedIn).toBe(false));

    let response: Awaited<ReturnType<typeof result.current.login>>;
    await act(async () => {
      response = await result.current.login('test@example.com', 'password123', true);
    });

    expect(response!.success).toBe(true);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('register returns API response without logging in', async () => {
    (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(false);
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, isInternetReachable: true });
    (AuthService.register as jest.Mock).mockResolvedValue({
      success: true,
      message: ['user.register.success'],
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoggedIn).toBe(false));

    let response: Awaited<ReturnType<typeof result.current.register>>;
    await act(async () => {
      response = await result.current.register(
        'test@example.com',
        'password123',
        'password123',
        'Test',
        true
      );
    });

    expect(response!.success).toBe(true);
    expect(result.current.isLoggedIn).toBe(false);
  });

  it('logout clears session state', async () => {
    (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(true);
    (AuthService.loadCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, isInternetReachable: true });
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
