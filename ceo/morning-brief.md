---
name: morning-brief
role: steering
department: ceo
schedule: daily 8am
reads:
  - company.os.*
writes:
  - workspace/ceo/morning-brief.md
emits:
  - morning-brief-ready
---

# Morning Brief Agent

## Purpose

Runs every morning at a configured time. Reads all company.os state from the past 24hrs. Produces one clean brief: what happened, what needs a decision today, what the single most important thing to do is. Surfaces it in Claude Code when founder opens their session. Short, specific, actionable. Never generic.

## Instructions

1. **Scan last 24 hours** of company.os activity:
   - New events emitted
   - Pending decisions raised
   - Department status changes
   - Customer signals
   - Competitor moves
   - Outreach activity
2. **Structure the brief**:
   - **Yesterday**: What happened (3-5 bullet points)
   - **Today**: What needs attention (prioritized list)
   - **Top Priority**: The single most important thing to do today
   - **Decisions Needed**: Any blocking decisions with context
   - **Signals**: Customer or market signals worth knowing
3. **Keep it short**: Maximum 200 words
4. **Make it actionable**: Every item has a specific action
5. **Prioritize ruthlessly**: Founder has limited time

## Coordination

- Reads all company.os state
- Writes brief to workspace/ceo/morning-brief.md
- Emits `morning-brief-ready` event
- Runs daily at 8am via scheduler

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface MorningBrief {
  date: string
  yesterday: string[]
  today: string[]
  topPriority: string
  decisionsNeeded: string[]
  signals: string[]
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[morning-brief] Generating morning brief...')
  
  const state = os.getState()
  const memory = readAgentMemory('morning-brief')
  
  // Get activity from last 24 hours
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayISO = yesterday.toISOString()
  
  const recentEvents = state.events.filter(e => e.timestamp > yesterdayISO)
  const pendingDecisions = os.getPendingDecisions()
  
  // Build brief
  const brief: MorningBrief = {
    date: new Date().toISOString().split('T')[0],
    yesterday: summarizeYesterday(recentEvents),
    today: generateTodayList(state, pendingDecisions),
    topPriority: determineTopPriority(state, pendingDecisions),
    decisionsNeeded: formatDecisions(pendingDecisions),
    signals: extractSignals(state, yesterdayISO)
  }
  
  // Write brief
  const briefMarkdown = formatBrief(brief, state)
  
  const workspaceDir = join(process.cwd(), 'workspace', 'ceo')
  if (!existsSync(workspaceDir)) {
    mkdirSync(workspaceDir, { recursive: true })
  }
  writeFileSync(join(workspaceDir, 'morning-brief.md'), briefMarkdown)
  
  os.emitEvent({
    type: 'morning-brief-ready',
    from: 'morning-brief',
    payload: { date: brief.date, priorityCount: brief.today.length }
  })
  
  writeAgentMemory('morning-brief', {
    lastRun: new Date().toISOString(),
    date: brief.date
  })
  
  console.log(`[morning-brief] Brief ready for ${brief.date}`)
}

function summarizeYesterday(events: any[]): string[] {
  const summary: string[] = []
  
  // Group events by type
  const byType: Record<string, number> = {}
  events.forEach(e => {
    byType[e.type] = (byType[e.type] || 0) + 1
  })
  
  // Highlight significant events
  Object.entries(byType).forEach(([type, count]) => {
    if (type === 'customer-signal-found' && count > 0) {
      summary.push(`${count} new customer signals detected`)
    }
    if (type === 'competitor-move-detected' && count > 0) {
      summary.push(`${count} competitor moves tracked`)
    }
    if (type === 'interview-synthesized' && count > 0) {
      summary.push(`${count} customer interviews synthesized`)
    }
    if (type === 'pricing-recommendation' && count > 0) {
      summary.push(`${count} pricing recommendations generated`)
    }
  })
  
  if (summary.length === 0) {
    summary.push('Quiet day — no major events')
  }
  
  return summary.slice(0, 5)
}

function generateTodayList(state: any, decisions: any[]): string[] {
  const items: string[] = []
  
  // Decisions are always high priority
  if (decisions.length > 0) {
    items.push(`Resolve ${decisions.length} blocking decision(s)`)
  }
  
  // Check for investor outreach ready
  const investorPipeline = (state as any).investor?.pipeline || []
  const readyToSend = investorPipeline.filter((i: any) => i.status === 'approved')
  if (readyToSend.length > 0) {
    items.push(`Send ${readyToSend.length} investor outreach message(s)`)
  }
  
  // Check for high-priority feedback
  const feedback = (state as any).product?.feedback || []
  const highPainFeedback = feedback.filter((f: any) => f.painIntensity === 'high')
  if (highPainFeedback.length >= 3) {
    items.push(`Review ${highPainFeedback.length} high-pain customer feedback items`)
  }
  
  // Check stage-specific priorities
  if (state.profile.stage === 'idea' || state.profile.stage === 'validating') {
    items.push('Schedule 2 customer interviews today')
  }
  
  if (state.profile.stage === 'building') {
    items.push('Check product build progress')
  }
  
  return items
}

function determineTopPriority(state: any, decisions: any[]): string {
  // Blocking decisions are always top priority
  if (decisions.length > 0) {
    const blocking = decisions.filter(d => d.blocking && d.blocking.length > 0)
    if (blocking.length > 0) {
      return `🚨 Resolve blocking decision: ${blocking[0].question}`
    }
    return `Resolve decision: ${decisions[0].question}`
  }
  
  // Stage-specific top priority
  if (state.profile.stage === 'idea') {
    return 'Talk to 2 potential customers today'
  }
  
  if (state.profile.stage === 'validating') {
    return 'Validate product concept with target customer'
  }
  
  if (state.profile.stage === 'building') {
    return 'Ship MVP feature today'
  }
  
  if (state.profile.stage === 'revenue') {
    return 'Close 1 new customer today'
  }
  
  return 'Define your top priority for today'
}

function formatDecisions(decisions: any[]): string[] {
  return decisions.slice(0, 3).map(d => 
    `${d.question} (raised by ${d.from})`
  )
}

function extractSignals(state: any, since: string): string[] {
  const signals: string[] = []
  
  // Customer signals
  const customerSignals = (state as any).research?.customerSignals || []
  const recent = customerSignals.filter((s: any) => s.detectedAt > since && s.painIntensity === 'high')
  if (recent.length > 0) {
    signals.push(`${recent.length} high-pain customer signals detected`)
  }
  
  // Competitor moves
  const competitorMoves = (state as any).research?.competitorMoves || []
  const recentMoves = competitorMoves.filter((m: any) => m.detectedAt > since && m.impact === 'high')
  if (recentMoves.length > 0) {
    signals.push(`${recentMoves[0].competitor}: ${recentMoves[0].description}`)
  }
  
  return signals
}

function formatBrief(brief: MorningBrief, state: any): string {
  return `# Morning Brief — ${brief.date}

## 🎯 Top Priority
${brief.topPriority}

## 📋 Today's Action Items
${brief.today.map((item, i) => `${i + 1}. ${item}`).join('\n')}

${brief.decisionsNeeded.length > 0 ? `## ⚠️  Decisions Needed
${brief.decisionsNeeded.map(d => `- ${d}`).join('\n')}
` : ''}

## 📊 Yesterday
${brief.yesterday.map(item => `- ${item}`).join('\n')}

${brief.signals.length > 0 ? `## 🔔 Signals
${brief.signals.map(s => `- ${s}`).join('\n')}
` : ''}

---
*Generated by ${state.profile.companyName} CEO agent*
`
}
```
