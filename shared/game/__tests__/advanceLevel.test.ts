import { advanceLevel } from '../advanceLevel';
import { LevelState, ScoreResult } from '../types';

const initial: LevelState = { level: 1, score: 0, streak: 0 };

const score: ScoreResult = { base: 10, timeBonus: 5, streakBonus: 0, total: 15 };

describe('advanceLevel — solved', () => {
  it('increments level by 1', () => {
    const next = advanceLevel(initial, true, score);
    expect(next.level).toBe(2);
  });

  it('adds score total', () => {
    const next = advanceLevel(initial, true, score);
    expect(next.score).toBe(15);
  });

  it('increments streak', () => {
    const next = advanceLevel({ ...initial, streak: 2 }, true, score);
    expect(next.streak).toBe(3);
  });

  it('works without a score result (gains 0 points)', () => {
    const next = advanceLevel(initial, true);
    expect(next.level).toBe(2);
    expect(next.score).toBe(0);
    expect(next.streak).toBe(1);
  });
});

describe('advanceLevel — not solved', () => {
  it('keeps level the same', () => {
    const next = advanceLevel(initial, false);
    expect(next.level).toBe(1);
  });

  it('keeps score the same', () => {
    const next = advanceLevel({ ...initial, score: 50 }, false);
    expect(next.score).toBe(50);
  });

  it('resets streak to 0', () => {
    const next = advanceLevel({ ...initial, streak: 5 }, false);
    expect(next.streak).toBe(0);
  });
});
