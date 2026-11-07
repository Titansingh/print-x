import { useLocalSearchParams } from "expo-router";

import { ProductDetailsScreen } from "../../src/features/product-details/ProductDetailsScreen";
import { Screen } from "../../src/platform/Screen";

export default function ProductRoute() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  return (
    <Screen>
      <ProductDetailsScreen productId={productId ?? ""} />
    </Screen>
  );
}
