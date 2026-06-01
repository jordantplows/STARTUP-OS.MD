---
template: ceo-briefing
used-by: [executives/ceo]
produces: company.os.departments['ceo'].memory.weeklyBriefing
---

## Purpose

Weekly executive briefing that summarizes company state, key decisions, blockers, and priorities for the CEO.

## Schema

```typescript
interface CEOBriefing {
  week: string;                    // ISO week: "2026-W22"
  date: string;                    // ISO date: "2026-05-31"
  
  snapshot: {
    revenue: number;               // Current MRR or ARR
    runway: number;                // Months remaining
    customers: number;             // Active customer count
    team: number;                  // Current headcount
    burn: number;                  // Monthly burn rate
  };
  
  highlights: Array<{
    area: string;                  // Product | Sales | Team | Finance
    event: string;                 // What happened
    impact: string;                // Why it matters
  }>;
  
  blockers: Array<{
    issue: string;                 // What's blocked
    owner: string;                 // Who owns it
    impact: "critical" | "high" | "medium";
    needsDecision: boolean;        // CEO needs to decide?
  }>;
  
  decisions: Array<{
    question: string;              // Decision needed
    context: string;               // Why now
    options: string[];             // Choices available
    recommendation: string;        // What's recommended
    deadline: string;              // When decision needed
  }>;
  
  priorities: {
    thisWeek: string[];            // Top 3-5 priorities
    nextWeek: string[];            // What's coming
  };
  
  metrics: {
    [key: string]: {
      current: number;
      target: number;
      trend: "up" | "down" | "flat";
    };
  };
}
```

## Example

```json
{
  "week": "2026-W22",
  "date": "2026-05-31",
  "snapshot": {
    "revenue": 45000,
    "runway": 14,
    "customers": 23,
    "team": 8,
    "burn": 85000
  },
  "highlights": [
    {
      "area": "Sales",
      "event": "Closed $15k ARR enterprise deal with Acme Corp",
      "impact": "First enterprise customer, validates upmarket positioning"
    },
    {
      "area": "Product",
      "event": "Launched SSO feature",
      "impact": "Unblocks 3 deals worth $40k ARR in pipeline"
    }
  ],
  "blockers": [
    {
      "issue": "Engineering capacity at max, sales asking for 3 new features",
      "owner": "CTO",
      "impact": "critical",
      "needsDecision": true
    }
  ],
  "decisions": [
    {
      "question": "Hire 2 engineers now or push feature roadmap by 2 months?",
      "context": "Sales has $120k ARR blocked on features, but hiring takes 8 weeks",
      "options": ["Hire now", "Delay features", "Hire contractors"],
      "recommendation": "Hire now + 1 contractor for bridge",
      "deadline": "2026-06-07"
    }
  ],
  "priorities": {
    "thisWeek": [
      "Close $20k deal with Beta Industries",
      "Ship API rate limiting (security blocker)",
      "Make hiring decision on 2 eng roles"
    ],
    "nextWeek": [
      "Board deck prep for Q2 review",
      "Launch outbound sales campaign"
    ]
  },
  "metrics": {
    "mrr": {"current": 45000, "target": 50000, "trend": "up"},
    "churn": {"current": 3.2, "target": 2.0, "trend": "flat"},
    "pipeline": {"current": 180000, "target": 200000, "trend": "up"}
  }
}
```

## Agent Instructions

### When to Generate
- Every Monday morning
- On-demand when user requests status

### How to Populate

1. **Read company.os state**:
   - `company.os.snapshot` for current metrics
   - `company.os.events` from past 7 days
   - `company.os.departments[*].memory` for department updates
   - `company.os.departments[*].blockers` for active blockers

2. **Synthesize highlights**:
   - Extract significant events from past week
   - Filter for CEO-level relevance (revenue, team, major milestones)
   - Include impact statement showing business consequence

3. **Identify blockers**:
   - Scan all department blockers
   - Elevate only critical/high impact items
   - Mark `needsDecision: true` if CEO action required

4. **Surface decisions**:
   - Look for open questions in department memory
   - Check for timeline conflicts or resource constraints
   - Format as clear choice with recommendation

5. **Set priorities**:
   - Pull from product roadmap, sales pipeline, and team OKRs
   - Limit to 3-5 items per week
   - Focus on revenue-critical and team-critical items

6. **Calculate metrics**:
   - Pull from finance memory for revenue/burn/runway
   - Pull from sales CRM for pipeline and churn
   - Compare to targets set in OKRs

### What to Write

Write the completed briefing to:
```
company.os.departments['ceo'].memory.weeklyBriefing
```

### Events to Emit

```typescript
{
  type: 'ceo-briefing-generated',
  timestamp: Date.now(),
  payload: {
    week: '2026-W22',
    blockersCount: 2,
    decisionsNeeded: 1,
    sentiment: 'positive' | 'neutral' | 'concerning'
  }
}
```

### Notes

- Keep highlights to 3-5 max, CEO doesn't need everything
- Blockers should only be CEO-level (cross-department, strategic, resource)
- Decisions should include clear deadline and recommendation
- Metrics should show trend and gap to target
- This is NOT a narrative document, it's a structured data format
