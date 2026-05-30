---
name: visual-identity
description: Generate visual direction, color palette, typography, and UI component guide
department: brand
triggers: ["/startup-os brand"]
allowed-tools: [Read, Write, Bash]
reads:
  - brand/output/brand-brief-filled.md
  - brand/output/voice-and-tone-filled.md
writes:
  - brand/output/visual-identity-brief.md
---

## What this agent does

Reads brand brief and voice guidelines to understand personality and positioning, then uses Claude API to generate visual identity recommendations including moodboard direction, color palette with hex values, typography system, and UI component styling guide. Outputs to brand/output/visual-identity-brief.md.

## Instructions

1. Read brand/output/brand-brief-filled.md and brand/output/voice-and-tone-filled.md
2. Call Claude API to generate:
   - Moodboard direction (visual themes, reference brands, aesthetic keywords)
   - Color palette (primary, secondary, neutral colors with hex values and usage guidelines)
   - Typography recommendations (headings, body, monospace with font suggestions)
   - UI component guide (buttons, forms, cards, spacing, shadows, borders)
3. Format as structured markdown with specific values
4. Write to brand/output/visual-identity-brief.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateVisualIdentity() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  const brandOutputDir = join(projectRoot, 'brand', 'output')

  // Read brand brief and voice guide
  let brandBrief = ''
  let voiceAndTone = ''

  try {
    brandBrief = readFileSync(join(brandOutputDir, 'brand-brief-filled.md'), 'utf-8')
  } catch (err) {
    console.error('Error: brand-brief-filled.md not found. Run brand-brief agent first.')
    process.exit(1)
  }

  try {
    voiceAndTone = readFileSync(join(brandOutputDir, 'voice-and-tone-filled.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: voice-and-tone-filled.md not found. Continuing with brand brief only.')
  }

  const brandContext = `
# Brand Brief
${brandBrief}

# Voice and Tone
${voiceAndTone}
  `.trim()

  // Generate visual identity via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: `You are a visual identity designer. Based on this brand foundation:

${brandContext}

Generate a comprehensive visual identity brief with this structure:

# Visual Identity Brief

## Moodboard Direction

### Visual Themes
[Describe 3-4 key visual themes that capture the brand personality - e.g., "minimal yet warm", "technical but approachable", "bold and energetic"]

### Reference Brands
List 5 brands with visual styles that could inspire (can be from any industry):
- **[Brand Name]**: [What to borrow from their visual style]
- **[Brand Name]**: [What to borrow from their visual style]
- **[Brand Name]**: [What to borrow from their visual style]
- **[Brand Name]**: [What to borrow from their visual style]
- **[Brand Name]**: [What to borrow from their visual style]

### Aesthetic Keywords
[List 10-15 adjectives that describe the target aesthetic: e.g., clean, energetic, technical, friendly, bold, minimal, etc.]

## Color Palette

### Primary Colors

**Brand Primary**
- Hex: #[HEXCODE]
- Usage: Primary CTA buttons, key brand moments, headers
- Accessibility: Ensure WCAG AA contrast on white backgrounds

**Brand Secondary**
- Hex: #[HEXCODE]
- Usage: Accents, highlights, secondary actions
- Accessibility: [Note any contrast considerations]

### Supporting Colors

**Success**
- Hex: #[HEXCODE]
- Usage: Success states, confirmations, positive feedback

**Warning**
- Hex: #[HEXCODE]
- Usage: Warnings, caution states, non-critical alerts

**Error**
- Hex: #[HEXCODE]
- Usage: Error states, destructive actions, critical alerts

**Info**
- Hex: #[HEXCODE]
- Usage: Informational messages, neutral highlights

### Neutral Colors

**Gray 900 (Darkest)**
- Hex: #[HEXCODE]
- Usage: Primary text, headings

**Gray 700**
- Hex: #[HEXCODE]
- Usage: Secondary text, subheadings

**Gray 500**
- Hex: #[HEXCODE]
- Usage: Tertiary text, placeholders, disabled states

**Gray 300**
- Hex: #[HEXCODE]
- Usage: Borders, dividers

**Gray 100**
- Hex: #[HEXCODE]
- Usage: Subtle backgrounds, hover states

**Gray 50 (Lightest)**
- Hex: #[HEXCODE]
- Usage: Page backgrounds, cards

### Color Usage Guidelines
- [Guideline 1 about when to use primary vs secondary]
- [Guideline 2 about background/foreground relationships]
- [Guideline 3 about maintaining consistency]

## Typography System

### Heading Font
**Primary Choice**: [Font Name]
- **Style**: [e.g., "Geometric sans-serif, available on Google Fonts"]
- **Weights**: [e.g., "600 (Semibold), 700 (Bold)"]
- **Usage**: All headings (H1-H6), UI labels, navigation
- **Fallback**: [System font stack]

**Alternative**: [Font Name]
[Brief reason why this is a good alternative]

### Body Font
**Primary Choice**: [Font Name]
- **Style**: [e.g., "Humanist sans-serif with excellent readability"]
- **Weights**: [e.g., "400 (Regular), 500 (Medium), 600 (Semibold)"]
- **Usage**: Body copy, UI text, descriptions
- **Fallback**: [System font stack]

**Alternative**: [Font Name]
[Brief reason why this is a good alternative]

### Monospace Font (Optional)
**Primary Choice**: [Font Name]
- **Usage**: Code blocks, technical content, data tables
- **Fallback**: [System monospace stack]

### Type Scale
- **H1**: [Size]px / [Line height] - [Use case]
- **H2**: [Size]px / [Line height] - [Use case]
- **H3**: [Size]px / [Line height] - [Use case]
- **H4**: [Size]px / [Line height] - [Use case]
- **Body Large**: [Size]px / [Line height] - [Use case]
- **Body**: [Size]px / [Line height] - [Use case]
- **Body Small**: [Size]px / [Line height] - [Use case]
- **Caption**: [Size]px / [Line height] - [Use case]

## UI Component Guide

### Buttons

**Primary Button**
- Background: [Primary color hex]
- Text: [Color hex]
- Border radius: [Value]px
- Padding: [Vertical]px [Horizontal]px
- Font weight: [Value]
- Hover state: [Description]
- Active state: [Description]
- Disabled state: [Description]

**Secondary Button**
- Background: [Color/style]
- Border: [Width]px solid [color]
- Text: [Color hex]
- [Other properties]

**Ghost/Text Button**
- [Properties]

### Form Inputs

**Text Input**
- Border: [Width]px solid [color hex]
- Border radius: [Value]px
- Padding: [Values]
- Font size: [Value]px
- Focus state: [Description with color]
- Error state: [Description]
- Disabled state: [Description]

**Textarea**
- [Similar properties]

**Select/Dropdown**
- [Properties]

### Cards & Containers

**Card**
- Background: [Color hex]
- Border: [Style or "none"]
- Border radius: [Value]px
- Shadow: [CSS shadow value]
- Padding: [Value]px
- Hover state: [Description]

### Spacing System
- **xs**: [Value]px - [Use case]
- **sm**: [Value]px - [Use case]
- **md**: [Value]px - [Use case]
- **lg**: [Value]px - [Use case]
- **xl**: [Value]px - [Use case]
- **2xl**: [Value]px - [Use case]

### Elevation/Shadows
- **Level 1**: [CSS shadow value] - [Use case]
- **Level 2**: [CSS shadow value] - [Use case]
- **Level 3**: [CSS shadow value] - [Use case]

### Border Radius
- **sm**: [Value]px - [Use case]
- **md**: [Value]px - [Use case]
- **lg**: [Value]px - [Use case]
- **full**: [Value]px or 9999px - [Use case]

## Design Principles

1. **[Principle]**: [Description of how this guides visual decisions]
2. **[Principle]**: [Description]
3. **[Principle]**: [Description]
4. **[Principle]**: [Description]
5. **[Principle]**: [Description]

---

Ensure all recommendations are specific and actionable. Provide actual hex values and sizing. Make sure the visual identity authentically reflects the brand personality.`
      }
    ]
  })

  // Extract content from response
  let visualIdentity = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      visualIdentity += block.text + '\n'
    }
  }

  if (!visualIdentity.trim()) {
    visualIdentity = 'Failed to generate visual identity brief'
  }

  // Write output
  const outputDir = join(projectRoot, 'brand', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'visual-identity-brief.md')
  writeFileSync(outputPath, visualIdentity, 'utf-8')

  console.log(`Visual identity brief generated successfully: ${outputPath}`)
  console.log(`\nCovered: Moodboard direction, color palette, typography, UI components`)
}

generateVisualIdentity().catch(console.error)
```

## Output

Creates brand/output/visual-identity-brief.md with moodboard direction (themes, reference brands, keywords), complete color palette with hex values (primary, secondary, neutrals, status colors), typography system (heading/body/mono fonts with type scale), and UI component guide (buttons, forms, cards, spacing, shadows, borders). Success requires specific, actionable values (actual hex codes, font names, pixel sizes). Fails if brand brief is not available.
