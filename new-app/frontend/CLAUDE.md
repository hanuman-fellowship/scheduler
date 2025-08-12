# Frontend Development Instructions

## Project Context

You are developing the frontend for a workforce scheduling application. This is a React + Vite application that consumes a REST API to replace a legacy CakePHP interface.

**⚠️ Critical Requirement**: Before implementing any new UI component or user interaction, you MUST examine the legacy CakePHP views and templates to understand the exact user experience, workflow steps, and interface patterns. While we modernize the implementation, we must preserve the user journey and interaction design.

## 🎯 Core Development Principles

### **Dumb Views That Take Advantage of Reusable Components**

Components should be focused on display logic and receive data via props:

```typescript
// ✅ GOOD: Dumb component that receives data
interface CategoryListProps {
  categories: Category[];
  onCategoryCreate: (category: CreateCategoryInput) => void;
  onCategoryEdit: (id: number, category: UpdateCategoryInput) => void;
  loading?: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onCategoryCreate,
  onCategoryEdit,
  loading = false
}) => {
  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-2">
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          category={category}
          onEdit={(data) => onCategoryEdit(category.id, data)}
        />
      ))}
      <AddCategoryForm onSubmit={onCategoryCreate} />
    </div>
  );
};

// ❌ BAD: Component that fetches its own data
export const CategoryList: React.FC = () => {
  // Don't put API calls, business logic in components
};
```

### **Separate Logic from Display**

Use custom hooks and services to handle business logic:

```typescript
// ✅ GOOD: Logic in custom hook
export const useCategories = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getCategories
  });

  const createCategoryMutation = useMutation({
    mutationFn: categoriesService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    }
  });

  return {
    categories,
    loading: isLoading,
    createCategory: createCategoryMutation.mutate,
  };
};

// ✅ Component uses the hook
export const CategoriesPage: React.FC = () => {
  const { categories, loading, createCategory } = useCategories();

  return (
    <CategoryList
      categories={categories}
      loading={loading}
      onCategoryCreate={createCategory}
    />
  );
};
```

### **Make Sure Important Functionality Is Tested**

Focus on testing user interactions and critical paths:

### **Always Run Quality Checks When Completing Tasks**

**Required Step**: After completing any development task, always run `npm run check` from the `new-app/` directory to ensure:

- TypeScript compilation passes
- All workspaces have consistent types
- No type errors exist across the codebase
- Code quality standards are maintained

**Command**: `cd new-app && npm run check`

```typescript
// ✅ GOOD: Test user interactions
test('should create category when form is submitted', async () => {
  const mockSubmit = vi.fn();
  render(<AddCategoryForm onSubmit={mockSubmit} />);

  const user = userEvent.setup();

  await user.type(screen.getByLabelText('Category Name'), 'Test Category');
  await user.click(screen.getByRole('button', { name: 'Create Category' }));

  expect(mockSubmit).toHaveBeenCalledWith({
    name: 'Test Category',
    color: expect.any(String)
  });
});

// ✅ Test component behavior
test('should show loading state while categories are loading', () => {
  render(<CategoryList categories={[]} loading={true} onCategoryCreate={vi.fn()} />);

  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
});
```

## Key Requirements

### Speed & Simplicity

- Use established React patterns and libraries
- Build reusable component library for consistency
- Keep components simple and focused
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

### ✅ Phase 2: Schedule View System (COMPLETED)

1. ✅ Complete schedule view implementation (area, person, gaps)
2. ✅ Backend API integration with proper error handling
3. ✅ Interactive schedule grid with time slots and shift display
4. ✅ Navigation system with modal selection and keyboard shortcuts
5. ✅ Visual styling with legacy compatibility (774px width, today highlighting)
6. ✅ Comprehensive test coverage for all schedule components

### 🔜 Phase 3: Core Scheduling Operations (NEXT)

1. ⭕ Shift creation and editing with time picker interface
2. ⭕ Assignment interface with drag-and-drop functionality
3. ⭕ Real-time schedule updates and conflict detection
4. ⭕ Floating shifts management

### 🔜 Phase 4: Workflows (PLANNED)

1. Schedule copying and publishing workflow
2. Request submission workflow (manager → operations)
3. Email notifications feedback
4. Undo/redo functionality

### 🔜 Phase 5: Polish (PLANNED)

1. Advanced calendar views and filtering
2. Mobile optimization for touch interfaces
3. Performance optimization for large schedules
4. Advanced accessibility features

## Current Frontend Architecture

### ✅ Implemented Components

- **Layout**: Header, Layout with role-based navigation
- **UI Components**: MenuDropdown, MenuItem, Modal, BoxyButton
- **Pages**: HomePage, PeoplePage, BigBoardPage, LoginPage, AreasPage
- **Schedule Components**: ScheduleView, ScheduleGrid, ShiftCell, ScheduleHeader, FloatingShifts
- **Selection Components**: AreaSelectionContent, PersonSelectionContent with category grouping
- **Services**: API client setup with retry logic, auth service, people service, areas service, schedule view service
- **State**: Zustand auth store, React Query for server state with proper error handling
- **Global Modal System**: Centralized modal management via GlobalModalContext
- **Navigation System**: Working schedule navigation with keyboard shortcuts (Ctrl+A, Ctrl+P)
- **Testing**: 114+ focused tests covering component behavior, interactions, and regressions

### 🔧 Component Patterns Established

- **MenuDropdown**: Reusable hover-based dropdown with instant switching
- **MenuItem**: Navigation component with proper SPA routing
- **MenuContext**: Shared state for coordinated menu behavior
- **Global Modal System**: Centralized modal management that can be triggered from anywhere
  - Supports shift, person, category, and area creation modals
  - No page navigation required - modals open instantly on current page
  - Accessible via `useGlobalModal()` hook from any component

### 🧪 Testing Strategy

- **78 Tests**: Focused, essential coverage without redundancy
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

## 📝 Documentation Maintenance

### Keep Documentation Current

As you develop frontend features:

1. **Update Component Documentation**: Document new reusable components with usage examples
2. **Update Shared Types**: Keep types current with API changes
3. **Document State Management**: New hooks and stores should be documented
4. **Update Examples**: Keep code examples current with actual implementation

### Testing Standards

- **User Interactions**: Test what users actually do (clicking, typing, navigating)
- **Component Behavior**: Test props, state changes, and rendering logic
- **Integration Tests**: Test component + hook combinations
- **Avoid Testing Implementation Details**: Focus on behavior, not internal state

### Component Library Standards

- **Consistent API**: Similar props patterns across components
- **TypeScript First**: All components should have proper type definitions
- **Accessibility**: Use semantic HTML and ARIA labels
- **Documentation**: Include usage examples and prop documentation

Remember: Focus on getting core functionality working quickly with well-tested, reusable components. The schedule grid view and assignment interface are the most complex parts - start with simple list views and iterate toward more advanced UIs while maintaining high code quality.
