import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

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
  loadSettings:     (userId: string) => Promise<void>;
}

// Reads current session from cache (no network call), then upserts settings to Supabase.
// Called fire-and-forget after every local settings change.
async function autosync(state: Pick<SettingsStore, 'soundEnabled' | 'timerDifficulty' | 'darkMode'>) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;
  await supabase.from('user_settings').upsert({
    id:               session.user.id,
    sound_enabled:    state.soundEnabled,
    timer_difficulty: state.timerDifficulty,
    dark_mode:        state.darkMode,
    updated_at:       new Date().toISOString(),
  });
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      soundEnabled:    true,
      timerDifficulty: 'normal',
      darkMode:        false,

      toggleSound() {
        set((s) => ({ soundEnabled: !s.soundEnabled }));
        void autosync(get());
      },

      setDifficulty(d) {
        set({ timerDifficulty: d });
        void autosync(get());
      },

      toggleDarkMode() {
        set((s) => ({ darkMode: !s.darkMode }));
        void autosync(get());
      },

      async loadSettings(userId) {
        const { data } = await supabase
          .from('user_settings')
          .select('sound_enabled, timer_difficulty, dark_mode')
          .eq('id', userId)
          .single();

        if (data) {
          set({
            soundEnabled:    data.sound_enabled,
            timerDifficulty: data.timer_difficulty as TimerDifficulty,
            darkMode:        data.dark_mode,
          });
        }
      },
    }),
    { name: 'numble-settings' },
  ),
);
