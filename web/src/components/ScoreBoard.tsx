import { useGameStore } from '../store/gameStore';
import styles from './ScoreBoard.module.css';

export function ScoreBoard() {
  const level = useGameStore((s) => s.level);
  const score = useGameStore((s) => s.score);
  const streak = useGameStore((s) => s.streak);

  return (
    <div className={styles.container}>
      <div className={styles.stat}>
        <span className={styles.label}>Level</span>
        <span className={styles.value}>{level}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Score</span>
        <span className={styles.value}>{score}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Streak</span>
        <span className={styles.value}>{streak}</span>
      </div>
    </div>
  );
}
