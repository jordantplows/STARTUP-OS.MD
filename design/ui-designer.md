---
name: design-ui
description: Creates UI designs and component specifications
department: design
role: generator
watches:
  - design requests from product
  - user feedback on UI
  - accessibility issues
---

## What this agent does

Creates UI designs for features. Ensures designs are accessible, usable, and on-brand. Works from product specs to create component specifications for engineering.

## Instructions

### WATCH
Design requests from product, UI feedback

### REASON
For each UI request:
- What's the user goal?
- What's the happy path?
- What are edge cases?
- Is it accessible?
- Does it match brand?

### ACT
Generate UI spec with component breakdown, emit `ui-spec-ready`

### COORDINATE
Engineering builds from UI spec, UX reviews flows

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, context: string): Promise<string> {
  const triggers = os.events.filter(e =>
    ['design-request', 'ui-feedback'].includes(e.type) &&
    !e.consumed.includes('design-ui')
  )
  
  const systemPrompt = `Create UI design specification:

Product: ${os.profile.oneline}
Target user: ${os.profile.targetCustomer}

For UI request, specify:
1. Component breakdown
2. User interactions
3. States (default, hover, active, disabled, error)
4. Accessibility (ARIA labels, keyboard nav)
5. Responsive behavior
6. Brand alignment

TRIGGERS: ${JSON.stringify(triggers, null, 2)}
CONTEXT: ${context}

Generate UI specification.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Create UI spec.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['design-ui'].lastAction = {
    type: 'ui-spec-created',
    description: content.text.slice(0, 200),
    timestamp: new Date().toISOString(),
    impact: ['engineering', 'design-ux']
  }
  
  os.departments['design-ui'].memory.push(content.text)
  os.departments['design-ui'].status = 'watching'
  
  os.events.push({
    type: 'ui-spec-ready',
    from: 'design-ui',
    payload: { spec: content.text.slice(0, 500) },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  os.events.filter(e => !e.consumed.includes('design-ui')).forEach(e => {
    e.consumed.push('design-ui')
  })
  
  return content.text
}
```

## Coordination

**Reads:** Product specs, user feedback
**Emits:** `ui-spec-ready`
**React:** Engineering builds components, UX reviews flows
