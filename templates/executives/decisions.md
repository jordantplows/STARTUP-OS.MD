---
template: decision-routing
used-by: [executives/ceo, executives/cto, executives/cfo, executives/cmo, executives/cpo, executives/coo]
produces: company.os.decisions[*]
---

## Purpose

Decision routing and tracking system that captures decisions, assigns them to the right owner, tracks resolution, and documents outcomes.

## Schema

```typescript
interface DecisionRouting {
  decisions: Array<{
    id: string;                    // Unique ID: "dec-2026-05-31-001"
    title: string;                 // Brief decision question
    description: string;           // Full context
    
    classification: {
      type: "strategic" | "operational" | "tactical";
      domain: string;              // Product | Engineering | Sales | etc.
      reversible: boolean;         // Can we undo this later?
      impact: "company" | "department" | "team";
      urgency: "immediate" | "this-week" | "this-month" | "this-quarter";
    };
    
    context: {
      background: string;          // Why is this decision needed now?
      constraints: string[];       // What limits our options?
      assumptions: string[];       // What are we assuming?
      dependencies: string[];      // What depends on this?
    };
    
    options: Array<{
      option: string;              // The choice
      pros: string[];              // Benefits
      cons: string[];              // Drawbacks
      cost: {                      // Resource requirements
        time: string;
        money: number;
        people: number;
      };
      risk: "low" | "medium" | "high";
    }>;
    
    recommendation: {
      choice: string;              // Recommended option
      rationale: string;           // Why this choice
      recommender: string;         // Who recommends
      confidence: number;          // 0-100%
    };
    
    routing: {
      owner: string;               // Who decides (CEO, CTO, etc.)
      consultWith: string[];       // Who should be consulted
      informWhen: string[];        // Who needs to know after
      escalationPath: string[];    // If owner can't decide
      deadline: string;            // ISO date
    };
    
    resolution: {
      decided: boolean;
      decisionMade: string;        // Which option chosen
      decisionDate: string;        // ISO date
      decisionRationale: string;   // Why this was chosen
      nextSteps: string[];         // What happens now
    };
    
    tracking: {
      status: "pending" | "in-review" | "decided" | "implemented" | "revisit";
      createdAt: string;           // ISO date
      updatedAt: string;           // ISO date
      revisitDate?: string;        // ISO date (if we should check back)
    };
  }>;
}
```

## Example

