# Scheduler OpenAPI

This OpenAPI 3.1 spec was synthesized from the project's specs in `docs/specs`:

- routes: `docs/specs/routes/routes.json`
- controllers: `docs/specs/controllers/*.json`
- ERD: `docs/specs/data-model/erd.json`
- views/screens (only for AJAX endpoints): `docs/specs/views/screens/*.json`
- roles: `docs/specs/auth/roles-matrix.json`

Important notes

- Only JSON API endpoints are documented. Legacy HTML page renders and redirects are mentioned via `x-legacy-note` and operation descriptions.
- Where data or access rules were unclear in the sources, the spec marks them as `UNKNOWN` and avoids circular `$ref`s.
- Security is modeled as cookie-based session (`cookieAuth`) to match the legacy app behavior.

Files

- `openapi.yaml` — the OpenAPI 3.1 document
- `README.md` — this guide

Using the spec

- Validate:
  ```bash
  npx @redocly/cli lint docs/specs/openapi/openapi.yaml | cat
  ```
- Render API docs locally (Redoc):
  ```bash
  npx @redocly/cli preview-docs docs/specs/openapi/openapi.yaml --host 0.0.0.0 --port 8080
  ```
- Generate a TypeScript client (OpenAPI Generator):
  ```bash
  npx @openapitools/openapi-generator-cli generate \
    -i docs/specs/openapi/openapi.yaml \
    -g typescript-fetch \
    -o generated/ts-client --skip-validate-spec
  ```
- Generate a Python client:
  ```bash
  npx @openapitools/openapi-generator-cli generate \
    -i docs/specs/openapi/openapi.yaml \
    -g python \
    -o generated/python-client --skip-validate-spec
  ```

Conventions

- Tags group endpoints by resource (People, Shifts, Schedules, Requests, Users, etc.).
- Each operation defines `operationId`, `summary`, `parameters`, `requestBody` (if any), and JSON `responses` referencing `components/schemas`.
- Operation descriptions include security and role notes.

Extending

- If you discover additional JSON endpoints (e.g., AJAX actions in screens), add them under `paths` and prefer referencing existing component schemas.
- When behavior is unclear, add an `x-legacy-note` detailing the uncertainty and keep fields as `UNKNOWN` where appropriate.
