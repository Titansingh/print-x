import { NativeModelViewer } from "@platform/3d-viewer-native";
import { BodyText, Heading } from "@platform/ui";
import { YStack } from "tamagui";

export interface ProductDetailsScreenProps {
  productId: string;
}

/**
 * Product details (catalog API pending). Photo selection for personalized
 * products will use a native picker adapter (expo-image-picker) once the
 * uploads contract exists.
 */
export function ProductDetailsScreen({ productId }: ProductDetailsScreenProps) {
  return (
    <YStack flex={1} gap="4" p="4">
      <Heading level={1}>Product</Heading>
      <BodyText tone="muted">
        Product {productId} details load once the catalog API is connected.
      </BodyText>
      <NativeModelViewer source={null} accessibilityLabel="3D preview" />
    </YStack>
  );
}
