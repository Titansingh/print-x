# 3D Printing Marketplace --- Frontend Monorepo Setup Specification

**Audience:** Kiro coding agent\
**Purpose:** Create the initial frontend monorepo, configure the
applications and shared packages, and document how they integrate with a
separately maintained backend.

------------------------------------------------------------------------

## 1. Instructions to the Kiro agent

Set up the repository described in this document. Treat this document as
the source of truth for the initial architecture.

Before changing files:

1.  Inspect the existing repository and preserve any useful existing
    work.
2.  Check the installed Node.js, package manager and available tooling.
3.  Use current stable, mutually compatible releases at implementation
    time. Do not copy old or guessed version numbers from examples.
4.  For Expo-managed dependencies, use the Expo SDK-compatible versions
    and `npx expo install` (or the equivalent pnpm invocation).
5.  Prefer official framework setup instructions when configuration
    details have changed.
6.  Implement the workspace in small, verifiable steps. Run install,
    lint, typecheck and build checks, and fix issues introduced by the
    setup.
7.  Do not invent a backend API, database, authentication provider,
    payment provider, cloud storage provider or deployment account.
8.  Where a backend contract is not yet available, create a clearly
    marked integration boundary and a small mock/demo layer only if
    needed to make the frontend run. Keep mock data isolated from
    production API code.
9.  At completion, provide a summary of created files, commands
    executed, checks passed/failed and any remaining manual steps.

Do not create a backend application or backend infrastructure in this
repository.

## 2. Product context

The product is a city-first marketplace for gifts and on-demand 3D
printing services. It supports:

-   Non-customizable gifts.
-   Customer-customizable gifts.
-   Personalized gifts using AI-generated 3D models, for example a
    wobble-head model created from customer-provided photos.
-   Marketplace products and services fulfilled by third-party print
    partners initially.
-   Centralized 3D model creation/review workflows.
-   Partner onboarding and printer capability registration.
-   Print job assignment, quality control, pickup and delivery.
-   Customer pickup/delivery tracking and order updates.

The customer experience must be available on both web and mobile, with
feature parity as a product goal. Platform operations and partner
workflows are accessed through one role-based admin application.

## 3. Architectural decisions

These decisions are fixed for this setup unless a technical
incompatibility is discovered and documented.

  -----------------------------------------------------------------------
  Concern                             Decision
  ----------------------------------- -----------------------------------
  Repository                          One frontend monorepo

  Workspace manager                   pnpm workspaces

  Task orchestration                  Turborepo

  Language                            TypeScript with strict settings

  Customer web                        React + Vite

  Customer mobile                     Expo + React Native + Expo Router

  Admin                               One React + Vite role-based
                                      application

  Customer web/mobile UI              Tamagui, with shared customer
                                      components

  Admin UI                            Mantine

  Shared styling                      Design tokens and semantic theme
                                      values

  Server state                        TanStack Query

  Local/client state                  React state first; Zustand only
                                      when shared/global client state
                                      warrants it

  Web routing                         React Router

  Mobile routing                      Expo Router

  API style                           REST

  API contract                        OpenAPI, owned and published by the
                                      backend repository

  API types                           Generated TypeScript types from
                                      OpenAPI

  API client                          `openapi-fetch` or another
                                      lightweight OpenAPI-compatible
                                      client

  Validation                          Zod for frontend form/input
                                      validation where useful

  Web 3D                              Three.js + React Three Fiber

  Native 3D                           A separately implemented
                                      native-compatible viewer; validate
                                      Expo GL / current Expo renderer
                                      compatibility before selecting the
                                      implementation

  Web tests                           Vitest + React Testing Library;
                                      Playwright for end-to-end tests

  Mobile tests                        Jest or the currently recommended
                                      Expo test setup + React Native
                                      Testing Library; Maestro for device
                                      E2E

  Mobile builds                       EAS Build, configured when
                                      credentials/accounts are available

  CI                                  GitHub Actions
  -----------------------------------------------------------------------

