import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["node_modules", "dist", ".next", "coverage", "**/tsconfig.tsbuildinfo", "**/*.spec.ts", "**/*.test.ts"]
  },
  {
    files: ["apps/api/src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "apps/api/tsconfig.json"
      },
      globals: {
        process: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules
    }
  }
];
