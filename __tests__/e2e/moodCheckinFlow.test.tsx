import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../testUtils/renderWithProviders';
import { makeMoodEntry, makeMoodStats } from '../testUtils/fixtures';
import { APP_LOGIC_CONFIG } from '@/config/appConfig';
import { MoodService } from '@/services/moodService';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));

import MoodNoteScreen from '@/app/(app)/mood-note';

function hintsWithStableAverages() {
  return {
    windowDays: 7,
    deviationThreshold: 1,
    dropThreshold: 1.5,
    aspectAverages: Object.fromEntries(
      APP_LOGIC_CONFIG.specificMoods.map((key) => [key, 5])
    ),
    overallAverage: 5,
    priorOverallAverage: 5,
    noticeableDrop: false,
    noteMinLength: APP_LOGIC_CONFIG.aspectNoteMinLength,
  };
}

async function pickGoodAndNext(getByLabelText: (label: string) => unknown, getByText: (text: string) => unknown) {
  await act(async () => {
    fireEvent.press(getByLabelText('Good'));
  });
  await waitFor(() => expect(getByText('Good')).toBeTruthy());
  await act(async () => {
    fireEvent.press(getByText('Next'));
  });
}

describe('Mood check-in flow — e2e (screen level)', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(MoodService, 'getCheckinHints').mockResolvedValue(hintsWithStableAverages());
    jest.spyOn(MoodService, 'create').mockResolvedValue({
      entry: makeMoodEntry({ xpEarned: 20 }),
      stats: makeMoodStats({ currentStreak: 4 }),
    });
  });

  it('keeps user on step 1 until overall mood is selected', async () => {
    const { getByText } = renderWithProviders(<MoodNoteScreen />);

    await waitFor(() => expect(getByText('Check-in')).toBeTruthy());
    expect(getByText('1/10')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('Next'));
    });

    expect(getByText('1/10')).toBeTruthy();
    expect(MoodService.getCheckinHints).toHaveBeenCalled();
  });

  it('submits check-in with all aspects after wizard completion', async () => {
    const { getByLabelText, getByText } = renderWithProviders(<MoodNoteScreen />);

    await waitFor(() => expect(getByText('Check-in')).toBeTruthy());

    await pickGoodAndNext(getByLabelText, getByText);

    for (let step = 2; step <= APP_LOGIC_CONFIG.specificMoods.length + 1; step += 1) {
      await waitFor(() => expect(getByText(`${step}/10`)).toBeTruthy());
      await pickGoodAndNext(getByLabelText, getByText);
    }

    await waitFor(() => expect(getByText('Claim XP')).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByText('Claim XP'));
    });

    await waitFor(() => {
      expect(MoodService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          overallMood: 5,
          aspects: expect.objectContaining(
            Object.fromEntries(
              APP_LOGIC_CONFIG.specificMoods.map((key) => [
                key,
                expect.objectContaining({ score: 5 }),
              ])
            )
          ),
        }),
        expect.objectContaining({ idempotencyKey: expect.any(String) })
      );
    });

    await waitFor(() => {
      expect(getByText('+20 XP')).toBeTruthy();
    });
  });
});
