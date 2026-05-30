---
name: crm-setup
description: >
  Generates CRM pipeline configuration including stage definitions with entry/exit
  criteria and win probabilities, required fields per stage, automation rules,
  data hygiene standards, and weekly report templates.
allowed-tools: Read, Write, Edit, Bash
---

# CRM Setup Generator

## Purpose

Generate a complete CRM configuration guide for early-stage B2B sales. This includes pipeline
stage definitions (with entry/exit criteria and win probabilities), required fields per stage,
automation rules to reduce manual work, data hygiene standards to keep the pipeline accurate,
and weekly report templates for pipeline reviews.

Designed to work with any CRM (HubSpot, Salesforce, Pipedrive, Attio, etc.) but optimized
for simplicity and speed in the 0-10 customer phase.

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile, sales model (PLG vs. enterprise, etc.)
2. Read `05-go-to-market/go-to-market-strategy.md` → understand ICP, deal size, sales cycle length
3. Read `03-product/user-personas.md` → understand buyer roles for multi-stakeholder tracking
4. Read `sales/output/sales-playbook.md` → extract MEDDIC qualification criteria, deal stages
5. Read `04-finance/pricing-strategy.md` → understand pricing tiers for deal categorization

## Output structure

Write to `sales/output/crm-setup.md` with these sections:

### 1. Introduction (2-3 paragraphs)
- Why CRM matters even at 0 customers: process repeatability, funnel visibility, resource allocation
- Philosophy: Simple > complex. Track what you'll actually use. Garbage in, garbage out.
- Recommended tools for stage: HubSpot (free tier), Pipedrive (simple), Attio (modern)

### 2. Pipeline Stage Definitions (6-8 stages)

For each stage, provide:
- **Stage Name**: Clear, outcome-based (e.g., "Discovery Completed" not "Stage 2")
- **Definition**: What this stage represents in the buyer journey
- **Entry Criteria**: What must be true to move a deal INTO this stage
- **Exit Criteria**: What must be true to move a deal OUT of this stage (to next or lost)
- **Win Probability**: Estimated % of deals at this stage that close (for forecasting)
- **Typical Duration**: How long deals spend here on average
- **Key Activities**: What the seller should be doing in this stage
- **MEDDIC Coverage**: Which parts of MEDDIC must be completed by the end of this stage

Suggested stages (customize based on sales playbook):
1. **Lead/Unqualified** (0-10% win rate)
2. **Qualified/Discovery Scheduled** (10-20%)
3. **Discovery Completed** (20-30%)
4. **Demo Delivered** (30-40%)
5. **Proposal Sent** (40-60%)
6. **Negotiation** (60-75%)
7. **Verbal Commitment** (75-90%)
8. **Closed Won** (100%) and **Closed Lost** (0%)

### 3. Required Fields Per Stage

Define what data must be captured at each stage transition. Format as a table or checklist.

Example structure:
- **All stages**: Company name, contact name, contact email, deal value, expected close date
- **After Discovery**: Pain points (text), MEDDIC scorecard (6 fields), champion name, economic buyer name
- **After Demo**: Decision criteria (tags), competitors in play (multi-select), next steps (text + date)
- **Before Proposal**: Pricing tier selected, payment terms, custom requirements (text)
- **Before Close**: Contract sent date, legal contact, procurement contact

Include field types (text, dropdown, multi-select, date, number) and whether required or optional.

### 4. MEDDIC Scorecard Fields

Define 6-12 custom fields to track MEDDIC qualification (can be checkboxes, scores, or text):
- **Metrics Identified**: Yes/No + text field for quantified outcome
- **Economic Buyer Engaged**: Yes/No + name + title
- **Decision Criteria Documented**: Yes/No + tags or text
- **Decision Process Mapped**: Yes/No + timeline + stakeholders
- **Pain Identified**: Yes/No + urgency score (1-5) + description
- **Champion Committed**: Yes/No + name + evidence of advocacy

Optional: Calculate a composite MEDDIC score (0-100) to prioritize deals.

### 5. Deal Categorization & Segmentation

