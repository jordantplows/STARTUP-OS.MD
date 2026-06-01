---
template: lean-canvas
used-by: [strategy, executives/ceo]
produces: company.os.departments['strategy'].memory.leanCanvas
---

## Purpose

9-box business model canvas adapted for lean startups, covering problem, solution, key metrics, unique value prop, unfair advantage, channels, customer segments, cost structure, and revenue streams.

## Schema

```typescript
interface LeanCanvas {
  lastUpdated: string;
  
  problem: {
    top3Problems: string[];        // Top 3 problems in priority order
    existingAlternatives: string[]; // How customers solve this today
  };
  
  customerSegments: {
    earlyAdopters: string;         // Who are the early adopters
    segments: Array<{
      name: string;
      size: string;                // Market size estimate
      characteristics: string[];   // What defines this segment
    }>;
  };
  
  uniqueValueProposition: {
    headline: string;              // Single, clear, compelling message
    highLevelConcept: string;      // X for Y (e.g., "Uber for tutors")
    targetAudience: string;        // Who this is for
  };
  
  solution: {
    top3Features: string[];        // Top 3 features that solve top 3 problems
    mvp: string;                   // Minimum viable product definition
  };
  
  channels: {
    pathToCustomers: string[];     // How you'll reach customers
    inbound: string[];             // Pull channels (SEO, content, etc.)
    outbound: string[];            // Push channels (sales, ads, etc.)
  };
  
  revenueStreams: {
    model: string;                 // SaaS, marketplace, transaction, etc.
    pricing: Array<{
      tier: string;
      price: number;
      unit: string;                // per user/month, per transaction, etc.
      targetSegment: string;
    }>;
    lifetime: number;              // LTV estimate
  };
  
  costStructure: {
    fixed: Array<{
      item: string;
      monthly: number;
    }>;
    variable: Array<{
      item: string;
      perUnit: number;
      unit: string;
    }>;
    totalMonthlyBurn: number;
  };
  
  keyMetrics: {
    primary: string;               // The one metric that matters
    secondary: string[];           // Supporting metrics
    pirate: {                      // AARRR framework
      acquisition: string;
      activation: string;
      retention: string;
      referral: string;
      revenue: string;
    };
  };
  
  unfairAdvantage: {
    advantage: string;             // What you have that can't be easily copied
    defensibility: string;         // Why this advantage is sustainable
  };
}
```

## Example

