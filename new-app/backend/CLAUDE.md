# Backend Development Instructions

## Project Context

You are developing the backend for a workforce scheduling application. This is a Node.js + Express + Prisma API that replaces a legacy CakePHP application.

**⚠️ Critical Requirement**: Before implementing any new API endpoint or business logic, you MUST examine the legacy CakePHP code to understand the exact workflow patterns, business rules, and user interactions. While we modernize the implementation, we must preserve the user experience and business logic flow.

## 🎯 Core Development Principles

### **Small Controller Actions That Delegate**

Controllers should be thin and delegate business logic to services:

```typescript
// ✅ GOOD: Thin controller
export const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoriesService.createCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// ❌ BAD: Fat controller with business logic
export const createCategory = async (req: Request, res: Response) => {
  // Don't put validation, database logic, etc. in controllers
};
```

### **Always Write Unit Tests**

Every service function must have corresponding unit tests:

```typescript
// Service function
export const createCategory = async (
  data: CreateCategoryInput
): Promise<CategoryOutput> => {
  const category = await prisma.residentCategory.create({
    data: {
      name: data.name,
      color: data.color,
      scheduleId: data.scheduleId,
    },
  });
  return mapCategoryToOutput(category);
};

// Required unit test
describe("categoriesService.createCategory", () => {
  it("should create category with valid input", async () => {
    const input = { name: "Test", color: "#FF0000", scheduleId: 1 };
    const result = await categoriesService.createCategory(input);

    expect(result.name).toBe("Test");
    expect(result.color).toBe("#FF0000");
    expect(result.scheduleId).toBe(1);
  });
});
```

### **Use Shared Types for Inputs and Outputs**

All API contracts must use shared TypeScript types:

```typescript
// shared/src/types.ts
export interface CreateCategoryInput {
  name: string;
  color: string;
  scheduleId: number;
}

export interface CategoryOutput {
  id: number;
  name: string;
  color: string;
  scheduleId: number;
  createdAt: string;
}

// Backend service uses shared types
export const createCategory = async (
  data: CreateCategoryInput
): Promise<CategoryOutput> => {
  // Implementation
};

// Frontend also uses the same types
const { mutate } = useMutation<CategoryOutput, Error, CreateCategoryInput>({
  mutationFn: categoriesService.createCategory,
});
```

## Key Requirements

### Speed & Simplicity

- Small, focused functions that are easy to test
- Integer primary keys (not UUIDs)
- Straightforward REST API design
- Minimize complexity wherever possible

### Time Handling

**Always use the centralized time utilities from `@shared/types`:**

```typescript
import { timeStringToSeconds, secondsToDisplayTime, validateTimeSeconds } from '@shared/types';

// Store times as integers (seconds since midnight)
const startSeconds = timeStringToSeconds('09:00:00'); // 32400
const endSeconds = timeStringToSeconds('17:00:00');   // 61200

// Validate time values
validateTimeSeconds(startSeconds); // throws if invalid

// Database operations use seconds directly
await prisma.shift.create({
  data: {
    startAtSeconds: startSeconds,
    endAtSeconds: endSeconds,
    // ...
  }
});
```

**Database Schema:**
- All time fields use `start_at_seconds` and `end_at_seconds` (INTEGER columns)
- No legacy TIME columns - seconds-based storage only
- Range: 0-86399 (midnight to 11:59:59 PM)

### Legacy Code Reference

**Before implementing any new feature, study the legacy CakePHP code:**

1. **Controllers** (`/controllers/`) - Understand the workflow steps and user interactions
2. **Models** (`/models/`) - Study business logic, validation rules, and relationships
3. **Views** (`/views/`) - See how data is presented and what user actions are available
4. **Database** (`/config/sql/`) - Understand the data structure and constraints

**Example workflow analysis:**

- **Assignment Process**: Study `assignments_controller.php` to see the exact steps users follow
- **Permission Checks**: Examine `app_controller.php` and `app_helper.php` for role-based logic
- **Data Validation**: Look at model files for business rule enforcement
- **User Interface**: Check view files for form layouts and interaction patterns

**Implementation strategy:**

