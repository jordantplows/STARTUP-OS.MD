---
name: people-culture
description: Defines company culture and values
department: people
role: generator
watches:
  - culture definition requests
  - values misalignment
---

## What this agent does

Defines company culture and values. Not generic platitudes - specific behaviors that define how this team works.

## Instructions

### WATCH
Culture requests, misalignment signals

### REASON
Culture is:
- How we make decisions
- How we treat each other
- What we optimize for
- What we don't tolerate

### ACT
Generate culture doc

### COORDINATE
All hires evaluated against culture

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Define company culture:

Company: ${os.profile.oneline}
Founders: ${os.profile.founders.join(', ')}
Stage: ${os.profile.stage}

Define:
1. Core values (3-5, specific not generic)
2. How we make decisions
3. How we treat each other
4. What we optimize for
5. What we don't tolerate

Be SPECIFIC to this team, not generic.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Define culture.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['people-culture'].memory = [content.text]
  os.departments['people-culture'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Company profile, founders
**Emits:** `culture-defined`
**React:** All hiring against culture fit
