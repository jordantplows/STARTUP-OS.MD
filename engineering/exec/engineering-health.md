---
name: cto-engineering-health
executive: cto
role: steering
reads:
  - company.os.departments.engineering
  - company.os.departments.product
  - company.os.events
events:
  emits: [velocity-declining, tech-debt-critical, quality-degrading, team-morale-low]
  watches: [sprint-completed, deployment-failed, incident-occurred, engineer-blocked]
template-ref: templates/executives/engineering-health.md
---

## What this agent does

The CTO engineering health agent monitors engineering team velocity, technical debt, code quality, and developer experience. It identifies when engineering health degrades and escalates issues that threaten product delivery.

This agent doesn't manage day-to-day engineering work — it watches for systemic problems that require leadership intervention.

## Instructions

### WATCH

Trigger when:
- Sprint completes (measure velocity)
- Deployment fails repeatedly
- Engineering team reports blockers
- Technical debt grows significantly
- Quality metrics degrade
- Founder asks "why is engineering slow?"

### REASON

Engineering health framework:

**Health dimensions:**
1. **Velocity** — are we shipping features at expected pace?
2. **Quality** — are we shipping bugs or stable code?
3. **Technical debt** — is the codebase maintainable?
4. **Developer experience** — can engineers be productive?
5. **Team morale** — is the team engaged or burning out?

**Velocity signals:**
- Features per sprint (trending up/down/stable)
- Time from spec to production
- Cycle time (code start → deploy)
- Number of blocked work items

**Quality signals:**
- Bug rate (new bugs per feature)
- Incident frequency
- Time to detect/resolve issues
- Test coverage (if measurable)

**Technical debt signals:**
- Time spent on refactoring vs features
- Code review feedback patterns
- Deployment complexity/failure rate
- Engineer complaints about codebase

**Developer experience signals:**
- Local development setup time
- Build/test time
- Deployment friction
- Tool/infrastructure frustration

**Morale signals:**
- Engineers expressing frustration
- Attrition risk
- Engagement in planning
- Proactive improvements vs reactive firefighting

### ACT

Engineering health report format:

```
ENGINEERING HEALTH REPORT
Date: [YYYY-MM-DD]

OVERALL HEALTH: [🟢 Healthy | 🟡 Concerning | 🔴 Critical]

VELOCITY
Status: [🟢|🟡|🔴]
· Current: [X features/sprint]
· Trend: [↑ improving | → stable | ↓ declining]
· Blockers: [List of velocity blockers]

QUALITY
Status: [🟢|🟡|🔴]
· Bug rate: [X bugs/feature]
· Incidents: [X in last 30 days]
· Deployment success: [X%]
· Concerns: [Specific quality issues]

TECHNICAL DEBT
Status: [🟢|🟡|🔴]
· Debt level: [Low | Moderate | High | Critical]
· Debt impact: [How it affects velocity/quality]
· Top 3 debt items:
  1. [Specific debt item]
  2. [Specific debt item]
  3. [Specific debt item]

DEVELOPER EXPERIENCE
Status: [🟢|🟡|🔴]
· Setup time: [X hours for new dev]
· Build time: [X minutes]
· Deployment friction: [Low | Medium | High]
· Tool quality: [Good | Needs improvement | Poor]

TEAM MORALE
Status: [🟢|🟡|🔴]
· Engagement: [High | Medium | Low]
· Frustration level: [Low | Medium | High]
· Attrition risk: [Low | Medium | High]

RECOMMENDED ACTIONS
[If 🟢]: Continue current practices, no intervention needed
[If 🟡]: [1-2 specific actions to prevent degradation]
[If 🔴]: [Urgent actions required, specific and prioritized]

ESCALATIONS
[List any issues requiring founder/leadership attention]
```

Health status guidelines:
- **🟢 Healthy** — all dimensions green or one yellow
- **🟡 Concerning** — multiple yellows or one red
- **🔴 Critical** — multiple reds or velocity dropped >50%

### COORDINATE

After health assessment:
- If velocity declining, emit `velocity-declining` event
- If technical debt critical, emit `tech-debt-critical` event
- If quality degrading, emit `quality-degrading` event
- If morale low, emit `team-morale-low` event
- Update `company.os.departments.cto.signals` with health status
- Flag critical issues to CEO for founder attention

