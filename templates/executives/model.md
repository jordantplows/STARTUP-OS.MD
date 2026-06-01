---
template: financial-modeling
used-by: [executives/cfo, finance/model, finance/fpa]
produces: company.os.departments['finance'].memory.financialModel
---

## Purpose

Comprehensive financial model projecting revenue, expenses, cash flow, and key metrics with scenario analysis.

## Schema

```typescript
interface FinancialModel {
  lastUpdated: string;             // ISO date
  horizon: string;                 // "36-months" | "60-months"
  currency: string;                // "USD"
  
  assumptions: {
    revenue: {
      pricing: Array<{
        tier: string;
        price: number;
        unit: "seat" | "usage" | "flat";
        avgSeats?: number;
      }>;
      
      growth: {
        newCustomers: {
          monthly: number;         // Expected new customers/month
          growthRate: number;      // % growth in new customer acquisition
        };
        expansion: {
          rate: number;            // Annual NRR %
          timing: number;          // Months to expansion
        };
        churn: {
          rate: number;            // Monthly churn %
          bySegment: Record<string, number>;
        };
      };
      
      sales: {
        avgDealSize: number;
        salesCycle: number;        // Days
        winRate: number;           // %
        rampTime: number;          // Months to full productivity
      };
    };
    
    expenses: {
      team: {
        headcountPlan: Array<{
          quarter: string;
          engineering: number;
          product: number;
          sales: number;
          marketing: number;
          operations: number;
          executive: number;
        }>;
        
        compensation: {
          engineering: {avg: number, equity: number};
          sales: {base: number, commission: number, equity: number};
          marketing: {avg: number, equity: number};
          operations: {avg: number, equity: number};
          executive: {avg: number, equity: number};
        };
        
        burden: number;            // % for benefits, taxes, etc.
      };
      
      nonPersonnel: {
        infrastructure: {
          base: number;
          perCustomer: number;
          scalingFactor: number;   // How it grows with customers
        };
        marketing: {
          base: number;
          perNewCustomer: number;  // CAC spend
        };
        sales: {
          tools: number;
          travel: number;
        };
        operations: {
          software: number;
          legal: number;
          other: number;
        };
      };
    };
    
    capital: {
      currentCash: number;
      futureRounds: Array<{
        date: string;
        amount: number;
        type: "seed" | "series-a" | "series-b";
        assumptions: string;
      }>;
    };
  };
  
  projections: Array<{
    month: string;                 // "2026-06"
    
    revenue: {
      newMRR: number;
      expansionMRR: number;
      churnedMRR: number;
      netNewMRR: number;
      totalMRR: number;
      arr: number;
      
      customers: {
        starting: number;
        new: number;
        churned: number;
        ending: number;
      };
    };
    
    expenses: {
      salaries: number;
      benefits: number;
      totalPersonnel: number;
      
      infrastructure: number;
      marketing: number;
      sales: number;
      operations: number;
      totalNonPersonnel: number;
      
      total: number;
    };
    
    cash: {
      startingBalance: number;
      revenue: number;
      expenses: number;
      netChange: number;
      endingBalance: number;
    };
    
    metrics: {
      runway: number;              // Months remaining
      burnRate: number;            // Monthly burn
      burnMultiple: number;        // Burn / Net New ARR
      grossMargin: number;         // %
      revenuePerEmployee: number;
      
      cac: number;
      ltv: number;
      ltvCacRatio: number;
      paybackMonths: number;
      
      monthsToBreakeven: number;
    };
    
    headcount: {
      engineering: number;
      product: number;
      sales: number;
      marketing: number;
      operations: number;
      executive: number;
      total: number;
    };
  }>;
  
  scenarios: {
    base: {
      description: string;
      assumptions: Record<string, any>;
      keyMetrics: {
        arr12mo: number;
        arr24mo: number;
        arr36mo: number;
        minRunway: number;
        breakeven: string;
      };
    };
    upside: {
      description: string;
      changes: string[];
      keyMetrics: Record<string, any>;
    };
    downside: {
      description: string;
      changes: string[];
      keyMetrics: Record<string, any>;
    };
  };
  
  sensitivity: Array<{
    variable: string;              // What we're varying
    range: Array<number>;          // Values to test
    impact: Array<{
      value: number;
      runway: number;
      arr12mo: number;
      breakeven: string;
    }>;
  }>;
}
```

## Example

