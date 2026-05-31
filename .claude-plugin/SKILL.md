---
name: startup-os
description: >
  A programming language for companies. Instantiates parallel steering agents
  that watch, decide, and coordinate to run a startup. The founder talks to
  agents in Claude Code. Agents surface decisions. Company runs continuously.
argument-hint: 'build "<idea>" | ask <message> | status | agents | reset'
allowed-tools: Read, Write, Bash, Edit
---

# startup-os · company runtime

This is not a document generator. This is a company operating system.

When you run `/startup-os build` you instantiate a living company where
AI agents are parallel processes coordinating through shared state in
`company.os.json`.

The CEO agent doesn't write a CEO document — it acts as CEO.
The legal agent doesn't generate templates — it watches every decision.
The product agent doesn't produce a roadmap PDF — it maintains the living roadmap.

The founder is the only human. Their job is to answer questions agents surface.

## Commands

### /startup-os build "<idea>"

Instantiate a new company from an idea string.

Process:
1. Parse the idea and ask 3 clarifying questions
2. Spawn all agents in parallel (CEO, CFO, Product, Legal, Red Team, etc.)
3. Each agent initializes its domain knowledge for this company
4. CEO gives first briefing with cross-department status
5. Company runs continuously in Claude Code

### /startup-os ask <message>

Talk to your company. Message is routed to relevant agents who respond.

Examples:
- `/startup-os ask what should I work on today`
- `/startup-os ask legal, what are you watching`
- `/startup-os ask give me the product roadmap`
- `/startup-os ask red team, what's my biggest risk`

### /startup-os status

Get a briefing from the CEO on current company state:
- What the company is focused on
- What each department is doing (specific activities)
- Pending decisions that need founder input
- Important signals worth knowing
- CEO's recommendation for today

### /startup-os agents

List all active agents with their current state:
- Status (watching, deciding, steering, blocked)
- Current focus
- Last action taken
- Pending decisions

### /startup-os reset

Clear all company state and start over. Use when pivoting or restarting.

## How It Works

### company.os.json — Shared State

Every agent reads this before acting. Every agent writes to it after acting.
It's the nervous system of the company.

Contains:
- Company profile (identity, stage, customers, problem)
- Department states (status, focus, memory, signals)
- Decisions in flight (questions waiting for answers)
- Events (how agents trigger each other)
- MCP connections (external tools wired in)
- Founder input log

### Agents Are Processes

Each agent has four behaviors:

**WATCH**: Conditions that trigger the agent to wake up
- CEO watches for: blocked departments, conflicts, unanswered founder input
- Legal watches for: all decisions, new MCP connections, data handling
- Product watches for: customer signals, spec requests, MVP definition needs
- Red Team watches for: assumptions, confident statements, critical decisions

**REASON**: Decide what to do when a watch fires
- Read relevant context from company.os
- Apply domain expertise
- Determine: handle myself, need input, need to block, escalate

**ACT**: Take action in domain
- Write decision to company.os
- Emit event other agents react to
- Surface question to founder
- Update department state

**COORDINATE**: Let other agents know
- Emit events to company.os
- Mark events as consumed
- Trigger dependent agents

### The Founder Conversation

The founder never runs specific commands to manage agents.
They just talk. The system routes their message to the right agents.

Agents respond in Claude Code with specific, actionable updates.

## Implementation

Run the skill by importing the runtime:

```typescript
import { startupOS } from './runtime/src/index.js'

// Initialize from current directory state
const company = await startupOS.load()

// Or build new company
const company = await startupOS.build(ideaString)

// Route founder input
const responses = await company.ask(message)

// Get status
const status = await company.status()
```

The runtime manages:
- Agent lifecycle (spawn, run, coordinate)
- State persistence (company.os.json)
- Event routing
- Decision tracking
- Founder conversation flow
