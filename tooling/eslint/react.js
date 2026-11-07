import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

import { base } from "./base.js";

/** React libraries (web and/or native consumers). */
export const react = defineConfig(base, reactHooks.configs.flat.recommended, {
  languageOptions: { globals: { ...globals.browser } },
});

/** React + Vite applications (adds Fast Refresh boundary checks). */
export const viteApp = defineConfig(react, {
  files: ["src/**/*.{ts,tsx}"],
  ...reactRefresh.configs.vite,
});

/** Expo / React Native application. */
export const expoApp = defineConfig(react, {
  languageOptions: {
    globals: { __DEV__: "readonly" },
  },
});

export default react;
