import { z } from "zod";

/**
 * The only place the storefront reads build-time environment variables.
 * Shared packages receive these values as arguments.
 */
const envSchema = z.object({
  VITE_API_URL: z.url().default("http://localhost:8080"),
  VITE_USE_DEMO_DATA: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
});

const env = envSchema.parse(import.meta.env);

export const appConfig = {
  apiUrl: env.VITE_API_URL,
  /** Demo data is development-only and never enabled in production builds. */
  useDemoData: env.VITE_USE_DEMO_DATA && import.meta.env.DEV,
} as const;
