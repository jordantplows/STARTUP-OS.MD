---
template: board-update
used-by: [executives/ceo, executives/cfo]
produces: company.os.departments['ceo'].memory.boardUpdate
---

## Purpose

Monthly or quarterly update for board members and investors covering financial performance, key metrics, strategic progress, and asks.

## Schema

```typescript
interface BoardUpdate {
  period: string;                  // "2026-Q2" or "2026-05"
  date: string;                    // ISO date
  
  executiveSummary: {
    headline: string;              // One-line: what happened this period
    sentiment: "strong" | "on-track" | "mixed" | "concerning";
    keyWins: string[];             // 2-3 major wins
    keyChallenges: string[];       // 2-3 major challenges
  };
  
  financial: {
    revenue: {
      current: number;
      target: number;
      growth: number;              // % change from last period
    };
    burn: {
      monthly: number;
      runway: number;              // months
    };
    cash: {
      balance: number;
      endOfQuarter: number;        // projected
    };
    unitEconomics: {
      cac: number;
      ltv: number;
      payback: number;             // months
    };
  };
  
  customers: {
    total: number;
    new: number;
    churned: number;
    nrr: number;                   // net revenue retention %
    expansion: number;             // expansion ARR
    topCustomers: Array<{
      name: string;
      arr: number;
    }>;
  };
  
  product: {
    releases: Array<{
      feature: string;
      date: string;
      impact: string;
    }>;
    roadmap: {
      current: string[];           // In progress
      next: string[];              // Next 30 days
    };
    metrics: {
      dau: number;
      wau: number;
      retention: {
        d1: number;
        d7: number;
        d30: number;
      };
    };
  };
  
  team: {
    headcount: number;
    openRoles: number;
    recentHires: Array<{
      name: string;
      role: string;
      startDate: string;
    }>;
    attrition: number;             // % this period
  };
  
  sales: {
    pipeline: {
      total: number;
      qualified: number;
      closingThisQuarter: number;
    };
    deals: Array<{
      company: string;
      arr: number;
      stage: string;
      closeDate: string;
    }>;
    winRate: number;               // %
    avgDealSize: number;
  };
  
  asks: Array<{
    type: "intro" | "hire" | "advice" | "capital";
    description: string;
    urgency: "immediate" | "this-month" | "this-quarter";
  }>;
  
  risks: Array<{
    category: "market" | "product" | "team" | "financial";
    risk: string;
    mitigation: string;
    severity: "high" | "medium" | "low";
  }>;
}
```

## Example

```json
{
  "period": "2026-Q2",
  "date": "2026-06-30",
  "executiveSummary": {
    "headline": "Hit $50k MRR, shipped enterprise features, raised $2M bridge",
    "sentiment": "strong",
    "keyWins": [
      "Crossed $50k MRR milestone (150% QoQ growth)",
      "Closed first 3 enterprise deals ($45k ARR total)",
      "Shipped SSO and RBAC features ahead of schedule"
    ],
    "keyChallenges": [
      "Engineering team at capacity, delaying Q3 roadmap",
      "Churn ticked up to 3.5% as we transition upmarket"
    ]
  },
  "financial": {
    "revenue": {
      "current": 50000,
      "target": 45000,
      "growth": 66.7
    },
    "burn": {
      "monthly": 95000,
      "runway": 18
    },
    "cash": {
      "balance": 1700000,
      "endOfQuarter": 1400000
    },
    "unitEconomics": {
      "cac": 3500,
      "ltv": 18000,
      "payback": 8
    }
  },
  "asks": [
    {
      "type": "intro",
      "description": "Intro to VP Eng candidates, need to hire 3 engineers by Q3",
      "urgency": "immediate"
    },
    {
      "type": "advice",
      "description": "Pricing strategy for enterprise vs SMB segments",
      "urgency": "this-quarter"
    }
  ]
}
```

## Agent Instructions

### When to Generate
- End of each month (for monthly updates)
- End of each quarter (for quarterly updates)
- Before board meetings
- On-demand when user requests

### How to Populate

1. **Read company.os state**:
   - `company.os.snapshot` for current financials
   - `company.os.events` for the full period
   - `company.os.departments['finance'].memory.financialModel`
   - `company.os.departments['sales'].memory.pipeline`
   - `company.os.departments['product'].memory.roadmap`

2. **Calculate period metrics**:
   - Compare current vs start-of-period for growth rates
   - Calculate runway from current burn and cash balance
   - Pull churn and NRR from sales/finance data

3. **Synthesize executive summary**:
   - Pick 2-3 most significant wins (customer, product, financial)
   - Identify 2-3 real challenges (no fluff, be honest)
   - Set sentiment based on performance vs targets

4. **Compile product progress**:
   - List major releases from period
   - Show current roadmap status
   - Include usage metrics if available

5. **Format asks**:
   - Only include asks where board can actually help
   - Be specific (not "help us hire" but "intro to VP Eng candidates")
   - Flag urgency honestly

6. **Identify risks**:
   - Surface real risks from department blockers
   - Include mitigation plans
   - Don't hide bad news

### What to Write

Write the completed update to:
```
company.os.departments['ceo'].memory.boardUpdate
```

Also write a PDF-ready version to:
```
company.os.departments['ceo'].artifacts.boardUpdatePDF
```

### Events to Emit

```typescript
{
  type: 'board-update-generated',
  timestamp: Date.now(),
  payload: {
    period: '2026-Q2',
    sentiment: 'strong',
    asksCount: 2,
    revenueGrowth: 66.7
  }
}
```

### Notes

- Be honest, don't sugarcoat challenges
- Board wants to see trend, not just snapshot
- Asks should be specific and actionable
- Risks should include mitigation plans
- Keep financial section data-dense
- This gets formatted into a PDF deck by downstream agents
