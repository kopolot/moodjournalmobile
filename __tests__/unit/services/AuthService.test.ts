import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, RegisterData } from '@/services/authService';
import { apiClient } from '@/services/apiClient';
import { STORAGE_CONFIG } from '@/config/appConfig';

jest.mock('@/services/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
  },
}));

describe('AuthService — unit', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  describe('saveUserSession', () => {
    it('stores JWT in AsyncStorage', async () => {
      await (AuthService as any).saveUserSession('test_token');

      await expect(AsyncStorage.getItem(STORAGE_CONFIG.USER_TOKEN_KEY)).resolves.toBe('test_token');
    });
  });

  describe('getCurrentUser', () => {
    it('returns parsed user from AsyncStorage', async () => {
      const mockUserData = {
        id: '1',
        firstname: 'Test',
        email: 'test@example.com',
        isActive: true,
      };

      await AsyncStorage.setItem(STORAGE_CONFIG.USER_DATA_KEY, JSON.stringify(mockUserData));

      await expect(AuthService.getCurrentUser()).resolves.toEqual(mockUserData);
    });

    it('returns null when storage is empty', async () => {
      await expect(AuthService.getCurrentUser()).resolves.toBeNull();
    });

    it('returns null on storage error', async () => {
      jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage error'));

      await expect(AuthService.getCurrentUser()).resolves.toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns true when token exists', async () => {
      await AsyncStorage.setItem(STORAGE_CONFIG.USER_TOKEN_KEY, 'test_token');
      await expect(AuthService.isAuthenticated()).resolves.toBe(true);
    });

    it('returns false when token is missing', async () => {
      await expect(AuthService.isAuthenticated()).resolves.toBe(false);
    });
  });

  describe('login', () => {
    it('persists jwt_token from API response', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: { jwt_token: 'jwt-abc' },
      });

      const response = await AuthService.login({
        email: 'test@test.pl',
        password: 'secret',
        remember_me: true,
      });

      expect(response.success).toBe(true);
      await expect(AsyncStorage.getItem(STORAGE_CONFIG.USER_TOKEN_KEY)).resolves.toBe('jwt-abc');
    });
  });

  describe('register', () => {
    it('returns API response payload', async () => {
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

      await expect(AuthService.register(mockUserData)).resolves.toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('clears token and cached user', async () => {
      await AsyncStorage.multiSet([
        [STORAGE_CONFIG.USER_TOKEN_KEY, 'jwt'],
        [STORAGE_CONFIG.USER_DATA_KEY, '{"id":"1"}'],
      ]);

      await expect(AuthService.logout()).resolves.toBe(true);
      await expect(AsyncStorage.getItem(STORAGE_CONFIG.USER_TOKEN_KEY)).resolves.toBeNull();
      await expect(AsyncStorage.getItem(STORAGE_CONFIG.USER_DATA_KEY)).resolves.toBeNull();
    });
  });
});