### Important UI decision

Use Tamagui for the customer storefront and Expo mobile application.
Share customer-facing primitives, tokens and appropriate presentational
components. Do not force web-only or native-only features into a single
implementation.

Use Mantine for the admin application. The admin is data-heavy and
includes tables, filters, forms, operational queues and management
workflows. The admin may consume shared semantic design tokens, but it
does not need to share Tamagui components.

Do not add NativeWind, React Native Paper or a second competing mobile
component library.

### Backend boundary

The backend is a separate repository and its technology is undecided.
The frontend must not depend on a particular backend language or
framework.

The backend owns: - API behavior and business rules. - Authentication
and authorization enforcement. - Database schema and migrations. - AI
generation and processing jobs. - File/object storage and signed URL
generation. - Payments, order state transitions and fulfillment rules. -
Partner, printer, production, QC and delivery logic. - The authoritative
OpenAPI specification.

The frontend consumes a published OpenAPI document and generates its API
types from it. Never hand-maintain a second copy of backend
response/request types when the OpenAPI contract exists.

## 4. Repository structure

Create the following structure. It is acceptable to adjust minor
configuration-file placement to follow current framework conventions,
but preserve the application and package boundaries.

``` text
3d-printing-platform/
├── apps/
│   ├── storefront/                   # Customer web: React + Vite + Tamagui
│   │   └── src/
│   │       ├── app/
│   │       ├── features/
│   │       │   ├── catalog/
│   │       │   ├── product-details/
│   │       │   ├── customization/
│   │       │   ├── ai-model-generation/
│   │       │   ├── 3d-preview/
│   │       │   ├── cart/
│   │       │   ├── checkout/
│   │       │   └── orders/
│   │       ├── services/
│   │       └── main.tsx
│   │
│   ├── mobile/                        # Customer iOS/Android: Expo
│   │   ├── app/                       # Expo Router routes
│   │   └── src/
│   │       ├── features/
│   │       ├── services/
│   │       └── platform/
│   │
│   └── admin/                         # Unified role-based admin: React + Vite + Mantine
│       └── src/
│           ├── app/
│           │   ├── router/
│           │   ├── providers/
│           │   └── permissions/
│           ├── features/
│           │   ├── dashboard/
│           │   ├── users/
│           │   ├── catalog/
│           │   ├── pricing/
│           │   ├── partners/
│           │   ├── printers/
│           │   ├── model-generation/
│           │   ├── orders/
│           │   ├── print-jobs/
│           │   ├── quality-control/
│           │   ├── pickup/
│           │   ├── delivery/
│           │   └── settings/
│           ├── layouts/
│           └── services/
│
├── packages/
│   ├── ui/                            # Shared customer Tamagui components
│   │   └── src/
│   │       ├── components/
│   │       ├── layouts/
│   │       └── index.ts
│   ├── design-system/                 # Shared tokens and Tamagui config
│   │   └── src/
│   │       ├── tokens/
│   │       ├── themes/
│   │       └── tamagui.config.ts
│   ├── ui-admin/                      # Optional shared admin-only components
│   ├── api-client/                    # Platform-neutral API client factory
│   ├── api-types/                     # Generated OpenAPI types
│   ├── domain/                        # Frontend domain types and pure rules
│   ├── auth-core/                     # Platform-neutral auth interfaces/types
│   ├── auth-web/                      # Browser auth adapter
│   ├── auth-native/                   # Native auth adapter
│   ├── 3d-viewer-web/                 # Web-specific viewer
│   ├── 3d-viewer-native/              # Native-specific viewer
│   └── utils/                         # Small platform-neutral utilities
│
├── tooling/
│   ├── eslint/
│   └── typescript/
├── docs/
│   ├── architecture/
│   └── integration/
├── scripts/
│   └── generate-api-types.*
├── .github/
│   └── workflows/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
├── tsconfig.base.json
├── .gitignore
└── README.md
```

