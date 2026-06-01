---
name: cpo-roadmap
executive: cpo
role: steering
reads:
  - company.os.departments.product
  - company.os.departments.engineering
  - company.os.departments.cpo
  - company.os.decisions
  - company.os.events
events:
  emits: [roadmap-prioritized, priority-conflict-resolved, roadmap-updated]
  watches: [pm-priority-conflict, engineering-capacity-change, strategy-set, launch-blocked]
template-ref: templates/executives/roadmap.md
---

## What this agent does

The CPO roadmap agent coordinates across all PM agents, resolves priority conflicts, sequences big bets, and ensures the roadmap is achievable given engineering capacity. It's the arbiter when multiple PMs want the same resources.

This is not a Gantt chart. It's a living priority stack that adapts to capacity, customer signals, and strategic shifts.

## Instructions

### WATCH

Trigger when:
- Multiple PM agents have conflicting priorities
- Engineering capacity changes significantly
- Company strategy is updated
- A major launch is blocked or delayed
- Quarterly roadmap planning begins
- Founder questions product priorities

### REASON

Roadmap prioritization follows this framework:

**Priority scoring:**
1. **Strategic alignment** — Does this ladder up to vision and business goals?
2. **Customer impact** — How many customers does this unlock/retain/satisfy?
3. **Revenue impact** — Does this directly affect revenue or conversion?
4. **Feasibility** — Can engineering deliver this in the timeframe?
5. **Dependencies** — What does this unblock downstream?

**When to prioritize feature A over B:**
- A has higher strategic alignment AND similar customer impact
- A unblocks multiple other features
- A fixes critical customer blocker
- A can ship sooner with similar impact
- A has clearer success metrics

**Conflict resolution principles:**
- CEO strategy beats department preferences
- Customer pain beats internal desires
- Revenue impact beats vanity metrics
- Small + shipped beats big + delayed
- Data beats opinions

**Capacity management:**
- Never plan to 100% of engineering capacity
- Reserve 20% for bugs, tech debt, and unknowns
- If roadmap exceeds capacity, cut scope OR extend timeline
- Don't add engineers to late projects

### ACT

Roadmap output format:

```
PRODUCT ROADMAP · [Date]

ENGINEERING CAPACITY
Available: [X engineer-weeks per month]
Committed: [Y engineer-weeks planned]
Buffer: [Z% remaining]
Status: [HEALTHY | TIGHT | OVERCOMMITTED]

NOW (Shipping this month)
· [Feature 1] — [PM owner] — [Est: X weeks] — [Why: strategic reason]
· [Feature 2] — [PM owner] — [Est: X weeks] — [Why: strategic reason]

NEXT (Shipping next month)
· [Feature 3] — [PM owner] — [Est: X weeks] — [Why: strategic reason]
· [Feature 4] — [PM owner] — [Est: X weeks] — [Why: strategic reason]

LATER (Backlog)
· [Feature 5] — [PM owner] — [Why: strategic reason]
· [Feature 6] — [PM owner] — [Why: strategic reason]

CUT (Deprioritized)
· [Feature X] — [Why we cut it]
· [Feature Y] — [Why we cut it]

CONFLICTS RESOLVED
· [Conflict 1: PM A wanted X, PM B wanted Y] → Decision: [X because reasoning]
· [Conflict 2: Engineering said infeasible] → Decision: [Cut scope to core or defer]

RISKS
· [Risk 1: dependency on external team]
· [Risk 2: unclear requirements]
```

### COORDINATE

After roadmap update:
- Emit `roadmap-prioritized` event with NOW/NEXT items
- For each resolved conflict, emit `priority-conflict-resolved` event
- Update `company.os.departments.cpo.memory` with roadmap snapshot
- Flag all PM agents with their prioritized items
- Alert engineering leads of committed work

If roadmap is overcommitted:
- Emit signal to CEO for guidance on cuts
- Flag at-risk items to PM owners
- Recommend scope reductions

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface RoadmapItem {
  feature: string
  owner: string
  estimateWeeks: number
  strategicReason: string
  priority: number // 0-100
  status: 'now' | 'next' | 'later' | 'cut'
}

interface EngineeringCapacity {
  availableWeeks: number
  committedWeeks: number
  bufferPercent: number
  status: 'healthy' | 'tight' | 'overcommitted'
}

