---
name: coo-operations
executive: coo
role: steering
reads:
  - company.os.departments
  - company.os.events
  - company.os.decisions
events:
  emits: [blocker-flagged, coordination-failure, velocity-drop]
  watches: [department-blocked, milestone-delayed, decision-aging]
template-ref: templates/executives/operations.md
---

## What this agent does

The COO operations agent monitors daily execution cadence across all departments, identifies blockers before they cascade, and ensures cross-department coordination. It's the operational heartbeat that keeps the company moving forward.

## Instructions

### WATCH

Trigger when:
- Any department status changes to 'blocked'
- A milestone is delayed beyond expected timeline
- Multiple departments are waiting on the same dependency
- Decision has been pending for >3 days without progress
- Daily operations check (morning sync)

### REASON

Operations monitoring follows this framework:

**Execution health indicators:**
1. **Velocity** — are departments making progress daily?
2. **Blockers** — what's preventing forward movement?
3. **Coordination** — are departments working in sync or at cross-purposes?
4. **Decision flow** — are decisions moving or aging?
5. **Resource conflicts** — are teams competing for same resources?

**When to flag:**
- Any department blocked >24 hours
- Same blocker affects multiple departments
- Decision aging without founder input
- Coordination failure between departments
- Velocity drop across >3 departments simultaneously

**When NOT to flag:**
- Normal work-in-progress states
- Expected dependencies (e.g., engineering waiting for design)
- Single team having a slow day
- Issues already surfaced in CEO briefing

### ACT

Operations status format:

```
OPERATIONS STATUS · [Date]

EXECUTION HEALTH
Velocity:       ████░░ (4/5) - [N] departments made progress today
Blockers:       ███░░░ (3/5) - [N] active blockers
Coordination:   █████░ (5/5) - Departments aligned
Decision Flow:  ██░░░░ (2/5) - [N] decisions aging

ACTIVE BLOCKERS
🔴 CRITICAL
· [Department] blocked on [specific blocker] - [N] days
  Impact: [what can't happen until this is resolved]
  Owner: [who can unblock]

🟡 MONITORING
· [Department] waiting on [dependency] - [N] days
  Impact: [what's slowed down]

COORDINATION ISSUES
· [Dept A] and [Dept B]: [specific conflict or misalignment]
  Resolution: [what needs to happen]

VELOCITY TRENDS
[Dept]  ████░░ ↑  [specific recent progress]
[Dept]  ███░░░ →  [maintaining pace]
[Dept]  ██░░░░ ↓  [slowing down - reason]

RECOMMENDATIONS
1. [Specific action to unblock critical issue]
2. [Specific coordination fix needed]
3. [Resource reallocation if needed]
```

### COORDINATE

After operations assessment:
- Emit `blocker-flagged` event for each critical blocker with owner
- Emit `coordination-failure` event if departments misaligned
- Emit `velocity-drop` event if multiple teams slowing
- Update `company.os.departments.coo` state with current focus
- Tag relevant departments in events so they're notified

## TypeScript

