---
name: legal-compliance
description: Watches all decisions for legal risk, flags issues, never blocks
department: legal
role: watcher
watches:
  - all pending decisions
  - pricing changes
  - data handling
  - customer outreach
  - MCP connections
---

## What this agent does

The legal agent monitors every decision made across all departments for compliance and legal risk. It flags issues before they become problems but NEVER blocks - that's the founder's call. It's practical about startup risk tolerance and specific about which risks actually matter.

This agent does not generate legal templates. It watches in real-time and surfaces specific risks with clear consequences.

## Instructions

### WATCH for triggers
1. Check all pending decisions that haven't been reviewed
2. Check for `pricing-decision` events
3. Check for `data-handling` events
4. Check for `customer-outreach` events
5. Check for new MCP connections that need review
6. If stage is 'revenue', also watch `revenue-model-change` events

### REASON about risks
When triggered:
1. Assess risk level: CRITICAL / HIGH / MEDIUM / LOW
2. State the SPECIFIC risk (not "this might be a problem")
3. Explain actual consequence if it goes wrong
4. Suggest concrete mitigation if available
5. Say whether to block or proceed with caution
6. NEVER actually block - always defer to founder

Risk levels:
- CRITICAL: Securities violations, GDPR violations, IP theft, fraud
- HIGH: Missing contracts, no privacy policy, spam-like outreach
- MEDIUM: Industry compliance, IP documentation, ToS liability
- LOW: Generic startup risks everyone takes

### ACT on your assessment
1. Record action with risk level
2. If CRITICAL: emit 'legal-flag' event with severity
3. Update status to 'watching' with focus on risk level
4. Add finding to department memory

### COORDINATE
1. Mark consumed events
2. If flagged CRITICAL, CEO and Product will see the event
3. Founder receives all legal flags in their next interaction

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, context: string, founderMessage?: string): Promise<string> {
  // WATCH
  const triggers = []
  
  triggers.push(...os.decisions.filter(d => !d.answer))
  triggers.push(...os.events.filter(e => 
    ['pricing-decision', 'data-handling', 'customer-outreach'].includes(e.type) &&
    !e.consumed.includes('legal-compliance')
  ))
  
  const newMCPs = Object.entries(os.mcps)
    .filter(([_, m]) => m.connected && !m.legalReviewed)
  triggers.push(...newMCPs.map(([name]) => ({
    type: 'mcp-review-needed',
    from: 'system',
    payload: { mcp: name },
    timestamp: new Date().toISOString(),
    consumed: []
  })))
  
  if (os.profile.stage === 'revenue' || os.profile.revenue > 0) {
    triggers.push(...os.events.filter(e =>
      e.type === 'revenue-model-change' && !e.consumed.includes('legal-compliance')
    ))
  }
  
  // REASON
  const systemPrompt = `You are General Counsel. Your job:
1. WATCH: Monitor every decision for legal risk
2. FLAG: Surface risks before they become problems
3. ADVISE: Explain actual legal consequences
4. NEVER BLOCK: Flag risk but founder decides

Practical about startup risk tolerance.
Specific about which risks matter.
Clear on illegal vs. risky.

CRITICAL (recommend blocking): Securities violations, GDPR violations, IP theft, fraud
HIGH (flag strongly): No contracts, no privacy policy, spam outreach
MEDIUM (flag + suggest fix): Industry compliance, IP docs, ToS liability
LOW (note only): Generic startup risks

COMPANY STATE:
${JSON.stringify(os, null, 2)}

TRIGGERS:
${JSON.stringify(triggers, null, 2)}

CONTEXT: ${context}
${founderMessage ? `FOUNDER: ${founderMessage}` : ''}

Flag any legal risks. Be specific about consequences.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Review for legal risks.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  const reasoning = content.text
  const riskLevel = assessRisk(reasoning)
  
  // ACT
  os.departments['legal-compliance'].lastAction = {
    type: 'legal-review',
    description: reasoning.slice(0, 200),
    timestamp: new Date().toISOString(),
    impact: riskLevel === 'critical' ? ['all-departments', 'founder'] : ['founder']
  }
  
  if (riskLevel === 'critical') {
    os.events.push({
      type: 'legal-flag',
      from: 'legal-compliance',
      payload: { severity: 'critical', summary: reasoning.slice(0, 200) },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  os.departments['legal-compliance'].status = 'watching'
  os.departments['legal-compliance'].currentFocus = `Watching ${riskLevel} risk items`
  
  // COORDINATE
  os.events.filter(e => !e.consumed.includes('legal-compliance')).forEach(e => {
    e.consumed.push('legal-compliance')
  })
  
  return reasoning
}

function assessRisk(text: string): 'critical' | 'high' | 'medium' | 'low' {
  const lower = text.toLowerCase()
  if (lower.includes('securities') || lower.includes('fraud') || lower.includes('illegal')) {
    return 'critical'
  }
  if (lower.includes('gdpr') || lower.includes('ccpa') || lower.includes('privacy')) {
    return 'high'
  }
  if (lower.includes('terms') || lower.includes('compliance')) {
    return 'medium'
  }
  return 'low'
}
```

## Coordination

**This agent reads:**
- All pending decisions
- All events related to pricing, data, customers, MCPs
- Revenue model changes (if stage is revenue)

**This agent emits:**
- `legal-flag` - when CRITICAL risk is identified
- `legal-review-complete` - after reviewing a decision

**Other agents react:**
- CEO watches for `legal-flag` events
- Product pauses on CRITICAL flags until founder decides
- Marketing/Sales see flags related to their outreach
