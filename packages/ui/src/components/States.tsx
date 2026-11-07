import { Spinner, YStack } from "tamagui";

import { Button } from "./Button";
import { BodyText, Heading } from "./Text";

const stateFrameProps = {
  flex: 1,
  items: "center",
  justify: "center",
  gap: "3",
  p: "6",
  minH: 160,
} as const;

export interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Loading" }: LoadingStateProps) {
  return (
    <YStack {...stateFrameProps} role="status" aria-live="polite" aria-label={label}>
      <Spinner size="large" color="primary" />
      <BodyText tone="muted">{label}</BodyText>
    </YStack>
  );
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <YStack {...stateFrameProps}>
      <Heading level={3}>{title}</Heading>
      {description ? (
        <BodyText tone="muted" text="center">
          {description}
        </BodyText>
      ) : null}
      {actionLabel && onAction ? (
        <Button variant="outlined" onPress={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </YStack>
  );
}

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
}: ErrorStateProps) {
  return (
    <YStack {...stateFrameProps} role="alert">
      <Heading level={3}>{title}</Heading>
      {message ? (
        <BodyText tone="muted" text="center">
          {message}
        </BodyText>
      ) : null}
      {onRetry ? <Button onPress={onRetry}>{retryLabel}</Button> : null}
    </YStack>
  );
}
