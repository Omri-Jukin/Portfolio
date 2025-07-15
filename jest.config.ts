import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testMatch: ["**/?(*.)+(test|spec).[tj]s?(x)"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@mui/(.*)$": "<rootDir>/node_modules/@mui/$1",
    "^#/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"],
  collectCoverageFrom: [
    "Components/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
};

export default config;
