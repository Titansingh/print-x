/**
 * Raw color palettes (11-step ramps, 50 → 950).
 *
 * PROVISIONAL: these values are a starting point (violet primary, neutral
 * surfaces), not a final brand identity. Change them here only; components and
 * app themes derive everything from these ramps via semantic roles.
 */
export type ColorRamp = readonly [
  c50: string,
  c100: string,
  c200: string,
  c300: string,
  c400: string,
  c500: string,
  c600: string,
  c700: string,
  c800: string,
  c900: string,
  c950: string,
];

export const palette = {
  /** Primary brand color. */
  brand: [
    "#f5f3ff",
    "#ede9fe",
    "#ddd6fe",
    "#c4b5fd",
    "#a78bfa",
    "#8b5cf6",
    "#7c3aed",
    "#6d28d9",
    "#5b21b6",
    "#4c1d95",
    "#2e1065",
  ],
  /** Neutral surfaces, borders and text. */
  neutral: [
    "#fafafa",
    "#f4f4f5",
    "#e4e4e7",
    "#d4d4d8",
    "#a1a1aa",
    "#71717a",
    "#52525b",
    "#3f3f46",
    "#27272a",
    "#18181b",
    "#09090b",
  ],
  success: [
    "#f0fdf4",
    "#dcfce7",
    "#bbf7d0",
    "#86efac",
    "#4ade80",
    "#22c55e",
    "#16a34a",
    "#15803d",
    "#166534",
    "#14532d",
    "#052e16",
  ],
  warning: [
    "#fffbeb",
    "#fef3c7",
    "#fde68a",
    "#fcd34d",
    "#fbbf24",
    "#f59e0b",
    "#d97706",
    "#b45309",
    "#92400e",
    "#78350f",
    "#451a03",
  ],
  error: [
    "#fef2f2",
    "#fee2e2",
    "#fecaca",
    "#fca5a5",
    "#f87171",
    "#ef4444",
    "#dc2626",
    "#b91c1c",
    "#991b1b",
    "#7f1d1d",
    "#450a0a",
  ],
} as const satisfies Record<string, ColorRamp>;

export type PaletteName = keyof typeof palette;

export const white = "#ffffff";
export const black = "#000000";
