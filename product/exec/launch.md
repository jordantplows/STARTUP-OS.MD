---
name: cpo-launch
executive: cpo
role: steering
reads:
  - company.os.departments.product
  - company.os.departments.engineering
  - company.os.departments.marketing
  - company.os.departments.sales
  - company.os.events
events:
  emits: [launch-approved, launch-blocked, launch-coordinated, go-to-market-ready]
  watches: [product-ready, feature-complete, launch-requested, quarter-end]
template-ref: templates/executives/launch.md
---

## What this agent does

The CPO launch agent coordinates product releases across engineering, marketing, sales, and support. It ensures launches have GTM plans, sales enablement, support readiness, and marketing campaigns. It's the gate that prevents shipping without coordination.

This is the difference between shipping code and shipping value. It ensures every launch is set up to succeed.

## Instructions

### WATCH

Trigger when:
- Engineering signals product is ready to ship
- PM requests launch approval
- Major feature nears completion
- Quarter-end launch planning begins
- Launch is blocked by missing dependencies
- Founder questions launch timeline

### REASON

Launch readiness evaluation follows this framework:

**Launch readiness checklist:**
1. **Product ready** — Feature is complete, tested, and performant
2. **GTM plan** — Marketing has campaign and messaging ready
3. **Sales enablement** — Sales knows how to demo and position it
4. **Support readiness** — Support has docs and knows how to help customers
5. **Success metrics** — Clear definition of what success looks like
6. **Rollout plan** — Phased rollout or flag strategy defined

**Launch tiers:**
- **Tier 1 (Major)** — New product, major feature, requires full GTM
- **Tier 2 (Minor)** — Feature improvement, requires sales/support coordination
- **Tier 3 (Patch)** — Bug fix or small improvement, minimal coordination

**When to approve launch:**
- All tier-appropriate readiness criteria met
- No critical blockers from any department
- Success metrics defined and measurable
- Rollback plan exists if something goes wrong

**When to block launch:**
- Critical bugs or performance issues
- GTM not ready for tier 1 launch
- Sales not trained for major new capability
- Support doesn't know how to help customers
- Success metrics unclear

**Go-to-market coordination:**
- Engineering: ship the code, monitor performance
- Marketing: campaign, announcement, content
- Sales: demo, pitch deck, objection handling
- Support: docs, FAQs, training
- Product: success metrics, user feedback collection

### ACT

Launch plan format:

```
LAUNCH PLAN · [Feature Name] · [Date]

LAUNCH TIER: [1/2/3] — [Major/Minor/Patch]

READINESS STATUS
✓ Product ready          [GREEN/YELLOW/RED] — [Details]
✓ GTM plan              [GREEN/YELLOW/RED] — [Details]
✓ Sales enablement      [GREEN/YELLOW/RED] — [Details]
✓ Support readiness     [GREEN/YELLOW/RED] — [Details]
✓ Success metrics       [GREEN/YELLOW/RED] — [Details]
✓ Rollout plan          [GREEN/YELLOW/RED] — [Details]

Overall: [GO / NO-GO / CONDITIONAL]

WHAT'S LAUNCHING
[One paragraph describing what the feature is, who it's for, and why it matters]

TARGET LAUNCH DATE: [Date]
ROLLOUT STRATEGY: [All at once / Phased / Beta / Flag]

SUCCESS METRICS
· [Metric 1]: [Target value] in [timeframe]
· [Metric 2]: [Target value] in [timeframe]
· [Metric 3]: [Target value] in [timeframe]

DEPARTMENT COORDINATION

Engineering:
  · [Task 1]
  · [Task 2]
  Status: [READY/BLOCKED]

Marketing:
  · [Task 1: e.g., blog post, email campaign]
  · [Task 2: e.g., social posts, demo video]
  Status: [READY/BLOCKED]

Sales:
  · [Task 1: e.g., pitch deck updated]
  · [Task 2: e.g., demo training completed]
  Status: [READY/BLOCKED]

Support:
  · [Task 1: e.g., help docs published]
  · [Task 2: e.g., team trained on feature]
  Status: [READY/BLOCKED]

BLOCKERS
· [Blocker 1 with owner and timeline]
· [Blocker 2 with owner and timeline]

RISKS
· [Risk 1 and mitigation plan]
· [Risk 2 and mitigation plan]

POST-LAUNCH
Day 1: Monitor adoption, collect feedback
Week 1: Review success metrics, address issues
Month 1: Full retrospective, iterate or sunset
```

