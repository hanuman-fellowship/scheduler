# Routes Summary

A normalized index of routes derived from `config/routes.php`.

## Top-level routes

| Path       | Methods | Controller        | Action    | Notes                 |
| ---------- | ------- | ----------------- | --------- | --------------------- |
| `/`        | GET\*   | `PagesController` | `display` | view = `home` (param) |
| `/pages/*` | GET\*   | `PagesController` | `display` | wildcard path         |
| `/notes/*` | GET\*   | `UsersController` | `notes`   | wildcard path         |

- `GET*` indicates inferred method (not explicitly declared in routes).
- No admin or other prefixes are enabled (`Routing.admin` commented out in `config/core.php`).

See `routes.json` for evidence (file and line ranges) and detailed metadata.
