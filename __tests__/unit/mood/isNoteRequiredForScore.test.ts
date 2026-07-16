import { isNoteRequiredForScore } from '@/services/moodService';

describe('isNoteRequiredForScore', () => {
  it('requires a note on cold start (no average)', () => {
    expect(isNoteRequiredForScore(4, null, false)).toBe(true);
    expect(isNoteRequiredForScore(4, undefined, false)).toBe(true);
  });

  it('requires a note when noticeable drop is flagged', () => {
    expect(isNoteRequiredForScore(3, 4, true)).toBe(true);
    expect(isNoteRequiredForScore(5, 4, true)).toBe(true);
  });

  it('requires a note when score deviates from average by threshold', () => {
    expect(isNoteRequiredForScore(5, 4, false, 1)).toBe(true);
    expect(isNoteRequiredForScore(3, 4, false, 1)).toBe(true);
  });

  it('does not require a note when score matches average within threshold', () => {
    expect(isNoteRequiredForScore(4, 4, false, 1)).toBe(false);
    expect(isNoteRequiredForScore(4, 4.5, false, 1)).toBe(false);
  });

  it('respects custom deviation threshold', () => {
    expect(isNoteRequiredForScore(4, 3, false, 2)).toBe(false);
    expect(isNoteRequiredForScore(4, 2, false, 1)).toBe(true);
  });
});
