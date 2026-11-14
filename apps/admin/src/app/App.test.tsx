import { createDemoSession } from "@platform/auth-core/demo";
import type { RoleId } from "@platform/auth-core";
import { QueryClient } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
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

describe("admin smoke", () => {
  it("redirects to sign-in when there is no session", async () => {
    renderAt("/");
    expect(await screen.findByRole("heading", { name: "Sign in" })).toBeInTheDocument();
  });

  it("renders the shell and dashboard for an authenticated user", () => {
    signInAs("super_admin");
    renderAt("/");
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    const nav = screen.getByRole("navigation", { name: "Admin navigation" });
    expect(within(nav).getByRole("link", { name: "Settings & roles" })).toBeInTheDocument();
  });

  it("shows only navigation permitted by the session's permissions", () => {
    signInAs("operations_staff");
    renderAt("/");
    const nav = screen.getByRole("navigation", { name: "Admin navigation" });
    expect(within(nav).getByRole("link", { name: "Print jobs" })).toBeInTheDocument();
    expect(within(nav).queryByRole("link", { name: "Users" })).not.toBeInTheDocument();
    expect(within(nav).queryByRole("link", { name: "Settings & roles" })).not.toBeInTheDocument();
  });

  it("sends partner-scoped sessions to the partner portal", () => {
    signInAs("partner_admin");
    renderAt("/printers");
    expect(screen.getByRole("heading", { name: "Use the partner portal" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Admin navigation" })).not.toBeInTheDocument();
  });

  it("redirects to forbidden when a route's permission is missing", async () => {
    signInAs("operations_staff");
    renderAt("/users");
    expect(
      await screen.findByRole("heading", { name: "You don't have access to this page" }),
    ).toBeInTheDocument();
  });

  it("renders the orders list conventions with an empty state", async () => {
    signInAs("operations_manager");
    renderAt("/orders");
    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "No orders to show" })).toBeInTheDocument();
  });

  it("validates settings with Zod", () => {
    signInAs("platform_admin");
    renderAt("/settings");
    fireEvent.click(screen.getByRole("button", { name: "Validate" }));
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
  });
});
