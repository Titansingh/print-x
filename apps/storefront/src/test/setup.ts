import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom does not implement matchMedia (used by Tamagui media queries).
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// jsdom does not implement the Web Animations API (used by Tamagui's Spinner).
if (!Element.prototype.animate) {
  Element.prototype.animate = function animate() {
    return { cancel: () => undefined, finish: () => undefined } as unknown as Animation;
  };
}

afterEach(cleanup);
