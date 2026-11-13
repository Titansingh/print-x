---
inclusion: always
---

# Tech stack

Shared versions are pinned once in the `catalog:` block of `pnpm-workspace.yaml` (`saveExact: true`). Use `"catalog:"` in package.json; do not write version numbers for catalog packages.

## Runtime and tooling

- Node 24.13.0 (`.nvmrc`), supported `^22.13.0 || ^24.3.0`
- pnpm 12.18.0 (`packageManager`, enable via `corepack enable`), `nodeLinker: hoisted` (needed by Expo/Metro)
- Turborepo 2.11.10, Prettier 3.9.10
- TypeScript 6.0.3 (expected by Expo SDK 58), ESLint 10.14.0, typescript-eslint 8.72.1

## Libraries (catalog)

react / react-dom 19.3.0, react-router 8.5.1, @tanstack/react-query 5.107.1, zustand 5.1.0, zod 4.6.7, axios 1.21.0, tamagui + @tamagui/config 3.2.3, @mantine/core + hooks 9.7.5, three 0.187.0, @react-three/fiber 9.8.2, @react-three/drei 10.7.9, vite 8.3.6, @vitejs/plugin-react 6.2.1, vitest 5.1.0, jsdom 31.0.0, @testing-library/react 16.3.3, @playwright/test 1.65.0, openapi-typescript 7.13.0.

## Mobile (apps/mobile, Expo-managed ranges)

expo ~58.0.23, react-native 0.88.1, expo-router ~58.0.30, expo-secure-store ~58.0.2, jest ~30.5.2, jest-expo ~58.0.14, @testing-library/react-native 14.1.0. Add Expo packages with `npx expo install`, and verify with `pnpm --filter @platform/mobile check:expo`.

## Commands (run from repo root)

| Command                                                                    | Purpose                                                                                                |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `pnpm install`                                                             | install (CI uses `--frozen-lockfile`)                                                                  |
| `pnpm dev` / `dev:storefront` (:5173) / `dev:admin` (:5174) / `dev:mobile` | dev servers                                                                                            |
| `pnpm build`                                                               | build web apps (`tsc --noEmit && vite build`)                                                          |
| `pnpm lint` / `typecheck` / `test`                                         | via Turbo in every workspace                                                                           |
| `pnpm test:e2e`                                                            | Playwright (builds first); once: `pnpm --filter @platform/storefront exec playwright install chromium` |
| `pnpm format` / `format:check`                                             | Prettier                                                                                               |
| `pnpm generate:api`                                                        | OpenAPI -> `packages/api-types/src/generated`                                                          |
| `pnpm --filter <name> <script>`                                            | single workspace, e.g. `@platform/admin test`                                                          |

Full CI parity: `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

## Do NOT use

- Backend code, DB, ORM, migrations, or invented API endpoints/auth providers (backend is a separate repo).
- `openapi-fetch` or `fetch` wrappers for API calls. The team chose axios via `@platform/api-client`.
- NativeWind, React Native Paper or other mobile UI libraries. Tamagui only for customer apps.
- Tamagui in the admin, or Mantine in storefront/mobile.
- Tamagui `hoverStyle` / `$md` props. Tamagui 3 uses inline grammar (`px="4 md:8"`).
- AsyncStorage for tokens (use Expo SecureStore) or browser storage for tokens.
- Secrets in `VITE_*` / `EXPO_PUBLIC_*` variables (they ship in the bundle). Never commit `.env` files, only `.env.example`.
- Env var reads inside shared packages.
- Pinning catalog packages with ranges or inline versions. Do not run install scripts outside `allowBuilds`.
