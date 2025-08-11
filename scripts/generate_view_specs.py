#!/usr/bin/env python3
import os
import re
import json
from pathlib import Path
from typing import Dict, List, Any, Tuple

ROOT = Path(__file__).resolve().parents[1]
VIEWS_DIR = ROOT / "views"
OUTPUT_DIR = ROOT / "docs" / "specs" / "views"
SCREENS_DIR = OUTPUT_DIR / "screens"


def to_camel_controller(controller_dir: str) -> str:
    parts = controller_dir.strip("/").split("/")
    last = parts[-1]
    camel = "".join(p.capitalize() for p in re.split(r"[_\s]+", last) if p)
    return f"{camel}Controller"


def clean_quotes(s: str) -> str:
    return s.strip().strip("'\"")


def parse_php_array_options(src: str) -> Dict[str, Any]:
    # Very naive parser for PHP array('key' => 'value', 'k2' => true)
    # Returns best-effort dict; strings only for simple values.
    out: Dict[str, Any] = {}
    try:
        inner = src.strip()
        # strip array(...) or [...]
        if inner.startswith('array(') and inner.endswith(')'):
            inner = inner[6:-1]
        elif inner.startswith('[') and inner.endswith(']'):
            inner = inner[1:-1]
        # split by commas not inside brackets/quotes
        parts = []
        buf = []
        depth = 0
        in_str = False
        str_char = ''
        prev_char = ''
        for ch in inner:
            if in_str:
                buf.append(ch)
                if ch == str_char and prev_char != '\\':
                    in_str = False
                prev_char = ch
                continue
            if ch in ('"', "'"):
                in_str = True
                str_char = ch
                buf.append(ch)
                prev_char = ch
                continue
            if ch in ('(', '['):
                depth += 1
            elif ch in (')', ']') and depth > 0:
                depth -= 1
            if ch == ',' and depth == 0:
                parts.append(''.join(buf).strip())
                buf = []
            else:
                buf.append(ch)
            prev_char = ch
        if buf:
            parts.append(''.join(buf).strip())
        for part in parts:
            if '=>' in part:
                key, val = part.split('=>', 1)
                key = clean_quotes(key.strip())
                val = val.strip()
                # normalize simple values
                if val.lower() in ('true', 'false', 'null'):
                    out[key] = val.lower(
                    ) == 'true' if val.lower() != 'null' else None
                else:
                    out[key] = clean_quotes(val)
        return out
    except Exception:
        return {}


