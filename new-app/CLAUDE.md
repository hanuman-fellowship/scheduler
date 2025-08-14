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

**Everything operates within a "current schedule" context** - this is the core architectural principle:

- **People are schedule-scoped**: `people_schedules` table links people to specific schedules with categories
- **Current schedule**: Loaded on app startup, persists in `scheduleStore` (frontend) + localStorage
- **All operations**: Must include `scheduleId` - automatically injected by schedule context system
- **Schedule switching**: Available to Operations users, changes entire app context

## Reference Documentation

- **[Database Schema](./docs/DATA_MODEL_SIMPLE.md)**: Complete data model reference
- **[Menu Implementation Status](./MENU_IMPLEMENTATION_STATUS.md)**: Detailed status of all 63 legacy menu items
- **[Backend Guide](./backend/CLAUDE.md)**: Backend-specific instructions
- **[Frontend Guide](./frontend/CLAUDE.md)**: Frontend-specific instructions

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

## User Roles & Permissions

- **Operations**: Full system access, manage users/schedules, approve requests, edit any schedule
- **Manager**: Manage assigned areas, create/edit shifts on draft requests only (request=2), view published schedules
- **Personnel**: View published schedules only, see own assignments, no editing capabilities

### **Legacy Permission Behavior**
Based on CakePHP `redirectIfNotEditable()` function:
- Managers can only modify schedules with `request = 2` (draft status)
- Operations users bypass all schedule editing restrictions
- Permission checks maintain thin controller pattern via `schedulePermissionService`

## 🎯 Next Development Priority: Assignment Interface

**Objective**: Implement interactive assignment system for area schedule views

### **Legacy System Analysis Required**

**⚠️ CRITICAL**: Before implementation, study the legacy CakePHP assignment workflow:

1. **View Files to Examine**:
   - `/views/areas/schedule.ctp` - Main area schedule view
   - `/views/assignments/` - Assignment-related views and modals
   - `/views/elements/` - Reusable assignment UI components

2. **Controller Logic to Study**:
   - `/controllers/assignments_controller.php` - Assignment CRUD operations
   - `/controllers/areas_controller.php` - Schedule view integration
   - How empty shift slots trigger assignment modals
   - Modal population with available people

3. **Key Interactions to Preserve**:
   - **Click empty slot** → Opens assignment modal
   - **Modal shows available people** with conflict indicators
   - **Single click assigns person** to shift
   - **Visual feedback** distinguishes assigned vs empty slots
   - **Star system** for priority assignments
   - **Conflict warnings** prevent double-booking

4. **Technical Implementation Notes**:
   - Modal should be **fast and responsive**
   - People list should show **availability status**
   - **Real-time conflict detection** as user selects
   - **Optimistic updates** for immediate feedback

### **Implementation Approach**
1. Study legacy assignment modal UI/UX patterns
2. Design React components matching legacy interaction flow
3. Integrate with existing assignment APIs (already implemented)
4. Test assignment workflow end-to-end
5. Ensure performance with large people lists

---

## Key Architecture Files

- **Database Schema**: `backend/prisma/schema.prisma` - Complete data model
- **Schedule Context**: `frontend/src/store/scheduleStore.ts` - Current schedule state
- **API Routes**: `backend/src/routes.ts` - All endpoints
- **Time Utilities**: `shared/src/timeUtils.ts` - Centralized time handling
- **Assignment APIs**: `backend/src/services/assignmentService.ts` - Conflict detection and CRUD

## Legacy Integration Principle

**Before implementing any feature**: Study the legacy CakePHP code to understand user workflows, business logic, and interaction patterns. Maintain the exact user experience while modernizing the implementation.

**Key Areas to Reference**:
- Controllers (`/controllers/`) - User workflows and interactions
- Models (`/models/`) - Business rules and validation
- Views (`/views/`) - UI patterns and user actions

## Current Implementation Status

**✅ Fully Implemented**: 23 items (37%) - Core operations working including:
- User authentication and management
- Schedule context system
- Areas, Categories, People management
- Schedule views (area/person/gaps)
- Shift creation and editing
- Schedule copying and templates
- Publishing workflow

**🔄 Currently Working On**: Assignment Interface Enhancement
- **Next Priority**: Interactive assignment system for area schedule views
- **Goal**: Click empty shift slots to open assignment modal with available people
- **Legacy Study Required**: Examine CakePHP assignment modal interactions and workflow

**⚠️ Partially Implemented**: Assignment system backend APIs exist but missing frontend UI:
- Assignment CRUD operations (create, update, delete, star) ✅
- Conflict detection and availability checking ✅  
- **Missing**: Interactive assignment interface in schedule grid
- **Missing**: Assignment modal with people selection
- **Missing**: Visual feedback for assignments vs empty slots

**❌ Missing Entirely**: 18 items (28%) - Not implemented

See [Menu Implementation Status](./MENU_IMPLEMENTATION_STATUS.md) for detailed breakdown.

---

**Status**: 🚀 **Core Systems Complete** - 510+ tests passing

### **Next Milestone: Assignment Interface**
**Target**: Complete interactive assignment system with legacy UX compatibility
- Study legacy assignment modal workflow first
- Test assignment conflicts and availability checking  
- Ensure fast, responsive UI for large people lists
- Maintain existing test coverage standards

**Keep documentation up to date after finishing tasks**