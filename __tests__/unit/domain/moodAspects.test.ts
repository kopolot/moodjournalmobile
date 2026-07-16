import { APP_LOGIC_CONFIG } from '@/config/appConfig';
import { API_ASPECT_KEYS } from '../../testUtils/fixtures';

describe('mood domain — aspect keys', () => {
  it('matches Symfony MoodEntry::ASPECT_KEYS', () => {
    expect([...APP_LOGIC_CONFIG.specificMoods]).toEqual([...API_ASPECT_KEYS]);
  });

  it('uses API note minimum length of 5', () => {
    expect(APP_LOGIC_CONFIG.aspectNoteMinLength).toBe(5);
  });
});
