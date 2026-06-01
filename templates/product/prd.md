---
template: prd
used-by: [product, executives/cpo]
produces: company.os.departments['product'].memory.prds[]
---

## Purpose

Product Requirements Document defining what to build, why, for whom, success criteria, and implementation scope.

## Schema

```typescript
interface PRD {
  id: string;                      // Unique ID: "prd-2026-05-auth"
  title: string;
  status: "draft" | "review" | "approved" | "in-progress" | "shipped" | "archived";
  created: string;                 // ISO date
  lastUpdated: string;
  owner: string;                   // Product manager or owner
  
  overview: {
    problem: string;               // What problem this solves
    solution: string;              // What we're building
    why: string;                   // Why now, why this approach
    target: string;                // Target customer segment
  };
  
  goals: {
    businessGoals: string[];       // Revenue, retention, acquisition
    userGoals: string[];           // What users can accomplish
    successMetrics: Array<{
      metric: string;
      baseline: number;
      target: number;
      timeframe: string;
    }>;
  };
  
  userStories: Array<{
    id: string;                    // "us-001"
    persona: string;               // Who
    action: string;                // What they do
    outcome: string;               // What they get
    priority: "p0" | "p1" | "p2" | "p3";
    acceptanceCriteria: string[];
  }>;
  
  requirements: {
    functional: Array<{
      id: string;                  // "req-001"
      description: string;
      priority: "must" | "should" | "could" | "wont";
      dependencies: string[];      // IDs of dependent requirements
    }>;
    nonFunctional: Array<{
      category: "performance" | "security" | "scalability" | "reliability";
      requirement: string;
      target: string;              // Measurable target
    }>;
  };
  
  scope: {
    inScope: string[];
    outOfScope: string[];
    futureConsiderations: string[];
  };
  
  userExperience: {
    flowDescription: string;
    keyInteractions: string[];
    edgeCases: string[];
  };
  
  technicalConsiderations: {
    platforms: string[];           // Web, mobile, API
    integrations: string[];        // External systems
    dataModel: string;             // Key entities and relationships
    constraints: string[];         // Technical limitations
  };
  
  risks: Array<{
    risk: string;
    impact: "high" | "medium" | "low";
    mitigation: string;
  }>;
  
  timeline: {
    targetLaunch: string;          // ISO date
    milestones: Array<{
      name: string;
      date: string;
      deliverables: string[];
    }>;
  };
  
  dependencies: {
    internal: string[];            // Other features/teams
    external: string[];            // Third-party services
  };
  
  openQuestions: Array<{
    question: string;
    owner: string;
    deadline: string;
  }>;
}
```

## Example

