import type { StatusTone } from "@platform/domain";
import { SizableText, Theme, XStack, type ThemeName } from "tamagui";

export interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
}

// Sub-themes generated from the shared status palettes.
const themeByTone: Record<StatusTone, ThemeName | null> = {
  neutral: null,
  info: "accent",
  success: "green",
  warning: "yellow",
  error: "red",
};

/** Compact status label. Pair with text, never rely on color alone. */
export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  const badge = (
    <XStack
      self="flex-start"
      items="center"
      px="2.5"
      py="0.5"
      rounded="full"
      backgroundColor="background"
      borderWidth={1}
      borderColor="border-color"
    >
      <SizableText size="xs" fontWeight="600" color="color">
        {label}
      </SizableText>
    </XStack>
  );

  const theme = themeByTone[tone];
  return theme ? <Theme name={theme}>{badge}</Theme> : badge;
}