Define tags or fields to segment deals for reporting:
- **Deal Size**: Tier 1 (< $X), Tier 2 ($X-$Y), Tier 3 (> $Y) [use pricing tiers]
- **Source**: Inbound, Outbound, Referral, Partner, Event
- **Vertical**: Industry tags from ICP (e.g., SaaS, Fintech, Healthcare)
- **Persona**: Primary buyer persona from user-personas.md
- **Complexity**: Simple (single stakeholder), Moderate (2-3), Complex (4+)

### 6. Automation Rules (10-15 rules)

Define triggers and actions to reduce manual work. Format: WHEN [trigger] THEN [action].

Examples:
- WHEN deal enters "Discovery Scheduled" THEN set expected close date to +60 days
- WHEN deal stage changes THEN log activity "Stage changed from X to Y"
- WHEN deal sits in same stage for >30 days THEN alert owner "Deal stalled"
- WHEN deal reaches "Proposal Sent" THEN create task "Follow up on proposal in 3 days"
- WHEN deal closes won THEN notify #sales Slack channel + create onboarding task
- WHEN deal closes lost THEN require "Lost Reason" field + send to nurture campaign
- WHEN contact opens proposal email THEN alert deal owner
- WHEN expected close date passes THEN flag deal as "At Risk"

Customize based on CRM capabilities (HubSpot workflows, Salesforce flows, etc.).

### 7. Data Hygiene Standards

Rules to keep the pipeline accurate and useful:
- **Update frequency**: All deals must be updated weekly (at minimum)
- **Stale deal policy**: Deals with no activity in 30 days move to "Nurture" or "Closed Lost"
- **Required fields**: Cannot advance stage without required fields filled
- **Close date realism**: Expected close date must be within 90 days or deal moves to "Future Pipeline"
- **Duplicate prevention**: Check for duplicate contacts/companies before creating new records
- **Lost reason taxonomy**: Standardized dropdown (Price, Timing, Competitor, No Decision, Poor Fit, etc.)
- **Activity logging**: Every call, email, demo must be logged with notes

Include a weekly hygiene checklist for the sales team.

### 8. Weekly Pipeline Review Template

A structured format for weekly pipeline reviews (founder-led in early stage, sales manager-led later).

#### Pre-meeting: Each rep fills this out
- **Deals moved forward**: What advanced and why
- **Deals stuck**: What's blocked and what help is needed
- **Deals at risk**: What might slip or close lost
- **New pipeline added**: Source, qualification level
- **Closed this week**: Won and lost, with lessons learned

#### Meeting agenda (30-45 min)
1. **Closed deals review** (5 min): Wins to celebrate, losses to learn from
2. **Top 5 deals** (20 min): Deep dive on highest-value opportunities, MEDDIC check, unblock obstacles
3. **Pipeline health** (10 min): Coverage vs. target, stage distribution, aging deals
4. **Next week priorities** (5 min): Who needs what to advance which deals

#### Metrics to track weekly
- Total pipeline value (by stage)
- Weighted pipeline (deal value × win probability)
- Pipeline coverage (weighted pipeline ÷ quarterly target × 3-4x)
- Deals added vs. closed vs. lost
- Average deal size, sales cycle length, win rate
- Stage conversion rates (what % move from stage X to stage Y)

### 9. Reports & Dashboards

Define 5-7 core reports to build in the CRM:

1. **Pipeline Overview**: All open deals by stage, owner, expected close date
2. **Pipeline by Stage**: Bar chart showing deal count and value per stage
3. **Forecast Report**: Weighted pipeline by month/quarter, commit vs. best case
4. **Activity Report**: Calls, emails, demos logged per rep per week
5. **Win/Loss Analysis**: Close rate by source, vertical, deal size, competitor
6. **MEDDIC Scorecard**: Deals sorted by MEDDIC score, highlighting weak areas
7. **Aging Report**: Deals by days in current stage, flagging stalled deals

Each report should include: purpose, frequency (daily/weekly/monthly), who views it, and action triggers.

### 10. Onboarding Checklist for New Sales Hires

