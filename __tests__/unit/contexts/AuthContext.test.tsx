import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthService } from '@/services/authService';
import NetInfo from '@react-native-community/netinfo';

// Mockowanie AuthService
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

// Mockowanie NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
}));

describe.skip('AuthContext - testy (wymagają dopięcia mocków NetInfo/AuthContext)', () => {
  // Resetowanie wszystkich mocków przed każdym testem
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: '1',
    firstname: 'Test',
    email: 'test@example.com',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    isVerfified: true,
    isActive: true,
    lastLogin: '2023-01-01',
    preferences: null
  };

  const waitForTimeout = 5000;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  // Mockowanie NetInfo
  describe( 'app opened actions', () => {
    it('powinien inicjalizować się z domyślnymi wartościami i sprawdzać uwierzytelnienie', async () => {
      (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(false);
      ( NetInfo.fetch as jest.Mock).mockResolvedValue({
        isConnected: false
      });
      ( NetInfo.addEventListener as jest.Mock).mockImplementation((callback) => {
        // callback({ isConnected: false });
        return jest.fn();
      });

      // Renderowanie hooka w kontekście
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      // Początkowy stan - ładowanie powinno być true
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.user).toBeNull();

      // Oczekiwanie na zakończenie sprawdzania uwierzytelnienia
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: waitForTimeout });
      
      // Po sprawdzeniu - powinniśmy pozostać niezalogowani
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.user).toBeNull();
      expect(AuthService.isAuthenticated).toHaveBeenCalledTimes(1);
      expect( NetInfo.fetch).toHaveBeenCalledTimes(1);
      expect(result.current.isConnected).toBe(false);
    }, waitForTimeout);

    it('powinien załadować dane użytkownika, jeśli jest uwierzytelniony i online', async () => {
      // Ustawienie mocków AuthService
      (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      (NetInfo.fetch as jest.Mock).mockResolvedValue({
        isConnected: true,
        isInternetReachable: true
      });
      (AuthService.loadCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      ( NetInfo.addEventListener as jest.Mock).mockImplementation((callback) => {
        // callback({ isConnected: true, isInternetReachable: true });
        return jest.fn();
      });
      
      // Renderowanie hooka w kontekście
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Oczekiwanie na zakończenie sprawdzania uwierzytelnienia
      await waitFor(() => {
        console.log('isLoading', result.current.isLoading);
        expect(result.current.isLoading).toBe(false);
      }, { timeout: waitForTimeout });
      
      // Po sprawdzeniu - powinniśmy być zalogowani z danymi użytkownika
      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isConnected).toBe(true);
      expect(AuthService.isAuthenticated).toHaveBeenCalledTimes(1);
      expect(AuthService.loadCurrentUser).toHaveBeenCalledTimes(1);
      expect( NetInfo.fetch).toHaveBeenCalledTimes(1);
    }, waitForTimeout);

    it('powinien załadować dane użytkownika, jeśli jest uwierzytelniony i offline', async () => {
      // Ustawienie mocków AuthService
      (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      (NetInfo.fetch as jest.Mock).mockResolvedValue({
        isConnected: false
      });
      (AuthService.loadCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      
      // Renderowanie hooka w kontekście
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Oczekiwanie na zakończenie sprawdzania uwierzytelnienia
      await waitFor(() => {
        console.log('isLoading', result.current.isLoading);
        expect(result.current.isLoading).toBe(false);
      }, { timeout: waitForTimeout });
      
      // Po sprawdzeniu - powinniśmy być zalogowani z danymi użytkownika
      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isConnected).toBe(false);
      expect(AuthService.isAuthenticated).toHaveBeenCalledTimes(1);
      expect(AuthService.loadCurrentUser).toHaveBeenCalledTimes(1);
      expect( NetInfo.fetch).toHaveBeenCalledTimes(1);
    }, waitForTimeout);

    it('powinien obsłużyć błąd loadCurrentUser i spróbować getCurrentUser', async () => {
      // Ustawienie mocków AuthService
      (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      (AuthService.loadCurrentUser as jest.Mock).mockRejectedValue(new Error('API Error'));
      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (NetInfo.fetch as jest.Mock).mockResolvedValue({
        isConnected: true
      });
      
      // Renderowanie hooka w kontekście
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Oczekiwanie na zakończenie sprawdzania uwierzytelnienia
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: waitForTimeout });
      
      // Po sprawdzeniu - powinniśmy być zalogowani z danymi użytkownika z getCurrentUser
      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isConnected).toBe(true);
      expect(AuthService.loadCurrentUser).toHaveBeenCalledTimes(1);
      expect(AuthService.getCurrentUser).toHaveBeenCalledTimes(1);
      expect( NetInfo.fetch).toHaveBeenCalledTimes(1);
    }, waitForTimeout);
  })

  // tu trza zamienic na to ze jest sprawdzanie interneta
  describe( 'login', () => {
    it('powinien pomyślnie zalogować użytkownika', async () => {
      // Ustawienie mocków AuthService
      (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(false);
      (AuthService.login as jest.Mock).mockResolvedValue(true);
      (AuthService.loadCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      
      // Renderowanie hooka w kontekście
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Oczekiwanie na zakończenie początkowego sprawdzania uwierzytelnienia
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: waitForTimeout });
      
      // Wykonanie logowania
      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.login( mockUser.email, 'password123', true);
      });
      
      // Sprawdzenie wyniku
      expect(success).toBe(true);
      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        remember_me: true
      });
      expect(AuthService.loadCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('powinien obsłużyć nieudane logowanie', async () => {
      // Ustawienie mocków AuthService
      (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(false);
      (AuthService.login as jest.Mock).mockResolvedValue(false);
      
      // Renderowanie hooka w kontekście
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Oczekiwanie na zakończenie początkowego sprawdzania uwierzytelnienia
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Wykonanie logowania
      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.login('wrong@example.com', 'wrongpass', false);
      });
      
      // Sprawdzenie wyniku
      expect(success).toBe(false);
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.user).toBeNull();
      expect(AuthService.loadCurrentUser).not.toHaveBeenCalled();
    });

    it('powinien obsłużyć błąd podczas logowania', async () => {
      // Ustawienie mocków AuthService
      (AuthService.isAuthenticated as jest.Mock).mockResolvedValue(false);
      (AuthService.login as jest.Mock).mockRejectedValue(new Error('Login failed'));
      
      // Renderowanie hooka w kontekście
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Oczekiwanie na zakończenie początkowego sprawdzania uwierzytelnienia
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Wykonanie logowania i oczekiwanie na błąd
      await expect(async () => {
        await act(async () => {
          await result.current.login('error@example.com', 'errorpass', false);
        });
      }).rejects.toThrow('Login failed');
      
      // Stan powinien pozostać niezalogowany
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.user).toBeNull();
    });

  })

  describe( 'register', () => {
    it('powinien pomyślnie zarejestrować użytkownika', async () => {
      ( AuthService.isAuthenticated as jest.Mock).mockResolvedValue(false);
      (AuthService.register as jest.Mock).mockResolvedValue(true);

      // Renderowanie hooka w kontekście
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: waitForTimeout });

      // Wykonanie rejestracji
      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.register(
          mockUser.firstname,
          mockUser.email,
          'password123',
          'password123',
          true
        );
      });
      // Sprawdzenie wyniku
      expect(success).toBe(true);
    })
  });
});