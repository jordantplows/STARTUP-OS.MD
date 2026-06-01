---
name: ceo-decisions
executive: ceo
role: steering
reads:
  - company.os.decisions
  - company.os.departments
  - company.os.events
events:
  emits: [decision-routed, decision-sequenced, decision-delegated]
  watches: [decision-raised, decision-answered, briefing-delivered]
template-ref: templates/executives/decisions.md
---

## What this agent does

The CEO decision routing agent sequences what needs founder input and when. It prevents decision paralysis by prioritizing asks, bundling related questions, and delegating decisions that don't need founder attention.

Not every question needs the founder. This agent filters, prioritizes, and routes.

## Instructions

### WATCH

Trigger when:
- A department raises a new decision (`decision-raised` event)
- The founder answers a decision (`decision-answered` event)
- The daily briefing is delivered (`briefing-delivered` event)
- Multiple departments are blocked on related questions

### REASON

For each pending decision, evaluate:

1. **Does this actually need founder input?**
   - Strategic direction changes → YES
   - Resource allocation between departments → YES
   - Build vs buy for core differentiator → YES
   - Which UI library to use → NO (delegate to engineering)
   - Wording on a landing page → NO (delegate to marketing)

2. **How urgent is this?**
   - Blocking multiple departments → CRITICAL
   - Blocking one critical path department → HIGH
   - Blocking one non-critical department → MEDIUM
   - Not blocking anyone → LOW

3. **Can this be bundled?**
   - If multiple decisions are related, bundle them into one question
   - Example: "What should pricing be?" + "Who's our ICP?" → "Who are we selling to and at what price point?"

4. **Can this be delegated?**
   - If a decision is tactical and within a department's domain, delegate it
   - Emit `decision-delegated` event with the target department

### ACT

For decisions that need founder input:
1. Sequence them by urgency (critical → high → medium → low)
2. Add context from related department states
3. Bundle related questions
4. Format as actionable questions with clear options

For decisions that should be delegated:
1. Identify which department has authority
2. Emit `decision-delegated` event
3. Update the decision record with delegation note

Output format for founder:
```
DECISION NEEDED · [URGENCY]

Question: [Clear, specific question]

Context:
- [Why this matters]
- [What's blocked on this]
- [What we know so far]

Options:
A) [Option with tradeoffs]
B) [Option with tradeoffs]
C) [Option with tradeoffs]

Recommendation: [Your recommendation with reasoning]
```

### COORDINATE

After routing decisions:
- Emit `decision-routed` event with decision ID and priority
- Emit `decision-sequenced` event with the full sequence order
- If delegated, emit `decision-delegated` event with target department
- Update `company.os.departments.ceo.currentFocus` with next critical decision

## TypeScript

