# Numble — Publication Readiness Status

> **As of 2026-04-19**

---

## Summary

| Platform | Code | Tests | Infra | Ready to publish? |
|---|---|---|---|---|
| Shared game logic | ✅ Complete | ✅ 41/41 pass | — | ✅ Yes |
| Web app | ✅ Complete | ⚠️ No test script | ✅ Supabase live, build exists | ✅ Yes — deploy to Vercel |
| Mobile app | ✅ Code written | ❌ Never run | ❌ Keys missing, deps not installed | ❌ No — needs setup |

---

## Shared Game Logic (`shared/`)

**Status: complete and fully tested.**

All five modules are implemented:

| Module | Purpose |
|---|---|
| `generateNumbers` | 6 random integers 1–9 |
| `generateTarget` | Random integer 1–100 |
| `validateExpression` | Recursive-descent parser: correct operator precedence, parentheses, unary minus, number-usage multiset check, division-by-zero guard |
| `calculateScore` | Base (10 pts) + time bonus (0.5 × remaining seconds) + streak bonus (base × floor(streak / 3)) |
| `advanceLevel` | On solve: level+1, streak+1, accumulate score. On fail: level resets to 1, streak resets to 0 (score preserved). |

**Tests:** 41 tests across 5 suites, all passing.

**Design note:** `advanceLevel` resets the level to 1 on any failure. This is intentional — each failed round breaks the run.

---

## Web App (`web/`)

**Status: feature-complete, production build exists, Supabase is live. Ready to deploy.**

### Pages

| Page | Route | Notes |
|---|---|---|
| `LandingPage` | `/` | Animated math-symbol background, play/login/stats/settings nav, dark mode |
| `LoginPage` | `/login` | Sign in + sign up tabs, password strength meter (5-segment bar), show/hide password, 5-attempt lockout with 30s countdown, normalized error messages (no email enumeration) |
| `GamePage` | `/play` | Hosts GameBoard, starts a new game on mount, persists result to Supabase after each round, handles exit with session save |
| `GameOverPage` | `/gameover` | End-of-session summary card: result badge, new-personal-best banner, stats grid, expression display, play-again / home buttons. Saves session to Supabase on mount. |

### Components

| Component | Notes |
|---|---|
| `GameBoard` | DnD context (dnd-kit), hosts all in-game components |
| `NumberTile` | Click to append OR drag-and-drop onto expression bar. Greyed out when used; duplicate-value tracking handles, e.g., two tiles both showing "2". |
| `NumberTray` | Renders 6 tiles with correct used-count tracking |
| `OperatorPad` | Buttons for `+ - * / ( )`, plays click sound |
| `ExpressionBar` | Displays expression, backspace/clear/submit buttons |
| `TargetDisplay` | Shows target number |
| `Timer` | Progress bar, countdown label, red "urgent" mode when ≤10s, tick sound each second in urgent mode |
| `ScoreBoard` | Live level / score / streak display |
| `ResultBanner` | In-game overlay on solve/fail: score delta, streak, Next Puzzle / End Session buttons |
| `SettingsModal` | Sound toggle, dark mode toggle, difficulty selector (Easy 60s / Normal 45s / Hard 25s) |
| `StatsModal` | Aggregate lifetime stats + session history table (last 20 sessions) |
| `NumbleLogo` | Animated Wordle-style letter tiles |

### State

| Store | Persistence | Notes |
|---|---|---|
| `gameStore` | In-memory | Full game state: numbers, target, expression, timer, status, score, streak, level, session counters |
| `settingsStore` | `localStorage` via Zustand persist | Sound, dark mode, timer difficulty |
| `authStore` | Supabase session | User, profile, session history; auth state subscription de-duplicated against React StrictMode double-mount |

### Supabase

- Project: `https://tkmzjpcfdqeuckrzcbnw.supabase.co`
- Keys configured in `web/.env` (real values, not placeholders)
- Schema deployed: `profiles`, `game_sessions`, `user_settings` tables, RLS policies, auto-create trigger on new user
- Auth: email/password, sign-up confirmation flow
- Writes: `profiles` upserted after every round, `game_sessions` inserted on session end

### Build

- Production build exists at `web/dist/` (Vite, minified bundle)
- Deploy command: `npm run build` from root or from `web/`

### Sound

