import * as React from 'react';
import { renderWithProviders } from '../../__tests__/testUtils/renderWithProviders';
import { ThemedText } from '../ThemedText';

describe('ThemedText', () => {
  it('renders with theme colors', () => {
    const { getByText } = renderWithProviders(<ThemedText>Snapshot test!</ThemedText>);
    expect(getByText('Snapshot test!')).toBeTruthy();
  });
});
