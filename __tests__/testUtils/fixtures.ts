import type { CheckinHints, MoodEntry, MoodStats } from '@/services/moodService';
import type { User } from '@/services/authService';
import { APP_LOGIC_CONFIG } from '@/config/appConfig';

export const API_ASPECT_KEYS = [
  'close_relationships',
  'romantic_relationships',
  'duties',
  'physical_health',
  'finances',
  'relaxation',
  'growth_spirituality',
  'environment',
] as const;

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    firstname: 'Test',
    email: 'test@example.com',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    isVerified: true,
    isActive: true,
    lastLogin: '2026-01-01T00:00:00Z',
    preferences: null,
    ...overrides,
  };
}

export function makeColdStartHints(overrides: Partial<CheckinHints> = {}): CheckinHints {
  return {
    windowDays: 7,
    deviationThreshold: 1,
    dropThreshold: 1.5,
    aspectAverages: {},
    overallAverage: null,
    priorOverallAverage: null,
    noticeableDrop: false,
    noteMinLength: APP_LOGIC_CONFIG.aspectNoteMinLength,
    ...overrides,
  };
}

export function makeMoodStats(overrides: Partial<MoodStats> = {}): MoodStats {
  return {
    xpTotal: 120,
    level: 2,
    xpIntoLevel: 20,
    xpPerLevel: 100,
    currentStreak: 3,
    longestStreak: 5,
    lastMoodDate: '2026-07-15',
    loggedToday: false,
    entryCount: 12,
    averageOverall7d: 4.2,
    subscriptionTier: 'free',
    aiAnalysisUnlocked: false,
    ...overrides,
  };
}

export function makeMoodEntry(overrides: Partial<MoodEntry> = {}): MoodEntry {
  const aspects = Object.fromEntries(
    APP_LOGIC_CONFIG.specificMoods.map((key) => [key, { score: 4, note: null }])
  );

  return {
    id: 'entry-1',
    overallMood: 4,
    aspects,
    note: null,
    xpEarned: 15,
    createdAt: '2026-07-16T10:00:00Z',
    updatedAt: '2026-07-16T10:00:00Z',
    ...overrides,
  };
}
