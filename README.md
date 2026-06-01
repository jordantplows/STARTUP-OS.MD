# startup-os

[![npm version](https://img.shields.io/npm/v/startup-os)](https://www.npmjs.com/package/startup-os)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> An AI-powered operating system for startups. One slash command in Claude Code instantiates your entire company as parallel steering agents.

## What it is

startup-os is a programming language for companies. Each `.md` file is an autonomous agent. The TypeScript runtime executes them as parallel processes. They coordinate through `company.os.json` shared state — no direct agent-to-agent calls. You are the only human. Your job is to answer questions agents surface. Everything else runs autonomously.

This is not a document generator. This is a company operating system where agents watch, decide, steer, and coordinate continuously.

## Install

```bash
npm install -g startup-os
```

## Usage

Open any project in Claude Code and run:

```
/startup-os build "your startup idea"
```

You'll answer 3 questions. Then 95+ agents spawn in parallel and the CEO gives you a company briefing.

## What gets built

| Folder | What it does |
|--------|--------------|
| **outreach/** | Cold email, LinkedIn, investor outreach, community engagement |
| **investor/** | Pitch deck (auto-updating), data room, target VCs, narrative, term sheet analysis |
| **research/** | Daily customer signals, weekly competitor intel, trend scanner, interview synthesis |
| **network/** | Advisor identification, partnerships, press outreach, accelerator evaluation |
| **ceo/** | Morning brief, decisions, OKRs, board prep, hiring, strategy |
| **cfo/** | Financial model, fundraising, budget, reporting, risk, data room |
| **cmo/** | Positioning, campaigns, content, demand gen, brand |
| **cto/** | Architecture, engineering health, security posture, infrastructure, build-vs-buy |
| **cpo/** | Vision, roadmap, discovery, metrics, launch, feedback loop, pricing, changelog, A/B tests |
| **coo/** | Operations, scaling, vendors, people ops, process |
| **strategy/** | Product direction, competitive intel, personas, MVP definition |
| **finance/** | Model, pricing, unit economics, fundraising |
| **legal/** | Compliance, entity, ToS/Privacy |
| **design/** | UI, UX, brand designers |
| **engineering/** | Code review, CI, type safety, security |
| **marketing/** | GTM strategy, email sequences, content calendar |
| **sales/** | Playbook, CRM, objection handling |
| **people/** | Culture, job descriptions, interview kits |
| **operations/** | Process design, vendor management |
| **metrics/** | KPI framework, investor updates |
| **growth/** | Growth model, demand gen, SEO, content strategy |
| **customer/** | Customer success, support, CX design |
| **data/** | Analytics, ML engineering, BI |
| **debug/** | React, TypeScript, dependencies, performance, security diagnostics |
| **core/** | PDF/CSV/HTML/SVG generation |
| **templates/** | Reusable agent templates |

## Commands

| Command | What it does |
|---------|-------------|
| `/startup-os build "<idea>"` | Instantiates company from idea |
| `/startup-os brief` | Morning company briefing |
| `/startup-os customers` | Customer acquisition pipeline state |
| `/startup-os investors` | Fundraising readiness check |
| `/startup-os research "<topic>"` | Research agents on demand |
| `/startup-os dashboard` | Opens HTML company cockpit |
| `/startup-os schedule` | View/adjust agent run schedules |
| `/startup-os status` | Full company status briefing |
| `/startup-os ask <msg>` | Talk to relevant agents |
| `/startup-os agents` | List all active agents |
| `/startup-os reset` | Clear all state, start over |
| `/doctor react` | React error diagnosis |
| `/doctor typescript` | TypeScript safety audit |
| `/doctor dependencies` | Package vulnerability scan |
| `/doctor performance` | Bottleneck identification |
| `/doctor security` | Security vulnerability scan |
| `/doctor all` | Full codebase diagnosis |

## How agents coordinate

Agents communicate exclusively through `company.os.json` — the shared nervous system. Each agent reads state before acting, writes state after acting, and emits events other agents consume. This prevents deadlocks and hidden dependencies. Agents run in parallel. The scheduler wakes agents on cron schedules (daily briefs, weekly competitive intel). Webhooks wake agents on external events (Stripe payment → CFO updates model). The audit log records every decision immutably.

## Runtime systems

- **Memory** (`.memory/`) — Agents persist context across sessions
- **Scheduler** — Cron-based agent scheduling (daily/weekly runs)
- **Webhooks** — Inbound event handler (Stripe, GitHub, forms)
- **Audit log** (`.audit/`) — Immutable action history
- **Dashboard** — HTML company cockpit showing all agent states

## Requirements

- Node.js 20+
- Claude Code
- `ANTHROPIC_API_KEY`

## License

MIT

---

**This is a company runtime, not a document generator.**  
Programs are agents. Runtime is Claude Code. Founder is the only human.
