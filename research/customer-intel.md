---
name: customer-intel
role: watching
department: research
schedule: daily 6am
reads:
  - company.os.profile.targetCustomer
writes:
  - company.os.research.customerSignals
emits:
  - customer-signal-found
---

# Customer Intelligence Agent

## Purpose

Continuous watching agent. Monitors signals about the ICP — job postings that indicate pain, Reddit/Twitter complaints, review site patterns, hiring trends. Writes signal summaries to company.os daily. Feeds directly into product backlog prioritization and sales messaging.

## Instructions

1. **Monitor multiple signal sources**:
   - Job postings (companies hiring for roles that indicate our problem exists)
   - Social media (Reddit, Twitter/X) complaints about the problem
   - Review sites (G2, Capterra) for competitor products
   - LinkedIn posts from ICP members
   - Industry forums and communities
2. **Extract signals**:
   - What pain points are being expressed?
   - What language do customers use?
   - What alternatives are they trying?
   - What are they willing to pay for?
3. **Write to company.os** with:
   - Signal source and date
   - Direct quote or summary
   - Pain intensity (low/medium/high)
   - Relevance score to company's solution
4. **Run daily at 6am** via scheduler
5. **Alert on high-priority signals** immediately

## Coordination

- Reads ICP from company.os.profile.targetCustomer
- Writes signals to company.os.research.customerSignals
- Feeds product/ roadmap prioritization
- Feeds sales/ and marketing/ messaging
- Emits `customer-signal-found` for high-priority signals

---

## Implementation

```typescript
import { CompanyOSManager, Signal } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface CustomerSignal {
  id: string
  source: string
  sourceUrl?: string
  content: string
  painPoint: string
  language: string[]
  painIntensity: 'low' | 'medium' | 'high'
  relevanceScore: number
  detectedAt: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[customer-intel] Scanning for customer signals...')
  
  const state = os.getState()
  const memory = readAgentMemory('customer-intel')
  
  const icp = state.profile.targetCustomer
  const problem = state.profile.problem
  
  if (icp === '[PENDING]') {
    console.log('[customer-intel] ICP not defined. Waiting...')
    return
  }
  
  // Simulate signal detection (would use real APIs)
  const signals = detectSignals(icp, problem)
  
  // Write to company.os
  if (!(state as any).research) {
    (state as any).research = {
      customerSignals: [],
      competitorMoves: [],
      trends: [],
      interviews: []
    }
  }
  
  const existingSignals = (state as any).research.customerSignals || []
  ;(state as any).research.customerSignals = [...existingSignals, ...signals]
  os.save()
  
  // Emit events for high-priority signals
  const highPriority = signals.filter(s => s.painIntensity === 'high' && s.relevanceScore >= 8)
  highPriority.forEach(signal => {
    os.emitEvent({
      type: 'customer-signal-found',
      from: 'customer-intel',
      payload: { signalId: signal.id, painPoint: signal.painPoint, source: signal.source }
    })
  })
  
  writeAgentMemory('customer-intel', {
    lastRun: new Date().toISOString(),
    signalsFound: signals.length,
    highPriority: highPriority.length
  })
  
  console.log(`[customer-intel] Found ${signals.length} signals (${highPriority.length} high-priority)`)
}

function detectSignals(icp: string, problem: string): CustomerSignal[] {
  // In production, this would:
  // - Search Reddit API for keywords
  // - Monitor Twitter/X for complaints
  // - Scrape job boards for relevant postings
  // - Check review sites for competitor feedback
  
  const signals: CustomerSignal[] = []
  
  // Example signal 1: Reddit complaint
  signals.push({
    id: `signal-${Date.now()}-1`,
    source: 'Reddit r/devops',
    sourceUrl: 'https://reddit.com/r/devops/example',
    content: 'Why is deployment tracking still such a nightmare in 2026? We have no visibility.',
    painPoint: 'Deployment visibility',
    language: ['nightmare', 'no visibility', 'tracking'],
    painIntensity: 'high',
    relevanceScore: 9,
    detectedAt: new Date().toISOString()
  })
  
  // Example signal 2: Job posting
  signals.push({
    id: `signal-${Date.now()}-2`,
    source: 'LinkedIn Job Posting',
    sourceUrl: 'https://linkedin.com/jobs/example',
    content: 'Hiring DevOps engineer to improve deployment observability and reduce incidents.',
    painPoint: 'Deployment observability',
    language: ['observability', 'reduce incidents', 'deployment'],
    painIntensity: 'medium',
    relevanceScore: 8,
    detectedAt: new Date().toISOString()
  })
  
  // Example signal 3: Review site
  signals.push({
    id: `signal-${Date.now()}-3`,
    source: 'G2 Review',
    sourceUrl: 'https://g2.com/products/example/reviews',
    content: 'The product is okay but we still can\'t get clear answers on what deployed when.',
    painPoint: 'Deployment history unclear',
    language: ['can\'t get clear answers', 'what deployed when'],
    painIntensity: 'medium',
    relevanceScore: 7,
    detectedAt: new Date().toISOString()
  })
  
  return signals
}
```
