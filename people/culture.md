---
name: culture
description: >
  Writes culture doc: mission/purpose, how-we-work principles, decision-making framework,
  disagreement/feedback culture, growth philosophy, anti-patterns, benefits philosophy.
  Writes to people/output/culture-doc.md
allowed-tools: Read, Write, Edit, Bash
---

# Culture Document Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile (company name, mission, values, target market).
2. Read `strategy/output/vision.md` if it exists → understand long-term company vision and goals.
3. Read `people/output/onboarding-playbook.md` if it exists → ensure culture doc aligns with onboarding messaging.
4. Read `legal/output/founder-agreement-guide.md` if it exists → understand founder decision-making and equity philosophy.

## Culture Doc Structure

Generate a comprehensive culture document covering:

### 1. Mission & Purpose

**Components**:
- **Mission statement** (1-2 sentences): What we do, for whom, and why it matters
- **Vision** (1 sentence): Where we're going (5-10 year horizon)
- **Purpose** (1 paragraph): Why we exist beyond making money

**Examples**:
- Mission: "We build [product] to help [customer] [outcome] so that [impact]"
- Vision: "A world where [aspirational future state]"
- Purpose: "We believe [core belief about the world] and we're building [company] to make that real"

**Writing guidelines**:
- Avoid generic phrases ("change the world," "empower people")
- Be specific about WHO you serve and WHAT problem you solve
- Connect to founder story (why did founders start this company?)

### 2. How We Work (Operating Principles)

Generate 6-8 operating principles that define how the team works:

**Format** (for each principle):
- **Principle name** (2-4 words)
- **What it means** (1-2 sentences)
- **What it looks like in practice** (2-3 bullet points with concrete examples)
- **What it doesn't mean** (1-2 anti-patterns to avoid)

