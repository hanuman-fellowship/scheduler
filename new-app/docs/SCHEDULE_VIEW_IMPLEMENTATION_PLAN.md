# Schedule View Implementation Plan

## Overview

The schedule view is the core feature of the application, displaying a weekly grid format for both Area schedules (showing shifts and assignments) and People schedules (showing individual assignments). This plan is based on comprehensive analysis of the legacy CakePHP system to ensure exact compatibility and user experience preservation.

## Legacy System Analysis - Key Findings

### 1. Fixed Table Layout (CRITICAL)

The legacy system uses **exactly 774px width tables** with precise structure:

- **Total Width**: 774px (must be preserved for legacy compatibility)
- **Cell Width**: 75px per day column
- **Cell Height**: 60px minimum per time slot row
- **Border**: 2px solid black borders
- **HTML Structure**: Traditional HTML table (not CSS Grid)

### 2. Time Slot System - 3 Visual Periods

**NOT predefined slots** - uses 3 visual time periods for display purposes:

1. **"Morning"** - Until 12:00 PM
2. **"Afternoon"** - 12:00 PM to 5:00 PM
3. **"Evening"** - Starting at 5:00 PM

**Dynamic Shift Placement**: Shifts are placed based on their actual start time:

- **Morning Row**: Shows all shifts starting between 00:00:00 - 11:59:59
- **Afternoon Row**: Shows all shifts starting between 12:00:00 - 16:59:59
- **Evening Row**: Shows all shifts starting between 17:00:00 - 23:59:59

### 3. Table Row Structure (6 rows total)

