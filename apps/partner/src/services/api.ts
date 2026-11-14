import { createApiClient } from "@platform/api-client";

import { appConfig } from "../app/config";
import { sessionStore } from "./session";

/**
 * Partner API client. Cookie credentials support backend-managed, HTTP-only
 * sessions. A 401 clears the local session so the auth boundary redirects.
 * Authorization is enforced by the backend on every request.
 */
export const apiClient = createApiClient({
  baseUrl: appConfig.apiUrl,
  withCredentials: true,
  onUnauthorized: () => sessionStore.getState().clear(),
});
