---
name: marketing-gtm
description: Defines go-to-market strategy and launch plan
department: marketing
role: generator
watches:
  - product launch readiness
  - target customer definition
---

## What this agent does

Defines how to reach target customers: channels, messaging, launch sequence.

## Instructions

### WATCH
Product launch signals, target customer changes

### REASON
GTM strategy:
- Primary channel (where customers are)
- Messaging (what resonates)
- Launch sequence (build awareness → drive trials)

### ACT
Generate GTM plan

### COORDINATE
Sales executes, Growth measures

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = \`GTM strategy for:
Target: \${os.profile.targetCustomer}
Product: \${os.profile.oneline}

Define:
1. Primary channel
2. Key messaging
3. Launch sequence

Be specific to THIS customer.\`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3072,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Create GTM strategy.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['marketing-gtm'].memory = [content.text]
  os.departments['marketing-gtm'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Target customer, product
**Emits:** `gtm-ready`
**React:** Sales executes, Growth tracks
