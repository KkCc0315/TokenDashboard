import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        diagnostics: { ignoreDiagnostics: [151002] }
      }
    ]
  },
  collectCoverageFrom: ["**/*.ts", "!**/*.module.ts", "!main.ts", "!**/dto/**"],
  coverageDirectory: "../coverage",
  testEnvironment: "node"
};

export default config;
