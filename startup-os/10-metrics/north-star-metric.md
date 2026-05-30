# North Star Metric

> The single metric that best captures the core value you deliver to customers - your company's guiding light.

---

## Overview

A North Star Metric is the one metric that best captures the value your product creates for customers. It's the metric that, when it goes up, indicates your business is healthy and growing in a sustainable way.

**Why you need a North Star:**
- Aligns entire company around what matters most
- Simplifies prioritization (does this initiative move the North Star?)
- Predicts long-term business success better than vanity metrics
- Creates accountability across product, growth, and revenue teams

**Related documents:**
- `kpi-framework.md` - Complete catalog of all metrics
- `dashboard-mockup.md` - How to visualize the North Star
- `weekly-review.md` - Weekly ritual for tracking progress
- `investor-update.md` - Monthly reporting to investors
- `../03-product/success-metrics.md` - Product metrics philosophy
- `../04-finance/unit-economics.md` - How North Star drives unit economics

---

## What Makes a Good North Star Metric?

### The Criteria

A good North Star Metric must be:

1. **Expresses Core Value**
   - Captures the "aha moment" or core value prop
   - When this number goes up, customers are getting value

2. **Measures Customer Success**
   - Aligns your success with customer success
   - Not just company-centric (revenue), but customer-centric (value delivered)

3. **Predicts Business Outcomes**
   - Leading indicator of revenue, retention, growth
   - When North Star grows, business outcomes improve

4. **Actionable**
   - Product, growth, and sales can all influence it
   - Clear levers to pull (not a black box)

5. **Measurable**
   - Can be tracked daily, weekly, monthly
   - Data is reliable and accessible

6. **Understandable**
   - Everyone in the company can explain it
   - Simple enough to rally around

---

## Our North Star Metric

### The Metric

**North Star Metric:** [PLACEHOLDER - Weekly Active Forecasters]

**Definition:** Number of unique users who view or update a forecast in a given week

**Current Value:** [PLACEHOLDER - 0 (pre-launch)]

**Target:**
- **Week 4 (Alpha):** [PLACEHOLDER - 5 weekly active forecasters (internal team)]
- **Week 12 (Beta):** [PLACEHOLDER - 40 weekly active forecasters (5-10 beta customers)]
- **Month 3 (Launch):** [PLACEHOLDER - 200 weekly active forecasters (20-30 customers)]
- **Month 6:** [PLACEHOLDER - 800 weekly active forecasters (80-100 customers)]
- **Month 12:** [PLACEHOLDER - 4,000 weekly active forecasters (400-500 customers)]

---

### Why This Metric?

**This metric captures our core value proposition:**

