---
name: ceo-hiring
executive: ceo
role: steering
reads:
  - company.os.profile
  - company.os.departments
  - company.os.events
events:
  emits: [hire-recommended, role-opened, candidate-evaluation]
  watches: [team-scale-trigger, department-overload, strategic-gap]
template-ref: templates/executives/hiring.md
---

## What this agent does

The CEO hiring agent determines when to hire leadership, defines the role requirements, and evaluates executive candidates. It watches for signals that indicate hiring needs and ensures the company brings on the right leaders at the right time.

## Instructions

### WATCH

Trigger when:
- A department consistently shows 'blocked' or 'overload' status
- Strategic decision requires expertise the team doesn't have
- Company stage changes (idea → validating → building → revenue)
- Founder asks about hiring
- Multiple departments need the same skillset

### REASON

Hiring decisions follow this framework:

**When to hire:**
1. **Pain threshold** — existing team can't keep up despite process improvements
2. **Strategic gap** — missing expertise for next phase
3. **Leverage multiplier** — hire unlocks multiple blocked paths
4. **Before crisis** — hire 3 months before critical need, not during crisis

**When NOT to hire:**
- Problem can be solved with better process
- Existing team member can grow into role
- Consultant or advisor can fill gap temporarily
- Company doesn't have 12+ months runway for role

**What level to hire:**
- **Individual contributor** — specific technical gap
- **Manager** — team of 5+ needs dedicated leadership
- **Executive** — strategic decisions need domain expertise

### ACT

For each hiring recommendation, output:

```
HIRING RECOMMENDATION · [Role Title]

TRIGGER
[What signal indicates this hire is needed]

TIMING
Urgency: [Critical / High / Medium / Low]
Ideal start date: [Date]
Latest start date before impact: [Date]

PROBLEM THIS SOLVES
· [Specific pain point 1]
· [Specific pain point 2]
· [Specific blocker this unblocks]

ROLE REQUIREMENTS
Must-have:
· [Non-negotiable skill/experience 1]
· [Non-negotiable skill/experience 2]
· [Non-negotiable skill/experience 3]

Nice-to-have:
· [Bonus skill 1]
· [Bonus skill 2]

EVALUATION CRITERIA
1. [How to assess fit - specific]
2. [How to assess fit - specific]
3. [How to assess fit - specific]

ALTERNATIVES CONSIDERED
· [Alternative approach and why it's insufficient]

RUNWAY IMPACT
Cost: $X/year fully loaded
Runway after hire: X months
```

For candidate evaluation:

```
CANDIDATE EVALUATION · [Name] · [Role]

SIGNAL STRENGTH
Technical:      ████░░ (4/5) - [specific evidence]
Leadership:     █████░ (5/5) - [specific evidence]
Culture fit:    ███░░░ (3/5) - [specific evidence]
Stage fit:      ████░░ (4/5) - [specific evidence]

RED FLAGS
· [Concern 1 with evidence]
· [Concern 2 with evidence]

GREEN FLAGS
· [Strength 1 with evidence]
· [Strength 2 with evidence]

REFERENCE CHECK PLAN
Ask previous reports:
- [Specific question about working style]
- [Specific question about leadership]

RECOMMENDATION
[Hire / Pass / More info needed] - [reasoning]
```

### COORDINATE

After hiring analysis:
- Emit `hire-recommended` event with role details
- If approved, emit `role-opened` event
- For each candidate reviewed, emit `candidate-evaluation` event
- Update company.os with hiring plan timeline

## TypeScript

