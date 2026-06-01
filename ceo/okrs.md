---
name: ceo-okrs
executive: ceo
role: steering
reads:
  - company.os.profile
  - company.os.departments
  - company.os.events
events:
  emits: [okr-set, okr-updated, okr-achieved, okr-missed]
  watches: [quarter-start, strategic-pivot, milestone-achieved]
template-ref: templates/executives/okrs.md
---

## What this agent does

The CEO OKR agent sets, tracks, and adjusts company objectives and key results. It maintains quarterly goals, monitors progress across departments, and flags when OKRs need adjustment due to strategic changes or execution gaps.

## Instructions

### WATCH

Trigger when:
- Quarter begins (initialize new OKRs)
- Department achieves a milestone
- Strategic pivot occurs
- Founder requests OKR review
- End of quarter (score and reflect)

### REASON

OKR management follows this cycle:

**Setting OKRs:**
1. Read company stage and current focus
2. Identify 3-5 company objectives that matter most this quarter
3. For each objective, define 2-4 measurable key results
4. Ensure OKRs are ambitious but achievable (60-70% confidence)
5. Map which departments own which key results

**Tracking progress:**
1. Monitor department states for milestone achievements
2. Update key result progress weekly
3. Flag OKRs trending behind schedule
4. Identify blockers preventing progress

**Adjusting OKRs:**
1. If strategic pivot occurs, rewrite relevant OKRs
2. If execution reveals OKR was wrong target, adjust
3. If OKR becomes impossible, retire it with explanation
4. Never adjust OKRs just because they're hard

### ACT

Output format for OKR dashboard:

```
COMPANY OKRs · Q[N] 2026

Objective 1: [Ambitious, clear goal]
├─ KR1: [Metric] from [baseline] to [target] ─── [60%] ████░░
├─ KR2: [Metric] from [baseline] to [target] ─── [40%] ███░░░
└─ KR3: [Metric] from [baseline] to [target] ─── [80%] █████░
   Owner: [department]

Objective 2: [Ambitious, clear goal]
├─ KR1: [Metric] from [baseline] to [target] ─── [20%] ██░░░░
└─ KR2: [Metric] from [baseline] to [target] ─── [90%] ██████
   Owner: [department]

ON TRACK:    [N] key results
AT RISK:     [N] key results  
BLOCKED:     [N] key results

ADJUSTMENTS THIS QUARTER:
- [Date]: Retired KR [X] due to [reason]
- [Date]: Added KR [Y] after [event]
```

### COORDINATE

After OKR changes:
- Emit `okr-set` event when new OKRs are created
- Emit `okr-updated` event when progress changes
- Emit `okr-achieved` event when KR hits 100%
- Emit `okr-missed` event at quarter-end for unmet KRs
- Update all affected department states with their OKR assignments

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface KeyResult {
  id: string
  description: string
  metric: string
  baseline: number
  target: number
  current: number
  progress: number // 0-100
  owner: string
  status: 'on-track' | 'at-risk' | 'blocked'
  blocker?: string
}

interface Objective {
  id: string
  title: string
  keyResults: KeyResult[]
  overallProgress: number
}

interface OKRState {
  quarter: string
  objectives: Objective[]
  adjustments: Array<{
    date: string
    change: string
    reason: string
  }>
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Load or initialize OKR state
  const okrState = loadOKRState(os)
  
  if (!okrState) {
    // First time - set quarterly OKRs based on company stage
    return initializeOKRs(os)
  }
  
  // Check if we're at quarter boundary
  const currentQuarter = getCurrentQuarter()
  if (currentQuarter !== okrState.quarter) {
    return rolloverQuarter(os, okrState)
  }
  
  // Update progress based on department states
  updateProgress(os, okrState)
  
  // Identify at-risk OKRs
  const atRisk = findAtRiskOKRs(okrState)
  
  // Check for strategic events that should trigger OKR adjustments
  const recentEvents = os.events.slice(-50)
  const strategicEvents = recentEvents.filter(e => 
    e.type.includes('pivot') || 
    e.type.includes('strategic') ||
    e.type.includes('milestone')
  )
  
  if (strategicEvents.length > 0 && !strategicEvents[0].consumed.includes('ceo-okrs')) {
    // Mark as consumed
    strategicEvents[0].consumed.push('ceo-okrs')
    
    // Evaluate if OKRs need adjustment
    if (strategicEvents[0].type.includes('pivot')) {
      okrState.adjustments.push({
        date: new Date().toISOString(),
        change: 'Reviewing OKRs due to strategic pivot',
        reason: strategicEvents[0].type
      })
    }
  }
  
  // Save updated state
  saveOKRState(os, okrState)
  
