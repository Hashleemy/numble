import { useSettingsStore, type TimerDifficulty } from '../store/settingsStore';
import styles from './SettingsModal.module.css';

interface Props {
  onClose: () => void;
}

const DIFFICULTIES: { value: TimerDifficulty; label: string; seconds: number }[] = [
  { value: 'easy',   label: 'Easy',   seconds: 60 },
  { value: 'normal', label: 'Normal', seconds: 45 },
  { value: 'hard',   label: 'Hard',   seconds: 25 },
];

export function SettingsModal({ onClose }: Props) {
  const soundEnabled    = useSettingsStore((s) => s.soundEnabled);
  const timerDifficulty = useSettingsStore((s) => s.timerDifficulty);
  const darkMode        = useSettingsStore((s) => s.darkMode);
  const toggleSound     = useSettingsStore((s) => s.toggleSound);
  const setDifficulty   = useSettingsStore((s) => s.setDifficulty);
  const toggleDarkMode  = useSettingsStore((s) => s.toggleDarkMode);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Settings</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Sound</span>
          <button
            className={`${styles.toggle} ${soundEnabled ? styles.on : ''}`}
            onClick={toggleSound}
            aria-pressed={soundEnabled}
          >
            <span className={styles.thumb} />
          </button>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Dark Mode</span>
          <button
            className={`${styles.toggle} ${darkMode ? styles.on : ''}`}
            onClick={toggleDarkMode}
            aria-pressed={darkMode}
          >
            <span className={styles.thumb} />
          </button>
        </div>

        <div className={styles.section}>
          <span className={styles.label}>Timer Difficulty</span>
          <div className={styles.diffGrid}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                className={`${styles.diffBtn} ${timerDifficulty === d.value ? styles.active : ''}`}
                onClick={() => setDifficulty(d.value)}
              >
                <span className={styles.diffLabel}>{d.label}</span>
                <span className={styles.diffSecs}>{d.seconds}s</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
