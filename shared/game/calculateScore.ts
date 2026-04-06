import { POINTS_PER_SOLVE, TIME_BONUS_MULTIPLIER } from './constants';
import type { ScoreResult } from './types';

export function calculateScore(
  timeRemainingSeconds: number,
  currentStreak: number
): ScoreResult {
  const base = POINTS_PER_SOLVE;
  const timeBonus = Math.floor(Math.max(0, timeRemainingSeconds) * TIME_BONUS_MULTIPLIER);
  const streakBonus = base * Math.floor(currentStreak / 3);
  const total = base + timeBonus + streakBonus;

  return { base, timeBonus, streakBonus, total };
}
