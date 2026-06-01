---
name: cfo-fundraising
executive: cfo
role: steering
reads:
  - company.os.profile
  - company.os.departments.cfo
  - company.os.events
events:
  emits: [fundraise-started, deck-updated, investor-contacted, term-sheet-received, round-closed]
  watches: [cfo-runway-critical, milestone-achieved, product-launched]
template-ref: templates/executives/fundraising.md
---

## What this agent does

The CFO fundraising agent manages the entire fundraising process: pitch deck maintenance, data room preparation, investor pipeline management, term sheet negotiation support, and round closure tracking.

## Instructions

### WATCH

Trigger when:
- Runway drops below 12 months (`cfo-runway-critical` or `runway-changed`)
- Founder initiates fundraising process
- Major milestone achieved (product launch, revenue threshold)
- Quarterly fundraising pipeline review is due
- Investor meeting scheduled

### REASON

Fundraising follows stages:

**Stage 1: Preparation (Runway 12-18 months)**
1. Build compelling pitch deck with clear narrative
2. Assemble data room with financials, metrics, team info
3. Identify target investors (stage, thesis, geography fit)
4. Warm up relationships through updates and intros

**Stage 2: Active Fundraising (Runway 9-12 months)**
1. Send pitch deck to target list
2. Schedule partner meetings
3. Send follow-up materials and answer DD questions
4. Collect term sheets
5. Negotiate terms

**Stage 3: Closing (Runway 6-9 months)**
1. Choose lead investor
2. Complete due diligence
3. Negotiate final terms
4. Execute legal documents
5. Wire funds and announce

**What makes a strong deck:**
- Clear problem and large market opportunity
- Unique insight or unfair advantage
- Traction and momentum (metrics trending up)
- Strong team with relevant experience
- Clear ask and use of funds

**What investors look for:**
- Product-market fit signals
- Unit economics that work at scale
- Defensible moat
- Large addressable market
- Execution capability

### ACT

Output format for fundraising dashboard:

```
FUNDRAISING DASHBOARD · [Stage]

━━━ ROUND STATUS ━━━
Round:            [Pre-seed | Seed | Series A]
Target raise:     $[amount]
Raised to date:   $[amount]
Lead investor:    [name or "TBD"]
Close date:       [date or "TBD"]

━━━ PIPELINE ━━━
Contacted:        [N] investors
Meetings held:    [N] meetings
Follow-ups:       [N] in DD
Term sheets:      [N] received

━━━ DECK STATUS ━━━
Last updated:     [date]
Version:          v[N]
Key slides:       ✓ Problem, ✓ Solution, ✓ Traction, ✓ Team, ✓ Ask
Traction metrics: MRR $[amount], Growth [%], Customers [N]

━━━ DATA ROOM ━━━
Financial model:  ✓ Ready
Cap table:        ✓ Ready
Team bios:        ✓ Ready
Product demo:     ✓ Ready
Customer refs:    ✓ Ready

━━━ NEXT ACTIONS ━━━
· [Specific action with owner and deadline]
· [Specific action with owner and deadline]
· [Specific action with owner and deadline]
```

### COORDINATE

After fundraising updates:
- Emit `fundraise-started` when process begins
- Emit `deck-updated` when pitch deck is refreshed
- Emit `investor-contacted` for each new investor outreach
- Emit `term-sheet-received` when TS arrives
- Emit `round-closed` when funds wire
- Update CFO memory with investor pipeline state
- Alert CEO when term sheet decisions needed

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

type RoundStage = 'pre-seed' | 'seed' | 'series-a' | 'series-b'
type FundraisingPhase = 'preparing' | 'active' | 'closing' | 'closed'

interface InvestorContact {
  name: string
  firm: string
  stage: 'contacted' | 'meeting-scheduled' | 'met' | 'dd' | 'passed' | 'term-sheet'
  lastContact: string
  notes: string
}

interface PitchDeck {
  version: string
  lastUpdated: string
  slides: {
    problem: boolean
    solution: boolean
    market: boolean
    traction: boolean
    team: boolean
    competition: boolean
    businessModel: boolean
    ask: boolean
  }
  tractionMetrics: {
    mrr: number
    growth: number
    customers: number
  }
}

interface DataRoom {
  financialModel: boolean
  capTable: boolean
  teamBios: boolean
  productDemo: boolean
  customerRefs: boolean
  legalDocs: boolean
}

interface FundraisingState {
  phase: FundraisingPhase
  round: RoundStage
  targetRaise: number
  raisedToDate: number
  leadInvestor?: string
  targetCloseDate?: string
  pipeline: InvestorContact[]
  deck: PitchDeck
  dataRoom: DataRoom
  nextActions: Array<{
    action: string
    owner: string
    deadline: string
  }>
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Load fundraising state from CFO memory
  const fundraisingState = loadFundraisingState(os)
  
  if (!fundraisingState) {
    // Initialize fundraising if not started
    return initializeFundraising(os)
  }
  
  // Check for trigger events
  const runwayEvent = os.events.slice(-20).find(e => 
    e.type === 'runway-changed' && !e.consumed.includes('cfo-fundraising')
  )
  
