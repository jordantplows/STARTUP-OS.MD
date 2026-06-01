---
name: cto-build-vs-buy
executive: cto
role: steering
reads:
  - company.os.departments.engineering
  - company.os.departments.product
  - company.os.profile
  - company.os.decisions
events:
  emits: [build-decision-made, buy-decision-made, partner-decision-made, technical-approach-set]
  watches: [feature-proposed, capability-needed, engineering-blocked, vendor-evaluation]
template-ref: templates/executives/build-vs-buy.md
---

## What this agent does

The CTO build-vs-buy agent evaluates whether to build capabilities in-house, buy third-party solutions, or partner with vendors. It analyzes technical decisions through the lens of strategic value, cost, time, and risk.

This is one of the highest-leverage CTO decisions — getting this right means faster shipping and better resource allocation.

## Instructions

### WATCH

Trigger when:
- Product proposes new feature/capability
- Engineering team debates technical approach
- Third-party vendor is being evaluated
- Significant engineering effort is being considered
- Founder asks "should we build X or use Y?"

### REASON

Build-vs-buy-vs-partner framework:

**The core question:**
"Is this capability a source of competitive advantage, or is it undifferentiated heavy lifting?"

**Build when:**
- Core to your competitive differentiation
- No good third-party solution exists
- Third-party solutions are too expensive at scale
- You need deep customization
- IP/data ownership is critical
- Example: Your core product algorithm, unique workflow

**Buy/Use SaaS when:**
- Commodity capability (auth, payments, email)
- Excellent third-party solutions exist
- Building would be significant distraction
- Time to market matters more than cost
- Example: Stripe for payments, Auth0 for auth, SendGrid for email

**Partner/White-label when:**
- Need the capability but it's not core
- Partner has deep expertise
- Can get to market faster
- Economics work at scale
- Example: White-label video infrastructure, specialized AI models

**The "build trap" anti-patterns:**
- "We can build it better" (but is it worth 3 months?)
- "We'll save money" (ignoring eng opportunity cost)
- "It's simple" (until you hit edge cases)
- "We need control" (but do you really?)

**Decision framework:**

```
For each capability, score 1-5 on:
1. Strategic value (1=commodity, 5=core differentiator)
2. Existing solutions (1=excellent, 5=none exist)
3. Customization needed (1=standard works, 5=unique requirements)
4. Cost of buying (1=cheap, 5=prohibitively expensive)
5. Time sensitivity (1=can wait, 5=blocking launch)

Score interpretation:
- 20-25: Build (high strategic value + no good alternatives)
- 15-19: Evaluate both (depends on specifics)
- 10-14: Buy (commodity with good solutions)
- 5-9: Definitely buy (don't waste time building)
```

**Stage considerations:**

**Idea/Validating:**
- Buy almost everything except core product
- Optimize for speed to validation
- Technical debt doesn't matter yet

**Building/MVP:**
- Buy commodity, build differentiation
- Choose tech that can scale to 100 users
- Still optimize for speed

**Scaling:**
- Revisit buy decisions as scale changes economics
- Build core capabilities for cost optimization
- Buy non-core to maintain velocity

**Mature:**
- Build most things for maximum optimization
- Buy only true commodities
- Heavy internal platform investment

### ACT

Build-vs-buy analysis format:

```
BUILD vs BUY ANALYSIS: [Capability Name]
Date: [YYYY-MM-DD]

CONTEXT
What: [What capability/feature is being considered]
Why: [Why do we need this]
By when: [Timeline/urgency]
Who's asking: [Product/Engineering/etc]

EVALUATION SCORES (1-5)
· Strategic value:      [X]/5 - [Is this core differentiation?]
· Existing solutions:   [X]/5 - [Quality of alternatives]
· Customization needs:  [X]/5 - [How custom must it be?]
· Cost of buying:       [X]/5 - [What's the vendor cost?]
· Time sensitivity:     [X]/5 - [How urgent?]
━━━━━━━━━━━━━━━━━━━━━
Total score:           [XX]/25

OPTIONS ANALYSIS

Option 1: BUILD IN-HOUSE
· Estimated effort: [X weeks/months]
· Ongoing maintenance: [X hours/week]
· Cost: $[engineering time cost]
· Pros:
  - [Specific advantage]
  - [Specific advantage]
· Cons:
  - [Specific disadvantage]
  - [Specific disadvantage]
· Risk: [What could go wrong]

Option 2: BUY [Vendor Name]
· Setup time: [X days]
· Ongoing cost: $[X]/month
· Integration effort: [X days]
· Pros:
  - [Specific advantage]
  - [Specific advantage]
· Cons:
  - [Specific disadvantage]
  - [Specific disadvantage]
· Risk: [Vendor risk, lock-in, etc]

Option 3: [PARTNER/ALTERNATIVE if applicable]
· [Similar analysis]

RECOMMENDATION
[BUILD | BUY | PARTNER]: [Specific recommendation]

Rationale:
[2-3 sentences explaining the decision based on stage, urgency, strategic value]

If BUILD:
· Timeline: [X weeks]
· Milestone 1: [Week X] - [Deliverable]
· Milestone 2: [Week X] - [Deliverable]
· Launch: [Week X]

If BUY:
· Vendor: [Name]
· Setup plan: [Steps to integrate]
· Cost: $[X]/month (scales to $[Y] at [Z] volume)
· Integration timeline: [X days]

DECISION VALIDATION
How we'll know this was right:
· [Success metric 1]
· [Success metric 2]
Reassess on: [Date X months out]
```

