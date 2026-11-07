import type { Money } from "@platform/domain";

/** Frontend view model for catalog listings (mapped from API types once available). */
export interface CatalogProductView {
  id: string;
  title: string;
  price: Money;
  compareAt?: Money;
  imageUrl?: string;
  kind: "standard" | "customizable" | "ai-personalized";
  priceIsStartingFrom?: boolean;
}

export interface CatalogSource {
  listFeatured(): Promise<CatalogProductView[]>;
  getProduct(id: string): Promise<CatalogProductView | null>;
}

export const productKindBadge: Record<CatalogProductView["kind"], string | undefined> = {
  standard: undefined,
  customizable: "Customizable",
  "ai-personalized": "Made from your photos",
};
