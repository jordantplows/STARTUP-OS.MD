# Executive Dashboard Mockup

> A table-based wireframe of the executive dashboard showing all key metrics organized by department and stakeholder.

---

## Overview

This document provides a structured view of how key metrics should be displayed in executive dashboards. It organizes metrics by:
- **Stakeholder** - Who needs to see this view
- **Department** - Product, Sales, Marketing, Finance, Customer Success
- **Frequency** - Real-time, daily, weekly, monthly
- **Visualization** - How to display (number, chart, table)

**Related documents:**
- `kpi-framework.md` - Complete metric definitions and formulas
- `north-star-metric.md` - The single most important metric
- `weekly-review.md` - Weekly review template
- `investor-update.md` - Monthly investor reporting
- `../03-product/success-metrics.md` - Product metrics philosophy
- `../04-finance/unit-economics.md` - Financial metrics detail

**Dashboard Tools:**
- [PLACEHOLDER - Primary: Looker/Tableau/Metabase]
- [PLACEHOLDER - Secondary: Google Sheets (for flexibility)]
- [PLACEHOLDER - Real-time: Geckoboard/Databox]

---

## Dashboard Structure

We maintain **three tiers** of dashboards:

### 1. Real-Time Dashboard (Always On Display)
- **Audience:** Exec team, all-hands TV screen
- **Update frequency:** Real-time or every 15 minutes
- **Purpose:** At-a-glance health check

### 2. Weekly Review Dashboard
- **Audience:** Leadership team
- **Update frequency:** Updated weekly for Monday meetings
- **Purpose:** Track weekly goals and trends

### 3. Monthly Executive Dashboard
- **Audience:** Board, investors, exec team
- **Update frequency:** First week of each month
- **Purpose:** Comprehensive performance review

---

## Real-Time Dashboard

**Display:** Large TV screen in office, always-on view

**Layout:** Single page, 6 key metrics, green/yellow/red status indicators

---

### Real-Time Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPANY HEALTH DASHBOARD                          │
│                    Updated: [Auto-refresh every 15 min]              │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────────────┬────────────────────────┬────────────────────┐
│   MONTHLY RECURRING    │     ACTIVE USERS       │    PLATFORM        │
│       REVENUE          │                        │    UPTIME          │
│                        │                        │                    │
│   $[XXX]K MRR         │   [XXX] WAU            │    99.X%           │
│   ↑ $[XX]K vs last mo │   ↑ [XX] vs last week  │    ✓ HEALTHY       │
│   [====    ] 60% to   │   [======  ] 75% to    │                    │
│   monthly goal         │   monthly goal         │   [XX] days uptime │
│                        │                        │                    │
│   Status: 🟢 ON TRACK │   Status: 🟢 ON TRACK  │   Status: 🟢 UP    │
└────────────────────────┴────────────────────────┴────────────────────┘

