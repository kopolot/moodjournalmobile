# Agent guide — MoodJournal Mobile

Abandoned Expo example. Keep changes small; do not pretend mood data syncs to the API unless the backend gains endpoints.

## Related repo

API + Docker: https://github.com/kopolot/moodjournal

## Stack constraints

- Expo **SDK 57**, React Native **0.86**, React **19.2**
- Entry: `expo-router/entry`
- From SDK 56+: **no** `@react-navigation/*` imports in app code  
  Use `expo-router`, `expo-router/react-navigation`, `expo-router/js-tabs`, `expo-router/drawer`
- Prefer `utils/showAlert` over raw `Alert.alert` when web matters

## Dev server

```bash
npm start                 # --lan
npm run start:offline     # avoid Expo GraphQL/session issues
```

If Expo CLI prints `UnexpectedServerData: No returned query result`, logout (`npx expo logout`) or use offline mode. Do not re-add a dead `eas.projectId` without a real Expo project.

## API host

Logic lives in `config/appConfig.ts`. Physical devices need the machine LAN IP (via Metro `hostUri`) and API on port **8080**. Override with `EXPO_PUBLIC_API_URL`.

Login body: `{ email, password }`. Token: `data.jwt_token`.

## Layout map

| Area | Paths |
|------|--------|
| Auth screens | `app/(auth)/` |
| Signed-in tabs | `app/(app)/` |
| Root providers | `app/_layout.tsx` |
| HTTP | `services/apiClient.ts`, `services/authService.ts` |
| Auth state | `contexts/AuthContext.tsx` |

## Do not

- Import `@react-navigation/*` directly
- Point phone clients at `localhost` for the API
- Commit `package.json.bac`, `.expo/`, or secrets
- Add project MCP servers unless there is a concrete tool need (none required today)

## Commits

Scope mobile work clearly (`chore:`, `fix:`, `feat:`). Stage named files; keep lockfile policy as in `.gitignore` (`package-lock.json` is ignored in this repo).
