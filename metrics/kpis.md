---
name: kpis
description: >
  Defines comprehensive KPI framework with full registry including definition,
  formula, frequency, owner, source, current value, target, and benchmark for
  product, marketing, sales, finance, and customer success metrics by stage.
department: metrics
triggers: ["/startup-os metrics"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
  - strategy/output/idea-canvas.md
  - product/output/prd-filled.md
  - finance/output/pricing-strategy.md
  - finance/output/financial-model.md
writes:
  - metrics/output/kpi-framework.md
---

## What this agent does

Reads startup profile and outputs to create a comprehensive KPI framework covering all business functions. Defines each metric with formula, measurement frequency, owner, data source, current value, target, and industry benchmark. Organizes metrics by startup stage (pre-PMF, early growth, scaling) and identifies vanity metrics to avoid. Writes structured KPI registry to metrics/output/kpi-framework.md.

## Instructions

1. Read CLAUDE.md for startup profile and business model
2. Read strategy outputs for market context and business stage
3. Read product outputs for feature set and user engagement patterns
4. Read finance outputs for revenue model and pricing structure
5. Define KPI categories: Product, Marketing, Sales, Finance, Customer Success
6. For each KPI provide: name, definition, formula, frequency, owner, source, current, target, benchmark
7. Organize metrics by startup stage: Pre-PMF, Early Growth, Scaling
8. Identify vanity metrics to avoid (pageviews without engagement, registered users without activation)
9. Format as structured markdown with tables
10. Write to metrics/output/kpi-framework.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateKPIFramework() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  // Read context files
  let claudeMd = ''
  let ideaCanvas = ''
  let prd = ''
  let pricing = ''
  let financialModel = ''

  try {
    claudeMd = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: CLAUDE.md not found')
  }

  try {
    ideaCanvas = readFileSync(join(projectRoot, 'strategy', 'output', 'idea-canvas.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: idea-canvas.md not found')
  }

  try {
    prd = readFileSync(join(projectRoot, 'product', 'output', 'prd-filled.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: prd-filled.md not found')
  }

  try {
    pricing = readFileSync(join(projectRoot, 'finance', 'output', 'pricing-strategy.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: pricing-strategy.md not found')
  }

  try {
    financialModel = readFileSync(join(projectRoot, 'finance', 'output', 'financial-model.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: financial-model.md not found')
  }

  const fullContext = `
# Startup Context

## Startup Profile
${claudeMd}

## Strategy
${ideaCanvas}

## Product
${prd}

## Pricing
${pricing}

## Financial Model
${financialModel}
  `.trim()

  // Generate KPI framework via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are a KPI framework expert for startups. Based on this startup context:

${fullContext}

Create a comprehensive KPI framework document with the following structure:

# KPI Framework: [Company Name]

**Generated**: ${new Date().toISOString().split('T')[0]}
**Business Model**: [Subscription/Transaction/etc]
**Current Stage**: [Pre-PMF/Early Growth/Scaling]

---

## Overview

Brief explanation of how to use this framework. Include:
- Purpose of tracking these metrics
- How often to review (weekly/monthly/quarterly)
- Who owns metric tracking
- How metrics connect to business objectives

---

## KPI Registry by Function

### Product Metrics

| Metric | Definition | Formula | Frequency | Owner | Source | Current | Target | Benchmark |
|--------|-----------|---------|-----------|-------|--------|---------|--------|-----------|
| Daily Active Users (DAU) | [definition] | [formula] | Daily | Product Lead | Analytics | [value] | [target] | [industry] |
| Weekly Active Users (WAU) | [definition] | [formula] | Weekly | Product Lead | Analytics | [value] | [target] | [industry] |
| Monthly Active Users (MAU) | [definition] | [formula] | Monthly | Product Lead | Analytics | [value] | [target] | [industry] |
| DAU/MAU Ratio | [definition] | DAU ÷ MAU | Weekly | Product Lead | Analytics | [value] | [target] | [industry] |
| Feature Adoption Rate | [definition] | [formula] | Monthly | Product Lead | Analytics | [value] | [target] | [industry] |
| Time to Value (TTV) | [definition] | [formula] | Monthly | Product Lead | Analytics | [value] | [target] | [industry] |
| Net Promoter Score (NPS) | [definition] | %Promoters - %Detractors | Quarterly | Product Lead | Survey | [value] | [target] | [industry] |

[Add 3-5 more product-specific metrics based on the product type]

### Marketing Metrics

| Metric | Definition | Formula | Frequency | Owner | Source | Current | Target | Benchmark |
|--------|-----------|---------|-----------|-------|--------|---------|--------|-----------|
| Website Traffic | [definition] | [formula] | Weekly | Marketing Lead | Analytics | [value] | [target] | [industry] |
| Lead Generation | [definition] | [formula] | Weekly | Marketing Lead | CRM | [value] | [target] | [industry] |
| Lead-to-MQL Conversion | [definition] | MQLs ÷ Total Leads | Weekly | Marketing Lead | CRM | [value] | [target] | [industry] |
| MQL-to-SQL Conversion | [definition] | SQLs ÷ MQLs | Weekly | Marketing Lead | CRM | [value] | [target] | [industry] |
| Cost Per Lead (CPL) | [definition] | Marketing Spend ÷ Leads | Weekly | Marketing Lead | CRM + Finance | [value] | [target] | [industry] |
| Content Engagement Rate | [definition] | [formula] | Monthly | Marketing Lead | Analytics | [value] | [target] | [industry] |
| Email Open Rate | [definition] | Opens ÷ Delivered | Weekly | Marketing Lead | Email Platform | [value] | [target] | [industry] |
| Email Click Rate | [definition] | Clicks ÷ Delivered | Weekly | Marketing Lead | Email Platform | [value] | [target] | [industry] |

[Add 2-3 more marketing-specific metrics]

### Sales Metrics

| Metric | Definition | Formula | Frequency | Owner | Source | Current | Target | Benchmark |
|--------|-----------|---------|-----------|-------|--------|---------|--------|-----------|
| New Customers | [definition] | [formula] | Weekly | Sales Lead | CRM | [value] | [target] | [industry] |
| Sales Qualified Leads (SQL) | [definition] | [formula] | Weekly | Sales Lead | CRM | [value] | [target] | [industry] |
| SQL-to-Customer Conversion | [definition] | Customers ÷ SQLs | Weekly | Sales Lead | CRM | [value] | [target] | [industry] |
| Average Sales Cycle (days) | [definition] | [formula] | Monthly | Sales Lead | CRM | [value] | [target] | [industry] |
| Win Rate | [definition] | Won Deals ÷ Total Opps | Monthly | Sales Lead | CRM | [value] | [target] | [industry] |
| Average Contract Value (ACV) | [definition] | Total ARR ÷ Customers | Monthly | Sales Lead | CRM | [value] | [target] | [industry] |
| Sales Pipeline Value | [definition] | [formula] | Weekly | Sales Lead | CRM | [value] | [target] | [industry] |

[Add 2-3 more sales-specific metrics]

### Finance Metrics

| Metric | Definition | Formula | Frequency | Owner | Source | Current | Target | Benchmark |
|--------|-----------|---------|-----------|-------|--------|---------|--------|-----------|
| Monthly Recurring Revenue (MRR) | [definition] | Sum of all subscription revenue | Daily | CFO | Billing | [value] | [target] | [industry] |
| Annual Recurring Revenue (ARR) | [definition] | MRR × 12 | Monthly | CFO | Billing | [value] | [target] | [industry] |
| Revenue Growth Rate | [definition] | (Current - Previous) ÷ Previous | Monthly | CFO | Billing | [value] | [target] | [industry] |
| Gross Margin | [definition] | (Revenue - COGS) ÷ Revenue | Monthly | CFO | Finance | [value] | [target] | [industry] |
| Net Burn Rate | [definition] | Revenue - Expenses | Monthly | CFO | Finance | [value] | [target] | [industry] |
| Runway (months) | [definition] | Cash Balance ÷ Net Burn | Monthly | CFO | Finance | [value] | [target] | [industry] |
| Customer Acquisition Cost (CAC) | [definition] | Sales + Marketing Spend ÷ New Customers | Monthly | CFO | Finance + CRM | [value] | [target] | [industry] |
| CAC Payback Period (months) | [definition] | CAC ÷ (ACV × Gross Margin) | Monthly | CFO | Finance | [value] | [target] | [industry] |

[Add 2-3 more finance-specific metrics]

### Customer Success Metrics

| Metric | Definition | Formula | Frequency | Owner | Source | Current | Target | Benchmark |
|--------|-----------|---------|-----------|-------|--------|---------|--------|-----------|
| Customer Churn Rate | [definition] | Lost Customers ÷ Total Customers | Monthly | CS Lead | CRM | [value] | [target] | [industry] |
| Revenue Churn Rate | [definition] | Lost MRR ÷ Total MRR | Monthly | CS Lead | Billing | [value] | [target] | [industry] |
| Net Revenue Retention (NRR) | [definition] | [formula with expansion] | Monthly | CS Lead | Billing | [value] | [target] | [industry] |
| Customer Lifetime Value (LTV) | [definition] | ACV ÷ Churn Rate | Monthly | CS Lead | Finance + CRM | [value] | [target] | [industry] |
| LTV:CAC Ratio | [definition] | LTV ÷ CAC | Monthly | CS Lead | Finance | [value] | [target] | [industry] |
| Customer Health Score | [definition] | [formula] | Weekly | CS Lead | CRM | [value] | [target] | [industry] |
| Support Response Time | [definition] | [formula] | Daily | CS Lead | Support System | [value] | [target] | [industry] |
| Customer Satisfaction (CSAT) | [definition] | [formula] | Monthly | CS Lead | Survey | [value] | [target] | [industry] |

[Add 2-3 more CS-specific metrics]

---

## Metrics by Startup Stage

### Pre-Product/Market Fit (0-10 customers)
**Primary focus**: Product engagement and validation

Priority Metrics:
1. Weekly Active Users
2. Feature Adoption Rate
3. Time to Value
4. Customer Retention (Week 1, Week 4)
5. Qualitative feedback score

**Why these matter**: [explanation]

### Early Growth (10-100 customers)
**Primary focus**: Unit economics and repeatability

Priority Metrics:
1. MRR Growth Rate
2. CAC
3. CAC Payback Period
4. Customer Churn Rate
5. NPS
6. Sales Cycle Length
7. Win Rate

**Why these matter**: [explanation]

### Scaling (100+ customers)
**Primary focus**: Efficiency and profitability

Priority Metrics:
1. ARR
2. Net Revenue Retention
3. LTV:CAC Ratio
4. Gross Margin
5. Magic Number (Sales Efficiency)
6. Customer Health Score
7. Team Efficiency Ratios

**Why these matter**: [explanation]

---

## Vanity Metrics to Avoid

| Vanity Metric | Why It's Misleading | Better Alternative |
|---------------|---------------------|-------------------|
| Total Registered Users | Doesn't measure engagement or value | Weekly Active Users (WAU) |
| Page Views | Doesn't indicate product value | Time in Product or Feature Usage |
| App Downloads | Says nothing about retention | D7/D30 Retention Rate |
| Social Media Followers | No correlation to revenue | Engagement Rate or Referral Conversions |
| Total Signups | Ignores activation and churn | Activated Users or Paying Customers |
| Email List Size | Doesn't measure engagement | Email Click-Through Rate or Conversion |
| Total Revenue (early stage) | Ignores efficiency | CAC Payback or LTV:CAC |

[Add 2-3 more with explanations]

---

## Metric Relationships & Dependencies

### The Growth Equation
\`\`\`
MRR = (New MRR + Expansion MRR) - (Churned MRR + Contraction MRR)
\`\`\`

### The Unit Economics Formula
\`\`\`
LTV:CAC Ratio = (ACV × Gross Margin ÷ Churn Rate) ÷ (Sales + Marketing Spend ÷ New Customers)
\`\`\`

Target: 3:1 or higher

### The Efficiency Formula (Magic Number)
\`\`\`
Magic Number = (Current Quarter ARR - Previous Quarter ARR) ÷ Previous Quarter Sales + Marketing Spend
\`\`\`

Target: >0.75

[Add 2-3 more key formulas with explanations]

---

## Data Collection & Tooling

| Metric Category | Data Sources | Tools Needed | Update Frequency |
|-----------------|--------------|--------------|------------------|
| Product | User behavior, feature usage | Analytics platform (Amplitude, Mixpanel) | Real-time |
| Marketing | Website, campaigns, content | Google Analytics, Marketing automation | Daily |
| Sales | Pipeline, deals, activities | CRM (HubSpot, Salesforce) | Real-time |
| Finance | Billing, accounting | Stripe, QuickBooks | Daily |
| Customer Success | Support, health, feedback | CRM, Support system, Survey tools | Real-time |

---

## Dashboard & Review Cadence

### Daily Dashboard (for founders/leads)
- MRR
- New Customers
- Active Users
- Critical Alerts (churn, downtime)

### Weekly Review (full team)
- Weekly metrics snapshot
- Progress vs targets
- Blockers and wins

### Monthly Business Review (leadership + board)
- Month-over-month trends
- Unit economics
- Strategic initiatives progress
- Quarterly projections update

### Quarterly Board Review
- Quarter performance vs plan
- Key metric deep dives
- Strategic pivots or changes
- Fundraising implications

---

## Next Steps

1. **Set up data infrastructure** — Implement tracking for all priority metrics by [DATE+14 days]
2. **Establish baselines** — Collect 4 weeks of data to set realistic targets by [DATE+30 days]
3. **Create dashboards** — Build daily/weekly/monthly views in [tool] by [DATE+21 days]
4. **Define ownership** — Assign metric owners and review cadence by [DATE+7 days]

---

## Revision History

| Date | Changes | Author |
|------|---------|--------|
| ${new Date().toISOString().split('T')[0]} | Initial framework created | AI Agent |

Use the startup context to make all metrics specific and relevant to the business model. Include actual industry benchmarks where known (SaaS benchmarks, marketplace benchmarks, etc.). Make formulas explicit and calculable. Ensure Current/Target columns have realistic placeholder values or [TBD] markers.`
      }
    ]
  })

  // Extract content from response
  let kpiFramework = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      kpiFramework += block.text + '\n'
    }
  }

  if (!kpiFramework.trim()) {
    kpiFramework = 'Failed to generate KPI framework'
  }

  // Write output
  const outputDir = join(projectRoot, 'metrics', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'kpi-framework.md')
  writeFileSync(outputPath, kpiFramework, 'utf-8')

  console.log(`KPI framework generated successfully: ${outputPath}`)
  console.log(`\nGenerated: Complete KPI registry with formulas, owners, benchmarks`)
}

generateKPIFramework().catch(console.error)
```

## Output

Creates metrics/output/kpi-framework.md with comprehensive KPI registry organized by function (Product, Marketing, Sales, Finance, Customer Success). Each metric includes definition, formula, measurement frequency, owner, data source, current value, target, and industry benchmark. Framework includes metrics organized by startup stage (Pre-PMF, Early Growth, Scaling), vanity metrics to avoid, metric relationships and dependencies, data collection tooling recommendations, and dashboard/review cadence guidelines.
