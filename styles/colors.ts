/**
 * MoodDic — playful, Duolingo-inspired palette (green-first, energetic).
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
  xp: string;
  streak: string;
  surfaceStrong: string;
  onPrimary: string;
}

export const Brand = {
  green: '#58CC02',
  greenDark: '#46A302',
  greenSoft: '#E5F8D0',
  blue: '#1CB0F6',
  gold: '#FFC800',
  streak: '#FF9600',
  red: '#FF4B4B',
  ink: '#3C3C3C',
  mist: '#F0F4F8',
  skyWash: '#DDF4FF',
  creamWash: '#FFF8E7',
};

export const MoodScale = [
  { level: 1, color: '#FF4B4B', emoji: '😫', labelKey: 'mood.scale.1' },
  { level: 2, color: '#FF9600', emoji: '😕', labelKey: 'mood.scale.2' },
  { level: 3, color: '#FFC800', emoji: '😐', labelKey: 'mood.scale.3' },
  { level: 4, color: '#A5D631', emoji: '🙂', labelKey: 'mood.scale.4' },
  { level: 5, color: '#58CC02', emoji: '😄', labelKey: 'mood.scale.5' },
  { level: 6, color: '#1CB0F6', emoji: '🤩', labelKey: 'mood.scale.6' },
] as const;

export const Colors = {
  light: {
    text: Brand.ink,
    background: Brand.mist,
    tint: Brand.green,
    icon: '#777777',
    tabIconDefault: '#AFAFAF',
    tabIconSelected: Brand.green,
    card: '#FFFFFF',
    border: '#E5E5E5',
    notification: Brand.red,
    error: Brand.red,
    success: Brand.green,
    warning: Brand.gold,
    info: Brand.blue,
    accent: Brand.streak,
    muted: '#777777',
    primaryButton: Brand.green,
    secondaryButton: '#E5E5E5',
    inputBackground: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.45)',
    backgroundSecondary: Brand.skyWash,
    shadow: 'rgba(60, 60, 60, 0.12)',
    textDisabled: '#AFAFAF',
    link: Brand.blue,
    xp: Brand.gold,
    streak: Brand.streak,
    surfaceStrong: Brand.greenSoft,
    onPrimary: '#FFFFFF',
  } as ColorType,
  dark: {
    text: '#F5F5F5',
    background: '#1A1F24',
    tint: Brand.green,
    icon: '#B0B0B0',
    tabIconDefault: '#6B6B6B',
    tabIconSelected: Brand.green,
    card: '#252B31',
    border: '#3A424A',
    notification: '#FF6B6B',
    error: '#FF6B6B',
    success: Brand.green,
    warning: Brand.gold,
    info: Brand.blue,
    accent: Brand.streak,
    muted: '#9A9A9A',
    primaryButton: Brand.green,
    secondaryButton: '#3A424A',
    inputBackground: '#2C333A',
    overlay: 'rgba(0,0,0,0.65)',
    backgroundSecondary: '#243038',
    shadow: 'rgba(0, 0, 0, 0.4)',
    textDisabled: '#6B6B6B',
    link: Brand.blue,
    xp: Brand.gold,
    streak: Brand.streak,
    surfaceStrong: '#2A3A22',
    onPrimary: '#FFFFFF',
  } as ColorType,
};
