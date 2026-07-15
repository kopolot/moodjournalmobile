import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthService, User } from '@/services/authService';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { APP_CONFIG } from '@/config/appConfig';
import { ApiResponse } from '@/services/apiClient';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import { fromApiLanguage } from '@/utils/preferences';
import { NotificationService } from '@/services/notificationService';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string, remember_me: boolean) => Promise<ApiResponse>;
  register: (
    email: string,
    password: string,
    repeatPassword: string,
    firstname: string,
    acceptPrivacyPolicy: boolean
  ) => Promise<ApiResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isConnected: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { setLanguage } = useI18n();
  const { hydrateDarkMode } = useTheme();

  const applyUserPreferences = async (userData: User | null) => {
    if (!userData?.preferences) return;
    const prefs = userData.preferences;
    if (prefs.language) {
      await setLanguage(fromApiLanguage(prefs.language));
    }
    if (typeof prefs.darkMode === 'boolean') {
      hydrateDarkMode(prefs.darkMode);
    }
    if (typeof prefs.dailyNotifications === 'boolean') {
      await NotificationService.hydrateEnabled(prefs.dailyNotifications);
    }
  };

  const checkAuth = async () => {
    try {
      const isAuthenticated = await AuthService.isAuthenticated();
      if (isAuthenticated) {
        let userData: User | null = null;
        try {
          userData = await AuthService.loadCurrentUser();
        } catch {
          userData = await AuthService.getCurrentUser();
        }
        if (userData) {
          setUser(userData);
          setIsLoggedIn(true);
          await applyUserPreferences(userData);
        } else {
          throw new Error('User authenticated but no data found');
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const changeConnectionStatus = (state: NetInfoState) => {
      if (__DEV__ && APP_CONFIG.DEV.FORCE_OFFLINE) {
        setIsConnected(false);
      } else {
        setIsConnected(!!(state.isConnected && state.isInternetReachable));
      }
    };

    NetInfo.fetch().then(changeConnectionStatus);
    const unsubscribe = NetInfo.addEventListener(changeConnectionStatus);
    checkAuth();

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string,
    remember_me: boolean
  ): Promise<ApiResponse> => {
    try {
      const response = await AuthService.login({ email, password, remember_me });
      if (response.success) {
        const userData = await AuthService.loadCurrentUser();
        setUser(userData);
        setIsLoggedIn(true);
        await applyUserPreferences(userData);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    repeatPassword: string,
    firstname: string,
    acceptPrivacyPolicy: boolean
  ): Promise<ApiResponse> => {
    try {
      return await AuthService.register({
        firstname,
        email,
        password,
        repeatPassword,
        acceptPrivacyPolicy,
      });
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'app.error' } as ApiResponse;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await AuthService.loadCurrentUser();
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
        await applyUserPreferences(userData);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        register,
        logout,
        refreshUser,
        isConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
