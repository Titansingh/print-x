import type { Permission } from "./permissions";
import type { AuthSession } from "./session";

/**
 * Declarative access requirement for routes and navigation items.
 * UX only: the backend must enforce the same rules.
 */
export interface AccessRequirement {
  /** Every listed permission is required. */
  allOf?: readonly Permission[];
  /** At least one listed permission is required. */
  anyOf?: readonly Permission[];
}

export function hasPermission(session: AuthSession | null, permission: Permission): boolean {
  return session?.permissions.includes(permission) ?? false;
}

export function canAccess(
  session: AuthSession | null,
  requirement: AccessRequirement | undefined,
): boolean {
  if (!session) return false;
  if (!requirement) return true;
  const { allOf = [], anyOf = [] } = requirement;
  const allSatisfied = allOf.every((p) => session.permissions.includes(p));
  const anySatisfied = anyOf.length === 0 || anyOf.some((p) => session.permissions.includes(p));
  return allSatisfied && anySatisfied;
}
