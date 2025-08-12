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
- TypeScript configuration with path mapping (@shared/*)
- Package.json files with proper workspace scripts
- Comprehensive specifications and documentation
- Prisma schema with all database models
- CLAUDE.md files for parallel development
- **Frontend Foundation**: React app with routing and authentication flow
- **Component Library**: Reusable UI components (MenuDropdown, MenuItem, etc.)
- **Testing Framework**: Complete test coverage - 117 passing tests (87 backend + 30 frontend)
- **Navigation System**: Working dropdown menus with hover behavior
- **Menu System**: Instant switching between menus with proper UX
- **Backend API Foundation**: Express server with JWT auth and database connection
- **Schedule Context System**: Fully implemented and tested (see below)
- **Categories CRUD**: Working category creation with automatic schedule scoping
- **Database Seeding**: Foundational data (Published schedule, Kitchen area, Residents category)
- **Authentication Flow**: Complete login/logout with JWT tokens and role-based access

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

#### **🚀 Phase 1: Core Scheduling Features (Ready to Implement)**
1. **People Management**: 
   - Add people to schedules with category assignment
   - People listing and management interface
   - Integration with existing `PeopleSchedule` model

2. **Shift Management**:
   - Create shifts with area/day/time assignments  
   - Shift creation interface with time picker
   - Integration with existing `Shift` model and areas/days

3. **Assignment System**:
   - Assign people to shifts
   - Basic assignment interface (before drag-and-drop)
   - Conflict detection and validation

#### **📈 Phase 2: Advanced Features**
1. **Schedule Grid View**: Calendar-style display of shifts and assignments
2. **Drag-and-Drop Interface**: Visual assignment management
3. **Schedule Publishing**: Workflow for publishing schedules with date ranges
4. **Request Workflow**: Manager schedule requests and operations approval

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
- ✅ Role-based access control and navigation
- ✅ Database structure with all models
- ✅ API foundation with error handling
- ✅ Comprehensive test coverage (117 tests)

### 🔄 **Ready for Implementation**
- ⭕ People management (add people to schedules)
- ⭕ Shift creation and management
- ⭕ Basic assignment system
- ⭕ Schedule grid/calendar view

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

The new app maintains feature parity while modernizing the tech stack and improving the user experience.

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

## Current Implementation Status

### 🎯 **Production-Ready Foundation**
The application has a complete, tested foundation ready for core feature development:

### ✅ **Fully Implemented & Tested Systems**
1. **Authentication System**: Complete JWT-based auth with role-based access control
2. **Database Layer**: PostgreSQL with Prisma ORM, complete schema, and seed data
3. **Schedule Context Architecture**: Current schedule management throughout the application
4. **Categories Management**: Full CRUD with automatic schedule scoping
5. **API Foundation**: Express server with error handling and comprehensive test coverage
6. **Frontend Framework**: React app with routing, state management, and component library
7. **Test Coverage**: 117 passing tests (87 backend + 30 frontend) covering all implemented features

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
**Status**: ✅ Foundation Complete - Ready for core feature development
**Last Updated**: December 2024 - Schedule context system and comprehensive test coverage implemented