  if (runwayEvent) {
    runwayEvent.consumed.push('cfo-fundraising')
    const runway = runwayEvent.payload.to as number
    
    // Update phase based on runway
    if (runway < 9 && fundraisingState.phase === 'preparing') {
      fundraisingState.phase = 'active'
      os.events.push({
        type: 'fundraise-started',
        from: 'cfo-fundraising',
        payload: { 
          round: fundraisingState.round,
          runway,
          reason: 'Runway dropped below 9 months - activating fundraising'
        },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    }
  }
  
  // Update deck with latest traction
  updateDeckMetrics(os, fundraisingState)
  
  // Generate next actions based on phase
  fundraisingState.nextActions = generateNextActions(fundraisingState, os)
  
  // Save updated state
  saveFundraisingState(os, fundraisingState)
  
  // Format output
  return formatFundraisingDashboard(fundraisingState)
}

function loadFundraisingState(os: CompanyOS): FundraisingState | null {
  if (!os.departments.cfo) return null
  
  const memory = os.departments.cfo.memory.find(m => m.startsWith('FUNDRAISING:'))
  if (!memory) return null
  
  try {
    return JSON.parse(memory.replace('FUNDRAISING:', ''))
  } catch {
    return null
  }
}

function saveFundraisingState(os: CompanyOS, state: FundraisingState): void {
  if (!os.departments.cfo) {
    os.departments.cfo = {
      status: 'steering',
      currentFocus: 'Managing fundraising',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  // Remove old fundraising state
  os.departments.cfo.memory = os.departments.cfo.memory.filter(m => 
    !m.startsWith('FUNDRAISING:')
  )
  
  // Add updated state
  os.departments.cfo.memory.push(`FUNDRAISING:${JSON.stringify(state)}`)
}

function initializeFundraising(os: CompanyOS): string {
  const stage = os.profile.stage
  const revenue = os.profile.revenue
  
  // Determine appropriate round based on stage
  let round: RoundStage = 'pre-seed'
  if (revenue > 100000) round = 'series-a'
  else if (revenue > 10000 || stage === 'revenue') round = 'seed'
  else if (stage === 'building') round = 'seed'
  
  // Determine target raise
  let targetRaise = 500000 // pre-seed default
  if (round === 'seed') targetRaise = 2000000
  else if (round === 'series-a') targetRaise = 10000000
  
  const state: FundraisingState = {
    phase: 'preparing',
    round,
    targetRaise,
    raisedToDate: 0,
    pipeline: [],
    deck: {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      slides: {
        problem: false,
        solution: false,
        market: false,
        traction: false,
        team: false,
        competition: false,
        businessModel: false,
        ask: false
      },
      tractionMetrics: {
        mrr: revenue,
        growth: 0,
        customers: 0
      }
    },
    dataRoom: {
      financialModel: false,
      capTable: false,
      teamBios: false,
      productDemo: false,
      customerRefs: false,
      legalDocs: false
    },
    nextActions: [
      {
        action: 'Build initial pitch deck',
        owner: 'founder',
        deadline: 'This week'
      },
      {
        action: 'Create investor target list',
        owner: 'cfo',
        deadline: 'This week'
      },
      {
        action: 'Prepare financial model for data room',
        owner: 'cfo',
        deadline: 'Next week'
      }
    ]
  }
  
  saveFundraisingState(os, state)
  
  return `Initialized ${round} fundraising process. Target raise: $${targetRaise.toLocaleString()}\n\n${formatFundraisingDashboard(state)}`
}

function updateDeckMetrics(os: CompanyOS, state: FundraisingState): void {
  // Get latest financial model
  const modelMemory = os.departments.cfo?.memory.find(m => m.startsWith('MODEL:'))
  if (!modelMemory) return
  
  try {
    const model = JSON.parse(modelMemory.replace('MODEL:', ''))
    state.deck.tractionMetrics = {
      mrr: model.revenue.mrr,
      growth: model.revenue.mrrGrowthRate,
      customers: model.revenue.activeCustomers
    }
    state.deck.lastUpdated = new Date().toISOString()
    
    // Emit deck-updated event
    os.events.push({
      type: 'deck-updated',
      from: 'cfo-fundraising',
      payload: { metrics: state.deck.tractionMetrics },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  } catch {
    // Ignore parse errors
  }
}

function generateNextActions(state: FundraisingState, os: CompanyOS): any[] {
  const actions: any[] = []
  
  if (state.phase === 'preparing') {
    // Focus on preparation
    if (!state.deck.slides.problem) {
      actions.push({
        action: 'Complete problem slide in pitch deck',
        owner: 'founder',
        deadline: 'This week'
      })
    }
    if (!state.dataRoom.financialModel) {
      actions.push({
        action: 'Prepare financial model for data room',
        owner: 'cfo',
        deadline: 'This week'
      })
    }
    if (state.pipeline.length === 0) {
      actions.push({
        action: 'Build target investor list (20-30 firms)',
        owner: 'founder',
        deadline: 'This week'
      })
    }
  } else if (state.phase === 'active') {
    // Focus on investor outreach
    const contacted = state.pipeline.filter(i => i.stage !== 'contacted').length
    if (contacted < 10) {
      actions.push({
        action: `Reach out to ${10 - contacted} more investors`,
        owner: 'founder',
        deadline: 'This week'
      })
    }
    
    const meetings = state.pipeline.filter(i => i.stage === 'meeting-scheduled' || i.stage === 'met').length
    if (meetings < 5) {
      actions.push({
        action: 'Schedule more partner meetings',
        owner: 'founder',
        deadline: 'This week'
      })
    }
    
    const dd = state.pipeline.filter(i => i.stage === 'dd')
    if (dd.length > 0) {
      actions.push({
        action: `Follow up with ${dd.length} investors in DD`,
        owner: 'founder',
        deadline: 'This week'
      })
    }
  } else if (state.phase === 'closing') {
    // Focus on closing logistics
    actions.push({
      action: 'Complete due diligence checklist',
      owner: 'cfo',
      deadline: 'This week'
    })
    actions.push({
      action: 'Review and negotiate final terms',
      owner: 'founder',
      deadline: 'This week'
    })
    actions.push({
      action: 'Prepare wire instructions',
      owner: 'cfo',
      deadline: 'Next week'
    })
  }
  
  return actions.slice(0, 3) // Top 3 actions
}

function formatFundraisingDashboard(state: FundraisingState): string {
  const lines: string[] = []
  
  lines.push(`FUNDRAISING DASHBOARD · ${state.phase.toUpperCase()}`)
  lines.push('')
  
  lines.push('━━━ ROUND STATUS ━━━')
  lines.push(`Round:            ${state.round}`)
  lines.push(`Target raise:     $${state.targetRaise.toLocaleString()}`)
  lines.push(`Raised to date:   $${state.raisedToDate.toLocaleString()}`)
  lines.push(`Lead investor:    ${state.leadInvestor || 'TBD'}`)
  lines.push(`Close date:       ${state.targetCloseDate || 'TBD'}`)
  lines.push('')
  
  lines.push('━━━ PIPELINE ━━━')
  const contacted = state.pipeline.length
  const meetings = state.pipeline.filter(i => i.stage === 'met' || i.stage === 'meeting-scheduled').length
  const dd = state.pipeline.filter(i => i.stage === 'dd').length
  const termSheets = state.pipeline.filter(i => i.stage === 'term-sheet').length
  
  lines.push(`Contacted:        ${contacted} investors`)
  lines.push(`Meetings held:    ${meetings} meetings`)
  lines.push(`Follow-ups:       ${dd} in DD`)
  lines.push(`Term sheets:      ${termSheets} received`)
  lines.push('')
  
  lines.push('━━━ DECK STATUS ━━━')
  lines.push(`Last updated:     ${state.deck.lastUpdated.split('T')[0]}`)
  lines.push(`Version:          v${state.deck.version}`)
  
  const slides = state.deck.slides
  const slideStatus = [
    slides.problem ? '✓ Problem' : '✗ Problem',
    slides.solution ? '✓ Solution' : '✗ Solution',
    slides.traction ? '✓ Traction' : '✗ Traction',
    slides.team ? '✓ Team' : '✗ Team',
    slides.ask ? '✓ Ask' : '✗ Ask'
  ].join(', ')
  lines.push(`Key slides:       ${slideStatus}`)
  
  const metrics = state.deck.tractionMetrics
  lines.push(`Traction metrics: MRR $${metrics.mrr.toLocaleString()}, Growth ${metrics.growth}%, Customers ${metrics.customers}`)
  lines.push('')
  
  lines.push('━━━ DATA ROOM ━━━')
  const room = state.dataRoom
  lines.push(`Financial model:  ${room.financialModel ? '✓ Ready' : '✗ Not ready'}`)
  lines.push(`Cap table:        ${room.capTable ? '✓ Ready' : '✗ Not ready'}`)
  lines.push(`Team bios:        ${room.teamBios ? '✓ Ready' : '✗ Not ready'}`)
  lines.push(`Product demo:     ${room.productDemo ? '✓ Ready' : '✗ Not ready'}`)
  lines.push(`Customer refs:    ${room.customerRefs ? '✓ Ready' : '✗ Not ready'}`)
  lines.push('')
  
  if (state.nextActions.length > 0) {
    lines.push('━━━ NEXT ACTIONS ━━━')
    for (const action of state.nextActions) {
      lines.push(`· ${action.action} (${action.owner}, ${action.deadline})`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.profile` — stage, revenue for round determination
- `company.os.departments.cfo` — financial model for deck metrics
- `company.os.events` — runway alerts, milestones

**Emits:**
- `fundraise-started` → notifies company fundraising is active
- `deck-updated` → logs deck refreshes with new metrics
- `investor-contacted` → tracks outreach
- `term-sheet-received` → alerts founder of incoming terms
- `round-closed` → celebrates successful raise

**Consumed by:**
- CEO (coordinates messaging and founder availability)
- CFO risk agent (fundraising affects runway planning)
- All departments (may need to support DD requests)
