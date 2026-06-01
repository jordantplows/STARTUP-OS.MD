---
name: ceo-briefing
executive: ceo
role: steering
reads:
  - company.os.departments
  - company.os.decisions
  - company.os.events
  - company.os.founderInput
events:
  emits: [briefing-delivered, priority-highlighted]
  watches: [founder-requests-status, daily-briefing-trigger]
template-ref: templates/executives/briefing.md
---

## What this agent does

The CEO briefing agent synthesizes all department state into a concise daily briefing for the founder. It reads what every department is doing, identifies what matters most, surfaces pending decisions, and recommends what the founder should focus on today.

This is not a summary of everything. It's a curated view of what's critical, surprising, or requires attention.

## Instructions

### WATCH

Trigger when:
- Founder asks for status (`/startup-os status`)
- Morning briefing is due (daily at 9am if configured)
- A department raises a critical decision
- Multiple departments become blocked on the same dependency

### REASON

Read all department states and identify:
1. **Critical blockers** — departments waiting on founder decisions
2. **Surprising signals** — unexpected changes in any department's state
3. **Coordination failures** — departments working against each other
4. **Strategic drift** — current work diverging from stated direction
5. **Resource constraints** — multiple departments competing for same resources

Prioritize by impact: what affects runway, customer acquisition, or product viability gets surfaced first.

### ACT

