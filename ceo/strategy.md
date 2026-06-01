---
name: ceo-strategy
executive: ceo
role: steering
reads:
  - company.os.profile
  - company.os.departments
  - company.os.events
  - company.os.decisions
events:
  emits: [strategy-set, pivot-recommended, big-bet-identified]
  watches: [quarterly-review, market-signal, product-signal, financial-signal]
template-ref: templates/executives/strategy.md
---

## What this agent does

The CEO strategy agent maintains 6-12 month company direction, identifies when pivots are needed, and makes big bets. It watches signals across all departments and determines when strategic course corrections are required.

## Instructions

### WATCH

Trigger when:
- Quarterly strategic review is due
- Multiple signals point to market/product mismatch
- Financial runway requires strategic shift
- Major market opportunity or threat emerges
- Founder requests strategic assessment

### REASON

Strategy evaluation follows this framework:

**Current strategy health:**
1. **Product-market fit signals** — are customers pulling product from us?
2. **Unit economics** — does the business model work at scale?
3. **Competitive position** — are we differentiated and defensible?
4. **Team capability** — can we execute on this strategy?
5. **Runway alignment** — do we have time to prove this out?

**When to pivot:**
- Core assumption proven false (not just hard)
- Better opportunity emerges with same assets
- Market timing is fundamentally wrong
- Unit economics will never work

**When NOT to pivot:**
- Just because it's hard (persistence often wins)
- Grass-looks-greener syndrome
- One customer doesn't like it
- Competitor does something similar

**Big bets to make:**
- High conviction from founder + data
- Asymmetric upside (10x potential, 1x downside)
- Leverage existing strengths
- Clear experiment to validate

### ACT

Strategy assessment format:

```
STRATEGIC ASSESSMENT · [Date]

CURRENT STRATEGY
[One-line: what we're building, for whom, and why]

HEALTH SIGNALS
Product-Market Fit:  ███░░░ (3/5) - [specific evidence]
Unit Economics:      ████░░ (4/5) - [specific evidence]
Competitive Moat:    ██░░░░ (2/5) - [specific evidence]
Team Capability:     ████░░ (4/5) - [specific evidence]
Runway Alignment:    ███░░░ (3/5) - [specific evidence]

WHAT'S WORKING
· [Specific positive signal]
· [Specific positive signal]
· [Specific positive signal]

WHAT'S NOT WORKING
· [Specific problem] - [data/evidence]
· [Specific problem] - [data/evidence]

STRATEGIC OPTIONS
1. STAY THE COURSE
   - Continue current strategy
   - What would need to be true: [specific conditions]
   - Timeline to validation: [timeframe]

2. PIVOT TO [OPTION]
   - [Describe pivot]
   - Rationale: [why this could work better]
   - Assets we keep: [what carries over]
   - Risk: [what could go wrong]

3. DOUBLE DOWN ON [ASPECT]
   - [Describe focus shift]
   - Rationale: [why go deeper here]
   - What we stop: [tradeoffs]

RECOMMENDATION
[Specific recommendation with reasoning]

BIG BETS TO CONSIDER
· [Bet 1]: [Why now, what's the upside, how to validate]
· [Bet 2]: [Why now, what's the upside, how to validate]
```

### COORDINATE

After strategic assessment:
- Emit `strategy-set` event with current direction
- If recommending pivot, emit `pivot-recommended` event
- For each big bet, emit `big-bet-identified` event
- Update `company.os.profile` with refined direction
- Flag to all departments if strategy shifts

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface StrategyHealth {
  productMarketFit: number // 0-5
  unitEconomics: number
  competitivePosition: number
  teamCapability: number
  runwayAlignment: number
  evidence: Record<string, string>
}

interface StrategicOption {
  type: 'stay-course' | 'pivot' | 'double-down'
  description: string
  rationale: string
  conditions: string[]
  risks: string[]
}

interface BigBet {
  description: string
  upside: string
  validation: string
  confidence: number // 0-100
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Assess current strategy health
  const health = assessStrategyHealth(os)
  
  // Identify what's working and what's not
  const positives = extractPositiveSignals(os)
  const negatives = extractNegativeSignals(os)
  
  // Generate strategic options
  const options = generateStrategicOptions(os, health, negatives)
  
  // Identify potential big bets
  const bigBets = identifyBigBets(os, health)
  
  // Determine recommendation
  const recommendation = makeRecommendation(options, health, os)
  
