---
name: generate-svg
description: Generates SVG files for design systems, icons, logos, wireframes
syscall: true
returns: filepath (string)
---

## What this syscall does

Generates production-quality SVG files using AI assistance for design
artifacts. Used by design department for visual assets that need to be
vector-based and editable.

## TypeScript

```typescript
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import Anthropic from '@anthropic-ai/sdk'

export type SVGType =
  | 'design-tokens'
  | 'wireframe'
  | 'user-flow'
  | 'icon-set'
  | 'logo-concept'
  | 'component-library'

export async function generateSVG(
  client: Anthropic,
  description: string,
  outputDir: string,
  filename: string,
  svgType: SVGType = 'wireframe'
): Promise<string> {
  mkdirSync(outputDir, { recursive: true })
  const outputPath = join(outputDir, `${filename}.svg`)

  const typeInstructions: Record<SVGType, string> = {
    'design-tokens': `Generate an SVG design token reference sheet showing:
      - Color palette swatches with hex values and token names
      - Typography scale (H1-H6, body, caption, code)
      - Spacing scale (4px grid from 4 to 64px)
      - Border radius tokens
      - Shadow tokens
      Size: 1200x900px. Clean grid layout. Brand colors from profile.`,
    'wireframe': `Generate an SVG wireframe showing the key screens of this product.
      Use grayscale only. Show: nav, hero/main content, key interactions.
      Include annotation callouts for important UX decisions.
      Size: 1440x900px per screen, stack vertically.`,
    'user-flow': `Generate an SVG user flow diagram showing the complete user journey
      from awareness through activation, key decision points, happy path and
      error states. Use boxes for screens, diamonds for decisions, arrows for flow.
      Size: 1600x900px. Left to right flow.`,
    'icon-set': `Generate an SVG icon set with 24 icons relevant to this product.
      Each icon: 24x24px, 2px stroke, rounded line caps, consistent visual weight.
      Show in a 6x4 grid with labels. Export as individual symbols.
      Size: 900x600px total.`,
    'logo-concept': `Generate 3 SVG logo concepts for this company. Each concept:
      wordmark version and icon-only version. Show on light and dark backgrounds.
      Keep it abstract and vector-safe. Size: 800x400px per concept.`,
    'component-library': `Generate an SVG component library reference showing:
      Buttons (primary, secondary, ghost, disabled), inputs (default, focus, error),
      cards, badges, alerts, navigation elements. Size: 1200x1600px.`
  }

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 8096,
    system: `You are an expert SVG engineer and product designer.
Generate production-quality SVG code. Return ONLY valid SVG markup
starting with <svg. No explanation, no markdown fences.
Use semantic IDs and classes. Ensure it renders in all browsers.`,
    messages: [{
      role: 'user',
      content: `${typeInstructions[svgType]}

Company/product context: ${description}

Return valid SVG only.`
    }]
  })

  const block = response.content[0]
  if (block?.type !== 'text') throw new Error('No SVG content returned')
  const svg = block.text.trim()
  if (!svg.startsWith('<svg')) throw new Error('Response is not valid SVG')

  writeFileSync(outputPath, svg, 'utf-8')
  return outputPath
}
```

## Usage Example

```typescript
const svgPath = await generateSVG(
  anthropicClient,
  'B2B SaaS product for team collaboration',
  'stdlib/design/output',
  'user-flow',
  'user-flow'
)
```
