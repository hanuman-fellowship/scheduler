# Schedule Menu Navigation Implementation Plan

## Legacy System Analysis

### How "View Schedule..." Menus Work in Legacy System

#### **Areas Menu → View Schedule...**
1. Menu item `'View Schedule...'` with URL `array('controller' => 'areas', 'action' => 'select')`  
2. Opens `/areas/select` which shows `views/areas/select.ctp`
3. Displays a simple list of all areas with links to `array('action'=>'schedule',$id)`
4. Remembers last selected area in session (`last_area`)
5. Clicking area name navigates to `/areas/schedule/{id}` which shows the area's schedule

#### **People Menu → View Schedule...**
1. Menu item `'View Schedule...'` with URL `array('controller' => 'people', 'action' => 'schedule')`  
2. When no ID provided, redirects to `array('action'=>'selectSchedule')`
3. Opens `/people/selectSchedule` which shows `views/people/select_schedule.ctp`
4. Displays people grouped by category (residents, staff, etc.) with color coding
5. Remembers last selected person in session (`last_person`)
6. Clicking person name navigates to `/people/schedule/{id}` which shows the person's schedule

### **Key UX Patterns Identified:**

1. **Modal-based Selection**: Both menus open ajax modals for selection
2. **Grouped Display**: People are grouped by category with color coding
3. **Session Memory**: System remembers last selection for better UX
4. **Direct Navigation**: After selection, navigates to schedule view
5. **Visual Hierarchy**: Categories use different colors, last selection highlighted

---

## New System Implementation Plan

### **Phase 1: Modal Selection Components**

#### **1. Area Selection Modal**
```typescript
// AreaSelectionModal.tsx
interface AreaSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArea: (areaId: number) => void;
}
```

**Features:**
- Simple list of areas from current schedule
- Remember last selected area in localStorage  
- Highlight last selection with `.selected` class
- Click area → navigate to `/schedule-view/area/{id}`

#### **2. Person Selection Modal**
```typescript
// PersonSelectionModal.tsx
interface PersonSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPerson: (personId: number) => void;
}
```

**Features:**
- Group people by category (Residents, Staff, etc.)
- Color-code by category (using category.color from database)
- Remember last selected person in localStorage
- Highlight last selection with `.selected` class  
- Click person → navigate to `/schedule-view/person/{id}`

### **Phase 2: Menu Integration**

#### **1. Update Header.tsx MenuDropdown**
Add new menu items to existing dropdowns:

```typescript
// In People menu (Operations only)
{
  label: "View Schedule...", 
  onClick: () => openPersonSelectionModal(),
  shortcut: "Ctrl+P"
}

// In Areas menu (Operations only)  
{
  label: "View Schedule...",
  onClick: () => openAreaSelectionModal(), 
  shortcut: "Ctrl+A"
}
```

#### **2. Modal State Management**
Extend existing GlobalModalContext to support:
- `openAreaSelectionModal()`
- `openPersonSelectionModal()`
- Handle modal state and callbacks

### **Phase 3: Enhanced UX Features**

#### **1. Selection Memory**
```typescript
// localStorage keys
'scheduler_last_area_id' 
'scheduler_last_person_id'

// Visual indication of last selection
.selected { 
  background-color: #e3f2fd; 
  font-weight: bold; 
}
```

#### **2. Category Color Coding** 
```typescript
// Use database category.color for visual grouping
<div style={{ color: category.color }}>
  {person.name}
</div>
```

#### **3. Keyboard Navigation**
- `Ctrl+P` → Open person selection modal
- `Ctrl+A` → Open area selection modal  
- `Enter` → Select highlighted item
- `Escape` → Close modal

### **Phase 4: API Integration**

#### **Backend Requirements (Already Exist)**
✅ `GET /api/areas` - List all areas  
✅ `GET /api/people` - List all people with categories  
✅ `GET /api/areas/{id}/schedule` - Area schedule view  
✅ `GET /api/people/{id}/schedule` - Person schedule view  

#### **Frontend Services**
```typescript
// services/scheduleNavigation.ts
export const getAreasForSelection = async () => {
  // Get areas list for selection modal
}

export const getPeopleForSelection = async () => {
  // Get people grouped by category for selection modal
}
```

---

## **Implementation Steps**

### **Step 1: Create Modal Components**
1. Build `AreaSelectionModal.tsx` with area list
2. Build `PersonSelectionModal.tsx` with categorized people  
3. Add localStorage for remembering selections
4. Style to match legacy appearance

### **Step 2: Integrate with Menu System**
1. Update `GlobalModalContext` to support new modals
2. Add menu items to Header.tsx dropdowns
3. Wire up keyboard shortcuts (Ctrl+P, Ctrl+A)

### **Step 3: Navigation Integration**  
1. Implement navigation to `/schedule-view/area/{id}`
2. Implement navigation to `/schedule-view/person/{id}`
3. Ensure smooth transition from modal → schedule view

### **Step 4: Polish & Testing**
1. Match legacy visual styling exactly
2. Test keyboard navigation
3. Test selection memory across sessions
4. Add hover states and loading indicators

---

## **File Structure**

```
frontend/src/
├── components/
│   └── schedules/
│       ├── AreaSelectionModal.tsx      # NEW
│       ├── PersonSelectionModal.tsx    # NEW  
│       └── ScheduleSelectionModals.tsx # NEW (container)
├── contexts/
│   └── GlobalModalContext.tsx          # EXTEND
├── services/
│   └── scheduleNavigation.ts           # NEW
└── pages/
    └── ScheduleViewPage.tsx            # Already exists
```

---

## **Success Criteria**

### **Functional Requirements**
- ✅ "View Schedule..." menu items work in both Areas and People menus  
- ✅ Modal opens showing selectable areas/people
- ✅ People are grouped by category with proper color coding
- ✅ Selection is remembered across sessions  
- ✅ Clicking selection navigates to schedule view
- ✅ Keyboard shortcuts work (Ctrl+P, Ctrl+A)

### **UX Requirements** 
- ✅ Modal appearance matches legacy system
- ✅ Last selection is visually highlighted  
- ✅ Color coding matches category colors
- ✅ Smooth navigation transition
- ✅ Loading states for async operations

### **Technical Requirements**
- ✅ Integrates with existing modal system
- ✅ Uses existing API endpoints
- ✅ TypeScript type safety
- ✅ Proper error handling
- ✅ Responsive design

---

## **Legacy Compatibility**

The new implementation maintains the exact same user workflow:

1. **Legacy**: People Menu → View Schedule... → Modal with categorized people → Click person → Schedule view
2. **New**: People Menu → View Schedule... → Modal with categorized people → Click person → Schedule view  

3. **Legacy**: Areas Menu → View Schedule... → Modal with area list → Click area → Schedule view  
4. **New**: Areas Menu → View Schedule... → Modal with area list → Click area → Schedule view

The only differences are:
- Modern React components instead of PHP/AJAX
- Better TypeScript type safety  
- Improved accessibility
- Responsive design for mobile

---

This plan preserves the familiar user experience while modernizing the implementation using React best practices and the existing component architecture.