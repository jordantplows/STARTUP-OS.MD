---
name: finance-builder
description: >
  Fills all template files in 04-finance/. Invoked automatically
  by /startup-os fill finance or /startup-os fill-all. Reads the Startup
  Profile from CLAUDE.md and cross-references related modules before writing.
allowed-tools: Read, Write, Edit, Bash
---

# Finance Builder Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract the full Startup Profile block.
2. Read all previously filled files in modules 01-foundation, 02-brand, and 03-product for consistency.
3. Note the target market size from 01-foundation — revenue projections must be realistic
   given TAM/SAM/SOM.

## Files to fill, in order

1. `04-finance/financial-model.md`
2. `04-finance/pricing-strategy.md`
3. `04-finance/unit-economics.md`
4. `04-finance/fundraising-deck.md`
5. `04-finance/cap-table.md`

## Writing rules for this module

- **Show all formulas. Label every number as `[assumption]` or `[derived]`. Revenue in `financial-model.md` must use the exact price points from `pricing-strategy.md`.**
- Write in first person as the founder.
- Every section with a `[PLACEHOLDER]` must be filled using Startup
  Profile data or reasonable, labeled assumptions.
- Cross-link to related files using relative Markdown paths.
- End each file with `## Next Steps` (3 items, specific, dated).
- Financial model must include: revenue, COGS, gross margin, operating expenses, burn rate, runway.
- Unit economics must show CAC, LTV, LTV:CAC ratio, and payback period.
- All numbers must be internally consistent across all 5 files.

## After completing all files

Update `_progress/tracker.md` — set each file's status to `✅ Complete`
and record today's date (2026-05-29).