Do not create empty abstractions just to fill every directory. Create
package manifests and minimal working entry points for packages that are
actually referenced. Unused future packages can be documented as planned
rather than published as broken workspace packages.

## 5. Workspace and tooling requirements

### pnpm workspace

Configure `pnpm-workspace.yaml` to include:

``` yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

Set the root package to private and pin the actual pnpm version used by
the project in the `packageManager` field. Commit the lockfile.

### Root scripts

Provide working root scripts, adapted to the scripts available in each
workspace:

-   `dev` --- run selected/all app dev servers in parallel.
-   `dev:storefront`
-   `dev:admin`
-   `dev:mobile`
-   `build`
-   `lint`
-   `typecheck`
-   `test`
-   `format`
-   `format:check`
-   `clean`
-   `generate:api`

Use Turborepo task dependencies and caching appropriately. Persistent
dev tasks must not be cached. Do not define task scripts that fail
because a package does not implement them.

### TypeScript

Use strict TypeScript. Establish a root `tsconfig.base.json` and
app/package-specific configs. Enable sensible strictness such as
`strict`, `noUncheckedIndexedAccess` where compatible, and
`forceConsistentCasingInFileNames`.

Do not force one TypeScript config onto Expo, Vite and library packages
if their framework requirements differ.

### Code quality

Configure ESLint and Prettier consistently. Add scripts to every
app/package that participates in root lint/typecheck tasks. Avoid adding
unnecessary lint plugins or complex custom rules during initial setup.

### Dependency versions

Use compatible current stable versions. Do not use `latest` as a
permanent version declaration in committed manifests. Resolve versions
during setup and save exact semver ranges according to the repository's
package policy. Respect Expo SDK compatibility.

## 6. UI and design-system requirements

### Customer web and mobile

Use Tamagui for shared primitives. Configure: - Shared theme and
tokens. - Light and dark themes. - Typography scale. - Spacing scale. -
Border-radius scale. - Semantic colors (primary, background, surface,
text, muted, border, success, warning, error). - Responsive behavior for
web. - Accessible focus, disabled and loading states. - Native touch
targets and safe-area/keyboard behavior.

Create a small initial shared component set: - Button - Text/input
primitives where appropriate - ProductCard - PriceDisplay -
StatusBadge - LoadingState - EmptyState - ErrorState

Use platform-specific implementations when behavior differs. Keep
navigation, file/photo selection, checkout composition and 3D viewer
implementations platform-specific.

### Admin

Use Mantine and create a separate admin theme using the same semantic
brand tokens where practical. Set up: - Application shell and responsive
navigation. - Authenticated route boundary. - Permission-aware
navigation. - Reusable page header and content layout. -
Table/filter/form conventions. - Loading, empty and error states.

Do not build every admin feature screen yet. Set up the shell and
representative placeholder routes only.

### Visual direction

Use a clean, modern, premium e-commerce direction. Initial palette may
use a violet primary with neutral light/dark surfaces, but keep all
values centralized and easy to replace. Treat sample colors as
provisional, not final brand identity. Avoid hardcoding colors in
individual components.

## 7. API contract integration

The backend repository owns and publishes OpenAPI, for example as a
versioned JSON/YAML document. The frontend repository should accept the
spec URL or a downloaded versioned spec as input.

Implement: - `packages/api-types` for generated OpenAPI TypeScript
declarations. - `packages/api-client` for a platform-neutral typed API
client factory. - A script to generate types from an explicit
`API_SPEC_URL` or local spec path. - A documented update workflow in
`docs/integration/api-contract.md`.

Prefer `openapi-typescript` for type generation and `openapi-fetch` for
typed requests unless a clear compatibility reason suggests otherwise.

The shared client must not read Vite or Expo environment variables
directly. Each app passes its own base URL and platform-specific
auth/fetch configuration into the client factory.

Example conceptual API client:

``` ts
import createClient from "openapi-fetch";
import type { paths } from "@platform/api-types";

