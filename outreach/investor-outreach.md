---
name: investor-outreach
role: steering
department: outreach
tripwired: true
reads:
  - company.os.investor.targets
  - company.os.profile
  - company.os.network
writes:
  - company.os.investor.pipeline
  - company.os.outreach.investorActivity
emits:
  - investor-intro-requested
  - investor-meeting-booked
  - founder-approval-required
---

# Investor Outreach Agent

## Purpose

Reads investor target list. Maps warm introduction paths through founder's network. Drafts personalized outreach for each investor based on their thesis and portfolio. Tracks pipeline state in company.os. **Tripwired — founder approves before sending.**

## Instructions

1. **Read investor target list** from company.os.investor.targets
2. **Map warm intro paths**:
   - Check founder's LinkedIn connections
   - Check advisors in company.os.network.advisors
   - Check portfolio company founders (2nd degree)
   - Rank paths by strength of connection
3. **Draft personalized outreach** for each investor:
   - Reference specific portfolio company
   - Tie company to investor's thesis
   - Include relevant traction metrics
   - Suggest specific mutual connection for intro
4. **Track pipeline**:
   - Intro requested
   - Intro made
   - Meeting scheduled
   - Partner meeting
   - Diligence
   - Term sheet
5. **Tripwire every send** — founder must approve each message

## Coordination

- Reads investor targets from investor/target-investors.md
- Reads network connections from company.os.network
- Writes outreach drafts to company.os.investor.pipeline
- Emits `founder-approval-required` before any send
- Coordinates with investor/data-room.md when diligence starts

## Decision Points

- **No warm path found** → raise decision: "Direct outreach or wait for intro?"
- **Investor not responding** → raise decision: "Follow up or move on?"

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface InvestorOutreach {
  investorId: string
  investorName: string
  firmName: string
  warmIntroPath: IntroPath | null
  outreachDraft: string
  status: 'draft' | 'approved' | 'sent' | 'replied' | 'meeting-booked'
  approvedBy?: string
  sentAt?: string
  repliedAt?: string
}

interface IntroPath {
  connector: string
  connectionStrength: 'strong' | 'medium' | 'weak'
  relationshipNote: string
  introRequestDraft: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[investor-outreach] Building investor outreach plan...')
  
  const state = os.getState()
  const memory = readAgentMemory('investor-outreach')
  
  const investors = (state as any).investor?.targets || []
  
  if (investors.length === 0) {
    console.log('[investor-outreach] No investor targets yet. Waiting for investor/target-investors.md...')
    return
  }
  
  const outreachPlan: InvestorOutreach[] = []
  
  for (const investor of investors) {
    // Map warm intro paths
    const introPath = findWarmIntroPath(investor, state)
    
    // Draft personalized outreach
    const outreachDraft = draftInvestorOutreach(investor, state, introPath)
    
    outreachPlan.push({
      investorId: investor.id,
      investorName: investor.name,
      firmName: investor.firm,
      warmIntroPath: introPath,
      outreachDraft,
      status: 'draft'
    })
  }
  
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
  
  (state as any).investor.pipeline = outreachPlan
  os.save()
  
  // Emit tripwire event — founder must approve
  os.emitEvent({
    type: 'founder-approval-required',
    from: 'investor-outreach',
    payload: {
      action: 'investor-outreach',
      count: outreachPlan.length,
      message: 'Investor outreach drafts ready for review'
    }
  })
  
  writeAgentMemory('investor-outreach', {
    lastRun: new Date().toISOString(),
    outreachCount: outreachPlan.length
  })
  
  console.log(`[investor-outreach] Drafted outreach to ${outreachPlan.length} investors`)
  console.log('[investor-outreach] TRIPWIRED — Waiting for founder approval before sending')
}

function findWarmIntroPath(investor: any, state: any): IntroPath | null {
  // This would check founder's LinkedIn network, advisors, etc.
  // For now, return a template
  
  const advisors = (state as any).network?.advisors || []
  
  for (const advisor of advisors) {
    if (advisor.connectedToInvestors?.includes(investor.firm)) {
      return {
        connector: advisor.name,
        connectionStrength: 'strong',
        relationshipNote: `${advisor.name} worked with ${investor.firm} on previous investments`,
        introRequestDraft: generateIntroRequest(investor, advisor, state)
      }
    }
  }
  
  return null
}

function generateIntroRequest(investor: any, connector: any, state: any): string {
  return `Hi ${connector.name},

Hope you're doing well! Quick ask:

Would you be open to introducing me to ${investor.name} at ${investor.firm}? We're building ${state.profile.companyName} — ${state.profile.oneline}.

I noticed ${investor.firm} invested in [portfolio company] which tackles a similar space. Think there's strong alignment with their thesis on ${investor.thesisFocus || 'this market'}.

Happy to share more context if helpful.

Thanks!
${state.profile.founders[0]}`
}

function draftInvestorOutreach(investor: any, state: any, introPath: IntroPath | null): string {
  const hasWarmIntro = introPath !== null
  
  if (hasWarmIntro) {
    return `Hi ${investor.name},

${introPath!.connector} suggested I reach out. We're building ${state.profile.companyName} — ${state.profile.oneline}.

I noticed ${investor.firm}'s investment in [portfolio company]. We're solving a similar problem in ${state.profile.industry}, now at [traction metric].

Given ${investor.firm}'s focus on ${investor.thesisFocus || 'this space'}, thought there might be good alignment.

Would you be open to a brief call to discuss?

Best,
${state.profile.founders[0]}
${state.profile.companyName}`
  } else {
    return `Hi ${investor.name},

Quick intro: I'm building ${state.profile.companyName} — ${state.profile.oneline}.

Reaching out because ${investor.firm} has a clear thesis in ${investor.thesisFocus || 'this space'}, especially with investments like [portfolio company].

We're at [stage], with [traction metric]. Would love to share what we're seeing and see if there's potential fit.

Open to a brief call?

Best,
${state.profile.founders[0]}
${state.profile.companyName}`
  }
}
```
