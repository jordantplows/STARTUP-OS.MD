---
name: sales-playbook
description: >
  Generates a complete sales playbook including MEDDIC discovery framework,
  demo script outline, proposal framework, closing sequence, negotiation guide,
  and multi-stakeholder mapping. Reads from GTM strategy, personas, and pricing.
allowed-tools: Read, Write, Edit, Bash
---

# Sales Playbook Generator

## Purpose

Generate a comprehensive sales playbook that equips the founding team and early sales hires
with a repeatable, consultative selling methodology. The playbook will include discovery frameworks,
demo scripting, proposal structure, closing tactics, negotiation strategies, and stakeholder mapping.

## Context to load before writing

1. Read `CLAUDE.md` → extract the full Startup Profile block
2. Read `05-go-to-market/go-to-market-strategy.md` → extract ICP definition, channels, positioning
3. Read `03-product/user-personas.md` → extract all buyer personas, pain points, motivations
4. Read `04-finance/pricing-strategy.md` → extract pricing tiers, packaging, discounting policy
5. Read `03-product/product-spec.md` → extract core features and value props for demo scripting
6. Read `02-brand/voice-and-tone.md` → ensure playbook tone matches brand voice

## Output structure

Write a single comprehensive file to `sales/output/sales-playbook.md` with these sections:

### 1. ICP & Buyer Personas (2-3 paragraphs)
- Restate the ICP from GTM strategy
- List each persona with: title, goals, pain points, objections, preferred communication style
- Map personas to MEDDIC roles (Champion, Economic Buyer, Decision Criteria owner, etc.)

### 2. MEDDIC Discovery Framework
For each letter of MEDDIC, provide:
- **Definition**: What it means
- **Key questions to ask** (5-7 questions per letter, in conversational order)
- **Qualification criteria**: What answers disqualify or accelerate the deal
- **Red flags**: Warning signs that indicate poor fit

MEDDIC breakdown:
- **M**etrics: Quantifiable impact (ROI, cost savings, revenue lift, time saved)
- **E**conomic Buyer: Who owns the budget and signs the contract
- **D**ecision Criteria: Technical and business requirements they're evaluating against
- **D**ecision Process: Steps, timeline, stakeholders, approval gates
- **I**dentify Pain: The business problem or opportunity driving urgency
- **C**hampion: Internal advocate who sells on your behalf

### 3. Discovery Call Framework (3-stage structure)
- **Opening** (5 min): Agenda set, permission to ask questions, rapport building
- **Discovery** (30-40 min): MEDDIC question flow, pain amplification, implication questions
- **Close** (5-10 min): Summarize findings, confirm fit, propose next steps (demo, technical eval, proposal)

Include specific talk tracks and transition phrases.

### 4. Demo Script Outline
- **Pre-demo setup**: Confirm attendees, agenda, pain points to address
- **Demo structure**:
  1. Context set (2 min): "Based on our discovery, you said X, Y, Z..."
  2. Feature walkthroughs (15-20 min): Tie each feature to a specific pain point discovered
  3. Objection handling (5 min): Address concerns proactively
  4. Next steps (3 min): Mutual action plan
- **Key principles**: Discovery before demo, show don't tell, confirm understanding throughout

### 5. Proposal Framework
Outline the structure of a winning proposal (to be filled by the `proposal.md` agent):
- Executive Summary (problem + solution + ROI in 3 sentences)
- Problem Playback (mirror their words from discovery)
- Recommended Approach (your solution mapped to their decision criteria)
- Investment Summary (pricing tier, payment terms, inclusions/exclusions)
- ROI Case (metrics from discovery → projected outcomes)
- Next Steps & Timeline (mutual close plan)

Include guidelines: keep it under 5 pages, use their language, lead with value not features.

### 6. Closing Sequence (3-step process)
- **Trial close after demo**: "If we can solve X, Y, Z within [budget/timeline], is there any reason we wouldn't move forward?"
- **Proposal review**: Walk through live, don't email and wait. Address objections in real-time.
- **Ask for the business**: "I'd love to earn your business. What do we need to do to get a signed agreement by [date]?"

Include handling common stalls: "I need to think about it," "Send me a proposal," "We're still evaluating options."

### 7. Negotiation Guide
- **Pricing authority**: Who can discount and by how much (reference pricing strategy)
- **Tradeable concessions**: What you can offer (payment terms, service hours, early access) without discounting
- **Non-negotiables**: What you never compromise on (payment terms beyond X, contract length below Y, security/compliance)
- **Anchoring strategy**: Lead with value, justify pricing, offer tiers not discounts
- **Walk-away criteria**: When to disqualify (price-only buyer, unrealistic timeline, poor fit)

### 8. Multi-Stakeholder Mapping
Template for mapping complex buying committees:
- **Stakeholder roles**: Economic Buyer, Champion, Influencers, Blockers, Coach, End Users
- **For each stakeholder**:
  - Name, title, department
  - What they care about (goals, KPIs, pain points)
  - Their stance (supportive, neutral, opposed, unknown)
  - How to win them over (messaging, proof points, who should engage)
- **Engagement plan**: Who on your team engages which stakeholder, cadence, medium

### 9. Deal Progression Checklist
A checklist to ensure deals advance methodically:
- [ ] Discovery call completed, MEDDIC fully qualified
- [ ] Champion identified and committed
- [ ] Economic Buyer engaged and pain confirmed
- [ ] Demo delivered and decision criteria addressed
- [ ] Proposal submitted and reviewed live
- [ ] Objections surfaced and resolved
- [ ] Mutual close plan agreed with dates
- [ ] Legal and procurement engaged
- [ ] Contract sent and signature obtained

### 10. Next Steps
Three specific actions to operationalize this playbook with dates.

## Writing rules

- Write in second person ("You should...") as guidance for the sales team
- Include exact question phrasing, not just topics
- Use real examples from the product and persona context where possible
- Keep it actionable: every section should have clear do-this-not-that guidance
- Cross-link to `../finance/pricing.md` for pricing details
- Cross-link to `../product/user-personas.md` for persona details
- Mark assumptions with `[assumption: ...]` if data is missing from source files

## Execution

1. Load all context files listed above
2. Generate the playbook with all 10 sections fully filled
3. Write to `sales/output/sales-playbook.md`
4. Confirm completion with a summary of key frameworks included

## Example output snippet (for tone reference)

```markdown
## 2. MEDDIC Discovery Framework

### M — Metrics (Quantifiable Impact)

**Definition**: The measurable business outcomes the prospect expects from your solution. Without clear metrics, you can't build an ROI case or justify the investment.

**Key Questions**:
1. "What specific metrics are you trying to improve?" (revenue, cost, time, quality, etc.)
2. "If you could wave a magic wand and solve this problem, what would change in your business?"
3. "How are you measuring this today? What's the current baseline?"
4. "What does success look like in 6 months? 12 months?"
5. "If you achieve these results, what does that mean for your team? For you personally?"
6. "What's the cost of not solving this problem this year?"
7. "Have you quantified the ROI internally? What model are you using?"

**Qualification Criteria**:
- ✅ Strong fit: They have a clear, quantified goal (e.g., "reduce churn by 15%", "save 20 hours/week")
- ⚠️ Moderate fit: They know the problem but haven't quantified it yet (you can help them)
- ❌ Poor fit: Vague goals ("improve things", "be more efficient") with no willingness to quantify

**Red Flags**:
- They can't articulate any metrics or KPIs
- The problem isn't tied to a business outcome
- No one is accountable for the metric they want to improve
```
