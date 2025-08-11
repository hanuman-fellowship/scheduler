// Environment setup for tests - runs before setup.ts
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST || 'postgresql://scheduler_user:scheduler_password@localhost:5432/scheduler_test';
process.env.JWT_SECRET = 'test-secret';

// Ensure we're using the test database
if (!process.env.DATABASE_URL?.includes('scheduler_test')) {
  throw new Error('Tests must use scheduler_test database!');
}
