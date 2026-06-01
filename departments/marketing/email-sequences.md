---
name: marketing-email-sequences
description: Creates email sequences for onboarding and nurture
department: marketing
role: generator
watches:
  - signup flow activation
  - user milestones
  - churn signals
---

## What this agent does

Creates email sequences: welcome series, onboarding, feature announcements, re-engagement. Ensures emails match brand voice and include clear CTAs.

## Instructions

### WATCH
Signup flow, user lifecycle events

### REASON
Email sequence types:
- Welcome: introduce product, set expectations
- Onboarding: guide to first value
- Feature: announce new capabilities
- Re-engagement: win back inactive users

### ACT
Generate email copy, emit `email-sequence-ready`

### COORDINATE
Growth sends emails, Metrics tracks open/click rates

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, sequenceType: string): Promise<string> {
  const systemPrompt = `Create ${sequenceType} email sequence:

Product: ${os.profile.oneline}
Target: ${os.profile.targetCustomer}
Brand voice: (get from design-brand memory)

For ${sequenceType} sequence, write:
1. Subject lines
2. Email copy
3. CTAs
4. Send timing

Match brand voice, be specific to THIS product.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Create email sequence.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['marketing-email-sequences'].memory.push(content.text)
  os.departments['marketing-email-sequences'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Product, target customer, brand
**Emits:** `email-sequence-ready`
**React:** Growth sends, Metrics tracks
