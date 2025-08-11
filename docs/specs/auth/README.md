### Auth roles and permissions matrix

This directory documents role-based access as inferred from the code.

- Sources scanned: `app_controller.php`, `controllers/components/authsome.php`, `models/user.php`, `models/role.php`, `config/acl.ini.php`, and all controllers for inline guards (`redirectIfNot`, `redirectIfNotEditable`, `redirectIfNotManager`).
- Roles observed in code: `operations`, `manager`, `personnel`. A generic `guest` (empty user) exists via `Authsome::login('guest')`. No explicit `user` role is defined in DB, but included as UNKNOWN in the matrix for completeness.
- Authorization patterns:
  - `redirectIfNot('role')` restricts to a specific role.
  - `redirectIfNotEditable()` allows when Session(`Schedule.editable`) is true OR when in request edit mode (`Session('Schedule.request') == 2`). `Schedule.editable` is set in `AppController.beforeFilter` only when the current user owns the schedule AND has `operations` role.
  - `redirectIfNotManager(areaId)` restricts to managers of the given area.
- ACL: `config/acl.ini.php` contains example placeholders only; no project-specific entries. DB ACL schemas exist but are not wired to controller checks.

See `roles-matrix.json` for the enumerated controller/action rules and conditions. Any action not listed is marked UNKNOWN given the current scope.
