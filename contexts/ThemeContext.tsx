import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/styles/colors';

const STORAGE_KEY = '@mood_dic_dark_mode';

type Scheme = 'light' | 'dark';

interface ThemeContextValue {
  darkMode: boolean;
  scheme: Scheme;
  colors: (typeof Colors)['light'];
  setDarkMode: (enabled: boolean) => Promise<void>;
  hydrateDarkMode: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useSystemColorScheme();
  const [override, setOverride] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === '1') setOverride(true);
      else if (value === '0') setOverride(false);
    });
  }, []);

  const darkMode = override ?? system === 'dark';
  const scheme: Scheme = darkMode ? 'dark' : 'light';

  const setDarkMode = useCallback(async (enabled: boolean) => {
    setOverride(enabled);
    await AsyncStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
  }, []);

  const hydrateDarkMode = useCallback((enabled: boolean) => {
    setOverride(enabled);
    AsyncStorage.setItem(STORAGE_KEY, enabled ? '1' : '0').catch(() => undefined);
  }, []);

  const value = useMemo(
    () => ({
      darkMode,
      scheme,
      colors: Colors[scheme],
      setDarkMode,
      hydrateDarkMode,
    }),
    [darkMode, scheme, setDarkMode, hydrateDarkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
