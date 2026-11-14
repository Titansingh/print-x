---
inclusion: fileMatch
fileMatchPattern: "{packages/ui/**,packages/ui-admin/**,packages/design-system/**,apps/admin/src/**,apps/partner/src/**,apps/storefront/src/**,apps/mobile/src/**}"
---

# UI system

Full doc: `docs/architecture/ui-system.md`.

- Customer apps (storefront, mobile): Tamagui 3.2.3 through `@platform/ui`. Admin and partner web: Mantine 9.7.5 through `@platform/ui-admin` (theme `mantineTheme` in `packages/ui-admin/src/theme.ts`, shell, layouts, tables, states), tokens from `@platform/design-system/tokens` only.
- All colors, spacing, radius, typography and breakpoints (640/768/1024/1280) come from `packages/design-system/src/tokens/*`. Do not hardcode visual values in components.
- Tamagui 3 style grammar is inline in values: `borderColor="border-color hover:border-color-hover"`, `px="4 md:8"`, `outlineColor="focus-visible:focus-ring"`. There are no `hoverStyle` or `$md` props.
- Shared in `@platform/ui`: primitives and presentational components only (`Button`, `TextField`, `ProductCard`, `PriceDisplay`, `StatusBadge`, states, `PageContainer`, `ProductGrid`, `UIProvider`). Export new ones from `packages/ui/src/index.ts`.
- Keep in apps: routing, pickers/camera, checkout composition, 3D viewers, safe-area/keyboard (`apps/mobile/src/platform/Screen.tsx`).
- Target is five fronts: customer web, admin web, print partner web (`apps/partner`, Mantine), customer app, print partner app (partner flavour of `apps/mobile`). Mantine cannot run in React Native, so the partner app uses Tamagui.
- A designer will supply a custom design language. Put design values in the tokens first; Tamagui config and the Mantine theme derive from them. Build our own wrapper components (`@platform/ui-admin` for Mantine web admin/partner, `@platform/ui` for Tamagui) with one shared props contract. Feature code should not import `tamagui` or `@mantine/*` directly in new work. Details: `docs/architecture/ui-system.md`.
- Accessibility: focus-visible outline, 44x44 minimum touch target on native, `role="status"` / `aria-live="polite"` for loading, `role="alert"` for errors, status text not color only, labelled fields with `aria-invalid` / `aria-describedby`.
