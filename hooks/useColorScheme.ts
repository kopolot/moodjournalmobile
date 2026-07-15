import { useTheme } from '@/contexts/ThemeContext';

/** Product theme (pref / system), used by navigation chrome. */
export function useColorScheme(): 'light' | 'dark' {
  return useTheme().scheme;
}
