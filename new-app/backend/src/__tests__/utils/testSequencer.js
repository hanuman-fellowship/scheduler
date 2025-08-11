const TestSequencer = require("@jest/test-sequencer").default;

class CustomTestSequencer extends TestSequencer {
  sort(tests) {
    // Sort tests to optimize database operations
    // Run tests that don't modify data first, then those that do

    const testGroups = {
      readOnly: [], // Tests that only read data
      lightWrite: [], // Tests that create minimal test data
      heavyWrite: [], // Tests that create complex data structures
      cleanup: [], // Tests that need full database reset
    };

    tests.forEach((test) => {
      const testPath = test.path;

      if (testPath.includes("scheduleService.test.ts")) {
        // Service tests are mostly read-only
        testGroups.readOnly.push(test);
      } else if (testPath.includes("auth.test.ts")) {
        // Middleware tests are lightweight
        testGroups.lightWrite.push(test);
      } else if (testPath.includes("authController.test.ts")) {
        // Auth tests are simple
        testGroups.lightWrite.push(test);
      } else if (testPath.includes("userController.test.ts")) {
        // User tests create some data
        testGroups.lightWrite.push(test);
      } else if (testPath.includes("scheduleController.test.ts")) {
        // Schedule tests create complex data
        testGroups.heavyWrite.push(test);
      } else {
        // Default to light write
        testGroups.lightWrite.push(test);
      }
    });

    // Return tests in optimal order: read-only first, then light writes, then heavy writes
    return [
      ...testGroups.readOnly,
      ...testGroups.lightWrite,
      ...testGroups.heavyWrite,
      ...testGroups.cleanup,
    ];
  }
}

module.exports = CustomTestSequencer;
