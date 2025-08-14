# Schedule Grid Implementation Plan

## Overview
This document contains the detailed step-by-step plan to implement a pixel-perfect replica of the legacy schedule design in our React application.

## Visual Analysis of Legacy Design

### 1. Typography & Fonts
- **Primary Font**: Arial, Helvetica, sans-serif
- **Font Sizes**:
  - Title (area name): 24px
  - Shift times (bold): 14px  
  - Person names: 14px (normal weight)
  - Table headers (days/times): Default table text
  - Hour breakdown: 17pt
  - Schedule message: 13px (color: #999, bold)

### 2. Color Scheme
- **Background**: White (#FFFFFF)
- **Table borders**: Black (#000000) with 2px width
- **Person name colors**:
  - Links: #990099 (purple) or #FF0000 (red) 
  - Non-links: #000 with italic style
  - Hover state: #FFF8BA (light yellow)
- **Schedule message**: #999999
- **Day off cells**: #DDDDDD background

### 3. Layout Structure

#### Header Section
- Manager info on left (position: relative; top: -10px; left: 20px)
- Area name centered with "Schedule" below
- Effective dates centered below in smaller text

#### Table Structure
- Fixed width: 774px
- 8 columns (75px each for day columns)
- Border: 2px solid black
- Cell padding: 0
- Cell spacing: 0

### 4. Cell Layout & Spacing

#### Day Header Cells
- Center aligned
- Day name on first line
- Date on second line (e.g., "Monday<br>2/8")

#### Time Period Cells (Left Column)
- Width: 75px
- Height: 60px  
- Center aligned
- Labels: "Before Breakfast", "Morning", "Afternoon", "After Dinner"

#### Shift Cells
- Padding: 5px
- Center aligned
- Multiple shifts per cell with spacing

### 5. Shift Display Format

#### Individual Shift Structure
```html
<span class="shift" id="[shift-id]">
  <b>[time-range]</b><br>
  <span class="assignment">
    <span class="star" style="display:none">*</span>
    [person-name-or-link]<br>
  </span>
  [additional assignments...]
</span>
```

#### Shift Spacing
- First shift: no top padding
- Subsequent shifts: 20px top padding
- Shift text size: 14px

### 6. Person Name Display
- Linked persons: `<a>` tag with color styling
- Non-linked persons: `<span>` with italic style
- Star indicator: Hidden by default, positioned absolutely

### 7. Footer Section
- "Also" section for floating assignments
- Total hours display (left aligned)
- Hour breakdown (hidden by default, expandable)

## Implementation Steps

### Step 1: Update Grid Structure
- [ ] Create fixed-width table layout (774px)
- [ ] Set up 8-column structure with proper widths
- [ ] Apply 2px black borders to all cells
- [ ] Remove all modern styling/shadows

### Step 2: Header Implementation  
- [ ] Position manager info with exact offsets
- [ ] Center area name with 24px font
- [ ] Add "Schedule" text below area name
- [ ] Position effective dates

### Step 3: Day Headers
- [ ] Format as "DayName<br>M/D"
- [ ] Center align all text
- [ ] Apply consistent font sizing

### Step 4: Time Period Column
- [ ] Set 75px width, 60px height
- [ ] Center align labels
- [ ] Use exact label text from legacy

### Step 5: Shift Cell Styling
- [ ] Apply 5px padding
- [ ] Center align content
- [ ] Implement shift spacing (20px between shifts)

### Step 6: Shift Display Components
- [ ] Bold time ranges
- [ ] Line break after time
- [ ] Person names with proper colors/styles
- [ ] Hidden star indicators

### Step 7: Person Name Rendering
- [ ] Purple links (#990099) for most
- [ ] Red links (#FF0000) for some users
- [ ] Italic black text for non-linked names
- [ ] Hover state (#FFF8BA background)

### Step 8: Footer Elements
- [ ] "Also" section with floating assignments
- [ ] Total hours display
- [ ] Expandable hour breakdown

### Step 9: Print Styles
- [ ] Hide .no_print elements
- [ ] Adjust positioning for print layout
- [ ] Ensure proper page breaks

### Step 10: Final Polish
- [ ] Remove all modern UI elements (badges, pills, etc.)
- [ ] Ensure exact spacing matches
- [ ] Test hover states
- [ ] Validate against example HTML

## CSS Classes to Implement

```css
.shift - Block display with conditional padding
.assignment - Relative positioning for names
.star - Absolute positioned, usually hidden
.title - 24px font size
.schedule_message - 13px, #999, bold
.dayoff_bg - #DDDDDD background
```

## Key Differences from Current Implementation
1. Remove all rounded corners and modern styling
2. Use table-based layout instead of CSS Grid
3. No badges or pill-style elements
4. Simpler, more compact shift display
5. Traditional HTML table structure
6. Inline styles for specific elements

## Testing Checklist
- [ ] Visual comparison with example_schedule/page.html
- [ ] All fonts match exactly
- [ ] Colors are pixel-perfect
- [ ] Spacing between elements matches
- [ ] Hover states work correctly
- [ ] Print layout works properly
- [ ] All text is properly aligned