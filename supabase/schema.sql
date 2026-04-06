-- Run this in your Supabase SQL editor

-- Profiles: one row per user, holds aggregate game stats
create table if not exists public.profiles (
  id              uuid references auth.users on delete cascade primary key,
  high_score      integer not null default 0,
  games_played    integer not null default 0,
  games_won       integer not null default 0,
  longest_streak  integer not null default 0,
  total_solve_time integer not null default 0, -- seconds, sum of winning rounds
  updated_at      timestamptz default now()
);

-- User settings: persisted per account
create table if not exists public.user_settings (
  id                uuid references auth.users on delete cascade primary key,
  sound_enabled     boolean not null default true,
  timer_difficulty  text    not null default 'normal'
                            check (timer_difficulty in ('easy', 'normal', 'hard')),
  dark_mode         boolean not null default false,
  updated_at        timestamptz default now()
);

-- Row Level Security
alter table public.profiles      enable row level security;
alter table public.user_settings enable row level security;

create policy "own profile select" on public.profiles      for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles      for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles      for update using (auth.uid() = id);

create policy "own settings select" on public.user_settings for select using (auth.uid() = id);
create policy "own settings insert" on public.user_settings for insert with check (auth.uid() = id);
create policy "own settings update" on public.user_settings for update using (auth.uid() = id);

-- Session history: one row per play session
create table if not exists public.game_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users on delete cascade not null,
  played_at     timestamptz not null default now(),
  total_score   integer not null default 0,
  rounds_played integer not null default 0,
  rounds_won    integer not null default 0,
  max_level     integer not null default 1,
  max_streak    integer not null default 0
);

alter table public.game_sessions enable row level security;

create policy "own sessions select" on public.game_sessions
  for select using (auth.uid() = user_id);
create policy "own sessions insert" on public.game_sessions
  for insert with check (auth.uid() = user_id);

create index if not exists game_sessions_user_played
  on public.game_sessions (user_id, played_at desc);

-- Auto-create profile + settings rows when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)       values (new.id) on conflict do nothing;
  insert into public.user_settings (id)  values (new.id) on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
