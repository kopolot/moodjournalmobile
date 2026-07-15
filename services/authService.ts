import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, ApiResponse } from './apiClient';
import { API_CONFIG, STORAGE_CONFIG } from '@/config/appConfig';

export interface UserPreferences {
  language?: string;
  darkMode?: boolean;
  dailyNotifications?: boolean;
}

export interface User {
  id: string;
  firstname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isVerfified: boolean;
  isActive: boolean;
  lastLogin: string;
  preferences: UserPreferences | null;
}

export interface LoginData {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface RegisterData {
  firstname: string;
  email: string;
  password: string;
  repeatPassword: string;
  acceptPrivacyPolicy: boolean;
}

export class AuthService {
  static async register(data: RegisterData): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        data,
        { requiresAuth: false }
      );

      if (!response.success) console.warn('Registration failed:', response.error);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'app.error' } as ApiResponse;
    }
  }

  static async login(data: LoginData): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        data,
        { requiresAuth: false }
      );

      if (response.success && response.data) {
        const dataObj = response.data as { jwt_token?: string };
        if (dataObj.jwt_token) {
          await this.saveUserSession(dataObj.jwt_token);
        }
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

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

  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_CONFIG.USER_TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  static async loadCurrentUser(): Promise<User | null> {
    const userToken = await AsyncStorage.getItem(STORAGE_CONFIG.USER_TOKEN_KEY);
    if (!userToken) return null;

    const response = await apiClient.get<{ data: User }>(API_CONFIG.ENDPOINTS.USER.PROFILE);

    if (response.success && response.data) {
      const user = response.data as User;
      await this.saveUserData(user);
      return user;
    }

    return null;
  }

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

  static async forgotPassword(email: string): Promise<ApiResponse> {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
      { requiresAuth: false }
    );
  }

  static async resetPassword(
    token: string,
    password: string,
    repeatPassword: string
  ): Promise<ApiResponse> {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, password, repeatPassword },
      { requiresAuth: false }
    );
  }

  static async changePassword(
    currentPassword: string,
    password: string,
    repeatPassword: string
  ): Promise<ApiResponse> {
    return apiClient.post(API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD, {
      currentPassword,
      password,
      repeatPassword,
    });
  }

  private static async saveUserSession(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_CONFIG.USER_TOKEN_KEY, token);
  }

  private static async saveUserData(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_CONFIG.USER_DATA_KEY, JSON.stringify(user));
  }
}
