import { generateNumbers } from '../generateNumbers';
import { NUMBER_COUNT, MIN_NUMBER, MAX_NUMBER } from '../constants';

describe('generateNumbers', () => {
  it('returns exactly NUMBER_COUNT values', () => {
    expect(generateNumbers()).toHaveLength(NUMBER_COUNT);
  });

  it('all values are within [MIN_NUMBER, MAX_NUMBER]', () => {
    const nums = generateNumbers();
    for (const n of nums) {
      expect(n).toBeGreaterThanOrEqual(MIN_NUMBER);
      expect(n).toBeLessThanOrEqual(MAX_NUMBER);
    }
  });

  it('all values are integers', () => {
    const nums = generateNumbers();
    for (const n of nums) {
      expect(Number.isInteger(n)).toBe(true);
    }
  });

  it('is deterministic with a seeded rng', () => {
    const seeded = () => 0.5;
    expect(generateNumbers(seeded)).toEqual(generateNumbers(seeded));
  });

  it('produces different results with different rng outputs', () => {
    const low = () => 0;
    const high = () => 0.9999;
    expect(generateNumbers(low)).not.toEqual(generateNumbers(high));
  });
});
