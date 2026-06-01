---
template: fundraising
used-by: [executives/ceo, executives/cfo, finance/fpa]
produces: company.os.departments['finance'].memory.fundraising
---

## Purpose

Fundraising strategy, process tracking, and investor pipeline management for equity financing rounds.

## Schema

```typescript
interface Fundraising {
  round: {
    stage: "pre-seed" | "seed" | "series-a" | "series-b" | "bridge";
    status: "planning" | "pitching" | "due-diligence" | "closing" | "closed";
    targetAmount: number;
    minViable: number;             // Minimum to close
    valuation: {
      target: number;
      range: [number, number];     // [low, high]
      type: "pre" | "post";
    };
    
    timeline: {
      kickoff: string;             // ISO date
      targetClose: string;         // ISO date
      hardDeadline: string;        // ISO date (based on runway)
    };
    
    use: Array<{
      category: string;            // Team | Product | Marketing | Runway
      amount: number;
      purpose: string;
      timeline: string;
    }>;
    
    terms: {
      security: "SAFE" | "priced-equity" | "convertible";
      leadRequired: boolean;
      minCheck: number;
      maxCheck: number;
      proRata: boolean;
      boardSeat: boolean;
      preferredTerms: string[];
    };
  };
  
  investors: Array<{
    id: string;
    name: string;
    type: "angel" | "seed-fund" | "vc" | "strategic";
    stage: "research" | "outreach" | "intro" | "meeting" | "diligence" | "term-sheet" | "committed" | "passed";
    
    contact: {
      partner: string;
      email: string;
      intro: string;               // How we got connected
      introDate: string;           // ISO date
    };
    
    thesis: {
      focus: string[];             // What they invest in
      stage: string[];             // What stages
      checkSize: [number, number]; // [min, max]
      geography: string[];
      portfolio: string[];         // Similar companies
      fit: "strong" | "good" | "weak";
      notes: string;
    };
    
    interactions: Array<{
      date: string;                // ISO date
      type: "email" | "call" | "meeting" | "pitch";
      participants: string[];
      summary: string;
      nextSteps: string;
      sentiment: "positive" | "neutral" | "negative" | "no-fit";
    }>;
    
    diligence: {
      dataRoom: boolean;
      financials: boolean;
      technical: boolean;
      legal: boolean;
      references: boolean;
      questions: Array<{
        question: string;
        answer: string;
        answeredDate: string;
      }>;
    };
    
    commitment: {
      committed: boolean;
      amount: number;
      terms: string;
      signedDate?: string;
    };
  }>;
  
  materials: {
    deck: {
      version: string;
      lastUpdated: string;
      slides: number;
      narrativeArc: string[];
      feedback: string[];
    };
    
    dataRoom: {
      created: boolean;
      sections: string[];
      lastUpdated: string;
    };
    
    memo: {
      executive: string;           // 1-pager
      full: string;                // Full memo
      lastUpdated: string;
    };
    
    financials: {
      model: string;
      historicals: string;
      projections: string;
    };
  };
  
  metrics: {
    targetInvestors: number;
    contacted: number;
    meetings: number;
    pitches: number;
    termSheets: number;
    committed: number;
    totalCommitted: number;
    
    conversion: {
      outreachToMeeting: number;   // %
      meetingToPitch: number;      // %
      pitchToTermSheet: number;    // %
      termSheetToClose: number;    // %
    };
    
    velocity: {
      avgTimeToMeeting: number;    // Days
      avgTimeToPitch: number;      // Days
      avgTimeToTermSheet: number;  // Days
    };
  };
  
  strategy: {
    narrative: string;             // What story are we telling?
    momentum: string[];            // Proof points to highlight
    objections: Array<{
      objection: string;
      response: string;
    }>;
    
    leadTarget: string[];          // Who we want to lead
    signalInvestors: string[];     // Angels/small checks for signal
    followOn: string[];            // Who can follow in next round
    
    alternatives: Array<{
      scenario: string;
      trigger: string;
      action: string;
    }>;
  };
}
```

## Example

