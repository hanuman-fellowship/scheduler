# Backend Development Instructions

## Project Context

You are developing the backend for a workforce scheduling application. This is a Node.js + Express + Prisma API that replaces a legacy CakePHP application.

## Key Requirements

### Speed & Simplicity

- Use standard patterns and libraries to ship fast
- Integer primary keys (not UUIDs)
- Straightforward REST API design
- Minimize complexity wherever possible

### Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Validation**: Zod or similar
- **Testing**: Vitest (if time permits)

## Database Schema

The complete Prisma schema is documented in `/docs/DATA_MODEL_SIMPLE.md`. Key entities:

- `users` with `roles` (operations/manager/personnel)
- `schedules` with branching via `parent_id`
- `areas`, `people`, `shifts`, `assignments`
- `changes`/`change_models`/`change_fields` for undo/redo
- Complete change tracking system

## API Specification

Full REST API specification is in `/docs/API_ENDPOINTS.md`. Key patterns:

- JWT authentication on all endpoints except `/api/auth/login`
- Role-based authorization (operations > manager > personnel)
- Consistent error responses with field-level validation
- Standard HTTP status codes

## Authentication & Authorization

Detailed specs in `/docs/AUTH_SPECS.md`:

- JWT tokens with 24-hour expiration
- Role-based middleware for endpoint protection
- Manager area access validation
- Password hashing with bcrypt

## Business Logic

Core workflows documented in `/docs/BUSINESS_WORKFLOWS.md`:

- Schedule creation, copying, publishing workflow
- Request submission (manager → operations)
- Assignment management with conflict detection
- Change tracking for undo/redo system
- Email notifications for key events

## File Structure

```
backend/
├── package.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── index.ts (Express app setup)
│   ├── auth/
│   │   ├── middleware.ts (JWT validation, role checks)
│   │   └── routes.ts (login, logout, change password)
│   ├── routes/
│   │   ├── users.ts
│   │   ├── schedules.ts
│   │   ├── areas.ts
│   │   ├── people.ts
│   │   ├── shifts.ts
│   │   ├── assignments.ts
│   │   └── ...
│   ├── services/ (business logic)
│   ├── utils/
│   └── types/
└── .env (DATABASE_URL, JWT_SECRET)
```

## Development Commands

Based on the workspace setup:

- `npm run dev` - Start development server with hot reload
- `npm run prisma -- migrate dev` - Run database migrations
- `npm run prisma -- studio` - Open Prisma Studio
- `npm run prisma -- generate` - Regenerate Prisma client

## Key Implementation Notes

1. **Start Simple**: Get basic CRUD operations working first
2. **JWT Middleware**: Implement auth middleware early for all protected routes
3. **Validation**: Use Zod schemas for request validation
4. **Error Handling**: Consistent error response format
5. **Database Seeding**: Create seed data for development
6. **Change Tracking**: The undo/redo system is complex - implement after basic features

## Priority Order

1. **Phase 1**: Auth, users, basic schedule CRUD
2. **Phase 2**: Areas, people, shifts, assignments
3. **Phase 3**: Schedule workflow (copy, publish, requests)
4. **Phase 4**: Change tracking, email notifications

## ✅ RESOLVED: Testing Architecture Issue

**The testing architecture has been refactored to use a single source of truth for routes.**

**When adding new API routes, you only need to update ONE file:**

1. `src/routes.ts` (production routes)
2. **That's it!** Tests automatically get the new route

See `TESTING_ROUTES.md` for detailed explanation of the new approach.

**Status: ✅ RESOLVED** - No more duplicate route maintenance required.

## Environment Variables

```
DATABASE_URL=postgresql://scheduler_user:scheduler_password@localhost:5432/scheduler
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Testing Strategy

- Focus on getting features working first
- Add basic integration tests for auth and key endpoints
- Unit tests for complex business logic (change tracking, merging)

Remember: The goal is a working application as fast as possible. Use standard patterns, avoid over-engineering, and reference the detailed specifications in `/docs/` for any questions about business logic or data relationships.
