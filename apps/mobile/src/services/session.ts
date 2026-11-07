import { createSessionStore, createUnconfiguredAuthAdapter } from "@platform/auth-core";
import { createSecureTokenStore } from "@platform/auth-native";

import { secureStorage } from "../platform/secure-storage";

/** Tokens (when the backend issues them) are kept in secure platform storage. */
export const tokenStore = createSecureTokenStore(secureStorage);

/**
 * INTEGRATION BOUNDARY: no identity provider or session endpoint exists yet,
 * so customers are always signed out. When the backend auth contract exists:
 *
 *   createTokenAuthAdapter({
 *     tokenStore,
 *     fetchSession: (token) => apiClient.get("<me endpoint>").then(mapSession),
 *     revoke: (token) => apiClient.post("<logout endpoint>"),
 *   })
 */
export const sessionStore = createSessionStore(createUnconfiguredAuthAdapter());
