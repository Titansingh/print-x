import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { createQueryClient } from "../../services/query-client";
import { cssVariablesResolver, mantineTheme } from "@platform/ui-admin";

export interface AppProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

export function AppProviders({ children, queryClient }: AppProvidersProps) {
  const [client] = useState(() => queryClient ?? createQueryClient());
  return (
    <QueryClientProvider client={client}>
      <MantineProvider
        theme={mantineTheme}
        cssVariablesResolver={cssVariablesResolver}
        defaultColorScheme="auto"
      >
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
}
