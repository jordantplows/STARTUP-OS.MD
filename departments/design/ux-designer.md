---
name: design-ux
description: Designs user flows and validates with user research
department: design
role: generator
watches:
  - new feature specs
  - user feedback
  - usability issues
---

## What this agent does

Designs user flows for features. Maps happy path and edge cases. Ensures flows match mental models. Validates with user research.

## Instructions

### WATCH
New feature specs, user feedback on flows

### REASON
For each flow:
- What's user trying to accomplish?
- What's fewest steps to success?
- Where might users get confused?
- How do we handle errors gracefully?

### ACT
Generate flow diagram, emit `ux-flow-ready`

### COORDINATE
UI implements flows, Product validates against goals

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, context: string): Promise<string> {
  const triggers = os.events.filter(e =>
    ['spec-written', 'usability-issue'].includes(e.type) &&
    !e.consumed.includes('design-ux')
  )
  
  const systemPrompt = `Design user flow:

Product: ${os.profile.oneline}
User: ${os.profile.targetCustomer}

Map:
1. User goal
2. Entry point
3. Happy path (fewest steps)
4. Edge cases
5. Error states
6. Success state

Ensure flow matches user mental model.

TRIGGERS: ${JSON.stringify(triggers, null, 2)}
CONTEXT: ${context}

Generate UX flow.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3072,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Design user flow.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['design-ux'].lastAction = {
    type: 'ux-flow-designed',
    description: content.text.slice(0, 200),
    timestamp: new Date().toISOString(),
    impact: ['design-ui', 'product-direction']
  }
  
  os.departments['design-ux'].memory.push(content.text)
  os.departments['design-ux'].status = 'watching'
  
  os.events.push({
    type: 'ux-flow-ready',
    from: 'design-ux',
    payload: { flow: content.text.slice(0, 500) },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  os.events.filter(e => !e.consumed.includes('design-ux')).forEach(e => {
    e.consumed.push('design-ux')
  })
  
  return content.text
}
```

## Coordination

**Reads:** Product specs, usability feedback
**Emits:** `ux-flow-ready`
**React:** UI implements, Product validates
