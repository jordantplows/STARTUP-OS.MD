---
template: idea-canvas
used-by: [departments/strategy, executives/ceo, executives/cpo]
produces: company.os.departments['strategy'].memory.ideaCanvas
---

## Purpose

Problem/solution canvas for articulating the core startup idea, target customer pain, proposed solution, and why now.

## Schema

```typescript
interface IdeaCanvas {
  lastUpdated: string;             // ISO date
  
  problem: {
    description: string;           // What problem exists today
    whoCares: string;              // Who has this problem
    currentSolution: string;       // How they solve it today
    painLevel: 1 | 2 | 3 | 4 | 5;  // 1=annoying, 5=existential
    frequency: string;             // How often they hit this
    cost: {
      time: string;                // Time wasted
      money: string;               // Money wasted
      opportunity: string;         // What they can't do because of this
    };
  };
  
  customer: {
    persona: string;               // Primary persona (role/title)
    company: {
      size: string;                // "1-10" | "11-50" | "51-200" | "200+"
      industry: string[];          // Industries with this problem
      geography: string[];         // Where they are
    };
    dayInLife: string;             // What their day looks like
    budget: string;                // Who controls budget for this
    buyingProcess: string;         // How they buy solutions
  };
  
  solution: {
    description: string;           // What we're building
    keyFeatures: Array<{
      feature: string;
      painPoint: string;           // Which problem this solves
      differentiation: string;     // Why better than alternatives
    }>;
    coreInsight: string;           // The non-obvious insight
    magicMoment: string;           // When user goes "wow"
    aha: string;                   // When they realize they need this
  };
  
  whyNow: {
    trigger: string;               // What changed to make this possible now
    trends: string[];              // Market/tech trends supporting this
    inflection: string;            // The inflection point
    window: string;                // How long the window is open
  };
  
  unfairAdvantage: string[];       // What you have that others can't copy
  
  risks: Array<{
    risk: string;
    mitigation: string;
  }>;
  
  traction: {
    evidence: string[];            // Early signals this is real
    conversations: number;         // Customer conversations done
    pilots: number;                // Pilots running
    revenue: number;               // Revenue if any
  };
}
```

## Example

```json
{
  "lastUpdated": "2026-05-31",
  "problem": {
    "description": "Architecture firms waste 20+ hours/week on manual permit submissions to city planning departments",
    "whoCares": "Small-to-mid-size architecture firms (5-50 employees)",
    "currentSolution": "Junior architects manually fill PDFs, email to planning dept, wait weeks for feedback, resubmit",
    "painLevel": 4,
    "frequency": "Every project, 2-5 submissions per project",
    "cost": {
      "time": "20 hours/week of junior architect time = $2k/week",
      "money": "$100k+/year in labor costs per firm",
      "opportunity": "Can't take on more projects because submission process is bottleneck"
    }
  },
  "customer": {
    "persona": "Architecture firm principal (owner/partner)",
    "company": {
      "size": "5-50",
      "industry": ["Architecture", "Civil Engineering", "Urban Planning"],
      "geography": ["US", "Canada"]
    },
    "dayInLife": "Splits time between design work, client meetings, and managing project pipeline. Frustrated by admin overhead.",
    "budget": "Principal/owner makes purchase decisions, has budget for tools that save time",
    "buyingProcess": "Try free trial, see time savings, purchase if ROI is clear"
  },
  "solution": {
    "description": "Automated permit submission platform that integrates with CAD tools and planning department systems",
    "keyFeatures": [
      {
        "feature": "CAD integration extracts building specs automatically",
        "painPoint": "Manual data entry from drawings into permit forms",
        "differentiation": "Other tools make you re-enter data, we pull from source"
      },
      {
        "feature": "Pre-submission validation checks against code",
        "painPoint": "Permit rejections due to missing info or code violations",
        "differentiation": "Catches errors before submission, not after 2 week wait"
      },
      {
        "feature": "Direct API to planning department systems",
        "painPoint": "Email/fax submissions with manual tracking",
        "differentiation": "Only platform with city API integrations"
      }
    ],
    "coreInsight": "Permit rejection isn't the problem, it's the 2-week feedback loop. Instant validation eliminates the loop.",
    "magicMoment": "First submission that passes validation and gets approved in days instead of weeks",
    "aha": "When they realize their $60k/year junior architect is spending 40% of time on data entry"
  },
  "whyNow": {
    "trigger": "Cities digitizing planning departments post-COVID, APIs now available",
    "trends": [
      "Remote work → firms less willing to tolerate manual processes",
      "Architectural software moving to cloud (CAD, BIM)",
      "Cities under pressure to speed permit approvals"
    ],
    "inflection": "15+ major cities launched permit APIs in past 18 months",
    "window": "2-3 years before incumbents wake up and build this"
  },
  "unfairAdvantage": [
    "Founder is ex-city planner, has relationships with 30+ planning departments",
    "Already integrated with 8 city APIs (takes competitors 6-12 months each)",
    "CAD integration IP from previous company"
  ],
  "risks": [
    {
      "risk": "Cities slow to adopt APIs, integration takes 12+ months per city",
      "mitigation": "Start with 8 cities already live, expand as others come online"
    },
    {
      "risk": "Autodesk or Bentley builds this into their platform",
      "mitigation": "Deeper city integrations and code validation are defensible moats"
    }
  ],
  "traction": {
    "evidence": [
      "8 architecture firms using beta",
      "Average 18 hour/week time savings reported",
      "3 firms said they'd pay $500/month today"
    ],
    "conversations": 45,
    "pilots": 8,
    "revenue": 0
  }
}
```

