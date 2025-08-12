import { createApp } from '../../routes';

// Create a test app using the main routes but with test-appropriate settings
export const createTestApp = () => {
  return createApp({
    enableCors: false,        // Disable CORS for tests
    enableLogging: false,     // Disable request logging for cleaner test output
    enableErrorHandlers: false, // Disable error handlers to catch errors in tests
    enableHealthCheck: false  // Disable health check endpoint for tests
  });
};

// Export a singleton instance for tests that don't need customization
export const testApp = createTestApp();
