---
name: startup-os
description: >
  Run the entire startup-os system for a given idea. One command
  builds every department's output in the correct order.
argument-hint: 'build "<your startup idea>" | run <dept> [<agent>] | status | reset'
allowed-tools: Read, Write, Bash, Agent, Edit, Skill
---

# startup-os

## /startup-os build "<idea>"

The master build command. Runs the entire company OS for a startup
described in plain English.

### Step 0 — Parse the idea

Read the idea string the user passed. Call Claude to extract and
write the following fields into the `## Startup Profile` block in
`CLAUDE.md`:

- Company Name: infer a working name from the idea (can be changed later)
- One-line: distill the idea to one sentence
- Industry: the primary industry vertical
- Business Model: B2B SaaS / B2C / Marketplace / Agency / Hardware
- Target Customer: the most specific description of who buys this
- Problem: the core pain being solved
- Stage: idea
- Location: ask the user for this before proceeding, or default to "Remote"
- Founders: ask the user, or default to 1
- Fundraising Goal: infer from business model, or ask
- Launch Target: default to "6 months from today"

Print the populated profile and ask: "Does this look right? Reply
'yes' to start the build or correct anything above."

Wait for confirmation before proceeding.

### Step 1 — Strategy

Run all agents in `strategy/` in this order:
1. `strategy/idea-canvas.md`
2. `strategy/market-research.md`
3. `strategy/competitor-analysis.md`
4. `strategy/lean-canvas.md`

After each agent completes, update the Build Log in `CLAUDE.md`:
- Set status to `✅ done`
- Record number of files written
- Record timestamp

Print a one-line summary after each agent:
`✓ strategy/idea-canvas → strategy/output/idea-canvas-filled.md`

After all strategy agents complete, print:
```
━━ strategy complete ━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ idea canvas         ✓ market research
  ✓ competitor analysis ✓ lean canvas
  → continuing to brand...
```

### Step 2 — Brand

Run all agents in `brand/` in this order:
1. `brand/brand-brief.md`         (reads: strategy outputs)
2. `brand/voice-and-tone.md`      (reads: brand-brief output)
3. `brand/naming-guide.md`        (reads: brand-brief output)
4. `brand/visual-identity.md`     (reads: brand-brief, voice output)
5. `brand/pitch-deck.md`          (reads: all strategy + brand outputs)

Print progress. Update Build Log. Print department summary.

### Step 3 — Product

Run all agents in `product/` in this order:
1. `product/personas.md`          (reads: strategy + brand outputs)
2. `product/mvp.md`               (reads: lean canvas + personas)
3. `product/roadmap.md`           (reads: mvp + personas)
4. `product/sprint.md`            (reads: roadmap, sprint number = 1)
5. `product/prd.md`               (reads: mvp, generates first feature PRD)

Print progress. Update Build Log. Print department summary.

### Step 4 — Finance

Run all agents in `finance/` in this order:
1. `finance/pricing.md`           (reads: market research + competitor analysis)
2. `finance/model.md`             (reads: pricing + startup profile)
3. `finance/unit-economics.md`    (reads: financial model)
4. `finance/cap-table.md`         (reads: startup profile + stage)
5. `finance/fundraising.md`       (reads: all finance outputs)

Print progress. Update Build Log. Print department summary.

### Step 5 — Marketing

Run all agents in `marketing/` in this order:
1. `marketing/gtm-strategy.md`    (reads: personas + brand + lean canvas)
2. `marketing/email-sequences.md` (reads: gtm + voice-and-tone)
3. `marketing/content-calendar.md`(reads: gtm + voice-and-tone)
4. `marketing/seo.md`             (reads: gtm + market research)
5. `marketing/launch.md`          (reads: all marketing + product outputs)

Print progress. Update Build Log. Print department summary.

### Step 6 — Sales

Run all agents in `sales/` in this order:
1. `sales/crm.md`                 (reads: gtm + personas)
2. `sales/playbook.md`            (reads: gtm + personas + pricing)
3. `sales/objection-handling.md`  (reads: sales playbook + pricing)
4. `sales/proposal.md`            (reads: sales playbook, generates template)

Print progress. Update Build Log. Print department summary.

### Step 7 — Legal

Run all agents in `legal/` in this order:
1. `legal/entity.md`              (reads: startup profile)
2. `legal/founder-agreement.md`   (reads: startup profile + cap table)
3. `legal/ip.md`                  (reads: product outputs + tech stack if exists)
4. `legal/compliance.md`          (reads: product + marketing outputs)

Print progress. Update Build Log. Print department summary.

### Step 8 — People

Run all agents in `people/` in this order:
1. `people/culture.md`            (reads: brand-brief + startup profile)
2. `people/onboarding.md`         (reads: culture + tech stack if exists)
3. `people/job-description.md`    (reads: culture, generates for first hire from roadmap)
4. `people/interview-kit.md`      (reads: culture + job description)
5. `people/offer-letter.md`       (reads: culture + job description, generates template)

