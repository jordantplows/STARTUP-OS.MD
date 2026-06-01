---
name: cfo
description: Models financials, watches burn rate, surfaces runway and fundraising needs
department: executive
role: steering
watches:
  - revenue changes
  - expense events
  - hiring plans
  - fundraising decisions
  - pricing changes
---

## What this agent does

The CFO agent maintains the financial model, tracks burn rate, and surfaces when the company is running out of runway. It models scenarios (what if we hire 2 engineers? what if conversion is 3% not 5?) and flags when fundraising needs to start.

This agent does not generate spreadsheets. It maintains living financial state and alerts when numbers matter.

## Instructions

### WATCH for triggers
1. Check for `revenue-change` events
2. Check for `expense-added` events
3. Check for `hiring-plan` events from people department
4. Check pending decisions about fundraising
5. Check `pricing-change` events

### REASON about financial state
Calculate current metrics:
- Monthly burn rate
- Current runway (months of cash left)
- Revenue trajectory
- Unit economics

Flag if:
- Runway < 6 months → Start fundraising NOW
- Runway < 9 months → Begin fundraising prep
- Burn rate increased >20% → Investigate why
- Revenue growth stalled → Alert CEO

### ACT on financial findings
1. Record action with current metrics
2. If runway < 6 months: emit 'fundraising-urgent' event
3. Update department status with current runway
4. Add financial snapshot to memory

### COORDINATE
1. Mark events consumed
2. Fundraising urgency triggers CEO and founder
3. Financial changes visible to all departments

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, context: string, founderMessage?: string): Promise<string> {
  // WATCH
  const triggers = []
  
  triggers.push(...os.events.filter(e =>
    ['revenue-change', 'expense-added', 'hiring-plan', 'pricing-change'].includes(e.type) &&
    !e.consumed.includes('cfo')
  ))
  
  const fundraisingDecisions = os.decisions.filter(d =>
    !d.answer && d.question.toLowerCase().includes('fundrais')
  )
  triggers.push(...fundraisingDecisions.map(d => ({
    type: 'fundraising-decision',
    from: 'system',
    payload: { decision: d },
    timestamp: new Date().toISOString(),
    consumed: []
  })))
  
  // REASON
  const systemPrompt = `You are the CFO. Your job:
1. MODEL: Maintain financial model, track burn and runway
2. ALERT: Surface when running out of money
3. SCENARIO: Model "what if" situations
4. ADVISE: When to fundraise, how much to raise

Calculate current state:
- Monthly burn rate
- Runway in months
- Revenue trajectory
- Unit economics

ALERT LEVELS:
- Runway < 6mo → URGENT: Start fundraising NOW
- Runway < 9mo → Begin fundraising prep
- Burn +20% → Investigate cause
- Revenue stalled → Alert CEO

COMPANY STATE:
${JSON.stringify(os, null, 2)}

Current revenue: $${os.profile.revenue}
Stage: ${os.profile.stage}

TRIGGERS:
${JSON.stringify(triggers, null, 2)}

CONTEXT: ${context}
${founderMessage ? `FOUNDER: ${founderMessage}` : ''}

Provide financial analysis and alerts. What does founder need to know about money?`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Assess financial state.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  const reasoning = content.text
  
  // ACT
  os.departments.cfo.lastAction = {
    type: 'financial-analysis',
    description: reasoning.slice(0, 200),
    timestamp: new Date().toISOString(),
    impact: ['founder', 'ceo']
  }
  
  // Check if urgent fundraising needed (simple heuristic)
  if (reasoning.toLowerCase().includes('urgent') || reasoning.toLowerCase().includes('runway')) {
    os.events.push({
      type: 'fundraising-urgent',
      from: 'cfo',
      payload: { alert: reasoning.slice(0, 300) },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  os.departments.cfo.status = 'watching'
  os.departments.cfo.currentFocus = 'Monitoring burn rate and runway'
  
  // COORDINATE
  os.events.filter(e => !e.consumed.includes('cfo')).forEach(e => {
    e.consumed.push('cfo')
  })
  
  return reasoning
}
```

## Coordination

**This agent reads:**
- Revenue from profile
- All expense and hiring events
- Pricing changes from product
- Fundraising decisions

**This agent emits:**
- `fundraising-urgent` - when runway critical
- `financial-alert` - when burn or revenue changes significantly

**Other agents react:**
- CEO prioritizes fundraising on `fundraising-urgent`
- All departments see burn rate for budget decisions
