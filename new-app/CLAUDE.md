# Scheduler Application - Main Instructions

## Project Overview

This is a modern rewrite of a legacy CakePHP workforce scheduling application. The system manages schedules, areas, people, shifts, and assignments with role-based permissions and complex workflow features like branching, merging, and change tracking.

## Architecture

- **Frontend**: React + Vite + TypeScript → Deploy to Vercel
- **Backend**: Node.js + Express + Prisma + PostgreSQL → Deploy to Render
- **Development**: devenv + direnv for local PostgreSQL

## Getting Started

```bash
# From /new-app directory
direnv allow          # Enable devenv
devenv up             # Start PostgreSQL
npm install           # Install all dependencies
npm run setup         # Set up database and Prisma
npm run dev           # Start both backend and frontend
```

## Development Workflow

### Parallel Development

This project is designed for parallel development by multiple AI agents:

- **Backend Agent**: See `./backend/CLAUDE.md` for API development instructions
- **Frontend Agent**: See `./frontend/CLAUDE.md` for React development instructions
- **Full-Stack Agent**: Can work on both using the main specifications

### Key Principles

1. **Speed Over Perfection**: Get working features fast, iterate later
2. **Simple Patterns**: Use standard libraries and approaches
3. **Mobile-First**: Responsive design that works on phones
4. **Role-Based**: Operations > Manager > Personnel permissions

## Complete Specifications

All detailed specifications are in `/docs/`:

- **[Data Model](./docs/DATA_MODEL_SIMPLE.md)**: Database schema with integer PKs
- **[API Endpoints](./docs/API_ENDPOINTS.md)**: REST API specification
- **[Authentication](./docs/AUTH_SPECS.md)**: JWT auth and role-based permissions
- **[Business Workflows](./docs/BUSINESS_WORKFLOWS.md)**: Core business logic
- **[Project Structure](./docs/PROJECT_STRUCTURE_PLAN.md)**: Deployment plan

## Current Status & Next Steps

### ✅ Completed

- Project structure with shared/backend/frontend workspaces
- devenv.nix with local PostgreSQL
- TypeScript configuration with path mapping (@shared/\*)
- Package.json files with proper workspace scripts
- Comprehensive specifications and documentation
- Prisma schema with all database models
- CLAUDE.md files for parallel development
- **Frontend Foundation**: React app with routing and authentication flow
- **Component Library**: Reusable UI components (MenuDropdown, MenuItem, Modal, etc.)
- **Global Modal System**: Centralized modal management for creating shifts, people, categories, and areas from anywhere
- **Testing Framework**: Complete test coverage - 260 passing tests (182 backend + 78 frontend)
- **Navigation System**: Working dropdown menus with hover behavior
- **Menu System**: Instant switching between menus with proper UX
- **Backend API Foundation**: Express server with JWT auth and database connection
- **Schedule Context System**: Fully implemented and tested (see below)
- **Categories CRUD**: Working category creation with automatic schedule scoping
- **Database Seeding**: Foundational data (Published schedule, Kitchen area, Residents category)
- **Authentication Flow**: Complete login/logout with JWT tokens and role-based access
- **Areas Management System**: Complete CRUD operations for areas with shift clearing functionality
- **User Management System**: Full user lifecycle management with roles and permissions
- **Schedule View System**: Complete legacy-compatible schedule display with 774px table layout, navigation menus, and all three view types (area, person, gaps)
- **Category Management System**: Complete CRUD operations for categories with modal-based editing, safe deletion with validation, and integration with people management
- **Schedule Selection System**: Modal-based schedule selection following legacy patterns with "In Progress" vs "Published" modes, keyboard shortcuts (Ctrl+I, Ctrl+O), and immediate context switching
- **Schedule Editing Mode System**: Complete role-based editing mode with visual status indicators, conditional menu visibility, and legacy-compatible permission handling

### 🎯 Schedule Context System (NEW)

**Critical architectural feature that enables all schedule-scoped operations:**

