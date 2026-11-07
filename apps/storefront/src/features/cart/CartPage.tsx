import { EmptyState, Heading, PageContainer } from "@platform/ui";
import { useNavigate } from "react-router";

/** Cart contents and pricing are backend-owned; wired once the cart API exists. */
export function CartPage() {
  const navigate = useNavigate();
  return (
    <PageContainer>
      <Heading level={1}>Cart</Heading>
      <EmptyState
        title="Your cart is empty"
        description="Browse gifts and add something special."
        actionLabel="Browse gifts"
        onAction={() => navigate("/")}
      />
    </PageContainer>
  );
}
