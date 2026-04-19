<div align="center">

# 🔢 Numble

**A fast-paced arithmetic puzzle game — can you hit the target in 45 seconds?**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ecf8e?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Play Now](#) · [Report a Bug](https://github.com/Hashleemy/numble/issues) · [Request a Feature](https://github.com/Hashleemy/numble/issues)

</div>

---

## 📖 About

Numble challenges you to combine **exactly 6 numbers** using arithmetic operators to reach a randomly generated **target number** — all within a time limit. It's part math puzzle, part reflex game, and entirely addictive.

Each session tracks your score, streak, and level progression. Sign in to save your stats, climb the leaderboard, and pick up where you left off across any device.

---

## ✨ Features

- 🎯 **Drag-and-drop equation builder** — build expressions intuitively with mouse or touch
- ⏱️ **Configurable timer** — Easy (60s) / Normal (45s) / Hard (25s)
- 🔥 **Streak & scoring system** — consecutive solves multiply your score
- 📊 **Session history** — every play session is recorded with score, rounds, level, and streak
- 🔐 **Secure authentication** — sign up / sign in with email, password strength meter, rate limiting
- 🌙 **Dark mode** — full light/dark theme support
- 🔊 **Sound effects** — optional audio feedback
- 📱 **Responsive design** — works on desktop and mobile browsers

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 5.9, Vite 8 |
| **State** | Zustand |
| **Drag & Drop** | dnd-kit |
| **Routing** | React Router v7 |
| **Backend / Auth** | Supabase (PostgreSQL + Auth) |
| **Testing** | Jest, React Testing Library |
| **Shared Logic** | Pure TypeScript (platform-agnostic) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://npmjs.com/) v9 or higher
- A free [Supabase](https://supabase.com/) account

### 1. Clone the repository

```bash
git clone https://github.com/Hashleemy/numble.git
cd numble
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql) — this creates all required tables, RLS policies, and triggers
3. Go to **Settings → API** and copy your **Project URL** and **anon / public key**

### 4. Configure environment variables

Create `web/.env` manually:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

> ⚠️ Never commit your `.env` file. It is already covered by `.gitignore`.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
numble/
├── shared/                  # Platform-agnostic game logic (pure TypeScript)
│   └── game/
│       ├── generateNumbers.ts
│       ├── generateTarget.ts
│       ├── validateExpression.ts
│       ├── calculateScore.ts
│       ├── advanceLevel.ts
│       └── index.ts
│
├── web/                     # React web application
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── features/        # Composite feature components (GameBoard)
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Supabase client & utilities
│       ├── pages/           # Route-level page components
│       ├── store/           # Zustand state stores
│       ├── types/           # Shared TypeScript types
│       └── utils/           # Pure utility functions
│
├── supabase/
│   └── schema.sql           # Database schema, RLS policies, triggers
│
└── mobile/                  # React Native app (coming soon)
```

---

## 🗄️ Database Schema

Numble uses three Supabase tables:

| Table | Description |
|---|---|
| `profiles` | Aggregate lifetime stats per user (high score, win rate, longest streak) |
| `game_sessions` | Individual session history (score, rounds, level, streak per session) |
| `user_settings` | Persisted settings per user (dark mode, sound, timer difficulty) |

All tables are protected by **Row Level Security (RLS)** — users can only read and write their own data.

---

## 🎮 How to Play

1. Press **Play Now** from the home screen
2. You are given **6 numbers** (1–9) and a **target number** (1–100)
3. Use the numbers and operators (`+` `−` `×` `÷` `(` `)`) to build an expression that equals the target
4. Each number may be used **at most once**
5. Submit before the timer runs out to score points
6. Solve consecutive puzzles without failing to build a **streak** and earn bonus points
7. Click **End Session** to save your results or **Next Puzzle** to keep going

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Shared game logic only
npm run test:shared

# Web app only
npm run test:web
```

---

## 🚢 Deployment

The recommended deployment platform is **Vercel**:

1. Push your repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Set the **Root Directory** to `web`
4. Add your environment variables under **Settings → Environment Variables**
5. Deploy — Vercel will automatically redeploy on every push to `main`

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Built with ❤️ by [Hashleemy](https://github.com/Hashleemy)

</div>
