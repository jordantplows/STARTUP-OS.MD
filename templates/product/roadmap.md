---
template: roadmap
used-by: [departments/product, executives/cpo, executives/ceo]
produces: company.os.departments['product'].memory.roadmap
---

## Purpose

Now/Next/Later product roadmap showing prioritized features, timeline, and strategic direction.

## Schema

```typescript
interface Roadmap {
  lastUpdated: string;
  horizon: string;                 // "2026 H1" or "2026 Q2-Q4"
  
  theme: {
    focus: string;                 // Strategic focus for this period
    why: string;                   // Why this focus now
  };
  
  now: {                           // Current quarter
    period: string;                // "2026 Q2"
    objective: string;             // What we're achieving this quarter
    features: Array<{
      id: string;                  // Feature ID
      name: string;
      description: string;
      status: "planning" | "in-progress" | "shipping" | "shipped";
      targetDate: string;          // ISO date
      confidence: "high" | "medium" | "low";
      owner: string;
      why: string;                 // Why prioritized now
      impact: {
        customers: string;         // How many/which customers benefit
        revenue: string;           // Revenue impact ($X ARR or $X MRR)
        metric: string;            // Key metric this moves
      };
      dependencies: string[];
      risks: string[];
    }>;
  };
  
  next: {                          // Next 3-6 months
    period: string;                // "2026 Q3-Q4"
    objective: string;
    themes: Array<{
      theme: string;
      features: Array<{
        name: string;
        description: string;
        why: string;
        impact: string;
        confidence: "high" | "medium" | "low";
      }>;
    }>;
  };
  
  later: {                         // 6-12 months out
    period: string;                // "2027 H1"
    explorations: Array<{
      area: string;                // Product area or theme
      opportunities: string[];     // Potential features or directions
      signals: string[];           // What would trigger prioritization
    }>;
  };
  
  backlog: {
    requestedFeatures: Array<{
      name: string;
      requestedBy: string[];       // Customer names or segments
      frequency: number;           // # of requests
      lastRequested: string;       // ISO date
      decision: "later" | "no" | "investigating";
      reason: string;              // Why not prioritized yet
    }>;
  };
  
  completed: Array<{
    quarter: string;
    features: Array<{
      name: string;
      shippedDate: string;
      impact: string;              // Actual impact observed
    }>;
  }>;
}
```

## Example

```json
{
  "lastUpdated": "2026-05-31",
  "horizon": "2026 Q2-Q4",
  "theme": {
    "focus": "Enterprise readiness",
    "why": "Sales pipeline shows $200k ARR blocked on enterprise features. Moving upmarket requires SSO, RBAC, audit logs, and compliance certifications."
  },
  "now": {
    "period": "2026 Q2",
    "objective": "Unblock enterprise sales pipeline with core security features",
    "features": [
      {
        "id": "feat-sso",
        "name": "Single Sign-On (SSO)",
        "description": "SAML 2.0 SSO with Okta, Azure AD, Google Workspace support",
        "status": "shipped",
        "targetDate": "2026-06-15",
        "confidence": "high",
        "owner": "Engineering",
        "why": "3 deals ($40k ARR) blocked on SSO, enterprise security requirement",
        "impact": {
          "customers": "All enterprise customers (50+ employees)",
          "revenue": "$40k ARR immediately, enables enterprise sales motion",
          "metric": "Enterprise win rate from 20% to 35%"
        },
        "dependencies": [],
        "risks": ["SAML configuration complexity for customers"]
      },
      {
        "id": "feat-rbac",
        "name": "Role-Based Access Control (RBAC)",
        "description": "Admin/Member/Viewer roles with granular permissions",
        "status": "in-progress",
        "targetDate": "2026-06-30",
        "confidence": "high",
        "owner": "Engineering",
        "why": "Enterprise customers need role separation, 2 deals blocked",
        "impact": {
          "customers": "Enterprise and mid-market (20+ employees)",
          "revenue": "$25k ARR unblocked",
          "metric": "Reduces security objections by 40%"
        },
        "dependencies": ["feat-sso"],
        "risks": []
      },
      {
        "id": "feat-audit-logs",
        "name": "Audit Logs",
        "description": "Immutable log of all user actions for compliance",
        "status": "planning",
        "targetDate": "2026-07-15",
        "confidence": "medium",
        "owner": "Engineering",
        "why": "Required for SOC 2 compliance, enterprise security teams ask for this",
        "impact": {
          "customers": "Enterprise customers in regulated industries",
          "revenue": "Enables $50k+ ARR deals in healthcare/finance",
          "metric": "SOC 2 compliance milestone"
        },
        "dependencies": ["feat-rbac"],
        "risks": ["Storage costs for logs", "Performance impact on writes"]
      }
    ]
  },
  "next": {
    "period": "2026 Q3-Q4",
    "objective": "Scale enterprise capabilities and improve activation",
    "themes": [
      {
        "theme": "Enterprise Admin",
        "features": [
          {
            "name": "SCIM Provisioning",
            "description": "Automated user provisioning/deprovisioning via SCIM",
            "why": "Manual user management doesn't scale for 100+ employee companies",
            "impact": "Reduces IT admin burden, increases enterprise satisfaction",
            "confidence": "medium"
          },
          {
            "name": "Usage Analytics Dashboard",
            "description": "Admin view of team usage, adoption, and engagement metrics",
            "why": "Admins need visibility to justify renewal and drive adoption",
            "impact": "Reduces churn by enabling admins to drive usage",
            "confidence": "high"
          }
        ]
      },
      {
        "theme": "Onboarding & Activation",
        "features": [
          {
            "name": "In-App Onboarding Flow",
            "description": "Guided tour for new users with key workflows",
            "why": "40% of new users never complete first action, losing them in first session",
            "impact": "Increase Day 1 activation from 60% to 80%",
            "confidence": "high"
          },
          {
            "name": "Template Library",
            "description": "Pre-built templates for common use cases",
            "why": "Users starting from blank slate have lower activation",
            "impact": "Reduce time-to-value from 2 days to 30 minutes",
            "confidence": "medium"
          }
        ]
      }
    ]
  },
  "later": {
    "period": "2027 H1",
    "explorations": [
      {
        "area": "API Platform",
        "opportunities": [
          "Public API for integrations",
          "Webhooks for event-driven workflows",
          "API marketplace"
        ],
        "signals": [
          "10+ customers requesting API access",
          "Integration partners ready to build",
          "Engineering capacity available"
        ]
      },
      {
        "area": "Mobile",
        "opportunities": [
          "Mobile app for iOS/Android",
          "Offline mode",
          "Push notifications"
        ],
        "signals": [
          "Mobile usage requests from enterprise customers",
          "Field workers segment grows to >20% of users",
          "Mobile-first competitor launches"
        ]
      }
    ]
  },
  "backlog": {
    "requestedFeatures": [
      {
        "name": "Dark mode",
        "requestedBy": ["Acme Corp", "Beta Industries", "5 individual users"],
        "frequency": 7,
        "lastRequested": "2026-05-20",
        "decision": "later",
        "reason": "Nice-to-have but not blocking any deals. Will prioritize when engineering capacity allows."
      },
      {
        "name": "Excel export",
        "requestedBy": ["Gamma LLC", "Delta Corp"],
        "frequency": 2,
        "lastRequested": "2026-04-10",
        "decision": "investigating",
        "reason": "Need to understand use case better. May be solved by API access instead."
      }
    ]
  },
  "completed": [
    {
      "quarter": "2026 Q1",
      "features": [
        {
          "name": "Team collaboration features",
          "shippedDate": "2026-03-15",
          "impact": "Increased seat expansion by 30%, average team size from 3 to 5"
        },
        {
          "name": "Email notifications",
          "shippedDate": "2026-02-28",
          "impact": "Improved D7 retention from 45% to 58%"
        }
      ]
    }
  ]
}
```

