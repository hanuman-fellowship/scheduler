## People

- [Resolved] People.create/update allowed roles

  - Source: [docs/specs/openapi/openapi.yaml](docs/specs/openapi/openapi.yaml) (people_create, people_update)
  - Verify: Check `controllers/people_controller.php` for guards on `add`, `edit`; confirm `redirectIfNotEditable` and any role checks in `app_controller.php`.

- **Validation fields UNKNOWN: People.add/category/edit**

  - Source: [docs/specs/controllers/PeopleController.json](docs/specs/controllers/PeopleController.json) (validation entries for `add`, `category`, `edit`)
  - Verify: Inspect model validations in `models/person.php` and `models/people_schedules.php`; confirm required fields on corresponding forms in `views/people/*.ctp`.

- **Schema unknowns: Person non-evidenced fields**

  - Source: [docs/specs/openapi/openapi.yaml](docs/specs/openapi/openapi.yaml) (`components.schemas.Person.description` mentions UNKNOWN)
  - Verify: Compare `models/person.php` properties and DB columns in `config/sql/database.sql` to decide which fields belong in API.

- **Notes**
  - Controller components and inheritance
    - Source: [docs/specs/controllers/PeopleController.json](docs/specs/controllers/PeopleController.json) notes
    - Verify: Confirm components in `controllers/people_controller.php` and globals in `app_controller.php`.

## Shifts

- [Resolved] Allowed roles for Shifts add/edit/delete; ConstantShifts add/edit/delete; FloatingShifts add/edit/delete; Assignments.assign

  - Source: [docs/specs/auth/roles-matrix.json](docs/specs/auth/roles-matrix.json) (multiple rules), [docs/specs/openapi/openapi.yaml](docs/specs/openapi/openapi.yaml) (tags: Shifts, Assignments)
  - Verify: Review `controllers/shifts_controller.php`, `controllers/constant_shifts_controller.php`, `controllers/floating_shifts_controller.php`, `controllers/assignments_controller.php` for role checks and calls to `redirectIfNotEditable`.

- **Validation fields UNKNOWN: Assignments.assign; Shifts/ConstantShifts/Schedules actions touching shifts**

  - Source: [docs/specs/controllers/AssignmentsController.json](docs/specs/controllers/AssignmentsController.json) (assign), [docs/specs/controllers/SchedulesController.json](docs/specs/controllers/SchedulesController.json) (actions with validation UNKNOWN)
  - Verify: Check `models/assignment.php`, `models/shift.php`, `models/constant_shift.php` for validation rules and required inputs; cross-reference `views/assignments/assign.ctp` and `views/shifts/*.ctp`.

- **Notes**
  - Assignments redirect to RequestAssignments for negative IDs
    - Source: [docs/specs/controllers/AssignmentsController.json](docs/specs/controllers/AssignmentsController.json) notes
    - Verify: Confirm logic in `controllers/assignments_controller.php` lines cited; test with negative IDs in UI flow.

## Schedules

- [Resolved] Allowed roles for schedules copy/template/copyTemplate/deleteTemplate; publish/change/accept

  - Source: [docs/specs/auth/roles-matrix.json](docs/specs/auth/roles-matrix.json), [docs/specs/openapi/openapi.yaml](docs/specs/openapi/openapi.yaml) (tags: Schedules)
  - Verify: Inspect `controllers/schedules_controller.php` for guard methods and conditions (`schedule_owner`, `request_mode`); confirm behavior in `app_controller.php`.

- **Validation fields UNKNOWN: Schedules.copy/change/publish/template/newRequest**

  - Source: [docs/specs/controllers/SchedulesController.json](docs/specs/controllers/SchedulesController.json)
  - Verify: Check `models/schedule.php` custom methods (`copy`, `change`, `publish`, `template`, `addRequest`) and ensure form fields/validation in `views/schedules/*.ctp` align.

- **UNKNOWN semantics: Schedule.request enum values**

  - Source: [docs/specs/openapi/openapi.yaml](docs/specs/openapi/openapi.yaml) (Schedule schema description)
  - Verify: Review `models/schedule.php` usages of `request`; search for constants/values; verify UI flows in `controllers/schedules_controller.php` `newRequest/submitRequest/viewRequest/accept`.

- **UNKNOWN schema description: Boundaries update payload**

  - Source: [docs/specs/openapi/openapi.yaml](docs/specs/openapi/openapi.yaml) (`/boundaries` schema description)
  - Verify: Check `controllers/boundaries_controller.php` action and `models/boundary.php` for expected fields; confirm parameter names in `views/elements/*` that post boundary times.

- **ERD primary_key UNKNOWN across multiple tables related to schedules**

  - Tables: `areas`, `assignments`, `boundaries`, `change_fields`, `change_models`, `changes`, `constant_shifts`, `days`, `email_auths`, `floating_shifts`, `off_days`, `people_schedules`, `resident_categories`, `shifts`, `slots`
  - Source: [docs/specs/data-model/erd.json](docs/specs/data-model/erd.json)
  - Verify: Compare with SQL in `config/sql/database.sql`; confirm whether MyISAM tables omit explicit PKs; verify Cake models define `primaryKey` or rely on `id`.

