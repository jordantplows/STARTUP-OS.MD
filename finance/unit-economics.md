---
name: unit-economics
description: >
  Calculates unit economics from financial model: CAC by channel, LTV (ARPU × GM% × lifetime),
  LTV:CAC ratio, payback period, gross margin, contribution margin. Generates cohort analysis
  table and flags if LTV:CAC < 3. Outputs to unit-economics.md.
allowed-tools: Read, Write, Edit, Bash
---

# Unit Economics Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile (product, business model, target customer).
2. Read `finance/output/financial-model.md` → extract customer growth, churn, revenue, and cost assumptions.
3. Read `finance/output/pricing-strategy.md` → extract pricing by tier and expected tier distribution.
4. Read `05-gtm/go-to-market-strategy.md` if it exists → extract acquisition channels and expected CAC by channel.

## Key Metrics to Calculate

### 1. Customer Acquisition Cost (CAC)
**Formula**: Total Sales & Marketing Spend / New Customers Acquired

Calculate CAC by channel:
- **Organic (SEO, content)**: $X per customer `[derived]`
- **Paid (Google Ads, Facebook)**: $Y per customer `[derived]`
- **Outbound (cold email, SDRs)**: $Z per customer `[derived]`
- **Partnerships/Referrals**: $W per customer `[derived]`
- **Blended CAC**: Weighted average across all channels `[derived]`

### 2. Lifetime Value (LTV)
**Formula**: ARPU × Gross Margin % × Customer Lifetime

Where:
- **ARPU** (Average Revenue Per User) = Total MRR / Total Customers `[derived]`
- **Gross Margin %** = (Revenue - COGS) / Revenue `[derived]`
- **Customer Lifetime** = 1 / Churn Rate `[derived]`
  - Example: 3% monthly churn = 1/0.03 = 33 months lifetime

**LTV Calculation**:
```
LTV = ARPU × GM% × (1 / Churn Rate)
    = $X/mo × 80% × 33 months
    = $Y [derived]
```

### 3. LTV:CAC Ratio
**Formula**: LTV / CAC

**Interpretation**:
- **< 1**: Losing money on every customer (not viable)
- **1-3**: Marginal; needs improvement (⚠️ FLAG THIS)
- **3-5**: Healthy SaaS business
- **> 5**: Excellent; room to invest more in growth

### 4. CAC Payback Period
**Formula**: CAC / (ARPU × Gross Margin %)

**Interpretation**:
- **< 12 months**: Excellent; fast return on acquisition spend
- **12-18 months**: Good for SaaS
- **18-24 months**: Acceptable for enterprise
- **> 24 months**: Too long; cash flow risk

### 5. Gross Margin
**Formula**: (Revenue - COGS) / Revenue

**COGS Components**:
- Cloud/hosting costs
- Payment processing fees
- Direct customer support costs
- Third-party API costs

**Target**: 70-85% for SaaS (flag if < 70%)

### 6. Contribution Margin
**Formula**: (Revenue - COGS - Variable Sales & Marketing) / Revenue

This shows profitability per customer after accounting for acquisition costs.

## Cohort Analysis

Generate a **cohort retention table** to show how customer cohorts behave over time:

| Cohort Month | Month 0 | Month 1 | Month 2 | Month 3 | Month 6 | Month 12 |
|--------------|---------|---------|---------|---------|---------|----------|
| Jan 2026     | 100%    | 95%     | 92%     | 88%     | 78%     | 65%      |
| Feb 2026     | 100%    | 96%     | 93%     | 90%     | 82%     | 70%      |
| Mar 2026     | 100%    | 97%     | 94%     | 91%     | 85%     | —        |

**Revenue retention** (net revenue retention, NRR):
- Track cohort MRR over time
- Include expansion revenue (upsells, upgrades)
- Target: 100%+ NRR (expansion offsets churn)

## Output Format

Write to: `finance/output/unit-economics.md`