### COORDINATE

After launch approval:
- Emit `launch-approved` event with launch date
- Emit `go-to-market-ready` event to trigger marketing
- Update `company.os.departments.cpo.memory` with launch plan
- Flag all departments with their launch responsibilities
- Schedule post-launch review

If launch blocked:
- Emit `launch-blocked` event with blockers
- Flag owner of each blocker
- Escalate to CEO if critical launch is at risk
- Set timeline for blocker resolution

After successful launch:
- Emit `launch-coordinated` event with summary
- Track success metrics
- Schedule retrospective

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface LaunchReadiness {
  productReady: 'green' | 'yellow' | 'red'
  gtmPlan: 'green' | 'yellow' | 'red'
  salesEnablement: 'green' | 'yellow' | 'red'
  supportReadiness: 'green' | 'yellow' | 'red'
  successMetrics: 'green' | 'yellow' | 'red'
  rolloutPlan: 'green' | 'yellow' | 'red'
  details: Record<string, string>
}

interface DepartmentTasks {
  department: string
  tasks: string[]
  status: 'ready' | 'blocked' | 'in-progress'
}

interface LaunchPlan {
  feature: string
  tier: 1 | 2 | 3
  readiness: LaunchReadiness
  decision: 'go' | 'no-go' | 'conditional'
  description: string
  targetDate: string
  rolloutStrategy: string
  successMetrics: string[]
  departmentTasks: DepartmentTasks[]
  blockers: string[]
  risks: string[]
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Identify features ready for launch
  const launchCandidates = identifyLaunchCandidates(os)
  
  // Assess readiness for each
  const plans: LaunchPlan[] = []
  for (const candidate of launchCandidates) {
    const plan = assessLaunchReadiness(os, candidate)
    plans.push(plan)
  }
  
  // Coordinate with departments
  for (const plan of plans) {
    coordinateDepartments(os, plan)
  }
  
