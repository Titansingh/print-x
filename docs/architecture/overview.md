# Architecture overview

## Scope

This repository is the **frontend monorepo** for the marketplace. It contains
four applications (five fronts; the mobile app has two flavours, see below) and the shared packages they use. The backend lives in a
separate repository; its technology is undecided and this repo does not
depend on it beyond a published OpenAPI document.

## Workspace

- **pnpm workspaces** (`apps/*`, `packages/*`, `tooling/*`), hoisted
  `node_modules` (required by Expo/Metro in monorepos).
- **Turborepo** orchestrates `build`, `lint`, `typecheck`, `test`, `test:e2e`,
  `dev` and `clean`. Dev and clean tasks are not cached.
- **pnpm catalog** (`pnpm-workspace.yaml`) holds one exact version per shared
  dependency. Expo-managed packages in `apps/mobile` keep the SDK-compatible
  ranges written by `npx expo install`; the lockfile pins exact versions.
- Shared libraries are **source-only internal packages**: their `exports`
  point at TypeScript sources and the consuming bundler (Vite or Metro)
  compiles them. They have lint/typecheck/test tasks but no build step.

## Applications

| App               | Purpose              | Key choices                                                                            |
| ----------------- | -------------------- | -------------------------------------------------------------------------------------- |
| `apps/storefront` | Customer web         | React + Vite, Tamagui via `@platform/ui`, React Router, lazy-loaded R3F viewer         |
| `apps/mobile`     | Customer iOS/Android | Expo SDK 58 + Expo Router, Tamagui via `@platform/ui`, SecureStore-backed auth adapter |
| `apps/admin`      | Platform operations  | React + Vite, Mantine, permission-aware navigation and route guards                    |

### Target: five fronts

The product will have five fronts. Three exist today; two are planned.

| #   | Front             | Platform    | Users          | Status                                                                                     |
| --- | ----------------- | ----------- | -------------- | ------------------------------------------------------------------------------------------ |
| 1   | Customer web      | Web         | Customers      | `apps/storefront`                                                                          |
| 2   | Admin web         | Web         | Platform staff | `apps/admin`                                                                               |
| 3   | Print partner web | Web         | Print partners | `apps/partner` (Mantine, scaffolded: dashboard, print jobs, printers placeholders)         |
| 4   | Customer app      | iOS/Android | Customers      | `apps/mobile`                                                                              |
| 5   | Print partner app | iOS/Android | Print partners | `apps/mobile` partner flavour (`APP_VARIANT=partner`); config only, no partner screens yet |

Decisions and open points:

- The customer app and the partner app are **flavours of one Expo project**
  (separate app ID, name, scheme and feature set per flavour). `app.config.ts`
  reads `APP_VARIANT`; EAS has `*-partner` profiles; the bundle reads
  `EXPO_PUBLIC_APP_VARIANT` via `appConfig.variant`. Partner screens are not
  built yet and the partner identifiers are placeholders.
- Decided: partner web is a **separate app** (`apps/partner`) using
  **Mantine**, with its own permission-aware navigation registry. The admin
  is for platform staff only: partner-scoped sessions (`partnerId` set) see a
  "use the partner portal" page there (UX only; the backend enforces access).
- Mantine cannot run in React Native (it depends on the DOM and CSS). The
  partner app therefore uses Tamagui, and partner web uses Mantine. Both
  read the same design tokens. See [ui-system.md](./ui-system.md).

Both customer apps target **feature parity**. Apps are organized **by
feature** (`src/features/<area>`), with `services/` holding integration
boundaries (API client, session, data sources) and, on mobile, `platform/`
holding native-only adapters (secure storage, safe-area/keyboard screen).

The admin is **one app** for every role. Navigation and routes come from a
single registry (`apps/admin/src/app/permissions/navigation.ts`) where each
entry declares the permissions it needs.

## Packages

