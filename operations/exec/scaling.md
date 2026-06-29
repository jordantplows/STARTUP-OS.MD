---
name: coo-scaling
executive: coo
role: steering
reads:
  - company.os.profile
  - company.os.departments
  - company.os.events
events:
  emits: [scaling-threshold-approaching, playbook-ready, process-breaking]
  watches: [team-size-change, revenue-milestone, customer-count-increase]
template-ref: templates/executives/scaling.md
---

## What this agent does

The COO scaling agent identifies breaking points as the company grows and prepares playbooks for the next stage. It watches for scaling thresholds approaching and ensures the company has the systems, processes, and structure ready before growth outpaces capability.

## Instructions

### WATCH

Trigger when:
- Team size crosses scaling thresholds (10, 25, 50, 100)
- Revenue crosses stage boundaries (first $10K MRR, $100K ARR, $1M ARR)
- Customer count grows significantly (10x in 3 months)
- Department signals "can't scale current approach"
- Founder asks about readiness for next stage

### REASON

Scaling assessment framework:

**Key thresholds to monitor:**

1. **Team size:**
   - 10 people: Need management layer, clear roles
   - 25 people: Need department structure, communication systems
   - 50 people: Need process documentation, HR function
   - 100 people: Need middle management, specialized functions

2. **Revenue:**
   - $10K MRR: Repeatable sales motion needed
   - $100K ARR: Sales/CS team structure required
   - $1M ARR: Need finance/ops function, forecasting
   - $10M ARR: Executive team, board governance

3. **Customers:**
   - 10 customers: Manual onboarding works
   - 100 customers: Need self-service and automation
   - 1000 customers: Need customer success tier, support tools
   - 10000+ customers: Need platform stability, SLA management

**What breaks at each threshold:**
- Current communication patterns
- Decision-making processes
- Customer onboarding/support
- Engineering deployment practices
- Financial planning and tracking
- Hiring and onboarding processes

### ACT

Scaling assessment format:

```
SCALING ASSESSMENT · [Date]

CURRENT STAGE
Team:         [N] people
Revenue:      $[X] [MRR/ARR]
Customers:    [N] active
Growth Rate:  [X]% month-over-month

NEXT THRESHOLD
Approaching:  [threshold name] at ~[N] months
Readiness:    ███░░░ (3/5)

WHAT WILL BREAK
🔴 IMMINENT (0-3 months)
· [Specific system/process] - [why it breaks] - [impact]
  Playbook: [link or status]

🟡 SOON (3-6 months)
· [Specific system/process] - [why it breaks] - [impact]
  Playbook: [link or status]

🟢 PREPARING (6-12 months)
· [Specific system/process] - [why it breaks] - [impact]
  Playbook: [link or status]

PLAYBOOKS NEEDED
1. [Playbook name]
   Status: [not-started | in-progress | ready]
   Owner: [who's building it]
   Due: [when needed]

2. [Playbook name]
   Status: [not-started | in-progress | ready]
   Owner: [who's building it]
   Due: [when needed]

RECOMMENDATIONS
1. [Specific action to prepare for next threshold]
2. [Hire or system to put in place]
3. [Process to document before it's needed]
```

### COORDINATE

After scaling assessment:
- Emit `scaling-threshold-approaching` event with timeline
- Emit `playbook-ready` event when scaling playbook is complete
- Emit `process-breaking` event if current system at capacity
- Update `company.os.departments.coo` with scaling focus
- Create decisions for founder on hiring or system investments

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface ScalingThreshold {
  name: string
  metric: 'team' | 'revenue' | 'customers'
  current: number
  threshold: number
  monthsUntil: number
  readiness: number // 0-5
}

interface BreakingPoint {
  system: string
  reason: string
  impact: string
  urgency: 'imminent' | 'soon' | 'preparing'
  playbookStatus: 'not-started' | 'in-progress' | 'ready'
}

interface ScalingPlaybook {
  name: string
  status: 'not-started' | 'in-progress' | 'ready'
  owner: string
  due: string
  threshold: string
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Determine current scaling metrics
  const metrics = extractScalingMetrics(os)
  
  // Identify next threshold
  const nextThreshold = identifyNextThreshold(metrics)
  
  // Assess readiness for next stage
  const readiness = assessScalingReadiness(os, nextThreshold)
  
  // Identify what will break
  const breakingPoints = identifyBreakingPoints(os, metrics, nextThreshold)
  
