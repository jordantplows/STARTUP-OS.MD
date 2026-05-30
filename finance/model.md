---
name: model
description: >
  Generates a comprehensive 3-year financial model based on pricing strategy
  and startup profile. Creates month-by-month Year 1 and quarterly Years 2-3
  projections with customer growth, revenue, costs, P&L, burn, and runway.
  Labels all assumptions vs derived numbers.
allowed-tools: Read, Write, Edit, Bash
---

# Financial Model Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract the full Startup Profile block (company name, product, target market, pricing expectations).
2. Read `finance/output/pricing-strategy.md` if it exists → use exact price points from the recommended tier structure.
3. Read `01-foundation/market-sizing.md` if it exists → ensure customer acquisition assumptions are realistic given TAM/SAM/SOM.
4. Read `04-finance/financial-model.md` template if it exists → understand expected structure.

## Model Structure

Generate a **3-year financial model** with the following components:

### Year 1: Month-by-Month (Months 1-12)
- **Customer Metrics**: New customers, churned customers, total active customers
- **Revenue Metrics**: MRR by tier, total MRR, ARR
- **Team**: Headcount by function (eng, sales, marketing, ops, support)
- **Costs by Category**:
  - Personnel (salaries + benefits @ 1.3x multiplier)
  - Cloud/Infrastructure
  - Sales & Marketing
  - Office & Admin
  - Software & Tools
- **P&L**: Total revenue, total costs, gross margin, operating margin, net income
- **Cash Flow**: Starting cash, cash in, cash out, ending cash, burn rate, runway (months)

### Years 2-3: Quarterly (Q1-Q4 for each year)
- Same structure as Year 1, but quarterly aggregation
- Show acceleration in growth metrics
- Model team expansion
- Track break-even point

## Labeling Convention

- `[assumption]` — All inputs: starting customers, pricing, churn rate, CAC, team salaries, growth rates
- `[derived]` — All calculated values: MRR, ARR, total costs, margins, runway

## Calculation Rules

1. **Customer Growth**:
   - Start with realistic seed customers (e.g., 5-10 in Month 1)
   - New customers per month = `[assumption]` based on sales capacity and CAC
   - Churn rate = `[assumption]` (typically 2-5% monthly for SMB, 1-2% for enterprise)
   - Total customers = previous + new - churned `[derived]`

2. **Revenue**:
   - MRR = sum(customers_per_tier × price_per_tier) `[derived]`
   - ARR = MRR × 12 `[derived]`
   - Use exact pricing from `pricing-strategy.md` output

3. **Costs**:
   - Personnel = (headcount_by_role × salary) × 1.3 `[derived]`
   - Cloud = $X per customer `[assumption]` × total customers `[derived]`
   - Sales & Marketing = $Y per new customer `[assumption]` (CAC) `[derived]`
   - Office = $Z per employee per month `[assumption]` `[derived]`

4. **P&L**:
   - Gross Margin = (Revenue - COGS) / Revenue `[derived]`
   - Operating Margin = (Revenue - Total Costs) / Revenue `[derived]`
   - Net Income = Revenue - Total Costs `[derived]`

5. **Cash Flow**:
   - Starting Cash = `[assumption]` (e.g., $500K pre-seed)
   - Ending Cash = Starting Cash + Revenue - Total Costs `[derived]`
   - Burn Rate = average monthly cash out `[derived]`
   - Runway = Ending Cash / Burn Rate `[derived]`

6. **Break-Even**:
   - Identify the month/quarter where Net Income >= 0

## Output Format

Write to: `finance/output/financial-model.md`

