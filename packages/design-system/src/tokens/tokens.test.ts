import { describe, expect, it } from "vitest";

import { palette, semanticColorRoles, semanticColors } from "./index";

describe("design tokens", () => {
  it("defines every semantic role for both color schemes", () => {
    for (const scheme of ["light", "dark"] as const) {
      for (const role of semanticColorRoles) {
        expect(semanticColors[scheme][role]).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  it("uses 11-step ramps for every palette", () => {
    for (const ramp of Object.values(palette)) {
      expect(ramp).toHaveLength(11);
    }
  });
});
