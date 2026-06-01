---
name: trend-scanner
role: watching
department: research
schedule: weekly Monday 8am
reads:
  - company.os.profile.industry
writes:
  - company.os.research.trends
emits:
  - trend-identified
---

# Trend Scanner Agent

## Purpose

Macro and industry trend monitoring. Watches for regulatory changes, technology shifts, market timing signals. Connects trends to company opportunity or risk. Updates the strategy/ agents when significant signals emerge.

## Instructions

1. **Monitor macro trends**:
   - Regulatory changes affecting the industry
   - Technology adoption curves
   - Economic indicators relevant to ICP
   - Demographic shifts
2. **Monitor industry trends**:
   - New entrants and exits
   - M&A activity
   - Industry standards emerging
   - Ecosystem platform shifts
3. **Analyze relevance**:
   - Is this trend a tailwind or headwind?
   - Does it open new opportunities?
   - Does it create risk?
   - What's the timeline?
4. **Write to company.os** with trend analysis
5. **Alert strategy/** on significant trends

## Coordination

- Reads industry from company.os.profile.industry
- Writes trends to company.os.research.trends
- Feeds strategy/ agents
- Emits `trend-identified` for significant trends

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface Trend {
  id: string
  category: 'regulatory' | 'technology' | 'economic' | 'industry' | 'ecosystem'
  description: string
  relevance: 'tailwind' | 'headwind' | 'neutral'
  impact: 'low' | 'medium' | 'high'
  timeline: 'immediate' | 'near-term' | 'long-term'
  source: string
  sourceUrl?: string
  detectedAt: string
  analysis: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[trend-scanner] Scanning market and industry trends...')
  
  const state = os.getState()
  const memory = readAgentMemory('trend-scanner')
  
  const industry = state.profile.industry
  
  // Scan for trends
  const trends = scanTrends(industry, state)
  
  // Write to company.os
  if (!(state as any).research) {
    (state as any).research = {
      customerSignals: [],
      competitorMoves: [],
      trends: [],
      interviews: []
    }
  }
  
  const existingTrends = (state as any).research.trends || []
  ;(state as any).research.trends = [...existingTrends, ...trends]
  os.save()
  
  // Alert on high-impact trends
  const highImpact = trends.filter(t => t.impact === 'high')
  highImpact.forEach(trend => {
    os.emitEvent({
      type: 'trend-identified',
      from: 'trend-scanner',
      payload: {
        category: trend.category,
        description: trend.description,
        relevance: trend.relevance,
        impact: trend.impact
      }
    })
  })
  
  writeAgentMemory('trend-scanner', {
    lastRun: new Date().toISOString(),
    trendsFound: trends.length,
    highImpact: highImpact.length
  })
  
  console.log(`[trend-scanner] Identified ${trends.length} trends (${highImpact.length} high-impact)`)
}

function scanTrends(industry: string, state: any): Trend[] {
  // In production, would:
  // - Monitor news APIs
  // - Track regulatory filings
  // - Scan industry reports
  // - Monitor tech adoption metrics
  
  const trends: Trend[] = []
  
  // Example trend 1: AI adoption
  trends.push({
    id: `trend-${Date.now()}-1`,
    category: 'technology',
    description: 'AI adoption accelerating in enterprise software',
    relevance: 'tailwind',
    impact: 'high',
    timeline: 'immediate',
    source: 'Gartner Report 2026',
    sourceUrl: 'https://gartner.com/example',
    detectedAt: new Date().toISOString(),
    analysis: 'Companies are prioritizing AI-powered tools. Opportunity to integrate AI features into product roadmap.'
  })
  
  // Example trend 2: Remote work
  trends.push({
    id: `trend-${Date.now()}-2`,
    category: 'industry',
    description: 'Remote-first companies growing 3x faster',
    relevance: 'tailwind',
    impact: 'medium',
    timeline: 'near-term',
    source: 'Remote Work Report',
    sourceUrl: 'https://example.com/remote-report',
    detectedAt: new Date().toISOString(),
    analysis: 'Remote-first companies are our ICP. This validates our market timing.'
  })
  
  // Example trend 3: Regulatory change
  trends.push({
    id: `trend-${Date.now()}-3`,
    category: 'regulatory',
    description: 'New data privacy regulations in EU',
    relevance: 'headwind',
    impact: 'medium',
    timeline: 'near-term',
    source: 'EU Policy Brief',
    sourceUrl: 'https://europa.eu/example',
    detectedAt: new Date().toISOString(),
    analysis: 'May require additional compliance features if expanding to EU market.'
  })
  
  return trends
}
```