## Agent Instructions

### When to Generate
- Quarterly roadmap planning
- Before board meetings
- When sales/customers ask about upcoming features
- After major product releases

### How to Populate

1. **Read company.os state**:
   - `company.os.departments['product'].memory.prds` for planned features
   - `company.os.departments['sales'].memory.pipeline` for blocked deals
   - `company.os.departments['strategy'].memory.okrs` for strategic goals
   - `company.os.events` for customer requests and feedback

2. **Set theme and focus**:
   - What's the strategic focus this period
   - Why this focus now (market, competition, bottleneck)
   - Should align with company OKRs

3. **Populate "Now" (current quarter)**:
   - Features in active development or shipping soon
   - Include status, target date, confidence
   - Explain WHY each feature is prioritized
   - Quantify impact (customers, revenue, metrics)
   - List dependencies and risks

4. **Populate "Next" (3-6 months)**:
   - Group by themes (not individual features)
   - Less detail than "Now" (things will change)
   - Focus on direction and priorities
   - Medium-high confidence features only

5. **Populate "Later" (6-12+ months)**:
   - Explorations, not commitments
   - What would trigger these moving up
   - Strategic bets and bigger initiatives

6. **Track backlog**:
   - Features customers are requesting
   - Frequency and recency of requests
   - Why not prioritized yet
   - Decision: later | investigating | no

7. **Record completed features**:
   - What shipped last quarter
   - Actual impact observed (compare to predicted)
   - Learn from hits and misses

### What to Write

Write to product memory:
```
company.os.departments['product'].memory.roadmap
```

Share with sales:
```
company.os.departments['sales'].memory.productRoadmap
```

### Events to Emit

```typescript
{
  type: 'roadmap-updated',
  timestamp: Date.now(),
  payload: {
    period: '2026 Q2',
    nowFeatures: 3,
    nextThemes: 2
  }
}
```

When feature ships:
```typescript
{
  type: 'feature-shipped',
  timestamp: Date.now(),
  payload: {
    id: 'feat-sso',
    name: 'Single Sign-On (SSO)',
    shippedDate: '2026-06-15'
  }
}
```

### Notes

- Now/Next/Later prevents over-committing to distant timelines
- "Now" should be high confidence, "Next" is medium, "Later" is low
- Always explain WHY features are prioritized
- Quantify impact (not "improve" but "improve from X to Y")
- Update monthly, roadmap drifts as priorities change
- Completed section shows actual vs predicted impact (learn from it)
- Backlog prevents "lost" customer requests
- Sales needs this to close deals and set expectations
- Don't put specific dates on "Later" items (they're exploratory)
- Roadmap is strategy made visible
