---
template: executive-briefing
used-by: [executives/ceo, executives/cto, executives/cfo, executives/cmo, executives/cpo, executives/coo]
produces: company.os.departments[{executive}].memory.briefing
---

## Purpose

Daily or weekly executive briefing template that surfaces key events, decisions, blockers, and metrics relevant to a specific executive role.

## Schema

```typescript
interface ExecutiveBriefing {
  executive: string;               // CEO | CTO | CFO | CMO | CPO | COO
  date: string;                    // ISO date
  frequency: "daily" | "weekly";
  
  snapshot: {
    [key: string]: {               // Role-specific metrics
      value: number;
      change: number;              // % change from last period
      status: "good" | "warning" | "critical";
    };
  };
  
  highlights: Array<{
    domain: string;                // Area relevant to this executive
    event: string;                 // What happened
    impact: string;                // Why it matters to this role
    actionable: boolean;           // Does this need executive action?
  }>;
  
  decisions: Array<{
    question: string;              // Decision needed
    context: string;               // Background
    options: string[];             // Available choices
    recommendation: string;        // What's recommended
    recommender: string;           // Who recommends
    deadline: string;              // When decision needed
    impact: "strategic" | "operational" | "tactical";
  }>;
  
  blockers: Array<{
    area: string;                  // Where it's blocked
    issue: string;                 // What's blocked
    owner: string;                 // Who owns it
    impact: "critical" | "high" | "medium";
    escalation: boolean;           // Needs executive intervention?
  }>;
  
  priorities: {
    today: string[];               // Daily: top 3 items
    thisWeek: string[];            // Weekly: top 5 items
    nextPeriod: string[];          // What's coming next
  };
  
  crossFunctional: Array<{
    topic: string;                 // Cross-department issue
    stakeholders: string[];        // Other execs involved
    status: string;                // Current state
    nextSteps: string;             // What needs to happen
  }>;
}
```

## Example

```json
{
  "executive": "CTO",
  "date": "2026-05-31",
  "frequency": "weekly",
  "snapshot": {
    "deploymentFrequency": {"value": 12, "change": 20, "status": "good"},
    "incidentCount": {"value": 2, "change": -33, "status": "good"},
    "techDebt": {"value": 23, "change": 15, "status": "warning"},
    "teamVelocity": {"value": 42, "change": -5, "status": "warning"}
  },
  "highlights": [
    {
      "domain": "Infrastructure",
      "event": "Migrated to managed Postgres, reduced DB costs by 40%",
      "impact": "Improves margins and reduces on-call burden",
      "actionable": false
    },
    {
      "domain": "Security",
      "event": "Failed SOC2 audit on access control policies",
      "impact": "Blocks 2 enterprise deals, need remediation plan",
      "actionable": true
    }
  ],
  "decisions": [
    {
      "question": "Adopt TypeScript across frontend codebase?",
      "context": "Team wants to migrate, estimate 3 weeks effort",
      "options": ["Migrate now", "Migrate incrementally", "Stay on JS"],
      "recommendation": "Migrate incrementally over 2 sprints",
      "recommender": "Engineering Lead",
      "deadline": "2026-06-07",
      "impact": "operational"
    }
  ],
  "blockers": [
    {
      "area": "Engineering",
      "issue": "Hiring pipeline empty, need 2 senior engineers",
      "owner": "Recruiting",
      "impact": "critical",
      "escalation": true
    }
  ],
  "priorities": {
    "thisWeek": [
      "Ship API v2 with rate limiting",
      "Resolve SOC2 audit findings",
      "Interview 3 engineering candidates"
    ],
    "nextPeriod": [
      "Plan Q3 infrastructure scaling",
      "Start mobile app architecture"
    ]
  },
  "crossFunctional": [
    {
      "topic": "Enterprise feature roadmap",
      "stakeholders": ["CPO", "CTO", "VP Sales"],
      "status": "Conflict between sales timeline and eng capacity",
      "nextSteps": "CEO to prioritize with CPO and CTO"
    }
  ]
}
```

## Agent Instructions

### When to Generate
- Daily: every morning for daily briefings
- Weekly: Monday morning for weekly briefings
- On-demand when executive requests status

### How to Populate

1. **Read company.os state**:
   - `company.os.snapshot` for metrics
   - `company.os.events` filtered by executive domain
   - `company.os.departments[related].memory` for relevant updates
   - `company.os.decisions` for pending decisions

2. **Filter by role**:
   - CEO: company-wide, strategic, cross-functional
   - CTO: engineering, infrastructure, security, technical debt
   - CFO: financial, runway, unit economics, fundraising
   - CMO: marketing, brand, demand gen, content
   - CPO: product, roadmap, user feedback, analytics
   - COO: operations, processes, efficiency, vendors

3. **Surface decisions**:
   - Only show decisions relevant to this executive's domain
   - Flag strategic decisions for CEO/C-level
   - Include clear options and recommendations

4. **Identify blockers**:
   - Escalate blockers that need executive intervention
   - Show cross-department blockers requiring coordination
   - Mark impact level honestly

5. **Set priorities**:
   - Pull from OKRs and roadmaps
   - Focus on items this executive can influence
   - Limit to actionable items

### What to Write

Write briefing to executive's memory:
```
company.os.departments['{executive}'].memory.briefing
```

### Events to Emit

```typescript
{
  type: 'executive-briefing-generated',
  timestamp: Date.now(),
  payload: {
    executive: 'CTO',
    date: '2026-05-31',
    decisionsCount: 1,
    blockersCount: 1,
    escalationsNeeded: 1
  }
}
```

### Notes

- Tailor content to executive's domain and decision authority
- Highlight cross-functional issues requiring coordination
- Keep metrics focused on what this executive can control
- Decisions should be filtered by relevance and impact level
- This is structured data, not a narrative document
