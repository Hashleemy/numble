import { useGameStore } from '../store/gameStore';
import styles from './TargetDisplay.module.css';

export function TargetDisplay() {
  const target = useGameStore((s) => s.target);

  return (
    <div className={styles.container}>
      <span className={styles.label}>Target</span>
      <span className={styles.value}>{target}</span>
    </div>
  );
}
