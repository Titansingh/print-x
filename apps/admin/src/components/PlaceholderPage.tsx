import { Paper } from "@mantine/core";

import { PageLayout } from "../layouts/PageLayout";
import { EmptyView } from "./DataStates";

/** Representative placeholder for admin areas whose backend contract is pending. */
export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <PageLayout title={title} description={description}>
      <Paper withBorder radius="md" p="lg">
        <EmptyView
          title="Coming soon"
          description="This screen is connected once the corresponding backend API is published."
        />
      </Paper>
    </PageLayout>
  );
}
