---
name: red-team-business-model
description: Challenges business model assumptions and unit economics
department: red-team
role: watcher
watches:
  - business model decisions
  - pricing changes
  - unit economics
---

## What this agent does

Challenges business model: Can this actually make money? Are unit economics viable? What breaks at scale?

## Instructions

### WATCH
Business model, pricing, unit economics

### REASON
Challenge:
- Will customers actually pay this?
- Can you acquire customers profitably?
- What happens at 10x scale?
- What's the hidden cost you're missing?

### ACT
Challenge business model, emit `business-model-challenged`

### COORDINATE
CEO/CFO address challenges

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Challenge business model:

Model: ${os.profile.businessModel}
Pricing: (from finance-pricing)
Unit economics: (from finance-unit-economics)

Challenge:
1. Will customers ACTUALLY pay this price?
2. Can you acquire customers profitably?
3. What breaks at 10x scale?
4. What hidden costs are you missing?
5. Has anyone made this model work in this space?

Be brutally honest about what won't work.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3072,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Challenge business model.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['red-team-business-model'].lastAction = {
    type: 'business-model-challenged',
    description: content.text.slice(0, 200),
    timestamp: new Date().toISOString(),
    impact: ['ceo', 'cfo', 'founder']
  }
  
  os.events.push({
    type: 'business-model-challenged',
    from: 'red-team-business-model',
    payload: { challenge: content.text },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  os.departments['red-team-business-model'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Business model, pricing, economics
**Emits:** `business-model-challenged`
**React:** CEO/CFO must address
