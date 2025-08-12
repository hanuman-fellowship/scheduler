# Minimum Viable Schedule (MVS) Implementation Plan

## Key Discovery: What Makes a Working Schedule

From legacy system analysis, a **minimum viable schedule** requires:

### Core Required Entities (in dependency order):
1. **Schedule** - The container (`id`, `name`, `userId`, etc.)
2. **Days** - 7 days (Monday-Sunday) linked to schedule
3. **Areas** - Work locations linked to schedule  
4. **Categories** - People categories linked to schedule
5. **People** - Person records + assignments to schedule/category
6. **Shifts** - Time blocks in areas on specific days
7. **Assignments** - People assigned to specific shifts

### Legacy System Baseline Data:
```sql
-- Published schedule (schedule_id = -1)
INSERT INTO schedules VALUES(-1, 'Published', NULL, '2010-08-04', NULL, 1);

-- Standard 7 days
INSERT INTO days VALUES(1, 'Monday', -1);
INSERT INTO days VALUES(2, 'Tuesday', -1);
... (through Sunday)

-- Areas are added by operations as needed
-- Categories are added by operations as needed  
-- People are added and assigned to categories
-- Shifts are created in areas on specific days
-- Assignments link people to shifts
```

## Implementation Strategy: Bootstrap Approach

### Phase 1: Seed Data & Infrastructure (Day 1)
**Goal**: Create the foundation data that every schedule needs

#### 1.1 Database Seeding (2 hours)
**Files**: `backend/prisma/seed.ts`

```typescript
// Create default published schedule
const publishedSchedule = await prisma.schedule.create({
  data: {
    name: 'Published',
    userId: null, // Published schedules have no owner
    request: 0,
    template: false
  }
})

// Create standard 7 days for this schedule
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
for (let i = 0; i < days.length; i++) {
  await prisma.day.create({
    data: {
      name: days[i],
      scheduleId: publishedSchedule.id,
      dayOfWeek: i + 1 // 1=Sunday in legacy, but we'll use 1=Monday
    }
  })
}

// Create sample areas
await prisma.area.create({
  data: {
    name: 'General Ward',
    shortName: 'GW',
    scheduleId: publishedSchedule.id
  }
})

// Create sample categories
await prisma.residentCategory.create({
  data: {
    name: 'Residents',
    color: '#4ECDC4',
    sortOrder: 1,
    scheduleId: publishedSchedule.id
  }
})
```

#### 1.2 Schedule Context Implementation (3 hours)
**Objective**: Fix the immediate category creation bug

**Files to Create/Update**:
- `frontend/src/store/scheduleStore.ts` - Schedule context store
- `backend/src/controllers/scheduleController.ts` - Current schedule API
- `frontend/src/services/categories.ts` - Include scheduleId from context

### Phase 2: Basic Schedule Operations (Day 2-3)
**Goal**: Enable creating areas, categories, people, and viewing them

#### 2.1 Schedule Management UI (1 day)
- Display current schedule in header
- Basic schedule switcher (operations only)
- "Create New Schedule" functionality

#### 2.2 Area Management (0.5 days)
- Add/edit/delete areas within current schedule
- Areas list view with schedule context

#### 2.3 People & Categories (0.5 days)  
- Fix category creation (already planned)
- Add people to current schedule with category assignment
- People list grouped by category

### Phase 3: Shift Creation & Assignment (Day 4-5)
**Goal**: Enable actual schedule building

#### 3.1 Shift Management (1 day)
- Create shifts: area + day + time range
- Shift grid view (areas × days)
- Edit/delete shifts

#### 3.2 Assignment System (1 day)
- Assign people to shifts
- Basic conflict detection
- Visual assignment interface

## Detailed Implementation Plan

### Immediate Actions (Today)

#### Step 1: Create Seed Data (30 minutes)
```bash
# Create/update the seed file
touch backend/prisma/seed.ts

# Add to package.json if not present:
# "prisma": {
#   "seed": "ts-node prisma/seed.ts"
# }

# Run the seed
npm run prisma -- db seed
```

#### Step 2: Schedule Store & Context (1 hour)
```typescript
// frontend/src/store/scheduleStore.ts
interface ScheduleStore {
  currentSchedule: Schedule | null
  isLoading: boolean
  setCurrentSchedule: (schedule: Schedule) => void
  loadCurrentSchedule: () => Promise<void>
}

// Load published schedule on app init
// Persist to localStorage
```

#### Step 3: Current Schedule API (45 minutes)
```typescript
// backend/src/controllers/scheduleController.ts
export const getCurrentSchedule = async (req: AuthRequest, res: Response) => {
  // Return the published schedule (or user's current schedule)
  // Include: id, name, isEditable, areas, categories, days
}
```

