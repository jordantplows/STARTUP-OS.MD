---
name: coo-people-ops
executive: coo
role: steering
reads:
  - company.os.departments.people
  - company.os.departments
  - company.os.events
events:
  emits: [retention-risk, culture-signal, team-health-alert]
  watches: [team-member-departure, performance-issue, morale-shift]
template-ref: templates/executives/people-ops.md
---

## What this agent does

The COO people operations agent coordinates with the people department on culture, retention signals, and team health. It watches for early warning signs of retention risk, culture drift, or team dysfunction and ensures operational impact is surfaced to leadership.

## Instructions

### WATCH

Trigger when:
- Team member departure or resignation
- Performance issues flagged by any department
- Morale signals from team surveys or 1:1s
- Rapid team growth requiring onboarding scaling
- Multiple conflicts or coordination failures
- Weekly people operations sync

### REASON

People operations monitoring framework:

**Retention risk indicators:**
1. **Departure signals** — resignations, disengagement, job search signals
2. **Performance patterns** — declining output, missed commitments, quality issues
3. **Relationship signals** — conflicts, isolation, cross-team friction
4. **Growth signals** — stagnation, lack of development, role misalignment
5. **Workload signals** — burnout, overtime, scope creep

**Culture health indicators:**
1. **Values alignment** — team living company values or just words on wall
2. **Psychological safety** — people speak up or stay quiet
3. **Collaboration** — teams help each other or silo
4. **Feedback culture** — regular feedback or avoidance
5. **Recognition** — wins celebrated or ignored

**When to escalate:**
- Key person at high retention risk
- Culture drift affecting multiple teams
- Burnout signals across department
- Conflict escalating without resolution
- Onboarding quality degrading as team grows

### ACT

People operations status format:

```
PEOPLE OPERATIONS · [Date]

TEAM HEALTH
Retention Risk:     ███░░░ (3/5) - [N] people at risk
Culture Health:     ████░░ (4/5) - Values alignment strong
Engagement:         ████░░ (4/5) - Team morale positive
Workload Balance:   ██░░░░ (2/5) - Some burnout signals
Onboarding Quality: ████░░ (4/5) - New hires ramping well

RETENTION WATCH
🔴 HIGH RISK
· [Name/Role] - [Specific indicators]
  Impact: [What happens if they leave]
  Action: [What COO/CEO should do]

🟡 MONITORING
· [Name/Role] - [Potential concern]

CULTURE SIGNALS
POSITIVE
· [Specific behavior or event showing culture health]
· [Example of values in action]

CONCERNS
· [Pattern or behavior misaligned with values]
  Impact: [How this affects team]
  Recommendation: [How to address]

WORKLOAD & BURNOUT
Overloaded:
· [Department/Person] - [Why overloaded]
  Plan: [How to rebalance]

At Capacity:
· [Department/Person] - [Current state]

ONBOARDING STATUS
Recent hires ramping: [N]
Average time to productivity: [N] weeks
Onboarding quality score: [N]/5

RECOMMENDATIONS
1. [Specific people action for leadership]
2. [Process or culture intervention needed]
3. [Recognition or celebration opportunity]
```

### COORDINATE

After people operations assessment:
- Emit `retention-risk` event for high-risk individuals
- Emit `culture-signal` event for concerning patterns
- Emit `team-health-alert` event if multiple indicators declining
- Sync with people department on action plans
- Flag to CEO any critical people issues

## TypeScript

