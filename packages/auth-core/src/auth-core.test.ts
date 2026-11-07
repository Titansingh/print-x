import { describe, expect, it, vi } from "vitest";

import { createDemoAuthAdapter, createDemoSession } from "./demo";
import {
  canAccess,
  createSessionStore,
  createUnconfiguredAuthAdapter,
  hasPermission,
} from "./index";

describe("canAccess", () => {
  const session = createDemoSession("operations_staff");

  it("denies when signed out", () => {
    expect(canAccess(null, undefined)).toBe(false);
  });

  it("allows when there is no requirement", () => {
    expect(canAccess(session, undefined)).toBe(true);
  });

  it("checks allOf and anyOf permission requirements", () => {
    expect(canAccess(session, { allOf: ["orders.read", "print_jobs.read"] })).toBe(true);
    expect(canAccess(session, { allOf: ["orders.read", "orders.assign"] })).toBe(false);
    expect(canAccess(session, { anyOf: ["orders.assign", "print_jobs.update"] })).toBe(true);
    expect(canAccess(session, { anyOf: ["partners.manage"] })).toBe(false);
  });

  it("checks individual permissions", () => {
    expect(hasPermission(session, "print_jobs.update")).toBe(true);
    expect(hasPermission(session, "partners.approve")).toBe(false);
  });
});

describe("createSessionStore", () => {
  it("loads an authenticated session and signs out", async () => {
    const store = createSessionStore(createDemoAuthAdapter(createDemoSession("super_admin")));
    await store.getState().refresh();
    expect(store.getState().status).toBe("authenticated");

    await store.getState().signOut();
    expect(store.getState().status).toBe("unauthenticated");
    expect(store.getState().session).toBeNull();
  });

  it("is unauthenticated with the unconfigured adapter", async () => {
    const store = createSessionStore(createUnconfiguredAuthAdapter());
    await store.getState().refresh();
    expect(store.getState().status).toBe("unauthenticated");
  });

  it("captures adapter errors and deduplicates concurrent refreshes", async () => {
    const getSession = vi.fn().mockRejectedValue(new Error("network down"));
    const store = createSessionStore({ getSession, signOut: async () => undefined });

    await Promise.all([store.getState().refresh(), store.getState().refresh()]);
    expect(getSession).toHaveBeenCalledOnce();
    expect(store.getState().status).toBe("error");
    expect(store.getState().error?.message).toBe("network down");
  });
});
