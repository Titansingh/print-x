/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";

import { tamaguiPlugin } from "@tamagui/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const tamaguiConfigPath = fileURLToPath(
  new URL("../../packages/design-system/src/tamagui.config.ts", import.meta.url),
);

// The Tamagui plugin reconfigures dependency handling in ways that break
// Vitest's module runner; tests use Tamagui's runtime directly.
const isVitest = Boolean(process.env.VITEST);

export default defineConfig({
  plugins: [
    react(),
    !isVitest &&
      tamaguiPlugin({
        config: tamaguiConfigPath,
        components: ["tamagui"],
        // Runtime mode for now. Enable the optimizing compiler later as a
        // performance step once the component set stabilizes.
        disableExtraction: true,
      }),
  ],
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: {
    sourcemap: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
