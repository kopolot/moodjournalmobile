/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

interface ColorType {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  card: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  accent: string;
  muted: string;
  primaryButton: string;
  secondaryButton: string;
  inputBackground: string;
  overlay: string;
  backgroundSecondary: string;
  shadow: string; 
  textDisabled: string;
  link: string;
}

const tintColorLight = '#4285F4';  // Jasny niebieski (Google Blue)
const tintColorDark = '#6BA7FF';   // Jaśniejszy niebieski dla ciemnego motywu

export const Colors = {
  light: {
    text: '#202124',           // Ciemny szary, prawie czarny
    background: '#FFFFFF',     // Czysta biel
    tint: tintColorLight,
    icon: '#5F6368',           // Średni szary
    tabIconDefault: '#5F6368', // Średni szary
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',           // Czysta biel
    border: '#DADCE0',         // Jasny szary
    notification: '#EA4335',   // Czerwony (Google Red)
    error: '#EA4335',          // Czerwony (Google Red)
    success: '#34A853',        // Zielony (Google Green)
    warning: '#FBBC05',        // Żółty (Google Yellow)
    info: '#4285F4',           // Niebieski (Google Blue)
    accent: '#F25C05',         // Pomarańczowy akcent
    muted: '#80868B',          // Przytłumiony szary
    primaryButton: tintColorLight,
    secondaryButton: '#E8EAED', // Bardzo jasny szary
    inputBackground: '#F8F9FA', // Prawie biały
    overlay: 'rgba(0,0,0,0.5)',
    backgroundSecondary: '#F1F3F4', // Jasny szary
    shadow: 'rgba(0, 0, 0, 0.1)', // Opcjonalny cień
    textDisabled: '#9AA0A6',   // Przytłumiony jasny szary
    link: '#1A73E8',           // Niebieski link (Google Link Blue)
  } as ColorType,
  dark: {
    text: '#E8EAED',           // Bardzo jasny szary, prawie biały
    background: '#202124',     // Ciemny szary, prawie czarny
    tint: tintColorDark,
    icon: '#9AA0A6',           // Średni jasny szary
    tabIconDefault: '#9AA0A6', // Średni jasny szary
    tabIconSelected: tintColorDark,
    card: '#2D2E30',           // Ciemny szary
    border: '#5F6368',         // Ciemniejszy szary
    notification: '#F28B82',   // Jaśniejszy czerwony
    error: '#F28B82',          // Jaśniejszy czerwony
    success: '#81C995',        // Jaśniejszy zielony
    warning: '#FDD663',        // Jaśniejszy żółty
    info: '#6BA7FF',           // Jaśniejszy niebieski
    accent: '#FF8F73',         // Jaśniejszy pomarańczowy akcent
    muted: '#9AA0A6',          // Przytłumiony jasny szary
    primaryButton: tintColorDark,
    secondaryButton: '#3C4043', // Ciemny szary
    inputBackground: '#303134', // Ciemniejszy szary
    overlay: 'rgba(0,0,0,0.7)',
    backgroundSecondary: '#2D2E30', // Ciemny szary
    shadow: 'rgba(255, 255, 255, 0.5)', // Opcjonalny cień
    textDisabled: '#5F6368',   // Przytłumiony szary
    link: '#8AB4F8',           // Jaśniejszy niebieski link
  } as ColorType,
};