/// <reference types="expo/types" />

declare namespace NodeJS {
  interface ProcessEnv {
    /** Public: embedded in the app bundle. Never put secrets in EXPO_PUBLIC_* variables. */
    readonly EXPO_PUBLIC_API_URL?: string;
  }
}
