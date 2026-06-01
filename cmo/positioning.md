---
name: cmo-positioning
executive: cmo
role: steering
reads:
  - company.os.profile
  - company.os.departments.product
  - company.os.departments.sales
  - company.os.departments.growth
  - company.os.events
events:
  emits: [positioning-updated, messaging-refined, icp-defined]
  watches: [product-launched, customer-feedback, sales-win, sales-loss, market-research-complete]
template-ref: templates/executives/positioning.md
---

## What this agent does

The CMO positioning agent owns how the company is described everywhere. It synthesizes product capabilities, customer feedback, competitive landscape, and sales win/loss data into clear, consistent positioning that drives all marketing and sales materials.

This is the source of truth for: value proposition, messaging hierarchy, ideal customer profile, competitive differentiation, and category positioning.

## Instructions

### WATCH

Trigger when:
- Product launches new capability requiring messaging update
- Sales reports win/loss patterns that signal positioning gaps
- Customer feedback reveals misalignment between promise and reality
- Competitor launches similar product requiring differentiation update
- Website, pitch deck, or sales materials show inconsistent messaging
- Founder requests positioning review

### REASON

Positioning framework:

**Core positioning elements:**
1. **Category** — What market/category do we play in? (create new vs. fit existing)
2. **Ideal Customer Profile** — Who gets most value? (firmographic, psychographic, behavioral)
3. **Problem** — What specific pain do they have? (urgent, expensive, frequent)
4. **Solution** — How do we solve it uniquely? (capability, not features)
5. **Differentiation** — Why us vs. alternatives? (defensible, provable, valuable)
6. **Value Proposition** — What outcome do customers get? (measurable, meaningful)

**Positioning signals to watch:**
- Sales win reasons (why did they choose us?)
- Sales loss reasons (why did they choose competitor?)
- Customer language (how do they describe the problem/solution?)
- Product capabilities (what can we actually deliver?)
- Market trends (where is the category moving?)

**When to update positioning:**
- Core product capability changes
- Win/loss patterns reveal better ICP
- Customer language differs from our messaging
- Competitive landscape shifts
- Market category evolves

### ACT

Positioning document format:

```
POSITIONING DOCUMENT · [Date]

CATEGORY
[What market are we in? Use customer language, not jargon]

IDEAL CUSTOMER PROFILE
Company:      [Size, industry, characteristics]
Role:         [Primary buyer persona and decision-making unit]
Situation:    [Specific context that makes them ready to buy]
Pain:         [Urgent, expensive problem they're actively trying to solve]

PROBLEM STATEMENT
[Describe the problem from customer perspective in their words]

Our customers are [ICP] who struggle with [specific problem].
Current solutions [why alternatives fail].
This costs them [quantified impact].

OUR SOLUTION
[Describe what we do in terms of capability and outcome, not features]

We help [ICP] [achieve outcome] by [unique approach].
Unlike [alternatives], we [key differentiation].

VALUE PROPOSITION
One-liner:    [The single sentence that explains what we do and for whom]
Tagline:      [7 words or less, memorable brand promise]
Elevator:     [30-second explanation for any audience]

MESSAGING HIERARCHY
Primary Message:   [Main value prop for homepage, pitch, sales]
Supporting Points:
  1. [Pillar 1] - [Proof point]
  2. [Pillar 2] - [Proof point]
  3. [Pillar 3] - [Proof point]

DIFFERENTIATION
vs. [Alternative 1]: [Why we're better for our ICP]
vs. [Alternative 2]: [Why we're better for our ICP]
vs. [Alternative 3]: [Why we're better for our ICP]

PROOF POINTS
· [Customer story, metric, or validation]
· [Customer story, metric, or validation]
· [Customer story, metric, or validation]

POSITIONING GUIDANCE
What to emphasize:  [Key themes to always include]
What to avoid:      [Common mistakes, off-brand language]
Customer language:  [Exact phrases customers use]
```

All positioning must be:
- **Customer-centric** — use their language, not internal jargon
- **Specific** — "helps security teams" not "helps companies"
- **Provable** — claims backed by customer stories or data
- **Differentiating** — clear why us vs. alternatives
- **Consistent** — same core message across all channels

### COORDINATE

After updating positioning:
- Emit `positioning-updated` event with diff of what changed
- Flag to marketing department to update website copy
- Flag to sales department to update pitch and collateral
- Flag to product department to align roadmap messaging
- Update `company.os.profile` with refined one-liner and ICP
- Store positioning document in `company.os.departments.cmo.memory`

## TypeScript

