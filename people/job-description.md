---
name: job-description
description: >
  Accepts role name and salary range input, generates JD: punchy intro, role outcomes,
  requirements (required vs preferred), compensation/equity, hiring process.
  Writes to people/output/jd-{role-slug}.md
allowed-tools: Read, Write, Edit, Bash
---

# Job Description Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile (company name, mission, product, stage).
2. Read `people/output/culture-doc.md` if it exists → incorporate culture principles into JD.
3. Read `product/output/feature-roadmap.md` if it exists → understand what this role will build/impact.
4. Read `finance/output/financial-model.md` if it exists → validate salary range is within budget.

## Input Parameters

When invoking this agent, accept:
- **Role name**: (e.g., "Senior Backend Engineer", "Product Marketing Manager")
- **Salary range**: (e.g., "$140K-$180K" or "Market rate" if not specified)
- **Equity range** (optional): (e.g., "0.15-0.25%")
- **Location**: (e.g., "Remote US", "SF Bay Area", "Hybrid NYC")

## JD Structure

### 1. Punchy Intro (2-3 paragraphs)

**Hook** (1 paragraph):
- Start with the problem you're solving or the impact this role will have
- Avoid clichés like "Are you passionate about..." or "Join our rockstar team"
- Make it specific to your company and this role

**Example**:
> We're building [Product] to help [Customer] [Outcome]. Today, [X% of market] still struggle with [Problem], and we're changing that. We've grown from 0 to [X customers/ARR] in [Y months], and we need a [Role] to [specific impact this role will have].

**Company context** (1-2 paragraphs):
- Stage (pre-seed, seed, Series A+)
- Traction (customers, revenue, growth rate)
- Funding (if public)
- Team size
- Investors (if notable)

**Example**:
> We're a [X-person] team backed by [Investor A, Investor B]. We've raised $[Y]M and are [default alive / profitable / raising Series A]. Our customers include [notable customers], and we're growing [X%] MoM.

### 2. Role Outcomes (What Success Looks Like)

**Format**: 4-6 bullet points describing outcomes, not tasks

**Bad** (task-oriented):
- ❌ "Write clean code"
- ❌ "Attend standup meetings"
- ❌ "Collaborate with team"

**Good** (outcome-oriented):
- ✅ "Ship [Feature X] that increases conversion by 10%"
- ✅ "Reduce API latency from 500ms to 100ms"
- ✅ "Build analytics dashboard used by 80% of customers"

**Template**:
- In your first 30 days: [Onboarding outcome]
- In your first 90 days: [First major outcome]
- In your first year: [Long-term impact]

**Example for Senior Backend Engineer**:
- **30 days**: Ship your first feature to production, understand our architecture, contribute to code reviews
- **90 days**: Own the [Billing System] refactor, reducing payment failures by 50%
- **1 year**: Lead the [Real-time Sync] project, serving 10K+ requests/sec with 99.9% uptime

### 3. Requirements

Split into **Required** (must-haves) vs. **Preferred** (nice-to-haves):

**Required** (5-7 items):
- Focus on outcomes, not credentials ("built X" vs. "5+ years of experience")
- Be specific (not "strong communication skills")

**Preferred** (3-5 items):
- Signals that increase odds of success, but not dealbreakers

**Example for Senior Backend Engineer**:

**Required**:
- You've built and scaled backend systems serving 10K+ requests/sec
- You're fluent in [Python/Go/Rust] and SQL
- You've designed APIs used by external developers
- You write tests, review code, and care about maintainability
- You can explain complex technical concepts to non-technical teammates

**Preferred**:
- You've worked at an early-stage startup (0-50 people)
- You've built payment or billing systems (Stripe, chargebee)
- You have experience with [specific tech stack: Postgres, Redis, Kafka]
- You've contributed to open source

### 4. Compensation & Equity

**Salary**:
- Provide range (not "competitive salary")
- Specify location adjustment if remote (e.g., "SF/NYC: $X, other US: 0.9x")

**Equity**:
- Specify percentage or option count
- Explain vesting (4-year vest, 1-year cliff)
- Mention strike price or valuation context (optional, but helpful)

