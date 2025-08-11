module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@shared/(.*)$": "<rootDir>/../shared/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  setupFiles: ["<rootDir>/src/__tests__/env.ts"],

  // Simple configuration for reliability
  testTimeout: 15000, // 15 seconds per test
  maxWorkers: 1, // Run tests sequentially to avoid database conflicts

  // Module resolution
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["ts", "js", "json"],

  // Coverage
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/index.ts",
  ],

  // Test isolation
  clearMocks: true,
  restoreMocks: true,
  resetModules: false,

  // Global test setup
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      diagnostics: {
        ignoreCodes: [151001], // Ignore "esModuleInterop" warnings
      },
    },
  },
};
