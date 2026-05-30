---
name: metrics-builder
description: >
  Fills all template files in 10-metrics/. Invoked automatically
  by /startup-os fill metrics or /startup-os fill-all. Reads the Startup
  Profile from CLAUDE.md and cross-references related modules before writing.
allowed-tools: Read, Write, Edit, Bash
---

# Metrics Builder Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract the full Startup Profile block.
2. Read all previously filled files across all modules for consistency.
3. Note the success metrics from 03-product and unit economics from 04-finance — KPIs must
   track these core numbers.

## Files to fill, in order

1. `10-metrics/kpi-framework.md`
2. `10-metrics/dashboard-mockup.md`
3. `10-metrics/investor-update.md`
4. `10-metrics/weekly-review.md`
5. `10-metrics/north-star-metric.md`

## Writing rules for this module

- **Every KPI must have a named owner, a data source, and a current baseline. North Star metric must connect to at least 3 input metrics.**
- Write in first person as the founder.
- Every section with a `[PLACEHOLDER]` must be filled using Startup
  Profile data or reasonable, labeled assumptions.
- Cross-link to related files using relative Markdown paths.
- End each file with `## Next Steps` (3 items, specific, dated).
- KPI framework should organize metrics into: Acquisition, Activation, Retention, Revenue, Referral.
- Weekly review template should include specific prompts for what to report.

## After completing all files

Update `_progress/tracker.md` — set each file's status to `✅ Complete`
and record today's date (2026-05-29).
