/**
 * Framework-neutral design tokens. Safe to import from any app (including the
 * Mantine admin) without pulling in Tamagui.
 */
export { black, palette, white, type ColorRamp, type PaletteName } from "./colors";
export {
  semanticColorRoles,
  semanticColors,
  type ColorScheme,
  type SemanticColorRole,
  type SemanticColors,
} from "./semantic";
export {
  breakpoints,
  radius,
  spacing,
  touchTarget,
  typography,
  type FontSizeToken,
} from "./scales";
