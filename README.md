# startup-os

> A complete startup operating system — from idea validation to Series A — as a Claude Code plugin.

Scaffold a production-ready startup repo in 30 seconds. Fill it with investor-grade documents in 90 minutes. Every template is cross-linked, consistent, and ready to ship.

## What You Get

**10 core modules**, each with 5 production-ready templates:

1. **Foundation** — Lean Canvas, Problem-Solution Fit, Value Prop, Market Research, Competitive Analysis
2. **Brand** — Brand Strategy, Voice & Tone, Messaging Framework, Visual Identity, Pitch Deck
3. **Product** — User Personas, Product Spec, MVP Roadmap, Feature Prioritization, Success Metrics
4. **Finance** — Financial Model, Pricing Strategy, Unit Economics, Fundraising Deck, Cap Table
5. **Go-to-Market** — GTM Strategy, Customer Acquisition, Launch Plan, Growth Experiments, Email Sequences
6. **Legal** — Incorporation Checklist, Terms of Service, Privacy Policy, NDA, Advisor Agreement
7. **Hiring** — Culture Doc, Job Description Template, Interview Kit, Offer Letter, Onboarding Checklist
8. **Operations** — Tech Stack, Project Management, Meeting Cadence, OKRs, Vendor List
9. **Sales** — Sales Playbook, Discovery Questions, Demo Script, Objection Handling, Proposal Template
10. **Metrics** — KPI Framework, Dashboard Mockup, Investor Update, Weekly Review, North Star Metric

**50 templates total.** Every file cross-references related docs, validates against your inputs, and ends with specific next steps.

## Using as a Claude Code Plugin

Install once globally and scaffold a new startup-os anywhere on your machine:

```bash
claude plugin install github:your-org/startup-os
```

Then in any empty directory:

```bash
/startup-os init
```

That's it. Claude Code will scaffold the full repo, walk you through
your Startup Profile, and you're ready to run `/startup-os fill-all`.

### All commands

| Command | What it does |
|---|---|
| `/startup-os init` | Scaffold full repo + guided profile setup |
| `/startup-os fill <module>` | Fill one module using your profile |
| `/startup-os fill-all` | Fill every file, all 10 modules |
| `/startup-os review <file>` | Get investor-grade feedback on a file |
| `/startup-os stress-test` | 10 hardest investor questions for your model |
| `/startup-os pitch-me` | Full pitch narrative + critique |
| `/startup-os investor-update` | Draft monthly investor email |
| `/startup-os weekly-review` | Generate weekly company review |
| `/startup-os hiring <role>` | Full hiring package for any role |
| `/startup-os status` | Progress summary + next recommended actions |

## How It Works

1. **Init**: Creates the full 10-module structure (50 template files)
2. **Profile**: One-time setup — 12 questions about your startup
3. **Fill**: Claude reads your profile and fills every template with consistent, cross-referenced content
4. **Review**: Get investor-grade feedback on any file
5. **Iterate**: Update your profile, re-fill modules, review again

Every template knows about every other template. Change your pricing model? Claude updates finance, sales, and GTM docs to match. Refine your ICP? Product, brand, and sales materials stay in sync.

## What Makes This Different

- **Cross-referenced**: Every file validates against related docs — no inconsistencies
- **Investor-grade**: Written at the quality of decks that close rounds
- **Action-oriented**: Every file ends with 3 specific, dated next steps
- **Profile-driven**: Answer 12 questions once, get 50 consistent documents
- **Critique-first**: Built-in `/review` and `/stress-test` commands give you hard feedback

## Use Cases

- **Solo founders**: Go from idea to complete operating system in one afternoon
- **Accelerators**: Give every cohort company a consistent, complete foundation
- **Agencies**: Scaffold client startups faster than spreadsheets
- **VCs**: Portfolio companies use this as their operating system template

## Installation (Manual)

If you prefer to scaffold manually instead of installing as a plugin:

```bash
git clone https://github.com/your-org/startup-os.git
cd startup-os
cp -r startup-os/ ~/my-new-startup/
cd ~/my-new-startup
```

Then fill out `CLAUDE.md` with your startup profile and start filling templates.

## Requirements

- [Claude Code](https://claude.ai/code) 2.1.101 or higher
- Git (for version control)
- A startup idea (or just curiosity)

## Contributing

See [CONTRIBUTING.md](./startup-os/CONTRIBUTING.md) for the full template submission process.

## License

MIT

---

Built by founders, for founders. Ship faster.
