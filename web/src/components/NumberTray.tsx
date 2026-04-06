import { useGameStore } from '../store/gameStore';
import { NumberTile } from './NumberTile';
import styles from './NumberTray.module.css';

export function NumberTray() {
  const numbers = useGameStore((s) => s.numbers);
  const expression = useGameStore((s) => s.expression);

  // Count how many times each value appears in the expression
  const usedCounts = expression
    .match(/\d+/g)
    ?.map(Number)
    .reduce<Record<number, number>>((acc, n) => {
      acc[n] = (acc[n] ?? 0) + 1;
      return acc;
    }, {}) ?? {};

  // Assign "used" to tiles one at a time, decrementing the count so that
  // duplicate values (e.g. two 2s) are only greyed out one tile at a time.
  const remaining = { ...usedCounts };
  const isUsed = numbers.map((n) => {
    if ((remaining[n] ?? 0) > 0) {
      remaining[n]--;
      return true;
    }
    return false;
  });

  return (
    <div className={styles.tray}>
      {numbers.map((value, i) => (
        <NumberTile
          key={i}
          id={`tile-${i}`}
          value={value}
          isUsed={isUsed[i]}
        />
      ))}
    </div>
  );
}
