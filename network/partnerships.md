---
name: partnerships
role: steering
department: network
reads:
  - company.os.profile
  - company.os.product
writes:
  - company.os.network.partnerships
emits:
  - partnership-identified
---

# Partnerships Agent

## Purpose

Identifies strategic partnership opportunities that accelerate customer acquisition or product. Researches potential partners. Drafts partnership proposals. Tracks conversations in company.os.

## Instructions

1. **Identify partnership types**:
   - **Distribution partnerships** — reach their customers
   - **Integration partnerships** — connect products
   - **Co-marketing partnerships** — shared campaigns
   - **Reseller partnerships** — they sell your product
2. **Research potential partners**:
   - Companies serving same ICP
   - Companies with complementary products
   - Companies with distribution channels you lack
3. **Draft partnership proposals**:
   - Clear mutual benefit
   - Specific structure (revenue share, integration, etc.)
   - Success metrics
4. **Track partnership pipeline**

## Coordination

- Reads company profile and product state
- Writes partnerships to company.os.network.partnerships
- Emits `partnership-identified` for each opportunity

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface PartnershipRecord {
  id: string
  companyName: string
  partnershipType: 'distribution' | 'integration' | 'co-marketing' | 'reseller'
  mutualBenefit: string
  proposedStructure: string
  proposalDraft: string
  status: 'identified' | 'outreach-sent' | 'conversation' | 'agreed' | 'declined'
  addedAt: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[partnerships] Identifying strategic partnership opportunities...')
  
  const state = os.getState()
  const partnerships = identifyPartnerships(state)
  
  if (!(state as any).network) {
    (state as any).network = { advisors: [], partnerships: [], press: [], programs: [] }
  }
  
  (state as any).network.partnerships = partnerships
  os.save()
  
  partnerships.forEach(p => {
    os.emitEvent({
      type: 'partnership-identified',
      from: 'partnerships',
      payload: { partnershipId: p.id, companyName: p.companyName, type: p.partnershipType }
    })
  })
  
  writeAgentMemory('partnerships', {
    lastRun: new Date().toISOString(),
    partnershipCount: partnerships.length
  })
  
  console.log(`[partnerships] Identified ${partnerships.length} partnership opportunities`)
}

function identifyPartnerships(state: any): PartnershipRecord[] {
  const partnerships: PartnershipRecord[] = []
  
  // Example distribution partnership
  partnerships.push({
    id: `partnership-${Date.now()}-1`,
    companyName: 'Complementary SaaS Company',
    partnershipType: 'distribution',
    mutualBenefit: 'They get additional value for their customers, we get distribution to their user base',
    proposedStructure: 'Revenue share: 20% to partner on referred customers',
    proposalDraft: generateProposal('distribution', state),
    status: 'identified',
    addedAt: new Date().toISOString()
  })
  
  // Example integration partnership
  partnerships.push({
    id: `partnership-${Date.now()}-2`,
    companyName: 'Popular Tool in Our Space',
    partnershipType: 'integration',
    mutualBenefit: 'Seamless integration makes both products more valuable',
    proposedStructure: 'Co-developed integration with joint marketing',
    proposalDraft: generateProposal('integration', state),
    status: 'identified',
    addedAt: new Date().toISOString()
  })
  
  return partnerships
}

function generateProposal(type: string, state: any): string {
  if (type === 'distribution') {
    return `Hi [Name],

I think there's a great partnership opportunity between ${state.profile.companyName} and [Partner Company].

We solve ${state.profile.problem} for ${state.profile.targetCustomer} — exactly the customers you serve.

**Proposed Structure:**
- We integrate with your platform
- You recommend us to customers who need [specific use case]
- 20% revenue share on referred customers

This adds value for your customers while creating a new revenue stream for you.

Would you be open to exploring this?

Best,
${state.profile.founders[0]}`
  }
  
  return `Hi [Name],

We're building ${state.profile.companyName} and would love to explore an integration partnership with [Partner Company].

**The Integration:**
[Specific integration details]

**Mutual Benefit:**
- Your customers get [specific value]
- Our customers get [specific value]
- Co-marketing to both user bases

Open to discussing?

Best,
${state.profile.founders[0]}`
}
```
