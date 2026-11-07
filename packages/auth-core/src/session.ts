import type { Permission } from "./permissions";
import type { RoleId } from "./roles";

/**
 * Frontend session view model. Map the backend's session/me response into
 * this shape inside the platform adapter; do not treat it as the API contract.
 * Never place credentials or tokens on this object.
 */
export interface AuthSession {
  user: {
    id: string;
    displayName: string;
    email?: string;
  };
  roles: readonly RoleId[];
  permissions: readonly Permission[];
  /** Partner organization scope for partner roles, if any. */
  partnerId?: string;
}

/**
 * Platform adapter that connects the session store to a real auth mechanism
 * (cookie session on web, secure token storage on native). No identity
 * provider has been selected yet.
 */
export interface AuthAdapter {
  /** Resolves the current session, or `null` when signed out. */
  getSession(): Promise<AuthSession | null>;
  /** Ends the session (backend logout and/or local credential removal). */
  signOut(): Promise<void>;
}

/**
 * Adapter used until an auth provider/backend contract exists: always
 * signed out. Keeps apps runnable without inventing an identity provider.
 */
export function createUnconfiguredAuthAdapter(): AuthAdapter {
  return {
    getSession: async () => null,
    signOut: async () => undefined,
  };
}
