import { apiClient, ApiResponse } from './apiClient';
import { API_CONFIG } from '@/config/appConfig';

export type AspectKey = 'mood' | 'relationship' | 'activity' | 'environment';

export interface AspectValue {
  score: number;
  note?: string | null;
}

export interface MoodEntry {
  id: string;
  overallMood: number;
  aspects: Record<AspectKey, AspectValue>;
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
}

export interface CreateMoodPayload {
  overallMood: number;
  aspects: Record<AspectKey, AspectValue>;
  note?: string | null;
}

export class MoodService {
  static async getStats(): Promise<MoodStats | null> {
    const response = await apiClient.get<ApiResponse & { data: MoodStats }>(
      API_CONFIG.ENDPOINTS.MOOD.STATS
    );
    if (response.success && response.data) {
      return response.data as MoodStats;
    }
    return null;
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
    payload: CreateMoodPayload
  ): Promise<{ entry: MoodEntry; stats: MoodStats } | null> {
    const response = await apiClient.post<
      ApiResponse & { data: { entry: MoodEntry; stats: MoodStats } }
    >(API_CONFIG.ENDPOINTS.MOOD.CREATE, payload);

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

  static async remove(id: string): Promise<boolean> {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.MOOD.DETAIL(id));
    return !!response.success;
  }
}
