import { Paper, SimpleGrid, Text } from "@mantine/core";

import { useSession } from "../../app/permissions/useSession";
import { PageLayout } from "@platform/ui-admin";

const summaryCards = [
  { label: "Orders awaiting assignment" },
  { label: "Models awaiting review" },
  { label: "Print jobs in progress" },
  { label: "Quality checks pending" },
] as const;

export function DashboardPage() {
  const { session } = useSession();
  return (
    <PageLayout
      title="Dashboard"
      description={session ? `Welcome back, ${session.user.displayName}.` : undefined}
    >
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {summaryCards.map((card) => (
          <Paper key={card.label} withBorder radius="md" p="md">
            <Text size="sm" c="dimmed">
              {card.label}
            </Text>
            <Text size="xl" fw={700} aria-label={`${card.label}: not available yet`}>
              —
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
    </PageLayout>
  );
}
