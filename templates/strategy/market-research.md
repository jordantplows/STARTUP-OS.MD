---
template: market-research
used-by: [departments/strategy, executives/ceo]
produces: company.os.departments['strategy'].memory.marketResearch
---

## Purpose

TAM/SAM/SOM market sizing and market dynamics analysis to validate market opportunity and competitive landscape.

## Schema

```typescript
interface MarketResearch {
  lastUpdated: string;
  
  marketSize: {
    tam: {                         // Total Addressable Market
      value: number;               // $ amount
      definition: string;          // How calculated
      source: string;              // Data source
    };
    sam: {                         // Serviceable Addressable Market
      value: number;
      definition: string;
      geographic: string[];        // Regions covered
      segments: string[];          // Customer segments included
    };
    som: {                         // Serviceable Obtainable Market
      year1: number;
      year3: number;
      year5: number;
      assumptions: string[];       // Key assumptions in sizing
    };
  };
  
  marketDynamics: {
    growthRate: number;            // Annual growth rate %
    trends: Array<{
      trend: string;
      impact: "positive" | "negative" | "neutral";
      timeframe: string;
    }>;
    drivers: string[];             // What's driving growth
    headwinds: string[];           // What's slowing growth
  };
  
  customerBase: {
    totalPotentialCustomers: number;
    segmentation: Array<{
      segment: string;
      count: number;
      avgDealSize: number;
      buyingPower: "high" | "medium" | "low";
    }>;
  };
  
  competitiveLandscape: {
    incumbents: Array<{
      name: string;
      marketShare: number;         // % of market
      strengths: string[];
      weaknesses: string[];
    }>;
    startups: Array<{
      name: string;
      funding: number;
      approach: string;
      threat: "high" | "medium" | "low";
    }>;
    substitutes: string[];         // Non-obvious alternatives
  };
  
  entryBarriers: {
    capitalRequired: number;
    timeToMarket: string;
    regulatoryHurdles: string[];
    networkEffects: string;
  };
  
  sources: Array<{
    type: "report" | "interview" | "database" | "survey";
    name: string;
    date: string;
    url?: string;
  }>;
}
```

## Example

```json
{
  "lastUpdated": "2026-05-31",
  "marketSize": {
    "tam": {
      "value": 2800000000,
      "definition": "All architecture + engineering + planning firms in US/Canada spending on project mgmt and submission tools",
      "source": "IBISWorld Architecture Industry Report 2026"
    },
    "sam": {
      "value": 450000000,
      "definition": "Small-to-mid-size architecture firms (5-200 employees) in US/Canada with digital permit submission needs",
      "geographic": ["US", "Canada"],
      "segments": ["Small firms (5-50)", "Mid-size firms (50-200)"]
    },
    "som": {
      "year1": 3600000,
      "year3": 25000000,
      "year5": 75000000,
      "assumptions": [
        "5% market penetration by year 5",
        "Average $500/month per customer",
        "15,000 target firms in serviceable market"
      ]
    }
  },
  "marketDynamics": {
    "growthRate": 12.5,
    "trends": [
      {
        "trend": "Cities digitizing planning departments, APIs becoming available",
        "impact": "positive",
        "timeframe": "2024-2027"
      },
      {
        "trend": "Architectural software moving to cloud (CAD, BIM)",
        "impact": "positive",
        "timeframe": "Ongoing"
      },
      {
        "trend": "Remote work reducing tolerance for manual processes",
        "impact": "positive",
        "timeframe": "Post-2020"
      }
    ],
    "drivers": [
      "Government digitization initiatives",
      "Labor cost increases making automation attractive",
      "Firm consolidation creating budget for tools"
    ],
    "headwinds": [
      "Slow city adoption of technology",
      "Fragmented local regulations"
    ]
  },
  "customerBase": {
    "totalPotentialCustomers": 15000,
    "segmentation": [
      {
        "segment": "Small firms (5-20)",
        "count": 12000,
        "avgDealSize": 3600,
        "buyingPower": "medium"
      },
      {
        "segment": "Mid-size firms (20-200)",
        "count": 3000,
        "avgDealSize": 9600,
        "buyingPower": "high"
      }
    ]
  },
  "competitiveLandscape": {
    "incumbents": [
      {
        "name": "Autodesk (BIM 360)",
        "marketShare": 15,
        "strengths": ["Integrated with CAD", "Large customer base"],
        "weaknesses": ["No permit submission features", "Slow to innovate"]
      }
    ],
    "startups": [
      {
        "name": "PermitFlow",
        "funding": 5000000,
        "approach": "Concierge service model",
        "threat": "medium"
      }
    ],
    "substitutes": [
      "Hire permit expediter",
      "Use generic form tools",
      "Manual process with junior staff"
    ]
  },
  "entryBarriers": {
    "capitalRequired": 2000000,
    "timeToMarket": "12-18 months",
    "regulatoryHurdles": ["City API access agreements", "Data privacy compliance"],
    "networkEffects": "Multi-sided: more cities → more firms → more cities"
  },
  "sources": [
    {
      "type": "report",
      "name": "IBISWorld Architecture Industry Report 2026",
      "date": "2026-01",
      "url": "https://www.ibisworld.com/..."
    },
    {
      "type": "interview",
      "name": "Customer interviews with 45 architecture firms",
      "date": "2026-03 to 2026-05"
    }
  ]
}
```

## Agent Instructions

### When to Generate
- During idea validation phase
- Before fundraising (Series A and beyond require strong market data)
- Annually to update market assumptions
- When entering new market segments

### How to Populate

1. **Size the market (TAM/SAM/SOM)**:
   - TAM: Total market if you had 100% share
   - SAM: Realistic addressable market given your product/geography
   - SOM: What you can realistically capture in 1/3/5 years
   - Use bottom-up (# customers × price) and top-down (market reports) methods
   - Show your work, cite sources

2. **Analyze dynamics**:
   - Growth rate from industry reports
   - Trends that help or hurt your business
   - Drivers should be structural, not temporary
   - Headwinds should be realistic, not ignored

3. **Profile customer base**:
   - Total addressable customer count
   - Segment by meaningful characteristics (size, industry, etc.)
   - Average deal size per segment
   - Buying power (budget authority)

4. **Map competition**:
   - Incumbents with existing market share
   - Well-funded startups in your space
   - Non-obvious substitutes (manual process, adjacent tools)
   - Be honest about threats

5. **Assess barriers**:
   - Capital needed to reach scale
   - Time to build and launch
   - Regulatory/legal hurdles
   - Network effects (if present)

6. **Document sources**:
   - Link to all reports, databases, surveys
   - Include customer interview count and dates
   - Market sizing requires credible sources

### What to Write

Write to strategy memory:
```
company.os.departments['strategy'].memory.marketResearch
```

### Events to Emit

```typescript
{
  type: 'market-research-updated',
  timestamp: Date.now(),
  payload: {
    tam: 2800000000,
    sam: 450000000,
    somYear5: 75000000,
    growthRate: 12.5
  }
}
```

### Notes

- Bottom-up and top-down market sizing should directionally align
- Be conservative on SOM, aggressive claims hurt credibility
- Growth rate should be from third-party sources, not aspirational
- Competition section should be comprehensive, missing competitors signals weak research
- Substitutes are often more dangerous than direct competitors
- Sources must be cited, "we estimate" is not credible
- Update annually, markets change faster than you think