[PLACEHOLDER - Example reasoning:
"We help revenue leaders forecast accurately and confidently. If users are checking forecasts weekly, it means:
1. They trust the data (accuracy is good enough)
2. Forecasting is part of their workflow (we're integrated into their process)
3. They're deriving value (making better decisions)

This predicts retention and expansion better than vanity metrics like total users or page views. A user who checks forecasts every week for 6 months will:
- Renew their subscription (retention)
- Invite their team (expansion)
- Recommend us to peers (referrals)

Conversely, if weekly active users decline, it's an early warning signal that customers aren't finding value, which predicts churn."]

---

### What Doesn't Count as Activity

**To count as "active," a user must:**
- [PLACEHOLDER - View a forecast dashboard OR]
- [PLACEHOLDER - Update a forecast OR]
- [PLACEHOLDER - Drill into forecast details OR]
- [PLACEHOLDER - Export forecast data]

**What does NOT count:**
- Logging in but not viewing forecasts
- Checking settings or profile
- Reading help docs or support articles
- Receiving email notifications (passive, not active engagement)

**Why this matters:** We want to measure *meaningful* engagement with core product value, not just any activity.

---

## North Star Metric Framework

### The North Star Tree

Your North Star is influenced by **input metrics** (the levers you can pull). Think of it as a tree:

```
                    [NORTH STAR METRIC]
                    Weekly Active Forecasters
                            |
          __________________|__________________
         |                  |                  |
    ACQUISITION        ACTIVATION          RETENTION
         |                  |                  |
    New Signups       Activation Rate     Week 1 Retention
    (volume)          (% who activate)    (% who come back)
```

**Formula:**
```
Weekly Active Forecasters = (New Signups × Activation Rate × Week 1 Retention) 
                           + Existing Active Users from Previous Weeks
```

**Simplified:**
```
WAF = New Active Users + Retained Active Users
```

---

### Input Metrics (The Levers)

These are the 3-5 metrics that directly drive the North Star. Focus here to move the North Star.

---

#### Input Metric 1: New Signups

**Definition:** Number of new users who create an account

**Current Baseline:** [PLACEHOLDER - 0 (pre-launch)]

**Target:**
- **Month 3:** 200 signups/month
- **Month 6:** 800 signups/month
- **Month 12:** 2,000 signups/month

**Owner:** [PLACEHOLDER - VP Marketing]

**How to Move It:**
- SEO and content marketing (organic inbound)
- Paid advertising (LinkedIn, Google)
- Referral program
- Product-led growth (viral loops, invite features)
- Partnerships (integration partners, co-marketing)

**Why It Matters:** Volume at the top of the funnel. Without signups, you can't activate users or grow the North Star.

**Cross-reference:** See `kpi-framework.md` Section A1 for detailed acquisition metrics.

---

#### Input Metric 2: Activation Rate

**Definition:** % of signups who complete key setup steps and experience core value

**What counts as "activated":**
- [PLACEHOLDER - Connect Salesforce account]
- [PLACEHOLDER - View forecast dashboard]
- [PLACEHOLDER - Drill into at least one forecast detail]

**Current Baseline:** [PLACEHOLDER - TBD in beta]

**Target:**
- **Beta:** 70% activation
- **Month 3 (Launch):** 80% activation
- **Month 12:** 85% activation

**Owner:** [PLACEHOLDER - Head of Product]

**How to Move It:**
- Simplify onboarding (reduce clicks, better UX)
- Speed up time-to-value (faster Salesforce sync)
- Add progress indicators (checklist, completion %)
- Proactive support (CSM outreach at Day 3 if not activated)
- Remove friction (one-click connections, smart defaults)

**Why It Matters:** Activated users are 10x more likely to become weekly actives. Activation is the gateway to North Star growth.

**Cross-reference:** See `kpi-framework.md` Section A2 and `../03-product/success-metrics.md` for activation deep dive.

---

#### Input Metric 3: Week 1 Retention

**Definition:** % of activated users who return and use the product in Week 1 after signup

**Current Baseline:** [PLACEHOLDER - TBD in beta]

**Target:**
- **Beta:** 50% Week 1 retention
- **Month 3:** 60% Week 1 retention
- **Month 12:** 70% Week 1 retention

**Owner:** [PLACEHOLDER - Head of Product + Head of Customer Success]

**How to Move It:**
- Email re-engagement (Day 2, Day 5 nudges)
- In-product notifications (new data available, insights ready)
- Habit-forming features (daily digest, weekly reports)
- CSM check-in for high-value customers (Day 3 call)
- Product improvements (make core use case faster, easier, more valuable)

**Why It Matters:** If users don't come back in Week 1, they won't become weekly actives. Early retention is the best predictor of long-term retention.

**Cross-reference:** See `kpi-framework.md` Section A3 for retention metrics.

---

#### Input Metric 4: Existing User Engagement

**Definition:** % of existing users who remain active week-over-week

**Measurement:** Week-over-week retention rate (cohort-based)

**Current Baseline:** [PLACEHOLDER - TBD]

**Target:**
- **Month 3:** 60% weekly retention (40% come back each week)
- **Month 6:** 70% weekly retention
- **Month 12:** 75% weekly retention

**Owner:** [PLACEHOLDER - Head of Product + Head of Customer Success]

**How to Move It:**
- Add retention hooks (forecast accuracy tracking, team collaboration)
- Make product more valuable over time (AI improvements, more integrations)
- Proactive CS for at-risk users (low engagement → CSM call)
- Feature adoption (get users using more features = stickier)
- Community (peer learning, best practices sharing)

**Why It Matters:** Growth = New users + Retained users. Without retention, you're filling a leaky bucket. Retention compounds growth.

---

#### Input Metric 5: Team Invites (Multiplier Effect)

**Definition:** Average number of teammates invited per active user

**Current Baseline:** [PLACEHOLDER - TBD]

**Target:**
- **Month 3:** 1.2 invites per user (20% invite at least 1 teammate)
- **Month 6:** 1.5 invites per user
- **Month 12:** 2.0 invites per user (viral coefficient >1.0)

**Owner:** [PLACEHOLDER - Head of Growth + Head of Product]

**How to Move It:**
- In-product invite prompts (at key moments of value)
- Incentivize invites (give both parties a reward)
- Make collaboration core to product (comments, shared forecasts)
- Multi-player features (team dashboards, permissions)

**Why It Matters:** Each active user who invites teammates multiplies North Star growth. This is how you achieve exponential growth, not just linear.

---

## North Star Metric Equation

### The Math

```
Weekly Active Forecasters (WAF) = 
    (New Signups × Activation Rate × Week 1 Retention) 
    + (Previous WAF × Weekly Retention Rate)
    + (Previous WAF × Avg Invites per User × Invite Acceptance Rate)

Simplified:
WAF = New Active + Retained Active + Invited Active
```

---

### Example Calculation (Month 6)

**Inputs:**
- New Signups: 800/month = 200/week
- Activation Rate: 80%
- Week 1 Retention: 60%
- Previous WAF: 600
- Weekly Retention: 70%
- Avg Invites: 1.5 per user
- Invite Acceptance: 40%

**Calculation:**
```
New Active Users = 200 signups × 80% activation × 60% W1 retention
                 = 200 × 0.8 × 0.6
                 = 96 new active users this week

Retained Active = 600 previous WAF × 70% weekly retention
                = 420 retained users

Invited Active = 600 × 1.5 invites × 40% acceptance
               = 360 invites

WAF = 96 + 420 + 360 = 876 weekly active forecasters
```

**Result:** On track to hit 800 WAF target for Month 6 ✓

---

## How to Move the North Star Metric

### The Playbook

**Focus on the highest-leverage input metric:**

1. **Early Stage (Months 0-3): Focus on Activation**
   - North Star growth is constrained by activation rate
   - Getting users to "aha moment" is #1 priority
   - Once activation >80%, shift focus

2. **Growth Stage (Months 4-6): Focus on Retention**
   - You're activating users, now keep them engaged
   - Build habit-forming features
   - Proactive customer success

3. **Scale Stage (Months 7-12): Focus on Acquisition + Virality**
   - Activation and retention are solid, now scale volume
   - Pour fuel on the fire (marketing, sales)
   - Build viral loops (team invites, referrals)

---

### Prioritization Framework

**When deciding what to build, ask:**

> "Will this initiative move the North Star Metric?"

**Decision matrix:**

| Initiative | Impact on North Star | Effort | Priority |
|------------|----------------------|--------|----------|
| [Feature A] | High (improves activation) | Medium | **P0 - Do now** |
| [Feature B] | Medium (improves retention) | Low | **P1 - Do next** |
| [Feature C] | Low (nice-to-have) | High | **P3 - Backlog** |
| [Feature D] | Unclear | Medium | **Research first** |

**Rule:** Only work on P0 and P1. Everything else is distraction.

---

### Experiments to Run

#### Experiment 1: Improve Activation Rate (Target: 75% → 85%)

**Hypothesis:** Simplifying onboarding from 5 steps to 3 steps will increase activation rate by 10 percentage points.

**Test:**
- A: Current 5-step onboarding (control)
- B: New 3-step onboarding (variant)

**Metrics:**
- Primary: Activation rate
- Secondary: Time-to-value, onboarding completion rate

**Timeline:** 2 weeks to build, 2 weeks to test (200 users per variant)

**Expected Impact on North Star:**
- Current: 200 signups/week × 75% activation × 60% W1 retention = 90 new WAF
- Improved: 200 × 85% × 60% = 102 new WAF
- **+13% North Star growth from activation improvement alone**

**Owner:** [PLACEHOLDER - Head of Product]

---

#### Experiment 2: Improve Week 1 Retention (Target: 60% → 70%)

**Hypothesis:** Sending personalized email on Day 2 with "Your forecast is ready!" will increase Week 1 return rate.

**Test:**
- A: No email (control)
- B: Email on Day 2 with CTA to view forecast (variant)

**Metrics:**
- Primary: Week 1 retention
- Secondary: Email open rate, click rate

**Timeline:** 1 week to build email, 2 weeks to test

**Expected Impact on North Star:**
- Current: 200 × 80% × 60% = 96 new WAF
- Improved: 200 × 80% × 70% = 112 new WAF
- **+17% North Star growth from retention improvement**

**Owner:** [PLACEHOLDER - Head of Growth]

---

#### Experiment 3: Increase Team Invites (Target: 1.2 → 1.8 invites per user)

**Hypothesis:** Adding "Invite Your Team" prompt at moment of value (after viewing first accurate forecast) will increase invites.

**Test:**
- A: Generic invite link in settings (control)
- B: Contextual prompt after first forecast view (variant)

**Metrics:**
- Primary: Avg invites per user
- Secondary: Invite acceptance rate, time-to-invite

**Timeline:** 2 weeks to build, 4 weeks to test (need time to see invite behavior)

**Expected Impact on North Star:**
- Current: 600 WAF × 1.2 invites × 40% = 288 invited users
- Improved: 600 × 1.8 × 40% = 432 invited users
- **+50% growth from viral loop alone**

**Owner:** [PLACEHOLDER - Head of Product + Head of Growth]

---

## Tracking the North Star Metric

### Daily Monitoring

**Dashboard:** Real-time view (updates every 15 minutes)

**Display:**
```
┌─────────────────────────────────────────────┐
│    NORTH STAR METRIC: Weekly Active Users   │
│                                             │
│         [XXX] Weekly Active Forecasters     │
│         ↑ [XX] vs last week (+XX%)          │
│                                             │
│   [===========             ] 75% to goal    │
│                                             │
│   Target: [XXX]                             │
│   Pace: On track to hit goal 🟢            │
└─────────────────────────────────────────────┘
```

**Owner:** [PLACEHOLDER - Head of Product]

**Action:** Check daily. If declining 3 days in a row, investigate immediately.

---

### Weekly Review

**Meeting:** Every Monday (see `weekly-review.md`)

**Review:**
1. North Star value (current, vs last week, vs target)
2. Input metrics (acquisition, activation, retention, invites)
3. Cohort analysis (are newer cohorts more or less engaged?)
4. Experiments running and results

**Dashboard View:**

| Metric | This Week | Last Week | WoW Change | Monthly Target | Status |
|--------|-----------|-----------|------------|----------------|--------|
| **North Star: WAF** | [XXX] | [XXX] | +XX% | [XXX] | 🟢 |
| **Input Metrics** |
| New Signups | [XXX] | [XXX] | +XX% | [XXX] | 🟢 |
| Activation Rate | XX% | XX% | +X% | 80% | 🟢 |
| Week 1 Retention | XX% | XX% | +X% | 60% | 🟡 |
| Avg Invites/User | X.X | X.X | +X.X | 1.5 | 🟡 |

**Questions to Ask:**
- Are we on track to hit monthly North Star target?
- Which input metric is the bottleneck?
- What experiments should we run this week to move the North Star?

---

### Monthly Deep Dive

**Format:** 1-hour session with full leadership team

**Agenda:**
1. North Star trend (past 3 months, projection for next 3 months)
2. Cohort retention curves (are later cohorts more engaged?)
3. Input metrics deep dive (what's working, what's not)
4. Experiment results (what we learned, what to scale)
5. Roadmap alignment (are we building the right things?)

**Output:**
- Updated roadmap priorities based on North Star learnings
- New experiment pipeline for next month
- Revised targets if needed

---

## North Star Metric Evolution

### When to Change Your North Star

**You should rarely change your North Star.** It's meant to be a long-term guiding metric. However, you might need to evolve it if:

1. **Business model changes**
   - Example: Shift from self-serve to enterprise → change from WAU to "Weekly Active Teams"

2. **Core value prop changes**
   - Example: Add new product line → North Star should capture value of both

3. **Original metric doesn't predict outcomes**
   - If North Star grows but revenue/retention don't, wrong metric

**Red flags (DON'T change for these reasons):**
- North Star is declining (that's the point - it surfaces problems!)
- Team finds it "too hard" to move (that means it's a real challenge, not a vanity metric)
- Want to pick an easier-to-game metric (defeats the purpose)

---

### Evolution Path (Example)

**Stage 1 (Months 0-6): Weekly Active Forecasters**
- Simple, measures core value
- Easy to understand and track

**Stage 2 (Months 7-12): Weekly Active Teams**
- Shift from individual to team-based metric
- Reflects evolution to collaborative forecasting

**Stage 3 (Year 2+): Forecasts Generated per Week**
- Shift from users to actions
- Better captures intensity of usage

**Key:** Each evolution maintains the principle - measuring customer value, not vanity.

---

## Common Mistakes to Avoid

### Mistake 1: Picking a Vanity Metric

**Bad North Star Examples:**
- "Total Signups" - doesn't capture value (many signups, no activation = bad)
- "Page Views" - activity, not value
- "Features Shipped" - output, not outcome

**Good North Star Examples:**
- "Weekly Active Forecasters" - captures core value (checking forecasts)
- "Forecasts Generated per Week" - measures value delivered
- "Teams Collaborating on Forecasts" - measures collaboration value

---

### Mistake 2: Picking Too Many North Stars

**You can only have ONE North Star.** If you have multiple "North Star Metrics," you have zero.

**Why?**
- North Star is meant to align the company around one thing
- Multiple North Stars create conflicting priorities
- Lack of focus = slow progress on all fronts

**Instead:**
- Pick one North Star
- Track input metrics (the levers)
- Track business metrics (revenue, retention) separately

---

### Mistake 3: Not Connecting North Star to Revenue

**Your North Star should predict revenue.** If it doesn't, it's the wrong metric.

**Test:**
- Does North Star growth correlate with MRR growth?
- Do customers with high North Star engagement have higher LTV?
- Do customers with declining North Star engagement churn?

**If answers are "no," you have the wrong North Star.**

---

### Mistake 4: Gaming the Metric

**Goodhart's Law:** "When a measure becomes a target, it ceases to be a good measure."

**Example of gaming:**
- North Star: Weekly Active Users
- Gaming: Send spam notifications to artificially inflate logins
- Result: High WAU, but users hate the product and churn

**How to prevent gaming:**
- Pair North Star with quality metrics (NPS, retention)
- Focus on delivering real value, not just moving the number
- If you're tempted to game it, your North Star is probably wrong

---

### Mistake 5: Ignoring the Input Metrics

**The North Star alone is not actionable.** You need to know *why* it's moving.

**Example:**
- North Star declines 10% this week
- Without input metrics: "We don't know why"
- With input metrics: "Activation rate dropped from 80% to 70% - onboarding is broken"

**Solution:** Always track North Star + 3-5 input metrics together.

---

## Case Studies: North Star Metrics

### Example 1: Slack

**North Star:** "Teams sending 2,000+ messages"

**Why:**
- Captures core value (team communication)
- Predicts retention (teams that send 2K+ messages have 95%+ retention)
- Actionable (product can increase messaging via features, notifications)

**Input Metrics:**
- New team signups
- Activation rate (% of teams that send 100+ messages in Week 1)
- Weekly retention (% of teams that message each week)

---

### Example 2: Airbnb

**North Star:** "Nights Booked"

**Why:**
- Captures value for both guests (find places to stay) and hosts (earn income)
- Predicts revenue (more nights booked = more fees)
- Actionable (improve search, trust, quality to increase bookings)

**Input Metrics:**
- New guest signups
- Search-to-booking conversion rate
- Repeat booking rate

---

### Example 3: Spotify

**North Star:** "Time Spent Listening"

**Why:**
- Captures core value (enjoying music)
- Predicts retention and upsell to Premium
- Actionable (better recommendations, playlists, discovery)

**Input Metrics:**
- New user signups
- Activation (% who listen to 10+ songs in Week 1)
- Weekly listening hours per user

---

## Resources & Further Reading

### Books

- "Lean Analytics" by Alistair Croll & Benjamin Yoskovitz
  - Chapter on choosing the One Metric That Matters (OMTM)

- "Hacking Growth" by Sean Ellis & Morgan Brown
  - North Star framework and growth experimentation

### Articles

- [PLACEHOLDER - "Choosing a North Star Metric" by Casey Winters]
- [PLACEHOLDER - "The North Star Metric" by Amplitude]
- [PLACEHOLDER - "One Metric That Matters" by Lean Analytics]

### Tools

- [PLACEHOLDER - Amplitude] - Product analytics for tracking North Star
- [PLACEHOLDER - Mixpanel] - Event tracking and retention analysis
- [PLACEHOLDER - Looker/Tableau] - Dashboarding and visualization

---

## Next Steps

### Before Launch

1. **Finalize North Star Metric Definition**
   - Workshop with leadership team
   - Validate that it captures core value
   - Define exactly what counts as "active"
   - **Owner:** [PLACEHOLDER - CEO + Head of Product]
   - **Due:** 2 weeks before launch

2. **Set Up Tracking**
   - Instrument events in product (user views forecast, etc.)
   - Build North Star dashboard
   - Test data accuracy
   - **Owner:** [PLACEHOLDER - Engineering + Data]
   - **Due:** 1 week before launch

3. **Map Input Metrics**
   - Identify 3-5 input metrics that drive North Star
   - Set targets for each input metric
   - Build input metrics dashboard
   - **Owner:** [PLACEHOLDER - Head of Product + CFO]
   - **Due:** 1 week before launch

4. **Create Experiment Pipeline**
   - Brainstorm 10+ experiments to move North Star
   - Prioritize by expected impact
   - Assign owners and timelines
   - **Owner:** [PLACEHOLDER - Head of Growth + Head of Product]
   - **Due:** Launch week

### Post-Launch (Ongoing)

5. **Daily Monitoring**
   - Check North Star dashboard every morning
   - Alert if declining 3 days in a row
   - **Owner:** [PLACEHOLDER - Head of Product]
   - **Cadence:** Daily

6. **Weekly Review**
   - Review North Star + input metrics in weekly meeting
   - Identify bottlenecks
   - Launch new experiments
   - **Owner:** [PLACEHOLDER - CEO]
   - **Cadence:** Every Monday (see `weekly-review.md`)

7. **Monthly Deep Dive**
   - Cohort retention analysis
   - Experiment results review
   - Roadmap alignment
   - **Owner:** [PLACEHOLDER - Head of Product + CEO]
   - **Cadence:** First week of each month

8. **Quarterly Retro**
   - Is North Star still the right metric?
   - What have we learned about moving it?
   - Adjust targets based on performance
   - **Owner:** [PLACEHOLDER - Exec Team]
   - **Cadence:** Quarterly

---

## Cross-References

- **All Metrics:** `kpi-framework.md` - Complete catalog of KPIs
- **Dashboard Views:** `dashboard-mockup.md` - How to visualize North Star
- **Weekly Reviews:** `weekly-review.md` - Weekly meeting template
- **Investor Updates:** `investor-update.md` - How to communicate North Star to investors
- **Product Metrics:** `../03-product/success-metrics.md` - Product philosophy and metrics
- **Unit Economics:** `../04-finance/unit-economics.md` - How North Star impacts LTV
- **Financial Model:** `../04-finance/financial-model.md` - Revenue projections

---

*Version 1.0 | Last Updated: [PLACEHOLDER - Date] | Owner: [PLACEHOLDER - CEO + Head of Product]*
