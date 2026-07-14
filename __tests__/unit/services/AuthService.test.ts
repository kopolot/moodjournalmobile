import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, RegisterData } from '../../../services/authService';
import { apiClient } from '@/services/apiClient';
import { STORAGE_CONFIG } from '../../../config/appConfig';

// Mock dla modułów zewnętrznych
jest.mock('@/services/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
  }
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('AuthService - testy jednostkowe', () => {
  // Resetowanie wszystkich mocków przed każdym testem
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveUserSession', () => {
    it('powinien zapisać token w AsyncStorage', async () => {
      // Wywołanie testowanej metody
      await (AuthService as any).saveUserSession('test_token');

      // Sprawdzenie czy AsyncStorage.setItem został wywołany z prawidłowymi argumentami
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_CONFIG.USER_TOKEN_KEY,
        'test_token'
      );
    });

    it('powinien zgłosić wyjątek, gdy AsyncStorage.setItem zawiedzie', async () => {
      // Symulacja błędu
      const mockError = new Error('Storage error');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(mockError);

      // Sprawdzenie czy metoda zgłasza wyjątek
      await expect((AuthService as any).saveUserSession('test_token'))
        .rejects.toThrow('Storage error');

      // Sprawdzenie czy funkcja została wywołana
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('powinien zwrócić dane użytkownika z AsyncStorage', async () => {
      // Przygotowanie danych testowych
      const mockUserData = {
        id: '1',
        firstname: 'Test',
        email: 'test@example.com',
        isActive: true
      };

      // Symulacja odpowiedzi z AsyncStorage
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockUserData)
      );

      // Wywołanie testowanej metody
      const result = await AuthService.getCurrentUser();

      // Sprawdzenie wyniku
      expect(result).toEqual(mockUserData);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        STORAGE_CONFIG.USER_DATA_KEY
      );
    });

    it('powinien zwrócić null, gdy nie ma danych użytkownika', async () => {
      // Symulacja braku danych w AsyncStorage
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      // Wywołanie testowanej metody
      const result = await AuthService.getCurrentUser();

      // Sprawdzenie wyniku
      expect(result).toBeNull();
    });

    it('powinien obsłużyć błąd i zwrócić null', async () => {
      // Symulacja błędu
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      // Wywołanie testowanej metody
      const result = await AuthService.getCurrentUser();

      // Sprawdzenie wyniku
      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('powinien zwrócić true, gdy użytkownik jest zalogowany', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('test_token');

      const result = await AuthService.isAuthenticated();

      expect(result).toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        STORAGE_CONFIG.USER_TOKEN_KEY
      );
    });

    it('powinien zwrócić false, gdy brak danych użytkownika', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await AuthService.isAuthenticated();

      expect(result).toBe(false);
    });

    it('powinien zwrócić false i obsłużyć wyjątek', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

      const result = await AuthService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('register', () => {
    it('test valid register', async () => {
      const mockUserData = {
        firstname: 'Test',
        email: 'test@test.pl',
        password: 'test123',
        repeatPassword: 'test123',
        acceptPrivacyPolicy: true,
      } as RegisterData;

      const mockResponse = {
        success: true,
        error: '',
        message: ['user.register.success'],
        data: {},
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await AuthService.register(mockUserData);
      expect(result).toEqual(mockResponse);
    });
  });
});