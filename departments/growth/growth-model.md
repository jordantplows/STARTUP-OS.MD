---
name: growth-model
description: Models growth loops and experiments
department: growth
role: generator
watches:
  - growth experiments
  - viral coefficient
  - retention changes
---

## What this agent does

Models growth loops: how users bring other users. Designs experiments to test growth levers. Prioritizes highest-leverage experiments.

## Instructions

### WATCH
Growth experiments, retention data

### REASON
Growth model:
- Acquisition: how users find us
- Activation: how they get value
- Retention: why they stay
- Referral: how they bring others
- Revenue: how we monetize

Prioritize experiments by: impact × confidence / effort

### ACT
Generate growth model and experiment plan

### COORDINATE
Marketing/Product execute experiments

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Model growth loops:

Product: ${os.profile.oneline}
Target: ${os.profile.targetCustomer}
Stage: ${os.profile.stage}

Map:
1. Acquisition (how users find us)
2. Activation (first value moment)
3. Retention (why they stay)
4. Referral (how they bring others)
5. Revenue (monetization)

Design 3 highest-leverage experiments.
Prioritize by: impact × confidence / effort`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Model growth.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['growth-model'].memory = [content.text]
  os.departments['growth-model'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Product, target, stage
**Emits:** `growth-model-ready`
**React:** Marketing/Product execute
