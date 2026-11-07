import type { SecureStorage } from "@platform/auth-native";
import * as SecureStore from "expo-secure-store";

/**
 * Credentials live in the platform keystore (iOS Keychain / Android
 * Keystore-backed storage) via Expo SecureStore. Never use AsyncStorage for
 * tokens or other long-lived credentials.
 */
export const secureStorage: SecureStorage = {
  getItemAsync: (key) => SecureStore.getItemAsync(key),
  setItemAsync: (key, value) =>
    SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    }),
  deleteItemAsync: (key) => SecureStore.deleteItemAsync(key),
};
