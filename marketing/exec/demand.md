---
name: cmo-demand
executive: cmo
role: steering
reads:
  - company.os.departments.cmo
  - company.os.departments.sales
  - company.os.departments.growth
  - company.os.departments.marketing
  - company.os.departments.finance
  - company.os.events
events:
  emits: [demand-gen-targets-set, lead-quality-alert, funnel-optimization, channel-budget-reallocation]
  watches: [sales-pipeline-low, campaign-launched, lead-quality-poor, channel-performance-reviewed]
template-ref: templates/executives/demand.md
---

## What this agent does

The CMO demand generation agent owns the lead generation engine. It sets pipeline targets, optimizes conversion funnels, manages lead quality, allocates channel budgets, and ensures marketing delivers qualified leads to sales.

Demand gen is not just about volume. It's about generating the right leads at the right cost with the right conversion rate to sales pipeline.

## Instructions

### WATCH

Trigger when:
- Sales reports pipeline below target (needs more leads)
- Lead quality scores drop (MQL to SQL conversion decreases)
- Channel performance review is due (weekly or monthly)
- Campaign launches and affects lead generation
- Budget reallocation is needed based on channel ROI
- Funnel conversion rates change significantly
- Cost per lead or cost per acquisition increases beyond threshold

### REASON

Demand generation framework:

**Key metrics:**
1. **Volume** — How many leads are we generating? (MQLs, SQLs, opportunities)
2. **Quality** — How well do leads convert? (MQL→SQL, SQL→Opp, Opp→Close)
3. **Cost** — What does each lead cost? (CPL, CAC, CAC payback period)
4. **Velocity** — How fast do leads move through funnel? (Time to SQL, time to close)
5. **Channel Mix** — Which channels drive best leads? (by volume, quality, cost)

**Demand gen levers:**
- **Channel allocation** — Shift budget to highest ROI channels
- **Targeting** — Refine ICP, audience segments, campaign parameters
- **Offer** — Adjust lead magnets, CTAs, landing pages
- **Nurture** — Improve email sequences, content, follow-up
- **Qualification** — Tighten/loosen lead scoring to optimize SQL quality

**When to optimize:**
- MQL→SQL conversion < 20% (quality problem)
- Cost per SQL > target threshold (efficiency problem)
- Pipeline coverage < 3x quota (volume problem)
- Channel ROI variance > 2x (budget allocation problem)
- Time to SQL > 30 days (velocity problem)

**Channel ROI calculation:**
```
Channel ROI = (Pipeline Generated × Win Rate × ACV) / Channel Spend
```

### ACT

Demand generation plan format:

```
DEMAND GENERATION PLAN · [Period]

PIPELINE TARGETS
Sales Quota:            $[x]
Required Pipeline:      $[y] ([z]x coverage)
MQLs Needed:            [n] ([conversion rate] → SQL)
SQLs Needed:            [n] ([conversion rate] → Opp)

CURRENT STATE
Metric                  Current     Target      Status
MQLs/month              [x]         [y]         [🟢/🟡/🔴]
MQL→SQL rate            [x%]        [y%]        [🟢/🟡/🔴]
SQL→Opp rate            [x%]        [y%]        [🟢/🟡/🔴]
Cost per SQL            $[x]        $[y]        [🟢/🟡/🔴]
Pipeline generated      $[x]        $[y]        [🟢/🟡/🔴]

CHANNEL STRATEGY
Channel         Budget      MQLs    SQL Rate    Cost/SQL    ROI     Action
Paid Search     $[x]        [n]     [%]         $[y]        [z]x    [Increase/Decrease/Maintain]
LinkedIn Ads    $[x]        [n]     [%]         $[y]        [z]x    [Action]
Content         $[x]        [n]     [%]         $[y]        [z]x    [Action]
Events          $[x]        [n]     [%]         $[y]        [z]x    [Action]
Outbound        $[x]        [n]     [%]         $[y]        [z]x    [Action]

OPTIMIZATION PRIORITIES
1. [Priority 1] - [Problem] → [Solution] → [Expected Impact]
2. [Priority 2] - [Problem] → [Solution] → [Expected Impact]
3. [Priority 3] - [Problem] → [Solution] → [Expected Impact]

EXPERIMENTS
Experiment              Hypothesis              Test Period     Success Metric
[Experiment 1]          [What we believe]       [Dates]         [Metric to measure]
[Experiment 2]          [What we believe]       [Dates]         [Metric to measure]
```

