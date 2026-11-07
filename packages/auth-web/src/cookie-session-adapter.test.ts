import { createSessionStore, type AuthSession } from "@platform/auth-core";
import { describe, expect, it, vi } from "vitest";

import { createCookieSessionAdapter } from "./index";

const session: AuthSession = {
  user: { id: "u1", displayName: "Test User" },
  roles: ["operations_staff"],
  permissions: ["orders.read"],
};

describe("createCookieSessionAdapter", () => {
  it("delegates session lookup and logout to injected backend calls", async () => {
    const fetchSession = vi.fn().mockResolvedValue(session);
    const endSession = vi.fn().mockResolvedValue(undefined);
    const store = createSessionStore(createCookieSessionAdapter({ fetchSession, endSession }));

    await store.getState().refresh();
    expect(store.getState().session).toEqual(session);

    await store.getState().signOut();
    expect(endSession).toHaveBeenCalledOnce();
    expect(store.getState().status).toBe("unauthenticated");
  });
});
