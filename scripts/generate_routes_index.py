#!/usr/bin/env python3
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTROLLERS_DIR = ROOT / "controllers"
VIEWS_DIR = ROOT / "views"
ROUTES_PHP = ROOT / "config" / "routes.php"
OUT_FILE = ROOT / "docs" / "specs" / "routes" / "routes.json"


def list_php_controllers() -> list[Path]:
    controllers = []
    for p in CONTROLLERS_DIR.glob("*.php"):
        controllers.append(p)
    return controllers


FUNC_DEF_RE = re.compile(
    r"^\s*function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)")


def parse_params(param_str: str) -> list[str]:
    params: list[str] = []
    if not param_str.strip():
        return params
    for raw in param_str.split(','):
        name = raw.strip()
        # Remove by-ref, defaults, and types (if any)
        name = re.sub(r"&\s*", "", name)
        name = name.split('=')[0].strip()
        # Keep only variable name without $ and whitespace
        name = name.lstrip('$').strip()
        if name:
            params.append(name)
    return params


def camel_to_underscore(name: str) -> str:
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


def has_view_template(controller_slug: str, action: str) -> bool:
    # Cake 1.x uses underscored action names for templates
    action_tpl = camel_to_underscore(action)
    tpl = VIEWS_DIR / controller_slug / f"{action_tpl}.ctp"
    return tpl.exists()


def infer_methods(controller: str, action: str) -> list[str]:
    lower = action.lower()
    if lower in {"index", "view", "display", "select", "history", "board", "schedule", "previous", "next", "printm", "published", "template", "profile", "category", "changed", "notes", "viewrequest", "listbyslot", "view_request"}:
        return ["GET"]
    if lower in {"add", "submit", "submitrequest", "newrequest", "copy", "copytemplate", "merge", "publish", "accept", "assign", "unassign", "swap", "star", "retire", "restore", "toggle", "toggledates", "upload", "remove_photo", "reorder", "change", "undo", "redo", "jump", "timespent", "alternate", "selectschedule", "selectprofile", "resetpassword", "changePassword".lower(), "emailusers", "deletetemplate", "deleterequest", "deletepublishedrequest"}:
        return ["POST"]
    if lower in {"edit", "editnotes", "editrequest"}:
        return ["PUT", "PATCH"]
    if lower in {"delete"}:
        return ["DELETE"]
    # default to GET when unsure
    return ["GET"]


def collect_actions(controller_file: Path) -> list[dict]:
    routes = []
    controller_slug = controller_file.name.replace('_controller.php', '')
    controller_class = controller_slug.title().replace('_', '') + "Controller"
    with controller_file.open('r', encoding='utf-8', errors='ignore') as f:
        for idx, line in enumerate(f, start=1):
            m = FUNC_DEF_RE.match(line)
            if not m:
                continue
            action = m.group(1)
            if action.startswith('_'):
                continue
            params = parse_params(m.group(2))
            methods = infer_methods(controller_slug, action)
            # Build default dispatcher route: /controller/action
            path = f"/{controller_slug}/{action}"
            entry = {
                "path": path,
                "methods": methods,
                "controller": controller_class,
                "action": action,
                "params": params,
                "middleware_or_filters": [],
                "inferred": True,
                "files_cited": [
                    {"file": str(controller_file.relative_to(ROOT)),
                     "lines": f"{idx}-{idx}"}
                ],
                "notes": [],
            }
            # Notes about view-only
            if has_view_template(controller_slug, action):
                entry["notes"].append("renders a view template (inferred)")
            # Notes about add/edit/delete common flows
            if action.lower() == "add":
                entry["notes"].append(
                    "commonly GET for form, POST to create (inferred)")
            if action.lower() in {"edit", "editnotes", "editrequest"}:
                entry["notes"].append(
                    "commonly GET for form, PUT/PATCH to update (inferred)")
            if action.lower() == "delete":
                entry["notes"].append(
                    "often invoked via POST/DELETE and redirects (inferred)")
            # Special-case: index also maps to /controller
            if action == "index":
                entry_index = json.loads(json.dumps(entry))
                entry_index["path"] = f"/{controller_slug}"
                routes.append(entry_index)
            routes.append(entry)
    return routes


