import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import styles from './ResultBanner.module.css';

export function ResultBanner() {
  const gameStatus       = useGameStore((s) => s.gameStatus);
  const lastScoreDelta   = useGameStore((s) => s.lastScoreDelta);
  const streak           = useGameStore((s) => s.streak);
  const sessionMaxStreak = useGameStore((s) => s.sessionMaxStreak);
  const nextPuzzle       = useGameStore((s) => s.nextPuzzle);
  const navigate         = useNavigate();

  if (gameStatus !== 'solved' && gameStatus !== 'failed') return null;

  const solved = gameStatus === 'solved';
  // On failure the store has already reset streak → 0; use sessionMaxStreak instead
  const displayStreak = solved ? streak : sessionMaxStreak;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.banner} ${solved ? styles.solved : styles.failed}`}>
        <h2 className={styles.title}>{solved ? 'Correct!' : "Time's up!"}</h2>
        {solved && <p className={styles.score}>+{lastScoreDelta} points</p>}
        <p className={styles.streak}>Streak: {displayStreak}</p>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={nextPuzzle}>
            Next Puzzle
          </button>
          <button className={styles.endBtn} onClick={() => navigate('/gameover')}>
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}