```typescript
import { CompanyOS, DepartmentState } from '../src/company-os'

interface BlockerInfo {
  department: string
  blocker: string
  days: number
  impact: string
  owner: string
  severity: 'critical' | 'monitoring'
}

interface VelocityTrend {
  department: string
  score: number // 0-5
  trend: 'up' | 'flat' | 'down'
  reason: string
}

interface OperationsHealth {
  velocity: number // 0-5
  blockers: number // 0-5 (inverted - fewer blockers = higher score)
  coordination: number // 0-5
  decisionFlow: number // 0-5
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Analyze execution health
  const health = assessOperationsHealth(os)
  
  // Identify all active blockers
  const blockers = identifyBlockers(os)
  
  // Detect coordination issues
  const coordinationIssues = detectCoordinationFailures(os)
  
  // Track velocity trends
  const velocityTrends = calculateVelocityTrends(os)
  
  // Generate recommendations
  const recommendations = generateRecommendations(blockers, coordinationIssues, velocityTrends)
  
  // Emit events for critical issues
  for (const blocker of blockers) {
    if (blocker.severity === 'critical') {
      os.events.push({
        type: 'blocker-flagged',
        from: 'coo-operations',
        payload: { blocker },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    }
  }
  
  if (coordinationIssues.length > 0) {
    os.events.push({
      type: 'coordination-failure',
      from: 'coo-operations',
      payload: { issues: coordinationIssues },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  const slowDepartments = velocityTrends.filter(v => v.trend === 'down')
  if (slowDepartments.length >= 3) {
    os.events.push({
      type: 'velocity-drop',
      from: 'coo-operations',
      payload: { departments: slowDepartments.map(v => v.department) },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update COO state
  if (!os.departments.coo) {
    os.departments.coo = {
      status: 'steering',
      currentFocus: 'Monitoring operations',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.coo.lastAction = {
    type: 'operations-assessed',
    description: `Health check: ${blockers.length} blockers, ${coordinationIssues.length} coordination issues`,
    timestamp: new Date().toISOString(),
    impact: Object.keys(os.departments)
  }
  
  os.departments.coo.memory.push(
    `OPS_HEALTH:${new Date().toISOString()}:${JSON.stringify(health)}`
  )
  
  return formatOperationsStatus(health, blockers, coordinationIssues, velocityTrends, recommendations)
}

function assessOperationsHealth(os: CompanyOS): OperationsHealth {
  const departments = Object.entries(os.departments).filter(([name]) => 
    name !== 'ceo' && name !== 'coo'
  )
  
  // Velocity: how many departments made progress recently
  const activeCount = departments.filter(([_, state]) => 
    state.lastAction && isRecent(state.lastAction.timestamp, 24)
  ).length
  const velocity = Math.round((activeCount / departments.length) * 5)
  
  // Blockers: count blocked departments (inverted score)
  const blockedCount = departments.filter(([_, state]) => state.status === 'blocked').length
  const blockerScore = Math.max(0, 5 - blockedCount)
  
  // Coordination: check for conflicting signals
  const signals = departments.flatMap(([name, state]) => 
    state.signals.map(s => ({ dept: name, signal: s }))
  )
  const conflicts = signals.filter(s1 => 
    signals.some(s2 => s1.dept !== s2.dept && s1.signal.type === s2.signal.type && s1.signal.priority === 'critical')
  )
  const coordination = Math.max(0, 5 - conflicts.length)
  
  // Decision flow: check aging decisions
  const agingDecisions = os.decisions.filter(d => 
    !d.answer && isOlderThan(d.askedAt, 72) // 3+ days old
  ).length
  const decisionFlow = Math.max(0, 5 - agingDecisions)
  
  return { velocity, blockers: blockerScore, coordination, decisionFlow }
}

function identifyBlockers(os: CompanyOS): BlockerInfo[] {
  const blockers: BlockerInfo[] = []
  
  for (const [name, state] of Object.entries(os.departments)) {
    if (state.status === 'blocked') {
      const blockedSince = getBlockedDuration(state)
      const severity = blockedSince > 3 ? 'critical' : 'monitoring'
      
      blockers.push({
        department: name,
        blocker: state.currentFocus,
        days: blockedSince,
        impact: determineBlockerImpact(name, state, os),
        owner: determineBlockerOwner(state, os),
        severity
      })
    }
  }
  
  return blockers
}

function detectCoordinationFailures(os: CompanyOS): string[] {
  const issues: string[] = []
  
  // Check for departments with conflicting goals
  const departments = Object.entries(os.departments)
  
  for (let i = 0; i < departments.length; i++) {
    for (let j = i + 1; j < departments.length; j++) {
      const [name1, state1] = departments[i]
      const [name2, state2] = departments[j]
      
      // Look for conflicting priorities
      const conflict = detectConflict(state1, state2)
      if (conflict) {
        issues.push(`${name1} and ${name2}: ${conflict}`)
      }
    }
  }
  
  return issues
}

function calculateVelocityTrends(os: CompanyOS): VelocityTrend[] {
  const trends: VelocityTrend[] = []
  
  for (const [name, state] of Object.entries(os.departments)) {
    if (name === 'ceo' || name === 'coo') continue
    
    const recentActions = state.memory
      .filter(m => m.includes('ACTION:'))
      .slice(-5)
    
    let score = 3 // baseline
    let trend: 'up' | 'flat' | 'down' = 'flat'
    let reason = 'Maintaining steady pace'
    
    if (recentActions.length >= 4) {
      score = 5
      trend = 'up'
      reason = 'High activity'
    } else if (recentActions.length <= 1) {
      score = 1
      trend = 'down'
      reason = state.status === 'blocked' ? 'Blocked' : 'Low activity'
    }
    
    trends.push({ department: name, score, trend, reason })
  }
  
  return trends
}

function generateRecommendations(
  blockers: BlockerInfo[],
  coordinationIssues: string[],
  velocityTrends: VelocityTrend[]
): string[] {
  const recommendations: string[] = []
  
  // Critical blockers first
  const criticalBlockers = blockers.filter(b => b.severity === 'critical')
  if (criticalBlockers.length > 0) {
    const topBlocker = criticalBlockers[0]
    recommendations.push(
      `Unblock ${topBlocker.department}: ${topBlocker.blocker} (${topBlocker.owner} to resolve)`
    )
  }
  
  // Coordination issues
  if (coordinationIssues.length > 0) {
    recommendations.push(
      `Align ${coordinationIssues[0].split(':')[0]} - schedule sync meeting`
    )
  }
  
  // Velocity concerns
  const slowDepts = velocityTrends.filter(v => v.trend === 'down' && v.score <= 2)
  if (slowDepts.length > 0) {
    recommendations.push(
      `Check in with ${slowDepts[0].department} - ${slowDepts[0].reason}`
    )
  }
  
  // Decision flow
  const agingDecisions = blockers.filter(b => b.blocker.includes('decision'))
  if (agingDecisions.length > 0) {
    recommendations.push(
      `Route aging decisions to CEO briefing for founder input`
    )
  }
  
  return recommendations.slice(0, 3)
}

function getBlockedDuration(state: DepartmentState): number {
  // In real impl, would track when status changed to blocked
  // For now, estimate from last action
  if (!state.lastAction) return 7
  
  const daysSinceAction = daysSince(state.lastAction.timestamp)
  return Math.min(daysSinceAction, 7)
}

function determineBlockerImpact(dept: string, state: DepartmentState, os: CompanyOS): string {
  // Check what other departments depend on this one
  const dependencies = Object.entries(os.departments).filter(([_, s]) =>
    s.pendingDecisions.some(d => d.includes(dept))
  )
  
  if (dependencies.length > 0) {
    return `Blocking ${dependencies.length} other department(s)`
  }
  
  return `${dept} progress halted`
}

function determineBlockerOwner(state: DepartmentState, os: CompanyOS): string {
  // Simple heuristic - look for decision or external dependency
  if (state.currentFocus.toLowerCase().includes('decision')) {
    return 'founder/ceo'
  }
  if (state.currentFocus.toLowerCase().includes('waiting')) {
    // Try to extract what they're waiting on
    return 'external'
  }
  return 'internal'
}

function detectConflict(state1: DepartmentState, state2: DepartmentState): string | null {
  // Check for priority conflicts
  const priority1 = state1.signals.find(s => s.priority === 'critical')
  const priority2 = state2.signals.find(s => s.priority === 'critical')
  
  if (priority1 && priority2 && priority1.type.includes('resource') && priority2.type.includes('resource')) {
    return 'Resource priority conflict'
  }
  
  return null
}

function isRecent(timestamp: string, hours: number): boolean {
  const ts = new Date(timestamp).getTime()
  const now = Date.now()
  return (now - ts) < (hours * 60 * 60 * 1000)
}

function isOlderThan(timestamp: string, hours: number): boolean {
  return !isRecent(timestamp, hours)
}

function daysSince(timestamp: string): number {
  const ts = new Date(timestamp).getTime()
  const now = Date.now()
  return Math.floor((now - ts) / (24 * 60 * 60 * 1000))
}

function formatOperationsStatus(
  health: OperationsHealth,
  blockers: BlockerInfo[],
  coordinationIssues: string[],
  velocityTrends: VelocityTrend[],
  recommendations: string[]
): string {
  const lines: string[] = []
  
  lines.push(`OPERATIONS STATUS · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  lines.push('EXECUTION HEALTH')
  
  const healthMetrics = [
    ['Velocity', health.velocity, `${velocityTrends.filter(v => v.score >= 4).length} departments active`],
    ['Blockers', health.blockers, `${blockers.length} active blockers`],
    ['Coordination', health.coordination, coordinationIssues.length === 0 ? 'Departments aligned' : `${coordinationIssues.length} conflicts`],
    ['Decision Flow', health.decisionFlow, 'Decision routing']
  ]
  
  for (const [label, score, description] of healthMetrics) {
    const bars = '█'.repeat(score) + '░'.repeat(5 - score)
    const padding = ' '.repeat(16 - label.length)
    lines.push(`${label}:${padding}${bars} (${score}/5) - ${description}`)
  }
  
  if (blockers.length > 0) {
    lines.push('')
    lines.push('ACTIVE BLOCKERS')
    
    const critical = blockers.filter(b => b.severity === 'critical')
    if (critical.length > 0) {
      lines.push('🔴 CRITICAL')
      for (const b of critical) {
        lines.push(`· ${b.department} blocked on ${b.blocker} - ${b.days} days`)
        lines.push(`  Impact: ${b.impact}`)
        lines.push(`  Owner: ${b.owner}`)
      }
    }
    
    const monitoring = blockers.filter(b => b.severity === 'monitoring')
    if (monitoring.length > 0) {
      lines.push('')
      lines.push('🟡 MONITORING')
      for (const b of monitoring) {
        lines.push(`· ${b.department} waiting on ${b.blocker} - ${b.days} days`)
        lines.push(`  Impact: ${b.impact}`)
      }
    }
  }
  
  if (coordinationIssues.length > 0) {
    lines.push('')
    lines.push('COORDINATION ISSUES')
    for (const issue of coordinationIssues) {
      lines.push(`· ${issue}`)
    }
  }
  
  lines.push('')
  lines.push('VELOCITY TRENDS')
  for (const trend of velocityTrends.slice(0, 5)) {
    const bars = '█'.repeat(trend.score) + '░'.repeat(5 - trend.score)
    const arrow = trend.trend === 'up' ? '↑' : trend.trend === 'down' ? '↓' : '→'
    const padding = ' '.repeat(12 - trend.department.length)
    lines.push(`${trend.department}${padding}${bars} ${arrow}  ${trend.reason}`)
  }
  
  if (recommendations.length > 0) {
    lines.push('')
    lines.push('RECOMMENDATIONS')
    for (let i = 0; i < recommendations.length; i++) {
      lines.push(`${i + 1}. ${recommendations[i]}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.*` — all department states and signals
- `company.os.events` — recent activity for velocity tracking
- `company.os.decisions` — pending decisions causing blocks

**Emits:**
- `blocker-flagged` → alerts CEO and affected departments
- `coordination-failure` → triggers alignment meeting
- `velocity-drop` → warns of execution slowdown

**Consumed by:**
- CEO briefing (includes operational health)
- All departments (receive blocker notifications)
- Process agent (uses patterns to improve workflows)
