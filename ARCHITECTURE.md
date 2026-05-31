# startup-os Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE CODE (Interface)                    │
│                                                               │
│  Founder talks → messages route → agents respond             │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   company.os.json (State)                     │
│                                                               │
│  • Company profile (identity, stage, customers)               │
│  • Department states (status, focus, memory)                  │
│  • Decisions in flight (questions → answers)                  │
│  • Events (how agents trigger each other)                     │
│  • MCP connections (external tools)                           │
│  • Founder input log (conversation history)                   │
└─────────────────────────────────────────────────────────────┘
                              ↕
         ┌────────────────────────────────────────┐
         │        AGENT RUNTIME (Orchestrator)     │
         │                                         │
         │  • Routes founder messages              │
         │  • Spawns agents in parallel            │
         │  • Manages agent lifecycle              │
         │  • Coordinates event propagation        │
         └────────────────────────────────────────┘
                              ↕
    ┌──────┬──────┬──────┬──────┬──────┬──────┐
    │      │      │      │      │      │      │
   CEO   Legal Product RedTeam CFO   CTO  ...
    │      │      │      │      │      │      │
    └──────┴──────┴──────┴──────┴──────┴──────┘
         WATCH → REASON → ACT → COORDINATE
```

## Agent Lifecycle

Each agent is a process with four behaviors:

### 1. WATCH
Monitor `company.os.json` for trigger conditions:

```typescript
// Example: Legal agent watches for pricing decisions
watches: [
  (state: CompanyOS) => {
    return state.events.filter(e =>
      e.type === 'pricing-decision' &&
      !e.consumed.includes('legal')
    )
  }
]
```

### 2. REASON
When a watch fires, decide what to do:

```typescript
// Agent reads:
// - Full company state
// - Its own department state
// - What triggered it
// - Founder message (if any)

// Agent decides:
// - Can I handle this myself?
// - Do I need another agent's input?
// - Do I need founder input?
// - Do I need to block something?
```

### 3. ACT
Take action in the agent's domain:

```typescript
// Actions an agent can take:
{
  action: {
    type: 'flag-risk',
    description: 'GDPR violation in email sequences',
    impact: ['marketing', 'growth']
  },
  events: [{
    type: 'legal-flag',
    payload: { risk: 'GDPR', severity: 'high' }
  }],
  decisions: [{
    question: 'Pause email sequences until compliant?',
    blocking: ['marketing']
  }],
  stateUpdates: {
    status: 'steering',
    currentFocus: 'GDPR compliance review'
  },
  founderMessage: 'Flagged GDPR risk in email sequences...'
}
```

### 4. COORDINATE
Emit events for other agents:

```typescript
// Agent writes event to company.os.json
{
  type: 'spec-written',
  from: 'product',
  payload: { feature: 'auth', needsReview: ['engineering', 'security'] },
  timestamp: '2026-05-31T16:00:00Z',
  consumed: []
}

// Engineering, security wake up and react
// Each marks event as consumed after processing
// Product sees their reactions and updates spec
```

## Communication Protocol

**Rule: Agents NEVER call each other directly.**

All communication flows through `company.os.json`:

```
Agent A          company.os.json          Agent B
   │                    │                    │
   │──── emitEvent ────→│                    │
   │                    │                    │
   │                    │←── checkWatches ───│
   │                    │                    │
   │                    │──── event data ───→│
   │                    │                    │
   │                    │←── markConsumed ───│
```

This prevents:
- Deadlocks (no circular waits)
- Race conditions (state is serialized)
- Hidden dependencies (all coordination is visible)
- Agent coupling (agents don't know about each other)

## Event Types

Events are how agents coordinate:

```typescript
// Decision answered
{ type: 'decision-answered', from: 'founder', payload: { answer } }

// Action taken
{ type: 'action-taken', from: 'product', payload: { action } }

// Assumption made
{ type: 'assumption', from: 'product', payload: { assumption } }

// Customer signal
{ type: 'customer-signal', from: 'growth', payload: { signal } }

// Spec written
{ type: 'spec-written', from: 'product', payload: { feature, spec } }

// Risk flagged
{ type: 'legal-flag', from: 'legal', payload: { risk, severity } }

// MCP connected
{ type: 'mcp-connected', from: 'system', payload: { name, activates } }
```

## State Management

`company.os.json` is the single source of truth:

```typescript
class CompanyOSManager {
  // Initialize from profile or load from disk
  constructor(initialProfile?: Partial<StartupProfile>)

