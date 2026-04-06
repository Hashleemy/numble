export type Operator = '+' | '-' | '*' | '/';

export type ValidationError =
  | 'division_by_zero'
  | 'syntax_error'
  | 'wrong_numbers'
  | 'wrong_result'
  | null;

export interface ValidationResult {
  valid: boolean;
  evaluated: number | null;
  error: ValidationError;
}

export interface ScoreResult {
  base: number;
  timeBonus: number;
  streakBonus: number;
  total: number;
}

export interface LevelState {
  level: number;
  score: number;
  streak: number;
}
