# Testing Guide for Scheduler Backend

This document explains how to set up and run tests for the Scheduler backend application.

## 🚀 Quick Start

### Prerequisites

1. **devenv**: Make sure you have devenv installed and running
2. **PostgreSQL**: The devenv setup will handle this automatically

### Initial Setup

```bash
# From the project root (new-app/)
devenv up

# From the backend directory
cd backend
npm install
npm run test:setup
```

## 🗄️ Test Database

The test environment uses a separate `scheduler_test` database that is automatically created by devenv:

- **Main Database**: `scheduler` (for development)
- **Test Database**: `scheduler_test` (for testing)
- **Environment Variables**:
  - `DATABASE_URL` → main database
  - `DATABASE_URL_TEST` → test database

### Database Management

```bash
# Set up test database schema
npm run test:setup

# Reset test database (destructive)
npm run test:reset

# Check test environment status
./scripts/test-env.sh status
```

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with debug info
npm run test:debug
```

### Running Specific Test Suites

```bash
# Run only auth controller tests
npm test -- --testNamePattern='AuthController'

# Run only user controller tests
npm test -- --testNamePattern='UserController'

# Run only schedule controller tests
npm test -- --testNamePattern='ScheduleController'

# Run only auth middleware tests
npm test -- --testNamePattern='Auth Middleware'

# Run only schedule service tests
npm test -- --testNamePattern='ScheduleService'
```

### Running Specific Tests

```bash
# Run a specific test by description
npm test -- --testNamePattern='should login with valid credentials'

# Run tests matching a pattern
npm test -- --testNamePattern='login'
```

## 🛠️ Test Environment Management

Use the test environment management script for common operations:

```bash
# Show all available commands
./scripts/test-env.sh help

# Check test environment status
./scripts/test-env.sh status

# Set up test environment
./scripts/test-env.sh setup

# Reset test database
./scripts/test-env.sh reset

# Run tests
./scripts/test-env.sh run

# Run tests with coverage
./scripts/test-env.sh coverage

# Run tests in watch mode
./scripts/test-env.sh watch
```

## 📁 Test Structure

```
src/__tests__/
├── controllers/
│   ├── authController.test.ts      # Authentication tests
│   ├── userController.test.ts      # User management tests
│   └── scheduleController.test.ts  # Schedule management tests
├── middleware/
│   └── auth.test.ts               # Auth middleware tests
├── services/
│   └── scheduleService.test.ts    # Business logic tests
├── utils/
│   ├── testConfig.ts              # Test database configuration
│   └── testDb.ts                  # Test data helpers
├── env.ts                         # Test environment setup
└── setup.ts                       # Test global setup
```

## 🔧 Test Utilities

### Creating Test Data

```typescript
import { createTestUser, createTestSchedule } from "../utils/testDb";

// Create a test user
const user = await createTestUser({
  username: "testuser",
  email: "test@example.com",
  password: "password123",
  roles: ["personnel"],
});

// Create a test schedule
const schedule = await createTestSchedule({
  name: "Test Schedule",
  userId: user.id,
  template: false,
  request: 0,
});
```

### Database Cleanup

Tests automatically clean up after themselves, but you can manually reset:

```bash
npm run test:reset
```

## 🧹 Test Isolation

- Each test runs in isolation
- Database is reset between tests
- No test data persists between test runs
- Tests can run in parallel (though currently configured for sequential execution)

## 📊 Coverage Reports

Generate coverage reports to see how well your code is tested:

```bash
npm run test:coverage
```

Coverage reports show:

- **Statements**: Percentage of code statements executed
- **Branches**: Percentage of conditional branches taken
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

## 🐛 Debugging Tests

### Debug Mode

```bash
npm run test:debug
```

This runs Jest with `--detectOpenHandles --forceExit` to help identify hanging tests.

### Verbose Output

```bash
npm test -- --verbose
```

### Watch Mode

```bash
npm run test:watch
```

Watch mode automatically re-runs tests when files change.

## 🔍 Troubleshooting

### Common Issues

1. **Test Database Not Accessible**

   ```bash
   # Make sure devenv is running
   devenv up

   # Check status
   ./scripts/test-env.sh status
   ```

2. **Prisma Client Not Generated**

   ```bash
   npm run prisma generate
   ```

3. **Tests Hanging**

   ```bash
   npm run test:debug
   ```

4. **Database Schema Out of Sync**
   ```bash
   npm run test:reset
   ```

### Environment Variables

Make sure these are set (devenv handles this automatically):

- `NODE_ENV=test`
- `DATABASE_URL_TEST=postgresql://scheduler_user:scheduler_password@localhost:5432/scheduler_test`
- `JWT_SECRET=test-secret`

## 📝 Writing Tests

### Test Structure

```typescript
describe("FeatureName", () => {
  let testData: any;

  beforeAll(async () => {
    // Set up test data
  });

  beforeEach(async () => {
    // Reset state between tests
  });

  afterAll(async () => {
    // Clean up
  });

  it("should do something", async () => {
    // Test implementation
  });
});
```

### Best Practices

1. **Use descriptive test names** that explain the expected behavior
2. **Test both success and failure cases**
3. **Verify HTTP status codes** for API endpoints
4. **Test role-based access control** thoroughly
5. **Clean up test data** in afterAll hooks
6. **Use proper assertions** with clear error messages

## 🚀 Continuous Integration

The test setup is designed to work in CI environments:

```bash
# CI setup
npm ci
npm run test:setup
npm test
npm run test:coverage
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
- [Express Testing Best Practices](https://expressjs.com/en/advanced/best-practices-performance.html#testing)
