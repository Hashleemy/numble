# Numble — Task List

> Priority order: Web deployment first, then mobile setup, then cleanup.

---

## Web — Deploy

- [x] Push repo to GitHub (remove `web/memory.txt.txt` and `claude.md.txt` first)
- [ ] Import project at vercel.com → set Root Directory to `web`
- [ ] Add environment variables in Vercel: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Smoke-test the deployed URL: sign up → confirm email → sign in → play session → check stats

---

## Web — Bug Fixes & Cleanup ✅ Done (commit df0d478)

- [x] Add `"test": "jest"` script to `web/package.json` so `npm run test:web` works
- [x] Fix `web/jest.config.js` typo: rename `setupFilesAfterFramework` → `setupFilesAfterEnv`
- [x] Update `README.md` step 4: replace `cp web/.env.example web/.env` instruction with manual creation instructions
- [x] Update `README.md` hero line: change "30 seconds" to "45 seconds"
- [x] Delete stray files: `web/memory.txt.txt`, `claude.md.txt`, `web/src/assets/react.svg`, `web/src/assets/vite.svg`

## Web — Write Component Tests (next step after cleanup)

- [ ] Create `web/src/__mocks__/fileMock.js` (needed by jest.config.js CSS mapper)
- [ ] Write smoke tests for `GameBoard` — verify numbers render, expression updates on click
- [ ] Write smoke tests for `Timer` — verify countdown display, urgent mode styling at ≤10s
- [ ] Write smoke tests for `LoginPage` — verify tabs render, lockout message appears after 5 fails
- [ ] Run `npm run test:web` to confirm all pass

---

## Web — Feature Gap ✅ Done (commit 305074d)

- [x] Settings sync implemented: `settingsStore` upserts to `user_settings` on every change; `authStore` calls `loadSettings` on sign-in and auth state change

---

## Mobile — Setup (required before first run)

- [ ] Fill real Supabase keys into `mobile/.env`:
  - `EXPO_PUBLIC_SUPABASE_URL=https://tkmzjpcfdqeuckrzcbnw.supabase.co`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY=<real anon key>`
- [ ] Run `npm install` inside the `mobile/` directory (Expo requires separate install — not hoisted by root workspace)
- [ ] Run `npx expo start` from `mobile/` and test on a device or emulator

---

## Mobile — Testing

- [ ] Test Landing screen: play button, settings modal, stats modal (logged in), login nav
- [ ] Test Login screen: sign in, sign up, password strength meter, lockout after 5 failed attempts
- [ ] Test Game screen: tap-to-select numbers, operator buttons, expression bar, timer countdown, urgent mode (≤10s), submit correct expression, fail on timeout
- [ ] Test GameOver screen: result badge, stats grid, play again, home navigation
- [ ] Test dark mode toggle persists across app restarts
- [ ] Test Supabase writes: per-round profile update, session insert on GameOver

---

## Mobile — Publish (after testing passes)

- [ ] Build for iOS: `npx expo build:ios` (requires Apple Developer account)
- [ ] Build for Android: `npx expo build:android`
- [ ] Submit to App Store
- [ ] Submit to Google Play