- **Preserve the workflow**: Keep the same user journey and decision points
- **Modernize the code**: Use clean architecture, better error handling, and improved performance
- **Test compatibility**: Ensure the new API produces the same results for the same inputs

### **Always Run Quality Checks When Completing Tasks**

**Required Step**: After completing any development task, always run `npm run check` from the `new-app/` directory to ensure:

- TypeScript compilation passes
- All workspaces have consistent types
- No type errors exist across the codebase
- Code quality standards are maintained

**Command**: `cd new-app && npm run check`

### Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Validation**: Zod or similar
- **Testing**: Vitest (if time permits)

## Database Schema

The complete Prisma schema is documented in `/docs/DATA_MODEL_SIMPLE.md`. Key entities:

- `users` with `roles` (operations/manager/personnel)
- `schedules` with branching via `parent_id`
- `areas`, `people`, `shifts`, `assignments`
- `changes`/`change_models`/`change_fields` for undo/redo
- Complete change tracking system

## API Specification

Full REST API specification is in `/docs/API_ENDPOINTS.md`. Key patterns:

- JWT authentication on all endpoints except `/api/auth/login`
- Role-based authorization (operations > manager > personnel)
- Consistent error responses with field-level validation
- Standard HTTP status codes

## Authentication & Authorization

Detailed specs in `/docs/AUTH_SPECS.md`:

- JWT tokens with 24-hour expiration
- Role-based middleware for endpoint protection
- Manager area access validation
- Password hashing with bcrypt

## Business Logic

Core workflows documented in `/docs/BUSINESS_WORKFLOWS.md`:

- Schedule creation, copying, publishing workflow
- Request submission (manager → operations)
- Assignment management with conflict detection
- Change tracking for undo/redo system
- Email notifications for key events

## File Structure

```
backend/
├── package.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── index.ts (Express app setup)
│   ├── auth/
│   │   ├── middleware.ts (JWT validation, role checks)
│   │   └── routes.ts (login, logout, change password)
│   ├── routes/
│   │   ├── users.ts
│   │   ├── schedules.ts
│   │   ├── areas.ts
│   │   ├── people.ts
│   │   ├── shifts.ts
│   │   ├── assignments.ts
│   │   └── ...
│   ├── services/ (business logic)
│   ├── utils/
│   └── types/
└── .env (DATABASE_URL, JWT_SECRET)
```

## Development Commands

Based on the workspace setup:

- `npm run dev` - Start development server with hot reload
- `npm run prisma -- migrate dev` - Run database migrations
- `npm run prisma -- studio` - Open Prisma Studio
- `npm run prisma -- generate` - Regenerate Prisma client

## Key Implementation Notes

1. **Start Simple**: Get basic CRUD operations working first
2. **JWT Middleware**: Implement auth middleware early for all protected routes
3. **Validation**: Use Zod schemas for request validation
4. **Error Handling**: Consistent error response format
5. **Database Seeding**: Create seed data for development
6. **Change Tracking**: The undo/redo system is complex - implement after basic features

## Priority Order

1. **Phase 1**: Auth, users, basic schedule CRUD
2. **Phase 2**: Areas, people, shifts, assignments
3. **Phase 3**: Schedule workflow (copy, publish, requests)
4. **Phase 4**: Change tracking, email notifications

## ✅ COMPLETED: Schedule View API Implementation

**The complete schedule view system is implemented and working:**

### **Schedule View Endpoints**
- `GET /api/areas/:areaId/schedule` - Area schedule with shifts and assignments
- `GET /api/people/:personId/schedule` - Person schedule with shift details and area information  
- `GET /api/schedule/gaps` - Unassigned shifts needing coverage

### **Enhanced Features**
- **Schedule Bounds Service**: Generates time slots from shifts, with default slots for empty schedules
- **Person Schedule Enhancement**: Includes full shift details (area, time, day) for grid display
- **Authentication Integration**: All endpoints protected with proper role-based access
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes

### **Data Enhancements**
- **AssignmentWithShiftResponse**: Extended type including shift area information for person schedules
- **Default Time Slots**: 8AM-5PM hourly slots when no shifts exist in schedule
- **Schedule Bounds Calculation**: Dynamic time slot generation based on actual shift times

