import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.polyfills.ts"], // Run polyfills first
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testTimeout: 60000, // 60 seconds for database operations (increased due to connection retries)
  maxWorkers: process.env.CI ? "50%" : "15%", // Further reduced to 15% to minimize connection pool exhaustion
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@mui/(.*)$": "<rootDir>/node_modules/@mui/$1",
    "^#/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/Components/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^\\$/(.*)$": "<rootDir>/lib/$1",
    "^%/(.*)$": "<rootDir>/locales/$1",
    "^\\^/(.*)$": "<rootDir>/public/$1",
    "^!/(.*)$": "<rootDir>/theme/$1",
    "^&/(.*)$": "<rootDir>/Components/Providers/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/", "/.next/"],
  transformIgnorePatterns: ["node_modules/(?!(@react-three|three|jose)/)"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "Components/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/__tests__/**",
    "!**/*.test.{ts,tsx}",
    "!**/*.spec.{ts,tsx}",
    "!**/tests/**",
  ],
};

export default createJestConfig(config);
