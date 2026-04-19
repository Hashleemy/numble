import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase, type Profile } from '../lib/supabase';

interface AuthStore {
  user:    User | null;
  profile: Profile | null;
  loading: boolean;

  init:        () => Promise<void>;
  signIn:      (email: string, password: string) => Promise<string | null>;
  signUp:      (email: string, password: string) => Promise<string | null>;
  signOut:     () => Promise<void>;
  loadProfile: () => Promise<void>;
  saveResult:  (args: { solved: boolean; timeTaken: number; score: number; streak: number }) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user:    null,
  profile: null,
  loading: true,

  async init() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null, loading: false });
      if (session?.user) await get().loadProfile();
    } catch {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange((_event, s) => {
      set({ user: s?.user ?? null });
      // Fire-and-forget is intentional here — auth listener cannot be async
      if (s?.user) void get().loadProfile();
      else set({ profile: null });
    });
  },

  async signIn(email, password) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error?.message ?? null;
    } catch (e) {
      return e instanceof Error ? e.message : 'Sign in failed';
    }
  },

  async signUp(email, password) {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      return error?.message ?? null;
    } catch (e) {
      return e instanceof Error ? e.message : 'Sign up failed';
    }
  },

  async signOut() {
    try {
      await supabase.auth.signOut();
    } finally {
      set({ user: null, profile: null });
    }
  },

  async loadProfile() {
    const user = get().user;
    if (!user) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) set({ profile: data as Profile });
    } catch {
      // Profile load failure is non-fatal — game still works without it
    }
  },

  async saveResult({ solved, timeTaken, score, streak }) {
    const user = get().user;
    if (!user) return;

    const current = get().profile;
    const updates = {
      games_played:     (current?.games_played     ?? 0) + 1,
      games_won:        (current?.games_won         ?? 0) + (solved ? 1 : 0),
      high_score:       Math.max(current?.high_score ?? 0, score),
      longest_streak:   Math.max(current?.longest_streak ?? 0, streak),
      total_solve_time: (current?.total_solve_time  ?? 0) + (solved ? timeTaken : 0),
      updated_at:       new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('profiles').upsert({ id: user.id, ...updates });
      if (!error) set({ profile: { id: user.id, ...updates } });
    } catch {
      // Result save failure is non-fatal
    }
  },
}));