def extract_forms(content: str) -> List[Dict[str, Any]]:
    forms: List[Dict[str, Any]] = []
    lines = content.splitlines()
    # CakePHP form create
    form_create_re = re.compile(
        r"\$form->create\((?P<model>[^,\)]*)(?:,(?P<opts>[^\)]*))?\)")
    input_re = re.compile(r"\$form->input\((?P<args>[^\)]*)\)")
    other_field_calls = [
        ("text", re.compile(r"\$form->text\((?P<args>[^\)]*)\)")),
        ("textarea", re.compile(r"\$form->textarea\((?P<args>[^\)]*)\)")),
        ("select", re.compile(r"\$form->select\((?P<args>[^\)]*)\)")),
        ("checkbox", re.compile(r"\$form->checkbox\((?P<args>[^\)]*)\)")),
        ("password", re.compile(r"\$form->password\((?P<args>[^\)]*)\)")),
        ("date", re.compile(r"\$form->date\((?P<args>[^\)]*)\)")),
    ]
    html_form_re = re.compile(r"<form\b([^>]*)>", re.IGNORECASE)
    html_input_re = re.compile(r"<input\b([^>]*)>", re.IGNORECASE)
    html_textarea_re = re.compile(r"<textarea\b([^>]*)>", re.IGNORECASE)
    html_select_re = re.compile(r"<select\b([^>]*)>", re.IGNORECASE)

    # Track current form until close when using Cake helper is hard; we aggregate overall
    for idx, line in enumerate(lines, start=1):
        for m in form_create_re.finditer(line):
            model = clean_quotes(m.group('model').strip()
                                 ) if m.group('model') else ''
            opts = parse_php_array_options(m.group('opts') or '')
            submit_to = 'UNKNOWN'
            url_opt = opts.get('url')
            action_opt = opts.get('action')
            if url_opt:
                submit_to = str(url_opt)
            elif action_opt:
                submit_to = str(action_opt)
            forms.append({
                'name': f"{model or 'form'}",
                'fields': [],
                'submit_to': submit_to,
                'lines': f"{idx}:{idx}"
            })
        for m in input_re.finditer(line):
            args = m.group('args')
            arg_parts = [a.strip() for a in args.split(',', 1)]
            field = clean_quotes(arg_parts[0]) if arg_parts else 'UNKNOWN'
            opts = parse_php_array_options(
                arg_parts[1]) if len(arg_parts) > 1 else {}
            field_type = opts.get('type') or 'text'
            required = bool(opts.get('required')) or 'required' in str(
                opts.get('class', '')).lower()
            default_value = opts.get('value') if 'value' in opts else None
            target_form = forms[-1] if forms else {
                'name': 'form', 'fields': [], 'submit_to': 'UNKNOWN'}
            if not forms:
                forms.append(target_form)
            target_form['fields'].append({
                'name': field,
                'type': field_type,
                'required': required,
                'default': default_value,
                'validation': []
            })
        for tname, rgx in other_field_calls:
            for m in rgx.finditer(line):
                args = m.group('args')
                arg_parts = [a.strip() for a in args.split(',', 1)]
                field = clean_quotes(arg_parts[0]) if arg_parts else 'UNKNOWN'
                opts = parse_php_array_options(
                    arg_parts[1]) if len(arg_parts) > 1 else {}
                required = bool(opts.get('required')) or 'required' in str(
                    opts.get('class', '')).lower()
                default_value = opts.get('value') if 'value' in opts else None
                target_form = forms[-1] if forms else {
                    'name': 'form', 'fields': [], 'submit_to': 'UNKNOWN'}
                if not forms:
                    forms.append(target_form)
                target_form['fields'].append({
                    'name': field,
                    'type': tname,
                    'required': required,
                    'default': default_value,
                    'validation': []
                })

    # Raw HTML forms
    for m in html_form_re.finditer(content):
        attrs = m.group(1)
        action_m = re.search(r"action=\"([^\"]+)\"", attrs, re.IGNORECASE)
        name_m = re.search(r"name=\"([^\"]+)\"", attrs, re.IGNORECASE)
        form_name = name_m.group(1) if name_m else 'form'
        submit_to = action_m.group(1) if action_m else 'UNKNOWN'
        forms.append({'name': form_name, 'fields': [], 'submit_to': submit_to})
    # HTML inputs
    for m in html_input_re.finditer(content):
        attrs = m.group(1)
        name_m = re.search(r"name=\"([^\"]+)\"", attrs, re.IGNORECASE)
        type_m = re.search(r"type=\"([^\"]+)\"", attrs, re.IGNORECASE)
        req = bool(re.search(r"required", attrs, re.IGNORECASE))
        val_m = re.search(r"value=\"([^\"]*)\"", attrs, re.IGNORECASE)
        field = name_m.group(1) if name_m else 'UNKNOWN'
        field_type = type_m.group(1) if type_m else 'text'
        default_value = val_m.group(1) if val_m else None
        target_form = forms[-1] if forms else {
            'name': 'form', 'fields': [], 'submit_to': 'UNKNOWN'}
        if not forms:
            forms.append(target_form)
        target_form['fields'].append({
            'name': field,
            'type': field_type,
            'required': req,
            'default': default_value,
            'validation': []
        })
    for m in html_textarea_re.finditer(content):
        attrs = m.group(1)
        name_m = re.search(r"name=\"([^\"]+)\"", attrs, re.IGNORECASE)
        req = bool(re.search(r"required", attrs, re.IGNORECASE))
        field = name_m.group(1) if name_m else 'UNKNOWN'
        target_form = forms[-1] if forms else {
            'name': 'form', 'fields': [], 'submit_to': 'UNKNOWN'}
        if not forms:
            forms.append(target_form)
        target_form['fields'].append({
            'name': field,
            'type': 'textarea',
            'required': req,
            'default': None,
            'validation': []
        })
    for m in html_select_re.finditer(content):
        attrs = m.group(1)
        name_m = re.search(r"name=\"([^\"]+)\"", attrs, re.IGNORECASE)
        req = bool(re.search(r"required", attrs, re.IGNORECASE))
        field = name_m.group(1) if name_m else 'UNKNOWN'
        target_form = forms[-1] if forms else {
            'name': 'form', 'fields': [], 'submit_to': 'UNKNOWN'}
        if not forms:
            forms.append(target_form)
        target_form['fields'].append({
            'name': field,
            'type': 'select',
            'required': req,
            'default': None,
            'validation': []
        })
    return forms


