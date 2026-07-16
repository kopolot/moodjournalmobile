import { fromApiLanguage, toApiLanguage } from '@/utils/preferences';

describe('preferences language mapping', () => {
  it('maps app language to API enum', () => {
    expect(toApiLanguage('en')).toBe('en_EN');
    expect(toApiLanguage('pl')).toBe('pl_PL');
    expect(toApiLanguage('pl-PL')).toBe('pl_PL');
  });

  it('maps API enum to app language', () => {
    expect(fromApiLanguage('en_EN')).toBe('en');
    expect(fromApiLanguage('pl_PL')).toBe('pl');
    expect(fromApiLanguage(null)).toBe('en');
    expect(fromApiLanguage(undefined)).toBe('en');
  });
});
