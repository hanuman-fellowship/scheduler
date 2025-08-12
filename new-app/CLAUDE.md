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

#### **🚀 Phase 1: Schedule View System ✅ COMPLETED**

1. **✅ Schedule View Foundation (COMPLETED)**:
   - ✅ Backend API endpoints for area, person, and gaps schedules
   - ✅ Frontend components (ScheduleView, ScheduleGrid, ShiftCell, etc.)
   - ✅ Schedule bounds service for time slot calculation  
   - ✅ React Query integration and error handling
   - ✅ Comprehensive test coverage

2. **✅ Schedule Navigation Menus (COMPLETED)**:
   - ✅ View Area Schedule menu with area selection modal
   - ✅ View People Schedule menu with person selection modal
   - ✅ Integration with existing menu system and GlobalModalContext
   - ✅ Keyboard shortcuts (Ctrl+P, Ctrl+A)
   - ✅ Selection memory with localStorage
   - ✅ Category-based grouping for people with color coding
   - ✅ All tests passing (modal component tests fixed)

#### **📈 Phase 2: Core Scheduling Operations**

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
- ✅ **Schedule View System (NEW)**: Complete schedule display and navigation functionality
  - ✅ Backend API endpoints for area, person, and gaps schedules
  - ✅ Frontend grid components with legacy-style layout (774px width)
  - ✅ Schedule bounds calculation and time slot management
  - ✅ React Query integration with error handling
  - ✅ **Navigation Menus**: Area and person selection modals with keyboard shortcuts
  - ✅ **Selection Memory**: localStorage integration for remembering last selections
  - ✅ **Category Integration**: People grouped by category with color coding
- ✅ Database structure with all models
- ✅ API foundation with error handling
- ✅ Comprehensive test coverage (275+ tests: 182 backend + 93 frontend)

### ✅ **Currently Available Features**

- ✅ **Schedule Navigation Menus**: Complete area and person selection with keyboard shortcuts
- ✅ **Schedule Display System**: View area schedules, person schedules, and gaps  
- ✅ **Schedule View Foundation**: Complete schedule viewing system with navigation

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
2. **Database Layer**: PostgreSQL with Prisma ORM, complete schema, and seed data
3. **Schedule Context Architecture**: Current schedule management throughout the application
4. **Categories Management**: Full CRUD with automatic schedule scoping
5. **User Management System**: Complete CRUD operations for users with role and area assignment
6. **API Foundation**: Express server with error handling and comprehensive test coverage
7. **Frontend Framework**: React app with routing, state management, and component library
8. **Test Coverage**: 140+ passing tests (110 backend + 30 frontend) covering all implemented features

### 📋 **Key Architecture Files**

- **Database Schema**: `backend/prisma/schema.prisma` - Complete data model
- **Seed Data**: `backend/src/seed.ts` - Foundational data creation
- **Schedule Context**: `frontend/src/store/scheduleStore.ts` - Schedule state management
- **API Routes**: `backend/src/routes.ts` - RESTful API endpoints
- **Test Suites**: Comprehensive coverage in `__tests__` directories
- **Documentation**: Complete specs in `/docs/` and implementation guides

### 🚀 **Ready for Core Features**

The next development phase can focus on core scheduling features:

1. **People Management** - Add people to schedules with categories
2. **Shift Creation** - Time-based shifts with area assignments
3. **Assignment System** - Assign people to shifts with conflict detection
4. **Schedule Views** - Calendar/grid display of the complete schedule

### 🛠️ **Technical Debt & Known Issues**

- **Testing Architecture**: Routes must be maintained in both `routes.ts` and `testApp.ts` (documented in `TESTING_ROUTES.md`)
- **Frontend Warnings**: React Router v7 future flags (non-blocking)
- **Console Props Warning**: MenuDropdown component has minor prop passing issue (non-blocking)

---

**Branch**: `new-app-setup`
**Status**: ✅ Foundation Complete with User Management - Ready for core feature development
**Last Updated**: User Management System fully implemented with CRUD operations
