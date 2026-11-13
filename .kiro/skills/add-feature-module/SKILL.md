---
name: add-feature-module
description: Add a new feature area (screen, query hooks, data source, test) to the storefront, mobile or admin app following the repo's feature-folder pattern.
---

# Add a feature module

Features live in `apps/<app>/src/features/<area>/`. Reference implementation: `apps/storefront/src/features/catalog/`.

1. Read `.kiro/steering/architecture.md`, `api-patterns.md` and `navigation.md`. Check whether the backend contract for this area exists (`apiContractMeta.isPlaceholder` in `packages/api-types/src/generated/meta.ts`). If not, keep an explicit "backend contract pending" boundary and do not invent endpoints.
2. Create the files:
   - `types.ts`: view model (name ends in `View`) and a `<Area>Source` interface. Use `Money` from `@platform/domain` for prices.
   - `src/services/<area>-source.ts`: the integration boundary. Implement with `apiClient` once types exist, mapping API types to view models. Dev-only demo data goes under `src/mocks`, loaded via `import.meta.env.DEV && appConfig.<flag>`.
   - `queries.ts`: a `<area>Keys` factory and `useQuery` hooks, as in `catalog/queries.ts`.
   - `<Area>Page.tsx` (web) or `<Area>Screen.tsx` (mobile). Render pending, error and empty with `LoadingState`, `ErrorState`, `EmptyState` from `@platform/ui` (storefront/mobile). In admin, use `apps/admin/src/components/DataStates.tsx`, `DataTable.tsx` and `FilterBar.tsx` with Mantine.
3. Env vars are only read in the app's `config.ts`. New ones go in the Zod schema, the app's `.env.example`, and `docs/integration/environment.md`.
4. Wire the route: storefront in `src/app/routes.tsx`; mobile by adding `app/<name>.tsx` and a `<Stack.Screen>` in `app/_layout.tsx`; admin via the `add-admin-page` skill.
5. Keep customer web and mobile at feature parity where the feature exists on both.
6. Add a test next to the code (Vitest + Testing Library on web, Jest + RN Testing Library on mobile). See `apps/storefront/src/app/App.test.tsx` for a `createMemoryRouter` pattern.
7. Run the `run-checks` skill.
