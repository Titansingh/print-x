import type { ColorScheme } from "@platform/design-system/tokens";
import { useSyncExternalStore } from "react";

const query = "(prefers-color-scheme: dark)";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => undefined;
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot(): ColorScheme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia(query).matches ? "dark" : "light";
}

/** Follows the operating system color scheme. */
export function useColorScheme(): ColorScheme {
  return useSyncExternalStore(subscribe, getSnapshot, () => "light");
}
