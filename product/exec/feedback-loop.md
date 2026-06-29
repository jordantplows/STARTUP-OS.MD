---
name: feedback-loop
role: watching
department: cpo
reads:
  - company.os.research.interviews
  - company.os.research.customerSignals
  - company.os.outreach.replies
writes:
  - company.os.product.feedback
emits:
  - feedback-pattern-detected
  - feature-request-clustered
---

# Feedback Loop Agent

## Purpose

Watches for customer feedback signals from any connected source. Structures each piece of feedback into company.os. Automatically surfaces patterns to the product/ roadmap agent. Tags feedback by theme, frequency, and customer segment. Closes the loop between users and backlog without founder mediation.

## Instructions

1. **Monitor feedback sources**:
   - Customer interview insights from research/interview-agent.md
   - Customer signals from research/customer-intel.md
   - Email replies from outreach/
   - Support tickets (if integrated)
   - Feature requests (if integrated)
2. **Structure each feedback item**:
   - Raw feedback text
   - Customer segment
   - Theme/category
   - Pain intensity
   - Frequency (how often is this mentioned?)
3. **Detect patterns automatically**:
   - Multiple customers mentioning same theme
   - High-pain feedback clusters
   - Segment-specific patterns
4. **Surface to roadmap agent**:
   - Emit event when pattern crosses threshold
   - Write structured summary to company.os

## Coordination

- Reads interviews from research/interview-agent.md
- Reads signals from research/customer-intel.md
- Writes feedback to company.os.product.feedback
- Emits `feedback-pattern-detected` when threshold met
- Feeds product/exec/roadmap-oversight agent for prioritization

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface FeedbackItem {
  id: string
  source: string
  customerSegment: string
  rawFeedback: string
  theme: string
  painIntensity: 'low' | 'medium' | 'high'
  timestamp: string
}

interface FeedbackPattern {
  theme: string
  count: number
  avgPainIntensity: number
  segments: string[]
  examples: string[]
  detectedAt: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[feedback-loop] Processing customer feedback...')
  
  const state = os.getState()
  const memory = readAgentMemory('feedback-loop')
  
  // Collect feedback from all sources
  const feedbackItems = collectFeedback(state)
  
  // Store in company.os
  if (!(state as any).product) {
    (state as any).product = { feedback: [], roadmap: [], experiments: [], changelog: [] }
  }
  
  const existingFeedback = (state as any).product.feedback || []
  ;(state as any).product.feedback = [...existingFeedback, ...feedbackItems]
  
  // Detect patterns
  const patterns = detectPatterns([...existingFeedback, ...feedbackItems])
  
  // Emit pattern events
  patterns.forEach(pattern => {
    if (pattern.count >= 3) { // threshold: 3+ mentions
      os.emitEvent({
        type: 'feedback-pattern-detected',
        from: 'feedback-loop',
        payload: {
          theme: pattern.theme,
          count: pattern.count,
          avgPainIntensity: pattern.avgPainIntensity
        }
      })
    }
  })
  
  os.save()
  
  writeAgentMemory('feedback-loop', {
    lastRun: new Date().toISOString(),
    feedbackProcessed: feedbackItems.length,
    patternsDetected: patterns.filter(p => p.count >= 3).length
  })
  
  console.log(`[feedback-loop] Processed ${feedbackItems.length} feedback items`)
  console.log(`[feedback-loop] Detected ${patterns.filter(p => p.count >= 3).length} patterns`)
}

function collectFeedback(state: any): FeedbackItem[] {
  const items: FeedbackItem[] = []
  
  // From customer interviews
  const interviews = (state as any).research?.interviews || []
  interviews.forEach((interview: any) => {
    interview.insights?.jobsToBeDone?.forEach((job: string) => {
      items.push({
        id: `feedback-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        source: 'customer-interview',
        customerSegment: interview.interviewee?.segment || 'unknown',
        rawFeedback: job,
        theme: categorizeTheme(job),
        painIntensity: mapPainIntensity(interview.insights?.painIntensity || 5),
        timestamp: interview.synthesizedAt || new Date().toISOString()
      })
    })
  })
  
  // From customer signals
  const signals = (state as any).research?.customerSignals || []
  signals.forEach((signal: any) => {
    items.push({
      id: `feedback-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      source: signal.source,
      customerSegment: 'identified-from-signal',
      rawFeedback: signal.content,
      theme: signal.painPoint,
      painIntensity: signal.painIntensity,
      timestamp: signal.detectedAt
    })
  })
  
  return items
}

function categorizeTheme(feedback: string): string {
  // Simple keyword-based categorization
  const lower = feedback.toLowerCase()
  
  if (lower.includes('integrat')) return 'Integration'
  if (lower.includes('report') || lower.includes('dashboard')) return 'Reporting'
  if (lower.includes('speed') || lower.includes('slow') || lower.includes('performance')) return 'Performance'
  if (lower.includes('ui') || lower.includes('interface') || lower.includes('design')) return 'UI/UX'
  if (lower.includes('mobil')) return 'Mobile'
  if (lower.includes('api')) return 'API'
  if (lower.includes('security') || lower.includes('permission')) return 'Security'
  if (lower.includes('export') || lower.includes('import')) return 'Data Export/Import'
  
  return 'Other'
}

function mapPainIntensity(score: number): 'low' | 'medium' | 'high' {
  if (score >= 7) return 'high'
  if (score >= 4) return 'medium'
  return 'low'
}

function detectPatterns(allFeedback: FeedbackItem[]): FeedbackPattern[] {
  // Group by theme
  const byTheme: Record<string, FeedbackItem[]> = {}
  
  allFeedback.forEach(item => {
    if (!byTheme[item.theme]) {
      byTheme[item.theme] = []
    }
    byTheme[item.theme].push(item)
  })
  
  // Build patterns
  const patterns: FeedbackPattern[] = []
  
  Object.entries(byTheme).forEach(([theme, items]) => {
    const painScores = items.map(i => {
      if (i.painIntensity === 'high') return 9
      if (i.painIntensity === 'medium') return 5
      return 2
    })
    
    const avgPain = painScores.reduce((a, b) => a + b, 0) / painScores.length
    
    patterns.push({
      theme,
      count: items.length,
      avgPainIntensity: avgPain,
      segments: [...new Set(items.map(i => i.customerSegment))],
      examples: items.slice(0, 3).map(i => i.rawFeedback),
      detectedAt: new Date().toISOString()
    })
  })
  
  // Sort by count descending
  patterns.sort((a, b) => b.count - a.count)
  
  return patterns
}
```
