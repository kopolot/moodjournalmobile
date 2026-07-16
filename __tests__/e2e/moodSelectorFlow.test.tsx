import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import MoodSelector from '@/components/form/partials/MoodSelector';
import { renderWithProviders } from '../testUtils/renderWithProviders';

describe('MoodSelector — component flow', () => {
  it('calls setMood when a scale button is pressed', async () => {
    const setMood = jest.fn();

    const { getByLabelText } = renderWithProviders(
      <MoodSelector mood={0} setMood={setMood} />
    );

    await act(async () => {
      fireEvent.press(getByLabelText('Good'));
    });

    expect(setMood).toHaveBeenCalledWith(5);
  });

  it('shows label for selected mood', () => {
    const { getByText } = renderWithProviders(<MoodSelector mood={5} setMood={jest.fn()} />);

    expect(getByText('Good')).toBeTruthy();
  });
});
