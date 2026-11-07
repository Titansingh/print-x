import type { AuthAdapter, AuthSession } from "@platform/auth-core";

/**
 * Browser auth adapter for backend-managed, HTTP-only cookie sessions.
 *
 * - The browser never sees or stores credentials; the backend sets the
 *   session cookie (HttpOnly, Secure, SameSite) on its own sign-in flow.
 * - Do NOT store tokens in localStorage/sessionStorage.
 * - Pair with `createApiClient({ withCredentials: true })` and backend CORS
 *   that allows credentials from the web app origin. Use CSRF protection as
 *   specified by the backend.
 *
 * The concrete session and logout calls are injected by the app because the
 * backend endpoints are not defined yet.
 */
export interface CookieSessionAdapterOptions {
  /** Fetch the current session (e.g. GET a "me"/session endpoint). Return null on 401. */
  fetchSession: () => Promise<AuthSession | null>;
  /** Invalidate the session server-side (e.g. POST a logout endpoint). */
  endSession: () => Promise<void>;
}

export function createCookieSessionAdapter({
  fetchSession,
  endSession,
}: CookieSessionAdapterOptions): AuthAdapter {
  return {
    getSession: fetchSession,
    signOut: endSession,
  };
}
