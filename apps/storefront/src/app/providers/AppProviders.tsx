import { UIProvider } from "@platform/ui";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { createQueryClient } from "../../services/query-client";
import { useColorScheme } from "./useColorScheme";

export interface AppProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

export function AppProviders({ children, queryClient }: AppProvidersProps) {
  const [client] = useState(() => queryClient ?? createQueryClient());
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={client}>
      <UIProvider colorScheme={colorScheme}>{children}</UIProvider>
    </QueryClientProvider>
  );
}
