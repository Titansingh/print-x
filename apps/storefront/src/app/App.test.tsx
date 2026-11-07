import { QueryClient } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";

import { CustomizationForm } from "../features/customization/CustomizationForm";
import { AppProviders } from "./providers/AppProviders";
import { routes } from "./routes";

function renderAt(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
}

describe("storefront smoke", () => {
  it("renders the shell and catalog page with shared UI components", async () => {
    renderAt("/");
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Gifts made for them" })).toBeInTheDocument();
    // Without demo data the catalog boundary reports the pending backend contract.
    expect(await screen.findByText(/backend contract pending/i)).toBeInTheDocument();
  });

  it("renders the cart empty state", () => {
    renderAt("/cart");
    expect(screen.getByRole("heading", { name: "Your cart is empty" })).toBeInTheDocument();
  });

  it("validates personalization text with the shared Zod schema", () => {
    let submitted: string | undefined;
    render(
      <AppProviders>
        <CustomizationForm onSubmit={(values) => (submitted = values.personalizationText)} />
      </AppProviders>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Save personalization" }));
    expect(screen.getByText("Enter the text to print")).toBeInTheDocument();
    expect(submitted).toBeUndefined();

    fireEvent.change(screen.getByLabelText("Text to print"), {
      target: { value: "  Happy 30th  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save personalization" }));
    expect(submitted).toBe("Happy 30th");
  });
});