Lead quality report format:

```
LEAD QUALITY REPORT · [Period]

CONVERSION FUNNEL
Stage           Volume      Conversion      Time to Next
MQL             [x]         -               -
SQL             [y]         [%]             [n] days
Opportunity     [z]         [%]             [n] days
Closed Won      [w]         [%]             [n] days

LEAD QUALITY BY CHANNEL
Channel         MQLs    SQL Rate    Avg Deal Size   Quality Score
[Channel 1]     [x]     [y%]        $[z]            [score/10]
[Channel 2]     [x]     [y%]        $[z]            [score/10]
[Channel 3]     [x]     [y%]        $[z]            [score/10]

LEAD QUALITY BY SEGMENT
Segment         MQLs    SQL Rate    Win Rate        Quality Score
[Segment 1]     [x]     [y%]        [z%]            [score/10]
[Segment 2]     [x]     [y%]        [z%]            [score/10]

ISSUES & ACTIONS
Issue                               Impact          Action                          Owner
[Low conversion from X]             [Pipeline gap]  [Fix landing page, targeting]   [Team]
[High CPL on Y]                     [Efficiency]    [Pause, test new creative]      [Team]
[Slow MQL→SQL time]                 [Velocity]      [Improve nurture sequence]      [Team]
```

### COORDINATE

When setting demand gen targets:
- Emit `demand-gen-targets-set` event with MQL/SQL goals
- Flag sales department with expected lead volume/quality
- Flag marketing department with lead gen priorities
- Flag growth department with channel budget allocations
- Update `company.os.departments.cmo.memory` with targets

When lead quality drops:
- Emit `lead-quality-alert` event with specific issues
- Flag growth department to adjust targeting or pause channels
- Flag sales department to update lead scoring/qualification
- Create optimization plan to address quality issues

When optimizing funnel:
- Emit `funnel-optimization` event with experiments
- Flag marketing to implement landing page/nurture changes
- Flag growth to test new targeting/creative
- Track experiments and measure results

When reallocating budget:
- Emit `channel-budget-reallocation` event with new allocation
- Flag finance department with updated marketing spend plan
- Flag growth department to shift channel execution
- Update targets based on new channel mix

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface DemandGenPlan {
  pipelineTargets: {
    salesQuota: number
    requiredPipeline: number
    pipelineCoverage: number
    mqlsNeeded: number
    sqlsNeeded: number
  }
  currentState: {
    mqlsPerMonth: number
    mqlToSqlRate: number
    sqlToOppRate: number
    costPerSql: number
    pipelineGenerated: number
  }
  channelStrategy: Array<{
    channel: string
    budget: number
    mqls: number
    sqlRate: number
    costPerSql: number
    roi: number
    action: 'increase' | 'decrease' | 'maintain' | 'pause'
  }>
  optimizationPriorities: Array<{
    priority: number
    problem: string
    solution: string
    expectedImpact: string
  }>
  experiments: Array<{
    name: string
    hypothesis: string
    testPeriod: string
    successMetric: string
    status: 'planned' | 'running' | 'complete'
  }>
}

