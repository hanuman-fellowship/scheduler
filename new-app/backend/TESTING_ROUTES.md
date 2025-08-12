# 🚨 CRITICAL: Testing Routes Architecture Issue

## Problem
**The test suite uses a separate route definition in `src/__tests__/utils/testApp.ts` instead of the main `src/routes.ts` file.**

This means:
- **Every new route MUST be added to BOTH files**
- **Tests will fail with 404 errors if routes are missing from testApp.ts**
- **Production and test environments may have different route configurations**

## When Adding New Routes

### ✅ REQUIRED STEPS:
1. Add route to `src/routes.ts` (production)
2. **ALSO add route to `src/__tests__/utils/testApp.ts` (tests)**
3. Import the controller function in testApp.ts if needed

### ❌ COMMON MISTAKE:
Adding routes only to `src/routes.ts` will cause tests to fail with 404 errors.

## Example: Adding getCurrentSchedule Route

**Step 1: Add to main routes (`src/routes.ts`):**
```typescript
app.get('/api/schedules/current', requireAuth, asyncHandler(scheduleController.getCurrentSchedule));
```

**Step 2: Add to test routes (`src/__tests__/utils/testApp.ts`):**
```typescript
// Import the function
import { getCurrentSchedule } from '../../controllers/scheduleController';

// Add the route
app.get('/api/schedules/current', requireAuth, getCurrentSchedule);
```

## Root Cause
The test suite was designed to have isolated route definitions for better test control, but this creates maintenance overhead and consistency issues.

## Recommended Fix (Future)
Refactor tests to use the main `src/routes.ts` file directly:

```typescript
// Better approach - use actual production routes
import routes from '../../routes';
export const testApp = routes;
```

## Current Workaround
Until the architecture is fixed, **always remember to update both route files** when adding new endpoints.

---
**Created**: After discovering getCurrentSchedule test failures due to missing route in testApp.ts  
**Priority**: High - affects all new endpoint development