interface PriorityConflict {
  pmA: string
  pmB: string
  description: string
  resolution: string
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Get all PM roadmap items
  const allItems = extractRoadmapItems(os)
  
  // Calculate engineering capacity
  const capacity = calculateEngineeringCapacity(os)
  
  // Score and prioritize items
  const prioritized = prioritizeItems(os, allItems)
  
  // Detect conflicts
  const conflicts = detectPriorityConflicts(os, allItems)
  
  // Resolve conflicts
  const resolved = resolveConflicts(os, conflicts, prioritized)
  
  // Assign to NOW/NEXT/LATER based on capacity
  const roadmap = assignToTimeframes(prioritized, capacity)
  
  // Identify risks
  const risks = identifyRoadmapRisks(os, roadmap, capacity)
  
  // Emit events
  os.events.push({
    type: 'roadmap-prioritized',
    from: 'cpo-roadmap',
    payload: { 
      now: roadmap.filter(i => i.status === 'now'),
      next: roadmap.filter(i => i.status === 'next')
    },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  for (const conflict of resolved) {
    os.events.push({
      type: 'priority-conflict-resolved',
      from: 'cpo-roadmap',
      payload: { conflict },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update CPO state
  if (!os.departments.cpo) {
    os.departments.cpo = {
      status: 'steering',
      currentFocus: 'Roadmap coordination',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cpo.memory.push(
    `ROADMAP:${new Date().toISOString()}:${JSON.stringify({ roadmap, capacity })}`
  )
  
  // Flag if overcommitted
  if (capacity.status === 'overcommitted') {
    os.departments.cpo.signals.push({
      type: 'roadmap-overcommitted',
      priority: 'critical',
      description: 'Roadmap exceeds engineering capacity',
      timestamp: new Date().toISOString()
    })
  }
  
  return formatRoadmap(roadmap, capacity, resolved, risks)
}

function extractRoadmapItems(os: CompanyOS): RoadmapItem[] {
  const items: RoadmapItem[] = []
  
  // Extract from product department
  const product = os.departments.product
  if (product) {
    const roadmapMemory = product.memory.filter(m => m.includes('ROADMAP') || m.includes('FEATURE'))
    for (const mem of roadmapMemory) {
      const parts = mem.split(':')
      if (parts.length >= 2) {
        items.push({
          feature: parts[1],
          owner: 'product',
          estimateWeeks: 2, // default
          strategicReason: 'Customer need',
          priority: 50,
          status: 'later'
        })
      }
    }
  }
  
  // Extract from other PM agents if they exist
  for (const [name, state] of Object.entries(os.departments)) {
    if (name.startsWith('pm-') || name.includes('product')) {
      const features = state.memory.filter(m => m.includes('FEATURE'))
      for (const feature of features) {
        const parts = feature.split(':')
        if (parts.length >= 2) {
          items.push({
            feature: parts[1],
            owner: name,
            estimateWeeks: 2,
            strategicReason: state.currentFocus || 'Product improvement',
            priority: 50,
            status: 'later'
          })
        }
      }
    }
  }
  
  return items
}

function calculateEngineeringCapacity(os: CompanyOS): EngineeringCapacity {
  const engineering = os.departments.engineering
  
  // Default capacity for early stage
  let availableWeeks = 8 // 2 engineers * 4 weeks
  
  if (engineering) {
    // Try to extract from engineering state
    const capacityMemory = engineering.memory.find(m => m.includes('CAPACITY'))
    if (capacityMemory) {
      const match = capacityMemory.match(/(\d+)\s*weeks/)
      if (match) {
        availableWeeks = parseInt(match[1])
      }
    }
  }
  
  // Calculate committed based on NOW items
  const cpo = os.departments.cpo
  let committedWeeks = 0
  if (cpo) {
    const roadmapMemory = cpo.memory.find(m => m.startsWith('ROADMAP:'))
    if (roadmapMemory) {
      try {
        const data = JSON.parse(roadmapMemory.split(':').slice(2).join(':'))
        if (data.roadmap) {
          const nowItems = data.roadmap.filter((i: RoadmapItem) => i.status === 'now')
          committedWeeks = nowItems.reduce((sum: number, i: RoadmapItem) => sum + i.estimateWeeks, 0)
        }
      } catch {}
    }
  }
  
  const bufferPercent = ((availableWeeks - committedWeeks) / availableWeeks) * 100
  
  let status: 'healthy' | 'tight' | 'overcommitted' = 'healthy'
  if (bufferPercent < 0) status = 'overcommitted'
  else if (bufferPercent < 20) status = 'tight'
  
  return {
    availableWeeks,
    committedWeeks,
    bufferPercent,
    status
  }
}

function prioritizeItems(os: CompanyOS, items: RoadmapItem[]): RoadmapItem[] {
  const vision = extractProductVision(os)
  
  for (const item of items) {
    let score = 0
    
    // Strategic alignment (0-30 points)
    if (vision && vision.inScope.some(s => item.feature.toLowerCase().includes(s.toLowerCase()))) {
      score += 30
    } else {
      score += 10
    }
    
    // Customer impact (0-25 points)
    if (item.feature.toLowerCase().includes('critical') || item.feature.toLowerCase().includes('blocker')) {
      score += 25
    } else if (item.feature.toLowerCase().includes('customer')) {
      score += 15
    } else {
      score += 5
    }
    
    // Revenue impact (0-25 points)
    if (item.feature.toLowerCase().includes('revenue') || item.feature.toLowerCase().includes('conversion')) {
      score += 25
    } else if (item.feature.toLowerCase().includes('growth')) {
      score += 15
    } else {
      score += 5
    }
    
    // Feasibility (0-20 points)
    if (item.estimateWeeks <= 1) {
      score += 20
    } else if (item.estimateWeeks <= 2) {
      score += 15
    } else if (item.estimateWeeks <= 4) {
      score += 10
    } else {
      score += 5
    }
    
    item.priority = score
  }
  
  return items.sort((a, b) => b.priority - a.priority)
}

function detectPriorityConflicts(os: CompanyOS, items: RoadmapItem[]): PriorityConflict[] {
  const conflicts: PriorityConflict[] = []
  
  // Find items with similar priority but different owners
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i].owner !== items[j].owner && 
          Math.abs(items[i].priority - items[j].priority) < 10) {
        conflicts.push({
          pmA: items[i].owner,
          pmB: items[j].owner,
          description: `${items[i].feature} vs ${items[j].feature}`,
          resolution: ''
        })
      }
    }
  }
  
  return conflicts
}

function resolveConflicts(os: CompanyOS, conflicts: PriorityConflict[], prioritized: RoadmapItem[]): PriorityConflict[] {
  // Simple resolution: prioritized list is the resolution
  // In reality this would involve more sophisticated logic
  
  for (const conflict of conflicts) {
    const pmAItem = prioritized.find(i => i.owner === conflict.pmA)
    const pmBItem = prioritized.find(i => i.owner === conflict.pmB)
    
    if (pmAItem && pmBItem) {
      if (pmAItem.priority > pmBItem.priority) {
        conflict.resolution = `Prioritized ${pmAItem.feature} (score: ${pmAItem.priority}) over ${pmBItem.feature} (score: ${pmBItem.priority})`
      } else {
        conflict.resolution = `Prioritized ${pmBItem.feature} (score: ${pmBItem.priority}) over ${pmAItem.feature} (score: ${pmAItem.priority})`
      }
    }
  }
  
  return conflicts
}

function assignToTimeframes(items: RoadmapItem[], capacity: EngineeringCapacity): RoadmapItem[] {
  let nowWeeks = 0
  let nextWeeks = 0
  const monthlyCapacity = capacity.availableWeeks
  
  for (const item of items) {
    if (nowWeeks + item.estimateWeeks <= monthlyCapacity * 0.8) {
      item.status = 'now'
      nowWeeks += item.estimateWeeks
    } else if (nextWeeks + item.estimateWeeks <= monthlyCapacity * 0.8) {
      item.status = 'next'
      nextWeeks += item.estimateWeeks
    } else if (item.priority < 30) {
      item.status = 'cut'
    } else {
      item.status = 'later'
    }
  }
  
  return items
}

function identifyRoadmapRisks(os: CompanyOS, roadmap: RoadmapItem[], capacity: EngineeringCapacity): string[] {
  const risks: string[] = []
  
  if (capacity.status === 'overcommitted') {
    risks.push('Roadmap exceeds engineering capacity - some items will miss deadlines')
  }
  
  if (capacity.bufferPercent < 20) {
    risks.push('No buffer for bugs or scope creep - high risk of delays')
  }
  
  const nowItems = roadmap.filter(i => i.status === 'now')
  if (nowItems.length > 5) {
    risks.push('Too many concurrent projects - team will be context-switching')
  }
  
  const largeItems = roadmap.filter(i => i.estimateWeeks > 4)
  if (largeItems.length > 0) {
    risks.push('Large projects (>4 weeks) are high risk - consider breaking down')
  }
  
  return risks
}

function extractProductVision(os: CompanyOS): { inScope: string[], outOfScope: string[] } | null {
  const cpo = os.departments.cpo
  if (!cpo) return null
  
  const visionMemory = cpo.memory.find(m => m.startsWith('PRODUCT_VISION:'))
  if (!visionMemory) return null
  
  try {
    const vision = JSON.parse(visionMemory.split(':').slice(2).join(':'))
    return {
      inScope: vision.inScope || [],
      outOfScope: vision.outOfScope || []
    }
  } catch {
    return null
  }
}

function formatRoadmap(roadmap: RoadmapItem[], capacity: EngineeringCapacity, conflicts: PriorityConflict[], risks: string[]): string {
  const lines: string[] = []
  
  lines.push(`PRODUCT ROADMAP · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  lines.push('ENGINEERING CAPACITY')
  lines.push(`Available:  ${capacity.availableWeeks} engineer-weeks per month`)
  lines.push(`Committed:  ${capacity.committedWeeks} engineer-weeks planned`)
  lines.push(`Buffer:     ${capacity.bufferPercent.toFixed(1)}% remaining`)
  lines.push(`Status:     ${capacity.status.toUpperCase()}`)
  lines.push('')
  
  const now = roadmap.filter(i => i.status === 'now')
  if (now.length > 0) {
    lines.push('NOW (Shipping this month)')
    for (const item of now) {
      lines.push(`· ${item.feature} — ${item.owner} — Est: ${item.estimateWeeks}w — ${item.strategicReason}`)
    }
    lines.push('')
  }
  
  const next = roadmap.filter(i => i.status === 'next')
  if (next.length > 0) {
    lines.push('NEXT (Shipping next month)')
    for (const item of next) {
      lines.push(`· ${item.feature} — ${item.owner} — Est: ${item.estimateWeeks}w — ${item.strategicReason}`)
    }
    lines.push('')
  }
  
  const later = roadmap.filter(i => i.status === 'later')
  if (later.length > 0) {
    lines.push('LATER (Backlog)')
    for (const item of later.slice(0, 5)) {
      lines.push(`· ${item.feature} — ${item.owner} — ${item.strategicReason}`)
    }
    if (later.length > 5) {
      lines.push(`  ... and ${later.length - 5} more items`)
    }
    lines.push('')
  }
  
  const cut = roadmap.filter(i => i.status === 'cut')
  if (cut.length > 0) {
    lines.push('CUT (Deprioritized)')
    for (const item of cut) {
      lines.push(`· ${item.feature} — Low priority (score: ${item.priority})`)
    }
    lines.push('')
  }
  
  if (conflicts.length > 0) {
    lines.push('CONFLICTS RESOLVED')
    for (const conflict of conflicts) {
      lines.push(`· ${conflict.description}`)
      lines.push(`  → ${conflict.resolution}`)
    }
    lines.push('')
  }
  
  if (risks.length > 0) {
    lines.push('RISKS')
    for (const risk of risks) {
      lines.push(`· ${risk}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.product` — all PM roadmap items
- `company.os.departments.engineering` — capacity and velocity
- `company.os.departments.cpo` — product vision for alignment
- `company.os.events` — strategy changes, launch blocks

**Emits:**
- `roadmap-prioritized` → confirms NOW and NEXT items
- `priority-conflict-resolved` → documents conflict resolutions
- `roadmap-updated` → signals major roadmap changes

**Consumed by:**
- All PM agents (understand their priorities)
- Engineering leads (know what's committed)
- CEO briefing (surface capacity issues)
- Marketing (know what's launching when)
