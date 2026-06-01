# Templates — Standard Library for Agents

This directory contains the structured formats that agents reference when reasoning and generating output. These are NOT documents to copy. They are schemas that define what agents produce and write to `company.os.json`.

## How agents use templates

1. **Agent reads template** — When an agent needs to generate structured output (PRD, financial model, sales playbook), it references the relevant template in `templates/`

2. **Agent populates schema** — The template defines the exact fields, types, and structure. The agent fills these with real content specific to YOUR company based on current `company.os` state.

3. **Agent writes to company.os** — Populated content goes into `company.os.json` under the agent's memory or as an event payload. Other agents read from there.

4. **No file generation** — Templates are schemas, not output files. Everything lives in `company.os.json` as structured data.

## Template structure

Every template follows this format:

```markdown
---
template: template-name
used-by: [agents that reference this]
produces: [what gets written to company.os]
---

## Purpose
One sentence: what this template structures

## Schema
Field definitions with types and descriptions

## Example
Realistic example filled with actual content

## Agent Instructions
How to use this template:
- What to read from company.os
- How to populate fields
- What to write back
- Which events to emit
```

## Templates by category

### Executives
- **ceo-briefing.md** — Weekly company state summary
- **board-update.md** — Investor/board update format
- **okr-framework.md** — Objectives and Key Results structure

### Strategy
- **idea-canvas.md** — Problem/solution/why now
- **lean-canvas.md** — 9-box business model canvas
- **market-research.md** — TAM/SAM/SOM format
- **competitor-analysis.md** — Competitive positioning matrix

### Product
- **prd.md** — Product requirements document
- **user-story.md** — User story format
- **roadmap.md** — Now/next/later roadmap

### Design
- **design-brief.md** — Design direction and goals
- **component-spec.md** — UI component specification
- **ux-flow.md** — User flow structure

### Engineering
- **adr.md** — Architecture decision record
- **tech-spec.md** — Technical specification
- **incident-report.md** — Incident postmortem

### Finance
- **financial-model.md** — P&L, MRR, burn format
- **unit-economics.md** — CAC, LTV, payback
- **investor-update.md** — Monthly investor update

### Marketing
- **campaign-brief.md** — Campaign structure
- **email-sequence.md** — Email flow format
- **content-brief.md** — Content specification

### Sales
- **sales-playbook.md** — Discovery/demo/close process
- **proposal.md** — Proposal structure
- **case-study.md** — Customer case study

### People
- **job-description.md** — Job posting format
- **offer-letter.md** — Offer structure
- **performance-review.md** — Review format

### Legal
- **risk-assessment.md** — Legal risk evaluation
- **compliance-checklist.md** — Compliance review

### Operations
- **sop.md** — Standard operating procedure
- **vendor-review.md** — Vendor evaluation

### Metrics
- **kpi-dashboard.md** — Metrics layout
- **weekly-review.md** — Weekly review format

### Red Team
- **assumption-audit.md** — Assumption challenge format
- **investor-questions.md** — Hard investor questions

## Agent workflow

```
Agent triggered
     ↓
Check template-ref in agent frontmatter
     ↓
Load template from templates/[dept]/[name].md
     ↓
Read current company.os state
     ↓
Populate template schema with real content
     ↓
Write to company.os.json (memory or event payload)
     ↓
Emit event so other agents can consume
```

## Example: Product agent creating PRD

1. Agent: `departments/strategy/product-direction.md`
2. Frontmatter includes: `template-ref: templates/product/prd.md`
3. Agent reads `templates/product/prd.md` schema
4. Agent populates with: problem, solution, user stories, success metrics
5. Agent writes to: `company.os.departments['product-direction'].memory.push(prd)`
6. Agent emits: `{type: 'prd-written', payload: {summary: '...'}}`
7. Engineering consumes event and builds from PRD in memory

## Why templates exist

Without templates:
- Agents generate inconsistent formats
- Output structure varies between runs
- Other agents can't reliably parse results
- Quality depends on agent creativity

With templates:
- Consistent structure every time
- Other agents know exactly what to expect
- Quality is enforced by schema
- Agents focus on content, not format

## Adding new templates

To add a new template:

1. Create `.md` file in appropriate category
2. Follow the template structure format
3. Define clear schema with field types
4. Provide realistic example
5. Document agent instructions
6. Update relevant agent `.md` file to reference it in frontmatter

Templates are living schemas. Update them as you learn what structure works best for your agents.
