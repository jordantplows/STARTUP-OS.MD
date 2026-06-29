---
name: cmo-content
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
  emits: [content-strategy-set, content-calendar-updated, content-published, content-performance]
  watches: [positioning-updated, campaign-launched, product-launched, customer-question, competitor-published]
template-ref: templates/executives/content.md
---

## What this agent does

The CMO content agent sets editorial direction, defines content strategy, manages the content calendar, and measures content performance. It ensures all content aligns with positioning, supports campaigns, and drives business outcomes.

Content is not just blog posts. It's every piece of customer-facing information: blog, docs, emails, case studies, guides, videos, podcasts, social posts, sales collateral.

## Instructions

### WATCH

Trigger when:
- Positioning is updated and content needs to reflect new messaging
- Campaign is launched and needs supporting content
- Product launches and requires educational content
- Content calendar review is due (weekly or monthly)
- Content performance metrics show underperformance
- Sales reports common customer questions that content should address
- Competitor publishes content in our category
- Growth reports content gaps in funnel

### REASON

Content strategy framework:

**Content purposes:**
1. **Awareness** — Attract new audience, establish thought leadership
2. **Education** — Teach category/problem, position solution
3. **Consideration** — Help buyers evaluate and compare solutions
4. **Conversion** — Drive action (trial, demo, purchase)
5. **Retention** — Help customers succeed and expand

**Content types by funnel stage:**
- Top of funnel: Blog posts, guides, infographics, videos, podcasts
- Middle of funnel: Case studies, comparison pages, webinars, demos
- Bottom of funnel: Product docs, implementation guides, ROI calculators
- Customer: Feature announcements, best practices, advanced guides

**Content planning principles:**
- **Aligned to positioning** — Use messaging hierarchy, customer language
- **Aligned to campaigns** — Support active campaigns with content
- **Aligned to product** — Cover product launches and capabilities
- **Aligned to sales** — Address objections and common questions
- **Distributed strategically** — Right content, right channel, right time

**Content performance metrics:**
- **Traffic** — Views, visitors, sessions
- **Engagement** — Time on page, scroll depth, shares
- **Conversion** — CTR, form fills, trial starts
- **Pipeline** — Influenced opportunities, revenue attribution
- **SEO** — Rankings, backlinks, domain authority

### ACT

Content strategy format:

```
CONTENT STRATEGY · [Date]

EDITORIAL MISSION
Purpose:        [Why we publish content]
Audience:       [Who we're creating for - use positioning ICP]
Voice:          [How we sound - brand personality]
Themes:         [Core topics we own]

CONTENT PILLARS
1. [Pillar 1 Topic]
   Purpose:     [Awareness/Education/Consideration/Conversion]
   Audience:    [Segment]
   Formats:     [Blog, video, guide, etc.]
   Frequency:   [Weekly/Monthly]
   
2. [Pillar 2 Topic]
   Purpose:     [Purpose]
   Audience:    [Segment]
   Formats:     [Formats]
   Frequency:   [Frequency]

3. [Pillar 3 Topic]
   Purpose:     [Purpose]
   Audience:    [Segment]
   Formats:     [Formats]
   Frequency:   [Frequency]

DISTRIBUTION STRATEGY
Channel         Content Type        Frequency   Goal
Blog            [Types]             [x/week]    [Metric]
Email           [Types]             [x/week]    [Metric]
Social          [Types]             [x/day]     [Metric]
YouTube         [Types]             [x/month]   [Metric]
LinkedIn        [Types]             [x/week]    [Metric]

CONTENT CALENDAR (Next 30 Days)
Date        Title                   Type        Stage       Owner       Status
[Date]      [Title]                 [Type]      [Stage]     [Owner]     [Status]
[Date]      [Title]                 [Type]      [Stage]     [Owner]     [Status]

CONTENT GAPS
Gap                                 Priority    Action
[Missing content for X]             High        [Create by date]
[Need more content for Y]           Medium      [Plan for Q2]

SUCCESS METRICS
Goal                                Target      Current     Status
[Traffic to blog]                   [x/month]   [y/month]   [🟢/🟡/🔴]
[Content influenced pipeline]       $[x]        $[y]        [🟢/🟡/🔴]
[Email subscriber growth]           [x]         [y]         [🟢/🟡/🔴]
```

