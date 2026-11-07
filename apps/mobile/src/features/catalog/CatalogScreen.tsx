import {
  BodyText,
  Button,
  EmptyState,
  ErrorState,
  Heading,
  LoadingState,
  ProductCard,
} from "@platform/ui";
import { YStack } from "tamagui";

import { useFeaturedProducts } from "./catalog-source";

export interface CatalogScreenProps {
  onOpenProduct: (productId: string) => void;
  onOpenOrders: () => void;
}

export function CatalogScreen({ onOpenProduct, onOpenOrders }: CatalogScreenProps) {
  const { data, isPending, isError, error, refetch } = useFeaturedProducts();

  return (
    <YStack flex={1} gap="4" p="4">
      <Heading level={1}>Gifts made for them</Heading>
      <BodyText tone="muted">
        Ready-made gifts, personalized designs and on-demand 3D printing in your city.
      </BodyText>

      {isPending ? (
        <LoadingState label="Loading products" />
      ) : isError ? (
        <ErrorState
          title="Products are unavailable"
          message={error.message}
          onRetry={() => void refetch()}
        />
      ) : data.length === 0 ? (
        <EmptyState title="No products yet" description="Check back soon." />
      ) : (
        <YStack gap="4">
          {data.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              imageUrl={product.imageUrl}
              onPress={() => onOpenProduct(product.id)}
            />
          ))}
        </YStack>
      )}

      <Button variant="outlined" onPress={onOpenOrders}>
        Your orders
      </Button>
    </YStack>
  );
}
