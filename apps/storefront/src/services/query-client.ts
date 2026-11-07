import { ApiError } from "@platform/api-client";
import { QueryClient } from "@tanstack/react-query";

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // Do not retry client errors (4xx); retry transient failures twice.
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.status !== undefined && error.status < 500) &&
          failureCount < 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}
