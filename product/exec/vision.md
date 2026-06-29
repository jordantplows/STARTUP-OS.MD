---
name: cpo-vision
executive: cpo
role: steering
reads:
  - company.os.profile
  - company.os.departments.product
  - company.os.departments.design
  - company.os.departments.engineering
  - company.os.events
events:
  emits: [product-vision-set, vision-drift-detected, north-star-updated]
  watches: [strategy-set, customer-signal, product-shipped, quarterly-review]
template-ref: templates/executives/product-vision.md
---

## What this agent does

The CPO vision agent maintains the 12-month product direction and north star. It translates business strategy into product principles, ensures every PM knows what "good" looks like, and detects when product work drifts from the intended direction.

This is not a static document. The vision evolves as the company learns, but it changes deliberately, not accidentally.

## Instructions

### WATCH

Trigger when:
- Company strategy is set or updated by CEO
- Quarterly product planning begins
- Major customer signals indicate product-market fit issues
- Product is shipped that doesn't align with stated vision
- Founder questions product direction

### REASON

Product vision evaluation follows this framework:

**Vision health check:**
1. **Clarity** — Can every PM articulate the vision in one sentence?
2. **Consistency** — Does shipped product reflect the vision?
3. **Durability** — Has the vision been stable or thrashing?
4. **Differentiating** — Does the vision set us apart from competitors?
5. **Inspiring** — Do customers and team believe in where we're going?

**What makes a strong product vision:**
- Solves a real, painful customer problem
- Is differentiated from existing solutions
- Is achievable within 12 months
- Inspires the team to build it
- Ladders up to business strategy

**When to update the vision:**
- Core customer problem changes based on data
- Market opportunity shifts significantly
- Product-market fit signals indicate wrong direction
- Business strategy pivots

**When NOT to update:**
- Just because it's hard to execute
- One customer wants something different
- Competitor ships similar feature
- Team wants to build something more fun

### ACT

Product vision format:

```
PRODUCT VISION · [Date]

NORTH STAR
[One sentence: what we're building, for whom, and why they'll love it]

CUSTOMER PROBLEM
[The painful problem we solve, with evidence]

PRODUCT PRINCIPLES
1. [Core principle that guides all product decisions]
2. [Core principle that guides all product decisions]
3. [Core principle that guides all product decisions]

WHAT WE BUILD
· [Category of features aligned to vision]
· [Category of features aligned to vision]
· [Category of features aligned to vision]

WHAT WE DON'T BUILD
· [Tempting but off-strategy features we say no to]
· [Tempting but off-strategy features we say no to]

12-MONTH MILESTONES
Q1: [Major product milestone]
Q2: [Major product milestone]
Q3: [Major product milestone]
Q4: [Major product milestone]

DIFFERENTIATION
[How this vision makes us different from competitors]

SUCCESS METRICS
[3-5 metrics that indicate we're achieving the vision]
```

### COORDINATE

After setting or updating vision:
- Emit `product-vision-set` event with vision summary
- If vision changed significantly, emit `north-star-updated` event
- Update `company.os.departments.cpo.memory` with vision
- Flag all PM agents to realign roadmaps
- Update `company.os.profile` if one-line changes

If product work drifts from vision:
- Emit `vision-drift-detected` event with details
- Flag specific PM agent causing drift
- Recommend course correction to CPO

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface ProductVision {
  northStar: string
  customerProblem: string
  principles: string[]
  inScope: string[]
  outOfScope: string[]
  milestones: Record<string, string>
  differentiation: string
  successMetrics: string[]
}

interface VisionHealth {
  clarity: number // 0-5
  consistency: number
  durability: number
  differentiating: number
  inspiring: number
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Check if vision needs update
  const currentVision = extractCurrentVision(os)
  const visionHealth = assessVisionHealth(os, currentVision)
  
  // Detect drift
  const drift = detectVisionDrift(os, currentVision)
  
  // Determine if update needed
  const needsUpdate = shouldUpdateVision(os, visionHealth, drift)
  
