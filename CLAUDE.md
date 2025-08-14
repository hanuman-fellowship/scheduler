# Scheduler - Minimal Guide

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

- Interactive Assignment System (HIGH PRIORITY - Core scheduling functionality)
  - Click empty shift slots to open assignment modal
  - Show available people with conflict detection
  - Single-click assignment with visual feedback
  - Study legacy: `/views/areas/schedule.ctp` and `/controllers/assignments_controller.php`
  - Backend APIs already exist, need frontend modal UI
  - Essential for daily scheduling operations