┌────────────────────────┬────────────────────────┬────────────────────┐
│    NEW SIGNUPS         │    ACTIVATION RATE     │   CHURN ALERTS     │
│    (This Week)         │    (This Week)         │                    │
│                        │                        │                    │
│   [XXX] signups        │   XX%                  │   [X] customers    │
│   ↑ [XX] vs last week  │   ↓ [X]% vs last week  │   at risk          │
│   [====    ] 60% to    │   Target: 80%+         │                    │
│   weekly goal          │                        │   [X] churned      │
│                        │   [========] Progress  │   this week        │
│   Status: 🟢 ON TRACK  │   Status: 🟡 WATCH     │   Status: 🟢 LOW   │
└────────────────────────┴────────────────────────┴────────────────────┘
```

---

### Real-Time Dashboard: Metrics Table

| Metric | Current Value | Target | Status | Data Source | Owner |
|--------|---------------|--------|--------|-------------|-------|
| **MRR** | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $1M by Month 12] | 🟢 | [PLACEHOLDER - Stripe] | CFO |
| **WAU** | [PLACEHOLDER - XXX users] | [PLACEHOLDER - 4,000 by Month 12] | 🟢 | [PLACEHOLDER - Amplitude] | Head of Product |
| **Platform Uptime** | [PLACEHOLDER - 99.X%] | 99%+ | 🟢 | [PLACEHOLDER - StatusPage] | VP Engineering |
| **Weekly Signups** | [PLACEHOLDER - XXX] | [PLACEHOLDER - 500/week by Month 12] | 🟢 | [PLACEHOLDER - Database] | VP Marketing |
| **Activation Rate** | [PLACEHOLDER - XX%] | 80%+ | 🟡 | [PLACEHOLDER - Analytics] | Head of Product |
| **Churn Events** | [PLACEHOLDER - X this week] | <5/week | 🟢 | [PLACEHOLDER - CRM] | Head of CS |

**Status Indicators:**
- 🟢 Green: On track or exceeding target
- 🟡 Yellow: 10-20% below target, needs attention
- 🔴 Red: >20% below target, urgent action required

---

## Weekly Review Dashboard

**Audience:** Executive team + department heads

**Meeting:** Every Monday, 9:00 AM, 30 minutes

**Purpose:** Review last week's performance, identify blockers, set priorities for this week

---

### Weekly Dashboard: Overview Section

**Date Range:** [Week of YYYY-MM-DD]

| Category | This Week | Last Week | Change | Monthly Target | % to Target | Status |
|----------|-----------|-----------|--------|----------------|-------------|--------|
| **Revenue** |
| MRR | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - +$XX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - 85%] | 🟢 |
| New MRR | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - +$X,XXX] | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - 90%] | 🟢 |
| Churned MRR | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - -$XXX] | [PLACEHOLDER - <$X,XXX] | [PLACEHOLDER - 70%] | 🟢 |
| **Acquisition** |
| Signups | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - +XX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - 75%] | 🟢 |
| SQLs | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - +X] | [PLACEHOLDER - XX] | [PLACEHOLDER - 80%] | 🟢 |
| Deals Closed | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - +X] | [PLACEHOLDER - XX] | [PLACEHOLDER - 85%] | 🟢 |
| **Activation** |
| Activation Rate | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - +X%] | [PLACEHOLDER - 80%] | [PLACEHOLDER - 95%] | 🟢 |
| Time-to-Value | [PLACEHOLDER - XX min] | [PLACEHOLDER - XX min] | [PLACEHOLDER - -X min] | [PLACEHOLDER - <15 min] | [PLACEHOLDER - 80%] | 🟡 |
| **Retention** |
| WAU | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - +XX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - 90%] | 🟢 |
| Churn Events | [PLACEHOLDER - X] | [PLACEHOLDER - X] | [PLACEHOLDER - -X] | [PLACEHOLDER - <X] | [PLACEHOLDER - 100%] | 🟢 |
| **Operational** |
| Uptime | [PLACEHOLDER - 99.X%] | [PLACEHOLDER - 99.X%] | [PLACEHOLDER - 0%] | [PLACEHOLDER - >99%] | [PLACEHOLDER - 100%] | 🟢 |
| Support Tickets | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - +X] | [PLACEHOLDER - <XX] | [PLACEHOLDER - 90%] | 🟢 |

---

### Weekly Dashboard: Department Breakdowns

#### Product Department

| Metric | This Week | Last Week | Monthly Target | Status |
|--------|-----------|-----------|----------------|--------|
| **Activation** |
| Activation Rate | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 80%] | 🟢 |
| Onboarding Completion | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 75%] | 🟡 |
| Time-to-Value (median) | [PLACEHOLDER - XX min] | [PLACEHOLDER - XX min] | [PLACEHOLDER - <15 min] | 🟡 |
| **Engagement** |
| WAU | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | 🟢 |
| DAU | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | 🟢 |
| DAU/WAU Ratio | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 35%] | 🟢 |
| Avg Session Duration | [PLACEHOLDER - XX min] | [PLACEHOLDER - XX min] | [PLACEHOLDER - >8 min] | 🟢 |
| **Feature Adoption** |
| [PLACEHOLDER - Feature A] | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 80%] | 🟢 |
| [PLACEHOLDER - Feature B] | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 60%] | 🟡 |
| [PLACEHOLDER - Feature C] | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 40%] | 🔴 |
| **Operational** |
| Release Velocity | [PLACEHOLDER - X deploys] | [PLACEHOLDER - X deploys] | [PLACEHOLDER - 10+/week] | 🟢 |
| Platform Uptime | [PLACEHOLDER - 99.X%] | [PLACEHOLDER - 99.X%] | [PLACEHOLDER - >99%] | 🟢 |
| P95 Page Load Time | [PLACEHOLDER - X.X sec] | [PLACEHOLDER - X.X sec] | [PLACEHOLDER - <2 sec] | 🟢 |

**Owner:** [PLACEHOLDER - Head of Product]

**Top 3 Priorities This Week:**
1. [PLACEHOLDER - e.g., Improve Time-to-Value from 18 min to 15 min]
2. [PLACEHOLDER - e.g., Launch Feature C and drive adoption to 40%]
3. [PLACEHOLDER - e.g., Fix onboarding drop-off at Step 3]

---

#### Sales Department

| Metric | This Week | Last Week | Monthly Target | Status |
|--------|-----------|-----------|----------------|--------|
| **Pipeline** |
| Pipeline Value | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $X,XXX,XXX] | 🟢 |
| SQLs Created | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - XXX] | 🟢 |
| Opportunities Created | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | 🟢 |
| **Closed Business** |
| Deals Closed-Won | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | 🟢 |
| New ARR | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $XXX,XXX] | 🟢 |
| Avg Deal Size | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | 🟢 |
| **Efficiency** |
| Win Rate | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 25%] | 🟡 |
| Avg Sales Cycle | [PLACEHOLDER - XX days] | [PLACEHOLDER - XX days] | [PLACEHOLDER - <30 days] | 🟢 |
| **By Tier** |
| Starter: Closed | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | 🟢 |
| Professional: Closed | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | 🟢 |
| Enterprise: Closed | [PLACEHOLDER - X] | [PLACEHOLDER - X] | [PLACEHOLDER - X] | 🟡 |

**Owner:** [PLACEHOLDER - VP Sales]

**Top 3 Priorities This Week:**
1. [PLACEHOLDER - e.g., Close 3 Professional deals in pipeline]
2. [PLACEHOLDER - e.g., Generate 50 new SQLs from outbound]
3. [PLACEHOLDER - e.g., Improve win rate by focusing on qualified leads]

---

#### Marketing Department

| Metric | This Week | Last Week | Monthly Target | Status |
|--------|-----------|-----------|----------------|--------|
| **Top of Funnel** |
| Website Visitors | [PLACEHOLDER - X,XXX] | [PLACEHOLDER - X,XXX] | [PLACEHOLDER - XX,XXX] | 🟢 |
| Signups | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | 🟢 |
| Visitor → Signup % | [PLACEHOLDER - X.X%] | [PLACEHOLDER - X.X%] | [PLACEHOLDER - 4%] | 🟢 |
| **Lead Quality** |
| MQLs | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - XXX] | 🟢 |
| SQLs (from MQLs) | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | 🟢 |
| MQL → SQL % | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 50%] | 🟡 |
| **Channel Performance** |
| Organic Signups | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XX%] | 🟢 |
| Paid Ads Signups | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XX%] | 🟢 |
| Referral Signups | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - XX%] | 🟡 |
| **Cost Efficiency** |
| Cost per Signup | [PLACEHOLDER - $XX] | [PLACEHOLDER - $XX] | [PLACEHOLDER - <$15] | 🟢 |
| Marketing Spend | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $XX,XXX] | 🟢 |

**Owner:** [PLACEHOLDER - VP Marketing]

**Top 3 Priorities This Week:**
1. [PLACEHOLDER - e.g., Launch LinkedIn ad campaign targeting Sales Directors]
2. [PLACEHOLDER - e.g., Publish 2 high-value blog posts for SEO]
3. [PLACEHOLDER - e.g., Improve MQL→SQL conversion by tightening lead scoring]

---

#### Customer Success Department

| Metric | This Week | Last Week | Monthly Target | Status |
|--------|-----------|-----------|----------------|--------|
| **Retention** |
| Churn Events | [PLACEHOLDER - X] | [PLACEHOLDER - X] | [PLACEHOLDER - <XX] | 🟢 |
| Churned MRR | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - <$X,XXX] | 🟢 |
| Monthly Churn Rate | [PLACEHOLDER - X.X%] | [PLACEHOLDER - X.X%] | [PLACEHOLDER - <5%] | 🟢 |
| **Expansion** |
| Upsells | [PLACEHOLDER - X] | [PLACEHOLDER - X] | [PLACEHOLDER - XX] | 🟡 |
| Expansion MRR | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $XX,XXX] | 🟢 |
| **Customer Health** |
| Green Customers | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - >80%] | 🟢 |
| Yellow Customers | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - <15%] | 🟢 |
| Red Customers | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - <5%] | 🟡 |
| **Support** |
| Tickets Created | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - <XX] | 🟢 |
| Avg Response Time | [PLACEHOLDER - X.X hrs] | [PLACEHOLDER - X.X hrs] | [PLACEHOLDER - <2 hrs] | 🟢 |
| CSAT Score | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - >90%] | 🟢 |

**Owner:** [PLACEHOLDER - Head of Customer Success]

**Top 3 Priorities This Week:**
1. [PLACEHOLDER - e.g., Reach out to all 5 Red customers with action plans]
2. [PLACEHOLDER - e.g., Drive 3 upsells from customers hitting usage limits]
3. [PLACEHOLDER - e.g., Reduce support ticket volume by improving help docs]

---

#### Finance Department

| Metric | This Week | Last Week | Monthly Target | Status |
|--------|-----------|-----------|----------------|--------|
| **Revenue** |
| MRR | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | 🟢 |
| New MRR | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $XX,XXX] | 🟢 |
| Expansion MRR | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | 🟢 |
| Churned MRR | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - <$X,XXX] | 🟢 |
| **Customers** |
| Total Customers | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | 🟢 |
| New Customers | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | 🟢 |
| Churned Customers | [PLACEHOLDER - X] | [PLACEHOLDER - X] | [PLACEHOLDER - <X] | 🟢 |
| **Unit Economics** |
| ARPA | [PLACEHOLDER - $XXX] | [PLACEHOLDER - $XXX] | [PLACEHOLDER - $XXX] | 🟢 |
| Gross Margin % | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - >80%] | 🟢 |
| **Efficiency** |
| CAC (MTD) | [PLACEHOLDER - $XXX] | [PLACEHOLDER - N/A] | [PLACEHOLDER - <$700] | 🟢 |
| NRR (MTD) | [PLACEHOLDER - XXX%] | [PLACEHOLDER - N/A] | [PLACEHOLDER - >95%] | 🟡 |

**Owner:** [PLACEHOLDER - CFO]

**Top 3 Priorities This Week:**
1. [PLACEHOLDER - e.g., Close Q3 books and prepare board materials]
2. [PLACEHOLDER - e.g., Review unit economics and CAC trends]
3. [PLACEHOLDER - e.g., Forecast Q4 revenue and burn]

---

## Monthly Executive Dashboard

**Audience:** Board of directors, investors, executive team

**Distribution:** First week of each month via investor update email (see `investor-update.md`)

**Purpose:** Comprehensive performance review across all departments

---

### Monthly Dashboard: Executive Summary

**Month:** [PLACEHOLDER - Month YYYY]

**Overall Status:** [PLACEHOLDER - 🟢 On Track | 🟡 Some Concerns | 🔴 Off Track]

---

#### Key Highlights

| Metric | This Month | Last Month | Target | % to Target | YoY Growth | Status |
|--------|------------|------------|--------|-------------|------------|--------|
| **North Star Metric** |
| [PLACEHOLDER - Weekly Active Forecasters] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XX%] | [PLACEHOLDER - N/A] | 🟢 |
| **Revenue** |
| MRR | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - XX%] | [PLACEHOLDER - N/A] | 🟢 |
| ARR | [PLACEHOLDER - $X.XXM] | [PLACEHOLDER - $X.XXM] | [PLACEHOLDER - $X.XXM] | [PLACEHOLDER - XX%] | [PLACEHOLDER - N/A] | 🟢 |
| MRR Growth % | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 15%] | [PLACEHOLDER - XXX%] | [PLACEHOLDER - N/A] | 🟢 |
| **Customers** |
| Total Customers | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XX%] | [PLACEHOLDER - N/A] | 🟢 |
| New Customers | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - XX%] | [PLACEHOLDER - N/A] | 🟢 |
| **Unit Economics** |
| LTV/CAC Ratio | [PLACEHOLDER - X.X:1] | [PLACEHOLDER - X.X:1] | [PLACEHOLDER - >3:1] | [PLACEHOLDER - XXX%] | [PLACEHOLDER - N/A] | 🟢 |
| CAC Payback (months) | [PLACEHOLDER - X.X] | [PLACEHOLDER - X.X] | [PLACEHOLDER - <12] | [PLACEHOLDER - XXX%] | [PLACEHOLDER - N/A] | 🟢 |
| NRR | [PLACEHOLDER - XXX%] | [PLACEHOLDER - XXX%] | [PLACEHOLDER - >95%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - N/A] | 🟡 |

---

### Monthly Dashboard: AARRR Funnel

**Visual:** Funnel chart showing conversion at each stage

```
ACQUISITION → ACTIVATION → RETENTION → REVENUE → REFERRAL

