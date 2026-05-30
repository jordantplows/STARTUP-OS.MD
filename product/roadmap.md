---
name: roadmap
description: Generate product roadmap with RICE prioritization from lean canvas
department: product
triggers: ["/startup-os product"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
  - strategy/output/lean-canvas-filled.md
  - strategy/output/market-research.md
writes:
  - product/output/roadmap-filled.md
---

## What this agent does

Reads the lean canvas and startup profile, generates a Now/Next/Later product roadmap with RICE scores (Reach, Impact, Confidence, Effort) for each initiative, validates that all items map to the Ideal Customer Profile (ICP), and writes the prioritized roadmap to product/output/roadmap-filled.md.

## Instructions

1. Read CLAUDE.md, lean-canvas-filled.md, and market-research.md
2. Call Claude API to generate a product roadmap with RICE prioritization
3. Organize initiatives into Now (0-3 months), Next (3-6 months), Later (6-12+ months)
4. Calculate RICE scores: (Reach × Impact × Confidence) / Effort
5. Validate each item maps to identified ICP needs and problems
6. Include strategic rationale for prioritization decisions
7. Write to product/output/roadmap-filled.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateRoadmap() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  // Read input files
  let claudeMd = ''
  let leanCanvas = ''
  let marketResearch = ''

  try {
    claudeMd = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    claudeMd = 'No startup profile found.'
  }

  const strategyOutput = join(projectRoot, 'strategy', 'output')
  
  try {
    leanCanvas = readFileSync(join(strategyOutput, 'lean-canvas-filled.md'), 'utf-8')
  } catch (err) {
    throw new Error('Lean canvas not found. Run lean-canvas agent first.')
  }

  try {
    marketResearch = readFileSync(join(strategyOutput, 'market-research.md'), 'utf-8')
  } catch (err) {
    marketResearch = 'No market research found.'
  }

  // Generate roadmap via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 6000,
    messages: [
      {
        role: 'user',
        content: `You are a product strategist. Generate a prioritized product roadmap based on the lean canvas and market research.

**Startup Profile:**
${claudeMd}

**Lean Canvas:**
${leanCanvas}

**Market Research:**
${marketResearch}

Generate a complete PRODUCT ROADMAP with RICE scoring:

# Product Roadmap

## Overview
[Brief summary of roadmap strategy and focus areas]

---

## Now (0-3 months)
**Focus:** [Core focus for this phase]

### Initiative 1: [Name]
**Description:** [What we're building and why]

**RICE Score:** [Total score]
- **Reach:** [Number] - [How many customers/month]
- **Impact:** [0.25/0.5/1/2/3] - [Massive/High/Medium/Low/Minimal impact]
- **Confidence:** [%] - [High/Medium/Low confidence]
- **Effort:** [Person-months]

**ICP Mapping:** [How this addresses ICP needs from research]

**Success Criteria:**
- [Measurable outcome 1]
- [Measurable outcome 2]

---

### Initiative 2: [Name]
[Same structure as above]

---

## Next (3-6 months)
**Focus:** [Core focus for this phase]

### Initiative 3: [Name]
[Same RICE structure]

### Initiative 4: [Name]
[Same RICE structure]

---

## Later (6-12+ months)
**Focus:** [Core focus for this phase]

### Initiative 5: [Name]
[Same RICE structure]

### Initiative 6: [Name]
[Same RICE structure]

---

## Prioritization Rationale

**Why this order:**
[Explain the strategic thinking behind the prioritization]

**ICP Validation:**
[Confirm all initiatives map to ICP problems and needs]

**Dependencies:**
[Note any dependencies between initiatives]

**Risks:**
[Key risks to roadmap execution]

---

## Key Metrics to Track
- [Metric 1]
- [Metric 2]
- [Metric 3]

Make this specific and actionable with realistic RICE scores based on the startup's context.`
      }
    ]
  })

  const roadmap = response.content[0].type === 'text' 
    ? response.content[0].text 
    : 'Failed to generate roadmap'

  // Write output
  const outputDir = join(projectRoot, 'product', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'roadmap-filled.md')
  writeFileSync(outputPath, roadmap, 'utf-8')

  console.log(`Product roadmap generated successfully: ${outputPath}`)
  console.log(`\nRoadmap includes Now/Next/Later phases with RICE scoring and ICP validation`)
}

generateRoadmap().catch(console.error)
```

## Output

Creates product/output/roadmap-filled.md with a prioritized product roadmap organized into Now (0-3 months), Next (3-6 months), and Later (6-12+ months) phases. Each initiative includes RICE scoring (Reach × Impact × Confidence / Effort), ICP mapping validation, success criteria, and strategic rationale. Requires lean-canvas-filled.md to exist. Fails if prerequisite strategy files are missing or Claude API is unavailable.
