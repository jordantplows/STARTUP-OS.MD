---
name: pricing-engine
role: steering
department: cpo
reads:
  - company.os.product.metrics
  - company.os.research.competitorMoves
  - company.os.research.customerSignals
  - company.os.cfo.model
writes:
  - company.os.product.pricing
emits:
  - pricing-recommendation
  - pricing-experiment-needed
---

# Pricing Engine Agent

## Purpose

Continuously evaluates pricing strategy against signals in company.os — conversion rates, churn reasons, competitor pricing, customer feedback. Runs pricing experiments. Recommends changes with supporting evidence. Coordinates with cfo/ before any pricing change.

## Instructions

1. **Monitor pricing signals**:
   - Conversion rates at current pricing
   - Churn analysis (is price the reason?)
   - Competitor pricing changes
   - Customer feedback about price
   - Willingness-to-pay signals from interviews
2. **Analyze pricing health**:
   - Are we leaving money on the table?
   - Are we pricing ourselves out?
   - Is packaging optimal?
   - Are we capturing value appropriately?
3. **Recommend experiments**:
   - Price increase/decrease tests
   - Packaging changes
   - Value metric changes
   - Tier restructuring
4. **Coordinate with cfo/**:
   - Impact on unit economics
   - Revenue projections
   - Approval before changes
5. **Track experiment results** and iterate

## Coordination

- Reads metrics from cpo/metrics agent
- Reads competitor moves from research/competitor-watch
- Reads WTP signals from research/interview-agent
- Writes pricing strategy to company.os.product.pricing
- Coordinates with cfo/ before changes
- Emits `pricing-recommendation` events

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface PricingStrategy {
  currentPricing: PricingTier[]
  recommendations: PricingRecommendation[]
  experiments: PricingExperiment[]
  competitorComparison: CompetitorPricing[]
  lastAnalyzedAt: string
}

interface PricingTier {
  name: string
  price: number
  features: string[]
  targetSegment: string
}

interface PricingRecommendation {
  id: string
  type: 'increase' | 'decrease' | 'restructure' | 'add-tier' | 'remove-tier'
  currentState: string
  proposedState: string
  rationale: string
  evidence: string[]
  expectedImpact: string
  confidence: 'low' | 'medium' | 'high'
  createdAt: string
}

interface PricingExperiment {
  id: string
  hypothesis: string
  control: string
  variant: string
  status: 'proposed' | 'running' | 'completed'
  results?: {
    conversionControl: number
    conversionVariant: number
    winner: string
  }
}

interface CompetitorPricing {
  competitor: string
  pricing: string
  comparison: 'higher' | 'lower' | 'similar'
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[pricing-engine] Analyzing pricing strategy...')
  
  const state = os.getState()
  const memory = readAgentMemory('pricing-engine')
  
  // Analyze current pricing health
  const analysis = analyzePricingHealth(state)
  
  // Generate recommendations
  const recommendations = generateRecommendations(analysis, state)
  
  // Compare to competitors
  const competitorComparison = compareToCompetitors(state)
  
  // Build pricing strategy
  const strategy: PricingStrategy = {
    currentPricing: getCurrentPricing(state),
    recommendations,
    experiments: [],
    competitorComparison,
    lastAnalyzedAt: new Date().toISOString()
  }
  
  // Write to company.os
  if (!(state as any).product) {
    (state as any).product = { feedback: [], roadmap: [], experiments: [], changelog: [], pricing: null }
  }
  
  (state as any).product.pricing = strategy
  os.save()
  
  // Emit high-confidence recommendations
  recommendations
    .filter(r => r.confidence === 'high')
    .forEach(rec => {
      os.emitEvent({
        type: 'pricing-recommendation',
        from: 'pricing-engine',
        payload: {
          recommendationId: rec.id,
          type: rec.type,
          rationale: rec.rationale
        }
      })
    })
  
  writeAgentMemory('pricing-engine', {
    lastRun: new Date().toISOString(),
    recommendationCount: recommendations.length
  })
  
  console.log(`[pricing-engine] Generated ${recommendations.length} pricing recommendations`)
}

function analyzePricingHealth(state: any): any {
  // Analyze conversion, churn, competitor pricing, WTP signals
  return {
    conversionRate: 0.05, // 5% placeholder
    churnRate: 0.03, // 3% placeholder
    competitorPriceAvg: 99,
    wtpSignals: extractWTPSignals(state)
  }
}

function extractWTPSignals(state: any): string[] {
  const signals: string[] = []
  
  const interviews = (state as any).research?.interviews || []
  interviews.forEach((interview: any) => {
    if (interview.insights?.willingnessToPay) {
      signals.push(interview.insights.willingnessToPay)
    }
  })
  
  return signals
}

function generateRecommendations(analysis: any, state: any): PricingRecommendation[] {
  const recommendations: PricingRecommendation[] = []
  
  // Example recommendation: Price increase
  if (analysis.conversionRate > 0.08) { // High conversion suggests room to increase
    recommendations.push({
      id: `rec-${Date.now()}-1`,
      type: 'increase',
      currentState: '$49/month',
      proposedState: '$79/month',
      rationale: 'High conversion rate (8%+) suggests we may be underpriced relative to value delivered',
      evidence: [
        'Conversion rate: 8%',
        'Competitor average: $99/month',
        'WTP signals from interviews indicate higher value perception'
      ],
      expectedImpact: '+60% revenue per customer, -10% conversion → +44% net revenue',
      confidence: 'high',
      createdAt: new Date().toISOString()
    })
  }
  
  // Example recommendation: Add enterprise tier
  if (state.profile.stage === 'revenue') {
    recommendations.push({
      id: `rec-${Date.now()}-2`,
      type: 'add-tier',
      currentState: 'Startup, Pro tiers',
      proposedState: 'Startup, Pro, Enterprise tiers',
      rationale: 'Customer signals indicate demand for enterprise features (SSO, audit logs, dedicated support)',
      evidence: [
        'Multiple enterprise prospects asking about SSO',
        'Current top-tier customers hitting usage limits'
      ],
      expectedImpact: 'Capture 3-5 enterprise deals at $1,000/month = $36K-60K ARR',
      confidence: 'medium',
      createdAt: new Date().toISOString()
    })
  }
  
  return recommendations
}

function compareToCompetitors(state: any): CompetitorPricing[] {
  const competitorMoves = (state as any).research?.competitorMoves || []
  
  const pricingMoves = competitorMoves.filter((move: any) => move.moveType === 'pricing')
  
  return [
    { competitor: 'Competitor A', pricing: '$99/month', comparison: 'higher' },
    { competitor: 'Competitor B', pricing: '$49/month', comparison: 'similar' },
    { competitor: 'Competitor C', pricing: '$199/month', comparison: 'higher' }
  ]
}

function getCurrentPricing(state: any): PricingTier[] {
  // Would read from actual pricing config
  return [
    {
      name: 'Startup',
      price: 49,
      features: ['Core features', 'Email support', '10 users'],
      targetSegment: 'Small teams'
    },
    {
      name: 'Pro',
      price: 99,
      features: ['All Startup features', 'Priority support', 'Unlimited users', 'Advanced features'],
      targetSegment: 'Growing companies'
    }
  ]
}
```