  // Emit events for approved launches
  for (const plan of plans) {
    if (plan.decision === 'go') {
      os.events.push({
        type: 'launch-approved',
        from: 'cpo-launch',
        payload: { 
          feature: plan.feature, 
          date: plan.targetDate 
        },
        timestamp: new Date().toISOString(),
        consumed: []
      })
      
      os.events.push({
        type: 'go-to-market-ready',
        from: 'cpo-launch',
        payload: { feature: plan.feature },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    } else if (plan.decision === 'no-go') {
      os.events.push({
        type: 'launch-blocked',
        from: 'cpo-launch',
        payload: { 
          feature: plan.feature, 
          blockers: plan.blockers 
        },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    }
  }
  
  // Update CPO state
  if (!os.departments.cpo) {
    os.departments.cpo = {
      status: 'steering',
      currentFocus: 'Launch coordination',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  for (const plan of plans) {
    os.departments.cpo.memory.push(
      `LAUNCH:${plan.feature}:${new Date().toISOString()}:${JSON.stringify(plan)}`
    )
  }
  
  // Alert if critical launch blocked
  const blockedCritical = plans.filter(p => p.tier === 1 && p.decision === 'no-go')
  if (blockedCritical.length > 0) {
    os.departments.cpo.signals.push({
      type: 'critical-launch-blocked',
      priority: 'critical',
      description: `Major launch blocked: ${blockedCritical[0].feature}`,
      timestamp: new Date().toISOString()
    })
  }
  
  return formatLaunchPlans(plans)
}

function identifyLaunchCandidates(os: CompanyOS): string[] {
  const candidates: string[] = []
  
  // Look for features marked as ready in product
  const product = os.departments.product
  if (product) {
    const readyFeatures = product.memory.filter(m => 
      m.includes('READY') || m.includes('COMPLETE')
    )
    for (const feature of readyFeatures) {
      const parts = feature.split(':')
      if (parts.length >= 2) {
        candidates.push(parts[1])
      }
    }
  }
  
  // Look for launch-requested events
  const launchRequests = os.events.filter(e => e.type === 'launch-requested')
  for (const request of launchRequests) {
    if (request.payload?.feature && !candidates.includes(request.payload.feature)) {
      candidates.push(request.payload.feature)
    }
  }
  
  // If no candidates, check engineering for completed work
  if (candidates.length === 0) {
    const engineering = os.departments.engineering
    if (engineering) {
      const completed = engineering.memory.filter(m => m.includes('COMPLETED'))
      for (const item of completed.slice(-3)) { // Last 3 completed items
        const parts = item.split(':')
        if (parts.length >= 2) {
          candidates.push(parts[1])
        }
      }
    }
  }
  
  return candidates
}

function assessLaunchReadiness(os: CompanyOS, feature: string): LaunchPlan {
  const readiness: LaunchReadiness = {
    productReady: 'yellow',
    gtmPlan: 'yellow',
    salesEnablement: 'yellow',
    supportReadiness: 'yellow',
    successMetrics: 'yellow',
    rolloutPlan: 'yellow',
    details: {}
  }
  
  // Assess product readiness
  const engineering = os.departments.engineering
  if (engineering) {
    const featureStatus = engineering.memory.find(m => 
      m.includes(feature) && (m.includes('COMPLETED') || m.includes('TESTED'))
    )
    if (featureStatus) {
      readiness.productReady = 'green'
      readiness.details.productReady = 'Feature complete and tested'
    } else {
      readiness.details.productReady = 'Feature not marked complete'
    }
  } else {
    readiness.details.productReady = 'Engineering status unknown'
  }
  
  // Assess GTM plan
  const marketing = os.departments.marketing
  if (marketing) {
    const gtmPlan = marketing.memory.find(m => m.includes(feature))
    if (gtmPlan) {
      readiness.gtmPlan = 'green'
      readiness.details.gtmPlan = 'Marketing campaign ready'
    } else {
      readiness.gtmPlan = 'red'
      readiness.details.gtmPlan = 'No marketing plan created'
    }
  } else {
    readiness.details.gtmPlan = 'Marketing department not active'
  }
  
  // Assess sales enablement
  const sales = os.departments.sales
  if (sales) {
    const salesReady = sales.memory.find(m => m.includes(feature))
    if (salesReady) {
      readiness.salesEnablement = 'green'
      readiness.details.salesEnablement = 'Sales team enabled'
    } else {
      readiness.salesEnablement = 'red'
      readiness.details.salesEnablement = 'Sales not yet trained'
    }
  } else {
    readiness.salesEnablement = 'yellow'
    readiness.details.salesEnablement = 'Sales department not active'
  }
  
  // Assess support readiness
  const support = os.departments['customer-support'] || os.departments.customer
  if (support) {
    const supportReady = support.memory.find(m => m.includes(feature))
    if (supportReady) {
      readiness.supportReadiness = 'green'
      readiness.details.supportReadiness = 'Support docs and training complete'
    } else {
      readiness.supportReadiness = 'red'
      readiness.details.supportReadiness = 'Support not prepared'
    }
  } else {
    readiness.supportReadiness = 'yellow'
    readiness.details.supportReadiness = 'Support department not active'
  }
  
  // Assess success metrics
  const product = os.departments.product
  if (product) {
    const metrics = product.memory.find(m => 
      m.includes(feature) && m.includes('METRIC')
    )
    if (metrics) {
      readiness.successMetrics = 'green'
      readiness.details.successMetrics = 'Success metrics defined'
    } else {
      readiness.successMetrics = 'red'
      readiness.details.successMetrics = 'No success metrics defined'
    }
  } else {
    readiness.details.successMetrics = 'Product department not tracking'
  }
  
  // Assess rollout plan
  if (readiness.productReady === 'green') {
    readiness.rolloutPlan = 'green'
    readiness.details.rolloutPlan = 'Standard rollout process'
  } else {
    readiness.details.rolloutPlan = 'Awaiting product completion'
  }
  
  // Determine launch tier
  const tier = determineLaunchTier(feature, os)
  
  // Make go/no-go decision
  const decision = makeLaunchDecision(readiness, tier)
  
  // Generate department tasks
  const departmentTasks = generateDepartmentTasks(feature, readiness)
  
  // Identify blockers
  const blockers = identifyBlockers(readiness)
  
  // Identify risks
  const risks = identifyLaunchRisks(readiness, os)
  
  return {
    feature,
    tier,
    readiness,
    decision,
    description: `Launching ${feature} to improve customer value`,
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
    rolloutStrategy: tier === 1 ? 'Phased rollout' : 'All customers',
    successMetrics: [
      'Adoption: 30% of users in first week',
      'Engagement: 50% of adopters use daily',
      'Satisfaction: NPS +10 for feature'
    ],
    departmentTasks,
    blockers,
    risks
  }
}

function determineLaunchTier(feature: string, os: CompanyOS): 1 | 2 | 3 {
  // Simple heuristic - would be more sophisticated in production
  const featureLower = feature.toLowerCase()
  
  if (featureLower.includes('new product') || featureLower.includes('major')) {
    return 1
  } else if (featureLower.includes('bug') || featureLower.includes('fix')) {
    return 3
  } else {
    return 2
  }
}

function makeLaunchDecision(readiness: LaunchReadiness, tier: 1 | 2 | 3): 'go' | 'no-go' | 'conditional' {
  const criticalChecks = [readiness.productReady, readiness.successMetrics]
  
  if (tier === 1) {
    // Tier 1 requires everything green
    const allChecks = Object.values(readiness).filter(v => typeof v === 'string') as string[]
    const greenCount = allChecks.filter(c => c === 'green').length
    const redCount = allChecks.filter(c => c === 'red').length
    
    if (redCount > 0) return 'no-go'
    if (greenCount === allChecks.length) return 'go'
    return 'conditional'
  } else if (tier === 2) {
    // Tier 2 requires product and metrics
    if (criticalChecks.includes('red')) return 'no-go'
    if (criticalChecks.every(c => c === 'green')) return 'go'
    return 'conditional'
  } else {
    // Tier 3 only needs product ready
    if (readiness.productReady === 'red') return 'no-go'
    return 'go'
  }
}

function generateDepartmentTasks(feature: string, readiness: LaunchReadiness): DepartmentTasks[] {
  const tasks: DepartmentTasks[] = []
  
  tasks.push({
    department: 'Engineering',
    tasks: [
      'Deploy feature to production',
      'Monitor performance and errors',
      'Set up feature flags if needed'
    ],
    status: readiness.productReady === 'green' ? 'ready' : 'blocked'
  })
  
  tasks.push({
    department: 'Marketing',
    tasks: [
      'Publish blog post and announcement',
      'Send email campaign to users',
      'Create social media posts'
    ],
    status: readiness.gtmPlan === 'green' ? 'ready' : 'blocked'
  })
  
  tasks.push({
    department: 'Sales',
    tasks: [
      'Update pitch deck with new feature',
      'Practice demo in team meeting',
      'Add to sales playbook'
    ],
    status: readiness.salesEnablement === 'green' ? 'ready' : 'blocked'
  })
  
  tasks.push({
    department: 'Support',
    tasks: [
      'Publish help documentation',
      'Train team on feature',
      'Prepare FAQs'
    ],
    status: readiness.supportReadiness === 'green' ? 'ready' : 'blocked'
  })
  
  return tasks
}

function identifyBlockers(readiness: LaunchReadiness): string[] {
  const blockers: string[] = []
  
  if (readiness.productReady === 'red') {
    blockers.push(`Product not ready: ${readiness.details.productReady}`)
  }
  if (readiness.gtmPlan === 'red') {
    blockers.push(`GTM plan missing: ${readiness.details.gtmPlan}`)
  }
  if (readiness.salesEnablement === 'red') {
    blockers.push(`Sales not enabled: ${readiness.details.salesEnablement}`)
  }
  if (readiness.supportReadiness === 'red') {
    blockers.push(`Support not ready: ${readiness.details.supportReadiness}`)
  }
  if (readiness.successMetrics === 'red') {
    blockers.push(`Success metrics not defined: ${readiness.details.successMetrics}`)
  }
  
  return blockers
}

function identifyLaunchRisks(readiness: LaunchReadiness, os: CompanyOS): string[] {
  const risks: string[] = []
  
  // Check for yellow statuses
  const yellowChecks = Object.entries(readiness).filter(([k, v]) => v === 'yellow')
  if (yellowChecks.length > 0) {
    risks.push('Some readiness checks are yellow - monitor closely')
  }
  
  // Check for recent production issues
  const engineering = os.departments.engineering
  if (engineering) {
    const recentErrors = engineering.memory.filter(m => 
      m.includes('ERROR') || m.includes('INCIDENT')
    ).slice(-5)
    if (recentErrors.length > 2) {
      risks.push('Recent production issues - ensure extra testing')
    }
  }
  
  // Check for competing launches
  const cpo = os.departments.cpo
  if (cpo) {
    const recentLaunches = cpo.memory.filter(m => m.startsWith('LAUNCH:')).slice(-3)
    if (recentLaunches.length >= 2) {
      risks.push('Multiple recent launches - may strain support/sales capacity')
    }
  }
  
  return risks
}

function coordinateDepartments(os: CompanyOS, plan: LaunchPlan): void {
  // Flag departments with their tasks
  for (const deptTask of plan.departmentTasks) {
    const deptName = deptTask.department.toLowerCase()
    const dept = os.departments[deptName]
    
    if (dept) {
      dept.signals.push({
        type: 'launch-coordination',
        priority: plan.decision === 'go' ? 'high' : 'medium',
        description: `Launch tasks for ${plan.feature}: ${deptTask.tasks.join(', ')}`,
        timestamp: new Date().toISOString()
      })
    }
  }
}

function formatLaunchPlans(plans: LaunchPlan[]): string {
  const lines: string[] = []
  
  for (const plan of plans) {
    lines.push(`LAUNCH PLAN · ${plan.feature} · ${new Date().toISOString().split('T')[0]}`)
    lines.push('')
    lines.push(`LAUNCH TIER: ${plan.tier} — ${plan.tier === 1 ? 'Major' : plan.tier === 2 ? 'Minor' : 'Patch'}`)
    lines.push('')
    
    lines.push('READINESS STATUS')
    const checks = [
      ['Product ready', plan.readiness.productReady, plan.readiness.details.productReady],
      ['GTM plan', plan.readiness.gtmPlan, plan.readiness.details.gtmPlan],
      ['Sales enablement', plan.readiness.salesEnablement, plan.readiness.details.salesEnablement],
      ['Support readiness', plan.readiness.supportReadiness, plan.readiness.details.supportReadiness],
      ['Success metrics', plan.readiness.successMetrics, plan.readiness.details.successMetrics],
      ['Rollout plan', plan.readiness.rolloutPlan, plan.readiness.details.rolloutPlan]
    ]
    
    for (const [label, status, detail] of checks) {
      const icon = status === 'green' ? '✓' : status === 'yellow' ? '⚠' : '✗'
      const color = (status as string).toUpperCase()
      const padding = ' '.repeat(20 - label.length)
      lines.push(`${icon} ${label}${padding}${color} — ${detail}`)
    }
    lines.push('')
    lines.push(`Overall: ${plan.decision.toUpperCase()}`)
    lines.push('')
    
    lines.push("WHAT'S LAUNCHING")
    lines.push(plan.description)
    lines.push('')
    
    lines.push(`TARGET LAUNCH DATE: ${plan.targetDate}`)
    lines.push(`ROLLOUT STRATEGY: ${plan.rolloutStrategy}`)
    lines.push('')
    
    lines.push('SUCCESS METRICS')
    for (const metric of plan.successMetrics) {
      lines.push(`· ${metric}`)
    }
    lines.push('')
    
    lines.push('DEPARTMENT COORDINATION')
    for (const dept of plan.departmentTasks) {
      lines.push(`${dept.department}:`)
      for (const task of dept.tasks) {
        lines.push(`  · ${task}`)
      }
      lines.push(`  Status: ${dept.status.toUpperCase()}`)
      lines.push('')
    }
    
    if (plan.blockers.length > 0) {
      lines.push('BLOCKERS')
      for (const blocker of plan.blockers) {
        lines.push(`· ${blocker}`)
      }
      lines.push('')
    }
    
    if (plan.risks.length > 0) {
      lines.push('RISKS')
      for (const risk of plan.risks) {
        lines.push(`· ${risk}`)
      }
      lines.push('')
    }
    
    lines.push('POST-LAUNCH')
    lines.push('Day 1: Monitor adoption, collect feedback')
    lines.push('Week 1: Review success metrics, address issues')
    lines.push('Month 1: Full retrospective, iterate or sunset')
    lines.push('')
    lines.push('━'.repeat(80))
    lines.push('')
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.product` — features ready to launch
- `company.os.departments.engineering` — product completion status
- `company.os.departments.marketing` — GTM readiness
- `company.os.departments.sales` — sales enablement status
- `company.os.events` — launch requests and signals

**Emits:**
- `launch-approved` → green light to ship
- `launch-blocked` → blockers preventing launch
- `launch-coordinated` → all departments aligned
- `go-to-market-ready` → triggers marketing campaign

**Consumed by:**
- Engineering (knows when to deploy)
- Marketing (knows when to run campaign)
- Sales (knows when feature is available)
- Support (knows when to expect customer questions)
- CEO briefing (surface launch status and blockers)
