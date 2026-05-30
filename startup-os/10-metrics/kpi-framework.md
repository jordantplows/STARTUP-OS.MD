# KPI Framework

> A comprehensive framework for tracking and managing all key performance indicators across the business, organized by AARRR funnel stage (Acquisition, Activation, Retention, Revenue, Referral).

---

## Overview

This document provides a complete catalog of KPIs organized by the AARRR (Pirate Metrics) framework. Each metric includes:
- **Definition & Formula** - How to calculate it
- **Owner** - Who is responsible for the metric
- **Target** - What "good" looks like
- **Data Source** - Where the data comes from
- **Frequency** - How often to measure
- **Why It Matters** - Business impact and context

**Related documents:**
- `../03-product/success-metrics.md` - Product-specific metrics and philosophy
- `../04-finance/unit-economics.md` - Economic metrics (LTV, CAC, payback period)
- `../04-finance/financial-model.md` - Financial projections and revenue metrics
- `dashboard-mockup.md` - Visual representation of key metrics
- `north-star-metric.md` - The single metric that matters most
- `weekly-review.md` - Weekly ritual for reviewing metrics
- `investor-update.md` - Monthly external reporting format

---

## Metrics Philosophy

### Principles

1. **North Star First** - All metrics ladder up to our North Star Metric
2. **Leading > Lagging** - Focus on metrics that predict future outcomes
3. **Actionable > Vanity** - Track what you can influence, not just impressive numbers
4. **Segmented > Blended** - Averages hide insights; segment by customer, cohort, channel
5. **Trends > Point-in-Time** - One data point is noise; trends reveal truth

### AARRR Framework

The Pirate Metrics (AARRR) framework organizes all metrics by customer journey stage:

```
ACQUISITION → ACTIVATION → RETENTION → REVENUE → REFERRAL
(Get users) (First value) (Come back)   (Monetize)  (Spread word)
```

**Why AARRR?**
- Forces focus on full customer lifecycle, not just acquisition
- Identifies bottlenecks (e.g., great acquisition but poor activation)
- Enables cohort analysis (how each stage improves over time)
- Standard framework for investor/board communication

---

## A1: Acquisition Metrics

**Definition:** Metrics that measure how effectively you attract potential customers into the top of the funnel.

---

### A1.1: Total Signups

**Definition:** Number of new users who create an account (free trial or freemium)

**Formula:**
```
Total Signups = Count of new account creations in time period
```

**Owner:** [PLACEHOLDER - VP Marketing]

**Target:**
- **Month 3 (Launch):** 200 signups/month
- **Month 6:** 800 signups/month
- **Month 12:** 2,000 signups/month

**Current Baseline:** [PLACEHOLDER - 0 (pre-launch)]

**Data Source:** [PLACEHOLDER - Auth0/Database] `users.created_at`

**Frequency:** Daily dashboard, weekly review, monthly deep dive

**Why It Matters:** Top-of-funnel volume. Without sufficient signups, you can't hit revenue targets. However, signups alone are a vanity metric - must be paired with activation and conversion rates.

**How to Improve:**
- SEO and content marketing (organic inbound)
- Paid advertising (LinkedIn, Google)
- Referral program
- Product-led growth (viral features, invite mechanics)

---

### A1.2: Signups by Channel

**Definition:** Breakdown of signups by acquisition channel

**Formula:**
```
Channel Signups = Signups attributed to each channel via UTM parameters or referral codes
```

**Owner:** [PLACEHOLDER - Head of Growth]

**Target (Month 6 Distribution):**
- Organic/Inbound: 30% (240 signups)
- Paid Advertising: 25% (200 signups)
- Outbound Sales: 20% (160 signups)
- Referrals: 15% (120 signups)
- Partnerships: 10% (80 signups)

**Current Baseline:** [PLACEHOLDER - TBD after launch]

**Data Source:** [PLACEHOLDER - Segment/Analytics] `signup.channel` attribute

**Frequency:** Weekly

**Why It Matters:** Not all channels are equal. Identifies highest-ROI channels for budget allocation. Essential for CAC optimization (see `../04-finance/unit-economics.md`).

**Segmentation:** Track by channel, campaign, landing page, ad creative

---

### A1.3: Cost Per Signup (CPS)

**Definition:** Average marketing spend required to generate one signup

**Formula:**
```
CPS = Total Marketing Spend / Total Signups
```

**Owner:** [PLACEHOLDER - CMO]

**Target:**
- **Month 3:** $25/signup (early inefficiency expected)
- **Month 6:** $15/signup (improving efficiency)
- **Month 12:** $10/signup (scaled efficiency)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Finance spreadsheet] Marketing budget / [PLACEHOLDER - Analytics] signup count

**Frequency:** Monthly

**Why It Matters:** Leading indicator for CAC (Customer Acquisition Cost). If CPS rises, CAC will follow. Enables early course correction on marketing efficiency.

**Note:** CPS ≠ CAC. CPS only includes marketing spend, not sales salaries. CAC is fully-loaded acquisition cost. See `../04-finance/unit-economics.md` for CAC details.

---

### A1.4: Website Visitors

**Definition:** Total unique visitors to marketing website

**Formula:**
```
Unique Visitors = Count of unique IP addresses or cookie IDs visiting marketing site
```

**Owner:** [PLACEHOLDER - Head of Marketing]

**Target:**
- **Month 3:** 5,000 visitors/month
- **Month 6:** 20,000 visitors/month
- **Month 12:** 50,000 visitors/month

**Current Baseline:** [PLACEHOLDER - 0 (pre-launch)]

**Data Source:** [PLACEHOLDER - Google Analytics] ga4.unique_users

**Frequency:** Weekly

**Why It Matters:** Top-of-funnel volume indicator. Must be paired with Visitor-to-Signup conversion rate to assess quality.

---

### A1.5: Visitor-to-Signup Conversion Rate

**Definition:** Percentage of website visitors who sign up

**Formula:**
```
Visitor-to-Signup % = (Signups / Unique Visitors) × 100
```

**Owner:** [PLACEHOLDER - Head of Growth]

**Target:**
- **Month 3:** 4% (200 signups / 5,000 visitors)
- **Month 6:** 4% (800 / 20,000)
- **Month 12:** 4% (2,000 / 50,000)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Analytics] Calculated metric

**Frequency:** Weekly

**Why It Matters:** Measures website effectiveness. If declining, signals messaging/positioning issues, poor landing pages, or traffic quality problems.

**Industry Benchmark:** [PLACEHOLDER - B2B SaaS average is 2-5%; 4%+ is strong]

---

### A1.6: Sales Qualified Leads (SQLs)

