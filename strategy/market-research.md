---
name: market-research
description: Research TAM/SAM/SOM, trends, and customer segments
department: strategy
triggers: ["/startup-os strategy"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
writes:
  - strategy/output/market-research.md
---

## What this agent does

Uses Claude API with web search to research the market size (TAM/SAM/SOM), identify 5 key macro trends driving the opportunity, and define 3-5 customer segments with detailed personas. Outputs comprehensive market research to strategy/output/market-research.md.

## Instructions

1. Read CLAUDE.md to understand the startup's domain and target market
2. Call Claude API with web search enabled to research current market data
3. Calculate or estimate TAM (Total Addressable Market), SAM (Serviceable Addressable Market), and SOM (Serviceable Obtainable Market)
4. Identify 5 macro trends (technological, economic, social, regulatory) that create opportunities
5. Define 3-5 distinct customer segments with detailed characteristics, pain points, and behaviors
6. Format as structured markdown with citations to sources where available
7. Write to strategy/output/market-research.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateMarketResearch() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  // Read startup profile
  const projectRoot = process.cwd()
  let claudeMdContent = ''
  try {
    claudeMdContent = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    claudeMdContent = 'No startup profile found. Please provide market details.'
  }

  // Generate market research via Claude API with web search
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    tools: [
      {
        type: 'web_search_20250514',
        name: 'web_search',
        max_uses: 10
      }
    ],
    messages: [
      {
        role: 'user',
        content: `You are a market research analyst. Based on this startup profile:

${claudeMdContent}

Conduct comprehensive market research and generate a report with:

# Market Research Report

## Market Size Analysis

### TAM (Total Addressable Market)
[Total market demand for this type of solution globally - provide $ figure and methodology]

### SAM (Serviceable Addressable Market)
[Portion of TAM you can realistically serve based on business model and geography - provide $ figure]

### SOM (Serviceable Obtainable Market)
[Realistic portion you can capture in 3-5 years given competition - provide $ figure and assumptions]

## Macro Trends

[Identify and describe 5 major trends driving this market opportunity]

1. **[Trend Name]**: [Description, data, implications]
2. **[Trend Name]**: [Description, data, implications]
3. **[Trend Name]**: [Description, data, implications]
4. **[Trend Name]**: [Description, data, implications]
5. **[Trend Name]**: [Description, data, implications]

## Customer Segments

[Define 3-5 distinct customer segments]

### Segment 1: [Name]
- **Demographics**: [Age, location, role, company size, etc.]
- **Psychographics**: [Goals, values, behaviors]
- **Pain Points**: [Specific problems they face]
- **Buying Behavior**: [How they make decisions, budget authority]
- **Market Size**: [Estimated number of potential customers]

### Segment 2: [Name]
[Same structure]

### Segment 3: [Name]
[Same structure]

[Additional segments as needed]

Use web search to find current market data, industry reports, and statistics. Cite sources where possible.`
      }
    ]
  })

  // Extract content from response (handling tool use)
  let marketResearch = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      marketResearch += block.text + '\n'
    }
  }

  if (!marketResearch.trim()) {
    marketResearch = 'Failed to generate market research'
  }

  // Write output
  const outputDir = join(projectRoot, 'strategy', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'market-research.md')
  writeFileSync(outputPath, marketResearch, 'utf-8')

  console.log(`Market research generated successfully: ${outputPath}`)
  console.log(`\nCovered: TAM/SAM/SOM, 5 macro trends, customer segments`)
}

generateMarketResearch().catch(console.error)
```

## Output

Creates strategy/output/market-research.md with market size estimates (TAM/SAM/SOM), 5 macro trends with supporting data, and 3-5 customer segment personas with demographics, pain points, and buying behavior. Success requires concrete numbers for market sizing and detailed segment profiles. Fails if web search is unavailable or returns insufficient data.
