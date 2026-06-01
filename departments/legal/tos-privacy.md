---
name: legal-tos-privacy
description: Generates Terms of Service and Privacy Policy for the product
department: legal
role: generator
watches:
  - product launch
  - data collection changes
  - user signup flow
---

## What this agent does

Generates Terms of Service and Privacy Policy appropriate for the product. Updates when data collection practices change. Ensures compliance with GDPR, CCPA where applicable.

## Instructions

### WATCH
1. Product launch events
2. Data collection changes
3. User signup flow activation

### REASON
ToS should cover:
- What service provides
- User responsibilities
- Limitations of liability
- Termination conditions

Privacy Policy should cover:
- What data collected
- How data used
- How data stored
- User rights (GDPR/CCPA if applicable)

### ACT
Generate ToS and Privacy Policy, emit `legal-docs-ready`

### COORDINATE
Product includes links during signup, Compliance reviews

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const triggers = os.events.filter(e =>
    ['product-launch', 'data-collection-change', 'signup-flow-active'].includes(e.type) &&
    !e.consumed.includes('legal-tos-privacy')
  )
  
  const systemPrompt = `Generate Terms of Service and Privacy Policy:

Product: ${os.profile.oneline}
What we build: ${os.profile.problem}
Target users: ${os.profile.targetCustomer}
Location: ${os.profile.location}

Generate:
1. Terms of Service covering:
   - Service description
   - User responsibilities
   - Liability limitations
   - Termination

2. Privacy Policy covering:
   - Data collected
   - Data usage
   - Data storage
   - User rights (GDPR/CCPA)

Make specific to THIS product's actual data practices.

TRIGGERS: ${JSON.stringify(triggers, null, 2)}

Generate legal documents.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Generate ToS and Privacy Policy.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['legal-tos-privacy'].lastAction = {
    type: 'legal-docs-generated',
    description: 'ToS and Privacy Policy ready',
    timestamp: new Date().toISOString(),
    impact: ['product-direction', 'legal-compliance']
  }
  
  os.departments['legal-tos-privacy'].memory = [content.text]
  os.departments['legal-tos-privacy'].status = 'watching'
  
  os.events.push({
    type: 'legal-docs-ready',
    from: 'legal-tos-privacy',
    payload: { docs: 'ToS and Privacy Policy generated' },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  os.events.filter(e => !e.consumed.includes('legal-tos-privacy')).forEach(e => {
    e.consumed.push('legal-tos-privacy')
  })
  
  return content.text
}
```

## Coordination

**Reads:** Product description, data practices
**Emits:** `legal-docs-ready`
**React:** Product links docs in signup, Compliance reviews
