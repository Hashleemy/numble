import type { LevelState, ScoreResult } from './types';

export function advanceLevel(
  current: LevelState,
  solved: boolean,
  scoreResult?: ScoreResult
): LevelState {
  if (!solved) {
    return {
      level: 1,
      score: current.score,
      streak: 0,
    };
  }

  const gained = scoreResult ? scoreResult.total : 0;

  return {
    level: current.level + 1,
    score: current.score + gained,
    streak: current.streak + 1,
  };
}
