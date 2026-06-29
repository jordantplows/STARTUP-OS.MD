---
name: ab-testing
role: steering
department: product/exec
reads:
  - company.os.product.experiments
writes:
  - company.os.product.experiments
emits:
  - experiment-designed
  - experiment-completed
  - experiment-winner-declared
---

# A/B Testing Agent

## Purpose

Designs, tracks, and reads A/B experiments. When a hypothesis exists in company.os, this agent designs the test, defines success metrics, monitors results, and writes conclusions back to company.os with a clear recommendation.

## Instructions

1. **Watch for experiment hypotheses** in company.os
2. **Design experiments**:
   - Define control and variant clearly
   - Choose success metric (conversion, retention, revenue, etc.)
   - Determine sample size needed
   - Set statistical significance threshold (typically 95%)
3. **Monitor running experiments**:
   - Track metrics for control and variant
   - Calculate statistical significance
   - Detect when experiment has reached conclusion
4. **Declare winner** when:
   - Statistical significance reached
   - Minimum sample size achieved
   - OR: No significant difference after max runtime
5. **Write conclusions** with:
   - Winner (control, variant, or no difference)
   - Magnitude of impact
   - Recommendation (ship variant, keep control, iterate)
   - Insights learned

## Coordination

- Reads experiment proposals from product/ agents
- Writes experiment design and results to company.os.product.experiments
- Emits `experiment-completed` when results available
- Coordinates with metrics/exec for data collection

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface Experiment {
  id: string
  hypothesis: string
  control: ExperimentVariant
  variant: ExperimentVariant
  successMetric: string
  targetSampleSize: number
  significance: number
  status: 'designed' | 'running' | 'completed' | 'cancelled'
  startedAt?: string
  completedAt?: string
  results?: ExperimentResults
}

interface ExperimentVariant {
  name: string
  description: string
  implementation: string
}

interface ExperimentResults {
  control: VariantResults
  variant: VariantResults
  statisticalSignificance: number
  winner: 'control' | 'variant' | 'no-difference'
  recommendation: string
  insights: string[]
}

interface VariantResults {
  sampleSize: number
  conversionRate?: number
  averageValue?: number
  metric: number
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[ab-testing] Processing A/B experiments...')
  
  const state = os.getState()
  const memory = readAgentMemory('ab-testing')
  
  // Initialize product.experiments if needed
  if (!(state as any).product) {
    (state as any).product = { feedback: [], roadmap: [], experiments: [], changelog: [], pricing: null }
  }
  
  const experiments = (state as any).product.experiments || []
  
  // Check for running experiments
  const runningExperiments = experiments.filter((e: Experiment) => e.status === 'running')
  
  if (runningExperiments.length === 0) {
    console.log('[ab-testing] No running experiments')
    return
  }
  
  // Analyze each running experiment
  runningExperiments.forEach((experiment: Experiment) => {
    analyzeExperiment(experiment, os)
  })
  
  os.save()
  
  writeAgentMemory('ab-testing', {
    lastRun: new Date().toISOString(),
    activeExperiments: runningExperiments.length
  })
}

function analyzeExperiment(experiment: Experiment, os: CompanyOSManager): void {
  // Simulate collecting experiment data
  // In production, would read from analytics system
  
  const controlData = collectVariantData(experiment.control.name)
  const variantData = collectVariantData(experiment.variant.name)
  
  // Check if we have enough sample size
  if (controlData.sampleSize < experiment.targetSampleSize / 2 ||
      variantData.sampleSize < experiment.targetSampleSize / 2) {
    console.log(`[ab-testing] Experiment ${experiment.id} still collecting data...`)
    return
  }
  
  // Calculate statistical significance
  const significance = calculateSignificance(controlData, variantData)
  
  // Determine winner
  const results: ExperimentResults = {
    control: controlData,
    variant: variantData,
    statisticalSignificance: significance,
    winner: determineWinner(controlData, variantData, significance),
    recommendation: '',
    insights: []
  }
  
  // Generate recommendation
  results.recommendation = generateRecommendation(results, experiment)
  results.insights = extractInsights(results, experiment)
  
  // Update experiment
  experiment.results = results
  experiment.status = 'completed'
  experiment.completedAt = new Date().toISOString()
  
  // Emit event
  os.emitEvent({
    type: 'experiment-completed',
    from: 'ab-testing',
    payload: {
      experimentId: experiment.id,
      winner: results.winner,
      recommendation: results.recommendation
    }
  })
  
  console.log(`[ab-testing] Experiment ${experiment.id} completed: ${results.winner} wins`)
}

function collectVariantData(variantName: string): VariantResults {
  // Simulate data collection
  // In production, would query analytics system
  
  return {
    sampleSize: 1000,
    conversionRate: Math.random() * 0.1 + 0.05, // 5-15%
    metric: Math.random() * 100
  }
}

function calculateSignificance(control: VariantResults, variant: VariantResults): number {
  // Simplified significance calculation
  // In production, would use proper statistical test (z-test, t-test, etc.)
  
  const controlRate = control.conversionRate || 0
  const variantRate = variant.conversionRate || 0
  
  const diff = Math.abs(controlRate - variantRate)
  const avg = (controlRate + variantRate) / 2
  
  // Fake p-value based on difference magnitude
  if (diff / avg > 0.2) return 0.99 // 99% significant
  if (diff / avg > 0.1) return 0.95 // 95% significant
  return 0.70 // Not significant
}

function determineWinner(
  control: VariantResults,
  variant: VariantResults,
  significance: number
): 'control' | 'variant' | 'no-difference' {
  if (significance < 0.95) {
    return 'no-difference'
  }
  
  const controlRate = control.conversionRate || control.metric
  const variantRate = variant.conversionRate || variant.metric
  
  return variantRate > controlRate ? 'variant' : 'control'
}

function generateRecommendation(results: ExperimentResults, experiment: Experiment): string {
  if (results.winner === 'no-difference') {
    return `No statistically significant difference found. Keep current implementation (control) or run a longer test.`
  }
  
  if (results.winner === 'variant') {
    const improvement = calculateImprovement(results.control, results.variant)
    return `Ship variant. Expected ${improvement}% improvement in ${experiment.successMetric}.`
  }
  
  return `Keep control. Variant performed worse. Consider new hypothesis.`
}

function calculateImprovement(control: VariantResults, variant: VariantResults): number {
  const controlRate = control.conversionRate || control.metric
  const variantRate = variant.conversionRate || variant.metric
  
  return Math.round(((variantRate - controlRate) / controlRate) * 100)
}

function extractInsights(results: ExperimentResults, experiment: Experiment): string[] {
  const insights: string[] = []
  
  if (results.winner === 'variant') {
    insights.push(`Variant performed better: hypothesis validated`)
    insights.push(`Consider applying similar pattern to related features`)
  } else if (results.winner === 'control') {
    insights.push(`Control performed better: hypothesis invalidated`)
    insights.push(`Original implementation was already optimized`)
  } else {
    insights.push(`No significant difference: may need larger sample or different approach`)
  }
  
  return insights
}
```