**Definition:** Number of leads that meet qualification criteria and are ready for sales outreach

**Formula:**
```
SQLs = Count of leads meeting BANT criteria (Budget, Authority, Need, Timeline)
```

**Owner:** [PLACEHOLDER - Head of Sales Development]

**Target:**
- **Month 3:** 50 SQLs/month
- **Month 6:** 200 SQLs/month
- **Month 12:** 500 SQLs/month

**Current Baseline:** [PLACEHOLDER - 0 (pre-launch)]

**Data Source:** [PLACEHOLDER - Salesforce CRM] `Lead.Status = 'SQL'`

**Frequency:** Daily (sales dashboard), weekly review

**Why It Matters:** Quality filter for sales pipeline. High SQL count with low conversion = bad qualification. Low SQL count = marketing problem.

**SQL Criteria:**
- Company size: [PLACEHOLDER - 50-500 employees (mid-market target)]
- Industry: [PLACEHOLDER - B2B software/tech companies]
- Job title: [PLACEHOLDER - Sales Director, VP Sales, CRO, RevOps]
- Pain signal: [PLACEHOLDER - Manual forecasting process, inaccurate forecasts]

---

## A2: Activation Metrics

**Definition:** Metrics that measure whether users reach "aha moment" and become engaged users.

---

### A2.1: Activation Rate

**Definition:** Percentage of signups who complete key setup steps and experience core value

**Formula:**
```
Activation Rate = (Activated Users / Total Signups) × 100

Activated = User completes all of:
  1. [PLACEHOLDER - Connect Salesforce account]
  2. [PLACEHOLDER - View forecast dashboard]
  3. [PLACEHOLDER - Drill into at least one forecast detail]
```

**Owner:** [PLACEHOLDER - Head of Product]

**Target:**
- **Beta:** 70% activation
- **Month 3 (Launch):** 80% activation
- **Month 12:** 85% activation

**Current Baseline:** [PLACEHOLDER - 0 (pre-launch)]

**Data Source:** [PLACEHOLDER - Amplitude/Mixpanel] Event: `user.activated`

**Frequency:** Daily dashboard, weekly review

**Why It Matters:** Single best predictor of retention and conversion to paid. Activated users are 10x more likely to become paying customers. Focus here before scaling acquisition.

**Industry Benchmark:** [PLACEHOLDER - B2B SaaS average: 60-70%; best-in-class: 80%+]

**Red Flags:**
- Activation declining over time = onboarding broken or product not resonating
- High signup volume but low activation = wrong target audience or marketing/product mismatch

---

### A2.2: Time-to-Value (TTV)

**Definition:** Time from signup to first experience of core value (viewing first forecast)

**Formula:**
```
TTV = Median time from account creation to first forecast view (in minutes)
```

**Owner:** [PLACEHOLDER - Head of Product]

**Target:**
- **Beta:** 30 minutes (acceptable for early version)
- **Month 3:** 15 minutes
- **Month 6:** 10 minutes (best-in-class)

**Current Baseline:** [PLACEHOLDER - TBD in beta]

**Data Source:** [PLACEHOLDER - Analytics] `first_forecast_viewed_at - created_at`

**Frequency:** Weekly

**Why It Matters:** Speed to value predicts activation and retention. Every minute of delay increases abandonment risk. Benchmark: best SaaS products achieve value in <10 minutes.

**How to Improve:**
- Simplify Salesforce OAuth flow
- Speed up initial data sync (parallel processing)
- Show sample data while real data syncs
- Add progress indicators

---

### A2.3: Onboarding Completion Rate

**Definition:** Percentage of users who complete guided onboarding flow

**Formula:**
```
Onboarding Completion = (Users who complete onboarding) / (Users who start onboarding) × 100
```

**Owner:** [PLACEHOLDER - Head of Product]

**Target:**
- **Beta:** 60%
- **Month 3:** 75%
- **Month 6:** 85%

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Analytics] Event: `onboarding.completed`

**Frequency:** Weekly

**Why It Matters:** Users who complete onboarding are 5x more likely to activate. Low completion = onboarding too long, confusing, or users encountering errors.

---

### A2.4: Onboarding Drop-off by Step

**Definition:** Where users abandon the onboarding flow

**Formula:**
```
Step Completion Rate = (Users who complete step N) / (Users who start step N) × 100
```

**Owner:** [PLACEHOLDER - Head of Product]

**Target:** Identify and fix any step with <80% completion rate

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Analytics] Funnel analysis

**Frequency:** Weekly

**Why It Matters:** Pinpoints exactly where onboarding breaks. Focus product improvements on highest-friction steps.

**Example Funnel:**
```
Step 1: Create account → 100% (baseline)
Step 2: Connect Salesforce → [PLACEHOLDER - Target 90%]
Step 3: Configure settings → [PLACEHOLDER - Target 85%]
Step 4: View first forecast → [PLACEHOLDER - Target 80%]
Step 5: Complete onboarding → [PLACEHOLDER - Target 75%]
```

---

## A3: Retention Metrics

**Definition:** Metrics that measure whether users stick around and become habitual users.

---

### A3.1: Day 1 / Week 1 / Month 1 Retention

**Definition:** Percentage of users who return after Day 1, Week 1, Month 1

**Formula:**
```
Day 1 Retention = (Users active on Day 1 after signup) / (Total signups) × 100
Week 1 Retention = (Users active in Week 1) / (Total signups) × 100
Month 1 Retention = (Users active in Month 1) / (Total signups) × 100
```

**Owner:** [PLACEHOLDER - Head of Product]

**Target:**
- **Day 1:** 60%
- **Week 1:** 50%
- **Month 1:** 40%

**Current Baseline:** [PLACEHOLDER - TBD after launch]

**Data Source:** [PLACEHOLDER - Analytics] Cohort analysis

**Frequency:** Weekly (review cohort curves)

**Why It Matters:** Early retention predicts long-term retention. If users don't come back in Week 1, they won't be around in Month 6. Focus on building habit-forming product.

**Industry Benchmark:** [PLACEHOLDER - B2B SaaS: Day 1: 40-60%, Week 1: 30-50%, Month 1: 25-40%]

---

### A3.2: Weekly Active Users (WAU) / Monthly Active Users (MAU)

**Definition:** Number of unique users who log in and use product weekly/monthly

**Formula:**
```
WAU = Count of unique users with at least 1 session in the past 7 days
MAU = Count of unique users with at least 1 session in the past 30 days
```

**Owner:** [PLACEHOLDER - Head of Product]

**Target:**
- **Month 3 (Launch):** 200 WAU, 400 MAU
- **Month 6:** 800 WAU, 1,600 MAU
- **Month 12:** 4,000 WAU, 8,000 MAU

