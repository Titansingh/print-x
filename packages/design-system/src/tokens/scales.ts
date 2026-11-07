/**
 * Spacing, radius, typography, breakpoint and touch scales shared by the
 * customer apps (via Tamagui) and the admin (via the Mantine mapping).
 * Values are in density-independent pixels.
 */

/** 4px grid. Keys match Tamagui's space token names. */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/** Key `0` (not `none`) because CSS-wide keywords cannot be token names in Tamagui. */
export const radius = {
  0: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    body: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    heading:
      '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  },
  /** Type scale. Keys match Tamagui v6 font-size names. */
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    "2xl": 32,
    "3xl": 36,
    "4xl": 40,
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export type FontSizeToken = keyof typeof typography.fontSize;

/** Minimum widths (px) for responsive layouts on the web. */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/** Minimum interactive target size (Apple HIG 44pt; Material recommends 48dp). */
export const touchTarget = {
  min: 44,
} as const;