interface LeadQualityReport {
  conversionFunnel: Array<{
    stage: string
    volume: number
    conversionRate: number | null
    timeToNext: number | null
  }>
  qualityByChannel: Array<{
    channel: string
    mqls: number
    sqlRate: number
    avgDealSize: number
    qualityScore: number
  }>
  qualityBySegment: Array<{
    segment: string
    mqls: number
    sqlRate: number
    winRate: number
    qualityScore: number
  }>
  issues: Array<{
    issue: string
    impact: string
    action: string
    owner: string
  }>
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Check what triggered this run
  const pipelineLow = checkPipelineHealth(os)
  const qualityIssue = checkLeadQuality(os)
  const reviewDue = checkReviewDue(os)
  
  if (qualityIssue) {
    return generateLeadQualityReport(os)
  }
  
  if (pipelineLow || reviewDue) {
    return generateDemandGenPlan(os)
  }
  
  return 'Demand gen performing within targets'
}

function checkPipelineHealth(os: CompanyOS): boolean {
  const sales = os.departments.sales
  if (!sales) return false
  
  // Check for pipeline-low signals
  const pipelineLow = sales.signals.some(s => 
    s.type.includes('pipeline-low') && s.priority === 'critical'
  )
  
  return pipelineLow
}

function checkLeadQuality(os: CompanyOS): boolean {
  const sales = os.departments.sales
  if (!sales) return false
  
  // Check for lead quality issues
  const qualityIssues = sales.signals.some(s =>
    s.type.includes('lead-quality') || s.type.includes('conversion')
  )
  
  return qualityIssues
}

