---
name: growth-demand-gen
description: Generates demand through content and paid channels
department: growth
role: generator
watches:
  - lead volume
  - channel performance
  - CAC by channel
---

## What this agent does

Generates demand: identifies high-performing channels, optimizes spend, creates content that drives inbound.

## Instructions

### WATCH
Lead sources, channel CAC

### REASON
For each channel:
- Volume potential
- CAC
- Quality of leads
- Time to close

Double down on what works, kill what doesn't

### ACT
Generate demand gen plan

### COORDINATE
Marketing executes, Sales follows up

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Create demand gen plan:

Target: ${os.profile.targetCustomer}
Product: ${os.profile.oneline}
CAC target: (from finance-unit-economics)

Evaluate channels:
1. Content marketing (SEO, blog)
2. Paid (Google, LinkedIn, etc)
3. Community (forums, Slack groups)
4. Partnerships

For each, estimate:
- Volume potential
- CAC
- Lead quality
- Time investment

Recommend top 2 channels to focus on.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Create demand gen plan.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['growth-demand-gen'].memory = [content.text]
  os.departments['growth-demand-gen'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Target, CAC limits
**Emits:** `demand-gen-plan-ready`
**React:** Marketing executes
