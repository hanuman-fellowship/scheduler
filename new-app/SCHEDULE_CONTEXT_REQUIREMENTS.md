# Schedule Context Requirements & Implementation Plan

## Overview

Based on analysis of the legacy CakePHP system, the scheduler application operates with a **current schedule context** that affects all operations. This document outlines the requirements and implementation plan for the new system.

## Core Concept: Current Schedule Context

### Legacy System Behavior
- Every request loads the "latest published schedule" into session (`app_controller.php:27-28`)
- All operations happen within the context of this current schedule
- Schedule ID is globally available via `setScheduleId($this->Session->read('Schedule.id'))`
- UI shows current schedule name and allows operations within that context

### Key Insight
**People and categories are schedule-scoped, not global entities.**

## Data Model Understanding

### 1. People Management
```
people (global person registry)
├── id, first, last, display_name
└── Basic person information only

people_schedules (schedule-specific assignments)  
├── person_id → links to people.id
├── schedule_id → which schedule  
├── resident_category_id → role/category in this schedule
└── notes → schedule-specific notes
```

**Implications:**
- A person can exist in multiple schedules with different categories
- "Adding a person" = creating person record + adding them to current schedule
- "Retiring a person" = removing from current schedule (person record remains)
- "Restoring a person" = adding back to current schedule
- "View People" = show people active in current schedule only

### 2. Category Management
```
resident_categories
├── id, name, color, sort_order
└── schedule_id (NOT NULL) → categories belong to specific schedules
```

**Implications:**
- Categories are schedule-specific, not global
- Each schedule can have its own set of categories
- Creating a category requires current schedule context

### 3. Schedule Operations
- All CRUD operations are implicitly scoped to current schedule
- Schedule switching changes the entire operational context
- UI operations assume current schedule context exists

## Implementation Requirements

### Phase 1: Current Schedule Context (CRITICAL)

#### 1.1 Frontend Schedule Context
**Location**: `src/store/scheduleStore.ts` (new)

```typescript
interface ScheduleStore {
  currentSchedule: Schedule | null
  setCurrentSchedule: (schedule: Schedule) => void
  clearCurrentSchedule: () => void
}

interface Schedule {
  id: number
  name: string
  isPublished: boolean
  isEditable: boolean
  userId: number
  updatedAt: string
}
```

**Requirements:**
- Load "latest published schedule" on app initialization
- Store in Zustand with localStorage persistence
- Provide current schedule context to all components
- Handle schedule switching functionality

#### 1.2 Schedule Context Provider
**Location**: `src/contexts/ScheduleContext.tsx` (new)

```typescript
interface ScheduleContextType {
  currentSchedule: Schedule | null
  isLoading: boolean
  switchSchedule: (scheduleId: number) => Promise<void>
  refreshSchedule: () => Promise<void>
}
```

**Requirements:**
- Wrap main app with schedule context
- Redirect to schedule selection if no current schedule
- Handle schedule validation and refresh

#### 1.3 Backend Current Schedule Endpoint
**Location**: `src/controllers/scheduleController.ts`

```typescript
// GET /api/schedules/current - get current/latest schedule
// POST /api/schedules/current - set current schedule (operations only)
```

**Requirements:**
- Return latest published schedule by default
- Allow operations users to switch current schedule
- Include schedule permissions (editable, etc.)

### Phase 2: Schedule-Scoped Operations

#### 2.1 Update Categories API
**Current Issue**: Frontend sends `{name, color}`, backend expects `{name, color, scheduleId}`

**Solution**: Use current schedule context

**Frontend Changes**:
```typescript
// src/services/categories.ts
export const categoriesService = {
  async createCategory(category: CreateCategoryRequest): Promise<Category> {
    const currentSchedule = useScheduleStore.getState().currentSchedule
    if (!currentSchedule) throw new Error('No current schedule')
    
    const { data } = await api.post('/categories', {
      ...category,
      scheduleId: currentSchedule.id
    })
    return data
  }
}
```

