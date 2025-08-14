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
- **People Management Enhanced**: Advanced retire/restore functionality with category-based organization
- **Request System**: Complete Manager → Operations workflow for schedule requests and approvals
- **Schedule Management**: Complete schedule copying, template system, and publishing workflow

## 🎯 Current Development Priority

**Schedule Grid Implementation**: Creating pixel-perfect replica of legacy schedule design
- Reference: `/example_schedule/page.html` and `/example_schedule/schedule.css`
- Implementation plan: `/example_schedule/CLAUDE.md`
- Focus: Exact visual match with legacy CakePHP system

## 📋 Next Development Priorities

### Phase 8: Menu Implementation Completion (After Schedule Grid)

**After completing pixel-perfect schedule views, focus on remaining menu items:**
- **Advanced Features**: Email notifications, change tracking, mobile optimization
- **Performance**: Large schedule handling optimization
- **Final Polish**: Complete any remaining UI refinements

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
- ✅ **People Management Enhanced**: Complete retire/restore functionality for workforce management
  - ✅ **Retire/Restore Backend**: Service layer with bulk operations and schedule scoping
  - ✅ **Category-Based Display**: People grouped by category with sortOrder support
  - ✅ **RetireModal UI**: Bulk selection with "Select All" per category functionality
  - ✅ **RestoreModal UI**: Two-step restoration process (select person, then category)
  - ✅ **Enhanced PeoplePage**: Category-organized display with retire/restore actions
  - ✅ **Comprehensive Testing**: Full test coverage for retire/restore workflows
- ✅ **Request System**: Complete Manager → Operations request workflow implementation
  - ✅ **3-State Workflow**: Draft (editable) → Submitted (review) → Accepted (merged) request lifecycle
  - ✅ **Request Creation**: Template-based request creation with base schedule options (published, templates, previous requests, blank)
  - ✅ **Manager Interface**: Draft request management with create, edit, submit, delete operations
  - ✅ **Operations Interface**: Submitted request review with area-grouped display and acceptance workflow
  - ✅ **Schedule Merging**: Smart conflict resolution when accepting requests (clear area vs merge options)
  - ✅ **Permission System**: Area-manager relationship validation and role-based access control
  - ✅ **API Integration**: Complete REST API with 7 endpoints for full request lifecycle
  - ✅ **Comprehensive Testing**: Full test coverage for request creation, submission, and acceptance workflows
- ✅ **Schedule Management System**: Complete schedule lifecycle management with legacy compatibility
  - ✅ **Schedule Copying**: Three copy types (full, structure-only, template) with parent/child relationships
  - ✅ **Template System**: Create reusable schedule templates with structure-only copying
  - ✅ **Publishing Workflow**: Publish schedules to date-based schedule groups with active schedule detection
  - ✅ **Schedule Groups**: Date-range based organization of published schedules
  - ✅ **Smart Data Handling**: Selective copying (areas, days, shifts, assignments) based on copy type
  - ✅ **Operations Interface**: Template creation, publishing controls, and group management
  - ✅ **Frontend Components**: Copy and publish modals with validation and user guidance
  - ✅ **API Integration**: 6 REST endpoints covering complete schedule management lifecycle
  - ✅ **Comprehensive Testing**: 12 test cases covering all schedule management workflows and edge cases
- ✅ **Schedule Editing UI**: User-friendly schedule editing interface matching legacy CakePHP workflow
  - ✅ **Edit a Copy Modal**: Simple modal to create editable copies of any schedule with automatic schedule switching
  - ✅ **Delete Schedule Modal**: Safe schedule deletion with validation preventing deletion of published schedules
  - ✅ **Global Modal Integration**: Seamless integration with existing modal system for consistent UX
  - ✅ **Permission Validation**: Frontend validation preventing unauthorized operations
  - ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
  - ✅ **Schedule Switching Fix**: Resolved TypeError in switchToSchedule function and improved API response handling
  - ✅ **Comprehensive Testing**: 25+ test cases covering all modal interactions, error states, and edge cases
- ✅ Database structure with all models
- ✅ API foundation with error handling
- ✅ Comprehensive test coverage (531+ tests: 45 shared + 234 backend + 252 frontend)

