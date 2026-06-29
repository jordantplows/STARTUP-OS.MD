---
name: coo-process
executive: coo
role: steering
reads:
  - company.os.departments
  - company.os.events
  - company.os.decisions
events:
  emits: [process-updated, bottleneck-removed, sop-created]
  watches: [repeated-blocker, efficiency-opportunity, scaling-threshold]
template-ref: templates/executives/process.md
---

## What this agent does

The COO process agent designs standard operating procedures, identifies and removes bottlenecks, and optimizes workflows for efficiency. It watches for repeated patterns that should be systematized and ensures processes scale as the company grows.

## Instructions

### WATCH

Trigger when:
- Same operational issue occurs 3+ times
- Department flags inefficient workflow
- Scaling threshold approaching (from scaling agent)
- New process needed for compliance/quality
- Quarterly process review
- Department handoff failures

### REASON

Process design framework:

**When to create a process:**
1. **Repetition** — something done 3+ times needs a process
2. **Quality risk** — outcome variability too high
3. **Compliance** — regulatory or customer requirement
4. **Handoffs** — work passed between people/teams
5. **Scaling** — current approach won't work at 2x scale

**Process design principles:**
1. **Necessary, not bureaucratic** — process must solve real pain
2. **Simple as possible** — fewest steps to desired outcome
3. **Checkpoints over gates** — visibility without blocking
4. **Self-service first** — automate or enable, don't require human approval
5. **Measure effectiveness** — track if process achieves goal

**When to remove a process:**
- No longer serves its purpose
- Creates more problems than it solves
- Team routes around it consistently
- Can be automated away
- Duplicate with another process

### ACT

Process assessment format:

```
PROCESS OPTIMIZATION · [Date]

BOTTLENECKS IDENTIFIED
🔴 CRITICAL
· [Specific bottleneck] - [Department affected]
  Frequency: [N] times/month
  Impact: [Hours wasted / Revenue lost / Quality issues]
  Root cause: [Why this happens]
  Solution: [Process or system to implement]

🟡 IMPROVEMENT OPPORTUNITIES
· [Inefficiency] - [Department affected]
  Current state: [How it works now]
  Proposed state: [How it should work]
  Effort: [Low/Medium/High]
  ROI: [Hours saved / Quality improvement]

NEW PROCESSES NEEDED
1. [Process name]
   Trigger: [When this occurs 3+ times]
   Owner: [Who designs and maintains]
   Status: [not-started | in-progress | documented]
   Due: [When needed for scaling]

2. [Process name]
   Trigger: [Specific recurring pain point]
   Owner: [Department]
   Status: [not-started | in-progress | documented]

PROCESS HEALTH
· [Existing process]: [Usage stats] - [Working | Needs update | Deprecated]
· [Existing process]: [Usage stats] - [Working | Needs update | Deprecated]

AUTOMATION CANDIDATES
· [Manual task] - [N] hours/week - [Automation approach]
· [Manual task] - [N] hours/week - [Automation approach]

RECOMMENDATIONS
1. [Specific process to create or update]
2. [Bottleneck to remove with specific approach]
3. [Automation to implement]
```

### COORDINATE

After process assessment:
- Emit `process-updated` event when SOP created or changed
- Emit `bottleneck-removed` event when workflow improved
- Emit `sop-created` event when new process documented
- Update affected departments with new processes
- Create decisions if process requires founder input

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface Bottleneck {
  description: string
  department: string
  frequency: number // per month
  impact: string
  rootCause: string
  solution: string
  severity: 'critical' | 'improvement'
}

interface ProcessNeeded {
  name: string
  trigger: string
  owner: string
  status: 'not-started' | 'in-progress' | 'documented'
  due: string
}

interface ProcessHealth {
  name: string
  usage: string
  status: 'working' | 'needs-update' | 'deprecated'
}

interface AutomationCandidate {
  task: string
  hoursPerWeek: number
  approach: string
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Identify bottlenecks from repeated blockers
  const bottlenecks = identifyBottlenecks(os)
  
  // Determine what new processes are needed
  const processesNeeded = identifyProcessesNeeded(os, bottlenecks)
  
  // Review health of existing processes
  const processHealth = reviewProcessHealth(os)
  
  // Find automation opportunities
  const automationCandidates = findAutomationOpportunities(os)
  
  // Generate recommendations
  const recommendations = generateProcessRecommendations(bottlenecks, processesNeeded, automationCandidates)
  
