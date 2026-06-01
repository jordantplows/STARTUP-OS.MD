---
template: hiring-evaluation
used-by: [executives/ceo, executives/cto, executives/cfo, executives/cmo, executives/cpo, executives/coo, people/recruiting]
produces: company.os.departments['people'].memory.hiringEvaluations
---

## Purpose

Structured evaluation framework for hiring decisions, assessing candidates against role requirements, culture fit, and strategic priorities.

## Schema

```typescript
interface HiringEvaluation {
  evaluations: Array<{
    candidateId: string;           // Unique ID
    role: string;                  // Position title
    department: string;            // Where they'll work
    level: "junior" | "mid" | "senior" | "staff" | "principal" | "executive";
    
    roleContext: {
      priority: "critical" | "high" | "medium";
      openDate: string;            // ISO date
      targetStart: string;         // ISO date
      reasonForHire: string;       // Why we need this role now
      reportingTo: string;         // Manager name/title
    };
    
    candidate: {
      name: string;
      currentCompany: string;
      yearsExperience: number;
      source: string;              // Referral | LinkedIn | Agency | etc.
      interviewDate: string;       // ISO date
    };
    
    evaluation: {
      technical: {
        score: number;             // 1-5
        strengths: string[];
        gaps: string[];
        assessedBy: string[];
      };
      
      culture: {
        score: number;             // 1-5
        values: Array<{
          value: string;
          fit: "strong" | "good" | "neutral" | "concern";
          notes: string;
        }>;
        workStyle: string;
        assessedBy: string[];
      };
      
      leadership: {
        score: number;             // 1-5 (N/A for IC roles)
        experience: string;
        potential: string;
        assessedBy: string[];
      };
      
      strategic: {
        score: number;             // 1-5
        alignment: string;         // How this hire advances strategy
        futureScope: string;       // Growth potential in role
        uniqueValue: string;       // What makes them special
      };
    };
    
    interviewers: Array<{
      name: string;
      role: string;
      recommendation: "strong-yes" | "yes" | "maybe" | "no" | "strong-no";
      summary: string;
      concerns: string[];
    }>;
    
    compensation: {
      baseSalary: number;
      equity: number;              // % or shares
      bonus: number;
      total: number;
      marketComparison: "below" | "at" | "above";
      justification: string;
    };
    
    decision: {
      recommendation: "hire" | "no-hire" | "more-data";
      rationale: string;
      approver: string;            // Executive who decides
      risks: string[];
      mitigations: string[];
      alternativeCandidates: number;
    };
    
    tracking: {
      status: "screening" | "interviewing" | "offer-prep" | "offer-sent" | "accepted" | "declined" | "rejected";
      createdAt: string;           // ISO date
      updatedAt: string;           // ISO date
    };
  }>;
}
```

## Example

