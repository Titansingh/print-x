import { Group, Stack, Text, Title } from "@mantine/core";
import type { ReactNode } from "react";

export interface PageLayoutProps {
  title: string;
  description?: string;
  /** Primary page actions, rendered at the header's end. */
  actions?: ReactNode;
  children: ReactNode;
}

/** Reusable page header + content layout for every admin and partner screen. */
export function PageLayout({ title, description, actions, children }: PageLayoutProps) {
  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
        <Stack gap={4}>
          <Title order={1} size="h2">
            {title}
          </Title>
          {description ? <Text c="dimmed">{description}</Text> : null}
        </Stack>
        {actions ? <Group gap="sm">{actions}</Group> : null}
      </Group>
      {children}
    </Stack>
  );
}
