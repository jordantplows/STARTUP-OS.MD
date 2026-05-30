# Your Startup Operating System

> 50 production-ready templates to take you from idea to funded company.

---

## What You Just Scaffolded

This repo contains 10 core modules with 5 templates each — everything you need to build, brand, launch, and scale a startup:

### ✅ Modules

| # | Module | What's Inside |
|---|--------|---------------|
| **01** | **Foundation** | Lean Canvas, Problem-Solution Fit, Value Prop, Market Research, Competitive Analysis |
| **02** | **Brand** | Brand Strategy, Voice & Tone, Messaging, Visual Identity, Pitch Deck |
| **03** | **Product** | User Personas, Product Spec, MVP Roadmap, Feature Prioritization, Success Metrics |
| **04** | **Finance** | Financial Model, Pricing Strategy, Unit Economics, Fundraising Deck, Cap Table |
| **05** | **Go-to-Market** | GTM Strategy, Customer Acquisition, Launch Plan, Growth Experiments, Email Sequences |
| **06** | **Legal** | Incorporation, Terms of Service, Privacy Policy, NDA, Advisor Agreement |
| **07** | **Hiring** | Culture Doc, Job Description Template, Interview Kit, Offer Letter, Onboarding |
| **08** | **Operations** | Tech Stack, Project Management, Meeting Cadence, OKRs, Vendor List |
| **09** | **Sales** | Sales Playbook, Discovery Questions, Demo Script, Objection Handling, Proposal Template |
| **10** | **Metrics** | KPI Framework, Dashboard, Investor Update, Weekly Review, North Star Metric |

**50 templates total**, all cross-referenced and designed to work together.

---

## How To Use This

### 1. Fill Out Your Startup Profile

Open `CLAUDE.md` and complete the "My Startup Profile" section. This is your single source of truth — every template will reference it.

```bash
# Edit CLAUDE.md and fill in:
- Company name
- One-line description  
- Industry & business model
- Target customer
- Problem you solve
- Stage, location, team size
- Revenue & fundraising goals
```

### 2. Fill The Templates

You have two options:

**Option A: Fill everything at once**

If you're using Claude Code with the startup-os plugin installed:

```bash
/startup-os fill-all
```

This will fill all 50 templates in ~45-90 minutes based on your profile.

**Option B: Fill module-by-module**

Work through one module at a time:

```bash
/startup-os fill 01-foundation
/startup-os fill 02-brand
# ... etc
```

**Option C: Fill manually**

Open each `.md` file and replace `[PLACEHOLDER]` markers with your content. Use the structure and prompts provided.

### 3. Review & Iterate

Get feedback on your filled templates:

```bash
/startup-os review lean-canvas.md
/startup-os stress-test
/startup-os pitch-me
```

### 4. Track Your Progress

Check `_progress/tracker.md` to see completion status across all 50 files:

```bash
/startup-os status
```

---

## File Organization

```
your-startup/
├── CLAUDE.md                    # Your startup profile (fill this first!)
├── _progress/
│   └── tracker.md               # Track completion of all 50 files
├── 01-foundation/
│   ├── lean-canvas.md
│   ├── problem-solution-fit.md
│   ├── value-proposition.md
│   ├── market-research.md
│   └── competitive-analysis.md
├── 02-brand/
│   ├── brand-strategy.md
│   ├── voice-and-tone.md
│   ├── messaging-framework.md
│   ├── visual-identity.md
│   └── pitch-deck-outline.md
├── 03-product/
│   ├── user-personas.md
│   ├── product-spec.md
│   ├── mvp-roadmap.md
│   ├── feature-prioritization.md
│   └── success-metrics.md
├── 04-finance/
│   ├── financial-model.md
│   ├── pricing-strategy.md
│   ├── unit-economics.md
│   ├── fundraising-deck.md
│   └── cap-table.md
├── 05-go-to-market/
│   ├── go-to-market-strategy.md
│   ├── customer-acquisition.md
│   ├── launch-plan.md
│   ├── growth-experiments.md
│   └── email-sequences.md
├── 06-legal/
│   ├── incorporation-checklist.md
│   ├── terms-of-service.md
│   ├── privacy-policy.md
│   ├── nda-template.md
│   └── advisor-agreement.md
├── 07-hiring/
│   ├── culture-doc.md
│   ├── job-description-template.md
│   ├── interview-kit.md
│   ├── offer-letter-template.md
│   └── onboarding-checklist.md
├── 08-operations/
│   ├── tech-stack.md
│   ├── project-management.md
│   ├── meeting-cadence.md
│   ├── okrs.md
│   └── vendor-list.md
├── 09-sales/
│   ├── sales-playbook.md
│   ├── discovery-questions.md
│   ├── demo-script.md
│   ├── objection-handling.md
│   └── proposal-template.md
└── 10-metrics/
    ├── kpi-framework.md
    ├── dashboard-mockup.md
    ├── investor-update.md
    ├── weekly-review.md
    └── north-star-metric.md
```

