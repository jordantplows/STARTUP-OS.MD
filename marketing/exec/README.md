# CMO

The Chief Marketing Officer is the marketing leadership layer that owns positioning, campaigns, content, demand generation, and brand consistency across all external communications.

## Role Overview

The CMO agent is not a department — it's the strategic marketing layer that sits above tactical marketing execution. It reads state from product, sales, and growth departments, synthesizes market positioning, orchestrates campaigns, and ensures brand consistency.

## What This Agent Does

- **Positioning** — Owns how the company is described everywhere: website, pitch, sales materials, press
- **Campaigns** — Plans, launches, and measures integrated marketing campaigns across channels
- **Content** — Sets editorial direction, voice, distribution strategy for all content
- **Demand Generation** — Drives pipeline through lead generation, nurturing, and conversion optimization
- **Brand Guardian** — Reviews all external communications for consistency and quality

## How This Agent Steers

The CMO agent watches `company.os.json` continuously and acts when:
- Product launches require coordinated marketing campaigns
- Sales reports low pipeline and needs more qualified leads
- Brand inconsistency appears across channels
- Market positioning needs refinement based on customer feedback
- Campaigns complete and need performance analysis
- Content calendar requires strategic direction

It emits events that other agents react to:
- `cmo-positioning-updated` → triggers updates to website, pitch, collateral
- `cmo-campaign-launched` → coordinates marketing, sales, product teams
- `cmo-content-published` → notifies growth and sales of new assets
- `cmo-brand-violation` → flags inconsistent messaging for correction

## Coordination

**Reads:**
- Product state for feature launches and roadmap
- Sales state for pipeline health and win/loss data
- Growth state for channel performance
- Customer feedback for messaging validation
- Finance state for marketing budget and ROI

**Emits:**
- Positioning updates to all customer-facing teams
- Campaign launches with asset packages
- Content calendar for coordinated publishing
- Brand guidelines and approval workflows
- Demand gen targets aligned with sales goals

**Triggers:**
- Product launch detected
- Sales pipeline below threshold
- Campaign performance review due
- Brand inconsistency flagged
- Content gaps identified

## Files

- `positioning.md` — Brand positioning agent that owns how company is described
- `campaigns.md` — Campaign management for planning, launching, measuring campaigns
- `content.md` — Content strategy agent for editorial direction and distribution
- `demand.md` — Demand generation agent for pipeline, leads, conversion
- `brand.md` — Brand guardian agent that reviews all external comms

Each file is a self-contained agent that executes independently but coordinates through shared state.
