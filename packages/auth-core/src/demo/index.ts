/**
 * DEMO / DEVELOPMENT ONLY. Not imported by production code paths.
 *
 * Provides fake sessions so the admin shell and permission-aware navigation
 * can be exercised before a backend and identity provider exist. Selected
 * explicitly by apps (e.g. VITE_USE_DEMO_AUTH=true in development) and by tests.
 */
import { permissions, type Permission } from "../permissions";
import type { RoleId } from "../roles";
import type { AuthAdapter, AuthSession } from "../session";

const demoPermissionsByRole: Record<RoleId, readonly Permission[]> = {
  super_admin: permissions,
  platform_admin: [
    "users.manage",
    "products.read",
    "products.create",
    "products.update",
    "pricing.manage",
    "partners.read",
    "partners.approve",
    "partners.manage",
    "settings.manage",
    "orders.read",
  ],
  operations_manager: [
    "orders.read",
    "orders.assign",
    "orders.cancel",
    "models.review",
    "print_jobs.read",
    "print_jobs.update",
    "quality_control.inspect",
    "fulfillment.manage",
    "partners.read",
  ],
  operations_staff: ["orders.read", "print_jobs.read", "print_jobs.update"],
  partner_admin: ["printers.manage", "print_jobs.read", "print_jobs.update"],
  partner_staff: ["print_jobs.read", "print_jobs.update", "print_jobs.complete"],
};

export function createDemoSession(role: RoleId): AuthSession {
  return {
    user: { id: `demo-${role}`, displayName: `Demo ${role.replace(/_/g, " ")}` },
    roles: [role],
    permissions: demoPermissionsByRole[role],
    ...(role.startsWith("partner_") ? { partnerId: "demo-partner" } : {}),
  };
}

export function createDemoAuthAdapter(initial: AuthSession | null): AuthAdapter {
  let current = initial;
  return {
    getSession: async () => current,
    signOut: async () => {
      current = null;
    },
  };
}
