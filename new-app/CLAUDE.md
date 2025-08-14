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
npm run db:query      # Run SQL queries: npm run db:query "SELECT * FROM users"
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

## 🎯 Next Development Priority: Legacy Shift Display Analysis & Implementation

**Objective**: Analyze and implement the exact legacy area schedule shift display with all interactions, hover states, and styling details

### **⚠️ CRITICAL TASK: Complete Legacy Shift UI Analysis**

The assignment modal has been refined and is working well, but now we need to ensure the shift display itself matches the legacy system exactly. This is critical for user adoption and training.

### **Legacy System Deep Analysis Required**

**Study these legacy files systematically:**

1. **Area Schedule Display**:
   - `/views/schedules/area.ctp` - Main area schedule view
   - `/views/helpers/schedule.php` - Shift rendering helpers and formatting
   - `/views/elements/shift.ctp` - Individual shift display elements
   - `/webroot/css/schedule.css` - Styling for shifts, assignments, and hover states

2. **Every Action and Interaction** (document each one):
   - **Left click on shift** - What happens? Edit? View? Assignment?
   - **Right click on shift** - Context menu? What options?
   - **Hover on shift** - What styling changes? Tooltips? Preview info?
   - **Click on assignment within shift** - Edit assignment? Person details?
   - **Hover on assignment** - Assignment details? Person info? Conflict warnings?
   - **Double-click behaviors** - Quick actions? Shortcuts?
   - **Keyboard shortcuts** - Arrow navigation? Enter to select? Delete to remove?

3. **Visual States and Styling**:
   - **Empty shift styling** - Border? Background? "Need X people" text?
   - **Partially filled shift** - How many assignments shown vs "Need X more"?
   - **Full shift styling** - Visual indicators for capacity reached?
   - **Overfilled shift** - Warning colors? Special styling?
   - **Starred assignments** - Star icon placement, color, size
   - **Conflict indicators** - Red text? Background colors? Icons?
   - **Category colors** - Where and how are category colors applied?
   - **Time overlap warnings** - Visual indicators for scheduling conflicts?

4. **Responsive and Layout Details**:
   - **Grid alignment** - How do shifts align within time slots?
   - **Text wrapping** - Person names, area names, shift details
   - **Overflow handling** - What happens with too many assignments?
   - **Cell sizing** - Fixed width? Dynamic? Minimum/maximum dimensions?
   - **Spacing and padding** - Exact pixel measurements between elements

5. **Interactive Feedback**:
   - **Loading states** - Spinners during assignment changes?
   - **Success/error feedback** - Flash messages? Color changes? Animations?
   - **Drag and drop** - Can assignments be moved between shifts?
   - **Selection states** - Visual feedback for selected shifts/assignments?

### **Implementation Approach**

1. **Document Current vs Legacy**:
   - Screenshot legacy area schedule in various states (empty, partial, full, conflicts)
   - Screenshot current implementation side-by-side
   - Create detailed comparison matrix of every visual and interaction difference

2. **Pixel-Perfect Analysis**:
   - Measure exact dimensions, margins, padding, font sizes
   - Document color hex codes for all states
   - Identify all CSS classes and styling rules used

3. **Interaction Analysis**:
   - Test every possible click, hover, keyboard interaction in legacy
   - Document the exact behavior and visual feedback for each
   - Note any special cases or edge behaviors

4. **Implementation Priority**:
   - Start with the most critical interactions (assignment click, shift hover)
   - Implement visual states and styling to match exactly
   - Add all secondary interactions and edge cases
   - Test with users familiar with legacy system for muscle memory validation

**This analysis is essential for user training and adoption. Users rely on specific visual cues and interaction patterns they've memorized from years of using the legacy system.**

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
