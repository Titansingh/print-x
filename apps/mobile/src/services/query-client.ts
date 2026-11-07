import { ApiError } from "@platform/api-client";
import { focusManager, QueryClient } from "@tanstack/react-query";
import { AppState, Platform, type AppStateStatus } from "react-native";

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.status !== undefined && error.status < 500) &&
          failureCount < 2,
      },
    },
  });
}

/** Refetch stale queries when the app returns to the foreground. */
export function subscribeAppFocus(): () => void {
  const onChange = (status: AppStateStatus) => {
    if (Platform.OS !== "web") focusManager.setFocused(status === "active");
  };
  const subscription = AppState.addEventListener("change", onChange);
  return () => subscription.remove();
}
