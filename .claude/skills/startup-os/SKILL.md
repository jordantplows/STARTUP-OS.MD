---
name: startup-os
description: >
  Instantiates your entire company as parallel AI agents that watch, decide,
  and coordinate through shared state. The .md files are the agents, the
  TypeScript runtime executes them, and you are the only human.
argument-hint: 'build "<idea>" | ask <message> | status | agents | reset | debug <type>'
---

# startup-os · company runtime

This is not a document generator. This is a company operating system.

## What it actually is

**startup-os is a programming language where .md files ARE the source code.**

Each .md file in the department folders and `core/` is a self-contained agent with:
- Frontmatter (name, description, role, watches)
- Instructions (what this agent does)
- TypeScript (how it executes)
- Coordination (how it talks to other agents)

The `src/` TypeScript runtime loads these .md files and executes them as parallel processes. They coordinate through `company.os.json` - no direct agent-to-agent calls.

You (the founder) are the only human. Your job is to answer questions agents surface.

## Commands

### /startup-os build "<idea>"

Instantiates a company from an idea.

**What happens:**
1. Parse the idea into initial company profile
2. Ask 3 clarifying questions:
   - What stage? (idea/validating/building/revenue)
   - Who's your first customer? (be specific)
   - What must be true for this to work? (key assumption)
3. Write answers to `company.os.json`
4. Load all .md agents from disk
5. Initialize each agent's department in company.os
6. Boot all agents in parallel
7. CEO gives first briefing with cross-department status

**Example:**
```
/startup-os build "AI-powered code review for security teams"
```

You'll get a briefing like:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SecureCode · CEO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 WHAT WE'RE BUILDING
 AI code review that catches security issues before manual review.
 For security engineers at Series B+ SaaS companies.

 WHAT YOUR DEPARTMENTS ARE DOING
 Product    → Defining MVP scope
 Legal      → Reviewing AI liability for false negatives
 Red Team   → Challenging "security teams want automation"

 FIRST DECISION I NEED
 Do you want prototype (2 weeks) or full MVP (8 weeks)?
 
 → [Type your answer]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### /startup-os ask <message>

Talk to your company. Message routes to relevant agents who respond.

**How routing works:**
1. `src/router.ts` analyzes your message + company state
2. Determines which agents should respond
3. Loads those agents' .md files
4. Executes their TypeScript
5. Returns responses

**Examples:**
```
/startup-os ask what should I work on today
→ Routes to: CEO

/startup-os ask legal, what are you watching
→ Routes to: Legal

/startup-os ask red team, what's my biggest risk
→ Routes to: Red Team

/startup-os ask let's focus on getting first customers
→ Routes to: CEO, Product, Sales, Red Team (in that order)
```

Agents respond with specific, actionable guidance grounded in actual company state.

### /startup-os status

Get real-time briefing from CEO on company state.

**What you get:**
- What company is focused on now
- What each department is doing (specific activities, not generic)
- Pending decisions that need your input
- Important signals worth knowing
- CEO's recommendation for what you should do today

**Example output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SecureCode · Status Briefing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 CURRENT FOCUS
 Validating core assumption with 5 security engineers

 DEPARTMENT STATUS
 Product    → Blocked on customer interviews
 Legal      → Watching - no issues
 Finance    → Runway: 18 months
 Red Team   → Challenging customer willingness to pay

 DECISIONS PENDING
 · Prototype vs MVP approach (blocking Product)

 RECOMMENDATION
 Talk to 3 security engineers this week before any building.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### /startup-os agents

List all active agents with current state.

**What you get:**
```
ACTIVE AGENTS (47 running)

● ceo               watching     Monitoring all departments
● cfo               watching     Tracking runway: 18mo
● product-direction steering     Defining MVP scope
● legal-compliance  watching     No issues flagged
● red-team          deciding     Challenging customer assumption
○ engineering       blocked      Waiting for spec

Talk to any agent:
→ /startup-os ask legal, explain the risk you flagged
→ /startup-os ask product, show me the roadmap
```

