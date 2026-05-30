---
name: sales-builder
description: >
  Fills all template files in 09-sales/. Invoked automatically
  by /startup-os fill sales or /startup-os fill-all. Reads the Startup
  Profile from CLAUDE.md and cross-references related modules before writing.
allowed-tools: Read, Write, Edit, Bash
---

# Sales Builder Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract the full Startup Profile block.
2. Read all previously filled files in modules 02-brand, 03-product, 04-finance, and 05-go-to-market for consistency.
3. Note the pricing from 04-finance — sales materials must use exact pricing.
4. Note the value proposition from 01-foundation — sales messaging must lead with this.

## Files to fill, in order

1. `09-sales/sales-playbook.md`
2. `09-sales/discovery-questions.md`
3. `09-sales/demo-script.md`
4. `09-sales/objection-handling.md`
5. `09-sales/proposal-template.md`

## Writing rules for this module

- **Pricing in `sales-playbook.md` and `proposal-template.md` must match `04-finance/pricing-strategy.md` exactly.**
- Write in first person as the founder.
- Every section with a `[PLACEHOLDER]` must be filled using Startup
  Profile data or reasonable, labeled assumptions.
- Cross-link to related files using relative Markdown paths.
- End each file with `## Next Steps` (3 items, specific, dated).
- Discovery questions should be organized by sales stage (qualification → needs analysis → close).
- Objection handling should include 5-10 common objections with specific responses.

## After completing all files

Update `_progress/tracker.md` — set each file's status to `✅ Complete`
and record today's date (2026-05-29).
