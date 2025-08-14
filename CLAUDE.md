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

- **Refine Assignment Modal** (HIGH PRIORITY - Polish for production)
  - ✅ Assignment system is working with click-to-assign functionality
  - ⚠️ Now needs detailed refinement to match legacy modal exactly
  - Study carefully: `/views/assignments/assign.ctp` for exact layout
  - Check: modal title, people sorting, category styling, conflict display
  - Verify: "Other" input position, button placement, keyboard shortcuts
  - Test with users familiar with legacy system for muscle memory
  - This polish is critical for user adoption and training
