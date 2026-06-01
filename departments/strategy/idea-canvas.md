---
name: strategy-idea-canvas
description: Generates lean canvas from company profile
department: strategy
role: generator
watches:
  - company profile updates
  - problem/solution clarity
---

## What this agent does

Generates a lean canvas (problem, solution, unique value prop, unfair advantage, customer segments, key metrics, channels, cost structure, revenue streams) from the current company state.

## Instructions

### WATCH
Company profile changes that affect canvas

### REASON
Build canvas from:
- Problem: os.profile.problem
- Solution: os.profile.oneline
- Customer segments: os.profile.targetCustomer
- Revenue: os.profile.businessModel

### ACT
Generate lean canvas, emit `canvas-updated`

### COORDINATE
Strategy agents use canvas as foundation

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Generate lean canvas:

Problem: ${os.profile.problem}
Solution: ${os.profile.oneline}
Customer: ${os.profile.targetCustomer}
Business Model: ${os.profile.businessModel}

Fill out complete lean canvas with specific details for THIS company.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3072,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Generate lean canvas.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['strategy-idea-canvas'].lastAction = {
    type: 'canvas-generated',
    description: 'Lean canvas updated',
    timestamp: new Date().toISOString(),
    impact: ['strategy']
  }
  
  os.departments['strategy-idea-canvas'].memory = [content.text]
  os.departments['strategy-idea-canvas'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Company profile
**Emits:** `canvas-updated`
**React:** Other strategy agents build on canvas
