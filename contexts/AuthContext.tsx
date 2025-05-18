import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthService, User } from '@/services/authService';
import NetInfo, { NetInfoState} from '@react-native-community/netinfo';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, remember_me: boolean) => Promise<boolean>;
  register: ( email: string, password: string, repeatPassword: string, firstname: string, acceptPrivacyPolicy: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const isAuthenticated = await AuthService.isAuthenticated();
      if (isAuthenticated) {
        var userData;
        try{
          userData = await AuthService.loadCurrentUser();
        }catch(e){
          userData = await AuthService.getCurrentUser();
        }
        if( !!userData){
          setUser(userData);
          setIsLoggedIn(true);
        }else
          throw new Error('User authenticated but no data found');
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const changeConnectionStatus = ( state: NetInfoState) => {
      console.log('Connection status changed:', state);
      setIsConnected( state.isConnected && state.isInternetReachable || false);
    }

    // initial check
    NetInfo.fetch().then( changeConnectionStatus);

    const unsubscribe = NetInfo.addEventListener( changeConnectionStatus);

    checkAuth();

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, remember_me: boolean) => {
    setIsLoading(true);
    try {
      const success = await AuthService.login({ email, password, remember_me });
      if (success) {
        const userData = await AuthService.loadCurrentUser();
        setUser(userData);
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, repeatPassword: string, firstname: string, acceptPrivacyPolicy: boolean) => {
    setIsLoading(true);
    try {
      const success = await AuthService.register({
        firstname,
        email,
        password,
        repeatPassword,
        acceptPrivacyPolicy
       });
      return success;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isLoading,
        login,
        register,
        logout,
        isConnected
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};