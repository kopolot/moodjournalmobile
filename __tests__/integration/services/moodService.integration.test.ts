import '../helpers/setupHttpMock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHttpMock } from '../helpers/setupHttpMock';
import { API_CONFIG, APP_LOGIC_CONFIG, STORAGE_CONFIG } from '@/config/appConfig';
import { MoodService } from '@/services/moodService';
import { makeMoodEntry, makeMoodStats } from '../../testUtils/fixtures';

describe('MoodService — HTTP integration', () => {
  const httpMock = getHttpMock();

  beforeEach(async () => {
    httpMock.reset();
    await AsyncStorage.setItem(STORAGE_CONFIG.USER_TOKEN_KEY, 'jwt-mood');
  });

  it('fetches check-in hints with auth header', async () => {
    httpMock.onGet(API_CONFIG.ENDPOINTS.MOOD.CHECKIN_HINTS).reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer jwt-mood');
      return [
        200,
        {
          success: true,
          data: {
            windowDays: 7,
            deviationThreshold: 1,
            dropThreshold: 1.5,
            aspectAverages: {},
            overallAverage: null,
            priorOverallAverage: null,
            noticeableDrop: false,
            noteMinLength: APP_LOGIC_CONFIG.aspectNoteMinLength,
          },
          error: '',
          message: [],
        },
      ];
    });

    const hints = await MoodService.getCheckinHints();

    expect(hints?.noteMinLength).toBe(5);
    expect(hints?.overallAverage).toBeNull();
  });

  it('creates check-in with Idempotency-Key header', async () => {
    const entry = makeMoodEntry();
    const stats = makeMoodStats();

    httpMock.onPost(API_CONFIG.ENDPOINTS.MOOD.CREATE).reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer jwt-mood');
      expect(config.headers?.['Idempotency-Key']).toBe('idem-flow-1');
      expect(JSON.parse(config.data as string).overallMood).toBe(4);
      return [
        200,
        {
          success: true,
          data: { entry, stats },
          error: '',
          message: [],
        },
      ];
    });

    const aspects = Object.fromEntries(
      APP_LOGIC_CONFIG.specificMoods.map((key) => [key, { score: 4, note: null }])
    );

    const result = await MoodService.create(
      { overallMood: 4, aspects, note: 'steady day' },
      { idempotencyKey: 'idem-flow-1' }
    );

    expect(result?.entry.id).toBe(entry.id);
    expect(result?.stats.currentStreak).toBe(stats.currentStreak);
  });
});
