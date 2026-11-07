import { BodyText, EmptyState, Heading, PageContainer } from "@platform/ui";

/**
 * AI model generation is an asynchronous backend job. The intended flow:
 *   1. Upload photos (uploads API, signed URLs).
 *   2. Create a generation job and receive a job id.
 *   3. Poll (TanStack Query `refetchInterval` with `getBackoffDelay` from
 *      @platform/utils) or subscribe for status updates.
 *   4. Show the GLB/GLTF preview for customer approval.
 * Never hold a single HTTP request open for the duration of generation.
 */
export function ModelGenerationPage() {
  return (
    <PageContainer>
      <Heading level={1}>Your personalized model</Heading>
      <BodyText tone="muted">Track the status of models created from your photos.</BodyText>
      <EmptyState
        title="No models in progress"
        description="Start from a personalized product to create one."
      />
    </PageContainer>
  );
}