**Current Baseline:** [PLACEHOLDER - 0 (pre-launch)]

**Data Source:** [PLACEHOLDER - Analytics] Calculated daily

**Frequency:** Daily dashboard, weekly review

**Why It Matters:** Core engagement metric. Growth in WAU/MAU indicates product stickiness. This is often the North Star Metric for product-led SaaS (see `north-star-metric.md`).

---

### A3.3: DAU/WAU Ratio (Stickiness)

**Definition:** Ratio of daily to weekly active users (measures habit formation)

**Formula:**
```
DAU/WAU Ratio = (Daily Active Users) / (Weekly Active Users)
```

**Owner:** [PLACEHOLDER - Head of Product]

**Target:**
- **Month 3:** 30% (users check 2x/week)
- **Month 6:** 35%
- **Month 12:** 40% (users check 3x/week, approaching daily habit)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Analytics] Calculated metric

**Frequency:** Weekly

**Why It Matters:** Measures product stickiness. High DAU/WAU = daily habit. Low ratio = users are "monthly checkers" not daily users. For forecasting product, 40%+ is excellent (not every user needs daily forecast checks).

**Industry Benchmark:** 
- [PLACEHOLDER - B2B SaaS average: 20-30%]
- [PLACEHOLDER - Daily habit products (Slack, Gmail): 60%+]
- [PLACEHOLDER - Weekly habit products: 30-40%]

---

### A3.4: Customer Retention Rate (Revenue-based)

**Definition:** Percentage of customers who renew month-over-month or year-over-year

**Formula:**
```
Monthly Retention Rate = (Customers at end of month) / (Customers at start of month) × 100
(Excludes new customers added during month)

Annual Retention = 1 - Churn Rate
```

**Owner:** [PLACEHOLDER - Head of Customer Success]

**Target:**
- **Month 6:** 92% monthly retention (8% monthly churn)
- **Month 12:** 95% monthly retention (5% monthly churn)
- **Year 2:** 97% monthly retention (3% monthly churn)

**Current Baseline:** [PLACEHOLDER - TBD after first renewals]

**Data Source:** [PLACEHOLDER - Stripe/Billing] Churn events

**Frequency:** Weekly (churn monitoring), monthly (cohort analysis)

**Why It Matters:** Revenue retention is #1 predictor of business sustainability. Churn kills growth. 5% monthly churn = 46% annual churn = customer lifetime of ~20 months. 3% monthly churn = 31% annual churn = lifetime of 33 months. Massive LTV impact.

**Cross-reference:** See `../04-finance/unit-economics.md` for churn impact on LTV calculations.

---

### A3.5: Gross Revenue Retention (GRR)

**Definition:** Percentage of revenue retained from existing customers (excludes expansion, includes downgrades and churn)

**Formula:**
```
GRR = (Starting MRR - Churned MRR - Downgrade MRR) / Starting MRR × 100
```

**Owner:** [PLACEHOLDER - CFO]

**Target:**
- **Year 1:** 70% annual GRR (acceptable in early stage)
- **Year 2:** 80% annual GRR
- **Year 3:** 85% annual GRR

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Stripe/Finance] Monthly MRR cohort analysis

**Frequency:** Monthly

**Why It Matters:** Pure measure of churn and downgrades without expansion masking problems. GRR <80% = high churn problem that expansion can't hide.

**Industry Benchmark:** [PLACEHOLDER - B2B SaaS best practice: 85%+ annual GRR]

---

### A3.6: Net Revenue Retention (NRR)

**Definition:** Revenue retained plus expansion from existing customers (the holy grail metric)

**Formula:**
```
NRR = (Starting MRR - Churned MRR - Downgrade MRR + Expansion MRR) / Starting MRR × 100
```

**Owner:** [PLACEHOLDER - Chief Revenue Officer]

**Target:**
- **Year 1:** 85% annual NRR (acceptable early on)
- **Year 2:** 100% annual NRR (break-even)
- **Year 3:** 115% annual NRR (net negative churn!)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Finance] Monthly cohort analysis

**Frequency:** Monthly executive review, quarterly board reporting

**Why It Matters:** NRR >100% = "net negative churn" = you can grow revenue from existing customers alone without any new logos. This is the gold standard for best-in-class SaaS. Investors value NRR >110% extremely highly.

**Industry Benchmark:** 
- [PLACEHOLDER - B2B SaaS median: 100-110%]
- [PLACEHOLDER - Best-in-class: 115-130%]
- [PLACEHOLDER - Public SaaS companies average: 105-115%]

**Cross-reference:** See `../04-finance/unit-economics.md` Section on NRR and `../04-finance/financial-model.md` for revenue retention assumptions.

---

### A3.7: Customer Churn Rate

**Definition:** Percentage of customers who cancel in a given period

**Formula:**
```
Monthly Churn Rate = (Customers Churned) / (Customers at Start of Month) × 100
```

**Owner:** [PLACEHOLDER - Head of Customer Success]

**Target:**
- **Year 1:** 5% monthly churn
- **Year 2:** 3% monthly churn
- **Year 3:** 2% monthly churn

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - CRM/Billing] Cancellation events

**Frequency:** Weekly (real-time monitoring), monthly (cohort analysis)

**Why It Matters:** Churn is the silent killer of SaaS growth. 5% monthly churn = lose half your customers every year. Reducing churn from 5% to 3% increases LTV by 50%. Highest-leverage metric to improve.

**Churn by Reason (track and analyze):**
- Product not meeting expectations
- Price too high / budget constraints
- Lack of engagement / poor onboarding
- Missing features / functionality
- Customer out of business / M&A
- Competitive displacement
- Other

---

### A3.8: Engagement Score by User

**Definition:** Composite score measuring user engagement level

**Formula:**
```
Engagement Score = Weighted combination of:
  - Logins per week (20%)
  - Features used (20%)
  - Session duration (20%)
  - Data connected (20%)
  - Team collaboration (20%)

Scale: 0-100
```

**Owner:** [PLACEHOLDER - Head of Product]

**Target:**
- Red (0-40): <10% of users (at-risk)
- Yellow (41-70): 20% of users (need engagement)
- Green (71-100): 70%+ of users (healthy)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Analytics] Calculated daily per user

**Frequency:** Daily (automated scoring), weekly (CSM review)

**Why It Matters:** Enables proactive customer success. Users with declining engagement are churn risks. CSM can intervene before cancellation.

**Action Triggers:**
- Green → Yellow: CSM check-in email
- Yellow → Red: Urgent CSM outreach call
- Red for 2 weeks: Executive escalation

---

## A4: Revenue Metrics

