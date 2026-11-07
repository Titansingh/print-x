import type { RouteObject } from "react-router";

import { ModelGenerationPage } from "../features/ai-model-generation/ModelGenerationPage";
import { CartPage } from "../features/cart/CartPage";
import { CatalogPage } from "../features/catalog/CatalogPage";
import { CheckoutPage } from "../features/checkout/CheckoutPage";
import { OrdersPage } from "../features/orders/OrdersPage";
import { ProductDetailsPage } from "../features/product-details/ProductDetailsPage";
import { NotFoundPage } from "./layout/NotFoundPage";
import { StorefrontLayout } from "./layout/StorefrontLayout";

export const routes: RouteObject[] = [
  {
    element: <StorefrontLayout />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: "products/:productId", element: <ProductDetailsPage /> },
      { path: "models", element: <ModelGenerationPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
