---
name: competitor-watch
role: watching
department: research
schedule: weekly Monday 7am
reads:
  - company.os.profile.industry
  - company.os.cmo.positioning
writes:
  - company.os.research.competitorMoves
emits:
  - competitor-move-detected
---

# Competitor Watch Agent

## Purpose

Tracks competitor moves continuously. Pricing changes, new features, hiring signals, funding news, customer complaints, press coverage. Writes a competitive intelligence brief to company.os weekly. Alerts immediately on major moves. Feeds into marketing/exec/ positioning agent.

## Instructions

1. **Identify competitors** from industry and positioning
2. **Monitor multiple sources**:
   - Competitor websites (changelog, pricing pages)
   - Press releases and news coverage
   - LinkedIn (hiring patterns, executive moves)
   - Crunchbase (funding rounds)
   - Social media (product announcements)
   - Review sites (customer sentiment shifts)
3. **Track key moves**:
   - Pricing changes
   - New features launched
   - Key hires (exec, eng, sales)
   - Funding announcements
   - Customer wins/losses
   - Market positioning shifts
4. **Write weekly brief** with competitive intelligence
5. **Alert immediately** on major moves

## Coordination

- Reads positioning from marketing/exec/ for competitive context
- Writes competitor moves to company.os.research.competitorMoves
- Feeds marketing/exec/ positioning updates
- Emits `competitor-move-detected` for major events

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface CompetitorMove {
  id: string
  competitor: string
  moveType: 'pricing' | 'feature' | 'hire' | 'funding' | 'customer' | 'positioning'
  description: string
  impact: 'low' | 'medium' | 'high'
  source: string
  sourceUrl?: string
  detectedAt: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[competitor-watch] Scanning competitor activity...')
  
  const state = os.getState()
  const memory = readAgentMemory('competitor-watch')
  
  // Identify competitors
  const competitors = identifyCompetitors(state)
  
  // Monitor for moves
  const moves = monitorCompetitors(competitors, state)
  
  // Write to company.os
  if (!(state as any).research) {
    (state as any).research = {
      customerSignals: [],
      competitorMoves: [],
      trends: [],
      interviews: []
    }
  }
  
  const existingMoves = (state as any).research.competitorMoves || []
  ;(state as any).research.competitorMoves = [...existingMoves, ...moves]
  os.save()
  
  // Alert on high-impact moves
  const highImpact = moves.filter(m => m.impact === 'high')
  highImpact.forEach(move => {
    os.emitEvent({
      type: 'competitor-move-detected',
      from: 'competitor-watch',
      payload: {
        competitor: move.competitor,
        moveType: move.moveType,
        description: move.description
      }
    })
  })
  
  writeAgentMemory('competitor-watch', {
    lastRun: new Date().toISOString(),
    movesDetected: moves.length,
    highImpact: highImpact.length,
    competitors: competitors.length
  })
  
  console.log(`[competitor-watch] Detected ${moves.length} competitor moves (${highImpact.length} high-impact)`)
}

function identifyCompetitors(state: any): string[] {
  // In production, would parse from positioning, industry research, etc.
  const industry = state.profile.industry.toLowerCase()
  
  const competitors: string[] = []
  
  // Example competitors based on common patterns
  if (industry.includes('saas') || industry.includes('software')) {
    competitors.push('Competitor A', 'Competitor B', 'Competitor C')
  }
  
  return competitors
}

function monitorCompetitors(competitors: string[], state: any): CompetitorMove[] {
  // In production, would:
  // - Crawl competitor websites
  // - Monitor Crunchbase API
  // - Check LinkedIn for hiring signals
  // - Scan news APIs
  
  const moves: CompetitorMove[] = []
  
  // Example move 1: Pricing change
  moves.push({
    id: `move-${Date.now()}-1`,
    competitor: 'Competitor A',
    moveType: 'pricing',
    description: 'Raised pricing by 20% across all tiers',
    impact: 'medium',
    source: 'Competitor website',
    sourceUrl: 'https://competitor-a.com/pricing',
    detectedAt: new Date().toISOString()
  })
  
  // Example move 2: Funding round
  moves.push({
    id: `move-${Date.now()}-2`,
    competitor: 'Competitor B',
    moveType: 'funding',
    description: 'Raised $50M Series B led by Sequoia',
    impact: 'high',
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com/example',
    detectedAt: new Date().toISOString()
  })
  
  // Example move 3: Feature launch
  moves.push({
    id: `move-${Date.now()}-3`,
    competitor: 'Competitor C',
    moveType: 'feature',
    description: 'Launched AI-powered analytics dashboard',
    impact: 'medium',
    source: 'Competitor blog',
    sourceUrl: 'https://competitor-c.com/blog/new-feature',
    detectedAt: new Date().toISOString()
  })
  
  return moves
}
```