#### Backend Implementation:

- **API Endpoint**: `GET /api/schedules/current` returns "Published" schedule (id: 1)
- **Schedule Service**: Enhanced to get current schedule details
- **Categories Integration**: Automatically adds `scheduleId` to all category operations
- **Schedule-Scoped Validation**: Duplicate names checked within schedule only

#### Frontend Implementation:

- **Schedule Store**: Zustand store (`scheduleStore.ts`) for current schedule state
- **Auto-Loading**: Schedule context loaded on user authentication in `App.tsx`
- **Persistent State**: Current schedule persisted in localStorage
- **API Integration**: Frontend calls `/api/schedules/current` to get context

#### Database Foundation:

- **Published Schedule**: Created via seed file (id: 1, name: "Published")
- **7 Days**: Sunday through Saturday with proper `dayOfWeek` mapping
- **Kitchen Area**: Default area with shortName "K"
- **Residents Category**: Default category with teal color
- **Schedule Relationships**: All entities properly linked via `scheduleId`

### 🚧 Current Development Status

**All foundational systems are complete and tested. Ready for core feature development.**

### 🔜 Next Development Priorities

#### **✅ Phase 1: Schedule View System - COMPLETED & FULLY INTEGRATED**

**Complete legacy-compatible schedule viewing system is now functional:**

- ✅ **Backend API Endpoints**: All three schedule view APIs working (area, person, gaps)
- ✅ **Frontend Components**: Complete ScheduleTable system with legacy 774px layout
- ✅ **Navigation Integration**: Area/person selection modals with keyboard shortcuts
- ✅ **Data Flow**: Full React Query integration with error handling and caching
- ✅ **Visual Compatibility**: Today highlighting, time formatting, and shift stacking
- ✅ **Routing System**: `/schedule-view/:type/:id` routes working for all view types
- ✅ **Test Coverage**: 424 passing tests across all workspaces (45 shared + 182 backend + 197 frontend)
- ✅ **Quality Assurance**: TypeScript compilation and quality checks passing

**Working User Flow**: Menu → Modal Selection → Schedule View → Legacy-Compatible Grid Display

#### **✅ Phase 2: Schedule Editing Mode System - COMPLETED**

**Complete role-based editing mode system now functional:**

- ✅ **Schedule Store Enhancement**: `isEditable()`, `isPublished()`, `isRequest()` methods for mode detection
- ✅ **Permission Logic**: User ownership + operations role validation matching legacy system
- ✅ **Visual Status Indicator**: `ScheduleStatusIndicator` component showing current editing mode
- ✅ **Conditional Menu System**: Edit-only menu items show/hide based on schedule editability
- ✅ **Header Integration**: All menu dropdowns (Schedules, People, Areas, Shifts) respect editing mode
- ✅ **Status Display**: Clear visual indicators (✏️ Editing, 📅 Published, 📝 Request, 👀 Viewing)
- ✅ **Test Coverage**: 27 comprehensive tests (7 component + 20 store tests) for editing mode functionality
- ✅ **Quality Assurance**: TypeScript compilation and error handling for malformed data

**Working User Flow**: Schedule Selection → Editing Mode Detection → Conditional Menu Visibility → Status Indicator Display

#### **📈 Phase 3: Core Scheduling Operations**

1. **Shift Management**: Create and edit shifts with time picker interface
2. **Assignment System**: Assign people to shifts with conflict detection
3. **Drag-and-Drop Interface**: Visual assignment management
4. **Schedule Publishing**: Workflow for publishing schedules with date ranges

#### **🔧 Phase 3: Polish & Advanced Features**

1. **Schedule Branching/Merging**: Copy and merge schedule functionality
2. **Change Tracking**: Undo/redo system implementation
3. **Email Notifications**: Schedule change notifications
4. **Mobile Optimization**: Touch-friendly interfaces

## Implementation Status

### ✅ **Foundation Complete (MVP)**