```typescript
import { CompanyOS, DepartmentState } from '../src/company-os'

interface HiringNeed {
  role: string
  trigger: string
  urgency: 'critical' | 'high' | 'medium' | 'low'
  problemsSolved: string[]
  mustHave: string[]
  niceToHave: string[]
  evaluationCriteria: string[]
  costPerYear: number
}

interface CandidateEvaluation {
  name: string
  role: string
  scores: {
    technical: number
    leadership: number
    cultureFit: number
    stageFit: number
  }
  redFlags: string[]
  greenFlags: string[]
  recommendation: 'hire' | 'pass' | 'more-info'
  reasoning: string
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Check if this is a candidate evaluation request
  if (context.toLowerCase().includes('evaluate') || context.toLowerCase().includes('candidate')) {
    return evaluateCandidate(os, context)
  }
  
  // Otherwise, assess hiring needs
  const needs = assessHiringNeeds(os)
  
  if (needs.length === 0) {
    return 'No immediate hiring needs detected. Team is sized appropriately for current stage.'
  }
  
  // Prioritize by urgency
  needs.sort((a, b) => {
    const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
  })
  
  // Emit events for each recommended hire
  for (const need of needs) {
    os.events.push({
      type: 'hire-recommended',
      from: 'ceo-hiring',
      payload: { need },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Check runway impact
  const totalCost = needs.reduce((sum, n) => sum + n.costPerYear, 0)
  const currentRunway = extractRunwayMonths(os)
  const runwayImpact = calculateRunwayImpact(currentRunway, totalCost)
  
  return formatHiringRecommendations(needs, runwayImpact)
}

function assessHiringNeeds(os: CompanyOS): HiringNeed[] {
  const needs: HiringNeed[] = []
  const stage = os.profile.stage
  
  // Check each department for overload signals
  for (const [deptName, state] of Object.entries(os.departments)) {
    if (isOverloaded(state)) {
      const need = generateHiringNeed(deptName, 'overload', state, stage)
      if (need) needs.push(need)
    }
  }
  
  // Check for strategic gaps based on stage
  const strategicNeeds = identifyStrategicGaps(os)
  needs.push(...strategicNeeds)
  
  // Check for cross-department bottlenecks
  const bottlenecks = findBottlenecks(os)
  for (const bottleneck of bottlenecks) {
    const need = generateHiringNeed(bottleneck.dept, 'bottleneck', bottleneck.state, stage)
    if (need) needs.push(need)
  }
  
  // Deduplicate by role
  const uniqueNeeds = deduplicateByRole(needs)
  
  return uniqueNeeds
}

function isOverloaded(state: DepartmentState): boolean {
  return (
    state.status === 'blocked' ||
    state.pendingDecisions.length > 3 ||
    state.signals.filter(s => s.priority === 'critical').length > 1
  )
}

function generateHiringNeed(
  deptName: string,
  trigger: string,
  state: DepartmentState,
  stage: string
): HiringNeed | null {
  // Map department to role
  const roleMap: Record<string, string> = {
    product: 'Product Manager',
    engineering: 'Engineering Lead',
    design: 'Design Lead',
    marketing: 'Marketing Lead',
    sales: 'Sales Lead',
    finance: 'Finance Manager',
    legal: 'Legal Counsel'
  }
  
  const role = roleMap[deptName]
  if (!role) return null
  
  // Determine urgency based on state
  let urgency: 'critical' | 'high' | 'medium' | 'low' = 'medium'
  if (state.status === 'blocked' && state.pendingDecisions.length > 2) {
    urgency = 'critical'
  } else if (state.signals.some(s => s.priority === 'critical')) {
    urgency = 'high'
  }
  
  // Define requirements based on stage
  const mustHave: string[] = []
  const niceToHave: string[] = []
  
  if (stage === 'idea' || stage === 'validating') {
    mustHave.push('0→1 experience', 'Comfortable with ambiguity', 'Customer discovery expertise')
    niceToHave.push('Previous startup experience', 'Domain expertise')
  } else if (stage === 'building') {
    mustHave.push('Shipped products from scratch', 'Cross-functional collaboration', 'MVP mindset')
    niceToHave.push('Scaled a team before', 'Technical depth')
  } else if (stage === 'revenue') {
    mustHave.push('Scaled from $0→$1M+', 'Built repeatable processes', 'Team leadership')
    niceToHave.push('Raised funding', 'Board experience')
  }
  
  return {
    role,
    trigger: `${deptName} ${trigger}: ${state.currentFocus}`,
    urgency,
    problemsSolved: [
      `Unblock ${deptName} department`,
      state.currentFocus,
      'Enable team to move faster'
    ],
    mustHave,
    niceToHave,
    evaluationCriteria: [
      'Can they handle ambiguity and make decisions with incomplete info?',
      'Do they have specific examples of similar challenges?',
      'Will they thrive at our current stage?'
    ],
    costPerYear: estimateCost(role, stage)
  }
}

function identifyStrategicGaps(os: CompanyOS): HiringNeed[] {
  const gaps: HiringNeed[] = []
  const stage = os.profile.stage
  
  // Stage-specific strategic hires
  if (stage === 'building' && !os.departments.cto) {
    gaps.push({
      role: 'CTO',
      trigger: 'Building stage without technical leadership',
      urgency: 'high',
      problemsSolved: [
        'Technical architecture decisions',
        'Engineering team scale',
        'Build vs buy calls'
      ],
      mustHave: [
        'Built products from 0→1',
        'Technical depth in our stack',
        'Team building experience'
      ],
      niceToHave: [
        'Previous startup CTO',
        'Fundraising experience'
      ],
      evaluationCriteria: [
        'Can they architect for our scale and beyond?',
        'Do they code hands-on when needed?',
        'Can they hire and mentor engineers?'
      ],
      costPerYear: 200000
    })
  }
  
  if (stage === 'revenue' && !os.departments.sales) {
    gaps.push({
      role: 'Sales Lead',
      trigger: 'Revenue stage without sales leadership',
      urgency: 'critical',
      problemsSolved: [
        'Build repeatable sales process',
        'Scale revenue predictably',
        'Customer acquisition strategy'
      ],
      mustHave: [
        'Sold similar product',
        'Built sales from scratch',
        'Knows our customer segment'
      ],
      niceToHave: [
        'Enterprise sales experience',
        'Built sales team before'
      ],
      evaluationCriteria: [
        'Can they close deals themselves?',
        'Do they have a playbook for our ICP?',
        'Can they hire and train reps?'
      ],
      costPerYear: 180000
    })
  }
  
  return gaps
}

function findBottlenecks(os: CompanyOS): Array<{ dept: string, state: DepartmentState }> {
  // Find departments that are blocking multiple others
  const bottlenecks: Array<{ dept: string, state: DepartmentState }> = []
  
  const blockingCount = new Map<string, number>()
  for (const decision of os.decisions) {
    if (!decision.answer) {
      blockingCount.set(decision.from, (blockingCount.get(decision.from) || 0) + decision.blocking.length)
    }
  }
  
  for (const [dept, count] of blockingCount) {
    if (count > 2 && os.departments[dept]) {
      bottlenecks.push({ dept, state: os.departments[dept] })
    }
  }
  
  return bottlenecks
}

function deduplicateByRole(needs: HiringNeed[]): HiringNeed[] {
  const seen = new Set<string>()
  const unique: HiringNeed[] = []
  
  for (const need of needs) {
    if (!seen.has(need.role)) {
      seen.add(need.role)
      unique.push(need)
    }
  }
  
  return unique
}

function estimateCost(role: string, stage: string): number {
  const baseCosts: Record<string, number> = {
    'Product Manager': 140000,
    'Engineering Lead': 180000,
    'Design Lead': 130000,
    'Marketing Lead': 120000,
    'Sales Lead': 150000,
    'Finance Manager': 110000,
    'CTO': 220000,
    'VP Sales': 180000
  }
  
  const base = baseCosts[role] || 120000
  
  // Adjust for stage
  if (stage === 'idea' || stage === 'validating') {
    return base * 0.7 // More equity, less cash
  }
  
  return base
}

function extractRunwayMonths(os: CompanyOS): number {
  const finance = os.departments.finance
  if (!finance) return 12 // Default assumption
  
  const runwayMemory = finance.memory.find(m => m.includes('runway'))
  if (!runwayMemory) return 12
  
  const match = runwayMemory.match(/(\d+)\s*months/)
  return match ? parseInt(match[1]) : 12
}

function calculateRunwayImpact(currentMonths: number, additionalAnnualCost: number): string {
  const monthlyIncrease = additionalAnnualCost / 12
  const newRunway = currentMonths - (monthlyIncrease / 10000) // Simplified calc
  return `${currentMonths} → ${Math.max(0, newRunway).toFixed(1)} months`
}

function evaluateCandidate(os: CompanyOS, context: string): string {
  // Placeholder for candidate evaluation
  // Real impl would parse candidate details from context
  return 'Candidate evaluation requires specific candidate details. Use format: "Evaluate [Name] for [Role]"'
}

function formatHiringRecommendations(needs: HiringNeed[], runwayImpact: string): string {
  const lines: string[] = []
  
  lines.push('HIRING RECOMMENDATIONS')
  lines.push('')
  
  for (let i = 0; i < needs.length; i++) {
    const need = needs[i]
    lines.push(`${i + 1}. ${need.role} · ${need.urgency.toUpperCase()}`)
    lines.push('')
    lines.push('TRIGGER')
    lines.push(need.trigger)
    lines.push('')
    lines.push('PROBLEMS THIS SOLVES')
    for (const problem of need.problemsSolved) {
      lines.push(`· ${problem}`)
    }
    lines.push('')
    lines.push('MUST-HAVE REQUIREMENTS')
    for (const req of need.mustHave) {
      lines.push(`· ${req}`)
    }
    lines.push('')
    lines.push('EVALUATION CRITERIA')
    for (let j = 0; j < need.evaluationCriteria.length; j++) {
      lines.push(`${j + 1}. ${need.evaluationCriteria[j]}`)
    }
    lines.push('')
    lines.push(`COST: $${need.costPerYear.toLocaleString()}/year`)
    
    if (i < needs.length - 1) {
      lines.push('')
      lines.push('─'.repeat(80))
      lines.push('')
    }
  }
  
  lines.push('')
  lines.push(`RUNWAY IMPACT: ${runwayImpact}`)
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.profile.stage` — determines appropriate hires for stage
- `company.os.departments.*` — identifies overload and bottlenecks
- `company.os.decisions` — finds departments blocking others

**Emits:**
- `hire-recommended` → flags need for new hire
- `role-opened` → starts hiring process
- `candidate-evaluation` → assessment of specific candidate

**Consumed by:**
- Founder (approves hires)
- CFO (validates runway impact)
- People department (executes hiring process)
