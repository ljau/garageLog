# GarageLog

Offline vehicle garage log built with Expo, TypeScript, and React Native Paper.

## Stack

- Expo Router (file-based navigation)
- TypeScript
- React Native Paper (Material Design 3)
- Expo SQLite (local persistence)
- React Hook Form + Zod
- Day.js

## Getting started

```bash
bun install
bun run ios     # or android / web
```

## Project structure

```
app/                    # Expo Router screens
  (tabs)/               # Tab navigation (Dashboard, Vehicles)
  vehicles/add.tsx      # Add vehicle modal
components/             # Reusable UI
constants/theme.ts      # Paper light/dark themes
database/               # SQLite init and repositories
hooks/                  # Data hooks
lib/                    # i18n, formatting helpers
models/                 # TypeScript domain types
providers/              # App-wide context (DB, Paper)
schemas/                # Zod form validation
```

## Localization

UI strings live in `lib/i18n.ts`. English is the only catalog today; add locales via `setLocale` when you are ready to translate.

## Data

All data is stored locally in SQLite (`garagelog.db`). No network or authentication is required.
