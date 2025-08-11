# Scheduler Application Specifications

This directory contains all the specifications and documentation for the new scheduler application.

## 📋 Specifications

### Core Documentation
- [Project Structure Plan](./PROJECT_STRUCTURE_PLAN.md) - Directory structure and deployment plan
- [Data Model](./DATA_MODEL_SIMPLE.md) - Database schema and relationships
- [API Endpoints](./API_ENDPOINTS.md) - REST API specifications  
- [Authentication](./AUTH_SPECS.md) - Auth flow and authorization rules
- [Business Workflows](./BUSINESS_WORKFLOWS.md) - Core business logic and processes

## 🎯 Development Phases

### Phase 1: Foundation
1. Set up backend with Express + Prisma + JWT auth
2. Set up frontend with React + Vite + basic routing
3. Implement user authentication flow
4. Basic database schema and migrations

### Phase 2: Core Features  
1. Schedule management (create, copy, publish)
2. Area and people management
3. Basic shift creation and assignment
4. Role-based permissions

### Phase 3: Advanced Features
1. Schedule branching and merging
2. Change tracking (undo/redo)
3. Schedule requests workflow
4. Email notifications

### Phase 4: Polish
1. UI/UX improvements
2. Performance optimization
3. Testing and error handling
4. Deployment automation

## 🚀 Quick Start

From the `/new-app` directory:

```bash
# Set up development environment
direnv allow
devenv up

# Install dependencies and set up database
npm run setup

# Start development servers
npm run dev
```

This will start both the backend API server and the React development server with live reloading.

## 📚 Legacy Analysis

The original analysis of the CakePHP application can be found in the root `/docs` directory. These specifications are based on that analysis but adapted for modern development practices.