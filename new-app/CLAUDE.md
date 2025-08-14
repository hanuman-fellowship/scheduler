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


## 🎯 Next Development Priority: Refine Assignment Modal Details

**Objective**: Carefully review and refine the assignment modal to match all legacy UI/UX details

### **Legacy System Deep Analysis Required**

**⚠️ CRITICAL**: The assignment modal is functional but needs detailed refinement to match the legacy system exactly:

1. **Detailed View Files to Study**:
   - `/views/assignments/assign.ctp` - Exact modal layout and behavior
   - `/views/helpers/schedule.php` - Assignment display formatting
   - `/views/elements/dialog.ctp` - Modal wrapper styling
   - Check exact text, spacing, colors, and interaction patterns

2. **Specific Details to Verify**:
   - **Modal title format** - Should it show shift details?
   - **People sorting** - By name, category, or availability?
   - **Category headers** - Exact styling and color usage
   - **Conflict display** - Inline vs tooltip vs separate section
   - **"Other" input** - Position, label, behavior
   - **Button placement** - Close, assign, cancel positions
   - **Keyboard shortcuts** - ESC to close, Enter to assign?
   - **Loading states** - Spinner style and position
   - **Empty states** - What shows when no people available?
   - **Success feedback** - Flash message, animation, or silent update?

3. **Performance Considerations**:
   - **Large lists** - How does legacy handle 100+ people?
   - **Search/filter** - Does legacy have people search?
   - **Scroll behavior** - Fixed headers, virtual scrolling?
   - **Modal size** - Responsive or fixed dimensions?

4. **Edge Cases to Test**:
   - Shift at full capacity
   - Person with multiple conflicts
   - Network errors during assignment
   - Concurrent assignments by multiple users

### **Refinement Approach**
1. Screenshot legacy assignment modal in various states
2. Document exact pixel dimensions, colors, fonts
3. Create side-by-side comparison with current implementation
4. List all discrepancies, no matter how small
5. Implement refinements with visual regression tests
6. Test with actual users familiar with legacy system

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

## Project Status

**Current**: Assignment system is functional. See [Implementation Status](./IMPLEMENTATION_STATUS.md) for details.

**Next Priority**: Polish assignment modal to match legacy system exactly.

---

**Keep documentation up to date after finishing tasks**