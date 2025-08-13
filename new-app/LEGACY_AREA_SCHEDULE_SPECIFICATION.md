# Legacy Area Schedule Complete Specification

## Overview
This document provides an exhaustive analysis of every visual element, positioning, styling, and functionality in the legacy CakePHP area schedule view. This serves as the reference for achieving pixel-perfect replication in the new React implementation.

## Page Structure

### 1. Header Table (774px width, border="0", align="center")
**Purpose**: Contains area name, manager info, and group status
**Location**: Lines 19-122 in schedule_content.ctp

#### Row 1 (Main Header Row)
- **Cell 1**: width="99" rowspan="2" colspan="3"
  - **Content**: Manager info section
  - **Positioning**: `<p style='position:relative;top:-10;left:20px;'>`
  - **Text**: "Manager: " (for area schedules only)
  - **Manager Name**: `<span class="title" style='padding-left:3px;position:relative;top:3px'>`
  - **CSS Class**: `.title` (font-size: 24px)

- **Cell 2**: width="222" rowspan="2"
  - **Content**: Area name and "Schedule" label
  - **Alignment**: `<div align="center" class="title">`
  - **Area Name**: `<span id='area_name'>` (editable link for operations)
  - **Link Properties**: Ajax link with dialog opening functionality
  - **Below Area**: `<br />` followed by "Schedule" text

- **Cell 3**: width="107"
  - **Content**: "Name:" label (person schedules only)
  - **Alignment**: `<div align="right">`

- **Cell 4**: width="15"
  - **Content**: `&nbsp;` (spacer cell)

- **Cell 5**: width="178"
  - **Content**: Person name section (person schedules only)
  - **Font Size**: `<span style="font-size:24px;">`
  - **Person Name**: `<span id='person_name'>` with link
  - **Full Name**: `<span id='full_name'>` with Last, First format

#### Row 2 (Group Name Row)
- **Cell**: width='200px' colspan='3' style='padding:4px'
  - **Content**: Group name or "In Progress" status
  - **Alignment**: `<div align="center">`
  - **Dynamic Content**: Published group name or `<i>In Progress</i>`

### 2. Main Schedule Table (774px width, border="2", align="center")
**Purpose**: Contains the actual schedule grid
**Location**: Lines 123-342 in schedule_content.ctp

#### Header Row (Day Names)
- **First Cell**: width="75" bordercolor="#000000"
  - **Content**: Special operations links (area schedules only)
  - **"Notes From Ops"**: Request mode link (green color)
  - **"View Request"**: Operations request viewing link
  - **CSS Class**: `.no_print` (hidden in print mode)

- **Day Cells**: width="75" bordercolor="#000000" (7 cells for days)
  - **Content**: Day names (Sunday, Monday, etc.)
  - **Alignment**: `<div align="center"><p>`
  - **Today Highlighting**: `style='background-color:#FFFADC'`
  - **Off Days**: Clickable for person schedules (toggle day off)
  - **Dates**: Optional date display `<small>` with m/d/y format

#### Time Slot Rows (3 rows for Morning/Afternoon/Evening)
- **Time Label Cell**: width="75" height="60" bordercolor="#000000"
  - **Content**: Slot name (Morning, Afternoon, Evening)
  - **Alignment**: `<div align="center"><p>`

- **Shift Cells**: width="75" height="60" bordercolor="#000000" (7 cells per row)
  - **Interactive**: `onmouseover`/`onmouseout` for add shift buttons
  - **Cell ID**: Format `{slot_num}_{day}` for JavaScript targeting
  - **Off Day Styling**: `class="dayoff_bg"` for gray background
  - **Add Shift Link**: `<a class='add'>` with " + " text (hidden by default)
  - **Content Container**: `<div align="center" class="shift"><p>`
  - **Off Day Print**: `<span class="dayoff_x">X</span>` for print mode

##### Shift Display Content
- **Area Shifts**: Displayed via `$schedule->displayAreaShift()`
  - **Time Display**: Bold time link `<b>{time}</b><br/>`
  - **People List**: Assignment names with links
  - **Star Indicators**: `<span class='star'>★</span>` for starred assignments
  - **Unassigned Slots**: `________` links for empty assignments
  - **CSS**: `<span class='shift' id='{shift_id}'>`

#### Hours Summary Row (Person schedules only)
- **Hours Label Cell**: height="26" bordercolor="#000000"
  - **Content**: "Hours"
  - **Alignment**: `<div align="center">`

- **Hours Cells**: align="center" height="26" bordercolor="#000000"
  - **Content**: Daily hour totals from `$schedule->total_hours[$day]`

#### Floating Shifts Row
- **Cell**: id="0_0" align="center" height="13" colspan="8"
  - **Style**: `bordercolor="#000000" style="padding:3px;"`
  - **Interactive**: `onmouseover`/`onmouseout` for add floating shift
  - **Content**: Area floating shifts via `$schedule->displayAreaFloating()`
  - **Add Button**: `<a class='add' id="add_0_0">` with " + " text

