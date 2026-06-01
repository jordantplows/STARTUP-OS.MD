---
name: sales-playbook
description: Creates sales playbook with discovery, demo, close process
department: sales
role: generator
watches:
  - target customer definition
  - competitive intel
  - pricing strategy
---

## What this agent does

Creates sales playbook: discovery questions, demo script, objection handling, close process. Based on actual customer conversations.

## Instructions

### WATCH
Target customer, competitive intel, pricing

### REASON
Playbook includes:
- Discovery questions (uncover pain)
- Demo script (show value)
- Objection handling
- Close process
- Pricing presentation

### ACT
Generate sales playbook

### COORDINATE
Sales team executes, updates based on learnings

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Create sales playbook:

Product: ${os.profile.oneline}
Target: ${os.profile.targetCustomer}
Problem: ${os.profile.problem}
Pricing: (get from finance-pricing memory)
Competitors: (get from strategy-competitive-intel memory)

Create:
1. Discovery questions
2. Demo script
3. Objection handling
4. Close process

Be specific to THIS product and customer.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 6144,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Create sales playbook.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['sales-playbook'].memory = [content.text]
  os.departments['sales-playbook'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Target, pricing, competitive intel
**Emits:** `playbook-ready`
**React:** Sales executes
