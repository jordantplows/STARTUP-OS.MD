---
name: cmo-campaigns
executive: cmo
role: steering
reads:
  - company.os.departments.cmo
  - company.os.departments.product
  - company.os.departments.sales
  - company.os.departments.growth
  - company.os.departments.marketing
  - company.os.events
events:
  emits: [campaign-planned, campaign-launched, campaign-complete, campaign-performance]
  watches: [product-launched, sales-pipeline-low, content-published, positioning-updated]
template-ref: templates/executives/campaigns.md
---

## What this agent does

The CMO campaigns agent plans, launches, and measures integrated marketing campaigns. It coordinates across channels (email, ads, content, events, PR) to drive specific business outcomes like product launches, pipeline generation, or brand awareness.

A campaign is not a single tactic. It's an integrated effort with clear goal, timeline, budget, channel mix, and success metrics.

## Instructions

### WATCH

Trigger when:
- Product launches major feature requiring go-to-market campaign
- Sales reports pipeline below target and needs lead generation campaign
- New positioning is set and requires market education campaign
- Quarterly campaign planning cycle begins
- Campaign end date reaches and performance review is due
- Marketing team requests campaign brief for execution

### REASON

Campaign planning framework:

**Campaign types:**
1. **Product Launch** — Drive awareness and adoption of new capability
2. **Demand Generation** — Generate qualified leads for sales pipeline
3. **Brand Awareness** — Increase market visibility and mindshare
4. **Customer Marketing** — Expand, retain, or activate existing customers
5. **Event/Moment** — Leverage conference, industry moment, or announcement

**Campaign planning checklist:**
- **Goal** — What specific outcome? (launches, leads, pipeline, awareness)
- **Audience** — Who are we targeting? (use positioning ICP)
- **Message** — What's the campaign narrative? (use positioning messaging)
- **Channels** — Where will we activate? (email, ads, content, PR, events)
- **Timeline** — When does it start/end? (sprint or sustained)
- **Budget** — What resources are allocated? (ad spend, headcount, agencies)
- **Success Metrics** — How do we measure? (leading and lagging indicators)
- **Assets Required** — What needs to be created? (landing page, ads, emails, content)

**Channel selection:**
- Owned (blog, email, website) — Full control, existing audience, low cost
- Earned (PR, partnerships, community) — High credibility, low cost, hard to control
- Paid (ads, sponsorships) — Fast reach, high cost, requires creative + targeting

**Budget allocation heuristic:**
- Product launch: 30% paid, 40% owned, 30% earned
- Demand gen: 60% paid, 30% owned, 10% earned
- Brand awareness: 20% paid, 30% owned, 50% earned

### ACT

Campaign brief format:

```
CAMPAIGN BRIEF · [Campaign Name]

OBJECTIVE
Goal:           [Specific measurable outcome]
Timeline:       [Start date] → [End date]
Budget:         $[amount] ([breakdown by channel])
Owner:          [Team/person responsible]

TARGET AUDIENCE
Primary:        [ICP segment from positioning]
Secondary:      [Adjacent audience]
Size:           [Estimated reach]

CAMPAIGN NARRATIVE
Problem:        [Pain point we're addressing]
Solution:       [How we solve it]
Call to Action: [What we want them to do]
Key Message:    [One sentence campaign theme]

CHANNEL STRATEGY
Channel         Tactic                  Budget    Goal
Email           [Specific approach]     $[x]      [metric]
Paid Social     [Specific approach]     $[x]      [metric]
Content         [Specific approach]     $[x]      [metric]
PR              [Specific approach]     $[x]      [metric]
Events          [Specific approach]     $[x]      [metric]

ASSETS REQUIRED
· [Landing page] - [Deadline] - [Owner]
· [Email series] - [Deadline] - [Owner]
· [Ad creative] - [Deadline] - [Owner]
· [Blog content] - [Deadline] - [Owner]

SUCCESS METRICS
Leading Indicators:
· [Metric]: [Target] by [date]
· [Metric]: [Target] by [date]

Lagging Indicators:
· [Metric]: [Target] by [date]
· [Metric]: [Target] by [date]

DEPENDENCIES
· [Dependency 1] - [Status]
· [Dependency 2] - [Status]
```