---

## Cross-Referencing

Templates are designed to reference each other. For example:

- **Pricing Strategy** (04-finance) → referenced by **Sales Proposal** (09-sales)
- **User Personas** (03-product) → referenced by **GTM Strategy** (05-go-to-market)
- **Brand Voice** (02-brand) → referenced by **Email Sequences** (05-go-to-market)
- **Culture Doc** (07-hiring) → referenced by **Job Descriptions** (07-hiring)

When you update one file, check related files to ensure consistency.

---

## Recommended Order

If you're filling templates manually, work through modules in this order:

1. **Foundation** (01) — Start here. Everything else builds on this.
2. **Brand** (02) — Define how you communicate before you communicate.
3. **Product** (03) — What you're building, for whom, and why.
4. **Finance** (04) — Business model, unit economics, fundraising.
5. **Go-to-Market** (05) — How you'll acquire customers.
6. **Legal** (06) — Protect yourself and your customers.
7. **Hiring** (07) — Scale your team the right way.
8. **Operations** (08) — Infrastructure to support growth.
9. **Sales** (09) — Close deals efficiently and consistently.
10. **Metrics** (10) — Measure what matters and report progress.

---

## Common Workflows

### Monthly Investor Update

```bash
/startup-os investor-update
```

Generates email using latest metrics from `10-metrics/` and highlights from other modules.

### Weekly Team Review

```bash
/startup-os weekly-review
```

Creates this week's review using `10-metrics/weekly-review.md` template.

### Hiring a New Role

```bash
/startup-os hiring "Senior Engineer"
```

Generates JD, interview kit, and offer letter for the role using `07-hiring/` templates.

### Pitch Practice

```bash
/startup-os pitch-me
```

Synthesizes all modules into a 5-minute pitch narrative, then critiques it.

### Stress Test Your Model

```bash
/startup-os stress-test
```

Generates the 10 hardest questions an investor would ask based on your `01-foundation/` and `04-finance/` docs.

---

## Tips For Success

### 1. Be Specific, Not Generic

Bad: *"We target SMBs."*  
Good: *"We target B2B SaaS companies with 50-200 employees, $5-20M ARR, using Salesforce, who struggle with manual data entry reducing sales productivity."*

### 2. Show Your Work (Especially in Finance)

Every number should be labeled `[assumption]` or `[derived]`. Show formulas. If you claim $10M TAM, show how you calculated it.

### 3. Cross-Reference Ruthlessly

If you change pricing in `04-finance/pricing-strategy.md`, update:
- `09-sales/proposal-template.md`
- `09-sales/sales-playbook.md`
- `04-finance/financial-model.md`
- `04-finance/unit-economics.md`

### 4. Use Next Steps

Every template ends with "## Next Steps" — three specific, dated action items. Actually do them. This is how templates become reality.

### 5. Update as You Learn

These aren't set-in-stone documents. Update them as you:
- Interview customers
- Run experiments
- Close deals
- Raise money
- Hire people

---

## Getting Help

### Using Claude Code?

- `/startup-os help` — Show all available commands
- `/startup-os status` — Check progress across all templates
- `/startup-os review <file>` — Get feedback on a specific file

### Contributing Improvements

See `CONTRIBUTING.md` for guidelines on submitting template improvements.

---

## License

MIT — use this however you want. No attribution required.

---

**Now go build something. The templates are just the start.**