**Definition:** Metrics that measure how effectively you monetize users.

---

### A4.1: Monthly Recurring Revenue (MRR)

**Definition:** Total predictable monthly subscription revenue

**Formula:**
```
MRR = Sum of all monthly recurring subscription revenue
(Normalize annual contracts to monthly: Annual value / 12)
```

**Owner:** [PLACEHOLDER - CFO]

**Target:**
- **Month 3 (Launch):** $50K MRR
- **Month 6:** $200K MRR
- **Month 12:** $1M MRR

**Current Baseline:** [PLACEHOLDER - $0 (pre-launch)]

**Data Source:** [PLACEHOLDER - Stripe/Finance] Subscription data

**Frequency:** Daily dashboard, weekly review, monthly deep dive

**Why It Matters:** The primary business metric for SaaS. Tracks growth trajectory and business health. Foundation for valuation (MRR × ARR multiple).

**MRR Components (track separately):**
- **New MRR:** Revenue from new customers
- **Expansion MRR:** Upsells, add-ons from existing customers
- **Contraction MRR:** Downgrades
- **Churned MRR:** Cancellations

**Cross-reference:** See `../04-finance/financial-model.md` for detailed MRR projections and `../04-finance/unit-economics.md` for ARPA calculations.

---

### A4.2: Annual Recurring Revenue (ARR)

**Definition:** MRR annualized (proxy for annual revenue run rate)

**Formula:**
```
ARR = MRR × 12
```

**Owner:** [PLACEHOLDER - CFO]

**Target:**
- **Month 3:** $600K ARR
- **Month 6:** $2.4M ARR
- **Month 12:** $12M ARR

**Current Baseline:** [PLACEHOLDER - $0]

**Data Source:** [PLACEHOLDER - Finance] Calculated from MRR

**Frequency:** Monthly

**Why It Matters:** Standard metric for SaaS valuation and investor communication. Easier to communicate large numbers (e.g., "$12M ARR" vs. "$1M MRR").

---

### A4.3: MRR Growth Rate

**Definition:** Month-over-month percentage growth in MRR

**Formula:**
```
MRR Growth Rate = ((MRR This Month - MRR Last Month) / MRR Last Month) × 100
```

**Owner:** [PLACEHOLDER - Chief Revenue Officer]

**Target:**
- **Months 1-6:** 20-40% MoM growth (early, high-growth phase)
- **Months 7-12:** 15-20% MoM growth (maturing)
- **Year 2:** 10-15% MoM growth (scale phase)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Finance] Calculated monthly

**Frequency:** Monthly

**Why It Matters:** Tracks momentum. Declining growth rate is early warning signal. Sustained 15%+ MoM = "rocketship" trajectory that attracts investors.

**Rule of Thumb:** [PLACEHOLDER - Need 3x YoY growth to maintain investor excitement (requires ~10% MoM sustained growth)]

---

### A4.4: Average Revenue Per Account (ARPA)

**Definition:** Average MRR per customer

**Formula:**
```
ARPA = Total MRR / Total Customers
```

**Owner:** [PLACEHOLDER - Head of Revenue Operations]

**Target:**
- **Month 3:** $145/month (blended across tiers)
- **Month 6:** $170/month
- **Month 12:** $200/month (growing via expansion and tier mix shift)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Billing] Calculated metric

**Frequency:** Monthly

**Why It Matters:** Core component of LTV calculation. Increasing ARPA (via expansion, upsells, price increases) is highest-leverage way to improve unit economics.

**ARPA by Tier (track separately):**
- Starter: [PLACEHOLDER - $44/month]
- Professional: [PLACEHOLDER - $175/month]
- Enterprise: [PLACEHOLDER - $3,500/month]

**Cross-reference:** See `../04-finance/unit-economics.md` for detailed ARPA analysis and `../04-finance/pricing-strategy.md` for pricing tier details.

---

### A4.5: Trial-to-Paid Conversion Rate

**Definition:** Percentage of free trials that convert to paying customers

**Formula:**
```
Trial-to-Paid % = (Trials that converted to paid) / (Trials ended) × 100
```

**Owner:** [PLACEHOLDER - VP Sales]

**Target:**
- **Month 3:** 20% (industry average)
- **Month 6:** 22%
- **Month 12:** 25% (optimized onboarding and sales process)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - CRM] Trial conversion tracking

**Frequency:** Weekly

**Why It Matters:** Measures product-market fit and sales effectiveness. Low conversion = product not delivering value or pricing too high. High conversion = strong PMF.

**Industry Benchmark:** [PLACEHOLDER - B2B SaaS average: 15-25%; 30%+ is excellent]

**Conversion by Tier (track separately):**
- Starter: [PLACEHOLDER - Target 25% (self-service, low friction)]
- Professional: [PLACEHOLDER - Target 20% (sales-assisted)]
- Enterprise: [PLACEHOLDER - Target 15% (long sales cycle)]

---

### A4.6: Average Contract Value (ACV)

**Definition:** Average annual contract value for new customers

**Formula:**
```
ACV = Total contract value / Number of new customers
(For monthly contracts: Monthly amount × 12)
```

**Owner:** [PLACEHOLDER - VP Sales]

**Target:**
- **Year 1:** $5,000 ACV (blended)
- **Year 2:** $7,500 ACV (shift to higher tiers)
- **Year 3:** $10,000 ACV (enterprise focus)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - CRM] Closed-won deals

**Frequency:** Monthly

**Why It Matters:** Determines sales strategy. Higher ACV justifies field sales investment. Tracks shift to enterprise. Influences CAC budget (higher ACV = can afford higher CAC).

---

### A4.7: Revenue by Tier

**Definition:** Distribution of MRR across pricing tiers

**Formula:**
```
Tier MRR = Sum of MRR from all customers in tier
Tier % = (Tier MRR / Total MRR) × 100
```

**Owner:** [PLACEHOLDER - Head of Revenue Operations]

**Target (Month 12 Distribution):**
- Starter: 15% of MRR
- Professional: 40% of MRR
- Enterprise: 45% of MRR

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Billing] Subscription tier

**Frequency:** Monthly

**Why It Matters:** Tracks evolution to higher-value customers. Shift from Starter to Enterprise increases ARPA, LTV, and gross margin. Informs resource allocation (e.g., when to build enterprise features).

---

## A5: Referral Metrics

**Definition:** Metrics that measure organic growth and word-of-mouth.

---

### A5.1: Net Promoter Score (NPS)

**Definition:** Would users recommend your product to a peer?

**Formula:**
```
NPS = % Promoters (9-10) - % Detractors (0-6)

Survey: "How likely are you to recommend [Product] to a friend or colleague?" (0-10 scale)
```

