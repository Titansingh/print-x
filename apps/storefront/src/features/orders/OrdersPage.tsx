import { EmptyState, Heading, PageContainer } from "@platform/ui";
import { useStore } from "zustand";

import { sessionStore } from "../../services/session";

/** Order history and pickup/delivery tracking (orders API pending). */
export function OrdersPage() {
  const status = useStore(sessionStore, (state) => state.status);

  return (
    <PageContainer>
      <Heading level={1}>Your orders</Heading>
      {status === "authenticated" ? (
        <EmptyState title="No orders yet" description="Orders and tracking updates appear here." />
      ) : (
        <EmptyState
          title="Sign in to see your orders"
          description="Customer sign-in becomes available once authentication is connected."
        />
      )}
    </PageContainer>
  );
}
