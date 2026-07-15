/** Map API Language enum ↔ i18n codes used in the app. */

export type AppLanguage = 'en' | 'pl';

export function toApiLanguage(lang: string): string {
  return lang.startsWith('pl') ? 'pl_PL' : 'en_EN';
}

export function fromApiLanguage(lang?: string | null): AppLanguage {
  if (!lang) return 'en';
  return lang.startsWith('pl') ? 'pl' : 'en';
}

export const LANGUAGE_OPTIONS: { code: AppLanguage; labelKey: string }[] = [
  { code: 'en', labelKey: 'profile.language.en' },
  { code: 'pl', labelKey: 'profile.language.pl' },
];
