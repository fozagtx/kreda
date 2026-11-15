import { defineConfig, globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "contracts/**",
    "node_modules/**",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
]);
