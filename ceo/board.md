---
name: ceo-board
executive: ceo
role: steering
reads:
  - company.os.profile
  - company.os.departments
  - company.os.decisions
events:
  emits: [board-update-drafted, investor-comms-sent]
  watches: [quarter-end, fundraising-milestone, strategic-pivot]
template-ref: templates/executives/board.md
---

## What this agent does

The CEO board communications agent drafts board updates, manages investor relationships, and coordinates major company announcements. It synthesizes company progress into clear, honest updates that build investor confidence.

## Instructions

### WATCH

Trigger when:
- Quarter ends (time for board update)
- Major milestone achieved
- Strategic pivot occurs
- Fundraising round begins or closes
- Founder requests investor update draft

### REASON

Board updates serve two purposes:
1. **Transparency** — show honest progress, challenges, and direction
2. **Confidence** — demonstrate clear thinking and execution capability

Evaluate what to include:
- **Progress** — concrete achievements this period
- **Metrics** — key numbers (MRR, users, retention, burn)
- **Challenges** — honest about what's hard, plus how you're addressing it
- **Plan** — clear next steps and what success looks like
- **Asks** — specific help needed from board/investors

Never sugarcoat problems. Investors respect honesty and clear thinking over optimism.

### ACT

Draft board update with this structure:

```
BOARD UPDATE · [Month Year]
[Company Name]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TL;DR
[2-3 sentences: overall state, biggest win, biggest challenge]

PROGRESS THIS QUARTER
✓ [Concrete achievement 1]
✓ [Concrete achievement 2]
✓ [Concrete achievement 3]

KEY METRICS
MRR:         $X → $Y (+Z%)
Users:       X → Y (+Z%)
Retention:   X% → Y%
Burn:        $X/month
Runway:      X months

CHALLENGES & RESPONSE
1. [Challenge]
   → [What we're doing about it]

2. [Challenge]
   → [What we're doing about it]

NEXT QUARTER FOCUS
· [Priority 1]
· [Priority 2]
· [Priority 3]

ASKS FOR BOARD
· [Specific help needed]
· [Specific help needed]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full deck: [link if applicable]
Questions? Reply to this email or Slack.
```

Tone: Professional but not formal. Use "we" not "the company". Be specific with numbers. Show you understand what's working and what's not.

### COORDINATE

