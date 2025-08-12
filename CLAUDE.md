# Scheduler Application - Development Best Practices

## Project Overview

Modern workforce scheduling application built with React + Node.js, replacing a legacy CakePHP system. Located in `/new-app/` directory.

**Architecture**: React + Vite + TypeScript (Frontend) | Node.js + Express + Prisma + PostgreSQL (Backend)

## <� Core Development Standards

### **Always Write Tests**

- **Backend**: Unit tests for all service layer business logic
- **Frontend**: Component tests for user interactions and critical paths
- **Integration**: API endpoint tests with real database
- **Requirement**: All new features must include comprehensive tests

### **Always Run Quality Checks**

**Required after completing ANY development task:**

```bash
cd /Users/shantam/Software/scheduler/new-app && npm run check
```

This command:

- Runs TypeScript compilation across ALL workspaces (shared, backend, frontend)
- Executes all tests to ensure nothing is broken
- Validates shared types consistency
- Must pass completely before considering any task complete

**If `npm run check` fails, the task is not done. Fix all errors before proceeding.**

### **Small, Testable, Maintainable Functions**

- **Backend**: Thin controllers that delegate to services
- **Frontend**: Dumb components that receive data via props
- **Shared Types**: Use `@shared/types` for API contracts
- **Single Responsibility**: Each function does one thing well

### **Testing Strategy**

```typescript
//  GOOD: Test business logic in services
describe("createCategory", () => {
  it("should create category with valid input", async () => {
    const input = { name: "Test", color: "#FF0000", scheduleId: 1 };
    const result = await categoriesService.createCategory(input);
    expect(result.name).toBe("Test");
  });
});

//  GOOD: Test user interactions in components
test("should create category when form is submitted", async () => {
  render(<CategoryForm onSubmit={mockSubmit} />);
  await user.click(screen.getByRole("button", { name: "Create" }));
  expect(mockSubmit).toHaveBeenCalled();
});
```

## =' Development Commands

```bash
# From /new-app directory
npm run dev           # Start both frontend and backend
npm run check         # TypeScript check all workspaces
npm run test          # Run all tests (required)
npm run setup         # Database setup and migrations
```

## =� Implementation Checklist

Before considering any feature complete:

-  Are functions small and focused?
-  Are there unit tests for business logic?
-  Are shared types used for API contracts?
-  Is `npm run check` passing?
-  Is important functionality tested?
-  Are all tests passing?

## =� Architecture Principles

### **Backend Patterns**

- Thin controllers that delegate to services
- Business logic in service layer (fully tested)
- Shared TypeScript types for API inputs/outputs
- Role-based authentication on all protected endpoints

### **Frontend Patterns**

- Dumb components that receive data via props
- Business logic in custom hooks and services
- React Query for server state, Zustand for client state
- Schedule context integration for all operations

### **Database Design**

- Integer primary keys for performance
- Schedule-scoped operations (all data tied to schedules)
- Complete change tracking for undo/redo
- Role-based data access patterns

## =� Critical Requirements

1. **Always create tests** - No exceptions
2. **Always run `npm run check`** - Required after every task
3. **Use shared types** - Maintain type safety across frontend/backend
4. **Small functions** - Easy to understand, test, and maintain
5. **Schedule context** - All operations must respect current schedule

## =� Key Locations

- **Main Project**: `/new-app/`
- **Documentation**: `/new-app/docs/`
- **Backend Instructions**: `/new-app/backend/CLAUDE.md`
- **Frontend Instructions**: `/new-app/frontend/CLAUDE.md`
- **Shared Types**: `/new-app/shared/src/types.ts`

---

## 📝 Documentation Maintenance Requirements

**CRITICAL**: Always keep documentation current with implementation status:

### **Update Documentation After Every Feature**

- Update `/new-app/CLAUDE.md` with current implementation status
- Mark completed features as ✅ **COMPLETED** (remove implementation details)
- Update pending features with current priorities
- Remove outdated information to prevent confusion
- Keep examples current with actual implementation

### **Documentation Best Practices**

- **Completed features**: Simply note "✅ User Management - COMPLETED"
- **In-progress features**: Document current status and next steps
- **Future features**: List priorities and dependencies
- **Remove stale details**: Don't keep detailed plans for finished features
- **Keep it current**: Documentation should reflect actual state of codebase

### **Mandatory Quality Check**

Every development task must end with:

```bash
cd /Users/shantam/Software/scheduler/new-app && npm run check
```

**If this command fails, the task is incomplete. Fix all errors before proceeding.**

---

**Remember**: This is a quality-focused codebase. Every feature must be properly tested, type-safe, follow established patterns, and have current documentation. No shortcuts on testing, quality checks, or documentation updates.

- when implementing a feature, if the details are not clear, look at the legacy code and trace the workflow, make a detailed plan and write it down before proceeding
- run `npm run check` from the new-app directoryu when finishing a feature
- run `npm run test` from the new-app directory when finishing a feature
