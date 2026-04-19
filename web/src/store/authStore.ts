import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase, type Profile, type GameSession } from '../lib/supabase';
import { useSettingsStore } from './settingsStore';

interface SessionPayload {
  total_score:   number;
  rounds_played: number;
  rounds_won:    number;
  max_level:     number;
  max_streak:    number;
}

interface AuthStore {
  user:     User | null;
  profile:  Profile | null;
  sessions: GameSession[];
  loading:  boolean;

  init:         () => Promise<void>;
  signIn:       (email: string, password: string) => Promise<string | null>;
  signUp:       (email: string, password: string) => Promise<string | null>;
  signOut:      () => Promise<void>;
  loadProfile:  () => Promise<void>;
  loadSessions: () => Promise<void>;
  saveSession:  (data: SessionPayload) => Promise<void>;
  saveResult:   (args: { solved: boolean; timeTaken: number; score: number; streak: number }) => Promise<void>;
}

// Module-level ref prevents duplicate subscriptions in React StrictMode
let _authSubUnsub: (() => void) | null = null;

/** Normalize raw Supabase auth errors into user-safe messages */
function normalizeAuthError(message: string, action: 'signIn' | 'signUp'): string {
  const msg = message.toLowerCase();

  if (msg.includes('fetch') || msg.includes('network') || msg.includes('connection')) {
    return 'Connection error. Please check your internet and try again.';
  }
  if (action === 'signIn') {
    // Never distinguish between wrong email vs wrong password — prevents enumeration
    if (msg.includes('invalid') || msg.includes('credentials') || msg.includes('not found')) {
      return 'Invalid email or password.';
    }
    if (msg.includes('email not confirmed')) {
      return 'Please confirm your email address before signing in.';
    }
    if (msg.includes('too many') || msg.includes('rate') || msg.includes('after')) {
      return 'Too many attempts. Please wait a moment and try again.';
    }
  }
  if (action === 'signUp') {
    if (msg.includes('already registered') || msg.includes('already exists')) {
      return 'An account with this email already exists.';
    }
  }
  return action === 'signIn'
    ? 'Sign in failed. Please try again.'
    : 'Sign up failed. Please try again.';
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user:     null,
  profile:  null,
  sessions: [],
  loading:  true,

  async init() {
    if (_authSubUnsub) return; // already initialized

    const { data: { session } } = await supabase.auth.getSession();
    set({ user: session?.user ?? null, loading: false });
    if (session?.user) {
      await get().loadProfile();
      await useSettingsStore.getState().loadSettings(session.user.id);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      set({ user: s?.user ?? null });
      if (s?.user) {
        get().loadProfile();
        void useSettingsStore.getState().loadSettings(s.user.id);
      } else {
        set({ profile: null });
      }
    });

    _authSubUnsub = subscription.unsubscribe.bind(subscription);
  },

  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? normalizeAuthError(error.message, 'signIn') : null;
  },

  async signUp(email, password) {
    const { error } = await supabase.auth.signUp({ email, password });
    return error ? normalizeAuthError(error.message, 'signUp') : null;
  },

  async signOut() {
    await supabase.auth.signOut();
    set({ user: null, profile: null, sessions: [] });
  },

  async loadProfile() {
    const { user } = get();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('id, high_score, games_played, games_won, longest_streak, total_solve_time')
      .eq('id', user.id)
      .single();

    if (data) set({ profile: data as Profile });
  },

  async loadSessions() {
    const { user } = get();
    if (!user) return;

    const { data } = await supabase
      .from('game_sessions')
      .select('id, user_id, played_at, total_score, rounds_played, rounds_won, max_level, max_streak')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
      .limit(20);

    if (data) set({ sessions: data as GameSession[] });
  },

  async saveSession({ total_score, rounds_played, rounds_won, max_level, max_streak }) {
    const { user } = get();
    if (!user || rounds_played === 0) return;

    const { data } = await supabase
      .from('game_sessions')
      .insert({ user_id: user.id, total_score, rounds_played, rounds_won, max_level, max_streak })
      .select('id, user_id, played_at, total_score, rounds_played, rounds_won, max_level, max_streak')
      .single();

    if (data) {
      set((s) => ({ sessions: [data as GameSession, ...s.sessions].slice(0, 20) }));
    }
  },

  async saveResult({ solved, timeTaken, score, streak }) {
    const { user, profile } = get();
    if (!user) return;

    const updates = {
      games_played:     (profile?.games_played  ?? 0) + 1,
      games_won:        (profile?.games_won     ?? 0) + (solved ? 1 : 0),
      high_score:       Math.max(profile?.high_score      ?? 0, score),
      longest_streak:   Math.max(profile?.longest_streak  ?? 0, streak),
      total_solve_time: (profile?.total_solve_time ?? 0) + (solved ? timeTaken : 0),
      updated_at:       new Date().toISOString(),
    };

    await supabase.from('profiles').upsert({ id: user.id, ...updates });
    set({ profile: { id: user.id, ...updates } });
  },
}));