Web Audio API (no external files). Four effects: `playClick` (button tap), `playTick` (urgent countdown), `playWin` (ascending arpeggio C5–E5–G5–C6), `playLose` (descending G4–Eb4–C4).

---

## Mobile App (`mobile/`)

**Status: all code written, never run. Blocked by two setup steps.**

### Blockers before first run

**1. `mobile/.env` has placeholder values.**

The file currently contains:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with the real Supabase values (same project as web):
```
EXPO_PUBLIC_SUPABASE_URL=https://tkmzjpcfdqeuckrzcbnw.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<real anon key>
```

**2. Mobile dependencies are not installed.**

The root `npm install` installs web dependencies but not Expo/React Native packages — Metro bundler is incompatible with npm workspaces hoisting. Run separately:

```bash
cd mobile
npm install
```

### What's implemented

- All 4 screens: `LandingScreen`, `LoginScreen`, `GameScreen`, `GameOverScreen`
- All components mirror the web: `NumberTile` (tap-to-append), `NumberTray`, `OperatorPad`, `ExpressionBar`, `TargetDisplay`, `Timer`, `ScoreBoard`, `ResultBanner`, `SettingsModal`, `StatsModal`
- Same 3 Zustand stores as web; `settingsStore` persists via `AsyncStorage`
- Supabase auth via `react-native-url-polyfill` + `AsyncStorage` session storage
- `react-native-url-polyfill` wired as first import in `App.tsx`
- Stack navigation: Landing → Login → Game → GameOver
- Dark/light theme via `LIGHT`/`DARK` palette in `src/lib/theme.ts`
- `LoginScreen` has same security features as web: password strength meter, show/hide toggle, lockout

### Architecture difference from web

The mobile game flow does not have a dedicated GameOver screen reached via "End Session" — the `ResultBanner` overlay provides "Next Puzzle" and "End Session" buttons, and "End Session" navigates to `GameOverScreen`. The mobile `GameScreen` saves the per-round result immediately on status change; session save happens on `GameOverScreen` mount.

---

## Known Gaps

### Supabase `user_settings` table is unused

The schema creates a `user_settings` table and the `UserSettings` TypeScript interface is defined in `web/src/lib/supabase.ts`, but neither the web nor mobile app reads from or writes to it. Settings are local-only (Zustand persist → localStorage / AsyncStorage). This means settings do not sync across devices. Either the sync feature should be implemented or the table and interface should be removed to reduce confusion.

### Web has no runnable test suite

`web/package.json` has no `"test"` script. Jest is configured (`web/jest.config.js`) and all testing dependencies are installed, but `npm run test:web` fails. No web component tests exist at `web/src/__tests__/`. The `jest.config.js` also has a misspelling: `setupFilesAfterFramework` should be `setupFilesAfterEnv` (the correct Jest v29 option name for loading setup modules after the test environment).

### README references a deleted file

`README.md` step 4 says `cp web/.env.example web/.env` — but `.env.example` was removed in commit `79814f5`. This will confuse new contributors. The step should be updated to instruct manual creation.

### README timer description is stale

The README hero line says "Hit the target in 30 seconds?" — the actual default timer is 45 seconds (Normal difficulty). The `ROUND_TIME_SECONDS = 30` constant in `shared/game/constants.ts` is only used as a fallback in `Timer.tsx` and does not reflect the real default.

### Stray files in repo

- `web/memory.txt.txt` — working notes, not source code
- `claude.md.txt` — working notes, not source code
- `web/src/assets/react.svg`, `web/src/assets/vite.svg` — unused Vite template assets

---

## Deployment Checklist (Web)

- [x] Code complete
- [x] Supabase project live with schema deployed
- [x] `web/.env` configured with real keys (do not commit)
- [x] Production build compiles (`npm run build`)
- [ ] Push to GitHub
- [ ] Import at vercel.com — set Root Directory to `web`
- [ ] Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Vercel environment variables
- [ ] Verify deployed URL, test sign-up → confirm email → sign in → play session → check stats

## Deployment Checklist (Mobile)

- [ ] Fill real Supabase keys into `mobile/.env`
- [ ] Run `npm install` in `mobile/`
- [ ] Run `npx expo start` and test on device/emulator
- [ ] Fix any runtime issues uncovered during testing
- [ ] Build for iOS: `npx expo build:ios` (requires Apple Developer account)
- [ ] Build for Android: `npx expo build:android`
- [ ] Submit to App Store / Google Play
