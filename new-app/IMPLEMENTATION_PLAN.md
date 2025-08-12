# Schedule Context Implementation Plan

## Immediate Action Items (Fix Current Bug)

### 1. Create Schedule Store (30 minutes)
**File**: `frontend/src/store/scheduleStore.ts`
- Basic Zustand store with current schedule
- Load latest schedule on app init
- Persist to localStorage

### 2. Update Categories Service (15 minutes)  
**File**: `frontend/src/services/categories.ts`
- Inject scheduleId from schedule store
- Handle missing schedule context error

### 3. Add Current Schedule API (45 minutes)
**File**: `backend/src/controllers/scheduleController.ts`  
- `GET /api/schedules/current` endpoint
- Return latest published schedule
- Include permission flags

### 4. Initialize Schedule Context in App (15 minutes)
**File**: `frontend/src/App.tsx`
- Load current schedule on app start
- Handle loading states

**Total Time**: ~2 hours to fix immediate category creation bug

## Phase 1: Core Schedule Context (1-2 days)

### Day 1: Backend Foundation
1. **Schedule Context API** (2-3 hours)
   - Current schedule endpoint
   - Schedule switching endpoint  
   - Schedule list endpoint
   - Permission validation

2. **Update Categories Controller** (1 hour)
   - Require scheduleId in create/update
   - Validate schedule permissions
   - Return schedule-scoped categories

3. **Database Seeding** (1 hour)
   - Create sample schedules
   - Create sample categories per schedule
   - Create sample people assignments

### Day 2: Frontend Integration  
1. **Schedule Context Provider** (2 hours)
   - React context for schedule state
   - Schedule switching logic
   - Error boundaries for missing context

2. **Header Updates** (1-2 hours)
   - Display current schedule name
   - Add schedule switcher (operations only)
   - Update styling and layout

3. **Update All Forms** (2 hours)
   - Categories form (already identified)
   - People forms (add scheduleId context)
   - Other schedule-dependent operations

## Phase 2: Schedule-Scoped Operations (3-5 days)

### People Management Overhaul
1. **Backend People Controller** (1 day)
   - Schedule-scoped people listing
   - Retire/restore functionality  
   - People-schedule assignment logic
   - Cross-schedule person management

2. **Frontend People Components** (1 day)
   - Update people list to show by category
   - Add retire/restore buttons
   - Handle schedule context in all operations

3. **People Selection Logic** (1 day)
   - "View Schedule" shows current schedule people
   - Group by category display
   - Handle empty categories

### Category Management  
1. **Schedule-Scoped Categories** (0.5 days)
   - Category CRUD within schedule context
   - Category reordering within schedule
   - Category deletion validation

2. **Cross-Schedule Category Features** (0.5 days)
   - Copy categories between schedules
   - Category templates
   - Import/export categories

## Phase 3: Advanced Schedule Features (1-2 weeks)

### Schedule Management UI
1. **Schedule Selection Page** (2-3 days)
   - List all schedules (published/draft)
   - Schedule creation form
   - Schedule copying functionality
   - Schedule deletion (with validation)

2. **Schedule Switcher Component** (1 day)
   - Dropdown in header
   - Recent schedules
   - Quick switching
   - Search/filter schedules

### Advanced Features
1. **Schedule Templates** (2-3 days)
   - Save schedule as template
   - Create from template
   - Template management UI

2. **Cross-Schedule Operations** (2-3 days)
   - Copy people between schedules
   - Compare schedules
   - Merge schedule features

## Implementation Approach

### Immediate Fix (Today)
```bash
# 1. Create schedule store
touch frontend/src/store/scheduleStore.ts

# 2. Add current schedule API  
# Add to backend/src/routes.ts:
# app.get('/api/schedules/current', requireAuth, asyncHandler(scheduleController.getCurrentSchedule))

# 3. Update categories service
# Modify frontend/src/services/categories.ts to include scheduleId

# 4. Test category creation
```

### Development Workflow
1. **Backend First**: Always implement API endpoints before frontend
2. **Incremental**: One feature at a time, fully tested
3. **Schedule Context**: Every new feature must consider schedule context
4. **Backwards Compatible**: Don't break existing functionality

### Testing Strategy
1. **Unit Tests**: Store, context, and API functions
2. **Integration Tests**: Schedule switching workflows  
3. **Manual Testing**: Full user workflows in different roles

## Rollout Plan

### Week 1: Critical Fix
- [ ] Schedule context infrastructure
- [ ] Fix category creation bug
- [ ] Basic schedule display in UI

### Week 2: Core Features
- [ ] People management with schedule context
- [ ] Schedule switching for operations
- [ ] Complete schedule-scoped CRUD operations

### Week 3-4: Advanced Features  
- [ ] Schedule management UI
- [ ] Schedule creation and copying
- [ ] Cross-schedule features

## Success Metrics

### Immediate Success (End of Day 1)
- [ ] Categories can be created without errors
- [ ] Current schedule is displayed in header
- [ ] No console errors related to schedule context

### Phase 1 Success (End of Week 1)
- [ ] All operations work within schedule context
- [ ] Schedule switching works for operations users
- [ ] People operations are schedule-scoped
- [ ] No breaking changes to existing functionality

### Final Success (End of Month)
- [ ] Feature parity with legacy system
- [ ] Full schedule management capabilities
- [ ] Intuitive user experience
- [ ] Performance better than legacy system

## Risk Management

### Technical Risks
- **Data migration**: Ensure existing data maps correctly to new schema
- **Performance**: Schedule context shouldn't slow down operations
- **State management**: Avoid schedule context getting out of sync

### User Experience Risks  
- **Confusion**: Clear indication of current schedule context
- **Lost work**: Handle schedule switching gracefully
- **Permissions**: Proper role-based access to schedule features

### Mitigation Strategies
- Extensive testing with real data
- Gradual rollout with feature flags
- User training and documentation
- Rollback plan for each phase

---

**Next Action**: Begin immediate fix implementation starting with schedule store creation.