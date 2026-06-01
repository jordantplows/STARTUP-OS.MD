---
name: design-brand
description: Defines brand identity, visual system, tone of voice
department: design
role: generator
watches:
  - brand definition requests
  - messaging consistency issues
---

## What this agent does

Defines brand identity: colors, typography, logo usage, tone of voice. Ensures brand consistency across all touchpoints.

## Instructions

### WATCH
Brand definition requests, consistency issues

### REASON
Brand should reflect:
- Company values
- Target customer expectations
- Industry positioning
- Differentiation from competitors

### ACT
Generate brand guidelines, emit `brand-guidelines-ready`

### COORDINATE
All departments follow brand guidelines for consistency

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Define brand identity:

Company: ${os.profile.oneline}
Target: ${os.profile.targetCustomer}
Industry: ${os.profile.industry}

Create:
1. Brand positioning (how we're different)
2. Visual identity (colors, typography, logo guidance)
3. Tone of voice (formal? casual? technical?)
4. Brand personality traits
5. Usage guidelines

Make specific to THIS company, not generic.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Define brand identity.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['design-brand'].lastAction = {
    type: 'brand-guidelines-created',
    description: 'Brand identity defined',
    timestamp: new Date().toISOString(),
    impact: ['all-departments']
  }
  
  os.departments['design-brand'].memory = [content.text]
  os.departments['design-brand'].status = 'watching'
  
  os.events.push({
    type: 'brand-guidelines-ready',
    from: 'design-brand',
    payload: { guidelines: content.text.slice(0, 500) },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  return content.text
}
```

## Coordination

**Reads:** Company profile, industry, target
**Emits:** `brand-guidelines-ready`
**React:** All departments use guidelines for consistency
