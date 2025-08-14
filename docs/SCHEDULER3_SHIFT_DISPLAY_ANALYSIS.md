# Scheduler3 Shift Display Analysis

## Overview

This document provides a comprehensive pixel-perfect analysis of the Scheduler3 legacy application's shift display functionality. This analysis is based on examining the Rails application structure in `/Users/shantam/Software/scheduler3/`.

**Key Files Analyzed:**
- `app/views/layouts/_schedule.html.haml` - Main schedule template structure
- `app/assets/stylesheets/main.scss` - Complete CSS styling
- `app/assets/javascripts/scheduler.js.coffee` - JavaScript functionality
- `app/views/assignments/new_from_area.html.haml` - Assignment modal
- Various JSON builder files for data structure

## TABLE STRUCTURE AND LAYOUT

### HTML Table Structure
```html
<table class="schedule-table [week_class]" align="center" border="2" cellpadding="0" cellspacing="0">
  <tr class="date_row">
    <th style="position: relative">
      <div class="year">2024</div>
      <div class="month">January</div>
    </th>
    <th class="today">  <!-- today class applied conditionally -->
      <span class="wday">Mon</span>
      <br>
      <span class="day">15</span>
    </th>
    <!-- More date columns... -->
  </tr>
  <!-- Time slot rows... -->
</table>
```

### CSS Classes for Table Cells

**Table-level classes:**
- `.schedule-table` - Main table styling
- `.week_class` - Dynamic class for week type (past, copied, etc.)

**Cell classes:**
- `.shifts` - Applied to all shift cells
- `.today` - Applied to today's date column header
- `.day_off` - Applied to cells when person has day off
- `.popup_focus` - Applied when cell is focused for popup

### Table Cell Dimensions and Styling

**From main.scss lines 179-231:**
```scss
.schedule-table {
  width: 850px;
  margin-bottom: 50px;
  
  th, td {
    border: 1px solid black;
    background-clip: padding-box;
    min-width: 100px;
  }
  
  th {
    font-weight: normal;
    font-family: 'times';
    padding: 1em 0;
    text-align: center;
  }
}
```

**Shift cells specific styling (lines 804-811):**
```scss
.shifts {
  text-align: center;
  position: relative;
  height: 7em;           // Fixed height of 7em
  font-size: 14px;
  padding: 1em 0;
  line-height: normal;
}
```

## SHIFT DISPLAY STRUCTURE

### Individual Shift Container
Each shift is wrapped in a div with classes:
```html
<div class="shift [shift.class] [copyingClass]">
  <!-- Shift content -->
</div>
```

**Shift CSS (lines 919-922):**
```scss
.shift {
  margin-top: 2px;       // 2px spacing between shifts
  padding: 0.5em 0;      // Vertical padding
}
```

### Shift Name Container Structure
```html
<div class="shift_name">
  <!-- Recurring icon (conditional) -->
  <span class="shift_recurring_icon">
    <i class="fa fa-repeat"></i>
  </span>
  
  <!-- Time container -->
  <span class="shift_time_container">
    <a href="[edit_url]">[time_display]</a>
  </span>
</div>
```

### Multiple Shifts in Same Cell
- Shifts stack vertically with 2px margin between them
- Each shift maintains its own background and styling
- No visual separator lines between shifts

## ASSIGNMENT DISPLAY WITHIN SHIFTS

### Person Assignment Structure
```html
<span style="color: [category_color]" class="assigned_person [class] [community_hours]">
  <!-- Conflict indicator (conditional) -->
  <div class="conflict_notice">
    <i class="fa fa-exclamation-triangle"></i>
  </div>
  
  <!-- Person link -->
  <a href="[person_url]" class="view_person [soft_remove]">
    <!-- Recurring lock icon (conditional) -->
    <span class="recurring_lock">
      <i class="fa fa-repeat"></i>
    </span>
    [person_name]
  </a>
  
  <!-- Remove button (shown on hover) -->
  <a href="[remove_url]" class="a_remove_assignment" style="display: none">
    <i class="fa fa-times"></i>
  </a>
</span>
<br>
```

### Assignment CSS Styling

**Person assignment container (lines 1004-1072):**
```scss
.assigned_person {
  position: relative;
  display: inline-block;
  
  &.deleted {
    color: #777 !important;
    text-decoration: line-through;
  }
}
```

**Person link styling:**
```scss
.assigned_person a.view_person {
  position: relative;
}
```

### Write-In Assignments
```html
<span class="assigned_person [class]">
  <span class="write_in">[write_in_name]</span>
  <a href="[remove_url]" class="a_remove_assignment" style="display: none">
    <i class="fa fa-times"></i>
  </a>
</span>
<br>
```