Campaign performance report format:

```
CAMPAIGN PERFORMANCE · [Campaign Name]

OVERVIEW
Duration:       [Start] → [End]
Budget:         $[spent] / $[allocated] ([%] of budget)
Status:         [Complete/In Progress]

RESULTS
Goal:           [Original goal]
Achieved:       [Actual result] ([% of goal])

Metrics         Target      Actual      % of Goal
[Metric 1]      [target]    [actual]    [%]
[Metric 2]      [target]    [actual]    [%]
[Metric 3]      [target]    [actual]    [%]

CHANNEL BREAKDOWN
Channel         Budget      Spent       Results             ROI
[Channel 1]     $[x]        $[y]        [metric]            [ratio]
[Channel 2]     $[x]        $[y]        [metric]            [ratio]

LEARNINGS
What worked:
· [Specific success]
· [Specific success]

What didn't work:
· [Specific failure]
· [Specific failure]

What to do next:
· [Recommendation]
· [Recommendation]
```

### COORDINATE

When planning campaign:
- Emit `campaign-planned` event with brief
- Flag marketing department to begin asset creation
- Flag growth department to prepare channel execution
- Flag sales department to prepare for lead influx
- Add campaign to `company.os.departments.cmo.memory`

When launching campaign:
- Emit `campaign-launched` event with start date and assets
- Notify all participating departments
- Set up performance monitoring

When campaign completes:
- Emit `campaign-complete` event with end date
- Emit `campaign-performance` event with results
- Update CMO memory with learnings
- Share learnings with marketing and growth teams

## TypeScript

