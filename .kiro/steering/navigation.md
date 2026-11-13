---
inclusion: fileMatch
fileMatchPattern: "{apps/*/src/app/**/routes.tsx,apps/admin/src/app/permissions/**,apps/admin/src/app/router/**,apps/mobile/app/**}"
---

# Navigation

Two routers: React Router 8 (storefront, admin) and Expo Router (mobile). Shared UI never receives router objects, only callbacks.

## Storefront (`apps/storefront/src/app/routes.tsx`)

A `RouteObject[]` with `StorefrontLayout` as parent. Routes: `/` (catalog), `products/:productId`, `models`, `cart`, `checkout`, `orders`, `*` (NotFoundPage).

Add a screen: create `src/features/<area>/<X>Page.tsx`, import it in `routes.tsx`, add `{ path: "<path>", element: <XPage /> }` to the layout's `children`, and add a link in `StorefrontLayout` if needed. Tests render routes with `createMemoryRouter(routes, { initialEntries })`.

## Admin (`apps/admin/src/app/router/routes.tsx`)

Routes are generated from the `navItems` registry in `src/app/permissions/navigation.ts`. Each item has `path`, `label`, `group` and an optional `access: AccessRequirement` (`allOf` / `anyOf` of `Permission`). `RequireSession` wraps the layout, `RequireAccess` wraps each page, and fallbacks are `/sign-in`, `/forbidden` and `*`.

Add a page: (1) add a `NavItem` with the needed permissions (permission names come from `@platform/auth-core`, `permissions.ts`), (2) add the element to `pageByPath` in `routes.tsx` under the same path. Nested routes use `<path>/*`. See the `add-admin-page` skill.

## Mobile (`apps/mobile/app/`, Expo Router file-based)

Files: `_layout.tsx` (Stack with `AppProviders`), `index.tsx`, `orders.tsx`, `products/[productId].tsx`, `+not-found.tsx`. Route files only compose a `Screen` plus a feature screen from `src/features`.

Add a screen: create `app/<name>.tsx`, declare it in `_layout.tsx` with `<Stack.Screen name="<name>" options={{ title }} />`, and implement the UI in `src/features/<area>/<X>Screen.tsx`.

Typed params:

```tsx
const { productId } = useLocalSearchParams<{ productId: string }>();
router.push({ pathname: "/products/[productId]", params: { productId } });
```

The app URL scheme is `printx` (`app.json`).
