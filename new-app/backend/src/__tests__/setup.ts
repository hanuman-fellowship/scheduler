import { ensureTestDatabase, closeTestDatabase, resetTestDatabase } from './utils/testConfig';
import { resetTestCounters } from './utils/testDb';
import prisma from '../services/prisma';

// Global test setup
beforeAll(async () => {
  // Set global test timeout
  jest.setTimeout(15000);
  
  // Reset test counters for clean runs
  resetTestCounters();
  
  // Ensure we're connected to test database
  await ensureTestDatabase();
  
  // Suppress console logs during tests for cleaner output
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}, 30000);

// Global test teardown
afterAll(async () => {
  // Reset database to clean state after all tests
  await resetTestDatabase();
  
  // Close database connection
  await closeTestDatabase();
  
  // Ensure prisma client is properly disconnected
  await prisma.$disconnect();
}, 30000);

// Optimize Jest for reliability
jest.setTimeout(15000);

// Disable console output during tests for cleaner output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};