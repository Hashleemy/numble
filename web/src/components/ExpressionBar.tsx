import { useGameStore } from '../store/gameStore';
import styles from './ExpressionBar.module.css';

export function ExpressionBar() {
  const expression = useGameStore((s) => s.expression);
  const backspace = useGameStore((s) => s.backspace);
  const clearExpression = useGameStore((s) => s.clearExpression);
  const submitExpression = useGameStore((s) => s.submitExpression);
  const gameStatus = useGameStore((s) => s.gameStatus);

  const playing = gameStatus === 'playing';

  return (
    <div className={styles.container}>
      <div className={styles.display}>
        <span className={styles.expr}>{expression || <span className={styles.placeholder}>Build your expression…</span>}</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.btn} onClick={backspace} disabled={!playing || expression.length === 0} aria-label="Backspace">
          ⌫
        </button>
        <button className={styles.btn} onClick={clearExpression} disabled={!playing || expression.length === 0} aria-label="Clear">
          Clear
        </button>
        <button className={`${styles.btn} ${styles.submit}`} onClick={submitExpression} disabled={!playing || expression.length === 0} aria-label="Submit">
          =
        </button>
      </div>
    </div>
  );
}