```json
{
  "id": "prd-2026-05-sso",
  "title": "Single Sign-On (SSO) for Enterprise Customers",
  "status": "approved",
  "created": "2026-04-15",
  "lastUpdated": "2026-05-31",
  "owner": "Product Manager",
  "overview": {
    "problem": "Enterprise customers require SSO to meet security policies, 3 deals ($40k ARR) blocked on this feature",
    "solution": "SAML 2.0 SSO integration with support for major identity providers (Okta, Azure AD, Google Workspace)",
    "why": "Unblocks enterprise sales pipeline and reduces security objections. Industry standard, table stakes for enterprise deals >$10k ARR",
    "target": "Enterprise customers (50+ employees) with existing identity provider"
  },
  "goals": {
    "businessGoals": [
      "Unblock $40k ARR in stalled enterprise deals",
      "Reduce time-to-close for enterprise deals by 2 weeks",
      "Increase enterprise win rate from 20% to 35%"
    ],
    "userGoals": [
      "Login with corporate credentials (no new password)",
      "Automatic provisioning/deprovisioning when employees join/leave",
      "Centralized access control managed by IT admin"
    ],
    "successMetrics": [
      {
        "metric": "Enterprise deals closed with SSO",
        "baseline": 0,
        "target": 3,
        "timeframe": "30 days post-launch"
      },
      {
        "metric": "SSO adoption rate (% of enterprise customers)",
        "baseline": 0,
        "target": 60,
        "timeframe": "90 days post-launch"
      }
    ]
  },
  "userStories": [
    {
      "id": "us-001",
      "persona": "Enterprise employee",
      "action": "Login using company SSO",
      "outcome": "Access the platform without creating separate credentials",
      "priority": "p0",
      "acceptanceCriteria": [
        "User clicks 'Login with SSO' button",
        "User enters company domain",
        "User is redirected to company IdP",
        "User authenticates with company credentials",
        "User is redirected back and logged in"
      ]
    },
    {
      "id": "us-002",
      "persona": "IT administrator",
      "action": "Configure SSO for organization",
      "outcome": "Enable SSO login for all employees",
      "priority": "p0",
      "acceptanceCriteria": [
        "Admin uploads SAML metadata or enters IdP details",
        "System validates configuration",
        "Admin can test SSO before enabling for all users",
        "Admin can disable/re-enable SSO at any time"
      ]
    }
  ],
  "requirements": {
    "functional": [
      {
        "id": "req-001",
        "description": "Support SAML 2.0 authentication flow",
        "priority": "must",
        "dependencies": []
      },
      {
        "id": "req-002",
        "description": "Support Okta, Azure AD, Google Workspace IdPs",
        "priority": "must",
        "dependencies": ["req-001"]
      },
      {
        "id": "req-003",
        "description": "Auto-provision users on first SSO login",
        "priority": "must",
        "dependencies": ["req-001"]
      },
      {
        "id": "req-004",
        "description": "Admin UI to configure SSO settings",
        "priority": "must",
        "dependencies": []
      },
      {
        "id": "req-005",
        "description": "Support Just-In-Time (JIT) provisioning",
        "priority": "should",
        "dependencies": ["req-003"]
      }
    ],
    "nonFunctional": [
      {
        "category": "security",
        "requirement": "SAML responses must be signed and encrypted",
        "target": "Industry standard security practices"
      },
      {
        "category": "performance",
        "requirement": "SSO login completes within 3 seconds",
        "target": "<3s from IdP redirect back to logged-in state"
      }
    ]
  },
  "scope": {
    "inScope": [
      "SAML 2.0 SSO (SP-initiated)",
      "Support for Okta, Azure AD, Google Workspace",
      "Admin configuration UI",
      "Auto-provisioning on first login",
      "Error handling and user feedback"
    ],
    "outOfScope": [
      "SCIM provisioning (future)",
      "IdP-initiated SSO (future)",
      "Multi-factor authentication (handled by IdP)",
      "Custom SAML attributes beyond email/name"
    ],
    "futureConsiderations": [
      "SCIM for automated user provisioning/deprovisioning",
      "Support for additional IdPs (OneLogin, PingFederate)",
      "Role mapping from IdP groups to platform roles"
    ]
  },
  "userExperience": {
    "flowDescription": "User lands on login page, sees 'Login with SSO' option, enters company domain, redirects to company IdP, authenticates, redirects back logged in",
    "keyInteractions": [
      "SSO login button on login page",
      "Domain input field (e.g., 'acme.com')",
      "Loading state during redirect",
      "Error messages for failed auth"
    ],
    "edgeCases": [
      "User's email doesn't match domain",
      "IdP returns error",
      "User exists but with different auth method",
      "SSO config is invalid/expired"
    ]
  },
  "technicalConsiderations": {
    "platforms": ["Web"],
    "integrations": ["SAML IdPs (Okta, Azure AD, Google)"],
    "dataModel": "Add 'sso_config' table with org_id, idp_metadata, enabled flag. Add 'auth_method' field to users table",
    "constraints": [
      "Must not break existing email/password auth",
      "Must work with current session management",
      "SAML library must be actively maintained"
    ]
  },
  "risks": [
    {
      "risk": "IdP configuration errors delay customer onboarding",
      "impact": "medium",
      "mitigation": "Provide config wizard with validation and test mode"
    },
    {
      "risk": "Security vulnerability in SAML implementation",
      "impact": "high",
      "mitigation": "Use battle-tested SAML library, security review before launch"
    }
  ],
  "timeline": {
    "targetLaunch": "2026-06-15",
    "milestones": [
      {
        "name": "Technical design complete",
        "date": "2026-05-10",
        "deliverables": ["Architecture doc", "Database schema"]
      },
      {
        "name": "MVP implementation",
        "date": "2026-06-01",
        "deliverables": ["SAML auth flow", "Admin config UI"]
      },
      {
        "name": "Beta testing with 2 customers",
        "date": "2026-06-10",
        "deliverables": ["Beta deployed", "Customer feedback collected"]
      }
    ]
  },
  "dependencies": {
    "internal": ["Auth service refactor", "Admin UI framework"],
    "external": ["SAML library (passport-saml or similar)"]
  },
  "openQuestions": [
    {
      "question": "Do we need to support IdP-initiated SSO for launch?",
      "owner": "Product Manager",
      "deadline": "2026-05-15"
    }
  ]
}
```

