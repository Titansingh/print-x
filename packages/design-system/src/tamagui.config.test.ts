import { describe, expect, it } from "vitest";

import { tamaguiConfig } from "./tamagui.config";
import { radius, semanticColors } from "./tokens";

function themeValue(theme: Record<string, unknown> | undefined, key: string): unknown {
  const entry = theme?.[key];
  return entry && typeof entry === "object" && "val" in entry ? entry.val : entry;
}

describe("tamaguiConfig", () => {
  it("builds light and dark themes", () => {
    expect(tamaguiConfig.themes).toHaveProperty("light");
    expect(tamaguiConfig.themes).toHaveProperty("dark");
  });

  it("exposes semantic roles as theme variables for both schemes", () => {
    const themes = tamaguiConfig.themes as unknown as Record<string, Record<string, unknown>>;
    expect(themeValue(themes.light, "primary")).toBe(semanticColors.light.primary);
    expect(themeValue(themes.dark, "primary")).toBe(semanticColors.dark.primary);
    expect(themeValue(themes.light, "muted")).toBe(semanticColors.light.muted);
  });

  it("uses the shared radius scale", () => {
    const tokenRadius = tamaguiConfig.tokens.radius as unknown as Record<string, { val: number }>;
    expect(tokenRadius.md?.val).toBe(radius.md);
  });
});
