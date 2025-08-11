// Test setup file - runs after env.ts
// Global test timeout
jest.setTimeout(30000);

// Suppress console logs during tests unless explicitly needed
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test cleanup
afterAll(async () => {
  // Clean up test database after all tests
  const { resetTestDatabase } = await import('./utils/testDb');
  await resetTestDatabase();
});