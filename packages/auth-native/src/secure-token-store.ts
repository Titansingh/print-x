/**
 * Minimal secure key-value storage contract. Matches the shape of the
 * `expo-secure-store` module (Keychain on iOS, Keystore-backed storage on
 * Android), which the mobile app injects:
 *
 *   import * as SecureStore from "expo-secure-store";
 *   createSecureTokenStore(SecureStore);
 *
 * Never use AsyncStorage for credentials.
 */
export interface SecureStorage {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
}

export interface StoredTokens {
  accessToken: string;
  /** Only store a refresh token if the backend's auth design requires it. */
  refreshToken?: string;
}

export interface SecureTokenStore {
  getTokens(): Promise<StoredTokens | null>;
  getAccessToken(): Promise<string | null>;
  setTokens(tokens: StoredTokens): Promise<void>;
  clear(): Promise<void>;
}

const DEFAULT_KEY = "platform.auth.tokens";

export function createSecureTokenStore(
  storage: SecureStorage,
  { key = DEFAULT_KEY }: { key?: string } = {},
): SecureTokenStore {
  async function getTokens(): Promise<StoredTokens | null> {
    const raw = await storage.getItemAsync(key);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partial<StoredTokens>;
      if (typeof parsed.accessToken !== "string" || parsed.accessToken.length === 0) {
        await storage.deleteItemAsync(key);
        return null;
      }
      return {
        accessToken: parsed.accessToken,
        ...(typeof parsed.refreshToken === "string" ? { refreshToken: parsed.refreshToken } : {}),
      };
    } catch {
      // Corrupt entry: remove it rather than failing every request.
      await storage.deleteItemAsync(key);
      return null;
    }
  }

  return {
    getTokens,
    getAccessToken: async () => (await getTokens())?.accessToken ?? null,
    setTokens: (tokens) => storage.setItemAsync(key, JSON.stringify(tokens)),
    clear: () => storage.deleteItemAsync(key),
  };
}
