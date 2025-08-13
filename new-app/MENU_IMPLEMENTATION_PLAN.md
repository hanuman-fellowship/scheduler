# Menu Implementation Plan

## Current Implementation Status

Based on analysis of the new app's Header.tsx and comparison with legacy system workflows, here's the status of each menu item:

---

## 🎯 **OPERATIONS MENU**

### ✅ **Implemented**
- **Change Password** → Basic functionality exists
- **Logout** → Implemented and working

### ✅ **Implemented**
- **New User...** → ✅ **FULLY IMPLEMENTED**
- **Edit User...** → ✅ **FULLY IMPLEMENTED**  
- **Delete User...** → ✅ **FULLY IMPLEMENTED**

### ⭕ **Not Implemented**
- **Notepad** → Need personal notepad feature
- **Notes for Managers...** → Need manager notes system
- **Email Users...** → Need email functionality
- **View Request...** → Need request management system
- **Delete Requests...** → Need request management system
- **Operations Email Settings...** → Need email configuration
- **Scheduler Email Settings...** → Need email configuration

---

## 🎯 **MANAGER MENU**

### ✅ **Implemented**
- **Change Password** → Basic functionality exists
- **Logout** → Implemented and working

### ⭕ **Not Implemented**
- **Requests In Progress...** → Need request management workflow
- **Delete Unfinished Request...** → Need request management
- **New Request...** → Core manager workflow, high priority
- **View Submitted Request...** → Need request status system
- **View Notes from Operations...** → Need notes viewing system

---

## 🎯 **PERSONNEL MENU**

### ✅ **Fully Implemented**
- **Change Password** → Works
- **Logout** → Works

---

## 🎯 **SCHEDULES MENU** (Operations & Manager)

### ✅ **Fully Implemented**
- **Published...** → ✅ **FULLY IMPLEMENTED** (Modal-based published schedule selection with year grouping and keyboard shortcuts)
- **In Progress...** → ✅ **FULLY IMPLEMENTED** (Modal-based working schedule selection with user grouping and immediate context switching)
- **View Gaps** → ✅ **FULLY IMPLEMENTED** (Gaps schedule view with unassigned shifts display)

### ✅ **Schedule Editing Mode - FULLY IMPLEMENTED**
- **Conditional Menu Visibility** → ✅ **FULLY IMPLEMENTED** (Edit-only items show/hide based on schedule ownership + operations role)
- **Legacy Permission Matching** → ✅ **FULLY IMPLEMENTED** (Exactly matches CakePHP `$editable` flag behavior)
- **Visual Status Indicator** → ✅ **FULLY IMPLEMENTED** (Real-time editing mode display with status icons)

### ⭕ **Not Implemented**
- **Edit Days...** → Need days management (⚠️ Only visible in editing mode)
- **Edit Times...** → Need time boundaries management (⚠️ Only visible in editing mode)
- **Edit a Copy...** → Need schedule copying workflow (⚠️ Only visible in editing mode)
- **Delete...** → Need schedule deletion with validation (⚠️ Only visible in editing mode)
- **New From Template...** → Need template system (⚠️ Only visible in editing mode)
- **Save as Template...** → Need template system (⚠️ Only visible in editing mode)
- **Delete Template...** → Need template system (⚠️ Only visible in editing mode)
- **Show/Hide Dates** → Need UI settings (⚠️ Only visible in editing mode)

---

## 🎯 **PEOPLE MENU** (Operations Only)

### ✅ **Fully Implemented**
- **View Schedule...** → ✅ **FULLY IMPLEMENTED** (Person selection modal with category grouping and keyboard shortcuts) (⚠️ Only visible in editing mode)
- **Big Board** → Page exists but needs implementation
- **New Person...** → Modal trigger exists, needs backend (⚠️ Only visible in editing mode)
- **New Category...** → ✅ **FULLY IMPLEMENTED** (⚠️ Only visible in editing mode)

### ✅ **Fully Implemented**
- **Edit Category...** → ✅ **FULLY IMPLEMENTED** (Modal-based category editing with validation and React Query integration) (⚠️ Only visible in editing mode)
- **Delete Category...** → ✅ **FULLY IMPLEMENTED** (Safe category deletion with confirmation modal and business rule validation) (⚠️ Only visible in editing mode)