ROUTER_CONNECT_RE = re.compile(
    r"Router::connect\(\s*'([^']+)'\s*,\s*array\(\s*'controller'\s*=>\s*'([^']+)'\s*,\s*'action'\s*=>\s*'([^']+)'(?:\s*,\s*'([^']+)')?"
)


def collect_explicit_routes() -> list[dict]:
    routes = []
    if not ROUTES_PHP.exists():
        return routes
    with ROUTES_PHP.open('r', encoding='utf-8', errors='ignore') as f:
        for idx, line in enumerate(f, start=1):
            m = ROUTER_CONNECT_RE.search(line)
            if not m:
                continue
            path, controller, action, extra = m.groups()
            controller_class = controller.title().replace('_', '') + "Controller"
            entry = {
                "path": path,
                "methods": ["GET"],
                "controller": controller_class,
                "action": action,
                "params": [p for p in (["path*"] if path.endswith("/*") else ([] if not extra else [extra]))],
                "middleware_or_filters": [],
                "inferred": True,
                "files_cited": [
                    {"file": str(ROUTES_PHP.relative_to(ROOT)),
                     "lines": f"{idx}-{idx}"}
                ],
                "notes": [],
            }
            if controller == "pages" and action == "display":
                entry["notes"].append("renders a view template (inferred)")
            routes.append(entry)
    return routes


def main():
    all_routes: list[dict] = []
    # Explicit routes first
    all_routes.extend(collect_explicit_routes())
    # Default dispatcher routes from public actions
    for ctrl in list_php_controllers():
        if ctrl.name.startswith('.'):
            continue
        if ctrl.name == "components":
            continue
        all_routes.extend(collect_actions(ctrl))

    # Also include default dispatcher route for pages/display (in case explicit route exists too)
    # Find pages controller function line for display
    pages_controller = CONTROLLERS_DIR / "pages_controller.php"
    if pages_controller.exists():
        with pages_controller.open('r', encoding='utf-8', errors='ignore') as f:
            for idx, line in enumerate(f, start=1):
                m = FUNC_DEF_RE.match(line)
                if m and m.group(1) == 'display':
                    all_routes.append({
                        "path": "/pages/display",
                        "methods": ["GET"],
                        "controller": "PagesController",
                        "action": "display",
                        "params": [],
                        "middleware_or_filters": [],
                        "inferred": True,
                        "files_cited": [
                            {"file": str(pages_controller.relative_to(
                                ROOT)), "lines": f"{idx}-{idx}"}
                        ],
                        "notes": ["renders a view template (inferred)"]
                    })
                    break

    # Dedupe by (path, controller, action)
    deduped: dict[tuple[str, str, str], dict] = {}
    for r in all_routes:
        key = (r.get("path"), r.get("controller"), r.get("action"))
        if key not in deduped:
            deduped[key] = r
        else:
            # Merge notes and prefer earlier methods
            existing = deduped[key]
            # merge methods preserving order
            for m in r.get("methods", []):
                if m not in existing["methods"]:
                    existing["methods"].append(m)
            # merge notes
            for n in r.get("notes", []):
                if n not in existing["notes"]:
                    existing["notes"].append(n)

    out_obj = {
        "routes": list(deduped.values()),
        "notes": [
            "HTTP methods are inferred; CakePHP 1.x routes do not enforce methods by default.",
            "Default dispatcher exposes /:controller/:action/* for each public action.",
            "PagesController::display is commonly used to render view templates by name.",
        ],
    }
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with OUT_FILE.open('w', encoding='utf-8') as f:
        json.dump(out_obj, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
