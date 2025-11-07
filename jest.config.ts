import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.polyfills.ts"], // Run polyfills first
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
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
    "Components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/__tests__/**",
  ],
};

export default createJestConfig(config);
