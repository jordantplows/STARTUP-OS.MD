---
template: unit-economics
used-by: [departments/finance/model, departments/growth, departments/sales]
produces: company.os.departments['finance'].memory.unitEconomics
---

## Purpose

Unit economics calculating CAC, LTV, payback period, and contribution margin per customer.

## Schema

```typescript
interface UnitEconomics {
  lastUpdated: string;
  
  cac: {
    salesAndMarketing: number;     // Monthly S&M spend
    newCustomers: number;          // New customers acquired
    cac: number;                   // CAC = S&M / new customers
    byChannel: Array<{
      channel: string;
      cac: number;
    }>;
  };
  
  ltv: {
    avgRevenuePerUser: number;     // Monthly ARPU
    grossMargin: number;           // %
    churnRate: number;             // Monthly churn %
    ltv: number;                   // LTV = ARPU × margin / churn
  };
  
  payback: {
    months: number;                // CAC / (ARPU × margin)
    target: number;
  };
  
  ltvCacRatio: {
    ratio: number;                 // LTV / CAC
    target: number;                // Should be 3+ for healthy business
  };
  
  contributionMargin: {
    revenue: number;
    cogs: number;
    margin: number;                // %
  };
}
```

## Agent Instructions

Unit economics show business viability. Calculate CAC from S&M spend and new customers, calculate LTV from ARPU and churn, payback period should be <12 months, LTV:CAC ratio should be >3x.

