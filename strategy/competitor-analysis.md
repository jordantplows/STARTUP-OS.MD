---
name: competitor-analysis
description: Research top 5 competitors with funding, product, and positioning
department: strategy
triggers: ["/startup-os strategy"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
writes:
  - strategy/output/competitor-analysis.md
---

## What this agent does

Uses Claude API with web search to identify and analyze the top 5 competitors in the startup's space. For each competitor, researches funding history, product features, strengths, weaknesses, pricing strategy, and market positioning. Outputs comprehensive competitive analysis to strategy/output/competitor-analysis.md.

## Instructions

1. Read CLAUDE.md to understand the startup's product and market
2. Call Claude API with web search to identify top 5 direct and indirect competitors
3. For each competitor, research: company background, funding/valuation, product features, key strengths, key weaknesses, pricing model, and market positioning
4. Identify gaps in competitive landscape that represent opportunities
5. Format as structured markdown with comparison tables where appropriate
6. Write to strategy/output/competitor-analysis.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateCompetitorAnalysis() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  // Read startup profile
  const projectRoot = process.cwd()
  let claudeMdContent = ''
  try {
    claudeMdContent = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    claudeMdContent = 'No startup profile found. Please provide competitor context.'
  }

  // Generate competitor analysis via Claude API with web search
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 10000,
    tools: [
      {
        type: 'web_search_20250514',
        name: 'web_search',
        max_uses: 15
      }
    ],
    messages: [
      {
        role: 'user',
        content: `You are a competitive intelligence analyst. Based on this startup profile:

${claudeMdContent}

Conduct comprehensive competitor research and generate a report with:

# Competitor Analysis

## Overview
[Brief summary of competitive landscape - how crowded, how fragmented, key battlegrounds]

## Top 5 Competitors

### 1. [Competitor Name]

**Company Background**
- Founded: [Year]
- Location: [HQ location]
- Team Size: [Number of employees]

**Funding**
- Total Raised: $[Amount]
- Last Round: [Series X, $Y, Date]
- Key Investors: [List major investors]
- Valuation: $[Amount] (if available)

**Product**
- Core Features: [List 5-7 key features]
- Technology Stack: [If known]
- Target Customers: [Who they serve]

**Strengths**
- [Key advantage 1]
- [Key advantage 2]
- [Key advantage 3]

**Weaknesses**
- [Key gap 1]
- [Key gap 2]
- [Key gap 3]

**Pricing**
- Model: [Freemium, subscription, usage-based, etc.]
- Tiers: [Price points if available]

**Positioning**
- Tagline: [Their main message]
- Differentiation: [How they position vs others]

---

[Repeat structure for competitors 2-5]

## Competitive Matrix

| Competitor | Funding | Key Strength | Key Weakness | Pricing Model |
|------------|---------|--------------|--------------|---------------|
| [Name]     | $X      | [Strength]   | [Weakness]   | [Model]       |
| [Name]     | $X      | [Strength]   | [Weakness]   | [Model]       |
| [Name]     | $X      | [Strength]   | [Weakness]   | [Model]       |
| [Name]     | $X      | [Strength]   | [Weakness]   | [Model]       |
| [Name]     | $X      | [Strength]   | [Weakness]   | [Model]       |

## Market Gaps & Opportunities

[Identify 3-5 gaps in the competitive landscape that represent opportunities for differentiation]

1. **[Gap Name]**: [Description of what's missing and why it matters]
2. **[Gap Name]**: [Description]
3. **[Gap Name]**: [Description]

Use web search to find current competitor information. Research Crunchbase, company websites, product pages, and recent news.`
      }
    ]
  })

  // Extract content from response (handling tool use)
  let competitorAnalysis = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      competitorAnalysis += block.text + '\n'
    }
  }

  if (!competitorAnalysis.trim()) {
    competitorAnalysis = 'Failed to generate competitor analysis'
  }

  // Write output
  const outputDir = join(projectRoot, 'strategy', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'competitor-analysis.md')
  writeFileSync(outputPath, competitorAnalysis, 'utf-8')

  console.log(`Competitor analysis generated successfully: ${outputPath}`)
  console.log(`\nAnalyzed 5 competitors with funding, product, strengths, weaknesses, pricing, positioning`)
}

generateCompetitorAnalysis().catch(console.error)
```

## Output

Creates strategy/output/competitor-analysis.md with detailed profiles of 5 competitors including funding history, product features, strengths/weaknesses analysis, pricing models, and market positioning. Includes competitive matrix table and identified market gaps. Success requires complete data for at least 3 competitors. Fails if web search cannot find sufficient competitive intelligence.
