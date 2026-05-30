---
name: gtm-strategy
description: Generate complete go-to-market strategy with ICP, positioning, messaging, channel strategy, and 90-day launch plan
department: marketing
triggers: ["/startup-os marketing gtm"]
allowed-tools: [Read, Write, Bash]
reads:
  - brand/output/brand-brief-filled.md
  - strategy/output/lean-canvas.md
  - strategy/output/market-research.md
  - strategy/output/competitor-analysis.md
writes:
  - marketing/output/gtm-strategy.md
---

## What this agent does

Reads personas, brand brief, and lean canvas to generate a hyper-specific ICP definition, positioning statement with 3 alternatives, messaging tailored to each persona, channel strategy ranked by expected CAC, and a 90-day launch sequence with week-by-week tactical plan. Writes to marketing/output/gtm-strategy.md.

## Instructions

1. Read all relevant brand and strategy outputs
2. Call Claude API to generate:
   - Hyper-specific ICP (firmographics, psychographics, buying triggers, pain severity)
   - Primary positioning statement + 3 alternative positioning statements
   - Messaging framework per persona (value prop, pain points, objections, proof points)
   - Channel strategy ranked by expected CAC (6-8 channels with rationale)
   - 90-day launch sequence broken down week-by-week with specific tactics
3. Format as structured markdown with actionable detail
4. Write to marketing/output/gtm-strategy.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateGTMStrategy() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()

  // Read input files
  let brandBrief = ''
  let leanCanvas = ''
  let marketResearch = ''
  let competitorAnalysis = ''

  try {
    brandBrief = readFileSync(join(projectRoot, 'brand', 'output', 'brand-brief-filled.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: brand-brief-filled.md not found')
  }

  try {
    leanCanvas = readFileSync(join(projectRoot, 'strategy', 'output', 'lean-canvas.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: lean-canvas.md not found')
  }

  try {
    marketResearch = readFileSync(join(projectRoot, 'strategy', 'output', 'market-research.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: market-research.md not found')
  }

  try {
    competitorAnalysis = readFileSync(join(projectRoot, 'strategy', 'output', 'competitor-analysis.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: competitor-analysis.md not found')
  }

  const context = `
# Brand Brief
${brandBrief}

# Lean Canvas
${leanCanvas}

# Market Research
${marketResearch}

# Competitor Analysis
${competitorAnalysis}
  `.trim()

  // Generate GTM strategy via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are a go-to-market strategist. Based on this startup's foundation:

${context}

Generate a comprehensive go-to-market strategy with the following structure:

# Go-To-Market Strategy

## Ideal Customer Profile (ICP)

### Firmographics
- **Company Size**: [employee count range]
- **Revenue Range**: [ARR range]
- **Industry Verticals**: [top 3-5 industries]
- **Geography**: [primary markets]
- **Tech Stack**: [key technologies they use]

### Psychographics
- **Buying Triggers**: [3-5 specific events that trigger purchase consideration]
- **Pain Severity**: [describe how painful the problem is - quantify impact]
- **Current Solution**: [what they're doing today and why it's inadequate]
- **Decision-Making Process**: [who's involved, typical timeline, budget source]
- **Success Metrics**: [how they'll measure ROI]

### Key Personas

#### Persona 1: [Title/Role]
- **Demographics**: [seniority, department, reporting structure]
- **Goals**: [top 3 professional goals]
- **Challenges**: [top 3 challenges preventing them from achieving goals]
- **Where They Hang Out**: [communities, publications, events, social platforms]

#### Persona 2: [Title/Role]
[Same structure as Persona 1]

#### Persona 3: [Title/Role]
[Same structure as Persona 1]

## Positioning

### Primary Positioning Statement
For [target customer]
Who [statement of need]
[Product name] is a [category]
That [key benefit]
Unlike [competitive alternative]
We [primary differentiation]

### Alternative Positioning #1: [Angle Name]
[Complete positioning statement with different angle/emphasis]
**Why This Works**: [1-2 sentences on when to use this]

### Alternative Positioning #2: [Angle Name]
[Complete positioning statement]
**Why This Works**: [1-2 sentences on when to use this]

### Alternative Positioning #3: [Angle Name]
[Complete positioning statement]
**Why This Works**: [1-2 sentences on when to use this]

## Messaging Framework

### Core Value Proposition
[One powerful sentence that captures the core benefit]

### Supporting Pillars
1. **[Pillar 1 Name]**: [2-3 sentences explaining this benefit/capability]
2. **[Pillar 2 Name]**: [2-3 sentences]
3. **[Pillar 3 Name]**: [2-3 sentences]

### Messaging by Persona

#### [Persona 1 Title]
- **Primary Message**: [The one thing that matters most to this persona]
- **Pain Points to Address**:
  1. [Specific pain point and how you solve it]
  2. [Specific pain point and how you solve it]
  3. [Specific pain point and how you solve it]
- **Key Objections & Responses**:
  - **Objection**: [What they'll say]
    **Response**: [How you address it]
  - **Objection**: [What they'll say]
    **Response**: [How you address it]
- **Proof Points**: [case studies, data, testimonials most relevant to this persona]

#### [Persona 2 Title]
[Same structure]

#### [Persona 3 Title]
[Same structure]

## Channel Strategy

Ranked by expected Customer Acquisition Cost (CAC) from lowest to highest:

### Tier 1: Lowest CAC Channels

#### 1. [Channel Name]
- **Expected CAC**: $[range]
- **Timeline to Results**: [weeks/months]
- **Why This Channel**: [2-3 sentences on why it's optimal for this ICP]
- **Success Metrics**: [specific KPIs to track]
- **Initial Tactics**: [3-5 specific things to do in first 30 days]

#### 2. [Channel Name]
[Same structure]

### Tier 2: Medium CAC Channels

#### 3. [Channel Name]
[Same structure]

#### 4. [Channel Name]
[Same structure]

### Tier 3: Higher CAC / Brand Building

#### 5. [Channel Name]
[Same structure]

#### 6. [Channel Name]
[Same structure]

### Channels to Avoid (And Why)
- **[Channel]**: [Why it won't work for this ICP/stage]
- **[Channel]**: [Why it won't work]

## 90-Day Launch Sequence

### Pre-Launch (Weeks -4 to 0)

#### Week -4: Foundation
- [ ] Finalize messaging and positioning
- [ ] Build launch asset list (landing pages, email templates, ad creative)
- [ ] Set up analytics and attribution tracking
- [ ] Identify launch partners and warm outreach list
- [ ] Create content calendar for first 60 days

#### Week -3: Content Production
- [ ] Write and design hero landing page
- [ ] Create 5-7 launch announcement assets (blog, social, email)
- [ ] Record demo video and product walkthrough
- [ ] Prepare customer proof points (early testimonials, case studies)
- [ ] Build out email sequences (welcome, onboarding, nurture)

#### Week -2: Audience Building
- [ ] Set up and test ad campaigns (ready to launch)
- [ ] Activate warm outreach to target accounts
- [ ] Schedule launch day social posts across all channels
- [ ] Brief launch partners on messaging and timeline
- [ ] Conduct final QA on all launch assets

#### Week -1: Final Prep
- [ ] Load contact lists and segment by persona
- [ ] Confirm all tracking pixels and analytics are working
- [ ] Prepare launch day war room schedule
- [ ] Pre-schedule follow-up content for days 2-7
- [ ] Run through launch checklist with full team

### Launch Week (Week 0)

#### Day 0: Public Launch
- [ ] Send announcement email to warm list
- [ ] Publish launch blog post and press release
- [ ] Activate paid ad campaigns
- [ ] Post across all social channels
- [ ] Reach out to press and influencers
- [ ] Monitor and respond to all incoming inquiries

#### Days 1-3: Momentum
- [ ] Share early traction metrics and social proof
- [ ] Engage with all comments and mentions
- [ ] Publish user success stories
- [ ] Follow up with warm leads
- [ ] Adjust ad creative based on early performance

#### Days 4-7: Sustain
- [ ] Publish week-in-review content
- [ ] Double down on best-performing channels
- [ ] Conduct first cohort of customer interviews
- [ ] Iterate messaging based on feedback
- [ ] Plan week 2 content

### Post-Launch Growth (Weeks 1-12)

#### Weeks 1-4: Optimize & Learn
**Goals**: Validate channel-market fit, iterate messaging, identify best-performing tactics
- [ ] Week 1: Analyze launch data, identify drop-off points, test 3 messaging variants
- [ ] Week 2: Launch referral program, activate second-tier channels, publish first case study
- [ ] Week 3: Host first community event (webinar/office hours), optimize ad campaigns
- [ ] Week 4: Month 1 retrospective, revise channel priorities, set Month 2 OKRs

#### Weeks 5-8: Scale What Works
**Goals**: 2x MQLs month-over-month, establish repeatable playbooks
- [ ] Week 5: Launch ABM campaigns for top 50 target accounts
- [ ] Week 6: Publish weekly thought leadership content
- [ ] Week 7: Attend or sponsor first industry event
- [ ] Week 8: Launch partner co-marketing initiatives

#### Weeks 9-12: Systematize
**Goals**: Build scalable systems, expand channel mix, improve conversion rates
- [ ] Week 9: Implement lead scoring and marketing automation
- [ ] Week 10: Launch customer advocacy program
- [ ] Week 11: Expand to additional geographic markets or verticals
- [ ] Week 12: Quarter 1 review, set Q2 growth goals

## Key Performance Indicators (KPIs)

### Week 0-4 (Launch)
- **Website Traffic**: [target visits]
- **MQLs**: [target leads]
- **Demo Requests**: [target]
- **Email List Growth**: [target subscribers]
- **Social Engagement**: [target followers/engagement rate]

### Month 2-3 (Growth)
- **CAC by Channel**: [target $ per channel]
- **MQL → SQL Conversion**: [target %]
- **Pipeline Generated**: [target $]
- **Content Engagement**: [target metrics]
- **Brand Awareness**: [target reach/impressions]

---

Generated: ${new Date().toISOString().split('T')[0]}`
      }
    ]
  })

  // Extract content from response
  let gtmStrategy = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      gtmStrategy += block.text + '\n'
    }
  }

  if (!gtmStrategy.trim()) {
    gtmStrategy = 'Failed to generate GTM strategy'
  }

  // Write output
  const outputDir = join(projectRoot, 'marketing', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'gtm-strategy.md')
  writeFileSync(outputPath, gtmStrategy, 'utf-8')

  console.log(`GTM strategy generated successfully: ${outputPath}`)
  console.log(`\nCovered: ICP, Primary + 3 Alternative Positioning, Messaging per Persona, Channel Strategy (ranked by CAC), 90-Day Launch Sequence`)
}

generateGTMStrategy().catch(console.error)
```

## Output

Creates marketing/output/gtm-strategy.md with hyper-specific ICP (firmographics, psychographics, personas), primary positioning statement + 3 alternatives, messaging framework per persona with pain points and objections, channel strategy ranked by expected CAC with specific tactics, and complete 90-day launch sequence broken down week-by-week. Success requires reading brand and strategy inputs and generating actionable, specific go-to-market plan.
