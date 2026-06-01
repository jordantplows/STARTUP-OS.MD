---
name: interview-agent
role: steering
department: research
reads:
  - workspace/research/interview-notes.txt
writes:
  - company.os.research.interviews
emits:
  - interview-synthesized
---

# Interview Agent

## Purpose

Customer interview synthesis agent. Founder pastes raw interview notes or transcripts. Agent extracts: jobs to be done, pain intensity, current alternatives, willingness to pay signals, exact language used. Writes structured insights to company.os. Feeds product/ and marketing/ agents with real customer voice.

## Instructions

1. **Watch for interview notes** in workspace/research/interview-notes.txt
2. **Extract structured insights**:
   - **Jobs to be done** — what is the customer trying to accomplish?
   - **Pain intensity** — how painful is the current situation? (1-10)
   - **Current alternatives** — what are they using now?
   - **Switching costs** — what makes it hard to change?
   - **Willingness to pay** — what value signals indicate pricing power?
   - **Exact language** — memorable quotes in customer's words
   - **Objections** — what concerns did they raise?
3. **Synthesize across interviews**:
   - Common themes
   - Segment differences
   - Feature priorities
4. **Write to company.os** with structured synthesis
5. **Feed product/ and marketing/** with insights

## Coordination

- Reads raw notes from workspace/research/interview-notes.txt
- Writes synthesis to company.os.research.interviews
- Feeds product/ with feature priorities
- Feeds marketing/ with customer language
- Emits `interview-synthesized` event

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

interface InterviewSynthesis {
  id: string
  interviewedAt: string
  interviewee: {
    role: string
    company: string
    segment: string
  }
  insights: {
    jobsToBeDone: string[]
    painIntensity: number
    currentAlternatives: string[]
    switchingCosts: string[]
    willingnessToPay: string
    exactLanguage: string[]
    objections: string[]
  }
  synthesizedAt: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[interview-agent] Checking for interview notes...')
  
  const notesPath = join(process.cwd(), 'workspace', 'research', 'interview-notes.txt')
  
  if (!existsSync(notesPath)) {
    console.log('[interview-agent] No interview notes found. Waiting...')
    return
  }
  
  const rawNotes = readFileSync(notesPath, 'utf-8')
  
  console.log('[interview-agent] Interview notes found. Synthesizing...')
  
  // Synthesize insights
  const synthesis = synthesizeInterview(rawNotes)
  
  // Write to company.os
  if (!(state as any).research) {
    (state as any).research = {
      customerSignals: [],
      competitorMoves: [],
      trends: [],
      interviews: []
    }
  }
  
  const state = os.getState()
  const existingInterviews = (state as any).research.interviews || []
  ;(state as any).research.interviews = [...existingInterviews, synthesis]
  os.save()
  
  os.emitEvent({
    type: 'interview-synthesized',
    from: 'interview-agent',
    payload: {
      interviewId: synthesis.id,
      painIntensity: synthesis.insights.painIntensity
    }
  })
  
  writeAgentMemory('interview-agent', {
    lastRun: new Date().toISOString(),
    interviewCount: existingInterviews.length + 1
  })
  
  console.log('[interview-agent] Interview synthesized')
  console.log(`  Pain intensity: ${synthesis.insights.painIntensity}/10`)
  console.log(`  Jobs to be done: ${synthesis.insights.jobsToBeDone.join(', ')}`)
}

function synthesizeInterview(rawNotes: string): InterviewSynthesis {
  // In production, would use NLP to extract insights
  // For now, use simple heuristics
  
  const synthesis: InterviewSynthesis = {
    id: `interview-${Date.now()}`,
    interviewedAt: new Date().toISOString(),
    interviewee: {
      role: extractRole(rawNotes),
      company: extractCompany(rawNotes),
      segment: 'mid-market' // would infer from context
    },
    insights: {
      jobsToBeDone: extractJobsToBeDone(rawNotes),
      painIntensity: extractPainIntensity(rawNotes),
      currentAlternatives: extractAlternatives(rawNotes),
      switchingCosts: extractSwitchingCosts(rawNotes),
      willingnessToPay: extractWTP(rawNotes),
      exactLanguage: extractQuotes(rawNotes),
      objections: extractObjections(rawNotes)
    },
    synthesizedAt: new Date().toISOString()
  }
  
  return synthesis
}

function extractRole(notes: string): string {
  // Simple heuristic
  const roleMatches = notes.match(/(VP|Director|Manager|Engineer|Developer|CEO|CTO) of ([A-Za-z\s]+)/i)
  return roleMatches ? roleMatches[0] : 'Unknown role'
}

function extractCompany(notes: string): string {
  const companyMatch = notes.match(/at ([A-Z][a-zA-Z0-9\s]+)/i)
  return companyMatch ? companyMatch[1] : 'Unknown company'
}

function extractJobsToBeDone(notes: string): string[] {
  // Look for "trying to", "need to", "want to" patterns
  const jobs: string[] = []
  
  const patterns = [
    /trying to ([^.!?]+)/gi,
    /need to ([^.!?]+)/gi,
    /want to ([^.!?]+)/gi
  ]
  
  patterns.forEach(pattern => {
    const matches = notes.matchAll(pattern)
    for (const match of matches) {
      jobs.push(match[1].trim())
    }
  })
  
  return jobs.slice(0, 5) // top 5
}

function extractPainIntensity(notes: string): number {
  // Look for pain indicators
  const highPainWords = ['nightmare', 'terrible', 'broken', 'constantly failing', 'huge problem']
  const mediumPainWords = ['frustrating', 'annoying', 'time-consuming', 'inefficient']
  
  const notesLower = notes.toLowerCase()
  
  const highPainCount = highPainWords.filter(word => notesLower.includes(word)).length
  const mediumPainCount = mediumPainWords.filter(word => notesLower.includes(word)).length
  
  if (highPainCount >= 2) return 9
  if (highPainCount >= 1) return 7
  if (mediumPainCount >= 2) return 5
  return 3
}

function extractAlternatives(notes: string): string[] {
  // Look for "using", "currently", "right now" patterns
  const alternatives: string[] = []
  
  const matches = notes.matchAll(/(?:using|currently use|right now we use) ([A-Za-z0-9\s]+)/gi)
  for (const match of matches) {
    alternatives.push(match[1].trim())
  }
  
  return alternatives
}

function extractSwitchingCosts(notes: string): string[] {
  // Look for "hard to change", "difficult", "locked in" patterns
  return ['Integration with existing tools', 'Team training', 'Data migration'] // simplified
}

function extractWTP(notes: string): string {
  // Look for pricing signals
  if (notes.toLowerCase().includes('worth paying')) {
    return 'High willingness to pay'
  }
  if (notes.toLowerCase().includes('would consider')) {
    return 'Moderate willingness to pay'
  }
  return 'Need to validate pricing'
}

function extractQuotes(notes: string): string[] {
  // Extract anything in quotes
  const quotes: string[] = []
  const matches = notes.matchAll(/"([^"]+)"/g)
  for (const match of matches) {
    quotes.push(match[1])
  }
  return quotes
}

function extractObjections(notes: string): string[] {
  // Look for "concern", "worried", "but" patterns
  const objections: string[] = []
  
  const patterns = [
    /(?:concern|worried|hesitant) (?:about|that) ([^.!?]+)/gi,
    /but ([^.!?]+)/gi
  ]
  
  patterns.forEach(pattern => {
    const matches = notes.matchAll(pattern)
    for (const match of matches) {
      objections.push(match[1].trim())
    }
  })
  
  return objections.slice(0, 5)
}
```