[X,XXX]       [X,XXX]        [XXX]       [XXX]      [XX]
Signups    →  Activated  →   Retained → Paid    →  Referred

              XX%            XX%         XX%        XX%
            conversion     retention  conversion  referral
```

| Stage | This Month | Last Month | Conversion Rate | Target | Status |
|-------|------------|------------|-----------------|--------|--------|
| **Acquisition** |
| Signups | [PLACEHOLDER - X,XXX] | [PLACEHOLDER - X,XXX] | N/A | [PLACEHOLDER - X,XXX] | 🟢 |
| **Activation** |
| Activated Users | [PLACEHOLDER - X,XXX] | [PLACEHOLDER - X,XXX] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 80%] | 🟢 |
| **Retention** |
| Month 1 Retained | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 40%] | 🟢 |
| **Revenue** |
| Trial → Paid | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 20%] | 🟢 |
| **Referral** |
| Referral Signups | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - X%] | [PLACEHOLDER - 10%] | 🟡 |

---

### Monthly Dashboard: Revenue Breakdown

#### Revenue by Tier

| Tier | Customers | MRR | % of Total MRR | ARPA | YoY Growth |
|------|-----------|-----|----------------|------|------------|
| Starter | [PLACEHOLDER - XXX] | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - 15%] | [PLACEHOLDER - $XX] | [PLACEHOLDER - N/A] |
| Professional | [PLACEHOLDER - XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - 40%] | [PLACEHOLDER - $XXX] | [PLACEHOLDER - N/A] |
| Enterprise | [PLACEHOLDER - XX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - 45%] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - N/A] |
| **Total** | **[PLACEHOLDER - XXX]** | **[PLACEHOLDER - $XXX,XXX]** | **100%** | **[PLACEHOLDER - $XXX]** | **[PLACEHOLDER - N/A]** |

#### MRR Movement Waterfall

```
Starting MRR:     $XXX,XXX
+ New MRR:        + $XX,XXX
+ Expansion MRR:  + $X,XXX
- Contraction:    - $X,XXX
- Churned MRR:    - $X,XXX
─────────────────────────
Ending MRR:       $XXX,XXX

