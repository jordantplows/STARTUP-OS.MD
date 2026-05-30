---
name: idea-canvas
description: Generate complete idea canvas from startup profile
department: strategy
triggers: ["/startup-os strategy"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
writes:
  - strategy/output/idea-canvas-filled.md
---

## What this agent does

Reads the startup profile from CLAUDE.md, uses Claude API to generate a comprehensive idea canvas including value proposition, problem levels (surface/deep/existential), key insight, why now timing factors, and why you/founder-market fit. Outputs structured markdown to strategy/output/idea-canvas-filled.md.

## Instructions

1. Read CLAUDE.md from the project root to extract startup profile information
2. Call Claude API with a prompt asking it to generate a complete idea canvas based on the profile
3. Request structured output covering: value proposition, problem levels (surface problem, deeper problem, existential problem), the key insight, why now (market timing), and why you (founder advantages)
4. Format the response as clean markdown with clear sections
5. Write the completed idea canvas to strategy/output/idea-canvas-filled.md
6. Report success with a summary of generated sections

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateIdeaCanvas() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  // Read startup profile
  const projectRoot = process.cwd()
  let claudeMdContent = ''
  try {
    claudeMdContent = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    claudeMdContent = 'No startup profile found. Please provide startup details.'
  }

  // Generate idea canvas via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `You are a startup strategist helping to develop an idea canvas.

Based on this startup profile:

${claudeMdContent}

Generate a comprehensive IDEA CANVAS with the following sections:

# Idea Canvas

## Value Proposition
[Clear 1-2 sentence value prop that explains what the startup does and for whom]

## Problem Levels

### Surface Problem
[The obvious, immediate problem customers experience]

### Deeper Problem
[The underlying issue that causes the surface problem]

### Existential Problem
[The fundamental human need or fear this addresses]

## Key Insight
[The non-obvious insight or breakthrough that makes this solution possible or different]

## Why Now
[3-5 market timing factors that make this the right moment - technological shifts, regulatory changes, behavioral changes, etc.]

## Why You
[Founder advantages - unique expertise, network, insight, or positioning that gives you an unfair advantage]

Provide detailed, specific content for each section based on the startup profile. Be concrete and actionable.`
      }
    ]
  })

  const ideaCanvas = response.content[0].type === 'text' 
    ? response.content[0].text 
    : 'Failed to generate idea canvas'

  // Write output
  const outputDir = join(projectRoot, 'strategy', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'idea-canvas-filled.md')
  writeFileSync(outputPath, ideaCanvas, 'utf-8')

  console.log(`Idea canvas generated successfully: ${outputPath}`)
  console.log(`\nSections covered: Value Prop, Problem Levels, Key Insight, Why Now, Why You`)
}

generateIdeaCanvas().catch(console.error)
```

## Output

Creates strategy/output/idea-canvas-filled.md with structured sections covering value proposition, three-level problem analysis, key insight, timing factors, and founder advantages. Success requires all 5 main sections present with substantive content. Fails if Claude API is unavailable or returns empty response.