## Agent Instructions

### When to Generate
- When product team decides to build new feature
- Before engineering starts work
- When pivoting existing feature
- For roadmap planning

### How to Populate

1. **Read company.os state**:
   - `company.os.departments['sales'].memory` for customer requests
   - `company.os.departments['product'].memory.roadmap` for context
   - `company.os.events` for blockers and feedback

2. **Define overview**:
   - Problem should be specific and customer-validated
   - Solution should be crisp, not over-specified
   - Why should connect to business goals or OKRs
   - Target should identify specific customer segment

3. **Set goals and metrics**:
   - Business goals connect to revenue, retention, acquisition
   - User goals are what users can accomplish
   - Success metrics must be measurable with baseline and target
   - Timeframe should be realistic (30/60/90 days post-launch)

4. **Write user stories**:
   - Format: "As [persona], I want to [action] so that [outcome]"
   - Priority: P0=must-have, P1=should-have, P2=nice-to-have
   - Acceptance criteria are testable conditions
   - Cover main flow and key edge cases

5. **Define requirements**:
   - Functional: what the system does
   - Non-functional: how well it does it (performance, security)
   - Use MoSCoW priority: must/should/could/won't
   - Link dependencies between requirements

6. **Set scope boundaries**:
   - In-scope: what's included in this release
   - Out-of-scope: explicitly not included
   - Future: what comes later (prevents scope creep)

7. **Consider technical aspects**:
   - Platforms affected
   - External integrations needed
   - Data model changes
   - Technical constraints or limitations

8. **Identify risks**:
   - Technical, business, or timeline risks
   - Impact assessment
   - Mitigation strategy for each

9. **Plan timeline**:
   - Target launch date
   - Key milestones with dates and deliverables
   - Build in buffer for unknowns

### What to Write

Write to product department memory:
```
company.os.departments['product'].memory.prds.push(prd)
```

### Events to Emit

```typescript
{
  type: 'prd-created',
  timestamp: Date.now(),
  payload: {
    id: 'prd-2026-05-sso',
    title: 'Single Sign-On (SSO) for Enterprise Customers',
    status: 'approved',
    targetLaunch: '2026-06-15'
  }
}
```

When status changes:
```typescript
{
  type: 'prd-status-changed',
  timestamp: Date.now(),
  payload: {
    id: 'prd-2026-05-sso',
    from: 'draft',
    to: 'approved'
  }
}
```

### Notes

- PRD is a spec, not a design doc (that's engineering's job)
- Be specific enough to build from, vague enough to allow implementation choices
- User stories should cover golden path and key edge cases
- Success metrics must be measurable, not aspirational
- Scope section prevents feature creep
- Open questions should be resolved before status="approved"
- Update PRD as decisions are made, it's a living document
- Engineering reads this to write technical specs
