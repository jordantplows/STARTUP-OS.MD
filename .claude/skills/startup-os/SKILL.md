---
name: startup-os
description: >
  Scaffold and operate a complete startup OS repo. Invoke for anything
  related to building, filling, reviewing, or running the startup-os
  template system. Triggered automatically when the user types
  /startup-os or any of its sub-commands.
argument-hint: "[init | fill <module> | fill-all | review <file> | stress-test | pitch-me | investor-update | weekly-review | hiring <role> | status]"
allowed-tools: Read, Write, Bash, Agent, Edit
---

# startup-os Skill

You are operating the startup-os plugin. Read the user's argument and
route to the correct behavior below. Always read `CLAUDE.md` at the
repo root first to load the Startup Profile before taking any action.

---

## /startup-os init

Scaffold a brand-new startup-os repo in the current working directory.

1. Copy the entire `startup-os/` directory tree from `/Users/jordan/Dev/startup-os/startup-os/`
   into the current directory, preserving folder structure.
2. Create the full structure with all 10 modules (01-foundation through 10-metrics)
   and the `_progress/` directory.
3. Create a `CLAUDE.md` at the root with a blank Startup Profile template.
4. Create a `README.md` at the root explaining the repo.
5. Create a `_progress/tracker.md` with all files listed and status
   set to `⬜ Not started`.
6. Print a success summary showing every folder created.
7. Trigger the `post-init` hook to prompt for the Startup Profile.

---

## /startup-os fill <module-or-file>

Fill one file or an entire module using the Startup Profile in `CLAUDE.md`
and pull existing filled files for cross-reference.

- If argument is a module number or name (e.g. `04-finance` or `finance`),
  dispatch the matching agent from `agents/` to fill all files in that
  module sequentially.
- If argument is a filename (e.g. `lean-canvas.md`), locate the file
  anywhere in the repo and fill it directly.
- After filling, update `_progress/tracker.md` for the affected files.
- Never leave a `[PLACEHOLDER]` unfilled when context exists to fill it.
- End every filled file with a `## Next Steps` section (3 specific,
  dated action items).

---

## /startup-os fill-all

Fill every unfilled file in the repo sequentially, module by module
(01 → 10). Dispatch each module's agent in order. Print a progress
line after each file completes. Update `_progress/tracker.md`
throughout. Estimate ~45–90 minutes of Claude working time upfront.

---

## /startup-os review <file>

Review a filled file and return critical, specific feedback as an
experienced founder and investor who has reviewed hundreds of these.
Structure feedback as:
- **Strengths** (2–3 things that are genuinely good)
- **Critical gaps** (what would make an investor pause)
- **Inconsistencies** (anything that conflicts with other files)
- **Rewrite suggestions** (specific sentences to improve)

---

## /startup-os stress-test

Read `01-foundation/lean-canvas.md` and `04-finance/financial-model.md`.
Generate the 10 hardest questions a Series A investor would ask about
this business. For each question, provide: the question, why it matters,
and what a strong answer would look like given the current repo content.

---

## /startup-os pitch-me

Synthesize all filled files in the repo into a 5-minute investor pitch
narrative. Structure it as: Hook → Problem → Solution → Why Now →
Market → Traction → Business Model → Team → Ask.
Then immediately critique it: what lands, what needs work, what's
missing. Be brutal.

---

## /startup-os investor-update

Draft a monthly investor update email using `10-metrics/investor-update.md`
as template, pulling live data from `10-metrics/kpi-framework.md`,
`10-metrics/weekly-review.md`, and any recent entries across the repo.
Output a ready-to-send email with subject line.

---

## /startup-os weekly-review

Generate this week's company review using `10-metrics/weekly-review.md`
as the template. Pull metrics from `10-metrics/kpi-framework.md`.
Ask the user for 3 things that went well and 3 that didn't if not
already noted in the repo, then produce the full formatted review.

---

## /startup-os hiring <role>

Generate a complete hiring package for the given role using the
culture doc and brand voice as source material. Output in this order:
1. Job description (using `07-hiring/job-description-template.md`)
2. Interview scorecard (using `07-hiring/interview-kit.md`)
3. Offer letter draft (using `07-hiring/offer-letter-template.md`)
Confirm the salary range with the user before generating the offer.

---

## /startup-os status

Read `_progress/tracker.md` and print a clean visual summary:
- How many files are complete vs. not started
- Which module is furthest along
- Which module to tackle next (lowest completion %)
- Top 3 recommended next actions based on current stage
