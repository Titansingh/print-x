import { createApiClient } from "@platform/api-client";

import { appConfig } from "../app/config";
import { sessionStore } from "./session";

/**
 * Storefront API client. Uses cookie credentials so a backend-managed,
 * HTTP-only session cookie can authenticate requests. No tokens are stored
 * in browser storage.
 */
export const apiClient = createApiClient({
  baseUrl: appConfig.apiUrl,
  withCredentials: true,
  onUnauthorized: () => sessionStore.getState().clear(),
});
