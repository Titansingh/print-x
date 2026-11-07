import { createPaletteThemes } from "@tamagui/config/v6-builder";

import { palette } from "../tokens/colors";
import { semanticColors, type SemanticColorRole } from "../tokens/semantic";

/**
 * Full Tamagui light/dark theme tree generated from our palettes:
 * - `surface` grounds light and dark (background, hover, press, border, text)
 * - `brand` drives the accent/brand sub-themes
 * - `red` / `green` / `yellow` sub-themes use our status palettes
 */
export const paletteThemes = createPaletteThemes({
  surface: palette.neutral,
  brand: palette.brand,
  red: palette.error,
  green: palette.success,
  yellow: palette.warning,
});

/**
 * Our semantic roles exposed as theme variables, e.g. `$primary`, `$muted`.
 * Kebab-case to match Tamagui v6 theme key conventions. `background` is
 * already provided by the generated theme from the same neutral ramp.
 */
const roleToVariable = {
  primary: "primary",
  onPrimary: "on-primary",
  surface: "surface",
  text: "text",
  muted: "muted",
  border: "border",
  success: "success",
  warning: "warning",
  error: "error",
  focusRing: "focus-ring",
} as const satisfies Partial<Record<SemanticColorRole, string>>;

type VariableName = (typeof roleToVariable)[keyof typeof roleToVariable];

export const themeVariables = Object.fromEntries(
  Object.entries(roleToVariable).map(([role, variable]) => [
    variable,
    {
      light: semanticColors.light[role as SemanticColorRole],
      dark: semanticColors.dark[role as SemanticColorRole],
    },
  ]),
) as Record<VariableName, { light: string; dark: string }>;
