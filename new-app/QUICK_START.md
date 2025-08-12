# Scheduler App - Quick Start Guide

## Current Status (What Works)

✅ **Working Now**:

- React frontend with authentication flow
- Role-based header menus (Operations, Manager, Personnel)
- People page with basic UI
- Backend API with user authentication
- Database schema with all tables
- **✅ Schedule context system** - Current schedule loads automatically
- **✅ Category creation** - Works without errors (includes scheduleId automatically)
- **✅ Schedule store** - Zustand store with localStorage persistence
- **✅ Current schedule API** - `/api/schedules/current` endpoint working

## ✅ **Schedule Context Issue: RESOLVED**

The legacy system always operates within a "current schedule" context. **This has been implemented and is working:**

1. **✅ Seed data exists** - Default "Published" schedule with days/areas/categories
2. **✅ Schedule context implemented** - Current schedule state in frontend
3. **✅ Category creation fixed** - Automatically includes scheduleId from context

## Current Implementation Status

### **Backend (Complete)**:

- `src/seed.ts` - Creates foundational schedule data
- `src/controllers/scheduleController.ts` - Current schedule endpoint
- `src/controllers/categoriesController.ts` - Auto-includes scheduleId
- `src/routes.ts` - All schedule routes configured

### **Frontend (Complete)**:

- `src/store/scheduleStore.ts` - Schedule context management
- `src/App.tsx` - Loads current schedule on startup
- All components have access to schedule context

### **Database (Seeded)**:

- "Published" schedule (ID: 1) with 7 days (Sunday-Saturday, ISO week format)
- Kitchen area and Residents category
- Admin user with operations role

## Getting Started

### **1. Start the Application**

```bash
# Navigate to new-app directory
cd new-app

# Start both frontend and backend
npm run dev
```

### **2. Login and Test**

- **URL**: http://localhost:5174 (frontend) + http://localhost:3000 (backend)
- **Credentials**: admin / password123
- **Test**: Try creating a category - it should work without errors

### **3. Verify Schedule Context**

- Check browser console - should see current schedule loaded
- Header should show schedule context
- All operations should work within the current schedule

## File Locations

### **Essential Documents**:

- **`CLAUDE.md`** - Main project instructions
- **`MINIMUM_VIABLE_SCHEDULE_PLAN.md`** - Implementation plan (mostly complete)
- **`SCHEDULE_CONTEXT_REQUIREMENTS.md`** - Architecture analysis
- **`frontend/CLAUDE.md`** - Frontend development guide
- **`backend/CLAUDE.md`** - Backend development guide

### **Implementation Files (All Working)**:

- **`backend/src/seed.ts`** - ✅ Creates foundational schedule data
- **`frontend/src/store/scheduleStore.ts`** - ✅ Schedule context management
- **`backend/src/controllers/scheduleController.ts`** - ✅ Schedule API endpoints
- **`backend/src/controllers/categoriesController.ts`** - ✅ Auto-includes scheduleId

## Development Commands

```bash
# Start development (both frontend and backend)
npm run dev

# Start individual services
npm run dev:backend    # API server on :3000
npm run dev:frontend   # React app on :5174

# Database operations
npm run prisma -- studio          # Visual database browser
npm run prisma -- db seed         # Create seed data (already done)
npm run prisma -- generate        # Regenerate Prisma client

# Testing
npm test              # Run all tests
npm run test:coverage # Run tests with coverage
```

## Next Development Steps

With schedule context working, you can now focus on:

1. **✅ Schedule Management UI** - Create/switch schedules (infrastructure ready)
2. **✅ Area Management** - Add areas to schedules (infrastructure ready)
3. **✅ Shift Creation** - Create time blocks in areas
4. **✅ Assignment System** - Assign people to shifts

## Architecture Overview

```
Schedule (✅ Working)
├── Days (✅ 7 standard days created, Sunday-Saturday)
├── Areas (✅ Kitchen area created)
├── Categories (✅ Residents category created)
├── People Assignments (✅ Infrastructure ready)
├── Shifts (🔄 Next to implement)
└── Assignments (🔄 Next to implement)
```

**Key Insight**: ✅ **Everything belongs to a schedule and the context system is working.** The frontend automatically loads the current schedule and all operations work within that context.

## Getting Help

- **Implementation Details**: See `MINIMUM_VIABLE_SCHEDULE_PLAN.md`
- **Architecture Questions**: See `SCHEDULE_CONTEXT_REQUIREMENTS.md`
- **Frontend Issues**: See `frontend/CLAUDE.md`
- **Backend Issues**: See `backend/CLAUDE.md`

---

**Status**: ✅ **Schedule context system is fully implemented and working.** You can now focus on building the next layer of features (shifts and assignments) on top of this solid foundation.
