import type { AuthAdapter, AuthSession } from "@platform/auth-core";

import type { SecureTokenStore } from "./secure-token-store";

/**
 * Native auth adapter backed by tokens in secure storage. The concrete
 * session lookup and server-side revocation are injected by the app because
 * the identity provider and backend endpoints are not decided yet.
 */
export interface TokenAuthAdapterOptions {
  tokenStore: SecureTokenStore;
  /** Resolve the session for an access token (e.g. GET a "me" endpoint). Return null if invalid. */
  fetchSession: (accessToken: string) => Promise<AuthSession | null>;
  /** Optional server-side revocation on sign-out. */
  revoke?: (accessToken: string) => Promise<void>;
}

export function createTokenAuthAdapter({
  tokenStore,
  fetchSession,
  revoke,
}: TokenAuthAdapterOptions): AuthAdapter {
  return {
    async getSession() {
      const accessToken = await tokenStore.getAccessToken();
      if (!accessToken) return null;
      const session = await fetchSession(accessToken);
      if (!session) await tokenStore.clear();
      return session;
    },
    async signOut() {
      const accessToken = await tokenStore.getAccessToken();
      try {
        if (accessToken && revoke) await revoke(accessToken);
      } finally {
        await tokenStore.clear();
      }
    },
  };
}
