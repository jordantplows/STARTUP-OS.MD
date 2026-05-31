# startup-os Runtime

The company runtime where AI agents are parallel processes coordinating through shared state.

## Architecture

### company.os.json — Shared State

The nervous system of the company. Every agent reads it before acting. Every agent writes to it after acting.

```typescript
interface CompanyOS {
  profile: StartupProfile           // Company identity
  departments: Record<string, DepartmentState>  // Each agent's state
  decisions: Decision[]             // Questions waiting for answers
  events: Event[]                   // How agents trigger each other
  mcps: Record<string, MCPConnection>  // External tools
  founderInput: FounderInput[]      // Conversation log
}
```

### Agents Are Processes

Each agent has four behaviors:

1. **WATCH** — Conditions that trigger the agent to wake up
2. **REASON** — Decide what to do when a watch fires
3. **ACT** — Take action in domain
4. **COORDINATE** — Let other agents know

Agents communicate only through `company.os.json` events. No direct calls.

### Current Agents

- **CEO** — Coordinates departments, surfaces critical decisions, gives briefings
- **Legal** — Watches every decision for risk, flags compliance issues, blocks dangerous moves
- **Product** — Defines what gets built, prioritizes work, writes specs
- **Red Team** — Challenges every assumption, asks hardest questions, surfaces risks

More agents coming: CFO, CTO, Engineering, Growth, Finance, Marketing.

## Usage

```typescript
import { startupOS } from './runtime/src/index.js'

// Build new company
const { company, clarifyingQuestions } = await startupOS.build(
  "AI-powered code review for security teams"
)

// Apply clarifications
await company.applyClarifications({
  stage: 'idea',
  customer: 'Security engineers at Series B+ startups',
  keyAssumption: 'Security teams want automated review before manual review',
})

// Talk to your company
const responses = await company.ask('what should I work on today')

// Get status
const status = await company.status()

// List agents
const agents = await company.listAgents()
```

## File Structure

```
runtime/
├── src/
│   ├── types.ts           # TypeScript interfaces
│   ├── company-os.ts      # State management
│   ├── agent-runtime.ts   # Agent lifecycle
│   ├── index.ts           # Main API
│   └── agents/
│       ├── ceo.ts
│       ├── legal.ts
│       ├── product.ts
│       └── red-team.ts
├── dist/                  # Compiled JS
└── tsconfig.json
```

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev
```

## Agent Communication Protocol

Agents never call each other directly. They communicate through events:

```typescript
// Agent emits event
os.emitEvent({
  type: 'spec-written',
  from: 'product',
  payload: { feature: 'auth', needsReview: ['engineering', 'security'] },
  timestamp: new Date().toISOString(),
})

// Other agents watch for it
watches: [
  (state) => state.events.filter(e =>
    e.type === 'spec-written' && !e.consumed.includes('engineering')
  )
]
```

This keeps agents autonomous and prevents deadlocks.
