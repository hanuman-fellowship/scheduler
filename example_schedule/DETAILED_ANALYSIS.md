# Detailed Analysis of Legacy Schedule Structure

## Critical Issues Found in Current Implementation

### 1. **Table Structure Problems**
- **Missing border on cells**: Each `<td>` needs `bordercolor="#000000"` attribute
- **Missing internal borders**: Individual cells need proper borders to create the grid effect
- **Wrong table attributes**: Using React props instead of HTML table attributes

### 2. **Font Issues**
- **Missing Arial font**: Table cells need `font-family: Arial, Helvetica, sans-serif`
- **Wrong font sizes**: Using default browser fonts instead of 14px

### 3. **Cell Structure Issues**
- **Missing div.shift wrapper**: Each cell should have `<div align="center" class="shift">`
- **Wrong padding**: div.shift has `padding: 5px` from CSS
- **Missing proper p tags**: Content wrapped in `<p>` tags

### 4. **Shift Display Issues**
- **Wrong span structure**: Using `span.shift` but missing proper nesting
- **Missing first-child exception**: `span.shift:first-child` has `padding-top: 0px`
- **Wrong spacing**: Subsequent shifts need `padding-top: 20px`

### 5. **Person Name Styling Issues**
- **Missing color classes**: Need `color:#990099` for links, `color:#000;font-style:italic` for non-links
- **Missing star positioning**: Stars need `position:absolute; left:-2px` or `left:-11px`
- **Missing assignment wrapper**: Each person wrapped in `span.assignment`

## Exact Structure Required

### Table Structure
```html
<table width="774" border="2" align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td width="75" bordercolor="#000000">
      <div align="center" class="no_print"></div>
    </td>
    <td width="75" bordercolor="#000000">
      <div align="center">
        <p>Monday<br>2/8</p>
      </div>
    </td>
    <!-- ... more day headers -->
  </tr>
  <tr>
    <td width="75" height="60" bordercolor="#000000">
      <div align="center">
        <p>Before Breakfast</p>
      </div>
    </td>
    <td>
      <div align="center" class="shift">
        <p>
          <span class="shift" id="5686">
            <b>5:30 - 8</b><br>
            <span style="position:relative" class="assignment">
              <span class="star" style="display:none">*</span>
              <span style="color:#000;font-style:italic" title="View Kalpana's Schedule">Kalpana</span><br>
            </span>
          </span>
          <span class="shift" id="5595">
            <b>8:30 - 10</b><br>
            <span style="position:relative" class="assignment">
              <span class="star" style="display:none">*</span>
              <a href='#' style='color:#990099' title='View Anne\'s Schedule'>Anne</a><br>
            </span>
          </span>
        </p>
      </div>
    </td>
    <!-- ... more cells -->
  </tr>
</table>
```

### CSS Requirements
```css
/* CRITICAL: Must apply these exactly */
div.shift {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  padding: 5px;
}

span.shift {
  display: block;
  padding-top: 20px;
}

span.shift:first-child {
  padding-top: 0px;
}

span.assignment {
  position: relative;
}

.star {
  position: absolute;
  left: -2px;
  font-size: 13pt;
}

span.star {
  left: -11px;
}
```

## Implementation Plan

### Step 1: Fix Table HTML Structure
- Add `bordercolor="#000000"` to ALL `<td>` elements
- Use correct HTML attributes: `width="75"` not `width={75}`
- Add `border="2"` and `align="center"` to table

### Step 2: Fix Cell Content Structure
- Wrap cell content in `<div align="center" class="shift">`
- Wrap shift content in `<p>` tags
- Apply exact span nesting structure

### Step 3: Fix CSS Classes and Styling
- Ensure `div.shift` has proper padding and font
- Fix `span.shift` spacing rules
- Implement exact star positioning
- Apply correct link colors

### Step 4: Fix Shift Content Rendering
- Use exact `<span class="shift" id="...">` structure
- Bold time ranges with `<b>` tags
- Wrap each person in `<span class="assignment">`
- Apply star indicators with proper positioning

### Step 5: Test and Verify
- Compare pixel-by-pixel with example
- Check font rendering
- Verify border display
- Test hover effects