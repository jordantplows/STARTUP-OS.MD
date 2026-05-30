---
name: hiring-builder
description: >
  Fills all template files in 07-hiring/. Invoked automatically
  by /startup-os fill hiring or /startup-os fill-all. Reads the Startup
  Profile from CLAUDE.md and cross-references related modules before writing.
allowed-tools: Read, Write, Edit, Bash
---

# Hiring Builder Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract the full Startup Profile block.
2. Read all previously filled files in modules 02-brand and 03-product for consistency.
3. Note the company voice from 02-brand — job descriptions must reflect this voice.

## Files to fill, in order

1. `07-hiring/culture-doc.md`
2. `07-hiring/job-description-template.md`
3. `07-hiring/interview-kit.md`
4. `07-hiring/offer-letter-template.md`
5. `07-hiring/onboarding-checklist.md`

## Writing rules for this module

- **Every job description must include a salary range. Pull culture values verbatim from `07-hiring/culture-doc.md`.**
- Write in first person as the founder.
- Every section with a `[PLACEHOLDER]` must be filled using Startup
  Profile data or reasonable, labeled assumptions.
- Cross-link to related files using relative Markdown paths.
- End each file with `## Next Steps` (3 items, specific, dated).
- Culture doc should include 4-6 core values with 2-3 sentences explaining each.
- Interview kit should include specific questions organized by competency.

## After completing all files

Update `_progress/tracker.md` — set each file's status to `✅ Complete`
and record today's date (2026-05-29).
