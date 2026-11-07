import { createStore, type StoreApi } from "zustand/vanilla";

import type { AuthAdapter, AuthSession } from "./session";

export type SessionStatus = "idle" | "loading" | "authenticated" | "unauthenticated" | "error";

export interface SessionState {
  status: SessionStatus;
  session: AuthSession | null;
  error: Error | null;
  /** Loads the session from the adapter. Safe to call repeatedly. */
  refresh: () => Promise<void>;
  /** Signs out through the adapter and clears local state. */
  signOut: () => Promise<void>;
  /** Clears local state without calling the adapter (e.g. after a 401). */
  clear: () => void;
}

export type SessionStore = StoreApi<SessionState>;

/**
 * Global client-side session state (a valid Zustand use case: shared across
 * the whole app). Framework-agnostic; React apps read it with
 * `useStore(store, selector)` from `zustand`.
 */
export function createSessionStore(adapter: AuthAdapter): SessionStore {
  let inflight: Promise<void> | null = null;

  return createStore<SessionState>()((set) => ({
    status: "idle",
    session: null,
    error: null,

    refresh: () => {
      inflight ??= (async () => {
        set({ status: "loading", error: null });
        try {
          const session = await adapter.getSession();
          set({ session, status: session ? "authenticated" : "unauthenticated" });
        } catch (error) {
          set({
            session: null,
            status: "error",
            error: error instanceof Error ? error : new Error(String(error)),
          });
        } finally {
          inflight = null;
        }
      })();
      return inflight;
    },

    signOut: async () => {
      try {
        await adapter.signOut();
      } finally {
        set({ session: null, status: "unauthenticated", error: null });
      }
    },

    clear: () => set({ session: null, status: "unauthenticated", error: null }),
  }));
}
