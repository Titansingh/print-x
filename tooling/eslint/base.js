import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

/** Paths never linted in any workspace. */
export const sharedIgnores = globalIgnores([
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/.expo/**",
  "**/.turbo/**",
  "**/node_modules/**",
  "**/playwright-report/**",
  "**/test-results/**",
  // Generated from the backend OpenAPI document.
  "**/src/generated/**",
]);

/** Config/tooling files run in Node. */
export const nodeFiles = {
  files: ["*.config.{js,mjs,cjs,ts,mts}", "scripts/**/*.{js,mjs}"],
  languageOptions: { globals: { ...globals.node } },
};

/**
 * Base TypeScript config for every package. Intentionally small: recommended
 * rules plus a few consistency rules; Prettier owns formatting.
 */
export const base = defineConfig(
  sharedIgnores,
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.es2021 },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
  nodeFiles,
  prettier,
);

export default base;