  // Emit events for significant changes
  for (const obj of okrState.objectives) {
    for (const kr of obj.keyResults) {
      if (kr.progress === 100) {
        const alreadyEmitted = os.events.some(e => 
          e.type === 'okr-achieved' && 
          e.payload.krId === kr.id
        )
        if (!alreadyEmitted) {
          os.events.push({
            type: 'okr-achieved',
            from: 'ceo-okrs',
            payload: { krId: kr.id, description: kr.description },
            timestamp: new Date().toISOString(),
            consumed: []
          })
        }
      }
    }
  }
  
  // Format output
  return formatOKRDashboard(okrState, atRisk)
}

function loadOKRState(os: CompanyOS): OKRState | null {
  // In real impl, this would load from company.os or separate file
  // For now, check if CEO department has OKR memory
  if (!os.departments.ceo) return null
  
  const okrMemory = os.departments.ceo.memory.find(m => m.startsWith('OKR_STATE:'))
  if (!okrMemory) return null
  
  try {
    return JSON.parse(okrMemory.replace('OKR_STATE:', ''))
  } catch {
    return null
  }
}

function saveOKRState(os: CompanyOS, state: OKRState): void {
  if (!os.departments.ceo) {
    os.departments.ceo = {
      status: 'steering',
      currentFocus: 'Managing company OKRs',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  // Remove old OKR state from memory
  os.departments.ceo.memory = os.departments.ceo.memory.filter(m => 
    !m.startsWith('OKR_STATE:')
  )
  
  // Add updated state
  os.departments.ceo.memory.push(`OKR_STATE:${JSON.stringify(state)}`)
}

function initializeOKRs(os: CompanyOS): string {
  const quarter = getCurrentQuarter()
  const stage = os.profile.stage
  
  // Set OKRs based on company stage
  const objectives: Objective[] = []
  
  if (stage === 'idea' || stage === 'validating') {
    objectives.push({
      id: 'obj-1',
      title: 'Validate core problem and solution',
      keyResults: [
        {
          id: 'kr-1-1',
          description: 'Talk to target customers',
          metric: 'customer interviews',
          baseline: 0,
          target: 15,
          current: 0,
          progress: 0,
          owner: 'product',
          status: 'on-track'
        },
        {
          id: 'kr-1-2',
          description: 'Test solution hypothesis',
          metric: 'validation experiments',
          baseline: 0,
          target: 3,
          current: 0,
          progress: 0,
          owner: 'product',
          status: 'on-track'
        }
      ],
      overallProgress: 0
    })
  } else if (stage === 'building') {
    objectives.push({
      id: 'obj-1',
      title: 'Ship MVP to first customers',
      keyResults: [
        {
          id: 'kr-1-1',
          description: 'Complete core features',
          metric: 'MVP features shipped',
          baseline: 0,
          target: 5,
          current: 0,
          progress: 0,
          owner: 'engineering',
          status: 'on-track'
        },
        {
          id: 'kr-1-2',
          description: 'Onboard pilot customers',
          metric: 'active pilot users',
          baseline: 0,
          target: 10,
          current: 0,
          progress: 0,
          owner: 'product',
          status: 'on-track'
        }
      ],
      overallProgress: 0
    })
  } else if (stage === 'revenue') {
    objectives.push({
      id: 'obj-1',
      title: 'Achieve product-market fit indicators',
      keyResults: [
        {
          id: 'kr-1-1',
          description: 'Grow monthly recurring revenue',
          metric: 'MRR',
          baseline: 0,
          target: 10000,
          current: 0,
          progress: 0,
          owner: 'sales',
          status: 'on-track'
        },
        {
          id: 'kr-1-2',
          description: 'Improve customer retention',
          metric: 'retention rate',
          baseline: 0,
          target: 80,
          current: 0,
          progress: 0,
          owner: 'customer-success',
          status: 'on-track'
        }
      ],
      overallProgress: 0
    })
  }
  
  const state: OKRState = {
    quarter,
    objectives,
    adjustments: []
  }
  
  saveOKRState(os, state)
  
  os.events.push({
    type: 'okr-set',
    from: 'ceo-okrs',
    payload: { quarter, objectives },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  return `Initialized OKRs for ${quarter}:\n\n${formatOKRDashboard(state, [])}`
}

function getCurrentQuarter(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const quarter = Math.floor(month / 3) + 1
  return `Q${quarter} ${year}`
}

function updateProgress(os: CompanyOS, state: OKRState): void {
  // Update progress based on department states and events
  for (const obj of state.objectives) {
    for (const kr of obj.keyResults) {
      const ownerDept = os.departments[kr.owner]
      if (!ownerDept) continue
      
      // Check for milestone achievements in events
      const achievements = os.events.filter(e =>
        e.type.includes('milestone') &&
        e.from === kr.owner &&
        !e.consumed.includes('ceo-okrs')
      )
      
      for (const achievement of achievements) {
        achievement.consumed.push('ceo-okrs')
        // Increment progress
        kr.current = Math.min(kr.current + 1, kr.target)
        kr.progress = Math.round((kr.current / kr.target) * 100)
      }
      
      // Check if owner is blocked
      if (ownerDept.status === 'blocked') {
        kr.status = 'blocked'
        kr.blocker = ownerDept.currentFocus
      } else if (kr.progress < expectedProgressForQuarter()) {
        kr.status = 'at-risk'
      } else {
        kr.status = 'on-track'
      }
    }
    
    // Calculate overall objective progress
    obj.overallProgress = Math.round(
      obj.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / obj.keyResults.length
    )
  }
}

function expectedProgressForQuarter(): number {
  // Simple linear expectation - could be more sophisticated
  const now = new Date()
  const month = now.getMonth()
  const dayOfMonth = now.getDate()
  const quarterMonth = month % 3
  const daysIntoQuarter = (quarterMonth * 30) + dayOfMonth
  const totalDaysInQuarter = 90
  return (daysIntoQuarter / totalDaysInQuarter) * 100
}

function findAtRiskOKRs(state: OKRState): KeyResult[] {
  const atRisk: KeyResult[] = []
  for (const obj of state.objectives) {
    for (const kr of obj.keyResults) {
      if (kr.status === 'at-risk' || kr.status === 'blocked') {
        atRisk.push(kr)
      }
    }
  }
  return atRisk
}

function rolloverQuarter(os: CompanyOS, oldState: OKRState): string {
  // Score previous quarter
  const results: string[] = []
  for (const obj of oldState.objectives) {
    results.push(`${obj.title}: ${obj.overallProgress}% achieved`)
    for (const kr of obj.keyResults) {
      if (kr.progress < 100) {
        os.events.push({
          type: 'okr-missed',
          from: 'ceo-okrs',
          payload: { krId: kr.id, description: kr.description, progress: kr.progress },
          timestamp: new Date().toISOString(),
          consumed: []
        })
      }
    }
  }
  
  // Initialize new quarter
  const newOKRs = initializeOKRs(os)
  
  return `${oldState.quarter} Results:\n${results.join('\n')}\n\n${newOKRs}`
}

function formatOKRDashboard(state: OKRState, atRisk: KeyResult[]): string {
  const lines: string[] = []
  lines.push(`COMPANY OKRs · ${state.quarter}`)
  lines.push('')
  
  for (const obj of state.objectives) {
    lines.push(`Objective: ${obj.title}`)
    for (const kr of obj.keyResults) {
      const progressBar = '█'.repeat(Math.floor(kr.progress / 20)) + '░'.repeat(5 - Math.floor(kr.progress / 20))
      const statusIcon = kr.status === 'blocked' ? '🔴' : kr.status === 'at-risk' ? '🟡' : '🟢'
      lines.push(`├─ ${kr.description}`)
      lines.push(`│  ${kr.metric}: ${kr.current}/${kr.target} ─── [${kr.progress}%] ${progressBar} ${statusIcon}`)
      if (kr.blocker) {
        lines.push(`│  Blocker: ${kr.blocker}`)
      }
    }
    lines.push(`└─ Owner: ${obj.keyResults[0].owner}`)
    lines.push('')
  }
  
  const onTrack = state.objectives.flatMap(o => o.keyResults).filter(kr => kr.status === 'on-track').length
  const blocked = state.objectives.flatMap(o => o.keyResults).filter(kr => kr.status === 'blocked').length
  const total = state.objectives.flatMap(o => o.keyResults).length
  
  lines.push(`ON TRACK:    ${onTrack}/${total} key results`)
  lines.push(`AT RISK:     ${atRisk.length}/${total} key results`)
  lines.push(`BLOCKED:     ${blocked}/${total} key results`)
  
  if (state.adjustments.length > 0) {
    lines.push('')
    lines.push('ADJUSTMENTS THIS QUARTER:')
    for (const adj of state.adjustments) {
      lines.push(`- ${adj.date.split('T')[0]}: ${adj.change}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.profile.stage` — to set appropriate OKRs
- `company.os.departments.*` — to track progress
- `company.os.events` — to detect milestone achievements

**Emits:**
- `okr-set` → announces new quarterly OKRs
- `okr-updated` → progress changes
- `okr-achieved` → key result completed
- `okr-missed` → key result not met at quarter-end

**Consumed by:**
- All departments (align work to assigned OKRs)
- CEO briefing (includes OKR status)
- Board update agent (reports OKR progress)
