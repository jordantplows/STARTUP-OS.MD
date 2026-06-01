---
template: competitor-analysis
used-by: [departments/strategy, departments/product, departments/sales]
produces: company.os.departments['strategy'].memory.competitorAnalysis
---

## Purpose

Competitive positioning matrix analyzing direct competitors, substitutes, strengths, weaknesses, and differentiation strategy.

## Schema

```typescript
interface CompetitorAnalysis {
  lastUpdated: string;
  
  positioning: {
    yourPosition: string;          // How you position vs competition
    keyDifferentiators: string[];  // Top 3 things that set you apart
    targetSegment: string;         // Segment where you're strongest
  };
  
  directCompetitors: Array<{
    name: string;
    url: string;
    stage: "public" | "growth" | "startup" | "seed";
    funding: number;
    employees: number;
    
    product: {
      description: string;
      keyFeatures: string[];
      pricing: {
        model: string;
        startingPrice: number;
      };
      targetCustomer: string;
    };
    
    goToMarket: {
      channels: string[];
      salesMotion: "self-serve" | "sales-assisted" | "enterprise";
      marketingFocus: string[];
    };
    
    strengths: string[];
    weaknesses: string[];
    
    positioning: string;           // How they position themselves
    recentActivity: Array<{
      date: string;
      event: string;               // Funding, launch, acquisition
    }>;
    
    threat: "critical" | "high" | "medium" | "low";
    threatReasoning: string;
  }>;
  
  indirectCompetitors: Array<{
    name: string;
    category: string;              // What category they're in
    overlap: string;               // Where you compete
    threat: "high" | "medium" | "low";
  }>;
  
  substitutes: Array<{
    alternative: string;           // What customers do instead
    prevalence: "common" | "uncommon";
    costToCustomer: string;        // Time/money cost
    whyChooseYou: string;          // Why your solution is better
  }>;
  
  competitiveMatrix: {
    dimensions: string[];          // Features/attributes to compare
    matrix: Array<{
      company: string;
      scores: Record<string, number>; // dimension → score (1-5)
    }>;
  };
  
  marketGaps: Array<{
    gap: string;                   // Unmet need or underserved segment
    opportunity: string;           // Why this is an opening
    yourAdvantage: string;         // Why you can fill it
  }>;
}
```

## Example

```json
{
  "lastUpdated": "2026-05-31",
  "positioning": {
    "yourPosition": "Only permit platform with deep CAD integration and city API connections",
    "keyDifferentiators": [
      "Auto-extract specs from CAD, no manual data entry",
      "Pre-submission code validation catches errors instantly",
      "Direct API to planning departments in 8 cities"
    ],
    "targetSegment": "Small-to-mid architecture firms in tech-forward cities"
  },
  "directCompetitors": [
    {
      "name": "PermitFlow",
      "url": "https://permitflow.com",
      "stage": "startup",
      "funding": 5000000,
      "employees": 15,
      "product": {
        "description": "Concierge service for permit submissions",
        "keyFeatures": [
          "Dedicated permit coordinator per firm",
          "Manual submission handling",
          "Status tracking dashboard"
        ],
        "pricing": {
          "model": "Per submission fee",
          "startingPrice": 299
        },
        "targetCustomer": "Small firms without in-house permit expertise"
      },
      "goToMarket": {
        "channels": ["Content marketing", "Trade shows", "Referrals"],
        "salesMotion": "sales-assisted",
        "marketingFocus": ["SEO", "Architect community"]
      },
      "strengths": [
        "Strong brand in architect community",
        "Handles all cities (manual process)",
        "High-touch service model"
      ],
      "weaknesses": [
        "Manual process doesn't scale",
        "No CAD integration",
        "Higher cost than software-only solution",
        "Slow (still takes days)"
      ],
      "positioning": "White-glove permit service for busy architects",
      "recentActivity": [
        {
          "date": "2026-03",
          "event": "$5M Series A from Founders Fund"
        }
      ],
      "threat": "medium",
      "threatReasoning": "Strong brand but manual model won't scale, we're faster and cheaper"
    },
    {
      "name": "CityGrows",
      "url": "https://citygrows.com",
      "stage": "startup",
      "funding": 2000000,
      "employees": 8,
      "product": {
        "description": "Workflow automation for government processes",
        "keyFeatures": [
          "Digital forms and workflows",
          "Citizen-facing portal",
          "Government admin dashboard"
        ],
        "pricing": {
          "model": "Per-government licensing",
          "startingPrice": 5000
        },
        "targetCustomer": "City governments, not firms"
      },
      "goToMarket": {
        "channels": ["Government sales", "Conferences"],
        "salesMotion": "enterprise",
        "marketingFocus": ["Government tech"]
      },
      "strengths": [
        "Relationships with cities",
        "Multi-process platform (not just permits)"
      ],
      "weaknesses": [
        "Sells to governments, not firms",
        "No CAD integration",
        "Long sales cycles"
      ],
      "positioning": "Digital government platform for citizen services",
      "recentActivity": [],
      "threat": "low",
      "threatReasoning": "Different target customer (gov not firms), not a direct competitor"
    }
  ],
  "indirectCompetitors": [
    {
      "name": "Autodesk BIM 360",
      "category": "BIM/project management",
      "overlap": "Architecture firms already use for design/collaboration",
      "threat": "high"
    }
  ],
  "substitutes": [
    {
      "alternative": "Hire junior architect to manually fill forms",
      "prevalence": "common",
      "costToCustomer": "20 hours/week @ $50/hr = $4k/month",
      "whyChooseYou": "We're $500/month and save 18 hours/week, 8x ROI"
    },
    {
      "alternative": "Pay permit expediter consultant",
      "prevalence": "common",
      "costToCustomer": "$3-5k per submission",
      "whyChooseYou": "We're $500/month flat rate, unlimited submissions"
    }
  ],
  "competitiveMatrix": {
    "dimensions": ["CAD Integration", "Code Validation", "City APIs", "Price", "Speed"],
    "matrix": [
      {
        "company": "Us",
        "scores": {"CAD Integration": 5, "Code Validation": 5, "City APIs": 5, "Price": 4, "Speed": 5}
      },
      {
        "company": "PermitFlow",
        "scores": {"CAD Integration": 1, "Code Validation": 2, "City APIs": 1, "Price": 3, "Speed": 2}
      },
      {
        "company": "Manual Process",
        "scores": {"CAD Integration": 1, "Code Validation": 1, "City APIs": 1, "Price": 1, "Speed": 1}
      }
    ]
  },
  "marketGaps": [
    {
      "gap": "No one has deep CAD integration for permit automation",
      "opportunity": "Every architecture firm uses CAD, manual data entry is their biggest pain",
      "yourAdvantage": "We have CAD integration IP from founder's previous company"
    },
    {
      "gap": "Incumbents sell to governments, not firms",
      "opportunity": "Firms are the end users and feel the pain directly",
      "yourAdvantage": "Product-led growth to firms, no government sales cycles"
    }
  ]
}
```

