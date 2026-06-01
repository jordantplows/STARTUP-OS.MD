---
name: cto-architecture
executive: cto
role: steering
reads:
  - company.os.departments.engineering
  - company.os.departments.product
  - company.os.profile
  - company.os.events
events:
  emits: [architecture-decision-made, adr-created, tech-stack-changed]
  watches: [product-feature-proposed, scaling-required, tech-debt-critical]
template-ref: templates/executives/architecture.md
---

## What this agent does

The CTO architecture agent makes technical architecture decisions, manages the tech stack, and maintains Architecture Decision Records (ADRs). It evaluates technical approaches for product features, ensures architectural consistency, and guides engineering implementation.

## Instructions

### WATCH

Trigger when:
- Product proposes new feature requiring architecture decision
- Engineering flags need for architectural refactor
- Scaling requirements demand infrastructure changes
- Critical technical debt affects system design
- Founder requests technical architecture assessment

### REASON

Architecture decision framework:

**Evaluation criteria:**
1. **Alignment with business goals** — does this architecture serve product strategy?
2. **Team capability** — can we build and maintain this?
3. **Scalability** — will this handle growth (10x, 100x)?
4. **Cost efficiency** — what's the total cost of ownership?
5. **Time to market** — how fast can we ship with this approach?
6. **Technical risk** — what could go wrong?
7. **Reversibility** — how hard is it to change later?

**Decision types:**
- **Two-way doors** — easily reversible, bias toward action
- **One-way doors** — hard to reverse, require careful analysis

