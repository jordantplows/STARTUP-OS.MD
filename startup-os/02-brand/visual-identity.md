# Visual Identity Guide

## Overview

This document defines the complete visual identity system for [COMPANY_NAME], ensuring consistent brand representation across all touchpoints. The visual identity translates our brand strategy into tangible design elements that create recognition, build trust, and communicate our values.

**Status:** [Draft / In Review / Approved]  
**Last Updated:** [DATE]  
**Owner:** [DESIGN_LEAD_NAME]  
**Stakeholders:** [MARKETING_LEAD, PRODUCT_LEAD, CEO]

---

## Logo System

### Primary Logo

**Usage:** Default logo for most applications including website headers, business cards, presentations, and product interfaces.

- **File Formats:** SVG (web), PNG (high-res), PDF (print), EPS (professional)
- **Minimum Size:** 32px height (digital), 0.5 inches height (print)
- **Clear Space:** Minimum clear space of [X] times the height of the logo on all sides
- **Color Versions:** Full color, single color, white, black

**Files Location:** [PLACEHOLDER: /assets/logos/primary/]

### Secondary Logo / Icon

**Usage:** Small spaces, favicons, app icons, social media profile images.

- **File Formats:** SVG, PNG (16px, 32px, 64px, 128px, 256px, 512px, 1024px)
- **Minimum Size:** 16px (digital)
- **Variations:** Square, circular, transparent background

**Files Location:** [PLACEHOLDER: /assets/logos/icon/]

### Logo Variations

| Variation | Use Case | Background Requirements |
|-----------|----------|------------------------|
| Full Color | Primary use on light backgrounds | White or light colors |
| Reversed | Dark backgrounds, photography | Dark colors, minimum 70% contrast |
| Monochrome Black | Print materials, minimalist applications | Light backgrounds |
| Monochrome White | Dark UI, reversed applications | Dark backgrounds |
| Single Color | Brand color limitations, specialty printing | [SPECIFY] |

### Logo Misuse

**Do Not:**
- Stretch, skew, or distort the logo proportions
- Rotate the logo at any angle
- Apply drop shadows, outlines, or effects
- Place on busy backgrounds that reduce legibility
- Recreate or modify logo typography or iconography
- Use unapproved color combinations
- Place within minimum clear space of other elements

---

## Color Palette

### Primary Colors

