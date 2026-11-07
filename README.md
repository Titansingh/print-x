# 3D Printing Marketplace: Frontend Monorepo

Frontend for a city-first marketplace for gifts and on-demand 3D printing:
customer web storefront, customer mobile app (iOS/Android) and one
role/permission-aware admin for platform operations and print partners.

The **backend is a separate repository** (technology undecided). This repo
contains no backend, database, ORM, migrations or secrets. It consumes the
backend's published OpenAPI contract. See
[docs/architecture/overview.md](docs/architecture/overview.md).

## Prerequisites

| Tool                 | Version                               | Notes                                                 |
| -------------------- | ------------------------------------- | ----------------------------------------------------- |
| Node.js              | 24.x (`.nvmrc` pins 24.13.0)          | Supported range `^22.13.0 \|\| ^24.3.0` (Expo SDK 58) |
| pnpm                 | 12.18.0 (pinned via `packageManager`) | Enable with `corepack enable`                         |
| Expo Go / simulators | Expo SDK 58                           | For running the mobile app                            |

```sh
nvm use               # or install Node 24.13.0
corepack enable       # provides the pinned pnpm
pnpm install
```

> **Private npm registry in `~/.npmrc`?** The repo pins the public registry in
> `.npmrc` and `pnpm-workspace.yaml`, but pnpm resolves its own version using
> the user-level config. If your user config points at a private registry with
> expired credentials, refresh them or run
> `npm_config_userconfig=/dev/null pnpm install`.

## Apps

| App               | Stack                                                  | Dev URL                      |
| ----------------- | ------------------------------------------------------ | ---------------------------- |
| `apps/storefront` | React 19, Vite 8, Tamagui 3, React Router 8            | http://localhost:5173        |
| `apps/admin`      | React 19, Vite 8, Mantine 9, React Router 8            | http://localhost:5174        |
| `apps/mobile`     | Expo SDK 58, React Native 0.88, Expo Router, Tamagui 3 | Metro: http://localhost:8081 |

Shared across apps: TanStack Query (server state), Zustand (global client
state such as the session), Zod (input validation), axios-based typed API
client generated from OpenAPI.

## Commands

Run from the repository root.

| Command                        | What it does                                                           |
| ------------------------------ | ---------------------------------------------------------------------- |
| `pnpm dev`                     | All app dev servers in parallel (storefront, admin, Expo)              |
| `pnpm dev:storefront`          | Storefront on :5173                                                    |
| `pnpm dev:admin`               | Admin on :5174                                                         |
| `pnpm dev:mobile`              | Expo dev server (press `i` / `a` for simulators, scan QR for a device) |
| `pnpm build`                   | Production builds of the web apps                                      |
| `pnpm lint`                    | ESLint in every workspace                                              |
| `pnpm typecheck`               | `tsc --noEmit` in every workspace                                      |
| `pnpm test`                    | Vitest (web/packages) and Jest (mobile) unit/smoke tests               |
| `pnpm test:e2e`                | Playwright e2e for the web apps (builds first)                         |
| `pnpm format` / `format:check` | Prettier write / check                                                 |
| `pnpm clean`                   | Remove build outputs and Turborepo caches                              |
| `pnpm generate:api`            | Generate API types from the backend OpenAPI document                   |

Single workspace: `pnpm --filter @platform/admin test`, `pnpm --filter @platform/mobile ios`.

All checks (same as CI):

```sh
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

### Mobile

```sh
pnpm dev:mobile                          # Expo dev server
pnpm --filter @platform/mobile ios       # iOS simulator
pnpm --filter @platform/mobile android   # Android emulator
pnpm --filter @platform/mobile check:expo   # verify Expo SDK-compatible versions
```

On a physical device, `localhost` is the phone itself. Set
`EXPO_PUBLIC_API_URL` to your machine's LAN address or a tunnel URL; see
[docs/integration/environment.md](docs/integration/environment.md). Native
binaries are built with EAS (`apps/mobile/eas.json`) once Expo/Apple/Google
accounts and credentials exist.

### End-to-end tests

```sh
pnpm --filter @platform/storefront exec playwright install chromium   # once
pnpm test:e2e
```

Mobile device E2E uses [Maestro](https://maestro.mobile.dev):
`maestro test apps/mobile/.maestro` against a running development build.

## Environment

Each app has a committed `.env.example`; copy to `.env.local`. Public-prefixed
variables (`VITE_*`, `EXPO_PUBLIC_*`) are embedded in client bundles. Never
put secrets in them. Details:
[docs/integration/environment.md](docs/integration/environment.md).

## Repository layout

```text
apps/          storefront (web), mobile (Expo), admin (web)
packages/      shared libraries (UI, design system, API client/types, auth, 3D viewers, domain, utils)
tooling/       shared ESLint and TypeScript configs
docs/          architecture and integration docs
scripts/       API type generation and helpers
```

## Documentation

- [Architecture overview](docs/architecture/overview.md): apps, packages, backend boundary
- [UI system](docs/architecture/ui-system.md): Tamagui/Mantine split and design tokens
- [3D viewer](docs/architecture/3d-viewer.md): web/native viewer boundary and formats
- [API contract](docs/integration/api-contract.md): OpenAPI ownership and type generation
- [Environment](docs/integration/environment.md): variables and device networking

## What depends on backend decisions

- **API contract:** `packages/api-types` holds a placeholder until the backend publishes OpenAPI. All data screens show explicit "pending" states.
- **Authentication:** no identity provider is chosen. Adapters exist for web cookie sessions and native secure storage; apps use an "unconfigured" adapter (admin can use a dev-only demo session).
- **Payments, uploads, model generation, fulfillment:** UI boundaries exist; integrations wait for backend contracts.
- **Native 3D rendering:** placeholder until a renderer is validated on devices.
