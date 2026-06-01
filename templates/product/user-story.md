---
template: user-story
used-by: [departments/product, departments/engineering]
produces: company.os.departments['product'].memory.userStories[]
---

## Purpose

User story format for describing a feature from the user's perspective with acceptance criteria.

## Schema

```typescript
interface UserStory {
  id: string;                      // Unique ID: "us-2026-001"
  prdId?: string;                  // Parent PRD if applicable
  title: string;
  status: "backlog" | "ready" | "in-progress" | "in-review" | "done";
  created: string;
  lastUpdated: string;
  
  story: {
    persona: string;               // Who (role/persona)
    action: string;                // What they want to do
    outcome: string;               // Why (benefit/goal)
  };
  
  description: string;             // Additional context
  
  acceptanceCriteria: Array<{
    id: string;                    // "ac-001"
    criterion: string;             // Testable condition
    passed: boolean;               // Has this been verified
  }>;
  
  priority: "p0" | "p1" | "p2" | "p3";
  estimate: number;                // Story points or hours
  
  dependencies: string[];          // Other story IDs
  
  testCases: Array<{
    id: string;
    scenario: string;
    steps: string[];
    expectedResult: string;
      }>;
  
  notes: string[];                 // Implementation notes
  attachments: Array<{
    type: "mockup" | "spec" | "reference";
    url: string;
    description: string;
  }>;
}
```

## Example

```json
{
  "id": "us-2026-042",
  "prdId": "prd-2026-05-sso",
  "title": "Enterprise employee logs in via SSO",
  "status": "done",
  "created": "2026-05-01",
  "lastUpdated": "2026-05-31",
  "story": {
    "persona": "Enterprise employee at company using Okta",
    "action": "Login to the platform using my company's SSO",
    "outcome": "I can access the platform without creating a separate password"
  },
  "description": "First-time SSO user should be auto-provisioned with basic account. Returning users should be logged in directly. SSO button should be prominent on login page for enterprise users.",
  "acceptanceCriteria": [
    {
      "id": "ac-001",
      "criterion": "User clicks 'Login with SSO' button on login page",
      "passed": true
    },
    {
      "id": "ac-002",
      "criterion": "User enters their company domain (e.g., 'acme.com')",
      "passed": true
    },
    {
      "id": "ac-003",
      "criterion": "User is redirected to their company's IdP (Okta)",
      "passed": true
    },
    {
      "id": "ac-004",
      "criterion": "User authenticates with company credentials at IdP",
      "passed": true
    },
    {
      "id": "ac-005",
      "criterion": "User is redirected back to platform and logged in",
      "passed": true
    },
    {
      "id": "ac-006",
      "criterion": "First-time SSO users are auto-provisioned with account",
      "passed": true
    },
    {
      "id": "ac-007",
      "criterion": "Error message shown if SSO config is invalid",
      "passed": true
    }
  ],
  "priority": "p0",
  "estimate": 8,
  "dependencies": ["us-2026-041"],
  "testCases": [
    {
      "id": "tc-001",
      "scenario": "First-time SSO user login (happy path)",
      "steps": [
        "Navigate to login page",
        "Click 'Login with SSO'",
        "Enter 'acme.com' as domain",
        "Authenticate at Okta with valid credentials",
        "Redirect back to platform"
      ],
      "expectedResult": "User account is created and user is logged into dashboard"
    },
    {
      "id": "tc-002",
      "scenario": "SSO config not found for domain",
      "steps": [
        "Navigate to login page",
        "Click 'Login with SSO'",
        "Enter 'unknowndomain.com' as domain"
      ],
      "expectedResult": "Error message: 'SSO not configured for this domain. Contact your administrator.'"
    },
    {
      "id": "tc-003",
      "scenario": "IdP returns authentication error",
      "steps": [
        "Navigate to login page",
        "Click 'Login with SSO'",
        "Enter 'acme.com'",
        "Fail authentication at Okta (wrong password)",
        "Redirect back to platform"
      ],
      "expectedResult": "Error message: 'Authentication failed. Please try again.'"
    }
  ],
  "notes": [
    "Use passport-saml library for SAML handling",
    "Store SSO config in 'sso_config' table keyed by domain",
    "Auto-provisioned users get 'member' role by default",
    "Session should persist for 7 days"
  ],
  "attachments": [
    {
      "type": "mockup",
      "url": "figma://sso-login-flow",
      "description": "SSO login UI mockups"
    }
  ]
}
```

## Agent Instructions

### When to Generate
- During PRD breakdown into implementation tasks
- When adding features to sprint backlog
- When refining backlog items

### How to Populate

1. **Write the story**:
   - Persona: Specific role or user type (not "user")
   - Action: What they want to do (verb-driven)
   - Outcome: Why they want it (the benefit)
   - Format: "As [persona], I want to [action] so that [outcome]"

2. **Add description**:
   - Context that doesn't fit the story format
   - Edge cases to consider
   - UX considerations

3. **Define acceptance criteria**:
   - Each criterion is a testable condition
   - Use "Given/When/Then" format or simple statements
   - Cover happy path and key edge cases
   - Should be 5-10 criteria per story
   - Mark as passed when verified (manual or automated test)

4. **Set priority**:
   - P0: Must have for MVP/release
   - P1: Should have, high value
   - P2: Nice to have
   - P3: Future consideration

5. **Estimate effort**:
   - Story points (1, 2, 3, 5, 8, 13) or hours
   - Include dev + test + review time
   - If >8 points, consider splitting

6. **Identify dependencies**:
   - Other stories that must be done first
   - Use story IDs to link

7. **Write test cases**:
   - Cover main flow and edge cases
   - Include steps and expected results
   - Should be executable by QA or automated tests

8. **Add notes**:
   - Implementation hints
   - Technical constraints
   - Links to related docs

### What to Write

Write to product memory:
```
company.os.departments['product'].memory.userStories.push(story)
```

### Events to Emit

```typescript
{
  type: 'user-story-created',
  timestamp: Date.now(),
  payload: {
    id: 'us-2026-042',
    title: 'Enterprise employee logs in via SSO',
    priority: 'p0',
    estimate: 8
  }
}
```

When status changes:
```typescript
{
  type: 'user-story-status-changed',
  timestamp: Date.now(),
  payload: {
    id: 'us-2026-042',
    from: 'in-progress',
    to: 'done'
  }
}
```

### Notes

- User stories are implementation-level, PRDs are feature-level
- One PRD can have 10-50 user stories
- Stories should be small enough to complete in 1-3 days
- Acceptance criteria must be testable (not vague)
- Test cases should cover happy path and edge cases
- Dependencies create ordering constraints in backlog
- Status transitions: backlog → ready → in-progress → in-review → done
- "Done" means all acceptance criteria passed
