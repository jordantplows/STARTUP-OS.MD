---
name: north-star
description: >
  Selects North Star metric by evaluating 5 candidates against criteria
  (revenue correlation, weekly measurable, value reflection), recommends
  one with rationale, and defines 3-5 input metrics that drive it.
department: metrics
triggers: ["/startup-os metrics"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
  - strategy/output/idea-canvas.md
  - product/output/prd-filled.md
  - metrics/output/kpi-framework.md
writes:
  - metrics/output/north-star.md
---

## What this agent does

Reads startup profile and KPI framework to identify the single North Star metric that best represents customer value and business growth. Evaluates 5 candidate metrics against criteria: correlation to revenue, measurability at weekly frequency, and reflection of customer value. Recommends one North Star metric with detailed rationale and defines 3-5 input metrics that drive it. Writes structured recommendation to metrics/output/north-star.md.

## Instructions

1. Read CLAUDE.md for business model and value proposition
2. Read strategy and product outputs for customer value definition
3. Read metrics/output/kpi-framework.md for available metrics
4. Identify 5 candidate North Star metrics appropriate for the business model
5. Evaluate each against criteria: revenue correlation (0-10), weekly measurable (Y/N), value reflection (0-10)
6. Score and rank candidates
7. Recommend one North Star metric with detailed rationale
8. Define 3-5 input metrics that drive the North Star
9. Create measurement plan with targets and review cadence
10. Write to metrics/output/north-star.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateNorthStarMetric() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  // Read context files
  let claudeMd = ''
  let ideaCanvas = ''
  let prd = ''
  let kpiFramework = ''

  try {
    claudeMd = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: CLAUDE.md not found')
  }

  try {
    ideaCanvas = readFileSync(join(projectRoot, 'strategy', 'output', 'idea-canvas.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: idea-canvas.md not found')
  }

  try {
    prd = readFileSync(join(projectRoot, 'product', 'output', 'prd-filled.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: prd-filled.md not found')
  }

  try {
    kpiFramework = readFileSync(join(projectRoot, 'metrics', 'output', 'kpi-framework.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: kpi-framework.md not found')
  }

  const fullContext = `
# Startup Context

## Startup Profile
${claudeMd}

## Strategy
${ideaCanvas}

## Product
${prd}

## KPI Framework
${kpiFramework}
  `.trim()

  // Generate North Star metric via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are a North Star metric expert for startups. Based on this context:

${fullContext}

Create a North Star metric selection document with the following structure:

# North Star Metric: [Company Name]

**Generated**: ${new Date().toISOString().split('T')[0]}
**Business Model**: [Subscription/Transaction/Marketplace/etc]
**Current Stage**: [Pre-PMF/Early Growth/Scaling]

---

## What is a North Star Metric?

A North Star Metric (NSM) is the single metric that best captures the core value you deliver to customers. It is:
- **Leading indicator** of long-term success (not lagging like revenue)
- **Measurable at high frequency** (daily or weekly, not quarterly)
- **Actionable** (teams can directly influence it)
- **Reflective of customer value** (not just business metrics)

---

## Evaluation Criteria

We evaluate candidate metrics against three criteria:

1. **Revenue Correlation (0-10)**: How strongly does this metric predict revenue growth?
2. **Weekly Measurable (Yes/No)**: Can we track this at least weekly with reliable data?
3. **Customer Value Reflection (0-10)**: How well does this capture the value customers get from the product?

**Scoring**: Sum of (Revenue Correlation + Value Reflection) / 2, with Weekly Measurable as a gate.

---

## Candidate North Star Metrics

### Candidate 1: [Metric Name]

**Definition**: [Clear definition of the metric]

**Formula**: [Exact calculation]

**Example**: [Company X] uses this (e.g., Airbnb = Nights Booked)

**Evaluation**:
- Revenue Correlation: [X/10] — [Rationale]
- Weekly Measurable: [Yes/No] — [Rationale]
- Customer Value Reflection: [X/10] — [Rationale]
- **Total Score**: [X/10]

**Pros**:
- [Specific advantage]
- [Specific advantage]

**Cons**:
- [Specific limitation]
- [Specific limitation]

---

### Candidate 2: [Metric Name]

[Same structure as Candidate 1]

---

### Candidate 3: [Metric Name]

[Same structure as Candidate 1]

---

### Candidate 4: [Metric Name]

[Same structure as Candidate 1]

---

### Candidate 5: [Metric Name]

[Same structure as Candidate 1]

---

## Candidate Comparison

| Metric | Revenue Correlation | Weekly Measurable | Value Reflection | Total Score |
|--------|---------------------|-------------------|------------------|-------------|
| [Candidate 1] | X/10 | Yes/No | X/10 | X/10 |
| [Candidate 2] | X/10 | Yes/No | X/10 | X/10 |
| [Candidate 3] | X/10 | Yes/No | X/10 | X/10 |
| [Candidate 4] | X/10 | Yes/No | X/10 | X/10 |
| [Candidate 5] | X/10 | Yes/No | X/10 | X/10 |

---

## Recommended North Star Metric

### ⭐ [Selected Metric Name]

**Definition**: [Crystal clear definition]

**Formula**: [Exact calculation with data sources]

**Current Value**: [X] (as of [DATE])

**Target**: [Y] by [DATE+90 days]

---

## Why This Metric?

### 1. Best captures customer value
[2-3 sentences explaining why this metric represents the "aha moment" or core value prop]

### 2. Strong revenue predictor
[2-3 sentences with data or reasoning showing correlation to revenue]

### 3. Actionable and frequent
[2-3 sentences explaining how teams can move this weekly]

### 4. Avoids pitfalls
[2-3 sentences on why rejected alternatives have issues]

---

## Input Metrics: What Drives the North Star?

These are the 3-5 metrics that directly influence the North Star. Teams should focus on improving these.

### Input Metric 1: [Name]

**Definition**: [Clear definition]

**Formula**: [Calculation]

**Relationship to NSM**: [How improving this increases NSM]

**Current**: [X] | **Target**: [Y]

**Owner**: [Team/Role]

**Actions to Improve**:
1. [Specific tactic]
2. [Specific tactic]
3. [Specific tactic]

---

### Input Metric 2: [Name]

[Same structure as Input 1]

---

### Input Metric 3: [Name]

[Same structure as Input 1]

---

### Input Metric 4: [Name] (Optional)

[Same structure as Input 1]

---

### Input Metric 5: [Name] (Optional)

[Same structure as Input 1]

---

## Metrics Tree

\`\`\`
North Star: [NSM Name]
│
├── Input 1: [Metric] → Actions: [A, B, C]
├── Input 2: [Metric] → Actions: [D, E, F]
├── Input 3: [Metric] → Actions: [G, H, I]
└── Input 4: [Metric] → Actions: [J, K, L]
\`\`\`

---

## Measurement & Tracking

### Data Sources
- **North Star Metric**: [Tool/System (e.g., Analytics, Database)]
- **Input Metrics**: [List each with source]

### Dashboard Requirements
Create a North Star dashboard with:
1. **Current NSM value** (big number)
2. **Weekly trend** (line chart, last 12 weeks)
3. **Input metrics** (table with current, target, WoW change)
4. **Breakdown by segment** (if relevant: tier, cohort, geography)

### Review Cadence
- **Daily check**: NSM trend (async in Slack or email)
- **Weekly deep dive**: NSM + inputs, discuss blockers (30-min meeting)
- **Monthly review**: Progress vs targets, adjust tactics (60-min meeting)

---

## North Star Evolution by Stage

### Today (Pre-PMF / Early Growth)
**Focus**: [Current NSM]
**Why**: [Rationale for this stage]

### Next Stage (12-18 months)
**Likely shift to**: [Future NSM]
**Why**: [Rationale for evolution]
**Trigger for change**: [Condition that prompts reconsideration]

---

## Examples from Similar Companies

| Company | Business Model | North Star Metric | Why It Works |
|---------|----------------|-------------------|--------------|
| [Similar Company 1] | [Model] | [NSM] | [Rationale] |
| [Similar Company 2] | [Model] | [NSM] | [Rationale] |
| [Similar Company 3] | [Model] | [NSM] | [Rationale] |

---

## Red Flags to Watch

1. **Gaming the metric**: [Specific way teams might game this NSM]
   - **Mitigation**: [How to prevent it]

2. **Correlation breakdown**: [Scenario where NSM stops predicting revenue]
   - **Mitigation**: [Monitoring plan]

3. **Data reliability**: [Data quality risks]
   - **Mitigation**: [Validation approach]

---

## Next Steps

1. **Implement tracking** — Ensure NSM and input metrics are reliably measured by [DATE+7 days]
2. **Build dashboard** — Create North Star dashboard in [Tool] by [DATE+14 days]
3. **Align teams** — Present to team, assign input metric owners by [DATE+7 days]
4. **Weekly reviews** — Start weekly NSM review meetings by [DATE+14 days]
5. **Set targets** — Finalize 90-day targets for NSM and inputs by [DATE+7 days]

---

## Revision History

| Date | Changes | Author |
|------|---------|--------|
| ${new Date().toISOString().split('T')[0]} | Initial North Star selection | AI Agent |

Use the startup context to select the most appropriate North Star metric. Be specific about why alternatives were rejected. Make input metrics actionable with clear tactics. Include relevant industry examples. Ensure the metric is measurable with existing or easily-added instrumentation.`
      }
    ]
  })

  // Extract content from response
  let northStar = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      northStar += block.text + '\n'
    }
  }

  if (!northStar.trim()) {
    northStar = 'Failed to generate North Star metric'
  }

  // Write output
  const outputDir = join(projectRoot, 'metrics', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'north-star.md')
  writeFileSync(outputPath, northStar, 'utf-8')

  console.log(`North Star metric generated successfully: ${outputPath}`)
  console.log(`\nGenerated: North Star recommendation with input metrics and measurement plan`)
}

generateNorthStarMetric().catch(console.error)
```

## Output

Creates metrics/output/north-star.md with recommended North Star metric. Includes evaluation of 5 candidates scored against revenue correlation, weekly measurability, and customer value reflection. Contains detailed rationale for selected metric, 3-5 input metrics that drive it with specific improvement actions, metrics tree visualization, measurement and tracking plan, evolution guidance by stage, industry examples, red flags to watch, and implementation next steps.
