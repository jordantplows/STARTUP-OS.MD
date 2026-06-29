---
name: cto-infrastructure
executive: cto
role: steering
reads:
  - company.os.departments.engineering
  - company.os.departments.operations
  - company.os.profile
  - company.os.events
events:
  emits: [infrastructure-cost-spike, reliability-degraded, scaling-needed, infrastructure-optimized]
  watches: [deployment-failed, incident-occurred, cost-alert, traffic-spike, product-scaling-needed]
template-ref: templates/executives/infrastructure.md
---

## What this agent does

The CTO infrastructure agent manages infrastructure strategy, monitoring costs, reliability, scaling needs, and deployment practices. It watches for infrastructure issues that affect product delivery or company economics and makes strategic infrastructure decisions.

This agent doesn't manage day-to-day infrastructure operations — it provides strategic oversight and decision-making for the technical foundation.

## Instructions

### WATCH

Trigger when:
- Infrastructure costs spike unexpectedly
- Reliability/uptime degrades below threshold
- Traffic growth requires scaling decisions
- Product roadmap demands new infrastructure
- Deployment failures indicate infrastructure problems
- Founder asks "why is infrastructure so expensive?"

### REASON

Infrastructure strategy framework:

**Decision dimensions:**
1. **Cost** — optimize for unit economics
2. **Reliability** — minimize downtime and incidents
3. **Scale** — handle current and projected growth
4. **Developer velocity** — fast, reliable deployments
5. **Operational overhead** — minimize manual toil

**Stage-appropriate infrastructure:**

**Idea/Validating stage:**
- Optimize for: speed to market, low cost
- Infrastructure: managed services (Vercel, Render, Supabase)
- Trade: pay premium per user for zero ops overhead
- Anti-pattern: premature kubernetes, microservices

**Building/MVP stage:**
- Optimize for: reliability, reasonable cost
- Infrastructure: managed services + some custom (fly.io, Railway)
- Trade: slight cost increase for better control
- Anti-pattern: over-engineering for scale you don't have

**Scaling stage:**
- Optimize for: unit economics, reliability at scale
- Infrastructure: hybrid managed + custom (AWS/GCP with managed pieces)
- Trade: ops complexity for cost optimization
- Anti-pattern: staying on expensive managed services too long

**Mature stage:**
- Optimize for: efficiency, compliance, multi-region
- Infrastructure: custom with high automation
- Trade: significant ops team for maximum optimization

**Cost management:**
- Track cost per customer/transaction
- Set alerts for >20% cost increases
- Review major services monthly
- Optimize hot path (where most cost is)

**Reliability targets:**
- Idea stage: 95% uptime acceptable
- Building stage: 99% uptime expected
- Scaling stage: 99.5%+ with on-call
- Mature stage: 99.9%+ with SLOs

**Scaling triggers:**
- Current infrastructure at >70% capacity
- Response time degrading under load
- Cost per user increasing due to inefficiency
- Manual scaling becoming bottleneck

### ACT

Infrastructure assessment format:

```
INFRASTRUCTURE ASSESSMENT
Date: [YYYY-MM-DD]

OVERALL STATUS: [🟢 Healthy | 🟡 Needs Attention | 🔴 Critical]

COST ANALYSIS
· Current monthly cost: $[X]
· Cost per customer: $[X]
· Trend: [↑ ↓ →] [+/- X% vs last month]
· Top 3 cost drivers:
  1. [Service] - $[X]/mo ([X%])
  2. [Service] - $[X]/mo ([X%])
  3. [Service] - $[X]/mo ([X%])
· Status: [🟢 Under control | 🟡 Rising | 🔴 Unsustainable]

RELIABILITY
· Uptime: [X%] (target: [Y%])
· Incidents: [X] in last 30 days
· MTTR: [X] hours average
· Top reliability risks:
  1. [Risk description]
  2. [Risk description]
· Status: [🟢 Stable | 🟡 Degraded | 🔴 Critical]

SCALE
· Current capacity: [X%] utilized
· Projected growth: [X% per month]
· Time to scale limit: [X months]
· Scaling bottlenecks:
  1. [Bottleneck]
  2. [Bottleneck]
· Status: [🟢 Headroom | 🟡 Planning needed | 🔴 At capacity]

DEPLOYMENT
· Deploy frequency: [X per day/week]
· Deploy success rate: [X%]
· Deploy time: [X minutes]
· Rollback capability: [Yes/No]
· Status: [🟢 Smooth | 🟡 Friction | 🔴 Broken]

RECOMMENDATIONS
[Stage-appropriate recommendations]
1. [Specific action] - [Expected impact]
2. [Specific action] - [Expected impact]
3. [Specific action] - [Expected impact]

INFRASTRUCTURE DECISIONS NEEDED
[List any decisions requiring founder input]
· [Decision with options and tradeoffs]
```

