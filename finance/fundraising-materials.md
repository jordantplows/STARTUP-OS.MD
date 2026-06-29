---
name: finance-fundraising
description: Prepares fundraising materials and strategy based on runway
department: finance
role: generator
watches:
  - runway alerts from CFO
  - fundraising decisions
  - investor questions
---

## What this agent does

Prepares fundraising strategy and materials when runway gets low. Determines how much to raise, what stage/round, target investors, use of funds, and key metrics to highlight.

## Instructions

### WATCH
1. CFO runway alerts
2. Fundraising decisions
3. Investor meeting requests

### REASON
Determine:
- How much to raise? (18-24 months runway target)
- What stage? (pre-seed, seed, Series A based on traction)
- Target investors (stage-appropriate, sector-relevant)
- Use of funds breakdown
- Key metrics to emphasize

### ACT
Generate fundraising brief, emit `fundraising-brief-ready`

### COORDINATE
CEO uses brief for investor meetings, CFO validates numbers

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, context: string): Promise<string> {
  const triggers = os.events.filter(e =>
    ['fundraising-urgent', 'investor-meeting-scheduled'].includes(e.type) &&
    !e.consumed.includes('finance-fundraising')
  )
  
  const systemPrompt = `Prepare fundraising strategy:

Company: ${os.profile.oneline}
Stage: ${os.profile.stage}
Revenue: $${os.profile.revenue}
Target: ${os.profile.fundraisingGoal}

Determine:
1. Amount to raise (18-24mo runway)
2. Round stage (pre-seed/seed/A based on traction)
3. Target investor types
4. Use of funds breakdown
5. Key metrics to highlight

Be specific to THIS company's actual state.

TRIGGERS: ${JSON.stringify(triggers, null, 2)}
CONTEXT: ${context}

Provide fundraising brief.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Prepare fundraising strategy.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['finance-fundraising'].lastAction = {
    type: 'fundraising-brief-prepared',
    description: 'Fundraising strategy ready',
    timestamp: new Date().toISOString(),
    impact: ['ceo', 'cfo', 'founder']
  }
  
  os.departments['finance-fundraising'].memory.push(content.text)
  os.departments['finance-fundraising'].status = 'watching'
  
  os.events.push({
    type: 'fundraising-brief-ready',
    from: 'finance-fundraising',
    payload: { brief: content.text.slice(0, 500) },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  os.events.filter(e => !e.consumed.includes('finance-fundraising')).forEach(e => {
    e.consumed.push('finance-fundraising')
  })
  
  return content.text
}
```

## Coordination

**Reads:** Runway alerts, financial model, traction metrics
**Emits:** `fundraising-brief-ready`
**React:** CEO uses for investor meetings, CFO validates
