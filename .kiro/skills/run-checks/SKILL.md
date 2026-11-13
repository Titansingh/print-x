---
name: run-checks
description: Run the same format, lint, typecheck, test and build checks as CI, for the whole repo or a single workspace.
---

# Run checks

CI (`.github/workflows/ci.yml`) runs these in order. Run from the repo root.

1. Decide scope. For a change in one workspace, use `pnpm --filter <package-name> <script>`. Package names: `@platform/storefront`, `@platform/admin`, `@platform/mobile`, `@platform/<package>`. For cross-cutting changes, run everything.
2. Full run, stopping at the first failure:
   ```sh
   pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
   ```
3. If `format:check` fails, run `pnpm exec prettier --write <files>` on the changed files (or `pnpm format` for everything) and re-check.
4. If `typecheck` fails after touching `packages/api-types` or the API client, see the `generate-api-types` skill.
5. Optional, only when asked or when routes or UI flows changed: `pnpm test:e2e` (builds first; needs `pnpm --filter @platform/storefront exec playwright install chromium` once).
6. Mobile dependency changes: `pnpm --filter @platform/mobile check:expo`.
7. Report which commands passed or failed. Do not claim success for commands you did not run.

Notes: `pnpm build` only builds the web apps. The CI build sets `VITE_API_URL=https://api.example.invalid`. Shared packages have no build step.
