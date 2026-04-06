import { calculateScore } from '../calculateScore';
import { POINTS_PER_SOLVE, TIME_BONUS_MULTIPLIER } from '../constants';

describe('calculateScore', () => {
  it('returns base points with no time and no streak', () => {
    const result = calculateScore(0, 0);
    expect(result.base).toBe(POINTS_PER_SOLVE);
    expect(result.timeBonus).toBe(0);
    expect(result.streakBonus).toBe(0);
    expect(result.total).toBe(POINTS_PER_SOLVE);
  });

  it('adds time bonus proportional to remaining time', () => {
    const result = calculateScore(20, 0);
    expect(result.timeBonus).toBe(Math.floor(20 * TIME_BONUS_MULTIPLIER));
    expect(result.total).toBe(POINTS_PER_SOLVE + result.timeBonus);
  });

  it('floors the time bonus', () => {
    const result = calculateScore(3, 0); // 3 * 0.5 = 1.5 → floors to 1
    expect(result.timeBonus).toBe(1);
  });

  it('applies streak bonus every 3 solves', () => {
    // streak=3: streakBonus = 10 * floor(3/3) = 10
    expect(calculateScore(0, 3).streakBonus).toBe(POINTS_PER_SOLVE);
    // streak=6: streakBonus = 10 * 2 = 20
    expect(calculateScore(0, 6).streakBonus).toBe(POINTS_PER_SOLVE * 2);
  });

  it('no streak bonus for streak < 3', () => {
    expect(calculateScore(0, 1).streakBonus).toBe(0);
    expect(calculateScore(0, 2).streakBonus).toBe(0);
  });

  it('clamps negative time to 0 bonus', () => {
    const result = calculateScore(-5, 0);
    expect(result.timeBonus).toBe(0);
    expect(result.total).toBe(POINTS_PER_SOLVE);
  });

  it('total equals base + timeBonus + streakBonus', () => {
    const result = calculateScore(15, 6);
    expect(result.total).toBe(result.base + result.timeBonus + result.streakBonus);
  });
});
