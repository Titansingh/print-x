/**
 * The only place the mobile app reads environment variables. Expo inlines
 * EXPO_PUBLIC_* at build time; they are public. Shared packages receive these
 * values as arguments and never read env vars themselves.
 *
 * On a physical device `localhost` refers to the phone. Use the development
 * machine's LAN address or a tunnel (see docs/integration/environment.md).
 */
export const appConfig = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080",
} as const;