**Owner:** [PLACEHOLDER - Head of Product / Head of Customer Success]

**Target:**
- **Beta:** 40+ (acceptable for early product)
- **Month 6:** 50+ (product-market fit signal)
- **Month 12:** 60+ (strong PMF, ready to scale)

**Current Baseline:** [PLACEHOLDER - TBD in beta]

**Data Source:** [PLACEHOLDER - Delighted/SurveyMonkey] NPS survey results

**Frequency:** Quarterly survey (all users), monthly survey (new users at Day 30)

**Why It Matters:** NPS predicts organic growth, referrals, and retention. High NPS = customers are advocates. Low NPS = warning signal. NPS 50+ indicates product-market fit.

**Industry Benchmark:** [PLACEHOLDER - B2B SaaS average: 30-40; best-in-class: 50-70]

**Segmentation:** Track NPS by tier, cohort, feature usage, and customer size. High-value segments should have NPS 60+.

**Follow-up Actions:**
- Detractors (0-6): Immediate outreach, understand pain points
- Passives (7-8): Understand what would make them promoters
- Promoters (9-10): Request referral, case study, testimonial

---

### A5.2: Referral Signups

**Definition:** Number of signups attributed to customer referrals

**Formula:**
```
Referral Signups = Signups with referral code or "referred by existing customer" attribution
```

**Owner:** [PLACEHOLDER - Head of Growth]

**Target:**
- **Month 3:** 5% of signups (10 referrals)
- **Month 6:** 10% of signups (80 referrals)
- **Month 12:** 15% of signups (300 referrals)

**Current Baseline:** [PLACEHOLDER - 0 (no referral program yet)]

**Data Source:** [PLACEHOLDER - Analytics] Referral attribution

**Frequency:** Weekly

**Why It Matters:** Organic growth reduces CAC and validates product-market fit. Referral customers have 2x higher LTV and 50% lower churn than other channels.

**Referral Program Mechanics:**
- Incentive for referrer: [PLACEHOLDER - $100 credit or 1 month free]
- Incentive for referee: [PLACEHOLDER - 20% off first year]
- Track referral code usage and conversion

---

### A5.3: Viral Coefficient (K-Factor)

**Definition:** How many new users does each user bring in?

**Formula:**
```
Viral Coefficient (k) = (% of users who refer) × (Avg invites per referring user) × (% invite acceptance rate)

k > 1.0 = True viral growth (exponential)
k < 1.0 = Referrals help but don't drive exponential growth
```

**Owner:** [PLACEHOLDER - Head of Growth]

**Target:**
- **Year 1:** k = 0.3 (30% of users refer, 2 invites each, 50% acceptance = 0.3)
- **Year 2:** k = 0.5 (stronger referral program)
- **Year 3:** k = 0.7 (product-led virality features)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Analytics] Invitation tracking

**Frequency:** Quarterly

**Why It Matters:** Measures organic growth loop. k >1.0 = true virality (rare for B2B). k >0.5 = strong referral contribution. Most B2B SaaS k = 0.2-0.4.

---

### A5.4: Invite Acceptance Rate

**Definition:** Percentage of product invites that result in new signups

**Formula:**
```
Invite Acceptance % = (Invites that result in signup) / (Total invites sent) × 100
```

**Owner:** [PLACEHOLDER - Head of Product]

**Target:**
- **Year 1:** 30% acceptance
- **Year 2:** 40% acceptance (improved invite UX and targeting)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Analytics] Invite flow tracking

**Frequency:** Monthly

**Why It Matters:** Measures virality effectiveness. Low acceptance = invite flow broken or wrong audience. High acceptance = strong referral loop.

**How to Improve:**
- Personalized invite messages (let referrer customize)
- Show value prop in invite landing page
- Offer incentive for both parties
- Make invitation dead simple (one-click)

---

### A5.5: Word-of-Mouth Attribution

**Definition:** Signups that cite "word of mouth" as discovery channel

**Formula:**
```
WOM % = (Signups with "referred by peer" or "word of mouth" attribution) / Total Signups × 100
```

**Owner:** [PLACEHOLDER - Head of Marketing]

**Target:**
- **Month 6:** 20% of signups
- **Month 12:** 30% of signups

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Signup survey] "How did you hear about us?"

**Frequency:** Monthly

**Why It Matters:** Organic channel with best economics (zero CAC). High WOM % indicates strong product-market fit and brand momentum.

---

## Additional Cross-Functional Metrics

### Sales Metrics

---

#### S1: Sales Pipeline Value

**Definition:** Total value of all open opportunities

**Formula:**
```
Pipeline Value = Sum of (Deal Value × Close Probability) across all open opportunities
```

**Owner:** [PLACEHOLDER - VP Sales]

**Target:** 3-5x quarterly revenue target (healthy pipeline coverage)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Salesforce CRM] Opportunity reports

**Frequency:** Daily (sales dashboard), weekly (forecast meeting)

**Why It Matters:** Leading indicator for future revenue. Insufficient pipeline = miss revenue targets in 60-90 days.

---

#### S2: Sales Cycle Length

**Definition:** Average time from opportunity creation to closed-won

**Formula:**
```
Sales Cycle = Median days from first sales touch to contract signature
```

**Owner:** [PLACEHOLDER - VP Sales]

**Target:**
- Starter: [PLACEHOLDER - 7 days (self-service)]
- Professional: [PLACEHOLDER - 30 days (sales-assisted)]
- Enterprise: [PLACEHOLDER - 90 days (complex sale)]

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - CRM] Opportunity close dates

**Frequency:** Monthly

**Why It Matters:** Faster sales cycle = higher sales efficiency, more deals closed per rep. Long cycles tie up resources and capital.

---

#### S3: Win Rate

**Definition:** Percentage of qualified opportunities that close-won

**Formula:**
```
Win Rate = (Closed-Won Deals) / (Closed-Won + Closed-Lost) × 100
```

**Owner:** [PLACEHOLDER - VP Sales]

**Target:**
- Overall: 25% (includes all leads)
- SQL to Close: 40% (qualified opportunities)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - CRM] Opportunity stage tracking

**Frequency:** Monthly

**Why It Matters:** Measures sales effectiveness and product-market fit. Low win rate = wrong target market, weak product, or sales execution issues.

---

#### S4: Average Deal Size

**Definition:** Average ARR value of closed-won deals

**Formula:**
```
Avg Deal Size = Total ARR from new customers / Number of new customers
```

**Owner:** [PLACEHOLDER - VP Sales]

**Target:**
- **Year 1:** $5,000 ARR/customer
- **Year 2:** $7,500 ARR/customer
- **Year 3:** $10,000 ARR/customer

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - CRM] Closed-won opportunity values

