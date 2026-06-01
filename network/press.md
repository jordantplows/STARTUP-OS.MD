---
name: press
role: steering
department: network
reads:
  - company.os.profile
  - company.os.cmo.positioning
writes:
  - company.os.network.press
emits:
  - press-opportunity-identified
---

# Press Agent

## Purpose

Identifies journalists, podcasts, newsletters that cover this space and reach the ICP. Drafts pitches tailored to each outlet. Tracks press relationships. Knows what makes a story vs what gets ignored.

## Instructions

1. **Identify relevant outlets**:
   - Tech journalists covering the industry
   - Industry-specific publications
   - Podcasts with relevant audiences
   - Newsletters reaching the ICP
2. **Understand what each outlet covers**:
   - What angles do they write about?
   - What makes a story for them?
   - Who have they covered recently?
3. **Draft tailored pitches**:
   - Lead with the newsworthy angle
   - Tie to current trends
   - Make it relevant to their audience
4. **Know when you have a story**:
   - Funding announcement
   - Major customer win
   - Interesting insight/data
   - Contrarian take on industry trend
5. **Track relationships** and followups

## Coordination

- Reads positioning from cmo/ for story angles
- Writes press contacts to company.os.network.press
- Emits `press-opportunity-identified` when story-worthy event occurs

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface PressRecord {
  id: string
  outletName: string
  outletType: 'publication' | 'podcast' | 'newsletter'
  journalistName?: string
  coverage: string[]
  audience: string
  pitchDraft: string
  status: 'identified' | 'pitched' | 'responded' | 'covered' | 'declined'
  addedAt: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[press] Identifying press opportunities...')
  
  const state = os.getState()
  const pressContacts = identifyPressContacts(state)
  
  if (!(state as any).network) {
    (state as any).network = { advisors: [], partnerships: [], press: [], programs: [] }
  }
  
  (state as any).network.press = pressContacts
  os.save()
  
  pressContacts.forEach(p => {
    os.emitEvent({
      type: 'press-opportunity-identified',
      from: 'press',
      payload: { pressId: p.id, outletName: p.outletName, type: p.outletType }
    })
  })
  
  writeAgentMemory('press', {
    lastRun: new Date().toISOString(),
    pressCount: pressContacts.length
  })
  
  console.log(`[press] Identified ${pressContacts.length} press opportunities`)
}

function identifyPressContacts(state: any): PressRecord[] {
  const contacts: PressRecord[] = []
  const industry = state.profile.industry
  
  // TechCrunch (if tech startup)
  contacts.push({
    id: `press-${Date.now()}-1`,
    outletName: 'TechCrunch',
    outletType: 'publication',
    coverage: ['startup funding', 'product launches', 'industry trends'],
    audience: 'Tech industry, VCs, early adopters',
    pitchDraft: generatePitch('TechCrunch', state),
    status: 'identified',
    addedAt: new Date().toISOString()
  })
  
  // Industry-specific podcast
  contacts.push({
    id: `press-${Date.now()}-2`,
    outletName: `The ${industry} Podcast`,
    outletType: 'podcast',
    coverage: [`${industry} trends`, 'founder stories'],
    audience: `${state.profile.targetCustomer}`,
    pitchDraft: generatePitch('podcast', state),
    status: 'identified',
    addedAt: new Date().toISOString()
  })
  
  return contacts
}

function generatePitch(outlet: string, state: any): string {
  if (outlet === 'TechCrunch') {
    return `Hi [Journalist Name],

Quick story idea: ${state.profile.companyName} is tackling ${state.profile.problem} for ${state.profile.targetCustomer}.

**Why now:** [Tie to current trend or event]

**Traction:** ${state.profile.revenue > 0 ? `$${state.profile.revenue} in revenue` : 'Early customer validation'}

**The angle:** [Contrarian take or interesting insight]

Would this be interesting for TechCrunch?

Happy to provide more details.

Best,
${state.profile.founders[0]}`
  }
  
  return `Hi [Host Name],

I'm ${state.profile.founders[0]}, founder of ${state.profile.companyName}.

We're solving ${state.profile.problem} — something that affects ${state.profile.targetCustomer} directly.

I'd love to share our story and insights on [relevant topic] with your audience.

Would this be a good fit for ${outlet}?

Best,
${state.profile.founders[0]}`
}
```
