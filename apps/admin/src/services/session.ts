import {
  createSessionStore,
  createUnconfiguredAuthAdapter,
  type AuthAdapter,
} from "@platform/auth-core";

import { appConfig } from "../app/config";

/**
 * INTEGRATION BOUNDARY: no identity provider or session endpoint exists yet.
 *
 * - Production: the unconfigured adapter (always signed out) until the
 *   backend publishes its auth contract. Then use `createCookieSessionAdapter`
 *   from @platform/auth-web with the backend's session/logout endpoints.
 * - Development: VITE_USE_DEMO_AUTH=true loads an isolated demo session.
 */
async function resolveAdapter(): Promise<AuthAdapter> {
  // `import.meta.env.DEV` first so production builds drop the demo chunk entirely.
  if (import.meta.env.DEV && appConfig.useDemoAuth) {
    const { createDemoAuthAdapter, createDemoSession } = await import("@platform/auth-core/demo");
    return createDemoAuthAdapter(createDemoSession(appConfig.demoRole));
  }
  return createUnconfiguredAuthAdapter();
}

const adapterPromise = resolveAdapter();

const lazyAdapter: AuthAdapter = {
  getSession: async () => (await adapterPromise).getSession(),
  signOut: async () => (await adapterPromise).signOut(),
};

export const sessionStore = createSessionStore(lazyAdapter);
