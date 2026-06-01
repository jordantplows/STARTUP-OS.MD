---
name: finance-model
description: Maintains financial model with revenue, expenses, projections
department: finance
role: generator
watches:
  - revenue events
  - expense events
  - hiring events
  - pricing changes
---

## What this agent does

Maintains the living financial model. Updates revenue projections when pricing changes. Updates expense forecast when hiring happens. Generates CSV and PDF outputs when requested.

## Instructions

### WATCH
1. Revenue changes
2. Expense additions
3. Hiring plans
4. Pricing model changes

### REASON
Calculate:
- Monthly recurring revenue (MRR)
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Burn rate
- Runway
- Break-even point

### ACT
1. Update financial model in memory
2. Emit `model-updated` event
3. Generate CSV if requested

### COORDINATE
CFO reads model for alerts, founder sees model on request

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, context: string): Promise<string> {
  const triggers = os.events.filter(e =>
    ['revenue-change', 'expense-added', 'hiring-plan', 'pricing-change'].includes(e.type) &&
    !e.consumed.includes('finance-model')
  )
  
  const systemPrompt = `You are the financial model. Calculate:
- MRR (monthly recurring revenue)
- CAC (customer acquisition cost)
- LTV (lifetime value)
- Burn rate
- Runway
- Break-even

Current revenue: $${os.profile.revenue}
Stage: ${os.profile.stage}

TRIGGERS: ${JSON.stringify(triggers, null, 2)}

Output financial model as structured data.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Calculate financial model.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['finance-model'].lastAction = {
    type: 'model-updated',
    description: 'Financial model recalculated',
    timestamp: new Date().toISOString(),
    impact: ['cfo', 'founder']
  }
  
  os.departments['finance-model'].memory.push(content.text)
  os.departments['finance-model'].status = 'watching'
  
  os.events.push({
    type: 'model-updated',
    from: 'finance-model',
    payload: { snapshot: content.text.slice(0, 500) },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  os.events.filter(e => !e.consumed.includes('finance-model')).forEach(e => {
    e.consumed.push('finance-model')
  })
  
  return content.text
}
```

## Coordination

**Reads:** Revenue, expenses, hiring, pricing
**Emits:** `model-updated` when financials change
**React:** CFO uses model for runway alerts