### Empty Assignment Slots
```html
<a href="[assign_url]" class="unassigned">___________</a>
<br>
```

**Unassigned styling (lines 861-864):**
```scss
.unassigned {
  transform: translateY(-2px);  // Slight upward shift
  display: inline-block;
}
```

## COLOR CODING AND VISUAL INDICATORS

### Category Color Application
- Person names receive `style="color: [category_color]"` attribute
- Colors come from the person's category on the specific date
- Community hours assignments get additional `.community_hours` class

### Community Hours Styling
```scss
.community_hours {
  color: #888 !important;    // Gray color override
  font-style: italic;
}
```

### Soft Remove Styling
```scss
.soft_remove {
  text-decoration: line-through !important;
  opacity: 0.3;
}
```

### Conflict Indicators

**Conflict notice positioning (lines 1122-1126):**
```scss
.shift .conflict_notice {
  position: absolute;
  transform: translateX(-17px);  // Positioned to left of content
  background: radial-gradient(6px 10px at 7px 10px, white 50%, transparent 50%);
}
```

**General conflict styling (lines 1097-1104):**
```scss
.conflict_notice {
  color: orange;
  display: inline-block;
  
  span {
    display: none;  // Tooltip content hidden by default
  }
}
```

## INTERACTIVE ELEMENTS AND BEHAVIORS

### Hover States and Controls

**On hover over `.shifts` cell:**
- Shows `.add_shift`, `.paste_shift`, `.add_hold` buttons
- Positioned absolutely within cell

**On hover over `.assigned_person`:**
- Shows `.a_remove_assignment` button (X icon)
- Shows `.recurring_lock.ghost` icon if applicable

**On hover over `.shift_name`:**
- Shows `.shift_recurring_icon.ghost` if applicable

### Remove Assignment Button

**Positioning (lines 1187-1194):**
```scss
a.a_remove_assignment {
  position: absolute;
  z-index: 1000;
  color: black;
  top: -4px;
  right: -2px;
  padding: 0.2em 0.6em;
}
```

### Recurring Icons

**Assignment recurring lock (lines 1017-1040):**
```scss
.recurring_lock {
  cursor: pointer;
  color: #666 !important;
  position: absolute;
  left: -18px;    // Positioned to left of person name
  top: 0;
  
  &.ghost {
    opacity: 0.3;  // Semi-transparent when not active
  }
}
```

**Shift recurring icon (lines 1051-1071):**
```scss
.shift_recurring_icon {
  cursor: pointer;
  color: #666 !important;
  position: absolute;
  left: 0;       // Positioned at start of time container
  top: 0;
  
  &.ghost {
    opacity: 0.3;
  }
}
```

## TYPOGRAPHY AND FONTS

### Font Families
- **Headers/Headings**: `font-family: 'times'` (lines 121, 171, 226)
- **Body text**: Default system fonts
- **Menu items**: `font-family: 'times'` (line 121)

### Font Sizes
- **Shift cells**: `font-size: 14px` (line 808)
- **Day numbers**: `font-size: 20px` (line 565)
- **Year display**: `font-size: 26px` (line 558)
- **Month display**: `font-size: 24px` (line 552)
- **Day hours**: `font-size: 14px` (line 570)

### Font Weights
- **Headers**: `font-weight: normal` (line 225)
- **Menu tops**: `font-weight: bold` (line 110)

## SPACING AND LAYOUT MEASUREMENTS

### Padding and Margins
- **Shift container**: `padding: 0.5em 0` (line 921)
- **Shift name/person**: `padding: 0 5px` (lines 925-927)
- **Shift spacing**: `margin-top: 2px` (line 920)
- **Cell padding**: `padding: 1em 0` (lines 227, 809)

### Cell Heights
- **Shift cells**: Fixed `height: 7em` (line 807)
- **Time slot rows**: Variable based on content

### Positioning
- **Conflict notices**: `transform: translateX(-17px)` (line 1124)
- **Recurring locks**: `left: -18px` (line 1021)
- **Remove buttons**: `top: -4px; right: -2px` (lines 1191-1192)

## CHANGE TRACKING VISUAL INDICATORS

### Changed Items Highlighting
```scss
.changed {
  background-color: #FFF8BA;  // Light yellow highlight
  
  &.other {
    background-color: #dfdfdf;  // Gray for other user's changes
  }
}
```

### Copy Operation Visual Feedback
```scss
.shift, .shifts {
  &.copying {
    @include marching-ants-init(20px, 4px, 1s, 1);
    @include marching-ants-color(rgba(255, 255, 255, 0), darken(#d0ecff, 5%));
  }
}
```

