import {
  breakpoints,
  palette,
  radius,
  semanticColors,
  spacing,
  typography,
  type ColorRamp,
} from "@platform/design-system/tokens";
import { createTheme, type CSSVariablesResolver, type MantineColorsTuple } from "@mantine/core";

/** Mantine uses 10 shades; our ramps have 11 (50–950). Drop the 950 step. */
function toMantineTuple(ramp: ColorRamp): MantineColorsTuple {
  const [c0, c1, c2, c3, c4, c5, c6, c7, c8, c9] = ramp;
  return [c0, c1, c2, c3, c4, c5, c6, c7, c8, c9];
}

const px = (value: number) => `${value}px`;
const em = (value: number) => `${value / 16}em`;

/**
 * Mantine theme for the admin and partner web apps, derived from the shared
 * design tokens. Mantine-specific component styling stays here; the customer
 * apps never import Mantine.
 */
export const mantineTheme = createTheme({
  primaryColor: "brand",
  primaryShade: { light: 6, dark: 4 },
  colors: {
    brand: toMantineTuple(palette.brand),
    green: toMantineTuple(palette.success),
    yellow: toMantineTuple(palette.warning),
    red: toMantineTuple(palette.error),
    gray: toMantineTuple(palette.neutral),
    // Mantine's dark palette runs light → dark; index 7 is the dark body background.
    dark: [
      palette.neutral[1],
      palette.neutral[3],
      palette.neutral[4],
      palette.neutral[5],
      palette.neutral[6],
      palette.neutral[7],
      palette.neutral[8],
      palette.neutral[9],
      palette.neutral[10],
      palette.neutral[10],
    ],
  },
  fontFamily: typography.fontFamily.body,
  fontFamilyMonospace: typography.fontFamily.mono,
  headings: {
    fontFamily: typography.fontFamily.heading,
    fontWeight: typography.fontWeight.semibold,
  },
  fontSizes: {
    xs: px(typography.fontSize.xs),
    sm: px(typography.fontSize.sm),
    md: px(typography.fontSize.base),
    lg: px(typography.fontSize.lg),
    xl: px(typography.fontSize.xl),
  },
  spacing: {
    xs: px(spacing[2]),
    sm: px(spacing[3]),
    md: px(spacing[4]),
    lg: px(spacing[6]),
    xl: px(spacing[8]),
  },
  radius: {
    xs: px(radius.sm / 2),
    sm: px(radius.sm),
    md: px(radius.md),
    lg: px(radius.lg),
    xl: px(radius.xl),
  },
  defaultRadius: "md",
  breakpoints: {
    xs: em(breakpoints.sm - 64),
    sm: em(breakpoints.sm),
    md: em(breakpoints.md),
    lg: em(breakpoints.lg),
    xl: em(breakpoints.xl),
  },
  focusRing: "auto",
  cursorType: "pointer",
});

/** Exposes semantic roles as CSS variables, e.g. `var(--app-color-muted)`. */
export const cssVariablesResolver: CSSVariablesResolver = () => {
  const toVars = (scheme: "light" | "dark") =>
    Object.fromEntries(
      Object.entries(semanticColors[scheme]).map(([role, value]) => [
        `--app-color-${role.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`,
        value,
      ]),
    );
  return {
    variables: {},
    light: { ...toVars("light"), "--mantine-color-body": semanticColors.light.background },
    dark: { ...toVars("dark"), "--mantine-color-body": semanticColors.dark.background },
  };
};
