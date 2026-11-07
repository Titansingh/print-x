import { EmptyState, Heading } from "@platform/ui";
import { YStack } from "tamagui";
import { useStore } from "zustand";

import { sessionStore } from "../../services/session";

/** Order history and pickup/delivery tracking (orders API pending). */
export function OrdersScreen() {
  const status = useStore(sessionStore, (state) => state.status);
  return (
    <YStack flex={1} gap="4" p="4">
      <Heading level={1}>Your orders</Heading>
      {status === "authenticated" ? (
        <EmptyState title="No orders yet" description="Orders and tracking updates appear here." />
      ) : (
        <EmptyState
          title="Sign in to see your orders"
          description="Customer sign-in becomes available once authentication is connected."
        />
      )}
    </YStack>
  );
}