#### Notes Row (Conditional Display)
- **Cell**: id="notes" align="center" height="13" colspan="8"
  - **Style**: `bordercolor="#000000" style="padding:3px;"`
  - **Content**: Editable notes link in `<i>` tags
  - **Display**: `*** notes ***` when no notes exist
  - **Edit Link**: Ajax link opening dialog

#### Legend/Total Row
- **Cell**: height="13" colspan="8" bordercolor="#000000"
  - **Style**: `style="padding:3px;"`
  - **Alignment**: Left for area schedules, center for person schedules
  - **Content**: 
    - **Person Schedules**: Legend display via `$schedule->displayLegend()`
    - **Area Schedules**: Total hours link or Accept button
    - **Request Mode**: "Accept Shifts" button

### 3. Navigation Table (Non-request, non-gaps, non-print modes)
**Location**: Lines 343-380 in schedule_content.ctp
- **Width**: 850px, align='center'
- **Font**: `style='font-size:17pt;text-align:center'`
- **Left Cell**: Previous schedule link `&larr;`
- **Right Cell**: Next schedule link `&rarr;`
- **Link Properties**: 
  - **Previous**: id='previousSchedule', title='Previous Schedule (shift+left)'
  - **Next**: id='nextSchedule', title='Next Schedule (shift+right)'

### 4. Notes Section (Person schedules, non-gaps, non-print)
**Location**: Lines 381-515 in schedule_content.ctp
- **Width**: 774px, align="center"
- **Position**: `style="position:relative;top:-30px"`
- **CSS Class**: `.no_print`

#### Two-Column Layout
- **Left Column**: Operations Notes
  - **Header**: `<b><u>Operations Notes:</u></b>`
  - **List**: `<ul id='lonotes'>` with sortable functionality
  - **Notes**: `<li id='lonote_{id}'>` with edit links
  - **Font**: `style="font-size:14pt;text-align:left"`

- **Spacer**: `<td width="20px"></td>`

- **Right Column**: Personnel Notes
  - **Header**: `<b><u>Notes from Personnel:</u></b>`
  - **List**: `<ul id='lpnotes'>` with sortable functionality
  - **Notes**: `<li id='lpnote_{id}'>` with edit links

## CSS Styling Details

### Key CSS Classes from schedule.css

#### Shift Display
- `.shift`: `display: block; padding-top: 20px;`
- `.shift:first-child`: `padding-top: 0px;`
- `.person.shift`: `padding: 0px;` (overrides default padding)
- `.const, span.const a`: `color:#999999;` (grayed out text)

#### Interactive Elements
- `a:hover`: `background-color:#FFF8BA;` (yellow highlight)
- `a.add`: `display:none; font-size:10pt; position:absolute; padding:3px; background-color:#DDDDDD`
- `.dayoff_bg`: `background-color:#DDDDDD;` (off day cells)
- `.dayoff_x`: `display:none;` (screen), visible in print with font-size:18px

#### Typography
- `.title`: `font-size: 24px;`
- `#full_name`: `font-size:16px; font-style:italic;`
- `.star, .star_p`: `font-size:13pt; height:12px; padding-right:2px; padding-left:2px;`

#### Special Elements
- `#group_name`: `color:black;`
- `#published`: `position:absolute; top:18px; left:0px;`
- `.schedule_message`: `font-size:13px; color:#999; font-weight:bold; position:relative; top:-10px; left:7px;`

## Interactive Functionality

### JavaScript Integration
- **Add Shift Buttons**: Hidden by default, shown on mouseover
- **Dialog System**: Ajax links open dialogs via `openDialog()` function
- **Keyboard Navigation**: Shortcut keys for navigation
- **Hover Effects**: View buttons and add buttons with hover states

### Role-Based Features
- **Operations**: Full editing capabilities, all links active
- **Manager**: Limited to assigned areas, request functionality
- **Personnel**: View-only, no interactive elements

### Dynamic Content
- **Today Highlighting**: Automatic background color for current day
- **Off Days**: Visual indicators and toggle functionality
- **Request Mode**: Special styling and functionality
- **Print Mode**: Modified display with different styling

## Exact Measurements and Positioning

### Table Structure
- **Header Table**: 774px width, no border, centered
- **Main Table**: 774px width, 2px border, centered
- **Cell Widths**: 75px for time/day cells, specific widths for header cells
- **Cell Heights**: 60px for shift cells, 26px for hours, 13px for floating/notes

### Typography Specifications
- **Title**: 24px font size
- **Full Name**: 16px italic
- **Notes**: 14pt font size
- **Stars**: 13pt font size
- **Add Buttons**: 10pt font size

### Color Specifications
- **Today Highlight**: #FFFADC (light yellow)
- **Hover Color**: #FFF8BA (yellow)
- **Off Day**: #DDDDDD (light gray)
- **Grayed Text**: #999999
- **Star/Border**: #000000 (black)

This specification serves as the complete reference for implementing a pixel-perfect replica of the legacy area schedule view in the React application.