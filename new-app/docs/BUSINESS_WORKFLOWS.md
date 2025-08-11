# Business Logic & Workflow Specifications

Based on analysis of the legacy controllers, here are the core business workflows:

## Schedule Management Workflow

### 1. Schedule Creation
**Flow:**
1. User copies from template/published schedule OR creates blank
2. System creates new schedule record with `user_id`, `parent_id` (if copied)
3. If copied: System duplicates all related data (areas, days, shifts, people, categories)
4. Schedule starts in draft state (`request = 0`)

**Business Rules:**
- Schedule names must be unique per user
- Copied schedules inherit structure but can be modified
- Templates (`template = 1`) can be copied by anyone
- Published schedules can be copied to create new drafts

### 2. Request Submission (Manager → Operations)
**Flow:**
1. Manager creates area-specific request (`POST /api/schedule-requests`)
2. System creates schedule with `request = 2` (draft request)
3. Manager edits/builds their area's schedule
4. Manager submits request (`PUT /api/schedule-requests/:id/submit`)
5. System changes `request = 1` (submitted)
6. System emails operations about new request
7. System emails manager confirmation

**Business Rules:**
- Only managers can create requests for their areas
- Managers can only edit requests in draft state (`request = 2`)
- Submitted requests (`request = 1`) can only be viewed, not edited
- One request per area per manager at a time

### 3. Request Review & Publishing (Operations)
**Flow:**
1. Operations views submitted requests (`GET /api/schedule-requests`)
2. Operations reviews request details (`GET /api/schedules/:id`)
3. Operations accepts request (`POST /api/schedule-requests/:id/accept`)
4. System merges request data into main schedule
5. OR Operations publishes entire schedule (`POST /api/schedules/publish`)
6. System creates `ScheduleGroup` with date range
7. System sets schedule `name = "Published"`, `user_id = null`

**Business Rules:**
- Only operations can publish schedules
- Published schedules are read-only
- Only one published schedule per date range
- Publishing clears change history for performance

## Assignment Management

### 1. Shift Assignment
**Flow:**
1. User selects shift and person
2. System validates person availability (no conflicts, not off-duty)
3. System creates assignment record
4. System records change for undo/redo
5. UI updates to show assignment

**Business Rules:**
- Person cannot be assigned to overlapping shifts
- Person cannot be assigned on their off days
- Shift capacity limited by `num_people`
- `person_id = 0` allows custom names for external people

### 2. Assignment Conflicts
**Validation Rules:**
- Same person, same day, overlapping times = conflict
- Person marked off on that day = conflict
- Shift already at capacity = conflict
- Constant shifts count as assignments for conflict checking

### 3. Assignment Actions
**Star Assignment:**
- Toggle `star = true/false` 
- Starred assignments get UI priority/highlighting

**Swap Assignment:**
1. Remove person A from shift X
2. Assign person B to shift X  
3. Record as single atomic change for undo

**Unassign:**
- Remove assignment record
- Record change for undo

## Change Tracking & Undo System

### 1. Change Recording
**For every modification:**
1. Create `changes` record with description
2. Create `change_models` record for each affected table
3. Create `change_fields` record for each changed field
4. Store old and new values for rollback

**Change Types:**
- `action = 0`: Delete (store old values)
- `action = 1`: Create (store new values)  
- `action = 2`: Update (store old and new values)

### 2. Undo Operation
**Flow:**
1. User clicks undo
2. System finds latest non-undone change
3. System reverses each change_model in reverse order
4. System applies old values from change_fields
5. System marks change as `undone = true`

### 3. Redo Operation
**Flow:**
1. User clicks redo
2. System finds latest undone change
3. System re-applies change using new values
4. System marks change as `undone = false`

## Schedule Branching & Merging

### 1. Branch Creation
**When copying schedule:**
- Set `parent_id` to source schedule ID
- All branches share same parent for merging
- Changes are tracked independently per branch

### 2. Merge Process
**Flow:**
1. User selects schedule to merge
2. System compares change histories between branches
3. System detects conflicts using conflict matrix
4. User resolves conflicts by choosing which changes to keep
5. System applies non-conflicting changes automatically
6. System creates new change records in target schedule

**Conflict Detection:**
- Same record modified in both branches = conflict
- Foreign key references to modified/deleted records = conflict
- Complex dependency conflicts (e.g., area deleted but shifts added)

## People Management

### 1. Person Creation
**Flow:**
1. Validate name (letters and hyphens only)
2. Check for duplicate first+last name
3. Create person record
4. Add to current schedule via `people_schedules`
5. Assign to default category

### 2. Person Retirement
**Flow:**
1. Remove all assignments for person
2. Remove all floating shifts for person
3. Remove from `people_schedules` (marks as "retired")
4. Person record remains for history

### 3. Person Restoration
**Flow:**
1. Add back to `people_schedules` with selected category
2. Person becomes available for new assignments
3. Old assignments remain deleted

### 4. Display Name Generation
**Algorithm:**
1. Start with first name only
2. If multiple people with same first name exist:
   - Add minimum letters of last name to distinguish
   - Compare with all others having same first name
   - Add letters until names are unique

## Area Management

### 1. Area Operations
**Clear Area:**
- Option 1: Delete all shifts and assignments
- Option 2: Keep shifts, remove assignments only

**Delete Area:**
- Remove all shifts, floating shifts, assignments
- Remove area record
- Update change tracking

## Email Notifications

### 1. Request Submission
**To Manager:**
- Subject: "Area Request Form Received!"
- Confirms their request was submitted
- Includes area name and operations contact

**To Operations:**
- Subject: "{AreaName} Request Form Submitted"  
- Notifies of new request requiring review
- Includes manager name and contact

### 2. User Creation
**To New User:**
- Subject: "Your New Account in the Scheduler"
- Includes username and generated password
- Includes operations contact for questions

### 3. Password Reset
**To User:**
- Subject: "Password Request"
- Includes username and new generated password
- Includes operations contact

## Validation Rules

### Schedule Validation
- Name cannot be empty
- Names must be unique per user
- Date ranges: start < end
- No overlapping published schedules

### Shift Validation  
- Start time < end time
- Number of people ≥ 1
- Cannot reduce people below current assignments

### Person Validation
- Names cannot be empty
- Names can only contain letters, spaces, hyphens
- First + last name combination must be unique

### User Validation
- Username must be unique
- Email must be unique
- Manager role requires area assignments

This workflow system emphasizes the collaborative scheduling process with proper permissions, change tracking, and conflict resolution.