Structure:
```markdown
# Unit Economics: [Company Name]

**Generated**: 2026-05-29  
**Analysis Period**: Year 1 (Month 12 snapshot)  
**Business Model**: B2B SaaS subscription

---

## Executive Summary

| Metric | Value | Status | Benchmark |
|--------|-------|--------|-----------|
| **LTV:CAC Ratio** | X.Xx [derived] | ✅ Healthy / ⚠️ Needs Improvement / ❌ Critical | 3.0+ |
| **CAC Payback Period** | X months [derived] | ✅ / ⚠️ / ❌ | < 12 months |
| **Gross Margin** | XX% [derived] | ✅ / ⚠️ | 70%+ |
| **Monthly Churn Rate** | X.X% [assumption] | ✅ / ⚠️ | < 5% |
| **LTV** | $X,XXX [derived] | — | — |
| **Blended CAC** | $XXX [derived] | — | — |

**Overall Assessment**: [One sentence: "Strong unit economics support aggressive growth investment" OR "CAC payback is too long; need to improve conversion or reduce spend"]

---

## 1. Customer Acquisition Cost (CAC)

### CAC by Channel (Month 12)

| Channel | Monthly Spend [assumption] | New Customers [derived] | CAC [derived] | Notes |
|---------|---------------------------|------------------------|---------------|-------|
| **SEO/Content** | $X,XXX | XX | $XX | Organic, improving over time |
| **Paid Ads** | $Y,YYY | YY | $YYY | Google Ads + LinkedIn |
| **Outbound Sales** | $Z,ZZZ | ZZ | $ZZZ | SDR + AE salaries allocated |
| **Partnerships** | $W,WWW | WW | $WW | Referral program + co-marketing |
| **Blended CAC** | $XX,XXX | XXX | **$XXX** | Weighted average |

**Calculation Notes**:
- Paid Ads CAC = Ad Spend / Conversions = $Y,YYY / YY = $YYY [derived]
- Outbound CAC = (SDR Salary + Tools) / Pipeline Closed = $Z,ZZZ / ZZ = $ZZZ [derived]
- Blended CAC = Total S&M Spend / Total New Customers = $XX,XXX / XXX = $XXX [derived]

**Channel Efficiency**:
- Best: [Channel with lowest CAC]
- Worst: [Channel with highest CAC] — consider reducing spend or improving conversion

---

## 2. Lifetime Value (LTV)

### LTV Calculation (Month 12 data)

```
ARPU = Total MRR / Total Customers
     = $XX,XXX / XXX customers
     = $XXX/month [derived]

Gross Margin = (Revenue - COGS) / Revenue
             = ($XX,XXX - $X,XXX) / $XX,XXX
             = XX% [derived]

Customer Lifetime = 1 / Monthly Churn Rate
                  = 1 / X.X%
                  = XX months [derived]

LTV = ARPU × Gross Margin × Customer Lifetime
    = $XXX/mo × XX% × XX months
    = $X,XXX [derived]
```

### LTV by Tier

| Tier | ARPU [derived] | Gross Margin [derived] | Lifetime [assumption] | LTV [derived] |
|------|----------------|------------------------|-----------------------|---------------|
| Starter | $XX | XX% | XX months | $X,XXX |
| Professional | $XXX | XX% | XX months | $X,XXX |
| Enterprise | $X,XXX | XX% | XX months | $XX,XXX |
| **Blended** | **$XXX** | **XX%** | **XX months** | **$X,XXX** |

**Insights**:
- Enterprise customers have XXx higher LTV than Starter
- Implies: Focus acquisition efforts on [tier with best LTV:CAC ratio]

---

## 3. LTV:CAC Ratio

```
LTV:CAC Ratio = LTV / Blended CAC
              = $X,XXX / $XXX
              = X.X:1 [derived]
```

### Interpretation

✅ **Healthy** (Ratio ≥ 3.0)  
This means we earn $X.XX for every $1 spent acquiring a customer. This supports aggressive growth investment.

⚠️ **Needs Improvement** (Ratio 1.0 - 3.0)  
LTV:CAC is below the healthy threshold. Options:
1. Reduce CAC by improving conversion rates or shifting to lower-cost channels
2. Increase LTV by reducing churn or upselling to higher tiers
3. Accept current ratio if in land-grab phase, but must improve within 12 months

❌ **Critical** (Ratio < 1.0)  
We are losing money on every customer. IMMEDIATE ACTION REQUIRED:
1. Pause paid acquisition spend
2. Focus on product-market fit and retention
3. Revisit pricing (may be too low)

---

## 4. CAC Payback Period

```
CAC Payback Period = CAC / (ARPU × Gross Margin)
                   = $XXX / ($XXX × XX%)
                   = X.X months [derived]