Print progress. Update Build Log. Print department summary.

### Step 9 — Operations

Run all agents in `operations/` in this order:
1. `operations/tech-stack.md`     (reads: product + finance + all dept outputs)
2. `operations/sop.md`            (reads: culture + tech stack)
3. `operations/meetings.md`       (reads: culture + startup profile)
4. `operations/vendors.md`        (reads: tech stack)

Print progress. Update Build Log. Print department summary.

### Step 10 — Metrics

Run all agents in `metrics/` in this order:
1. `metrics/kpis.md`              (reads: gtm + financial model + product)
2. `metrics/north-star.md`        (reads: kpis + lean canvas)
3. `metrics/weekly-review.md`     (reads: kpis, generates blank template)
4. `metrics/investor-update.md`   (reads: kpis + financial model, generates template)

Print progress. Update Build Log. Print department summary.

### Step 11 — Security

Run all agents in `security/` in this order:
1. `security/threat-model.md`     (reads: tech stack + product outputs)
2. `security/vuln-scan.md`        (scans all dept folders)
3. `security/dependency-audit.md` (reads: root package.json)
4. `security/secrets-scan.md`     (scans entire repo)
5. `security/compliance.md`       (reads: legal + marketing outputs)

Print progress. Update Build Log. Print department summary.

### Step 12 — Engineering

Run all agents in `engineering/` in this order:
1. `engineering/type-safety.md`   (scans all .md TypeScript blocks)
2. `engineering/code-review.md`   (reviews recent changes)
3. `engineering/test-coverage.md` (checks coverage gaps)
4. `engineering/ci.md`            (validates or generates CI config)
5. `engineering/performance.md`   (benchmarks all agents)

Print progress. Update Build Log. Print department summary.

### Step 13 — Final summary

After all 12 departments complete, print:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  startup-os build complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Company:     [Company Name]
  Idea:        [One-line description]
  Departments: 12 complete
  Files:       [total count] written
  Duration:    [elapsed time]

  Key outputs:
  → strategy/output/lean-canvas-filled.md
  → brand/output/pitch-deck.md
  → product/output/roadmap-filled.md
  → finance/output/financial-model.md
  → marketing/output/gtm-strategy.md
  → sales/output/sales-playbook.md
  → _reports/security/threat-model.md

  Recommended next steps:
  1. Review strategy/output/lean-canvas-filled.md — your foundation
  2. Share brand/output/pitch-deck.md with advisors for feedback
  3. Run /startup-os status to see detailed progress

  Commands:
  /startup-os run <dept> [<agent>] — re-run one department or agent
  /startup-os reset                 — clear all outputs and start fresh
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## /startup-os status

Read `CLAUDE.md` Build Log and all output folders. Print:
- Which departments are complete vs pending
- Total files written
- Any `_reports/` findings that need attention
- Suggested next action based on what's missing

---

## /startup-os run <dept>

Re-run all agents in a single department. Overwrites existing output.
Useful when the startup profile changes or you want to refresh one area.

Example: `/startup-os run finance`

---

## /startup-os run <dept> <agent>

Re-run a single agent. Reads the named .md file, executes it, overwrites
its output file.

Example: `/startup-os run product roadmap`
Example: `/startup-os run people job-description --role "Head of Sales"`
Example: `/startup-os run finance model`

---

## /startup-os reset

Clear all generated output files. Sets all Build Log rows in
`CLAUDE.md` to all pending. Does NOT clear `_reports/`. Asks for
confirmation before running: "This will delete all generated output.
Type 'confirm reset' to proceed."

---

## Execution rules (apply to all commands)

1. Always read `CLAUDE.md` first on every command to load the
   current startup profile and build state.

2. Never skip a department. The dependency chain is real:
   product needs strategy, finance needs product, sales needs
   finance, etc. If an upstream output is missing, run that
   department first before proceeding.

3. Every agent writes its output to its department's `output/`
   folder: `<dept>/output/<agent-name>-filled.md`
   Security and engineering agents write to `_reports/`.

4. After every agent completes, update the Build Log row in
   `CLAUDE.md` immediately. Don't batch updates.

5. If an agent fails, print the error clearly, mark the Build Log
   row as `❌ failed`, and continue to the next agent. Do not stop
   the entire build for one failure.

6. The TypeScript in each .md file is the executable logic.
   Read it, run it, don't paraphrase it.

7. Cross-department consistency: before writing any output,
   check that key values match across departments:
   - Pricing in finance/output/ must match pricing in sales/output/
   - ICP in marketing/output/ must match personas in product/output/
   - Tech stack in operations/output/ must match security threat model
   If inconsistencies are found, flag them in `_reports/consistency.md`.
