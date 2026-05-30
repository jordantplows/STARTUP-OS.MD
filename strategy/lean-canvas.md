---
name: lean-canvas
description: Synthesize all strategy outputs into complete lean canvas
department: strategy
triggers: ["/startup-os strategy"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
  - strategy/output/idea-canvas-filled.md
  - strategy/output/market-research.md
  - strategy/output/competitor-analysis.md
writes:
  - strategy/output/lean-canvas-filled.md
---

## What this agent does

Reads the startup profile and all previously generated strategy outputs (idea canvas, market research, competitor analysis), then synthesizes this information into a complete Lean Canvas with all 9 boxes filled. Outputs to strategy/output/lean-canvas-filled.md.

## Instructions

1. Read CLAUDE.md and all strategy output files (idea-canvas-filled.md, market-research.md, competitor-analysis.md)
2. Call Claude API to synthesize information into Lean Canvas format
3. Ensure all 9 boxes are filled: Problem, Solution, Unique Value Proposition, Unfair Advantage, Customer Segments, Key Metrics, Channels, Cost Structure, Revenue Streams
4. Each box should contain concise, actionable content derived from the research
5. Format as clean markdown with clear visual structure
6. Write to strategy/output/lean-canvas-filled.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

async function generateLeanCanvas() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  // Read all input files
  let claudeMd = ''
  let ideaCanvas = ''
  let marketResearch = ''
  let competitorAnalysis = ''

  try {
    claudeMd = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    claudeMd = 'No startup profile found.'
  }

  const outputDir = join(projectRoot, 'strategy', 'output')
  
  try {
    ideaCanvas = readFileSync(join(outputDir, 'idea-canvas-filled.md'), 'utf-8')
  } catch (err) {
    ideaCanvas = 'No idea canvas found. Run idea-canvas agent first.'
  }

  try {
    marketResearch = readFileSync(join(outputDir, 'market-research.md'), 'utf-8')
  } catch (err) {
    marketResearch = 'No market research found. Run market-research agent first.'
  }

  try {
    competitorAnalysis = readFileSync(join(outputDir, 'competitor-analysis.md'), 'utf-8')
  } catch (err) {
    competitorAnalysis = 'No competitor analysis found. Run competitor-analysis agent first.'
  }

  // Generate lean canvas via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `You are a startup strategist. Synthesize the following research into a complete Lean Canvas.

**Startup Profile:**
${claudeMd}

**Idea Canvas:**
${ideaCanvas}

**Market Research:**
${marketResearch}

**Competitor Analysis:**
${competitorAnalysis}

Generate a complete LEAN CANVAS with all 9 boxes filled:

# Lean Canvas

## 1. Problem
**Top 3 Problems:**
1. [Most critical problem]
2. [Second problem]
3. [Third problem]

**Existing Alternatives:**
[How customers solve this today]

---

## 2. Customer Segments
**Target Customers:**
- [Primary segment]
- [Secondary segment]
- [Additional segments]

**Early Adopters:**
[Who will adopt first and why]

---

## 3. Unique Value Proposition
**Single, clear message:**
[One compelling sentence that explains why you're different and worth buying]

**High-Level Concept:**
[X for Y, like Uber for Z]

---

## 4. Solution
**Top 3 Features:**
1. [Feature addressing problem 1]
2. [Feature addressing problem 2]
3. [Feature addressing problem 3]

---

## 5. Channels
**Path to Customers:**
- [Channel 1 - e.g., content marketing, direct sales]
- [Channel 2]
- [Channel 3]

---

## 6. Revenue Streams
**Revenue Model:**
[Primary revenue model - subscription, usage-based, etc.]

**Pricing:**
- [Price point 1]
- [Price point 2]

**Lifetime Value:**
[Estimated LTV if available]

---

## 7. Cost Structure
**Fixed Costs:**
- [Major fixed cost 1]
- [Major fixed cost 2]

**Variable Costs:**
- [Cost per customer/transaction]
- [Other variable costs]

---

## 8. Key Metrics
**Metrics to Track:**
- [Primary metric - e.g., MRR, DAU]
- [Secondary metric]
- [Additional metrics]

---

## 9. Unfair Advantage
[Real competitive advantage that cannot be easily copied or bought - insight, network, authority, expertise, etc.]

---

Make this actionable and specific based on the research provided.`
      }
    ]
  })

  const leanCanvas = response.content[0].type === 'text' 
    ? response.content[0].text 
    : 'Failed to generate lean canvas'

  // Write output
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'lean-canvas-filled.md')
  writeFileSync(outputPath, leanCanvas, 'utf-8')

  console.log(`Lean Canvas generated successfully: ${outputPath}`)
  console.log(`\nAll 9 boxes filled: Problem, Customer Segments, UVP, Solution, Channels, Revenue, Costs, Metrics, Unfair Advantage`)
}

generateLeanCanvas().catch(console.error)
```

## Output

Creates strategy/output/lean-canvas-filled.md with all 9 Lean Canvas boxes completed: Problem (top 3), Customer Segments, Unique Value Proposition, Solution (top 3 features), Channels, Revenue Streams, Cost Structure, Key Metrics, and Unfair Advantage. Success requires all boxes present with specific, actionable content synthesized from prior research. Fails if prerequisite strategy files are missing or Claude API is unavailable.
