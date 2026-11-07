import { EmptyState, PageContainer } from "@platform/ui";

export function NotFoundPage() {
  return (
    <PageContainer>
      <EmptyState title="Page not found" description="The page you’re looking for doesn’t exist." />
    </PageContainer>
  );
}