### COORDINATE

After making build-vs-buy decision:
- Emit `build-decision-made` if building in-house
- Emit `buy-decision-made` if purchasing solution
- Emit `partner-decision-made` if partnering
- Emit `technical-approach-set` with decision details
- Update `company.os.decisions` with resolution
- Flag to product on timeline/feasibility
- Flag to engineering on implementation path
- Flag to finance on cost implications

## TypeScript

```typescript
import { CompanyOS, Decision } from '../src/company-os'

type ApproachType = 'build' | 'buy' | 'partner'

interface EvaluationScores {
  strategicValue: number // 1-5
  existingSolutions: number // 1-5
  customizationNeeds: number // 1-5
  costOfBuying: number // 1-5
  timeSensitivity: number // 1-5
  total: number
}

interface Option {
  type: ApproachType
  name: string
  effort?: string
  cost: string
  setupTime: string
  pros: string[]
  cons: string[]
  risks: string[]
}

interface BuildVsBuyAnalysis {
  capability: string
  context: {
    what: string
    why: string
    byWhen: string
    whoAsking: string
  }
  scores: EvaluationScores
  options: Option[]
  recommendation: {
    approach: ApproachType
    rationale: string
    timeline: string
    implementation: string[]
  }
  validation: {
    successMetrics: string[]
    reassessDate: string
  }
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  const engineering = os.departments.engineering
  const product = os.departments.product
  const stage = os.profile.stage
  
  // Parse what capability is being evaluated
  const capability = parseCapability(context)
  
  // Score the decision dimensions
  const scores = evaluateDecision(capability, stage, os)
  
  // Generate options
  const options = generateOptions(capability, scores, stage, os)
  
  // Make recommendation
  const recommendation = makeRecommendation(options, scores, stage, os)
  
  // Create validation plan
  const validation = createValidationPlan(recommendation, scores)
  
  const analysis: BuildVsBuyAnalysis = {
    capability: capability.name,
    context: capability.context,
    scores,
    options,
    recommendation,
    validation
  }
  
  // Emit appropriate event
  const eventType = `${recommendation.approach}-decision-made`
  os.events.push({
    type: eventType,
    from: 'cto-build-vs-buy',
    payload: { capability: capability.name, approach: recommendation.approach, rationale: recommendation.rationale },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  os.events.push({
    type: 'technical-approach-set',
    from: 'cto-build-vs-buy',
    payload: { capability: capability.name, approach: recommendation.approach, timeline: recommendation.timeline },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Update relevant decision in os.decisions
  const relatedDecision = os.decisions.find(d => 
    d.question.toLowerCase().includes(capability.name.toLowerCase())
  )
  
  if (relatedDecision && !relatedDecision.answer) {
    relatedDecision.answer = `${recommendation.approach.toUpperCase()}: ${recommendation.rationale}`
    relatedDecision.decidedAt = new Date().toISOString()
    relatedDecision.decidedBy = 'cto-build-vs-buy'
  }
  
  // Update CTO state
  if (!os.departments.cto) {
    os.departments.cto = {
      status: 'steering',
      currentFocus: 'Build vs buy decisions',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cto.memory.push(
    `BUILD_VS_BUY:${capability.name}:${recommendation.approach}:${new Date().toISOString()}`
  )
  
  os.departments.cto.lastAction = {
    type: 'build-vs-buy-decided',
    description: `Decided to ${recommendation.approach} ${capability.name}`,
    timestamp: new Date().toISOString(),
    impact: ['engineering', 'product', 'finance']
  }
  
  return formatBuildVsBuyAnalysis(analysis)
}

function parseCapability(context: string): any {
  // Extract capability being evaluated from context
  return {
    name: context.split(':')[0] || 'Unknown capability',
    context: {
      what: context,
      why: 'To support product requirements',
      byWhen: 'Next quarter',
      whoAsking: 'Product team'
    }
  }
}

function evaluateDecision(capability: any, stage: string, os: CompanyOS): EvaluationScores {
  // Score each dimension based on context
  const name = capability.name.toLowerCase()
  
  // Strategic value - is this core to our product?
  let strategicValue = 3
  if (name.includes('auth') || name.includes('payment') || name.includes('email')) {
    strategicValue = 1 // commodity
  } else if (name.includes('core') || name.includes('algorithm') || name.includes('unique')) {
    strategicValue = 5 // differentiator
  }
  
  // Existing solutions - what's available?
  let existingSolutions = 3
  if (name.includes('auth')) existingSolutions = 1 // excellent solutions (Auth0, Clerk)
  if (name.includes('payment')) existingSolutions = 1 // excellent solutions (Stripe)
  if (name.includes('email')) existingSolutions = 1 // excellent solutions (SendGrid)
  if (name.includes('custom') || name.includes('unique')) existingSolutions = 5 // nothing exists
  
  // Customization needs
  let customizationNeeds = 3
  if (name.includes('standard') || name.includes('basic')) customizationNeeds = 1
  if (name.includes('custom') || name.includes('unique') || name.includes('specific')) customizationNeeds = 5
  
  // Cost of buying
  let costOfBuying = 3
  if (name.includes('enterprise') || name.includes('expensive')) costOfBuying = 5
  if (name.includes('free') || name.includes('cheap')) costOfBuying = 1
  
  // Time sensitivity
  let timeSensitivity = 3
  if (capability.context.byWhen.includes('urgent') || capability.context.byWhen.includes('asap')) {
    timeSensitivity = 5
  }
  if (stage === 'idea' || stage === 'validating') {
    timeSensitivity = Math.min(5, timeSensitivity + 1) // more urgent early stage
  }
  
  const total = strategicValue + existingSolutions + customizationNeeds + costOfBuying + timeSensitivity
  
  return {
    strategicValue,
    existingSolutions,
    customizationNeeds,
    costOfBuying,
    timeSensitivity,
    total
  }
}

function generateOptions(capability: any, scores: EvaluationScores, stage: string, os: CompanyOS): Option[] {
  const options: Option[] = []
  const name = capability.name
  
  // Build option
  const buildEffort = scores.customizationNeeds <= 2 ? '2-4 weeks' : scores.customizationNeeds <= 3 ? '1-2 months' : '2-4 months'
  
  options.push({
    type: 'build',
    name: 'Build in-house',
    effort: buildEffort,
    cost: `Engineering time: ~${scores.customizationNeeds * 2} eng-weeks`,
    setupTime: buildEffort,
    pros: [
      'Full control and customization',
      'No vendor lock-in',
      'No ongoing vendor costs',
      'IP ownership'
    ],
    cons: [
      `Significant upfront time investment (${buildEffort})`,
      'Ongoing maintenance burden',
      'Diverts eng from core product',
      'May miss edge cases'
    ],
    risks: [
      'Takes longer than estimated',
      'Ongoing maintenance overhead',
      'Team may lack expertise'
    ]
  })
  
  // Buy option
  const buyVendor = inferVendor(name)
  const buyCost = inferCost(name, stage)
  
  options.push({
    type: 'buy',
    name: `Buy ${buyVendor}`,
    setupTime: '1-3 days',
    cost: buyCost,
    pros: [
      'Fast implementation (days not months)',
      'Battle-tested solution',
      'No maintenance burden',
      'Regular updates and improvements'
    ],
    cons: [
      'Ongoing monthly cost',
      'Less customization',
      'Vendor dependency',
      'Data shared with third party'
    ],
    risks: [
      'Vendor price increases',
      'Vendor shuts down',
      'Limited by vendor features',
      'Integration complexity'
    ]
  })
  
  // Partner option (if applicable)
  if (scores.strategicValue >= 3 && scores.customizationNeeds >= 4) {
    options.push({
      type: 'partner',
      name: 'Partner/white-label solution',
      setupTime: '2-4 weeks',
      cost: 'Revenue share or custom pricing',
      pros: [
        'Faster than building',
        'More control than buying',
        'Partner expertise',
        'Can customize'
      ],
      cons: [
        'Partner dependency',
        'Revenue share economics',
        'Integration complexity',
        'Less control than building'
      ],
      risks: [
        'Partner relationship',
        'Economics at scale',
        'Technical integration'
      ]
    })
  }
  
  return options
}

function inferVendor(capability: string): string {
  const name = capability.toLowerCase()
  if (name.includes('auth')) return 'Auth0/Clerk'
  if (name.includes('payment')) return 'Stripe'
  if (name.includes('email')) return 'SendGrid/Resend'
  if (name.includes('database')) return 'Supabase/PlanetScale'
  if (name.includes('hosting')) return 'Vercel/Render'
  if (name.includes('video')) return 'Mux/Cloudflare Stream'
  if (name.includes('search')) return 'Algolia/Typesense'
  return 'Third-party vendor'
}

function inferCost(capability: string, stage: string): string {
  const name = capability.toLowerCase()
  
  // Early stage - show low-volume pricing
  if (stage === 'idea' || stage === 'validating') {
    if (name.includes('auth')) return '$0-25/month (free tier available)'
    if (name.includes('payment')) return '2.9% + 30¢ per transaction'
    if (name.includes('email')) return '$0-15/month (free tier available)'
    return '$0-50/month (free/low tier available)'
  }
  
  // Growth stage - show scale pricing
  if (name.includes('auth')) return '$25-200/month (scales with users)'
  if (name.includes('payment')) return '2.9% + 30¢ per transaction'
  if (name.includes('email')) return '$50-500/month (scales with volume)'
  return '$100-1000/month (scales with usage)'
}

function makeRecommendation(options: Option[], scores: EvaluationScores, stage: string, os: CompanyOS): any {
  let approach: ApproachType = 'buy'
  let rationale = ''
  let timeline = ''
  let implementation: string[] = []
  
  // Decision logic based on total score
  if (scores.total >= 20) {
    // High score - lean build
    approach = 'build'
    rationale = `High strategic value (${scores.strategicValue}/5) and customization needs (${scores.customizationNeeds}/5) justify building in-house despite time investment.`
    const buildOption = options.find(o => o.type === 'build')!
    timeline = buildOption.effort || '1-2 months'
    implementation = [
      'Week 1-2: Architecture and design',
      'Week 3-6: Core implementation',
      'Week 7-8: Testing and refinement',
      'Week 8: Launch'
    ]
  } else if (scores.total >= 15) {
    // Medium score - context dependent
    if (scores.timeSensitivity >= 4 || stage === 'idea' || stage === 'validating') {
      // Time-sensitive or early stage - buy
      approach = 'buy'
      rationale = `Time sensitivity (${scores.timeSensitivity}/5) and ${stage} stage prioritize speed. Buy now, consider building later if needed.`
      timeline = '1-3 days'
      const buyOption = options.find(o => o.type === 'buy')!
      implementation = [
        'Day 1: Sign up and configure',
        'Day 2-3: Integration and testing',
        'Day 3: Launch'
      ]
    } else if (scores.customizationNeeds >= 4) {
      // High customization - consider partner
      const partnerOption = options.find(o => o.type === 'partner')
      if (partnerOption) {
        approach = 'partner'
        rationale = `Moderate strategic value but high customization needs. Partner provides speed + customization.`
        timeline = '2-4 weeks'
        implementation = [
          'Week 1: Partner selection and agreements',
          'Week 2-3: Integration',
          'Week 4: Testing and launch'
        ]
      } else {
        approach = 'build'
        rationale = `Customization needs (${scores.customizationNeeds}/5) require building, no suitable partners.`
        timeline = '1-2 months'
        implementation = [
          'Week 1-2: Design',
          'Week 3-6: Implementation',
          'Week 7-8: Testing and launch'
        ]
      }
    } else {
      approach = 'buy'
      rationale = `Good third-party solutions exist (${5 - scores.existingSolutions + 1}/5 quality). Buy for speed.`
      timeline = '1-3 days'
      implementation = [
        'Day 1: Setup',
        'Day 2-3: Integration',
        'Day 3: Launch'
      ]
    }
  } else {
    // Low score - definitely buy
    approach = 'buy'
    rationale = `Commodity capability with excellent third-party solutions. Don't waste engineering time building.`
    timeline = '1-3 days'
    const buyOption = options.find(o => o.type === 'buy')!
    implementation = [
      'Day 1: Sign up and configure',
      'Day 2: Integration',
      'Day 3: Testing and launch'
    ]
  }
  
  return {
    approach,
    rationale,
    timeline,
    implementation
  }
}