A checklist to get a new rep productive in the CRM quickly:
- [ ] CRM account created, permissions set
- [ ] Required fields and stage definitions reviewed
- [ ] MEDDIC scorecard fields explained
- [ ] Automation rules walkthrough
- [ ] Weekly pipeline review process explained
- [ ] Sample deals reviewed (won and lost)
- [ ] Activity logging standards set
- [ ] First 10 deals added with coach

### 11. Next Steps
Three specific actions to implement this CRM setup, with dates.

## Writing rules

- Write in second person ("You should...") for the team
- Be CRM-agnostic where possible, but note platform-specific tips (e.g., "In HubSpot, use workflows; in Salesforce, use Process Builder")
- Keep it simple: fewer fields, clearer stages, less automation at first
- Cross-link to `sales-playbook.md` for MEDDIC definitions
- Cross-link to `../finance/pricing-strategy.md` for deal sizing
- Include a "Start simple, scale later" section if the profile is pre-revenue
- Mark assumptions with `[assumption: ...]` if sales cycle or deal size is unclear

## Execution

1. Load all context files listed above
2. Generate all sections with specific, actionable configuration
3. Write to `sales/output/crm-setup.md`
4. Confirm completion with a summary of stages defined and automation rules included

## Example output snippet (for tone and structure reference)

```markdown
## 2. Pipeline Stage Definitions

### Stage 1: Lead / Unqualified

**Definition**: A potential customer who has expressed interest (inbound lead, outbound reply, referral intro) but has not yet been qualified for fit and intent.

**Entry Criteria**:
- Contact information captured (name, email, company)
- Source tagged (inbound, outbound, referral, event, partner)
- Initial interest signal (form fill, email reply, meeting request)

**Exit Criteria**:
- To next stage: Qualified as ICP fit (company size, industry, use case) + discovery call scheduled
- To Closed Lost: Disqualified (not ICP, no pain, no budget authority)

**Win Probability**: 5-10%

**Typical Duration**: 1-7 days

**Key Activities**:
- Research the company (size, funding, tech stack)
- Initial qualification email or call (30 sec pitch + ask for 15 min call)
- Confirm ICP fit before advancing

**MEDDIC Coverage**: None yet — just initial qualification

---

### Stage 2: Qualified / Discovery Scheduled

**Definition**: Prospect is confirmed ICP fit and has agreed to a discovery call. They have a problem in the realm of what we solve and decision-making authority (or access to it).

**Entry Criteria**:
- Discovery call scheduled (date + time confirmed)
- Confirmed ICP fit: company size, industry, role of contact
- Preliminary pain identified (even if vague)

**Exit Criteria**:
- To next stage: Discovery call completed + MEDDIC partially qualified (at least M, I, P documented)
- To Closed Lost: No-show on discovery call × 2, or disqualified during discovery

**Win Probability**: 15-20%

**Typical Duration**: 3-7 days (time between scheduling and call)

**Key Activities**:
- Send calendar invite with prep questions
- Research: LinkedIn, company website, recent news
- Prepare discovery questions tailored to their role/industry

**MEDDIC Coverage**: Start identifying Pain and Metrics

---

### Stage 3: Discovery Completed

**Definition**: Full MEDDIC discovery call completed. We understand their pain, metrics, decision process, and have identified a champion and economic buyer.

**Entry Criteria**:
- Discovery call conducted (logged in CRM with notes)
- MEDDIC scorecard >50% complete:
  - Metrics: Quantified pain or goal identified
  - Economic Buyer: Named (even if not yet engaged)
  - Decision Criteria: Initial list captured
  - Decision Process: Timeline and stakeholders identified
  - Pain: Validated and urgent
  - Champion: Potential champion identified

**Exit Criteria**:
- To next stage: Demo scheduled with champion and/or economic buyer
- To Closed Lost: No clear pain, no budget, no timeline, or poor fit discovered

**Win Probability**: 25-30%

**Typical Duration**: 3-7 days (time between discovery and demo)

**Key Activities**:
- Send discovery summary email (recap pain, metrics, next steps)
- Customize demo to address their specific decision criteria
- Confirm attendees for demo (get champion AND economic buyer if possible)

**MEDDIC Coverage**: All 6 elements at least partially identified
```
