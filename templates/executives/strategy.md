---
template: strategic-planning
used-by: [executives/ceo, executives/cpo, strategy/*]
produces: company.os.departments['strategy'].memory.strategicPlan
---

## Purpose

Strategic planning framework that defines company direction, priorities, and resource allocation over 1-3 year horizons.

## Schema

```typescript
interface StrategicPlan {
  period: string;                  // "2026-2027" or "2026-H2"
  lastUpdated: string;             // ISO date
  
  situation: {
    mission: string;               // Why we exist
    vision: string;                // Where we're going (3-5 years)
    currentState: {
      stage: "idea" | "validation" | "traction" | "growth" | "scale";
      revenue: number;
      customers: number;
      team: number;
      runway: number;
      marketPosition: string;
    };
    
    strengths: string[];           // What we're good at
    weaknesses: string[];          // What we need to improve
    opportunities: string[];       // Market opportunities
    threats: string[];             // Risks and challenges
  };
  
  strategic: {
    northStar: string;             // Single metric that matters most
    
    objectives: Array<{
      id: string;
      objective: string;           // What we want to achieve
      horizon: "6-months" | "12-months" | "24-months" | "36-months";
      rationale: string;           // Why this matters
      success: string;             // What success looks like
      owner: string;               // Who owns delivery
      dependencies: string[];      // What must happen first
    }>;
    
    themes: Array<{
      theme: string;               // Product | GTM | Team | etc.
      focus: string;               // What we're focusing on
      notFocusing: string[];       // What we're explicitly NOT doing
      allocation: number;          // % of resources
    }>;
  };
  
  market: {
    tam: number;                   // Total addressable market
    sam: number;                   // Serviceable addressable market
    som: number;                   // Serviceable obtainable market
    
    segments: Array<{
      segment: string;
      size: number;
      priority: "primary" | "secondary" | "future";
      characteristics: string;
      painPoints: string[];
      competitors: string[];
    }>;
    
    positioning: {
      category: string;            // What category we compete in
      differentiation: string;     // What makes us different
      targetCustomer: string;      // Who we serve
      value: string;               // Value we deliver
    };
  };
  
  execution: {
    priorities: Array<{
      priority: string;
      quarter: string;
      initiatives: string[];
      metrics: Array<{
        metric: string;
        target: number;
        current: number;
      }>;
    }>;
    
    resourceAllocation: {
      engineering: number;         // % of resources
      product: number;
      sales: number;
      marketing: number;
      operations: number;
    };
    
    gates: Array<{
      milestone: string;
      date: string;
      criteria: string[];
      decision: string;            // What happens if we hit/miss
    }>;
  };
  
  risks: Array<{
    risk: string;
    probability: "low" | "medium" | "high";
    impact: "low" | "medium" | "high" | "existential";
    mitigation: string;
    owner: string;
    monitoring: string;            // How we track this risk
  }>;
  
  alternatives: Array<{
    scenario: string;              // "If X happens, then Y"
    trigger: string;               // What would cause this
    pivot: string;                 // How we'd respond
    timeline: string;              // When we'd decide
  }>;
}
```

## Example

```json
{
  "period": "2026-2027",
  "lastUpdated": "2026-05-31",
  "situation": {
    "mission": "Make data collaboration as easy as email",
    "vision": "Standard way teams share and work with data across companies",
    "currentState": {
      "stage": "traction",
      "revenue": 50000,
      "customers": 25,
      "team": 8,
      "runway": 14,
      "marketPosition": "Emerging player in data collaboration space"
    },
    "strengths": [
      "Strong product-market fit with data teams",
      "Fast iteration cycle",
      "Technical depth in distributed systems"
    ],
    "weaknesses": [
      "Small team limits execution capacity",
      "Limited sales/marketing capabilities",
      "Early brand awareness"
    ],
    "opportunities": [
      "Enterprise segment shows strong demand",
      "API-first products gaining traction",
      "Compliance becoming urgent for customers"
    ],
    "threats": [
      "Large incumbents entering space",
      "Macro environment slowing enterprise spend",
      "Talent competition in tight market"
    ]
  },
  "strategic": {
    "northStar": "Weekly active data collaborations",
    "objectives": [
      {
        "id": "obj-2026-01",
        "objective": "Achieve product-market fit in enterprise segment",
        "horizon": "12-months",
        "rationale": "Enterprise shows better retention, expansion, and economics than SMB",
        "success": "10 enterprise customers, <2% churn, >120% NRR, repeatable sales motion",
        "owner": "CEO",
        "dependencies": ["Ship enterprise features", "Build enterprise sales motion"]
      },
      {
        "id": "obj-2026-02",
        "objective": "Scale to $1M ARR",
        "horizon": "12-months",
        "rationale": "Demonstrates traction for Series A fundraise",
        "success": "$1M ARR, efficient growth (CAC payback <12mo), healthy unit economics",
        "owner": "CEO",
        "dependencies": ["obj-2026-01"]
      }
    ],
    "themes": [
      {
        "theme": "Product",
        "focus": "Enterprise features (SSO, RBAC, audit logs, compliance)",
        "notFocusing": ["Consumer features", "Mobile apps", "New product lines"],
        "allocation": 60
      },
      {
        "theme": "Go-to-Market",
        "focus": "Direct enterprise sales, product-led growth for SMB",
        "notFocusing": ["Channel partnerships", "Resellers", "Outbound at scale"],
        "allocation": 30
      },
      {
        "theme": "Team",
        "focus": "Engineering hiring, sales leader",
        "notFocusing": ["Marketing team", "Ops roles", "Executive hires"],
        "allocation": 10
      }
    ]
  },
  "execution": {
    "priorities": [
      {
        "priority": "Ship enterprise platform",
        "quarter": "2026-Q2",
        "initiatives": ["SSO/RBAC", "Audit logs", "Advanced permissions"],
        "metrics": [
          {"metric": "Features shipped", "target": 3, "current": 2}
        ]
      }
    ],
    "resourceAllocation": {
      "engineering": 60,
      "product": 15,
      "sales": 15,
      "marketing": 5,
      "operations": 5
    },
    "gates": [
      {
        "milestone": "$100k MRR",
        "date": "2026-09-30",
        "criteria": [">5 enterprise customers", "<3% churn", "Repeatable sales"],
        "decision": "If hit: start Series A. If miss: extend runway, revisit strategy"
      }
    ]
  },
  "risks": [
    {
      "risk": "Engineering capacity limits execution",
      "probability": "high",
      "impact": "high",
      "mitigation": "Hire 2 senior engineers, use contractors for bridge",
      "owner": "CTO",
      "monitoring": "Weekly velocity tracking"
    }
  ],
  "alternatives": [
    {
      "scenario": "If enterprise sales don't scale by Q3",
      "trigger": "<5 enterprise deals closed by Sept 30",
      "pivot": "Focus on PLG with SMB, lower burn, extend runway",
      "timeline": "Decide by October 2026"
    }
  ]
}
```

## Agent Instructions

### When to Generate
- Annually for long-term strategic planning
- Quarterly for strategic review and adjustment
- When major market/company changes occur
- Before board meetings or fundraising

### How to Populate

1. **Assess current situation**:
   - Read `company.os.snapshot` for current state
   - Pull financial data from finance department
   - Review market research from strategy department
   - Conduct SWOT analysis

2. **Define strategic direction**:
   - Set clear North Star metric
   - Define 2-4 major objectives with 12-24 month horizons
   - Choose strategic themes (what to focus on)
   - Explicitly state what you're NOT doing

3. **Analyze market**:
   - Calculate TAM/SAM/SOM from research
   - Segment market by priority
   - Define positioning and differentiation
   - Identify key competitors

4. **Plan execution**:
   - Break objectives into quarterly priorities
   - Allocate resources across functions
   - Set decision gates with clear criteria
   - Define success metrics

5. **Assess risks**:
   - Identify existential and high-impact risks
   - Define mitigation strategies
   - Assign risk owners
   - Create monitoring plan

6. **Prepare alternatives**:
   - Define pivots for key scenarios
   - Set triggers that would activate pivot
   - Clarify decision timeline

### What to Write

Write strategic plan to strategy memory:
```
company.os.departments['strategy'].memory.strategicPlan
```

Share key elements to executive memory:
```
company.os.departments['ceo'].memory.strategy
```

### Events to Emit

```typescript
{
  type: 'strategic-plan-updated',
  timestamp: Date.now(),
  payload: {
    period: '2026-2027',
    northStar: 'Weekly active data collaborations',
    objectives: 2,
    majorChanges: ['Pivoted to enterprise focus']
  }
}
```

### Notes

- Strategy should be clear enough to guide daily decisions
- Good strategy includes what NOT to do
- Resource allocation should match strategic themes
- Decision gates prevent sunk cost fallacy
- Risks should include mitigations, not just problems
- Alternative scenarios prepare for uncertainty
- This is structured data for company direction, not a narrative document
