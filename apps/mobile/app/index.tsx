import { useRouter } from "expo-router";

import { CatalogScreen } from "../src/features/catalog/CatalogScreen";
import { Screen } from "../src/platform/Screen";

export default function HomeRoute() {
  const router = useRouter();
  return (
    <Screen>
      <CatalogScreen
        onOpenProduct={(productId) =>
          router.push({ pathname: "/products/[productId]", params: { productId } })
        }
        onOpenOrders={() => router.push("/orders")}
      />
    </Screen>
  );
}
