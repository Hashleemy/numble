import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function useTimer() {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const tick = useGameStore((s) => s.tick);

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [gameStatus, tick]);
}
