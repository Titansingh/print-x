---
name: add-admin-page
description: Add a permission-guarded page to the admin app via the navItems registry and the pageByPath route map.
---

# Add an admin page

Navigation and route access are generated from one registry, so access rules stay in one place.

1. Pick the permissions the page needs from `packages/auth-core/src/permissions.ts`. If a new permission is needed, add it there (and check `roles.ts` and the demo session in `packages/auth-core/src/demo/index.ts`). These names are provisional until the backend issues its own.
2. Create the page under `apps/admin/src/features/<area>/<Name>Page.tsx`. Use Mantine plus `@platform/design-system/tokens`. Do not import Tamagui. Reuse `PageLayout` (`src/layouts`) and `DataStates`, `DataTable`, `FilterBar` (`src/components`). `features/orders/OrdersPage.tsx` is the list-page pattern.
3. Add an entry to `navItems` in `apps/admin/src/app/permissions/navigation.ts`:
   ```ts
   { path: "/example", label: "Example", group: "Operations", access: { allOf: ["orders.read"] } },
   ```
   `group` must be one of `Overview | Commerce | Partners | Operations | Administration`.
4. Add `"/example": <ExamplePage />` to `pageByPath` in `apps/admin/src/app/router/routes.tsx`. The route is created automatically as `example/*` and wrapped in `RequireAccess`. If the path has no entry in `pageByPath`, the route renders nothing.
   Print partners use this same admin app today. Give partner pages partner-appropriate permissions (for example `printers.manage`, `fulfillment.manage`). Partner web may later become its own app; keep partner pages self-contained under their feature folder.
5. Frontend permission checks are UX only. Do not describe them as security.
6. Update `apps/admin/src/app/App.test.tsx` if navigation expectations change, then run `pnpm --filter @platform/admin typecheck`, `lint` and `test`, or the `run-checks` skill.
