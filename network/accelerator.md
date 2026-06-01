---
name: accelerator
role: steering
department: network
reads:
  - company.os.profile
writes:
  - company.os.network.programs
emits:
  - accelerator-match-found
---

# Accelerator Agent

## Purpose

Evaluates accelerator and program fit — YC, a16z START, Techstars, vertical-specific programs. Reads company stage and profile, recommends which to apply to and when, drafts application answers, tracks deadlines.

## Instructions

1. **Identify relevant programs**:
   - Stage-appropriate (pre-seed, seed)
   - Industry-specific programs
   - Geographic programs (if relevant)
   - Corporate accelerators (if strategic fit)
2. **Evaluate fit**:
   - Does program thesis match company?
   - Does program add value at this stage?
   - What's the trade-off (equity, time)?
3. **Track application deadlines**
4. **Draft application materials**:
   - Core application questions
   - Video intro scripts
   - Supporting materials
5. **Recommend timing** — when to apply

## Coordination

- Reads company profile for fit analysis
- Writes program records to company.os.network.programs
- Emits `accelerator-match-found` for strong fits

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface ProgramRecord {
  id: string
  programName: string
  type: 'accelerator' | 'incubator' | 'fellowship'
  equity: string
  funding: string
  duration: string
  fitScore: number
  nextDeadline: string
  applicationDraft: string
  recommendation: string
  status: 'identified' | 'applied' | 'accepted' | 'declined' | 'not-pursuing'
  addedAt: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[accelerator] Evaluating accelerator program fit...')
  
  const state = os.getState()
  const programs = evaluatePrograms(state)
  
  if (!(state as any).network) {
    (state as any).network = { advisors: [], partnerships: [], press: [], programs: [] }
  }
  
  (state as any).network.programs = programs
  os.save()
  
  const strongFits = programs.filter(p => p.fitScore >= 8)
  strongFits.forEach(p => {
    os.emitEvent({
      type: 'accelerator-match-found',
      from: 'accelerator',
      payload: { programId: p.id, programName: p.programName, fitScore: p.fitScore }
    })
  })
  
  writeAgentMemory('accelerator', {
    lastRun: new Date().toISOString(),
    programCount: programs.length,
    strongFits: strongFits.length
  })
  
  console.log(`[accelerator] Evaluated ${programs.length} programs (${strongFits.length} strong fits)`)
}

function evaluatePrograms(state: any): ProgramRecord[] {
  const programs: ProgramRecord[] = []
  const stage = state.profile.stage
  
  // Y Combinator
  if (stage === 'idea' || stage === 'validating' || stage === 'building') {
    programs.push({
      id: 'yc',
      programName: 'Y Combinator',
      type: 'accelerator',
      equity: '7% (MFN)',
      funding: '$500K',
      duration: '3 months',
      fitScore: calculateYCFit(state),
      nextDeadline: '2026-09-01',
      applicationDraft: draftYCApplication(state),
      recommendation: 'Strong fit — apply next batch',
      status: 'identified',
      addedAt: new Date().toISOString()
    })
  }
  
  // Techstars
  if (stage === 'building' || stage === 'revenue') {
    programs.push({
      id: 'techstars',
      programName: 'Techstars',
      type: 'accelerator',
      equity: '6%',
      funding: '$120K',
      duration: '3 months',
      fitScore: 7,
      nextDeadline: '2026-08-15',
      applicationDraft: 'Draft application for Techstars...',
      recommendation: 'Good fit if you need mentor network',
      status: 'identified',
      addedAt: new Date().toISOString()
    })
  }
  
  return programs
}

function calculateYCFit(state: any): number {
  let score = 5 // base score
  
  // Bonus for tech/software
  if (state.profile.industry.toLowerCase().includes('software') || 
      state.profile.industry.toLowerCase().includes('tech')) {
    score += 2
  }
  
  // Bonus for clear problem
  if (state.profile.problem !== '[PENDING]') {
    score += 1
  }
  
  // Bonus for technical founders
  if (state.profile.founders.length > 0) {
    score += 1
  }
  
  return Math.min(score, 10)
}

function draftYCApplication(state: any): string {
  return `# Y Combinator Application Draft

**Company name:**
${state.profile.companyName}

**Company URL:**
[Your URL]

**What is your company going to make?**
${state.profile.oneline}

**Why did you pick this idea to work on?**
${state.profile.problem}

**Who are the founders?**
${state.profile.founders.join(', ')}

**What is new about what you're making?**
[Differentiation vs alternatives]

**What's the most impressive thing each founder has built?**
[Founder achievements]

**How far along are you?**
Stage: ${state.profile.stage}
${state.profile.revenue > 0 ? `Revenue: $${state.profile.revenue}` : 'Pre-revenue'}

**How do you know customers need what you're making?**
[Customer validation evidence]
`
}
```