**Frequency:** Monthly

**Why It Matters:** Increasing deal size improves unit economics. Higher ACV justifies higher CAC and field sales investment.

---

### Customer Success Metrics

---

#### CS1: Customer Health Score

**Definition:** Composite score measuring customer health and churn risk

**Formula:**
```
Health Score = Weighted combination of:
  - Product engagement (40%)
  - NPS score (20%)
  - Support ticket volume/sentiment (20%)
  - Payment status (10%)
  - CSM relationship (10%)

Scale: 0-100
Red: 0-50 | Yellow: 51-75 | Green: 76-100
```

**Owner:** [PLACEHOLDER - Head of Customer Success]

**Target:**
- 80%+ of customers in Green
- <10% in Red (immediate intervention)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Gainsight/Totango] Health scoring system

**Frequency:** Updated daily, reviewed weekly by CSM team

**Why It Matters:** Enables proactive churn prevention. Red customers require immediate intervention. Yellow customers need engagement campaigns.

---

#### CS2: Support Ticket Volume

**Definition:** Number of support tickets opened

**Formula:**
```
Tickets per Customer = Total tickets / Total customers
```

**Owner:** [PLACEHOLDER - Head of Support]

**Target:**
- <1 ticket per customer per quarter
- 80%+ of tickets resolved in <24 hours

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Zendesk/Intercom] Support ticketing system

**Frequency:** Daily (queue monitoring), weekly (trends)

**Why It Matters:** High ticket volume = product quality issues or poor onboarding. Spikes indicate bugs or confusion. Track by category to identify systemic issues.

---

#### CS3: First Response Time

**Definition:** Time from support ticket creation to first response

**Formula:**
```
First Response Time = Median time to first response (in hours)
```

**Owner:** [PLACEHOLDER - Head of Support]

**Target:**
- <2 hours during business hours
- <4 hours after hours

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Support system] Automated SLA tracking

**Frequency:** Daily

**Why It Matters:** Fast response improves customer satisfaction and retention. Slow response increases churn risk.

---

#### CS4: Customer Satisfaction Score (CSAT)

**Definition:** Post-interaction satisfaction rating

**Formula:**
```
CSAT = (# of 4-5 star ratings / Total ratings) × 100

Survey after support interaction: "How satisfied were you?" (1-5 stars)
```

**Owner:** [PLACEHOLDER - Head of Support]

**Target:** 90%+ satisfaction (4-5 stars)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Support system] Post-interaction surveys

**Frequency:** Weekly

**Why It Matters:** Measures support quality. Low CSAT = training issue, product bugs, or wrong expectations.

---

### Marketing Metrics

---

#### M1: Marketing Qualified Leads (MQLs)

**Definition:** Leads that meet scoring criteria for marketing handoff to sales

**Formula:**
```
MQL = Leads that meet threshold score based on:
  - Demographics (company size, role, industry)
  - Behavior (website visits, content downloads, demo requests)
```

**Owner:** [PLACEHOLDER - VP Marketing]

**Target:**
- **Month 3:** 100 MQLs/month
- **Month 6:** 400 MQLs/month
- **Month 12:** 1,000 MQLs/month

**Current Baseline:** [PLACEHOLDER - 0]

**Data Source:** [PLACEHOLDER - Marketing automation] HubSpot/Marketo lead scoring

**Frequency:** Weekly

**Why It Matters:** Measures marketing effectiveness. MQL to SQL conversion rate measures alignment between marketing and sales.

---

#### M2: MQL-to-SQL Conversion Rate

**Definition:** Percentage of MQLs that sales accepts and qualifies as SQLs

**Formula:**
```
MQL-to-SQL % = (SQLs) / (MQLs) × 100
```

**Owner:** [PLACEHOLDER - Head of Sales Development]

**Target:** 50% (indicates good marketing/sales alignment)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - CRM] Lead status tracking

**Frequency:** Weekly

**Why It Matters:** Measures lead quality and marketing/sales alignment. Low conversion = marketing delivering wrong leads or sales not following up.

---

#### M3: Content Engagement

**Definition:** Engagement with marketing content (blog, guides, webinars)

**Formula:**
```
Track per asset:
  - Views
  - Time on page
  - Conversion to lead/signup
  - ROI (leads generated / cost)
```

**Owner:** [PLACEHOLDER - Content Marketing Manager]

**Target:**
- 2,000+ monthly blog visitors by Month 6
- 5+ high-performing assets (>100 leads each) by Month 12

**Current Baseline:** [PLACEHOLDER - 0]

**Data Source:** [PLACEHOLDER - Google Analytics] + [PLACEHOLDER - Marketing automation]

**Frequency:** Monthly

**Why It Matters:** Content marketing is highest-ROI long-term channel. Identifies what resonates with target audience.

---

#### M4: Organic Search Traffic

**Definition:** Visitors from organic search (Google, Bing)

**Formula:**
```
Organic Traffic = Unique visitors with source = "organic search"
```

**Owner:** [PLACEHOLDER - SEO/Content Lead]

**Target:**
- **Month 3:** 500 visitors/month
- **Month 6:** 2,000 visitors/month
- **Month 12:** 10,000 visitors/month

**Current Baseline:** [PLACEHOLDER - 0]

**Data Source:** [PLACEHOLDER - Google Analytics] Source/Medium report

**Frequency:** Monthly

**Why It Matters:** Organic search is zero-CAC channel with compounding returns. Tracks SEO investment ROI.

---

### Product Metrics

---

#### P1: Feature Adoption Rate

**Definition:** Percentage of users who use a specific feature

**Formula:**
```
Feature Adoption = (Users who use feature at least once) / (Total users) × 100
```

**Owner:** [PLACEHOLDER - Head of Product]

**Target:** Set per feature based on importance:
- Core features: 80%+ adoption
- Power features: 40-60% adoption
- Niche features: 20-30% adoption

**Current Baseline:** [PLACEHOLDER - TBD after launch]

**Data Source:** [PLACEHOLDER - Analytics] Feature usage events

**Frequency:** Monthly

**Why It Matters:** Validates feature value. Low adoption = feature not discoverable or not valuable. Informs product roadmap prioritization.

---

#### P2: Product Release Velocity

**Definition:** Number of product releases per time period

**Formula:**
```
Release Velocity = Count of production deployments per month
```

**Owner:** [PLACEHOLDER - VP Engineering]

**Target:**
- **Beta:** 1 release/week (rapid iteration)
- **Post-Launch:** 2-3 releases/week (mature CI/CD)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - GitHub/Deployment tools] Release tracking

**Frequency:** Weekly

