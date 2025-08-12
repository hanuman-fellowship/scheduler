# Scheduler Application - Main Instructions

## Project Overview

This is a modern rewrite of a legacy CakePHP workforce scheduling application. The system manages schedules, areas, people, shifts, and assignments with role-based permissions and complex workflow features like branching, merging, and change tracking.

## Architecture

- **Frontend**: React + Vite + TypeScript → Deploy to Vercel
- **Backend**: Node.js + Express + Prisma + PostgreSQL → Deploy to Render
- **Development**: devenv + direnv for local PostgreSQL

## Getting Started

```bash
# From /new-app directory
direnv allow          # Enable devenv
devenv up             # Start PostgreSQL 
npm install           # Install all dependencies
npm run setup         # Set up database and Prisma
npm run dev           # Start both backend and frontend
```

## Development Workflow

### Parallel Development
This project is designed for parallel development by multiple AI agents:

- **Backend Agent**: See `./backend/CLAUDE.md` for API development instructions
- **Frontend Agent**: See `./frontend/CLAUDE.md` for React development instructions
- **Full-Stack Agent**: Can work on both using the main specifications

### Key Principles

1. **Speed Over Perfection**: Get working features fast, iterate later
2. **Simple Patterns**: Use standard libraries and approaches
3. **Mobile-First**: Responsive design that works on phones
4. **Role-Based**: Operations > Manager > Personnel permissions

## Complete Specifications

All detailed specifications are in `/docs/`:

- **[Data Model](./docs/DATA_MODEL_SIMPLE.md)**: Database schema with integer PKs
- **[API Endpoints](./docs/API_ENDPOINTS.md)**: REST API specification
- **[Authentication](./docs/AUTH_SPECS.md)**: JWT auth and role-based permissions
- **[Business Workflows](./docs/BUSINESS_WORKFLOWS.md)**: Core business logic
- **[Project Structure](./docs/PROJECT_STRUCTURE_PLAN.md)**: Deployment plan

## Current Status & Next Steps

### ✅ Completed
- Project structure with shared/backend/frontend workspaces
- devenv.nix with local PostgreSQL
- TypeScript configuration with path mapping (@shared/*)
- Package.json files with proper workspace scripts
- Comprehensive specifications and documentation
- Prisma schema with all database models
- CLAUDE.md files for parallel development
- **Frontend Foundation**: React app with routing and authentication flow
- **Component Library**: Reusable UI components (MenuDropdown, MenuItem, etc.)
- **Testing Framework**: Vitest + React Testing Library setup with 31 passing tests
- **Navigation System**: Working dropdown menus with hover behavior
- **Menu System**: Instant switching between menus with proper UX

### 🚧 Current Work
- Backend API development and database connection
- Authentication middleware and JWT implementation
- API endpoint development for people, schedules, areas

### 🔜 Next Priorities
1. **Backend Foundation**: Express server with auth middleware and database
2. **API Endpoints**: REST API for people, schedules, areas management
3. **Authentication Integration**: Connect frontend auth with backend JWT
4. **Data Integration**: Replace mock data with real API calls

## Core Features Priority

### 🚀 Phase 1: Foundation (MVP)
- User authentication with JWT
- Schedule CRUD operations
- Area and people management
- Basic shift creation and assignment
- Role-based access control

### 📈 Phase 2: Core Workflows
- Schedule copying and templates
- Request submission (manager → operations)
- Schedule publishing workflow
- Assignment management with conflicts

### 🔧 Phase 3: Advanced Features
- Schedule branching and merging
- Change tracking (undo/redo)
- Email notifications
- Advanced calendar views

### ✨ Phase 4: Polish
- Mobile optimization
- Performance improvements
- Enhanced error handling
- Deployment automation

## User Roles & Permissions

### Operations (Admin)
- Full system access
- Manage all users, schedules, areas
- Publish schedules
- Approve schedule requests

### Manager
- Manage assigned areas only
- Create and submit schedule requests
- Manage people in their areas
- View published schedules

### Personnel
- View published schedules only
- See their own assignments
- Basic read-only access

## Technical Decisions Made

- **Database**: PostgreSQL with integer primary keys (not UUIDs)
- **Authentication**: JWT tokens with 24-hour expiration
- **State Management**: React Query + Zustand (not Redux)
- **Styling**: Tailwind CSS with component library
- **Deployment**: Vercel (frontend) + Render (backend + DB)
- **Prisma Client**: Generated to `/generated/prisma/` for monorepo sharing

## Development Environment

The project uses devenv for consistent local development:
- PostgreSQL running locally on port 5432
- Database: `scheduler` with user `scheduler_user`
- Node.js 20 with npm workspaces
- Hot reloading for both frontend and backend
- Database migrations and Prisma Studio

## Legacy Context

This replaces a CakePHP 1.x application with:
- Complex scheduling workflows with branch/merge
- Change tracking system for undo/redo
- Role-based permissions (operations/manager/personnel)
- Email integration for notifications
- Request submission workflow

The new app maintains feature parity while modernizing the tech stack and improving the user experience.

## File Structure

```
new-app/
├── shared/           # TypeScript types and Zod schemas
│   ├── src/types/    # API types, database types, auth types
│   └── src/schemas/  # Zod validation schemas
├── backend/          # Express API
│   ├── prisma/       # Database schema and migrations
│   ├── src/          # API routes, middleware, services
│   └── generated/    # Prisma client (shared)
├── frontend/         # React + Vite app
│   └── src/          # Components, pages, hooks, services
└── docs/             # Complete specifications
```

## Environment Variables

```
DATABASE_URL=postgresql://scheduler_user:scheduler_password@localhost:5432/scheduler
JWT_SECRET=your-jwt-secret-change-in-production
NODE_ENV=development
```

## Commands Reference

```bash
# Development
npm run dev           # Start both frontend and backend
npm run dev:backend   # Backend only
npm run dev:frontend  # Frontend only

# Database
npm run migrate       # Run Prisma migrations
npm run prisma        # Access Prisma CLI
npm run setup         # Full setup (install + migrate)

# Quality
npm run check         # TypeScript check all workspaces
npm run test          # Run tests all workspaces
npm run build         # Build for production
```

## Next Steps

1. **Verify Database**: Test devenv PostgreSQL connection
2. **Run Migrations**: Create initial database schema
3. **Shared Types**: Create API contracts and validation schemas
4. **Auth Foundation**: Basic Express server with JWT middleware
5. **React Setup**: Basic routing and authentication flow

Each component has detailed instructions in its CLAUDE.md file. Reference the `/docs/` specifications for any business logic questions.

---

**Branch**: `new-app-setup`
**Last Updated**: Created Prisma schema, ready to test database connection