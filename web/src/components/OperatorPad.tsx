import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { playClick } from '../lib/sounds';
import styles from './OperatorPad.module.css';

const OPERATORS = ['+', '-', '*', '/', '(', ')'];

export function OperatorPad() {
  const appendToExpression = useGameStore((s) => s.appendToExpression);
  const gameStatus         = useGameStore((s) => s.gameStatus);
  const soundEnabled       = useSettingsStore((s) => s.soundEnabled);
  const playing = gameStatus === 'playing';

  function handlePress(op: string) {
    if (soundEnabled) playClick();
    appendToExpression(op);
  }

  return (
    <div className={styles.grid}>
      {OPERATORS.map((op) => (
        <button
          key={op}
          className={styles.btn}
          onClick={() => handlePress(op)}
          disabled={!playing}
          aria-label={op}
        >
          {op}
        </button>
      ))}
    </div>
  );
}
