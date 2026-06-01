---
template: investor-update
used-by: [departments/finance, executives/cfo, executives/ceo]
produces: company.os.departments['finance'].memory.investorUpdates[]
---

## Purpose

Monthly investor update email with metrics, highlights, lowlights, and asks.

## Schema

```typescript
interface InvestorUpdate {
  month: string;
  
  metrics: {
    revenue: {current: number, growth: number, target: number};
    customers: {current: number, new: number, churned: number};
    runway: {months: number};
    team: {headcount: number};
  };
  
  highlights: string[];            // 3-5 wins
  lowlights: string[];             // 2-3 challenges
  
  asks: Array<{
    type: "intro" | "hire" | "advice";
    description: string;
  }>;
  
  nextMonth: string[];             // Key priorities
}
```

## Agent Instructions

Investor updates keep investors engaged. Lead with metrics, include 3-5 highlights and 2-3 honest lowlights, specific asks where investors can help, preview next month priorities.