#### Step 4: Fix Categories (15 minutes)
```typescript
// frontend/src/services/categories.ts  
export const categoriesService = {
  async createCategory(category: CreateCategoryRequest): Promise<Category> {
    const currentSchedule = useScheduleStore.getState().currentSchedule
    if (!currentSchedule) throw new Error('No current schedule selected')
    
    const { data } = await api.post('/categories', {
      ...category,
      scheduleId: currentSchedule.id
    })
    return data
  }
}
```

### Schedule Creation Workflow

#### Minimum Viable Schedule Creation:
1. **Create Schedule** → `POST /api/schedules { name: "New Schedule" }`
2. **Auto-create Days** → Backend creates 7 standard days
3. **Switch to New Schedule** → Set as current schedule context
4. **Add Areas** → `POST /api/areas { name: "ICU", shortName: "ICU" }`
5. **Add Categories** → `POST /api/categories { name: "Residents", color: "#FF0000" }`
6. **Add People** → `POST /api/people { first: "John", last: "Doe", categoryId: 1 }`
7. **Create Shifts** → `POST /api/shifts { areaId: 1, dayId: 1, start: "07:00", end: "19:00" }`
8. **Make Assignments** → `POST /api/assignments { shiftId: 1, personId: 1 }`

## Database Schema Dependencies

```
Schedule (root entity)
├── Days (7 standard days, auto-created)
├── Areas (created by operations)
├── ResidentCategories (created by operations)  
├── PeopleSchedules (people assigned to categories in this schedule)
├── Shifts (time blocks in areas on days)
└── Assignments (people assigned to shifts)
```

### Critical Relationships:
- **Everything** belongs to a Schedule (scheduleId foreign key)
- **Days** are standard (Mon-Sun) but schedule-specific
- **People** are global, but **PeopleSchedules** are schedule-specific
- **Shifts** link Area + Day + Time
- **Assignments** link Shift + Person

## User Workflow: Creating First Schedule

### Operations User Journey:
1. **Login** → Sees "Published" schedule (empty or with sample data)
2. **Create New Schedule** → "January 2025 Schedule"
3. **Add Areas** → "ICU", "Emergency", "General Ward"  
4. **Add Categories** → "Residents", "Attendings", "Nurses"
5. **Add People** → Assign each person to a category
6. **Create Shifts** → Define time blocks for each area/day
7. **Make Assignments** → Assign people to specific shifts
8. **Preview Schedule** → See the complete schedule grid
9. **Publish Schedule** → Make it the active "Published" schedule

### Manager User Journey:
1. **Login** → Sees published schedule for their areas
2. **Create Request** → Copy published schedule as draft
3. **Modify Assignments** → Within their assigned areas only
4. **Submit Request** → Send to operations for approval

## Success Criteria

### Phase 1 Complete (End of Day 1):
- [ ] Seed data creates working schedule with days/areas/categories
- [ ] Current schedule displays in header
- [ ] Categories can be created without errors
- [ ] People can be added to current schedule

### Phase 2 Complete (End of Day 3):
- [ ] New schedules can be created
- [ ] Areas can be added/edited per schedule
- [ ] People management works with schedule context
- [ ] Schedule switching works for operations

### Phase 3 Complete (End of Day 5):
- [ ] Shifts can be created in areas on specific days
- [ ] People can be assigned to shifts
- [ ] Basic schedule grid view shows assignments
- [ ] End-to-end schedule creation workflow works

## File Creation Checklist

### Backend:
- [ ] `prisma/seed.ts` - Seed default schedule/days/areas/categories
- [ ] `src/controllers/scheduleController.ts` - Schedule CRUD + current schedule
- [ ] Update `src/routes.ts` - Add schedule routes
- [ ] Update categories/people controllers - Include schedule context

### Frontend:
- [ ] `src/store/scheduleStore.ts` - Schedule context management
- [ ] `src/contexts/ScheduleContext.tsx` - React context provider  
- [ ] `src/components/schedule/` - Schedule management components
- [ ] `src/components/shifts/` - Shift creation components
- [ ] Update Header.tsx - Show current schedule + switcher

### Testing:
- [ ] Seed script runs successfully
- [ ] Schedule context loads on app start
- [ ] All CRUD operations include schedule context
- [ ] End-to-end schedule creation workflow

---

**Next Immediate Action**: Run `npm run prisma -- db seed` to create the foundational schedule data, then implement schedule context to fix the category creation bug.