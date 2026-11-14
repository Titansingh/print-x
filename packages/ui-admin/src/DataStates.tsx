import { Alert, Button, Center, Loader, Stack, Text, Title } from "@mantine/core";

export function LoadingView({ label = "Loading" }: { label?: string }) {
  return (
    <Center py="xl" role="status" aria-live="polite" aria-label={label}>
      <Stack align="center" gap="sm">
        <Loader />
        <Text c="dimmed" size="sm">
          {label}
        </Text>
      </Stack>
    </Center>
  );
}

export function EmptyView({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Center py="xl">
      <Stack align="center" gap="xs" maw={420} ta="center">
        <Title order={3}>{title}</Title>
        {description ? <Text c="dimmed">{description}</Text> : null}
        {action}
      </Stack>
    </Center>
  );
}

export function ErrorView({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <Alert color="red" title={title} role="alert" variant="light">
      <Stack gap="sm" align="flex-start">
        {message ? <Text size="sm">{message}</Text> : null}
        {onRetry ? (
          <Button size="xs" variant="light" color="red" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </Stack>
    </Alert>
  );
}
