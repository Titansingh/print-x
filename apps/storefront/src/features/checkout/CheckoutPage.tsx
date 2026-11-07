import { BodyText, Heading, PageContainer } from "@platform/ui";

/**
 * Checkout composition is web-specific (payment handoff differs on native).
 * No payment provider is selected; the backend owns payments and order state.
 */
export function CheckoutPage() {
  return (
    <PageContainer>
      <Heading level={1}>Checkout</Heading>
      <BodyText tone="muted">
        Checkout becomes available once the cart, payment and order APIs are connected.
      </BodyText>
    </PageContainer>
  );
}
