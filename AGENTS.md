# Agent guide — MoodDic Mobile

Expo client for MoodDic. Mood check-ins sync to the Symfony API (`/mood`). Keep the Duolingo-like gamified language unless asked to change brand direction.

## Related repo

API + Docker: https://github.com/kopolot/moodjournal

## Stack constraints

- Expo **SDK 57**, React Native **0.86**, React **19.2**
- Entry: `expo-router/entry`
- From SDK 56+: **no** `@react-navigation/*` imports in app code  
  Use `expo-router`, `expo-router/react-navigation`, `expo-router/js-tabs`, `expo-router/drawer`
- Prefer `utils/alert` `showAlert` over raw `Alert.alert` when web matters
- Install with `npm install --legacy-peer-deps` (TS 6 vs react-i18next peer)

## Dev server

```bash
npm start                 # --lan
npm run start:offline     # avoid Expo GraphQL/session issues
```

If Expo CLI prints `UnexpectedServerData: No returned query result`, logout (`npx expo logout`) or use offline mode. Do not re-add a dead `eas.projectId` without a real Expo project.

## API host

Logic lives in `config/appConfig.ts`. Physical devices need the machine LAN IP (via Metro `hostUri`) and API on port **8080**. Override with `EXPO_PUBLIC_API_URL`.

Login body: `{ email, password }`. Token: `data.jwt_token`. User field from API: **`isVerified`** (not a typo'd variant).

Mood endpoints: see `API_CONFIG.ENDPOINTS.MOOD` in `config/appConfig.ts` and `services/moodService.ts`.

Aspect keys (must match API): `close_relationships`, `romantic_relationships`, `duties`, `physical_health`, `finances`, `relaxation`, `growth_spirituality`, `environment`. Overall mood is separate (`overallMood`).

## Layout map

| Area | Paths |
|------|--------|
| Auth screens | `app/(auth)/` |
| Signed-in tabs | `app/(app)/` — `index`, `history`, `mood-note`, `profile` |
| Root providers | `app/_layout.tsx` (Nunito fonts + Auth/I18n/Theme/Feedback) |
| HTTP | `services/apiClient.ts`, `authService.ts`, `moodService.ts` |
| Gamified UI | `components/game/`, `styles/gameStyles.ts`, `styles/colors.ts` |
| Auth state | `contexts/AuthContext.tsx` (`refreshUser` available) |

Legacy route `explore` redirects to `history` and stays hidden from the tab bar (`href: null`).

## Tests

```bash
npm test              # CI mode: jest --watchAll=false --forceExit
npm run test:watch    # interactive
```

- Global setup: `jest.setup.ts` (AsyncStorage mock, haptics, expo-constants, …)
- Helpers: `__tests__/testUtils/` (`renderWithProviders`, fixtures)
- Layers: `__tests__/unit/`, `__tests__/integration/` (axios-mock-adapter), `__tests__/e2e/` (provider/screen flows — not Detox/Maestro)
- Prefer covering `isNoteRequiredForScore`, `MoodService`, auth session, and the mood-note wizard over placeholder suites

## Product / UX notes

- First-session vibe: playful, streak/XP heavy (Duolingo-inspired), green-first brand — avoid purple AI defaults and cream/serif terracotta looks
- Plus / AI analysis is **teaser only** until billing + backend AI exist
- Prefer i18n keys over hardcoded PL/EN strings in new UI

## Do not

- Import `@react-navigation/*` directly
- Point phone clients at `localhost` for the API
- Commit `package.json.bac`, `.expo/`, or secrets
- Persist mood only locally when API is available — use `/mood`
- Add project MCP servers unless there is a concrete tool need (none required today)

## Commits

Scope mobile work clearly (`feat(mood):`, `chore:`, `fix:`, `test:`). Stage named files; keep lockfile policy as in `.gitignore` (`package-lock.json` is ignored in this repo).
