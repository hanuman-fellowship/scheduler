# Minimum Viable Schedule (MVS) Implementation Plan

## ✅ **Status: Phase 1 & 2 Complete - Schedule Context Working**

From legacy system analysis, a **minimum viable schedule** requires:

### Core Required Entities (in dependency order):

1. **✅ Schedule** - The container (`id`, `name`, `userId`, etc.) - **IMPLEMENTED**
2. **✅ Days** - 7 days (Sunday-Saturday) linked to schedule - **IMPLEMENTED**
3. **✅ Areas** - Work locations linked to schedule - **IMPLEMENTED**
4. **✅ Categories** - People categories linked to schedule - **IMPLEMENTED**
5. **✅ People** - Person records + assignments to schedule/category - **INFRASTRUCTURE READY**
6. **🔄 Shifts** - Time blocks in areas on specific days - **NEXT TO IMPLEMENT**
7. **🔄 Assignments** - People assigned to specific shifts - **NEXT TO IMPLEMENT**

### ✅ **Legacy System Baseline Data: IMPLEMENTED**

```sql
-- Published schedule (schedule_id = 1) - ✅ CREATED
-- Standard 7 days - ✅ CREATED
-- Kitchen area - ✅ CREATED
-- Residents category - ✅ CREATED
-- Admin user with operations role - ✅ CREATED
```

## ✅ **Implementation Status: Phase 1 & 2 Complete**

### ✅ **Phase 1: Seed Data & Infrastructure (COMPLETED)**

**Goal**: Create the foundation data that every schedule needs - **✅ DONE**

#### ✅ **1.1 Database Seeding (COMPLETED)**

**Files**: `backend/src/seed.ts` - **✅ IMPLEMENTED**

- ✅ Default published schedule created
- ✅ 7 standard days created (Sunday-Saturday, ISO week format)
- ✅ Kitchen area created
- ✅ Residents category created
- ✅ Admin user with operations role

#### ✅ **1.2 Schedule Context Implementation (COMPLETED)**

**Objective**: Fix the immediate category creation bug - **✅ RESOLVED**

**Files Created/Updated**:

- ✅ `frontend/src/store/scheduleStore.ts` - Schedule context store
- ✅ `backend/src/controllers/scheduleController.ts` - Current schedule API
- ✅ `frontend/src/services/categories.ts` - ScheduleId automatically included

### ✅ **Phase 2: Basic Schedule Operations (COMPLETED)**

**Goal**: Enable creating areas, categories, people, and viewing them - **✅ DONE**

#### ✅ **2.1 Schedule Management UI (COMPLETED)**

- ✅ Current schedule displays in header
- ✅ Schedule context loads on app startup
- ✅ Schedule store with localStorage persistence

#### ✅ **2.2 Area Management (COMPLETED)**

- ✅ Areas can be created within current schedule
- ✅ Kitchen area seeded and working
- ✅ Areas list view with schedule context

#### ✅ **2.3 People & Categories (COMPLETED)**

- ✅ Category creation bug fixed (automatically includes scheduleId)
- ✅ People can be added to current schedule with category assignment
- ✅ People list grouped by category (infrastructure ready)

## 🔄 **Phase 3: Shift Creation & Assignment (NEXT TO IMPLEMENT)**

**Goal**: Enable actual schedule building

#### 🔄 **3.1 Shift Management**

- Create shifts: area + day + time range
- Shift grid view (areas × days)
- Edit/delete shifts

#### 🔄 **3.2 Assignment System**

- Assign people to shifts
- Basic conflict detection
- Visual assignment interface

## ✅ **Detailed Implementation Status**

### ✅ **Immediate Actions (COMPLETED)**

#### ✅ **Step 1: Create Seed Data (COMPLETED)**

```bash
# ✅ Seed file exists and working
# ✅ Run: npm run prisma -- db seed
# ✅ Creates: Published schedule, 7 days, Kitchen area, Residents category
```

#### ✅ **Step 2: Schedule Store & Context (COMPLETED)**

```typescript
// ✅ frontend/src/store/scheduleStore.ts - IMPLEMENTED
interface ScheduleStore {
  currentSchedule: Schedule | null;
  isLoading: boolean;
  setCurrentSchedule: (schedule: Schedule) => void;
  loadCurrentSchedule: () => Promise<void>;
}

// ✅ Loads published schedule on app init
// ✅ Persists to localStorage
```

#### ✅ **Step 3: Current Schedule API (COMPLETED)**

```typescript
// ✅ backend/src/controllers/scheduleController.ts - IMPLEMENTED
export const getCurrentSchedule = async (req: AuthRequest, res: Response) => {
  // ✅ Returns the published schedule (or user's current schedule)
  // ✅ Includes: id, name, isEditable, areas, categories, days
};
```

#### ✅ **Step 4: Fix Categories (COMPLETED)**

```typescript
// ✅ frontend/src/services/categories.ts - FIXED
// ✅ Categories controller automatically includes scheduleId
// ✅ No more "missing schedule context" errors
```

