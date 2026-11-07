/**
 * DEMO DATA, development only. Not a backend contract and not imported by
 * production code paths (loaded dynamically when VITE_USE_DEMO_DATA=true in
 * development). Delete once the catalog API is integrated.
 */
import type { CatalogProductView, CatalogSource } from "../features/catalog/types";

const demoProducts: CatalogProductView[] = [
  {
    id: "demo-wobble-head",
    title: "Custom wobble-head from your photos",
    price: { amountMinor: 249_900, currency: "INR" },
    kind: "ai-personalized",
    priceIsStartingFrom: true,
  },
  {
    id: "demo-name-lamp",
    title: "Personalized name lamp",
    price: { amountMinor: 149_900, currency: "INR" },
    kind: "customizable",
    priceIsStartingFrom: true,
  },
  {
    id: "demo-planter",
    title: "Geometric desk planter",
    price: { amountMinor: 79_900, currency: "INR" },
    compareAt: { amountMinor: 99_900, currency: "INR" },
    kind: "standard",
  },
  {
    id: "demo-keychain",
    title: "City skyline keychain",
    price: { amountMinor: 29_900, currency: "INR" },
    kind: "standard",
  },
];

export const demoCatalogSource: CatalogSource = {
  listFeatured: async () => demoProducts,
  getProduct: async (id) => demoProducts.find((product) => product.id === id) ?? null,
};
