import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testMatch: ["**/?(*.)+(test|spec).[tj]s?(x)"],
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
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"],
  transformIgnorePatterns: ["node_modules/(?!(@react-three|three)/)"],
  collectCoverageFrom: [
    "Components/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
};

export default config;
