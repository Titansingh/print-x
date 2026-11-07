import { createSessionStore, createUnconfiguredAuthAdapter } from "@platform/auth-core";

/**
 * INTEGRATION BOUNDARY: no identity provider or session endpoint exists yet,
 * so customers are always signed out. When the backend publishes its auth
 * contract, replace the adapter with:
 *
 *   createCookieSessionAdapter({
 *     fetchSession: () => apiClient.get("<session endpoint>").then(mapSession),
 *     endSession: () => apiClient.post("<logout endpoint>"),
 *   })
 */
export const sessionStore = createSessionStore(createUnconfiguredAuthAdapter());
