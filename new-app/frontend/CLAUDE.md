# Frontend Development Instructions

## Project Context

You are developing the frontend for a workforce scheduling application. This is a React + Vite application that consumes a REST API to replace a legacy CakePHP interface.

## Key Requirements

### Speed & Simplicity
- Use established React patterns and libraries
- Component libraries (Shadcn/UI or similar) for rapid development
- Straightforward state management (React Query + Zustand)
- Responsive design that works on mobile

### Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI or similar component library
- **State Management**: TanStack Query (React Query) + Zustand store
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios or fetch

## API Integration

The backend API specification is in `/docs/API_ENDPOINTS.md`. Key patterns:
- JWT token authentication via Authorization header
- RESTful endpoints with consistent error responses
- Role-based data filtering (operations see everything, managers see their areas, personnel see published only)

## Authentication Flow

Based on `/docs/AUTH_SPECS.md`:
- Login form → JWT token → store in localStorage
- Include token in all API requests
- Redirect to login if token expires
- Role-based navigation and feature access

## Core User Workflows

From `/docs/BUSINESS_WORKFLOWS.md`, key user journeys:

### Manager Workflow
1. Login → View published schedules
2. Create area request → Build schedule → Submit to operations
3. Manage people in their areas
4. View/edit shifts and assignments

### Operations Workflow  
1. Login → Access all features
2. Manage users and system settings
3. Review/approve schedule requests
4. Publish schedules with date ranges
5. Full schedule editing capabilities

### Personnel Workflow
1. Login → View published schedules
2. See their assignments
3. Basic read-only access

## Component Architecture

```
frontend/
├── package.json
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── schedules/
│   │   │   ├── ScheduleList.tsx
│   │   │   ├── ScheduleGrid.tsx
│   │   │   └── ScheduleForm.tsx
│   │   ├── shifts/
│   │   │   ├── ShiftGrid.tsx
│   │   │   ├── ShiftForm.tsx
│   │   │   └── AssignmentModal.tsx
│   │   └── people/
│   │       ├── PeopleList.tsx
│   │       └── PersonForm.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── SchedulesPage.tsx
│   │   ├── AreasPage.tsx
│   │   └── PeoplePage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSchedules.ts
│   │   └── useAssignments.ts
│   ├── services/
│   │   ├── api.ts (axios setup)
│   │   ├── auth.ts
│   │   └── schedules.ts
│   ├── store/
│   │   ├── authStore.ts (Zustand)
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── api.ts
│   │   └── auth.ts
│   └── utils/
│       ├── formatters.ts
│       └── constants.ts
```

## State Management Strategy

### React Query (TanStack Query)
- API data fetching and caching
- Automatic background refetching
- Optimistic updates for assignments

### Zustand Store
- Authentication state (user, token, roles)
- UI state (selected schedule, sidebar state)
- Current schedule context

### Local Component State
- Form state (React Hook Form)
- UI interactions (modals, dropdowns)

## Key UI Components

### Schedule Grid/Calendar View
- Display areas as columns, days as rows
- Drag-and-drop for assignments
- Color coding by person categories
- Conflict highlighting

### Assignment Management
- Modal for assigning people to shifts
- Availability checking and conflict warnings
- Star/unstar assignments
- Swap assignment functionality

### Request Workflow (Managers)
- Create request form with area/schedule selection
- Progress indicator (draft → submitted → accepted)
- Email confirmation feedback

### User Management (Operations)
- User list with role management
- Area assignment for managers
- Password reset functionality

## Responsive Design

- Mobile-first approach with Tailwind
- Schedule grid adapts to smaller screens
- Touch-friendly assignment interface
- Sidebar collapses on mobile

## Development Status

### ✅ Phase 1: Foundation (COMPLETED)
1. ✅ Authentication flow and protected routing
2. ✅ Basic layout with navigation
3. ✅ Role-based header menus (Operations, Manager, Personnel)
4. ✅ People page with category management
5. ✅ Dropdown menu system with hover behavior

### 🚧 Phase 2: Core Features (IN PROGRESS)
1. ✅ People and area management UI
2. 🔄 Backend API integration
3. ⭕ Shift creation and editing
4. ⭕ Assignment interface with drag-and-drop

### 🔜 Phase 3: Workflows (PLANNED)
1. Schedule copying and publishing
2. Request submission workflow
3. Email notifications feedback
4. Undo/redo functionality

### 🔜 Phase 4: Polish (PLANNED)
1. Advanced calendar views
2. Mobile optimization
3. Loading states and error handling
4. Performance optimization

## Current Frontend Architecture

### ✅ Implemented Components
- **Layout**: Header, Layout with role-based navigation
- **UI Components**: MenuDropdown, MenuItem, Modal, BoxyButton
- **Pages**: HomePage, PeoplePage, BigBoardPage, LoginPage
- **Services**: API client setup, auth service, people service
- **State**: Zustand auth store, React Query for server state
- **Testing**: 17 focused tests covering component behavior and regressions

### 🔧 Component Patterns Established
- **MenuDropdown**: Reusable hover-based dropdown with instant switching
- **MenuItem**: Navigation component with proper SPA routing
- **MenuContext**: Shared state for coordinated menu behavior
- **Modal System**: Reusable modal for forms and dialogs

### 🧪 Testing Strategy
- **17 Tests**: Focused, essential coverage without redundancy
- **Unit Tests**: Component behavior and interactions
- **Integration Tests**: Multi-component workflows
- **Regression Tests**: Specific bug fixes (person menu issue)
- **Test Structure**: Co-located with components, shared utilities

### 📊 Code Quality Metrics
- **Test Coverage**: Core functionality and user interactions
- **Component Architecture**: Separation of concerns, reusability
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized menu switching, efficient re-renders

## Development Commands

Based on the workspace setup:
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Scheduler
```

## Key Implementation Notes

1. **Authentication First**: Implement login and protected routes early
2. **Component Library**: Use Shadcn/UI or similar for consistent UI
3. **API Integration**: Set up React Query and API client early
4. **Mobile Considerations**: Schedule grid needs to work on phones
5. **Error Handling**: Consistent error boundaries and user feedback
6. **Loading States**: Show loading spinners for all async operations

## Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation for schedule grid
- Screen reader friendly

Remember: Focus on getting core functionality working quickly. The schedule grid view and assignment interface are the most complex parts - start with simple list views and iterate toward more advanced UIs.