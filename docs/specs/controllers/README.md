### Controller Action Specs

This index lists all controllers and their actions documented in this directory. Each controller has a corresponding JSON file named after the controller.

- AreasController: dups, schedule, add, edit, editNotes, delete, clear, select, previous, next, printm, changed
- AssignmentsController: assign, unassign, swap, star
- BoundariesController: edit
- ChangesController: undo, redo, history, jump, timeSpent
- ConstantShiftsController: add, edit, delete
- DaysController: edit
- EmailAuthsController: operations, scheduler, noEmail
- FloatingShiftsController: add, edit, delete
- ManagerNotesController: edit, view
- OffDaysController: toggle
- OperationsNotesController: edit, add, reorder
- PagesController: display
- PeopleController: schedule, board, selectSchedule, selectProfile, profile, add, category, edit, editNotes, retire, restore, previous, next, printm, changed, upload, remove_photo
- PersonnelNotesController: edit, add, reorder
- RequestAreasController: edit, editNotes, submit, view, delete
- RequestAssignmentsController: assign, unassign
- RequestFloatingShiftsController: add, edit, delete
- RequestShiftsController: add, edit, delete
- ResidentCategoriesController: add, edit, delete, reorder
- ScheduleGroupsController: select, newRequest
- SchedulesController: copy, copyTemplate, delete, deleteTemplate, select, alternate, published, merge, change, publish, template, newRequest, editRequest, deleteRequest, deletePublishedRequest, submitRequest, viewRequest, accept
- SettingsController: toggleDates
- ShiftsController: add, edit, delete, listBySlot
- SlotsController: scaffold (no custom actions)
- UsersController: login, logout, add, changePassword, resetPassword, delete, edit, emailUsers, notes

Each JSON file follows the schema described in the project brief and includes citations to the relevant controller source lines.
