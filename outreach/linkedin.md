---
name: linkedin
role: steering
department: outreach
reads:
  - company.os.profile.targetCustomer
  - company.os.profile.problem
  - company.os.research.customerSignals
writes:
  - company.os.outreach.linkedin
emits:
  - linkedin-connection-sent
  - linkedin-reply-received
---

# LinkedIn Outreach Agent

## Purpose

Builds LinkedIn outreach strategy from ICP. Writes connection requests, DM sequences, and content angles that attract target customers. Tracks connection acceptance rates back to company.os.

## Instructions

1. **Identify target personas** from company.os.profile.targetCustomer
2. **Draft connection request templates**:
   - Personalized note (150 chars max)
   - Reference to mutual connection or shared interest
   - No pitch in connection request
3. **Draft DM sequences** for accepted connections:
   - Day 1: Thank you + value offer (article, resource)
   - Day 7: Follow-up with relevant insight
   - Day 14: Ask for call if engagement positive
4. **Content strategy**:
   - Identify topics target customers care about
   - Draft post ideas that surface problems we solve
   - Track engagement signals
5. **Track metrics**:
   - Connection request acceptance rate
   - DM reply rate
   - Profile views from target segment
   - Content engagement from ICP

## Coordination

- Reads ICP from company.os.profile.targetCustomer
- Writes LinkedIn strategy to company.os.outreach.linkedin
- Coordinates with community/ for content distribution
- Surfaces high-engagement leads to sales/

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface LinkedInStrategy {
  targetPersonas: string[]
  connectionTemplates: ConnectionTemplate[]
  dmSequences: DMSequence[]
  contentAngles: ContentAngle[]
  metrics: LinkedInMetrics
}

interface ConnectionTemplate {
  persona: string
  noteTemplate: string
  trigger: string // when to use this template
}

interface DMSequence {
  day: number
  message: string
  cta: string
}

interface ContentAngle {
  topic: string
  hook: string
  targetPain: string
  posts: string[]
}

interface LinkedInMetrics {
  connectionsSent: number
  connectionsAccepted: number
  dmsSent: number
  dmsReplied: number
  profileViews: number
  callsBooked: number
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[linkedin] Building LinkedIn outreach strategy...')
  
  const state = os.getState()
  const memory = readAgentMemory('linkedin')
  
  const icp = state.profile.targetCustomer
  const problem = state.profile.problem
  
  if (icp === '[PENDING]') {
    console.log('[linkedin] ICP not defined yet. Waiting...')
    return
  }
  
  // Build LinkedIn strategy
  const strategy: LinkedInStrategy = {
    targetPersonas: extractPersonas(icp),
    connectionTemplates: generateConnectionTemplates(state),
    dmSequences: generateDMSequence(state),
    contentAngles: generateContentAngles(state),
    metrics: {
      connectionsSent: 0,
      connectionsAccepted: 0,
      dmsSent: 0,
      dmsReplied: 0,
      profileViews: 0,
      callsBooked: 0
    }
  }
  
  // Write to company.os
  if (!(state as any).outreach) {
    (state as any).outreach = { sequences: [], replies: [], pipeline: [], linkedin: null }
  }
  
  (state as any).outreach.linkedin = strategy
  os.save()
  
  // Emit event
  os.emitEvent({
    type: 'linkedin-strategy-ready',
    from: 'linkedin',
    payload: { personaCount: strategy.targetPersonas.length }
  })
  
  writeAgentMemory('linkedin', {
    lastRun: new Date().toISOString(),
    targetPersonas: strategy.targetPersonas
  })
  
  console.log(`[linkedin] Strategy ready for ${strategy.targetPersonas.length} personas`)
}

function extractPersonas(icp: string): string[] {
  // Extract job titles/roles from ICP description
  const commonTitles = [
    'VP Engineering', 'Engineering Manager', 'CTO',
    'VP Product', 'Product Manager', 'CPO',
    'VP Marketing', 'Marketing Director', 'CMO',
    'Founder', 'CEO', 'COO'
  ]
  
  return commonTitles.filter(title => 
    icp.toLowerCase().includes(title.toLowerCase())
  )
}

function generateConnectionTemplates(state: any): ConnectionTemplate[] {
  const icp = state.profile.targetCustomer
  
  return [
    {
      persona: icp,
      noteTemplate: `Hi {{firstName}}, noticed your work in ${state.profile.industry}. Would love to connect and share insights on ${extractTopic(state.profile.problem)}.`,
      trigger: 'Profile shows relevant industry experience'
    },
    {
      persona: icp,
      noteTemplate: `{{firstName}}, saw your post about ${extractTopic(state.profile.problem)}. Working on this exact problem at ${state.profile.companyName}. Let's connect?`,
      trigger: 'Posted about relevant topic recently'
    },
    {
      persona: icp,
      noteTemplate: `Hi {{firstName}}, both working in ${state.profile.industry}. Would be great to exchange notes on ${extractTopic(state.profile.problem)}.`,
      trigger: 'Same industry, no recent activity'
    }
  ]
}

function generateDMSequence(state: any): DMSequence[] {
  return [
    {
      day: 1,
      message: `Thanks for connecting! I help ${state.profile.targetCustomer} solve ${state.profile.problem}. Here's a resource I think you'll find useful: [link to valuable content]`,
      cta: 'Check out the resource'
    },
    {
      day: 7,
      message: `Hope that resource was helpful. I'm curious — how does your team currently handle ${extractTopic(state.profile.problem)}?`,
      cta: 'Start conversation'
    },
    {
      day: 14,
      message: `Would love to show you how ${state.profile.companyName} helps teams like yours. 15 minutes this week to share what we're seeing work?`,
      cta: 'Book a call'
    }
  ]
}

function generateContentAngles(state: any): ContentAngle[] {
  return [
    {
      topic: state.profile.problem,
      hook: `Most ${state.profile.targetCustomer} get this wrong about ${extractTopic(state.profile.problem)}`,
      targetPain: state.profile.problem,
      posts: [
        `3 mistakes ${state.profile.targetCustomer} make with ${extractTopic(state.profile.problem)}`,
        `Why ${extractTopic(state.profile.problem)} matters more than you think`,
        `The hidden cost of ignoring ${extractTopic(state.profile.problem)}`
      ]
    }
  ]
}

function extractTopic(problem: string): string {
  return problem.split(' ').slice(0, 3).join(' ')
}
```
