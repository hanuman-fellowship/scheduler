# Data Model Summary

This spec summarizes tables, associations, and validations extracted from SQL and CakePHP models.

## Key entities

- Schedules: `schedules`, grouped by `schedule_groups`; most domain tables include `schedule_id` for scoping.
- Core domain: `areas`, `shifts`, `assignments`, `people`, `people_schedules`, `resident_categories`, `floating_shifts`, `off_days`, `boundaries`/`slots`/`days`.
- Notes and changes: `personnel_notes`, `operations_notes`, `changes` + `change_models` + `change_fields`.
- Users and roles: `users`, `roles`, `settings`, `managers` (user↔area mapping).
- Requests (alt flow): `request_areas`, `request_shifts`, `request_assignments`, `request_floating_shifts`.
- Infrastructure: ACL (`acos`, `aros`, `aros_acos`), i18n (`i18n`), sessions (`cake_sessions`).

## Conventions

- `schedule_id` appears in many tables; implicit foreign key to `schedules.id` (not enforced in SQL).
- Most tables use MyISAM; foreign keys and primary keys are often not declared even with `id` AUTO_INCREMENT.
- Associations are derived from Cake models; when not provable from SQL, marked as UNKNOWN in per-table specs.

## Glossary

- Schedule Group: Time-bounded collection of schedules with `start`/`end` windows.
- Slot: Named time-of-day block per day; used by `boundaries` to define day partitions.
- Boundary: Start/end times for a slot and day in a schedule.
- Constant Shift: Recurring shift tied to resident category and day; can specify fixed hours.
- Floating Shift: Ad-hoc hours for a person in an area.

See `erd.json` for the full picture and `tables/*.json` for per-table detail with citations.
