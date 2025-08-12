# Scheduler App - Quick Start Guide

## Current Status (What Works)

✅ **Working Now**:
- React frontend with authentication flow
- Role-based header menus (Operations, Manager, Personnel)
- People page with basic UI
- Backend API with user authentication
- Database schema with all tables

❌ **Current Issue**: 
- Creating categories fails because there's no "current schedule" context
- The app needs a foundational schedule to operate

## The Solution: Bootstrap with Schedule Context

The legacy system always operates within a "current schedule" context. We need to:

1. **Create seed data** - Default schedule with days/areas/categories
2. **Add schedule context** - Current schedule state in the frontend
3. **Fix category creation** - Include scheduleId from context

## Quick Implementation (2 hours)

### Step 1: Create Foundation Data (30 min)
```bash
# Navigate to new-app directory
cd new-app

# Create the seed file (if it doesn't exist)
touch backend/prisma/seed.ts

# Add seed script to backend/package.json:
# "prisma": { "seed": "ts-node prisma/seed.ts" }

# Run the seed to create default schedule
npm run prisma -- db seed
```

### Step 2: Add Schedule Context (1 hour)
```bash
# Create schedule store
touch frontend/src/store/scheduleStore.ts

# Add current schedule API endpoint
# Edit backend/src/routes.ts to add:
# app.get('/api/schedules/current', requireAuth, asyncHandler(scheduleController.getCurrentSchedule))
```

### Step 3: Fix Category Creation (30 min)
```bash
# Update categories service to include scheduleId
# Edit frontend/src/services/categories.ts
# Include scheduleId from schedule store context
```

## File Locations

### Essential Documents:
- **`CLAUDE.md`** - Main project instructions  
- **`MINIMUM_VIABLE_SCHEDULE_PLAN.md`** - Detailed implementation plan
- **`SCHEDULE_CONTEXT_REQUIREMENTS.md`** - Architecture analysis
- **`frontend/CLAUDE.md`** - Frontend development guide
- **`backend/CLAUDE.md`** - Backend development guide

### Implementation Files:
- **`backend/prisma/seed.ts`** - Create foundational schedule data
- **`frontend/src/store/scheduleStore.ts`** - Schedule context management
- **`backend/src/controllers/scheduleController.ts`** - Schedule API endpoints

## Development Commands

```bash
# Start development (both frontend and backend)
npm run dev

# Start individual services
npm run dev:backend    # API server on :3000
npm run dev:frontend   # React app on :5174

# Database operations
npm run prisma -- studio          # Visual database browser
npm run prisma -- db seed         # Create seed data
npm run prisma -- generate        # Regenerate Prisma client
```

## Testing the Fix

After implementing the schedule context:

1. **Login to the app** (operations user)
2. **Check header** - Should show current schedule name
3. **Try creating a category** - Should work without errors
4. **View people page** - Should show people grouped by category

## Next Steps After Fix

1. **Schedule Management UI** - Create/switch schedules
2. **Area Management** - Add areas to schedules
3. **Shift Creation** - Create time blocks in areas
4. **Assignment System** - Assign people to shifts

## Architecture Overview

```
Schedule (foundation)
├── Days (7 standard days)
├── Areas (work locations)  
├── Categories (people types)
├── People Assignments (person + category in schedule)
├── Shifts (time blocks in areas on days)
└── Assignments (people assigned to shifts)
```

**Key Insight**: Everything belongs to a schedule. The frontend needs a "current schedule" context to operate, just like the legacy system's session-based schedule.

## Getting Help

- **Implementation Details**: See `MINIMUM_VIABLE_SCHEDULE_PLAN.md`
- **Architecture Questions**: See `SCHEDULE_CONTEXT_REQUIREMENTS.md`  
- **Frontend Issues**: See `frontend/CLAUDE.md`
- **Backend Issues**: See `backend/CLAUDE.md`

---

**Goal**: Fix category creation in 2 hours, then build out full schedule management system incrementally.