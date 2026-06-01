---
name: narrative
role: steering
department: investor
reads:
  - company.os.profile
  - company.os.cmo.positioning
  - company.os.product
writes:
  - company.os.investor.narrative
emits:
  - narrative-updated
---

# Fundraising Narrative Agent

## Purpose

The fundraising story agent. Reads all company state and writes the canonical fundraising narrative — the version that gets told in first meetings. Keeps it updated. Knows what story resonates for this stage, this market, this team. Coordinates with cmo/ on positioning alignment.

## Instructions

1. **Read company state**:
   - Problem and solution from profile
   - Positioning from cmo/
   - Product roadmap from cpo/
   - Traction metrics
   - Team background
2. **Craft narrative arc**:
   - **The insight** — what did you see that others missed?
   - **The problem** — why does this matter now?
   - **The solution** — what are you building?
   - **Why you** — why is this team uniquely positioned?
   - **The traction** — what proof points exist?
   - **The vision** — where is this going?
3. **Stage-appropriate framing**:
   - **Idea stage** — emphasize insight and team
   - **Validating stage** — emphasize customer conversations
   - **Building stage** — emphasize product differentiation
   - **Revenue stage** — emphasize metrics and unit economics
4. **Keep updated** as company evolves
5. **Coordinate with cmo/** to ensure positioning alignment

## Coordination

- Reads positioning from cmo/ agents
- Writes narrative to company.os.investor.narrative
- Coordinates with investor/pitch-deck.md for deck alignment

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface Narrative {
  insight: string
  problem: string
  solution: string
  whyYou: string
  traction: string
  vision: string
  fullNarrative: string
  stage: string
  lastUpdated: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[narrative] Crafting fundraising narrative...')
  
  const state = os.getState()
  const memory = readAgentMemory('narrative')
  
  // Build narrative components
  const narrative: Narrative = {
    insight: craftInsight(state),
    problem: state.profile.problem,
    solution: state.profile.oneline,
    whyYou: craftWhyYou(state),
    traction: craftTraction(state),
    vision: craftVision(state),
    fullNarrative: '',
    stage: state.profile.stage,
    lastUpdated: new Date().toISOString()
  }
  
  // Assemble full narrative
  narrative.fullNarrative = assembleNarrative(narrative, state)
  
  // Write to company.os
  if (!(state as any).investor) {
    (state as any).investor = {
      targets: [],
      dataRoom: [],
      narrative: '',
      deckVersion: '',
      processStatus: 'not-started',
      pipeline: []
    }
  }
  
  (state as any).investor.narrative = narrative.fullNarrative
  os.save()
  
  os.emitEvent({
    type: 'narrative-updated',
    from: 'narrative',
    payload: { stage: state.profile.stage }
  })
  
  writeAgentMemory('narrative', {
    lastRun: new Date().toISOString(),
    stage: state.profile.stage,
    narrativeLength: narrative.fullNarrative.length
  })
  
  console.log('[narrative] Fundraising narrative updated')
  console.log(`\n${narrative.fullNarrative}\n`)
}

function craftInsight(state: any): string {
  // The unique insight that sparked the company
  const industry = state.profile.industry
  const problem = state.profile.problem
  
  return `We noticed that ${industry} companies struggle with ${problem}, but existing solutions miss the core issue.`
}

function craftWhyYou(state: any): string {
  const founders = state.profile.founders
  
  if (founders.length === 0) {
    return 'Our team brings deep expertise in this problem space.'
  }
  
  return `${founders.join(' and ')} experienced this problem firsthand and have the technical and domain expertise to solve it.`
}

function craftTraction(state: any): string {
  const stage = state.profile.stage
  const revenue = state.profile.revenue
  
  if (stage === 'idea') {
    return 'We\'re pre-launch, focused on building with early design partners.'
  }
  
  if (stage === 'validating') {
    return 'We\'ve validated the problem through 20+ customer interviews and are building with 3 early design partners.'
  }
  
  if (stage === 'building') {
    return 'We launched 3 months ago and have early customer traction.'
  }
  
  if (stage === 'revenue' && revenue > 0) {
    return `We're at $${revenue.toLocaleString()} in revenue and growing.`
  }
  
  return 'We have early traction and are growing.'
}

function craftVision(state: any): string {
  const industry = state.profile.industry
  const targetCustomer = state.profile.targetCustomer
  
  return `We're building the platform that becomes the standard for how ${targetCustomer} handle this problem in ${industry}.`
}

function assembleNarrative(narrative: Narrative, state: any): string {
  const stage = state.profile.stage
  
  // Stage-specific narrative structure
  if (stage === 'idea' || stage === 'validating') {
    return `${narrative.insight}

**The Problem**
${narrative.problem}

**Our Solution**
${narrative.solution}

**Why Us**
${narrative.whyYou}

**Where We're At**
${narrative.traction}

**The Vision**
${narrative.vision}

**The Ask**
We're raising ${state.profile.fundraisingGoal} to validate product-market fit and reach our first 10 customers.`
  }
  
  if (stage === 'building' || stage === 'revenue') {
    return `${narrative.insight}

**The Problem**
${narrative.problem}

${targetCustomerContext(state)}

**Our Solution**
${narrative.solution}

${productDifferentiation(state)}

**Traction**
${narrative.traction}

**Why Us**
${narrative.whyYou}

**The Vision**
${narrative.vision}

**The Ask**
We're raising ${state.profile.fundraisingGoal} to ${useOfFunds(state)}.`
  }
  
  return narrative.fullNarrative
}

function targetCustomerContext(state: any): string {
  return `This affects ${state.profile.targetCustomer} directly — costing them time, money, and competitive advantage.`
}

function productDifferentiation(state: any): string {
  // Would pull from product/ agents in full implementation
  return 'Unlike existing solutions, we focus on [key differentiator].'
}

function useOfFunds(state: any): string {
  const stage = state.profile.stage
  
  if (stage === 'building') {
    return 'hire our first engineers and reach product-market fit'
  }
  
  if (stage === 'revenue') {
    return 'scale our go-to-market motion and grow the team'
  }
  
  return 'accelerate growth'
}
```
