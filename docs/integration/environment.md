# Environment configuration

Each app commits a `.env.example`. Copy it to `.env.local` (git-ignored) for
local development. Real `.env` files are never committed.

## Variables

| App        | Variable                         | Purpose                                                                                                                 | Default                                |
| ---------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| storefront | `VITE_API_URL`                   | Backend REST base URL                                                                                                   | `http://localhost:8080`                |
| storefront | `VITE_USE_DEMO_DATA`             | Dev-only isolated demo catalog                                                                                          | `false` (ignored in production builds) |
| admin      | `VITE_API_URL`                   | Backend REST base URL                                                                                                   | `http://localhost:8080`                |
| admin      | `VITE_USE_DEMO_AUTH`             | Dev-only fake session to explore the admin shell                                                                        | `false` (ignored in production builds) |
| admin      | `VITE_DEMO_ROLE`                 | Demo role (`super_admin`, `platform_admin`, `operations_manager`, `operations_staff`, `partner_admin`, `partner_staff`) | `super_admin`                          |
| mobile     | `EXPO_PUBLIC_API_URL`            | Backend REST base URL                                                                                                   | `http://localhost:8080`                |
| scripts    | `API_SPEC_URL` / `API_SPEC_PATH` | OpenAPI source for `pnpm generate:api`                                                                                  | none                                   |

Env vars are read in exactly one place per app (`src/app/config.ts` for the
web apps, validated with Zod; `src/services/config.ts` on mobile) and passed
into shared packages as arguments.

## Public variables are not secret

`VITE_*` and `EXPO_PUBLIC_*` values are **inlined into client bundles** and
readable by anyone who loads the site or downloads the app. Never put private
keys, database credentials, service-role tokens, payment secrets or any other
secret in them. Secrets belong to the backend.

Credentials at runtime:

- **Web:** HTTP-only, Secure cookies set by the backend. No tokens in
  `localStorage`/`sessionStorage`.
- **Mobile:** Expo SecureStore (Keychain/Keystore). Never AsyncStorage.

## Local backend and device networking

- **Web (browser on your machine):** `http://localhost:<port>` works. The
  backend must allow the dev origins (`http://localhost:5173`,
  `http://localhost:5174`) in CORS, with credentials for cookie sessions.
- **iOS Simulator:** `localhost` reaches your machine.
- **Android Emulator:** use `http://10.0.2.2:<port>` for the host machine.
- **Physical devices:** `localhost` is **the phone itself**. Use your
  development machine's LAN address (e.g. `http://192.168.1.20:8080`, same
  Wi-Fi network, firewall open), or a tunnel (`npx expo start --tunnel` for
  Metro, plus an HTTPS tunnel for the backend).

`EXPO_PUBLIC_*` values are read when Metro bundles. Restart `expo start`
(with `--clear` if needed) after changing them. EAS builds set them per
profile in `apps/mobile/eas.json` or in EAS environment variables.

## Build-time configuration in CI

CI builds the web apps with a non-secret placeholder `VITE_API_URL`. Deployment
pipelines set real URLs per environment; no credentials are needed for CI.