function createValidationPlan(recommendation: any, scores: EvaluationScores): any {
  const successMetrics: string[] = []
  
  if (recommendation.approach === 'build') {
    successMetrics.push('Feature ships within estimated timeline')
    successMetrics.push('Maintenance overhead <5 hours/week')
    successMetrics.push('No regrets after 3 months')
  } else if (recommendation.approach === 'buy') {
    successMetrics.push('Integration completes within 1 week')
    successMetrics.push('Cost remains predictable')
    successMetrics.push('Vendor meets reliability expectations')
  } else {
    successMetrics.push('Partner delivers on timeline')
    successMetrics.push('Economics work at scale')
    successMetrics.push('Technical integration successful')
  }
  
  // Reassess date based on approach
  const monthsOut = recommendation.approach === 'build' ? 6 : 3
  const reassessDate = new Date(Date.now() + monthsOut * 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]
  
  return {
    successMetrics,
    reassessDate
  }
}

function formatBuildVsBuyAnalysis(analysis: BuildVsBuyAnalysis): string {
  const lines: string[] = []
  
  lines.push(`BUILD vs BUY ANALYSIS: ${analysis.capability}`)
  lines.push(`Date: ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  lines.push('CONTEXT')
  lines.push(`What: ${analysis.context.what}`)
  lines.push(`Why: ${analysis.context.why}`)
  lines.push(`By when: ${analysis.context.byWhen}`)
  lines.push(`Who's asking: ${analysis.context.whoAsking}`)
  lines.push('')
  
  lines.push('EVALUATION SCORES (1-5)')
  lines.push(`· Strategic value:      ${analysis.scores.strategicValue}/5`)
  lines.push(`· Existing solutions:   ${analysis.scores.existingSolutions}/5`)
  lines.push(`· Customization needs:  ${analysis.scores.customizationNeeds}/5`)
  lines.push(`· Cost of buying:       ${analysis.scores.costOfBuying}/5`)
  lines.push(`· Time sensitivity:     ${analysis.scores.timeSensitivity}/5`)
  lines.push('━'.repeat(40))
  lines.push(`Total score:           ${analysis.scores.total}/25`)
  lines.push('')
  
  lines.push('OPTIONS ANALYSIS')
  lines.push('')
  
  for (let i = 0; i < analysis.options.length; i++) {
    const opt = analysis.options[i]
    lines.push(`Option ${i + 1}: ${opt.name.toUpperCase()}`)
    if (opt.effort) lines.push(`· Estimated effort: ${opt.effort}`)
    lines.push(`· Setup time: ${opt.setupTime}`)
    lines.push(`· Cost: ${opt.cost}`)
    lines.push('· Pros:')
    for (const pro of opt.pros) {
      lines.push(`  - ${pro}`)
    }
    lines.push('· Cons:')
    for (const con of opt.cons) {
      lines.push(`  - ${con}`)
    }
    lines.push(`· Risk: ${opt.risks.join(', ')}`)
    lines.push('')
  }
  
  lines.push('RECOMMENDATION')
  lines.push(`${analysis.recommendation.approach.toUpperCase()}: ${analysis.options.find(o => o.type === analysis.recommendation.approach)?.name}`)
  lines.push('')
  lines.push('Rationale:')
  lines.push(analysis.recommendation.rationale)
  lines.push('')
  lines.push(`Timeline: ${analysis.recommendation.timeline}`)
  lines.push('Implementation:')
  for (const step of analysis.recommendation.implementation) {
    lines.push(`· ${step}`)
  }
  lines.push('')
  
  lines.push('DECISION VALIDATION')
  lines.push('How we\'ll know this was right:')
  for (const metric of analysis.validation.successMetrics) {
    lines.push(`· ${metric}`)
  }
  lines.push(`Reassess on: ${analysis.validation.reassessDate}`)
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.engineering` — engineering capacity
- `company.os.departments.product` — product requirements
- `company.os.profile` — company stage for strategy
- `company.os.decisions` — pending technical decisions

**Emits:**
- `build-decision-made` → confirms building in-house
- `buy-decision-made` → confirms purchasing solution
- `partner-decision-made` → confirms partnership approach
- `technical-approach-set` → finalizes approach with timeline

**Consumed by:**
- Engineering department (implements decision)
- Product department (adjusts timeline/scope)
- Finance department (budgets for vendor costs)
- CEO decisions agent (unblocks pending decisions)