```typescript
import { CompanyOS, Event } from '../src/company-os'

interface Campaign {
  id: string
  name: string
  type: 'product-launch' | 'demand-gen' | 'brand-awareness' | 'customer-marketing' | 'event'
  objective: {
    goal: string
    timeline: { start: string; end: string }
    budget: number
    owner: string
  }
  audience: {
    primary: string
    secondary?: string
    estimatedReach: number
  }
  narrative: {
    problem: string
    solution: string
    callToAction: string
    keyMessage: string
  }
  channels: Array<{
    channel: string
    tactic: string
    budget: number
    goal: string
  }>
  assets: Array<{
    name: string
    deadline: string
    owner: string
    status: 'pending' | 'in-progress' | 'complete'
  }>
  metrics: {
    leading: Array<{ metric: string; target: number }>
    lagging: Array<{ metric: string; target: number }>
  }
  status: 'planned' | 'launched' | 'complete'
  performance?: CampaignPerformance
}

interface CampaignPerformance {
  budgetSpent: number
  results: Record<string, { target: number; actual: number }>
  channelBreakdown: Array<{
    channel: string
    budgetSpent: number
    results: string
    roi: number
  }>
  learnings: {
    worked: string[]
    didntWork: string[]
    nextActions: string[]
  }
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Check if we're reviewing existing campaign or planning new one
  const activeCampaigns = getActiveCampaigns(os)
  const campaignsDue = activeCampaigns.filter(c => 
    new Date(c.objective.timeline.end) <= new Date()
  )
  
  // If campaigns are complete, review them
  if (campaignsDue.length > 0) {
    return reviewCampaigns(os, campaignsDue)
  }
  
  // Check if new campaign is needed
  const campaignNeeded = assessCampaignNeed(os)
  if (!campaignNeeded) {
    return 'No new campaign needed at this time'
  }
  
  // Plan new campaign
  const campaign = planCampaign(os, campaignNeeded)
  
  // Emit campaign-planned event
  os.events.push({
    type: 'campaign-planned',
    from: 'cmo-campaigns',
    payload: { campaign },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Store in CMO memory
  if (!os.departments.cmo) {
    os.departments.cmo = {
      status: 'steering',
      currentFocus: 'Campaign management',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cmo.memory.push(
    `CAMPAIGN:${campaign.id}:${JSON.stringify(campaign)}`
  )
  
  os.departments.cmo.lastAction = {
    type: 'campaign-planned',
    description: `Planned ${campaign.type} campaign: ${campaign.name}`,
    timestamp: new Date().toISOString(),
    impact: ['marketing', 'growth', 'sales']
  }
  
  return formatCampaignBrief(campaign)
}

function getActiveCampaigns(os: CompanyOS): Campaign[] {
  const cmo = os.departments.cmo
  if (!cmo) return []
  
  return cmo.memory
    .filter(m => m.startsWith('CAMPAIGN:'))
    .map(m => {
      const parts = m.split(':')
      if (parts.length < 3) return null
      try {
        return JSON.parse(parts.slice(2).join(':')) as Campaign
      } catch {
        return null
      }
    })
    .filter((c): c is Campaign => c !== null)
    .filter(c => c.status === 'launched')
}

function assessCampaignNeed(os: CompanyOS): string | null {
  // Check for product launch
  const productLaunches = os.events.filter(e => 
    e.type === 'product-launched' && 
    !e.consumed.includes('cmo-campaigns')
  )
  if (productLaunches.length > 0) {
    return 'product-launch'
  }
  
  // Check for low sales pipeline
  const sales = os.departments.sales
  if (sales) {
    const lowPipeline = sales.signals.some(s => 
      s.type.includes('pipeline-low') && s.priority === 'critical'
    )
    if (lowPipeline) {
      return 'demand-gen'
    }
  }
  
  // Check for positioning update
  const positioningUpdates = os.events.filter(e => 
    e.type === 'positioning-updated' &&
    !e.consumed.includes('cmo-campaigns')
  )
  if (positioningUpdates.length > 0) {
    return 'brand-awareness'
  }
  
  return null
}

function planCampaign(os: CompanyOS, campaignType: string): Campaign {
  const positioning = getCMOPositioning(os)
  const campaignId = `campaign-${Date.now()}`
  
  // Base campaign structure varies by type
  const baseTimeline = {
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
  
  const campaign: Campaign = {
    id: campaignId,
    name: `${campaignType} - ${new Date().toISOString().split('T')[0]}`,
    type: campaignType as Campaign['type'],
    objective: {
      goal: getGoalForCampaignType(campaignType),
      timeline: baseTimeline,
      budget: getBudgetForCampaignType(campaignType, os),
      owner: 'marketing'
    },
    audience: {
      primary: positioning?.icp || os.profile.targetCustomer || 'Target customers',
      estimatedReach: 10000
    },
    narrative: {
      problem: positioning?.pain || os.profile.problem || 'Customer pain point',
      solution: positioning?.solution || 'Our solution',
      callToAction: getCallToActionForType(campaignType),
      keyMessage: positioning?.oneLiner || os.profile.oneline || 'Key message'
    },
    channels: getChannelsForCampaignType(campaignType),
    assets: getAssetsForCampaignType(campaignType),
    metrics: getMetricsForCampaignType(campaignType),
    status: 'planned'
  }
  
  return campaign
}

function getCMOPositioning(os: CompanyOS): any {
  const cmo = os.departments.cmo
  if (!cmo) return null
  
  const positioningMemory = cmo.memory.find(m => m.startsWith('POSITIONING:'))
  if (!positioningMemory) return null
  
  const parts = positioningMemory.split(':')
  if (parts.length < 3) return null
  
  try {
    const pos = JSON.parse(parts.slice(2).join(':'))
    return {
      icp: pos.icp?.company,
      pain: pos.icp?.pain,
      solution: pos.solution,
      oneLiner: pos.valueProposition?.oneLiner
    }
  } catch {
    return null
  }
}

function getGoalForCampaignType(type: string): string {
  switch (type) {
    case 'product-launch': return 'Drive 1000 trial signups in first 30 days'
    case 'demand-gen': return 'Generate 500 qualified leads for sales pipeline'
    case 'brand-awareness': return 'Reach 100k target audience impressions'
    case 'customer-marketing': return 'Drive 20% increase in customer activation'
    case 'event': return 'Register 200 attendees and generate 50 leads'
    default: return 'Campaign goal TBD'
  }
}

function getBudgetForCampaignType(type: string, os: CompanyOS): number {
  // Simple heuristic - real impl would read from finance
  const baseBudget = 10000
  
  switch (type) {
    case 'product-launch': return baseBudget * 2
    case 'demand-gen': return baseBudget * 1.5
    case 'brand-awareness': return baseBudget
    case 'customer-marketing': return baseBudget * 0.5
    case 'event': return baseBudget * 1.2
    default: return baseBudget
  }
}

function getCallToActionForType(type: string): string {
  switch (type) {
    case 'product-launch': return 'Start free trial'
    case 'demand-gen': return 'Request demo'
    case 'brand-awareness': return 'Learn more'
    case 'customer-marketing': return 'Upgrade now'
    case 'event': return 'Register today'
    default: return 'Get started'
  }
}

function getChannelsForCampaignType(type: string): Campaign['channels'] {
  // Channel mix varies by campaign type
  const channels: Campaign['channels'] = []
  
  switch (type) {
    case 'product-launch':
      channels.push(
        { channel: 'Email', tactic: 'Announcement + nurture series', budget: 2000, goal: '500 opens' },
        { channel: 'Paid Social', tactic: 'Targeted ads to ICP', budget: 8000, goal: '200 conversions' },
        { channel: 'Content', tactic: 'Launch blog post + guides', budget: 3000, goal: '5000 views' },
        { channel: 'PR', tactic: 'Press release + journalist outreach', budget: 2000, goal: '5 placements' }
      )
      break
    case 'demand-gen':
      channels.push(
        { channel: 'Paid Search', tactic: 'Intent-based keywords', budget: 8000, goal: '300 leads' },
        { channel: 'LinkedIn Ads', tactic: 'Targeted to decision makers', budget: 5000, goal: '150 leads' },
        { channel: 'Email', tactic: 'Nurture sequence', budget: 1000, goal: '100 MQLs' },
        { channel: 'Content', tactic: 'Gated assets', budget: 2000, goal: '100 downloads' }
      )
      break
    case 'brand-awareness':
      channels.push(
        { channel: 'Content', tactic: 'Thought leadership', budget: 4000, goal: '50k views' },
        { channel: 'Social Media', tactic: 'Organic + amplification', budget: 3000, goal: '25k reach' },
        { channel: 'PR', tactic: 'Media relations', budget: 2000, goal: '10 placements' },
        { channel: 'Partnerships', tactic: 'Co-marketing', budget: 1000, goal: '25k impressions' }
      )
      break
  }
  
  return channels
}

function getAssetsForCampaignType(type: string): Campaign['assets'] {
  const baseDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  const assets: Campaign['assets'] = []
  
  switch (type) {
    case 'product-launch':
      assets.push(
        { name: 'Landing page', deadline: baseDate, owner: 'marketing', status: 'pending' },
        { name: 'Email series (5 emails)', deadline: baseDate, owner: 'marketing', status: 'pending' },
        { name: 'Ad creative (3 variants)', deadline: baseDate, owner: 'design', status: 'pending' },
        { name: 'Launch blog post', deadline: baseDate, owner: 'content', status: 'pending' },
        { name: 'Press release', deadline: baseDate, owner: 'marketing', status: 'pending' }
      )
      break
    case 'demand-gen':
      assets.push(
        { name: 'Lead capture page', deadline: baseDate, owner: 'marketing', status: 'pending' },
        { name: 'Gated content asset', deadline: baseDate, owner: 'content', status: 'pending' },
        { name: 'Ad creative', deadline: baseDate, owner: 'design', status: 'pending' },
        { name: 'Nurture email sequence', deadline: baseDate, owner: 'marketing', status: 'pending' }
      )
      break
  }
  
  return assets
}

function getMetricsForCampaignType(type: string): Campaign['metrics'] {
  switch (type) {
    case 'product-launch':
      return {
        leading: [
          { metric: 'Landing page visits', target: 5000 },
          { metric: 'Email open rate', target: 25 },
          { metric: 'Ad impressions', target: 100000 }
        ],
        lagging: [
          { metric: 'Trial signups', target: 1000 },
          { metric: 'Activated users', target: 300 }
        ]
      }
    case 'demand-gen':
      return {
        leading: [
          { metric: 'Ad clicks', target: 2000 },
          { metric: 'Landing page conversion', target: 20 },
          { metric: 'Content downloads', target: 500 }
        ],
        lagging: [
          { metric: 'MQLs generated', target: 500 },
          { metric: 'SQLs created', target: 100 }
        ]
      }
    default:
      return {
        leading: [{ metric: 'Impressions', target: 10000 }],
        lagging: [{ metric: 'Conversions', target: 100 }]
      }
  }
}

function reviewCampaigns(os: CompanyOS, campaigns: Campaign[]): string {
  // Review each campaign and emit performance events
  const reports: string[] = []
  
  for (const campaign of campaigns) {
    // In real impl, this would read actual performance data
    const performance: CampaignPerformance = {
      budgetSpent: campaign.objective.budget * 0.9,
      results: {},
      channelBreakdown: campaign.channels.map(ch => ({
        channel: ch.channel,
        budgetSpent: ch.budget * 0.9,
        results: ch.goal,
        roi: 1.5
      })),
      learnings: {
        worked: ['Channel mix was effective', 'Messaging resonated with ICP'],
        didntWork: ['Some assets delivered late', 'Budget allocation could be optimized'],
        nextActions: ['Increase budget for top performing channel', 'Improve asset production timeline']
      }
    }
    
    campaign.performance = performance
    campaign.status = 'complete'
    
    // Emit campaign-complete event
    os.events.push({
      type: 'campaign-complete',
      from: 'cmo-campaigns',
      payload: { campaignId: campaign.id, campaignName: campaign.name },
      timestamp: new Date().toISOString(),
      consumed: []
    })
    
    // Emit campaign-performance event
    os.events.push({
      type: 'campaign-performance',
      from: 'cmo-campaigns',
      payload: { campaignId: campaign.id, performance },
      timestamp: new Date().toISOString(),
      consumed: []
    })
    
    reports.push(formatCampaignPerformance(campaign))
  }
  
  return reports.join('\n\n')
}

function formatCampaignBrief(c: Campaign): string {
  const lines: string[] = []
  
  lines.push(`CAMPAIGN BRIEF · ${c.name}`)
  lines.push('')
  lines.push('OBJECTIVE')
  lines.push(`Goal:           ${c.objective.goal}`)
  lines.push(`Timeline:       ${c.objective.timeline.start} → ${c.objective.timeline.end}`)
  lines.push(`Budget:         $${c.objective.budget.toLocaleString()}`)
  lines.push(`Owner:          ${c.objective.owner}`)
  lines.push('')
  
  lines.push('TARGET AUDIENCE')
  lines.push(`Primary:        ${c.audience.primary}`)
  if (c.audience.secondary) {
    lines.push(`Secondary:      ${c.audience.secondary}`)
  }
  lines.push(`Est. Reach:     ${c.audience.estimatedReach.toLocaleString()}`)
  lines.push('')
  
  lines.push('CAMPAIGN NARRATIVE')
  lines.push(`Problem:        ${c.narrative.problem}`)
  lines.push(`Solution:       ${c.narrative.solution}`)
  lines.push(`Call to Action: ${c.narrative.callToAction}`)
  lines.push(`Key Message:    ${c.narrative.keyMessage}`)
  lines.push('')
  
  lines.push('CHANNEL STRATEGY')
  lines.push('Channel         Tactic                          Budget      Goal')
  for (const ch of c.channels) {
    const channelPad = ' '.repeat(15 - ch.channel.length)
    const tacticPad = ' '.repeat(32 - ch.tactic.length)
    const budgetStr = `$${ch.budget.toLocaleString()}`
    const budgetPad = ' '.repeat(12 - budgetStr.length)
    lines.push(`${ch.channel}${channelPad}${ch.tactic}${tacticPad}${budgetStr}${budgetPad}${ch.goal}`)
  }
  lines.push('')
  
  lines.push('ASSETS REQUIRED')
  for (const asset of c.assets) {
    lines.push(`· ${asset.name} - ${asset.deadline} - ${asset.owner}`)
  }
  lines.push('')
  
  lines.push('SUCCESS METRICS')
  lines.push('Leading Indicators:')
  for (const m of c.metrics.leading) {
    lines.push(`· ${m.metric}: ${m.target.toLocaleString()}`)
  }
  lines.push('Lagging Indicators:')
  for (const m of c.metrics.lagging) {
    lines.push(`· ${m.metric}: ${m.target.toLocaleString()}`)
  }
  
  return lines.join('\n')
}

function formatCampaignPerformance(c: Campaign): string {
  if (!c.performance) return 'No performance data available'
  
  const p = c.performance
  const lines: string[] = []
  
  lines.push(`CAMPAIGN PERFORMANCE · ${c.name}`)
  lines.push('')
  lines.push('OVERVIEW')
  lines.push(`Duration:       ${c.objective.timeline.start} → ${c.objective.timeline.end}`)
  lines.push(`Budget:         $${p.budgetSpent.toLocaleString()} / $${c.objective.budget.toLocaleString()} (${Math.round(p.budgetSpent / c.objective.budget * 100)}%)`)
  lines.push(`Status:         ${c.status}`)
  lines.push('')
  
  lines.push('CHANNEL BREAKDOWN')
  lines.push('Channel         Budget      Spent       Results             ROI')
  for (const ch of p.channelBreakdown) {
    const channelPad = ' '.repeat(15 - ch.channel.length)
    const budgetStr = `$${ch.budgetSpent.toLocaleString()}`
    const budgetPad = ' '.repeat(12 - budgetStr.length)
    const spentPad = ' '.repeat(12 - ch.results.length)
    lines.push(`${ch.channel}${channelPad}$${ch.budgetSpent.toLocaleString()}${budgetPad}$${ch.budgetSpent.toLocaleString()}${spentPad}${ch.results}${' '.repeat(20 - ch.results.length)}${ch.roi.toFixed(1)}x`)
  }
  lines.push('')
  
  lines.push('LEARNINGS')
  lines.push('What worked:')
  for (const w of p.learnings.worked) {
    lines.push(`· ${w}`)
  }
  lines.push('What didn\'t work:')
  for (const d of p.learnings.didntWork) {
    lines.push(`· ${d}`)
  }
  lines.push('What to do next:')
  for (const n of p.learnings.nextActions) {
    lines.push(`· ${n}`)
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.cmo` — positioning, brand guidelines
- `company.os.departments.product` — product launches, roadmap
- `company.os.departments.sales` — pipeline health, lead quality
- `company.os.departments.growth` — channel performance, budget
- `company.os.departments.marketing` — asset production capacity

**Emits:**
- `campaign-planned` → notifies teams to prepare for campaign
- `campaign-launched` → triggers coordinated execution
- `campaign-complete` → marks campaign end
- `campaign-performance` → shares learnings across teams

**Consumed by:**
- Marketing department (creates campaign assets)
- Growth department (executes channel tactics)
- Sales department (prepares for lead influx)
- CMO content agent (aligns content to campaign themes)
- CMO demand agent (uses campaign performance for lead gen optimization)
