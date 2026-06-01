---
template: product-vision
used-by: [executives/ceo, executives/cpo, product/strategy]
produces: company.os.departments['product'].memory.vision
---

## Purpose

Product vision and strategy framework defining long-term product direction, principles, and roadmap philosophy.

## Schema

```typescript
interface ProductVision {
  lastUpdated: string;             // ISO date
  horizon: string;                 // "3-years" | "5-years"
  
  vision: {
    statement: string;             // Where the product is going
    why: string;                   // Why this vision matters
    impact: string;                // What changes in the world
    
    principles: Array<{
      principle: string;
      description: string;
      examples: string[];
      counterExamples: string[];   // What this is NOT
    }>;
    
    boundaries: {
      inScope: string[];           // What we will build
      outOfScope: string[];        // What we explicitly won't build
      maybeScope: string[];        // What we might build later
    };
  };
  
  user: {
    personas: Array<{
      name: string;
      role: string;
      jobsToBeDone: Array<{
        job: string;
        frequency: "daily" | "weekly" | "monthly" | "occasionally";
        importance: "critical" | "high" | "medium";
        satisfaction: "unsatisfied" | "somewhat" | "satisfied";
      }>;
      
      painPoints: Array<{
        pain: string;
        severity: "critical" | "major" | "minor";
        frequency: string;
        currentSolution: string;
        limitations: string[];
      }>;
      
      goals: string[];
      context: string;             // When/where/how they work
    }>;
    
    journey: Array<{
      stage: string;
      activities: string[];
      emotions: string;
      opportunities: string[];
    }>;
  };
  
  product: {
    current: {
      description: string;
      capabilities: string[];
      limitations: string[];
      differentiation: string;
    };
    
    evolution: Array<{
      phase: string;
      timeline: string;
      capabilities: string[];
      users: string;               // Who this unlocks
      business: string;            // Business impact
      dependencies: string[];
      risks: string[];
    }>;
    
    pillars: Array<{
      pillar: string;              // Core product pillar
      description: string;
      currentState: string;
      vision: string;
      initiatives: Array<{
        initiative: string;
        quarter: string;
        outcome: string;
      }>;
    }>;
  };
  
  strategy: {
    approach: string;              // PLG | Sales-led | Hybrid
    acquisition: string;           // How users discover/adopt
    activation: string;            // First value moment
    retention: string;             // What keeps them coming back
    expansion: string;             // How they grow with us
    
    competitive: {
      advantage: string;           // Sustainable competitive edge
      moats: Array<{
        moat: string;
        current: "weak" | "moderate" | "strong";
        target: "moderate" | "strong";
        plan: string;
      }>;
    };
    
    pricing: {
      philosophy: string;
      model: string;               // Seat-based | Usage | Tiered | etc.
      rationale: string;
      evolution: string;           // How pricing will change
    };
  };
  
  roadmap: {
    philosophy: string;            // How we prioritize
    
    themes: Array<{
      theme: string;
      rationale: string;
      duration: string;
      success: string;
    }>;
    
    bets: Array<{
      bet: string;                 // What we're betting on
      hypothesis: string;          // What we believe
      validate: string;            // How we'll know if right
      horizon: "now" | "next" | "later";
      confidence: number;          // 0-100%
      impact: "low" | "medium" | "high" | "transformative";
    }>;
    
    tradeoffs: Array<{
      choosing: string;            // What we're prioritizing
      over: string;                // What we're deprioritizing
      rationale: string;           // Why this tradeoff
      revisit: string;             // When to reconsider
    }>;
  };
  
  metrics: {
    northStar: {
      metric: string;              // The one metric that matters most
      why: string;                 // Why this metric
      current: number;
      target: number;
      timeline: string;
    };
    
    health: Array<{
      category: "acquisition" | "activation" | "engagement" | "retention" | "monetization";
      metric: string;
      current: number;
      target: number;
      threshold: number;           // Red line - below this is bad
    }>;
    
    leading: Array<{
      metric: string;              // Leading indicator
      predicts: string;            // What outcome it predicts
      target: number;
    }>;
  };
  
  risks: Array<{
    risk: string;
    category: "market" | "product" | "technical" | "competitive";
    probability: "low" | "medium" | "high";
    impact: "low" | "medium" | "high" | "existential";
    mitigation: string;
    monitoring: string;
  }>;
}
```

## Example

