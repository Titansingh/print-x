import {
  BodyText,
  EmptyState,
  ErrorState,
  Heading,
  LoadingState,
  PageContainer,
  ProductCard,
  ProductGrid,
  ProductGridItem,
} from "@platform/ui";
import { useNavigate } from "react-router";

import { useFeaturedProducts } from "./queries";
import { productKindBadge } from "./types";

export function CatalogPage() {
  const navigate = useNavigate();
  const { data, isPending, isError, error, refetch } = useFeaturedProducts();

  return (
    <PageContainer>
      <Heading level={1}>Gifts made for them</Heading>
      <BodyText tone="muted">
        Ready-made gifts, personalized designs and on-demand 3D printing in your city.
      </BodyText>

      {isPending ? (
        <LoadingState label="Loading products" />
      ) : isError ? (
        <ErrorState title="Products are unavailable" message={error.message} onRetry={refetch} />
      ) : data.length === 0 ? (
        <EmptyState title="No products yet" description="Check back soon." />
      ) : (
        <ProductGrid>
          {data.map((product) => {
            const badge = productKindBadge[product.kind];
            return (
              <ProductGridItem key={product.id}>
                <ProductCard
                  title={product.title}
                  price={product.price}
                  priceIsStartingFrom={product.priceIsStartingFrom}
                  imageUrl={product.imageUrl}
                  badge={badge ? { label: badge, tone: "info" } : undefined}
                  onPress={() => navigate(`/products/${encodeURIComponent(product.id)}`)}
                />
              </ProductGridItem>
            );
          })}
        </ProductGrid>
      )}
    </PageContainer>
  );
}