### ⭕ **Not Implemented**
- **Restore Person...** → Need person lifecycle management (⚠️ Only visible in editing mode)
- **Retire Person...** → Need person lifecycle management (⚠️ Only visible in editing mode)
- **Reorder Categories...** → Need category ordering (⚠️ Only visible in editing mode)
- **Affected Schedules...** → Need cross-schedule analysis (⚠️ Only visible in editing mode)
- **Print People...** → Need print functionality

---

## 🎯 **AREAS MENU** (Operations Only)

### ✅ **Fully Implemented**
- **View Schedule...** → ✅ **FULLY IMPLEMENTED** (Area selection modal with keyboard shortcuts and session memory) (⚠️ Only visible in editing mode)
- **New Area...** → ✅ **FULLY IMPLEMENTED** (AddAreaForm with validation) (⚠️ Only visible in editing mode)

### ✅ **Backend Implemented**
- **Clear Area...** → ✅ **BACKEND COMPLETE** (API endpoint `/api/areas/:id/clear`) (⚠️ Only visible in editing mode)
- **Delete Area...** → ✅ **FULLY IMPLEMENTED** (Safe deletion with shift clearing) (⚠️ Only visible in editing mode)

### ⭕ **Not Implemented**
- **Affected Schedules...** → Need cross-schedule analysis UI (⚠️ Only visible in editing mode)
- **Print Areas...** → Need print functionality

---

## 🎯 **SHIFTS MENU** (Operations Only) ⚠️ **ENTIRE MENU ONLY VISIBLE IN EDITING MODE**

### ✅ **Fully Implemented**
- **New Shift...** → ✅ **FULLY INTEGRATED** (Complete shift creation with time picker, area/day selection, validation, and context-aware modal integration directly from schedule views)

### ✅ **Shift Creation Integration - COMPLETED**
- **Context-Aware Creation** → ✅ **FULLY IMPLEMENTED** (Shift modal pre-filled with area/day/time context from schedule grid)
- **Hover-Based UI** → ✅ **FULLY IMPLEMENTED** (Legacy-compatible add shift buttons appear on hover over schedule cells)
- **Permission Integration** → ✅ **FULLY IMPLEMENTED** (Shift creation only available when schedule is editable)
- **Global Modal System** → ✅ **FULLY IMPLEMENTED** (Centralized modal management allows shift creation from any schedule view)

### ⭕ **Not Implemented**
- **New Floating Shift...** → Need floating shifts system
- **New Constant Shift...** → Need constant shifts system

---

## 🎯 **CHANGES SECTION** (Operations Only) ⚠️ **ENTIRE SECTION ONLY VISIBLE IN EDITING MODE**

### ⭕ **Completely Unimplemented**
- **Undo** → Need change tracking system
- **Redo** → Need change tracking system  
- **View All Changes** → Need changes history

---

# 📋 IMPLEMENTATION PLANS BY FEATURE

## 1. **USER MANAGEMENT SYSTEM** ✅ **COMPLETED**

### **Priority**: High (Foundation)
### **Dependencies**: Authentication system (✅ done)
### **Complexity**: Medium
### **Status**: ✅ **FULLY IMPLEMENTED**

### **Backend Implementation Plan**:

```typescript
// 1. User Controller Actions (backend/src/controllers/userController.ts)
- createUser(req, res) → Create new user with email notification
- updateUser(req, res) → Edit user details and roles  
- deleteUser(req, res) → Soft delete with validation
- listUsers(req, res) → Get all users with roles
- resetPassword(req, res) → Generate new password and email

// 2. User Service Layer (backend/src/services/userService.ts)
- createUser(data: CreateUserInput): Promise<UserOutput>
- updateUser(id: number, data: UpdateUserInput): Promise<UserOutput>
- deleteUser(id: number): Promise<void>
- listUsers(filters?: UserFilters): Promise<UserOutput[]>
- resetPassword(email: string): Promise<void>

// 3. Email Service Integration
- sendNewUserEmail(user: User, tempPassword: string)
- sendPasswordResetEmail(user: User, newPassword: string)
```

### **Frontend Implementation Plan**:

```typescript
// 1. User Management Pages
- /users/add → Modal form for new user creation
- /users/edit → User selection + edit form
- /users/delete → User selection + confirmation

// 2. Components
- UserForm.tsx → Reusable user form component
- UserList.tsx → User listing with actions
- UserModal.tsx → Modal wrapper for user actions

// 3. Services  
- userService.ts → API calls for user operations
- useUsers.ts → React Query hook for user data
```