Structure:
```markdown
# Financial Model: [Company Name]

**Generated**: 2026-05-29  
**Planning Horizon**: 3 years (Month-by-month Year 1, Quarterly Years 2-3)

---

## Assumptions Summary

### Customer Assumptions
- Starting customers: X [assumption]
- Monthly new customer growth rate: Y% [assumption]
- Churn rate: Z% monthly [assumption]
- Average tier distribution: Basic X%, Pro Y%, Enterprise Z% [assumption]

### Pricing (from pricing-strategy.md)
- Basic: $X/month
- Pro: $Y/month
- Enterprise: $Z/month

### Cost Assumptions
- Engineering salary: $X/year [assumption]
- Sales salary: $Y/year [assumption]
- Marketing salary: $Z/year [assumption]
- Benefits multiplier: 1.3x [assumption]
- Cloud cost per customer: $X/month [assumption]
- CAC: $Y per customer [assumption]
- Office cost per employee: $Z/month [assumption]

---

## Year 1: Monthly Projections

### Customer Metrics

| Month | New Customers [derived] | Churned [derived] | Total Active [derived] | MRR [derived] | ARR [derived] |
|-------|------------------------|-------------------|------------------------|---------------|---------------|
| 1     |                        |                   |                        |               |               |
| 2     |                        |                   |                        |               |               |
| ...   |                        |                   |                        |               |               |
| 12    |                        |                   |                        |               |               |

### Team Growth

| Month | Engineering | Sales | Marketing | Ops | Support | Total |
|-------|-------------|-------|-----------|-----|---------|-------|
| 1     |             |       |           |     |         |       |
| ...   |             |       |           |     |         |       |

### Cost Breakdown (Monthly)

| Month | Personnel [derived] | Cloud [derived] | Sales & Marketing [derived] | Office [derived] | Total Costs [derived] |
|-------|---------------------|-----------------|-----------------------------|-----------------|-----------------------|
| 1     |                     |                 |                             |                 |                       |
| ...   |                     |                 |                             |                 |                       |

### P&L

| Month | Revenue [derived] | COGS [derived] | Gross Margin % [derived] | Operating Costs [derived] | Net Income [derived] |
|-------|-------------------|----------------|--------------------------|---------------------------|----------------------|
| 1     |                   |                |                          |                           |                      |
| ...   |                   |                |                          |                           |                      |

### Cash Flow

| Month | Starting Cash [derived] | Cash In [derived] | Cash Out [derived] | Ending Cash [derived] | Burn Rate [derived] | Runway (mo) [derived] |
|-------|-------------------------|-------------------|--------------------|-----------------------|---------------------|-----------------------|
| 1     |                         |                   |                    |                       |                     |                       |
| ...   |                         |                   |                    |                       |                     |                       |

---

## Year 2: Quarterly Projections

[Same table structure, quarterly aggregation]

---

## Year 3: Quarterly Projections

[Same table structure, quarterly aggregation]

---

## Key Milestones

- **Break-even month**: Month X (Q Y) [derived]
- **$1M ARR**: Month X [derived]
- **100 customers**: Month X [derived]
- **Runway exhausted** (if no additional funding): Month X [derived]

---

## Sensitivity Analysis

### Scenario: 50% slower customer growth
- Break-even: Month X+Y
- Runway impact: Z months shorter

### Scenario: 10% higher churn
- ARR impact: -$X by end of Year 1
- Break-even: Month X+Y

---

## Next Steps

1. **Validate assumptions with founding team** — Review customer growth, churn, and hiring plan by [DATE].
2. **Cross-check with unit-economics.md** — Ensure CAC and LTV assumptions align by [DATE].
3. **Model additional funding rounds** — Add Series A scenario to cap-table-scenarios.md by [DATE].
```

## Writing Rules

1. **All numbers must be internally consistent** — If CAC is $500, Sales & Marketing costs must equal $500 × new customers.
2. **Use realistic growth curves** — Early-stage B2B SaaS typically grows 10-20% MoM in Year 1, not 50%.
3. **Show formulas in footnotes** — Add a "Calculation Notes" section explaining key derived values.
4. **Flag critical assumptions** — If churn is assumed at 2% but industry average is 5%, call it out.
5. **Be conservative** — Better to under-promise than over-project.
6. **Label every single number** with `[assumption]` or `[derived]`.

## Cross-References

- Link to `pricing-strategy.md` when pulling price points
- Link to `unit-economics.md` for CAC/LTV validation
- Link to `cap-table-scenarios.md` for funding assumptions

## After completion

1. Verify that break-even occurs within 24-36 months given reasonable growth.
2. Ensure runway is sufficient to reach next funding milestone.
3. Update `_progress/tracker.md` with completion status.
