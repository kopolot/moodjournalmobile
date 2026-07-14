import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, ApiResponse } from './apiClient';
import { API_CONFIG, STORAGE_CONFIG } from '@/config/appConfig';

// Typ użytkownika
export interface User {
  id: string;
  firstname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isVerfified: boolean;
  isActive: boolean;
  lastLogin: string;
  preferences: object | null
}

// Typ odpowiedzi logowania z API
export interface AuthResponse {
  token: string;
}

// Dane do logowania
export interface LoginData {
  email: string;
  password: string;
  remember_me: boolean;
}

// Dane do rejestracji
export interface RegisterData {
  firstname: string;
  email: string;
  password: string;
  repeatPassword: string;
  acceptPrivacyPolicy: boolean;
}

/**
 * Serwis do obsługi uwierzytelniania i autoryzacji
 */
export class AuthService {
  /**
   * Rejestracja nowego użytkownika
   */
  static async register(data: RegisterData): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        data,
        { requiresAuth: false }
      );

      // Jeśli API zwróciło błąd
      if (!response.success)
        console.warn('Registration failed:', response.error);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'app.error' } as ApiResponse;
    }
  }

  /**
   * Logowanie użytkownika
   */
  static async login(data: LoginData): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        data,
        { requiresAuth: false }
      );

      if (response.success && response.data) {
        // Zapisz dane sesji użytkownika
        await this.saveUserSession(response.data.jwt_token);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error
    }
  }

  /**
   * Wylogowanie użytkownika
   */
  static async logout(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_CONFIG.USER_TOKEN_KEY,
        STORAGE_CONFIG.USER_DATA_KEY,
      ]);

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  /**
   * Sprawdzenie czy użytkownik jest zalogowany
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_CONFIG.USER_TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  /**
   * Pobranie danych użytkownika z API
   * @returns {Promise<User | null>} Obiekt użytkownika lub null, jeśli nie znaleziono
   * @throws {Error} W przypadku błędu podczas pobierania danych
   */
  static async loadCurrentUser(): Promise<User | null> {
    const userToken = await AsyncStorage.getItem(STORAGE_CONFIG.USER_TOKEN_KEY);
    if (!userToken) return null;

    const response = await apiClient.get<{ data: User }>(API_CONFIG.ENDPOINTS.USER.PROFILE);

    if (response.success && response.data) {
      return response.data as User;
    }

    return null;
  }

  /**
   * Pobranie danych zalogowanego użytkownika
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_CONFIG.USER_DATA_KEY);
      if (!userData) return null;
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // od tąd niespradzone

  /**
   * Odświeżanie profilu użytkownika z API
   */
  static async refreshUserProfile(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ user: User }>(API_CONFIG.ENDPOINTS.USER.PROFILE);

      if (response.success && response.data?.user) {
        // Aktualizacja danych użytkownika w local storage
        const userData = response.data.user;
        await AsyncStorage.setItem(STORAGE_CONFIG.USER_TOKEN_KEY, JSON.stringify(userData));
        return userData;
      }

      return null;
    } catch (error) {
      console.error('Refresh user profile error:', error);
      return null;
    }
  }

  /**
   * Aktualizacja profilu użytkownika
   */
  static async updateProfile(userData: Partial<User>): Promise<User | null> {
    try {
      const response = await apiClient.put<{ user: User }>(
        API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE,
        userData
      );

      if (response.success && response.data?.user) {
        // Aktualizacja danych użytkownika w local storage
        const updatedUser = response.data.user;
        await AsyncStorage.setItem(STORAGE_CONFIG.USER_TOKEN_KEY, JSON.stringify(updatedUser));
        return updatedUser;
      }

      return null;
    } catch (error) {
      console.error('Update profile error:', error);
      return null;
    }
  }

  /**
   * Zmiana hasła użytkownika
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD,
        { currentPassword, newPassword }
      );

      return response.success;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  }

  /**
   * Zapisanie danych sesji użytkownika
   */
  private static async saveUserSession(token: string): Promise<void> {
    try {
      // Zapisz token
      await AsyncStorage.setItem(STORAGE_CONFIG.USER_TOKEN_KEY, token);
    } catch (error) {
      console.error('Save user session error:', error);
      throw error;
    }
  }

  private static async saveUserData(user: User): Promise<void> {
    try {
      // Zapisz dane użytkownika
      await AsyncStorage.setItem(STORAGE_CONFIG.USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Save user data error:', error);
      throw error;
    }
  }
}