- ✅ User authentication with JWT
- ✅ Schedule context system (current schedule management)
- ✅ Categories management with automatic schedule scoping
- ✅ Areas management system (CRUD, shift clearing, validation)
- ✅ Role-based access control and navigation
- ✅ User management system (CRUD, roles, area assignments)
- ✅ **Schedule View System**: Complete schedule display and navigation functionality
  - ✅ Backend API endpoints for area, person, and gaps schedules
  - ✅ Frontend grid components with legacy-style layout (774px width)
  - ✅ Schedule bounds calculation and time slot management
  - ✅ React Query integration with error handling
  - ✅ **Navigation Menus**: Area and person selection modals with keyboard shortcuts
  - ✅ **Selection Memory**: localStorage integration for remembering last selections
  - ✅ **Category Integration**: People grouped by category with color coding
- ✅ **Schedule Editing Mode System**: Complete role-based editing permissions
  - ✅ **Permission Detection**: `isEditable()`, `isPublished()`, `isRequest()` methods
  - ✅ **Visual Status Indicator**: Real-time editing mode display component
  - ✅ **Conditional Menus**: Edit-only items show/hide based on schedule permissions
  - ✅ **Legacy Compatibility**: Matches CakePHP `$editable` flag behavior exactly
- ✅ Database structure with all models
- ✅ API foundation with error handling
- ✅ Comprehensive test coverage (424 tests: 45 shared + 182 backend + 197 frontend)

### ✅ **Currently Available Features - FULLY WORKING**

- ✅ **Complete Schedule View System**: Full implementation of area, person, and gaps schedule views with working navigation
- ✅ **Schedule Navigation Menus**: Complete area and person selection with keyboard shortcuts (Ctrl+A, Ctrl+P)
- ✅ **Schedule Grid Display**: Interactive weekly grid with shifts, assignments, and time slots
- ✅ **Enhanced Person Schedules**: Person schedules show shift details with area information and time ranges
- ✅ **Default Time Slots**: Schedules without shifts display default hourly time slots (8AM-5PM)
- ✅ **Visual Schedule Interface**: Today highlighting, hover states, and legacy-compatible styling
- ✅ **Working API Integration**: All schedule view endpoints functional with proper authentication
- ✅ **Reliable Navigation**: Click area/person in selection modals → navigate to working schedule view
- ✅ **Schedule Editing Mode System**: Complete role-based permission system with visual status indicators
- ✅ **Conditional Menu Visibility**: Edit-only menu items automatically show/hide based on schedule ownership and user role
- ✅ **Legacy-Compatible Permissions**: Exactly matches CakePHP `$editable` flag behavior (user ownership + operations role)

### ⭕ **Next Implementation Priorities**

- ⭕ **Shift Management**: Create and edit shifts with time picker
- ⭕ **Assignment System**: Assign people to shifts with conflict detection
- ⭕ **People Enhancement**: Advanced people management features

### 🔜 **Future Features**

- ⭕ Schedule copying and templates
- ⭕ Request submission (manager → operations)
- ⭕ Schedule publishing workflow
- ⭕ Advanced assignment management
- ⭕ Change tracking (undo/redo)
- ⭕ Email notifications
- ⭕ Mobile optimization

## User Roles & Permissions

### Operations (Admin)

- Full system access
- Manage all users, schedules, areas
- Publish schedules
- Approve schedule requests

### Manager

- Manage assigned areas only
- Create and submit schedule requests
- Manage people in their areas
- View published schedules

### Personnel

- View published schedules only
- See their own assignments
- Basic read-only access

## Technical Decisions Made

- **Database**: PostgreSQL with integer primary keys (not UUIDs)
- **Authentication**: JWT tokens with 24-hour expiration
- **State Management**: React Query + Zustand (not Redux)
- **Styling**: Tailwind CSS with component library
- **Deployment**: Vercel (frontend) + Render (backend + DB)
- **Prisma Client**: Generated to `/generated/prisma/` for monorepo sharing

## Development Environment

The project uses devenv for consistent local development:

- PostgreSQL running locally on port 5432
- Database: `scheduler` with user `scheduler_user`
- Node.js 20 with npm workspaces
- Hot reloading for both frontend and backend
- Database migrations and Prisma Studio

## Legacy Context

This replaces a CakePHP 1.x application with:

- Complex scheduling workflows with branch/merge
- Change tracking system for undo/redo
- Role-based permissions (operations/manager/personnel)
- Email integration for notifications
- Request submission workflow

### **Always Check Legacy Code for Workflow Patterns**

**Critical Development Principle**: Before implementing any new feature or workflow, always examine the legacy CakePHP code to understand:

1. **User Interaction Patterns** - How users navigate through workflows
2. **Business Logic Flow** - The sequence of steps and decision points
3. **Data Relationships** - How different entities connect and interact
4. **Permission Boundaries** - What users can do at each step
5. **Error Handling** - How edge cases and failures are managed

**Implementation Approach**:

- **Maintain User Experience**: Keep the same workflow steps, navigation patterns, and user interactions
- **Modernize Implementation**: Use clean architecture, better error handling, and improved performance
- **Organize Code Better**: Structure the code more logically while preserving the business logic
- **Test Against Legacy**: Ensure the new implementation produces the same results for the same inputs

**Example**: When implementing the assignment workflow, study how the legacy system handles:

- Request submission → approval → assignment → notification
- Conflict detection and resolution
- Role-based permission checks at each step
- Data validation and error messages

The new app maintains feature parity while modernizing the tech stack and improving the user experience.

### **Always Run Quality Checks When Completing Tasks**

**Required Step**: After completing any development task, always run `npm run check` from the `new-app/` directory to ensure:

- TypeScript compilation passes
- All workspaces have consistent types
- No type errors exist across the codebase
- Code quality standards are maintained

**Command**: `cd new-app && npm run check`

## Important Development Guidelines

- **NEVER add time estimates** (weeks, days, hours) to documentation or code comments
- **NEVER include specific dates** (months, years) when noting implementation status
- Use descriptive status terms like "Completed", "In Progress", "Pending" instead of dates
- Focus on what needs to be done, not when it will be done

## File Structure

```
new-app/
├── shared/           # TypeScript types and Zod schemas
│   ├── src/types/    # API types, database types, auth types
│   └── src/schemas/  # Zod validation schemas
├── backend/          # Express API
│   ├── prisma/       # Database schema and migrations
│   ├── src/          # API routes, middleware, services
│   └── generated/    # Prisma client (shared)
├── frontend/         # React + Vite app
│   └── src/          # Components, pages, hooks, services
└── docs/             # Complete specifications
```

## Environment Variables

```
DATABASE_URL=postgresql://scheduler_user:scheduler_password@localhost:5432/scheduler
JWT_SECRET=your-jwt-secret-change-in-production
NODE_ENV=development
```

## Commands Reference

```bash
# Development
npm run dev           # Start both frontend and backend
npm run dev:backend   # Backend only
npm run dev:frontend  # Frontend only

# Database
npm run migrate       # Run Prisma migrations
npm run prisma        # Access Prisma CLI
npm run setup         # Full setup (install + migrate)

# Quality
npm run check         # TypeScript check all workspaces
npm run test          # Run tests all workspaces
npm run build         # Build for production
```

## Development Server Status

**Note**: Development servers are typically running in a separate terminal by the user. Do not attempt to start `npm run dev` unless explicitly requested, as ports may already be in use.

## Future Improvements

### Time Entry System Enhancement

**Current Implementation**: The shift time selector uses HTML5 time inputs with 15-minute increments and automatic rounding.

**Future Enhancement**: Replace with "Scheduler3" time entry approach for better user experience. When implementing this improvement, ask the user for details about the Scheduler3 time entry system to understand the preferred interaction pattern and user interface design.

## Current Implementation Status

### 🎯 **Production-Ready Foundation**

The application has a complete, tested foundation ready for core feature development:

### ✅ **Fully Implemented & Tested Systems**

1. **Authentication System**: Complete JWT-based auth with role-based access control
2. **Database Layer**: PostgreSQL with Prisma ORM, complete schema with seconds-based time storage
3. **Schedule Context Architecture**: Current schedule management throughout the application
4. **Categories Management**: Full CRUD with automatic schedule scoping
5. **User Management System**: Complete CRUD operations for users with role and area assignment
6. **API Foundation**: Express server with error handling and comprehensive test coverage
7. **Frontend Framework**: React app with routing, state management, and component library
8. **Centralized Time Handling**: Complete time utility system with seconds-based storage, legacy formatting, and comprehensive validation
9. **Schedule View Backend**: Complete API endpoints with hardcoded time periods and legacy-style time formatting
10. **Schedule View Components**: Legacy-compatible 774px table with all display components (ScheduleTable, TimeSlotRow, ShiftCell, etc.)
11. **Test Coverage**: 377 passing tests (43 shared + 182 backend + 152 frontend) covering all implemented features

### 📋 **Key Architecture Files**

- **Database Schema**: `backend/prisma/schema.prisma` - Complete data model with seconds-based time storage
- **Time Utilities**: `shared/src/timeUtils.ts` - Centralized time handling functions with 35 comprehensive tests
- **Seed Data**: `backend/src/seed.ts` - Foundational data creation
- **Schedule Context**: `frontend/src/store/scheduleStore.ts` - Schedule state management
- **API Routes**: `backend/src/routes.ts` - RESTful API endpoints
- **Test Suites**: Comprehensive coverage in `__tests__` directories across all workspaces
- **Documentation**: Complete specs in `/docs/` and implementation guides

### ⏰ **Centralized Time Handling System**

**All time operations use the centralized utilities in `shared/src/timeUtils.ts`:**

- **Storage Format**: Times stored as integers (seconds since midnight: 0-86399)
- **Database Schema**: `start_at_seconds` and `end_at_seconds` columns replace legacy TIME fields
- **Time Periods**: Morning (0-43200s), Afternoon (43200-61200s), Evening (61200-86400s)
- **Conversion Functions**: String ↔ Seconds, Display formatting, HTML inputs, Duration calculations
- **Legacy Formatting**: `formatTimeForDisplay()` and `formatTimeRange()` for Ruby-compatible display
- **Validation**: Complete input validation and error handling
- **Testing**: 43 comprehensive test cases covering all functions and edge cases

**Usage Example:**
```typescript
import { timeStringToSeconds, secondsToDisplayTime, getTimePeriods } from '@shared/types';

// Convert time for database storage
const startSeconds = timeStringToSeconds('09:00:00'); // 32400

// Convert for display
const displayTime = secondsToDisplayTime(32400); // "9:00 AM"

// Get time periods for UI
const periods = getTimePeriods(); // [Morning, Afternoon, Evening]
```

### 🚀 **Ready for Core Features**

The next development phase can focus on core scheduling features:

1. **People Management** - Add people to schedules with categories
2. **Shift Creation** - Time-based shifts with area assignments using centralized time utilities
3. **Assignment System** - Assign people to shifts with conflict detection
4. **Schedule Views** - Calendar/grid display of the complete schedule

### 🛠️ **Technical Debt & Known Issues**

- **Testing Architecture**: Routes must be maintained in both `routes.ts` and `testApp.ts` (documented in `TESTING_ROUTES.md`)
- **Frontend Warnings**: React Router v7 future flags (non-blocking)
- **Console Props Warning**: MenuDropdown component has minor prop passing issue (non-blocking)

---

**Branch**: `new-app-setup`
**Status**: ✅ Schedule View Components Complete - Phase 1 & 2 Complete, Ready for Integration
**Last Updated**: Legacy-compatible schedule view components implemented with 774px table layout, 377 passing tests

- when making changes, don't worry about backwards compatibillity. Just adopt the new method completely.