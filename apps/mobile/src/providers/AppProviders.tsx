import { UIProvider } from "@platform/ui";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider, type Metrics } from "react-native-safe-area-context";

import { createQueryClient, subscribeAppFocus } from "../services/query-client";

export interface AppProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
  /** Safe-area metrics for tests (no native module available). */
  initialMetrics?: Metrics;
}

export function AppProviders({ children, queryClient, initialMetrics }: AppProvidersProps) {
  const [client] = useState(() => queryClient ?? createQueryClient());
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";

  useEffect(subscribeAppFocus, []);

  return (
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <QueryClientProvider client={client}>
        <UIProvider colorScheme={colorScheme}>{children}</UIProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
