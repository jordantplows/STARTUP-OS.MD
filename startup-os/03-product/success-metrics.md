# Success Metrics & KPIs

> The numbers that tell you if your product is working - what to measure, why it matters, and how to improve it.

---

## Overview

This document defines the key performance indicators (KPIs) that measure product health and business success. Use it to:

- Track progress toward product and business goals
- Identify what's working and what needs improvement
- Make data-driven decisions about roadmap and resource allocation
- Communicate product performance to stakeholders (board, investors, team)

**Related documents:**
- `product-spec.md` - Product goals and success criteria
- `mvp-roadmap.md` - Milestones and timeline
- `feature-prioritization.md` - How metrics inform prioritization
- `../01-foundation/lean-canvas.md` - Key business metrics

---

## Metrics Philosophy

### Principles

1. **Outcome metrics > Activity metrics** - Measure results (revenue, retention), not just activity (features shipped, users added)
2. **Leading indicators > Lagging indicators** - Track early signals (engagement, activation) that predict future outcomes (revenue, churn)
3. **Actionable > Vanity** - Focus on metrics you can influence with product/marketing decisions
4. **Simple > Complex** - Better to track 5 metrics well than 50 metrics poorly
5. **Context matters** - Metrics mean nothing without benchmarks, trends, and segmentation

### Metrics Hierarchy

```
North Star Metric (one number that captures core value)
    ├─ Product KPIs (activation, engagement, retention)
    ├─ Business KPIs (revenue, growth, efficiency)
    └─ Feature Metrics (adoption, usage, satisfaction)
```

---

## North Star Metric

### What is a North Star Metric?

The single metric that best captures the core value you deliver to customers. It should:
- Align product success with customer value
- Be measurable and trackable
- Be actionable (you can influence it)
- Predict long-term business outcomes

---

### Our North Star Metric

**Metric:** [PLACEHOLDER: E.g., "Weekly Active Forecasters"]

**Definition:** [PLACEHOLDER: E.g., "Number of unique users who view or update a forecast in a given week"]

**Why this metric:**

[PLACEHOLDER: E.g., "This captures our core value prop - helping revenue leaders forecast accurately. If users are checking forecasts weekly, it means: (1) they trust the data, (2) forecasting is part of their workflow, (3) they're deriving value. This predicts retention and expansion better than vanity metrics like total users or page views."]

**Target:**

- **Week 4 (Alpha):** [PLACEHOLDER: E.g., "5 weekly active forecasters (internal team)"]
- **Week 12 (Beta):** [PLACEHOLDER: E.g., "40 weekly active forecasters (5-10 beta customers)"]
- **Month 3 (Launch):** [PLACEHOLDER: E.g., "200 weekly active forecasters (20-30 customers)"]
- **Month 6:** [PLACEHOLDER: E.g., "800 weekly active forecasters (80-100 customers)"]
- **Month 12:** [PLACEHOLDER: E.g., "4,000 weekly active forecasters (400-500 customers)"]

**How to move it:**

- Improve onboarding (more users successfully connect Salesforce)
- Increase engagement (email notifications, Slack integration)
- Add retention hooks (forecast accuracy tracking, weekly digest)
- Expand to more user roles (RevOps, CROs, not just Sales Directors)

---

## Product KPIs

### Activation Metrics

**Definition:** Measures whether new users reach "aha moment" and become engaged users.

---

#### 1. Signup to First Forecast (Time-to-Value)

**What it measures:** How long it takes new user to see their first forecast

**Why it matters:** Faster time-to-value = higher activation and retention

**Target:**
- **Alpha:** [PLACEHOLDER: E.g., "30 minutes (acceptable for early version)"]
- **Beta:** [PLACEHOLDER: E.g., "15 minutes (improved onboarding)"]
- **Launch:** [PLACEHOLDER: E.g., "10 minutes (polished experience)"]

**How to measure:** Median time from account creation to first forecast view

**Benchmark:** [PLACEHOLDER: E.g., "Best-in-class SaaS products achieve 'aha moment' in < 10 minutes"]

**How to improve:**
- Simplify Salesforce connection (reduce clicks, better error messages)
- Speed up initial data sync (parallel processing, smart prioritization)
- Preload dashboard with sample data while real data syncs
- Add progress indicators and setup checklist

---

#### 2. Activation Rate

**What it measures:** % of signups who complete key setup steps and see value