```json
{
  "decisions": [
    {
      "id": "dec-2026-05-31-001",
      "title": "Hire 2 senior engineers now or delay Q3 roadmap?",
      "description": "Engineering at capacity, sales has $120k ARR blocked on features",
      "classification": {
        "type": "strategic",
        "domain": "Engineering",
        "reversible": false,
        "impact": "company",
        "urgency": "this-week"
      },
      "context": {
        "background": "Sales pipeline has 3 deals worth $120k ARR blocked on features. Engineering team at max capacity. Hiring takes 8-10 weeks.",
        "constraints": [
          "14 months runway limits hiring budget",
          "Current team working at 100% capacity",
          "Q3 roadmap committed to existing customers"
        ],
        "assumptions": [
          "Senior engineers can ramp in 4-6 weeks",
          "Deals will wait 2-3 months max",
          "Current team velocity won't increase"
        ],
        "dependencies": [
          "Q3 revenue targets depend on closing these deals",
          "Runway calculation assumes current burn rate"
        ]
      },
      "options": [
        {
          "option": "Hire 2 senior engineers immediately",
          "pros": [
            "Unblocks $120k ARR in pipeline",
            "Maintains Q3 roadmap commitments",
            "Builds long-term capacity"
          ],
          "cons": [
            "Increases burn by $40k/month",
            "Reduces runway from 14 to 12 months",
            "8-10 week hiring process"
          ],
          "cost": {"time": "8-10 weeks", "money": 40000, "people": 2},
          "risk": "medium"
        },
        {
          "option": "Push roadmap by 2 months, no hiring",
          "pros": [
            "Preserves runway",
            "No hiring risk",
            "Team stays focused"
          ],
          "cons": [
            "May lose $120k ARR deals",
            "Damages customer relationships",
            "Sales team demoralized"
          ],
          "cost": {"time": "0 weeks", "money": 0, "people": 0},
          "risk": "high"
        },
        {
          "option": "Hire 2 engineers + 1 contractor for bridge",
          "pros": [
            "Contractor can start immediately",
            "Full-time hires for long-term",
            "Maintains most of roadmap"
          ],
          "cons": [
            "Contractors cost more per hour",
            "Increases complexity",
            "Still need to hire 2 FTEs"
          ],
          "cost": {"time": "2 weeks + 8 weeks", "money": 55000, "people": 3},
          "risk": "medium"
        }
      ],
      "recommendation": {
        "choice": "Hire 2 engineers + 1 contractor for bridge",
        "rationale": "Balances immediate capacity (contractor) with long-term growth (FTEs). $120k ARR justifies increased burn. Contractor mitigates hiring timeline risk.",
        "recommender": "CTO",
        "confidence": 75
      },
      "routing": {
        "owner": "CEO",
        "consultWith": ["CFO", "CTO", "VP Sales"],
        "informWhen": ["Engineering Team", "Sales Team", "Board"],
        "escalationPath": ["Board"],
        "deadline": "2026-06-07"
      },
      "resolution": {
        "decided": false,
        "decisionMade": "",
        "decisionDate": "",
        "decisionRationale": "",
        "nextSteps": []
      },
      "tracking": {
        "status": "pending",
        "createdAt": "2026-05-31",
        "updatedAt": "2026-05-31"
      }
    }
  ]
}
```

## Agent Instructions

### When to Generate
- When a blocker requires executive decision
- When departments surface conflicting priorities
- When resource allocation decisions are needed
- On-demand for decision tracking

### How to Populate

1. **Capture decision context**:
   - Read from `company.os.departments[*].blockers`
   - Extract conflicting priorities from roadmaps
   - Identify resource constraints from finance data

2. **Classify decision**:
   - Strategic: affects company direction (CEO decides)
   - Operational: affects department execution (C-level decides)
   - Tactical: affects team work (manager decides)
   - Route based on impact and reversibility

3. **Structure options**:
   - Generate 2-4 realistic options
   - Include "do nothing" if viable
   - Calculate costs from finance model
   - Assess risks honestly

4. **Route to owner**:
   - CEO: strategic, cross-department, irreversible
   - CTO: technical architecture, engineering capacity
   - CFO: budget allocation, financial strategy
   - CPO: product direction, feature prioritization
   - CMO: brand, positioning, channel strategy
   - COO: operations, processes, vendor decisions

5. **Track resolution**:
   - Update status as decision progresses
   - Document decision and rationale
   - Convert to action items when decided
   - Set revisit date if needed

### What to Write

Write decisions to global decision queue:
```
company.os.decisions.push(decision)
```

Update executive memory with pending decisions:
```
company.os.departments['{executive}'].memory.pendingDecisions
```

### Events to Emit

When decision created:
```typescript
{
  type: 'decision-created',
  timestamp: Date.now(),
  payload: {
    decisionId: 'dec-2026-05-31-001',
    owner: 'CEO',
    urgency: 'this-week',
    type: 'strategic'
  }
}
```

When decision resolved:
```typescript
{
  type: 'decision-resolved',
  timestamp: Date.now(),
  payload: {
    decisionId: 'dec-2026-05-31-001',
    decision: 'Hire 2 engineers + 1 contractor',
    owner: 'CEO',
    nextSteps: ['Post job descriptions', 'Engage recruiting firm']
  }
}
```

### Notes

- Good decisions need good options - generate realistic alternatives
- Include "do nothing" as an option when viable
- Document assumptions explicitly so they can be validated
- Reversible decisions can be made faster and lower
- Route decisions to the lowest level that can make them
- Track decision outcomes to improve future decision-making
- This is structured data for routing, not a narrative document
