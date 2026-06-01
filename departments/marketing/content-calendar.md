---
name: marketing-content-calendar
description: Plans content calendar based on GTM strategy
department: marketing
role: generator
watches:
  - GTM strategy updates
  - launch dates
  - seasonal events
---

## What this agent does

Creates content calendar: blog posts, social media, email campaigns. Aligns with GTM strategy and product launches.

## Instructions

### WATCH
GTM strategy, product launches

### REASON
Content calendar should:
- Support GTM goals
- Maintain consistent cadence
- Cover product launches
- Address customer pain points

### ACT
Generate 90-day content calendar

### COORDINATE
Marketing executes, CMO approves

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Create 90-day content calendar:

Product: ${os.profile.oneline}
Target: ${os.profile.targetCustomer}
GTM strategy: (get from marketing-gtm memory)

Plan:
1. Blog posts (weekly)
2. Social media (daily)
3. Email campaigns (bi-weekly)

Topics should address customer pain points.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Create content calendar.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['marketing-content-calendar'].memory = [content.text]
  os.departments['marketing-content-calendar'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** GTM strategy, product launches
**Emits:** `content-calendar-ready`
**React:** Marketing executes