- [Resolved] Changes.history allowed roles

  - Source: [docs/specs/openapi/openapi.yaml](docs/specs/openapi/openapi.yaml) (`/changes/history`)
  - Verify: Check `controllers/changes_controller.php` for access checks; confirm whether operations-only or request-mode users can view history.

- [Resolved] ManagerNotes.update allowed roles

  - Source: [docs/specs/openapi/openapi.yaml](docs/specs/openapi/openapi.yaml) (`/manager-notes/{area_id}`)
  - Verify: Review `controllers/manager_notes_controller.php` and `app_controller.php` to determine required role/conditions.

- **Notes**
  - Components and helpers in Areas, global auth semantics (editable/request state)
    - Source: [docs/specs/controllers/AreasController.json](docs/specs/controllers/AreasController.json) notes
    - Verify: Confirm in `app_controller.php` and `controllers/areas_controller.php`.
  - SchedulesController declares Email component
    - Source: [docs/specs/controllers/SchedulesController.json](docs/specs/controllers/SchedulesController.json) notes
    - Verify: `controllers/schedules_controller.php`.
  - ERD notes about storage engine/PKs and FK inference; duplicate `email_auths` definitions
    - Source: [docs/specs/data-model/erd.json](docs/specs/data-model/erd.json) notes
    - Verify: Cross-check `config/sql/*.sql` files cited.
  - PagesController sets people/areas via requestAction
    - Source: [docs/specs/controllers/PagesController.json](docs/specs/controllers/PagesController.json) notes
    - Verify: Confirm in `controllers/pages_controller.php` and ensure corresponding select actions exist.

## Requests

- [Resolved] RequestAreas.view/delete and list allowed roles

  - Source: [docs/specs/auth/roles-matrix.json](docs/specs/auth/roles-matrix.json), [docs/specs/openapi/openapi.yaml](docs/specs/openapi/openapi.yaml) (Requests)
  - Verify: Inspect `controllers/request_areas_controller.php` guards; confirm who can view/delete in legacy.

- **Notes**
  - Assignments negative-ID redirect to RequestAssignments (cross-feature behavior)
    - Source: [docs/specs/controllers/AssignmentsController.json](docs/specs/controllers/AssignmentsController.json) notes
    - Verify: Exercise assign/unassign flows that interact with Requests.

## Users

- [Resolved] Users add/edit/delete/emailUsers allowed roles

  - Source: [docs/specs/auth/roles-matrix.json](docs/specs/auth/roles-matrix.json), [docs/specs/openapi/openapi.yaml](docs/specs/openapi/openapi.yaml) (Users endpoints)
  - Verify: Check `controllers/users_controller.php` role checks; determine whether only `operations` or other roles are allowed.

- **Validation fields UNKNOWN: Users add/edit/changePassword**

  - Source: [docs/specs/controllers/UsersController.json](docs/specs/controllers/UsersController.json)
  - Verify: Review `models/user.php` for rules and custom `changePassword`; ensure form fields in `views/users/*.ctp` match.

- **Notes**
  - UsersController declares Email component
    - Source: [docs/specs/controllers/UsersController.json](docs/specs/controllers/UsersController.json) notes
    - Verify: `controllers/users_controller.php`.

## Auth

- **Cookie name UNKNOWN for legacy session**

  - Source: [docs/specs/openapi/openapi.yaml](docs/specs/openapi/openapi.yaml) (`components.securitySchemes.cookieAuth.name`)
  - Verify: Inspect `config/core.php` session config and runtime cookie name; confirm via browser devtools or response headers.

- **Roles matrix UNKNOWNs across multiple actions (controller/action with ambiguous allowed_roles)**

  - Source: [docs/specs/auth/roles-matrix.json](docs/specs/auth/roles-matrix.json) (entries with `allowed_roles: ["UNKNOWN"]`)
  - Verify: For each action, inspect controller method and `app_controller.php` guard helpers; add concrete roles and conditions back into `roles-matrix.json`.

- **Notes**

  - Role set and guard semantics; guest handling and ACL placeholders
    - Source: [docs/specs/auth/roles-matrix.json](docs/specs/auth/roles-matrix.json) notes
    - Verify: Confirm roles present in DB (`models/role.php`), guest behavior in `controllers/components/authsome.php`, and absence of project ACL in `config/acl.ini.php`.

- [Resolved] EmailAuths.update allowed roles
  - Source: [docs/specs/openapi/openapi.yaml](docs/specs/openapi/openapi.yaml) (`/email-auths/{id}`)
  - Verify: Check `controllers/email_auths_controller.php` update permissions and who can manage SMTP credentials.

---

If you confirm any of the UNKNOWN items, update the source spec files directly (`openapi.yaml`, controller JSONs, `roles-matrix.json`, or `erd.json`) and remove the corresponding entries here.