Content performance report:

```
CONTENT PERFORMANCE · [Period]

TOP PERFORMING CONTENT
Title                           Views       Conversions     Pipeline
[Content 1]                     [x]         [y]             $[z]
[Content 2]                     [x]         [y]             $[z]
[Content 3]                     [x]         [y]             $[z]

CHANNEL PERFORMANCE
Channel         Content Pieces  Avg Views   Conversion Rate
Blog            [x]             [y]         [z%]
Email           [x]             [y]         [z%]
Social          [x]             [y]         [z%]

FUNNEL ANALYSIS
Stage           Content         Performance     Gap
Top             [x] pieces      [Good/Bad]      [None/Need more]
Middle          [x] pieces      [Good/Bad]      [None/Need more]
Bottom          [x] pieces      [Good/Bad]      [None/Need more]

RECOMMENDATIONS
· [Recommendation 1 with data]
· [Recommendation 2 with data]
· [Recommendation 3 with data]
```

### COORDINATE

When setting content strategy:
- Emit `content-strategy-set` event with pillars and distribution plan
- Flag marketing department to execute on content calendar
- Flag sales department to provide input on content needs
- Update `company.os.departments.cmo.memory` with strategy

When publishing content:
- Emit `content-published` event with title, URL, type
- Flag growth department to promote content
- Flag sales department to use in outreach
- Track content in calendar for performance monitoring

When reviewing performance:
- Emit `content-performance` event with top/bottom performers
- Flag marketing to double down on what works
- Flag marketing to fix or kill what doesn't work
- Update content strategy based on learnings

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface ContentStrategy {
  mission: {
    purpose: string
    audience: string
    voice: string
    themes: string[]
  }
  pillars: Array<{
    topic: string
    purpose: 'awareness' | 'education' | 'consideration' | 'conversion' | 'retention'
    audience: string
    formats: string[]
    frequency: string
  }>
  distribution: Array<{
    channel: string
    contentType: string
    frequency: string
    goal: string
  }>
  gaps: Array<{
    gap: string
    priority: 'high' | 'medium' | 'low'
    action: string
  }>
  metrics: Array<{
    goal: string
    target: number
    current: number
    status: 'on-track' | 'at-risk' | 'off-track'
  }>
}

interface ContentCalendarItem {
  date: string
  title: string
  type: string
  stage: string
  owner: string
  status: 'planned' | 'in-progress' | 'published'
  performance?: {
    views: number
    conversions: number
    pipelineInfluence: number
  }
}

interface ContentPerformance {
  topPerforming: Array<{
    title: string
    views: number
    conversions: number
    pipeline: number
  }>
  channelBreakdown: Array<{
    channel: string
    contentPieces: number
    avgViews: number
    conversionRate: number
  }>
  funnelAnalysis: Array<{
    stage: string
    contentCount: number
    performance: 'good' | 'bad'
    gap: string
  }>
  recommendations: string[]
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Check what triggered this run
  const needsStrategyUpdate = checkStrategyUpdateNeeded(os)
  const needsPerformanceReview = checkPerformanceReviewDue(os)
  
  if (needsPerformanceReview) {
    return reviewContentPerformance(os)
  }
  
  if (needsStrategyUpdate) {
    return updateContentStrategy(os)
  }
  
  // Default: update content calendar
  return updateContentCalendar(os)
}

