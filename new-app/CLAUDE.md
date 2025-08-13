# Scheduler Application - Development Guide

## Quick Start

```bash
# From /new-app directory
direnv allow && devenv up
npm install && npm run setup
npm run dev           # Start both backend and frontend
```

## Architecture & Tech Stack

- **Backend**: Node.js + Express + Prisma + PostgreSQL (see `backend/CLAUDE.md`)
- **Frontend**: React + Vite + TypeScript (see `frontend/CLAUDE.md`)
- **Database**: PostgreSQL with integer PKs, schedule-scoped operations
- **Auth**: JWT tokens with role-based access (Operations > Manager > Personnel)

## Critical Architecture Insight

**Everything operates within a "current schedule" context** - this is the core architectural principle from the legacy system:

- **People are schedule-scoped**: `people_schedules` table links people to specific schedules with categories
- **Current schedule**: Loaded on app startup, persists in `scheduleStore` (frontend) + localStorage
- **All operations**: Must include `scheduleId` - automatically injected by schedule context system
- **Schedule switching**: Available to Operations users, changes entire app context

## Reference Documentation

- **[Database Schema](./docs/DATA_MODEL_SIMPLE.md)**: Complete data model reference
- **[API Endpoints](./docs/API_ENDPOINTS.md)**: REST API specifications
- **[Testing Guide](./backend/TESTING.md)**: Backend testing setup and patterns
- **[Menu Implementation Status](./MENU_IMPLEMENTATION_STATUS.md)**: Detailed status of all 63 legacy menu items
- **[Schedule View Status](./SCHEDULE_VIEW_STATUS.md)**: Complete schedule view implementation status

## ✅ Completed Systems (Production Ready)

### Foundation & Core Architecture

- **Authentication & Authorization**: JWT tokens, role-based access (Operations/Manager/Personnel)
- **Schedule Context System**: Current schedule management throughout app (scheduleStore + backend API)
- **Database & API**: Complete schema with 450+ passing tests, RESTful endpoints
- **Frontend Framework**: React app with component library, routing, global modal system

### Working Features

- **User Management**: Complete CRUD operations for users with role assignment
- **Areas Management**: Full CRUD with shift clearing and validation
- **Categories Management**: Schedule-scoped category operations with safe deletion
- **Schedule Views**: Legacy-compatible display (area/person/gaps views) with navigation
- **Schedule Editing Mode**: Role-based permission system with visual indicators
- **Shift Management**: Context-aware creation/editing with hover UI and click-to-edit
- **Assignment System**: Complete frontend and backend with conflict detection and modal UI

## 🎯 Next Development Priorities

### Phase 6: Advanced Workflows (Current Focus)

- **People Enhancement**: Advanced people management (retire/restore, category ordering)
- **Request System**: Manager → Operations workflow (create, submit, approve requests)
- **Schedule Management**: Copy schedules, templates, publishing workflow
- **Email Integration**: Notifications for schedule changes and user management

### Phase 7: Quality & Polish

- **Change Tracking**: Undo/redo system (complex - implement last)
- **Mobile Optimization**: Touch-friendly interfaces
- **Performance**: Large schedule handling optimization

## Menu Implementation Status

**See [Menu Implementation Status](./MENU_IMPLEMENTATION_STATUS.md) for detailed breakdown of all 63 legacy menu items.**

**Priority Focus**: 
- **✅ Core Systems**: 20 items (32%) fully implemented and working
- **⚠️ Next Priority**: Manager Request Workflow (essential for manager role functionality)  
- **📋 Advanced Features**: Change tracking, email, templates (implement later)

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
- ✅ **Assignment System Backend**: Complete assignment management infrastructure
  - ✅ Assignment service with CRUD operations and conflict detection
  - ✅ Assignment controller with 6 REST API endpoints
  - ✅ Type-safe API contracts with Zod validation
  - ✅ Comprehensive test coverage (14/16 assignment tests passing)
  - ✅ **Selection Memory**: localStorage integration for remembering last selections
  - ✅ **Category Integration**: People grouped by category with color coding
- ✅ **Schedule Editing Mode System**: Complete role-based editing permissions
  - ✅ **Permission Detection**: `isEditable()`, `isPublished()`, `isRequest()` methods
  - ✅ **Visual Status Indicator**: Real-time editing mode display component
  - ✅ **Conditional Menus**: Edit-only items show/hide based on schedule permissions
  - ✅ **Legacy Compatibility**: Matches CakePHP `$editable` flag behavior exactly