Generate a briefing with this structure:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 [COMPANY NAME] · CEO Briefing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 CURRENT FOCUS
 [One-line summary of what the company is focused on right now]

 DEPARTMENT STATUS
 [For each active department, one line showing current activity]
 Product     → [Specific current work, not generic]
 Engineering → [Specific current work, not generic]
 Sales       → [Specific current work, not generic]
 ...

 DECISIONS PENDING
 · [Decision 1 with who it's blocking]
 · [Decision 2 with who it's blocking]

 SIGNALS WORTH KNOWING
 · [Surprising or important state changes]
 · [Risks that emerged]
 · [Opportunities that appeared]

 RECOMMENDATION
 [What the founder should do today, specific and actionable]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Department status must be SPECIFIC. "Product is defining MVP scope" is generic. "Product is writing spec for auth flow with Clerk" is specific.

Recommendations must be ACTIONABLE. "Focus on customers" is vague. "Talk to 3 security engineers about their review process" is actionable.

### COORDINATE

After delivering briefing:
- Emit `briefing-delivered` event with timestamp
- If a decision is highlighted as critical, emit `priority-highlighted` event
- Update `company.os.departments.ceo.lastAction` with briefing summary

## TypeScript

```typescript
import { CompanyOS, DepartmentState, Decision } from '../src/company-os'

interface BriefingOutput {
  focus: string
  departmentStatus: Record<string, string>
  pendingDecisions: Decision[]
  signals: string[]
  recommendation: string
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Read current state
  const departments = os.departments
  const pendingDecisions = os.decisions.filter(d => !d.answer)
  const recentEvents = os.events.slice(-20) // Last 20 events
  
  // Identify critical blockers
  const blockers = pendingDecisions.filter(d => d.blocking.length > 0)
  
  // Find departments with significant state changes
  const activeDepts = Object.entries(departments)
    .filter(([_, state]) => state.status !== 'initializing')
    .sort((a, b) => {
      // Sort by most recent action
      if (!a[1].lastAction) return 1
      if (!b[1].lastAction) return -1
      return b[1].lastAction.timestamp.localeCompare(a[1].lastAction.timestamp)
    })
  
  // Detect coordination failures
  const signals: string[] = []
  
  // Check for departments blocked on same thing
  const blockageMap = new Map<string, string[]>()
  for (const decision of blockers) {
    for (const blocked of decision.blocking) {
      if (!blockageMap.has(decision.question)) {
        blockageMap.set(decision.question, [])
      }
      blockageMap.get(decision.question)!.push(blocked)
    }
  }
  
  for (const [question, depts] of blockageMap) {
    if (depts.length > 1) {
      signals.push(`${depts.length} departments blocked on: ${question}`)
    }
  }
  
  // Check for critical events in last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const criticalEvents = recentEvents.filter(e => 
    e.timestamp > oneDayAgo && 
    (e.type.includes('critical') || e.type.includes('risk'))
  )
  
  for (const event of criticalEvents) {
    signals.push(`${event.from} flagged: ${event.type}`)
  }
  
  // Generate department status lines
  const deptStatus: Record<string, string> = {}
  for (const [name, state] of activeDepts.slice(0, 8)) { // Top 8 active
    deptStatus[name] = state.currentFocus || 'Idle'
  }
  
  // Determine recommendation
  let recommendation = 'Continue current work'
  if (blockers.length > 0) {
    const topBlocker = blockers[0]
    recommendation = `Answer: "${topBlocker.question}" (blocking ${topBlocker.blocking.join(', ')})`
  } else if (signals.length > 0) {
    recommendation = `Investigate: ${signals[0]}`
  } else {
    // Find department that needs founder attention
    const needsAttention = activeDepts.find(([_, s]) => 
      s.currentFocus.toLowerCase().includes('waiting') ||
      s.currentFocus.toLowerCase().includes('blocked')
    )
    if (needsAttention) {
      recommendation = `Unblock ${needsAttention[0]}: ${needsAttention[1].currentFocus}`
    }
  }
  
  // Format briefing
  const briefing: BriefingOutput = {
    focus: os.profile.oneline,
    departmentStatus: deptStatus,
    pendingDecisions: blockers,
    signals,
    recommendation
  }
  
  // Emit coordination events
  os.events.push({
    type: 'briefing-delivered',
    from: 'ceo-briefing',
    payload: { briefing },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  if (blockers.length > 0) {
    os.events.push({
      type: 'priority-highlighted',
      from: 'ceo-briefing',
      payload: { decisionId: blockers[0].id },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update CEO state
  if (os.departments.ceo) {
    os.departments.ceo.lastAction = {
      type: 'briefing-delivered',
      description: 'Delivered daily briefing to founder',
      timestamp: new Date().toISOString(),
      impact: Object.keys(deptStatus)
    }
  }
  
  // Format output
  return formatBriefing(os.profile.companyName, briefing)
}

function formatBriefing(companyName: string, b: BriefingOutput): string {
  const lines = [
    '━'.repeat(80),
    ` ${companyName} · CEO Briefing`,
    '━'.repeat(80),
    '',
    ' CURRENT FOCUS',
    ` ${b.focus}`,
    '',
    ' DEPARTMENT STATUS'
  ]
  
  for (const [dept, status] of Object.entries(b.departmentStatus)) {
    const padding = ' '.repeat(12 - dept.length)
    lines.push(` ${dept}${padding}→ ${status}`)
  }
  
  if (b.pendingDecisions.length > 0) {
    lines.push('', ' DECISIONS PENDING')
    for (const decision of b.pendingDecisions) {
      lines.push(` · ${decision.question} (blocking ${decision.blocking.join(', ')})`)
    }
  }
  
  if (b.signals.length > 0) {
    lines.push('', ' SIGNALS WORTH KNOWING')
    for (const signal of b.signals) {
      lines.push(` · ${signal}`)
    }
  }
  
  lines.push('', ' RECOMMENDATION', ` ${b.recommendation}`, '', '━'.repeat(80))
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.*` — all department states
- `company.os.decisions` — pending decisions
- `company.os.events` — recent events for signals
- `company.os.founderInput` — recent founder activity

**Emits:**
- `briefing-delivered` → logs that briefing was given
- `priority-highlighted` → signals which decision is most critical

**Consumed by:**
- Decision routing agent (uses priority signal)
- All departments (read briefing for context)
