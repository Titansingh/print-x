/**
 * The only place the mobile app reads environment variables. Expo inlines
 * EXPO_PUBLIC_* at build time; they are public. Shared packages receive these
 * values as arguments and never read env vars themselves.
 *
 * On a physical device `localhost` refers to the phone. Use the development
 * machine's LAN address or a tunnel (see docs/integration/environment.md).
 */
export type AppVariant = "customer" | "partner";

function readVariant(value: string | undefined): AppVariant {
  return value === "partner" ? "partner" : "customer";
}

export const appConfig = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080",
  /** Which flavour of the app this build is (customer or print partner). */
  variant: readVariant(process.env.EXPO_PUBLIC_APP_VARIANT),
} as const;
