---
name: offer-letter
description: >
  Accepts candidate name/role/salary/equity input, generates offer letter with all fields,
  equity explanation attachment, pre-start checklist. Writes to people/output/offer-{candidate-slug}.md
allowed-tools: Read, Write, Edit, Bash
---

# Offer Letter Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile (company name, legal entity name, state of incorporation).
2. Read `people/output/jd-{role-slug}.md` if it exists → use exact compensation and benefits from JD.
3. Read `legal/output/entity-formation.md` if it exists → get full legal entity name for offer letter.
4. Read `people/output/culture-doc.md` if it exists → reference benefits and values.

## Input Parameters

When invoking this agent, accept:
- **Candidate name**: (e.g., "Alex Chen")
- **Role**: (e.g., "Senior Backend Engineer")
- **Salary**: (e.g., "$160,000")
- **Equity**: (e.g., "0.20% / 20,000 stock options")
- **Start date**: (e.g., "2026-06-15")
- **Location**: (e.g., "Remote - California")

## Offer Letter Structure

### 1. Formal Offer Letter

**Required sections**:
- Header (company letterhead, date)
- Recipient (candidate name, address)
- Position title, reporting structure
- Salary (annual, payment frequency)
- Equity grant (options, vesting schedule)
- Benefits summary
- Start date
- At-will employment clause
- Contingencies (background check, I-9 verification)
- Acceptance deadline
- Signature blocks

### 2. Equity Explanation (Attachment)

**Structure**:
- What stock options are (right to buy shares at strike price)
- Vesting schedule (4-year, 1-year cliff)
- Strike price and current valuation
- Example scenarios (what your equity could be worth)
- Tax implications (83(b) election for early exercise)
- How to exercise (when and how)

### 3. Pre-Start Checklist

**Tasks for candidate before Day 1**:
- Sign offer letter (deadline: X days)
- Complete background check authorization
- Complete I-9 form (bring documents on Day 1)
- Sign PIIA (Proprietary Information and Invention Assignment)
- Provide banking info for payroll
- Choose health insurance plan
- Order laptop (Mac or PC?)
- Fill out new hire forms (W-4, state tax withholding)

## Output Format

Write to: `people/output/offer-{candidate-slug}.md`

(Where `{candidate-slug}` is lowercase-hyphenated, e.g., `offer-alex-chen.md`)

