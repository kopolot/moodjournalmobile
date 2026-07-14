# MoodDic Mobile

> **Status: active prototype / portfolio project**  
> Expo / React Native client for MoodDic — gamified mood check-ins synced to the Symfony API.  
> Early UI; **not production-hardened**.

API / Docker stack: [moodjournal](https://github.com/kopolot/moodjournal)

Product idea: daily check-ins with overall + aspect moods (inner mood, relationships, activity, environment), XP/streaks, and a future Plus tier for AI insights.

## Stack

| Piece | Notes |
|-------|--------|
| Expo | SDK **57** |
| React Native | **0.86** |
| React | **19.2** |
| Routing | Expo Router (file-based) |
| HTTP | Axios |
| Storage | AsyncStorage |
| Fonts | Nunito (`@expo-google-fonts/nunito`) |
| Motion | Reanimated + Haptics |
| i18n | i18next (EN/PL) |

## Requirements

- Node.js matching Expo 57 (see Expo docs; typically recent LTS)
- Expo Go that supports **SDK 57**, or a dev/build client
- Running API on the LAN (`http://<host>:8080`) for device testing
- `npm install --legacy-peer-deps` (peer conflict with TypeScript 6 / react-i18next)

## Setup

```bash
npm install --legacy-peer-deps
npm start
# or: npm run start:offline   # skip Expo account/API calls
# or: npm run web
```

| Script | Purpose |
|--------|---------|
| `npm start` | Metro on LAN (`expo start --lan`) |
| `npm run start:offline` | LAN without Expo cloud session |
| `npm run start:tunnel` | Tunnel (needs valid Expo login) |
| `npm test` | Jest (`--watchAll` by default) |
| `npm run lint` | `expo lint` |

Override API base URL:

```bash
EXPO_PUBLIC_API_URL=http://192.168.x.x:8080 npm start
```

Without override, `config/appConfig.ts` resolves:

1. `EXPO_PUBLIC_API_URL`
2. Expo/Metro host (physical device / LAN)
3. `10.0.2.2:8080` (Android emulator)
4. `localhost:8080` (iOS simulator / web)

## App structure

| Path | Role |
|------|------|
| `app/(auth)/` | Register / login / offline gate |
| `app/(app)/` | Tabs: Home, History, Check-in, Profile |
| `services/moodService.ts` | Mood CRUD + stats against API |
| `services/authService.ts` | Auth session |
| `components/game/` | XP bar, streak, primary buttons |
| `styles/gameStyles.ts`, `styles/colors.ts` | Gamified design tokens |
| `locales/` | EN/PL copy |
| `utils/alert.ts` | Cross-platform alerts (web + native) |

### Tabs

1. **Home** — streak, XP/level, daily quest CTA, AI teaser  
2. **History** — list of synced entries (long-press delete)  
3. **Check-in** — multi-step mood form → `POST /mood`  
4. **Profile** — name edit, language toggle, logout, Plus teaser  

## API contract (backend)

Auth:

- Register: `POST /user/register`
- Login: `POST /user/login` with `{ email, password }` → `data.jwt_token`
- Profile: `GET /user/get`, `PATCH /user/edit`

Mood (Bearer JWT):

- `POST /mood` — create check-in (`overallMood`, `aspects`, optional `note`)
- `GET /mood`, `GET /mood/stats`, `DELETE /mood/{id}`

Do **not** import `@react-navigation/*` in app code — use `expo-router` / `expo-router/react-navigation` / `expo-router/js-tabs` (SDK 56+ rule).

## Device troubleshooting

| Symptom | Fix |
|---------|-----|
| `UnexpectedServerData: No returned query result` | Stale Expo session — `npx expo logout`, then `npm start` or `npm run start:offline`. Avoid orphan `extra.eas.projectId` unless the project is linked on expo.dev |
| QR opens nothing | Same Wi‑Fi as PC; use Expo Go for SDK 57; prefer LAN over tunnel |
| Login works on web, fails on phone | Phone must reach API at LAN IP `:8080` (not `localhost`) |
| Web login silent failure | Use `showAlert` (not only `Alert.alert`); CORS must allow the web origin |
| Check-in fails after login | Confirm email verified; migrate API DB so `/mood` exists |

## Tests

```bash
npx jest --watchAll=false --forceExit
```

## Agent / Cursor notes

See [`AGENTS.md`](./AGENTS.md) and [`.cursor/rules/`](./.cursor/rules/).

## Why this exists

Client for the MoodDic prototype — Expo Router + JWT auth + gamified mood check-ins. Example / learning code, not a shipping store build.
