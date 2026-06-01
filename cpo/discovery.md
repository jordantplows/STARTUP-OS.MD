---
name: cpo-discovery
executive: cpo
role: steering
reads:
  - company.os.departments.sales
  - company.os.departments.customer
  - company.os.departments.product
  - company.os.events
events:
  emits: [opportunity-sized, problem-validated, customer-signal-aggregated]
  watches: [customer-feedback, sales-call, support-ticket, user-interview]
template-ref: templates/executives/discovery.md
---

## What this agent does

The CPO discovery agent aggregates customer signals from sales, support, user interviews, and product analytics. It validates problem spaces, sizes opportunities, and determines which customer needs should become product bets.

This is the voice of the customer in product decisions. It prevents building features nobody wants.

## Instructions

### WATCH

Trigger when:
- Customer feedback arrives from sales, support, or interviews
- Multiple customers request the same feature
- A support ticket reveals a critical pain point
- Product usage data shows unexpected behavior
- Quarterly discovery synthesis is due
- Founder questions product-market fit

### REASON

Customer discovery follows this framework:

**Signal quality assessment:**
1. **Volume** — How many customers mentioned this?
2. **Intensity** — How painful is the problem?
3. **Frequency** — How often does it occur?
4. **Workaround effort** — Are customers hacking solutions?
5. **Willingness to pay** — Would they pay to solve it?

**Problem validation criteria:**
- At least 3 customers mention it independently
- Customers describe the problem, not the solution
- Problem occurs regularly (weekly or more)
- No good existing workaround
- Aligns with target customer segment

**Opportunity sizing:**
- Small: <10 customers affected, <$50k ARR potential
- Medium: 10-50 customers, $50k-$250k ARR potential
- Large: 50+ customers, $250k+ ARR potential

**When to prioritize discovery:**
- Problem is mentioned by 5+ customers
- Problem blocks deals (sales says so)
- Problem causes churn (support data confirms)
- Problem aligns with strategic vision
- Solution is feasible to build

**When NOT to prioritize:**
- Only one customer wants it (unless huge account)
- Customer asks for specific solution, not problem
- Problem affects wrong customer segment
- Solution requires major platform changes
- Workarounds exist and work fine

### ACT

Discovery output format:

```
CUSTOMER DISCOVERY · [Date]

SIGNALS COLLECTED
Total feedback items: [X]
Unique customers: [Y]
Time period: [Last Z days]

TOP PROBLEMS (by customer mentions)
1. [Problem description]
   · Customers: [list of who mentioned it]
   · Intensity: [HIGH/MEDIUM/LOW]
   · Frequency: [How often it happens]
   · Quote: "[Exact customer quote]"
   · Opportunity size: [SMALL/MEDIUM/LARGE]

2. [Problem description]
   · Customers: [list]
   · Intensity: [HIGH/MEDIUM/LOW]
   · Frequency: [How often]
   · Quote: "[Quote]"
   · Opportunity size: [SMALL/MEDIUM/LARGE]

VALIDATED PROBLEMS (ready for roadmap)
· [Problem 1] — [X customers, Y evidence points] — [Opportunity size]
· [Problem 2] — [X customers, Y evidence points] — [Opportunity size]

UNVALIDATED SIGNALS (need more research)
· [Signal 1] — [Only 1-2 customers, needs validation]
· [Signal 2] — [Unclear problem, needs follow-up]

PATTERNS DETECTED
· [Pattern 1: e.g., all enterprise customers struggle with X]
· [Pattern 2: e.g., SMB churn related to onboarding]

RECOMMENDED ACTIONS
1. [Action 1: e.g., Schedule 5 customer interviews about X]
2. [Action 2: e.g., Add Y to roadmap as validated problem]
3. [Action 3: e.g., Sunset Z feature - no usage]
```

### COORDINATE

After discovery synthesis:
- Emit `customer-signal-aggregated` event with top problems
- For each validated problem, emit `problem-validated` event
- For each sized opportunity, emit `opportunity-sized` event
- Update `company.os.departments.cpo.memory` with findings
- Flag product and PM agents with validated problems
- Alert sales if customer requests are addressed
- Alert CEO if signals indicate strategic issue

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface CustomerSignal {
  problem: string
  customer: string
  source: string // 'sales' | 'support' | 'interview' | 'analytics'
  intensity: 'high' | 'medium' | 'low'
  timestamp: string
  quote?: string
}