Net New MRR:      $XX,XXX (XX% growth)
```

| Component | This Month | Last Month | Change |
|-----------|------------|------------|--------|
| Starting MRR | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - N/A] |
| New MRR | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $X,XXX] |
| Expansion MRR | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $XXX] |
| Contraction MRR | [PLACEHOLDER - ($X,XXX)] | [PLACEHOLDER - ($X,XXX)] | [PLACEHOLDER - ($XXX)] |
| Churned MRR | [PLACEHOLDER - ($X,XXX)] | [PLACEHOLDER - ($X,XXX)] | [PLACEHOLDER - ($XXX)] |
| **Ending MRR** | **[PLACEHOLDER - $XXX,XXX]** | **[PLACEHOLDER - $XXX,XXX]** | **[PLACEHOLDER - $XX,XXX]** |
| **Net New MRR** | **[PLACEHOLDER - $XX,XXX]** | **[PLACEHOLDER - $XX,XXX]** | **[PLACEHOLDER - $X,XXX]** |
| **Growth %** | **[PLACEHOLDER - XX%]** | **[PLACEHOLDER - XX%]** | **[PLACEHOLDER - X%]** |

---

### Monthly Dashboard: Retention & Churn

#### Cohort Retention Table

| Signup Cohort | Month 0 | Month 1 | Month 2 | Month 3 | Month 6 | Month 12 |
|---------------|---------|---------|---------|---------|---------|----------|
| Jan 2026 | 100% | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] |
| Feb 2026 | 100% | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | TBD |
| Mar 2026 | 100% | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | TBD | TBD |
| Apr 2026 | 100% | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | TBD | TBD | TBD |
| May 2026 | 100% | [PLACEHOLDER - XX%] | TBD | TBD | TBD | TBD |
| **Avg (Recent 3)** | **100%** | **[PLACEHOLDER - XX%]** | **[PLACEHOLDER - XX%]** | **[PLACEHOLDER - XX%]** | **TBD** | **TBD** |

**Insight:** [PLACEHOLDER - e.g., "Month 1 retention improving from 75% (Jan) to 85% (May) due to onboarding improvements"]

#### Churn Analysis

| Metric | This Month | Last Month | Target | Status |
|--------|------------|------------|--------|--------|
| **Revenue Churn** |
| Churned MRR | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - <$X,XXX] | 🟢 |
| Monthly Churn % | [PLACEHOLDER - X.X%] | [PLACEHOLDER - X.X%] | [PLACEHOLDER - <5%] | 🟢 |
| **Customer Churn** |
| Churned Customers | [PLACEHOLDER - X] | [PLACEHOLDER - X] | [PLACEHOLDER - <X] | 🟢 |
| Customer Churn % | [PLACEHOLDER - X.X%] | [PLACEHOLDER - X.X%] | [PLACEHOLDER - <5%] | 🟢 |
| **Retention** |
| GRR (Annual) | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - >80%] | 🟢 |
| NRR (Annual) | [PLACEHOLDER - XXX%] | [PLACEHOLDER - XXX%] | [PLACEHOLDER - >95%] | 🟡 |

**Top Churn Reasons This Month:**
1. [PLACEHOLDER - e.g., "Product not meeting expectations (40%)"]
2. [PLACEHOLDER - e.g., "Budget constraints (30%)"]
3. [PLACEHOLDER - e.g., "Low engagement / poor onboarding (20%)"]
4. [PLACEHOLDER - e.g., "Other (10%)"]

---

### Monthly Dashboard: Unit Economics

| Metric | This Month | Last Month | Target | Benchmark | Status |
|--------|------------|------------|--------|-----------|--------|
| **Customer Value** |
| ARPA | [PLACEHOLDER - $XXX] | [PLACEHOLDER - $XXX] | [PLACEHOLDER - $XXX] | [PLACEHOLDER - $150-200] | 🟢 |
| LTV | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - >$3,000] | 🟢 |
| **Acquisition Cost** |
| CAC | [PLACEHOLDER - $XXX] | [PLACEHOLDER - $XXX] | [PLACEHOLDER - <$700] | [PLACEHOLDER - $500-1,000] | 🟢 |
| CAC by Tier: Starter | [PLACEHOLDER - $XXX] | [PLACEHOLDER - $XXX] | [PLACEHOLDER - <$500] | [PLACEHOLDER - N/A] | 🟢 |
| CAC by Tier: Pro | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - <$1,500] | [PLACEHOLDER - N/A] | 🟢 |
| CAC by Tier: Enterprise | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - <$10,000] | [PLACEHOLDER - N/A] | 🟢 |
| **Efficiency Ratios** |
| LTV/CAC | [PLACEHOLDER - X.X:1] | [PLACEHOLDER - X.X:1] | [PLACEHOLDER - >3:1] | [PLACEHOLDER - 3-5:1] | 🟢 |
| CAC Payback (months) | [PLACEHOLDER - X.X] | [PLACEHOLDER - X.X] | [PLACEHOLDER - <12] | [PLACEHOLDER - 6-12] | 🟢 |
| Magic Number | [PLACEHOLDER - X.X] | [PLACEHOLDER - X.X] | [PLACEHOLDER - >1.0] | [PLACEHOLDER - >1.0] | 🟢 |
| **Margins** |
| Gross Margin % | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - >80%] | [PLACEHOLDER - 75-85%] | 🟢 |
| Contribution Margin % | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - >60%] | [PLACEHOLDER - >50%] | 🟢 |

**Cross-reference:** See `../04-finance/unit-economics.md` for detailed analysis and formulas.

---

### Monthly Dashboard: Sales & Marketing Performance

#### Sales Performance

| Metric | This Month | Last Month | Quarterly Target | Status |
|--------|------------|------------|------------------|--------|
| **Pipeline** |
| Pipeline Value | [PLACEHOLDER - $X,XXX,XXX] | [PLACEHOLDER - $X,XXX,XXX] | [PLACEHOLDER - $X,XXX,XXX] | 🟢 |
| Pipeline Coverage | [PLACEHOLDER - X.Xx] | [PLACEHOLDER - X.Xx] | [PLACEHOLDER - >3x] | 🟢 |
| SQLs Created | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | 🟢 |
| **Closed Business** |
| Deals Closed-Won | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | 🟢 |
| New ARR | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | 🟢 |
| Avg Deal Size | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | [PLACEHOLDER - $X,XXX] | 🟢 |
| **Efficiency** |
| Win Rate | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 25%] | 🟡 |
| Avg Sales Cycle | [PLACEHOLDER - XX days] | [PLACEHOLDER - XX days] | [PLACEHOLDER - <40 days] | 🟢 |

#### Marketing Performance

| Metric | This Month | Last Month | Quarterly Target | Status |
|--------|------------|------------|------------------|--------|
| **Top of Funnel** |
| Website Visitors | [PLACEHOLDER - XX,XXX] | [PLACEHOLDER - XX,XXX] | [PLACEHOLDER - XX,XXX] | 🟢 |
| Signups | [PLACEHOLDER - X,XXX] | [PLACEHOLDER - X,XXX] | [PLACEHOLDER - X,XXX] | 🟢 |
| Visitor → Signup % | [PLACEHOLDER - X.X%] | [PLACEHOLDER - X.X%] | [PLACEHOLDER - 4%] | 🟢 |
| **Lead Quality** |
| MQLs | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - X,XXX] | 🟢 |
| SQLs | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | 🟢 |
| MQL → SQL % | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 50%] | 🟡 |
| **Channel Performance** |
| Organic | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 30%] | 🟢 |
| Paid | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 25%] | 🟢 |
| Referral | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 15%] | 🟡 |
| **Cost Efficiency** |
| Cost per Signup | [PLACEHOLDER - $XX] | [PLACEHOLDER - $XX] | [PLACEHOLDER - <$15] | 🟢 |
| Total Marketing Spend | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $XXX,XXX] | 🟢 |

---

### Monthly Dashboard: Product & Engagement

| Metric | This Month | Last Month | Target | Status |
|--------|------------|------------|--------|--------|
| **Activation** |
| Activation Rate | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 80%] | 🟢 |
| Time-to-Value (median) | [PLACEHOLDER - XX min] | [PLACEHOLDER - XX min] | [PLACEHOLDER - <15 min] | 🟡 |
| Onboarding Completion | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 75%] | 🟢 |
| **Engagement** |
| WAU | [PLACEHOLDER - X,XXX] | [PLACEHOLDER - X,XXX] | [PLACEHOLDER - X,XXX] | 🟢 |
| MAU | [PLACEHOLDER - XX,XXX] | [PLACEHOLDER - XX,XXX] | [PLACEHOLDER - XX,XXX] | 🟢 |
| DAU/WAU Ratio | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - 35%] | 🟢 |
| Avg Session Duration | [PLACEHOLDER - XX min] | [PLACEHOLDER - XX min] | [PLACEHOLDER - >8 min] | 🟢 |
| **Satisfaction** |
| NPS | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - >50] | 🟢 |
| CSAT | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - >90%] | 🟢 |
| **Operational** |
| Platform Uptime | [PLACEHOLDER - 99.XX%] | [PLACEHOLDER - 99.XX%] | [PLACEHOLDER - >99%] | 🟢 |
| Support Tickets | [PLACEHOLDER - XXX] | [PLACEHOLDER - XXX] | [PLACEHOLDER - <XXX] | 🟢 |
| Avg Response Time | [PLACEHOLDER - X.X hrs] | [PLACEHOLDER - X.X hrs] | [PLACEHOLDER - <2 hrs] | 🟢 |

---

### Monthly Dashboard: Financial Summary

| Metric | This Month | Last Month | YTD | Annual Target | Status |
|--------|------------|------------|-----|---------------|--------|
| **Revenue** |
| Total Revenue | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $X.XXM] | [PLACEHOLDER - $XX.XM] | 🟢 |
| MRR | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - N/A] | [PLACEHOLDER - $X.XXM] | 🟢 |
| ARR | [PLACEHOLDER - $X.XXM] | [PLACEHOLDER - $X.XXM] | [PLACEHOLDER - N/A] | [PLACEHOLDER - $XX.XM] | 🟢 |
| **Expenses** |
| Operating Expenses | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $X.XXM] | [PLACEHOLDER - $XX.XM] | 🟢 |
| COGS | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $XX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $X.XXM] | 🟢 |
| S&M Expenses | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $X.XXM] | [PLACEHOLDER - $X.XXM] | 🟢 |
| **Profitability** |
| Gross Profit | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $X.XXM] | [PLACEHOLDER - $XX.XM] | 🟢 |
| Gross Margin % | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - XX%] | [PLACEHOLDER - >80%] | 🟢 |
| EBITDA | [PLACEHOLDER - ($XXX,XXX)] | [PLACEHOLDER - ($XXX,XXX)] | [PLACEHOLDER - ($X.XXM)] | [PLACEHOLDER - N/A] | 🟡 |
| **Cash** |
| Cash Balance | [PLACEHOLDER - $X.XXM] | [PLACEHOLDER - $X.XXM] | [PLACEHOLDER - N/A] | [PLACEHOLDER - N/A] | 🟢 |
| Monthly Burn | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - $XXX,XXX] | [PLACEHOLDER - N/A] | [PLACEHOLDER - N/A] | 🟢 |
| Runway (months) | [PLACEHOLDER - XX] | [PLACEHOLDER - XX] | [PLACEHOLDER - N/A] | [PLACEHOLDER - >12] | 🟢 |

**Cross-reference:** See `../04-finance/financial-model.md` for detailed P&L and cash flow projections.

---

## Dashboard Access & Permissions

### Role-Based Access

| Role | Real-Time Dashboard | Weekly Dashboard | Monthly Dashboard | Edit Access |
|------|---------------------|------------------|-------------------|-------------|
| CEO | ✓ | ✓ | ✓ | ✓ |
| CFO | ✓ | ✓ | ✓ | ✓ |
| CRO | ✓ | ✓ | ✓ | ✓ |
| VP Sales | ✓ | ✓ (Sales section) | ✓ (Sales section) | ✗ |
| VP Marketing | ✓ | ✓ (Marketing section) | ✓ (Marketing section) | ✗ |
| Head of Product | ✓ | ✓ (Product section) | ✓ (Product section) | ✗ |
| Head of CS | ✓ | ✓ (CS section) | ✓ (CS section) | ✗ |
| Board Members | ✗ | ✗ | ✓ (Monthly only) | ✗ |
| All Employees | ✓ (Limited view) | ✗ | ✗ | ✗ |

---

## Dashboard Maintenance

### Data Quality Checks

**Weekly (every Monday before review meeting):**
1. Verify all data sources are connected and updating
2. Check for anomalies (e.g., sudden spikes/drops)
3. Validate calculations (spot-check formulas)
4. Ensure all filters are working correctly

**Owner:** [PLACEHOLDER - Data/Analytics team]

### Dashboard Evolution

**Quarterly Dashboard Review:**
1. Survey stakeholders: "Which metrics are most useful? Least useful?"
2. Review dashboard usage analytics (which views are accessed most?)
3. Add new metrics as business evolves
4. Remove metrics that aren't actionable
5. Update targets based on actual performance

**Owner:** [PLACEHOLDER - CFO + Head of Analytics]

---

## Next Steps

### Pre-Launch (Month 0)

1. **Build Dashboard Infrastructure**
   - Set up [PLACEHOLDER - Looker/Tableau] workspace
   - Connect data sources ([PLACEHOLDER - Stripe, Analytics, CRM, Database])
   - Build initial dashboard views (real-time, weekly, monthly)
   - Test with sample data
   - **Owner:** [PLACEHOLDER - Data/Engineering]
   - **Due:** 2 weeks before launch

2. **Define Baselines and Targets**
   - Set initial targets for each metric (will evolve)
   - Establish color-coding thresholds (green/yellow/red)
   - Create alert rules for critical metrics
   - **Owner:** [PLACEHOLDER - CEO + Exec Team]
   - **Due:** 1 week before launch

3. **Train Team on Dashboards**
   - Walk through each dashboard view
   - Explain how to interpret metrics
   - Practice weekly review ritual
   - **Owner:** [PLACEHOLDER - CEO/COO]
   - **Due:** Launch week

### Post-Launch (Ongoing)

4. **Daily Monitoring**
   - Check real-time dashboard every morning
   - Respond to alerts and anomalies
   - **Owner:** [PLACEHOLDER - CEO + COO]
   - **Start:** Launch day

5. **Weekly Review Ritual**
   - Every Monday, 9:00 AM, 30 minutes
   - Review weekly dashboard with leadership team
   - Identify wins, concerns, and action items
   - **Owner:** [PLACEHOLDER - CEO]
   - **Start:** Week 1 after launch

6. **Monthly Dashboard Distribution**
   - First week of each month
   - Generate investor update with monthly dashboard
   - Send to board and investors
   - **Owner:** [PLACEHOLDER - CFO + CEO]
   - **Start:** Month 1

---

## Cross-References

- **KPI Definitions:** `kpi-framework.md` - Complete metric definitions and formulas
- **North Star Metric:** `north-star-metric.md` - The single metric that matters most
- **Weekly Review:** `weekly-review.md` - Weekly meeting template
- **Investor Updates:** `investor-update.md` - Monthly external reporting
- **Unit Economics:** `../04-finance/unit-economics.md` - LTV, CAC, payback details
- **Financial Model:** `../04-finance/financial-model.md` - Revenue and expense projections
- **Product Metrics:** `../03-product/success-metrics.md` - Product-specific KPIs

---

*Version 1.0 | Last Updated: [PLACEHOLDER - Date] | Owner: [PLACEHOLDER - CFO + Head of Analytics]*
