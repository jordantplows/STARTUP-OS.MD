---
name: advisor
role: steering
department: network
reads:
  - company.os.profile
  - company.os.departments
writes:
  - company.os.network.advisors
emits:
  - advisor-identified
  - advisor-outreach-ready
---

# Advisor Agent

## Purpose

Identifies ideal advisors for the company's current stage and gaps. Maps who in the founder's network could introduce them. Drafts outreach. Tracks advisor conversations. Suggests equity ranges and engagement structures.

## Instructions

1. **Identify gaps** in team expertise:
   - Technical gaps (if needed)
   - Industry expertise gaps
   - Go-to-market gaps
   - Fundraising experience gaps
2. **Research potential advisors**:
   - Domain experts in the space
   - Operators with relevant experience
   - Investors who could open doors
   - Technical experts for specific challenges
3. **Map warm intro paths**:
   - Check founder's network
   - Check existing advisors' networks
   - Check portfolio overlaps
4. **Draft outreach** with:
   - Specific ask (what expertise do you need?)
   - Time commitment (monthly calls vs ongoing)
   - Equity range (0.25%-1% typical for advisors)
5. **Track conversations and commitments**

## Coordination

- Reads company profile and department states
- Writes advisor records to company.os.network.advisors
- Emits `advisor-identified` when gap + advisor match found
- Coordinates with investor/ for investor-advisors

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface AdvisorRecord {
  id: string
  name: string
  expertise: string[]
  relevantExperience: string
  warmIntroPath?: string
  outreachDraft: string
  status: 'identified' | 'outreach-sent' | 'conversation' | 'committed' | 'declined'
  suggestedEquity: string
  timeCommitment: string
  addedAt: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[advisor] Identifying advisor gaps and candidates...')
  
  const state = os.getState()
  const memory = readAgentMemory('advisor')
  
  // Identify gaps
  const gaps = identifyGaps(state)
  
  // Find advisors for each gap
  const advisors = findAdvisors(gaps, state)
  
  // Write to company.os
  if (!(state as any).network) {
    (state as any).network = {
      advisors: [],
      partnerships: [],
      press: [],
      programs: []
    }
  }
  
  (state as any).network.advisors = advisors
  os.save()
  
  // Emit events
  advisors.forEach(advisor => {
    os.emitEvent({
      type: 'advisor-identified',
      from: 'advisor',
      payload: {
        advisorId: advisor.id,
        name: advisor.name,
        expertise: advisor.expertise
      }
    })
  })
  
  writeAgentMemory('advisor', {
    lastRun: new Date().toISOString(),
    advisorsIdentified: advisors.length,
    gaps: gaps
  })
  
  console.log(`[advisor] Identified ${advisors.length} potential advisors for ${gaps.length} gaps`)
  gaps.forEach(gap => console.log(`  Gap: ${gap}`))
}

function identifyGaps(state: any): string[] {
  const gaps: string[] = []
  
  const stage = state.profile.stage
  const industry = state.profile.industry
  
  // Stage-specific gaps
  if (stage === 'idea' || stage === 'validating') {
    gaps.push('Product-market fit expertise')
    gaps.push('Early customer acquisition')
  }
  
  if (stage === 'building' || stage === 'revenue') {
    gaps.push('Go-to-market strategy')
    gaps.push('Fundraising experience')
  }
  
  // Check for fundraising need
  if (state.profile.fundraisingGoal !== '[PENDING]') {
    gaps.push('Investor network and fundraising')
  }
  
  // Industry-specific gaps
  if (industry !== '[PENDING]') {
    gaps.push(`Deep ${industry} domain expertise`)
  }
  
  return gaps
}

function findAdvisors(gaps: string[], state: any): AdvisorRecord[] {
  // In production, would search advisor databases, LinkedIn, etc.
  const advisors: AdvisorRecord[] = []
  
  gaps.forEach(gap => {
    // Generate advisor profile for this gap
    const advisor: AdvisorRecord = {
      id: `advisor-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: `Expert in ${gap}`,
      expertise: [gap],
      relevantExperience: `20+ years experience in ${gap}`,
      outreachDraft: draftOutreach(gap, state),
      status: 'identified',
      suggestedEquity: determinEquityRange(state.profile.stage),
      timeCommitment: 'Monthly 1-hour calls',
      addedAt: new Date().toISOString()
    }
    
    advisors.push(advisor)
  })
  
  return advisors
}

function draftOutreach(gap: string, state: any): string {
  return `Hi [Name],

I'm building ${state.profile.companyName} — ${state.profile.oneline}.

We're at the ${state.profile.stage} stage and could really use guidance on ${gap.toLowerCase()}.

Your experience with [specific relevant experience] would be incredibly valuable as we navigate [specific challenge].

Would you be open to a brief call to explore an advisory relationship? We're thinking monthly calls and standard advisor equity (${determinEquityRange(state.profile.stage)}).

Best,
${state.profile.founders[0] || 'Founder'}`
}

function determinEquityRange(stage: string): string {
  // Standard advisor equity ranges
  if (stage === 'idea' || stage === 'validating') {
    return '0.5-1%'
  }
  if (stage === 'building') {
    return '0.25-0.5%'
  }
  return '0.1-0.25%'
}
```
