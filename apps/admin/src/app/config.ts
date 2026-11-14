import type { RoleId } from "@platform/auth-core";
import { z } from "zod";

/** Platform staff roles. Partner roles use apps/partner. */
const staffRoles = [
  "super_admin",
  "platform_admin",
  "operations_manager",
  "operations_staff",
] as const satisfies readonly RoleId[];

/** The only place the admin reads build-time environment variables. */
const envSchema = z.object({
  VITE_API_URL: z.url().default("http://localhost:8080"),
  VITE_USE_DEMO_AUTH: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  VITE_DEMO_ROLE: z.enum(staffRoles).default("super_admin"),
});

const env = envSchema.parse(import.meta.env);

export const appConfig = {
  apiUrl: env.VITE_API_URL,
  /** Demo auth is development-only and never enabled in production builds. */
  useDemoAuth: env.VITE_USE_DEMO_AUTH && import.meta.env.DEV,
  demoRole: env.VITE_DEMO_ROLE,
} as const;