| Package                                         | Responsibility                                                                                                                      | Platforms                                 |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `@platform/design-system`                       | Tokens (palette, semantic colors, spacing, radius, typography, breakpoints), Tamagui config, theme generation                       | all (tokens subpath is framework-neutral) |
| `@platform/ui`                                  | Shared customer Tamagui components (Button, TextField, ProductCard, PriceDisplay, StatusBadge, Loading/Empty/Error states, layouts) | web + native                              |
| `@platform/api-types`                           | Types generated from the backend OpenAPI document (placeholder today)                                                               | all                                       |
| `@platform/api-client`                          | Typed REST client factory on axios; apps inject base URL and auth                                                                   | all                                       |
| `@platform/domain`                              | Frontend view types, Zod input schemas, pure rules (preview format support)                                                         | all                                       |
| `@platform/auth-core`                           | Session/adapter interfaces, Zustand session store, permission types and checks; dev-only demo adapter under `./demo`                | all                                       |
| `@platform/auth-web`                            | Cookie-session adapter (HTTP-only cookies, no browser token storage)                                                                | web                                       |
| `@platform/auth-native`                         | Secure token store + token adapter (SecureStore injected by the app)                                                                | native                                    |
| `@platform/3d-viewer-web`                       | Three.js + React Three Fiber GLB/GLTF viewer                                                                                        | web                                       |
| `@platform/3d-viewer-native`                    | Native viewer contract + placeholder                                                                                                | native                                    |
| `@platform/ui-admin`                            | Mantine theme, app shell, page layout, table, filter bar, states for admin and partner web                                          | web                                       |
| `@platform/utils`                               | Money formatting, polling backoff, small helpers                                                                                    | all                                       |
| `@platform/eslint-config`, `@platform/tsconfig` | Shared tooling configs                                                                                                              | tooling                                   |

`@platform/ui-admin` (`packages/ui-admin`) holds the Mantine theme, shell,
layouts, table, filter and state components shared by `apps/admin` and
`apps/partner`. It takes callbacks, never router objects.

### Dependency rules

- Shared packages never read environment variables (`import.meta.env`,
  `process.env.EXPO_PUBLIC_*`); apps pass configuration in.
- `@platform/ui` and the design system must not import web-only or
  native-only modules. Platform-specific concerns (navigation, file/photo
  pickers, checkout composition, 3D rendering, safe areas) stay in apps or in
  platform-specific packages.
- The admin consumes `@platform/design-system/tokens` only, never Tamagui.
- Mock/demo data is isolated (`apps/storefront/src/mocks`,
  `@platform/auth-core/demo`), loaded only in development behind explicit
  flags, and excluded from production bundles.

## Backend boundary

The backend owns API behavior and business rules, authentication and
authorization enforcement, database schema, AI generation jobs, file/object
storage and signed URLs, payments, order state transitions and fulfillment
rules, partner/printer/production/QC/delivery logic, and the authoritative
OpenAPI specification.

The frontend:

- generates request/response types from the published OpenAPI document and
  never hand-maintains copies of backend types
  ([api-contract.md](../integration/api-contract.md));
- treats role/permission checks as **UX only** (hiding navigation, guarding
  routes). Every protected operation is enforced by the backend;
- treats AI model generation and print fulfillment as **asynchronous jobs**:
  create a job, then poll (TanStack Query `refetchInterval` +
  `getBackoffDelay`) or subscribe. Never hold one HTTP request open.

### Integration boundaries waiting on backend decisions

| Boundary            | Location                                                                                               | Replace with                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Generated API types | `packages/api-types/src/generated`                                                                     | `pnpm generate:api` output                                         |
| Catalog data        | `apps/storefront/src/services/catalog-source.ts`, `apps/mobile/src/features/catalog/catalog-source.ts` | `apiClient` calls mapped to view models                            |
| Session (web)       | `apps/*/src/services/session.ts`                                                                       | `createCookieSessionAdapter` with backend session/logout endpoints |
| Session (native)    | `apps/mobile/src/services/session.ts`                                                                  | `createTokenAuthAdapter` with the chosen identity provider         |
| Admin lists         | `apps/admin/src/features/orders/OrdersPage.tsx` (pattern)                                              | `apiClient` queries                                                |
| Permissions list    | `packages/auth-core/src/permissions.ts`                                                                | backend-issued permission names                                    |

## Testing and CI

- Web apps and packages: Vitest (+ React Testing Library, jsdom).
- Mobile: Jest via `jest-expo` + React Native Testing Library; Maestro for
  device E2E (`apps/mobile/.maestro`).
- Web E2E: Playwright (`apps/*/e2e`) against production preview builds.
- CI (`.github/workflows/ci.yml`): frozen install, format check, lint,
  typecheck, unit tests, web builds. No credentials required. Native binaries
  are built separately with EAS.
