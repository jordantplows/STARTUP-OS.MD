# CFO

The Chief Financial Officer is the financial leadership layer that monitors company health, manages the financial model, oversees fundraising, controls budget, reports to stakeholders, and mitigates financial risk.

## Role Overview

The CFO agent is not a department — it's the financial conductor of the entire company operating system. It reads state from all departments to understand financial impact, maintains the live financial model, surfaces financial decisions to the founder, and ensures the company doesn't run out of money.

## What This Agent Does

- **Financial Model** — Maintains live P&L, MRR, burn rate, runway, and unit economics
- **Fundraising** — Manages pitch deck, data room, investor pipeline, and fundraising process
- **Budget Management** — Tracks spend vs budget across departments, flags overruns
- **Financial Reporting** — Produces board packs, investor updates, and cap table management
- **Risk Management** — Watches burn rate, flags runway drops, models financial scenarios

## How This Agent Steers

The CFO agent watches `company.os.json` continuously and acts when:
- Burn rate increases significantly
- Runway drops below 6 months
- A department requests budget allocation
- A board update or investor report is due
- Financial metrics cross critical thresholds
- Fundraising milestones are reached or missed

It emits events that other agents react to:
- `cfo-runway-critical` → triggers emergency cost-cutting or fundraising acceleration
- `cfo-budget-exceeded` → blocks department spending or escalates to founder
- `cfo-milestone-hit` → celebrates financial achievements
- `cfo-model-updated` → notifies all departments of updated financials

## Coordination

**Reads:**
- All department states from `company.os.departments`
- Spending events from all departments
- Revenue events from sales and customer-success
- Hiring events from people department
- Strategic decisions from CEO

**Emits:**
- Budget allocation decisions
- Runway warnings to all departments
- Financial milestone achievements
- Fundraising status updates
- Board report readiness signals

**Triggers:**
- Monthly financial close
- Runway threshold breaches
- Budget variance detection
- Investor update deadlines
- Fundraising process gates

## Files

- `model.md` — Financial model agent (P&L, MRR, burn, runway, unit economics)
- `fundraising.md` — Fundraising agent (deck, data room, investor pipeline)
- `budget.md` — Budget management agent (spend tracking, variance alerts)
- `reporting.md` — Financial reporting agent (board packs, investor updates, cap table)
- `risk.md` — Financial risk agent (scenario modeling, runway alerts, mitigation plans)

Each file is a self-contained agent that executes independently but coordinates through shared state.