  // Profile management
  updateProfile(updates: Partial<StartupProfile>): void

  // Department management
  initializeDepartment(name: string, state: DepartmentState): void
  updateDepartment(name: string, updates: Partial<DepartmentState>): void

  // Decision management
  addDecision(decision: Decision): Decision
  answerDecision(decisionId: string, answer: string): void
  getPendingDecisions(): Decision[]

  // Event management
  emitEvent(event: Event): void
  markEventConsumed(eventIndex: number, agentName: string): void
  getUnconsumedEvents(agentName: string): Event[]

  // Action recording
  recordAction(department: string, action: Action): void

  // Memory
  addMemory(department: string, memory: string): void

  // MCP
  connectMCP(name: string, activates: string[]): void

  // Persistence
  save(): void  // Called after every mutation
}
```

Every mutation triggers `save()` — state is always persisted.

## Founder Routing

When the founder sends a message, it routes to relevant agents:

```typescript
async routeFounderInput(message: string): Promise<string[]> {
  // Use Claude Sonnet to analyze:
  // - Message content
  // - Current decisions pending
  // - Recent events
  // - Active agents

  // Return: which agents should respond, in what order

  // Examples:
  // "what should I work on today" → ['ceo']
  // "legal, explain the risk" → ['legal']
  // "pause everything" → ['ceo', 'product', 'engineering']
  // "let's focus on customers" → ['ceo', 'product', 'growth', 'sales']
}
```

The routing layer ensures:
- Founder never needs to know agent names
- Messages go to the right domain experts
- CEO is fallback when unclear

## Adding New Agents

To add a new agent:

1. Define the agent in `runtime/src/agents/<name>.ts`:

```typescript
import type { AgentDefinition, CompanyOS } from '../types.js'

export const myAgent: AgentDefinition = {
  name: 'my-agent',
  department: 'my-department',
  role: 'My Role',

  watches: [
    // Conditions that wake this agent
    (state: CompanyOS) => {
      return state.events.filter(e =>
        e.type === 'something-relevant' &&
        !e.consumed.includes('my-agent')
      )
    }
  ],

  systemPrompt: `You are the [ROLE].

  YOUR JOB:
  1. [Primary responsibility]
  2. [Secondary responsibility]
  3. [What you coordinate with others]

  YOU ARE NOT:
  - [Common misconception]
  - [Another common misconception]

  YOU ARE:
  - [Actual role]
  - [Key behavior]

  [Include decision framework, when to escalate, tone]`,
}
```

2. Register it in `runtime/src/index.ts`:

```typescript
import { myAgent } from './agents/my-agent.js'

// In StartupOS.load() and StartupOS.build()
runtime.registerAgent(myAgent)
```

3. Build:

```bash
npm run build
```

The agent is now live. It will:
- Initialize when company starts
- Watch for its trigger conditions
- React when conditions fire
- Coordinate through events

## Testing

```bash
# Build the runtime
npm run build

# Test basic functionality
node runtime/test-runtime.ts
```

For full integration testing, use the skill in Claude Code:

```
/startup-os build "test company"
```

## File Structure

```
startup-os/
├── .claude-plugin/
│   ├── SKILL.md              # Skill definition
│   ├── plugin.json           # Plugin config
│   └── skill-handler.ts      # CLI interface
├── runtime/
│   ├── src/
│   │   ├── types.ts          # TypeScript interfaces
│   │   ├── company-os.ts     # State management
│   │   ├── agent-runtime.ts  # Agent orchestrator
│   │   ├── index.ts          # Public API
│   │   └── agents/
│   │       ├── ceo.ts
│   │       ├── legal.ts
│   │       ├── product.ts
│   │       └── red-team.ts
│   ├── test-runtime.ts       # Integration test
│   └── README.md             # Runtime docs
├── dist/                     # Compiled JS
├── .startup-os/
│   └── company.os.json       # Runtime state (gitignored)
├── package.json
├── tsconfig.json
├── CLAUDE.md                 # Project instructions
├── ARCHITECTURE.md           # This file
└── README.md                 # User-facing docs
```

## Next

- More agents (CFO, CTO, CMO, Engineering, Growth, Finance, Marketing, Sales)
- MCP integrations (GitHub, Linear, Slack, etc.)
- Multi-founder mode (agents route to correct founder)
- Agent memory (long-term learning across sessions)
- Web dashboard (visualize company state)