**Why It Matters:** Fast iteration enables rapid learning and improvement. Slow releases = slow product progress.

---

#### P3: Platform Uptime

**Definition:** Percentage of time the product is available and functional

**Formula:**
```
Uptime % = (Total time - Downtime) / Total time × 100
```

**Owner:** [PLACEHOLDER - VP Engineering]

**Target:**
- **Beta:** 95% uptime (acceptable for early version)
- **Launch:** 99% uptime (1% = 7.2 hours downtime/month)
- **Year 2:** 99.9% uptime (enterprise requirement)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - StatusPage/PagerDuty] Monitoring tools

**Frequency:** Real-time monitoring, weekly review

**Why It Matters:** Downtime destroys trust and drives churn. Enterprise customers require 99.9%+ uptime.

---

#### P4: Page Load Time

**Definition:** Time for key pages to fully load

**Formula:**
```
Page Load Time = p95 load time for dashboard page (95th percentile in seconds)
```

**Owner:** [PLACEHOLDER - Engineering]

**Target:** <2 seconds p95 load time

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - New Relic/Datadog] Performance monitoring

**Frequency:** Daily

**Why It Matters:** Slow product = poor user experience = lower engagement and higher churn. Every 1 second delay = 10% engagement drop.

---

### Financial Efficiency Metrics

---

#### F1: Customer Acquisition Cost (CAC)

**Definition:** Fully-loaded cost to acquire one customer

**Formula:**
```
CAC = (Total Sales + Marketing Expenses) / New Customers Acquired
```

**Owner:** [PLACEHOLDER - CFO]

**Target:**
- **Year 1:** $885/customer
- **Year 2:** $612/customer (improved efficiency)
- **Year 3:** $765/customer (enterprise focus, higher but justified)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Finance] S&M expenses / [PLACEHOLDER - CRM] Customer count

**Frequency:** Monthly

**Why It Matters:** Core unit economics metric. Must maintain LTV/CAC >3:1 for sustainable growth.

**Cross-reference:** See `../04-finance/unit-economics.md` for detailed CAC analysis and benchmarks.

---

#### F2: Lifetime Value (LTV)

**Definition:** Total net revenue expected from average customer over their lifetime

**Formula:**
```
LTV = (ARPA × Gross Margin %) / (Churn Rate + Discount Rate)

Simplified: LTV = ARPA × Gross Margin × (1 / Churn Rate)
```

**Owner:** [PLACEHOLDER - CFO]

**Target:**
- **Year 1:** $3,200
- **Year 2:** $4,400
- **Year 3:** $5,800

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Finance] Calculated from ARPA, gross margin, churn

**Frequency:** Quarterly

**Why It Matters:** Determines how much you can afford to spend on CAC. LTV/CAC ratio is critical investor metric.

**Cross-reference:** See `../04-finance/unit-economics.md` for detailed LTV calculations.

---

#### F3: CAC Payback Period

**Definition:** Time to recover CAC from customer gross profit

**Formula:**
```
Payback Period (months) = CAC / (ARPA × Gross Margin %)
```

**Owner:** [PLACEHOLDER - CFO]

**Target:**
- **Year 1:** 7.6 months
- **Year 2:** 3.6 months (world-class)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Finance] Calculated metric

**Frequency:** Monthly

**Why It Matters:** Cash efficiency metric. Faster payback = less capital needed to grow. <12 months is healthy; <6 months is excellent.

**Industry Benchmark:** [PLACEHOLDER - Best-in-class B2B SaaS: <12 months]

---

#### F4: Magic Number (Sales Efficiency)

**Definition:** How much ARR growth you generate per dollar of S&M spend

**Formula:**
```
Magic Number = (Net New ARR this Quarter × 4) / S&M Spend Last Quarter
```

**Owner:** [PLACEHOLDER - CFO]

**Target:**
- >1.0 = Efficient growth (every $1 of S&M generates $1+ ARR)
- >2.0 = Highly efficient (pour fuel on fire)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Finance] Calculated quarterly

**Frequency:** Quarterly

**Why It Matters:** Tells you when to invest aggressively in growth. Magic Number >1.0 = green light to scale S&M spend.

---

#### F5: Burn Multiple

**Definition:** How much you burn to generate $1 of ARR growth

**Formula:**
```
Burn Multiple = Net Burn / Net New ARR

Lower is better. <1.5 is healthy; <1.0 is exceptional.
```

**Owner:** [PLACEHOLDER - CFO]

**Target:**
- Year 1: <3.0 (acceptable in early stage)
- Year 2: <1.5 (healthy)
- Year 3: <1.0 (capital efficient)

**Current Baseline:** [PLACEHOLDER - TBD]

**Data Source:** [PLACEHOLDER - Finance] P&L and ARR tracking

**Frequency:** Quarterly

**Why It Matters:** Capital efficiency metric. Investors care deeply about burn multiple. Lower multiple = more efficient growth = higher valuation.

---

## Metrics Governance

### Ownership Matrix

| Metric Category | Primary Owner | Review Cadence | Board Reporting |
|-----------------|---------------|----------------|-----------------|
| Acquisition | VP Marketing | Weekly | Monthly |
| Activation | Head of Product | Daily | Monthly |
| Retention | Head of CS | Weekly | Monthly |
| Revenue | Chief Revenue Officer | Daily | Monthly |
| Referral | Head of Growth | Monthly | Quarterly |
| Sales | VP Sales | Daily | Monthly |
| Product | Head of Product | Weekly | Monthly |
| Financial | CFO | Monthly | Monthly |

### Escalation Triggers

**Immediate Escalation to Executive Team:**
- Monthly churn >5% for 2 consecutive months
- MRR growth <10% MoM for 2 consecutive months
- LTV/CAC ratio falls below 3:1
- CAC increases >20% MoM
- Platform uptime <95% in any week
- NPS falls below 40

**Quarterly Strategic Review:**
- All metrics reviewed vs. targets
- Deep dive on underperforming metrics
- Resource allocation adjustments
- Roadmap reprioritization

---

## Metrics Rituals

### Daily Standups (5 minutes)

**Attendees:** Executive team

**Review:**
- MRR (current, vs. yesterday)
- Signups (today, weekly trend)
- Activations (today, weekly trend)
- Churn events (any at-risk customers?)
- Critical issues (uptime, bugs, support)

---

### Weekly Metrics Review (30 minutes)

**Attendees:** Exec team + department heads

**Review:**
- Did we hit weekly targets?
- What's trending up/down?
- Deep dive on one underperforming metric
- Action items for next week

**Agenda:**
1. Acquisition: Signups, CAC, channel performance
2. Activation: Activation rate, TTV, onboarding completion
3. Retention: WAU, churn, engagement scores
4. Revenue: MRR, ARPA, conversions
5. Operational: Support tickets, uptime, release velocity