### /startup-os reset

Clear all company state and start over. Deletes `.startup-os/company.os.json`.

Use when pivoting or starting a new company.

### /startup-os debug <type>

Run code intelligence and health diagnostics on your codebase. The debug system is independent of the company build — you can run it on any codebase at any time.

**Available debuggers:**
- `react` — Diagnose React-specific issues (hooks, keys, props, effects, re-renders, a11y)
- `typescript` — Find type safety issues (any types, unsafe casts, missing types, dead code)
- `dependencies` — Audit packages (CVEs, outdated, unused, duplicates, peer deps)
- `performance` — Identify bottlenecks (re-renders, bundle size, images, blocking ops, memory leaks)
- `security` — Scan for vulnerabilities (secrets, XSS, SQL injection, weak auth, insecure deps)
- `all` — Run all five debuggers in parallel

**How it works:**
1. Debugger scans your codebase (not the company state)
2. Produces structured diagnosis report with severity levels
3. Provides exact code fixes ready to paste
4. Reports written to `debug-reports/` folder

**Examples:**
```
/startup-os debug react
→ Scans all .tsx/.jsx files for React issues
→ Outputs: debug-reports/react-diagnosis.md

/startup-os debug security
→ Scans for secrets, XSS, SQL injection, auth issues
→ Outputs: debug-reports/security-diagnosis.md

/startup-os debug all
→ Runs all 5 debuggers in parallel
→ Outputs: Full health report across all categories
```

**When to use:**
- Pre-commit: Before committing changes
- Pre-PR: Before creating pull request
- Weekly: Regular code health maintenance
- After dependency updates
- After major refactor

Unlike the business agents which build your company, the debuggers are pure code diagnostic tools that work on any codebase.

## How the runtime works

### 1. Load .md agents

`src/` runtime scans directories for `.md` files:
- `ceo/`, `cfo/`, `cto/`, `cmo/`, `cpo/`, `coo/` → executive agents
- `strategy/`, `product/`, `design/`, `engineering/`, `finance/`, `marketing/`, `sales/`, `people/`, `legal/`, `operations/`, `metrics/`, `security/`, `growth/`, `customer/`, `data/` → department agents
- `debug/` → code intelligence agents
- `core/` → generation syscalls

For each .md file:
- Parse frontmatter (YAML between `---`)
- Extract instructions (markdown)
- Extract TypeScript (code block)
- Extract coordination (markdown)

### 2. Execute agents

When agent triggered:
1. Load its .md file
2. Parse TypeScript block
3. Execute in sandbox with `company.os` context
4. Agent follows watch → reason → act → coordinate pattern
5. Write results back to `company.os.json`
6. Emit events for other agents to consume

### 3. Coordinate through state

Agents NEVER call each other directly. All coordination through `company.os.json`:

```typescript
// Agent A emits event
os.events.push({
  type: 'spec-written',
  from: 'product-direction',
  payload: { feature: 'auth' },
  timestamp: new Date().toISOString(),
  consumed: []
})

// Agent B watches for it
const triggers = os.events.filter(e =>
  e.type === 'spec-written' &&
  !e.consumed.includes('engineering')
)

// Agent B processes and marks consumed
e.consumed.push('engineering')
```

This prevents deadlocks, race conditions, and hidden dependencies.

## Agent structure

Every .md agent follows this format:

```markdown
---
name: agent-name
description: One-line what it does
department: which-department
role: steering | watcher | generator
watches:
  - what triggers this agent
---

## What this agent does
Plain English explanation

## Instructions
### WATCH
What conditions trigger this agent

### REASON
How it decides what to do

### ACT
What it does when triggered

### COORDINATE
How it tells other agents

## TypeScript
\`\`\`typescript
// Full implementation
export async function run(os: CompanyOS, context: string): Promise<string> {
  // Watch for triggers
  // Reason about what to do
  // Act on decision
  // Coordinate with other agents
  return response
}
\`\`\`

## Coordination
What this agent reads, emits, and who reacts
```

## File structure

