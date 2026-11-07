# API contract

## Ownership

The **backend repository owns and publishes the OpenAPI document** (versioned
JSON or YAML). This repo never hand-writes request/response types for
endpoints that the contract defines; it generates them.

| Piece             | Location                                                        |
| ----------------- | --------------------------------------------------------------- |
| Generation script | `scripts/generate-api-types.mjs` (openapi-typescript)           |
| Generated types   | `packages/api-types/src/generated/schema.ts` (+ `meta.ts`)      |
| Typed client      | `packages/api-client` (`createApiClient<paths>()`, axios-based) |

## Current state

No backend OpenAPI document exists yet. `schema.ts` is a **placeholder** that
declares **no endpoints**, so no API call can typecheck until real types are
generated, and nothing pretends to be real backend functionality.
`apiContractMeta.isPlaceholder` is `true`. Screens show explicit "backend
contract pending" or empty states.

## Generating types

```sh
# From a published, versioned spec
API_SPEC_URL=https://<backend-host>/openapi/v1.json pnpm generate:api

# From a downloaded spec file (JSON or YAML)
API_SPEC_PATH=./openapi.local.yaml pnpm generate:api
# or
pnpm generate:api -- ./openapi.local.yaml
```

The script:

1. Loads the spec with `openapi-typescript`.
2. Refuses to write if the output does not export `paths`.
3. Writes `schema.ts` and `meta.ts`, recording the source **without**
   credentials or query strings (safe to commit).
4. Exits non-zero, leaving files untouched, when no source is given or the
   spec is invalid.

Commit the regenerated files. `openapi.local.*` files are git-ignored.

### Update workflow

1. Backend publishes a new spec version.
2. Run `pnpm generate:api` with that version's URL or file.
3. Run `pnpm typecheck`. Contract changes surface as type errors in apps and
   services; fix them at the service/mapping boundary.
4. Commit the generated types with the code changes, referencing the spec
   version.

In CI, a future job can regenerate from the published spec and fail on diff.

## Using the client

Each app creates its own client and passes platform configuration. The shared
client never reads environment variables:

```ts
// apps/storefront/src/services/api.ts (web: HTTP-only cookie session)
export const apiClient = createApiClient({
  baseUrl: appConfig.apiUrl, // from VITE_API_URL
  withCredentials: true,
  onUnauthorized: () => sessionStore.getState().clear(),
});

// apps/mobile/src/services/api.ts (native: bearer token from SecureStore)
export const apiClient = createApiClient({
  baseUrl: appConfig.apiUrl, // from EXPO_PUBLIC_API_URL
  getAccessToken: () => tokenStore.getAccessToken(),
});
```

Calls are typed from `paths`: path params, query, headers, JSON body and the
2xx response:

```ts
const product = await apiClient.get("/products/{productId}", {
  params: { productId },
  signal,
}); // typed from the generated contract
```

Errors are normalized to `ApiError` (`kind`: `http` | `network` | `timeout` |
`aborted`, plus `status` and `data`). Use the client inside TanStack Query
`queryFn`/`mutationFn`; keep mapping from API types to view models in the
feature's service layer.

### Why axios instead of openapi-fetch

The team chose axios. `@platform/api-client` adds a small type layer that
derives request/response types from openapi-typescript's `paths` (the same
input `openapi-fetch` uses), so the contract stays the single source of truth.

### Known peer mismatch

`openapi-typescript@7.13.0` declares `peerDependencies.typescript: ^5.x`. The
repo uses TypeScript 6.0.3 (expected by Expo SDK 58). Generation was verified
end to end under TS 6.0.3 against a sample spec: types generated, the
generated file typechecks, and a typed `client.get(...)` call compiles.
Re-verify when upgrading either package.

## Expected API domains

Endpoint names are **not** assumed; the backend defines them. Expected areas:

- Catalog and products (search, details, variants, customization options)
- Uploads and assets (signed upload URLs, photo uploads)
- Customization and **model generation jobs** (asynchronous)
- Models and customer approval (preview assets, versions)
- Cart, checkout, payment and orders
- Partner onboarding and printer capabilities (printers, materials, capacity)
- Print jobs and status
- Quality control (inspections, evidence)
- Pickup, delivery and tracking
- Session/identity and permissions (for the auth adapters)

### Asynchronous workflows

AI model generation and print fulfillment are long-running. The frontend
creates a job and then **polls** the job resource (TanStack Query
`refetchInterval`, with `getBackoffDelay` from `@platform/utils`) or
**subscribes** if the backend offers server-sent events or WebSockets. It must
never keep one HTTP request open for the duration of a job.
