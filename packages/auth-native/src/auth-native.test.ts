import type { AuthSession } from "@platform/auth-core";
import { describe, expect, it, vi } from "vitest";

import { createSecureTokenStore, createTokenAuthAdapter, type SecureStorage } from "./index";

function memoryStorage(initial: Record<string, string> = {}): SecureStorage & {
  data: Map<string, string>;
} {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItemAsync: async (key) => data.get(key) ?? null,
    setItemAsync: async (key, value) => {
      data.set(key, value);
    },
    deleteItemAsync: async (key) => {
      data.delete(key);
    },
  };
}

const session: AuthSession = {
  user: { id: "c1", displayName: "Customer" },
  roles: [],
  permissions: [],
};

describe("createSecureTokenStore", () => {
  it("round-trips tokens", async () => {
    const store = createSecureTokenStore(memoryStorage());
    await store.setTokens({ accessToken: "a1", refreshToken: "r1" });
    expect(await store.getTokens()).toEqual({ accessToken: "a1", refreshToken: "r1" });
    await store.clear();
    expect(await store.getAccessToken()).toBeNull();
  });

  it("discards corrupt entries", async () => {
    const storage = memoryStorage({ "platform.auth.tokens": "{not json" });
    const store = createSecureTokenStore(storage);
    expect(await store.getTokens()).toBeNull();
    expect(storage.data.size).toBe(0);
  });
});

describe("createTokenAuthAdapter", () => {
  it("returns null without calling the backend when no token is stored", async () => {
    const fetchSession = vi.fn();
    const adapter = createTokenAuthAdapter({
      tokenStore: createSecureTokenStore(memoryStorage()),
      fetchSession,
    });
    expect(await adapter.getSession()).toBeNull();
    expect(fetchSession).not.toHaveBeenCalled();
  });

  it("resolves the session for a stored token and clears it on sign-out", async () => {
    const tokenStore = createSecureTokenStore(memoryStorage());
    await tokenStore.setTokens({ accessToken: "a1" });
    const revoke = vi.fn().mockResolvedValue(undefined);
    const adapter = createTokenAuthAdapter({
      tokenStore,
      fetchSession: async (token) => (token === "a1" ? session : null),
      revoke,
    });

    expect(await adapter.getSession()).toEqual(session);
    await adapter.signOut();
    expect(revoke).toHaveBeenCalledWith("a1");
    expect(await tokenStore.getAccessToken()).toBeNull();
  });

  it("clears tokens the backend rejects", async () => {
    const tokenStore = createSecureTokenStore(memoryStorage());
    await tokenStore.setTokens({ accessToken: "expired" });
    const adapter = createTokenAuthAdapter({ tokenStore, fetchSession: async () => null });
    expect(await adapter.getSession()).toBeNull();
    expect(await tokenStore.getAccessToken()).toBeNull();
  });
});