**Benefits** (link to culture doc for full list):
- Medical, dental, vision (company pays X%)
- Unlimited PTO (minimum Y weeks enforced)
- $Z home office stipend
- $W/year learning budget

**Example**:
> **Salary**: $140K-$180K (based on experience and location)  
> **Equity**: 0.15-0.25% (stock options, 4-year vest with 1-year cliff)  
> **Benefits**: Full health coverage, unlimited PTO (min 2 weeks), $1,500 home office, $500/year learning budget

### 5. Hiring Process

**Transparency builds trust** — outline the entire process:

**Example**:
1. **Apply** (15 min): Submit resume + short cover letter (3-5 sentences: why this role? why now?)
2. **Recruiter screen** (30 min): Culture fit, logistics, answer your questions
3. **Hiring manager call** (45 min): Deep dive on experience, role expectations
4. **Technical interview** (90 min): Coding challenge or system design (you choose)
5. **Team fit call** (45 min): Meet 2-3 future teammates, discuss collaboration style
6. **Founder call** (30 min): Vision, company strategy, answer your questions
7. **Offer** (same day or next day)

**Timeline**: 1-2 weeks from application to offer

**What we're optimizing for**:
- ✅ Speed (we move fast, respect your time)
- ✅ Transparency (no surprise interviews or unclear expectations)
- ✅ Two-way evaluation (you're interviewing us too)

### 6. Why Join Us?

**Make it specific** (not "great culture" or "competitive compensation"):

**Examples**:
- **Impact**: You'll own [X], not be a cog in a machine (compare to big tech: "at Google, you'd work on 1% of a project; here, you own 20%")
- **Learning**: Work directly with [Founder/CTO], learn [specific skill] faster than anywhere else
- **Equity upside**: If we hit [revenue milestone], your equity could be worth $[X]
- **Mission**: We're solving [problem] that affects [X people/companies]
- **Team**: Small, high-trust team (no politics, no bureaucracy)
- **Flexibility**: Remote-first, async culture, focus on outcomes (not hours logged)

## Output Format

Write to: `people/output/jd-{role-slug}.md`

(Where `{role-slug}` is lowercase, hyphenated, e.g., `senior-backend-engineer`)

Structure:
```markdown
# [Role Name] at [Company Name]

**Location**: [Remote US / SF Bay Area / Hybrid NYC / etc.]  
**Salary**: $X-$Y (based on experience and location)  
**Equity**: Z% stock options (4-year vest, 1-year cliff)  
**Team**: [Department] ([X people])  
**Reports to**: [Hiring Manager Title]

---

## About [Company Name]

[2-3 paragraph punchy intro]

**The problem**: [What pain are you solving?]

[Company context: stage, traction, funding, team size]

---

## The Role

[1 paragraph: What this person will do and why it matters]

### What Success Looks Like

- **30 days**: [Onboarding outcome]
- **90 days**: [First major outcome]
- **1 year**: [Long-term impact]

### Day-to-Day

You'll:
- [Outcome 1]
- [Outcome 2]
- [Outcome 3]
- [Outcome 4]

---

## You

### Required

- [Must-have 1]
- [Must-have 2]
- [Must-have 3]
- [Must-have 4]
- [Must-have 5]

### Preferred (but not required)

- [Nice-to-have 1]
- [Nice-to-have 2]
- [Nice-to-have 3]

---

## Compensation & Benefits

**Salary**: $X-$Y  
- SF/NYC: Full range  
- Other US locations: 0.9x (e.g., $X*0.9 - $Y*0.9)

**Equity**: Z% stock options  
- 4-year vesting, 1-year cliff  
- Current valuation: $[X]M (your options worth $[Y]K at current value)

**Benefits**:
- Health: Medical, dental, vision (100% employee, 50% dependents)
- Time off: Unlimited PTO (min 2 weeks/year enforced)
- Parental leave: 12 weeks (primary), 6 weeks (secondary)
- Home office: $1,500 stipend (desk, chair, monitor)
- Learning: $500/year (books, courses, conferences)
- Team offsites: 1 week/year, fully paid

See full benefits in [culture doc](./culture-doc.md).

---

## Hiring Process

We respect your time. Here's the full process (1-2 weeks total):

1. **Apply** (15 min)  
   Submit resume + 3-5 sentence cover letter: Why this role? Why now?

2. **Recruiter screen** (30 min)  
   Culture fit, logistics, answer your questions

3. **Hiring manager call** (45 min)  
   [Hiring Manager Name] — deep dive on experience, role expectations

4. **[Role-specific interview]** (90 min)  
   - **Engineering**: Coding challenge or system design (your choice)  
   - **Product**: Product case study + roadmap prioritization  
   - **Marketing**: Campaign strategy + growth experiment design  
   - **Sales**: Mock demo + objection handling

5. **Team fit call** (45 min)  
   Meet 2-3 future teammates, discuss collaboration style

6. **Founder call** (30 min)  
   [CEO Name] — company vision, strategy, answer your questions

7. **Offer** (same day or next day)

**What we're optimizing for**:
- Speed (move fast, decide fast)
- Transparency (no surprise rounds, clear expectations)
- Two-way evaluation (you're interviewing us too)

---

## Why Join Us?

### Impact

You'll own [X], not be a cog in a machine.

**Compare**:  
- At Google: Work on 1% of a project, launch in 18 months  
- Here: Own 20% of product, ship in 2 weeks, see customer impact immediately

### Learning

You'll work directly with [Founder/CTO/etc.] and learn [specific skill] faster than anywhere else.

**Example**: Our [CTO] previously [built X at Y company]. You'll pair program, do weekly 1:1s, and get mentorship you won't find at a 500-person company.

### Equity Upside

Your 0.2% equity stake:
- **Current value** (at $10M valuation): ~$20K
- **If we hit $100M** (Series B range): ~$200K
- **If we exit at $500M** (mid-size acquisition): ~$1M

(This assumes no dilution; actual value depends on performance and dilution from future fundraising.)

### Mission

We're solving [problem] that affects [X people/companies].

[Specific story or statistic that shows why this matters.]

### Team

- [X people], [Y disciplines]
- No politics, no bureaucracy (flat structure, [CEO] has 5 direct reports)
- High-trust culture (see [culture doc](./culture-doc.md))

### Flexibility

- Remote-first (or hybrid, or in-office — specify)
- Async culture (few meetings, focus on outcomes)
- Work when you're productive (not tracking hours)

---

## How to Apply

**Apply here**: [Link to Lever, Greenhouse, or email]

**Cover letter** (3-5 sentences):
- Why this role?
- Why now (what makes this the right time for you)?
- What's one thing you've built that you're proud of?

**Timeline**: We review applications daily and respond within 3 business days.

**Questions?** Email [hiring@company.com](mailto:hiring@company.com) — we'll reply within 24 hours.

---

**[Company Name] is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.**
```

## Writing Rules

1. **No clichés** — Avoid "rockstar," "ninja," "passionate," "fast-paced."
2. **Outcome-oriented** — Describe what success looks like (not tasks like "attend meetings").
3. **Specific requirements** — "Built backend systems serving 10K+ req/sec" (not "5+ years experience").
4. **Transparent compensation** — Provide salary range, equity percentage, benefits.
5. **Full hiring process** — Outline every step (7 steps max), total timeline (1-2 weeks).
6. **Why join** — Make it specific to YOUR company (not generic "great culture").
7. **Equity context** — Explain what the equity could be worth (current value + upside scenarios).

## Cross-References

- Link to `culture-doc.md` for full benefits and operating principles
- Link to `onboarding-playbook.md` for Day 1 context (what new hire will experience)
- Link to `interview-kit.md` for interview structure (hiring manager will use this)

## After completion

1. Verify salary range is market rate (check Carta Total Comp or Pave).
2. Ensure "What Success Looks Like" section has 30/90/365-day outcomes.
3. Confirm hiring process has 5-7 steps and 1-2 week timeline.
4. Write output to `people/output/jd-{role-slug}.md` (e.g., `jd-senior-backend-engineer.md`).
