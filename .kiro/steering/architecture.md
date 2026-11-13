---
inclusion: always
---

# Architecture

Frontend-only pnpm + Turborepo monorepo for a city-first gifts and on-demand 3D printing marketplace. The backend is a separate repo (not decided). This repo has no backend, DB, ORM or secrets. Details: `docs/architecture/overview.md`.

## Layout

```text
apps/storefront   customer web   (React, Vite, Tamagui, React Router)
apps/mobile       customer iOS/Android (Expo SDK 58, Expo Router, Tamagui)
apps/admin        one role/permission-aware admin (React, Vite, Mantine, React Router)
packages/         source-only shared libraries (exports point at src/*.ts, no build step)
tooling/          @platform/eslint-config, @platform/tsconfig
scripts/          generate-api-types.mjs, clean.mjs
docs/             architecture/ and integration/ docs
```

## Target: five fronts

Existing: customer web (`apps/storefront`), admin web (`apps/admin`, also used by print partners via `partner_admin`/`partner_staff` roles today), customer app (`apps/mobile`). Planned: print partner web (separate app or partner-scoped admin shell, undecided) and print partner app (a flavour of `apps/mobile`, same Expo project, separate app ID and EAS profile). Do not build the planned fronts without the user confirming the open decisions.

## Packages and responsibilities

| Package                           | Responsibility                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `@platform/design-system`         | Tokens, Tamagui config, themes. `/tokens` subpath is framework-neutral.                                                   |
| `@platform/ui`                    | Shared Tamagui components (web + native): Button, TextField, ProductCard, Loading/Empty/ErrorState, layouts, `UIProvider` |
| `@platform/api-types`             | Types generated from the backend OpenAPI (placeholder today)                                                              |
| `@platform/api-client`            | `createApiClient` (axios), `ApiError`; apps inject base URL and auth                                                      |
| `@platform/domain`                | View types, Zod schemas (`moneySchema`, customization), pure rules                                                        |
| `@platform/auth-core`             | `AuthAdapter`, Zustand `createSessionStore`, permissions, `canAccess`; dev-only `./demo`                                  |
| `@platform/auth-web`              | Cookie-session adapter                                                                                                    |
| `@platform/auth-native`           | Secure token store + token adapter (SecureStore injected by the app)                                                      |
| `@platform/3d-viewer-web/-native` | R3F GLB/GLTF viewer (web); contract + placeholder (native)                                                                |
| `@platform/utils`                 | `formatMoney`, `getBackoffDelay`, `assertNever`                                                                           |

## Dependency rules (from docs/architecture/overview.md)

- Shared packages never read env vars (`import.meta.env`, `process.env.EXPO_PUBLIC_*`). Apps pass values in.
- `@platform/ui` and design-system must not import web-only or native-only modules. Navigation, pickers, safe areas, 3D rendering stay in apps/platform packages. Shared components take callbacks (`onPress`), never router objects.
- Admin uses `@platform/design-system/tokens` only, never Tamagui.
- Demo/mock data is dev-only, behind flags, and must not reach production bundles.
- Permission checks in the frontend are UX only. The backend enforces them.

## State management

- Server state: TanStack Query. Each app builds its client in `src/services/query-client.ts` (`createQueryClient`, no retry on 4xx, max 2 retries otherwise).
- Global client state: Zustand, only for the session (`createSessionStore` from `@platform/auth-core`).
- Local UI state: React state. Validation: Zod schemas from `@platform/domain`.

## Key singletons (per app, `src/services/`)

- `api.ts` exports `apiClient` (`createApiClient(...)`). Web: `withCredentials: true`. Mobile: `getAccessToken` from `tokenStore`.
- `session.ts` exports `sessionStore`. Currently `createUnconfiguredAuthAdapter()` (always signed out), marked `INTEGRATION BOUNDARY`.
- `query-client.ts` exports `createQueryClient`.
- Mobile only: `src/platform/` holds native adapters (`secure-storage.ts`, `Screen.tsx`).

## Structuring a new feature

Apps are organized by feature: `src/features/<area>/`.

- Storefront example: `features/catalog/{CatalogPage.tsx, queries.ts, types.ts}`. `queries.ts` defines a key factory (`catalogKeys`) and `useQuery` hooks. `types.ts` defines view models and the `<X>Source` interface.
- Data access goes through a source in `src/services/*-source.ts` (see `catalog-source.ts`), so the API mapping stays at one boundary. Map API types to view models there.
- Render pending/error/empty with `LoadingState`, `ErrorState`, `EmptyState` from `@platform/ui`.
- Wire the screen into the router (see navigation.md) and add a smoke test.
- Long-running work (AI model generation, print jobs) is async: create a job, then poll with `refetchInterval` + `getBackoffDelay`. Never hold one request open.
- Where the backend contract is missing, keep an explicit "backend contract pending" state. Do not invent endpoints.