  // Check status of scaling playbooks
  const playbooks = getScalingPlaybooks(os, nextThreshold)
  
  // Generate recommendations
  const recommendations = generateScalingRecommendations(breakingPoints, playbooks, nextThreshold)
  
  // Emit events for approaching thresholds
  if (nextThreshold.monthsUntil <= 3) {
    os.events.push({
      type: 'scaling-threshold-approaching',
      from: 'coo-scaling',
      payload: { threshold: nextThreshold, readiness },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Emit events for breaking processes
  const imminentBreaks = breakingPoints.filter(bp => bp.urgency === 'imminent')
  for (const bp of imminentBreaks) {
    os.events.push({
      type: 'process-breaking',
      from: 'coo-scaling',
      payload: { breakingPoint: bp },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Emit events for ready playbooks
  const readyPlaybooks = playbooks.filter(p => p.status === 'ready')
  for (const playbook of readyPlaybooks) {
    const alreadyEmitted = os.events.some(e => 
      e.type === 'playbook-ready' && 
      e.payload.playbookName === playbook.name
    )
    if (!alreadyEmitted) {
      os.events.push({
        type: 'playbook-ready',
        from: 'coo-scaling',
        payload: { playbookName: playbook.name },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    }
  }
  
  // Update COO state
  if (!os.departments.coo) {
    os.departments.coo = {
      status: 'steering',
      currentFocus: 'Scaling preparation',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.coo.memory.push(
    `SCALING_ASSESSMENT:${new Date().toISOString()}:${JSON.stringify({ metrics, nextThreshold, readiness })}`
  )
  
  os.departments.coo.lastAction = {
    type: 'scaling-assessed',
    description: `Next threshold: ${nextThreshold.name} in ~${nextThreshold.monthsUntil} months`,
    timestamp: new Date().toISOString(),
    impact: ['all']
  }
  
  return formatScalingAssessment(metrics, nextThreshold, readiness, breakingPoints, playbooks, recommendations)
}

function extractScalingMetrics(os: CompanyOS): { team: number; revenue: number; customers: number; growthRate: number } {
  // Extract from company profile and department states
  const teamSize = Object.keys(os.departments).length // Rough proxy
  const revenue = os.profile.revenue
  
  // Try to extract customer count from customer-success or sales dept
  let customers = 0
  const salesDept = os.departments.sales
  if (salesDept) {
    const customerMemory = salesDept.memory.find(m => m.includes('CUSTOMERS:'))
    if (customerMemory) {
      const match = customerMemory.match(/CUSTOMERS:(\d+)/)
      if (match) customers = parseInt(match[1])
    }
  }
  
  // Calculate growth rate from recent memory
  const growthRate = calculateGrowthRate(os)
  
  return { team: teamSize, revenue, customers, growthRate }
}

function calculateGrowthRate(os: CompanyOS): number {
  // Simple heuristic - would track historical metrics in real impl
  const stage = os.profile.stage
  
  if (stage === 'idea' || stage === 'validating') return 0
  if (stage === 'building') return 15 // 15% monthly
  if (stage === 'revenue') return 25 // 25% monthly
  if (stage === 'growth') return 40 // 40% monthly
  
  return 10
}

function identifyNextThreshold(metrics: { team: number; revenue: number; customers: number; growthRate: number }): ScalingThreshold {
  const thresholds: ScalingThreshold[] = []
  
  // Team thresholds
  const teamThresholds = [10, 25, 50, 100]
  for (const t of teamThresholds) {
    if (metrics.team < t) {
      const monthsToGrow = Math.ceil((t - metrics.team) / (metrics.team * (metrics.growthRate / 100)))
      thresholds.push({
        name: `${t} person team`,
        metric: 'team',
        current: metrics.team,
        threshold: t,
        monthsUntil: monthsToGrow,
        readiness: 3
      })
      break
    }
  }
  
  // Revenue thresholds
  const revenueThresholds = [10000, 100000, 1000000, 10000000]
  for (const t of revenueThresholds) {
    if (metrics.revenue < t) {
      const monthsToGrow = metrics.revenue > 0 
        ? Math.ceil(Math.log(t / metrics.revenue) / Math.log(1 + metrics.growthRate / 100))
        : 12
      thresholds.push({
        name: `$${t >= 1000000 ? (t / 1000000) + 'M' : (t / 1000) + 'K'} ${t >= 100000 ? 'ARR' : 'MRR'}`,
        metric: 'revenue',
        current: metrics.revenue,
        threshold: t,
        monthsUntil: Math.min(monthsToGrow, 24),
        readiness: 3
      })
      break
    }
  }
  
  // Return soonest threshold
  thresholds.sort((a, b) => a.monthsUntil - b.monthsUntil)
  return thresholds[0] || {
    name: 'Current scale',
    metric: 'team',
    current: metrics.team,
    threshold: metrics.team,
    monthsUntil: 12,
    readiness: 5
  }
}

function assessScalingReadiness(os: CompanyOS, threshold: ScalingThreshold): number {
  // Check if company has systems in place for next stage
  let readiness = 3 // baseline
  
  // Check for process documentation
  const processDept = os.departments.operations
  if (processDept && processDept.memory.some(m => m.includes('PROCESS_DOCUMENTED'))) {
    readiness += 1
  }
  
  // Check for management structure
  if (threshold.threshold >= 25 && os.departments.people) {
    readiness += 1
  }
  
  // Check for blockers
  const blockedCount = Object.values(os.departments).filter(d => d.status === 'blocked').length
  if (blockedCount > 3) {
    readiness -= 1
  }
  
  return Math.max(1, Math.min(5, readiness))
}

function identifyBreakingPoints(
  os: CompanyOS,
  metrics: { team: number; revenue: number; customers: number; growthRate: number },
  threshold: ScalingThreshold
): BreakingPoint[] {
  const breaks: BreakingPoint[] = []
  
  if (threshold.name.includes('25 person team')) {
    breaks.push({
      system: 'All-hands communication',
      reason: 'Above 25 people, everyone-in-one-room meetings become inefficient',
      impact: 'Information silos, alignment issues',
      urgency: threshold.monthsUntil <= 3 ? 'imminent' : 'soon',
      playbookStatus: 'not-started'
    })
    breaks.push({
      system: 'Hiring process',
      reason: 'Need structured interview and onboarding',
      impact: 'Bad hires, slow ramp time',
      urgency: threshold.monthsUntil <= 3 ? 'imminent' : 'soon',
      playbookStatus: 'not-started'
    })
  }
  
  if (threshold.name.includes('100K ARR')) {
    breaks.push({
      system: 'Financial tracking',
      reason: 'Need real bookkeeping, not just bank balance',
      impact: 'No visibility into unit economics',
      urgency: threshold.monthsUntil <= 3 ? 'imminent' : 'soon',
      playbookStatus: 'not-started'
    })
    breaks.push({
      system: 'Sales process',
      reason: 'Founder-led sales won\'t scale',
      impact: 'Growth bottlenecked on founder time',
      urgency: threshold.monthsUntil <= 6 ? 'soon' : 'preparing',
      playbookStatus: 'not-started'
    })
  }
  
  if (threshold.name.includes('100') && threshold.metric === 'customers') {
    breaks.push({
      system: 'Manual onboarding',
      reason: 'Can\'t manually onboard 100+ customers',
      impact: 'Customer experience degrades, churn increases',
      urgency: threshold.monthsUntil <= 3 ? 'imminent' : 'soon',
      playbookStatus: 'not-started'
    })
  }
  
  // Check if engineering is signaling scale issues
  const engineering = os.departments.engineering
  if (engineering?.signals.some(s => s.type.includes('scale'))) {
    breaks.push({
      system: 'Engineering infrastructure',
      reason: 'Current architecture hitting limits',
      impact: 'Slow deploys, outages, can\'t ship features',
      urgency: 'imminent',
      playbookStatus: 'in-progress'
    })
  }
  
  return breaks
}

function getScalingPlaybooks(os: CompanyOS, threshold: ScalingThreshold): ScalingPlaybook[] {
  const playbooks: ScalingPlaybook[] = []
  
  // Generate playbooks based on threshold
  if (threshold.name.includes('25 person')) {
    playbooks.push({
      name: 'Department Structure & Communication Cadence',
      status: 'not-started',
      owner: 'coo',
      due: `In ${threshold.monthsUntil} months`,
      threshold: threshold.name
    })
    playbooks.push({
      name: 'Hiring & Onboarding Process',
      status: 'not-started',
      owner: 'people',
      due: `In ${threshold.monthsUntil} months`,
      threshold: threshold.name
    })
  }
  
  if (threshold.name.includes('ARR')) {
    playbooks.push({
      name: 'Sales Playbook & Handoff Process',
      status: 'not-started',
      owner: 'sales',
      due: `In ${threshold.monthsUntil} months`,
      threshold: threshold.name
    })
  }
  
  return playbooks
}

function generateScalingRecommendations(
  breakingPoints: BreakingPoint[],
  playbooks: ScalingPlaybook[],
  threshold: ScalingThreshold
): string[] {
  const recommendations: string[] = []
  
  // Address imminent breaking points first
  const imminent = breakingPoints.filter(bp => bp.urgency === 'imminent')
  if (imminent.length > 0) {
    recommendations.push(
      `Start playbook for "${imminent[0].system}" - will break in <3 months`
    )
  }
  
  // Start playbooks that aren't in progress
  const notStarted = playbooks.filter(p => p.status === 'not-started')
  if (notStarted.length > 0) {
    recommendations.push(
      `Assign owner to "${notStarted[0].name}" playbook`
    )
  }
  
  // Prepare for threshold
  if (threshold.monthsUntil <= 6) {
    recommendations.push(
      `Review ${threshold.name} readiness - ${threshold.monthsUntil} months out`
    )
  }
  
  return recommendations.slice(0, 3)
}

function formatScalingAssessment(
  metrics: { team: number; revenue: number; customers: number; growthRate: number },
  threshold: ScalingThreshold,
  readiness: number,
  breakingPoints: BreakingPoint[],
  playbooks: ScalingPlaybook[],
  recommendations: string[]
): string {
  const lines: string[] = []
  
  lines.push(`SCALING ASSESSMENT · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  lines.push('CURRENT STAGE')
  lines.push(`Team:         ${metrics.team} people`)
  lines.push(`Revenue:      $${metrics.revenue.toLocaleString()} ${metrics.revenue >= 100000 ? 'ARR' : 'MRR'}`)
  lines.push(`Customers:    ${metrics.customers} active`)
  lines.push(`Growth Rate:  ${metrics.growthRate}% month-over-month`)
  lines.push('')
  lines.push('NEXT THRESHOLD')
  lines.push(`Approaching:  ${threshold.name} at ~${threshold.monthsUntil} months`)
  const readinessBar = '█'.repeat(readiness) + '░'.repeat(5 - readiness)
  lines.push(`Readiness:    ${readinessBar} (${readiness}/5)`)
  
  if (breakingPoints.length > 0) {
    lines.push('')
    lines.push('WHAT WILL BREAK')
    
    const imminent = breakingPoints.filter(bp => bp.urgency === 'imminent')
    if (imminent.length > 0) {
      lines.push('🔴 IMMINENT (0-3 months)')
      for (const bp of imminent) {
        lines.push(`· ${bp.system} - ${bp.reason}`)
        lines.push(`  Impact: ${bp.impact}`)
        lines.push(`  Playbook: ${bp.playbookStatus}`)
      }
    }
    
    const soon = breakingPoints.filter(bp => bp.urgency === 'soon')
    if (soon.length > 0) {
      lines.push('')
      lines.push('🟡 SOON (3-6 months)')
      for (const bp of soon) {
        lines.push(`· ${bp.system} - ${bp.reason}`)
        lines.push(`  Impact: ${bp.impact}`)
        lines.push(`  Playbook: ${bp.playbookStatus}`)
      }
    }
    
    const preparing = breakingPoints.filter(bp => bp.urgency === 'preparing')
    if (preparing.length > 0) {
      lines.push('')
      lines.push('🟢 PREPARING (6-12 months)')
      for (const bp of preparing) {
        lines.push(`· ${bp.system} - ${bp.reason}`)
        lines.push(`  Playbook: ${bp.playbookStatus}`)
      }
    }
  }
  
  if (playbooks.length > 0) {
    lines.push('')
    lines.push('PLAYBOOKS NEEDED')
    for (let i = 0; i < playbooks.length; i++) {
      const p = playbooks[i]
      lines.push(`${i + 1}. ${p.name}`)
      lines.push(`   Status: ${p.status}`)
      lines.push(`   Owner: ${p.owner}`)
      lines.push(`   Due: ${p.due}`)
    }
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
- `company.os.profile` — team size, revenue, stage
- `company.os.departments.*` — signals of systems breaking
- `company.os.events` — growth milestones

**Emits:**
- `scaling-threshold-approaching` → warns leadership of upcoming threshold
- `playbook-ready` → announces scaling playbook available
- `process-breaking` → urgent signal that system at capacity

**Consumed by:**
- CEO strategy (factors scaling into strategic planning)
- All departments (receive scaling playbooks)
- People operations (coordinates on hiring ramp)