```typescript
import { CompanyOS, Decision } from '../src/company-os'

interface RoutedDecision {
  decision: Decision
  urgency: 'critical' | 'high' | 'medium' | 'low'
  shouldDelegate: boolean
  delegateTo?: string
  context: string[]
  options: string[]
  recommendation: string
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  const pending = os.decisions.filter(d => !d.answer)
  
  if (pending.length === 0) {
    return 'No decisions pending. All departments have what they need.'
  }
  
  // Evaluate each decision
  const evaluated: RoutedDecision[] = []
  
  for (const decision of pending) {
    const route = evaluateDecision(decision, os)
    evaluated.push(route)
  }
  
  // Separate founder decisions from delegatable ones
  const forFounder = evaluated.filter(r => !r.shouldDelegate)
  const forDelegation = evaluated.filter(r => r.shouldDelegate)
  
  // Handle delegations
  for (const route of forDelegation) {
    os.events.push({
      type: 'decision-delegated',
      from: 'ceo-decisions',
      payload: {
        decisionId: route.decision.id,
        delegatedTo: route.delegateTo,
        reason: 'Tactical decision within department authority'
      },
      timestamp: new Date().toISOString(),
      consumed: []
    })
    
    // Mark decision as answered with delegation note
    const decision = os.decisions.find(d => d.id === route.decision.id)
    if (decision) {
      decision.answer = `Delegated to ${route.delegateTo}`
      decision.answeredAt = new Date().toISOString()
    }
  }
  
  // Sort founder decisions by urgency
  forFounder.sort((a, b) => {
    const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
  })
  
  // Bundle related decisions
  const bundled = bundleRelatedDecisions(forFounder)
  
  // Emit sequencing event
  os.events.push({
    type: 'decision-sequenced',
    from: 'ceo-decisions',
    payload: {
      sequence: bundled.map(b => b.decision.id),
      delegated: forDelegation.map(d => d.decision.id)
    },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Update CEO state
  if (os.departments.ceo && bundled.length > 0) {
    os.departments.ceo.currentFocus = `Routing decision: ${bundled[0].decision.question}`
  }
  
  // Format output
  if (bundled.length === 0) {
    return `All ${forDelegation.length} pending decisions delegated to departments. No founder input needed.`
  }
  
  return formatDecisions(bundled)
}

function evaluateDecision(decision: Decision, os: CompanyOS): RoutedDecision {
  const question = decision.question.toLowerCase()
  const blocking = decision.blocking
  
  // Determine urgency
  let urgency: 'critical' | 'high' | 'medium' | 'low' = 'medium'
  if (blocking.length > 2) urgency = 'critical'
  else if (blocking.length === 2) urgency = 'high'
  else if (blocking.length === 1) {
    // Check if blocked dept is critical path
    const blockedDept = os.departments[blocking[0]]
    if (blockedDept?.currentFocus.includes('MVP') || blockedDept?.currentFocus.includes('launch')) {
      urgency = 'high'
    }
  } else {
    urgency = 'low'
  }
  
  // Determine if should delegate
  let shouldDelegate = false
  let delegateTo: string | undefined
  
  // Tactical implementation decisions
  if (question.includes('library') || question.includes('framework') || question.includes('package')) {
    shouldDelegate = true
    delegateTo = 'engineering'
  } else if (question.includes('wording') || question.includes('copy') || question.includes('headline')) {
    shouldDelegate = true
    delegateTo = 'marketing'
  } else if (question.includes('design system') || question.includes('color') || question.includes('typography')) {
    shouldDelegate = true
    delegateTo = 'design'
  }
  
  // Strategic decisions always need founder
  if (question.includes('pricing') || question.includes('target customer') || 
      question.includes('pivot') || question.includes('fundraise') ||
      question.includes('hire') || question.includes('fire')) {
    shouldDelegate = false
    delegateTo = undefined
  }
  
  // Gather context
  const context: string[] = []
  context.push(`Raised by: ${decision.from}`)
  if (blocking.length > 0) {
    context.push(`Blocking: ${blocking.join(', ')}`)
  }
  context.push(`Context: ${decision.context}`)
  
  // Get related department state
  const raisedBy = os.departments[decision.from]
  if (raisedBy) {
    context.push(`${decision.from} state: ${raisedBy.currentFocus}`)
  }
  
  // Generate options (simplified - real impl would be more sophisticated)
  const options = [
    'Proceed with proposed approach',
    'Wait and gather more information',
    'Delegate to department lead'
  ]
  
  // Generate recommendation
  const recommendation = urgency === 'critical' 
    ? 'Recommend immediate decision - multiple departments blocked'
    : 'Can wait for more information if needed'
  
  return {
    decision,
    urgency,
    shouldDelegate,
    delegateTo,
    context,
    options,
    recommendation
  }
}

function bundleRelatedDecisions(routes: RoutedDecision[]): RoutedDecision[] {
  // Simple bundling - group decisions from same department
  const byDepartment = new Map<string, RoutedDecision[]>()
  
  for (const route of routes) {
    const dept = route.decision.from
    if (!byDepartment.has(dept)) {
      byDepartment.set(dept, [])
    }
    byDepartment.get(dept)!.push(route)
  }
  
  // If a department has multiple decisions, bundle them
  const bundled: RoutedDecision[] = []
  
  for (const [dept, decisions] of byDepartment) {
    if (decisions.length === 1) {
      bundled.push(decisions[0])
    } else {
      // Create bundled decision
      const bundledDecision: RoutedDecision = {
        decision: {
          ...decisions[0].decision,
          question: `${dept} has ${decisions.length} related decisions`,
          context: decisions.map(d => d.decision.question).join('; ')
        },
        urgency: decisions.reduce((max, d) => 
          ['critical', 'high', 'medium', 'low'].indexOf(d.urgency) < ['critical', 'high', 'medium', 'low'].indexOf(max) ? d.urgency : max
        , 'low'),
        shouldDelegate: false,
        context: decisions.flatMap(d => d.context),
        options: ['Address all together', 'Prioritize most urgent', 'Delegate some'],
        recommendation: 'Review as a group for consistency'
      }
      bundled.push(bundledDecision)
    }
  }
  
  return bundled
}

function formatDecisions(routes: RoutedDecision[]): string {
  const lines: string[] = []
  
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    lines.push('')
    lines.push(`DECISION ${i + 1} · ${route.urgency.toUpperCase()}`)
    lines.push('')
    lines.push(`Question: ${route.decision.question}`)
    lines.push('')
    lines.push('Context:')
    for (const ctx of route.context) {
      lines.push(`- ${ctx}`)
    }
    lines.push('')
    lines.push('Options:')
    for (let j = 0; j < route.options.length; j++) {
      lines.push(`${String.fromCharCode(65 + j)}) ${route.options[j]}`)
    }
    lines.push('')
    lines.push(`Recommendation: ${route.recommendation}`)
    
    if (i < routes.length - 1) {
      lines.push('')
      lines.push('─'.repeat(80))
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.decisions` — all pending decisions
- `company.os.departments.*` — department states for context
- `company.os.events` — decision-related events

**Emits:**
- `decision-routed` → logs decision routing to founder
- `decision-sequenced` → provides priority order
- `decision-delegated` → sends decision to department

**Consumed by:**
- Departments (watch for `decision-delegated` targeting them)
- CEO briefing (uses sequence for priority)
- Founder (receives formatted decision requests)
