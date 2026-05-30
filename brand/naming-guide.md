---
name: naming-guide
description: Generate 30 name candidates across 6 strategies, score and rank them
department: brand
triggers: ["/startup-os brand"]
allowed-tools: [Read, Write, Bash]
reads:
  - brand/output/brand-brief-filled.md
writes:
  - brand/output/naming-candidates.md
---

## What this agent does

Reads the brand brief to understand positioning and personality, then uses Claude API to generate 30 company name candidates across 6 naming strategies, scores each on memorability, availability, and relevance, and surfaces the top 5 with rationale. Outputs to brand/output/naming-candidates.md.

## Instructions

1. Read brand/output/brand-brief-filled.md to understand brand positioning
2. Call Claude API to generate 30 name candidates across 6 naming strategies:
   - Descriptive (what you do)
   - Invented/Abstract (coined words)
   - Metaphorical (symbolic meaning)
   - Founder-based (personal names)
   - Acronym (initials)
   - Compound (combining words)
3. Score each name on memorability (1-10), availability (1-10), relevance (1-10)
4. Calculate weighted score and rank
5. Surface top 5 with detailed rationale
6. Format as structured markdown
7. Write to brand/output/naming-candidates.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateNamingCandidates() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  const brandOutputDir = join(projectRoot, 'brand', 'output')

  // Read brand brief
  let brandBrief = ''
  try {
    brandBrief = readFileSync(join(brandOutputDir, 'brand-brief-filled.md'), 'utf-8')
  } catch (err) {
    console.error('Error: brand-brief-filled.md not found. Run brand-brief agent first.')
    process.exit(1)
  }

  // Generate naming candidates via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: `You are a naming expert. Based on this brand brief:

${brandBrief}

Generate 30 company name candidates across 6 different naming strategies, then score and rank them.

# Naming Candidates Report

## Naming Strategies Overview

### 1. Descriptive Names
Names that directly describe what the product does or the benefit it provides.

### 2. Invented/Abstract Names
Coined words with no prior meaning (e.g., Spotify, Zillow, Hulu).

### 3. Metaphorical Names
Names that use metaphor or symbolism (e.g., Amazon, Oracle, Tesla).

### 4. Founder-Based Names
Names derived from founder or personal names (e.g., Ford, Disney, Hewlett-Packard).

### 5. Acronym Names
Names formed from initials (e.g., IBM, HP, BMW).

### 6. Compound Names
Names combining two or more words (e.g., Facebook, YouTube, Snapchat).

## All Candidates

Generate 5 candidates for each strategy (30 total). For each name provide:
- Name
- Strategy type
- Meaning/inspiration
- Memorability score (1-10)
- Availability score (1-10, estimated based on uniqueness)
- Relevance score (1-10, how well it fits the brand)
- Total weighted score (Memorability × 0.4 + Availability × 0.3 + Relevance × 0.3)

### Descriptive Names

1. **[Name]**
   - **Meaning**: [What it means/conveys]
   - **Memorability**: [Score]/10 - [Brief reason]
   - **Availability**: [Score]/10 - [Brief reason]
   - **Relevance**: [Score]/10 - [Brief reason]
   - **Total Score**: [Calculated weighted score]/10

[Repeat for 5 descriptive names]

### Invented/Abstract Names

[Repeat format for 5 invented names]

### Metaphorical Names

[Repeat format for 5 metaphorical names]

### Founder-Based Names

[Repeat format for 5 founder-based names]

### Acronym Names

[Repeat format for 5 acronym names]

### Compound Names

[Repeat format for 5 compound names]

## Top 5 Recommended Names

Rank the top 5 names overall by total score:

### #1: [Name] (Score: X.X/10)
**Strategy**: [Strategy type]
**Why it works**:
- [Strength 1]
- [Strength 2]
- [Strength 3]

**Considerations**:
- [Potential concern 1]
- [Potential concern 2]

### #2: [Name] (Score: X.X/10)
[Same format]

### #3: [Name] (Score: X.X/10)
[Same format]

### #4: [Name] (Score: X.X/10)
[Same format]

### #5: [Name] (Score: X.X/10)
[Same format]

## Next Steps

1. Check domain availability for top candidates (.com priority)
2. Search trademark databases (USPTO, WIPO)
3. Review social media handle availability
4. Test names with target customers
5. Evaluate pronunciation in key international markets

---

Generate creative, distinctive names. Prioritize memorability and uniqueness. Consider how each name sounds when spoken aloud.`
      }
    ]
  })

  // Extract content from response
  let namingCandidates = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      namingCandidates += block.text + '\n'
    }
  }

  if (!namingCandidates.trim()) {
    namingCandidates = 'Failed to generate naming candidates'
  }

  // Write output
  const outputDir = join(projectRoot, 'brand', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'naming-candidates.md')
  writeFileSync(outputPath, namingCandidates, 'utf-8')

  console.log(`Naming candidates generated successfully: ${outputPath}`)
  console.log(`\nGenerated: 30 names across 6 strategies, scored and ranked top 5`)
}

generateNamingCandidates().catch(console.error)
```

## Output

Creates brand/output/naming-candidates.md with 30 company name candidates across 6 naming strategies (descriptive, invented, metaphorical, founder-based, acronym, compound). Each name includes memorability, availability, and relevance scores with rationale. Top 5 names ranked with detailed strengths and considerations. Success requires creative, distinctive names with sound scoring methodology.
