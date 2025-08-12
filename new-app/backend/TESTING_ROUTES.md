# Testing Routes Configuration

## Overview

The test suite uses the main `src/routes.ts` file directly through a configurable `createApp` function. This ensures:

- **Single source of truth** for all routes
- **Automatic route synchronization** between production and tests
- **No duplicate route maintenance**
- **Consistent API behavior** across environments

## How It Works

### Single Route Definition

Routes are defined only in `src/routes.ts` and automatically available in tests.

### Test Configuration

Tests use the main routes with test-appropriate settings:

```typescript
// In testApp.ts
export const createTestApp = () => {
  return createApp({
    enableCors: false, // Disable CORS for tests
    enableLogging: false, // Disable request logging for cleaner test output
    enableErrorHandlers: false, // Disable error handlers to catch errors in tests
    enableHealthCheck: false, // Disable health check endpoint for tests
  });
};
```

## Adding New Routes

**You only need to add routes to ONE place:**

1. Add route to `src/routes.ts` (production)
2. **That's it!** Tests automatically get the new route

## Example: Adding a New Route

**Step 1: Add to main routes (`src/routes.ts`):**

```typescript
app.get(
  "/api/schedules/current",
  requireAuth,
  asyncHandler(scheduleController.getCurrentSchedule)
);
```

**Step 2: Nothing else needed!** Tests automatically get this route.

## Implementation Details

The `src/routes.ts` file exports a `createApp` function that can be configured for different environments:

```typescript
export const createApp = (
  options: {
    enableCors?: boolean;
    enableLogging?: boolean;
    enableErrorHandlers?: boolean;
    enableHealthCheck?: boolean;
  } = {}
) => {
  // ... route definitions
  return app;
};

// Export the default production app
const app = createApp();
export default app;
```

## Benefits

- **No maintenance overhead** - Add routes in one place, they work everywhere
- **Eliminated 404 test failures** - Tests automatically have access to all production routes
- **Better test isolation** - Tests use production routes but with test-appropriate middleware disabled
- **Future-proof** - New routes automatically work in tests without any additional steps

---

**Last Updated**: After refactoring to use configurable main routes  
**Status**: ✅ Working - Single source of truth for all routes
