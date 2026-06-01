---
template: okr-framework
used-by: [executives/ceo, executives/cpo, executives/cto, departments/product, departments/engineering, departments/sales, departments/marketing]
produces: company.os.departments[*].memory.okrs
---

## Purpose

Objectives and Key Results structure for setting and tracking goals at company and department levels.

## Schema

```typescript
interface OKRFramework {
  period: string;                  // "2026-Q2" or "2026-H1"
  level: "company" | "department" | "team";
  owner: string;                   // CEO, CTO, department name
  
  objectives: Array<{
    id: string;                    // Unique ID: "obj-2026q2-01"
    objective: string;             // Qualitative goal (what we want to achieve)
    why: string;                   // Why this matters now
    
    keyResults: Array<{
      id: string;                  // Unique ID: "kr-2026q2-01-a"
      description: string;         // Measurable outcome
      metric: string;              // What we're measuring
      startValue: number;          // Value at period start
      targetValue: number;         // Goal by period end
      currentValue: number;        // Current value
      unit: string;                // $, %, count, etc.
      progress: number;            // % toward goal
      status: "on-track" | "at-risk" | "off-track" | "completed";
      owner: string;               // Who owns delivery
      lastUpdated: string;         // ISO date
    }>;
    
    dependencies: string[];        // Other OKR IDs this depends on
    status: "on-track" | "at-risk" | "off-track" | "completed";
    confidence: number;            // 0-100% confidence in hitting target
  }>;
  
  updates: Array<{
    date: string;                  // ISO date
    summary: string;               // What changed
    blockers: string[];            // Current blockers
  }>;
}
```

## Example

```json
{
  "period": "2026-Q2",
  "level": "company",
  "owner": "CEO",
  "objectives": [
    {
      "id": "obj-2026q2-01",
      "objective": "Achieve product-market fit with enterprise customers",
      "why": "SMB churn is high, enterprise shows better retention and expansion",
      "keyResults": [
        {
          "id": "kr-2026q2-01-a",
          "description": "Close 5 enterprise deals >$10k ARR",
          "metric": "Enterprise deals closed",
          "startValue": 1,
          "targetValue": 5,
          "currentValue": 3,
          "unit": "count",
          "progress": 50,
          "status": "on-track",
          "owner": "VP Sales",
          "lastUpdated": "2026-05-31"
        },
        {
          "id": "kr-2026q2-01-b",
          "description": "Ship SSO and RBAC features",
          "metric": "Features shipped",
          "startValue": 0,
          "targetValue": 2,
          "currentValue": 2,
          "unit": "count",
          "progress": 100,
          "status": "completed",
          "owner": "CTO",
          "lastUpdated": "2026-05-15"
        },
        {
          "id": "kr-2026q2-01-c",
          "description": "Achieve <2% monthly churn on enterprise cohort",
          "metric": "Enterprise churn rate",
          "startValue": 4.5,
          "targetValue": 2.0,
          "currentValue": 2.8,
          "unit": "%",
          "progress": 68,
          "status": "at-risk",
          "owner": "Customer Success",
          "lastUpdated": "2026-05-31"
        }
      ],
      "dependencies": [],
      "status": "on-track",
      "confidence": 75
    },
    {
      "id": "obj-2026q2-02",
      "objective": "Extend runway to 18 months",
      "why": "Current runway is 12 months, need buffer before next fundraise",
      "keyResults": [
        {
          "id": "kr-2026q2-02-a",
          "description": "Grow MRR to $60k",
          "metric": "Monthly recurring revenue",
          "startValue": 30000,
          "targetValue": 60000,
          "currentValue": 45000,
          "unit": "$",
          "progress": 50,
          "status": "on-track",
          "owner": "VP Sales",
          "lastUpdated": "2026-05-31"
        },
        {
          "id": "kr-2026q2-02-b",
          "description": "Reduce burn to $85k/month",
          "metric": "Monthly burn rate",
          "startValue": 105000,
          "targetValue": 85000,
          "currentValue": 95000,
          "unit": "$",
          "progress": 50,
          "status": "on-track",
          "owner": "CFO",
          "lastUpdated": "2026-05-31"
        }
      ],
      "dependencies": ["obj-2026q2-01"],
      "status": "on-track",
      "confidence": 80
    }
  ],
  "updates": [
    {
      "date": "2026-05-31",
      "summary": "Enterprise deals progressing, SSO shipped, churn improving",
      "blockers": [
        "Need to hire 2 engineers to maintain feature velocity"
      ]
    }
  ]
}
```

## Agent Instructions

### When to Generate
- At the start of each quarter (company-level OKRs)
- When departments set their quarterly goals
- Mid-quarter review (update progress)
- On-demand when user requests OKR status

### How to Populate

1. **Read company.os state**:
   - `company.os.snapshot` for current metrics
   - `company.os.departments[*].memory` for department goals
   - Previous period OKRs for comparison
   - `company.os.events` to track progress on key results

2. **Structure objectives**:
   - Objectives should be qualitative and inspirational
   - Each objective needs a "why" that connects to strategy
   - 3-5 objectives per level (company, department)
   - Don't nest more than 2 levels (company → department)

3. **Define key results**:
   - Each objective has 2-4 key results
   - Key results must be measurable (number, %, $, count)
   - Include startValue, targetValue, and unit
   - Set realistic but ambitious targets (70% confidence)

4. **Track progress**:
   - Update currentValue from company.os metrics
   - Calculate progress: `(current - start) / (target - start) * 100`
   - Set status based on progress and time remaining
   - Update confidence based on blockers and velocity

5. **Identify dependencies**:
   - Link OKRs that depend on each other
   - Use OKR IDs to create dependency graph
   - Highlight cross-department dependencies

6. **Add updates**:
   - Weekly or biweekly status updates
   - Include blockers that need escalation
   - Celebrate key result completions

### What to Write

Write OKRs to department memory:
```
company.os.departments['ceo'].memory.okrs  // Company-level
company.os.departments['product'].memory.okrs  // Department-level
```

### Events to Emit

```typescript
{
  type: 'okr-updated',
  timestamp: Date.now(),
  payload: {
    period: '2026-Q2',
    level: 'company',
    objectiveId: 'obj-2026q2-01',
    status: 'on-track',
    confidence: 75
  }
}
```

When a key result is completed:
```typescript
{
  type: 'key-result-completed',
  timestamp: Date.now(),
  payload: {
    keyResultId: 'kr-2026q2-01-b',
    objective: 'Ship SSO and RBAC features',
    owner: 'CTO'
  }
}
```

### Notes

- OKRs are NOT a task list, they're strategic goals
- Objectives are qualitative, key results are quantitative
- Target 70% confidence on key results (stretch goals)
- Update progress weekly, not daily
- Dependencies should cascade (company → department → team)
- Status should trigger escalation when at-risk or off-track
- This is structured data for tracking, not a narrative document