## COLOR VARIABLES AND THEME

### Key Color Definitions (lines 4-9)
```scss
$highlight: #FFF8BA;    // Yellow highlight for changes
$today: #FFFADC;        // Light yellow for today column
$changed: #FFF8BA;      // Same as highlight
$other_changed: #dfdfdf; // Gray for other's changes
$link: #FFF8BA;         // Link highlight color
$popup: #d0ecff;        // Light blue for popups/modals
```

### Today Column Styling
```scss
.schedule-table th.today {
  background-color: lighten(#ff8d00, 40%);  // Light orange background
  color: #ff8d00;                           // Orange text
  font-weight: bold;
  letter-spacing: 1.2px;
}
```

## ASSIGNMENT MODAL STRUCTURE

### Modal Container (lines 592-653)
```scss
#popup {
  z-index: 101;
  top: 0;
  left: 0;
  padding: 0 2em 2em 2em;
  position: absolute;
  background-image: image-url('texture.png');
  background-color: lighten(#d0ecff, 5%);  // Light blue background
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  transition: opacity 300ms ease-in-out;
}
```

### Assignment List Structure
From `new_from_area.html.haml`:
```haml
#assign_shifts.from_area
  -prev_category = nil
  -i = 0
  -Person.categorized_on_day(@shift.date).each do |p|
    -category = p.category_on_date(@shift.date)
    -if category != prev_category
      %h5=category.name
    %div{style: "color: #{category.color}", class: "assign_shift#{conflict ? ' conflicting' : ''}" }
      =link_to p.display_name, assignments_path, class: 'type_selectable', data: {num: i, shift_id: @shift.id, person_id: p.id, for: 'area'}
```

### Category Grouping
- People grouped by category with `%h5` headers
- Each category gets a color-coded section
- Conflicts marked with `.conflicting` class

## JAVASCRIPT BEHAVIOR PATTERNS

### Keyboard Navigation (from scheduler.js.coffee)
- **Tab/Down**: Navigate to next person
- **Shift+Tab/Up**: Navigate to previous person  
- **Type-ahead**: Filter by typing person name
- **Space**: Select current person
- **Escape**: Close modal

### Hover Interactions
- Assignment hover shows conflict details
- Cell hover shows add/paste/hold buttons
- Person hover shows remove button

### AJAX Form Submissions
- Assignment creation via POST to `/assignments`
- Shift updates via PUT to `/shifts/[id]`
- Real-time UI updates without page refresh

## RESPONSIVE AND PRINT BEHAVIOR

### Print Styling
```scss
@media print {
  .schedule-table th, td {
    border: 2px solid black;  // Thicker borders for print
  }
  
  td.day_off:after {
    content: 'X';  // Show X for day off in print
  }
}
```

### Fixed Widths
- **Main table**: `width: 850px` (line 220)
- **Minimum content width**: `min-width: 900px` (line 56)
- **Column minimum**: `min-width: 100px` (line 224)

## DATA STRUCTURE PATTERNS

### Shift Data Structure (from JSON builders)
```javascript
{
  id: "uuid-string",
  st_sec: 28800,      // Start time in seconds
  ed_sec: 32400,      // End time in seconds  
  d_time: "8:00am - 9:00am",
  max_people: 2,
  recurring: false,
  changable: true,
  class: "changed fresh",
  people: [
    {
      name: "John Doe",
      color: "#FF0000",
      url: "/people/123",
      conflict: false,
      community_hours: false,
      soft_remove: false,
      recurring: false,
      assignment_id: 456
    }
  ],
  write_ins: [],
  empty_assignments: ["", ""]  // Array for unfilled slots
}
```

## IMPLEMENTATION NOTES FOR NEW SYSTEM

### Critical Visual Elements
1. **Exact color matching**: Use hex values from SCSS variables
2. **Typography**: Times font family for headers, 14px for content
3. **Spacing**: 7em cell height, 2px shift margins, 1em padding
4. **Icons**: FontAwesome icons for recurring, conflicts, remove
5. **Positioning**: Absolute positioning for overlays and controls

### Key Interactive Behaviors  
1. **Hover states**: Show/hide controls on mouse enter/leave
2. **Keyboard navigation**: Arrow keys, type-ahead, tab navigation
3. **Drag positioning**: Modal can be dragged by header
4. **Real-time updates**: AJAX form submissions update UI immediately

### Performance Considerations
- Fixed table width (850px) for consistent layout
- Minimal DOM manipulation during updates
- Efficient event delegation for hover behaviors
- Smart popup positioning with viewport bounds checking

This analysis provides the foundation for creating a pixel-perfect recreation of the Scheduler3 shift display functionality in the new React application.