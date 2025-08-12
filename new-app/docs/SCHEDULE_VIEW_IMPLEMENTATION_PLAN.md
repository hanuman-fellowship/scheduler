# Schedule View Implementation Plan

## Overview
The schedule view is the core feature of the application, displaying a weekly grid format for both Area schedules (showing shifts and assignments) and People schedules (showing individual assignments). The view needs to maintain the same look and feel as the legacy system while modernizing the data flow and component architecture.

## Key Features Identified

### 1. Schedule Types
- **Area Schedule**: Shows all shifts for an area with assigned people
- **Person Schedule**: Shows all assignments for a specific person
- **Gaps Schedule**: Shows unassigned shifts that need coverage

### 2. View Modes
- **Editable Mode**: Full CRUD operations for operations role
- **Read-only Mode**: View-only for non-operations roles  
- **Request Mode**: Special mode for area managers to submit schedule requests
- **Print Mode**: Simplified view for printing

### 3. Core UI Components

#### Header Section
- Area/Person name (clickable for edit in editable mode)
- Manager name (for areas) or Total Hours (for people)
- Schedule group name (Published/In Progress)
- Request Form indicator when in request mode

#### Grid Structure
- 7 columns for days of the week (Sunday-Saturday)
- Dynamic rows based on time slots configured in bounds
- Today highlighted with background color (#FFFADC)
- Optional date display under day names
- Off days shown with strikethrough (people schedules)

#### Shift Display
- **Area shifts**: Show time range with list of assigned people
- **Person shifts**: Show area short name with time range
- **Color coding**: Based on resident categories
- **Star indicator**: Priority/important shifts
- **Hover actions**: Add/remove/unassign based on permissions

#### Bottom Sections
- Floating shifts row (shifts without specific day/time)
- Notes section (editable for operations)
- Legend (for person schedules) or Total hours (for areas)
- Navigation arrows (previous/next schedule)
- Operations/Personnel notes (for person schedules)

## Implementation Strategy

### Phase 1: Data Models & API Endpoints

#### Backend Requirements
1. **Area Schedule Endpoint**
   ```typescript
   GET /api/areas/:areaId/schedule
   Response: {
     area: Area & { shifts: Shift[] }
     bounds: ScheduleBounds
     editable: boolean
     requestId?: number
   }
   ```

2. **Person Schedule Endpoint**
   ```typescript
   GET /api/people/:personId/schedule
   Response: {
     person: Person & { assignments: Assignment[] }
     bounds: ScheduleBounds
     editable: boolean
     totalHours: HoursByDay
     notes: { operations: Note[], personnel: Note[] }
   }
   ```

3. **Gaps Schedule Endpoint**
   ```typescript
   GET /api/schedule/gaps
   Response: {
     unassignedShifts: Shift[]
     bounds: ScheduleBounds
   }
   ```

4. **Schedule Bounds Service**
   ```typescript
   interface ScheduleBounds {
     days: { [key: number]: string }
     slots: TimeSlot[]
     bounds: { [slot: string]: { [day: string]: TimeRange } }
   }
   ```

### Phase 2: Core Components

#### 1. ScheduleView Container Component
```typescript
interface ScheduleViewProps {
  type: 'area' | 'person' | 'gaps'
  id: number | 'gaps'
  mode?: 'view' | 'edit' | 'request' | 'print'
}
```
- Fetches data based on type and id
- Manages edit state and permissions
- Handles navigation between schedules

#### 2. ScheduleGrid Component
```typescript
interface ScheduleGridProps {
  bounds: ScheduleBounds
  data: AreaSchedule | PersonSchedule | GapsSchedule
  editable: boolean
  onShiftClick?: (shift: Shift) => void
  onAddShift?: (day: number, slot: string) => void
}
```
- Renders the main grid structure
- Handles hover states for add buttons
- Manages click interactions

#### 3. ScheduleHeader Component
```typescript
interface ScheduleHeaderProps {
  title: string
  subtitle?: string
  manager?: string
  totalHours?: number
  editable: boolean
  onEdit?: () => void
}
```

#### 4. ShiftCell Component
```typescript
interface ShiftCellProps {
  shifts: Shift[]
  day: number
  timeSlot: TimeSlot
  type: 'area' | 'person'
  editable: boolean
  onAdd?: () => void
  onRemove?: (shiftId: number) => void
  onAssign?: (shiftId: number) => void
}
```
- Renders shifts within a cell
- Shows add button on hover (editable mode)
- Handles assignment/unassignment actions

#### 5. FloatingShifts Component
```typescript
interface FloatingShiftsProps {
  shifts: FloatingShift[]
  editable: boolean
  onAdd?: () => void
  onEdit?: (shiftId: number) => void
  onDelete?: (shiftId: number) => void
}
```

#### 6. ScheduleNotes Component
```typescript
interface ScheduleNotesProps {
  notes: string
  editable: boolean
  onEdit?: () => void
}
```

### Phase 3: State Management

#### 1. Schedule Store (Zustand)
```typescript
interface ScheduleStore {
  currentSchedule: Schedule | null
  bounds: ScheduleBounds | null
  editable: boolean
  mode: 'view' | 'edit' | 'request' | 'print'
  
  // Actions
  loadSchedule: (type: string, id: number) => Promise<void>
  updateShift: (shift: Shift) => void
  addAssignment: (assignment: Assignment) => void
  removeAssignment: (assignmentId: number) => void
  setMode: (mode: string) => void
}
```

#### 2. React Query Integration
- Use for all data fetching
- Optimistic updates for assignments
- Cache management for schedule data
- Real-time updates via invalidation

### Phase 4: Interaction Features

#### 1. Editable Mode Features
- **Add Shift**: Click + button in cell → Open modal
- **Edit Shift**: Click shift → Open edit modal
- **Assign Person**: Click unassigned shift → Assignment modal
- **Unassign**: Click X on assignment → Confirm and remove
- **Star Shift**: Click star icon → Toggle priority
- **Edit Notes**: Click notes section → Edit modal
- **Day Off Toggle**: Click day name → Toggle off day (person schedule)

#### 2. Modal Components
- **ShiftFormModal**: Add/Edit shift details
- **AssignmentModal**: Assign person to shift
- **NotesEditModal**: Edit schedule notes
- **CategoryEditModal**: Change person's category

#### 3. Keyboard Shortcuts
- `Ctrl+H`: Show hours breakdown
- `N`: Edit notes
- `R`: View request (if available)
- `Shift+Left/Right`: Navigate schedules

### Phase 5: Visual Requirements

#### 1. Styling Specifications
```css
/* Grid Layout */
- Table width: 774px
- Cell width: 75px
- Cell height: 60px minimum
- Border: 2px solid #000

/* Colors */
- Today highlight: #FFFADC
- Request background: Watermark image
- Category colors: Dynamic from database
- Hover state: Light gray background

/* Typography */
- Headers: Bold, centered
- Shifts: Regular weight
- Time ranges: Smaller font
- Notes: Italic
```

#### 2. Responsive Considerations
- Maintain fixed width for consistency
- Horizontal scroll on mobile
- Print stylesheet for clean output
- Modal overlays for forms

### Phase 6: Permission System

#### 1. Role-Based Access
```typescript
interface Permissions {
  canEdit: boolean          // Operations role
  canViewRequests: boolean  // Operations role
  canSubmitRequests: boolean // Manager role
  canEditNotes: {
    operations: boolean     // Operations role
    personnel: boolean      // Personnel role
  }
}
```

#### 2. Conditional Rendering
- Show/hide edit buttons based on permissions
- Disable interactions in read-only mode
- Request mode special handling
- Print mode removes all interactive elements

### Phase 7: Testing Strategy

#### 1. Unit Tests
- Schedule data transformation
- Permission checking logic
- Hour calculation functions
- Date/time utilities

#### 2. Component Tests
- Grid rendering with different data
- Interaction handlers
- Modal opening/closing
- Conditional rendering based on mode

#### 3. Integration Tests
- Full schedule loading flow
- Assignment creation/deletion
- Navigation between schedules
- Mode switching

### Phase 8: Performance Optimizations

#### 1. Data Loading
- Implement pagination for large schedules
- Lazy load assignment details
- Cache schedule bounds
- Prefetch next/previous schedules

#### 2. Rendering
- Memoize expensive calculations
- Virtual scrolling for many shifts
- Debounce hover effects
- Optimize re-renders with React.memo

## Migration Approach

### Step 1: Backend Preparation
1. Create new API endpoints following RESTful patterns
2. Implement schedule bounds calculation service
3. Add permission checking middleware
4. Create data transformation utilities

### Step 2: Component Development
1. Build stateless display components first
2. Add interaction handlers incrementally
3. Implement modals and forms
4. Integrate with state management

### Step 3: Feature Parity
1. Test against legacy system
2. Ensure all interactions work identically
3. Verify permission system
4. Validate data accuracy

### Step 4: Progressive Enhancement
1. Add loading states and error handling
2. Implement optimistic updates
3. Add keyboard shortcuts
4. Enhance accessibility

## Success Criteria

### Functional Requirements
- ✅ Display area and person schedules correctly
- ✅ Support all CRUD operations in editable mode
- ✅ Maintain read-only mode for restricted users
- ✅ Handle request submission workflow
- ✅ Calculate and display hours accurately
- ✅ Support floating shifts
- ✅ Enable notes management
- ✅ Provide print-friendly view

### Non-Functional Requirements
- ✅ Match legacy UI appearance
- ✅ Maintain performance with large datasets
- ✅ Ensure accessibility standards
- ✅ Support browser back/forward navigation
- ✅ Handle errors gracefully
- ✅ Work across modern browsers

## Next Steps

1. **Immediate Priority**: Implement Schedule Bounds service and API endpoints
2. **Second Priority**: Build core ScheduleGrid component with basic display
3. **Third Priority**: Add interaction features for editable mode
4. **Fourth Priority**: Implement modal forms for CRUD operations
5. **Final Priority**: Add polish features (animations, keyboard shortcuts, etc.)

## Notes

- The legacy system uses server-side rendering with AJAX updates. The new system will use client-side rendering with React Query for data synchronization.
- Color coding is critical for usability - must maintain consistency with legacy system
- The "gaps" view is a special case that shows unassigned shifts - requires special handling
- Request workflow involves multiple states and permissions - needs careful implementation
- Print view must remove all interactive elements and maintain readable layout