```json
{
  "evaluations": [
    {
      "candidateId": "cand-2026-05-31-001",
      "role": "Senior Backend Engineer",
      "department": "Engineering",
      "level": "senior",
      "roleContext": {
        "priority": "critical",
        "openDate": "2026-05-01",
        "targetStart": "2026-07-01",
        "reasonForHire": "Engineering at capacity, blocking $120k ARR in sales pipeline",
        "reportingTo": "CTO"
      },
      "candidate": {
        "name": "Alex Chen",
        "currentCompany": "DataCorp",
        "yearsExperience": 7,
        "source": "Referral (current engineer)",
        "interviewDate": "2026-05-30"
      },
      "evaluation": {
        "technical": {
          "score": 4,
          "strengths": [
            "Strong distributed systems experience",
            "Built similar API platform at scale",
            "Excellent system design thinking"
          ],
          "gaps": [
            "Limited TypeScript experience (Python background)",
            "No experience with our specific stack (Postgres/Redis)"
          ],
          "assessedBy": ["CTO", "Senior Engineer 1", "Senior Engineer 2"]
        },
        "culture": {
          "score": 5,
          "values": [
            {
              "value": "Move fast with purpose",
              "fit": "strong",
              "notes": "Demonstrated bias for action and shipping"
            },
            {
              "value": "Own the outcome",
              "fit": "strong",
              "notes": "Takes full responsibility, shows initiative"
            }
          ],
          "workStyle": "Collaborative, pragmatic, detail-oriented",
          "assessedBy": ["CTO", "Product Manager", "Engineering Lead"]
        },
        "leadership": {
          "score": 3,
          "experience": "Led small team of 2-3 engineers on previous project",
          "potential": "Could grow into tech lead role within 12 months",
          "assessedBy": ["CTO"]
        },
        "strategic": {
          "score": 5,
          "alignment": "Directly unblocks enterprise roadmap and revenue growth",
          "futureScope": "Can scale into Staff Engineer role as team grows",
          "uniqueValue": "Deep API platform experience matches our current needs"
        }
      },
      "interviewers": [
        {
          "name": "CTO",
          "role": "Technical Interview",
          "recommendation": "strong-yes",
          "summary": "Excellent technical depth, clear communicator, culture fit",
          "concerns": ["Will need ramp time on TypeScript"]
        },
        {
          "name": "Senior Engineer 1",
          "role": "System Design",
          "recommendation": "yes",
          "summary": "Solid system design skills, good architectural thinking",
          "concerns": ["Some gaps in specific technologies we use"]
        },
        {
          "name": "Product Manager",
          "role": "Collaboration Interview",
          "recommendation": "strong-yes",
          "summary": "Great product sense, asks good questions, team player",
          "concerns": []
        }
      ],
      "compensation": {
        "baseSalary": 180000,
        "equity": 0.15,
        "bonus": 20000,
        "total": 200000,
        "marketComparison": "at",
        "justification": "Market rate for senior engineer with 7 YOE in SF Bay Area"
      },
      "decision": {
        "recommendation": "hire",
        "rationale": "Strong technical fit, excellent culture match, directly addresses critical capacity need. TypeScript gap is manageable with team support.",
        "approver": "CEO",
        "risks": [
          "Ramp time on new stack could delay feature delivery",
          "First external senior hire, will set culture precedent"
        ],
        "mitigations": [
          "Pair with senior engineer for first 2 weeks",
          "Start with smaller scope projects while ramping",
          "Weekly check-ins with CTO for first month"
        ],
        "alternativeCandidates": 2
      },
      "tracking": {
        "status": "offer-prep",
        "createdAt": "2026-05-25",
        "updatedAt": "2026-05-31"
      }
    }
  ]
}
```

## Agent Instructions

### When to Generate
- After final interview round for a candidate
- When executive approval needed for offer
- For role prioritization decisions
- For compensation review

### How to Populate

1. **Read company.os state**:
   - `company.os.departments['people'].memory.openRoles`
   - `company.os.departments['people'].memory.candidates`
   - `company.os.departments['finance'].memory.headcountPlan`
   - `company.os.departments[*].blockers` for hiring urgency

2. **Assess technical fit**:
   - Gather scores from technical interviewers
   - Identify specific strengths and gaps
   - Compare against role requirements
   - Consider team's ability to mentor/fill gaps

3. **Evaluate culture fit**:
   - Map candidate to company values
   - Assess work style compatibility with team
   - Look for red flags in collaboration
   - Consider diversity of perspectives

4. **Calculate strategic value**:
   - How does this hire advance company goals?
   - What's the opportunity cost of not hiring?
   - What's the growth potential in this role?
   - What unique value does this person bring?

5. **Structure compensation**:
   - Check market rates for role/location/experience
   - Compare to existing team (internal equity)
   - Calculate total comp including equity
   - Justify if above/below market

6. **Make recommendation**:
   - Synthesize all inputs into clear hire/no-hire
   - Document risks and mitigations
   - Compare to other candidates if applicable
   - Route to appropriate executive for approval

### What to Write

Write evaluations to people memory:
```
company.os.departments['people'].memory.hiringEvaluations.push(evaluation)
```

Update role status:
```
company.os.departments['people'].memory.openRoles[roleId].status
```

### Events to Emit

When evaluation complete:
```typescript
{
  type: 'hiring-evaluation-complete',
  timestamp: Date.now(),
  payload: {
    candidateId: 'cand-2026-05-31-001',
    role: 'Senior Backend Engineer',
    recommendation: 'hire',
    approver: 'CEO'
  }
}
```

When offer sent:
```typescript
{
  type: 'offer-sent',
  timestamp: Date.now(),
  payload: {
    candidateId: 'cand-2026-05-31-001',
    role: 'Senior Backend Engineer',
    totalComp: 200000,
    startDate: '2026-07-01'
  }
}
```

### Notes

- Hiring decisions are irreversible and high-cost - be thorough
- Balance rigor with speed (good candidates move fast)
- Culture fit is as important as technical fit
- Document risks and mitigations explicitly
- Compare compensation to market AND internal equity
- Strategic alignment should tie to OKRs and roadmap
- Executive involvement scales with role level and impact
- This is structured data for decision-making, not a narrative document
