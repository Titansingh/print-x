import { tamaguiConfig } from "@platform/design-system";
import { TamaguiProvider } from "tamagui";

import type { ColorScheme } from "@platform/design-system/tokens";

export interface UIProviderProps {
  children: React.ReactNode;
  /** Resolved color scheme; each app decides how (system setting, user toggle). */
  colorScheme?: ColorScheme;
}

/** Wraps an app with the shared Tamagui config and theme. */
export function UIProvider({ children, colorScheme = "light" }: UIProviderProps) {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme}>
      {children}
    </TamaguiProvider>
  );
}