def extract_links(content: str) -> List[Dict[str, str]]:
    links: List[Dict[str, str]] = []
    cake_link_re = re.compile(r"\$html->link\((?P<args>[^\)]*)\)")
    for m in cake_link_re.finditer(content):
        args = m.group('args')
        parts = [p.strip() for p in args.split(',', 1)]
        text = clean_quotes(parts[0]) if parts else 'link'
        target = 'UNKNOWN'
        if len(parts) > 1:
            opt = parts[1]
            # look for controller/action in array
            ctrl = re.search(r"'controller'\s*=>\s*'([^']+)'", opt)
            act = re.search(r"'action'\s*=>\s*'([^']+)'", opt)
            href = re.search(r"'escape'\s*=>\s*'([^']+)'", opt)
            if ctrl and act:
                target = f"{ctrl.group(1)}/{act.group(1)}"
            else:
                url = re.search(r"'(?:https?://)?/?([\w/_-]+)'", opt)
                if url:
                    target = url.group(1)
        links.append({'text': text, 'to': target})
    # Raw anchors
    for m in re.finditer(r"<a[^>]+href=\"([^\"]+)\"[^>]*>(.*?)</a>", content, re.IGNORECASE | re.DOTALL):
        href = m.group(1)
        text = re.sub(r"<[^>]+>", "", m.group(2)).strip()
        links.append({'text': text or 'link', 'to': href})
    return links


def extract_elements(content: str) -> List[str]:
    names: List[str] = []
    for m in re.finditer(r"\$this->(?:element|renderElement)\(\s*['\"]([^'\"]+)['\"]", content):
        name = m.group(1)
        if not name.endswith('.ctp'):
            name = f"elements/{name}.ctp"
        names.append(name)
    return list(dict.fromkeys(names))


def extract_ajax(content: str) -> List[Dict[str, str]]:
    calls: List[Dict[str, str]] = []
    for m in re.finditer(r"new\s+Ajax\.(?:Request|Updater)\(\s*['\"]([^'\"]+)['\"]\s*,\s*\{([^}]*)\}", content):
        url = m.group(1)
        method_m = re.search(
            r"method\s*:\s*['\"]([A-Z]+)['\"]", m.group(2), re.IGNORECASE)
        calls.append({'url': url, 'method': method_m.group(
            1).upper() if method_m else 'UNKNOWN'})
    for m in re.finditer(r"\$\.ajax\(\s*\{([^}]*)\}", content):
        body = m.group(1)
        url_m = re.search(r"url\s*:\s*['\"]([^'\"]+)['\"]", body)
        method_m = re.search(r"type\s*:\s*['\"]([^'\"]+)['\"]", body)
        if url_m:
            calls.append({'url': url_m.group(1), 'method': (
                method_m.group(1).upper() if method_m else 'UNKNOWN')})
    return calls


def extract_conditionals(content: str) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    for m in re.finditer(r"if\s*\(([^)]+)\)\s*[:{]", content):
        cond = m.group(1).strip()
        # Reduce whitespace
        cond = re.sub(r"\s+", " ", cond)
        items.append({'when': cond, 'shows': ['UNKNOWN']})
    return items


def extract_messages(content: str) -> List[Dict[str, str]]:
    msgs: List[Dict[str, str]] = []
    if re.search(r"\$session->flash|\$this->Session->flash", content, re.IGNORECASE):
        msgs.append({'type': 'flash', 'text': 'Session flash'})
    for m in re.finditer(r"<div[^>]+class=\"([^\"]*?(?:error|notice|message)[^\"]*)\"[^>]*>(.*?)</div>", content, re.IGNORECASE | re.DOTALL):
        cls = m.group(1)
        text = re.sub(r"<[^>]+>", " ", m.group(2)).strip()
        msgs.append({'type': cls, 'text': text})
    if re.search(r"\$form->error", content):
        msgs.append({'type': 'error', 'text': 'Form validation errors'})
    return msgs


def guess_page_name(content: str, controller: str, view: str) -> str:
    # Try to find <h1> or title_for_layout assignment
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", content, re.IGNORECASE | re.DOTALL)
    if h1:
        return re.sub(r"<[^>]+>", " ", h1.group(1)).strip()
    title = re.search(
        r"\$this->set\(\s*'title_for_layout'\s*,\s*'([^']+)'\s*\)", content)
    if title:
        return title.group(1)
    return f"{controller.lower()}/{view}"


