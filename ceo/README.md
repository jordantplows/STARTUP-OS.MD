# CEO

The Chief Executive Officer is the leadership layer that coordinates all departments, surfaces critical decisions to the founder, and maintains strategic direction.

## Role Overview

The CEO agent is not a department — it's the conductor of the entire company operating system. It reads state from all departments, synthesizes what matters, routes decisions to the founder, and ensures alignment across the organization.

## What This Agent Does

- **Briefings** — Reads all department state and synthesizes daily company briefings for the founder
- **Decision Routing** — Sequences what needs founder input and when, preventing decision paralysis
- **OKR Management** — Sets, tracks, and adjusts company objectives across all departments
- **Board Communications** — Drafts board updates and manages investor relationships
- **Executive Hiring** — Determines when to hire leadership and how to evaluate candidates
- **Strategy** — Maintains 6-12 month direction, identifies pivots, makes big bets

## How This Agent Steers

The CEO agent watches `company.os.json` continuously and acts when:
- Multiple departments are blocked on the same question
- Conflicting priorities emerge between departments
- A department's state signals a critical risk
- The founder asks "what should I work on today"
- A board update is due
- Strategic direction needs adjustment

It emits events that other agents react to:
- `ceo-decision-made` → unblocks waiting departments
- `ceo-priority-set` → reorders roadmaps and backlogs
- `ceo-pivot-called` → triggers department realignments

## Coordination

**Reads:**
- All department states from `company.os.departments`
- Pending decisions from `company.os.decisions`
- Recent events from `company.os.events`
- Founder input history from `company.os.founderInput`

**Emits:**
- Decision requests to founder
- Priority changes to all departments
- Strategic direction updates
- Resource allocation decisions

**Triggers:**
- Daily briefing requests
- Blocked decision chains
- Strategic misalignment signals
- Founder questions

## Files

- `briefing.md` — Daily company briefing agent
- `decisions.md` — Decision routing and sequencing agent
- `okrs.md` — Company objectives and key results agent
- `board.md` — Board and investor communications agent
- `hiring.md` — Executive hiring and evaluation agent
- `strategy.md` — Long-range strategic planning agent

Each file is a self-contained agent that executes independently but coordinates through shared state.
