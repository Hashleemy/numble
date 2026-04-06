import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { playTick } from '../lib/sounds';
import { ROUND_TIME_SECONDS } from '@numble/shared';
import { TIMER_SECONDS } from '../store/settingsStore';
import styles from './Timer.module.css';

export function Timer() {
  const timeRemaining    = useGameStore((s) => s.timeRemaining);
  const totalTime        = useGameStore((s) => s.totalTime);
  const gameStatus       = useGameStore((s) => s.gameStatus);
  const timerDifficulty  = useSettingsStore((s) => s.timerDifficulty);
  const soundEnabled     = useSettingsStore((s) => s.soundEnabled);
  const tickedRef        = useRef<number>(-1);

  const max = TIMER_SECONDS[timerDifficulty] || ROUND_TIME_SECONDS;
  const pct = (timeRemaining / (totalTime || max)) * 100;
  const urgent = timeRemaining <= 10 && gameStatus === 'playing';

  useEffect(() => {
    if (urgent && soundEnabled && timeRemaining !== tickedRef.current) {
      tickedRef.current = timeRemaining;
      playTick();
    }
  }, [timeRemaining, urgent, soundEnabled]);

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        <div
          className={`${styles.bar} ${urgent ? styles.urgent : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`${styles.label} ${urgent ? styles.urgentLabel : ''}`}>
        {timeRemaining}s
      </span>
    </div>
  );
}