  // Emit events for bottlenecks removed
  const recentlyFixed = bottlenecks.filter(b => b.solution.includes('implemented'))
  for (const fixed of recentlyFixed) {
    os.events.push({
      type: 'bottleneck-removed',
      from: 'coo-process',
      payload: { bottleneck: fixed },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Emit events for new processes documented
  const documented = processesNeeded.filter(p => p.status === 'documented')
  for (const process of documented) {
    const alreadyEmitted = os.events.some(e =>
      e.type === 'sop-created' &&
      e.payload.processName === process.name
    )
    if (!alreadyEmitted) {
      os.events.push({
        type: 'sop-created',
        from: 'coo-process',
        payload: { processName: process.name, owner: process.owner },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    }
  }
  
  // Emit events for process updates
  const needsUpdate = processHealth.filter(p => p.status === 'needs-update')
  if (needsUpdate.length > 0) {
    os.events.push({
      type: 'process-updated',
      from: 'coo-process',
      payload: { processes: needsUpdate.map(p => p.name) },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update COO state
  if (!os.departments.coo) {
    os.departments.coo = {
      status: 'steering',
      currentFocus: 'Process optimization',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.coo.memory.push(
    `PROCESS_REVIEW:${new Date().toISOString()}:${JSON.stringify({ bottlenecks: bottlenecks.length, processesNeeded: processesNeeded.length })}`
  )
  
  os.departments.coo.lastAction = {
    type: 'process-assessed',
    description: `Identified ${bottlenecks.length} bottlenecks, ${processesNeeded.length} processes needed`,
    timestamp: new Date().toISOString(),
    impact: ['all']
  }
  
  return formatProcessAssessment(bottlenecks, processesNeeded, processHealth, automationCandidates, recommendations)
}

function identifyBottlenecks(os: CompanyOS): Bottleneck[] {
  const bottlenecks: Bottleneck[] = []
  
  // Look for repeated blocker patterns
  const recentEvents = os.events.slice(-200)
  const blockerEvents = recentEvents.filter(e => 
    e.type.includes('blocker') || e.type.includes('blocked')
  )
  
  // Group by blocker description
  const blockerCounts = new Map<string, { dept: string; count: number; events: any[] }>()
  for (const event of blockerEvents) {
    const key = event.payload?.blocker || event.type
    if (!blockerCounts.has(key)) {
      blockerCounts.set(key, { dept: event.from, count: 0, events: [] })
    }
    const entry = blockerCounts.get(key)!
    entry.count++
    entry.events.push(event)
  }
  
  // Convert to bottlenecks if frequency is high
  for (const [blocker, data] of blockerCounts) {
    if (data.count >= 3) {
      bottlenecks.push({
        description: blocker,
        department: data.dept,
        frequency: data.count,
        impact: `Blocks progress ${data.count} times`,
        rootCause: analyzeRootCause(blocker, data.events),
        solution: proposeSolution(blocker, data.events),
        severity: data.count >= 5 ? 'critical' : 'improvement'
      })
    }
  }
  
  // Look for department signals about inefficiencies
  for (const [name, dept] of Object.entries(os.departments)) {
    const efficiencySignals = dept.signals.filter(s =>
      s.type.includes('inefficient') || s.type.includes('bottleneck')
    )
    for (const signal of efficiencySignals) {
      if (!bottlenecks.some(b => b.description === signal.type)) {
        bottlenecks.push({
          description: signal.type,
          department: name,
          frequency: 1,
          impact: 'Workflow inefficiency',
          rootCause: 'Manual process or lack of tooling',
          solution: 'Create SOP or automate',
          severity: signal.priority === 'critical' ? 'critical' : 'improvement'
        })
      }
    }
  }
  
  return bottlenecks
}

function analyzeRootCause(blocker: string, events: any[]): string {
  // Simple heuristics - real impl would be more sophisticated
  if (blocker.includes('decision')) {
    return 'Waiting for founder/leadership input'
  }
  if (blocker.includes('handoff')) {
    return 'Unclear ownership or process for transition'
  }
  if (blocker.includes('approval')) {
    return 'Unnecessary gate in workflow'
  }
  if (blocker.includes('manual')) {
    return 'Manual process that could be automated'
  }
  return 'Process not clearly defined'
}

function proposeSolution(blocker: string, events: any[]): string {
  if (blocker.includes('decision')) {
    return 'Define decision framework or delegate authority'
  }
  if (blocker.includes('handoff')) {
    return 'Create handoff checklist and clear ownership'
  }
  if (blocker.includes('approval')) {
    return 'Replace approval gate with notification/checkpoint'
  }
  if (blocker.includes('manual')) {
    return 'Build automation or self-service tool'
  }
  return 'Document SOP with clear roles and steps'
}

function identifyProcessesNeeded(os: CompanyOS, bottlenecks: Bottleneck[]): ProcessNeeded[] {
  const processes: ProcessNeeded[] = []
  
  // Convert bottlenecks to process needs
  for (const bottleneck of bottlenecks) {
    if (bottleneck.severity === 'critical') {
      processes.push({
        name: `${bottleneck.department} - ${bottleneck.description}`,
        trigger: `Recurring bottleneck (${bottleneck.frequency}x)`,
        owner: bottleneck.department,
        status: 'not-started',
        due: 'Next 30 days'
      })
    }
  }
  
  // Look for scaling-triggered process needs
  const scalingEvents = os.events.filter(e => e.type === 'scaling-threshold-approaching')
  for (const event of scalingEvents) {
    if (!event.consumed.includes('coo-process')) {
      event.consumed.push('coo-process')
      
      const threshold = event.payload?.threshold?.name
      if (threshold?.includes('25 person')) {
        processes.push({
          name: 'Performance review process',
          trigger: 'Scaling to 25+ people',
          owner: 'people',
          status: 'not-started',
          due: 'Before hitting 25 people'
        })
        processes.push({
          name: 'Department meeting cadence',
          trigger: 'Scaling to 25+ people',
          owner: 'coo',
          status: 'not-started',
          due: 'Before hitting 25 people'
        })
      }
    }
  }
  
  return processes
}

function reviewProcessHealth(os: CompanyOS): ProcessHealth[] {
  const health: ProcessHealth[] = []
  
  // In real impl, would load existing processes from registry
  // For now, look for documented processes in COO memory
  if (!os.departments.coo) return health
  
  const processMemories = os.departments.coo.memory.filter(m => 
    m.includes('PROCESS_DOCUMENTED:')
  )
  
  for (const mem of processMemories) {
    const parts = mem.split(':')
    if (parts.length >= 3) {
      const processName = parts[1]
      const timestamp = parts[2]
      
      // Check if process has been used recently
      const usageEvents = os.events.filter(e => 
        e.type.includes(processName.toLowerCase())
      )
      
      const daysSinceCreated = daysSince(timestamp)
      let status: 'working' | 'needs-update' | 'deprecated' = 'working'
      
      if (daysSinceCreated > 180 && usageEvents.length === 0) {
        status = 'deprecated'
      } else if (daysSinceCreated > 90 && usageEvents.length < 5) {
        status = 'needs-update'
      }
      
      health.push({
        name: processName,
        usage: `${usageEvents.length} uses`,
        status
      })
    }
  }
  
  return health
}

function findAutomationOpportunities(os: CompanyOS): AutomationCandidate[] {
  const candidates: AutomationCandidate[] = []
  
  // Look for manual tasks mentioned in events
  const recentEvents = os.events.slice(-100)
  for (const event of recentEvents) {
    if (event.type.includes('manual') || event.payload?.manual) {
      const task = event.payload?.task || event.type
      candidates.push({
        task,
        hoursPerWeek: estimateTimeSpent(task),
        approach: proposeAutomation(task)
      })
    }
  }
  
  // Look for repeated data entry or reporting
  const reportingEvents = recentEvents.filter(e => 
    e.type.includes('report') || e.type.includes('metrics')
  )
  if (reportingEvents.length > 10) {
    candidates.push({
      task: 'Manual metrics reporting',
      hoursPerWeek: 5,
      approach: 'Build automated dashboard with real-time metrics'
    })
  }
  
  return candidates
}

function estimateTimeSpent(task: string): number {
  // Simple heuristics
  if (task.includes('report')) return 3
  if (task.includes('entry')) return 2
  if (task.includes('review')) return 4
  return 1
}

function proposeAutomation(task: string): string {
  if (task.includes('report')) return 'Automated dashboard'
  if (task.includes('entry')) return 'API integration or form automation'
  if (task.includes('review')) return 'Automated checks with human review for edge cases'
  if (task.includes('notification')) return 'Event-driven alerts'
  return 'Workflow automation tool'
}

function generateProcessRecommendations(
  bottlenecks: Bottleneck[],
  processesNeeded: ProcessNeeded[],
  automationCandidates: AutomationCandidate[]
): string[] {
  const recommendations: string[] = []
  
  // Critical bottlenecks first
  const critical = bottlenecks.filter(b => b.severity === 'critical')
  if (critical.length > 0) {
    recommendations.push(
      `Remove bottleneck: ${critical[0].description} - ${critical[0].solution}`
    )
  }
  
  // High-priority processes
  const notStarted = processesNeeded.filter(p => p.status === 'not-started')
  if (notStarted.length > 0) {
    recommendations.push(
      `Create SOP: ${notStarted[0].name} (assign to ${notStarted[0].owner})`
    )
  }
  
  // High-ROI automation
  const highROI = automationCandidates.filter(a => a.hoursPerWeek >= 3)
  if (highROI.length > 0) {
    recommendations.push(
      `Automate: ${highROI[0].task} - saves ${highROI[0].hoursPerWeek}hrs/week`
    )
  }
  
  return recommendations.slice(0, 3)
}

function daysSince(timestamp: string): number {
  try {
    const ts = new Date(timestamp).getTime()
    const now = Date.now()
    return Math.floor((now - ts) / (24 * 60 * 60 * 1000))
  } catch {
    return 0
  }
}

function formatProcessAssessment(
  bottlenecks: Bottleneck[],
  processesNeeded: ProcessNeeded[],
  processHealth: ProcessHealth[],
  automationCandidates: AutomationCandidate[],
  recommendations: string[]
): string {
  const lines: string[] = []
  
  lines.push(`PROCESS OPTIMIZATION · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  if (bottlenecks.length > 0) {
    lines.push('BOTTLENECKS IDENTIFIED')
    
    const critical = bottlenecks.filter(b => b.severity === 'critical')
    if (critical.length > 0) {
      lines.push('🔴 CRITICAL')
      for (const b of critical) {
        lines.push(`· ${b.description} - ${b.department}`)
        lines.push(`  Frequency: ${b.frequency} times`)
        lines.push(`  Impact: ${b.impact}`)
        lines.push(`  Root cause: ${b.rootCause}`)
        lines.push(`  Solution: ${b.solution}`)
      }
    }
    
    const improvements = bottlenecks.filter(b => b.severity === 'improvement')
    if (improvements.length > 0) {
      lines.push('')
      lines.push('🟡 IMPROVEMENT OPPORTUNITIES')
      for (const b of improvements) {
        lines.push(`· ${b.description} - ${b.department}`)
        lines.push(`  Root cause: ${b.rootCause}`)
        lines.push(`  Solution: ${b.solution}`)
      }
    }
  }
  
  if (processesNeeded.length > 0) {
    lines.push('')
    lines.push('NEW PROCESSES NEEDED')
    for (let i = 0; i < processesNeeded.length; i++) {
      const p = processesNeeded[i]
      lines.push(`${i + 1}. ${p.name}`)
      lines.push(`   Trigger: ${p.trigger}`)
      lines.push(`   Owner: ${p.owner}`)
      lines.push(`   Status: ${p.status}`)
      lines.push(`   Due: ${p.due}`)
    }
  }
  
  if (processHealth.length > 0) {
    lines.push('')
    lines.push('PROCESS HEALTH')
    for (const p of processHealth) {
      const statusIcon = p.status === 'working' ? '🟢' : p.status === 'needs-update' ? '🟡' : '🔴'
      lines.push(`· ${p.name}: ${p.usage} - ${statusIcon} ${p.status}`)
    }
  }
  
  if (automationCandidates.length > 0) {
    lines.push('')
    lines.push('AUTOMATION CANDIDATES')
    for (const a of automationCandidates.slice(0, 3)) {
      lines.push(`· ${a.task} - ${a.hoursPerWeek} hours/week - ${a.approach}`)
    }
  }
  
  if (recommendations.length > 0) {
    lines.push('')
    lines.push('RECOMMENDATIONS')
    for (let i = 0; i < recommendations.length; i++) {
      lines.push(`${i + 1}. ${recommendations[i]}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.*` — blocker patterns and efficiency signals
- `company.os.events` — repeated issues indicating process needs
- `company.os.decisions` — approval bottlenecks

**Emits:**
- `process-updated` → announces new or changed SOP
- `bottleneck-removed` → workflow improvement completed
- `sop-created` → new process documented and ready

**Consumed by:**
- All departments (receive new processes)
- Operations agent (monitors if processes working)
- Scaling agent (uses processes for scaling playbooks)
