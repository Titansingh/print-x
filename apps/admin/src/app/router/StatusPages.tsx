import { Button, Center, Paper, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router";

import { EmptyView } from "../../components/DataStates";

export function SignInPage() {
  return (
    <Center mih="100vh" p="md">
      <Paper withBorder radius="md" p="xl" maw={440} w="100%">
        <Stack gap="sm">
          <Title order={1} size="h2">
            Sign in
          </Title>
          <Text c="dimmed">
            Admin sign-in is not configured yet. It will use the backend&apos;s authentication once
            an identity provider is chosen.
          </Text>
          {import.meta.env.DEV ? (
            <Text size="sm" c="dimmed">
              For local development, set <code>VITE_USE_DEMO_AUTH=true</code> in{" "}
              <code>apps/admin/.env.local</code> and restart the dev server.
            </Text>
          ) : null}
        </Stack>
      </Paper>
    </Center>
  );
}

export function ForbiddenPage() {
  return (
    <EmptyView
      title="You don't have access to this page"
      description="Ask a platform administrator if you need access."
      action={
        <Button component={Link} to="/" variant="light">
          Go to dashboard
        </Button>
      }
    />
  );
}

export function NotFoundPage() {
  return (
    <EmptyView
      title="Page not found"
      action={
        <Button component={Link} to="/" variant="light">
          Go to dashboard
        </Button>
      }
    />
  );
}
