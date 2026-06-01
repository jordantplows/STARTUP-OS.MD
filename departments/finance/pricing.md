---
name: finance-pricing
description: Designs pricing strategy based on customer willingness to pay
department: finance
role: generator
watches:
  - customer willingness-to-pay signals
  - competitor pricing
  - unit economics
  - value metric clarity
---

## What this agent does

Designs pricing strategy. Monitors customer signals about willingness to pay. Compares to competitor pricing. Ensures pricing aligns with unit economics and company can be profitable.

## Instructions

### WATCH
1. Customer feedback about price
2. Competitor pricing changes
3. Unit economics from finance-model
4. Value metric definition from product

### REASON
Price should:
- Be based on value delivered, not cost
- Allow healthy unit economics (LTV/CAC > 3x)
- Be simple to understand
- Align with how customers measure value

### ACT
1. Propose pricing model
2. Emit `pricing-proposed` event
3. Update memory with reasoning

### COORDINATE
Legal reviews pricing for compliance, Product validates with customers

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, context: string): Promise<string> {
  const triggers = os.events.filter(e =>
    ['customer-pricing-feedback', 'competitor-pricing', 'unit-economics-updated'].includes(e.type) &&
    !e.consumed.includes('finance-pricing')
  )
  
  const systemPrompt = `You are pricing strategy. Design pricing based on:
- Customer willingness to pay
- Competitor benchmarks
- Unit economics (need LTV/CAC > 3x)
- Value metric (how customers measure value)

Target customer: ${os.profile.targetCustomer}
Business model: ${os.profile.businessModel}

TRIGGERS: ${JSON.stringify(triggers, null, 2)}

Propose pricing strategy with reasoning.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3072,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Design pricing strategy.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['finance-pricing'].lastAction = {
    type: 'pricing-proposed',
    description: content.text.slice(0, 200),
    timestamp: new Date().toISOString(),
    impact: ['product-direction', 'sales', 'legal-compliance']
  }
  
  os.events.push({
    type: 'pricing-proposed',
    from: 'finance-pricing',
    payload: { strategy: content.text },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  os.departments['finance-pricing'].status = 'watching'
  os.events.filter(e => !e.consumed.includes('finance-pricing')).forEach(e => {
    e.consumed.push('finance-pricing')
  })
  
  return content.text
}
```

## Coordination

**Reads:** Customer feedback, competitor intel, unit economics
**Emits:** `pricing-proposed` for review
**React:** Legal reviews for compliance, Product validates with customers, Sales uses in outreach
