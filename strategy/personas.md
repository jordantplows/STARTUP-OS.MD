---
name: strategy-personas
description: Defines user personas from target customer description
department: strategy
role: generator
watches:
  - target customer updates
  - user research
---

## What this agent does

Creates detailed user personas from the target customer description. Not generic personas - specific to THIS customer with their actual pain points, goals, and context.

## Instructions

### WATCH
Target customer changes or user research

### REASON
For target customer, define:
- Demographics
- Role and responsibilities
- Goals
- Pain points
- Day in the life
- Decision criteria

### ACT
Generate personas, emit `personas-updated`

### COORDINATE
Product builds for personas, Marketing messages to personas

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Create user persona for:

Target customer: ${os.profile.targetCustomer}
Problem they have: ${os.profile.problem}
What we're building: ${os.profile.oneline}

Define:
1. Demographics
2. Role and responsibilities
3. Goals
4. Pain points (specific to their role)
5. Day in their life
6. Decision criteria

Make this SPECIFIC to the actual target customer, not generic.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3072,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Create persona.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['strategy-personas'].lastAction = {
    type: 'personas-generated',
    description: 'User personas defined',
    timestamp: new Date().toISOString(),
    impact: ['product-direction', 'marketing']
  }
  
  os.departments['strategy-personas'].memory = [content.text]
  os.departments['strategy-personas'].status = 'watching'
  
  os.events.push({
    type: 'personas-updated',
    from: 'strategy-personas',
    payload: { personas: content.text.slice(0, 500) },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  return content.text
}
```

## Coordination

**Reads:** Target customer, problem statement
**Emits:** `personas-updated`
**React:** Product builds for persona, Marketing messages to persona