**[PRIMARY_COLOR_NAME]**
- **Hex:** [#XXXXXX]
- **RGB:** [R, G, B]
- **CMYK:** [C, M, Y, K]
- **Pantone:** [PMS XXXX]
- **Usage:** Primary brand color for key actions, headers, logo
- **Accessibility:** WCAG AA compliant at [CONTRAST_RATIO] on white

**[SECONDARY_COLOR_NAME]**
- **Hex:** [#XXXXXX]
- **RGB:** [R, G, B]
- **CMYK:** [C, M, Y, K]
- **Pantone:** [PMS XXXX]
- **Usage:** Secondary brand accent, supporting elements
- **Accessibility:** WCAG AA compliant at [CONTRAST_RATIO] on white

### Secondary Colors

**[ACCENT_COLOR_1_NAME]**
- **Hex:** [#XXXXXX]
- **RGB:** [R, G, B]
- **Usage:** Call-to-action buttons, highlights, emphasis

**[ACCENT_COLOR_2_NAME]**
- **Hex:** [#XXXXXX]
- **RGB:** [R, G, B]
- **Usage:** Secondary actions, links, interactive elements

**[ACCENT_COLOR_3_NAME]**
- **Hex:** [#XXXXXX]
- **RGB:** [R, G, B]
- **Usage:** [SPECIFY_USAGE]

### Neutral Palette

| Color Name | Hex | Usage |
|------------|-----|-------|
| Text Primary | [#XXXXXX] | Body text, headlines |
| Text Secondary | [#XXXXXX] | Supporting text, captions |
| Background Light | [#XXXXXX] | Page backgrounds, cards |
| Background Dark | [#XXXXXX] | Dark mode, reversed sections |
| Border | [#XXXXXX] | Dividers, input borders |
| Disabled | [#XXXXXX] | Disabled states |

### Functional Colors

**Success:** [#XXXXXX] - Confirmations, success messages  
**Warning:** [#XXXXXX] - Warnings, cautionary messages  
**Error:** [#XXXXXX] - Errors, destructive actions  
**Info:** [#XXXXXX] - Informational messages, tooltips

### Color Usage Guidelines

- **70-20-10 Rule:** 70% neutral, 20% primary brand color, 10% accent colors
- **Accessibility:** All text must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- **Dark Mode:** Define reversed color palette with adjusted luminance
- **Gradients:** [ALLOW/RESTRICT] - If allowed, specify approved gradient combinations

---

## Typography

### Primary Typeface

**[TYPEFACE_NAME]**
- **Foundry:** [FOUNDRY_NAME]
- **License:** [LICENSE_TYPE]
- **Usage:** Headlines, user interface, marketing materials
- **Weights Available:** [100, 300, 400, 500, 700, 900]
- **Web Font:** [GOOGLE_FONTS / ADOBE_FONTS / SELF_HOSTED]
- **Fallback Stack:** `[TYPEFACE], -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

**Style Guidelines:**
- **H1:** [SIZE]px / [LINE_HEIGHT], [WEIGHT], [LETTER_SPACING]
- **H2:** [SIZE]px / [LINE_HEIGHT], [WEIGHT], [LETTER_SPACING]
- **H3:** [SIZE]px / [LINE_HEIGHT], [WEIGHT], [LETTER_SPACING]
- **H4:** [SIZE]px / [LINE_HEIGHT], [WEIGHT], [LETTER_SPACING]
- **Body Large:** [SIZE]px / [LINE_HEIGHT], [WEIGHT]
- **Body Regular:** [SIZE]px / [LINE_HEIGHT], [WEIGHT]
- **Body Small:** [SIZE]px / [LINE_HEIGHT], [WEIGHT]
- **Caption:** [SIZE]px / [LINE_HEIGHT], [WEIGHT]

### Secondary Typeface (Optional)

**[TYPEFACE_NAME]**
- **Foundry:** [FOUNDRY_NAME]
- **Usage:** [Long-form content, special emphasis, data displays]
- **Weights Available:** [SPECIFY]
- **Fallback Stack:** [SPECIFY]

### Monospace Typeface

**[TYPEFACE_NAME]**
- **Usage:** Code snippets, technical documentation, data tables
- **Weights Available:** [SPECIFY]
- **Fallback Stack:** `[TYPEFACE], 'Courier New', monospace`

### Typography Principles

- **Hierarchy:** Use size, weight, and spacing to create clear hierarchy
- **Readability:** Maintain 45-75 characters per line for optimal readability
- **Line Height:** 1.4-1.6 for body text, 1.1-1.3 for headlines
- **Paragraph Spacing:** [SPECIFY] between paragraphs
- **Alignment:** [Left-aligned for Western languages / SPECIFY]

---

## Iconography

### Icon Style

**Style:** [Outlined / Filled / Dual-tone / Custom]  
**Stroke Width:** [2px standard]  
**Corner Radius:** [Sharp / Rounded at Xpx]  
**Grid System:** [24x24px base with 2px padding]  
**Alignment:** Pixel-perfect on whole pixels

### Icon Library

**Source:** [Material Icons / Feather Icons / Heroicons / Custom Library]  
**Size Options:** 16px, 20px, 24px, 32px, 48px  
**Colors:** Inherit from text color or use brand colors for emphasis

### Custom Icon Guidelines

When creating custom icons:
- Follow established stroke width and corner radius
- Maintain consistent visual weight across icon set
- Design on [24x24px / 32x32px] grid with [2px] safe area
- Export as SVG with clean paths
- Ensure legibility at smallest size (16px)

**Custom Icon Location:** [PLACEHOLDER: /assets/icons/custom/]

---

## Imagery

### Photography Style

**Aesthetic:** [Authentic / Professional / Lifestyle / Documentary / Abstract]  
**Tone:** [Warm / Cool / Neutral / High-contrast]  
**Composition:** [SPECIFY preferred compositions]

**Subject Matter:**
- [PLACEHOLDER: Real people in authentic situations]
- [PLACEHOLDER: Products in use, lifestyle contexts]
- [PLACEHOLDER: Environments that reflect brand values]

**Avoid:**
- Generic stock photography with artificial poses
- Overly retouched or filtered images
- Cliched business imagery (handshakes, generic office settings)
- [SPECIFY other restrictions]

### Image Treatment

**Color Overlay:** [YES/NO] - If yes, specify overlay color and opacity  
**Filters:** [SPECIFY approved filters or state "None"]  
**Aspect Ratios:**
- Hero images: [16:9 / 21:9]
- Product images: [1:1 / 4:3]
- Portraits: [3:4 / 4:5]
- Thumbnails: [1:1 / 16:9]

### Illustration Style

**Style:** [Flat / Geometric / Hand-drawn / 3D / Isometric / None]  
**Color Palette:** Use brand colors with [SPECIFY tints/shades]  
**Line Weight:** [SPECIFY]  
**Application:** [Feature illustrations, empty states, error pages, marketing materials]

**Illustration Location:** [PLACEHOLDER: /assets/illustrations/]

---

## Graphic Elements

### Patterns

**Primary Pattern:**
- **Description:** [PLACEHOLDER: Geometric pattern based on logo element]
- **Usage:** Backgrounds, texture, brand moments
- **Scale Options:** [Small, Medium, Large]
- **Opacity:** [10-20% for subtle backgrounds]

### Shapes

**Approved Shapes:**
- [Circles, squares, rounded rectangles]
- **Corner Radius Standard:** [8px / 16px / Custom]
- **Usage:** Cards, buttons, containers, decorative elements

### Textures

**Approved Textures:** [Subtle grain / Paper texture / None]  
**Application:** [Backgrounds only at low opacity]

### Data Visualization

**Chart Types:** [Bar, line, pie, donut, area, scatter]  
**Color Assignment:**
- Single dataset: Use primary brand color with tints
- Multiple datasets: Use ordered color palette [SPECIFY order]
- Sequential data: Use monochromatic scale
- Diverging data: Use contrasting colors from palette

**Grid Lines:** [Light gray, subtle]  
**Labels:** Use primary typeface, [SIZE]px, [COLOR]

---

## Layout & Spacing

### Grid System

**Desktop:** [12-column grid]  
**Tablet:** [8-column grid]  
**Mobile:** [4-column grid]  
**Gutter:** [24px / 32px]  
**Margins:** [SPECIFY responsive margins]

### Spacing Scale

Use consistent spacing based on [8px / 4px] base unit:

| Token | Value | Usage |
|-------|-------|-------|
| xs | [4px] | Tight spacing, icon padding |
| sm | [8px] | Related elements |
| md | [16px] | Component internal spacing |
| lg | [24px] | Component spacing |
| xl | [32px] | Section spacing |
| 2xl | [48px] | Large section breaks |
| 3xl | [64px] | Major page sections |

### Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** 1024px - 1440px
- **Large Desktop:** > 1440px

---

## UI Components

### Buttons

**Primary Button:**
- Background: [PRIMARY_COLOR]
- Text: [WHITE / CONTRAST_COLOR]
- Border Radius: [8px]
- Padding: [12px 24px]
- Font Size: [16px]
- Font Weight: [600]
- Hover State: [DARKEN 10% / SPECIFY]
- Active State: [DARKEN 15% / SPECIFY]
- Disabled State: [OPACITY 40%]

**Secondary Button:**
- Background: [TRANSPARENT]
- Text: [PRIMARY_COLOR]
- Border: [2px solid PRIMARY_COLOR]
- [SPECIFY other properties]

**Tertiary Button:**
- Background: [TRANSPARENT]
- Text: [PRIMARY_COLOR]
- Border: [NONE]
- Hover: [UNDERLINE / BACKGROUND]

### Form Elements

**Input Fields:**
- Border: [1px solid BORDER_COLOR]
- Border Radius: [8px]
- Padding: [12px 16px]
- Font Size: [16px]
- Focus State: [Border color PRIMARY_COLOR, 2px]
- Error State: [Border color ERROR_COLOR]

**Checkboxes & Radio Buttons:**
- Size: [20px]
- Border: [2px solid BORDER_COLOR]
- Checked: [PRIMARY_COLOR background]
- Border Radius: [4px for checkbox, 50% for radio]

### Cards

- Background: [WHITE / BACKGROUND_LIGHT]
- Border: [1px solid BORDER_COLOR / NONE]
- Border Radius: [12px]
- Shadow: [SPECIFY box-shadow]
- Padding: [24px]
- Hover State: [SPECIFY elevation or border change]

### Navigation

**Primary Navigation:**
- Typography: [TYPEFACE, SIZE, WEIGHT]
- Color: [TEXT_PRIMARY]
- Active State: [PRIMARY_COLOR / UNDERLINE]
- Hover State: [SPECIFY]

**Mobile Navigation:**
- Menu Icon: [Hamburger / Custom]
- Animation: [Slide / Fade / None]
- Overlay: [DARK with opacity]

---

## Motion & Animation

### Animation Principles

- **Purpose:** Animations should provide feedback, guide attention, or communicate relationships
- **Duration:** 
  - Micro-interactions: 150-200ms
  - Transitions: 250-400ms
  - Complex animations: 400-600ms
- **Easing:** [ease-in-out / cubic-bezier(0.4, 0.0, 0.2, 1)]

### Common Animations

**Fade In:** 
```
opacity: 0 → 1
duration: 200ms
easing: ease-in
```

**Slide In:**
```
transform: translateY(20px) → translateY(0)
opacity: 0 → 1
duration: 300ms
easing: ease-out
```

**Hover States:**
```
duration: 150ms
easing: ease-in-out
```

**Page Transitions:**
```
duration: 400ms
easing: [SPECIFY]
```

### Animation Guidelines

- Keep animations subtle and purposeful
- Respect `prefers-reduced-motion` for accessibility
- Avoid animations longer than 600ms
- Test performance on lower-end devices

---

## Brand Applications

### Website

**Header:** 
- Height: [64px desktop, 56px mobile]
- Background: [WHITE / TRANSPARENT with backdrop blur]
- Logo position: [LEFT]
- Navigation position: [RIGHT]

**Footer:**
- Background: [DARK / LIGHT]
- Layout: [4-column / SPECIFY]
- Social icons: [SIZE, COLOR]

**Hero Section:**
- Height: [Viewport height / 600px / SPECIFY]
- Background: [Gradient / Image / Solid color]
- Text alignment: [LEFT / CENTER]

### Social Media

**Profile Images:**
- Size: 400x400px minimum
- Use: Icon version of logo, centered

**Cover Images:**
- Facebook: 820x312px
- Twitter/X: 1500x500px
- LinkedIn: 1584x396px

**Post Templates:**
- Instagram: 1080x1080px (square), 1080x1350px (portrait)
- Twitter/X: 1200x675px
- LinkedIn: 1200x627px

### Print Materials

**Business Cards:**
- Size: [3.5" x 2" standard US / 85mm x 55mm international]
- Orientation: [Horizontal / Vertical]
- Print: [Single-sided / Double-sided]
- Finish: [Matte / Glossy / Uncoated]

**Letterhead:**
- Size: [8.5" x 11" / A4]
- Logo placement: [TOP LEFT / TOP CENTER]
- Contact info placement: [HEADER / FOOTER]

**Marketing Collateral:**
- Flyers: [SPECIFY sizes]
- Brochures: [SPECIFY fold type and size]
- Banners: [SPECIFY standard sizes]

### Presentations

**Slide Dimensions:** [16:9 / 4:3]  
**Template Structure:**
- Title slide: [Logo, title, subtitle, presenter info]
- Content slides: [Header, body, footer with page numbers]
- Section dividers: [SPECIFY design]

**Presentation Location:** [PLACEHOLDER: /assets/templates/presentations/]

### Email Signatures

**Format:**
```
[FIRST_NAME] [LAST_NAME]
[JOB_TITLE]
[COMPANY_NAME]
[PHONE] | [EMAIL]
[WEBSITE]
```

**Styling:**
- Font: [TYPEFACE, 12px]
- Colors: Text [COLOR], Links [PRIMARY_COLOR]
- Logo: [Include/Exclude] - If included, max 150px width

---

## Accessibility Standards

### WCAG Compliance

**Target Level:** [AA / AAA]

**Requirements:**
- Color contrast ratios meet WCAG standards
- Text alternatives for all images
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators visible and clear
- Motion respects user preferences

### Color Contrast

All text must meet minimum contrast ratios:
- Normal text (< 18px): 4.5:1
- Large text (≥ 18px or 14px bold): 3:1
- UI components and graphics: 3:1

**Testing Tools:** [SPECIFY preferred tools]

---

## Asset Management

### File Naming Conventions

**Format:** `[category]-[name]-[variation]-[size].[extension]`

**Examples:**
- `logo-primary-color-large.svg`
- `icon-user-outline-24px.svg`
- `photo-hero-homepage-1920x1080.jpg`

### File Organization

```
/brand-assets/
  /logos/
    /primary/
    /icon/
    /variations/
  /colors/
    /swatches/
    /palettes/
  /typography/
    /fonts/
    /specimens/
  /icons/
    /system/
    /custom/
  /images/
    /photography/
    /illustrations/
  /templates/
    /presentations/
    /documents/
    /social-media/
  /guidelines/
```

**Location:** [PLACEHOLDER: Cloud storage link or repository path]

### Version Control

- All brand assets should be version controlled
- Major revisions documented in changelog
- Previous versions archived but accessible
- Current version clearly marked

---

## Brand Guardian

**Primary Contact:** [NAME, TITLE, EMAIL]  
**Review Process:** [SPECIFY approval process for brand applications]  
**Questions:** [SPECIFY how team members request guidance]

### Approval Requirements

Requires brand approval:
- New marketing materials
- Website redesigns or major updates
- Product packaging
- Third-party partnerships using brand assets
- Event signage and collateral

Does not require approval:
- Internal documents
- [SPECIFY other exceptions]

---

## Resources

### Design Tools

**Preferred Software:**
- Design: [Figma / Adobe XD / Sketch]
- Image Editing: [Adobe Photoshop / Affinity Photo]
- Vector Graphics: [Adobe Illustrator / Affinity Designer]
- Prototyping: [Figma / Framer]

### Figma Resources

**Library Link:** [PLACEHOLDER: Figma library URL]  
**Components:** Buttons, forms, navigation, cards, modals  
**Styles:** Colors, typography, effects, grids

### Brand Asset Downloads

**Public Assets:** [PLACEHOLDER: Link to public brand kit]  
**Internal Assets:** [PLACEHOLDER: Link to full asset library]  
**Password Protected:** [YES/NO]

### Design System

**Documentation:** [PLACEHOLDER: Link to design system documentation]  
**Storybook:** [PLACEHOLDER: Link to component library]  
**Code Repository:** [PLACEHOLDER: GitHub/GitLab link]

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | [DATE] | [AUTHOR] | Initial draft |
| [VERSION] | [DATE] | [AUTHOR] | [CHANGES] |

---

## Next Steps

### 1. Finalize Color Palette (Due: 2026-06-05)
- Conduct accessibility audit on proposed color combinations
- Test colors across devices and in different lighting conditions
- Document Pantone equivalents for print applications
- Create color swatches and export for design tools

### 2. Complete Typography System (Due: 2026-06-12)
- License and acquire necessary typeface weights
- Create type specimens showing all styles in context
- Set up web fonts with fallback loading strategy
- Document responsive typography scales for all breakpoints

### 3. Build Component Library (Due: 2026-06-19)
- Design and document all UI components in Figma
- Create coded components with accessibility built-in
- Set up Storybook or similar documentation system
- Conduct internal review with product and engineering teams

---

**Document Status:** Living document - review quarterly or when significant brand changes occur.