## Agent Instructions

### When to Generate
- At company inception (idea stage)
- When pivoting or refining the idea
- Before fundraising (ensure clarity on problem/solution)
- Quarterly review to validate assumptions

### How to Populate

1. **Read company.os state**:
   - `company.os.snapshot.idea` for current idea description
   - `company.os.events` for customer conversations
   - `company.os.departments['sales'].memory` for customer feedback
   - `company.os.departments['product'].memory` for solution details

2. **Define the problem**:
   - Be specific about who has the problem and when
   - Quantify the pain (time, money, opportunity cost)
   - Describe current solution (competition or manual process)
   - Pain level should be 4+ to be venture-backable

3. **Profile the customer**:
   - Primary persona, not multiple segments at once
   - Company size/industry should be specific enough to target
   - Understand their buying process and decision criteria
   - Identify budget holder and approval process

4. **Articulate the solution**:
   - What are you building, specifically
   - Each feature should map to a pain point
   - Core insight should be non-obvious and defensible
   - Magic moment is when user sees value immediately

5. **Explain why now**:
   - What changed that makes this possible today, not 5 years ago
   - Trends should be large and accelerating
   - Window should be realistic (1-3 years is typical)

6. **Identify unfair advantage**:
   - What you have that competitors can't easily copy
   - Examples: unique data, relationships, IP, distribution
   - "We'll execute better" is not an unfair advantage

7. **Capture traction**:
   - Evidence that this problem is real and people want the solution
   - Customer conversations, pilots, revenue, usage metrics
   - Update this regularly as you learn

### What to Write

Write to strategy department memory:
```
company.os.departments['strategy'].memory.ideaCanvas
```

### Events to Emit

```typescript
{
  type: 'idea-canvas-updated',
  timestamp: Date.now(),
  payload: {
    painLevel: 4,
    traction: {
      conversations: 45,
      pilots: 8,
      revenue: 0
    }
  }
}
```

### Notes

- This is a living document, update as you learn
- Problem section should make the pain visceral and specific
- Solution should be crisp, not a laundry list of features
- Why now is critical — if this could have been built 5 years ago, why will you win?
- Unfair advantage must be real, not aspirational
- Traction section should grow over time as evidence mounts
- If pain level is <3, you probably don't have a business
- This template is used by investors to evaluate ideas quickly