function checkStrategyUpdateNeeded(os: CompanyOS): boolean {
  // Check if positioning was recently updated
  const positioningUpdates = os.events.filter(e => 
    e.type === 'positioning-updated' &&
    !e.consumed.includes('cmo-content')
  )
  
  // Check if campaign was launched
  const campaignLaunches = os.events.filter(e =>
    e.type === 'campaign-launched' &&
    !e.consumed.includes('cmo-content')
  )
  
  return positioningUpdates.length > 0 || campaignLaunches.length > 0
}

function checkPerformanceReviewDue(os: CompanyOS): boolean {
  const cmo = os.departments.cmo
  if (!cmo) return false
  
  const lastReview = cmo.memory.find(m => m.startsWith('CONTENT_PERFORMANCE:'))
  if (!lastReview) return true
  
  const reviewDate = lastReview.split(':')[1]
  const daysSinceReview = Math.floor(
    (Date.now() - new Date(reviewDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  return daysSinceReview >= 30 // Monthly review
}

function updateContentStrategy(os: CompanyOS): string {
  // Get positioning for alignment
  const positioning = getCMOPositioning(os)
  
  // Get active campaigns
  const activeCampaigns = getActiveCampaigns(os)
  
  // Generate content strategy
  const strategy = generateContentStrategy(os, positioning, activeCampaigns)
  
  // Emit event
  os.events.push({
    type: 'content-strategy-set',
    from: 'cmo-content',
    payload: { strategy },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Store in memory
  if (!os.departments.cmo) {
    os.departments.cmo = {
      status: 'steering',
      currentFocus: 'Content strategy',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cmo.memory.push(
    `CONTENT_STRATEGY:${new Date().toISOString()}:${JSON.stringify(strategy)}`
  )
  
  os.departments.cmo.lastAction = {
    type: 'content-strategy-set',
    description: 'Updated content strategy and calendar',
    timestamp: new Date().toISOString(),
    impact: ['marketing', 'growth', 'sales']
  }
  
  return formatContentStrategy(strategy)
}

function updateContentCalendar(os: CompanyOS): string {
  // Get current strategy
  const strategy = getCurrentContentStrategy(os)
  if (!strategy) {
    return 'No content strategy set. Run strategy update first.'
  }
  
  // Generate next 30 days of content
  const calendar = generateContentCalendar(strategy, os)
  
  // Emit event for each new content piece
  for (const item of calendar.filter(i => i.status === 'planned')) {
    os.events.push({
      type: 'content-planned',
      from: 'cmo-content',
      payload: { item },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  return formatContentCalendar(calendar)
}

function reviewContentPerformance(os: CompanyOS): string {
  // Get published content from memory
  const publishedContent = getPublishedContent(os)
  
  // Analyze performance
  const performance = analyzeContentPerformance(publishedContent, os)
  
  // Emit performance event
  os.events.push({
    type: 'content-performance',
    from: 'cmo-content',
    payload: { performance },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Store in memory
  if (os.departments.cmo) {
    os.departments.cmo.memory.push(
      `CONTENT_PERFORMANCE:${new Date().toISOString()}:${JSON.stringify(performance)}`
    )
  }
  
  return formatContentPerformance(performance)
}

function getCMOPositioning(os: CompanyOS): any {
  const cmo = os.departments.cmo
  if (!cmo) return null
  
  const positioningMemory = cmo.memory.find(m => m.startsWith('POSITIONING:'))
  if (!positioningMemory) return null
  
  const parts = positioningMemory.split(':')
  if (parts.length < 3) return null
  
  try {
    return JSON.parse(parts.slice(2).join(':'))
  } catch {
    return null
  }
}

function getActiveCampaigns(os: CompanyOS): any[] {
  const cmo = os.departments.cmo
  if (!cmo) return []
  
  return cmo.memory
    .filter(m => m.startsWith('CAMPAIGN:'))
    .map(m => {
      const parts = m.split(':')
      if (parts.length < 3) return null
      try {
        return JSON.parse(parts.slice(2).join(':'))
      } catch {
        return null
      }
    })
    .filter(c => c !== null && c.status === 'launched')
}

function generateContentStrategy(os: CompanyOS, positioning: any, campaigns: any[]): ContentStrategy {
  const strategy: ContentStrategy = {
    mission: {
      purpose: 'Educate market and drive qualified leads through valuable content',
      audience: positioning?.icp?.company || os.profile.targetCustomer || 'Target customers',
      voice: 'Clear, authoritative, helpful',
      themes: positioning?.guidance?.emphasize || ['Product', 'Industry', 'Best Practices']
    },
    pillars: [
      {
        topic: 'Product Education',
        purpose: 'education',
        audience: 'Prospects evaluating solutions',
        formats: ['Blog posts', 'Video tutorials', 'Documentation'],
        frequency: '2x per week'
      },
      {
        topic: 'Industry Insights',
        purpose: 'awareness',
        audience: 'Broader market audience',
        formats: ['Blog posts', 'Podcasts', 'Infographics'],
        frequency: '1x per week'
      },
      {
        topic: 'Customer Success',
        purpose: 'retention',
        audience: 'Existing customers',
        formats: ['Case studies', 'Best practices', 'Feature guides'],
        frequency: '2x per month'
      }
    ],
    distribution: [
      { channel: 'Blog', contentType: 'Long-form articles', frequency: '3x/week', goal: '10k monthly visitors' },
      { channel: 'Email', contentType: 'Newsletter + nurture', frequency: '1x/week', goal: '25% open rate' },
      { channel: 'LinkedIn', contentType: 'Short posts + articles', frequency: '5x/week', goal: '100k impressions' },
      { channel: 'YouTube', contentType: 'Product demos + tutorials', frequency: '1x/week', goal: '5k views' }
    ],
    gaps: [],
    metrics: [
      { goal: 'Monthly blog traffic', target: 10000, current: 5000, status: 'at-risk' },
      { goal: 'Content influenced pipeline', target: 100000, current: 50000, status: 'at-risk' },
      { goal: 'Email subscribers', target: 5000, current: 3000, status: 'on-track' }
    ]
  }
  
  // Add campaign-specific content needs
  for (const campaign of campaigns) {
    strategy.gaps.push({
      gap: `Content for ${campaign.name} campaign`,
      priority: 'high',
      action: `Create by ${campaign.objective?.timeline?.start || 'ASAP'}`
    })
  }
  
  // Check for product launches
  const productLaunches = os.events.filter(e => 
    e.type === 'product-launched' && 
    !e.consumed.includes('cmo-content')
  )
  for (const launch of productLaunches) {
    strategy.gaps.push({
      gap: `Launch content for ${launch.payload?.feature || 'new feature'}`,
      priority: 'high',
      action: 'Create announcement blog + docs'
    })
  }
  
  return strategy
}

function getCurrentContentStrategy(os: CompanyOS): ContentStrategy | null {
  const cmo = os.departments.cmo
  if (!cmo) return null
  
  const strategyMemory = cmo.memory.find(m => m.startsWith('CONTENT_STRATEGY:'))
  if (!strategyMemory) return null
  
  const parts = strategyMemory.split(':')
  if (parts.length < 3) return null
  
  try {
    return JSON.parse(parts.slice(2).join(':'))
  } catch {
    return null
  }
}

function generateContentCalendar(strategy: ContentStrategy, os: CompanyOS): ContentCalendarItem[] {
  const calendar: ContentCalendarItem[] = []
  const today = new Date()
  
  // Generate 30 days of content based on pillars
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Add content based on frequency
    if (i % 3 === 0) { // ~2x per week
      calendar.push({
        date: dateStr,
        title: `Product education: [Topic TBD]`,
        type: 'Blog post',
        stage: 'education',
        owner: 'marketing',
        status: 'planned'
      })
    }
    
    if (i % 7 === 0) { // ~1x per week
      calendar.push({
        date: dateStr,
        title: `Industry insights: [Topic TBD]`,
        type: 'Blog post',
        stage: 'awareness',
        owner: 'marketing',
        status: 'planned'
      })
    }
  }
  
  return calendar
}

function getPublishedContent(os: CompanyOS): ContentCalendarItem[] {
  const cmo = os.departments.cmo
  if (!cmo) return []
  
  // Get all content-published events
  const publishedEvents = os.events.filter(e => e.type === 'content-published')
  
  return publishedEvents.map(e => ({
    date: e.timestamp.split('T')[0],
    title: e.payload?.title || 'Untitled',
    type: e.payload?.type || 'Blog post',
    stage: e.payload?.stage || 'awareness',
    owner: 'marketing',
    status: 'published' as const,
    performance: e.payload?.performance
  }))
}

function analyzeContentPerformance(content: ContentCalendarItem[], os: CompanyOS): ContentPerformance {
  // In real impl, this would read actual analytics data
  const topPerforming = content
    .filter(c => c.performance)
    .sort((a, b) => (b.performance?.views || 0) - (a.performance?.views || 0))
    .slice(0, 3)
    .map(c => ({
      title: c.title,
      views: c.performance?.views || 0,
      conversions: c.performance?.conversions || 0,
      pipeline: c.performance?.pipelineInfluence || 0
    }))
  
  return {
    topPerforming,
    channelBreakdown: [
      { channel: 'Blog', contentPieces: 12, avgViews: 500, conversionRate: 2.5 },
      { channel: 'Email', contentPieces: 4, avgViews: 1000, conversionRate: 5.0 },
      { channel: 'Social', contentPieces: 20, avgViews: 200, conversionRate: 1.0 }
    ],
    funnelAnalysis: [
      { stage: 'Top', contentCount: 15, performance: 'good', gap: 'None' },
      { stage: 'Middle', contentCount: 8, performance: 'good', gap: 'None' },
      { stage: 'Bottom', contentCount: 3, performance: 'bad', gap: 'Need more conversion content' }
    ],
    recommendations: [
      'Double down on blog content - performing well',
      'Create more bottom-of-funnel content for conversions',
      'Improve social content quality - low engagement'
    ]
  }
}

function formatContentStrategy(s: ContentStrategy): string {
  const lines: string[] = []
  
  lines.push(`CONTENT STRATEGY · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  lines.push('EDITORIAL MISSION')
  lines.push(`Purpose:        ${s.mission.purpose}`)
  lines.push(`Audience:       ${s.mission.audience}`)
  lines.push(`Voice:          ${s.mission.voice}`)
  lines.push(`Themes:         ${s.mission.themes.join(', ')}`)
  lines.push('')
  
  lines.push('CONTENT PILLARS')
  for (let i = 0; i < s.pillars.length; i++) {
    const p = s.pillars[i]
    lines.push(`${i + 1}. ${p.topic}`)
    lines.push(`   Purpose:     ${p.purpose}`)
    lines.push(`   Audience:    ${p.audience}`)
    lines.push(`   Formats:     ${p.formats.join(', ')}`)
    lines.push(`   Frequency:   ${p.frequency}`)
    if (i < s.pillars.length - 1) lines.push('')
  }
  lines.push('')
  
  lines.push('DISTRIBUTION STRATEGY')
  lines.push('Channel         Content Type            Frequency   Goal')
  for (const d of s.distribution) {
    const channelPad = ' '.repeat(15 - d.channel.length)
    const typePad = ' '.repeat(24 - d.contentType.length)
    const freqPad = ' '.repeat(12 - d.frequency.length)
    lines.push(`${d.channel}${channelPad}${d.contentType}${typePad}${d.frequency}${freqPad}${d.goal}`)
  }
  lines.push('')
  
  if (s.gaps.length > 0) {
    lines.push('CONTENT GAPS')
    for (const gap of s.gaps) {
      lines.push(`· ${gap.gap} [${gap.priority.toUpperCase()}] - ${gap.action}`)
    }
    lines.push('')
  }
  
  lines.push('SUCCESS METRICS')
  for (const m of s.metrics) {
    const statusIcon = m.status === 'on-track' ? '🟢' : m.status === 'at-risk' ? '🟡' : '🔴'
    lines.push(`${m.goal}: ${m.current.toLocaleString()} / ${m.target.toLocaleString()} ${statusIcon}`)
  }
  
  return lines.join('\n')
}

function formatContentCalendar(calendar: ContentCalendarItem[]): string {
  const lines: string[] = []
  
  lines.push('CONTENT CALENDAR (Next 30 Days)')
  lines.push('')
  lines.push('Date        Title                           Type            Stage       Owner       Status')
  
  for (const item of calendar) {
    const datePad = ' '.repeat(12 - item.date.length)
    const titlePad = ' '.repeat(32 - Math.min(item.title.length, 30))
    const typePad = ' '.repeat(16 - item.type.length)
    const stagePad = ' '.repeat(12 - item.stage.length)
    const ownerPad = ' '.repeat(12 - item.owner.length)
    
    const truncTitle = item.title.length > 30 ? item.title.substring(0, 27) + '...' : item.title
    
    lines.push(`${item.date}${datePad}${truncTitle}${titlePad}${item.type}${typePad}${item.stage}${stagePad}${item.owner}${ownerPad}${item.status}`)
  }
  
  return lines.join('\n')
}

function formatContentPerformance(p: ContentPerformance): string {
  const lines: string[] = []
  
  lines.push(`CONTENT PERFORMANCE · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  if (p.topPerforming.length > 0) {
    lines.push('TOP PERFORMING CONTENT')
    lines.push('Title                           Views       Conversions     Pipeline')
    for (const item of p.topPerforming) {
      const titlePad = ' '.repeat(32 - Math.min(item.title.length, 30))
      const truncTitle = item.title.length > 30 ? item.title.substring(0, 27) + '...' : item.title
      const viewsPad = ' '.repeat(12 - item.views.toString().length)
      const convPad = ' '.repeat(16 - item.conversions.toString().length)
      lines.push(`${truncTitle}${titlePad}${item.views}${viewsPad}${item.conversions}${convPad}$${item.pipeline.toLocaleString()}`)
    }
    lines.push('')
  }
  
  lines.push('CHANNEL PERFORMANCE')
  lines.push('Channel         Pieces      Avg Views   Conv Rate')
  for (const ch of p.channelBreakdown) {
    const channelPad = ' '.repeat(15 - ch.channel.length)
    const piecesPad = ' '.repeat(12 - ch.contentPieces.toString().length)
    const viewsPad = ' '.repeat(12 - ch.avgViews.toString().length)
    lines.push(`${ch.channel}${channelPad}${ch.contentPieces}${piecesPad}${ch.avgViews}${viewsPad}${ch.conversionRate}%`)
  }
  lines.push('')
  
  lines.push('FUNNEL ANALYSIS')
  for (const f of p.funnelAnalysis) {
    lines.push(`${f.stage}: ${f.contentCount} pieces, ${f.performance}, Gap: ${f.gap}`)
  }
  lines.push('')
  
  lines.push('RECOMMENDATIONS')
  for (const rec of p.recommendations) {
    lines.push(`· ${rec}`)
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.cmo` — positioning, campaigns, brand guidelines
- `company.os.departments.product` — product launches, roadmap
- `company.os.departments.sales` — customer questions, objections
- `company.os.departments.growth` — channel performance, SEO data
- `company.os.departments.marketing` — content production capacity

**Emits:**
- `content-strategy-set` → notifies teams of editorial direction
- `content-calendar-updated` → shares upcoming content schedule
- `content-published` → announces new content available
- `content-performance` → shares what's working/not working

**Consumed by:**
- Marketing department (creates content per calendar)
- Growth department (distributes and promotes content)
- Sales department (uses content in outreach and nurture)
- CMO campaigns agent (aligns content to campaign themes)
- CMO brand agent (reviews content for brand consistency)
