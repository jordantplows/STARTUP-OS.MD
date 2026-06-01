---
name: finance-unit-economics
description: Calculates and monitors CAC, LTV, payback period, gross margins
department: finance
role: watcher
watches:
  - customer acquisition events
  - revenue per customer
  - cost changes
---

## What this agent does

Monitors unit economics: customer acquisition cost (CAC), lifetime value (LTV), LTV/CAC ratio, payback period, and gross margins. Alerts when unit economics don't support the business model.

## Instructions

### WATCH
1. New customer acquisitions
2. Revenue per customer changes
3. Cost structure changes

### REASON
Calculate:
- CAC = total sales/marketing spend / customers acquired
- LTV = ARPU * average customer lifetime
- LTV/CAC ratio (healthy = >3x)
- Payback period (healthy = <12 months)
- Gross margin

Alert if:
- LTV/CAC < 3x (not economically viable)
- Payback > 12 months (too long to recover cost)
- Gross margin < 70% for SaaS (pricing too low)

### ACT
Record unit economics, emit alert if unhealthy

### COORDINATE
CFO uses for financial planning, Pricing adjusts if margins wrong

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const triggers = os.events.filter(e =>
    ['customer-acquired', 'revenue-per-customer', 'cost-structure-change'].includes(e.type) &&
    !e.consumed.includes('finance-unit-economics')
  )
  
  const systemPrompt = `Calculate unit economics:

Business model: ${os.profile.businessModel}
Current revenue: $${os.profile.revenue}

Calculate:
- CAC (customer acquisition cost)
- LTV (lifetime value)
- LTV/CAC ratio
- Payback period
- Gross margin

Alert if:
- LTV/CAC < 3x → Not economically viable
- Payback > 12mo → Too long to recover
- Gross margin < 70% (SaaS) → Pricing too low

TRIGGERS: ${JSON.stringify(triggers, null, 2)}

Provide unit economics analysis.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Calculate unit economics.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['finance-unit-economics'].lastAction = {
    type: 'unit-economics-calculated',
    description: content.text.slice(0, 200),
    timestamp: new Date().toISOString(),
    impact: ['cfo', 'finance-pricing']
  }
  
  if (content.text.toLowerCase().includes('alert') || content.text.toLowerCase().includes('unhealthy')) {
    os.events.push({
      type: 'unit-economics-alert',
      from: 'finance-unit-economics',
      payload: { alert: content.text.slice(0, 300) },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  os.departments['finance-unit-economics'].status = 'watching'
  os.events.filter(e => !e.consumed.includes('finance-unit-economics')).forEach(e => {
    e.consumed.push('finance-unit-economics')
  })
  
  return content.text
}
```

## Coordination

**Reads:** Customer acquisition, revenue, costs
**Emits:** `unit-economics-alert` if metrics unhealthy
**React:** CFO adjusts plan, Pricing changes if margins wrong