export function createApiClient(baseUrl: string) {
  return createClient<paths>({ baseUrl });
}
```

The exact imports and package exports must be made valid by the agent.

Do not fabricate the actual `paths` schema. If no backend OpenAPI
document exists yet: - Provide a clear placeholder generated-types file
or documented generation target. - Ensure the repository still installs
and builds. - Do not represent placeholder endpoints as real backend
functionality.

Document expected API domains without assuming final endpoint names: -
Catalog/products. - Uploads and assets. - Customization and model
generation jobs. - Models and customer approval. - Cart, checkout,
payment and orders. - Partner onboarding and printer capabilities. -
Print jobs and status. - Quality control. - Pickup, delivery and
tracking.

AI model generation and print fulfillment are asynchronous workflows.
The frontend should eventually create a job and poll or subscribe to
status updates; it must not hold a single HTTP request open for the
duration of model generation or printing.

## 8. Authentication and authorization boundaries

Do not choose or implement a real identity provider without an explicit
decision.

Create interfaces/adapters so authentication can be connected later: -
Web should be designed to support secure, HTTP-only cookie sessions when
the backend supports them. - Mobile should use secure platform storage
such as Expo SecureStore for credentials/tokens when appropriate. -
Never store long-lived credentials in AsyncStorage or browser
localStorage. - Never put secrets in `VITE_*` or `EXPO_PUBLIC_*`
variables. - The backend must enforce authorization for every protected
operation. - Frontend role checks are for navigation and UX only; they
are not security controls.

The unified admin app should support permission-based access rather than
hardcoding only one role-to-screen mapping.

Initial role concepts: - Super Admin: full platform access. - Platform
Admin: users, catalog, pricing, partner management and settings. -
Operations Manager: orders, model review, assignment, QC and
fulfillment. - Operations Staff: explicitly assigned operational
tasks. - Partner Admin: partner profile, printers, materials, team and
capacity. - Partner Staff: assigned print jobs, status and evidence
submission.

Initial permission examples: - `products.read`, `products.create`,
`products.update` - `orders.read`, `orders.assign`, `orders.cancel` -
`print_jobs.read`, `print_jobs.update`, `print_jobs.complete` -
`quality_control.inspect` - `partners.read`, `partners.approve`,
`partners.manage`

Create frontend permission types and route guards only. The backend will
be authoritative.

## 9. 3D viewer boundaries

Create separate packages for web and native viewers. Do not assume a
browser WebGL component can run unchanged in Expo.

Web: - React Three Fiber / Three.js. - GLB/GLTF as the preferred
interactive preview format. - Support loading, error, empty and
unsupported-model states. - Provide a clean viewer interface for rotate,
zoom, reset camera and model loading.

Mobile: - Investigate current Expo SDK support and native rendering
compatibility before choosing the rendering implementation. - Keep the
viewer API/configuration conceptually aligned with web, but use a native
renderer and native gestures. - If a reliable native renderer cannot be
configured during this setup, create a documented interface and
placeholder screen rather than adding incompatible native dependencies.

Manufacturing/source formats may include STL, 3MF and OBJ. Do not assume
all source formats can be previewed directly by the same renderer. The
backend/model pipeline may generate GLB/GLTF preview assets.

Store model files in backend-managed object storage, not in this
repository. Model metadata, versioning, dimensions, print settings and
job status belong to backend contracts.

## 10. Feature boundaries

The apps should be organized by feature, not by technical file type
alone.

### Storefront and mobile feature areas

-   Catalog and search.
-   Product details.
-   Non-customizable products.
-   Product customization.
-   Photo upload.
-   AI model-generation job status.
-   3D preview and approval.
-   Cart and checkout.
-   Customer account and addresses.
-   Orders and fulfillment tracking.

Both customer apps should target functional feature parity. Where
platform capabilities differ (camera/gallery access, share sheets,
notifications, payment handoff), use platform adapters.

### Admin feature areas

-   Dashboard.
-   User management.
-   Catalog and pricing management.
-   Partner onboarding and verification.
-   Printer/material/capability management.
-   AI model review.
-   Orders.
-   Print-job assignment and monitoring.
-   Quality inspection.
-   Pickup and delivery coordination.
-   Settings and role/permission administration.

The admin is one app with role-aware navigation and routes, not three
separate apps.

## 11. Environment configuration

Create `.env.example` files, not real secret-bearing `.env` files.

Vite apps: - `VITE_API_URL`

Expo: - `EXPO_PUBLIC_API_URL`

Document that public-prefixed variables are visible in client bundles.
Never include private keys, database credentials, service-role tokens or
payment secrets.

For physical-device Expo development, document that `localhost` points
to the phone itself. Use a reachable development-machine LAN address or
a development tunnel.

## 12. Testing and CI

Add a basic GitHub Actions workflow that: 1. Checks out the repository.
2. Sets up the supported Node.js version. 3. Enables the pinned pnpm
version. 4. Installs with frozen lockfile. 5. Runs formatting check. 6.
Runs lint. 7. Runs typecheck. 8. Runs unit tests. 9. Builds the web
apps.

Do not require production credentials for CI. Mobile native binary
builds can be handled by EAS separately; CI may run mobile
lint/typecheck/tests without signing credentials.

Add at least minimal smoke tests: - Storefront renders. - Admin
renders. - Mobile app starts or passes its available Expo checks. -
Shared UI package imports successfully in both customer apps. - API
client package typechecks without requiring a real backend.

## 13. Documentation to create

Create: - `README.md` --- setup, prerequisites, workspace commands and
app URLs. - `docs/architecture/overview.md` --- apps, packages and
backend boundary. - `docs/architecture/ui-system.md` --- Tamagui/Mantine
split, shared tokens and component-sharing rules. -
`docs/integration/api-contract.md` --- OpenAPI ownership, generation and
update workflow. - `docs/integration/environment.md` --- environment
variables and local-device networking. -
`docs/architecture/3d-viewer.md` --- web/native viewer boundary and
supported preview formats.

## 14. Acceptance criteria

The setup is complete only when:

-   [ ] pnpm workspace is valid and lockfile is committed.
-   [ ] Turborepo is configured and root tasks work.
-   [ ] `apps/storefront` runs with React, Vite and Tamagui.
-   [ ] `apps/mobile` runs with Expo Router and Tamagui.
-   [ ] `apps/admin` runs with React, Vite and Mantine.
-   [ ] Shared customer UI package is importable from storefront and
    mobile.
-   [ ] Shared design tokens are used by customer apps and can be mapped
    into the admin theme.
-   [ ] TypeScript strict mode is enabled and typechecks pass.
-   [ ] Lint and formatting checks pass.
-   [ ] Unit/smoke tests pass.
-   [ ] Web builds complete successfully.
-   [ ] API client is platform-neutral and does not directly read
    Vite/Expo env variables.
-   [ ] OpenAPI type generation is documented and does not fabricate a
    backend contract.
-   [ ] Admin has a role/permission architecture boundary, without
    pretending frontend checks provide security.
-   [ ] Web and native 3D viewer packages are separate.
-   [ ] No backend, database, ORM, migrations or production secrets are
    added.
-   [ ] Documentation explains how to run each app and what remains
    dependent on backend decisions.

## 15. Final Kiro deliverable

After implementation, report:

1.  Final repository tree.
2.  Node.js and pnpm versions used.
3.  Framework/library versions installed.
4.  Commands to run each app independently.
5.  Commands to run all checks.
6.  Local URLs and Expo start instructions.
7.  Files that require backend OpenAPI URL or other future
    configuration.
8.  Any incomplete or intentionally deferred work, especially native 3D
    rendering and authentication-provider integration.
9.  Test/build results.

**Do not claim the setup is complete if the repository does not install,
typecheck and build.**
