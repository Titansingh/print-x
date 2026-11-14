---
name: add-admin-page
description: Add a permission-guarded page to the admin app via the navItems registry and the pageByPath route map.
---

# Add an admin page

Navigation and route access are generated from one registry, so access rules stay in one place.

1. Pick the permissions the page needs from `packages/auth-core/src/permissions.ts`. If a new permission is needed, add it there (and check `roles.ts` and the demo session in `packages/auth-core/src/demo/index.ts`). These names are provisional until the backend issues its own.
2. Create the page under `apps/admin/src/features/<area>/<Name>Page.tsx`. Use Mantine plus `@platform/design-system/tokens`. Do not import Tamagui. Reuse `PageLayout`, `PlaceholderPage`, `DataTable`, `FilterBar` and `LoadingView`/`EmptyView`/`ErrorView` from `@platform/ui-admin`. `features/orders/OrdersPage.tsx` is the list-page pattern.
3. Add an entry to `navItems` in `apps/admin/src/app/permissions/navigation.ts`:
   ```ts
   { path: "/example", label: "Example", group: "Operations", access: { allOf: ["orders.read"] } },
   ```
   `group` must be one of `Overview | Commerce | Partners | Operations | Administration`.
4. Add `"/example": <ExamplePage />` to `pageByPath` in `apps/admin/src/app/router/routes.tsx`. The route is created automatically as `example/*` and wrapped in `RequireAccess`. If the path has no entry in `pageByPath`, the route renders nothing.
   Partner-facing pages belong in `apps/partner` (same registry pattern: `src/app/permissions/navigation.ts` and `pageByPath` in `src/app/router/routes.tsx`, groups `Overview | Production | Business`), not in the admin.
5. Frontend permission checks are UX only. Do not describe them as security.
6. Update `apps/admin/src/app/App.test.tsx` if navigation expectations change, then run `pnpm --filter @platform/admin typecheck`, `lint` and `test`, or the `run-checks` skill.