**Backend Changes**:
```typescript
// src/controllers/categoriesController.ts
export const create = async (req: AuthRequest, res: Response) => {
  // Extract scheduleId from request body (sent by frontend)
  // OR get from current user's session/context
  // Validate user has permission for this schedule
}
```

#### 2.2 Update People API
**Current Issue**: People operations don't consider schedule context

**Requirements**:
- `GET /api/people` → return people in current schedule only
- `POST /api/people` → create person + add to current schedule  
- `PUT /api/people/:id/retire` → remove from current schedule
- `PUT /api/people/:id/restore` → add back to current schedule

#### 2.3 Schedule-Scoped UI Components

**Header Updates**:
- Show current schedule name
- Add schedule switcher dropdown (operations only)
- Update menu items to be schedule-aware

**People Page Updates**:
- Show people grouped by category (current schedule)
- Add/retire/restore operations work on current schedule
- Category management works on current schedule

### Phase 3: Advanced Schedule Features

#### 3.1 Schedule Selection UI
- Schedule list/grid view
- Published vs. in-progress schedules
- Schedule creation and copying
- Permission-based access

#### 3.2 Schedule Switching
- Seamless context switching
- Preserve user's place in workflow
- Handle permission changes when switching

#### 3.3 Multi-Schedule Workflows
- Copy people/categories between schedules
- Template system for schedule creation
- Cross-schedule reporting

## Implementation Priority

### Immediate (Blocking)
1. **Schedule Store & Context** - Required for any schedule-scoped operations
2. **Current Schedule API** - Backend support for schedule context
3. **Fix Categories Bug** - Include scheduleId in category creation
4. **Header Schedule Display** - Show current schedule context

### Short Term (1-2 weeks)
1. **Schedule-Scoped People Operations** - Retire/restore functionality
2. **Schedule Switcher** - UI for changing current schedule
3. **People List by Category** - Proper schedule-scoped people view

### Medium Term (2-4 weeks)
1. **Schedule Selection UI** - Full schedule management
2. **Schedule Creation/Copying** - Advanced schedule operations
3. **Cross-Schedule Features** - Templates and copying

## Migration Strategy

### Step 1: Add Schedule Context (Non-Breaking)
- Add schedule store and context without changing existing APIs
- Load default/latest schedule in context
- Update components to use schedule context

### Step 2: Update APIs (Gradual)
- Update one API at a time to be schedule-aware
- Maintain backwards compatibility where possible
- Test thoroughly with schedule context

### Step 3: Full Schedule Features
- Add schedule switching UI
- Implement advanced schedule management
- Complete schedule-scoped operations

## Testing Strategy

### Unit Tests
- Schedule store operations
- Schedule context provider
- Schedule-scoped API calls

### Integration Tests
- Schedule switching workflows
- Category/people operations in different schedules
- Permission validation across schedules

### User Acceptance Tests
- Operations user: switch between schedules, manage all features
- Manager user: work within assigned schedule context
- Personnel user: view schedule-appropriate information

## Success Criteria

### Phase 1 Complete When:
- [ ] Current schedule is displayed in header
- [ ] Categories can be created (with schedule context)
- [ ] People operations work within current schedule
- [ ] No "schedule context missing" errors

### Phase 2 Complete When:
- [ ] Schedule switching works for operations users
- [ ] All CRUD operations are properly schedule-scoped
- [ ] People can be retired/restored from schedules
- [ ] Category management is schedule-aware

### Phase 3 Complete When:
- [ ] Full schedule management UI implemented
- [ ] Schedule creation and copying works
- [ ] Cross-schedule workflows implemented
- [ ] Feature parity with legacy system achieved

## Risk Mitigation

### Data Integrity
- Validate schedule permissions on all operations
- Prevent cross-schedule data leakage
- Ensure referential integrity in schedule-scoped data

### User Experience
- Clear indication of current schedule context
- Graceful handling of missing schedule context
- Intuitive schedule switching workflow

### Performance
- Efficient schedule context loading
- Minimize API calls when switching schedules
- Cache schedule-scoped data appropriately

---

**Next Step**: Implement Phase 1 - Schedule Context Infrastructure