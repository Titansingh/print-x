import type { CatalogSource } from "../features/catalog/types";
import { appConfig } from "../app/config";

/**
 * INTEGRATION BOUNDARY for catalog data.
 *
 * The backend catalog contract is not published yet, so there is no API
 * implementation. Once `@platform/api-types` is generated, implement
 * `CatalogSource` with `apiClient` here and map responses to view models.
 * Demo data lives in `src/mocks` and is only used in development when
 * VITE_USE_DEMO_DATA=true.
 */
const pendingContractSource: CatalogSource = {
  listFeatured: () =>
    Promise.reject(new Error("The catalog API is not available yet (backend contract pending).")),
  getProduct: () =>
    Promise.reject(new Error("The catalog API is not available yet (backend contract pending).")),
};

export async function getCatalogSource(): Promise<CatalogSource> {
  // `import.meta.env.DEV` first so production builds drop the demo chunk entirely.
  if (import.meta.env.DEV && appConfig.useDemoData) {
    const { demoCatalogSource } = await import("../mocks/demo-catalog");
    return demoCatalogSource;
  }
  return pendingContractSource;
}
