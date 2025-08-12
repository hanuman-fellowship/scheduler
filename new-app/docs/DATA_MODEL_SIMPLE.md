# Data Model Specifications (Simple & Fast)

Based on the actual legacy code, keeping it simple for fastest development:

## Core Entities

### users
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `username` (String, Unique, Required)
- `email` (String, Unique, Required) 
- `password` (String, Hashed, Required)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### roles
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `user_id` (Integer, Foreign Key → users.id)
- `name` (String: 'operations', 'personnel', 'manager')

### managers
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `user_id` (Integer, Foreign Key → users.id)
- `area_id` (Integer, Foreign Key → areas.id)

### schedules
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `name` (String, Required)
- `user_id` (Integer, Nullable, Foreign Key → users.id) // null = published
- `parent_id` (Integer, Nullable, Foreign Key → schedules.id) // for branching
- `schedule_group_id` (Integer, Nullable, Foreign Key → schedule_groups.id)
- `template` (Boolean, Default: false)
- `request` (Integer, Default: 0) // 0=normal, 1=submitted, 2=draft
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### schedule_groups
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `name` (String, Required)
- `start` (DateTime, Required)
- `end` (DateTime, Required)

### areas
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `name` (String, Required)
- `short_name` (String, Required)
- `notes` (Text, Nullable)

### days
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `name` (String, Required) // "Monday", "Tuesday", etc.
- `date` (Date, Nullable)
- `day_of_week` (Integer, 1-7) // 1=Sunday

### people
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `first` (String, Required)
- `last` (String, Required)
- `display_name` (String, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### people_schedules
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `person_id` (Integer, Foreign Key → people.id)
- `resident_category_id` (Integer, Foreign Key → resident_categories.id)

### resident_categories
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `name` (String, Required)
- `color` (String, Nullable)
- `sort_order` (Integer, Nullable)

### shifts
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `area_id` (Integer, Foreign Key → areas.id)
- `day_id` (Integer, Foreign Key → days.id)
- `start_at_seconds` (Integer, Required) // Seconds since midnight (0-86399)
- `end_at_seconds` (Integer, Required)   // Seconds since midnight (0-86399)
- `num_people` (Integer, Default: 1)

**Time Storage Notes:**
- Time stored as integers (seconds since midnight) for better performance and simpler filtering
- Example: 8:30 AM = 8*3600 + 30*60 = 30600 seconds since midnight
- Example: 5:15 PM = 17*3600 + 15*60 = 62100 seconds since midnight
- No TIME columns - using seconds-based approach exclusively
- **All time operations use centralized utilities in `shared/src/timeUtils.ts`**
- **Conversion functions**: `timeStringToSeconds()`, `secondsToDisplayTime()`, `calculateDurationHours()`, etc.
- **Time periods**: Morning (0-43200s), Afternoon (43200-61200s), Evening (61200-86400s)

### floating_shifts
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `area_id` (Integer, Foreign Key → areas.id)
- `person_id` (Integer, Foreign Key → people.id)
- `hours` (Decimal, Required)

### constant_shifts
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `resident_category_id` (Integer, Foreign Key → resident_categories.id)
- `day_id` (Integer, Foreign Key → days.id)
- `start_at_seconds` (Integer, Required) // Seconds since midnight (0-86399)
- `end_at_seconds` (Integer, Required)   // Seconds since midnight (0-86399)
- `specify_hours` (Boolean, Default: false)
- `hours` (Decimal, Nullable)

### assignments
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `shift_id` (Integer, Foreign Key → shifts.id)
- `person_id` (Integer, Foreign Key → people.id) // 0 = "other" person
- `name` (String, Nullable) // for person_id = 0
- `star` (Boolean, Default: false)

### off_days
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `person_id` (Integer, Foreign Key → people.id)
- `day_id` (Integer, Foreign Key → days.id)

### changes (for undo/redo)
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `description` (String, Required)
- `undone` (Boolean, Default: false)
- `created` (Timestamp)

### change_models
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `change_id` (Integer, Foreign Key → changes.id)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `name` (String, Required) // model name
- `record_id` (Integer, Required)
- `action` (Integer, Required) // 0=delete, 1=create, 2=update

### change_fields
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `change_id` (Integer, Foreign Key → changes.id)
- `change_model_id` (Integer, Foreign Key → change_models.id)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `field_key` (String, Required)
- `field_old_val` (String, Nullable)
- `field_new_val` (String, Nullable)

### settings
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `user_id` (Integer, Foreign Key → users.id)
- `key` (String, Required)
- `val` (String, Required)

### personnel_notes
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `person_id` (Integer, Foreign Key → people.id)
- `content` (Text, Required)
- `sort_order` (Integer, Nullable)

### operations_notes
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `person_id` (Integer, Foreign Key → people.id)
- `content` (Text, Required)
- `sort_order` (Integer, Nullable)

### manager_notes
**Fields:**
- `id` (Integer, Auto-increment, Primary Key)
- `schedule_id` (Integer, Foreign Key → schedules.id)
- `area_id` (Integer, Foreign Key → areas.id)
- `content` (Text, Required)

### email_auths (singleton table)
**Fields:**
- `id` (Integer, Always 1)
- `name` (String, Required)
- `email` (String, Required)
- `password` (String, Encrypted, Required)

## Key Business Rules

### Schedule States
- `request = 0`: Normal working schedule
- `request = 1`: Submitted request (waiting for operations)
- `request = 2`: Draft request (still being edited)
- `template = 1`: Template schedule
- `name = "Published"` + `user_id = null`: Published schedule

### User Roles
- `operations`: Full system access
- `manager`: Can manage areas (via managers table)
- `personnel`: Basic user access

### Assignment Logic
- `person_id = 0`: "Other" assignment with custom name
- `star = 1`: Priority/starred assignment
- Limited by `shifts.num_people`

This keeps it simple - standard relational database with integer PKs, straightforward relationships, and minimal complexity.