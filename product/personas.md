---
name: personas
description: Create detailed user personas from market research and ICP
department: product
triggers: ["/startup-os product"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
  - strategy/output/market-research.md
  - strategy/output/lean-canvas-filled.md
writes:
  - product/output/personas-filled.md
---

## What this agent does

Reads market research and ICP data, creates 2-3 detailed user personas including demographics, day-in-the-life scenarios, goals, frustrations, tools currently used, willingness to pay, and buying process. Writes complete personas to product/output/personas-filled.md.

## Instructions

1. Read CLAUDE.md, market-research.md, and lean-canvas-filled.md
2. Call Claude API to generate 2-3 detailed personas representing key customer segments
3. Include realistic demographics, job details, and psychographics
4. Create day-in-the-life narrative showing how they work and where pain points occur
5. Document goals (aspirations), frustrations (pain points), tools used, and buying behavior
6. Estimate willingness to pay based on problem severity and current alternatives
7. Write to product/output/personas-filled.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generatePersonas() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  // Read input files
  let claudeMd = ''
  let marketResearch = ''
  let leanCanvas = ''

  try {
    claudeMd = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    claudeMd = 'No startup profile found.'
  }

  const strategyOutput = join(projectRoot, 'strategy', 'output')
  
  try {
    marketResearch = readFileSync(join(strategyOutput, 'market-research.md'), 'utf-8')
  } catch (err) {
    throw new Error('Market research not found. Run market-research agent first.')
  }

  try {
    leanCanvas = readFileSync(join(strategyOutput, 'lean-canvas-filled.md'), 'utf-8')
  } catch (err) {
    leanCanvas = 'No lean canvas found.'
  }

  // Generate personas via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: `You are a product researcher. Create detailed user personas based on the market research and ICP.

**Startup Profile:**
${claudeMd}

**Market Research:**
${marketResearch}

**Lean Canvas:**
${leanCanvas}

Generate 2-3 USER PERSONAS representing key customer segments:

# User Personas

---

## Persona 1: [Name] - [Role/Title]

### Demographics
- **Age:** [Age range]
- **Location:** [Geographic location]
- **Job Title:** [Current role]
- **Company Size:** [Small/Medium/Large, employee count]
- **Industry:** [Industry sector]
- **Education:** [Education level]
- **Income:** [Income range if relevant]

### Psychographics
- **Tech Savviness:** [Low/Medium/High]
- **Work Style:** [Description of how they work]
- **Values:** [What matters to them professionally]
- **Decision Making:** [How they make buying decisions]

---

### A Day in the Life

[Write a narrative 3-4 paragraph story showing a typical workday, highlighting pain points and where the problem occurs naturally. Make this realistic and specific.]

Example structure:
- Morning routine and first tasks
- Where they encounter the problem
- Current workarounds and frustrations
- Impact on their day/goals

---

### Goals & Aspirations
1. [Primary professional goal]
2. [Secondary goal]
3. [Personal/career aspiration related to work]

### Frustrations & Pain Points
1. **[Pain point 1]:** [Detailed description of the frustration]
2. **[Pain point 2]:** [How it impacts their work]
3. **[Pain point 3]:** [Why current solutions don't work]

---

### Current Tools & Workflow
**Tools Used:**
- [Tool 1] - [What they use it for]
- [Tool 2] - [What they use it for]
- [Tool 3] - [What they use it for]

**Current Workflow:**
[Step-by-step description of how they solve the problem today]

**Pain Points in Current Workflow:**
- [Where current tools fail]
- [Manual workarounds required]
- [Time wasted]

---

### Buying Behavior
**Decision Process:**
[How they discover, evaluate, and purchase new tools]

**Budget Authority:**
[Can they buy directly or need approval? What's the approval process?]

**Purchase Triggers:**
[What would make them actively seek a solution?]

**Evaluation Criteria:**
1. [Most important factor]
2. [Second factor]
3. [Third factor]

**Willingness to Pay:**
- **Current Spend:** $[amount]/[period] on current solutions
- **Estimated WTP:** $[amount]/[period] for better solution
- **Rationale:** [Why this price point based on value and pain severity]

---

## Persona 2: [Name] - [Role/Title]

[Repeat entire structure above for second persona]

---

## Persona 3: [Name] - [Role/Title]

[Repeat entire structure above for third persona, if needed]

---

## Persona Summary

| Aspect | Persona 1 | Persona 2 | Persona 3 |
|--------|-----------|-----------|-----------|
| Role | [Role] | [Role] | [Role] |
| Primary Pain | [Pain] | [Pain] | [Pain] |
| WTP | $[amt] | $[amt] | $[amt] |
| Purchase Authority | [Yes/No] | [Yes/No] | [Yes/No] |
| Priority | [Primary/Secondary] | [Primary/Secondary] | [Secondary] |

Make these personas realistic, specific, and actionable for product and marketing decisions.`
      }
    ]
  })

  const personas = response.content[0].type === 'text' 
    ? response.content[0].text 
    : 'Failed to generate personas'

  // Write output
  const outputDir = join(projectRoot, 'product', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'personas-filled.md')
  writeFileSync(outputPath, personas, 'utf-8')

  console.log(`User personas generated successfully: ${outputPath}`)
  console.log(`\nCreated 2-3 detailed personas with demographics, day-in-life, goals, frustrations, tools, and WTP`)
}

generatePersonas().catch(console.error)
```

## Output

Creates product/output/personas-filled.md with 2-3 detailed user personas representing key customer segments. Each persona includes demographics, psychographics, day-in-the-life narrative, goals, frustrations, current tools/workflow, buying behavior, and willingness to pay estimates. Includes summary comparison table. Requires market-research.md to exist. Fails if prerequisite strategy files are missing or Claude API is unavailable.
