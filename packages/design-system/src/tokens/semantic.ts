import { palette, white } from "./colors";

/**
 * Semantic color roles. Components must reference these roles (through the
 * Tamagui theme or the Mantine mapping), never raw hex values.
 */
export const semanticColorRoles = [
  "primary",
  "onPrimary",
  "background",
  "surface",
  "text",
  "muted",
  "border",
  "success",
  "warning",
  "error",
  "focusRing",
] as const;

export type SemanticColorRole = (typeof semanticColorRoles)[number];
export type SemanticColors = Record<SemanticColorRole, string>;
export type ColorScheme = "light" | "dark";

const { brand, neutral, success, warning, error } = palette;

export const semanticColors = {
  light: {
    primary: brand[6],
    onPrimary: white,
    background: neutral[0],
    surface: white,
    text: neutral[10],
    muted: neutral[6],
    border: neutral[2],
    success: success[7],
    warning: warning[7],
    error: error[6],
    focusRing: brand[4],
  },
  dark: {
    primary: brand[4],
    onPrimary: brand[10],
    background: neutral[10],
    surface: neutral[9],
    text: neutral[0],
    muted: neutral[4],
    border: neutral[8],
    success: success[4],
    warning: warning[4],
    error: error[4],
    focusRing: brand[3],
  },
} as const satisfies Record<ColorScheme, SemanticColors>;
