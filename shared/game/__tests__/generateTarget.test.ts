import { generateTarget } from '../generateTarget';
import { MIN_TARGET, MAX_TARGET } from '../constants';

describe('generateTarget', () => {
  it('returns a value within [MIN_TARGET, MAX_TARGET]', () => {
    for (let i = 0; i < 50; i++) {
      const t = generateTarget();
      expect(t).toBeGreaterThanOrEqual(MIN_TARGET);
      expect(t).toBeLessThanOrEqual(MAX_TARGET);
    }
  });

  it('returns an integer', () => {
    expect(Number.isInteger(generateTarget())).toBe(true);
  });

  it('is deterministic with a seeded rng', () => {
    const seeded = () => 0.42;
    expect(generateTarget(seeded)).toBe(generateTarget(seeded));
  });
});
