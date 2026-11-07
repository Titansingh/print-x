import {
  BodyText,
  EmptyState,
  ErrorState,
  Heading,
  LoadingState,
  PageContainer,
  PriceDisplay,
  StatusBadge,
} from "@platform/ui";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { XStack, YStack } from "tamagui";

import { ModelPreview } from "../3d-preview/ModelPreview";
import { useProduct } from "../catalog/queries";
import { productKindBadge } from "../catalog/types";
import { CustomizationForm } from "../customization/CustomizationForm";

export function ProductDetailsPage() {
  const { productId = "" } = useParams();
  const navigate = useNavigate();
  const { data: product, isPending, isError, error, refetch } = useProduct(productId);
  const [savedText, setSavedText] = useState<string>();

  if (isPending) return <LoadingState label="Loading product" />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        actionLabel="Back to catalog"
        onAction={() => navigate("/")}
      />
    );
  }

  const badge = productKindBadge[product.kind];

  return (
    <PageContainer>
      <XStack flexWrap="wrap" gap="8">
        <YStack flex={1} minW={280}>
          {/* Preview assets come from backend-managed storage (signed URLs). */}
          <ModelPreview source={null} productName={product.title} />
        </YStack>
        <YStack flex={1} minW={280} gap="4">
          {badge ? <StatusBadge label={badge} tone="info" /> : null}
          <Heading level={1}>{product.title}</Heading>
          <PriceDisplay
            price={product.price}
            compareAt={product.compareAt}
            prefix={product.priceIsStartingFrom ? "From" : undefined}
            size="lg"
          />
          {product.kind === "standard" ? (
            <BodyText tone="muted">Ready-made gift, printed and quality-checked locally.</BodyText>
          ) : (
            <CustomizationForm
              onSubmit={({ personalizationText }) => setSavedText(personalizationText)}
            />
          )}
          {savedText ? (
            <BodyText tone="success" role="status">
              Saved “{savedText}”. Adding to cart is available once checkout is connected.
            </BodyText>
          ) : null}
        </YStack>
      </XStack>
    </PageContainer>
  );
}
