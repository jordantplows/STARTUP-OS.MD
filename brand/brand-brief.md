---
name: brand-brief
description: Generate brand purpose, vision, mission, values, personality, and positioning
department: brand
triggers: ["/startup-os brand"]
allowed-tools: [Read, Write, Bash]
reads:
  - strategy/output/idea-canvas.md
  - strategy/output/lean-canvas.md
  - strategy/output/market-research.md
  - strategy/output/competitor-analysis.md
writes:
  - brand/output/brand-brief-filled.md
---

## What this agent does

Reads all strategy outputs to understand the business foundation, then uses Claude API to generate a comprehensive brand brief including purpose, vision, mission, 5 core values, brand personality traits, and positioning statement. Outputs to brand/output/brand-brief-filled.md.

## Instructions

1. Read all strategy output files (idea-canvas.md, lean-canvas.md, market-research.md, competitor-analysis.md)
2. Synthesize the business strategy into a cohesive brand foundation
3. Call Claude API to generate:
   - Brand Purpose (why the brand exists beyond making money)
   - Vision Statement (aspirational future state)
   - Mission Statement (what you do and for whom)
   - 5 Core Values (principles that guide decisions)
   - Brand Personality (5-7 traits with descriptions)
   - Positioning Statement (target + need + solution + differentiation)
4. Format as structured markdown
5. Write to brand/output/brand-brief-filled.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateBrandBrief() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  const strategyOutputDir = join(projectRoot, 'strategy', 'output')

  // Read strategy outputs
  let ideaCanvas = ''
  let leanCanvas = ''
  let marketResearch = ''
  let competitorAnalysis = ''

  try {
    ideaCanvas = readFileSync(join(strategyOutputDir, 'idea-canvas.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: idea-canvas.md not found')
  }

  try {
    leanCanvas = readFileSync(join(strategyOutputDir, 'lean-canvas.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: lean-canvas.md not found')
  }

  try {
    marketResearch = readFileSync(join(strategyOutputDir, 'market-research.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: market-research.md not found')
  }

  try {
    competitorAnalysis = readFileSync(join(strategyOutputDir, 'competitor-analysis.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: competitor-analysis.md not found')
  }

  const strategyContext = `
# Idea Canvas
${ideaCanvas}

# Lean Canvas
${leanCanvas}

# Market Research
${marketResearch}

# Competitor Analysis
${competitorAnalysis}
  `.trim()

  // Generate brand brief via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: `You are a brand strategist. Based on this startup's strategy foundation:

${strategyContext}

Generate a comprehensive brand brief with the following structure:

# Brand Brief

## Brand Purpose
[One compelling sentence about why this brand exists beyond profit - the deeper human or societal need it fulfills]

## Vision Statement
[One sentence describing the aspirational future state the brand wants to create - where are we going?]

## Mission Statement
[1-2 sentences describing what you do, for whom, and how - what are we doing right now to achieve the vision?]

## Core Values

Define 5 core values that guide decisions and behavior:

### 1. [Value Name]
**Definition**: [2-3 sentence description of what this value means in practice]

### 2. [Value Name]
**Definition**: [2-3 sentence description]

### 3. [Value Name]
**Definition**: [2-3 sentence description]

### 4. [Value Name]
**Definition**: [2-3 sentence description]

### 5. [Value Name]
**Definition**: [2-3 sentence description]

## Brand Personality

Describe 5-7 personality traits that define how the brand shows up:

- **[Trait]**: [Description of how this manifests]
- **[Trait]**: [Description of how this manifests]
- **[Trait]**: [Description of how this manifests]
- **[Trait]**: [Description of how this manifests]
- **[Trait]**: [Description of how this manifests]
- **[Trait]**: [Description of how this manifests]
- **[Trait]**: [Description of how this manifests]

## Positioning Statement

For [target customer segment]
Who [statement of need or opportunity]
[Product/brand name] is a [product category]
That [statement of key benefit - compelling reason to buy]
Unlike [primary competitive alternative]
We [statement of primary differentiation]

---

Make the brand brief distinctive, authentic, and aligned with the strategy. Avoid generic startup language.`
      }
    ]
  })

  // Extract content from response
  let brandBrief = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      brandBrief += block.text + '\n'
    }
  }

  if (!brandBrief.trim()) {
    brandBrief = 'Failed to generate brand brief'
  }

  // Write output
  const outputDir = join(projectRoot, 'brand', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'brand-brief-filled.md')
  writeFileSync(outputPath, brandBrief, 'utf-8')

  console.log(`Brand brief generated successfully: ${outputPath}`)
  console.log(`\nCovered: Purpose, Vision, Mission, 5 Core Values, Personality, Positioning`)
}

generateBrandBrief().catch(console.error)
```

## Output

Creates brand/output/brand-brief-filled.md with brand purpose, vision statement, mission statement, 5 core values with definitions, 5-7 personality traits, and a complete positioning statement. Success requires reading strategy outputs and generating cohesive brand foundation. Output should be distinctive and avoid generic startup language.