```json
{
  "lastUpdated": "2026-05-31",
  "horizon": "3-years",
  "vision": {
    "statement": "Make data collaboration as seamless as email - ubiquitous, reliable, and invisible infrastructure",
    "why": "Companies waste months building custom integrations for every partner relationship. This friction limits business velocity.",
    "impact": "Data flows freely between companies, partnerships launch in days not months, teams focus on value not plumbing",
    "principles": [
      {
        "principle": "API-first, always",
        "description": "Every feature is an API before it's a UI. Code over clicks.",
        "examples": ["Full API parity", "SDK in every language", "Webhooks for all events"],
        "counterExamples": ["UI-only features", "Manual CSV uploads", "One-off exports"]
      },
      {
        "principle": "Developer experience is product",
        "description": "Developers are our users. If docs are bad, product is bad.",
        "examples": ["Interactive docs", "5-line quickstart", "Excellent error messages"],
        "counterExamples": ["Auto-generated docs", "Complex setup", "Cryptic errors"]
      }
    ],
    "boundaries": {
      "inScope": ["Data sync", "Schema mapping", "Access control", "Audit logging", "Partner management"],
      "outOfScope": ["Business intelligence", "Data warehousing", "ETL for analytics", "Consumer apps"],
      "maybeScope": ["Data transformation", "Real-time streaming", "Mobile SDKs"]
    }
  },
  "user": {
    "personas": [
      {
        "name": "Dana the Data Engineer",
        "role": "Senior Data Engineer at B2B SaaS company",
        "jobsToBeDone": [
          {
            "job": "Integrate partner data feeds into our platform",
            "frequency": "monthly",
            "importance": "critical",
            "satisfaction": "unsatisfied"
          },
          {
            "job": "Maintain and debug existing partner integrations",
            "frequency": "weekly",
            "importance": "high",
            "satisfaction": "unsatisfied"
          }
        ],
        "painPoints": [
          {
            "pain": "Every partner integration requires custom code",
            "severity": "critical",
            "frequency": "Every new partnership",
            "currentSolution": "Build custom API integration from scratch",
            "limitations": ["Takes 2-3 months", "Ongoing maintenance burden", "Each one is different"]
          }
        ],
        "goals": ["Ship faster", "Reduce technical debt", "Enable self-service"],
        "context": "Works in 5-person data team, always backlogged, measured on delivery speed"
      }
    ]
  },
  "product": {
    "current": {
      "description": "API-first data sync platform for B2B data collaboration",
      "capabilities": ["Bidirectional sync", "Schema mapping", "RBAC", "Audit logs", "REST API"],
      "limitations": ["No real-time sync", "Limited transformations", "No mobile SDK"],
      "differentiation": "API-first, developer experience, speed to value"
    },
    "evolution": [
      {
        "phase": "Phase 1: Core Platform (Now)",
        "timeline": "2026 Q1-Q2",
        "capabilities": ["Reliable sync", "Enterprise auth", "Audit/compliance"],
        "users": "Mid-market data teams",
        "business": "Prove PMF, reach $1M ARR",
        "dependencies": [],
        "risks": ["Scaling reliability", "Enterprise sales motion"]
      },
      {
        "phase": "Phase 2: Developer Platform (Next)",
        "timeline": "2026 Q3-Q4",
        "capabilities": ["Webhooks", "Real-time sync", "Custom transformations", "Marketplace"],
        "users": "Expand to product engineers",
        "business": "10x TAM, network effects",
        "dependencies": ["Phase 1 stability", "Developer community"],
        "risks": ["Marketplace chicken-egg", "Complexity creep"]
      },
      {
        "phase": "Phase 3: Embedded Platform (Later)",
        "timeline": "2027+",
        "capabilities": ["White-label", "Embedded UI", "Partner portal"],
        "users": "Enable our customers to enable their customers",
        "business": "Viral growth, winner-take-most",
        "dependencies": ["Developer ecosystem", "Strong brand"],
        "risks": ["Product becomes too horizontal"]
      }
    ],
    "pillars": [
      {
        "pillar": "Reliability",
        "description": "Data sync that just works, 99.9%+ uptime",
        "currentState": "Good but not great - 99.5% uptime, some sync failures",
        "vision": "Infrastructure-grade reliability. Set it and forget it.",
        "initiatives": [
          {"initiative": "Implement retry logic with exponential backoff", "quarter": "2026-Q2", "outcome": "99.9% sync success rate"},
          {"initiative": "Add circuit breakers for failing endpoints", "quarter": "2026-Q3", "outcome": "Graceful degradation"}
        ]
      }
    ]
  },
  "strategy": {
    "approach": "Product-led growth with sales assist",
    "acquisition": "Developer-first: great docs, free tier, open-source examples",
    "activation": "First successful sync in <1 hour",
    "retention": "Becomes critical infrastructure - they can't leave",
    "expansion": "Start with one use case, expand to more partners/data sources",
    "competitive": {
      "advantage": "Developer experience + speed to value",
      "moats": [
        {
          "moat": "Network effects via partner connectors",
          "current": "weak",
          "target": "strong",
          "plan": "Build connector marketplace, incentivize community contributions"
        }
      ]
    }
  },
  "roadmap": {
    "philosophy": "Ship small, validate fast, kill what doesn't work",
    "bets": [
      {
        "bet": "Developers will adopt us bottom-up via free tier",
        "hypothesis": "Great DX + free tier = organic adoption without sales",
        "validate": "50 teams using free tier with <$1k marketing spend",
        "horizon": "now",
        "confidence": 70,
        "impact": "transformative"
      }
    ],
    "tradeoffs": [
      {
        "choosing": "Developer experience and API quality",
        "over": "UI features and no-code tools",
        "rationale": "Our buyers are technical. Win developers first, expand later.",
        "revisit": "When we expand to less technical personas in Phase 2"
      }
    ]
  },
  "metrics": {
    "northStar": {
      "metric": "Weekly Active Syncs",
      "why": "Measures actual usage and value delivery",
      "current": 1200,
      "target": 10000,
      "timeline": "12 months"
    },
    "health": [
      {
        "category": "activation",
        "metric": "Time to first successful sync",
        "current": 3.2,
        "target": 1.0,
        "threshold": 6.0
      }
    ]
  },
  "risks": [
    {
      "risk": "Large incumbent enters market with similar offering",
      "category": "competitive",
      "probability": "medium",
      "impact": "high",
      "mitigation": "Build strong developer community and switching costs via integrations",
      "monitoring": "Track competitor product releases and features"
    }
  ]
}
```

