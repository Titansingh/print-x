import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { createQueryClient } from "../../services/query-client";
import { adminTheme, cssVariablesResolver } from "../theme";

export interface AppProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

export function AppProviders({ children, queryClient }: AppProvidersProps) {
  const [client] = useState(() => queryClient ?? createQueryClient());
  return (
    <QueryClientProvider client={client}>
      <MantineProvider
        theme={adminTheme}
        cssVariablesResolver={cssVariablesResolver}
        defaultColorScheme="auto"
      >
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
}
