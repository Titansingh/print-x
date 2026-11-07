import { useQuery } from "@tanstack/react-query";

import { getCatalogSource } from "../../services/catalog-source";

export const catalogKeys = {
  all: ["catalog"] as const,
  featured: () => [...catalogKeys.all, "featured"] as const,
  product: (id: string) => [...catalogKeys.all, "product", id] as const,
};

export function useFeaturedProducts() {
  return useQuery({
    queryKey: catalogKeys.featured(),
    queryFn: async () => (await getCatalogSource()).listFeatured(),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: catalogKeys.product(id),
    queryFn: async () => (await getCatalogSource()).getProduct(id),
  });
}
