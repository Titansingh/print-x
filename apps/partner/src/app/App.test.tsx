import { createDemoSession } from "@platform/auth-core/demo";
import type { RoleId } from "@platform/auth-core";
import { QueryClient } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { sessionStore } from "../services/session";
import { AppProviders } from "./providers/AppProviders";
import { routes } from "./router/routes";

function signInAs(role: RoleId) {
  sessionStore.setState({ status: "authenticated", session: createDemoSession(role), error: null });
}

function renderAt(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return router;
}

afterEach(() => {
  sessionStore.setState({ status: "idle", session: null, error: null });
});

describe("partner smoke", () => {
  it("redirects to sign-in when there is no session", async () => {
    renderAt("/");
    expect(await screen.findByRole("heading", { name: "Sign in" })).toBeInTheDocument();
  });

  it("shows partner navigation for a partner admin", () => {
    signInAs("partner_admin");
    renderAt("/");
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    const nav = screen.getByRole("navigation", { name: "Partner navigation" });
    expect(within(nav).getByRole("link", { name: "Print jobs" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "Printers & materials" })).toBeInTheDocument();
  });

  it("hides items the session's permissions do not allow", () => {
    signInAs("partner_staff");
    renderAt("/");
    const nav = screen.getByRole("navigation", { name: "Partner navigation" });
    expect(within(nav).getByRole("link", { name: "Print jobs" })).toBeInTheDocument();
    expect(
      within(nav).queryByRole("link", { name: "Printers & materials" }),
    ).not.toBeInTheDocument();
  });

  it("redirects to forbidden when a route's permission is missing", async () => {
    signInAs("partner_staff");
    renderAt("/printers");
    expect(
      await screen.findByRole("heading", { name: "You don't have access to this page" }),
    ).toBeInTheDocument();
  });
});
