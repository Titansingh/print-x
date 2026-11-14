---
name: add-ui-component
description: Add a design-language component (token-driven, with a shared props contract) to @platform/ui (Tamagui) and, for web admin or partner, @platform/ui-admin (Mantine).
---

# Add a design-language component

The designer's custom design language is implemented as our own components. Values come from tokens; feature code imports our components, not Tamagui or Mantine.

1. Check the designer's spec for the component. If a needed color, size, radius or type style is missing, add it to `packages/design-system/src/tokens/*` first. Never hardcode visual values in a component.
2. Define the props contract once (`variant`, `size`, `disabled`, `loading`, callbacks such as `onPress`). Shared components take callbacks, never router objects.
3. Tamagui implementation (customer web, customer app, partner app): add it to `packages/ui/src/`, export from `packages/ui/src/index.ts`. Use Tamagui 3 inline grammar (`px="4 md:8"`, `borderColor="border-color hover:border-color-hover"`). No `hoverStyle` or `$md` props. No web-only or native-only imports.
4. Mantine implementation (admin web, partner web): add it to `packages/ui-admin/src/` and export from `packages/ui-admin/src/index.ts`. It must implement the same props contract and read the same tokens through `mantineTheme` (`packages/ui-admin/src/theme.ts`). Take callbacks, never router objects (see `AppShellLayout`'s `onNavigate`). Mantine does not work in React Native.
5. Accessibility inside the component: visible focus ring, 44x44 minimum touch target on native, labels, `role="status"` or `role="alert"` where relevant, status never by color alone.
6. Where web and mobile patterns differ (dense tables, hover states), implement the designer's separate variants rather than forcing one.
7. Add a `*.test.tsx` next to the component, then run `pnpm --filter @platform/ui typecheck`, `lint` and `test`, or the `run-checks` skill.
8. Update `docs/architecture/ui-system.md` if the contract or token set changed.
