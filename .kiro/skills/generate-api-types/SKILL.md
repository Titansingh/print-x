---
name: generate-api-types
description: Regenerate TypeScript API types from the backend OpenAPI document and fix the resulting type errors in the apps.
---

# Generate API types

Backend owns the OpenAPI document. Types go to `packages/api-types/src/generated/{schema,meta}.ts`. Never edit them by hand. Full doc: `docs/integration/api-contract.md`.

1. Get the spec source from the user: a published URL or a local file. Do not guess a URL.
2. Run one of (from the repo root):
   ```sh
   API_SPEC_URL=https://<backend-host>/openapi/v1.json pnpm generate:api
   API_SPEC_PATH=./openapi.local.yaml pnpm generate:api
   pnpm generate:api -- ./openapi.local.yaml
   ```
   The script (`scripts/generate-api-types.mjs`) exits non-zero and leaves files untouched when no source is given, the spec is invalid, or the output has no `paths` export. It records the source without credentials or query strings.
3. Check that `packages/api-types/src/generated/meta.ts` now has `isPlaceholder: false`.
4. Run `pnpm typecheck`. Contract changes surface as type errors in apps. Fix them at the service/mapping boundary (e.g. `src/services/catalog-source.ts`), not in components.
5. Replace "backend contract pending" integration boundaries only for endpoints the spec really defines.
6. Run `pnpm lint && pnpm test`. Commit generated files together with the code changes. Downloaded `openapi.local.*` files are git-ignored.

Known caveat: `openapi-typescript@7.13.0` declares a TypeScript 5 peer, while the repo uses 6.0.3. Re-verify after upgrading either.