### ✅ **Working Features Summary**

All core systems are operational with comprehensive test coverage (531 tests):

- **Schedule Views**: Area/person/gaps schedule display with navigation modals
- **Shift Management**: Context-aware creation/editing with hover UI and validation
- **Assignment System**: Complete frontend and backend with click-to-assign workflow
- **People Management**: Enhanced retire/restore with category-based organization and bulk operations
- **Request Management**: Complete Manager → Operations workflow with template-based creation and smart merging
- **Schedule Management**: Complete copying, templates, and publishing system with schedule groups
- **Schedule Editing UI**: Edit a Copy and Delete Schedule modals with full validation and error handling
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
npm run test          # Run all tests (531+ tests must pass)

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
- **🆕 Legacy Schedule Reference**: `LEGACY_AREA_SCHEDULE_SPECIFICATION.md` - Complete pixel-perfect specification of legacy schedule view
- **🆕 Menu Implementation Status**: `MENU_IMPLEMENTATION_STATUS.md` - Complete status of all 63 legacy menu items

## Legacy Integration Principle

**Before implementing any feature**: Study the legacy CakePHP code to understand user workflows, business logic, and interaction patterns. Maintain the exact user experience while modernizing the implementation.

**Key Areas to Reference**:

- Controllers (`/controllers/`) - User workflows and interactions
- Models (`/models/`) - Business rules and validation
- Views (`/views/`) - UI patterns and user actions
- **🆕 Legacy Schedule Spec**: `LEGACY_AREA_SCHEDULE_SPECIFICATION.md` - Complete visual and functional specification

---

**Status**: 🚀 **Professional Scheduling System with Pixel-Perfect Legacy Views** - Full enterprise-grade scheduling with legacy-compatible UI, 531+ tests passing

**Latest Achievement**: ✅ **Pixel-Perfect Legacy Schedule Views** - Exact replication of CakePHP schedule display

### ✅ Phase 7: Schedule View Legacy Compliance (COMPLETED)

**Pixel-Perfect Legacy Schedule Implementation**: Successfully implemented exact legacy CakePHP schedule view specifications:
- ✅ **Two-Table Structure**: Header table (774px, no border) and main schedule table (774px, 2px border)
- ✅ **Exact Measurements**: Precise cell widths (99px, 222px, 107px, etc.) and heights (60px shifts, 26px hours)
- ✅ **Complex Positioning**: Pixel-perfect offsets with legacy CSS classes
- ✅ **Interactive Elements**: Hidden add buttons on hover, conditional display based on edit mode
- ✅ **Dynamic Styling**: Today highlighting (#FFFADC), off-day backgrounds (#DDDDDD)
- ✅ **Typography Matching**: Exact font sizes (.title 24px, #full_name 16px italic)
- ✅ **Print/Screen Modes**: CSS media queries for print-specific styling
- ✅ **Navigation Component**: Legacy-compatible schedule navigation arrows
- ✅ **Complete CSS Framework**: LegacySchedule.css with all legacy styles

### Phase 8: Menu Implementation Completion (After Schedule View)

After completing the pixel-perfect schedule view implementation, the next major focus is completing the menu system based on `MENU_IMPLEMENTATION_STATUS.md`.

**Current Menu Status**:
- **✅ Fully Implemented**: 23 items (37%) - Core operations working
- **⚠️ Partially Implemented**: 22 items (35%) - Routes exist, missing backend APIs  
- **❌ Missing Entirely**: 18 items (28%) - Not implemented

**Priority Implementation Order**:
1. **Request Workflows** (Essential for manager role)
   - Manager request creation and submission
   - Operations request review and approval
   - Request status tracking and management

2. **Advanced Schedule Management**
   - Template system implementation
   - Enhanced copying and deletion workflows

3. **People Management Enhancement**
   - Person retire/restore functionality
   - Category ordering system
   - Advanced people management features

**Final Focus**: Advanced features (Email Integration, Change Tracking, Mobile Optimization, Undo/Redo System)

- always keep the md files up to date after finishing a task