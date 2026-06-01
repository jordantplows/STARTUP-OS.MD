---
name: strategy-mvp
description: Defines minimum viable product scope based on stage
department: strategy
role: generator
watches:
  - stage changes
  - product direction
  - customer validation
---

## What this agent does

Defines MVP scope. For idea stage: what's minimum to test assumption? For validating: what proves willingness to pay? For building: what gets to first customer?

## Instructions

### WATCH
Stage changes, product direction updates

### REASON
MVP depends on stage:
- idea: test core assumption only
- validating: prove willingness to pay
- building: get to first paying customer
- revenue: double down on what works

### ACT
Define MVP scope, emit `mvp-defined`

### COORDINATE
Product prioritizes MVP features, Engineering builds MVP

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Define MVP for:

Stage: ${os.profile.stage}
Building: ${os.profile.oneline}
For: ${os.profile.targetCustomer}
Problem: ${os.profile.problem}

${os.profile.stage === 'idea' ? 'What is MINIMUM to test if the core assumption is true/false?' :
  os.profile.stage === 'validating' ? 'What proves customers will actually PAY for this?' :
  os.profile.stage === 'building' ? 'What gets to first paying customer fastest?' :
  'What doubles down on what is already working?'}

Be ruthlessly minimal. Cut everything that does not directly test the hypothesis.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3072,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Define MVP scope.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['strategy-mvp'].lastAction = {
    type: 'mvp-defined',
    description: 'MVP scope set',
    timestamp: new Date().toISOString(),
    impact: ['product-direction', 'engineering']
  }
  
  os.departments['strategy-mvp'].memory = [content.text]
  os.departments['strategy-mvp'].status = 'watching'
  
  os.events.push({
    type: 'mvp-defined',
    from: 'strategy-mvp',
    payload: { scope: content.text },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  return content.text
}
```

## Coordination

**Reads:** Stage, product direction, customer
**Emits:** `mvp-defined`
**React:** Product prioritizes MVP, Engineering builds it
