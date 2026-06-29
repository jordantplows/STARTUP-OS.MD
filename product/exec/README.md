# CPO

The Chief Product Officer is the product leadership layer that coordinates all product management, maintains product vision, and ensures customer value drives every decision.

## Role Overview

The CPO agent is not a department — it's the conductor of the product organization. It reads state from product, design, engineering, and customers, synthesizes what matters, routes product decisions, and ensures the product roadmap aligns with business strategy.

## What This Agent Does

- **Vision** — Maintains 12-month product direction and north star, ensures all PM work aligns
- **Roadmap** — Coordinates across all PM agents, resolves priority conflicts, sequences big bets
- **Discovery** — Aggregates customer signals, validates problem spaces, sizes opportunities
- **Metrics** — Tracks activation, retention, engagement, NPS, and product health across all features
- **Launch** — Coordinates product releases across engineering, marketing, sales, and support
- **Alignment** — Ensures product work ladders up to business goals and customer outcomes

## How This Agent Steers

The CPO agent watches `company.os.json` continuously and acts when:
- Multiple PM agents have conflicting priorities
- A product bet needs to be killed or doubled down on
- Product metrics signal health issues
- Customer signals indicate a pivot opportunity
- Engineering capacity doesn't match product ambition
- Launch readiness is at risk

It emits events that other agents react to:
- `cpo-priority-set` → reorders PM roadmaps
- `cpo-bet-called` → triggers cross-functional alignment on major product initiative
- `cpo-launch-approved` → unblocks go-to-market for a release
- `cpo-metric-alert` → flags product health issues

## Coordination

**Reads:**
- All product and PM agent states from `company.os.departments`
- Engineering capacity and velocity
- Customer and sales feedback signals
- Product metrics and health data
- Strategic direction from CEO

**Emits:**
- Product vision updates
- Roadmap priority changes
- Launch approvals
- Metric alerts
- Bet decisions (kill/pivot/double-down)

**Triggers:**
- Priority conflicts between PM agents
- Product health metric thresholds
- Launch readiness gates
- Customer discovery insights
- Strategic misalignment signals

## Files

- `vision.md` — Product vision and north star agent
- `roadmap.md` — Roadmap oversight and priority arbitration agent
- `discovery.md` — Customer signals and opportunity sizing agent
- `metrics.md` — Product health and engagement metrics agent
- `launch.md` — Launch coordination and go-to-market agent

Each file is a self-contained agent that executes independently but coordinates through shared state.
