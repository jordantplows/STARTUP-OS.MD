---
name: mvp
description: Define MVP scope with features, metrics, and build/buy/fake decisions
department: product
triggers: ["/startup-os product"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
  - product/output/roadmap-filled.md
  - product/output/personas-filled.md
writes:
  - product/output/mvp-definition.md
---

## What this agent does

Reads the product roadmap and personas, generates a focused MVP definition with in-scope feature list, out-of-scope list, success metrics with baselines and targets, and build/buy/fake decisions for each component. Writes to product/output/mvp-definition.md.

## Instructions

1. Read CLAUDE.md, roadmap-filled.md, and personas-filled.md
2. Call Claude API to define MVP scope focused on "Now" roadmap items
3. Create in-scope feature list addressing core persona pain points
4. Create out-of-scope list to prevent scope creep
5. Define success metrics with baseline values and target values
6. For each component, decide: Build (custom), Buy (third-party), or Fake (manual/Wizard of Oz)
7. Write to product/output/mvp-definition.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateMVP() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  // Read input files
  let claudeMd = ''
  let roadmap = ''
  let personas = ''

  try {
    claudeMd = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    claudeMd = 'No startup profile found.'
  }

  const productOutput = join(projectRoot, 'product', 'output')
  
  try {
    roadmap = readFileSync(join(productOutput, 'roadmap-filled.md'), 'utf-8')
  } catch (err) {
    throw new Error('Roadmap not found. Run roadmap agent first.')
  }

  try {
    personas = readFileSync(join(productOutput, 'personas-filled.md'), 'utf-8')
  } catch (err) {
    throw new Error('Personas not found. Run personas agent first.')
  }

  // Generate MVP definition via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: `You are a product manager. Define a focused MVP based on the roadmap and personas.

**Startup Profile:**
${claudeMd}

**Product Roadmap:**
${roadmap}

**User Personas:**
${personas}

Generate a complete MVP DEFINITION:

# MVP Definition

## Overview
**MVP Vision:** [One sentence describing what the MVP accomplishes]

**Target Personas:** [Which personas this MVP serves]

**Time to Market:** [Estimated weeks to launch]

---

## In-Scope Features

### Core Features (Must Have)

#### 1. [Feature Name]
**Description:** [What it does and why it's essential]

**User Stories:**
- As a [persona], I want to [action] so that [benefit]
- As a [persona], I want to [action] so that [benefit]

**Acceptance Criteria:**
- [ ] [Specific, testable criteria]
- [ ] [Specific, testable criteria]
- [ ] [Specific, testable criteria]

**Build/Buy/Fake:** [BUILD / BUY / FAKE]
**Rationale:** [Why this approach? If Buy, what tool? If Fake, how?]

---

#### 2. [Feature Name]
[Repeat structure above]

---

#### 3. [Feature Name]
[Repeat structure above]

---

### Supporting Features (Should Have)

#### 4. [Feature Name]
[Simplified version of above structure]

---

## Out of Scope

**Explicitly NOT in MVP:**
1. **[Feature/Capability]** - [Why it's out: can be manual, not critical path, etc.]
2. **[Feature/Capability]** - [Why it's out]
3. **[Feature/Capability]** - [Why it's out]
4. **[Feature/Capability]** - [Why it's out]
5. **[Feature/Capability]** - [Why it's out]

**Deferred to Post-MVP:**
- [Feature planned for next phase]
- [Feature planned for next phase]

---

## Success Metrics

### Primary Metrics

#### 1. [Metric Name - e.g., User Activation Rate]
**Definition:** [How it's measured]
**Baseline:** [Current state or industry benchmark]
**Target:** [What success looks like for MVP]
**Measurement:** [How and when we'll track this]

---

#### 2. [Metric Name - e.g., Time to Value]
**Definition:** [How it's measured]
**Baseline:** [Current state]
**Target:** [MVP target]
**Measurement:** [Tracking method]

---

### Secondary Metrics

#### 3. [Metric Name]
[Same structure as above]

#### 4. [Metric Name]
[Same structure as above]

---

### Leading Indicators
- **[Indicator 1]:** [What we'll watch early to predict success]
- **[Indicator 2]:** [Early signal]
- **[Indicator 3]:** [Early signal]

---

## Build / Buy / Fake Analysis

| Component | Decision | Option/Approach | Rationale | Cost |
|-----------|----------|-----------------|-----------|------|
| [Component 1] | BUILD | Custom code | [Why custom is needed] | $[dev cost] |
| [Component 2] | BUY | [Tool name] | [Why this tool fits] | $[price]/mo |
| [Component 3] | FAKE | Manual process | [How we'll fake it] | $[time cost] |
| [Component 4] | BUY | [Tool name] | [Why not build] | $[price]/mo |
| [Component 5] | BUILD | Custom code | [Core differentiation] | $[dev cost] |

**Total MVP Cost Estimate:** $[total]

**Build vs Buy Philosophy:**
[Explain the general approach: build only core differentiation, buy commodity features, fake anything uncertain]

---

## MVP Validation Plan

**How we'll know the MVP works:**
1. [Validation criterion 1]
2. [Validation criterion 2]
3. [Validation criterion 3]

**Go/No-Go Criteria:**
- **GO if:** [Conditions for proceeding to scale]
- **ITERATE if:** [Conditions requiring MVP adjustments]
- **KILL if:** [Conditions indicating fundamental flaw]

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [How to address] |
| [Risk 2] | High/Med/Low | High/Med/Low | [How to address] |
| [Risk 3] | High/Med/Low | High/Med/Low | [How to address] |

Make this actionable and realistic for a team to execute.`
      }
    ]
  })

  const mvpDef = response.content[0].type === 'text' 
    ? response.content[0].text 
    : 'Failed to generate MVP definition'

  // Write output
  const outputDir = join(projectRoot, 'product', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'mvp-definition.md')
  writeFileSync(outputPath, mvpDef, 'utf-8')

  console.log(`MVP definition generated successfully: ${outputPath}`)
  console.log(`\nIncludes in-scope features, out-of-scope list, metrics with targets, and build/buy/fake decisions`)
}

generateMVP().catch(console.error)
```

## Output

Creates product/output/mvp-definition.md with focused MVP scope including core and supporting features with user stories and acceptance criteria, explicit out-of-scope list, success metrics with baselines and targets, build/buy/fake analysis table with cost estimates, validation plan with go/no-go criteria, and risk assessment. Requires roadmap-filled.md and personas-filled.md to exist. Fails if prerequisite product files are missing or Claude API is unavailable.
