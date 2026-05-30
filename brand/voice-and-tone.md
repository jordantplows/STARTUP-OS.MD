---
name: voice-and-tone
description: Generate brand voice attributes, tone variations, writing rules, and banned words
department: brand
triggers: ["/startup-os brand"]
allowed-tools: [Read, Write, Bash]
reads:
  - brand/output/brand-brief-filled.md
writes:
  - brand/output/voice-and-tone-filled.md
---

## What this agent does

Reads the brand brief to understand personality and values, then uses Claude API to generate voice and tone guidelines including 4 voice attributes with do/don't examples, tone variations by context, writing rules, and banned words. Outputs to brand/output/voice-and-tone-filled.md.

## Instructions

1. Read brand/output/brand-brief-filled.md to understand brand personality
2. Call Claude API to generate:
   - 4 core voice attributes with concrete do/don't examples
   - Tone variations for 6+ contexts (marketing, support, error messages, onboarding, social, sales)
   - 8-10 writing rules (sentence structure, formatting, technical language)
   - List of banned words/phrases to avoid
3. Format as structured markdown with examples
4. Write to brand/output/voice-and-tone-filled.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateVoiceAndTone() {
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

  // Generate voice and tone guide via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: `You are a brand voice expert. Based on this brand brief:

${brandBrief}

Generate comprehensive voice and tone guidelines with this structure:

# Voice and Tone Guide

## Voice Attributes

Our brand voice is consistent across all communications. It has these 4 core attributes:

### 1. [Attribute Name]

**What it means**: [2-3 sentence description]

**Do**:
- [Concrete example of good writing]
- [Concrete example of good writing]
- [Concrete example of good writing]

**Don't**:
- [Concrete example of what to avoid]
- [Concrete example of what to avoid]
- [Concrete example of what to avoid]

### 2. [Attribute Name]

**What it means**: [2-3 sentence description]

**Do**:
- [Concrete example]
- [Concrete example]
- [Concrete example]

**Don't**:
- [Concrete example of what to avoid]
- [Concrete example of what to avoid]
- [Concrete example of what to avoid]

### 3. [Attribute Name]

**What it means**: [2-3 sentence description]

**Do**:
- [Concrete example]
- [Concrete example]
- [Concrete example]

**Don't**:
- [Concrete example of what to avoid]
- [Concrete example of what to avoid]
- [Concrete example of what to avoid]

### 4. [Attribute Name]

**What it means**: [2-3 sentence description]

**Do**:
- [Concrete example]
- [Concrete example]
- [Concrete example]

**Don't**:
- [Concrete example of what to avoid]
- [Concrete example of what to avoid]
- [Concrete example of what to avoid]

## Tone Variations by Context

While voice stays consistent, tone adjusts to context:

### Marketing & Landing Pages
[Describe tone + provide 2-3 sentence example]

### Customer Support
[Describe tone + provide 2-3 sentence example]

### Error Messages
[Describe tone + provide 2-3 sentence example]

### Onboarding & Education
[Describe tone + provide 2-3 sentence example]

### Social Media
[Describe tone + provide 2-3 sentence example]

### Sales & Outreach
[Describe tone + provide 2-3 sentence example]

### Product UI & Microcopy
[Describe tone + provide 2-3 sentence example]

## Writing Rules

Follow these rules for all brand communications:

1. **[Rule Category]**: [Specific guideline with example]
2. **[Rule Category]**: [Specific guideline with example]
3. **[Rule Category]**: [Specific guideline with example]
4. **[Rule Category]**: [Specific guideline with example]
5. **[Rule Category]**: [Specific guideline with example]
6. **[Rule Category]**: [Specific guideline with example]
7. **[Rule Category]**: [Specific guideline with example]
8. **[Rule Category]**: [Specific guideline with example]
9. **[Rule Category]**: [Specific guideline with example]
10. **[Rule Category]**: [Specific guideline with example]

## Banned Words & Phrases

Avoid these overused or off-brand terms:

### Generic Startup Language
- [Word/phrase + why it's banned]
- [Word/phrase + why it's banned]
- [Word/phrase + why it's banned]
- [Word/phrase + why it's banned]
- [Word/phrase + why it's banned]

### Jargon & Buzzwords
- [Word/phrase + why it's banned]
- [Word/phrase + why it's banned]
- [Word/phrase + why it's banned]
- [Word/phrase + why it's banned]
- [Word/phrase + why it's banned]

### Other Off-Brand Terms
- [Word/phrase + why it's banned]
- [Word/phrase + why it's banned]
- [Word/phrase + why it's banned]

---

Make the guide specific and actionable with concrete examples. Ensure it reflects the brand personality from the brief.`
      }
    ]
  })

  // Extract content from response
  let voiceAndTone = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      voiceAndTone += block.text + '\n'
    }
  }

  if (!voiceAndTone.trim()) {
    voiceAndTone = 'Failed to generate voice and tone guide'
  }

  // Write output
  const outputDir = join(projectRoot, 'brand', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'voice-and-tone-filled.md')
  writeFileSync(outputPath, voiceAndTone, 'utf-8')

  console.log(`Voice and tone guide generated successfully: ${outputPath}`)
  console.log(`\nCovered: 4 voice attributes with examples, tone variations, writing rules, banned words`)
}

generateVoiceAndTone().catch(console.error)
```

## Output

Creates brand/output/voice-and-tone-filled.md with 4 voice attributes (each with do/don't examples), tone variations for 6+ contexts with examples, 8-10 writing rules, and a list of banned words organized by category. Success requires actionable, specific guidelines with concrete examples. Fails if brand brief is not available.
