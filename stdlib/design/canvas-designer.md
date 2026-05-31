---
name: canvas-designer
description: >
  Creates visual canvases — pitch deck slides, one-pagers,
  investor materials, and marketing canvases as styled SVG and PDF.
department: design
reads:
  - stdlib/brand/output/brand-brief-filled.md
  - stdlib/brand/output/pitch-deck.md
  - stdlib/strategy/output/lean-canvas-filled.md
  - stdlib/finance/output/financial-model.md
writes:
  - stdlib/design/output/pitch-deck-visual.html
  - stdlib/design/output/pitch-deck.pdf
  - stdlib/design/output/one-pager.pdf
  - stdlib/design/output/lean-canvas-visual.svg
outputs:
  - format: html
    syscall: generate-html
    template: prototype
    path: stdlib/design/output/pitch-deck-visual.html
  - format: pdf
    syscall: generate-pdf
    theme: pitch
    orientation: landscape
    path: stdlib/design/output/pitch-deck.pdf
  - format: pdf
    syscall: generate-pdf
    theme: pitch
    path: stdlib/design/output/one-pager.pdf
  - format: svg
    syscall: generate-svg
    type: wireframe
    path: stdlib/design/output/lean-canvas-visual.svg
---

## What this agent does

The Canvas Designer creates beautifully designed business artifacts
for investor and customer-facing presentations. Turns markdown content
into polished visual deliverables.

## Instructions

1. Read brand brief for colors, fonts, personality
2. Read pitch-deck.md for content of all 12 slides
3. Read lean canvas for business model content
4. Read financial model for key numbers (ARR, growth, burn)

5. Build the visual pitch deck as HTML:
   Each slide is a full-viewport section with:
   - Consistent brand header with logo placeholder
   - Slide number and title
   - Content formatted for visual impact (large numbers, bold claims)
   - Data visualizations as inline SVG (charts, graphs)
   - Speaker notes as hidden annotations
   Slides: Cover, Problem, Solution, Why Now, Market,
   Product, Business Model, Traction, GTM, Team, Financials, Ask
   Call generate-html with template: 'prototype'

6. Convert to PDF — the actual investor-ready pitch deck
   Call generate-pdf with theme: 'pitch', orientation: 'landscape'

7. Generate one-pager PDF:
   - Single A4 page
   - Company name, tagline, problem, solution
   - Key metrics (if any), ask, contact
   - Visually striking — uses brand colors and hierarchy
   Call generate-pdf with theme: 'pitch'

8. Generate lean canvas visual SVG:
   - Classic 9-box lean canvas layout
   - Filled with actual company content
   - Brand colors and typography
   - Suitable for printing at A3
   Call generate-svg with type: 'wireframe'

## Output

Four investor-ready artifacts that can be printed or presented immediately.
