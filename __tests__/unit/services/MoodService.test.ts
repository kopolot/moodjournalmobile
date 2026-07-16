import { apiClient } from '@/services/apiClient';
import { API_CONFIG } from '@/config/appConfig';
import {
  MoodService,
  isNoteRequiredForScore,
  type CreateMoodPayload,
} from '@/services/moodService';
import { makeMoodEntry, makeMoodStats } from '../../testUtils/fixtures';

jest.mock('@/services/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('MoodService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exports isNoteRequiredForScore from mood module', () => {
    expect(typeof isNoteRequiredForScore).toBe('function');
  });

  it('fetches check-in hints', async () => {
    const hints = { noticeableDrop: false, noteMinLength: 5 };
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ success: true, data: hints });

    const result = await MoodService.getCheckinHints();

    expect(apiClient.get).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.MOOD.CHECKIN_HINTS);
    expect(result).toEqual(hints);
  });

  it('creates mood entry with idempotency header', async () => {
    const entry = makeMoodEntry();
    const stats = makeMoodStats();
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { entry, stats },
    });

    const payload = {
      overallMood: 4,
      note: 'ok day',
      aspects: Object.fromEntries(
        entry.aspects &&
          Object.keys(entry.aspects).map((key) => [key, { score: 4, note: null }])
      ),
    } as CreateMoodPayload;

    const result = await MoodService.create(payload, { idempotencyKey: 'idem-123' });

    expect(apiClient.post).toHaveBeenCalledWith(
      API_CONFIG.ENDPOINTS.MOOD.CREATE,
      payload,
      { headers: { 'Idempotency-Key': 'idem-123' } }
    );
    expect(result).toEqual({ entry, stats });
  });

  it('returns null when create fails', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({ success: false, data: null });

    const payload = {
      overallMood: 3,
      aspects: {} as CreateMoodPayload['aspects'],
    };

    expect(await MoodService.create(payload)).toBeNull();
  });

  it('lists mood entries with pagination query', async () => {
    const items = [makeMoodEntry()];
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { items, total: 1 },
    });

    const result = await MoodService.list(10, 5);

    expect(apiClient.get).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.MOOD.LIST}?limit=10&offset=5`);
    expect(result).toEqual({ items, total: 1 });
  });

  it('parses single entry from get/update responses', async () => {
    const entry = makeMoodEntry({ id: 'entry-42' });
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ success: true, data: { entry } });
    (apiClient.patch as jest.Mock).mockResolvedValueOnce({ success: true, data: { entry } });

    expect(await MoodService.get('entry-42')).toEqual(entry);
    expect(await MoodService.update('entry-42', { overallMood: 5 })).toEqual(entry);
  });

  it('returns false when delete is unsuccessful', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValueOnce({ success: false });

    expect(await MoodService.remove('entry-1')).toBe(false);
  });

  it('fetches mood analysis and maps locked responses', async () => {
    const analysis = {
      unlocked: true,
      ready: true,
      engine: 'pattern',
      coachingTips: [],
    };
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ success: true, data: analysis });

    await expect(MoodService.getAnalysis()).resolves.toEqual({
      analysis,
      locked: false,
    });
    expect(apiClient.get).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.MOOD.ANALYSIS);

    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: ['mood.analysis.locked'],
    });
    await expect(MoodService.getAnalysis(true)).resolves.toEqual({
      analysis: null,
      locked: true,
      message: 'mood.analysis.locked',
    });
    expect(apiClient.get).toHaveBeenLastCalledWith(
      `${API_CONFIG.ENDPOINTS.MOOD.ANALYSIS}?refresh=1`
    );
  });
});
