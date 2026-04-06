import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL  as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !key) {
  console.error(
    '[Numble] Supabase is not configured. ' +
    'Create web/.env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(url ?? '', key ?? '');

export interface Profile {
  id:               string;
  high_score:       number;
  games_played:     number;
  games_won:        number;
  longest_streak:   number;
  total_solve_time: number;
}

export interface GameSession {
  id:            string;
  user_id:       string;
  played_at:     string;
  total_score:   number;
  rounds_played: number;
  rounds_won:    number;
  max_level:     number;
  max_streak:    number;
}

export interface UserSettings {
  id:               string;
  sound_enabled:    boolean;
  timer_difficulty: 'easy' | 'normal' | 'hard';
  dark_mode:        boolean;
}
