# Frontend Architecture Documentation

## Component Architecture

### 🏗️ Design Principles

1. **Separation of Concerns**: Logic separated from presentation
2. **Reusability**: Components designed for multiple contexts
3. **Testability**: Clean interfaces and dependencies
4. **Type Safety**: Full TypeScript coverage
5. **Legacy Compatibility**: Matches CakePHP app behavior

### 📁 Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout-specific components
│   ├── people/          # Domain-specific components
│   └── ui/              # Generic UI primitives
├── contexts/            # React contexts for global state
├── hooks/               # Custom React hooks
├── pages/               # Route-level page components  
├── services/            # API and external service layers
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
└── test/                # Test utilities and specs
```

## 🧩 Component Patterns

### UI Primitives (`components/ui/`)

#### **MenuDropdown** + **MenuItem**
- **Purpose**: Hover-based navigation menus
- **Features**: Instant switching, delayed close, mobile support
- **Dependencies**: MenuContext for coordinated behavior
- **Pattern**: Provider + Consumer with shared state

```tsx
<MenuDropdown trigger="People">
  <MenuItem to="/people">View Schedule...</MenuItem>
  <MenuItem to="/people/add">New Person...</MenuItem>
</MenuDropdown>
```

#### **Modal**
- **Purpose**: Modal dialogs for forms and confirmations
- **Features**: Backdrop clicking, escape key, focus management
- **Pattern**: Compound component with built-in overlay

#### **BoxyButton**
- **Purpose**: Legacy-styled buttons matching CakePHP app
- **Features**: Consistent hover states, accessibility

### Layout Components (`components/layout/`)

#### **Header**
- **Purpose**: Role-based navigation bar
- **Features**: Operations/Manager/Personnel menu visibility
- **Dependencies**: MenuProvider, AuthStore
- **Pattern**: Conditional rendering based on user roles

#### **Layout**
- **Purpose**: Page layout wrapper
- **Features**: Header integration, responsive design

### Domain Components (`components/people/`)

#### **AddPersonForm** / **AddCategoryForm**
- **Purpose**: Domain-specific form components
- **Features**: React Query integration, validation, error handling
- **Pattern**: Form state + API mutations + optimistic updates

## 🔄 State Management

### Global State (Zustand)
- **AuthStore**: User authentication, roles, permissions
- **Pattern**: Simple store with computed properties

### Server State (React Query)
- **People**: CRUD operations with cache invalidation
- **Categories**: Reference data with background sync
- **Pattern**: Query + mutation hooks with optimistic updates

### Component State (useState)
- **Form Data**: Local form state before submission
- **UI State**: Modals, dropdowns, loading states
- **Pattern**: Co-located with component that owns the state

### Context State (React Context)
- **MenuContext**: Coordinated menu behavior across header
- **Pattern**: Provider at app level, consumer in components

## 🔧 Service Layer

### API Services (`services/`)
- **Abstraction**: Clean API interfaces independent of implementation
- **Error Handling**: Consistent error types and messaging
- **Type Safety**: Full TypeScript integration with request/response types

```tsx
// Example service pattern
export const peopleService = {
  getPeople: (): Promise<Person[]> => api.get('/api/people'),
  createPerson: (data: CreatePersonRequest): Promise<Person> => 
    api.post('/api/people', data),
}
```

## 🧪 Testing Strategy

### Test Types & Coverage

1. **Unit Tests**: Component behavior, state management
2. **Integration Tests**: Component interactions, user workflows  
3. **Regression Tests**: Specific bug fixes (person menu issue)

### Test Organization

- **Component Tests**: Co-located with components (`__tests__/`)
- **Integration Tests**: Top-level test directory
- **Test Utilities**: Shared mocks, helpers, providers

### Coverage Goals

- **Critical Paths**: 100% (authentication, navigation, data mutations)
- **UI Components**: 80% (behavior, not styling)
- **Edge Cases**: Regression tests for bugs

## 🎯 Quality Patterns

### Type Safety
- **Strict TypeScript**: No `any` types
- **API Contracts**: Shared types between frontend/backend
- **Runtime Validation**: Zod schemas for API responses

### Error Handling
- **Boundary Components**: React error boundaries
- **API Errors**: Consistent error messaging
- **User Feedback**: Loading states, error messages, success notifications

### Performance
- **Code Splitting**: Route-based lazy loading
- **React Query**: Background updates, cache management
- **Memoization**: Only where needed, avoid premature optimization

## 🚀 Component Guidelines

### Creating New Components

1. **Start Simple**: Single responsibility, clear props interface
2. **Add TypeScript**: Full type safety from the beginning  
3. **Consider Reusability**: Could this be used elsewhere?
4. **Write Tests**: At least happy path and error cases
5. **Document Props**: JSDoc comments for complex components

### Refactoring Existing Components

1. **Extract Common Logic**: Custom hooks for shared behavior
2. **Reduce Prop Drilling**: Context for deeply nested state
3. **Split Large Components**: Break up components > 200 lines
4. **Improve Type Safety**: Add proper TypeScript types

### Deprecated Patterns

- ❌ **Class Components**: Use functional components + hooks
- ❌ **Inline Styles**: Use Tailwind CSS classes
- ❌ **Prop Drilling**: Use context for global state
- ❌ **Manual Event Handling**: Use established patterns (MenuDropdown)

## 📊 Metrics & Monitoring

### Bundle Size
- **Target**: < 1MB compressed for initial load
- **Monitoring**: Webpack Bundle Analyzer

### Performance
- **Target**: < 100ms interaction response time
- **Monitoring**: Core Web Vitals

### Type Coverage
- **Target**: 100% TypeScript coverage
- **Monitoring**: `tsc --noEmit` in CI

---

This architecture supports rapid development while maintaining code quality and testability. The patterns established here should guide future component development.