interface ProblemInsight {
  problem: string
  customers: string[]
  intensity: 'high' | 'medium' | 'low'
  frequency: string
  quotes: string[]
  opportunitySize: 'small' | 'medium' | 'large'
  validated: boolean
}

interface DiscoveryOutput {
  totalSignals: number
  uniqueCustomers: number
  timePeriod: string
  topProblems: ProblemInsight[]
  validatedProblems: ProblemInsight[]
  unvalidatedSignals: CustomerSignal[]
  patterns: string[]
  recommendations: string[]
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Collect all customer signals
  const signals = collectCustomerSignals(os)
  
  // Aggregate into problem insights
  const problems = aggregateProblems(signals)
  
  // Validate problems
  const validated = validateProblems(problems)
  const unvalidated = signals.filter(s => !validated.some(p => p.problem.includes(s.problem)))
  
  // Detect patterns
  const patterns = detectPatterns(signals, problems)
  
  // Size opportunities
  for (const problem of validated) {
    problem.opportunitySize = sizeOpportunity(os, problem)
  }
  
  // Generate recommendations
  const recommendations = generateRecommendations(os, validated, patterns)
  
  const output: DiscoveryOutput = {
    totalSignals: signals.length,
    uniqueCustomers: new Set(signals.map(s => s.customer)).size,
    timePeriod: 'Last 30 days',
    topProblems: problems.slice(0, 5),
    validatedProblems: validated,
    unvalidatedSignals: unvalidated.slice(0, 5),
    patterns,
    recommendations
  }
  
