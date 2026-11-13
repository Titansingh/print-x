---
inclusion: always
---

# API patterns

## Current state

The backend OpenAPI contract is not published. `packages/api-types/src/generated/schema.ts` is a placeholder with no endpoints (`apiContractMeta.isPlaceholder === true`), so no real call typechecks yet. Do not invent endpoints or hand-write backend types. Generate them with `pnpm generate:api` (see the `generate-api-types` skill and `docs/integration/api-contract.md`). Never edit `src/generated/` by hand.

## Client

`@platform/api-client` exports `createApiClient<Paths>(options)` (axios 1.21.0 under the hood). Request and response types are derived from openapi-typescript `paths` (`packages/api-client/src/types.ts`). Methods: `get`, `post`, `put`, `patch`, `delete`, plus `.axios` for advanced cases.

Options (`ApiClientOptions`): `baseUrl` (required), `withCredentials`, `getAccessToken`, `onUnauthorized`, `timeoutMs` (default 30000), `defaultHeaders` (never secrets), `adapter` (tests).

The client never reads env vars. Each app builds its own:

```ts
// apps/storefront/src/services/api.ts (admin is the same; cookie session)
export const apiClient = createApiClient({
  baseUrl: appConfig.apiUrl,
  withCredentials: true,
  onUnauthorized: () => sessionStore.getState().clear(),
});

// apps/mobile/src/services/api.ts (bearer token from SecureStore)
export const apiClient = createApiClient({
  baseUrl: appConfig.apiUrl,
  getAccessToken: () => tokenStore.getAccessToken(),
  onUnauthorized: () => {
    void tokenStore.clear();
    sessionStore.getState().clear();
  },
});
```

## Request construction

Always sends `Accept: application/json`. Options object per call: `params` (path), `query`, `headers`, `body`, `signal`, `timeoutMs`. Path templates use `{name}` and are encoded by `buildPath`. A missing path param throws `ApiError`. A 204 response resolves to `undefined`.

Illustrative only (from docs/integration/api-contract.md, not a real endpoint yet):

```ts
const product = await apiClient.get("/products/{productId}", { params: { productId }, signal });
```

## Auth and headers

- Web (storefront, admin): HTTP-only cookie session via `withCredentials: true`. No tokens in browser storage.
- Mobile: `Authorization: Bearer <token>` is added by a request interceptor when `getAccessToken` returns a token. Tokens live in Expo SecureStore only, never AsyncStorage.
- A 401 triggers `onUnauthorized`, which clears the session.

## Errors

All failures become `ApiError` (`packages/api-client/src/errors.ts`) via `toApiError`: `kind` is `"http" | "network" | "timeout" | "aborted" | "unknown"`, plus `status`, `data` (raw parsed body, shape defined by the backend) and `cause`. Helpers: `isUnauthorized` (401), `isForbidden` (403).

Retry policy (all three `query-client.ts` files): no retry for `ApiError` with status < 500, otherwise up to 2 retries.

## Using it in features

Call the client inside TanStack Query `queryFn`/`mutationFn`. Keep API-to-view-model mapping in a service/source (`src/services/catalog-source.ts`), not in components. Query keys come from a key factory:

```ts
export const catalogKeys = {
  all: ["catalog"] as const,
  featured: () => [...catalogKeys.all, "featured"] as const,
  product: (id: string) => [...catalogKeys.all, "product", id] as const,
};
```

## Not implemented yet

Pagination, file/photo uploads (planned: signed upload URLs from the backend) and an error body shape have no code in this repo. Ask before inventing them. Polling of async jobs: `refetchInterval` + `getBackoffDelay(attempt)` from `@platform/utils`.
