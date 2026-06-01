---
template: financial-model
used-by: [finance/model, finance/fpa, executives/cfo]
produces: company.os.departments['finance'].memory.financialModel
---

## Purpose

Financial model projecting revenue, expenses, cash flow, and key metrics over 3-5 years.

## Schema

```typescript
interface FinancialModel {
  lastUpdated: string;
  assumptions: {
    pricing: {tiers: Array<{name: string, price: number, unit: string}>};
    growth: {monthlyGrowth: number, churnRate: number};
    sales: {avgDealSize: number, salesCycle: number, winRate: number};
    team: {avgSalary: number, headcountPlan: Array<{quarter: string, count: number}>};
  };
  
  projections: Array<{
    month: string;
    revenue: {mrr: number, arr: number, new: number, expansion: number, churn: number};
    expenses: {salaries: number, marketing: number, infrastructure: number, other: number, total: number};
    cash: {starting: number, inflow: number, outflow: number, ending: number};
    metrics: {runway: number, burnMultiple: number, grossMargin: number};
  }>;
  
  scenarios: {
    base: object;
    upside: object;
    downside: object;
  };
}
```

## Agent Instructions

Financial models project the business. Use bottom-up assumptions for revenue (customers × price), model team growth and burn, calculate runway, project 3 scenarios (base/upside/downside).

