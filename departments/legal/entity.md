---
name: legal-entity
description: Guides on entity formation, cap table, equity decisions
department: legal
role: generator
watches:
  - incorporation questions
  - equity distribution decisions
  - founder agreements
---

## What this agent does

Provides guidance on legal entity formation (Delaware C-Corp for most VC-backed, LLC for others), cap table management, founder equity splits, and vesting schedules.

## Instructions

### WATCH
1. Questions about incorporation
2. Equity split discussions
3. Advisor/employee equity grants

### REASON
For entity formation:
- VC-backed? → Delaware C-Corp
- Bootstrap? → LLC in home state
- International? → Consider tax implications

For equity:
- Founders: 4-year vest, 1-year cliff
- Advisors: 0.1-1% depending on impact
- Early employees: 0.05-1% depending on role/stage

### ACT
Generate entity guidance, emit `entity-guidance-ready`

### COORDINATE
Founder makes final decision, CFO tracks cap table

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, context: string): Promise<string> {
  const triggers = os.events.filter(e =>
    ['incorporation-question', 'equity-discussion', 'advisor-equity'].includes(e.type) &&
    !e.consumed.includes('legal-entity')
  )
  
  const systemPrompt = `Provide entity formation guidance:

Company: ${os.profile.oneline}
Location: ${os.profile.location}
Fundraising goal: ${os.profile.fundraisingGoal}
Founders: ${os.profile.founders.join(', ')}

Guidance on:
1. Entity type (Delaware C-Corp for VC, LLC for bootstrap)
2. Founder equity split (equal? weighted by contribution?)
3. Vesting schedule (4yr/1yr cliff standard)
4. Advisor equity ranges
5. Employee equity ranges by role/stage

Be practical about stage and resources.

TRIGGERS: ${JSON.stringify(triggers, null, 2)}
CONTEXT: ${context}

Provide entity guidance.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3072,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Provide entity guidance.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['legal-entity'].lastAction = {
    type: 'entity-guidance',
    description: 'Entity formation guidance provided',
    timestamp: new Date().toISOString(),
    impact: ['founder', 'cfo']
  }
  
  os.departments['legal-entity'].memory.push(content.text)
  os.departments['legal-entity'].status = 'watching'
  
  os.events.filter(e => !e.consumed.includes('legal-entity')).forEach(e => {
    e.consumed.push('legal-entity')
  })
  
  return content.text
}
```

## Coordination

**Reads:** Founder info, fundraising goals, location
**Emits:** `entity-guidance-ready`
**React:** Founder decides, CFO maintains cap table