---

### Monthly Deep Dive (2 hours)

**Attendees:** All leadership

**Review:**
- All product, business, and financial KPIs
- Cohort retention analysis
- Feature adoption and performance
- NPS/CSAT results and feedback themes
- Churn analysis (who, why, learnings)

**Output:**
- Investor update deck (see `investor-update.md`)
- List of action items to improve key metrics
- Roadmap adjustments based on learnings

---

### Quarterly Strategy Review (Half Day)

**Attendees:** Exec team + Board

**Review:**
- Progress vs. annual goals (on track?)
- Deep dive on each metric (trends, segments, benchmarks)
- What's working, what's not
- Competitive landscape changes

**Output:**
- Updated annual targets
- Roadmap priorities for next quarter
- Strategic bets and resource allocation

---

## Segmentation & Cohort Analysis

### Key Segments to Track

**By Customer Attribute:**
- Company size (SMB: <50 employees, Mid-market: 50-500, Enterprise: 500+)
- Industry vertical
- Geography (US, EMEA, APAC)
- Use case / department

**By Behavior:**
- Activated vs. not activated
- High engagement (Green health score) vs. low engagement (Yellow/Red)
- Feature adopters vs. non-adopters
- Expansion customers vs. flat

**By Acquisition:**
- Organic search
- Paid ads
- Referrals
- Direct sales
- Partnerships

**By Cohort:**
- Signup month (track retention curves by cohort)
- First product version used
- Pricing tier at signup

---

### Cohort Retention Analysis

**What:** Track groups of users who signed up in the same period and measure their retention over time.

**Why:** Reveals whether product improvements are working. Later cohorts should have better retention than early cohorts.

**Example:**

| Signup Month | Month 1 Retention | Month 3 Retention | Month 6 Retention | LTV (Projected) |
|--------------|-------------------|-------------------|-------------------|-----------------|
| Jan 2026 | 80% | 60% | 45% | $2,800 |
| Feb 2026 | 85% | 65% | TBD | $3,200 (proj) |
| Mar 2026 | 90% | TBD | TBD | $3,600 (proj) |

**Insight:** Retention improving cohort-over-cohort due to product improvements and better onboarding.

---

## Industry Benchmarks

### B2B SaaS Benchmarks (Mid-Market)

| Metric | Our Target (Year 2) | Median | Top Quartile |
|--------|---------------------|--------|--------------|
| Activation Rate | 80% | 65% | 80%+ |
| Monthly Churn | 3% | 4-5% | <2% |
| Annual NRR | 100% | 100-110% | 120%+ |
| Trial-to-Paid | 22% | 18% | 25%+ |
| CAC | $612 | $1,000 | <$500 |
| LTV/CAC | 7.2:1 | 3-4:1 | >5:1 |
| CAC Payback | 3.6 months | 12 months | <6 months |
| NPS | 55+ | 35 | 60+ |
| Magic Number | >1.5 | 1.0 | >2.0 |

**Sources:** [PLACEHOLDER - SaaS Capital Index, OpenView Benchmarks, KeyBanc Survey]

---

## Next Steps

### Immediate Actions (Pre-Launch)

1. **Set Up Analytics Infrastructure (Week -4)**
   - Implement event tracking for all key metrics (use Segment)
   - Set up dashboards in [PLACEHOLDER - Amplitude/Looker]
   - Configure automated alerts for critical metrics
   - Owner: [PLACEHOLDER - Engineering + Data]
   - Due: 4 weeks before launch

2. **Define Metric Owners and Targets (Week -2)**
   - Assign owner for each metric
   - Set initial targets (these will evolve)
   - Create weekly metrics review calendar
   - Owner: [PLACEHOLDER - CEO + Exec Team]
   - Due: 2 weeks before launch

3. **Create Metrics Dashboards (Week -1)**
   - Daily dashboard: MRR, signups, activations, churn, uptime
   - Weekly dashboard: All AARRR metrics
   - Monthly dashboard: Full KPI scorecard
   - Owner: [PLACEHOLDER - Data/Analytics]
   - Due: 1 week before launch

### Ongoing Management

4. **Establish Metrics Rituals**
   - Daily: 5-min standup (exec team)
   - Weekly: 30-min metrics review (leadership)
   - Monthly: 2-hour deep dive (all hands)
   - Quarterly: Half-day strategy review (board)
   - Owner: [PLACEHOLDER - CEO/COO]
   - Start: Launch day

5. **Monthly Metrics Review and Reporting**
   - Create investor update (see `investor-update.md`)
   - Update forecast based on actuals
   - Identify underperforming metrics and assign action items
   - Owner: [PLACEHOLDER - CFO + CEO]
   - Cadence: First week of each month

6. **Quarterly Benchmarking**
   - Compare metrics to industry benchmarks
   - Identify gaps and opportunities
   - Adjust targets and strategy as needed
   - Owner: [PLACEHOLDER - CEO + CFO]
   - Cadence: Quarterly

---

## Appendix: Formulas Quick Reference

**Activation Rate:** (Activated Users / Total Signups) × 100

**Monthly Churn:** (Churned Customers / Customers at Start) × 100

**GRR:** (Starting MRR - Churned MRR - Downgrade MRR) / Starting MRR × 100

**NRR:** (Starting MRR - Churned - Downgrade + Expansion) / Starting MRR × 100

**LTV:** (ARPA × Gross Margin %) / (Churn Rate + Discount Rate)

**CAC:** (Total S&M Expenses) / (New Customers Acquired)

**CAC Payback:** CAC / (ARPA × Gross Margin %)

**Magic Number:** (Net New ARR this Q × 4) / (S&M Spend Last Q)

**Burn Multiple:** Net Burn / Net New ARR

---

## Cross-References

- **Product Metrics:** `../03-product/success-metrics.md` - Detailed product KPIs
- **Financial Metrics:** `../04-finance/unit-economics.md` - CAC, LTV, payback analysis
- **Revenue Model:** `../04-finance/financial-model.md` - Revenue projections and assumptions
- **Pricing:** `../04-finance/pricing-strategy.md` - ARPA and tier strategy
- **Dashboard:** `dashboard-mockup.md` - Visual representation of metrics
- **North Star:** `north-star-metric.md` - The one metric that matters most
- **Weekly Review:** `weekly-review.md` - Weekly ritual template
- **Investor Updates:** `investor-update.md` - Monthly reporting template

---

*Version 1.0 | Last Updated: [PLACEHOLDER - Date] | Owner: [PLACEHOLDER - CEO + CFO]*