### **Database Requirements**: ✅ Already exists (users, roles tables)

---

## 2. **SHIFT MANAGEMENT SYSTEM**

### **Priority**: High (Core Feature)
### **Dependencies**: Areas, Days, People systems
### **Complexity**: High

### **Backend Implementation Plan**:

```typescript
// 1. Shift Controller (backend/src/controllers/shiftController.ts)
- createShift(req, res) → Create regular shift
- updateShift(req, res) → Edit shift details
- deleteShift(req, res) → Remove shift with validation
- getShiftsByArea(req, res) → Area-specific shifts
- getShiftsByDay(req, res) → Day-specific shifts

// 2. Floating Shifts Controller 
- createFloatingShift(req, res) → Create floating shift
- updateFloatingShift(req, res) → Edit floating shift

// 3. Constant Shifts Controller
- createConstantShift(req, res) → Create constant shift  

// 4. Services Layer
- shiftService.ts → Business logic for shift operations
- validateShiftTimes(shift: ShiftInput) → Time validation
- checkShiftConflicts(shift: ShiftInput) → Conflict detection
```

### **Frontend Implementation Plan**:

```typescript
// 1. Shift Creation Forms
- ShiftForm.tsx → Time picker, area/day selection
- FloatingShiftForm.tsx → Person-specific floating shifts
- ConstantShiftForm.tsx → Category-based constant shifts

// 2. Shift Management Views
- ShiftGrid.tsx → Visual grid of all shifts
- ShiftList.tsx → List view of shifts by area/day

// 3. Integration Components
- TimePickerComponent.tsx → Reusable time selection
- ShiftConflictIndicator.tsx → Visual conflict warnings
```

---

## 3. **SCHEDULE MANAGEMENT WORKFLOWS**

### **Priority**: High (Core Workflow)
### **Dependencies**: Shift system, Change tracking
### **Complexity**: High

### **Legacy Workflow Analysis**:

From the legacy code, key workflows are:

1. **Schedule Copying (`copy` action)**:
   - Select source schedule
   - Provide new name
   - Copy all related data (areas, people, shifts)
   - Set new owner

2. **Template System (`template`, `copyTemplate` actions)**:
   - Save current schedule as template
   - Create new schedule from template
   - Template management (list, delete)

3. **Schedule Selection (`select` action)**:
   - List all available schedules
   - Filter by type (in-progress, published, requests)
   - Switch current working schedule

### **Backend Implementation Plan**:

```typescript
// 1. Schedule Management Controller
- copySchedule(req, res) → Duplicate schedule with new name
- createFromTemplate(req, res) → New schedule from template
- saveAsTemplate(req, res) → Convert schedule to template
- deleteSchedule(req, res) → Remove with validation
- listSchedules(req, res) → Get available schedules
- switchSchedule(req, res) → Change current working schedule

// 2. Schedule Service Layer
- copyScheduleWithData(sourceId: number, newName: string, userId: number)
- createScheduleFromTemplate(templateId: number, name: string)
- validateScheduleDeletion(scheduleId: number)
```

### **Frontend Implementation Plan**:

```typescript
// 1. Schedule Management Pages
- ScheduleSelector.tsx → List and select schedules
- ScheduleCopyForm.tsx → Copy schedule workflow
- TemplateManager.tsx → Template CRUD operations

// 2. Schedule Context Enhancement
- Enhance scheduleStore.ts to handle schedule switching
- Add schedule metadata (editable, template status)
- Implement schedule change confirmations
```

---

## 4. **REQUEST MANAGEMENT SYSTEM** 

### **Priority**: High (Manager Workflow)
### **Dependencies**: Schedule system, Email system
### **Complexity**: High

### **Legacy Workflow Analysis**:

The request system is a core feature allowing managers to:

1. Create schedule requests for their areas
2. Submit requests to operations for approval
3. Track request status (draft, submitted, approved)
4. Operations can view and manage submitted requests

### **Backend Implementation Plan**:

```typescript
// 1. Request Controller
- createRequest(req, res) → New schedule request
- submitRequest(req, res) → Submit draft to operations
- approveRequest(req, res) → Operations approval
- deleteRequest(req, res) → Remove unfinished request
- listRequests(req, res) → Get requests by status/user

// 2. Request Workflow Service
- createRequestFromSchedule(scheduleId: number, managerId: number)
- submitRequestToOperations(requestId: number)
- processRequestApproval(requestId: number, approved: boolean)
- mergeRequestToPublished(requestId: number)
```

