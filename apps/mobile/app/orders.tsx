import { OrdersScreen } from "../src/features/orders/OrdersScreen";
import { Screen } from "../src/platform/Screen";

export default function OrdersRoute() {
  return (
    <Screen>
      <OrdersScreen />
    </Screen>
  );
}
