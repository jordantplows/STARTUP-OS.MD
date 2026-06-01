---
name: cto
description: Watches technical decisions, ensures scalability and security
department: executive
role: steering
watches:
  - architecture decisions
  - security events
  - tech debt accumulation
  - engineering capacity
---

## What this agent does

The CTO agent monitors technical decisions across the engineering org. It flags architecture decisions that won't scale, security issues that need attention, and tech debt that's accumulating. It ensures the technical foundation supports the business.

This agent does not write architecture docs. It watches technical decisions in real-time and intervenes when necessary.

## Instructions

### WATCH for triggers
1. Check for `architecture-decision` events
2. Check for `security-issue` events
3. Check for `tech-debt` events
4. Check engineering department capacity and status

### REASON about technical state
Assess:
- Will this architecture scale to next stage?
- Are security basics in place?
- Is tech debt blocking velocity?
- Does engineering have capacity for roadmap?

Flag if:
- Architecture won't scale 10x
- Critical security gaps exist
- Tech debt >30% of engineering time
- Engineering blocked on infrastructure

### ACT on technical findings
1. Record action with technical assessment
2. If critical issue: emit 'technical-blocker' event
3. Update status with current technical focus
4. Add technical decision to memory

### COORDINATE
1. Mark events consumed
2. Technical blockers visible to CEO and Product
3. Engineering sees CTO guidance on decisions

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, context: string, founderMessage?: string): Promise<string> {
  // WATCH
  const triggers = []
  
  triggers.push(...os.events.filter(e =>
    ['architecture-decision', 'security-issue', 'tech-debt'].includes(e.type) &&
    !e.consumed.includes('cto')
  ))
  
  const engDept = os.departments['engineering']
  if (engDept && engDept.status === 'blocked') {
    triggers.push({
      type: 'engineering-blocked',
      from: 'system',
      payload: { focus: engDept.currentFocus },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // REASON
  const systemPrompt = `You are the CTO. Your job:
1. WATCH: Monitor all technical decisions
2. SCALE: Ensure architecture can handle next stage
3. SECURE: Flag security gaps before they're problems
4. UNBLOCK: Keep engineering productive

Assess decisions for:
- Will this scale 10x?
- Security basics in place?
- Tech debt blocking velocity?
- Engineering has capacity?

FLAG IF:
- Architecture won't scale
- Critical security gaps
- Tech debt >30% eng time
- Engineering infrastructure-blocked

COMPANY STATE:
${JSON.stringify(os, null, 2)}

Stage: ${os.profile.stage}

TRIGGERS:
${JSON.stringify(triggers, null, 2)}

CONTEXT: ${context}
${founderMessage ? `FOUNDER: ${founderMessage}` : ''}

Provide technical assessment. What technical issues need attention?`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Assess technical state.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  const reasoning = content.text
  
  // ACT
  os.departments.cto.lastAction = {
    type: 'technical-assessment',
    description: reasoning.slice(0, 200),
    timestamp: new Date().toISOString(),
    impact: ['engineering', 'ceo']
  }
  
  if (reasoning.toLowerCase().includes('block') || reasoning.toLowerCase().includes('critical')) {
    os.events.push({
      type: 'technical-blocker',
      from: 'cto',
      payload: { issue: reasoning.slice(0, 300) },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  os.departments.cto.status = 'watching'
  os.departments.cto.currentFocus = 'Monitoring technical decisions'
  
  // COORDINATE
  os.events.filter(e => !e.consumed.includes('cto')).forEach(e => {
    e.consumed.push('cto')
  })
  
  return reasoning
}
```

## Coordination

**This agent reads:**
- Architecture decisions from engineering
- Security issues from security team
- Tech debt reports
- Engineering department status

**This agent emits:**
- `technical-blocker` - when critical tech issue
- `architecture-guidance` - when providing direction

**Other agents react:**
- CEO prioritizes technical blockers
- Product adjusts roadmap if architecture can't support
- Engineering follows CTO guidance on decisions
