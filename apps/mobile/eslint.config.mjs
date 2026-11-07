import { globalIgnores } from "eslint/config";
import { expoApp } from "@platform/eslint-config/react";

export default [...expoApp, globalIgnores(["expo-env.d.ts", "ios/**", "android/**"])];
