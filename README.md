# MoodJournal Mobile

> **Status: abandoned example / portfolio snippet**  
> Expo / React Native client for an unfinished mood-tracking idea.  
> **Not production-ready**, not maintained.

API / Docker stack: [moodjournal](https://github.com/kopolot/moodjournal)

This app is mainly **auth UI** plus local-only mood note screens. Mood entries are **not** persisted to the API.

## Stack

| Piece | Notes |
|-------|--------|
| Expo | SDK **57** |
| React Native | **0.86** |
| React | **19.2** |
| Routing | Expo Router (file-based) |
| HTTP | Axios |
| Storage | AsyncStorage |
| i18n | i18next (EN/PL, incomplete) |

## Requirements

- Node.js matching Expo 57 (see Expo docs; typically recent LTS)
- Expo Go that supports **SDK 57**, or a dev/build client
- Running API on the LAN (`http://<host>:8080`) for device testing

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
| `app/` | Expo Router screens (`(auth)`, `(app)`, `_(dev)`) |
| `services/` | `apiClient`, `authService` |
| `contexts/` | Auth + i18n |
| `config/appConfig.ts` | Env + API host resolution |
| `utils/alert.ts` | Cross-platform alerts (web + native) |
| `styles/` | Shared screen styles |

## Auth API contract (backend)

- Register: `POST /user/register`
- Login: `POST /user/login` with `{ email, password }` → `data.jwt_token`
- Profile: `GET /user/get` with `Authorization: Bearer …`

Do **not** import `@react-navigation/*` in app code — use `expo-router` / `expo-router/react-navigation` / `expo-router/js-tabs` (SDK 56+ rule).

## Device troubleshooting

| Symptom | Fix |
|---------|-----|
| `UnexpectedServerData: No returned query result` | Stale Expo session — `npx expo logout`, then `npm start` or `npm run start:offline`. Avoid orphan `extra.eas.projectId` unless the project is linked on expo.dev |
| QR opens nothing | Same Wi‑Fi as PC; use Expo Go for SDK 57; prefer LAN over tunnel |
| Login works on web, fails on phone | Phone must reach API at LAN IP `:8080` (not `localhost`) |
| Web login silent failure | Use `showAlert` (not only `Alert.alert`); CORS must allow the web origin |

## Tests

```bash
npx jest --watchAll=false --forceExit
```

## Agent / Cursor notes

See [`AGENTS.md`](./AGENTS.md) and [`.cursor/rules/`](./.cursor/rules/).

## Why this exists

Part of an unfinished personal product. Kept as an example of Expo Router + JWT auth wiring — not a shipping app.