## Agent Instructions

### When to Generate
- During initial product strategy
- Annually for vision review
- Before major pivots or expansions
- When product-market fit changes

### How to Populate

1. **Read company.os state**:
   - Strategic plan from strategy department
   - Customer feedback from product/sales
   - Usage data from analytics
   - Competitive intelligence

2. **Define vision**:
   - Articulate 3-5 year product destination
   - Connect to company mission and strategy
   - Set clear product principles
   - Define boundaries (what you won't build)

3. **Understand users**:
   - Build detailed personas from customer data
   - Map jobs-to-be-done and pain points
   - Understand user journey and context
   - Identify unmet needs and opportunities

4. **Plan evolution**:
   - Define product phases (now/next/later)
   - Show how capabilities build on each other
   - Connect phases to business outcomes
   - Identify dependencies and risks

5. **Set strategy**:
   - Choose GTM approach (PLG vs sales-led)
   - Define acquisition through expansion
   - Identify sustainable competitive moats
   - Plan pricing evolution

6. **Build roadmap philosophy**:
   - Set clear prioritization framework
   - Define strategic themes
   - Make explicit bets and tradeoffs
   - Show what you're NOT doing and why

7. **Define metrics**:
   - Choose North Star metric
   - Set health metrics by category
   - Identify leading indicators
   - Set targets and thresholds

### What to Write

Write vision to product memory:
```
company.os.departments['product'].memory.vision
```

Share key elements with strategy:
```
company.os.departments['strategy'].memory.productStrategy
```

### Events to Emit

```typescript
{
  type: 'product-vision-updated',
  timestamp: Date.now(),
  payload: {
    northStar: 'Weekly Active Syncs',
    phases: ['Core Platform', 'Developer Platform', 'Embedded Platform'],
    majorChanges: ['Shifted from UI-first to API-first']
  }
}
```

### Notes

- Good product vision is opinionated about what NOT to build
- Principles should guide daily product decisions
- Personas should be based on real customer data, not assumptions
- Product evolution should ladder up to business strategy
- Bets should be explicit and testable
- Tradeoffs make strategy real - what are you choosing?
- North Star metric should tie to user value, not vanity
- This is structured data for product direction, not a narrative document
