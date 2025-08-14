# Scheduler - Minimal Guide

## Documentation Philosophy

**Keep CLAUDE.md files lean and focused on what needs to be done.**

- ✅ **DO**: Current priorities, next steps, development guidelines
- ❌ **DON'T**: Implementation history, completed features, detailed explanations
- 📁 **INSTEAD**: Put implementation details in separate helper files (IMPLEMENTATION.md, STATUS.md, etc.)

## Where to find things

- **Detailed project guide**: `/new-app/CLAUDE.md`
- **Backend guide**: `/new-app/backend/CLAUDE.md`
- **Frontend guide**: `/new-app/frontend/CLAUDE.md`
- **Database schema**: `/new-app/backend/prisma/schema.prisma`

## Must-do best practices

- Study the legacy CakePHP app (`/controllers`, `/models`, `/views`) before implementing features
- Always write tests for new logic (backend services, frontend components)
- After every task run (from `/new-app`):

`npm run check`
`npm run test`

- Use shared types (`@shared/types`), thin controllers, single-responsibility functions
- Keep docs up to date after finishing a task

## Next up

- **Implement Scheduler3-Style Shift Display** (HIGH PRIORITY - Critical for production)
  - ✅ Assignment modal is complete - now focus on shift cell display
  - **Comprehensive analysis**: `/docs/SCHEDULER3_SHIFT_DISPLAY_ANALYSIS.md` - Complete documentation of legacy shift display functionality
  - **Reference files**: Key scheduler3 files for shift display implementation:
    - `app/views/schedules/area.ctp` - Main area schedule grid
    - `app/views/helpers/schedule.php` - Shift rendering helpers and formatting
    - `app/views/elements/shift.ctp` - Individual shift display elements
    - `app/webroot/css/schedule.css` - Complete styling for shifts and assignments
  - **Critical aspects to implement**:
    - Exact cell layout, spacing, and typography matching legacy
    - Assignment display with person names, categories, and colors
    - Interactive click behaviors (person links, assignment removal, etc.)
    - Hover states and visual feedback
    - Starred assignments display and functionality
    - Conflict indicators and warnings
    - Empty vs filled vs overfilled shift states
  - **Implementation approach**: Update ShiftCell component in new-app to match scheduler3 pixel-perfectly
  - This is essential for user training and muscle memory preservation