### **Frontend Implementation Plan**:

```typescript
// 1. Manager Request Workflow
- RequestCreator.tsx → Create new request
- RequestEditor.tsx → Edit draft request
- RequestSubmission.tsx → Submit to operations
- RequestStatus.tsx → Track request progress

// 2. Operations Request Management  
- RequestReview.tsx → Review submitted requests
- RequestApproval.tsx → Approve/reject requests
- RequestList.tsx → List all requests with status
```

---

## 5. **AREAS MANAGEMENT SYSTEM**

### **Priority**: Medium (Supporting Feature)
### **Dependencies**: Schedule context
### **Complexity**: Medium

### **Backend Implementation Plan**:

```typescript
// 1. Area Controller
- createArea(req, res) → New area creation
- updateArea(req, res) → Edit area details
- deleteArea(req, res) → Remove with shift validation
- clearArea(req, res) → Remove all shifts from area
- getAreaSchedule(req, res) → Area-specific schedule view

// 2. Area Service
- validateAreaDeletion(areaId: number) → Check for shifts
- clearAreaShifts(areaId: number) → Remove all shifts safely
- getAffectedSchedules(areaId: number) → Cross-schedule impact
```

---

## 6. **CHANGE TRACKING SYSTEM (Undo/Redo)**

### **Priority**: Medium (Quality of Life)
### **Dependencies**: All CRUD operations
### **Complexity**: Very High

### **Legacy System Analysis**:

The legacy system has a sophisticated change tracking system:
- `changes` table tracks high-level operations
- `change_models` tracks affected entities  
- `change_fields` tracks field-level changes
- Supports undo/redo with full rollback capability

### **Implementation Strategy**: 
**Recommend implementing this LAST** due to complexity. The existing database schema supports it, but requires:

1. Intercepting all database operations
2. Storing before/after states
3. Implementing rollback logic
4. Managing change dependencies

---

## 7. **EMAIL SYSTEM**

### **Priority**: Medium (Supporting Feature)
### **Dependencies**: User management
### **Complexity**: Medium

### **Backend Implementation Plan**:

```typescript
// 1. Email Configuration
- EmailSettingsController → SMTP configuration
- EmailTemplateService → Email template management

// 2. Email Operations
- sendNewUserEmail(user: User, password: string)
- sendRequestNotification(request: Request, recipients: User[])
- sendSchedulePublishNotification(schedule: Schedule)
```

---

# 🚀 IMPLEMENTATION PRIORITY ROADMAP

## **Phase 1: Core Scheduling**
1. **User Management System** → Enable operations team management ✅ **COMPLETED**
2. **Areas Management System** → Complete the area management features ✅ **COMPLETED**
3. **Shift Management System** → Core scheduling functionality
4. **Enhanced People Management** → Person retire/restore, category management

## **Phase 2: Workflow Systems**
5. **Schedule Management Workflows** → Copy, templates, selection
6. **Request Management System** → Manager → Operations workflow
7. **Basic Email System** → User notifications

## **Phase 3: Advanced Features**
8. **Print/Export Features** → PDF generation for schedules
9. **Advanced UI Features** → Gaps view, affected schedules analysis
10. **Settings Management** → UI preferences, date display options

## **Phase 4: Quality & Polish**
11. **Change Tracking System** → Undo/redo functionality
12. **Performance Optimization** → Large schedule handling
13. **Mobile Responsiveness** → Touch-friendly interfaces
14. **Documentation & Training** → User guides and help system

---

# 📊 IMPLEMENTATION STATISTICS

## **Menu Items Analysis**:
- **Total Menu Items**: ~50 items across all menus
- **✅ Fully Implemented**: 19 items (38%) - Added Shift Creation Integration (1 item)
- **🟡 Partially Implemented**: 2 items (4%)  
- **⭕ Not Implemented**: 29 items (58%)

## **By Priority Level**:
- **🔴 High Priority**: 25 items (Core scheduling, user management, requests)
- **🟡 Medium Priority**: 20 items (Supporting features, email, areas)  
- **🟢 Low Priority**: 5 items (Change tracking, print features, settings)


---

This plan provides a systematic approach to implementing all menu functionality while maintaining the principle of small, testable, maintainable functions throughout the development process.