import styles from './NumbleLogo.module.css';

const LETTERS = ['N', 'U', 'M', 'B', 'L', 'E'];

export function NumbleLogo() {
  return (
    <div className={styles.logo} aria-label="Numble">
      {LETTERS.map((letter, i) => (
        <div
          key={letter}
          className={styles.tile}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
}