**Status: ✅ COMPLETED** - All schedule view APIs are functional and tested.

## ✅ RESOLVED: Testing Architecture Issue

**The testing architecture has been refactored to use a single source of truth for routes.**

**When adding new API routes, you only need to update ONE file:**

1. `src/routes.ts` (production routes)
2. **That's it!** Tests automatically get the new route

See `TESTING_ROUTES.md` for detailed explanation of the new approach.

**Status: ✅ RESOLVED** - No more duplicate route maintenance required.

## ✅ COMPLETED: Assignment System Implementation

**The complete assignment management system is implemented and tested:**

### **Assignment System Features**
- `POST /api/assignments` - Create new assignment with conflict validation
- `PUT /api/assignments/:id` - Update assignment (person, star status, name)
- `DELETE /api/assignments/:id` - Delete assignment
- `POST /api/assignments/:id/star` - Toggle assignment star status
- `GET /api/assignments/shift/:shiftId/available-people` - Get available people with conflict analysis
- `GET /api/assignments/shift/:shiftId` - Get all assignments for a shift (ordered by star, then name)

### **Advanced Conflict Detection**
- **Time Overlap Detection**: Prevents double-booking people to overlapping shifts on same day
- **Off Day Validation**: Checks person's scheduled off days
- **Existing Assignment Check**: Prevents duplicate assignments to same shift
- **Shift Capacity Validation**: Ensures shift doesn't exceed numPeople limit
- **Real-time Availability**: Shows conflict reasons for each person

### **Data Enhancements**
- **AssignmentResponse**: Complete assignment data with person details
- **Star System**: Priority assignment marking (starred assignments sort first)
- **"Other" Assignments**: Support for non-person assignments with custom names
- **Comprehensive Validation**: Zod schemas with business rule enforcement

**Status: ✅ COMPLETED** - All assignment APIs are functional and tested (241 backend tests passing).

## ✅ COMPLETED: Schedule Permission System

**Legacy-compatible permission system implemented for shift operations:**

### **Permission Rules**
- **Operations Users**: Can create/edit/delete shifts on any schedule
- **Manager Users**: Can only create/edit shifts on draft requests (`schedule.request = 2`)
- **Personnel Users**: Cannot create/edit/delete shifts

### **Key Service: `schedulePermissionService.ts`**
```typescript
// Check if schedule is editable by user
export const isScheduleEditable = async (scheduleId: number, user: AuthUser): Promise<boolean>

// Throw error if user cannot edit schedule  
export const requireScheduleEditPermission = async (scheduleId: number, user: AuthUser): Promise<void>
```

### **Architecture Enhancement**
- **`getUserCurrentScheduleId()`** moved to `scheduleBoundsService.ts` for shared access
- Controllers remain thin - permission checks delegate to service layer
- Legacy `redirectIfNotEditable()` behavior faithfully preserved in modern API
- Proper HTTP status codes: 403 for permission errors, 400 for business rule errors

**Status: ✅ COMPLETED** - Manager permissions correctly match legacy CakePHP behavior.

## Environment Variables

```
DATABASE_URL=postgresql://scheduler_user:scheduler_password@localhost:5432/scheduler
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Testing Strategy

- Focus on getting features working first
- Add basic integration tests for auth and key endpoints
- Unit tests for complex business logic (change tracking, merging)

## 📝 Documentation Maintenance

### Keep Documentation Current

As you develop backend features:

1. **Update API Documentation**: When adding endpoints, document them in the main project files
2. **Update Shared Types**: Keep `shared/src/types.ts` current with new interfaces
3. **Document Business Logic**: Complex service functions should have clear docstrings
4. **Update Examples**: Keep code examples in documentation current with implementation

### Testing Standards

- **Service Layer Focus**: Most tests should be at the service layer where business logic lives
- **Controller Tests**: Light integration tests to ensure proper request/response handling
- **Database Tests**: Use test database for integration tests
- **Mocking**: Mock external dependencies but not your own services

Remember: The goal is a working application as fast as possible. Use standard patterns, avoid over-engineering, write comprehensive tests, and keep documentation current with the implementation.
