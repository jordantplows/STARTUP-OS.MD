# startup-os

[![npm version](https://img.shields.io/npm/v/@jordan.plows/startup-os)](https://www.npmjs.com/package/@jordan.plows/startup-os)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A programming language for companies. Instantiate parallel AI agents that watch, decide, and coordinate to run your startup.

This is not a document generator. This is a company operating system.

## What It Actually Is

**startup-os** is a programming language where the programs are company departments and the runtime is Claude Code.

When you run `/startup-os build` you don't generate documents. You instantiate a company. Every agent is a live process that watches, decides, and steers — continuously, in parallel, coordinating through shared state.

- The **CEO agent** doesn't write a CEO document. It acts as CEO — reading everything happening across all departments, making decisions, resolving conflicts, and surfacing questions to you.

- The **legal agent** doesn't generate legal templates. It watches every decision every other agent makes, flags risks, and blocks anything dangerous.

- The **product agent** doesn't produce a roadmap PDF. It maintains the living roadmap, prioritizes work as signals come in, writes specs when engineering needs them, and escalates blockers to the CEO.

**The founder is the only human.** Your job is to answer the questions agents surface. Everything else the company does is run by agents.

## Quick Start

```bash
# In Claude Code
/startup-os build "AI-powered code review for security teams"
```

You'll answer 3 clarifying questions. Then:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Instantiating your company...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agents starting:
● CEO          → coordinating
● Legal        → watching
● Product      → defining MVP
● Red Team     → challenging assumptions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 [COMPANY NAME] · CEO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 WHAT WE'RE BUILDING
 [AI-powered code review that catches security issues before
  they reach production. Targeted at security teams at Series B+
  startups who are drowning in manual review.]

 WHAT I'M FOCUSED ON
 Validating core assumption: security teams actually want
 automated review before manual review.

 WHAT YOUR DEPARTMENTS ARE DOING
 Product    → Defining minimum testable feature set
 Legal      → Flagged: review AI liability for false negatives
 Red Team   → Challenging: "security teams are cheap with tools"

 FIRST DECISION I NEED FROM YOU
 Do you want to test this with a prototype integration
 (2 weeks, narrow test) or build a full MVP (8 weeks, broader
 launch)? Product says prototype. Red Team says neither will
 validate willingness to pay.

 → [You type your answer here]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Your company is now running. Agents surface decisions. You answer. They steer.

## How It Works

### company.os.json — The Nervous System

Every agent reads this before acting. Every agent writes to it after acting.

```typescript
interface CompanyOS {
  profile: StartupProfile           // Company identity
  departments: DepartmentStates     // Each agent's state
  decisions: Decision[]             // Questions waiting for answers
  events: Event[]                   // How agents trigger each other
  mcps: MCPConnections             // External tools wired in
  founderInput: FounderInput[]     // Conversation log
}
```

### Agents Are Parallel Processes

Each agent has four behaviors:

1. **WATCH** — Conditions that trigger the agent to wake up
2. **REASON** — Decide what to do when a watch fires
3. **ACT** — Take action in its domain
4. **COORDINATE** — Emit events other agents react to

Agents communicate only through `company.os.json`. No direct calls. This keeps them autonomous and prevents deadlocks.

### Current Agents

- **CEO** — Coordinates departments, surfaces critical decisions, gives status briefings
- **Legal** — Watches every decision for risk, flags compliance issues, blocks dangerous moves
- **Product** — Defines what gets built, prioritizes work, writes specs on demand
- **Red Team** — Challenges every assumption, asks the hardest questions, surfaces what could kill the company

More agents coming: CFO, CTO, CMO, Engineering, Growth, Finance, Marketing, Sales.

## Commands

### /startup-os build "<idea>"

Instantiate a company from an idea. You'll answer 3 questions. Then all agents spawn in parallel and the CEO gives you a briefing.

### /startup-os ask <message>

Talk to your company. Your message routes to relevant agents who respond.

Examples:
```
/startup-os ask what should I work on today
/startup-os ask legal, what are you watching
/startup-os ask give me the product roadmap
/startup-os ask red team, what's my biggest risk
```

### /startup-os status

Get a real-time briefing from the CEO on company state:
- What the company is focused on
- What each department is doing (specific, not generic)
- Pending decisions that need your input
- Important signals worth knowing
- CEO's recommendation for what you should do today

### /startup-os agents

List all active agents with their current state, status, and focus.

### /startup-os reset

Clear all company state and start over.

## The Founder Conversation

You never run specific commands to manage agents. You just talk in Claude Code. The system routes your message to the right agents.

```
You: "what should I work on today"

CEO:  Based on current state, your highest leverage activity
      is talking to 3 security engineers about their review
      process. Product is blocked on whether to build auth
      ourselves. Legal flagged GDPR risk in email sequences.

      What's your instinct on auth — build or buy?
```

The agents respond with specific, actionable updates grounded in actual company state. Never generic. Always relevant.

## What Gets Built

A company that runs in Claude Code with:

- A CEO that coordinates the whole company
- A CFO that watches money and models scenarios
- A CMO that shapes how the company presents itself
- A CTO that watches technical decisions
- A CPO that owns product direction
- A product team that manages what gets built
- An engineering team that reviews what's built
- A growth team that finds customers
- A legal team that flags risk in everything
- A finance team that models the numbers
- A people team that thinks about culture and hiring
- An operations team that manages how work gets done
- A metrics team that tracks what matters
- A security team that watches for threats
- A red team that challenges everything

All running in parallel. All coordinating through `company.os.json`. All talking to you through Claude Code.

You answer questions. The company runs.

## Architecture

See [runtime/README.md](./runtime/README.md) for technical details on:
- State management (`company-os.ts`)
- Agent lifecycle (`agent-runtime.ts`)
- Event communication protocol
- Adding new agents

## Requirements

- [Claude Code](https://claude.com/code) 2.1.101+
- Node.js 20+
- Anthropic API key (set `ANTHROPIC_API_KEY`)

## Installation

```bash
# Install as Claude Code plugin
claude plugin install github:jordantplows/startup-os

# Or clone and build
git clone https://github.com/jordantplows/startup-os.git
cd startup-os
npm install
npm run build
```

## Contributing

This is v0.3.0 — the foundational runtime is built. Next:

- More agents (CFO, CTO, CMO, Engineering, Growth, etc.)
- MCP integrations (GitHub, Linear, Slack, etc.)
- Multi-founder mode (agents route to correct founder)
- Agent memory (long-term learning across sessions)

See issues for what's being built next.

## License

MIT

---

**This is a company runtime, not a document generator.**  
Programs are departments. Runtime is Claude Code. Founder is the only human.
