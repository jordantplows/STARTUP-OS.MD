---
name: proposal-generator
description: >
  Generates a custom sales proposal for a named prospect. Accepts prospect name
  and pain points as input, reads sales playbook and pricing strategy, outputs
  a complete proposal with exec summary, problem playback, recommended approach,
  ROI case, investment summary, and next steps.
allowed-tools: Read, Write, Edit, Bash
---

# Proposal Generator

## Purpose

Generate a customized, consultative sales proposal for a specific prospect. The proposal
will mirror the prospect's language from discovery, tie the solution to their decision criteria,
build a quantified ROI case, and outline a clear path to close.

This agent is designed to be invoked with prospect-specific context and will output a
tailored proposal ready to present live or send as a follow-up.

## Inputs required (from user or calling agent)

1. **Prospect Name**: Company name (e.g., "Acme Corp")
2. **Contact Name & Title**: Primary contact (e.g., "Sarah Chen, VP of Sales")
3. **Pain Points**: 3-5 specific problems discovered in MEDDIC (can be bullet list or paragraph)
4. **Metrics**: Quantified impact they want to achieve (e.g., "reduce churn by 10%, save 15 hours/week")
5. **Decision Criteria**: Their requirements for evaluating solutions (optional but ideal)
6. **Pricing Tier**: Which tier/package they're evaluating (if known)
7. **Timeline**: Their expected decision date or go-live date

These inputs can be passed as arguments when invoking the agent, or the agent will prompt for them
if called without arguments.

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile, product description, value props
2. Read `sales/output/sales-playbook.md` → extract proposal framework, positioning, proof points
3. Read `04-finance/pricing-strategy.md` → extract pricing tiers, payment terms, inclusions/exclusions
4. Read `03-product/product-spec.md` → extract features and capabilities to map to their criteria
5. Read `03-product/user-personas.md` → understand the buyer persona for tone and messaging
6. Read `02-brand/voice-and-tone.md` → match brand voice (consultative, not salesy)

## Output structure

Write to `sales/output/proposal-{prospect-slug}.md` where `{prospect-slug}` is the company name
in lowercase-kebab-case (e.g., "acme-corp").

The proposal should be 3-5 pages (1500-2500 words) and include:

### Cover Section
- **To**: Contact name, title, company
- **From**: Your name, title, company
- **Date**: Today's date
- **Re**: Proposal for [your product/service] at [Company Name]

### 1. Executive Summary (3-4 sentences)
A standalone summary that could be forwarded to the economic buyer. Must include:
- The problem (in their words)
- Your solution (mapped to their need)
- The quantified outcome (ROI/impact)
- The investment (price + timeline)

Example:
> "This proposal outlines how [Your Company] will help Acme Corp reduce customer churn by 10%
> and save the customer success team 15 hours per week through automated health scoring and
> proactive intervention. Based on your current churn rate of 8% and ACV of $50K, this represents
> $400K in retained revenue annually. The investment is $24K annually on our Growth plan, with
> a 90-day onboarding timeline."

### 2. Problem Playback (2-3 paragraphs)
Mirror back the pain points from discovery in their exact words (where possible). This section
proves you listened and understand their world. Structure:
- Current state: What they're doing today and why it's painful
- Impact: The cost of the problem (time, money, risk, opportunity cost)
- Desired state: What they want instead (tie to their metrics)