After drafting update:
- Emit `board-update-drafted` event
- Attach draft to CEO department memory
- Flag if any metrics show concerning trends
- Suggest timing for sending (avoid Fridays or holidays)

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface BoardUpdate {
  period: string
  tldr: string
  progress: string[]
  metrics: Record<string, string>
  challenges: Array<{ issue: string, response: string }>
  nextQuarterFocus: string[]
  asks: string[]
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  const update = generateBoardUpdate(os)
  
  // Store in CEO memory for reference
  if (!os.departments.ceo) {
    os.departments.ceo = {
      status: 'steering',
      currentFocus: 'Drafting board update',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.ceo.memory.push(
    `BOARD_UPDATE:${new Date().toISOString()}:${JSON.stringify(update)}`
  )
  
  // Emit event
  os.events.push({
    type: 'board-update-drafted',
    from: 'ceo-board',
    payload: { update },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Check for concerning signals
  const warnings = analyzeMetrics(update.metrics, os)
  if (warnings.length > 0) {
    os.events.push({
      type: 'metric-warning',
      from: 'ceo-board',
      payload: { warnings },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  return formatBoardUpdate(os.profile.companyName, update, warnings)
}

function generateBoardUpdate(os: CompanyOS): BoardUpdate {
  const period = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  
  // Gather progress from department states
  const progress: string[] = []
  for (const [dept, state] of Object.entries(os.departments)) {
    if (state.lastAction && isSignificantAchievement(state.lastAction)) {
      progress.push(state.lastAction.description)
    }
  }
  
  // Limit to top 3 most impactful
  progress.sort((a, b) => {
    const aImpact = a.toLowerCase().includes('launch') || a.toLowerCase().includes('customer') ? 1 : 0
    const bImpact = b.toLowerCase().includes('launch') || b.toLowerCase().includes('customer') ? 1 : 0
    return bImpact - aImpact
  })
  const topProgress = progress.slice(0, 3)
  
  // Gather metrics
  const metrics: Record<string, string> = {
    Revenue: `$${os.profile.revenue}`,
    Stage: os.profile.stage,
    Runway: extractRunwayFromFinance(os)
  }
  
  // Identify challenges
  const challenges: Array<{ issue: string, response: string }> = []
  for (const [dept, state] of Object.entries(os.departments)) {
    if (state.status === 'blocked' || state.signals.some(s => s.priority === 'critical')) {
      challenges.push({
        issue: `${dept}: ${state.currentFocus}`,
        response: state.pendingDecisions.length > 0 
          ? `Addressing: ${state.pendingDecisions[0].question}`
          : 'Working to unblock'
      })
    }
  }
  
  // Define next quarter focus from OKRs
  const nextQuarterFocus = extractOKRFocus(os)
  
  // Determine asks
  const asks: string[] = []
  const boardRelatedDecisions = os.decisions.filter(d => 
    !d.answer && 
    (d.question.toLowerCase().includes('investor') || 
     d.question.toLowerCase().includes('hire') ||
     d.question.toLowerCase().includes('partnership'))
  )
  for (const decision of boardRelatedDecisions) {
    asks.push(decision.question)
  }
  
  // Generate TL;DR
  const biggestWin = topProgress.length > 0 ? topProgress[0] : 'Making steady progress'
  const biggestChallenge = challenges.length > 0 ? challenges[0].issue : 'On track'
  const tldr = `${os.profile.stage} stage. Key win: ${biggestWin}. Main focus: ${biggestChallenge}`
  
  return {
    period,
    tldr,
    progress: topProgress,
    metrics,
    challenges: challenges.slice(0, 2),
    nextQuarterFocus,
    asks: asks.slice(0, 3)
  }
}

function isSignificantAchievement(action: any): boolean {
  const desc = action.description.toLowerCase()
  return desc.includes('launch') || 
         desc.includes('shipped') || 
         desc.includes('customer') || 
         desc.includes('revenue') ||
         desc.includes('hired') ||
         desc.includes('raised')
}

function extractRunwayFromFinance(os: CompanyOS): string {
  const finance = os.departments.finance
  if (!finance) return 'N/A'
  
  const runwayMemory = finance.memory.find(m => m.includes('runway'))
  if (!runwayMemory) return 'N/A'
  
  const match = runwayMemory.match(/(\d+)\s*months/)
  return match ? `${match[1]} months` : 'N/A'
}

function extractOKRFocus(os: CompanyOS): string[] {
  const ceo = os.departments.ceo
  if (!ceo) return ['Establish product-market fit', 'Grow customer base', 'Build team']
  
  const okrMemory = ceo.memory.find(m => m.startsWith('OKR_STATE:'))
  if (!okrMemory) return ['Establish product-market fit', 'Grow customer base', 'Build team']
  
  try {
    const okrState = JSON.parse(okrMemory.replace('OKR_STATE:', ''))
    return okrState.objectives.map((obj: any) => obj.title).slice(0, 3)
  } catch {
    return ['Establish product-market fit', 'Grow customer base', 'Build team']
  }
}

function analyzeMetrics(metrics: Record<string, string>, os: CompanyOS): string[] {
  const warnings: string[] = []
  
  // Check runway
  if (metrics.Runway !== 'N/A') {
    const months = parseInt(metrics.Runway)
    if (months < 6) {
      warnings.push(`Low runway: ${months} months remaining. Consider fundraising timeline.`)
    }
  }
  
  // Check if revenue is stagnant
  if (os.profile.stage === 'revenue' && os.profile.revenue === 0) {
    warnings.push('Stage is "revenue" but revenue is $0. Update stage or investigate.')
  }
  
  // Check for multiple blocked departments
  const blockedCount = Object.values(os.departments).filter(d => d.status === 'blocked').length
  if (blockedCount > 2) {
    warnings.push(`${blockedCount} departments currently blocked. May signal execution bottleneck.`)
  }
  
  return warnings
}

function formatBoardUpdate(companyName: string, update: BoardUpdate, warnings: string[]): string {
  const lines: string[] = []
  
  lines.push(`BOARD UPDATE · ${update.period}`)
  lines.push(companyName)
  lines.push('')
  lines.push('━'.repeat(80))
  lines.push('')
  lines.push('TL;DR')
  lines.push(update.tldr)
  lines.push('')
  lines.push('PROGRESS THIS QUARTER')
  for (const item of update.progress) {
    lines.push(`✓ ${item}`)
  }
  lines.push('')
  lines.push('KEY METRICS')
  for (const [key, value] of Object.entries(update.metrics)) {
    const padding = ' '.repeat(12 - key.length)
    lines.push(`${key}:${padding}${value}`)
  }
  
  if (update.challenges.length > 0) {
    lines.push('')
    lines.push('CHALLENGES & RESPONSE')
    for (let i = 0; i < update.challenges.length; i++) {
      const c = update.challenges[i]
      lines.push(`${i + 1}. ${c.issue}`)
      lines.push(`   → ${c.response}`)
      if (i < update.challenges.length - 1) lines.push('')
    }
  }
  
  lines.push('')
  lines.push('NEXT QUARTER FOCUS')
  for (const item of update.nextQuarterFocus) {
    lines.push(`· ${item}`)
  }
  
  if (update.asks.length > 0) {
    lines.push('')
    lines.push('ASKS FOR BOARD')
    for (const ask of update.asks) {
      lines.push(`· ${ask}`)
    }
  }
  
  lines.push('')
  lines.push('━'.repeat(80))
  lines.push('')
  lines.push('Questions? Reply to this email or Slack.')
  
  if (warnings.length > 0) {
    lines.push('')
    lines.push('⚠️  INTERNAL NOTES (not for board):')
    for (const warning of warnings) {
      lines.push(`· ${warning}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.profile` — company basics and stage
- `company.os.departments.*` — progress from all departments
- `company.os.decisions` — pending strategic questions

**Emits:**
- `board-update-drafted` → signals update is ready for review
- `metric-warning` → flags concerning trends
- `investor-comms-sent` → logs when update is actually sent

**Consumed by:**
- Founder (reviews and sends)
- CFO (validates financial metrics)
- Finance department (cross-checks runway/burn)