**Red flags:**
- Resume-driven development (choosing tech to learn, not to ship)
- Premature optimization (solving scale problems you don't have)
- Not-invented-here syndrome (rebuilding what exists)
- Following hype without validating fit

**Green lights:**
- Proven technology for the use case
- Team has expertise or can learn quickly
- Clear path from MVP to scale
- Good developer experience (faster shipping)

### ACT

Architecture decision format:

```
ARCHITECTURE DECISION RECORD (ADR-XXX)
Date: [YYYY-MM-DD]
Status: [Proposed | Accepted | Deprecated | Superseded]

CONTEXT
[What problem are we solving? What constraints exist?]

DECISION
[What architecture/technology are we adopting?]

RATIONALE
[Why this approach over alternatives?]
· Pro: [Specific advantage]
· Pro: [Specific advantage]
· Con: [Specific limitation]
· Con: [Specific limitation]

ALTERNATIVES CONSIDERED
1. [Alternative 1]
   - Pros: [...]
   - Cons: [...]
   - Why not: [...]

2. [Alternative 2]
   - Pros: [...]
   - Cons: [...]
   - Why not: [...]

CONSEQUENCES
· Engineering impact: [How does this affect the team?]
· Product impact: [How does this affect features/velocity?]
· Cost impact: [What's the cost?]
· Risk: [What could go wrong?]
· Reversibility: [How hard to change?]

VALIDATION
[How will we know if this decision was correct?]
· Success metrics: [...]
· Timeline: [When to reassess?]
```

Architecture decisions must be:
- **Specific** — "use PostgreSQL" not "use a database"
- **Justified** — explain why, not just what
- **Measurable** — define success criteria
- **Reversible or confident** — either easy to change or thoroughly validated

### COORDINATE

After making architecture decision:
- Emit `architecture-decision-made` event with ADR summary
- Emit `adr-created` event with ADR ID and status
- If tech stack changes, emit `tech-stack-changed` event
- Update `company.os.departments.cto.memory` with ADR
- Flag to engineering department for implementation
- Update product department on feasibility/timeline

## TypeScript

```typescript
import { CompanyOS, DepartmentState } from '../src/company-os'

interface ADR {
  id: string
  date: string
  status: 'proposed' | 'accepted' | 'deprecated' | 'superseded'
  context: string
  decision: string
  rationale: {
    pros: string[]
    cons: string[]
  }
  alternatives: Alternative[]
  consequences: Consequences
  validation: Validation
}

interface Alternative {
  name: string
  pros: string[]
  cons: string[]
  whyNot: string
}

interface Consequences {
  engineering: string
  product: string
  cost: string
  risk: string
  reversibility: string
}

interface Validation {
  successMetrics: string[]
  reassessDate: string
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Read current state
  const engineering = os.departments.engineering
  const product = os.departments.product
  const stage = os.profile.stage
  
  // Parse context to understand decision needed
  const decisionContext = parseDecisionContext(context, product, engineering)
  
  // Evaluate alternatives
  const alternatives = generateAlternatives(decisionContext, os)
  
  // Select best approach
  const decision = selectBestApproach(alternatives, os)
  
  // Create ADR
  const adr = createADR(decisionContext, decision, alternatives, os)
  
  // Emit coordination events
  os.events.push({
    type: 'architecture-decision-made',
    from: 'cto-architecture',
    payload: { adr: adr.id, decision: adr.decision },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  os.events.push({
    type: 'adr-created',
    from: 'cto-architecture',
    payload: { id: adr.id, status: adr.status },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  if (isTechStackChange(adr, os)) {
    os.events.push({
      type: 'tech-stack-changed',
      from: 'cto-architecture',
      payload: { technology: adr.decision },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update CTO state
  if (!os.departments.cto) {
    os.departments.cto = {
      status: 'steering',
      currentFocus: 'Architecture decisions',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cto.memory.push(
    `ADR:${adr.id}:${adr.date}:${adr.decision}`
  )
  
  os.departments.cto.lastAction = {
    type: 'architecture-decision-made',
    description: `Created ${adr.id}: ${adr.decision}`,
    timestamp: new Date().toISOString(),
    impact: ['engineering', 'product']
  }
  
  return formatADR(adr)
}

function parseDecisionContext(context: string, product: DepartmentState, engineering: DepartmentState): any {
  // Extract what decision is being requested
  return {
    problem: context,
    productNeeds: product?.currentFocus || 'Unknown',
    engineeringState: engineering?.status || 'Unknown',
    constraints: extractConstraints(product, engineering)
  }
}

function extractConstraints(product: DepartmentState, engineering: DepartmentState): string[] {
  const constraints: string[] = []
  
  if (product?.signals.some(s => s.type.includes('deadline'))) {
    constraints.push('Time-sensitive delivery')
  }
  
  if (engineering?.status === 'blocked') {
    constraints.push('Engineering team blocked')
  }
  
  if (engineering?.memory.some(m => m.includes('debt'))) {
    constraints.push('Existing technical debt')
  }
  
  return constraints
}

function generateAlternatives(decisionContext: any, os: CompanyOS): Alternative[] {
  // Example alternatives for common decisions
  const alternatives: Alternative[] = []
  
  if (decisionContext.problem.toLowerCase().includes('database')) {
    alternatives.push({
      name: 'PostgreSQL',
      pros: ['Proven reliability', 'Rich feature set', 'Strong ecosystem'],
      cons: ['Manual scaling complexity', 'Requires ops expertise'],
      whyNot: ''
    })
    
    alternatives.push({
      name: 'MongoDB',
      pros: ['Flexible schema', 'Easy horizontal scaling', 'Developer-friendly'],
      cons: ['Less mature for transactions', 'Data consistency complexity'],
      whyNot: ''
    })
    
    alternatives.push({
      name: 'Managed database (Supabase/PlanetScale)',
      pros: ['No ops burden', 'Auto-scaling', 'Fast setup'],
      cons: ['Vendor lock-in', 'Cost at scale', 'Less control'],
      whyNot: ''
    })
  }
  
  if (decisionContext.problem.toLowerCase().includes('frontend')) {
    alternatives.push({
      name: 'React + Next.js',
      pros: ['Largest ecosystem', 'Team expertise', 'Full-stack framework'],
      cons: ['Complex build tooling', 'Bundle size concerns'],
      whyNot: ''
    })
    
    alternatives.push({
      name: 'Vue + Nuxt',
      pros: ['Simpler learning curve', 'Good performance', 'Clean syntax'],
      cons: ['Smaller ecosystem', 'Less team expertise'],
      whyNot: ''
    })
  }
  
  return alternatives
}

function selectBestApproach(alternatives: Alternative[], os: CompanyOS): Alternative {
  // Simple heuristic - real impl would use more sophisticated scoring
  const stage = os.profile.stage
  
  if (stage === 'idea' || stage === 'validating') {
    // Early stage - optimize for speed
    return alternatives.find(a => 
      a.pros.some(p => p.includes('Fast') || p.includes('Easy'))
    ) || alternatives[0]
  } else if (stage === 'scaling') {
    // Growth stage - optimize for scale
    return alternatives.find(a =>
      a.pros.some(p => p.includes('scaling') || p.includes('performance'))
    ) || alternatives[0]
  }
  
  // Default to first alternative with team expertise
  return alternatives.find(a =>
    a.pros.some(p => p.includes('expertise'))
  ) || alternatives[0]
}

function createADR(decisionContext: any, decision: Alternative, alternatives: Alternative[], os: CompanyOS): ADR {
  const adrCount = os.departments.cto?.memory.filter(m => m.startsWith('ADR:')).length || 0
  const adrId = `ADR-${String(adrCount + 1).padStart(3, '0')}`
  
  // Mark why alternatives weren't chosen
  const alternativesWithReason = alternatives.map(alt => {
    if (alt.name === decision.name) return alt
    return {
      ...alt,
      whyNot: inferWhyNot(alt, decision)
    }
  }).filter(alt => alt.name !== decision.name)
  
  return {
    id: adrId,
    date: new Date().toISOString().split('T')[0],
    status: 'accepted',
    context: decisionContext.problem,
    decision: decision.name,
    rationale: {
      pros: decision.pros,
      cons: decision.cons
    },
    alternatives: alternativesWithReason,
    consequences: {
      engineering: inferEngineeringImpact(decision, os),
      product: inferProductImpact(decision, os),
      cost: inferCost(decision, os),
      risk: inferRisk(decision, os),
      reversibility: inferReversibility(decision)
    },
    validation: {
      successMetrics: [
        'Team can ship features without architecture blockers',
        'System handles expected load reliably',
        'Technical debt remains manageable'
      ],
      reassessDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 90 days
    }
  }
}

function inferWhyNot(alt: Alternative, chosen: Alternative): string {
  if (chosen.pros.some(p => p.includes('expertise')) && !alt.pros.some(p => p.includes('expertise'))) {
    return 'Team lacks expertise'
  }
  if (chosen.pros.some(p => p.includes('Fast') || p.includes('Easy'))) {
    return 'Slower time to market'
  }
  return 'Chosen alternative better fits current needs'
}

function inferEngineeringImpact(decision: Alternative, os: CompanyOS): string {
  if (decision.pros.some(p => p.includes('expertise'))) {
    return 'Team already familiar, minimal onboarding'
  }
  if (decision.pros.some(p => p.includes('Easy') || p.includes('Simple'))) {
    return 'Quick to learn, fast development'
  }
  return 'Requires learning curve, expect 2-4 week ramp-up'
}

function inferProductImpact(decision: Alternative, os: CompanyOS): string {
  if (decision.pros.some(p => p.includes('Fast'))) {
    return 'Accelerates feature delivery'
  }
  if (decision.cons.some(c => c.includes('complex'))) {
    return 'May slow initial velocity, improves long-term'
  }
  return 'Neutral impact on feature velocity'
}

function inferCost(decision: Alternative, os: CompanyOS): string {
  if (decision.name.includes('Managed') || decision.name.includes('managed')) {
    return 'Higher operational cost, lower engineering cost'
  }
  if (decision.cons.some(c => c.includes('ops'))) {
    return 'Low infrastructure cost, higher engineering overhead'
  }
  return 'Moderate total cost of ownership'
}

function inferRisk(decision: Alternative, os: CompanyOS): string {
  if (decision.pros.some(p => p.includes('Proven') || p.includes('mature'))) {
    return 'Low - battle-tested technology'
  }
  if (decision.cons.some(c => c.includes('lock-in'))) {
    return 'Medium - vendor lock-in risk'
  }
  return 'Medium - standard technology risks'
}

function inferReversibility(decision: Alternative): string {
  if (decision.cons.some(c => c.includes('lock-in'))) {
    return 'Hard - migration would be significant effort'
  }
  if (decision.name.includes('PostgreSQL') || decision.name.includes('React')) {
    return 'Medium - migration possible but costly'
  }
  return 'Easy - can change with moderate effort'
}

function isTechStackChange(adr: ADR, os: CompanyOS): boolean {
  // Check if this is a foundational tech stack decision
  const stackKeywords = ['database', 'frontend', 'backend', 'framework', 'language']
  return stackKeywords.some(kw => 
    adr.context.toLowerCase().includes(kw) || 
    adr.decision.toLowerCase().includes(kw)
  )
}

function formatADR(adr: ADR): string {
  const lines: string[] = []
  
  lines.push(`ARCHITECTURE DECISION RECORD (${adr.id})`)
  lines.push(`Date: ${adr.date}`)
  lines.push(`Status: ${adr.status.toUpperCase()}`)
  lines.push('')
  lines.push('CONTEXT')
  lines.push(adr.context)
  lines.push('')
  lines.push('DECISION')
  lines.push(adr.decision)
  lines.push('')
  lines.push('RATIONALE')
  for (const pro of adr.rationale.pros) {
    lines.push(`· Pro: ${pro}`)
  }
  for (const con of adr.rationale.cons) {
    lines.push(`· Con: ${con}`)
  }
  lines.push('')
  lines.push('ALTERNATIVES CONSIDERED')
  for (let i = 0; i < adr.alternatives.length; i++) {
    const alt = adr.alternatives[i]
    lines.push(`${i + 1}. ${alt.name}`)
    lines.push(`   Pros: ${alt.pros.join(', ')}`)
    lines.push(`   Cons: ${alt.cons.join(', ')}`)
    lines.push(`   Why not: ${alt.whyNot}`)
    if (i < adr.alternatives.length - 1) lines.push('')
  }
  lines.push('')
  lines.push('CONSEQUENCES')
  lines.push(`· Engineering impact: ${adr.consequences.engineering}`)
  lines.push(`· Product impact: ${adr.consequences.product}`)
  lines.push(`· Cost impact: ${adr.consequences.cost}`)
  lines.push(`· Risk: ${adr.consequences.risk}`)
  lines.push(`· Reversibility: ${adr.consequences.reversibility}`)
  lines.push('')
  lines.push('VALIDATION')
  lines.push(`Success metrics:`)
  for (const metric of adr.validation.successMetrics) {
    lines.push(`  · ${metric}`)
  }
  lines.push(`Reassess on: ${adr.validation.reassessDate}`)
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.engineering` — current engineering state
- `company.os.departments.product` — product roadmap and needs
- `company.os.profile` — company stage and constraints
- `company.os.events` — technical decision triggers

**Emits:**
- `architecture-decision-made` → notifies all departments
- `adr-created` → logs new ADR for reference
- `tech-stack-changed` → alerts to foundational changes

**Consumed by:**
- Engineering department (implements architecture)
- Product department (adjusts feasibility/timeline)
- CTO engineering-health (monitors impact on velocity)