1. **Day Header Row**: 1 empty cell + 7 day name cells with today highlighting (#FFFADC)
2. **3 Time Slot Rows**: Each with 1 slot name cell + 7 shift content cells
3. **Hours Summary Row** (person schedules only): Daily totals
4. **Floating Shifts Row**: Full-width spanning all columns

### 4. Shift Display Patterns

**Area Schedule Shifts**:

```html
<span class="shift" id="123">
  <b>8 - 4</b><br />
  <!-- Time range, no :00 for hours -->
  <span class="assignment">* John Doe</span><br />
  <!-- Star for priority -->
  <span class="assignment">Jane Smith</span><br />
  <span class="assignment">________</span><br />
  <!-- Unassigned placeholder -->
</span>
```

**Person Schedule Shifts**:

```html
<span class="person shift">
  <b><a>K</a></b> 8 - 4<br />
  <!-- Area short name + time -->
</span>
```

### 5. Critical CSS Classes and Styling

```css
span.shift {
  display: block;
  padding-top: 20px; /* 20px spacing between stacked shifts */
}

span.shift:first-child {
  padding-top: 0px; /* First shift has no top padding */
}

span.person.shift {
  padding: 0px; /* Person shifts have no padding */
}
```

### 6. Empty Cell Handling

- **Empty cells remain empty** - no placeholder content or lines
- **Only show content when shifts exist** in that time slot
- **Time slot filtering**: Shifts display only if start time falls within boundary range

## Schedule Types

### 1. Area Schedule

- Shows all shifts for an area with assigned people
- Displays time ranges and stacked person assignments
- Color coding by resident categories
- Interactive assignment management

### 2. Person Schedule

- Shows all assignments for a specific person across areas
- Displays area short names with time ranges
- Links to area schedules for context
- Daily hours totals

### 3. Gaps Schedule

- Shows unassigned shifts needing coverage
- Highlights gaps in red styling
- Focuses on staffing needs

## View Modes

### 1. Editable Mode (Operations Role)

- Full CRUD operations for shifts and assignments
- Hover-revealed add buttons
- Click-to-edit functionality
- Assignment management

### 2. Read-only Mode (Manager/Personnel)

- View-only access with navigation
- No edit controls visible
- Assignment viewing only

### 3. Request Mode (Managers)

- Special mode for schedule request submission
- Background watermark image
- Submit/cancel workflow

### 4. Print Mode

- Simplified layout for printing
- Removes interactive elements
- Clean table formatting

## Implementation Strategy

### Phase 1: Backend - Legacy-Compatible Data Models

#### Critical Changes Needed Based on Legacy Analysis

**1. Schedule Bounds Service - Simplified Seconds-Based System**

```typescript
interface ScheduleBounds {
  days: { [key: number]: string }; // day_id → day_name
  timePeriods: TimePeriod[]; // 3 hardcoded periods: Morning, Afternoon, Evening
}

interface TimePeriod {
  name: "Morning" | "Afternoon" | "Evening";
  startSeconds: number; // Start boundary in seconds since midnight
  endSeconds: number; // End boundary in seconds since midnight
}

// Service returns hardcoded time periods - no database lookup needed
const getScheduleBounds = async (
  scheduleId: number
): Promise<ScheduleBounds> => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      days: { orderBy: { dayOfWeek: "asc" } },
    },
  });

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  const days: { [key: number]: string } = {};
  schedule.days.forEach((day) => {
    days[day.id] = day.name;
  });

  // Hardcoded time periods - no database lookup required
  const timePeriods: TimePeriod[] = [
    { name: "Morning", startSeconds: 0, endSeconds: 43200 },
    { name: "Afternoon", startSeconds: 43200, endSeconds: 61200 },
    { name: "Evening", startSeconds: 61200, endSeconds: 86400 },
  ];

  return { days, timePeriods };
};
```

**2. Shift Filtering Logic - Seconds-Based Placement**

```typescript
// Time period constants (hardcoded for performance)
const TIME_PERIODS = [
  { name: "Morning", startSeconds: 0, endSeconds: 43200 }, // 00:00 - 12:00
  { name: "Afternoon", startSeconds: 43200, endSeconds: 61200 }, // 12:00 - 17:00
  { name: "Evening", startSeconds: 61200, endSeconds: 86400 }, // 17:00 - 24:00
] as const;

// Simple seconds-based filtering: place shifts by start time in seconds
function getShiftsForTimePeriod(
  shifts: Shift[],
  period: (typeof TIME_PERIODS)[number],
  dayId: number
): Shift[] {
  return shifts.filter(
    (shift) =>
      shift.dayId === dayId &&
      shift.start_at_seconds >= period.startSeconds &&
      shift.start_at_seconds < period.endSeconds
  );
}

// Helper to get all shifts for a day organized by time periods
function organizeShiftsByTimePeriod(
  shifts: Shift[],
  dayId: number
): { [periodName: string]: Shift[] } {
  const result: { [periodName: string]: Shift[] } = {};

  TIME_PERIODS.forEach((period) => {
    result[period.name] = getShiftsForTimePeriod(shifts, period, dayId);
  });

  return result;
}

// Utility functions for time conversion
function timeStringToSeconds(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + (seconds || 0);
}

function secondsToTimeString(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Legacy-compatible time formatting (no :00 suffix) - matches Ruby display_time method
function formatTimeFromSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  // Convert to 12-hour format without leading zero (matches Ruby %-l)
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  // Only show minutes if not :00 (matches Ruby logic)
  const displayMinute =
    minutes === 0 ? "" : `:${minutes.toString().padStart(2, "0")}`;

  return `${displayHour}${displayMinute}`;
}

// Display time range for shifts (matches Ruby display_time method)
function formatTimeRange(startAtSeconds: number, endAtSeconds: number): string {
  return `${formatTimeFromSeconds(startAtSeconds)} - ${formatTimeFromSeconds(endAtSeconds)}`;
}

/**
 * Time Display Functions - Ruby Equivalent Implementation
 *
 * Ruby original:
 * def self.display_time(time)
 *   hours = time.strftime('%-l')        # Hour without leading zero
 *   minutes = time.strftime('%M')       # Minutes
 *   hours + (minutes == '00' ? '' : ":#{minutes}")
 * end
 *
 * def display_time
 *   Shift.display_time(start_at) + " - " + Shift.display_time(end_at)
 * end
 *
 * TypeScript implementation:
 * - formatTimeFromSeconds(seconds) -> displayTime equivalent
 * - formatTimeRange(start, end) -> display_time equivalent
 *
 * Examples:
 * - formatTimeFromSeconds(30600) -> "8:30" (8:30 AM)
 * - formatTimeFromSeconds(43200) -> "12" (12:00 PM, no :00)
 * - formatTimeRange(30600, 43200) -> "8:30 - 12"
 */
```

**3. API Endpoints - Enhanced with Legacy Patterns**

#### Area Schedule Endpoint

```typescript
GET /api/areas/:areaId/schedule
Response: {
  area: Area & {
    shifts: ShiftWithAssignments[]  // Pre-populated assignments
    manager?: string
  }
  bounds: ScheduleBounds  // Simplified time-based system
  editable: boolean
  requestId?: number
  notes?: string
}
```

#### Person Schedule Endpoint

```typescript
GET /api/people/:personId/schedule
Response: {
  person: Person & {
    assignments: AssignmentWithShiftResponse[]  // Full shift details
    category: ResidentCategory  // For color coding
  }
  bounds: ScheduleBounds
  editable: boolean
  totalHours: { [dayId: string]: number }
  hoursOverall: number
  notes: {
    operations: string
    personnel: string
  }
}
```

#### Gaps Schedule Endpoint

```typescript
GET /api/schedule/gaps
Response: {
  unassignedShifts: ShiftWithAssignments[]  // Shifts with unfilled positions
  bounds: ScheduleBounds
  totalGaps: number
}
```

### Phase 2: Frontend Components - Legacy-Compatible Design

#### 1. ScheduleTable Component (NEW - Legacy Layout)

```typescript
interface ScheduleTableProps {
  bounds: ScheduleBounds; // Simplified time-based system
  data: AreaScheduleResponse | PersonScheduleResponse | GapsScheduleResponse;
  type: "area" | "person" | "gaps";
  editable: boolean;
  mode?: "view" | "edit" | "request" | "print";
}
```

**Must implement exact legacy table structure:**

- **774px fixed width** HTML table (not CSS Grid)
- **2px solid black borders**
- 7 columns (1 slot name + 6 days)
- 5 rows total: header + 3 time slots + floating shifts

#### 2. TimeSlotRow Component (NEW - Critical)

```typescript
interface TimeSlotRowProps {
  period: TimePeriod; // "Morning" | "Afternoon" | "Evening"
  bounds: ScheduleBounds;
  shifts: ShiftWithAssignments[];
  type: "area" | "person" | "gaps";
  editable: boolean;
  onShiftClick?: (shiftId: number) => void;
  onAddShift?: (dayId: number, periodName: string) => void;
}
```

**Renders one complete time slot row with:**

- Slot name cell (75px width)
- 7 day cells (75px each, 60px height)
- Today highlighting (#FFFADC background)

#### 3. ShiftCell Component (REDESIGNED)

```typescript
interface ShiftCellProps {
  shifts: ShiftWithAssignments[];
  dayId: number;
  periodName: string;
  type: "area" | "person" | "gaps";
  editable: boolean;
  isToday: boolean;
  onShiftClick?: (shiftId: number) => void;
  onAdd?: () => void;
}
```

**Must implement legacy stacking:**

- **20px padding-top** between stacked shifts (except first)
- **Empty cells stay empty** (no placeholder content)
- **span.shift blocks** for proper vertical stacking

#### 4. ShiftBlock Component (NEW - Legacy Shift Display)

```typescript
interface ShiftBlockProps {
  shift: ShiftWithAssignments;
  type: "area" | "person" | "gaps";
  isFirst: boolean; // For padding control
  editable: boolean;
  onShiftClick?: (shiftId: number) => void;
}
```

**Implements exact legacy HTML structure:**

```typescript
// Area shifts: <span class='shift'><b>time</b><br/>assignments</span>
// Person shifts: <span class='person shift'><b>area</b> time<br/></span>
```

#### 5. AssignmentList Component (NEW - Stacked Assignments)

```typescript
interface AssignmentListProps {
  assignments: Assignment[];
  numPeople: number;
  editable: boolean;
  onAssignmentClick?: (assignmentId: number) => void;
  onUnassign?: (assignmentId: number) => void;
}
```

**Displays person assignments with:**

- **Color coding** by resident category
- **Star indicators** for priority assignments
- **"**\_\_\_\_**" placeholders** for unassigned positions
- **Hover effects** for "(view)" links

#### 6. ScheduleHeader Component (REDESIGNED for Legacy)

```typescript
interface ScheduleHeaderProps {
  title: string; // Area/Person name
  subtitle?: string; // Manager name or total hours
  scheduleGroup: string; // "Published" | "In Progress"
  isRequest?: boolean; // Request mode background
  editable: boolean;
  onEdit?: () => void;
}
```

**Implements legacy header table:**

- **774px width** matching main grid
- **Request background image** when applicable
- **Bold centered text** for titles

#### 7. FloatingShiftsRow Component (NEW)

```typescript
interface FloatingShiftsRowProps {
  shifts: ShiftWithAssignments[];
  editable: boolean;
  onAdd?: () => void;
  onEdit?: (shiftId: number) => void;
  onDelete?: (shiftId: number) => void;
}
```

**Full-width row spanning all 8 columns**

#### 8. HoursSummaryRow Component (NEW - Person Schedules)

```typescript
interface HoursSummaryRowProps {
  dailyHours: { [dayId: string]: number };
  totalHours: number;
  bounds: ScheduleBounds;
}
```

**Shows daily and total hours for person schedules**

### Phase 3: State Management

#### 1. Schedule Store (Zustand)

```typescript
interface ScheduleStore {
  currentSchedule: Schedule | null;
  bounds: ScheduleBounds | null;
  editable: boolean;
  mode: "view" | "edit" | "request" | "print";

  // Actions
  loadSchedule: (type: string, id: number) => Promise<void>;
  updateShift: (shift: Shift) => void;
  addAssignment: (assignment: Assignment) => void;
  removeAssignment: (assignmentId: number) => void;
  setMode: (mode: string) => void;
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

### Phase 3: Visual Requirements - Legacy Compatibility

#### 1. Critical CSS Classes (Must Implement)

```css
/* Legacy table structure */
table.schedule-grid {
  width: 774px;
  border: 2px solid #000000;
  border-collapse: separate;
  border-spacing: 0;
  cellpadding: 0;
  cellspacing: 0;
}

/* Time slot cells */
td.time-slot-cell {
  width: 75px;
  min-height: 60px;
  border: 2px solid #000000;
  padding: 1px;
  vertical-align: top;
}

/* Day header highlighting */
th.day-header.today {
  background-color: #fffadc; /* Light yellow - CRITICAL */
}

/* Shift stacking - CRITICAL LEGACY PATTERN */
span.shift {
  display: block;
  padding-top: 20px; /* 20px spacing between shifts */
}

span.shift:first-child {
  padding-top: 0px; /* First shift has no padding */
}

span.person.shift {
  padding: 0px; /* Person shifts have no padding */
}

/* Assignment styling */
span.assignment {
  display: inline-block;
  margin-bottom: 2px;
}

/* Star indicator */
span.star {
  color: #ffd700;
  position: absolute;
}

/* Hover effects */
a:hover {
  background-color: #fff8ba; /* Light yellow */
}

/* Request mode background */
table.request-mode {
  background-image: url("/img/request.jpg");
  background-repeat: repeat;
}

/* Off day styling */
td.day-off {
  background-color: #dddddd;
}
```

#### 2. Time Display Formatting (Legacy Pattern)

```typescript
// Legacy time format: no :00 for hours
function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute =
    minute === 0 ? "" : `:${minute.toString().padStart(2, "0")}`;

  return `${displayHour}${displayMinute}`; // NO AM/PM in legacy
}

// Examples: "8" (not "8:00"), "8:30", "12" (not "12:00")
```

#### 3. Color Coding System

```typescript
interface ColorScheme {
  residentCategories: {
    [categoryId: number]: string; // Hex colors from database
  };
  todayHighlight: "#FFFADC"; // Light yellow
  hoverEffect: "#FFF8BA"; // Slightly darker yellow
  dayOff: "#DDDDDD"; // Gray
  requestBackground: "url(/img/request.jpg)";
}
```

#### 4. Responsive Strategy

- **Fixed Width**: Maintain 774px on all screen sizes
- **Horizontal Scroll**: Enable scroll on mobile/small screens
- **No Responsive Breakpoints**: Legacy compatibility requires fixed layout
- **Print Mode**: Clean table without interactive elements

### Phase 6: Permission System

#### 1. Role-Based Access

```typescript
interface Permissions {
  canEdit: boolean; // Operations role
  canViewRequests: boolean; // Operations role
  canSubmitRequests: boolean; // Manager role
  canEditNotes: {
    operations: boolean; // Operations role
    personnel: boolean; // Personnel role
  };
}
```

#### 2. Conditional Rendering

- Show/hide edit buttons based on permissions
- Disable interactions in read-only mode
- Request mode special handling
- Print mode removes all interactive elements

### Phase 4: Testing Strategy - Legacy Compatibility Focus

#### 1. Critical Component Tests

**ScheduleTable Component**

```typescript
describe('ScheduleTable', () => {
  test('should render exactly 774px width table', () => {
    render(<ScheduleTable {...props} />);
    expect(screen.getByRole('table')).toHaveStyle('width: 774px');
  });

  test('should render 3 time period rows (Morning, Afternoon, Evening)', () => {
    const { container } = render(<ScheduleTable {...props} />);
    expect(container.querySelectorAll('tr.time-period-row')).toHaveLength(3);
  });

  test('should highlight today column with #FFFADC background', () => {
    const { container } = render(<ScheduleTable {...props} />);
    expect(container.querySelector('.today')).toHaveStyle('background-color: #FFFADC');
  });
});
```

**ShiftCell Component**

```typescript
describe('ShiftCell - Legacy Stacking', () => {
  test('should stack multiple shifts with 20px top padding except first', () => {
    const shifts = [mockShift1, mockShift2, mockShift3];
    const { container } = render(<ShiftCell shifts={shifts} {...props} />);

    const shiftBlocks = container.querySelectorAll('.shift');
    expect(shiftBlocks[0]).toHaveStyle('padding-top: 0px');
    expect(shiftBlocks[1]).toHaveStyle('padding-top: 20px');
    expect(shiftBlocks[2]).toHaveStyle('padding-top: 20px');
  });

  test('should render empty cell with no placeholder content', () => {
    render(<ShiftCell shifts={[]} {...props} />);
    expect(screen.queryByText('No shifts')).not.toBeInTheDocument();
    expect(screen.queryByText('Empty')).not.toBeInTheDocument();
  });
});
```

**Time Filtering Logic**

```typescript
describe("Time-Based Shift Placement", () => {
  test("should place shifts in correct time periods based on start time", () => {
    const shifts = [
      { start: "08:00:00", end: "12:00:00", dayId: 1 }, // Should appear in Morning
      { start: "12:30:00", end: "16:00:00", dayId: 1 }, // Should appear in Afternoon
      { start: "17:30:00", end: "20:00:00", dayId: 1 }, // Should appear in Evening
    ];

    const timePeriods = [
      { name: "Morning", startTime: "00:00:00", endTime: "12:00:00" },
      { name: "Afternoon", startTime: "12:00:00", endTime: "17:00:00" },
      { name: "Evening", startTime: "17:00:00", endTime: "23:59:59" },
    ];

    const organizedShifts = organizeShiftsByTimePeriod(shifts, 1, timePeriods);

    expect(organizedShifts.Morning).toHaveLength(1);
    expect(organizedShifts.Afternoon).toHaveLength(1);
    expect(organizedShifts.Evening).toHaveLength(1);
  });
});
```

#### 2. Visual Regression Tests

**Legacy Layout Preservation**

```typescript
describe('Visual Layout Compatibility', () => {
  test('should match legacy table dimensions exactly', () => {
    const { container } = render(<ScheduleTable {...props} />);
    const table = container.querySelector('table');

    expect(table).toHaveStyle({
      width: '774px',
      border: '2px solid #000000'
    });
  });

  test('should display time without :00 suffix', () => {
    const shift = { start: '08:00:00', end: '12:00:00' };
    render(<ShiftBlock shift={shift} type="area" />);

    expect(screen.getByText('8 - 12')).toBeInTheDocument();
    expect(screen.queryByText('8:00 - 12:00')).not.toBeInTheDocument();
  });
});
```

#### 3. Data Compatibility Tests

**Time Periods System**

```typescript
describe("Time Periods Compatibility", () => {
  test("should handle time periods for shift organization", () => {
    const bounds = {
      timePeriods: [
        {
          name: "Morning",
          startTime: "00:00:00",
          endTime: "12:00:00",
        },
        {
          name: "Afternoon",
          startTime: "12:00:00",
          endTime: "17:00:00",
        },
        {
          name: "Evening",
          startTime: "17:00:00",
          endTime: "23:59:59",
        },
      ],
    };

    const shifts = [
      { start: "08:00:00", end: "12:00:00", dayId: 1 },
      { start: "14:00:00", end: "18:00:00", dayId: 1 },
      { start: "19:00:00", end: "23:00:00", dayId: 1 },
    ];

    const organizedShifts = organizeShiftsByTimePeriod(
      shifts,
      1,
      bounds.timePeriods
    );

    expect(organizedShifts.Morning).toHaveLength(1);
    expect(organizedShifts.Afternoon).toHaveLength(1);
    expect(organizedShifts.Evening).toHaveLength(1);
  });
});
```

#### 4. Integration Tests

**Complete Workflow Tests**

```typescript
describe('Schedule View Integration', () => {
  test('should load area schedule and display shifts correctly', async () => {
    mockApi.get('/api/areas/1/schedule').mockResolvedValue(mockAreaResponse);

    render(<ScheduleView type="area" id={1} />);

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument();
      expect(screen.getByText('8 - 12')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('should filter shifts to correct time slots', async () => {
    const areaData = mockAreaWithShifts([
      { start: '08:30:00', dayId: 1 },  // Should appear in Morning
      { start: '12:30:00', dayId: 1 }   // Should appear in Afternoon
    ]);

    render(<ScheduleTable data={areaData} bounds={mockBounds} />);

    const morningCells = screen.getAllByTestId('morning-1');
    const afternoonCells = screen.getAllByTestId('afternoon-1');

    expect(within(morningCells[0]).getByText('8:30')).toBeInTheDocument();
    expect(within(afternoonCells[0]).getByText('12:30')).toBeInTheDocument();
  });
});
```

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

## Summary - Critical Implementation Requirements

### 🎯 **Must-Have Legacy Compatibility**

1. **Fixed 774px Table Width** - Non-negotiable for visual consistency
2. **3-Period Time System** - "Morning" (until 12 PM), "Afternoon" (12 PM - 5 PM), "Evening" (5 PM onwards)
3. **20px Shift Stacking** - Vertical spacing between multiple shifts in cells
4. **Time-Based Placement** - Shifts placed directly by start time into appropriate visual periods
5. **Empty Cells Stay Empty** - No placeholder content or lines
6. **Today Highlighting** - #FFFADC background color for current day
7. **Time Format** - No ":00" suffix (display "8" not "8:00")

### 🔧 **Backend Requirements**

**Database Changes Required:**

```sql
-- Replace TIME columns with seconds-based time storage
ALTER TABLE shifts
  DROP COLUMN start,
  DROP COLUMN end,
  ADD COLUMN start_at_seconds INTEGER NOT NULL,  -- Seconds since midnight (0-86399)
  ADD COLUMN end_at_seconds INTEGER NOT NULL;    -- Seconds since midnight (0-86399)

-- Also update constant_shifts table
ALTER TABLE constant_shifts
  DROP COLUMN start,
  DROP COLUMN end,
  ADD COLUMN start_at_seconds INTEGER NOT NULL,
  ADD COLUMN end_at_seconds INTEGER NOT NULL;

-- Example: 8:30 AM = 8*3600 + 30*60 = 30600 seconds
-- Example: 5:15 PM = 17*3600 + 15*60 = 62100 seconds

-- NO separate time_periods table needed - use hardcoded periods for display
-- This approach is simpler and more performant than the legacy slot/boundary system
```

**Time Period Constants (Hardcoded in Application):**

```typescript
const TIME_PERIODS = [
  {
    name: "Morning",
    startSeconds: 0, // 00:00:00 = 0 seconds
    endSeconds: 43200, // 12:00:00 = 43200 seconds
  },
  {
    name: "Afternoon",
    startSeconds: 43200, // 12:00:00 = 43200 seconds
    endSeconds: 61200, // 17:00:00 = 61200 seconds
  },
  {
    name: "Evening",
    startSeconds: 61200, // 17:00:00 = 61200 seconds
    endSeconds: 86400, // 24:00:00 = 86400 seconds
  },
] as const;
```

**API Endpoint Updates:**

- Modify `scheduleBoundsService.ts` to return hardcoded time periods (no database lookup)
- Update shift filtering to use `start_at_seconds` and `end_at_seconds` columns only
- Remove complex slot/boundary logic - use simple seconds-based comparison
- Update all shift queries and API responses to use seconds-based time columns
- Remove all references to legacy `start` and `end` TIME columns

### 🎨 **Frontend Component Architecture**

**New Components Needed:**

1. `ScheduleTable` - Main table with 774px width
2. `TimeSlotRow` - Renders one time period row (Morning, etc.)
3. `ShiftBlock` - Individual shift display with legacy HTML structure
4. `AssignmentList` - Stacked person assignments with colors
5. `HoursSummaryRow` - Daily hours for person schedules

**Current Components to Modify:**

1. `ScheduleGrid` - Replace with legacy table structure
2. `ShiftCell` - Implement 20px stacking and empty cell handling
3. `ScheduleView` - Add support for simplified time period system

### 📋 **Implementation Phases**

#### Phase 1: Backend Foundation

1. **Update Prisma Schema**: Replace `start` and `end` TIME columns with `start_at_seconds` and `end_at_seconds` INTEGER columns
2. **Create Migration**: Drop old TIME columns and add new seconds-based INTEGER columns  
3. **Update scheduleBoundsService**: Use hardcoded time periods (no database lookup)
4. **Implement seconds-based filtering**: Update all shift queries to use seconds columns only
5. **Update API responses**: Use seconds-based time fields exclusively
6. **Update Shared Types**: Replace time string fields with seconds INTEGER fields

**Shared Types Changes Required:**

```typescript
// @shared/types.ts - complete replacement, no legacy compatibility
interface Shift {
  id: number;
  scheduleId: number;
  areaId: number;
  dayId: number;
  startAtSeconds: number;  // PRIMARY time field - seconds since midnight
  endAtSeconds: number;    // PRIMARY time field - seconds since midnight
  numPeople: number;
}

interface ConstantShift {
  id: number;
  scheduleId: number;
  residentCategoryId: number;
  dayId: number;
  startAtSeconds: number;  // Seconds since midnight
  endAtSeconds: number;    // Seconds since midnight
  specifyHours: boolean;
  hours?: number;
}

interface TimePeriod {
  name: "Morning" | "Afternoon" | "Evening";
  startSeconds: number;
  endSeconds: number;
}
```

#### Phase 2: Core Components

1. Build ScheduleTable with exact 774px layout
2. Implement TimePeriodRow with proper time period handling
3. Create ShiftBlock with legacy HTML structure
4. Add AssignmentList with color coding and stars

#### Phase 3: Visual Polish

1. Implement all legacy CSS classes and styling
2. Add today highlighting and hover effects
3. Create request mode background support
4. Add print mode styling

#### Phase 4: Testing & Compatibility

1. Write visual regression tests for table layout
2. Test time filtering logic against legacy patterns
3. Verify shift stacking and spacing
4. Ensure color coding matches exactly

### ⚠️ **Critical Notes**

- **DO NOT use CSS Grid** - Must be HTML table for legacy compatibility
- **DO NOT add hourly time slots** - Fixed 4-period system only
- **DO NOT show placeholder content** in empty cells
- **DO NOT modify 774px width** - This is a legacy standard
- **DO NOT use AM/PM** in time display - Legacy shows only numbers

### 🔄 **Migration Strategy**

1. **Backup Current Implementation** - Save existing components as reference
2. **Incremental Replacement** - Replace components one by one
3. **Side-by-Side Testing** - Compare with legacy system output
4. **User Acceptance Testing** - Ensure familiar user experience

This plan ensures the new React implementation will be pixel-perfect compatible with the legacy CakePHP system while providing modern performance and maintainability. The simplified time-based approach eliminates complex slot/boundary logic and makes the system more intuitive and maintainable.
