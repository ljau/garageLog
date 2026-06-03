# GarageLog

Offline vehicle garage log built with Expo, TypeScript, and React Native Paper.

## Stack

- Expo Router (file-based navigation)
- TypeScript
- React Native Paper (Material Design 3)
- Expo SQLite (local persistence)
- Expo Notifications (local reminders)
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
lib/notifications.ts    # Local notification scheduling
```

## Reminders

Per vehicle, schedule local notifications for oil changes, insurance renewals, and tire rotations. Reminders are stored in SQLite and synced to the OS scheduler on save and app launch. Notifications require permission on iOS and Android. They are not available on web or in **Expo Go on Android** (use `npx expo run:android` for a development build).

## Localization

UI strings live in `lib/i18n.ts`. English is the only catalog today; add locales via `setLocale` when you are ready to translate.

## Data

All data is stored locally in SQLite (`garagelog.db`). No network or authentication is required.