Use direct quotes from discovery if available (e.g., "As Sarah mentioned, 'We're losing deals
because we can't respond fast enough.'")

### 3. Recommended Approach (3-4 paragraphs)
How your solution solves their specific problem. Map features to their decision criteria.

Structure:
- **Overview**: High-level how your product addresses their pain (1 paragraph)
- **Capabilities**: 3-5 key features/capabilities that directly map to their requirements (bullet list with 2-3 sentences each)
- **Why now**: Why your approach is better than status quo, competitors, or build-it-themselves (1 paragraph)
- **Proof**: Customer story, case study, or data point that validates your claims (optional but powerful)

Avoid feature dumps — only include what's relevant to their decision criteria.

### 4. Investment Summary (1-2 paragraphs + pricing table)

**Pricing Table**:
| Item | Description | Price |
|------|-------------|-------|
| [Product] - [Tier] | [What's included: users, features, support] | $X,XXX/mo or $XX,XXX/yr |
| Implementation | [Onboarding, training, integration support] | $X,XXX (one-time) |
| **Total First Year** | | **$XX,XXX** |

**Payment Terms**: [Annual upfront, quarterly, monthly — reference pricing strategy]

**What's Included**:
- List of features/services in this tier (bullets)
- Support level (email, Slack, dedicated CSM, etc.)
- Training and onboarding
- SLA commitments

**What's Not Included** (set expectations):
- Custom integrations beyond [X]
- [Other exclusions based on scope]

**Optional Add-Ons** (if applicable):
- Additional users: $X/user/month
- Professional services: $X/hour
- Premium support: $X/month

### 5. ROI Case (quantified business case)

Use their metrics from discovery to build a financial justification. Format as a simple calculation:

**Current State Costs**:
- [Problem 1]: $X/year (show math: e.g., "8% churn × $50K ACV × 100 customers = $400K lost revenue")
- [Problem 2]: $Y/year (e.g., "15 hours/week × $50/hour × 5 CSMs × 50 weeks = $187K in labor")
- **Total Annual Cost of Problem**: $XXX,XXX

**Expected Improvement** (with your solution):
- [Metric 1]: Reduce churn from 8% to 5% → save $187K/year
- [Metric 2]: Save 10 hours/week per CSM → save $125K/year
- **Total Annual Benefit**: $XXX,XXX

**Net ROI**:
- Investment: $XX,XXX/year
- Return: $XXX,XXX/year
- **Net Benefit**: $XXX,XXX/year (X.Xx ROI)
- **Payback Period**: X months

Add a caveat: "ROI is based on metrics discussed in discovery and assumes [key assumption]. Actual results may vary."

### 6. Implementation & Timeline

A simple Gantt-style timeline showing key milestones:

| Phase | Activities | Duration | Owner |
|-------|------------|----------|-------|
| Kickoff | Contract signed, kickoff call, access provisioned | Week 1 | Both |
| Setup | Data integration, configuration, user setup | Weeks 2-4 | [Your Company] |
| Training | Team training, workflow design, pilot launch | Weeks 5-6 | Both |
| Go-Live | Full rollout, monitor, optimize | Week 7 | [Prospect] |
| Check-In | 30-day review, success metrics review | Week 10 | Both |

**Success Criteria**: Define what "success" looks like at 30, 60, 90 days (tied to their metrics).

### 7. Why [Your Company]

A brief (2-3 paragraphs) section on why they should choose you. Avoid generic fluff. Focus on:
- Specific differentiation relevant to their decision criteria
- Proof points (customers, traction, expertise)
- Cultural fit or values alignment (if discussed in discovery)

This is NOT a company overview — keep it concise and relevant.

### 8. Next Steps

A clear mutual close plan with dates and owners:

- [ ] **[Date]**: Proposal review call (live walkthrough, Q&A, objection handling)
- [ ] **[Date]**: Decision confirmed by [prospect contact name]
- [ ] **[Date]**: Legal and procurement review (if applicable)
- [ ] **[Date]**: Contract signed
- [ ] **[Date]**: Kickoff call and onboarding begins
- [ ] **[Date]**: Go-live target

Include: "I'd love to earn your business. Let's schedule 30 minutes on [date range] to walk through
this proposal together and address any questions."

### 9. Appendix (Optional)

Include if needed:
- FAQs
- Security & compliance summary
- Integration details
- References or case studies
- Terms and conditions summary (or link to full T&Cs)

---

## Writing rules

- Write in second person ("Your team currently..." "You'll be able to...")
- Use the prospect's exact language from discovery (terms, metrics, pain points)
- Keep it concise: 3-5 pages max (1500-2500 words)
- Lead with value, not features
- Show math on ROI — don't just claim it
- Include specific dates in Next Steps (not "within 1 week")
- Match the brand voice from voice-and-tone.md (professional but not corporate-stuffy)
- Proofread: no typos, correct company name throughout, consistent formatting
- Mark assumptions with `[assumption: ...]` if discovery data is incomplete

## Execution

1. Check if required inputs (prospect name, pain points, metrics) are provided
   - If not, prompt the user: "To generate a proposal, I need: [list missing inputs]"
2. Load all context files listed above
3. Generate the proposal with all 8 sections (9 if appendix needed)
4. Write to `sales/output/proposal-{prospect-slug}.md`
5. Confirm completion with: "Proposal for [Prospect Name] written to [file path]. Ready to review and present."

## Example invocation

User: "Generate a proposal for Acme Corp. Contact: Sarah Chen, VP of Sales. Pain points: (1) 8% churn
costing $400K/year, (2) CS team spending 15 hours/week on manual health checks. Metrics: reduce churn to
5%, save 10 hours/week. Decision criteria: easy integration, no-code setup, ROI in 6 months. Pricing: Growth tier.
Timeline: Decision by end of Q2."

Agent: [Loads context, generates proposal, writes to sales/output/proposal-acme-corp.md]

## Example output snippet (for tone and structure reference)

```markdown
# Proposal for Acme Corp

**To**: Sarah Chen, VP of Sales, Acme Corp  
**From**: [Your Name], [Your Title], [Your Company]  
**Date**: May 29, 2026  
**Re**: Proposal for [Your Product] — Reducing Churn and Scaling Customer Success  

---

## 1. Executive Summary

This proposal outlines how [Your Product] will help Acme Corp reduce customer churn from 8% to 5% and
save your customer success team 10 hours per week through automated health scoring, proactive alerts,
and playbook-driven interventions. Based on your current churn rate and 100-customer base, this represents
$187K in retained revenue annually. Additionally, reclaiming 10 hours/week per CSM saves $125K in labor
costs, for a total annual benefit of $312K. The investment is $36K annually on our Growth plan, delivering
an 8.7× ROI with a 4-month payback period. We can have you live in 6 weeks.

---

## 2. Problem Playback

Today, your customer success team is underwater. With 100 customers and only 5 CSMs, each rep is managing
20 accounts — far above the healthy ratio of 10-12 for your ACV. As you shared, Sarah, "We're constantly
in firefighting mode. By the time we see a red flag, the customer is already halfway out the door."

The numbers bear this out: you're losing 8 customers per year (8% churn), each worth an average of $50K in ACV.
That's $400K in lost revenue annually, not to mention the cost of replacing those customers. Your team spends
15 hours per week manually checking in on accounts, pulling usage data from three different tools, and trying
to guess who's healthy and who's at risk. This reactive approach isn't scalable, and it's burning out your team.

You need a system that tells you who needs help before they churn, automates the low-touch check-ins, and gives
your CSMs time to focus on expansion and strategic relationships. You want to cut churn in half and give each
CSM back 10 hours per week — time that can be spent on revenue-generating activities, not firefighting.

---

## 3. Recommended Approach

[Your Product] is a customer health and retention platform built for fast-growing B2B SaaS companies like Acme.
Instead of manually tracking customer health, our platform automatically scores every account in real-time based
on product usage, support ticket trends, NPS scores, and engagement signals. When an account dips into the red zone,
we alert the right CSM with a pre-built playbook to address the issue before it becomes a churn risk.

Here's how we'll solve your specific challenges:

**Automated Health Scoring**  
We integrate with your product analytics (Segment, Amplitude, etc.), support tool (Zendesk, Intercom), and CRM
(HubSpot, Salesforce) to build a real-time health score for every customer. No more manual spreadsheets or gut-feel
assessments. You'll see at a glance which accounts are thriving (green), need attention (yellow), or are at risk (red).
This alone saves your team 10+ hours per week.

**Proactive Alert System**  
When a customer's health score drops — say, they haven't logged in for 14 days, or they submitted 3 support tickets
in a week — we automatically alert the assigned CSM with context and a recommended playbook. Instead of discovering
churn risk in a QBR, you're intervening proactively. This is how you get from 8% churn to 5%.

**Playbook-Driven Interventions**  
We provide templates for common scenarios: onboarding stalled, feature adoption lagging, renewal at risk, expansion
opportunity. Each playbook includes talking points, email templates, and success criteria. Your CSMs follow a proven
process instead of improvising every time.

**No-Code Setup**  
One of your decision criteria was "easy integration, no dev work required." We deliver. Most customers are live in
under 2 weeks with zero engineering lift. We connect to your tools via native integrations (or Zapier), and you
configure health scoring rules in our visual builder — no SQL or code required.

**Why This Works**  
We've helped 50+ B2B SaaS companies reduce churn by an average of 35% in the first year. Our customers report that
CSMs save 8-12 hours per week on average, allowing them to manage 50% more accounts without adding headcount. One
customer, [Similar Company], reduced churn from 9% to 4% in 6 months using our proactive playbook system.
```