```

### Interpretation

- **X.X months to recoup acquisition cost** via gross profit
- **Target**: < 12 months for healthy cash flow
- **Status**: ✅ Excellent / ⚠️ Acceptable / ❌ Too Long

**Impact on Cash Flow**:
- If payback is 6 months and we acquire 100 customers/month, we need $XXk working capital to fund the gap
- Faster payback = less funding needed for growth

---

## 5. Gross Margin Analysis

### Gross Margin Breakdown (Month 12)

| Component | Amount | % of Revenue | Type |
|-----------|--------|--------------|------|
| **Total Revenue** | $XX,XXX | 100% | [derived] |
| Less: Cloud/Hosting | ($X,XXX) | (X%) | [derived] |
| Less: Payment Processing (2.9%) | ($XXX) | (X%) | [derived] |
| Less: Support Costs (allocated) | ($XXX) | (X%) | [derived] |
| Less: Third-party APIs | ($XXX) | (X%) | [derived] |
| **Gross Profit** | **$XX,XXX** | **XX%** | [derived] |

**Target**: 70-85% for SaaS  
**Status**: ✅ On target / ⚠️ Below target

**COGS per Customer**: $XX/month [derived]

### Margin Improvement Levers

1. **Scale cloud costs**: Move from $X to $Y per customer with volume discounts (add XX% to GM)
2. **Automate support**: Reduce human support hours with self-serve docs (add X% to GM)
3. **Annual prepay**: Reduce payment processing fees by encouraging annual plans (add X% to GM)

---

## 6. Contribution Margin

```
Contribution Margin = (Revenue - COGS - Variable S&M) / Revenue
                    = ($XX,XXX - $X,XXX - $X,XXX) / $XX,XXX
                    = XX% [derived]
