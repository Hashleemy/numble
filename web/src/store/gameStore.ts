import { create } from 'zustand';
import {
  generateNumbers,
  generateTarget,
  validateExpression,
  calculateScore,
  advanceLevel,
  type LevelState,
} from '@numble/shared';
import { useSettingsStore, TIMER_SECONDS } from './settingsStore';

export type GameStatus = 'idle' | 'playing' | 'solved' | 'failed';

interface GameStore extends LevelState {
  numbers:        number[];
  target:         number;
  expression:     string;
  timeRemaining:  number;
  totalTime:      number;
  gameStatus:     GameStatus;
  lastScoreDelta: number;
  timeTaken:      number;
  lastExpression: string;

  // Session-level counters (reset on startGame, preserved across nextPuzzle)
  sessionRoundsPlayed: number;
  sessionRoundsWon:    number;
  sessionMaxStreak:    number;
  sessionStartedAt:    string;

  startGame:          () => void;
  appendToExpression: (token: string) => void;
  backspace:          () => void;
  clearExpression:    () => void;
  submitExpression:   () => void;
  tick:               () => void;
  nextPuzzle:         () => void;
  resetGame:          () => void;
}

function freshPuzzle(timeSeconds: number) {
  return {
    numbers:       generateNumbers(),
    target:        generateTarget(),
    expression:    '',
    timeRemaining: timeSeconds,
    totalTime:     timeSeconds,
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...freshPuzzle(TIMER_SECONDS['normal']),
  gameStatus:     'idle',
  lastScoreDelta: 0,
  timeTaken:      0,
  lastExpression: '',
  level:          1,
  score:          0,
  streak:         0,

  sessionRoundsPlayed: 0,
  sessionRoundsWon:    0,
  sessionMaxStreak:    0,
  sessionStartedAt:    '',

  startGame() {
    const { timerDifficulty } = useSettingsStore.getState();
    const secs = TIMER_SECONDS[timerDifficulty];
    set({
      ...freshPuzzle(secs),
      gameStatus:          'playing',
      timeTaken:           0,
      lastExpression:      '',
      sessionRoundsPlayed: 0,
      sessionRoundsWon:    0,
      sessionMaxStreak:    0,
      sessionStartedAt:    new Date().toISOString(),
    });
  },

  appendToExpression(token) {
    if (get().gameStatus !== 'playing') return;
    set((s) => ({ expression: s.expression + token }));
  },

  backspace() {
    if (get().gameStatus !== 'playing') return;
    set((s) => ({ expression: s.expression.slice(0, -1) }));
  },

  clearExpression() {
    if (get().gameStatus !== 'playing') return;
    set({ expression: '' });
  },

  submitExpression() {
    const { expression, numbers, target, timeRemaining, totalTime, level, score, streak,
            sessionRoundsPlayed, sessionRoundsWon, sessionMaxStreak } = get();
    if (get().gameStatus !== 'playing') return;

    const result = validateExpression(expression, numbers, target);
    if (!result.valid) return;

    const taken       = totalTime - timeRemaining;
    const scoreResult = calculateScore(timeRemaining, streak);
    const next        = advanceLevel({ level, score, streak }, true, scoreResult);
    const newStreak   = next.streak;

    set({
      gameStatus:          'solved',
      lastScoreDelta:      scoreResult.total,
      timeTaken:           taken,
      lastExpression:      expression,
      level:               next.level,
      score:               next.score,
      streak:              newStreak,
      sessionRoundsPlayed: sessionRoundsPlayed + 1,
      sessionRoundsWon:    sessionRoundsWon + 1,
      sessionMaxStreak:    Math.max(sessionMaxStreak, newStreak),
    });
  },

  tick() {
    const { timeRemaining, gameStatus, totalTime, level, score, streak,
            sessionRoundsPlayed, sessionMaxStreak } = get();
    if (gameStatus !== 'playing') return;

    if (timeRemaining <= 1) {
      const next = advanceLevel({ level, score, streak }, false);
      set({
        timeRemaining:       0,
        timeTaken:           totalTime,
        gameStatus:          'failed',
        streak:              next.streak,
        sessionRoundsPlayed: sessionRoundsPlayed + 1,
        sessionMaxStreak:    Math.max(sessionMaxStreak, streak),
      });
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  nextPuzzle() {
    const { timerDifficulty } = useSettingsStore.getState();
    const secs = TIMER_SECONDS[timerDifficulty];
    set({ ...freshPuzzle(secs), gameStatus: 'playing', timeTaken: 0, lastExpression: '' });
  },

  resetGame() {
    const { timerDifficulty } = useSettingsStore.getState();
    const secs = TIMER_SECONDS[timerDifficulty];
    set({
      ...freshPuzzle(secs),
      gameStatus:          'idle',
      level:               1,
      score:               0,
      streak:              0,
      lastScoreDelta:      0,
      timeTaken:           0,
      lastExpression:      '',
      sessionRoundsPlayed: 0,
      sessionRoundsWon:    0,
      sessionMaxStreak:    0,
      sessionStartedAt:    '',
    });
  },
}));
