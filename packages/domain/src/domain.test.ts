import { describe, expect, it } from "vitest";

import { customizationFormSchema, getPreviewSupport, personalizationTextSchema } from "./index";

describe("getPreviewSupport", () => {
  it("treats GLB/GLTF as interactive", () => {
    expect(getPreviewSupport("model.glb")).toBe("interactive");
    expect(getPreviewSupport("https://cdn.example.test/a/model.GLTF?sig=abc")).toBe("interactive");
    expect(getPreviewSupport("glb")).toBe("interactive");
  });

  it("requires a preview asset for manufacturing formats", () => {
    expect(getPreviewSupport("part.stl")).toBe("requires-preview-asset");
    expect(getPreviewSupport("part.3mf")).toBe("requires-preview-asset");
    expect(getPreviewSupport("part.obj")).toBe("requires-preview-asset");
  });

  it("rejects unknown formats", () => {
    expect(getPreviewSupport("photo.png")).toBe("unsupported");
  });
});

describe("customization validation", () => {
  it("trims and accepts valid personalization text", () => {
    expect(personalizationTextSchema.parse("  Happy Birthday  ")).toBe("Happy Birthday");
  });

  it("rejects empty or overly long text", () => {
    expect(personalizationTextSchema.safeParse("   ").success).toBe(false);
    expect(personalizationTextSchema.safeParse("x".repeat(41)).success).toBe(false);
  });

  it("rejects unsupported photo types", () => {
    const result = customizationFormSchema.safeParse({
      photos: [{ name: "a.gif", mimeType: "image/gif", sizeBytes: 100 }],
    });
    expect(result.success).toBe(false);
  });
});