  // Emit events
  os.events.push({
    type: 'customer-signal-aggregated',
    from: 'cpo-discovery',
    payload: { 
      totalSignals: signals.length,
      topProblems: problems.slice(0, 3).map(p => p.problem)
    },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  for (const problem of validated) {
    os.events.push({
      type: 'problem-validated',
      from: 'cpo-discovery',
      payload: { problem },
      timestamp: new Date().toISOString(),
      consumed: []
    })
    
    os.events.push({
      type: 'opportunity-sized',
      from: 'cpo-discovery',
      payload: { 
        problem: problem.problem, 
        size: problem.opportunitySize 
      },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update CPO state
  if (!os.departments.cpo) {
    os.departments.cpo = {
      status: 'steering',
      currentFocus: 'Customer discovery',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cpo.memory.push(
    `DISCOVERY:${new Date().toISOString()}:${JSON.stringify(output)}`
  )
  
  // Alert if critical patterns detected
  if (patterns.some(p => p.toLowerCase().includes('churn'))) {
    os.departments.cpo.signals.push({
      type: 'customer-churn-pattern',
      priority: 'critical',
      description: 'Customer signals indicate churn risk',
      timestamp: new Date().toISOString()
    })
  }
  
  return formatDiscoveryOutput(output)
}

function collectCustomerSignals(os: CompanyOS): CustomerSignal[] {
  const signals: CustomerSignal[] = []
  
  // Collect from sales
  const sales = os.departments.sales
  if (sales) {
    const salesFeedback = sales.memory.filter(m => 
      m.includes('FEEDBACK') || m.includes('REQUEST') || m.includes('OBJECTION')
    )
    for (const feedback of salesFeedback) {
      const parts = feedback.split(':')
      if (parts.length >= 3) {
        signals.push({
          problem: parts[2],
          customer: parts[1],
          source: 'sales',
          intensity: 'medium',
          timestamp: new Date().toISOString()
        })
      }
    }
  }
  
  // Collect from customer success/support
  const customer = os.departments.customer || os.departments['customer-success']
  if (customer) {
    const supportTickets = customer.memory.filter(m => 
      m.includes('TICKET') || m.includes('ISSUE') || m.includes('COMPLAINT')
    )
    for (const ticket of supportTickets) {
      const parts = ticket.split(':')
      if (parts.length >= 3) {
        signals.push({
          problem: parts[2],
          customer: parts[1] || 'unknown',
          source: 'support',
          intensity: ticket.includes('critical') ? 'high' : 'medium',
          timestamp: new Date().toISOString()
        })
      }
    }
  }
  
  // Collect from product/PM interviews
  const product = os.departments.product
  if (product) {
    const interviews = product.memory.filter(m => 
      m.includes('INTERVIEW') || m.includes('DISCOVERY')
    )
    for (const interview of interviews) {
      const parts = interview.split(':')
      if (parts.length >= 3) {
        signals.push({
          problem: parts[2],
          customer: parts[1] || 'unknown',
          source: 'interview',
          intensity: 'high',
          timestamp: new Date().toISOString(),
          quote: parts[3] || undefined
        })
      }
    }
  }
  
  // Collect from events
  const customerEvents = os.events.filter(e => 
    e.type.includes('customer-feedback') || 
    e.type.includes('user-feedback') ||
    e.type.includes('feature-request')
  )
  for (const event of customerEvents) {
    signals.push({
      problem: event.payload?.problem || event.type,
      customer: event.payload?.customer || event.from,
      source: 'analytics',
      intensity: 'medium',
      timestamp: event.timestamp
    })
  }
  
  return signals
}

function aggregateProblems(signals: CustomerSignal[]): ProblemInsight[] {
  const problemMap = new Map<string, ProblemInsight>()
  
  for (const signal of signals) {
    const key = signal.problem.toLowerCase().trim()
    
    if (!problemMap.has(key)) {
      problemMap.set(key, {
        problem: signal.problem,
        customers: [],
        intensity: signal.intensity,
        frequency: 'Unknown',
        quotes: [],
        opportunitySize: 'small',
        validated: false
      })
    }
    
    const insight = problemMap.get(key)!
    if (!insight.customers.includes(signal.customer)) {
      insight.customers.push(signal.customer)
    }
    
    if (signal.quote) {
      insight.quotes.push(signal.quote)
    }
    
    // Upgrade intensity if any signal is high
    if (signal.intensity === 'high' && insight.intensity !== 'high') {
      insight.intensity = signal.intensity
    }
  }
  
  // Convert to array and sort by customer count
  const problems = Array.from(problemMap.values())
  problems.sort((a, b) => b.customers.length - a.customers.length)
  
  return problems
}

function validateProblems(problems: ProblemInsight[]): ProblemInsight[] {
  const validated: ProblemInsight[] = []
  
  for (const problem of problems) {
    // Validation criteria:
    // - At least 3 customers OR high intensity with 2 customers
    // - Problem is specific (not too vague)
    
    if (problem.customers.length >= 3) {
      problem.validated = true
      validated.push(problem)
    } else if (problem.customers.length >= 2 && problem.intensity === 'high') {
      problem.validated = true
      validated.push(problem)
    }
  }
  
  return validated
}

function detectPatterns(signals: CustomerSignal[], problems: ProblemInsight[]): string[] {
  const patterns: string[] = []
  
  // Pattern 1: Problems from specific sources
  const salesSignals = signals.filter(s => s.source === 'sales')
  const supportSignals = signals.filter(s => s.source === 'support')
  
  if (salesSignals.length > signals.length * 0.5) {
    patterns.push('Majority of feedback from sales - may indicate pre-sale objections')
  }
  
  if (supportSignals.length > signals.length * 0.5) {
    patterns.push('Majority of feedback from support - may indicate post-sale issues')
  }
  
  // Pattern 2: Customer segment patterns
  const enterpriseCustomers = signals.filter(s => 
    s.customer.toLowerCase().includes('enterprise') || 
    s.customer.toLowerCase().includes('corp')
  )
  if (enterpriseCustomers.length > 5) {
    patterns.push('Enterprise customers reporting distinct needs - consider enterprise tier')
  }
  
  // Pattern 3: High intensity problems
  const highIntensity = problems.filter(p => p.intensity === 'high')
  if (highIntensity.length >= 3) {
    patterns.push('Multiple high-intensity problems detected - customers are frustrated')
  }
  
  // Pattern 4: Churn indicators
  const churnKeywords = ['cancel', 'churn', 'leaving', 'switch', 'alternative']
  const churnSignals = signals.filter(s => 
    churnKeywords.some(kw => s.problem.toLowerCase().includes(kw))
  )
  if (churnSignals.length > 0) {
    patterns.push('Churn-related feedback detected - retention at risk')
  }
  
  return patterns
}

function sizeOpportunity(os: CompanyOS, problem: ProblemInsight): 'small' | 'medium' | 'large' {
  const customerCount = problem.customers.length
  
  // Simple heuristic based on customer count and intensity
  if (customerCount >= 10 && problem.intensity === 'high') {
    return 'large'
  } else if (customerCount >= 5 || problem.intensity === 'high') {
    return 'medium'
  } else {
    return 'small'
  }
}

function generateRecommendations(
  os: CompanyOS, 
  validated: ProblemInsight[], 
  patterns: string[]
): string[] {
  const recommendations: string[] = []
  
  // Recommend adding validated problems to roadmap
  const largeOpportunities = validated.filter(p => p.opportunitySize === 'large')
  if (largeOpportunities.length > 0) {
    recommendations.push(
      `Add to roadmap: ${largeOpportunities[0].problem} (${largeOpportunities[0].customers.length} customers affected)`
    )
  }
  
  // Recommend customer interviews for high-signal problems
  const mediumOpportunities = validated.filter(p => p.opportunitySize === 'medium')
  if (mediumOpportunities.length > 0) {
    recommendations.push(
      `Schedule customer interviews: ${mediumOpportunities[0].problem} (validate solution)`
    )
  }
  
  // Recommend addressing churn patterns
  if (patterns.some(p => p.toLowerCase().includes('churn'))) {
    recommendations.push('Address churn signals immediately - retention at risk')
  }
  
  // Recommend focusing on high-intensity problems
  const highIntensity = validated.filter(p => p.intensity === 'high')
  if (highIntensity.length > 0) {
    recommendations.push(
      `Prioritize high-intensity problems: ${highIntensity.length} issues causing customer pain`
    )
  }
  
  // Recommend more discovery if signals are weak
  if (validated.length < 3) {
    recommendations.push('Increase customer discovery - not enough validated signals')
  }
  
  return recommendations
}

function formatDiscoveryOutput(output: DiscoveryOutput): string {
  const lines: string[] = []
  
  lines.push(`CUSTOMER DISCOVERY · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  lines.push('SIGNALS COLLECTED')
  lines.push(`Total feedback items: ${output.totalSignals}`)
  lines.push(`Unique customers:     ${output.uniqueCustomers}`)
  lines.push(`Time period:          ${output.timePeriod}`)
  lines.push('')
  
  if (output.topProblems.length > 0) {
    lines.push('TOP PROBLEMS (by customer mentions)')
    for (let i = 0; i < output.topProblems.length; i++) {
      const p = output.topProblems[i]
      lines.push(`${i + 1}. ${p.problem}`)
      lines.push(`   · Customers: ${p.customers.join(', ')}`)
      lines.push(`   · Intensity: ${p.intensity.toUpperCase()}`)
      lines.push(`   · Opportunity size: ${p.opportunitySize.toUpperCase()}`)
      if (p.quotes.length > 0) {
        lines.push(`   · Quote: "${p.quotes[0]}"`)
      }
      if (i < output.topProblems.length - 1) lines.push('')
    }
    lines.push('')
  }
  
  if (output.validatedProblems.length > 0) {
    lines.push('VALIDATED PROBLEMS (ready for roadmap)')
    for (const p of output.validatedProblems) {
      lines.push(`· ${p.problem} — ${p.customers.length} customers — ${p.opportunitySize.toUpperCase()} opportunity`)
    }
    lines.push('')
  }
  
  if (output.unvalidatedSignals.length > 0) {
    lines.push('UNVALIDATED SIGNALS (need more research)')
    for (const s of output.unvalidatedSignals) {
      lines.push(`· ${s.problem} — ${s.customer} via ${s.source}`)
    }
    lines.push('')
  }
  
  if (output.patterns.length > 0) {
    lines.push('PATTERNS DETECTED')
    for (const pattern of output.patterns) {
      lines.push(`· ${pattern}`)
    }
    lines.push('')
  }
  
  if (output.recommendations.length > 0) {
    lines.push('RECOMMENDED ACTIONS')
    for (let i = 0; i < output.recommendations.length; i++) {
      lines.push(`${i + 1}. ${output.recommendations[i]}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.sales` — customer objections and requests
- `company.os.departments.customer` — support tickets and issues
- `company.os.departments.product` — user interviews and research
- `company.os.events` — customer feedback signals

**Emits:**
- `customer-signal-aggregated` → summary of customer feedback
- `problem-validated` → problem ready for roadmap
- `opportunity-sized` → revenue potential estimate

**Consumed by:**
- CPO roadmap (uses validated problems for prioritization)
- Product managers (understand customer needs)
- CEO briefing (surface critical customer issues)
- Sales (confirm requests are being addressed)