## ✅ **Current Working Status**

### ✅ **Schedule Creation Workflow (INFRASTRUCTURE READY)**

1. **✅ Create Schedule** → `POST /api/schedules { name: "New Schedule" }`
2. **✅ Auto-create Days** → Backend creates 7 standard days
3. **✅ Switch to New Schedule** → Set as current schedule context
4. **✅ Add Areas** → `POST /api/areas { name: "ICU", shortName: "ICU" }`
5. **✅ Add Categories** → `POST /api/categories { name: "Residents", color: "#FF0000" }`
6. **✅ Add People** → `POST /api/people { first: "John", last: "Doe", categoryId: 1 }`
7. **🔄 Create Shifts** → `POST /api/shifts { areaId: 1, dayId: 1, start: "07:00", end: "19:00" }`
8. **🔄 Make Assignments** → `POST /api/assignments { shiftId: 1, personId: 1 }`

## ✅ **Database Schema Dependencies (IMPLEMENTED)**

```
Schedule (✅ root entity working)
├── Days (✅ 7 standard days, Sunday-Saturday, auto-created)
├── Areas (✅ created by operations, working)
├── ResidentCategories (✅ created by operations, working)
├── PeopleSchedules (✅ people assigned to categories in this schedule)
├── Shifts (🔄 time blocks in areas on days - NEXT)
└── Assignments (🔄 people assigned to shifts - NEXT)
```

### ✅ **Critical Relationships (IMPLEMENTED)**:

- **✅ Everything** belongs to a Schedule (scheduleId foreign key)
- **✅ Days** are standard (Sun-Sat, ISO week format) but schedule-specific
- **✅ People** are global, but **PeopleSchedules** are schedule-specific
- **✅ Shifts** link Area + Day + Time (infrastructure ready)
- **✅ Assignments** link Shift + Person (infrastructure ready)

## ✅ **User Workflow: Creating First Schedule (INFRASTRUCTURE READY)**

### ✅ **Operations User Journey (READY)**:

1. **✅ Login** → Sees "Published" schedule (with sample data)
2. **✅ Create New Schedule** → "January 2025 Schedule" (infrastructure ready)
3. **✅ Add Areas** → "ICU", "Emergency", "General Ward" (infrastructure ready)
4. **✅ Add Categories** → "Residents", "Attendings", "Nurses" (infrastructure ready)
5. **✅ Add People** → Assign each person to a category (infrastructure ready)
6. **🔄 Create Shifts** → Define time blocks for each area/day (NEXT)
7. **🔄 Make Assignments** → Assign people to specific shifts (NEXT)
8. **🔄 Preview Schedule** → See the complete schedule grid (NEXT)
9. **🔄 Publish Schedule** → Make it the active "Published" schedule (NEXT)

### 🔄 **Manager User Journey (NEXT)**:

1. **🔄 Login** → Sees published schedule for their areas
2. **🔄 Create Request** → Copy published schedule as draft
3. **🔄 Modify Assignments** → Within their assigned areas only
4. **🔄 Submit Request** → Send to operations for approval

## ✅ **Success Criteria**

### ✅ **Phase 1 Complete (COMPLETED)**:

- ✅ Seed data creates working schedule with days/areas/categories
- ✅ Current schedule displays in header
- ✅ Categories can be created without errors
- ✅ People can be added to current schedule

### ✅ **Phase 2 Complete (COMPLETED)**:

- ✅ New schedules can be created (infrastructure ready)
- ✅ Areas can be added/edited per schedule
- ✅ People management works with schedule context
- ✅ Schedule switching works for operations

### 🔄 **Phase 3 Complete (NEXT)**:

- 🔄 Shifts can be created in areas on specific days
- 🔄 People can be assigned to shifts
- 🔄 Basic schedule grid view shows assignments
- 🔄 End-to-end schedule creation workflow works

## ✅ **File Creation Checklist**

### ✅ **Backend (COMPLETED)**:

- ✅ `src/seed.ts` - Seed default schedule/days/areas/categories
- ✅ `src/controllers/scheduleController.ts` - Schedule CRUD + current schedule
- ✅ `src/routes.ts` - All schedule routes configured
- ✅ `src/controllers/categoriesController.ts` - Auto-includes schedule context

### ✅ **Frontend (COMPLETED)**:

- ✅ `src/store/scheduleStore.ts` - Schedule context management
- ✅ `src/App.tsx` - Loads current schedule on startup
- ✅ All components have access to schedule context

### 🔄 **Testing (NEXT)**:

- 🔄 Seed script runs successfully (✅ DONE)
- 🔄 Schedule context loads on app start (✅ DONE)
- 🔄 All CRUD operations include schedule context (✅ DONE)
- 🔄 End-to-end schedule creation workflow (NEXT)

---

**Current Status**: ✅ **Phase 1 & 2 Complete - Schedule Context System Working**  
**Next Action**: Implement Phase 3 (shifts and assignments) on top of the solid foundation