## Agent Instructions

### When to Generate
- At company inception
- Before major product decisions
- Before fundraising
- Quarterly competitive review
- When new competitor launches

### How to Populate

1. **Identify competitors**:
   - Direct: Same problem, same customer, similar solution
   - Indirect: Adjacent space, could expand into your market
   - Substitutes: What customers do today instead of using software

2. **Research each competitor**:
   - Product features from their website/demos
   - Pricing from public info or sales calls
   - Funding from Crunchbase, PitchBook
   - Employees from LinkedIn
   - Marketing channels from SimilarWeb, ad libraries

3. **Analyze positioning**:
   - How they describe themselves (homepage headline)
   - Target customer (small vs enterprise, industry)
   - Key differentiators they claim
   - Where they're strongest vs weakest

4. **Build competitive matrix**:
   - Pick 5-7 dimensions customers care about
   - Score 1-5 on each dimension (be honest)
   - Include yourself and top 3-4 competitors
   - Visual matrix helps sales and product teams

5. **Identify market gaps**:
   - Where no one is serving customer needs
   - Underserved segments or use cases
   - Why you're positioned to fill the gap

6. **Assess threats**:
   - Critical: Well-funded, strong product, same market
   - High: Could pivot into your space, has resources
   - Medium: Competes but has weaknesses
   - Low: Different customer or weak product

### What to Write

Write to strategy memory:
```
company.os.departments['strategy'].memory.competitorAnalysis
```

Also write a sales-friendly version:
```
company.os.departments['sales'].memory.competitiveBattleCards
```

### Events to Emit

```typescript
{
  type: 'competitor-analysis-updated',
  timestamp: Date.now(),
  payload: {
    directCompetitors: 2,
    indirectCompetitors: 1,
    criticalThreats: 0,
    highThreats: 1
  }
}
```

When a new competitor launches:
```typescript
{
  type: 'new-competitor-detected',
  timestamp: Date.now(),
  payload: {
    name: 'PermitFlow',
    threat: 'medium',
    funding: 5000000
  }
}
```

### Notes

- Be honest about competitor strengths, don't dismiss them
- Update quarterly, competitive landscape changes fast
- Include recent activity (funding, launches, acquisitions)
- Threat assessment should be realistic, not paranoid
- Sales team needs this for objection handling
- Product team needs this for roadmap prioritization
- Substitutes (manual process) are often underestimated
- Matrix dimensions should be what customers actually care about
- Market gaps are your strategic opportunity