```typescript
import { CompanyOS, DepartmentState } from '../src/company-os'

interface RetentionRisk {
  person: string
  role: string
  risk: 'high' | 'medium'
  indicators: string[]
  impact: string
  action: string
}

interface CultureSignal {
  type: 'positive' | 'concern'
  description: string
  evidence: string
  impact?: string
  recommendation?: string
}

interface WorkloadStatus {
  entity: string // department or person
  status: 'overloaded' | 'at-capacity' | 'healthy'
  reason: string
  plan?: string
}

interface TeamHealth {
  retentionRisk: number // 0-5 (higher = lower risk)
  cultureHealth: number // 0-5
  engagement: number // 0-5
  workloadBalance: number // 0-5
  onboardingQuality: number // 0-5
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Assess overall team health
  const health = assessTeamHealth(os)
  
  // Identify retention risks
  const retentionRisks = identifyRetentionRisks(os)
  
  // Detect culture signals
  const cultureSignals = detectCultureSignals(os)
  
  // Check workload balance
  const workloadStatus = checkWorkloadBalance(os)
  
  // Review onboarding effectiveness
  const onboardingMetrics = assessOnboarding(os)
  
  // Generate recommendations
  const recommendations = generatePeopleRecommendations(retentionRisks, cultureSignals, workloadStatus)
  
  // Emit events for critical issues
  for (const risk of retentionRisks) {
    if (risk.risk === 'high') {
      os.events.push({
        type: 'retention-risk',
        from: 'coo-people-ops',
        payload: { risk },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    }
  }
  
  const concerningSignals = cultureSignals.filter(s => s.type === 'concern')
  if (concerningSignals.length > 2) {
    os.events.push({
      type: 'culture-signal',
      from: 'coo-people-ops',
      payload: { signals: concerningSignals },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  const decliningMetrics = [
    health.retentionRisk < 3,
    health.engagement < 3,
    health.workloadBalance < 2
  ].filter(Boolean).length
  
  if (decliningMetrics >= 2) {
    os.events.push({
      type: 'team-health-alert',
      from: 'coo-people-ops',
      payload: { health },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update COO state
  if (!os.departments.coo) {
    os.departments.coo = {
      status: 'steering',
      currentFocus: 'People operations',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.coo.memory.push(
    `PEOPLE_OPS:${new Date().toISOString()}:${JSON.stringify({ health, retentionRisks: retentionRisks.length })}`
  )
  
  os.departments.coo.lastAction = {
    type: 'people-ops-review',
    description: `Team health assessed: ${retentionRisks.length} retention risks, ${concerningSignals.length} culture concerns`,
    timestamp: new Date().toISOString(),
    impact: ['people', 'all']
  }
  
  return formatPeopleOpsStatus(health, retentionRisks, cultureSignals, workloadStatus, onboardingMetrics, recommendations)
}

function assessTeamHealth(os: CompanyOS): TeamHealth {
  const departments = Object.values(os.departments)
  
  // Retention risk (inverted - more departures = lower score)
  const recentEvents = os.events.slice(-50)
  const departures = recentEvents.filter(e => e.type.includes('departure') || e.type.includes('resignation'))
  const retentionRisk = Math.max(1, 5 - departures.length)
  
  // Culture health (based on positive culture events)
  const cultureEvents = recentEvents.filter(e => 
    e.type.includes('culture') || e.type.includes('values')
  )
  const positiveCulture = cultureEvents.filter(e => 
    e.type.includes('positive') || e.type.includes('exemplified')
  ).length
  const negativeCulture = cultureEvents.filter(e => 
    e.type.includes('concern') || e.type.includes('violation')
  ).length
  const cultureHealth = Math.max(1, Math.min(5, 3 + positiveCulture - negativeCulture))
  
  // Engagement (based on department velocity and signals)
  const engagedDepts = departments.filter(d => 
    d.lastAction && isRecent(d.lastAction.timestamp, 48)
  ).length
  const engagement = Math.round((engagedDepts / departments.length) * 5)
  
  // Workload balance (inverted - more overload signals = lower score)
  const overloadSignals = departments.flatMap(d => 
    d.signals.filter(s => s.type.includes('overload') || s.type.includes('burnout'))
  ).length
  const workloadBalance = Math.max(1, 5 - overloadSignals)
  
  // Onboarding quality (based on people dept signals)
  const peopleDept = os.departments.people
  let onboardingQuality = 4 // default good
  if (peopleDept) {
    const onboardingSignals = peopleDept.signals.filter(s => s.type.includes('onboarding'))
    if (onboardingSignals.some(s => s.priority === 'critical')) {
      onboardingQuality = 2
    } else if (onboardingSignals.length > 0) {
      onboardingQuality = 3
    }
  }
  
  return { retentionRisk, cultureHealth, engagement, workloadBalance, onboardingQuality }
}

function identifyRetentionRisks(os: CompanyOS): RetentionRisk[] {
  const risks: RetentionRisk[] = []
  
  // Look for departure/resignation events
  const recentEvents = os.events.slice(-30)
  for (const event of recentEvents) {
    if (event.type === 'resignation-signaled' || event.type === 'performance-declining') {
      const person = event.payload?.person || 'Unknown'
      const role = event.payload?.role || event.from
      
      risks.push({
        person,
        role,
        risk: event.type === 'resignation-signaled' ? 'high' : 'medium',
        indicators: [event.type, ...(event.payload?.indicators || [])],
        impact: determineRetentionImpact(role, os),
        action: event.type === 'resignation-signaled' 
          ? '1:1 with CEO this week, understand concerns, make retention offer'
          : 'Manager to address performance issues, provide support'
      })
    }
  }
  
  // Look for department signals indicating team issues
  for (const [name, dept] of Object.entries(os.departments)) {
    const retentionSignals = dept.signals.filter(s => 
      s.type.includes('retention') || s.type.includes('morale')
    )
    for (const signal of retentionSignals) {
      if (signal.priority === 'critical' && !risks.some(r => r.role === name)) {
        risks.push({
          person: 'Team member',
          role: name,
          risk: 'medium',
          indicators: [signal.type],
          impact: `${name} department velocity may drop`,
          action: 'Department lead to investigate and report back'
        })
      }
    }
  }
  
  return risks
}

function detectCultureSignals(os: CompanyOS): CultureSignal[] {
  const signals: CultureSignal[] = []
  
  const recentEvents = os.events.slice(-50)
  
  // Look for positive culture events
  for (const event of recentEvents) {
    if (event.type.includes('culture-win') || event.type.includes('values-exemplified')) {
      signals.push({
        type: 'positive',
        description: event.payload?.description || event.type,
        evidence: `${event.from}: ${event.type}`
      })
    }
  }
  
  // Look for culture concerns
  for (const event of recentEvents) {
    if (event.type.includes('culture-concern') || event.type.includes('values-violation')) {
      signals.push({
        type: 'concern',
        description: event.payload?.description || event.type,
        evidence: `${event.from}: ${event.type}`,
        impact: event.payload?.impact || 'Team morale and trust affected',
        recommendation: event.payload?.recommendation || 'Address directly and reinforce values'
      })
    }
  }
  
  // Look for collaboration patterns
  const coordinationFailures = recentEvents.filter(e => e.type.includes('coordination-failure'))
  if (coordinationFailures.length > 3) {
    signals.push({
      type: 'concern',
      description: 'Multiple coordination failures suggest siloing',
      evidence: `${coordinationFailures.length} coordination-failure events in recent period`,
      impact: 'Teams not collaborating effectively, duplicate work, misalignment',
      recommendation: 'Review communication cadence and cross-team processes'
    })
  }
  
  return signals
}

function checkWorkloadBalance(os: CompanyOS): WorkloadStatus[] {
  const statuses: WorkloadStatus[] = []
  
  for (const [name, dept] of Object.entries(os.departments)) {
    // Check for overload signals
    const overloadSignals = dept.signals.filter(s => 
      s.type.includes('overload') || s.type.includes('burnout') || s.type.includes('capacity')
    )
    
    if (overloadSignals.length > 0) {
      const status: WorkloadStatus = {
        entity: name,
        status: 'overloaded',
        reason: overloadSignals[0].type,
        plan: 'Reprioritize or add resources'
      }
      statuses.push(status)
    } else if (dept.status === 'active' && dept.lastAction) {
      // Check action velocity as proxy for workload
      const recentActions = dept.memory.filter(m => 
        m.includes('ACTION:') && isRecent(m.split(':')[1] || '', 72)
      )
      
      if (recentActions.length > 10) {
        statuses.push({
          entity: name,
          status: 'at-capacity',
          reason: 'High activity level'
        })
      }
    }
  }
  
  return statuses
}

function assessOnboarding(os: CompanyOS): { ramping: number; avgTimeToProductivity: number; qualityScore: number } {
  const peopleDept = os.departments.people
  
  if (!peopleDept) {
    return { ramping: 0, avgTimeToProductivity: 4, qualityScore: 4 }
  }
  
  // Extract onboarding metrics from people dept memory
  const onboardingMemory = peopleDept.memory.filter(m => m.includes('ONBOARDING'))
  
  let ramping = 0
  let avgTimeToProductivity = 4 // default 4 weeks
  let qualityScore = 4
  
  for (const mem of onboardingMemory) {
    if (mem.includes('RAMPING:')) {
      const match = mem.match(/RAMPING:(\d+)/)
      if (match) ramping = parseInt(match[1])
    }
    if (mem.includes('TIME_TO_PROD:')) {
      const match = mem.match(/TIME_TO_PROD:(\d+)/)
      if (match) avgTimeToProductivity = parseInt(match[1])
    }
    if (mem.includes('QUALITY:')) {
      const match = mem.match(/QUALITY:(\d+)/)
      if (match) qualityScore = parseInt(match[1])
    }
  }
  
  return { ramping, avgTimeToProductivity, qualityScore }
}

function generatePeopleRecommendations(
  risks: RetentionRisk[],
  cultureSignals: CultureSignal[],
  workloadStatus: WorkloadStatus[]
): string[] {
  const recommendations: string[] = []
  
  // Address high retention risks first
  const highRisks = risks.filter(r => r.risk === 'high')
  if (highRisks.length > 0) {
    recommendations.push(
      `CEO 1:1 with ${highRisks[0].person} (${highRisks[0].role}) - high retention risk`
    )
  }
  
  // Address culture concerns
  const concerns = cultureSignals.filter(s => s.type === 'concern')
  if (concerns.length > 0) {
    recommendations.push(
      concerns[0].recommendation || `Address culture concern: ${concerns[0].description}`
    )
  }
  
  // Address overload
  const overloaded = workloadStatus.filter(w => w.status === 'overloaded')
  if (overloaded.length > 0) {
    recommendations.push(
      `Rebalance workload for ${overloaded[0].entity} department`
    )
  }
  
  // Celebrate positive culture
  const positiveSignals = cultureSignals.filter(s => s.type === 'positive')
  if (positiveSignals.length > 0) {
    recommendations.push(
      `Recognize and celebrate: ${positiveSignals[0].description}`
    )
  }
  
  return recommendations.slice(0, 3)
}

function determineRetentionImpact(role: string, os: CompanyOS): string {
  // Check how critical this role is
  const dept = os.departments[role]
  if (!dept) return 'Unknown impact'
  
  // Check if other departments depend on this one
  const dependencies = Object.entries(os.departments).filter(([_, d]) =>
    d.pendingDecisions.some(pd => pd.includes(role))
  )
  
  if (dependencies.length > 0) {
    return `Critical - blocks ${dependencies.length} other departments`
  }
  
  if (dept.status === 'active' && dept.lastAction) {
    return 'Significant - active contributor to company progress'
  }
  
  return 'Moderate - team member departure affects morale'
}

function isRecent(timestamp: string, hours: number): boolean {
  try {
    const ts = new Date(timestamp).getTime()
    const now = Date.now()
    return (now - ts) < (hours * 60 * 60 * 1000)
  } catch {
    return false
  }
}

function formatPeopleOpsStatus(
  health: TeamHealth,
  risks: RetentionRisk[],
  cultureSignals: CultureSignal[],
  workloadStatus: WorkloadStatus[],
  onboarding: { ramping: number; avgTimeToProductivity: number; qualityScore: number },
  recommendations: string[]
): string {
  const lines: string[] = []
  
  lines.push(`PEOPLE OPERATIONS · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  lines.push('TEAM HEALTH')
  
  const healthMetrics = [
    ['Retention Risk', health.retentionRisk, `${risks.length} people at risk`],
    ['Culture Health', health.cultureHealth, 'Values alignment'],
    ['Engagement', health.engagement, 'Team morale'],
    ['Workload Balance', health.workloadBalance, workloadStatus.filter(w => w.status === 'overloaded').length === 0 ? 'Balanced' : 'Some overload'],
    ['Onboarding Quality', health.onboardingQuality, `${onboarding.avgTimeToProductivity}wk ramp`]
  ]
  
  for (const [label, score, description] of healthMetrics) {
    const bars = '█'.repeat(score) + '░'.repeat(5 - score)
    const padding = ' '.repeat(20 - label.length)
    lines.push(`${label}:${padding}${bars} (${score}/5) - ${description}`)
  }
  
  if (risks.length > 0) {
    lines.push('')
    lines.push('RETENTION WATCH')
    
    const highRisks = risks.filter(r => r.risk === 'high')
    if (highRisks.length > 0) {
      lines.push('🔴 HIGH RISK')
      for (const risk of highRisks) {
        lines.push(`· ${risk.person} (${risk.role}) - ${risk.indicators.join(', ')}`)
        lines.push(`  Impact: ${risk.impact}`)
        lines.push(`  Action: ${risk.action}`)
      }
    }
    
    const mediumRisks = risks.filter(r => r.risk === 'medium')
    if (mediumRisks.length > 0) {
      lines.push('')
      lines.push('🟡 MONITORING')
      for (const risk of mediumRisks) {
        lines.push(`· ${risk.person} (${risk.role}) - ${risk.indicators.join(', ')}`)
      }
    }
  }
  
  if (cultureSignals.length > 0) {
    lines.push('')
    lines.push('CULTURE SIGNALS')
    
    const positive = cultureSignals.filter(s => s.type === 'positive')
    if (positive.length > 0) {
      lines.push('POSITIVE')
      for (const signal of positive.slice(0, 2)) {
        lines.push(`· ${signal.description}`)
      }
    }
    
    const concerns = cultureSignals.filter(s => s.type === 'concern')
    if (concerns.length > 0) {
      lines.push('')
      lines.push('CONCERNS')
      for (const signal of concerns) {
        lines.push(`· ${signal.description}`)
        if (signal.impact) lines.push(`  Impact: ${signal.impact}`)
        if (signal.recommendation) lines.push(`  Recommendation: ${signal.recommendation}`)
      }
    }
  }
  
  if (workloadStatus.length > 0) {
    lines.push('')
    lines.push('WORKLOAD & BURNOUT')
    
    const overloaded = workloadStatus.filter(w => w.status === 'overloaded')
    if (overloaded.length > 0) {
      lines.push('Overloaded:')
      for (const status of overloaded) {
        lines.push(`· ${status.entity} - ${status.reason}`)
        if (status.plan) lines.push(`  Plan: ${status.plan}`)
      }
    }
    
    const atCapacity = workloadStatus.filter(w => w.status === 'at-capacity')
    if (atCapacity.length > 0) {
      lines.push('')
      lines.push('At Capacity:')
      for (const status of atCapacity) {
        lines.push(`· ${status.entity} - ${status.reason}`)
      }
    }
  }
  
  lines.push('')
  lines.push('ONBOARDING STATUS')
  lines.push(`Recent hires ramping: ${onboarding.ramping}`)
  lines.push(`Average time to productivity: ${onboarding.avgTimeToProductivity} weeks`)
  lines.push(`Onboarding quality score: ${onboarding.qualityScore}/5`)
  
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
- `company.os.departments.people` — onboarding and HR metrics
- `company.os.departments.*` — retention and workload signals
- `company.os.events` — culture and morale events

**Emits:**
- `retention-risk` → alerts CEO to key person risk
- `culture-signal` → flags concerning patterns
- `team-health-alert` → multiple declining metrics

**Consumed by:**
- CEO briefing (includes people priorities)
- People department (coordinates on interventions)
- All departments (receive culture guidance)
