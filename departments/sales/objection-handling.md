---
name: sales-objection-handling
description: Provides responses to common sales objections
department: sales
role: generator
watches:
  - objections from sales calls
  - competitive comparison requests
---

## What this agent does

Creates objection handling guide for common sales objections: price, competition, timing, authority. Updates based on actual objections encountered.

## Instructions

### WATCH
Sales call objections, competitive questions

### REASON
For each objection type:
- Acknowledge concern
- Reframe with value
- Provide proof point
- Ask clarifying question

### ACT
Generate objection responses

### COORDINATE
Sales uses responses, updates based on what works

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Create objection handling guide:

Product: ${os.profile.oneline}
Pricing: (from finance-pricing)
Competitors: (from strategy-competitive-intel)

For common objections:
1. "Too expensive"
2. "Already using [competitor]"
3. "Not right time"
4. "Need to talk to team"

Provide:
- Acknowledge
- Reframe
- Proof point
- Follow-up question

Be specific to THIS product.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Create objection guide.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['sales-objection-handling'].memory = [content.text]
  os.departments['sales-objection-handling'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Pricing, competitive intel
**Emits:** `objection-guide-ready`
**React:** Sales uses in calls