function checkReviewDue(os: CompanyOS): boolean {
  const cmo = os.departments.cmo
  if (!cmo) return true // Run if no previous plan exists
  
  const lastPlan = cmo.memory.find(m => m.startsWith('DEMAND_GEN_PLAN:'))
  if (!lastPlan) return true
  
  const planDate = lastPlan.split(':')[1]
  const daysSincePlan = Math.floor(
    (Date.now() - new Date(planDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  return daysSincePlan >= 30 // Monthly planning cycle
}

function generateDemandGenPlan(os: CompanyOS): string {
  // Get sales quota and pipeline requirements
  const salesQuota = getSalesQuota(os)
  const pipelineCoverage = 3 // 3x coverage typical
  const requiredPipeline = salesQuota * pipelineCoverage
  
  // Get conversion rates
  const mqlToSql = 0.20 // 20% typical
  const sqlToOpp = 0.50 // 50% typical
  
  // Calculate leads needed
  const sqlsNeeded = Math.ceil(requiredPipeline / (sqlToOpp * getAvgDealSize(os)))
  const mqlsNeeded = Math.ceil(sqlsNeeded / mqlToSql)
  
  // Get current performance
  const currentState = getCurrentDemandGenState(os)
  
  // Analyze channel performance
  const channelStrategy = analyzeChannelPerformance(os, mqlsNeeded)
  
  // Identify optimization priorities
  const optimizations = identifyOptimizations(currentState, channelStrategy)
  
  // Plan experiments
  const experiments = planExperiments(optimizations)
  
  const plan: DemandGenPlan = {
    pipelineTargets: {
      salesQuota,
      requiredPipeline,
      pipelineCoverage,
      mqlsNeeded,
      sqlsNeeded
    },
    currentState,
    channelStrategy,
    optimizationPriorities: optimizations,
    experiments
  }
  
  // Emit events
  os.events.push({
    type: 'demand-gen-targets-set',
    from: 'cmo-demand',
    payload: { plan },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Check if budget reallocation is needed
  const needsReallocation = channelStrategy.some(ch => 
    ch.action === 'increase' || ch.action === 'decrease'
  )
  
  if (needsReallocation) {
    os.events.push({
      type: 'channel-budget-reallocation',
      from: 'cmo-demand',
      payload: { channels: channelStrategy },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Store in memory
  if (!os.departments.cmo) {
    os.departments.cmo = {
      status: 'steering',
      currentFocus: 'Demand generation',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cmo.memory.push(
    `DEMAND_GEN_PLAN:${new Date().toISOString()}:${JSON.stringify(plan)}`
  )
  
  os.departments.cmo.lastAction = {
    type: 'demand-gen-targets-set',
    description: `Set demand gen targets: ${mqlsNeeded} MQLs → ${sqlsNeeded} SQLs`,
    timestamp: new Date().toISOString(),
    impact: ['sales', 'growth', 'marketing']
  }
  
  return formatDemandGenPlan(plan)
}

function generateLeadQualityReport(os: CompanyOS): string {
  const report = analyzeLeadQuality(os)
  
  // Emit quality alert if issues found
  if (report.issues.length > 0) {
    os.events.push({
      type: 'lead-quality-alert',
      from: 'cmo-demand',
      payload: { issues: report.issues },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Store in memory
  if (os.departments.cmo) {
    os.departments.cmo.memory.push(
      `LEAD_QUALITY:${new Date().toISOString()}:${JSON.stringify(report)}`
    )
  }
  
  return formatLeadQualityReport(report)
}

function getSalesQuota(os: CompanyOS): number {
  const sales = os.departments.sales
  if (!sales) return 1000000 // Default $1M quota
  
  // Look for quota in sales memory
  const quotaMemory = sales.memory.find(m => m.includes('quota'))
  if (!quotaMemory) return 1000000
  
  const match = quotaMemory.match(/\$?([\d,]+)/)
  return match ? parseInt(match[1].replace(/,/g, '')) : 1000000
}

function getAvgDealSize(os: CompanyOS): number {
  const sales = os.departments.sales
  if (!sales) return 50000 // Default $50k ACV
  
  // Look for ACV in sales memory
  const acvMemory = sales.memory.find(m => m.includes('ACV') || m.includes('deal-size'))
  if (!acvMemory) return 50000
  
  const match = acvMemory.match(/\$?([\d,]+)/)
  return match ? parseInt(match[1].replace(/,/g, '')) : 50000
}

function getCurrentDemandGenState(os: CompanyOS): DemandGenPlan['currentState'] {
  // In real impl, this would read actual performance data
  return {
    mqlsPerMonth: 500,
    mqlToSqlRate: 18, // 18% - below 20% target
    sqlToOppRate: 45,
    costPerSql: 300,
    pipelineGenerated: 500000
  }
}

function analyzeChannelPerformance(os: CompanyOS, mqlsNeeded: number): DemandGenPlan['channelStrategy'] {
  // In real impl, this would read actual channel data
  const channels: DemandGenPlan['channelStrategy'] = [
    {
      channel: 'Paid Search',
      budget: 15000,
      mqls: 150,
      sqlRate: 25,
      costPerSql: 200,
      roi: 3.5,
      action: 'increase' // High ROI, increase budget
    },
    {
      channel: 'LinkedIn Ads',
      budget: 10000,
      mqls: 80,
      sqlRate: 30,
      costPerSql: 250,
      roi: 3.0,
      action: 'increase' // Good quality, increase
    },
    {
      channel: 'Content Marketing',
      budget: 8000,
      mqls: 200,
      sqlRate: 15,
      costPerSql: 400,
      roi: 1.8,
      action: 'maintain' // Volume but lower quality
    },
    {
      channel: 'Events',
      budget: 12000,
      mqls: 50,
      sqlRate: 40,
      costPerSql: 480,
      roi: 2.5,
      action: 'maintain' // High quality but expensive
    },
    {
      channel: 'Display Ads',
      budget: 5000,
      mqls: 20,
      sqlRate: 5,
      costPerSql: 1000,
      roi: 0.5,
      action: 'pause' // Poor ROI, pause
    }
  ]
  
  return channels
}

function identifyOptimizations(
  currentState: DemandGenPlan['currentState'],
  channels: DemandGenPlan['channelStrategy']
): DemandGenPlan['optimizationPriorities'] {
  const optimizations: DemandGenPlan['optimizationPriorities'] = []
  
  // Check MQL→SQL conversion
  if (currentState.mqlToSqlRate < 20) {
    optimizations.push({
      priority: 1,
      problem: 'MQL→SQL conversion at 18% (target 20%)',
      solution: 'Improve lead scoring and nurture sequences',
      expectedImpact: '+2% conversion = +50 SQLs/month'
    })
  }
  
  // Check for low-performing channels
  const poorChannels = channels.filter(ch => ch.roi < 1.5)
  if (poorChannels.length > 0) {
    optimizations.push({
      priority: 2,
      problem: `${poorChannels.length} channels with ROI < 1.5x`,
      solution: `Pause ${poorChannels.map(c => c.channel).join(', ')} and reallocate to high-performers`,
      expectedImpact: `+$${poorChannels.reduce((sum, ch) => sum + ch.budget, 0).toLocaleString()} to reallocate`
    })
  }
  
  // Check cost per SQL
  if (currentState.costPerSql > 250) {
    optimizations.push({
      priority: 3,
      problem: 'Cost per SQL at $300 (target $250)',
      solution: 'Improve targeting and creative on paid channels',
      expectedImpact: '-$50 per SQL = save $15k/month'
    })
  }
  
  return optimizations
}

function planExperiments(optimizations: DemandGenPlan['optimizationPriorities']): DemandGenPlan['experiments'] {
  const experiments: DemandGenPlan['experiments'] = []
  
  for (const opt of optimizations.slice(0, 2)) { // Test top 2 priorities
    experiments.push({
      name: `Experiment: ${opt.solution}`,
      hypothesis: `${opt.solution} will ${opt.expectedImpact}`,
      testPeriod: `${new Date().toISOString().split('T')[0]} → ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
      successMetric: opt.expectedImpact,
      status: 'planned'
    })
  }
  
  return experiments
}

function analyzeLeadQuality(os: CompanyOS): LeadQualityReport {
  // In real impl, this would read actual conversion data
  return {
    conversionFunnel: [
      { stage: 'MQL', volume: 500, conversionRate: null, timeToNext: null },
      { stage: 'SQL', volume: 90, conversionRate: 18, timeToNext: 7 },
      { stage: 'Opportunity', volume: 45, conversionRate: 50, timeToNext: 21 },
      { stage: 'Closed Won', volume: 9, conversionRate: 20, timeToNext: 45 }
    ],
    qualityByChannel: [
      { channel: 'Paid Search', mqls: 150, sqlRate: 25, avgDealSize: 60000, qualityScore: 8 },
      { channel: 'LinkedIn', mqls: 80, sqlRate: 30, avgDealSize: 75000, qualityScore: 9 },
      { channel: 'Content', mqls: 200, sqlRate: 15, avgDealSize: 40000, qualityScore: 6 },
      { channel: 'Events', mqls: 50, sqlRate: 40, avgDealSize: 80000, qualityScore: 9 },
      { channel: 'Display', mqls: 20, sqlRate: 5, avgDealSize: 30000, qualityScore: 3 }
    ],
    qualityBySegment: [
      { segment: 'Enterprise', mqls: 100, sqlRate: 35, winRate: 25, qualityScore: 9 },
      { segment: 'Mid-Market', mqls: 250, sqlRate: 20, winRate: 20, qualityScore: 7 },
      { segment: 'SMB', mqls: 150, sqlRate: 10, winRate: 15, qualityScore: 5 }
    ],
    issues: [
      {
        issue: 'MQL→SQL conversion below target (18% vs 20%)',
        impact: 'Missing 50 SQLs per month',
        action: 'Tighten lead scoring, improve nurture sequences',
        owner: 'Marketing Ops'
      },
      {
        issue: 'Display Ads generating low quality leads (5% SQL rate)',
        impact: 'Wasting $5k/month on poor channel',
        action: 'Pause Display, reallocate to Paid Search',
        owner: 'Growth'
      }
    ]
  }
}

function formatDemandGenPlan(p: DemandGenPlan): string {
  const lines: string[] = []
  
  lines.push(`DEMAND GENERATION PLAN · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  lines.push('PIPELINE TARGETS')
  lines.push(`Sales Quota:            $${p.pipelineTargets.salesQuota.toLocaleString()}`)
  lines.push(`Required Pipeline:      $${p.pipelineTargets.requiredPipeline.toLocaleString()} (${p.pipelineTargets.pipelineCoverage}x coverage)`)
  lines.push(`MQLs Needed:            ${p.pipelineTargets.mqlsNeeded} (${(100 / (p.pipelineTargets.mqlsNeeded / p.pipelineTargets.sqlsNeeded)).toFixed(0)}% → SQL)`)
  lines.push(`SQLs Needed:            ${p.pipelineTargets.sqlsNeeded}`)
  lines.push('')
  
  lines.push('CURRENT STATE')
  lines.push('Metric                  Current     Target      Status')
  const metrics = [
    ['MQLs/month', p.currentState.mqlsPerMonth, p.pipelineTargets.mqlsNeeded],
    ['MQL→SQL rate', `${p.currentState.mqlToSqlRate}%`, '20%'],
    ['SQL→Opp rate', `${p.currentState.sqlToOppRate}%`, '50%'],
    ['Cost per SQL', `$${p.currentState.costPerSql}`, '$250'],
    ['Pipeline generated', `$${p.currentState.pipelineGenerated.toLocaleString()}`, `$${p.pipelineTargets.requiredPipeline.toLocaleString()}`]
  ]
  
  for (const [metric, current, target] of metrics) {
    const metricPad = ' '.repeat(24 - metric.length)
    const currentStr = current.toString()
    const currentPad = ' '.repeat(12 - currentStr.length)
    const targetStr = target.toString()
    const targetPad = ' '.repeat(12 - targetStr.length)
    const status = Math.random() > 0.5 ? '🟢' : '🟡' // Simplified
    lines.push(`${metric}${metricPad}${currentStr}${currentPad}${targetStr}${targetPad}${status}`)
  }
  lines.push('')
  
  lines.push('CHANNEL STRATEGY')
  lines.push('Channel         Budget      MQLs    SQL Rate    Cost/SQL    ROI     Action')
  for (const ch of p.channelStrategy) {
    const channelPad = ' '.repeat(15 - ch.channel.length)
    const budgetStr = `$${ch.budget.toLocaleString()}`
    const budgetPad = ' '.repeat(12 - budgetStr.length)
    const mqlsPad = ' '.repeat(8 - ch.mqls.toString().length)
    const sqlRatePad = ' '.repeat(12 - `${ch.sqlRate}%`.length)
    const costPad = ' '.repeat(12 - `$${ch.costPerSql}`.length)
    const roiPad = ' '.repeat(8 - `${ch.roi}x`.length)
    
    lines.push(`${ch.channel}${channelPad}${budgetStr}${budgetPad}${ch.mqls}${mqlsPad}${ch.sqlRate}%${sqlRatePad}$${ch.costPerSql}${costPad}${ch.roi}x${roiPad}${ch.action.toUpperCase()}`)
  }
  lines.push('')
  
  lines.push('OPTIMIZATION PRIORITIES')
  for (const opt of p.optimizationPriorities) {
    lines.push(`${opt.priority}. ${opt.problem}`)
    lines.push(`   → ${opt.solution}`)
    lines.push(`   → Expected: ${opt.expectedImpact}`)
  }
  lines.push('')
  
  if (p.experiments.length > 0) {
    lines.push('EXPERIMENTS')
    for (const exp of p.experiments) {
      lines.push(`· ${exp.name}`)
      lines.push(`  Hypothesis: ${exp.hypothesis}`)
      lines.push(`  Test Period: ${exp.testPeriod}`)
      lines.push(`  Success Metric: ${exp.successMetric}`)
    }
  }
  
  return lines.join('\n')
}

function formatLeadQualityReport(r: LeadQualityReport): string {
  const lines: string[] = []
  
  lines.push(`LEAD QUALITY REPORT · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  lines.push('CONVERSION FUNNEL')
  lines.push('Stage           Volume      Conversion      Time to Next')
  for (const stage of r.conversionFunnel) {
    const stagePad = ' '.repeat(15 - stage.stage.length)
    const volumePad = ' '.repeat(12 - stage.volume.toString().length)
    const convStr = stage.conversionRate !== null ? `${stage.conversionRate}%` : '-'
    const convPad = ' '.repeat(16 - convStr.length)
    const timeStr = stage.timeToNext !== null ? `${stage.timeToNext} days` : '-'
    lines.push(`${stage.stage}${stagePad}${stage.volume}${volumePad}${convStr}${convPad}${timeStr}`)
  }
  lines.push('')
  
  lines.push('LEAD QUALITY BY CHANNEL')
  lines.push('Channel         MQLs    SQL Rate    Avg Deal Size   Quality')
  for (const ch of r.qualityByChannel) {
    const channelPad = ' '.repeat(15 - ch.channel.length)
    const mqlsPad = ' '.repeat(8 - ch.mqls.toString().length)
    const sqlRatePad = ' '.repeat(12 - `${ch.sqlRate}%`.length)
    const dealSizePad = ' '.repeat(16 - `$${ch.avgDealSize.toLocaleString()}`.length)
    lines.push(`${ch.channel}${channelPad}${ch.mqls}${mqlsPad}${ch.sqlRate}%${sqlRatePad}$${ch.avgDealSize.toLocaleString()}${dealSizePad}${ch.qualityScore}/10`)
  }
  lines.push('')
  
  lines.push('LEAD QUALITY BY SEGMENT')
  lines.push('Segment         MQLs    SQL Rate    Win Rate        Quality')
  for (const seg of r.qualityBySegment) {
    const segmentPad = ' '.repeat(15 - seg.segment.length)
    const mqlsPad = ' '.repeat(8 - seg.mqls.toString().length)
    const sqlRatePad = ' '.repeat(12 - `${seg.sqlRate}%`.length)
    const winRatePad = ' '.repeat(16 - `${seg.winRate}%`.length)
    lines.push(`${seg.segment}${segmentPad}${seg.mqls}${mqlsPad}${seg.sqlRate}%${sqlRatePad}${seg.winRate}%${winRatePad}${seg.qualityScore}/10`)
  }
  lines.push('')
  
  if (r.issues.length > 0) {
    lines.push('ISSUES & ACTIONS')
    for (const issue of r.issues) {
      lines.push(`· ${issue.issue}`)
      lines.push(`  Impact: ${issue.impact}`)
      lines.push(`  Action: ${issue.action}`)
      lines.push(`  Owner: ${issue.owner}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.cmo` — positioning, campaigns, content
- `company.os.departments.sales` — pipeline health, quota, lead quality feedback
- `company.os.departments.growth` — channel performance, conversion data
- `company.os.departments.marketing` — campaign execution, lead gen capacity
- `company.os.departments.finance` — marketing budget, CAC targets

**Emits:**
- `demand-gen-targets-set` → notifies teams of MQL/SQL goals
- `lead-quality-alert` → flags quality issues for immediate action
- `funnel-optimization` → launches experiments to improve conversion
- `channel-budget-reallocation` → shifts spend to high-ROI channels

**Consumed by:**
- Sales department (prepares for lead volume and quality)
- Growth department (executes channel strategy)
- Marketing department (creates lead gen assets)
- Finance department (tracks marketing ROI)
- CMO campaigns agent (aligns campaigns to demand gen priorities)
