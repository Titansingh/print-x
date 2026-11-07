import { QueryClient } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react-native";

import { AppProviders } from "../providers/AppProviders";
import { CatalogScreen } from "../features/catalog/CatalogScreen";
import { OrdersScreen } from "../features/orders/OrdersScreen";
import { ProductDetailsScreen } from "../features/product-details/ProductDetailsScreen";

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const queryClients: QueryClient[] = [];

afterEach(() => {
  queryClients.splice(0).forEach((client) => client.clear());
});

function renderWithProviders(ui: React.ReactElement) {
  // gcTime: Infinity schedules no garbage-collection timers, so Jest exits cleanly.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  queryClients.push(queryClient);
  return render(
    <AppProviders queryClient={queryClient} initialMetrics={initialMetrics}>
      {ui}
    </AppProviders>,
  );
}

describe("mobile smoke", () => {
  // React Native Testing Library 14: `render` is async (React 19 concurrent rendering).
  it("renders the catalog screen with shared UI components", async () => {
    await renderWithProviders(<CatalogScreen onOpenProduct={() => {}} onOpenOrders={() => {}} />);
    expect(screen.getByText("Gifts made for them")).toBeTruthy();
    expect(await screen.findByText(/backend contract pending/i)).toBeTruthy();
    expect(screen.getByText("Your orders")).toBeTruthy();
  });

  it("renders the orders screen signed out", async () => {
    await renderWithProviders(<OrdersScreen />);
    expect(screen.getByText("Sign in to see your orders")).toBeTruthy();
  });

  it("renders the native 3D viewer placeholder", async () => {
    await renderWithProviders(<ProductDetailsScreen productId="p1" />);
    expect(screen.getByTestId("native-model-viewer-placeholder")).toBeTruthy();
  });
});