**Why it matters:** Predicts long-term retention - users who activate are 10x more likely to become paying customers

**Definition:** User is "activated" when they:
- [ ] [PLACEHOLDER: E.g., "Connect Salesforce account"]
- [ ] [PLACEHOLDER: E.g., "View forecast dashboard"]
- [ ] [PLACEHOLDER: E.g., "Drill into at least one forecast number"]

**Target:**
- **Beta:** [PLACEHOLDER: E.g., "70% activation rate"]
- **Launch:** [PLACEHOLDER: E.g., "80% activation rate"]
- **Month 6:** [PLACEHOLDER: E.g., "85% activation rate"]

**Benchmark:** [PLACEHOLDER: E.g., "B2B SaaS average is 60-70%; best-in-class is 80%+"]

**How to improve:**
- Improve onboarding flow (progressive disclosure, inline help)
- Proactive support (CSM reaches out to users who haven't activated in 48 hours)
- Incentivize activation (unlock advanced features after completing setup)

---

### Engagement Metrics

**Definition:** Measures how often and how deeply users engage with the product.

---

#### 3. Daily Active Users (DAU) / Weekly Active Users (WAU)

**What it measures:** Number of unique users who log in and use product daily/weekly

**Why it matters:** Engagement predicts retention - engaged users don't churn

**Target:**
- **Beta (Week 12):** [PLACEHOLDER: E.g., "40 WAU"]
- **Launch (Month 3):** [PLACEHOLDER: E.g., "200 WAU"]
- **Month 6:** [PLACEHOLDER: E.g., "800 WAU"]
- **Month 12:** [PLACEHOLDER: E.g., "4,000 WAU"]

**DAU/WAU ratio:** [PLACEHOLDER: E.g., "Target 40%+ (sticky product = daily habit)"]

**Benchmark:** [PLACEHOLDER: E.g., "B2B SaaS DAU/WAU ratios: 20-30% = good, 40%+ = great"]

**How to improve:**
- Add daily use cases (morning forecast check, daily deal alerts)
- Email/Slack notifications to bring users back
- Gamification (streaks, goals)

---

#### 4. Feature Adoption Rate

**What it measures:** % of users who use key features

**Why it matters:** Validates feature value, identifies underutilized features

**Key features to track:**

| Feature | Definition | Target Adoption | Current |
|---------|------------|-----------------|---------|
| [PLACEHOLDER: E.g., "Forecast dashboard"] | [PLACEHOLDER: E.g., "Views dashboard at least 1x/week"] | [PLACEHOLDER: E.g., "90%"] | [PLACEHOLDER: E.g., "TBD"] |
| [PLACEHOLDER: E.g., "Deal health scoring"] | [PLACEHOLDER: E.g., "Views at-risk deals at least 1x/week"] | [PLACEHOLDER: E.g., "70%"] | [PLACEHOLDER: E.g., "TBD"] |
| [PLACEHOLDER: E.g., "Drill-down analysis"] | [PLACEHOLDER: E.g., "Clicks into forecast to see underlying deals"] | [PLACEHOLDER: E.g., "60%"] | [PLACEHOLDER: E.g., "TBD"] |
| [PLACEHOLDER: E.g., "Team collaboration"] | [PLACEHOLDER: E.g., "Invites at least 1 teammate"] | [PLACEHOLDER: E.g., "50%"] | [PLACEHOLDER: E.g., "TBD"] |

**How to improve:**
- In-app prompts and tooltips for underutilized features
- Use case webinars showing how top customers use advanced features
- Email campaigns highlighting features users aren't using

---

#### 5. Session Duration & Frequency

**What it measures:** How long users spend in product, how often they return

**Why it matters:** Indicates depth of engagement, product stickiness

**Target:**
- **Average session duration:** [PLACEHOLDER: E.g., "8-12 minutes (long enough to review forecast, check at-risk deals)"]
- **Sessions per week per user:** [PLACEHOLDER: E.g., "3-5 (daily checkers are 5+, weekly checkers are 1-2)"]

**How to improve:**
- Make product faster (reduce load times)
- Add depth (drill-downs, related insights)
- Surface insights that require exploration

---

### Retention Metrics

**Definition:** Measures whether users stick around over time.

---

#### 6. User Retention Rate (Cohort-based)

**What it measures:** % of users who return after Day 1, Week 1, Month 1, etc.

**Why it matters:** Retention is the #1 predictor of long-term success - if users don't come back, nothing else matters

**Retention curve targets:**

| Timeframe | Target Retention | Benchmark |
|-----------|------------------|-----------|
| Day 1 | [PLACEHOLDER: E.g., "60%"] | [PLACEHOLDER: E.g., "B2B SaaS: 40-60%"] |
| Week 1 | [PLACEHOLDER: E.g., "50%"] | [PLACEHOLDER: E.g., "B2B SaaS: 30-50%"] |
| Month 1 | [PLACEHOLDER: E.g., "40%"] | [PLACEHOLDER: E.g., "B2B SaaS: 25-40%"] |
| Month 3 | [PLACEHOLDER: E.g., "35%"] | [PLACEHOLDER: E.g., "B2B SaaS: 20-35%"] |
| Month 6 | [PLACEHOLDER: E.g., "30%"] | [PLACEHOLDER: E.g., "B2B SaaS: 15-30%"] |

**How to measure:** Cohort analysis - track users who signed up in [week/month] and see what % return each period

**How to improve:**
- Increase activation rate (activated users retain 10x better)
- Email re-engagement campaigns
- Add retention hooks (weekly digest, forecast accuracy tracking)

---

#### 7. Customer Retention Rate (MRR-based)

**What it measures:** % of customers who renew month-over-month or year-over-year

**Why it matters:** Customer retention = revenue retention. Churn kills growth.

**Target:**
- **Monthly retention:** [PLACEHOLDER: E.g., "95%+ (< 5% monthly churn)"]
- **Annual retention:** [PLACEHOLDER: E.g., "85%+ (< 15% annual churn)"]

**Benchmark:** [PLACEHOLDER: E.g., "B2B SaaS benchmarks: 90-95% monthly retention, 80-90% annual retention for mid-market"]

**How to improve:**
- Increase product engagement (engaged users don't churn)
- Proactive CSM outreach to at-risk customers (low usage, support tickets)
- Product improvements based on churn reasons
- Longer contracts (annual vs. monthly)

---

#### 8. Net Revenue Retention (NRR)

**What it measures:** Revenue retained + expanded from existing customers (includes upgrades, downgrades, churn)

**Why it matters:** NRR > 100% means you're growing revenue from existing customers even without new logos

**Formula:** (Starting MRR + Expansion - Downgrade - Churn) / Starting MRR

**Target:**
- **Month 6:** [PLACEHOLDER: E.g., "90% (acceptable early on, focus is on acquisition)"]
- **Month 12:** [PLACEHOLDER: E.g., "100% (break-even on retention + expansion)"]
- **Year 2:** [PLACEHOLDER: E.g., "110%+ (expansion covers churn with 10% net growth)"]

**Benchmark:** [PLACEHOLDER: E.g., "Best-in-class B2B SaaS: 110-120% NRR"]

**How to improve:**
- Reduce churn (see Customer Retention above)
- Increase expansion revenue (upsell more seats, higher tiers, add-ons)
- Identify expansion triggers (usage milestones, team growth, feature requests)

---

### Satisfaction Metrics

---

#### 9. Net Promoter Score (NPS)

**What it measures:** Would users recommend your product to a peer?

**Why it matters:** NPS predicts organic growth, customer advocacy, and long-term retention

**Survey question:** "How likely are you to recommend [Product] to a friend or colleague?" (0-10 scale)

**Calculation:** % Promoters (9-10) - % Detractors (0-6)

**Target:**
- **Beta:** [PLACEHOLDER: E.g., "40+ (decent for early product)"]
- **Month 3:** [PLACEHOLDER: E.g., "50+ (product-market fit signal)"]
- **Month 12:** [PLACEHOLDER: E.g., "60+ (strong product-market fit)"]

**Benchmark:** [PLACEHOLDER: E.g., "B2B SaaS average: 30-40; best-in-class: 50-70"]

**Survey cadence:** [PLACEHOLDER: E.g., "Quarterly for all active users, monthly for new users (30 days post-signup)"]

**How to improve:**
- Fix detractor pain points (read NPS comments, identify patterns)
- Double down on what promoters love
- Close the loop (respond to every NPS survey personally)

---

#### 10. Customer Satisfaction Score (CSAT)

**What it measures:** Are users satisfied with specific features or interactions?

**Why it matters:** More granular than NPS - helps identify specific problem areas

**Survey question:** "How satisfied are you with [feature/experience]?" (1-5 scale)

**Calculation:** (# of 4-5 ratings / total ratings) × 100

**Target:** [PLACEHOLDER: E.g., "80%+ satisfaction across all core features"]

**When to survey:**
- Post-onboarding (Day 7)
- Post-support interaction
- Post-feature release (30 days after launch)
- Quarterly product satisfaction survey

**How to improve:**
- Fix low-scoring features or experiences
- Survey after every support interaction to catch issues early

---

## Business KPIs

### Growth Metrics

---

#### 11. New Signups / Leads

**What it measures:** How many new users are entering the funnel?

**Why it matters:** Top-of-funnel metric - you need volume to hit revenue targets

**Target:**
- **Beta:** [PLACEHOLDER: E.g., "10 signups/week (design partner recruitment)"]
- **Launch (Month 1):** [PLACEHOLDER: E.g., "50 signups/week"]
- **Month 6:** [PLACEHOLDER: E.g., "200 signups/week"]
- **Month 12:** [PLACEHOLDER: E.g., "500 signups/week"]

**How to improve:**
- SEO and content marketing (inbound leads)
- Paid ads (LinkedIn, Google, targeted campaigns)
- Referral program (incentivize current users to invite peers)
- Product-led growth (freemium or free trial → conversion)

---

#### 12. Trial/Signup to Paid Conversion Rate

**What it measures:** % of trials/signups that convert to paying customers

**Why it matters:** Indicates product-market fit and sales effectiveness

**Target:**
- **Beta → Paid:** [PLACEHOLDER: E.g., "40% (design partners should convert at high rate)"]
- **Trial → Paid:** [PLACEHOLDER: E.g., "20% (industry average for B2B SaaS)"]
- **Month 12 goal:** [PLACEHOLDER: E.g., "25% (improved onboarding and sales process)"]

**Benchmark:** [PLACEHOLDER: E.g., "B2B SaaS trial-to-paid: 15-25% is typical, 30%+ is excellent"]

**How to improve:**
- Improve activation (more activated users convert)
- Sales follow-up (call every trial user, understand needs)
- Pricing optimization (test different price points and packaging)
- Add urgency (limited-time discount, expiring trial)

---

#### 13. Monthly Recurring Revenue (MRR)

**What it measures:** Predictable monthly revenue from subscriptions

**Why it matters:** The primary business metric for SaaS - indicates growth trajectory

**Components:**
- **New MRR:** Revenue from new customers this month
- **Expansion MRR:** Revenue from upgrades/upsells
- **Contraction MRR:** Revenue lost from downgrades
- **Churned MRR:** Revenue lost from cancellations

**Target:**
- **Month 3:** [PLACEHOLDER: E.g., "$50K MRR"]
- **Month 6:** [PLACEHOLDER: E.g., "$200K MRR"]
- **Month 12:** [PLACEHOLDER: E.g., "$1M MRR"]

**Growth rate target:** [PLACEHOLDER: E.g., "15-20% month-over-month for first year"]

**How to improve:**
- Increase new customer acquisition
- Reduce churn (see retention metrics)
- Increase expansion revenue (upsells, more seats)
- Optimize pricing (raise prices, add higher tiers)

---

#### 14. Average Revenue Per Account (ARPA)

**What it measures:** Average MRR per customer

**Why it matters:** Indicates customer value and market positioning (SMB vs. mid-market vs. enterprise)

**Formula:** Total MRR / # of Customers

**Target:**
- **Month 3:** [PLACEHOLDER: E.g., "$2,000/month (targeting mid-market)"]
- **Month 12:** [PLACEHOLDER: E.g., "$2,500/month (mix of mid-market and some enterprise)"]

**Benchmark:** [PLACEHOLDER: E.g., "SMB: $50-500/mo, Mid-market: $1K-10K/mo, Enterprise: $10K+/mo"]

**How to improve:**
- Move upmarket (target larger customers)
- Add higher-tier pricing
- Upsell existing customers to more seats/features

---

### Efficiency Metrics

---

#### 15. Customer Acquisition Cost (CAC)

**What it measures:** Total cost to acquire one customer (sales + marketing spend / new customers)

**Why it matters:** If CAC is too high relative to LTV, business isn't sustainable

**Formula:** (Sales + Marketing expenses) / New customers acquired

**Target:**
- **Month 6:** [PLACEHOLDER: E.g., "$5,000 CAC (early, inefficient marketing)"]
- **Month 12:** [PLACEHOLDER: E.g., "$3,000 CAC (more efficient channels, referrals)"]

**Benchmark:** [PLACEHOLDER: E.g., "B2B SaaS mid-market: $3K-10K CAC depending on ACV"]

**How to improve:**
- Optimize marketing channels (double down on high-ROI channels)
- Improve conversion rates (better onboarding, sales process)
- Product-led growth (self-service reduces sales cost)
- Referrals (lowest CAC channel)

---

#### 16. CAC Payback Period

**What it measures:** How many months to recover CAC from customer revenue?

**Why it matters:** Indicates capital efficiency - faster payback = less capital needed to grow

**Formula:** CAC / (ARPA × Gross Margin)

**Target:**
- **Month 12:** [PLACEHOLDER: E.g., "12 months (acceptable for mid-market)"]
- **Year 2:** [PLACEHOLDER: E.g., "< 9 months (efficient growth)"]

**Benchmark:** [PLACEHOLDER: E.g., "Best-in-class B2B SaaS: < 12 months payback"]

**How to improve:**
- Reduce CAC (more efficient marketing/sales)
- Increase ARPA (upsell, raise prices)
- Improve gross margins (reduce COGS)

---

#### 17. Lifetime Value (LTV)

**What it measures:** Total revenue expected from average customer over their lifetime

**Why it matters:** Indicates long-term customer value; used to evaluate CAC efficiency

**Formula:** ARPA × Gross Margin × (1 / Churn Rate)

**Example:** [PLACEHOLDER: E.g., "$2,000/mo ARPA × 80% margin × (1 / 5% monthly churn) = $2,000 × 0.8 × 20 months = $32,000 LTV"]

**Target:** [PLACEHOLDER: E.g., "$30K+ LTV"]

**LTV:CAC ratio target:** [PLACEHOLDER: E.g., "3:1 (healthy), 5:1+ (very healthy)"]

**Benchmark:** [PLACEHOLDER: E.g., "B2B SaaS best practice: LTV:CAC ratio of 3:1 or higher"]

**How to improve:**
- Increase ARPA (upsells, pricing)
- Reduce churn (engagement, CSM, product improvements)
- Increase gross margins (reduce cost to serve)

---

## Feature Metrics

### How to Measure Feature Success

For each new feature, define:

1. **Adoption:** % of users who use feature at least once
2. **Engagement:** % of users who use feature regularly (weekly/monthly)
3. **Impact:** Does feature usage correlate with retention/expansion?
4. **Satisfaction:** CSAT survey for feature

---

### Feature Metrics Template

| Feature | Launch Date | Adoption Target | Current Adoption | Engagement Target | Current Engagement | Impact on Retention |
|---------|-------------|-----------------|------------------|-------------------|--------------------|---------------------|
| [PLACEHOLDER: E.g., "Forecast dashboard"] | [PLACEHOLDER: E.g., "Week 8"] | [PLACEHOLDER: E.g., "90%"] | [PLACEHOLDER: E.g., "TBD"] | [PLACEHOLDER: E.g., "80% weekly"] | [PLACEHOLDER: E.g., "TBD"] | [PLACEHOLDER: E.g., "TBD"] |
| [PLACEHOLDER: E.g., "Deal health scoring"] | [PLACEHOLDER: E.g., "Week 10"] | [PLACEHOLDER: E.g., "70%"] | [PLACEHOLDER: E.g., "TBD"] | [PLACEHOLDER: E.g., "60% weekly"] | [PLACEHOLDER: E.g., "TBD"] | [PLACEHOLDER: E.g., "TBD"] |
| [PLACEHOLDER: E.g., "Slack integration"] | [PLACEHOLDER: E.g., "Month 5"] | [PLACEHOLDER: E.g., "30%"] | [PLACEHOLDER: E.g., "TBD"] | [PLACEHOLDER: E.g., "20% weekly"] | [PLACEHOLDER: E.g., "TBD"] | [PLACEHOLDER: E.g., "TBD"] |

---

## Metrics by Stage

### Alpha (Weeks 1-4): Internal Testing

**Focus:** Is it working? Can we dogfood it?

**Key metrics:**
- [ ] [PLACEHOLDER: E.g., "All core features functional (0 P0 bugs)"]
- [ ] [PLACEHOLDER: E.g., "5 internal team members using daily"]
- [ ] [PLACEHOLDER: E.g., "Dashboard load time < 3 seconds"]
- [ ] [PLACEHOLDER: E.g., "Salesforce sync completes in < 15 minutes"]

---

### Beta (Weeks 5-12): Design Partners

**Focus:** Do customers love it? Will they pay for it?

**Key metrics:**
- [ ] [PLACEHOLDER: E.g., "5-10 beta customers onboarded"]
- [ ] [PLACEHOLDER: E.g., "70%+ activation rate (connect Salesforce, see forecast)"]
- [ ] [PLACEHOLDER: E.g., "40+ weekly active users"]
- [ ] [PLACEHOLDER: E.g., "80%+ weekly retention (users come back week over week)"]
- [ ] [PLACEHOLDER: E.g., "NPS 40+ from beta customers"]
- [ ] [PLACEHOLDER: E.g., "2+ beta customers willing to pay post-beta"]

---

### Launch (Months 1-3): Early Traction

**Focus:** Can we acquire and retain paying customers?

**Key metrics:**
- [ ] [PLACEHOLDER: E.g., "20+ paying customers"]
- [ ] [PLACEHOLDER: E.g., "$50K+ MRR"]
- [ ] [PLACEHOLDER: E.g., "50 signups/week"]
- [ ] [PLACEHOLDER: E.g., "20% trial-to-paid conversion"]
- [ ] [PLACEHOLDER: E.g., "80% activation rate"]
- [ ] [PLACEHOLDER: E.g., "200+ weekly active users"]
- [ ] [PLACEHOLDER: E.g., "NPS 50+"]

---

### Growth (Months 4-12): Product-Market Fit

**Focus:** Can we scale efficiently?

**Key metrics:**
- [ ] [PLACEHOLDER: E.g., "100+ paying customers by Month 6"]
- [ ] [PLACEHOLDER: E.g., "$200K+ MRR by Month 6"]
- [ ] [PLACEHOLDER: E.g., "500+ paying customers by Month 12"]
- [ ] [PLACEHOLDER: E.g., "$1M+ MRR by Month 12"]
- [ ] [PLACEHOLDER: E.g., "15-20% month-over-month MRR growth"]
- [ ] [PLACEHOLDER: E.g., "90%+ customer retention (< 10% monthly churn)"]
- [ ] [PLACEHOLDER: E.g., "100%+ net revenue retention"]
- [ ] [PLACEHOLDER: E.g., "< 12 month CAC payback"]
- [ ] [PLACEHOLDER: E.g., "LTV:CAC ratio > 3:1"]

---

## Metrics Dashboard

### What to Track

**Real-time dashboard (check daily):**
- Signups today/this week
- Active users today/this week
- MRR (current + growth rate)
- Critical errors (uptime, sync failures)

**Weekly review dashboard:**
- Activation rate
- Retention curves
- Feature adoption
- Support tickets (volume, type, resolution time)

**Monthly review dashboard:**
- All Product KPIs (activation, engagement, retention)
- All Business KPIs (MRR, growth, CAC, LTV)
- NPS and CSAT scores
- Churn analysis (who's churning, why)

**Quarterly review dashboard:**
- Progress vs. goals
- Cohort retention analysis
- Feature performance
- Competitive benchmarking

---

### Tools

**Analytics:**
- [PLACEHOLDER: E.g., "Amplitude or Mixpanel for product analytics"]
- [PLACEHOLDER: E.g., "Segment for event tracking and data pipeline"]
- [PLACEHOLDER: E.g., "Looker or Mode for custom dashboards"]

**Business metrics:**
- [PLACEHOLDER: E.g., "Stripe for MRR and revenue metrics"]
- [PLACEHOLDER: E.g., "ChartMogul or Baremetrics for SaaS metrics"]

**Customer feedback:**
- [PLACEHOLDER: E.g., "Delighted or AskNicely for NPS surveys"]
- [PLACEHOLDER: E.g., "Intercom or Zendesk for support and CSAT"]

---

## Metrics Rituals

### Daily Check (5 minutes)

- Review real-time dashboard
- Check for critical issues (downtime, sync failures)
- Monitor signups and activation

---

### Weekly Review (30 minutes)

**What to review:**
- Did we hit weekly targets? (signups, activations, WAU, MRR)
- What's trending up/down?
- Any anomalies or surprises?

**Actions:**
- Celebrate wins
- Identify issues to investigate
- Adjust tactics if off track

---

### Monthly Deep Dive (2 hours)

**What to review:**
- All product and business KPIs
- Cohort retention analysis
- Feature adoption and performance
- NPS/CSAT results and feedback themes
- Churn analysis (who churned, why, what can we learn)

**Attendees:** Product, Engineering, Sales, CS, Marketing leadership

**Output:** 
- Metrics deck for board/investors
- List of action items to improve key metrics
- Roadmap adjustments based on learnings

---

### Quarterly Strategy Review (half day)

**What to review:**
- Progress vs. annual goals
- Deep dive on each metric (trends, segments, benchmarks)
- What's working, what's not
- Competitive landscape changes

**Output:**
- Update annual targets if needed
- Adjust roadmap priorities
- Strategic bets for next quarter

---

## Leading vs. Lagging Indicators

### Lagging Indicators (What Happened)

Measure past outcomes:
- Revenue (MRR, ARR)
- Customer count
- Churn rate

**Why they matter:** These are the ultimate success metrics.

**Limitation:** By the time you see problems here, it's too late to fix quickly.

---

### Leading Indicators (What's About to Happen)

Predict future outcomes:
- Activation rate → Predicts retention
- Engagement (WAU, session frequency) → Predicts retention and expansion
- NPS → Predicts churn and referrals
- Pipeline coverage → Predicts future revenue

**Why they matter:** These are early warning signals - fix them now to prevent future problems.

**Example:**

If activation rate drops from 80% to 60%, expect retention and MRR growth to drop 2-4 weeks later. Fix activation now (onboarding improvements, support outreach) to prevent future churn.

---

## Segmentation & Cohort Analysis

### Why Segment?

Average metrics hide problems. Segmentation reveals patterns:

- Which customer segments have highest retention?
- Which features drive the most engagement?
- Which acquisition channels produce best customers?

---

### Key Segments to Track

**By customer attribute:**
- Company size (SMB vs. mid-market vs. enterprise)
- Industry vertical
- Use case (Sales Director vs. RevOps vs. CRO)

**By behavior:**
- Activated vs. not activated
- High engagement vs. low engagement
- Feature adopters vs. non-adopters

**By acquisition channel:**
- Organic search
- Paid ads
- Referrals
- Direct (sales outreach)

---

### Cohort Analysis

**What it is:** Track groups of users who signed up in the same period and see how their behavior changes over time.

**Example:** 

| Signup Month | Month 1 Retention | Month 3 Retention | Month 6 Retention |
|--------------|-------------------|-------------------|-------------------|
| January 2026 | 80% | 60% | 45% |
| February 2026 | 85% | 65% | ? (not yet) |
| March 2026 | 90% | ? | ? |

**Insight:** Retention is improving cohort-over-cohort (product improvements, better onboarding). If it's declining, investigate why.

---

## Red Flags to Watch For

### Product Red Flags

- [ ] Activation rate declining (onboarding broken or confusing)
- [ ] WAU declining or flat (engagement dropping, need retention hooks)
- [ ] Feature adoption low (feature not valuable or not discoverable)
- [ ] Session duration dropping (product slower or less useful)
- [ ] NPS declining (product quality issues, unmet expectations)

---

### Business Red Flags

- [ ] MRR growth slowing (acquisition or retention problem)
- [ ] Churn rate increasing (engagement, CSM, or product issues)
- [ ] NRR below 100% (expansion not covering churn)
- [ ] CAC increasing (marketing efficiency declining)
- [ ] Conversion rate declining (pricing, positioning, or onboarding issues)

---

### When Metrics Lie

**Vanity metrics that don't matter:**

- Total signups (if they don't activate)
- Page views (if they don't convert or retain)
- Feature requests (loud minority, not validated demand)

**Simpson's Paradox:**

- Metric improves overall but declines in every segment (bad segmentation)
- Example: Activation rate up 5%, but down in SMB and mid-market segments (acquiring wrong customers)

**Goodhart's Law:**

- "When a measure becomes a target, it ceases to be a good measure"
- Example: Optimizing for signups leads to low-quality leads that don't convert
- Solution: Optimize for balanced scorecard, not single metric

---

## Next Steps

1. **2026-06-05**: Set up analytics tracking for all core product events (signup, activation, feature usage, retention) using Segment and Amplitude
2. **2026-06-10**: Create metrics dashboard in Looker with weekly and monthly views for product and business KPIs
3. **2026-06-17**: Establish weekly metrics review ritual with product and eng team every Monday at 9am
