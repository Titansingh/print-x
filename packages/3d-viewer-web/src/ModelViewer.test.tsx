// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ModelViewer } from "./index";

afterEach(cleanup);

describe("ModelViewer (web)", () => {
  it("renders the empty state without a source", () => {
    const onStatusChange = vi.fn();
    render(<ModelViewer accessibilityLabel="Gift preview" onStatusChange={onStatusChange} />);
    expect(screen.getByRole("status").textContent).toMatch(/no 3d preview/i);
    expect(onStatusChange).toHaveBeenCalledWith("empty");
  });

  it("reports unsupported when WebGL is unavailable (jsdom has none)", () => {
    const onStatusChange = vi.fn();
    render(
      <ModelViewer
        accessibilityLabel="Gift preview"
        source={{ url: "https://cdn.example.test/model.glb", format: "glb" }}
        onStatusChange={onStatusChange}
      />,
    );
    expect(onStatusChange).toHaveBeenCalledWith("unsupported");
    expect(document.querySelector("[data-viewer-state='unsupported']")).not.toBeNull();
  });

  it("supports custom state rendering", () => {
    render(
      <ModelViewer
        accessibilityLabel="Gift preview"
        renderState={(status) => <p>custom {status}</p>}
      />,
    );
    expect(screen.getByText("custom empty")).toBeTruthy();
  });
});