  // Emit events
  os.events.push({
    type: 'strategy-assessed',
    from: 'ceo-strategy',
    payload: { health, recommendation },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  if (recommendation.type === 'pivot') {
    os.events.push({
      type: 'pivot-recommended',
      from: 'ceo-strategy',
      payload: { option: recommendation },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  for (const bet of bigBets) {
    os.events.push({
      type: 'big-bet-identified',
      from: 'ceo-strategy',
      payload: { bet },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update CEO state
  if (!os.departments.ceo) {
    os.departments.ceo = {
      status: 'steering',
      currentFocus: 'Strategic assessment',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.ceo.memory.push(
    `STRATEGY_ASSESSMENT:${new Date().toISOString()}:${JSON.stringify({ health, recommendation })}`
  )
  
  return formatStrategyAssessment(os, health, positives, negatives, options, bigBets, recommendation)
}

function assessStrategyHealth(os: CompanyOS): StrategyHealth {
  const stage = os.profile.stage
  const departments = os.departments
  
  const health: StrategyHealth = {
    productMarketFit: 3,
    unitEconomics: 3,
    competitivePosition: 3,
    teamCapability: 3,
    runwayAlignment: 3,
    evidence: {}
  }
  
  // Product-market fit signals
  if (departments.product) {
    const productState = departments.product
    if (productState.currentFocus.includes('customer') || productState.currentFocus.includes('validation')) {
      health.productMarketFit = 4
      health.evidence['productMarketFit'] = 'Active customer validation in progress'
    }
    if (productState.signals.some(s => s.type.includes('customer-demand'))) {
      health.productMarketFit = 5
      health.evidence['productMarketFit'] = 'Strong customer demand signals'
    }
  }
  
  // Unit economics
  if (stage === 'revenue' && os.profile.revenue > 0) {
    health.unitEconomics = 4
    health.evidence['unitEconomics'] = `Revenue: $${os.profile.revenue}`
  } else if (stage === 'revenue' && os.profile.revenue === 0) {
    health.unitEconomics = 2
    health.evidence['unitEconomics'] = 'Revenue stage but $0 revenue'
  }
  
  // Competitive position
  if (departments.strategy?.memory.some(m => m.includes('differentiation'))) {
    health.competitivePosition = 4
    health.evidence['competitivePosition'] = 'Clear differentiation defined'
  } else {
    health.competitivePosition = 2
    health.evidence['competitivePosition'] = 'Differentiation unclear'
  }
  
  // Team capability
  const blockedCount = Object.values(departments).filter(d => d.status === 'blocked').length
  const totalCount = Object.keys(departments).length
  health.teamCapability = Math.max(1, 5 - blockedCount)
  health.evidence['teamCapability'] = `${blockedCount}/${totalCount} departments blocked`
  
  // Runway alignment
  const runwayMonths = extractRunwayMonths(os)
  if (runwayMonths > 12) {
    health.runwayAlignment = 5
    health.evidence['runwayAlignment'] = `${runwayMonths} months runway`
  } else if (runwayMonths > 6) {
    health.runwayAlignment = 3
    health.evidence['runwayAlignment'] = `${runwayMonths} months runway`
  } else {
    health.runwayAlignment = 1
    health.evidence['runwayAlignment'] = `Only ${runwayMonths} months runway - time pressure`
  }
  
  return health
}

function extractPositiveSignals(os: CompanyOS): string[] {
  const positives: string[] = []
  
  // Look for positive events
  const recentEvents = os.events.slice(-50)
  for (const event of recentEvents) {
    if (event.type.includes('milestone') || event.type.includes('customer') || event.type.includes('revenue')) {
      positives.push(`${event.from}: ${event.type}`)
    }
  }
  
  // Look for departments making progress
  for (const [name, state] of Object.entries(os.departments)) {
    if (state.lastAction && state.status !== 'blocked') {
      positives.push(`${name}: ${state.lastAction.description}`)
    }
  }
  
  return positives.slice(0, 3)
}

function extractNegativeSignals(os: CompanyOS): string[] {
  const negatives: string[] = []
  
  // Look for blocked departments
  for (const [name, state] of Object.entries(os.departments)) {
    if (state.status === 'blocked') {
      negatives.push(`${name} blocked: ${state.currentFocus}`)
    }
  }
  
  // Look for critical signals
  for (const [name, state] of Object.entries(os.departments)) {
    const criticalSignals = state.signals.filter(s => s.priority === 'critical')
    for (const signal of criticalSignals) {
      negatives.push(`${name} critical: ${signal.type}`)
    }
  }
  
  return negatives
}

function generateStrategicOptions(os: CompanyOS, health: StrategyHealth, negatives: string[]): StrategicOption[] {
  const options: StrategicOption[] = []
  
  // Always include stay-the-course option
  options.push({
    type: 'stay-course',
    description: 'Continue current strategy',
    rationale: 'Core hypothesis not yet fully tested',
    conditions: [
      'Customer validation shows promise',
      'Unit economics improve within 3 months',
      'Team executes on roadmap'
    ],
    risks: ['May run out of runway before validation']
  })
  
  // Consider pivot if multiple health signals are low
  const avgHealth = (health.productMarketFit + health.unitEconomics + health.competitivePosition) / 3
  if (avgHealth < 2.5) {
    options.push({
      type: 'pivot',
      description: 'Pivot to adjacent opportunity',
      rationale: 'Current approach showing weak signals across multiple dimensions',
      conditions: [
        'Identify validated customer pain point',
        'Leverage existing technology assets',
        'Can execute within runway'
      ],
      risks: ['Starting over with less runway', 'Team morale impact']
    })
  }
  
  // Consider double-down if one area is strong
  if (health.productMarketFit >= 4 && health.unitEconomics < 3) {
    options.push({
      type: 'double-down',
      description: 'Double down on customer acquisition',
      rationale: 'Strong product-market fit signals, need to prove economics at scale',
      conditions: [
        'Focus all resources on customer growth',
        'Defer new features',
        'Validate unit economics with real customers'
      ],
      risks: ['May sacrifice product quality', 'Competitors may catch up']
    })
  }
  
  return options
}

function identifyBigBets(os: CompanyOS, health: StrategyHealth): BigBet[] {
  const bets: BigBet[] = []
  
  // Example big bets based on stage and health
  if (os.profile.stage === 'validating' && health.productMarketFit >= 4) {
    bets.push({
      description: 'Build MVP and launch to waitlist',
      upside: 'Convert strong demand into real customers, validate willingness to pay',
      validation: 'Ship MVP in 4 weeks, onboard 10 customers, measure retention',
      confidence: 70
    })
  }
  
  if (os.profile.stage === 'building' && health.teamCapability < 3) {
    bets.push({
      description: 'Hire senior IC to unblock engineering',
      upside: 'Accelerate product development, improve technical quality',
      validation: 'Velocity doubles within 2 months of hire',
      confidence: 60
    })
  }
  
  return bets
}

function makeRecommendation(options: StrategicOption[], health: StrategyHealth, os: CompanyOS): StrategicOption {
  // Simple heuristic - real impl would be more sophisticated
  const avgHealth = (health.productMarketFit + health.unitEconomics + health.competitivePosition + health.teamCapability + health.runwayAlignment) / 5
  
  if (avgHealth < 2.5) {
    // Low health - consider pivot
    return options.find(o => o.type === 'pivot') || options[0]
  } else if (avgHealth > 3.5) {
    // Good health - stay course or double down
    return options.find(o => o.type === 'double-down') || options[0]
  } else {
    // Medium health - stay course
    return options[0]
  }
}

function extractRunwayMonths(os: CompanyOS): number {
  const finance = os.departments.finance
  if (!finance) return 12
  
  const runwayMemory = finance.memory.find(m => m.includes('runway'))
  if (!runwayMemory) return 12
  
  const match = runwayMemory.match(/(\d+)\s*months/)
  return match ? parseInt(match[1]) : 12
}

function formatStrategyAssessment(
  os: CompanyOS,
  health: StrategyHealth,
  positives: string[],
  negatives: string[],
  options: StrategicOption[],
  bigBets: BigBet[],
  recommendation: StrategicOption
): string {
  const lines: string[] = []
  
  lines.push(`STRATEGIC ASSESSMENT · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  lines.push('CURRENT STRATEGY')
  lines.push(os.profile.oneline)
  lines.push('')
  lines.push('HEALTH SIGNALS')
  
  const healthMetrics = [
    ['Product-Market Fit', health.productMarketFit, health.evidence.productMarketFit],
    ['Unit Economics', health.unitEconomics, health.evidence.unitEconomics],
    ['Competitive Moat', health.competitivePosition, health.evidence.competitivePosition],
    ['Team Capability', health.teamCapability, health.evidence.teamCapability],
    ['Runway Alignment', health.runwayAlignment, health.evidence.runwayAlignment]
  ]
  
  for (const [label, score, evidence] of healthMetrics) {
    const bars = '█'.repeat(score) + '░'.repeat(5 - score)
    const padding = ' '.repeat(20 - label.length)
    lines.push(`${label}:${padding}${bars} (${score}/5) - ${evidence}`)
  }
  
  if (positives.length > 0) {
    lines.push('')
    lines.push("WHAT'S WORKING")
    for (const p of positives) {
      lines.push(`· ${p}`)
    }
  }
  
  if (negatives.length > 0) {
    lines.push('')
    lines.push("WHAT'S NOT WORKING")
    for (const n of negatives) {
      lines.push(`· ${n}`)
    }
  }
  
  lines.push('')
  lines.push('STRATEGIC OPTIONS')
  for (let i = 0; i < options.length; i++) {
    const opt = options[i]
    lines.push(`${i + 1}. ${opt.description.toUpperCase()}`)
    lines.push(`   ${opt.rationale}`)
    if (opt.type === recommendation.type) {
      lines.push('   ⭐ RECOMMENDED')
    }
    if (i < options.length - 1) lines.push('')
  }
  
  if (bigBets.length > 0) {
    lines.push('')
    lines.push('BIG BETS TO CONSIDER')
    for (const bet of bigBets) {
      lines.push(`· ${bet.description}`)
      lines.push(`  Upside: ${bet.upside}`)
      lines.push(`  Validation: ${bet.validation}`)
      lines.push(`  Confidence: ${bet.confidence}%`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.profile` — current company direction
- `company.os.departments.*` — signals from all departments
- `company.os.events` — milestones and market signals
- `company.os.decisions` — strategic questions

**Emits:**
- `strategy-set` → confirms current direction
- `pivot-recommended` → flags need for strategic shift
- `big-bet-identified` → highlights major opportunity

**Consumed by:**
- All departments (realign work to strategy)
- CEO briefing (includes strategic health)
- Board update (reports on strategic direction)