```

**Interpretation**:
- After paying for COGS and acquiring the customer, we retain XX% as contribution toward fixed costs (engineering, ops, etc.)
- **Breakeven** when Contribution Margin × Revenue = Fixed Costs
- We need $XX,XXX/month in revenue to cover fixed costs of $XX,XXX/month [derived]

---

## 7. Cohort Analysis

### Customer Retention by Cohort (% of original cohort remaining)

| Cohort | M0 | M1 | M2 | M3 | M6 | M12 | Churn Rate [derived] |
|--------|-----|-----|-----|-----|-----|-----|--------------------|
| Jan 2026 | 100% | 95% | 92% | 89% | 80% | 68% | 3.2% monthly |
| Feb 2026 | 100% | 96% | 93% | 90% | 82% | 71% | 2.9% monthly |
| Mar 2026 | 100% | 97% | 94% | 91% | 84% | — | 2.5% monthly |
| Apr 2026 | 100% | 97% | 94% | 92% | 86% | — | 2.3% monthly |
| Average | 100% | 96% | 93% | 90% | 83% | 70% | **2.7%** |

**Insights**:
- Churn is improving cohort-over-cohort (Jan 3.2% → Apr 2.3%)
- Likely due to: [Product improvements / Better onboarding / Stronger ICP targeting]
- 70% of customers remain after 12 months = 30% annual churn rate

### Revenue Retention by Cohort (MRR as % of Month 0 MRR)

| Cohort | M0 | M1 | M2 | M3 | M6 | M12 | NRR [derived] |
|--------|-----|-----|-----|-----|-----|-----|--------------|
| Jan 2026 | 100% | 98% | 96% | 95% | 94% | 105% | 105% |
| Feb 2026 | 100% | 99% | 97% | 96% | 97% | 110% | 110% |
| Mar 2026 | 100% | 99% | 98% | 98% | 102% | — | — |
| Average | 100% | 99% | 97% | 96% | 98% | **108%** | **108%** |

**Net Revenue Retention (NRR)** = 108% ✅

**Why NRR > 100% despite churn?**
- Customers upgrading from Starter → Pro
- Existing customers adding seats/usage
- Expansion revenue offsets churned revenue

**Best-in-class SaaS NRR**: 110-130%

---

## 8. Sensitivity Analysis

### Scenario: What if CAC increases 25%?

| Metric | Baseline | +25% CAC | Impact |
|--------|----------|----------|--------|
| Blended CAC | $XXX | $XXX | — |
| LTV:CAC Ratio | X.X:1 | X.X:1 | ⚠️ Drops below 3.0 |
| CAC Payback | X months | X months | +X months |
| **Action Required** | — | Improve conversion by XX% or reduce spend | — |

### Scenario: What if churn increases 2%?

| Metric | Baseline | +2% Churn | Impact |
|--------|----------|-----------|--------|
| Monthly Churn | X.X% | X.X% | — |
| Customer Lifetime | XX months | XX months | -X months |
| LTV | $X,XXX | $X,XXX | -$XXX (-XX%) |
| LTV:CAC Ratio | X.X:1 | X.X:1 | ⚠️ Below threshold |
| **Action Required** | — | Launch retention program; reduce churn to < X% | — |

### Scenario: What if we improve onboarding (reduce churn 1%)?

| Metric | Baseline | -1% Churn | Impact |
|--------|----------|-----------|--------|
| LTV | $X,XXX | $X,XXX | +$XXX (+XX%) |
| LTV:CAC Ratio | X.X:1 | X.X:1 | ✅ Improves |
| **ROI** | — | $XXX LTV increase per $X onboarding investment | XXx return |

---

## 9. Benchmarking

### How We Compare to Industry Standards

| Metric | Our Value | SaaS Benchmark | Status |
|--------|-----------|----------------|--------|
| LTV:CAC Ratio | X.X:1 | 3.0-5.0:1 | ✅ / ⚠️ / ❌ |
| CAC Payback | X months | 12-18 months | ✅ / ⚠️ / ❌ |
| Gross Margin | XX% | 70-85% | ✅ / ⚠️ / ❌ |
| Monthly Churn | X.X% | 2-5% (SMB) / 1-2% (ENT) | ✅ / ⚠️ / ❌ |
| NRR | XXX% | 110%+ | ✅ / ⚠️ / ❌ |

**Sources**: [OpenView SaaS Benchmarks, KeyBanc SaaS Survey, Pacific Crest SaaS Survey]

---

## 10. Action Items & Recommendations

### Priority 1: Improve LTV (if LTV:CAC < 3)
- [ ] Reduce churn from X% to Y% via [specific tactic]
- [ ] Increase ARPU by promoting upgrades from Starter → Pro
- [ ] Launch expansion revenue motion (additional seats, usage upsells)

### Priority 2: Optimize CAC (if payback > 12 months)
- [ ] Double down on [lowest CAC channel]
- [ ] Pause or reduce spend on [highest CAC channel]
- [ ] Improve landing page conversion by XX% (current: X%, target: Y%)

### Priority 3: Gross Margin Expansion (if < 70%)
- [ ] Negotiate cloud hosting discounts (target: X% reduction)
- [ ] Automate Tier 1 support with chatbot/docs (reduce support cost by X%)
- [ ] Shift to annual billing (reduce payment processing fees)

### Priority 4: Cohort Retention
- [ ] Implement customer health scoring (track usage, engagement)
- [ ] Launch proactive outreach for at-risk customers (usage dropped XX%)
- [ ] Build case studies from longest-retained cohorts to improve onboarding

---

## Next Steps

1. **Monthly review**: Update unit economics dashboard with actuals by [DATE]
2. **CAC deep-dive**: Break down CAC by tier (Starter/Pro/Enterprise) to optimize targeting by [DATE+14]
3. **Churn reduction sprint**: Interview 10 churned customers to identify top reasons by [DATE+30]
```

## Writing Rules

1. **All metrics must tie back to financial-model.md** — Use consistent assumptions for churn, ARPU, costs.
2. **Flag issues prominently** — If LTV:CAC < 3, use ⚠️ and call it out in Executive Summary.
3. **Show all formulas** — Don't just present the ratio; show the calculation step-by-step.
4. **Include sensitivity analysis** — Model "what-if" scenarios for CAC, churn, and pricing changes.
5. **Benchmark against industry** — Compare to SaaS standards (cite sources like OpenView, KeyBanc).
6. **Provide actionable recommendations** — Don't just analyze; tell the founder what to do.

## Cross-References

- Link to `financial-model.md` for churn, ARPU, and cost assumptions
- Link to `pricing-strategy.md` for tier pricing and expected distribution
- Link to `go-to-market-strategy.md` for channel mix and CAC by channel

## After completion

1. Verify that LTV:CAC ratio is above 3.0 (or flag if below and explain why it's temporarily acceptable).
2. Ensure CAC payback period is realistic (< 18 months for most SaaS businesses).
3. Update `_progress/tracker.md` with completion status.