```json
{
  "round": {
    "stage": "seed",
    "status": "pitching",
    "targetAmount": 2000000,
    "minViable": 1500000,
    "valuation": {
      "target": 10000000,
      "range": [8000000, 12000000],
      "type": "post"
    },
    "timeline": {
      "kickoff": "2026-06-01",
      "targetClose": "2026-08-31",
      "hardDeadline": "2026-09-30"
    },
    "use": [
      {"category": "Team", "amount": 800000, "purpose": "Hire 4 engineers, 1 PM, 1 sales", "timeline": "6 months"},
      {"category": "Product", "amount": 400000, "purpose": "Build enterprise platform", "timeline": "9 months"},
      {"category": "Marketing", "amount": 300000, "purpose": "Demand gen and content", "timeline": "12 months"},
      {"category": "Runway", "amount": 500000, "purpose": "18 months runway buffer", "timeline": "18 months"}
    ],
    "terms": {
      "security": "SAFE",
      "leadRequired": true,
      "minCheck": 500000,
      "maxCheck": 1000000,
      "proRata": true,
      "boardSeat": false,
      "preferredTerms": ["No participating preferred", "1x liquidation preference"]
    }
  },
  "investors": [
    {
      "id": "inv-001",
      "name": "Acme Ventures",
      "type": "seed-fund",
      "stage": "meeting",
      "contact": {
        "partner": "Sarah Chen",
        "email": "sarah@acme.vc",
        "intro": "Warm intro from portfolio founder",
        "introDate": "2026-06-10"
      },
      "thesis": {
        "focus": ["B2B SaaS", "Data infrastructure", "Dev tools"],
        "stage": ["Seed", "Series A"],
        "checkSize": [500000, 2000000],
        "geography": ["North America"],
        "portfolio": ["DataCo", "CloudPlatform", "DevToolsInc"],
        "fit": "strong",
        "notes": "Led 3 similar companies, active hands-on investors"
      },
      "interactions": [
        {
          "date": "2026-06-15",
          "type": "call",
          "participants": ["CEO", "Sarah Chen"],
          "summary": "Intro call, shared vision and traction. Strong interest in market.",
          "nextSteps": "Send deck, schedule pitch meeting",
          "sentiment": "positive"
        }
      ],
      "diligence": {
        "dataRoom": false,
        "financials": false,
        "technical": false,
        "legal": false,
        "references": false,
        "questions": []
      },
      "commitment": {
        "committed": false,
        "amount": 0,
        "terms": ""
      }
    }
  ],
  "materials": {
    "deck": {
      "version": "v3.2",
      "lastUpdated": "2026-06-01",
      "slides": 15,
      "narrativeArc": [
        "Problem: Data collaboration is broken",
        "Solution: API-first collaboration platform",
        "Traction: $600k ARR, 25 customers, 3x YoY",
        "Market: $5B TAM in data tools",
        "Product: Demo + roadmap",
        "Team: Experienced founders",
        "Ask: $2M seed to scale"
      ],
      "feedback": [
        "More customer logos on traction slide",
        "Clarify competitive differentiation",
        "Add unit economics slide"
      ]
    },
    "dataRoom": {
      "created": true,
      "sections": ["Financials", "Legal", "Product", "Team", "Customers"],
      "lastUpdated": "2026-06-01"
    }
  },
  "metrics": {
    "targetInvestors": 50,
    "contacted": 30,
    "meetings": 12,
    "pitches": 5,
    "termSheets": 0,
    "committed": 0,
    "totalCommitted": 0,
    "conversion": {
      "outreachToMeeting": 40,
      "meetingToPitch": 42,
      "pitchToTermSheet": 0,
      "termSheetToClose": 0
    }
  },
  "strategy": {
    "narrative": "Built API-first data platform that enterprises love. Traction proving PMF. Raising to scale GTM.",
    "momentum": [
      "3 enterprise customers in 60 days",
      "120% NRR",
      "$600k ARR",
      "Team from DataCorp and CloudPlatform"
    ],
    "objections": [
      {
        "objection": "How do you compete with incumbents?",
        "response": "API-first approach vs their legacy UI. 10x faster implementation."
      }
    ],
    "leadTarget": ["Acme Ventures", "Data Capital", "Platform Fund"],
    "signalInvestors": ["AngelList syndicate", "Operator angels"],
    "followOn": ["Top-tier Series A funds observing"],
    "alternatives": [
      {
        "scenario": "If we don't get lead by Aug 1",
        "trigger": "No term sheets by July 31",
        "action": "Pivot to bridge round, focus on profitability"
      }
    ]
  }
}
```

## Agent Instructions

### When to Generate
- When planning a fundraising round
- Weekly during active fundraising
- After each investor interaction
- For fundraising strategy review

### How to Populate

1. **Read company.os state**:
   - Financial metrics from `company.os.snapshot`
   - Financial model from finance department
   - Traction metrics from sales/product
   - Strategic plan from strategy department

2. **Define round parameters**:
   - Calculate amount needed based on financial model
   - Set valuation based on traction and comps
   - Define use of funds tied to strategic plan
   - Set timeline based on current runway

3. **Build investor pipeline**:
   - Research investors by thesis fit
   - Track all interactions and sentiment
   - Manage follow-ups and next steps
   - Monitor conversion funnel

4. **Prepare materials**:
   - Maintain current pitch deck
   - Keep data room updated
   - Prepare financial projections
   - Draft investment memo

5. **Track metrics**:
   - Measure conversion rates
   - Monitor velocity through funnel
   - Track committed capital
   - Identify bottlenecks

6. **Develop strategy**:
   - Craft compelling narrative
   - Prepare for objections
   - Identify lead targets
   - Plan alternatives if round struggles

### What to Write

Write fundraising state to finance memory:
```
company.os.departments['finance'].memory.fundraising
```

Track investor pipeline:
```
company.os.departments['finance'].memory.investorPipeline
```

### Events to Emit

When investor moves stages:
```typescript
{
  type: 'investor-stage-change',
  timestamp: Date.now(),
  payload: {
    investorId: 'inv-001',
    investor: 'Acme Ventures',
    fromStage: 'intro',
    toStage: 'meeting',
    sentiment: 'positive'
  }
}
```

When commitment received:
```typescript
{
  type: 'investment-committed',
  timestamp: Date.now(),
  payload: {
    investor: 'Acme Ventures',
    amount: 500000,
    totalCommitted: 1200000,
    targetAmount: 2000000
  }
}
```

When round closes:
```typescript
{
  type: 'round-closed',
  timestamp: Date.now(),
  payload: {
    stage: 'seed',
    amount: 2000000,
    valuation: 10000000,
    lead: 'Acme Ventures',
    closeDate: '2026-08-15'
  }
}
```

### Notes

- Fundraising is a sales process - track like a sales pipeline
- Warm intros convert 3-5x better than cold outreach
- Lead investor matters more than total amount
- Materials should tell compelling narrative, not just facts
- Track investor feedback to improve pitch
- Plan for "no" - have alternatives ready
- Fundraising takes 3-6 months - start early
- This is structured data for process management, not a narrative document
