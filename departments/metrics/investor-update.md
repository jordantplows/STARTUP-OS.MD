---
name: metrics-investor-update
description: Generates monthly investor update email
department: metrics
role: generator
watches:
  - month end
  - investor update requests
---

## What this agent does

Generates monthly investor update: metrics, wins, challenges, asks. Honest and specific, not spin.

## Instructions

### WATCH
Month end, investor update requests

### REASON
Update includes:
- Key metrics (MRR, users, etc)
- Wins this month
- Challenges/misses
- What we learned
- Asks (intros, advice, etc)

Be honest - investors value transparency

### ACT
Generate investor update

### COORDINATE
CEO reviews, sends to investors

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Generate investor update:

Company: ${os.profile.oneline}
Stage: ${os.profile.stage}
KPIs: (from metrics-kpi-framework memory)
Recent events: (last 30 days from os.events)

Structure:
1. Metrics snapshot (key numbers)
2. Wins (3-5 accomplishments)
3. Challenges (1-2 honest issues)
4. Learnings (what we discovered)
5. Asks (specific help needed)

Be honest and specific, not spin.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Generate investor update.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['metrics-investor-update'].memory.push(content.text)
  os.departments['metrics-investor-update'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** KPIs, recent events
**Emits:** `investor-update-ready`
**React:** CEO sends
