import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerDifficulty = 'easy' | 'normal' | 'hard';

export const TIMER_SECONDS: Record<TimerDifficulty, number> = {
  easy:   60,
  normal: 45,
  hard:   25,
};

interface SettingsStore {
  soundEnabled:     boolean;
  timerDifficulty:  TimerDifficulty;
  darkMode:         boolean;
  toggleSound:      () => void;
  setDifficulty:    (d: TimerDifficulty) => void;
  toggleDarkMode:   () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      soundEnabled:    true,
      timerDifficulty: 'normal',
      darkMode:        false,
      toggleSound:      () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setDifficulty:    (d) => set({ timerDifficulty: d }),
      toggleDarkMode:   () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    { name: 'numble-settings' },
  ),
);
