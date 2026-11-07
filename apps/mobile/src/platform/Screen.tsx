import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { useTheme } from "tamagui";

export interface ScreenProps {
  children: ReactNode;
  /** Wrap content in a ScrollView (default true). */
  scroll?: boolean;
  edges?: readonly Edge[];
}

/**
 * Native screen container: safe-area insets, keyboard avoidance and themed
 * background. Platform-specific by design; the web storefront has its own layout.
 */
export function Screen({
  children,
  scroll = true,
  edges = ["bottom", "left", "right"],
}: ScreenProps) {
  const theme = useTheme();
  const backgroundColor = theme.background?.val as string | undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={edges}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scroll ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
