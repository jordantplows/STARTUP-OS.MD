---
name: ui-designer
description: >
  Generates a complete UI design system and working HTML prototype
  for the product. Produces three outputs: a design token SVG sheet,
  a working HTML component library, and a styled PDF spec document.
department: design
triggers: [/startup-os run design ui-designer]
allowed-tools: [Read, Write, Bash]
reads:
  - stdlib/brand/output/brand-brief-filled.md
  - stdlib/brand/output/visual-identity-brief.md
  - stdlib/product/output/personas-filled.md
  - stdlib/product/output/mvp-definition.md
writes:
  - stdlib/design/output/ui-design-tokens.svg
  - stdlib/design/output/ui-component-library.html
  - stdlib/design/output/ui-design-spec.pdf
outputs:
  - format: svg
    syscall: generate-svg
    type: design-tokens
    path: stdlib/design/output/ui-design-tokens.svg
  - format: html
    syscall: generate-html
    template: design-system
    path: stdlib/design/output/ui-component-library.html
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/design/output/ui-design-spec.pdf
---

## What this agent does

The UI Designer agent reads the brand brief and visual identity
direction and produces a complete, working UI design system
specific to the startup. It generates real files a developer can
use immediately — not just descriptions.

## Instructions

1. Read brand-brief-filled.md — extract: primary color, font choices,
   personality adjectives, brand promise
2. Read visual-identity-brief.md — extract: color palette with hex
   values, typography scale, component style (radius, shadows, spacing)
3. Read personas-filled.md — understand who uses the product and
   what accessibility or device constraints apply
4. Read mvp-definition.md — understand which UI surfaces exist

5. Call generate-svg with type: 'design-tokens' — produces the
   visual token reference sheet

6. Build the HTML component library including:
   - CSS custom properties for all design tokens
   - Typography: H1–H6, body, caption, mono, with samples
   - Color system: primary, secondary, accent, neutrals, semantic
     (success, warning, error, info)
   - Spacing scale: 4px base grid, tokens from 4px to 64px
   - Components: Button (5 variants), Input (4 states), Select,
     Checkbox, Radio, Toggle, Badge, Tag, Alert, Card, Modal shell,
     Nav bar, Sidebar, Data table, Pagination, Loading spinner,
     Toast notification, Tooltip, Avatar, Progress bar
   - Each component shows: default, hover, focus, disabled states
   - Dark mode variants for all components
   - Annotation showing which design token maps to which property
   Call generate-html with template: 'design-system'

7. Generate the PDF spec doc including:
   - Cover: company name, "UI Design System v1.0", date
   - Section 1: Design principles (3-5 principles derived from brand)
   - Section 2: Color system with usage rules
   - Section 3: Typography system with hierarchy rules
   - Section 4: Component inventory with usage guidelines
   - Section 5: Accessibility requirements (WCAG AA checklist)
   - Section 6: Responsive breakpoints and grid system
   Call generate-pdf with theme: 'report'

## Output

Three files written to stdlib/design/output/:
- ui-design-tokens.svg — visual reference for all tokens
- ui-component-library.html — live component library, opens in browser
- ui-design-spec.pdf — PDF documentation for handoff