```json
{
  "lastUpdated": "2026-05-31",
  "horizon": "36-months",
  "currency": "USD",
  "assumptions": {
    "revenue": {
      "pricing": [
        {"tier": "Starter", "price": 99, "unit": "seat", "avgSeats": 5},
        {"tier": "Pro", "price": 299, "unit": "seat", "avgSeats": 15},
        {"tier": "Enterprise", "price": 1500, "unit": "flat"}
      ],
      "growth": {
        "newCustomers": {"monthly": 5, "growthRate": 10},
        "expansion": {"rate": 120, "timing": 6},
        "churn": {"rate": 3.0, "bySegment": {"smb": 5.0, "enterprise": 1.5}}
      },
      "sales": {
        "avgDealSize": 5000,
        "salesCycle": 60,
        "winRate": 25,
        "rampTime": 3
      }
    },
    "expenses": {
      "team": {
        "compensation": {
          "engineering": {"avg": 160000, "equity": 0.20},
          "sales": {"base": 120000, "commission": 80000, "equity": 0.15}
        },
        "burden": 25
      }
    }
  },
  "projections": [
    {
      "month": "2026-06",
      "revenue": {
        "newMRR": 15000,
        "expansionMRR": 3000,
        "churnedMRR": 1500,
        "netNewMRR": 16500,
        "totalMRR": 50000,
        "arr": 600000,
        "customers": {"starting": 25, "new": 5, "churned": 1, "ending": 29}
      },
      "expenses": {
        "totalPersonnel": 75000,
        "totalNonPersonnel": 20000,
        "total": 95000
      },
      "cash": {
        "startingBalance": 1400000,
        "revenue": 50000,
        "expenses": 95000,
        "netChange": -45000,
        "endingBalance": 1355000
      },
      "metrics": {
        "runway": 14,
        "burnRate": 45000,
        "burnMultiple": 2.7,
        "cac": 3500,
        "ltv": 18000,
        "ltvCacRatio": 5.1,
        "paybackMonths": 8
      }
    }
  ],
  "scenarios": {
    "base": {
      "description": "5 new customers/month, 3% churn, 20% NRR",
      "keyMetrics": {
        "arr12mo": 900000,
        "arr24mo": 1800000,
        "arr36mo": 3200000,
        "minRunway": 12,
        "breakeven": "2027-Q4"
      }
    },
    "upside": {
      "description": "8 new customers/month, 2% churn, 25% NRR",
      "changes": ["Faster sales momentum", "Lower churn", "Better expansion"],
      "keyMetrics": {
        "arr12mo": 1200000,
        "arr24mo": 2800000,
        "breakeven": "2027-Q2"
      }
    },
    "downside": {
      "description": "3 new customers/month, 4% churn, 15% NRR",
      "changes": ["Slower sales", "Higher churn", "Less expansion"],
      "keyMetrics": {
        "arr12mo": 600000,
        "arr24mo": 1000000,
        "breakeven": "Never (need to raise)"
      }
    }
  }
}
```

## Agent Instructions

### When to Generate
- Monthly for financial planning and board updates
- Before fundraising to model scenarios
- When major changes to assumptions (new pricing, team changes)
- For strategic planning exercises

### How to Populate

1. **Read company.os state**:
   - Current financials from `company.os.snapshot`
   - Historical data from `company.os.departments['finance'].memory`
   - Headcount plan from people department
   - Pricing and customer data from sales

2. **Build revenue model**:
   - Model cohorts of customers by acquisition month
   - Apply growth, expansion, and churn rates
   - Calculate MRR → ARR
   - Segment by customer type if needed

3. **Project expenses**:
   - Personnel: headcount plan × compensation + burden
   - Non-personnel: fixed + variable components
   - Scale infrastructure with customer growth
   - Model marketing spend based on CAC targets

4. **Calculate cash flow**:
   - Start with current cash balance
   - Add revenue (with payment timing if relevant)
   - Subtract expenses
   - Project runway month by month

5. **Compute metrics**:
   - CAC: marketing spend / new customers
   - LTV: ARPU / churn rate × gross margin
   - Burn multiple: burn / net new ARR
   - Payback: CAC / (ARPU × gross margin)

6. **Model scenarios**:
   - Base: realistic assumptions based on current data
   - Upside: 20-30% better on key metrics
   - Downside: 20-30% worse on key metrics
   - Show impact on runway and ARR

7. **Run sensitivity analysis**:
   - Test impact of varying CAC, churn, growth, pricing
   - Show which levers matter most
   - Guide strategic decisions

### What to Write

Write model to finance memory:
```
company.os.departments['finance'].memory.financialModel
```

Write key metrics to snapshot:
```
company.os.snapshot.{runway, burn, mrr, arr}
```

### Events to Emit

```typescript
{
  type: 'financial-model-updated',
  timestamp: Date.now(),
  payload: {
    runway: 14,
    arr: 600000,
    projectedArr12mo: 900000,
    breakeven: '2027-Q4'
  }
}
```

When runway drops below threshold:
```typescript
{
  type: 'runway-warning',
  timestamp: Date.now(),
  payload: {
    runway: 9,
    threshold: 12,
    recommendation: 'Begin fundraising or cut burn'
  }
}
```

### Notes

- Model should be bottom-up (customers × price), not top-down
- Use cohort-based revenue modeling for accuracy
- Include 3 scenarios to show range of outcomes
- Sensitivity analysis identifies highest-leverage decisions
- Update monthly with actuals to improve assumptions
- Financial model drives strategic resource allocation
- This is structured data for planning, not a narrative document
