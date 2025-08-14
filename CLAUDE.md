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

- **Legacy Shift Display Analysis & Implementation** (HIGH PRIORITY - Critical for production)
  - ✅ Assignment modal is complete and working perfectly with real-time updates
  - ⚠️ Now analyze how the legacy app handled the shift display on the area schedule
  - **Study systematically**: `/views/schedules/area.ctp`, `/views/helpers/schedule.php`, `/views/elements/shift.ctp`, `/webroot/css/schedule.css`
  - **Document every action**: Left click, right click, hover states, double-click, keyboard shortcuts
  - **Document every visual detail**: Empty shifts, partial shifts, full shifts, starred assignments, conflict indicators, category colors
  - **Document styling**: Exact dimensions, margins, padding, font sizes, color codes, hover effects
  - **Analyze interactions**: Assignment clicks, shift editing, drag/drop, tooltips, loading states
  - **Implement pixel-perfect match**: This is critical for user muscle memory and training
  - Focus on area schedule view as it's the most commonly used interface
