---
inclusion: always
---

# Coding guidelines

## Naming

- Components and pages: PascalCase files, named exports (`CatalogPage.tsx`, `ProductCard.tsx`, `CatalogScreen.tsx` on mobile).
- Hooks: `useX` (`useFeaturedProducts`, `useColorScheme.ts`). Non-component modules: kebab-case (`catalog-source.ts`, `query-client.ts`, `secure-storage.ts`) or lowercase single words (`queries.ts`, `types.ts`, `session.ts`).
- Query key factories: `<area>Keys` (`catalogKeys`). View types end in `View` (`CatalogProductView`).
- Tests sit next to code: `*.test.ts(x)`. E2E in `apps/*/e2e/*.spec.ts`.
- Packages are `@platform/<name>`; each exposes a single `src/index.ts` barrel.
- Expo Router files live in `apps/mobile/app/` and only compose screens from `src/features`.

## Imports

- `consistent-type-imports` is an error: use inline `import { type X }` or `import type`. TS also has `verbatimModuleSyntax`.
- Cross-package: import from the package name (`@platform/ui`), never deep paths into another package's `src`. Allowed subpaths are the declared exports (`@platform/design-system/tokens`, `@platform/auth-core/demo`).
- Order seen in the code: external/workspace packages, then relative paths, alphabetized.
- Unused vars/args: prefix with `_`.

## Module template (web feature page)

```tsx
import { EmptyState, ErrorState, LoadingState, PageContainer } from "@platform/ui";
import { useFeaturedProducts } from "./queries";

export function CatalogPage() {
  const { data, isPending, isError, error, refetch } = useFeaturedProducts();
  return (
    <PageContainer>
      {isPending ? (
        <LoadingState label="Loading products" />
      ) : isError ? (
        <ErrorState title="Products are unavailable" message={error.message} onRetry={refetch} />
      ) : data.length === 0 ? (
        <EmptyState title="No products yet" />
      ) : /* render data */ null}
    </PageContainer>
  );
}
```

Env access: only in `src/app/config.ts` (web, Zod-validated) or `src/services/config.ts` (mobile).

## TypeScript

`tsconfig.base.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `isolatedModules`, `verbatimModuleSyntax`. Apps and packages extend presets from `@platform/tsconfig`. Use `assertNever` from `@platform/utils` for exhaustive switches.

## Lint and format

- Prettier (`.prettierrc.json`): semicolons, double quotes, trailing commas `all`, width 100. Prettier owns formatting; `eslint-config-prettier` disables conflicting rules.
- ESLint 10 flat config from `@platform/eslint-config` (`base`, `react`, `viteApp`, `expoApp`), with react-hooks rules, plus react-refresh in Vite apps. Generated `src/generated/**` is ignored by both tools.
- Accessibility: visible labels, `role="status"` for loading, `role="alert"` for errors, 44pt minimum touch target, never color alone for status.

## Commits

History uses Conventional Commits without scope so far (`feat:`, `chore:`). Format: `<type>(<scope>): <description>` with types feat, fix, refactor, chore, docs, style, test, perf, ci, revert. Scopes: app or package (`storefront`, `admin`, `mobile`, `api-client`, `ui`, `auth`). Use `/commit` to trigger the Smart Commit hook (`.kiro/hooks/smart-commit.json`). CI runs on push to `main` and on PRs: format:check, lint, typecheck, test, build.