  let vision: ProductVision
  if (needsUpdate || !currentVision) {
    // Generate new or updated vision
    vision = generateProductVision(os)
    
    // Emit vision update event
    os.events.push({
      type: 'product-vision-set',
      from: 'cpo-vision',
      payload: { vision },
      timestamp: new Date().toISOString(),
      consumed: []
    })
    
    if (currentVision && hasSignificantChange(currentVision, vision)) {
      os.events.push({
        type: 'north-star-updated',
        from: 'cpo-vision',
        payload: { 
          old: currentVision.northStar, 
          new: vision.northStar 
        },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    }
  } else {
    vision = currentVision
  }
  
  // Handle drift
  if (drift.length > 0) {
    os.events.push({
      type: 'vision-drift-detected',
      from: 'cpo-vision',
      payload: { drift },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update CPO state
  if (!os.departments.cpo) {
    os.departments.cpo = {
      status: 'steering',
      currentFocus: 'Product vision',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cpo.memory.push(
    `PRODUCT_VISION:${new Date().toISOString()}:${JSON.stringify(vision)}`
  )
  
  return formatProductVision(vision, visionHealth, drift)
}

function extractCurrentVision(os: CompanyOS): ProductVision | null {
  const cpo = os.departments.cpo
  if (!cpo) return null
  
  const visionMemory = cpo.memory.find(m => m.startsWith('PRODUCT_VISION:'))
  if (!visionMemory) return null
  
  const parts = visionMemory.split(':')
  if (parts.length < 3) return null
  
  try {
    return JSON.parse(parts.slice(2).join(':'))
  } catch {
    return null
  }
}

function assessVisionHealth(os: CompanyOS, vision: ProductVision | null): VisionHealth {
  if (!vision) {
    return {
      clarity: 0,
      consistency: 0,
      durability: 0,
      differentiating: 0,
      inspiring: 0
    }
  }
  
  const health: VisionHealth = {
    clarity: 3,
    consistency: 3,
    durability: 3,
    differentiating: 3,
    inspiring: 3
  }
  
  // Clarity - check if vision is well-defined
  if (vision.northStar.length > 20 && vision.principles.length >= 3) {
    health.clarity = 4
  }
  if (vision.northStar.length > 50 && vision.principles.length >= 5) {
    health.clarity = 5
  }
  
  // Consistency - check if shipped products align
  const product = os.departments.product
  if (product && product.memory.length > 0) {
    const shippedFeatures = product.memory.filter(m => m.includes('SHIPPED'))
    const aligned = shippedFeatures.filter(f => 
      vision.inScope.some(scope => f.toLowerCase().includes(scope.toLowerCase()))
    )
    health.consistency = Math.min(5, Math.round((aligned.length / Math.max(1, shippedFeatures.length)) * 5))
  }
  
  // Durability - check how often vision changes
  const visionUpdates = os.events.filter(e => e.type === 'north-star-updated')
  if (visionUpdates.length === 0) {
    health.durability = 5
  } else if (visionUpdates.length < 2) {
    health.durability = 4
  } else if (visionUpdates.length < 4) {
    health.durability = 3
  } else {
    health.durability = 2
  }
  
  // Differentiating - check if differentiation is clear
  if (vision.differentiation.length > 50) {
    health.differentiating = 4
  }
  if (vision.differentiation.length > 100 && vision.outOfScope.length > 0) {
    health.differentiating = 5
  }
  
  // Inspiring - check team and customer signals
  const positiveSignals = os.events.filter(e => 
    e.type.includes('customer-excited') || 
    e.type.includes('team-momentum')
  )
  health.inspiring = Math.min(5, 2 + positiveSignals.length)
  
  return health
}

function detectVisionDrift(os: CompanyOS, vision: ProductVision | null): string[] {
  if (!vision) return []
  
  const drift: string[] = []
  
  // Check if recent product work aligns with vision
  const product = os.departments.product
  if (product) {
    const recentWork = product.memory.slice(-10)
    for (const work of recentWork) {
      const workLower = work.toLowerCase()
      const aligned = vision.inScope.some(scope => 
        workLower.includes(scope.toLowerCase())
      )
      const offScope = vision.outOfScope.some(scope => 
        workLower.includes(scope.toLowerCase())
      )
      
      if (offScope) {
        drift.push(`Product work on out-of-scope item: ${work.split(':')[0]}`)
      } else if (!aligned && work.includes('FEATURE')) {
        drift.push(`Product work not aligned to vision: ${work.split(':')[0]}`)
      }
    }
  }
  
  return drift
}

function shouldUpdateVision(os: CompanyOS, health: VisionHealth, drift: string[]): boolean {
  // Update if vision doesn't exist
  if (health.clarity === 0) return true
  
  // Update if strategy changed
  const strategyChange = os.events.find(e => 
    e.type === 'strategy-set' || e.type === 'pivot-recommended'
  )
  if (strategyChange && !strategyChange.consumed.includes('cpo-vision')) {
    return true
  }
  
  // Update if major drift detected
  if (drift.length > 3) return true
  
  // Update if health is poor
  const avgHealth = (health.clarity + health.consistency + health.durability + health.differentiating + health.inspiring) / 5
  if (avgHealth < 2.5) return true
  
  return false
}

function generateProductVision(os: CompanyOS): ProductVision {
  const profile = os.profile
  
  // Extract from company strategy
  const northStar = profile.oneline || 'Building a product customers love'
  
  // Generate principles based on stage
  const principles: string[] = []
  if (os.profile.stage === 'idea' || os.profile.stage === 'validating') {
    principles.push('Talk to customers before writing code')
    principles.push('Ship fast to learn fast')
    principles.push('Solve one problem extremely well')
  } else if (os.profile.stage === 'building') {
    principles.push('Quality over quantity of features')
    principles.push('Every feature must move core metrics')
    principles.push('Make it simple, then make it powerful')
  } else {
    principles.push('Obsess over customer outcomes')
    principles.push('Data informs, intuition decides')
    principles.push('Build for scale from day one')
  }
  
  // Determine scope
  const inScope: string[] = []
  const outOfScope: string[] = []
  
  if (profile.targetCustomer) {
    inScope.push(`Features for ${profile.targetCustomer}`)
  }
  if (profile.problem) {
    inScope.push(`Solutions to ${profile.problem}`)
  }
  
  outOfScope.push('Enterprise features before product-market fit')
  outOfScope.push('Nice-to-have features that don\'t move metrics')
  outOfScope.push('Customization that adds complexity')
  
  // Set milestones
  const milestones: Record<string, string> = {}
  const currentDate = new Date()
  for (let q = 1; q <= 4; q++) {
    const quarter = `Q${q}`
    if (q === 1) milestones[quarter] = 'MVP shipped to first customers'
    else if (q === 2) milestones[quarter] = 'Product-market fit validated'
    else if (q === 3) milestones[quarter] = 'Scale to 100 customers'
    else milestones[quarter] = 'Platform foundation complete'
  }
  
  // Differentiation
  const differentiation = profile.businessModel 
    ? `We differentiate through ${profile.businessModel} and deep focus on ${profile.targetCustomer}`
    : 'We differentiate through exceptional product quality and customer focus'
  
  // Success metrics
  const successMetrics = [
    'Weekly active users growing 20% month-over-month',
    'Net Promoter Score > 50',
    'Customer retention > 90% at 6 months',
    'Time to value < 10 minutes',
    'Feature adoption > 40% within first week'
  ]
  
  return {
    northStar,
    customerProblem: profile.problem || 'Problem to be defined through customer discovery',
    principles,
    inScope,
    outOfScope,
    milestones,
    differentiation,
    successMetrics
  }
}

function hasSignificantChange(old: ProductVision, updated: ProductVision): boolean {
  // Check if north star changed substantially
  if (old.northStar !== updated.northStar) return true
  
  // Check if principles changed
  if (old.principles.length !== updated.principles.length) return true
  
  // Check if scope changed significantly
  if (old.inScope.length !== updated.inScope.length) return true
  if (old.outOfScope.length !== updated.outOfScope.length) return true
  
  return false
}

function formatProductVision(vision: ProductVision, health: VisionHealth, drift: string[]): string {
  const lines: string[] = []
  
  lines.push(`PRODUCT VISION · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  // Vision health
  lines.push('VISION HEALTH')
  const healthMetrics = [
    ['Clarity', health.clarity],
    ['Consistency', health.consistency],
    ['Durability', health.durability],
    ['Differentiating', health.differentiating],
    ['Inspiring', health.inspiring]
  ]
  
  for (const [label, score] of healthMetrics) {
    const bars = '█'.repeat(score) + '░'.repeat(5 - score)
    const padding = ' '.repeat(18 - label.length)
    lines.push(`${label}:${padding}${bars} (${score}/5)`)
  }
  lines.push('')
  
  lines.push('NORTH STAR')
  lines.push(vision.northStar)
  lines.push('')
  
  lines.push('CUSTOMER PROBLEM')
  lines.push(vision.customerProblem)
  lines.push('')
  
  lines.push('PRODUCT PRINCIPLES')
  for (let i = 0; i < vision.principles.length; i++) {
    lines.push(`${i + 1}. ${vision.principles[i]}`)
  }
  lines.push('')
  
  lines.push('WHAT WE BUILD')
  for (const item of vision.inScope) {
    lines.push(`· ${item}`)
  }
  lines.push('')
  
  lines.push("WHAT WE DON'T BUILD")
  for (const item of vision.outOfScope) {
    lines.push(`· ${item}`)
  }
  lines.push('')
  
  lines.push('12-MONTH MILESTONES')
  for (const [quarter, milestone] of Object.entries(vision.milestones)) {
    lines.push(`${quarter}: ${milestone}`)
  }
  lines.push('')
  
  lines.push('DIFFERENTIATION')
  lines.push(vision.differentiation)
  lines.push('')
  
  lines.push('SUCCESS METRICS')
  for (const metric of vision.successMetrics) {
    lines.push(`· ${metric}`)
  }
  
  if (drift.length > 0) {
    lines.push('')
    lines.push('⚠️  VISION DRIFT DETECTED')
    for (const item of drift) {
      lines.push(`· ${item}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.profile` — company strategy and direction
- `company.os.departments.product` — shipped product work
- `company.os.departments.design` — design direction
- `company.os.events` — strategy changes, customer signals

**Emits:**
- `product-vision-set` → confirms current product direction
- `vision-drift-detected` → flags misaligned product work
- `north-star-updated` → signals major vision change

**Consumed by:**
- All PM agents (align roadmaps to vision)
- Design agents (ensure design reflects vision)
- CEO strategy (product vision informs company strategy)
- Engineering (understand what they're building and why)
