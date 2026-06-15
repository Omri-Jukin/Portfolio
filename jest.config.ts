import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.polyfills.ts"], // Run polyfills first
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^#/(.*)$": "<rootDir>/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^\\$/(.*)$": "<rootDir>/lib/$1",
    "^\\^/(.*)$": "<rootDir>/public/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/", "/.next/"],
  transformIgnorePatterns: ["node_modules/(?!jose/)"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/__tests__/**",
  ],
};

export default createJestConfig(config);
