import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Web must follow ThemeProvider (user preference), not only the OS scheme.
 * Hydration guard keeps SSR/first paint stable until the client mounts.
 */
export function useColorScheme(): 'light' | 'dark' {
  const { scheme } = useTheme();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    return 'light';
  }

  return scheme;
}
