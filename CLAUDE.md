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

- Pixel-perfect legacy schedule view compliance.
  - See: `/new-app/LEGACY_AREA_SCHEDULE_SPECIFICATION.md`
  - Details: Phase 7 section in `/new-app/CLAUDE.md`
