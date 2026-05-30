---
name: post-init
description: Runs automatically after /startup-os init completes.
trigger: manual
allowed-tools: Read, Write, Edit
---

# Post-Init Hook

The repo has just been scaffolded. Before the founder does anything else,
guide them through filling out the Startup Profile in `CLAUDE.md` —
this is the single most important step, as every `/fill` command reads
it for context.

## Steps

1. Open `CLAUDE.md` and locate the `## My Startup Profile` block.
2. Ask the user the following questions one at a time (do not show them
   all at once). After each answer, write it into the correct field in
   `CLAUDE.md` immediately before asking the next:

   - "What's your company name?"
   - "Describe your startup in one sentence."
   - "What industry are you in?"
   - "What's your business model? (B2B SaaS / B2C / Marketplace / etc.)"
   - "Who is your target customer? Be specific."
   - "What problem do you solve?"
   - "What stage are you at? (Idea / Pre-seed / Seed / Series A)"
   - "Where are you based?"
   - "How many founders, and what are their roles?"
   - "What's your current revenue, if any?"
   - "How much are you looking to raise?"
   - "What's your target launch or close date?"

3. After all fields are saved, print:

   ```
   ✅ Startup Profile saved to CLAUDE.md

   Your startup-os is ready. Here's what to do next:

   → Run /startup-os fill 01-foundation to start with idea validation
   → Run /startup-os fill-all to build the entire OS in one shot
   → Run /startup-os status at any time to see your progress
   ```