def process_view_file(path: Path, elements_usage: Dict[str, List[str]]) -> Tuple[str, Dict[str, Any]]:
    rel = path.relative_to(VIEWS_DIR)
    parts = rel.parts
    controller_dir = parts[0]
    view_name = path.stem
    controller = to_camel_controller(controller_dir)
    controller_action = f"{controller}#{view_name}"
    content = path.read_text(encoding='utf-8', errors='ignore')
    forms = extract_forms(content)
    conditionals = extract_conditionals(content)
    messages = extract_messages(content)
    links = extract_links(content)
    ajax = extract_ajax(content)
    partials = extract_elements(content)
    for el in partials:
        elements_usage.setdefault(el, []).append(
            f"{controller_dir}/{view_name}")
    page_name = guess_page_name(content, controller_dir, view_name)
    num_lines = content.count('\n') + 1
    spec = {
        'screen': f"{controller_dir}/{view_name}",
        'controller_action': controller_action,
        'forms': forms,
        'conditionals': conditionals,
        'messages': messages,
        'navigation': {'links': links},
        'ajax_calls': ajax,
        'partials_used': partials,
        'files_cited': [{'file': str(rel), 'lines': f"1-{num_lines}"}],
    }
    return f"{controller_dir}__{view_name}.json", spec


def summarize_helpers(helpers_dir: Path) -> Dict[str, Dict[str, Any]]:
    summary: Dict[str, Dict[str, Any]] = {}
    for helper_file in sorted(helpers_dir.glob('*.php')):
        content = helper_file.read_text(encoding='utf-8', errors='ignore')
        methods = re.findall(r"function\s+([A-Za-z0-9_]+)\s*\(", content)
        doc_titles = re.findall(r"/\*\*\s*\*\s*(.*?)\n", content)
        summary[str(helper_file.name)] = {
            'methods': sorted(list(set(methods))),
            'doc_summaries': doc_titles[:5],
            'file': str(helper_file.relative_to(VIEWS_DIR))
        }
    return summary


def main() -> None:
    screens: Dict[str, Dict[str, Any]] = {}
    elements_usage: Dict[str, List[str]] = {}
    elements_dir = VIEWS_DIR / 'elements'
    layouts_dir = VIEWS_DIR / 'layouts'
    helpers_dir = VIEWS_DIR / 'helpers'

    for dirpath, dirnames, filenames in os.walk(VIEWS_DIR):
        rel_dir = Path(dirpath).relative_to(VIEWS_DIR)
        # Skip special directories for screen generation
        if rel_dir.parts and rel_dir.parts[0] in ('elements', 'layouts', 'helpers'):
            continue
        for fname in filenames:
            if not fname.endswith('.ctp'):
                continue
            fpath = Path(dirpath) / fname
            # exclude stray top-level files like views/view.ctp
            rel_parts = fpath.relative_to(VIEWS_DIR).parts
            if len(rel_parts) < 2:
                continue
            out_name, spec = process_view_file(fpath, elements_usage)
            screens[out_name] = spec

    # Prepare output dirs
    SCREENS_DIR.mkdir(parents=True, exist_ok=True)
    # Write JSON specs
    for name, spec in screens.items():
        out_path = SCREENS_DIR / name
        with out_path.open('w', encoding='utf-8') as f:
            json.dump(spec, f, indent=2, ensure_ascii=False)

    # Helpers summary
    helpers_summary = summarize_helpers(
        helpers_dir) if helpers_dir.exists() else {}

    # Compose README
    readme_lines: List[str] = []
    readme_lines.append("## Views Specs Navigation\n")
    readme_lines.append(
        "This document links to auto-generated screen specs and summarizes elements and helpers.\n")

    readme_lines.append("### Screens\n")
    by_controller: Dict[str, List[Tuple[str, str]]] = {}
    for name in sorted(screens.keys()):
        ctrl, view = name.rsplit('__', 1)
        by_controller.setdefault(ctrl, []).append(
            (view.replace('.json', ''), name))
    for ctrl in sorted(by_controller.keys()):
        readme_lines.append(f"- **{ctrl}**")
        for view, filename in sorted(by_controller[ctrl]):
            readme_lines.append(
                f"  - `{ctrl}/{view}`: `docs/specs/views/screens/{filename}`")

    readme_lines.append("\n### Elements usage\n")
    if elements_usage:
        for el, used_by in sorted(elements_usage.items()):
            readme_lines.append(
                f"- **{el}**: used by {', '.join(sorted(set(used_by)))}")
    else:
        readme_lines.append(
            "- No elements referenced by screens were detected.")

    readme_lines.append("\n### Helpers summary\n")
    if helpers_summary:
        for helper_name, info in sorted(helpers_summary.items()):
            methods = ', '.join(info.get('methods', [])[:10])
            readme_lines.append(
                f"- **{helper_name}**: methods [{methods}] (`{info.get('file')}`)")
    else:
        readme_lines.append("- No helpers found.")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with (OUTPUT_DIR / 'README.md').open('w', encoding='utf-8') as f:
        f.write("\n".join(readme_lines) + "\n")

    print(f"Wrote {len(screens)} screen specs to {SCREENS_DIR}")


if __name__ == '__main__':
    main()