## TypeScript

```typescript
import { CompanyOS, DepartmentState, Signal } from '../src/company-os'

type HealthStatus = '🟢' | '🟡' | '🔴'

interface HealthDimension {
  status: HealthStatus
  metrics: Record<string, any>
  concerns: string[]
}

interface EngineeringHealth {
  overall: HealthStatus
  velocity: HealthDimension
  quality: HealthDimension
  techDebt: HealthDimension
  devExperience: HealthDimension
  morale: HealthDimension
  recommendedActions: string[]
  escalations: string[]
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  const engineering = os.departments.engineering
  const product = os.departments.product
  
  if (!engineering) {
    return 'Engineering department not initialized'
  }
  
  // Assess each health dimension
  const velocity = assessVelocity(engineering, product, os)
  const quality = assessQuality(engineering, os)
  const techDebt = assessTechDebt(engineering, os)
  const devExperience = assessDeveloperExperience(engineering, os)
  const morale = assessMorale(engineering, os)
  
  // Calculate overall health
  const overall = calculateOverallHealth([velocity, quality, techDebt, devExperience, morale])
  
  // Generate recommendations
  const recommendedActions = generateRecommendations(overall, velocity, quality, techDebt, devExperience, morale)
  
  // Identify escalations
  const escalations = identifyEscalations(overall, velocity, quality, techDebt, morale)
  
  const health: EngineeringHealth = {
    overall,
    velocity,
    quality,
    techDebt,
    devExperience,
    morale,
    recommendedActions,
    escalations
  }
  
  // Emit events based on health
  if (velocity.status === '🔴') {
    os.events.push({
      type: 'velocity-declining',
      from: 'cto-engineering-health',
      payload: { metrics: velocity.metrics, concerns: velocity.concerns },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  if (techDebt.status === '🔴') {
    os.events.push({
      type: 'tech-debt-critical',
      from: 'cto-engineering-health',
      payload: { level: techDebt.metrics.level, impact: techDebt.concerns },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  if (quality.status === '🔴') {
    os.events.push({
      type: 'quality-degrading',
      from: 'cto-engineering-health',
      payload: { metrics: quality.metrics, concerns: quality.concerns },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  if (morale.status === '🔴') {
    os.events.push({
      type: 'team-morale-low',
      from: 'cto-engineering-health',
      payload: { concerns: morale.concerns },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update CTO state
  if (!os.departments.cto) {
    os.departments.cto = {
      status: 'steering',
      currentFocus: 'Monitoring engineering health',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cto.signals.push({
    type: `engineering-health-${overall}`,
    priority: overall === '🔴' ? 'critical' : overall === '🟡' ? 'high' : 'normal',
    source: 'cto-engineering-health',
    data: { health },
    timestamp: new Date().toISOString()
  })
  
  os.departments.cto.memory.push(
    `HEALTH:${new Date().toISOString()}:${overall}:${JSON.stringify({ 
      velocity: velocity.status, 
      quality: quality.status, 
      debt: techDebt.status 
    })}`
  )
  
  return formatHealthReport(health)
}

function assessVelocity(engineering: DepartmentState, product: DepartmentState, os: CompanyOS): HealthDimension {
  // Extract velocity metrics from engineering state
  const recentEvents = os.events.filter(e => 
    e.from === 'engineering' && e.type.includes('feature-shipped')
  ).slice(-10)
  
  const featuresLastSprint = recentEvents.slice(-5).length
  const featuresPrevSprint = recentEvents.slice(-10, -5).length
  
  const blockedCount = engineering.pendingDecisions?.length || 0
  
  let status: HealthStatus = '🟢'
  const concerns: string[] = []
  
  if (featuresLastSprint < featuresPrevSprint * 0.5) {
    status = '🔴'
    concerns.push('Velocity dropped by >50%')
  } else if (featuresLastSprint < featuresPrevSprint * 0.75) {
    status = '🟡'
    concerns.push('Velocity declining')
  }
  
  if (blockedCount > 3) {
    status = status === '🔴' ? '🔴' : '🟡'
    concerns.push(`${blockedCount} blocked work items`)
  }
  
  if (engineering.status === 'blocked') {
    status = '🔴'
    concerns.push('Engineering department marked as blocked')
  }
  
  return {
    status,
    metrics: {
      current: featuresLastSprint,
      previous: featuresPrevSprint,
      trend: featuresLastSprint >= featuresPrevSprint ? '↑' : '↓',
      blockers: blockedCount
    },
    concerns
  }
}

function assessQuality(engineering: DepartmentState, os: CompanyOS): HealthDimension {
  // Look for quality signals in events
  const incidents = os.events.filter(e => 
    e.type.includes('incident') || e.type.includes('bug')
  ).slice(-20)
  
  const deploymentFailures = os.events.filter(e =>
    e.from === 'engineering' && e.type.includes('deployment-failed')
  ).slice(-10)
  
  let status: HealthStatus = '🟢'
  const concerns: string[] = []
  
  const incidentsLast30Days = incidents.filter(e => {
    const eventDate = new Date(e.timestamp)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return eventDate > thirtyDaysAgo
  }).length
  
  if (incidentsLast30Days > 10) {
    status = '🔴'
    concerns.push(`${incidentsLast30Days} incidents in last 30 days`)
  } else if (incidentsLast30Days > 5) {
    status = '🟡'
    concerns.push(`${incidentsLast30Days} incidents in last 30 days`)
  }
  
  const failureRate = deploymentFailures.length / 10
  if (failureRate > 0.3) {
    status = '🔴'
    concerns.push(`${Math.round(failureRate * 100)}% deployment failure rate`)
  } else if (failureRate > 0.15) {
    status = status === '🔴' ? '🔴' : '🟡'
    concerns.push(`${Math.round(failureRate * 100)}% deployment failure rate`)
  }
  
  return {
    status,
    metrics: {
      incidents: incidentsLast30Days,
      deploymentSuccess: Math.round((1 - failureRate) * 100)
    },
    concerns
  }
}

function assessTechDebt(engineering: DepartmentState, os: CompanyOS): HealthDimension {
  // Look for tech debt signals in engineering memory and events
  const debtSignals = engineering.memory.filter(m => 
    m.includes('debt') || m.includes('refactor')
  )
  
  const refactorEvents = os.events.filter(e =>
    e.from === 'engineering' && e.type.includes('refactor')
  ).slice(-20)
  
  const featureEvents = os.events.filter(e =>
    e.from === 'engineering' && e.type.includes('feature')
  ).slice(-20)
  
  const refactorRatio = featureEvents.length > 0 
    ? refactorEvents.length / (refactorEvents.length + featureEvents.length)
    : 0
  
  let status: HealthStatus = '🟢'
  let level = 'Low'
  const concerns: string[] = []
  const topDebtItems: string[] = []
  
  if (refactorRatio > 0.5) {
    status = '🔴'
    level = 'Critical'
    concerns.push('Spending >50% time on refactoring, not features')
  } else if (refactorRatio > 0.3) {
    status = '🟡'
    level = 'High'
    concerns.push('Spending 30%+ time on technical debt')
  } else if (refactorRatio > 0.15) {
    status = '🟢'
    level = 'Moderate'
  }
  
  // Extract specific debt items from memory
  for (const mem of debtSignals.slice(-3)) {
    if (mem.includes('debt:')) {
      const parts = mem.split('debt:')
      if (parts[1]) {
        topDebtItems.push(parts[1].split(':')[0])
      }
    }
  }
  
  if (topDebtItems.length === 0) {
    topDebtItems.push('No specific debt items tracked')
  }
  
  return {
    status,
    metrics: {
      level,
      refactorRatio: Math.round(refactorRatio * 100),
      topItems: topDebtItems
    },
    concerns
  }
}

function assessDeveloperExperience(engineering: DepartmentState, os: CompanyOS): HealthDimension {
  // Look for DX signals
  const dxSignals = engineering.signals.filter(s => 
    s.type.includes('developer-experience') || s.type.includes('tooling')
  )
  
  let status: HealthStatus = '🟢'
  const concerns: string[] = []
  
  // Check for DX complaints in recent events
  const dxComplaints = os.events.filter(e =>
    e.from === 'engineering' && 
    (e.type.includes('tool-friction') || e.type.includes('dev-experience'))
  ).slice(-10)
  
  if (dxComplaints.length > 5) {
    status = '🔴'
    concerns.push('Multiple developer experience complaints')
  } else if (dxComplaints.length > 2) {
    status = '🟡'
    concerns.push('Some developer experience friction')
  }
  
  // Estimate based on signals
  const setupTime = dxSignals.some(s => s.type.includes('slow-setup')) ? 8 : 2
  const buildTime = dxSignals.some(s => s.type.includes('slow-build')) ? 15 : 3
  const friction = dxComplaints.length > 3 ? 'High' : dxComplaints.length > 1 ? 'Medium' : 'Low'
  
  return {
    status,
    metrics: {
      setupTime,
      buildTime,
      friction,
      toolQuality: status === '🟢' ? 'Good' : status === '🟡' ? 'Needs improvement' : 'Poor'
    },
    concerns
  }
}

function assessMorale(engineering: DepartmentState, os: CompanyOS): HealthDimension {
  // Look for morale signals
  const moraleSignals = engineering.signals.filter(s =>
    s.type.includes('morale') || s.type.includes('frustration') || s.type.includes('attrition')
  )
  
  let status: HealthStatus = '🟢'
  const concerns: string[] = []
  
  const criticalMorale = moraleSignals.filter(s => s.priority === 'critical')
  
  if (criticalMorale.length > 0) {
    status = '🔴'
    concerns.push('Critical morale issues flagged')
  } else if (moraleSignals.length > 2) {
    status = '🟡'
    concerns.push('Multiple morale concerns')
  }
  
  // Check for frustration in engineering focus
  if (engineering.currentFocus.toLowerCase().includes('frustrated') || 
      engineering.currentFocus.toLowerCase().includes('struggling')) {
    status = status === '🔴' ? '🔴' : '🟡'
    concerns.push('Team expressing frustration')
  }
  
  return {
    status,
    metrics: {
      engagement: status === '🟢' ? 'High' : status === '🟡' ? 'Medium' : 'Low',
      frustration: status === '🔴' ? 'High' : status === '🟡' ? 'Medium' : 'Low',
      attritionRisk: status === '🔴' ? 'High' : status === '🟡' ? 'Medium' : 'Low'
    },
    concerns
  }
}

function calculateOverallHealth(dimensions: HealthDimension[]): HealthStatus {
  const redCount = dimensions.filter(d => d.status === '🔴').length
  const yellowCount = dimensions.filter(d => d.status === '🟡').length
  
  if (redCount >= 2) return '🔴'
  if (redCount >= 1) return '🟡'
  if (yellowCount >= 3) return '🟡'
  return '🟢'
}

function generateRecommendations(
  overall: HealthStatus,
  velocity: HealthDimension,
  quality: HealthDimension,
  techDebt: HealthDimension,
  devExperience: HealthDimension,
  morale: HealthDimension
): string[] {
  const actions: string[] = []
  
  if (overall === '🟢') {
    return ['Continue current practices, no intervention needed']
  }
  
  if (velocity.status === '🔴') {
    actions.push('URGENT: Unblock engineering team - resolve pending decisions')
    actions.push('Review roadmap priorities with product')
  }
  
  if (techDebt.status === '🔴') {
    actions.push('URGENT: Dedicate 50% of next sprint to technical debt reduction')
    actions.push(`Focus on: ${techDebt.metrics.topItems[0]}`)
  }
  
  if (quality.status === '🔴') {
    actions.push('URGENT: Slow down feature work, focus on stability')
    actions.push('Implement automated testing for critical paths')
  }
  
  if (morale.status === '🔴') {
    actions.push('URGENT: 1-on-1s with engineering team to address concerns')
    actions.push('Consider reducing scope/pressure')
  }
  
  if (devExperience.status === '🟡') {
    actions.push('Invest in developer tooling improvements')
  }
  
  return actions
}

function identifyEscalations(
  overall: HealthStatus,
  velocity: HealthDimension,
  quality: HealthDimension,
  techDebt: HealthDimension,
  morale: HealthDimension
): string[] {
  const escalations: string[] = []
  
  if (overall === '🔴') {
    escalations.push('CRITICAL: Engineering health requires founder attention')
  }
  
  if (velocity.status === '🔴' && velocity.metrics.blockers > 3) {
    escalations.push(`${velocity.metrics.blockers} decisions blocking engineering - founder decision needed`)
  }
  
  if (techDebt.status === '🔴') {
    escalations.push('Technical debt preventing feature delivery - strategic decision needed on tech investment')
  }
  
  if (morale.status === '🔴') {
    escalations.push('Team morale critical - risk of attrition')
  }
  
  return escalations
}

function formatHealthReport(health: EngineeringHealth): string {
  const lines: string[] = []
  
  lines.push('ENGINEERING HEALTH REPORT')
  lines.push(`Date: ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  lines.push(`OVERALL HEALTH: ${health.overall}`)
  lines.push('')
  
  // Velocity
  lines.push('VELOCITY')
  lines.push(`Status: ${health.velocity.status}`)
  lines.push(`· Current: ${health.velocity.metrics.current} features/sprint`)
  lines.push(`· Trend: ${health.velocity.metrics.trend}`)
  lines.push(`· Blockers: ${health.velocity.metrics.blockers}`)
  if (health.velocity.concerns.length > 0) {
    lines.push(`· Concerns: ${health.velocity.concerns.join(', ')}`)
  }
  lines.push('')
  
  // Quality
  lines.push('QUALITY')
  lines.push(`Status: ${health.quality.status}`)
  lines.push(`· Incidents: ${health.quality.metrics.incidents} in last 30 days`)
  lines.push(`· Deployment success: ${health.quality.metrics.deploymentSuccess}%`)
  if (health.quality.concerns.length > 0) {
    lines.push(`· Concerns: ${health.quality.concerns.join(', ')}`)
  }
  lines.push('')
  
  // Technical debt
  lines.push('TECHNICAL DEBT')
  lines.push(`Status: ${health.techDebt.status}`)
  lines.push(`· Debt level: ${health.techDebt.metrics.level}`)
  lines.push(`· Refactor ratio: ${health.techDebt.metrics.refactorRatio}%`)
  lines.push('· Top debt items:')
  for (let i = 0; i < health.techDebt.metrics.topItems.length && i < 3; i++) {
    lines.push(`  ${i + 1}. ${health.techDebt.metrics.topItems[i]}`)
  }
  lines.push('')
  
  // Developer experience
  lines.push('DEVELOPER EXPERIENCE')
  lines.push(`Status: ${health.devExperience.status}`)
  lines.push(`· Setup time: ${health.devExperience.metrics.setupTime} hours`)
  lines.push(`· Build time: ${health.devExperience.metrics.buildTime} minutes`)
  lines.push(`· Deployment friction: ${health.devExperience.metrics.friction}`)
  lines.push(`· Tool quality: ${health.devExperience.metrics.toolQuality}`)
  lines.push('')
  
  // Morale
  lines.push('TEAM MORALE')
  lines.push(`Status: ${health.morale.status}`)
  lines.push(`· Engagement: ${health.morale.metrics.engagement}`)
  lines.push(`· Frustration level: ${health.morale.metrics.frustration}`)
  lines.push(`· Attrition risk: ${health.morale.metrics.attritionRisk}`)
  lines.push('')
  
  // Actions
  lines.push('RECOMMENDED ACTIONS')
  for (const action of health.recommendedActions) {
    lines.push(`· ${action}`)
  }
  
  // Escalations
  if (health.escalations.length > 0) {
    lines.push('')
    lines.push('ESCALATIONS')
    for (const escalation of health.escalations) {
      lines.push(`⚠️  ${escalation}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.engineering` — engineering team state
- `company.os.departments.product` — product roadmap for context
- `company.os.events` — feature delivery, incidents, deployments

**Emits:**
- `velocity-declining` → alerts when velocity drops
- `tech-debt-critical` → flags when debt blocks features
- `quality-degrading` → warns of quality issues
- `team-morale-low` → escalates morale concerns

**Consumed by:**
- CEO briefing (includes health in daily report)
- Engineering department (receives recommendations)
- Product department (adjusts roadmap if velocity drops)