### COORDINATE

After infrastructure assessment:
- If cost spike >30%, emit `infrastructure-cost-spike` event
- If reliability <99%, emit `reliability-degraded` event
- If capacity >70%, emit `scaling-needed` event
- When optimization completes, emit `infrastructure-optimized` event
- Update `company.os.departments.cto.memory` with assessment
- Flag cost/reliability issues to CEO if critical
- Alert finance to cost trends

## TypeScript

```typescript
import { CompanyOS, DepartmentState } from '../src/company-os'

type InfraStatus = '🟢' | '🟡' | '🔴'

interface CostAnalysis {
  currentMonthlyCost: number
  costPerCustomer: number
  trend: '↑' | '↓' | '→'
  trendPercent: number
  topCostDrivers: CostDriver[]
  status: InfraStatus
}

interface CostDriver {
  service: string
  monthlyCost: number
  percentage: number
}

interface ReliabilityMetrics {
  uptime: number
  uptimeTarget: number
  incidents: number
  mttr: number // hours
  risks: string[]
  status: InfraStatus
}

interface ScaleMetrics {
  capacityUtilized: number // percentage
  projectedGrowth: number // percentage per month
  timeToLimit: number // months
  bottlenecks: string[]
  status: InfraStatus
}

interface DeploymentMetrics {
  frequency: string
  successRate: number
  deployTime: number // minutes
  rollbackCapable: boolean
  status: InfraStatus
}

interface InfrastructureAssessment {
  overall: InfraStatus
  cost: CostAnalysis
  reliability: ReliabilityMetrics
  scale: ScaleMetrics
  deployment: DeploymentMetrics
  recommendations: string[]
  decisionsNeeded: string[]
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  const engineering = os.departments.engineering
  const operations = os.departments.operations
  const stage = os.profile.stage
  
  // Assess each infrastructure dimension
  const cost = assessCost(os)
  const reliability = assessReliability(os)
  const scale = assessScale(os, stage)
  const deployment = assessDeployment(engineering, os)
  
  // Calculate overall status
  const overall = calculateOverallInfraStatus([cost.status, reliability.status, scale.status, deployment.status])
  
  // Generate recommendations
  const recommendations = generateInfraRecommendations(cost, reliability, scale, deployment, stage, os)
  
  // Identify decisions needed
  const decisionsNeeded = identifyInfraDecisions(cost, reliability, scale, stage, os)
  
  const assessment: InfrastructureAssessment = {
    overall,
    cost,
    reliability,
    scale,
    deployment,
    recommendations,
    decisionsNeeded
  }
  
  // Emit events based on findings
  if (cost.trendPercent > 30) {
    os.events.push({
      type: 'infrastructure-cost-spike',
      from: 'cto-infrastructure',
      payload: { cost: cost.currentMonthlyCost, increase: cost.trendPercent },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  if (reliability.uptime < 99) {
    os.events.push({
      type: 'reliability-degraded',
      from: 'cto-infrastructure',
      payload: { uptime: reliability.uptime, target: reliability.uptimeTarget, incidents: reliability.incidents },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  if (scale.capacityUtilized > 70) {
    os.events.push({
      type: 'scaling-needed',
      from: 'cto-infrastructure',
      payload: { capacity: scale.capacityUtilized, timeToLimit: scale.timeToLimit },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update CTO state
  if (!os.departments.cto) {
    os.departments.cto = {
      status: 'steering',
      currentFocus: 'Infrastructure oversight',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cto.memory.push(
    `INFRA:${new Date().toISOString()}:${overall}:cost=$${cost.currentMonthlyCost}:uptime=${reliability.uptime}%:capacity=${scale.capacityUtilized}%`
  )
  
  os.departments.cto.signals.push({
    type: `infrastructure-status-${overall}`,
    priority: overall === '🔴' ? 'critical' : overall === '🟡' ? 'high' : 'normal',
    source: 'cto-infrastructure',
    data: { assessment },
    timestamp: new Date().toISOString()
  })
  
  return formatInfrastructureAssessment(assessment, stage)
}

function assessCost(os: CompanyOS): CostAnalysis {
  // Extract cost data from operations or engineering memory
  const operations = os.departments.operations
  const finance = os.departments.finance
  
  // Look for cost info in memory
  const costMemory = operations?.memory.find(m => m.includes('infrastructure-cost')) ||
                     finance?.memory.find(m => m.includes('infrastructure'))
  
  let currentMonthlyCost = 1000 // default estimate
  let previousCost = 950
  
  if (costMemory) {
    const match = costMemory.match(/\$(\d+)/)
    if (match) {
      currentMonthlyCost = parseInt(match[1])
      previousCost = currentMonthlyCost * 0.9 // estimate
    }
  }
  
  // Calculate cost per customer
  const customerCount = extractCustomerCount(os)
  const costPerCustomer = customerCount > 0 ? currentMonthlyCost / customerCount : 0
  
  // Determine trend
  const trendPercent = ((currentMonthlyCost - previousCost) / previousCost) * 100
  let trend: '↑' | '↓' | '→' = '→'
  if (trendPercent > 5) trend = '↑'
  else if (trendPercent < -5) trend = '↓'
  
  // Top cost drivers (estimated)
  const topCostDrivers: CostDriver[] = [
    { service: 'Compute (servers/functions)', monthlyCost: currentMonthlyCost * 0.4, percentage: 40 },
    { service: 'Database/storage', monthlyCost: currentMonthlyCost * 0.3, percentage: 30 },
    { service: 'CDN/bandwidth', monthlyCost: currentMonthlyCost * 0.2, percentage: 20 }
  ]
  
  // Determine status
  let status: InfraStatus = '🟢'
  if (trendPercent > 30 || costPerCustomer > 50) {
    status = '🔴'
  } else if (trendPercent > 15 || costPerCustomer > 20) {
    status = '🟡'
  }
  
  return {
    currentMonthlyCost,
    costPerCustomer,
    trend,
    trendPercent,
    topCostDrivers,
    status
  }
}

function assessReliability(os: CompanyOS): ReliabilityMetrics {
  // Extract reliability metrics from events
  const incidents = os.events.filter(e => 
    e.type.includes('incident') || e.type.includes('outage')
  ).slice(-20)
  
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const recentIncidents = incidents.filter(e => e.timestamp > thirtyDaysAgo)
  
  // Calculate uptime (simplified)
  const incidentHours = recentIncidents.length * 2 // assume 2 hours per incident
  const totalHours = 30 * 24
  const uptime = ((totalHours - incidentHours) / totalHours) * 100
  
  // Determine target based on stage
  const stage = os.profile.stage
  let uptimeTarget = 95
  if (stage === 'building' || stage === 'validating') uptimeTarget = 99
  if (stage === 'scaling' || stage === 'revenue') uptimeTarget = 99.5
  
  // Calculate MTTR
  const mttr = recentIncidents.length > 0 ? 2 : 0 // simplified
  
  // Identify risks
  const risks: string[] = []
  if (recentIncidents.length > 5) {
    risks.push('Frequent incidents indicate systemic issues')
  }
  
  const deployFailures = os.events.filter(e =>
    e.type.includes('deployment-failed')
  ).slice(-10)
  
  if (deployFailures.length > 3) {
    risks.push('Deployment instability affecting reliability')
  }
  
  // Determine status
  let status: InfraStatus = '🟢'
  if (uptime < uptimeTarget - 1 || recentIncidents.length > 10) {
    status = '🔴'
  } else if (uptime < uptimeTarget || recentIncidents.length > 5) {
    status = '🟡'
  }
  
  return {
    uptime: Math.round(uptime * 100) / 100,
    uptimeTarget,
    incidents: recentIncidents.length,
    mttr,
    risks,
    status
  }
}

function assessScale(os: CompanyOS, stage: string): ScaleMetrics {
  // Estimate capacity utilization
  const operations = os.departments.operations
  const product = os.departments.product
  
  // Look for capacity signals
  const capacitySignals = operations?.signals.filter(s => 
    s.type.includes('capacity') || s.type.includes('scale')
  ) || []
  
  let capacityUtilized = 30 // default low utilization early stage
  
  if (stage === 'scaling' || stage === 'revenue') {
    capacityUtilized = 60
  }
  
  if (capacitySignals.some(s => s.priority === 'high')) {
    capacityUtilized = 75
  }
  
  if (capacitySignals.some(s => s.priority === 'critical')) {
    capacityUtilized = 90
  }
  
  // Estimate growth
  const customerGrowth = extractCustomerGrowth(os)
  const projectedGrowth = customerGrowth || 10 // default 10% per month
  
  // Calculate time to limit
  const remainingCapacity = 100 - capacityUtilized
  const timeToLimit = projectedGrowth > 0 
    ? Math.floor(remainingCapacity / projectedGrowth)
    : 12
  
  // Identify bottlenecks
  const bottlenecks: string[] = []
  
  if (operations?.currentFocus.includes('database')) {
    bottlenecks.push('Database connection limits')
  }
  
  if (product?.memory.some(m => m.includes('performance'))) {
    bottlenecks.push('Application performance at scale')
  }
  
  if (bottlenecks.length === 0) {
    bottlenecks.push('No identified bottlenecks')
  }
  
  // Determine status
  let status: InfraStatus = '🟢'
  if (capacityUtilized > 85 || timeToLimit < 2) {
    status = '🔴'
  } else if (capacityUtilized > 70 || timeToLimit < 4) {
    status = '🟡'
  }
  
  return {
    capacityUtilized,
    projectedGrowth,
    timeToLimit,
    bottlenecks,
    status
  }
}

function assessDeployment(engineering: DepartmentState, os: CompanyOS): DeploymentMetrics {
  // Extract deployment metrics
  const deployments = os.events.filter(e =>
    e.from === 'engineering' && 
    (e.type.includes('deployed') || e.type.includes('deployment'))
  ).slice(-20)
  
  const failures = deployments.filter(e => e.type.includes('failed'))
  const successRate = deployments.length > 0 
    ? ((deployments.length - failures.length) / deployments.length) * 100
    : 95
  
  // Estimate frequency
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const recentDeployments = deployments.filter(e => e.timestamp > sevenDaysAgo)
  const frequency = recentDeployments.length > 7 
    ? `${Math.floor(recentDeployments.length / 7)} per day`
    : `${recentDeployments.length} per week`
  
  // Estimate deploy time
  const deployTime = 15 // minutes, default estimate
  
  // Check rollback capability
  const rollbackCapable = engineering?.memory.some(m => m.includes('rollback')) || false
  
  // Determine status
  let status: InfraStatus = '🟢'
  if (successRate < 80 || failures.length > 5) {
    status = '🔴'
  } else if (successRate < 90 || failures.length > 2) {
    status = '🟡'
  }
  
  return {
    frequency,
    successRate: Math.round(successRate),
    deployTime,
    rollbackCapable,
    status
  }
}

function calculateOverallInfraStatus(statuses: InfraStatus[]): InfraStatus {
  const redCount = statuses.filter(s => s === '🔴').length
  const yellowCount = statuses.filter(s => s === '🟡').length
  
  if (redCount >= 2) return '🔴'
  if (redCount >= 1) return '🟡'
  if (yellowCount >= 2) return '🟡'
  return '🟢'
}

function generateInfraRecommendations(
  cost: CostAnalysis,
  reliability: ReliabilityMetrics,
  scale: ScaleMetrics,
  deployment: DeploymentMetrics,
  stage: string,
  os: CompanyOS
): string[] {
  const recommendations: string[] = []
  
  // Cost recommendations
  if (cost.status === '🔴') {
    recommendations.push(`URGENT: Reduce infrastructure costs by 20-30% - start with ${cost.topCostDrivers[0].service}`)
    recommendations.push('Review all services for unused resources and over-provisioning')
  } else if (cost.status === '🟡') {
    recommendations.push(`Optimize ${cost.topCostDrivers[0].service} to control costs`)
  }
  
  // Reliability recommendations
  if (reliability.status === '🔴') {
    recommendations.push('URGENT: Improve reliability - implement better monitoring and alerting')
    recommendations.push(`Address incident root causes: ${reliability.risks[0]}`)
  } else if (reliability.status === '🟡') {
    recommendations.push('Set up on-call rotation and incident response procedures')
  }
  
  // Scale recommendations
  if (scale.status === '🔴') {
    recommendations.push(`URGENT: Scale infrastructure immediately - at capacity in ${scale.timeToLimit} months`)
    recommendations.push(`Address bottlenecks: ${scale.bottlenecks[0]}`)
  } else if (scale.status === '🟡') {
    recommendations.push(`Plan scaling strategy - ${scale.timeToLimit} months until capacity`)
  }
  
  // Deployment recommendations
  if (deployment.status === '🔴') {
    recommendations.push('URGENT: Fix deployment pipeline - too many failures')
    if (!deployment.rollbackCapable) {
      recommendations.push('Implement automated rollback capability')
    }
  } else if (deployment.status === '🟡') {
    recommendations.push('Improve deployment reliability and automation')
  }
  
  // Stage-appropriate recommendations
  if (stage === 'idea' || stage === 'validating') {
    recommendations.push('Use managed services (Vercel, Supabase) to minimize ops overhead')
  } else if (stage === 'scaling' || stage === 'revenue') {
    recommendations.push('Consider infrastructure cost optimization vs managed services')
  }
  
  return recommendations.slice(0, 5) // top 5
}

function identifyInfraDecisions(
  cost: CostAnalysis,
  reliability: ReliabilityMetrics,
  scale: ScaleMetrics,
  stage: string,
  os: CompanyOS
): string[] {
  const decisions: string[] = []
  
  // Cost vs reliability tradeoffs
  if (cost.status === '🔴' && reliability.status === '🟢') {
    decisions.push('Trade reliability for cost? Current: expensive but stable. Option: cheaper infrastructure with more risk.')
  }
  
  // Managed vs self-hosted
  if (stage === 'scaling' && cost.costPerCustomer > 20) {
    decisions.push('Move from managed services to self-hosted? Saves cost but requires ops team.')
  }
  
  // Scale timing
  if (scale.status === '🟡' && scale.timeToLimit < 6) {
    decisions.push(`Scale infrastructure now or wait? ${scale.timeToLimit} months until capacity limit.`)
  }
  
  // Multi-region
  if (stage === 'revenue' && reliability.uptimeTarget >= 99.5) {
    decisions.push('Deploy multi-region for reliability? Increases cost ~50% but improves uptime.')
  }
  
  return decisions
}

function extractCustomerCount(os: CompanyOS): number {
  const sales = os.departments.sales
  const product = os.departments.product
  
  // Look for customer count in memory
  const customerMemory = sales?.memory.find(m => m.includes('customers:')) ||
                        product?.memory.find(m => m.includes('users:'))
  
  if (customerMemory) {
    const match = customerMemory.match(/(\d+)/)
    if (match) return parseInt(match[1])
  }
  
  return 100 // default estimate
}

function extractCustomerGrowth(os: CompanyOS): number {
  const sales = os.departments.sales
  
  // Look for growth signals
  const growthMemory = sales?.memory.find(m => m.includes('growth:'))
  
  if (growthMemory) {
    const match = growthMemory.match(/(\d+)%/)
    if (match) return parseInt(match[1])
  }
  
  return 10 // default 10% growth
}

function formatInfrastructureAssessment(assessment: InfrastructureAssessment, stage: string): string {
  const lines: string[] = []
  
  lines.push('INFRASTRUCTURE ASSESSMENT')
  lines.push(`Date: ${new Date().toISOString().split('T')[0]}`)
  lines.push(`Stage: ${stage}`)
  lines.push('')
  lines.push(`OVERALL STATUS: ${assessment.overall}`)
  lines.push('')
  
  // Cost
  lines.push('COST ANALYSIS')
  lines.push(`· Current monthly cost: $${assessment.cost.currentMonthlyCost}`)
  lines.push(`· Cost per customer: $${assessment.cost.costPerCustomer.toFixed(2)}`)
  lines.push(`· Trend: ${assessment.cost.trend} ${assessment.cost.trendPercent > 0 ? '+' : ''}${assessment.cost.trendPercent.toFixed(1)}% vs last month`)
  lines.push('· Top 3 cost drivers:')
  for (let i = 0; i < 3; i++) {
    const driver = assessment.cost.topCostDrivers[i]
    lines.push(`  ${i + 1}. ${driver.service} - $${driver.monthlyCost.toFixed(0)}/mo (${driver.percentage}%)`)
  }
  lines.push(`· Status: ${assessment.cost.status}`)
  lines.push('')
  
  // Reliability
  lines.push('RELIABILITY')
  lines.push(`· Uptime: ${assessment.reliability.uptime}% (target: ${assessment.reliability.uptimeTarget}%)`)
  lines.push(`· Incidents: ${assessment.reliability.incidents} in last 30 days`)
  lines.push(`· MTTR: ${assessment.reliability.mttr} hours average`)
  if (assessment.reliability.risks.length > 0) {
    lines.push('· Top reliability risks:')
    for (let i = 0; i < assessment.reliability.risks.length && i < 2; i++) {
      lines.push(`  ${i + 1}. ${assessment.reliability.risks[i]}`)
    }
  }
  lines.push(`· Status: ${assessment.reliability.status}`)
  lines.push('')
  
  // Scale
  lines.push('SCALE')
  lines.push(`· Current capacity: ${assessment.scale.capacityUtilized}% utilized`)
  lines.push(`· Projected growth: ${assessment.scale.projectedGrowth}% per month`)
  lines.push(`· Time to scale limit: ${assessment.scale.timeToLimit} months`)
  lines.push('· Scaling bottlenecks:')
  for (let i = 0; i < assessment.scale.bottlenecks.length && i < 2; i++) {
    lines.push(`  ${i + 1}. ${assessment.scale.bottlenecks[i]}`)
  }
  lines.push(`· Status: ${assessment.scale.status}`)
  lines.push('')
  
  // Deployment
  lines.push('DEPLOYMENT')
  lines.push(`· Deploy frequency: ${assessment.deployment.frequency}`)
  lines.push(`· Deploy success rate: ${assessment.deployment.successRate}%`)
  lines.push(`· Deploy time: ${assessment.deployment.deployTime} minutes`)
  lines.push(`· Rollback capability: ${assessment.deployment.rollbackCapable ? 'Yes' : 'No'}`)
  lines.push(`· Status: ${assessment.deployment.status}`)
  lines.push('')
  
  // Recommendations
  lines.push('RECOMMENDATIONS')
  for (let i = 0; i < assessment.recommendations.length; i++) {
    lines.push(`${i + 1}. ${assessment.recommendations[i]}`)
  }
  
  // Decisions needed
  if (assessment.decisionsNeeded.length > 0) {
    lines.push('')
    lines.push('INFRASTRUCTURE DECISIONS NEEDED')
    for (const decision of assessment.decisionsNeeded) {
      lines.push(`· ${decision}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.engineering` — deployment practices
- `company.os.departments.operations` — infrastructure operations
- `company.os.profile` — company stage for strategy
- `company.os.events` — incidents, deployments, cost alerts

**Emits:**
- `infrastructure-cost-spike` → alerts to cost increases
- `reliability-degraded` → flags reliability issues
- `scaling-needed` → warns of capacity limits
- `infrastructure-optimized` → confirms improvements

**Consumed by:**
- CEO briefing (includes infrastructure status)
- Finance department (receives cost projections)
- Engineering department (implements recommendations)
- Operations department (executes infrastructure changes)
