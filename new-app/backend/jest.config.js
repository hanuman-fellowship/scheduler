module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^@shared/(.*)$": "<rootDir>/../shared/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/__tests__/**",
    "!src/server.ts",
    "!src/seed.ts",
  ],
  // Set test environment variables
  setupFiles: ["<rootDir>/src/__tests__/env.ts"],
  // Global test timeout
  testTimeout: 30000,
  // Run tests in sequence to avoid database conflicts
  maxWorkers: 1,
  // Module resolution
  moduleDirectories: ["node_modules", "src"],
  // Extensions
  moduleFileExtensions: ["ts", "js", "json"],
};
