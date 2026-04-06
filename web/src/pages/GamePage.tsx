import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameBoard } from '../features/GameBoard';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { playWin, playLose } from '../lib/sounds';
import styles from './GamePage.module.css';

export function GamePage() {
  const navigate     = useNavigate();
  const gameStatus   = useGameStore((s) => s.gameStatus);
  const startGame    = useGameStore((s) => s.startGame);
  const resetGame    = useGameStore((s) => s.resetGame);
  const score        = useGameStore((s) => s.score);
  const streak       = useGameStore((s) => s.streak);
  const level        = useGameStore((s) => s.level);
  const timeTaken    = useGameStore((s) => s.timeTaken);
  const sessionRoundsPlayed = useGameStore((s) => s.sessionRoundsPlayed);
  const sessionRoundsWon    = useGameStore((s) => s.sessionRoundsWon);
  const sessionMaxStreak    = useGameStore((s) => s.sessionMaxStreak);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const saveResult   = useAuthStore((s) => s.saveResult);
  const saveSession  = useAuthStore((s) => s.saveSession);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (gameStatus === 'solved' || gameStatus === 'failed') {
      const solved = gameStatus === 'solved';
      if (soundEnabled) solved ? playWin() : playLose();
      // On failure, streak has already been reset to 0 in the store.
      // Use sessionMaxStreak so longest_streak is still updated correctly.
      const streakToSave = solved ? streak : sessionMaxStreak;
      saveResult({ solved, timeTaken, score, streak: streakToSave });
    }
  }, [gameStatus]);

  if (gameStatus === 'idle') return null;

  async function handleExit() {
    await saveSession({
      total_score:   score,
      rounds_played: sessionRoundsPlayed,
      rounds_won:    sessionRoundsWon,
      max_level:     level,
      max_streak:    sessionMaxStreak,
    });
    resetGame();
    navigate('/');
  }

  return (
    <div className={styles.page}>
      <GameBoard onExit={handleExit} />
    </div>
  );
}
