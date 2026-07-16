import { apiClient, ApiResponse } from './apiClient';
import { API_CONFIG, APP_LOGIC_CONFIG } from '@/config/appConfig';
import { createIdempotencyKey } from '@/utils/idempotency';

export type AspectKey = (typeof APP_LOGIC_CONFIG.specificMoods)[number];

export interface AspectValue {
  score: number;
  note?: string | null;
}

export interface MoodEntry {
  id: string;
  overallMood: number;
  aspects: Record<string, AspectValue>;
  note?: string | null;
  xpEarned: number;
  createdAt: string;
  updatedAt: string;
}

export interface MoodStats {
  xpTotal: number;
  level: number;
  xpIntoLevel: number;
  xpPerLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastMoodDate: string | null;
  loggedToday: boolean;
  entryCount: number;
  averageOverall7d: number | null;
  subscriptionTier: string;
  aiAnalysisUnlocked: boolean;
  advancedReportsUnlocked?: boolean;
}

export interface MoodAnalysisTip {
  id: string;
  priority: 'high' | 'medium' | 'low' | string;
  titleKey: string;
  bodyKey: string;
  params?: Record<string, string | number>;
}

export interface MoodAnalysisHighlight {
  type: string;
  titleKey: string;
  params?: Record<string, string | number | null | undefined>;
}

export interface MoodAspectInsight {
  aspect: AspectKey | string;
  average: number;
  samples: number;
  status: 'strength' | 'focus' | 'neutral' | string;
}

export interface MoodAnalysis {
  unlocked: boolean;
  tier: string;
  engine: string;
  windowDays: number;
  entryCount: number;
  minEntries: number;
  ready: boolean;
  summary: {
    headlineKey: string;
    detailKey: string;
    params?: Record<string, string | number>;
  } | null;
  trend: string;
  averageOverall: number | null;
  volatility?: string;
  aspectInsights: MoodAspectInsight[];
  coachingTips: MoodAnalysisTip[];
  highlights: MoodAnalysisHighlight[];
  generatedAt: string;
}

export interface CreateMoodPayload {
  overallMood: number;
  aspects: Record<AspectKey, AspectValue>;
  note?: string | null;
}

export interface CheckinHints {
  windowDays: number;
  deviationThreshold: number;
  dropThreshold: number;
  aspectAverages: Partial<Record<AspectKey, number>>;
  overallAverage: number | null;
  priorOverallAverage: number | null;
  noticeableDrop: boolean;
  noteMinLength: number;
}

export function isNoteRequiredForScore(
  score: number,
  average: number | null | undefined,
  noticeableDrop: boolean,
  deviationThreshold = 1
): boolean {
  if (noticeableDrop) return true;
  // Cold start / no history yet — require a short note.
  if (average == null) return true;
  return Math.abs(score - average) >= deviationThreshold;
}

export class MoodService {
  static async getCheckinHints(): Promise<CheckinHints | null> {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.MOOD.CHECKIN_HINTS);
    if (response.success && response.data) {
      return response.data as CheckinHints;
    }
    return null;
  }

  static async getStats(): Promise<MoodStats | null> {
    const response = await apiClient.get<ApiResponse & { data: MoodStats }>(
      API_CONFIG.ENDPOINTS.MOOD.STATS
    );
    if (response.success && response.data) {
      return response.data as MoodStats;
    }
    return null;
  }

  static async getAnalysis(refresh = false): Promise<{
    analysis: MoodAnalysis | null;
    locked: boolean;
    message?: string;
  }> {
    const url = refresh
      ? `${API_CONFIG.ENDPOINTS.MOOD.ANALYSIS}?refresh=1`
      : API_CONFIG.ENDPOINTS.MOOD.ANALYSIS;
    const response = await apiClient.get<ApiResponse & { data: MoodAnalysis }>(url);
    if (response.success && response.data) {
      return { analysis: response.data as MoodAnalysis, locked: false };
    }
    const code = response.message?.[0] || '';
    if (code === 'mood.analysis.locked') {
      return { analysis: null, locked: true, message: code };
    }
    return { analysis: null, locked: false, message: code || undefined };
  }

  static async list(limit = 30, offset = 0): Promise<{ items: MoodEntry[]; total: number }> {
    const response = await apiClient.get<
      ApiResponse & { data: { items: MoodEntry[]; total: number } }
    >(`${API_CONFIG.ENDPOINTS.MOOD.LIST}?limit=${limit}&offset=${offset}`);

    if (response.success && response.data) {
      return response.data as { items: MoodEntry[]; total: number };
    }
    return { items: [], total: 0 };
  }

  static async create(
    payload: CreateMoodPayload,
    options?: { idempotencyKey?: string }
  ): Promise<{ entry: MoodEntry; stats: MoodStats } | null> {
    const response = await apiClient.post<
      ApiResponse & { data: { entry: MoodEntry; stats: MoodStats } }
    >(API_CONFIG.ENDPOINTS.MOOD.CREATE, payload, {
      headers: {
        'Idempotency-Key': options?.idempotencyKey ?? createIdempotencyKey(),
      },
    });

    if (response.success && response.data) {
      return response.data as { entry: MoodEntry; stats: MoodStats };
    }
    return null;
  }

  static async get(id: string): Promise<MoodEntry | null> {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.MOOD.DETAIL(id));
    const data = response.data as { entry?: MoodEntry } | undefined;
    if (response.success && data?.entry) {
      return data.entry;
    }
    return null;
  }

  static async update(
    id: string,
    payload: Partial<CreateMoodPayload>
  ): Promise<MoodEntry | null> {
    const response = await apiClient.patch(API_CONFIG.ENDPOINTS.MOOD.DETAIL(id), payload);
    const data = response.data as { entry?: MoodEntry } | undefined;
    if (response.success && data?.entry) {
      return data.entry;
    }
    return null;
  }

  static async remove(id: string): Promise<boolean> {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.MOOD.DETAIL(id));
    return !!response.success;
  }
}
