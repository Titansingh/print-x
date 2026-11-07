import { createV6Config } from "@tamagui/config/v6-base";
import { createTamagui } from "tamagui";

import { paletteThemes, themeVariables } from "./themes";
import { radius, typography } from "./tokens/scales";

const base = createV6Config({
  themes: paletteThemes.themes,
  colorTokens: paletteThemes.colorTokens,
});

/**
 * Shared Tamagui configuration for the customer storefront (web) and the
 * mobile app (native). Built on Tamagui's v6 base (sizing ladder, media
 * queries, shorthands), with our palette, radius scale, typography and
 * semantic theme variables layered on top.
 */
export const tamaguiConfig = createTamagui({
  ...base,
  tokens: {
    ...base.tokens,
    radius: { ...base.tokens.radius, ...radius },
  },
  fonts: {
    body: { ...base.fonts.body, family: typography.fontFamily.body },
    heading: { ...base.fonts.heading, family: typography.fontFamily.heading },
  },
  variables: themeVariables,
  settings: {
    ...base.settings,
    // Allow readable longhand style props alongside shorthands.
    onlyAllowShorthands: false,
  },
});

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module "tamagui" {
  // Registers our config so Tamagui props are typed against our tokens/themes.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

export default tamaguiConfig;
