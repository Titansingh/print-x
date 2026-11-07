import type { Money } from "@platform/domain";
import { useQuery } from "@tanstack/react-query";

export interface CatalogProductView {
  id: string;
  title: string;
  price: Money;
  imageUrl?: string;
}

/**
 * INTEGRATION BOUNDARY: the catalog API contract is not published yet.
 * Implement with `apiClient` once `@platform/api-types` is generated.
 */
async function listFeatured(): Promise<CatalogProductView[]> {
  throw new Error("The catalog API is not available yet (backend contract pending).");
}

export function useFeaturedProducts() {
  return useQuery({ queryKey: ["catalog", "featured"], queryFn: listFeatured, retry: false });
}