- ✅ **Shift Creation Integration**: Complete in-schedule shift creation system
  - ✅ **Context-Aware Modals**: Shift creation with pre-filled area/day/time context
  - ✅ **Hover-Based UI**: Legacy-compatible add shift buttons on schedule cells
  - ✅ **Global Modal System**: Centralized shift creation from any schedule view
  - ✅ **Permission Integration**: Shift creation only available for editable schedules
- ✅ **Shift Editing Integration**: Complete in-schedule shift editing system
  - ✅ **Click-to-Edit**: Click on shift times to open edit modal (legacy UX pattern)
  - ✅ **Full Form Editing**: Edit area, day, times, and people count with validation
  - ✅ **Assignment Protection**: Prevents reducing people count below current assignments
  - ✅ **Delete Functionality**: Safe shift deletion with confirmation dialog
  - ✅ **Permission-Based**: Edit functionality only available for editable schedules
- ✅ **Assignment UI Integration**: Complete frontend assignment system
  - ✅ **Assignment Modal**: People selection with category grouping and conflict indicators
  - ✅ **Click-to-Assign Workflow**: Clickable assignment areas in schedule views
  - ✅ **Real-time Conflict Detection**: Shows time conflicts, off days, and existing assignments
  - ✅ **"Other" Assignment Support**: Custom name assignments for non-person entries
  - ✅ **Global Modal Integration**: Centralized assignment modal management
  - ✅ **Legacy UX Compatibility**: Maintains exact CakePHP user interaction patterns
- ✅ Database structure with all models
- ✅ API foundation with error handling
- ✅ Comprehensive test coverage (458+ tests: 45 shared + 196 backend + 213+ frontend)

### ✅ **Working Features Summary**

All core systems are operational with comprehensive test coverage (458+ tests):

- **Schedule Views**: Area/person/gaps schedule display with navigation modals
- **Shift Management**: Context-aware creation/editing with hover UI and validation
- **Assignment System**: Complete frontend and backend with click-to-assign workflow
- **Schedule Context**: Current schedule system with automatic scoping
- **User/Areas/Categories**: Full CRUD operations with role-based permissions

## Development Commands

```bash
# Development
npm run dev           # Start both frontend and backend
npm run dev:backend   # Backend only
npm run dev:frontend  # Frontend only

# Quality Checks (ALWAYS RUN AFTER COMPLETING TASKS)
npm run check         # TypeScript compilation across all workspaces
npm run test          # Run all tests (450+ tests must pass)

# Database
npm run migrate       # Run Prisma migrations
npm run prisma        # Access Prisma Studio
npm run setup         # Full setup (install + migrate + seed)
```

## Implementation Guidelines

### Always Follow These Patterns

1. **Small Functions**: Keep functions focused on single responsibility
2. **Always Write Tests**: Every service function must have unit tests
3. **Use Shared Types**: All API contracts use `@shared/types`
4. **Schedule Context**: All operations must respect current schedule
5. **Legacy UX Compatibility**: Maintain exact user interaction patterns

### Quality Standards

- **Required**: `npm run check` must pass after every task
- **Testing**: `npm run test` must pass after every task
- **Type Safety**: Full TypeScript coverage, no `any` types
- **Legacy Reference**: Study CakePHP code before implementing features

## User Roles & Permissions

- **Operations**: Full system access, manage users/schedules, approve requests
- **Manager**: Manage assigned areas, create/submit requests, view published schedules
- **Personnel**: View published schedules only, see own assignments

## Key Architecture Files

- **Database Schema**: `backend/prisma/schema.prisma` - Complete data model
- **Schedule Context**: `frontend/src/store/scheduleStore.ts` - Current schedule state
- **API Routes**: `backend/src/routes.ts` - All endpoints
- **Time Utilities**: `shared/src/timeUtils.ts` - Centralized time handling
- **Test Coverage**: 450+ tests across all workspaces

## Legacy Integration Principle

**Before implementing any feature**: Study the legacy CakePHP code to understand user workflows, business logic, and interaction patterns. Maintain the exact user experience while modernizing the implementation.

**Key Areas to Reference**:

- Controllers (`/controllers/`) - User workflows and interactions
- Models (`/models/`) - Business rules and validation
- Views (`/views/`) - UI patterns and user actions

---

**Status**: 🎉 **Assignment System Complete** - Full scheduling workflow operational, 458+ tests passing

**Focus**: Ready for advanced workflows (People Enhancement, Request System, Schedule Management)

- always keep the md files up to date after finishing a task