```typescript
import { CompanyOS, DepartmentState } from '../src/company-os'

interface PositioningDocument {
  category: string
  icp: {
    company: string
    role: string
    situation: string
    pain: string
  }
  problemStatement: string
  solution: string
  valueProposition: {
    oneLiner: string
    tagline: string
    elevator: string
  }
  messagingHierarchy: {
    primary: string
    supporting: Array<{ pillar: string; proof: string }>
  }
  differentiation: Array<{ alternative: string; reason: string }>
  proofPoints: string[]
  guidance: {
    emphasize: string[]
    avoid: string[]
    customerLanguage: string[]
  }
}

interface PositioningSignal {
  source: string
  signal: string
  impact: 'high' | 'medium' | 'low'
  action: string
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Read current positioning state
  const currentPositioning = extractCurrentPositioning(os)
  
  // Collect positioning signals from departments
  const signals = collectPositioningSignals(os)
  
  // Analyze if positioning update is needed
  const needsUpdate = analyzeUpdateNeed(signals)
  
  if (!needsUpdate) {
    return 'Positioning is current. No update needed.'
  }
  
  // Generate updated positioning document
  const positioning = generatePositioning(os, signals, currentPositioning)
  
  // Identify what changed
  const changes = diffPositioning(currentPositioning, positioning)
  
  // Emit coordination events
  os.events.push({
    type: 'positioning-updated',
    from: 'cmo-positioning',
    payload: { positioning, changes },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Flag departments that need to act on positioning change
  if (changes.valueProposition) {
    os.events.push({
      type: 'messaging-refined',
      from: 'cmo-positioning',
      payload: { oneLiner: positioning.valueProposition.oneLiner },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  if (changes.icp) {
    os.events.push({
      type: 'icp-defined',
      from: 'cmo-positioning',
      payload: { icp: positioning.icp },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update company profile with refined positioning
  os.profile.oneline = positioning.valueProposition.oneLiner
  os.profile.targetCustomer = positioning.icp.company
  os.profile.problem = positioning.icp.pain
  
  // Store in CMO memory
  if (!os.departments.cmo) {
    os.departments.cmo = {
      status: 'steering',
      currentFocus: 'Positioning management',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cmo.memory.push(
    `POSITIONING:${new Date().toISOString()}:${JSON.stringify(positioning)}`
  )
  
  os.departments.cmo.lastAction = {
    type: 'positioning-updated',
    description: `Updated positioning: ${changes.summary}`,
    timestamp: new Date().toISOString(),
    impact: ['marketing', 'sales', 'product']
  }
  
  return formatPositioningDocument(positioning, changes)
}

function extractCurrentPositioning(os: CompanyOS): Partial<PositioningDocument> {
  // Look for existing positioning in CMO memory
  const cmo = os.departments.cmo
  if (!cmo) return {}
  
  const positioningMemory = cmo.memory.find(m => m.startsWith('POSITIONING:'))
  if (!positioningMemory) return {}
  
  const parts = positioningMemory.split(':')
  if (parts.length < 3) return {}
  
  try {
    return JSON.parse(parts.slice(2).join(':'))
  } catch {
    return {}
  }
}

function collectPositioningSignals(os: CompanyOS): PositioningSignal[] {
  const signals: PositioningSignal[] = []
  
  // Sales win/loss signals
  const sales = os.departments.sales
  if (sales) {
    const winSignals = sales.signals.filter(s => s.type.includes('win'))
    for (const signal of winSignals) {
      signals.push({
        source: 'sales',
        signal: `Win reason: ${signal.type}`,
        impact: 'high',
        action: 'Incorporate win reason into messaging'
      })
    }
    
    const lossSignals = sales.signals.filter(s => s.type.includes('loss'))
    for (const signal of lossSignals) {
      signals.push({
        source: 'sales',
        signal: `Loss reason: ${signal.type}`,
        impact: 'high',
        action: 'Address objection in positioning'
      })
    }
  }
  
  // Product capability signals
  const product = os.departments.product
  if (product) {
    const launchEvents = os.events.filter(e => 
      e.from === 'product' && e.type.includes('launch')
    )
    for (const event of launchEvents) {
      signals.push({
        source: 'product',
        signal: `New capability: ${event.type}`,
        impact: 'medium',
        action: 'Update solution description'
      })
    }
  }
  
  // Customer feedback signals
  const customerEvents = os.events.filter(e => e.type.includes('customer-feedback'))
  for (const event of customerEvents) {
    signals.push({
      source: 'customer',
      signal: event.payload?.feedback || 'Customer feedback received',
      impact: 'high',
      action: 'Validate messaging against customer language'
    })
  }
  
  return signals
}

function analyzeUpdateNeed(signals: PositioningSignal[]): boolean {
  // Update if we have high-impact signals
  const highImpactCount = signals.filter(s => s.impact === 'high').length
  return highImpactCount > 0
}

function generatePositioning(
  os: CompanyOS, 
  signals: PositioningSignal[],
  current: Partial<PositioningDocument>
): PositioningDocument {
  // Start with current or defaults
  const positioning: PositioningDocument = {
    category: current.category || os.profile.industry || 'Software',
    icp: current.icp || {
      company: os.profile.targetCustomer || 'B2B companies',
      role: 'Decision maker',
      situation: 'Looking for solution',
      pain: os.profile.problem || 'Problem to solve'
    },
    problemStatement: current.problemStatement || `Our customers struggle with ${os.profile.problem}`,
    solution: current.solution || `We solve ${os.profile.problem}`,
    valueProposition: current.valueProposition || {
      oneLiner: os.profile.oneline || 'We help customers succeed',
      tagline: current.valueProposition?.tagline || 'Your solution',
      elevator: current.valueProposition?.elevator || 'We help companies solve problems'
    },
    messagingHierarchy: current.messagingHierarchy || {
      primary: os.profile.oneline || 'Primary message',
      supporting: []
    },
    differentiation: current.differentiation || [],
    proofPoints: current.proofPoints || [],
    guidance: current.guidance || {
      emphasize: [],
      avoid: [],
      customerLanguage: []
    }
  }
  
  // Update based on signals
  for (const signal of signals) {
    if (signal.signal.includes('Win reason') && signal.source === 'sales') {
      // Add to proof points
      positioning.proofPoints.push(signal.signal)
    }
    
    if (signal.signal.includes('Loss reason') && signal.source === 'sales') {
      // Add to differentiation gaps
      positioning.guidance.emphasize.push(`Address: ${signal.signal}`)
    }
    
    if (signal.source === 'customer') {
      // Extract customer language
      positioning.guidance.customerLanguage.push(signal.signal)
    }
  }
  
  return positioning
}

function diffPositioning(
  current: Partial<PositioningDocument>,
  updated: PositioningDocument
): { valueProposition: boolean; icp: boolean; summary: string } {
  const changes = {
    valueProposition: current.valueProposition?.oneLiner !== updated.valueProposition.oneLiner,
    icp: JSON.stringify(current.icp) !== JSON.stringify(updated.icp),
    summary: ''
  }
  
  const changeList: string[] = []
  if (changes.valueProposition) changeList.push('value proposition')
  if (changes.icp) changeList.push('ICP')
  
  changes.summary = changeList.length > 0 
    ? `Updated ${changeList.join(', ')}` 
    : 'Minor refinements'
  
  return changes
}

function formatPositioningDocument(
  p: PositioningDocument, 
  changes: { summary: string }
): string {
  const lines: string[] = []
  
  lines.push(`POSITIONING DOCUMENT · ${new Date().toISOString().split('T')[0]}`)
  lines.push(`Updates: ${changes.summary}`)
  lines.push('')
  
  lines.push('CATEGORY')
  lines.push(p.category)
  lines.push('')
  
  lines.push('IDEAL CUSTOMER PROFILE')
  lines.push(`Company:      ${p.icp.company}`)
  lines.push(`Role:         ${p.icp.role}`)
  lines.push(`Situation:    ${p.icp.situation}`)
  lines.push(`Pain:         ${p.icp.pain}`)
  lines.push('')
  
  lines.push('PROBLEM STATEMENT')
  lines.push(p.problemStatement)
  lines.push('')
  
  lines.push('OUR SOLUTION')
  lines.push(p.solution)
  lines.push('')
  
  lines.push('VALUE PROPOSITION')
  lines.push(`One-liner:    ${p.valueProposition.oneLiner}`)
  lines.push(`Tagline:      ${p.valueProposition.tagline}`)
  lines.push(`Elevator:     ${p.valueProposition.elevator}`)
  lines.push('')
  
  lines.push('MESSAGING HIERARCHY')
  lines.push(`Primary:      ${p.messagingHierarchy.primary}`)
  if (p.messagingHierarchy.supporting.length > 0) {
    lines.push('Supporting:')
    for (let i = 0; i < p.messagingHierarchy.supporting.length; i++) {
      const s = p.messagingHierarchy.supporting[i]
      lines.push(`  ${i + 1}. ${s.pillar} - ${s.proof}`)
    }
  }
  lines.push('')
  
  if (p.differentiation.length > 0) {
    lines.push('DIFFERENTIATION')
    for (const d of p.differentiation) {
      lines.push(`vs. ${d.alternative}: ${d.reason}`)
    }
    lines.push('')
  }
  
  if (p.proofPoints.length > 0) {
    lines.push('PROOF POINTS')
    for (const proof of p.proofPoints.slice(0, 5)) {
      lines.push(`· ${proof}`)
    }
    lines.push('')
  }
  
  lines.push('POSITIONING GUIDANCE')
  if (p.guidance.emphasize.length > 0) {
    lines.push('Emphasize:')
    for (const e of p.guidance.emphasize) {
      lines.push(`  · ${e}`)
    }
  }
  if (p.guidance.avoid.length > 0) {
    lines.push('Avoid:')
    for (const a of p.guidance.avoid) {
      lines.push(`  · ${a}`)
    }
  }
  if (p.guidance.customerLanguage.length > 0) {
    lines.push('Customer Language:')
    for (const c of p.guidance.customerLanguage.slice(0, 5)) {
      lines.push(`  · ${c}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.profile` — current company description
- `company.os.departments.product` — product capabilities and launches
- `company.os.departments.sales` — win/loss reasons, customer objections
- `company.os.departments.growth` — channel messaging performance
- `company.os.events` — customer feedback, market research

**Emits:**
- `positioning-updated` → triggers updates across marketing/sales materials
- `messaging-refined` → notifies teams of new value prop
- `icp-defined` → updates targeting for sales and marketing

**Consumed by:**
- Marketing department (updates website, ads, content)
- Sales department (updates pitch, collateral)
- Product department (aligns roadmap messaging)
- CMO campaigns agent (uses positioning in campaign briefs)