**Example principles**:
- **Bias to action**: Ship fast, learn, iterate (vs. endless planning)
- **Radical candor**: Give direct feedback with care (vs. fake harmony or brutal honesty)
- **Ownership mindset**: Act like an owner, not a renter (take responsibility, don't wait for permission)
- **First principles thinking**: Question assumptions, build from fundamentals (vs. copying competitors)
- **Embrace constraints**: Constraints breed creativity (vs. "we need more resources")
- **Disagree and commit**: Debate vigorously, then align (vs. silent disagreement)

### 3. Decision-Making Framework

Define how decisions get made:

#### Decision Types

**Type 1 (Irreversible)**: Hard to undo, high stakes (fundraising, acquisition, pivots)
- **Who decides**: Founders + board
- **Process**: Research → proposal → debate → vote
- **Timeline**: 2-4 weeks

**Type 2 (Reversible)**: Easy to undo, low stakes (feature launches, hiring, marketing campaigns)
- **Who decides**: Person closest to the problem (product manager, eng lead, marketer)
- **Process**: Share context → decide → ship → learn
- **Timeline**: 1-2 days

**Escalation rule**: If you're not sure which type → ask CEO/CTO → default to Type 2 (reversible)

#### Disagree and Commit

**Process**:
1. **Debate**: All voices heard, best argument wins (not most senior person)
2. **Decide**: Decision-maker (CEO, CTO, PM) makes final call
3. **Commit**: Everyone rallies behind decision (no "I told you so" if it fails)

**Example**:
- PM proposes Feature X
- Eng lead disagrees (technical debt concerns)
- Debate in meeting (30 min)
- PM decides to ship (they own product roadmap)
- Eng lead commits (builds Feature X, no passive-aggressive pushback)

### 4. Disagreement & Feedback Culture

#### How to Disagree

**Guidelines**:
- **In private first**: DM or 1:1 before public disagreement (no surprise callouts in meetings)
- **Assume positive intent**: Start with "I might be missing something, but..."
- **Focus on ideas, not people**: "I disagree with this approach" (not "you're wrong")
- **Bring solutions**: "Here's an alternative..." (not just "this won't work")
- **Time-box debates**: 30 min max, then decide and move on

**What it looks like**:
- ✅ "I'm concerned about X because Y. What if we tried Z instead?"
- ❌ "This is a terrible idea." (no explanation, no alternative)

#### How to Give Feedback

**Framework**: Radical Candor (care personally + challenge directly)

**Template**:
1. **Context**: "When you [specific behavior]..."
2. **Impact**: "...it caused [specific result]..."
3. **Request**: "...in the future, can you [specific ask]?"

**Example**:
- ✅ "When you interrupted Sarah in the standup, it shut down her idea. In the future, can you let people finish before jumping in?"
- ❌ "You need to be a better listener." (vague, no actionable request)

**Timing**: Within 24 hours (feedback is perishable)

#### How to Receive Feedback

**Guidelines**:
- **Listen first**: Don't defend, don't explain (just absorb)
- **Say "thank you"**: Even if you disagree (feedback is a gift)
- **Reflect**: Take 24 hours before responding (avoid emotional reaction)
- **Follow up**: "I thought about your feedback on X, here's what I'm changing..."

### 5. Growth Philosophy

#### Career Growth

**Principles**:
- **Ownership > title**: We promote based on impact, not tenure
- **Stretch assignments**: You grow by doing hard things (we'll support you)
- **Feedback loops**: Weekly 1:1s, quarterly reviews, real-time feedback

**Growth paths**:
- **Individual contributor (IC) track**: Engineer → Senior Engineer → Staff Engineer → Principal (no management required)
- **Management track**: Engineer → Engineering Manager → Director → VP
- **Lateral moves**: Encouraged (eng → product, sales → ops)

**What unlocks promotion**:
- Consistently deliver at next level for 2+ quarters (not waiting for title to do the work)
- Example: Senior Engineer → Staff? Show Staff-level impact (mentor juniors, lead projects, drive technical strategy)

#### Learning Culture

**What we support**:
- ✅ $500/year learning budget (books, courses, conferences)
- ✅ Friday learning time (4 hours/month for side projects, learning)
- ✅ Internal talks (Lunch & Learn every 2 weeks)
- ✅ Conference attendance (1 per year for high performers)

**What we don't support**:
- ❌ Side projects that compete with company
- ❌ Consulting during work hours
- ❌ Using company resources for personal projects (unless open-source with approval)

### 6. Anti-Patterns (What We Avoid)

List 6-8 behaviors to actively avoid:

**Format**:
- **Anti-pattern name** + description
- **Why it's bad** (1-2 sentences)
- **What to do instead** (1 sentence)

**Examples**:

**1. Hero culture**
- **What it is**: One person works 80-hour weeks to "save" a project
- **Why it's bad**: Burnout, single point of failure, unsustainable
- **Instead**: Distribute ownership, ask for help, work sustainable hours

**2. Bikeshedding**
- **What it is**: Spending 2 hours debating button color, 10 min on architecture
- **Why it's bad**: Wastes time on low-stakes decisions, avoids hard problems
- **Instead**: Time-box debates, focus on high-leverage decisions

**3. Analysis paralysis**
- **What it is**: Researching for weeks, never shipping
- **Why it's bad**: Delays learning, competitors move faster
- **Instead**: Ship v1, learn from real users, iterate

**4. Blameless culture taken too far**
- **What it is**: "No one's responsible" = no accountability
- **Why it's bad**: Avoids hard conversations, tolerates low performance
- **Instead**: Own mistakes, learn, improve (but don't repeat same mistake 3 times)

**5. Consensus-driven decisions**
- **What it is**: Waiting for everyone to agree before moving
- **Why it's bad**: Slowest person dictates pace, mediocre compromises
- **Instead**: Disagree and commit (gather input, decide, move)

**6. FOMO hiring**
- **What it is**: Hiring because "everyone else is" or investor pressure
- **Why it's bad**: Dilutes culture, increases costs, slows decision-making
- **Instead**: Hire when pain is acute (team is blocked without this hire)

### 7. Benefits Philosophy

#### Compensation Principles

- **Pay fairly**: Market rate (use Carta or Pave for benchmarks)
- **Equity for all**: Everyone gets stock options (not just execs)
- **Transparent bands**: Salary ranges public internally (reduces negotiation disparity)

#### Benefits

**Health & Wellness**:
- Medical, dental, vision (company pays 100% for employee, 50% for dependents)
- Mental health: $X/month for therapy (Headspace, Talkspace, or cash)
- Fitness: $X/month for gym/ClassPass/Peloton

**Time Off**:
- Unlimited PTO (but minimum 2 weeks/year enforced)
- Parental leave: 12 weeks paid (primary caregiver), 6 weeks (secondary)
- Sabbatical: 4 weeks after 5 years

**Work Setup**:
- Remote-friendly (or remote-first, or hybrid)
- $1,500 home office stipend
- Co-working stipend if remote ($X/month for WeWork, etc.)
- Annual team offsites (1 week, fully paid)

**Learning & Growth**:
- $500/year learning budget (books, courses, conferences)
- 1 conference/year for high performers (fully paid)

**Other**:
- 401(k) match (3-4% after 1 year)
- Commuter benefits ($X/month pre-tax)
- Company laptop (MacBook or equivalent)

#### Benefits Philosophy

**Principle**: Optimize for long-term performance, not perks

**What we prioritize**:
- ✅ Health (so you can work sustainably)
- ✅ Learning (so you grow)
- ✅ Equity (so you share in upside)

**What we don't prioritize** (at early stage):
- ❌ Free lunch (nice, but not essential)
- ❌ Unlimited snacks (spend on salaries instead)
- ❌ Fancy office (we're remote-friendly)

## Output Format

Write to: `people/output/culture-doc.md`

Structure:
```markdown
# Culture Doc: [Company Name]

**Last updated**: 2026-05-29  
**Owned by**: [CEO name]  
**Review cadence**: Quarterly (or when team size doubles)

> "Culture is what happens when the founders aren't in the room."

---

## Mission & Purpose

### Mission

[One-sentence mission statement]

**Example**: "We build [product] to help [customer] [achieve outcome] so that [world impact]."

### Vision

[One-sentence vision — where we're going in 5-10 years]

**Example**: "A world where [aspirational future state]."

### Purpose

[1-2 paragraphs: Why we exist beyond making money]

**Example**:  
"We started [Company] because we believe [core belief about the world]. Today, [problem] affects [X million people/companies], and the existing solutions [why they fall short].

We're building [product] to [how it's different]. We exist to [ultimate impact beyond revenue]."

---

## How We Work

These are our operating principles — how we make decisions, ship product, and work together.

### 1. [Principle Name]

**What it means**: [1-2 sentence definition]

**What it looks like**:
- [Concrete example 1]
- [Concrete example 2]
- [Concrete example 3]

**What it doesn't mean**: [1-2 anti-patterns to avoid]

---

### 2. [Principle Name]

**What it means**: [1-2 sentence definition]

**What it looks like**:
- [Concrete example 1]
- [Concrete example 2]
- [Concrete example 3]

**What it doesn't mean**: [1-2 anti-patterns to avoid]

---

[Repeat for 6-8 principles]

---

## Decision-Making Framework

We make two types of decisions:

### Type 1: Irreversible (One-Way Doors)

**Examples**: Fundraising, acquisition, major pivots, key hires (C-level)

**Who decides**: Founders + board  
**Process**:
1. Research (1-2 weeks)
2. Written proposal (use DACI: Driver, Approver, Contributors, Informed)
3. Debate (async + sync meeting)
4. Vote (majority or consensus, depending on decision)

**Timeline**: 2-4 weeks

---

### Type 2: Reversible (Two-Way Doors)

**Examples**: Feature launches, hiring (non-exec), marketing campaigns, vendor choices

**Who decides**: Person closest to the problem (PM, eng lead, marketer)  
**Process**:
1. Share context (Slack post, doc, or quick meeting)
2. Gather input (24-48 hours)
3. Decide and ship
4. Learn and iterate

**Timeline**: 1-2 days

**Default rule**: If you're not sure which type → ask CEO/CTO → default to Type 2 (move fast)

---

### Disagree and Commit

**How it works**:
1. **Debate**: All voices heard, best argument wins (not most senior person)
2. **Decide**: Decision-maker (CEO, CTO, PM, etc.) makes final call
3. **Commit**: Everyone rallies behind decision (no "I told you so" if it fails)

**Example**:
- PM proposes Feature X
- Eng lead disagrees (concerned about technical debt)
- Team debates for 30 min
- PM decides to ship (they own product roadmap)
- Eng lead commits (builds Feature X, no passive-aggressive resistance)

**Key principle**: You can disagree in the room, but once we decide, we're 100% aligned.

---

## Disagreement & Feedback Culture

### How to Disagree

**Guidelines**:
- **Start in private**: DM or 1:1 before public disagreement (no surprise callouts in meetings)
- **Assume positive intent**: Begin with "I might be missing something, but..."
- **Focus on ideas, not people**: "I disagree with this approach" (not "you're wrong")
- **Bring solutions**: "Here's an alternative..." (not just "this won't work")
- **Time-box debates**: 30 min max, then decide and move on

**What it looks like**:
- ✅ "I'm concerned about X because Y. What if we tried Z instead?"
- ❌ "This is a terrible idea." (no explanation, no alternative)

---

### How to Give Feedback

**Framework**: Radical Candor (care personally + challenge directly)

**Template**:
1. **Context**: "When you [specific behavior]..."
2. **Impact**: "...it caused [specific result]..."
3. **Request**: "...in the future, can you [specific ask]?"

**Example**:
- ✅ "When you interrupted Sarah in the standup, it shut down her idea. In the future, can you let people finish speaking?"
- ❌ "You need to be a better listener." (vague, not actionable)

**Timing**: Within 24 hours (feedback is perishable — don't wait for quarterly review)

---

### How to Receive Feedback

**Guidelines**:
- **Listen first**: Don't defend, don't explain (just absorb)
- **Say "thank you"**: Even if you disagree (feedback is a gift)
- **Reflect**: Take 24 hours before responding (avoid emotional reaction)
- **Follow up**: "I thought about your feedback on X, here's what I'm changing..."

**What not to do**:
- ❌ "Well, actually..." (immediate defensiveness)
- ❌ "That's just your opinion." (dismissing feedback)
- ❌ Silent treatment (avoidance)

---

## Growth Philosophy

### Career Growth Principles

- **Ownership > title**: We promote based on impact, not tenure
- **Stretch assignments**: You grow by doing hard things (we'll support you)
- **Feedback loops**: Weekly 1:1s, quarterly reviews, real-time feedback

### Career Paths

#### Individual Contributor (IC) Track
- Engineer → Senior Engineer → Staff Engineer → Principal Engineer
- No management required (IC track pays same as management at equivalent level)

#### Management Track
- Engineer → Engineering Manager → Director of Engineering → VP Engineering

#### Lateral Moves
- Encouraged (e.g., engineer → product, sales → ops)
- Must demonstrate aptitude + get manager approval

### What Unlocks Promotion

**Key principle**: You work at the next level for 2+ quarters, then get promoted (not the other way around)

**Example**:
- Want to be promoted from Senior Engineer → Staff Engineer?
- Show Staff-level impact: Lead cross-team projects, mentor juniors, drive technical strategy
- Do this consistently for 2 quarters → promotion happens

**What doesn't unlock promotion**:
- ❌ Tenure ("I've been here 2 years")
- ❌ Asking without demonstrating ("When will I be promoted?")
- ❌ Title inflation at last company ("I was Staff Engineer at BigCorp")

---

### Learning Culture

**What we support**:
- ✅ $500/year learning budget (books, courses, conferences)
- ✅ Friday learning time (4 hours/month for side projects, experiments)
- ✅ Lunch & Learn (internal talks every 2 weeks, 30 min)
- ✅ Conference attendance (1 per year for high performers, fully paid)

**How to use learning budget**:
- Buy books (technical, business, leadership)
- Online courses (Udemy, Coursera, Frontend Masters)
- Conference tickets (if not covered separately)

**What we don't support**:
- ❌ Side projects that compete with company
- ❌ Consulting during work hours
- ❌ Using company resources (code, data, infra) for personal projects (unless open-source with approval)

---

## Anti-Patterns (What We Avoid)

These are behaviors we actively avoid:

### 1. Hero Culture

**What it is**: One person works 80-hour weeks to "save" a project

**Why it's bad**: Burnout, single point of failure, unsustainable, creates resentment

**Instead**: Distribute ownership, ask for help early, work sustainable hours (40-50/week max)

---

### 2. Bikeshedding

**What it is**: Spending 2 hours debating button color, 10 minutes on system architecture

**Why it's bad**: Wastes time on low-stakes decisions, avoids hard problems

**Instead**: Time-box debates (5 min for trivial, 30 min for important), focus on high-leverage decisions

---

### 3. Analysis Paralysis

**What it is**: Researching for weeks, never shipping ("we need more data")

**Why it's bad**: Delays learning, competitors move faster, overthinking kills momentum

**Instead**: Ship v1 (even if imperfect), learn from real users, iterate quickly

---

### 4. Blameless Culture Taken Too Far

**What it is**: "No one's responsible" = no accountability ("it's a team failure")

**Why it's bad**: Avoids hard conversations, tolerates low performance, erodes trust

**Instead**: Own mistakes individually, learn, improve (but don't repeat same mistake 3 times)

---

### 5. Consensus-Driven Decisions

**What it is**: Waiting for everyone to agree before moving

**Why it's bad**: Slowest person dictates pace, leads to mediocre compromises

**Instead**: Disagree and commit (gather input, decide quickly, move as one team)

---

### 6. FOMO Hiring

**What it is**: Hiring because "everyone else is scaling" or investor pressure

**Why it's bad**: Dilutes culture, increases costs, slows decision-making (more people = more coordination)

**Instead**: Hire when pain is acute ("team is blocked without this hire"), stay lean as long as possible

---

### 7. Meeting Culture

**What it is**: Defaulting to meetings for everything, no agendas, no outcomes

**Why it's bad**: Wastes time, kills focus (average worker has 4 hours of deep work per day, meetings kill that)

**Instead**:
- Default to async (Slack, Notion, Loom)
- Meetings only when necessary (decisions, brainstorms, 1:1s)
- Every meeting has agenda + outcome (decision, action items, or cancel it)

---

### 8. Perfectionism

**What it is**: "We can't ship until it's perfect"

**Why it's bad**: Perfect is enemy of good, delays learning, kills momentum

**Instead**: Ship "good enough" → learn → iterate (aim for 80% on first launch, 100% over time)

---

## Benefits Philosophy

### Compensation Principles

- **Pay fairly**: Market rate for role + location (use Carta Total Comp or Pave for benchmarks)
- **Equity for all**: Everyone gets stock options (not just execs) — typically 0.1-1% for early hires
- **Transparent bands**: Salary ranges published internally (reduces negotiation disparity, increases trust)

**Example**: Senior Engineer in SF: $140K-$180K + 0.15-0.25% equity

---

### Benefits

#### Health & Wellness

- **Medical, dental, vision**: Company pays 100% for employee, 50% for dependents
- **Mental health**: $X/month for therapy (Headspace, Talkspace, Better Help, or cash reimbursement)
- **Fitness**: $X/month for gym membership, ClassPass, Peloton, climbing gym, etc.

#### Time Off

- **PTO**: Unlimited (but minimum 2 weeks/year enforced — we track to ensure people take time off)
- **Parental leave**: 12 weeks paid (primary caregiver), 6 weeks (secondary caregiver)
- **Sabbatical**: 4 weeks paid after 5 years (to recharge and avoid burnout)

#### Work Setup

- **Location**: [Remote-first / Hybrid / In-office]
- **Home office stipend**: $1,500 (desk, chair, monitor, lighting)
- **Co-working stipend**: $X/month for WeWork, Industrious, etc. (if remote)
- **Internet**: $X/month reimbursement (if remote)
- **Team offsites**: 1 week per year, fully paid (flights, lodging, meals)

#### Learning & Growth

- **Learning budget**: $500/year (books, courses, conferences)
- **Conference attendance**: 1 per year for high performers (fully paid: ticket, flights, lodging)
- **Friday learning time**: 4 hours/month for side projects, learning

#### Financial

- **401(k) match**: 3-4% after 1 year (vested immediately)
- **Commuter benefits**: $X/month pre-tax (Caltrain, parking, bike share)
- **Company laptop**: MacBook Pro or equivalent (refreshed every 3 years)

---

### Benefits Philosophy

**Principle**: Optimize for long-term performance, not flashy perks

**What we prioritize**:
- ✅ Health (so you can work sustainably for 5+ years, not burn out in 2)
- ✅ Learning (so you grow faster than anywhere else)
- ✅ Equity (so you share in upside — early hires can make life-changing wealth)

**What we don't prioritize** (at early stage):
- ❌ Free lunch (nice, but not essential — we'd rather pay higher salaries)
- ❌ Unlimited snacks (spend on equity comp instead)
- ❌ Fancy office (we're remote-friendly, invest in home office stipends)

**When we'll add more**: After Series A+ ($2M+ raised), we'll revisit perks (catered lunch, bigger learning budget, etc.)

---

## Living This Culture

**How we reinforce culture**:
- **Hiring**: Culture fit is 30% of interview scorecard (alongside skills + experience)
- **Onboarding**: New hires read this doc on Day 1, discuss in Week 1 1:1
- **Performance reviews**: Culture principles are part of quarterly review (did you live these values?)
- **Promotions**: Can't be promoted without demonstrating cultural alignment (skills + culture)

**How we update this doc**:
- **Quarterly review**: CEO + leadership team review, update as company evolves
- **Team input**: Anyone can propose changes (open a PR, tag CEO for review)
- **Version control**: Track changes in Git (see history to understand how culture evolved)

**Red flags** (when we're failing to live this culture):
- ❌ People avoid hard conversations (fear of conflict)
- ❌ Decisions take 3+ weeks (analysis paralysis)
- ❌ High performers leave (culture isn't retaining top talent)
- ❌ New hires don't feel welcomed (onboarding is broken)
- ❌ Meetings have no outcomes (bikeshedding)

**If you see these**, raise to your manager or CEO immediately (culture breaks fast if ignored).

---

## Final Notes

**Culture is not**:
- ❌ Ping-pong tables, free beer, hackathons
- ❌ A document you read once and forget
- ❌ Something only HR owns

**Culture is**:
- ✅ What happens when founders aren't in the room
- ✅ How we make decisions, give feedback, resolve conflict
- ✅ What we reward (promotions) and what we don't tolerate (firings)

**Everyone owns culture** — from Day 1 intern to CEO.
```

## Writing Rules

1. **Be specific, not generic** — Avoid "change the world," "empower people," "work hard, play hard."
2. **6-8 operating principles** — Each with concrete examples and anti-patterns.
3. **Real decision framework** — Differentiate Type 1 (irreversible) vs. Type 2 (reversible) decisions.
4. **Feedback templates** — Give exact language for giving/receiving feedback (Radical Candor model).
5. **Anti-patterns section** — List 6-8 behaviors to avoid (hero culture, bikeshedding, analysis paralysis).
6. **Benefits with philosophy** — Don't just list benefits, explain *why* (long-term performance > flashy perks).
7. **Living document** — Include "How we update this doc" and "Red flags we're failing."

## Cross-References

- Link to `founder-agreement.md` for equity philosophy and decision-making
- Link to `onboarding-playbook.md` for Day 1 culture orientation
- Link to `job-description.md` templates for culture fit interview questions

## After completion

1. Ensure 6-8 operating principles with concrete examples.
2. Verify decision framework differentiates Type 1 vs. Type 2.
3. Confirm anti-patterns section has 6-8 behaviors.
4. Write output to `people/output/culture-doc.md`.
