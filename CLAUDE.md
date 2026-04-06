# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Numble is a cross-platform math puzzle game. Players use exactly 6 numbers (1–9) and arithmetic operators (+, -, *, /, parentheses) to reach a target number (1–100) within 30 seconds. Each number may be used at most once.

## Platforms & Stack

- **Web:** React + Vite + TypeScript
- **Mobile:** React Native (Expo)
- **State:** Zustand (lightweight global store), React hooks for local state
- **Drag-and-drop:** dnd-kit (Web), tap-to-select fallback (Mobile)
- **Testing:** Jest + React Testing Library

## Architecture

The codebase is split into three layers:

### 1. Shared Logic (`shared/game/`)
Pure TypeScript — no DOM or platform APIs. All game rules live here and are reused by both Web and Mobile.

Key exports:
- `generateNumbers()` — produces the 6 playable numbers
- `generateTarget()` — produces the target number
- `validateExpression()` — checks expression uses only provided numbers (each at most once), evaluates to target, has valid syntax, no division by zero
- `calculateScore()`
- `advanceLevel()`

**Always implement shared logic first, then platform-specific UI.**

### 2. Web UI (`src/`)
```
src/
  components/
  features/
  hooks/
  utils/
  types/
```

### 3. Mobile UI (`mobile/`)
```
mobile/
  components/
  screens/
  hooks/
  utils/
```

## Coding Standards

- TypeScript strict mode everywhere
- Functional components only (no class components)
- One component per file
- Naming: `PascalCase` components, `camelCase` functions, `UPPER_SNAKE_CASE` constants
- No hardcoded values — use config/constants
- No inline styles unless trivial
- No global variables outside controlled state
- Memoize expensive calculations; avoid unnecessary re-renders

## Validation Rules

Expressions must:
- Use only the provided 6 numbers
- Use each number at most once
- Evaluate correctly to the target

Reject: invalid syntax, division by zero, non-integer intermediate results (if enforced).

## Development Approach

- Reuse shared logic on both platforms — never duplicate game logic in platform-specific code
- Only modify necessary files; do not rewrite the whole project unless requested
- Do not introduce breaking changes without asking
- Always return complete, working files with all imports included
