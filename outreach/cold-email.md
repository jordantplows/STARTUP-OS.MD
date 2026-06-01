---
name: cold-email
role: steering
department: outreach
reads:
  - company.os.profile.targetCustomer
  - company.os.profile.problem
  - company.os.product
  - company.os.research.customerSignals
writes:
  - company.os.outreach.sequences
  - company.os.outreach.replies
  - company.os.outreach.pipeline
emits:
  - outreach-sent
  - reply-received
  - follow-up-needed
---

# Cold Email Agent

## Purpose

Watches company.os for ICP definition and customer signals. Writes personalized cold email sequences specific to the company's product and target customer. Tracks open/reply signals back to company.os. Knows when to follow up, when to stop.

## Instructions

1. **Read ICP definition** from company.os.profile.targetCustomer
2. **Read customer pain signals** from company.os.research.customerSignals
3. **Draft personalized email sequences**:
   - Subject line variations (3 per sequence)
   - Email body using customer's exact language from research
   - Follow-up cadence (day 3, day 7, day 14)
   - Clear CTA aligned with company stage
4. **Track engagement**:
   - Sent count
   - Open rate
   - Reply rate
   - Meeting booked
5. **Adjust strategy** based on reply patterns:
   - If open rate < 30%, revise subject lines
   - If reply rate < 5%, revise email body
   - If objections repeat, surface to product/
6. **Know when to stop**:
   - After 3 follow-ups with no response
   - If prospect explicitly opts out
   - If prospect moves to sales pipeline

## Coordination

- Reads customer pain signals from research/customer-intel.md
- Writes sequences to company.os.outreach.sequences
- Emits `outreach-sent` event after each batch
- Emits `reply-received` event when engagement detected
- Coordinates with sales/ when meeting booked

## Decision Points

- **Low engagement rates** → raise decision: "Email messaging not resonating — pivot angle?"
- **High objection rate** → surface pattern to product/ and cmo/

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface EmailSequence {
  id: string
  targetSegment: string
  subjectLines: string[]
  emailBodies: string[]
  cadence: number[] // days between emails
  status: 'draft' | 'active' | 'paused'
  stats: {
    sent: number
    opened: number
    replied: number
    booked: number
  }
}

interface OutreachRecord {
  sequenceId: string
  recipientEmail: string
  sentAt: string
  openedAt?: string
  repliedAt?: string
  bookedAt?: string
  status: 'sent' | 'opened' | 'replied' | 'booked' | 'stopped'
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[cold-email] Starting cold email sequence generation...')
  
  const state = os.getState()
  const memory = readAgentMemory('cold-email')
  
  // Read ICP and customer signals
  const icp = state.profile.targetCustomer
  const problem = state.profile.problem
  const customerSignals = (state as any).research?.customerSignals || []
  
  if (icp === '[PENDING]' || problem === '[PENDING]') {
    console.log('[cold-email] ICP or problem not yet defined. Waiting...')
    return
  }
  
  // Draft personalized sequences
  const sequences: EmailSequence[] = []
  
  // Sequence 1: Problem-first approach
  sequences.push({
    id: `seq-${Date.now()}-problem`,
    targetSegment: icp,
    subjectLines: [
      `Quick question about ${extractPainPoint(problem)}`,
      `${extractPainPoint(problem)} — seeing this too?`,
      `Solving ${extractPainPoint(problem)} at ${state.profile.companyName}`
    ],
    emailBodies: [
      generateProblemFirstEmail(state),
      generateProblemFirstEmail(state), // variations
      generateProblemFirstEmail(state)
    ],
    cadence: [0, 3, 7, 14], // initial, then 3-day, 7-day, 14-day follow-ups
    status: 'draft',
    stats: { sent: 0, opened: 0, replied: 0, booked: 0 }
  })
  
  // Sequence 2: Social proof approach (if we have customers)
  if (state.profile.revenue > 0) {
    sequences.push({
      id: `seq-${Date.now()}-social`,
      targetSegment: icp,
      subjectLines: [
        `How ${getIndustryPeers(state)} solved ${extractPainPoint(problem)}`,
        `${getIndustryPeers(state)} case study`,
        `Peer approach to ${extractPainPoint(problem)}`
      ],
      emailBodies: [
        generateSocialProofEmail(state),
        generateSocialProofEmail(state),
        generateSocialProofEmail(state)
      ],
      cadence: [0, 3, 7, 14],
      status: 'draft',
      stats: { sent: 0, opened: 0, replied: 0, booked: 0 }
    })
  }
  
  // Write sequences to company.os
  if (!(state as any).outreach) {
    (state as any).outreach = { sequences: [], replies: [], pipeline: [] }
  }
  
  (state as any).outreach.sequences = sequences
  os.save()
  
  // Emit event
  os.emitEvent({
    type: 'outreach-sent',
    from: 'cold-email',
    payload: { sequenceCount: sequences.length, status: 'draft' }
  })
  
  // Write to memory
  writeAgentMemory('cold-email', {
    lastRun: new Date().toISOString(),
    sequencesGenerated: sequences.length,
    targetICP: icp
  })
  
  console.log(`[cold-email] Generated ${sequences.length} email sequences`)
  console.log('[cold-email] Sequences ready for founder review before sending')
}

function extractPainPoint(problem: string): string {
  // Extract the core pain point from problem statement
  return problem.split(' ').slice(0, 5).join(' ')
}

function generateProblemFirstEmail(state: any): string {
  return `Hi {{firstName}},

I noticed ${state.profile.targetCustomer} often struggle with ${state.profile.problem}.

We built ${state.profile.companyName} to solve exactly this. Would love to show you how ${getIndustryPeers(state)} are handling it.

15 minutes this week?

Best,
${state.profile.founders[0] || 'Founder'}
${state.profile.companyName}`
}

function generateSocialProofEmail(state: any): string {
  return `Hi {{firstName}},

${getIndustryPeers(state)} recently solved ${state.profile.problem} using ${state.profile.companyName}.

Thought you might find their approach interesting given your role at {{companyName}}.

Worth a 15-minute call?

Best,
${state.profile.founders[0] || 'Founder'}
${state.profile.companyName}`
}

function getIndustryPeers(state: any): string {
  // This would ideally come from actual customer data
  // For now, use generic industry reference
  return `companies in ${state.profile.industry}`
}
```