```
startup-os/
├── .claude/
│   └── skills/
│       └── startup-os/
│           └── SKILL.md          ← This file
├── ceo/                          ← Executive agents (root level)
│   ├── strategy.md
│   ├── briefing.md
│   └── ...
├── cfo/
├── cto/
├── cmo/
├── cpo/
├── coo/
├── strategy/                     ← Department agents (root level)
│   ├── product-direction.md
│   ├── mvp.md
│   └── ...
├── finance/
│   ├── model.md
│   ├── pricing.md
│   └── ...
├── engineering/
│   └── security/
├── design/
├── marketing/
├── sales/
├── people/
├── legal/
├── operations/
├── metrics/
├── growth/
├── customer/
├── data/
├── debug/                        ← Code intelligence agents
│   ├── react-debugger.md
│   ├── typescript-debugger.md
│   ├── dependency-debugger.md
│   ├── performance-debugger.md
│   └── security-debugger.md
├── core/                         ← Generation syscalls
│   ├── generate-pdf.md
│   └── ...
├── templates/
├── src/                          ← Runtime (executes .md)
│   ├── company-os.ts
│   ├── router.ts
│   └── cli.ts
├── .startup-os/
│   └── company.os.json          ← Shared state
└── package.json
```

## Implementation

When you run `/startup-os build`:

1. Import runtime: `import { startupOS } from './dist/index.js'`
2. Create company: `const company = await startupOS.build(ideaString)`
3. Get clarifying questions: Display to user, collect answers
4. Apply answers: `await company.applyClarifications({ stage, customer, assumption })`
5. Runtime loads all .md agents from disk
6. Runtime initializes each agent's department state
7. Runtime boots agents in parallel
8. CEO agent runs first, gives briefing
9. Founder receives briefing, types response
10. Response routes through `src/router.ts` to relevant agents
11. Agents execute, update state, emit events
12. Other agents consume events in next cycle
13. Founder receives responses

## Current agents (70+ total)

**Executives (6 folders, 34 agents total):**
- **CEO (6 agents):** briefing, decisions, okrs, board, hiring, strategy
- **CFO (5 agents):** model, fundraising, budget, reporting, risk
- **CMO (5 agents):** positioning, campaigns, content, demand, brand
- **CTO (5 agents):** architecture, engineering-health, security-posture, infrastructure, build-vs-buy
- **CPO (5 agents):** vision, roadmap, discovery, metrics, launch
- **COO (5 agents):** operations, scaling, vendors, people-ops, process

**Strategy (5):** Product Direction, Idea Canvas, Competitive Intel, Personas, MVP

**Finance (4):** Model, Pricing, Unit Economics, Fundraising

**Legal (3):** Compliance, Entity, ToS/Privacy

**Design (3):** UI Designer, UX Designer, Brand Designer

**Engineering (3):** Code Review, CI, Type Safety
  - **Security (4):** Assumption Audit, Investor Pressure, Threat Model, Vuln Scan

**Marketing (3):** GTM Strategy, Email Sequences, Content Calendar

**Sales (3):** Playbook, CRM, Objection Handling

**People (3):** Culture, Job Description, Interview Kit

**Metrics (2):** KPI Framework, Investor Update

**Growth (2):** Growth Model, Demand Gen

**Customer (2):** Customer Success, Support

**Debug (5):** React, TypeScript, Dependencies, Performance, Security

**Core (4):** Generate PDF/CSV/HTML/SVG

## Adding new agents

To add a new agent:

1. Create `.md` file in appropriate directory
2. Follow the agent structure format above
3. Include complete TypeScript implementation
4. Runtime auto-discovers and loads it

No code changes needed - .md files ARE the code.

## Philosophy

**You never manage agents.** You just talk. The system:
- Routes your messages to relevant agents
- Agents watch, decide, act, coordinate
- You receive specific guidance grounded in actual state
- You answer questions, agents execute

This is a company running in Claude Code. Not a document generator. Not templates. A living operating system where AI agents are parallel processes coordinating through shared state.

You're not alone. You have a company.
