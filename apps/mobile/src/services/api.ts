import { createApiClient } from "@platform/api-client";

import { appConfig } from "./config";
import { sessionStore, tokenStore } from "./session";

/** Mobile API client: bearer token from secure storage, no cookies. */
export const apiClient = createApiClient({
  baseUrl: appConfig.apiUrl,
  getAccessToken: () => tokenStore.getAccessToken(),
  onUnauthorized: () => {
    void tokenStore.clear();
    sessionStore.getState().clear();
  },
});