Structure:
```markdown
# Offer Letter: [Candidate Name]

**Role**: [Role Title]  
**Start Date**: [Date]  
**Status**: [Draft / Sent / Accepted]

---

## Formal Offer Letter

[Company Legal Name]  
[Address]  
[City, State ZIP]

[Date]

[Candidate Name]  
[Candidate Address]  
[City, State ZIP]

Dear [Candidate First Name],

We are pleased to offer you the position of **[Role Title]** at [Company Name]. This letter outlines the terms of your employment.

### Position & Reporting

**Title**: [Role Title]  
**Reports to**: [Manager Name, Manager Title]  
**Department**: [Engineering / Product / Sales / etc.]  
**Location**: [Remote US / SF Bay Area / Hybrid NYC]  
**Start Date**: [Date]

### Compensation

**Base Salary**: $[X] per year, paid semi-monthly ($[X/24] per paycheck)

**Equity Grant**: [X] stock options ([Y]% of fully diluted shares)
- Stock options vest over 4 years with a 1-year cliff
- Vesting schedule: 25% after 12 months, then 1/48th monthly thereafter
- Strike price: $[X] per share (current 409A valuation)
- See attached equity explanation for details

**Annual Bonus**: [None / X% target bonus based on performance] (if applicable)

### Benefits

You will be eligible for the following benefits:

**Health & Wellness**:
- Medical, dental, and vision insurance (company pays 100% for employee, 50% for dependents)
- Mental health stipend: $[X]/month (therapy, Headspace, etc.)
- Fitness stipend: $[X]/month (gym, ClassPass, Peloton, etc.)

**Time Off**:
- Unlimited PTO (with a minimum of 2 weeks per year enforced)
- [X] weeks parental leave (primary caregiver)
- [Y] weeks parental leave (secondary caregiver)
- Company holidays (see handbook for list)

**Work Setup**:
- Home office stipend: $[X] (desk, chair, monitor, accessories)
- Company laptop (MacBook Pro or equivalent, your choice)
- [Co-working stipend: $X/month] (if remote)

**Learning & Growth**:
- Learning budget: $[X]/year (books, courses, conferences)
- Conference attendance: [1 per year for high performers]

**Financial**:
- 401(k) plan with [X]% company match (after 1 year of employment)
- Commuter benefits: $[X]/month pre-tax (if applicable)

Full benefits details are provided in the employee handbook.

### Employment Terms

**Employment Status**: This is a full-time, at-will position. This means that either you or the company may terminate the employment relationship at any time, with or without cause or advance notice.

**Proprietary Information**: As a condition of employment, you will be required to sign the company's Proprietary Information and Invention Assignment Agreement (PIIA).

**Background Check**: This offer is contingent upon the successful completion of a background check and verification of your right to work in the United States (I-9 verification).

**Other Positions**: We understand you may hold other job offers. Please let us know if you need more time to make your decision.

### Acceptance

To accept this offer, please sign and return this letter by **[Date, typically 5-7 days from offer date]**. If you have any questions, please contact [Hiring Manager Name] at [Email] or [Recruiter Name] at [Email].

We are excited to have you join the [Company Name] team!

Sincerely,

[CEO Name]  
[CEO Title]  
[Company Name]

---

**ACCEPTANCE**

I, [Candidate Name], accept the above offer of employment with [Company Legal Name] under the terms outlined in this letter.

**Signature**: ___________________________  
**Date**: ___________________________

---

## Equity Explanation (Attachment)

### What Are Stock Options?

Stock options give you the **right to buy** shares of [Company Name] at a fixed price (the "strike price") in the future.

**Example**:
- You're granted [X] stock options
- Strike price: $[Y] per share (based on current 409A valuation)
- If the company is later valued at $[Z] per share, you can:
  - Buy [X] shares at $[Y] each (cost: $[X × Y])
  - Those shares are worth $[X × Z] (value: $[X × Z])
  - Your profit: $[X × (Z - Y)]

### Your Equity Grant

**Grant Details**:
- Number of options: [X]
- Percentage of company: [Y]% (based on [Z] fully diluted shares)
- Strike price: $[W] per share
- Current 409A valuation: $[V] per share (last valuation: [Date])

**Vesting Schedule**:
- **4-year vesting, 1-year cliff**
- Month 0-12: 0% vested (no shares)
- Month 12: 25% vested ([X/4] options)
- Months 13-48: 1/48th vests each month
- Month 48: 100% vested ([X] options)

**Example** (if you own [X] options):
- Month 12: [X/4] options vested
- Month 24: [X/2] options vested (50%)
- Month 36: [3X/4] options vested (75%)
- Month 48: [X] options vested (100%)

### What Your Equity Could Be Worth

**Current value** (at today's 409A valuation):
- Strike price: $[Y] per share
- Current value: $[Z] per share
- Your [X] options = $[X × (Z - Y)] in paper value (if you exercised today)

**Future scenarios** (hypothetical):

| Scenario | Company Valuation | Value per Share | Your Options Worth | Your Profit (after strike price) |
|----------|-------------------|-----------------|--------------------|---------------------------------|
| Today | $[M] | $[Z] | $[X × Z] | $[X × (Z - Y)] |
| Series A | $[N] | $[W] | $[X × W] | $[X × (W - Y)] |
| Series B | $[P] | $[V] | $[X × V] | $[X × (V - Y)] |
| Acquisition | $[Q] | $[U] | $[X × U] | $[X × (U - Y)] |

**Note**: These are hypothetical examples based on typical startup growth. Actual outcomes depend on company performance and dilution from future fundraising.

### Tax Implications

**Incentive Stock Options (ISOs)**:
- Your options are ISOs (if you're a US employee)
- **No tax when granted** (when you receive the options)
- **Potential AMT when exercised** (Alternative Minimum Tax applies if spread between strike price and FMV is large)
- **Long-term capital gains if held >2 years** (from grant date) and >1 year (from exercise date)

**83(b) Election for Early Exercise** (if offered):
- You can exercise options before they vest ("early exercise")
- File 83(b) election within 30 days to pay tax now (based on current low valuation) instead of later
- Starts your capital gains holding period immediately
- **Consult a tax advisor** before early exercising (there's risk if you leave before vesting)

**Non-US employees**: Tax treatment varies by country. Consult a local tax advisor.

### How to Exercise Your Options

**When can you exercise?**:
- After vesting begins (Month 12+), you can exercise vested options
- After leaving the company, you typically have 90 days to exercise (or they expire)

**How to exercise**:
1. Log in to [Carta / Shareworks / other platform]
2. Select options to exercise
3. Pay strike price (e.g., [X] options × $[Y] = $[Total])
4. Receive share certificates

**Should you exercise?**:
- **Before IPO/acquisition**: Usually not (unless doing early exercise with 83(b))
- **After IPO**: Depends on stock price and tax situation (consult advisor)
- **When leaving company**: Decide within 90 days (weigh strike price vs. potential upside)

### Questions?

Email [CFO/Finance Contact] at [Email] for questions about equity, taxes, or vesting.

---

## Pre-Start Checklist

**Complete by [Date, 1 week before start date]**:

### Legal & Compliance

- [ ] **Sign offer letter** (deadline: [Date])
- [ ] **Complete background check authorization** (link sent via email)
- [ ] **Sign PIIA** (Proprietary Information and Invention Assignment Agreement)
- [ ] **Complete I-9 form** (bring documents on Day 1: passport or driver's license + social security card)

### Payroll & Benefits

- [ ] **Provide banking info** (for direct deposit) — Link: [Payroll portal]
- [ ] **Complete W-4** (federal tax withholding) — Link: [Payroll portal]
- [ ] **Complete state tax withholding** (if applicable) — Link: [Payroll portal]
- [ ] **Choose health insurance plan** (medical, dental, vision) — Link: [Benefits portal]
- [ ] **Enroll in 401(k)** (optional, but recommended) — Link: [Benefits portal]

### Equipment & Setup

- [ ] **Order laptop** (Mac or PC?) — Contact: [IT contact]
- [ ] **Provide mailing address** (for laptop shipment)
- [ ] **Request home office equipment** (monitor, keyboard, desk, chair) — Budget: $[X]
- [ ] **Install required software** (list sent via email after laptop arrives)

### Pre-Start Prep

- [ ] **Review employee handbook** (sent via email)
- [ ] **Read culture doc** (people/output/culture-doc.md)
- [ ] **Schedule Day 1 onboarding** (meeting invite sent by HR)
- [ ] **Join Slack** (invite sent 2 days before start)
- [ ] **Set up email** (credentials sent 1 day before start)

### Optional (but recommended)

- [ ] **Research the product** (create a trial account, explore features)
- [ ] **Read recent company updates** (blog, product releases, funding announcements)
- [ ] **Connect with team on LinkedIn** (meet your future colleagues)

---

**Questions?** Contact [Recruiter Name] at [Email] or [Phone].

**Welcome to [Company Name]!** We're excited for you to start on [Start Date].
```

## Writing Rules

1. **Full legal entity name** — Use exact legal name from entity formation docs (e.g., "Acme Corp, Inc." not "Acme").
2. **At-will employment clause** — Required in US (either party can terminate anytime).
3. **Contingencies** — Background check, I-9 verification must be in offer.
4. **Equity explanation** — Explain vesting, strike price, hypothetical value scenarios.
5. **83(b) election mention** — If early exercise is offered, include 30-day deadline warning.
6. **Pre-start checklist** — 15-20 items grouped by category (legal, payroll, equipment, prep).

## Cross-References

- Link to `culture-doc.md` for benefits details and company values
- Link to `jd-{role-slug}.md` for role expectations and compensation
- Link to `onboarding-playbook.md` for Day 1 schedule

## After completion

1. Verify offer letter includes at-will clause and contingencies.
2. Ensure equity explanation has vesting table and hypothetical value scenarios.
3. Confirm pre-start checklist has 15-20 items with owners/deadlines.
4. Write output to `people/output/offer-{candidate-slug}.md` (e.g., `offer-alex-chen.md`).
