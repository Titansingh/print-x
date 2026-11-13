# UI system

## The split

| Surface                          | Library     | Why                                                                |
| -------------------------------- | ----------- | ------------------------------------------------------------------ |
| Customer web (`apps/storefront`) | **Tamagui** | One component model for web and native; compiles to CSS on the web |
| Customer mobile (`apps/mobile`)  | **Tamagui** | Same shared components as the web storefront                       |
| Admin (`apps/admin`)             | **Mantine** | Data-heavy UI: tables, filters, forms, queues                      |

Do not add NativeWind, React Native Paper or another competing mobile
component library. The admin does not use Tamagui components.

Planned fronts (see [overview.md](./overview.md)): print partner web (Mantine
if it shares the admin shell; undecided) and the print partner app (a flavour
of `apps/mobile`, so **Tamagui**). Mantine cannot be used in React Native: it
renders DOM elements and uses CSS.

## Custom design language (planned)

A designer will deliver a custom design language. We implement it as our own
components and wrappers, driven by one source of truth: the design tokens.

1. **Tokens first.** The designer's colors, typography, spacing, radius,
   shadows and motion go into `@platform/design-system/tokens`. The Tamagui
   config and the Mantine theme are both derived from them, so one token change
   updates every front.
2. **Wrapper components.** Feature code imports our components, never the
   underlying library.
   - `@platform/ui` (Tamagui): customer web, customer app, partner app.
   - Mantine wrapper package (planned, name not decided, for example
     `@platform/ui-web-admin`): admin web and partner web.
   - Both implementations follow one shared props contract (`variant`, `size`,
     `disabled`, `loading`, ...), defined once, so a designer spec maps to one
     API.
3. **Enforcement (planned).** Feature code does not import `tamagui` or
   `@mantine/*` directly; only the wrapper packages do. Use an ESLint
   `no-restricted-imports` rule.
4. **Accessibility lives in the wrappers** (focus ring, 44pt touch target,
   labels, status not by color alone).
5. **Platform-specific patterns.** Dense data tables and hover states have no
   mobile equivalent; ask the designer for separate web and mobile variants.

Core set to build first: Button, TextField, Select, Checkbox, Card, Badge,
Modal, Table/List, Toast, Tabs.

Until the designer's spec arrives, the current tokens stay provisional.

## Design tokens (`@platform/design-system`)

All visual values are centralized and provisional (violet primary, neutral
surfaces); change them in one place:

- `src/tokens/colors.ts`: raw 11-step palettes (`brand`, `neutral`,
  `success`, `warning`, `error`).
- `src/tokens/semantic.ts`: semantic roles for light and dark: `primary`,
  `onPrimary`, `background`, `surface`, `text`, `muted`, `border`, `success`,
  `warning`, `error`, `focusRing`.
- `src/tokens/scales.ts`: spacing (4px grid), radius, typography scale,
  breakpoints (640/768/1024/1280) and the 44pt minimum touch target.

`@platform/design-system/tokens` is framework-neutral and safe for any app.

### Tamagui mapping (`src/tamagui.config.ts`)

Built on Tamagui 3's v6 base (sizing ladder, media queries, shorthands):

- Themes are generated from our palettes with `createPaletteThemes`
  (`surface` = neutral, `brand` = brand, and `red`/`green`/`yellow` sub-themes
  from our status palettes). Light and dark are both generated.
- Semantic roles are exposed as theme variables (`primary`, `muted`,
  `surface`, `text`, `border`, `success`, `warning`, `error`, `focus-ring`,
  `on-primary`) that resolve per color scheme.
- The radius scale and font families come from our tokens.

Tamagui 3 uses a style grammar inside values: tokens by bare name and
modifiers inline, e.g. `borderColor="border-color hover:border-color-hover"`,
`px="4 md:8"`, `outlineColor="focus-visible:focus-ring"`. There are no
`hoverStyle` or `$md` props.

### Mantine mapping (`apps/admin/src/app/theme.ts`)

- `brand`, `gray`, `green`, `yellow`, `red` and `dark` color tuples derive
  from the same palettes (Mantine uses 10 shades; the 950 step is dropped).
- Font families, font sizes, spacing, radius and breakpoints derive from the
  token scales.
- Semantic roles are emitted as CSS variables (`--app-color-muted`,
  `--app-color-primary`, …) for both schemes via `cssVariablesResolver`.

## Sharing rules

Share in `@platform/ui` (web + native):

- Primitives and presentational components: `Button` (variants, loading,
  disabled, focus-visible, touch target), `BodyText`/`Heading`, `TextField`
  (label, hint, error, `aria-invalid`/`aria-describedby`), `ProductCard`,
  `PriceDisplay`, `StatusBadge`, `LoadingState`, `EmptyState`, `ErrorState`,
  `PageContainer`, `ProductGrid`.
- `UIProvider` (Tamagui provider with the shared config and color scheme).

Keep platform-specific (in the app or a platform package):

- Navigation and routing (React Router vs Expo Router); shared components take
  callbacks such as `onPress`, never router objects.
- File/photo selection, camera, share sheets, notifications.
- Checkout composition and payment handoff.
- 3D viewers (`@platform/3d-viewer-web` / `-native`).
- Safe-area and keyboard handling (`apps/mobile/src/platform/Screen.tsx`).

## Accessibility conventions

- Every interactive element is reachable by keyboard on the web and shows a
  focus-visible outline (`focus-ring` role).
- Minimum touch target 44×44 on native.
- Loading states use `role="status"`/`aria-live="polite"`; error states use
  `role="alert"`; status badges always include text, never color alone.
- Form fields always have a visible label and announce errors.

Automated tests cover structure and roles only. Full WCAG conformance needs
manual testing with assistive technologies (VoiceOver, TalkBack, screen
readers on desktop) and an accessibility review.

## Performance notes

- The storefront runs Tamagui in runtime mode (`disableExtraction: true` in
  `vite.config.ts`). Enabling the Tamagui compiler later can reduce runtime
  style work and bundle size.
- The R3F viewer is lazy-loaded, so Three.js ships in its own chunk.