```json
{
  "lastUpdated": "2026-05-31",
  "problem": {
    "top3Problems": [
      "Architecture firms waste 20 hours/week on manual permit submissions",
      "2-week wait for permit feedback causes project delays",
      "Permit rejections due to missing info restart the clock"
    ],
    "existingAlternatives": [
      "Hire junior architect to manually fill forms",
      "Pay consultant $5k to handle submissions",
      "Use generic form software (JotForm, etc.)"
    ]
  },
  "customerSegments": {
    "earlyAdopters": "Small architecture firms (5-20 employees) in tech-forward cities",
    "segments": [
      {
        "name": "Small firms",
        "size": "12,000 firms in US",
        "characteristics": ["5-20 employees", "3-10 projects/year", "budget-conscious"]
      },
      {
        "name": "Mid-size firms",
        "size": "3,000 firms in US",
        "characteristics": ["20-50 employees", "10-30 projects/year", "ROI-focused"]
      }
    ]
  },
  "uniqueValueProposition": {
    "headline": "Submit architectural permits in minutes, not days",
    "highLevelConcept": "TurboTax for building permits",
    "targetAudience": "Architecture firms tired of manual paperwork"
  },
  "solution": {
    "top3Features": [
      "Auto-extract specs from CAD files into permit forms",
      "Pre-submission validation against building codes",
      "Direct submission via city planning APIs"
    ],
    "mvp": "CAD integration + validation + submission for 3 cities (SF, Austin, Seattle)"
  },
  "channels": {
    "pathToCustomers": [
      "Direct outbound to firms in integrated cities",
      "Content marketing (SEO for 'permit submission software')",
      "Partnerships with architectural software vendors",
      "Referrals from existing customers"
    ],
    "inbound": ["SEO/content", "Product-led trial"],
    "outbound": ["Cold email", "Trade show booth"]
  },
  "revenueStreams": {
    "model": "SaaS subscription + usage-based",
    "pricing": [
      {
        "tier": "Starter",
        "price": 299,
        "unit": "per firm/month",
        "targetSegment": "Small firms (5-20 employees)"
      },
      {
        "tier": "Professional",
        "price": 799,
        "unit": "per firm/month",
        "targetSegment": "Mid-size firms (20-50 employees)"
      },
      {
        "tier": "Enterprise",
        "price": 1999,
        "unit": "per firm/month",
        "targetSegment": "Large firms (50+ employees)"
      }
    ],
    "lifetime": 18000
  },
  "costStructure": {
    "fixed": [
      {"item": "Team salaries (4 people)", "monthly": 60000},
      {"item": "Software/infrastructure", "monthly": 5000},
      {"item": "Office/admin", "monthly": 3000}
    ],
    "variable": [
      {"item": "API costs per submission", "perUnit": 2, "unit": "per submission"}
    ],
    "totalMonthlyBurn": 68000
  },
  "keyMetrics": {
    "primary": "Hours saved per customer per week",
    "secondary": ["MRR", "CAC payback", "NPS", "Churn rate"],
    "pirate": {
      "acquisition": "Free trials started",
      "activation": "First successful permit submission",
      "retention": "Monthly active users",
      "referral": "Customer referrals",
      "revenue": "MRR"
    }
  },
  "unfairAdvantage": {
    "advantage": "API integrations with 8 city planning departments",
    "defensibility": "Each city integration takes 6-12 months, founder has planning dept relationships"
  }
}
```

## Agent Instructions

### When to Generate
- At company inception
- Before fundraising
- Quarterly strategy reviews
- When pivoting business model

### How to Populate

1. **Read company.os state**:
   - `company.os.departments['strategy'].memory.ideaCanvas` for problem/solution
   - `company.os.departments['finance'].memory.financialModel` for costs/revenue
   - `company.os.departments['sales'].memory` for pricing/channels
   - `company.os.departments['metrics'].memory.kpis` for key metrics

2. **Fill each box**:
   - **Problem**: Top 3 problems in priority order, limit to 3
   - **Customer Segments**: Be specific, size the market, describe characteristics
   - **UVP**: One clear headline, not a paragraph
   - **Solution**: Top 3 features that map to top 3 problems
   - **Channels**: List 4-6 realistic channels, not every possible channel
   - **Revenue**: Specific pricing tiers with target segments
   - **Costs**: Fixed and variable, calculate total burn
   - **Metrics**: One primary metric, 4-5 secondary
   - **Unfair Advantage**: Must be real, not aspirational

3. **Ensure consistency**:
   - Solution features should directly address problem list
   - Pricing should align with customer segment budgets
   - Channels should reach the customer segments listed
   - Costs should support the revenue model
   - Metrics should measure what matters for the business model

4. **Keep it concise**:
   - Each box is 1-3 sentences or bullet points
   - This fits on one page when printed
   - Details go in other templates (idea canvas, financial model)

### What to Write

Write to strategy department memory:
```
company.os.departments['strategy'].memory.leanCanvas
```

### Events to Emit

```typescript
{
  type: 'lean-canvas-updated',
  timestamp: Date.now(),
  payload: {
    uvp: 'Submit architectural permits in minutes, not days',
    primaryMetric: 'Hours saved per customer per week'
  }
}
```

### Notes

- This is a 1-page business model, not a business plan
- Every box should be filled, no TBDs
- Be specific, avoid generic statements
- Revenue and cost sections should have real numbers
- Unfair advantage is the hardest box — most startups don't have one yet
- Update quarterly as business model evolves
- Use this for investor pitches and team alignment
- Inconsistencies between boxes reveal unclear thinking
