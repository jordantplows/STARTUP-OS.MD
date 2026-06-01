---
template: investor-questions
used-by: [red-team, executives/ceo]
produces: company.os.redTeam.memory.investorQuestions
---

## Purpose

Hardest investor questions with prepared answers for fundraising.

## Schema

```typescript
interface InvestorQuestions {
  lastUpdated: string;
  
  questions: Array<{
    category: "market" | "product" | "traction" | "team" | "competition" | "business-model";
    question: string;
    difficulty: "gotcha" | "hard" | "standard";
    
    answer: {
      response: string;
      backup: string[];            // Supporting data/examples
      redirectTo: string;          // Strength to pivot toward
    };
    
    redFlags: string[];            // If you can't answer well
  }>;
}
```

## Example

```json
{
  "category": "market",
  "question": "Why hasn't Autodesk already built this?",
  "difficulty": "gotcha",
  "answer": {
    "response": "Autodesk sells to architects, but planning departments are the customer for permit submission. Autodesk has no relationships or APIs with cities. We have 8 city integrations that took 18 months to build—that's our moat.",
    "backup": [
      "Autodesk focus is design tools, not government workflows",
      "City API access requires government relationships",
      "Our founder is ex-city planner with 30+ planning dept connections"
    ],
    "redirectTo": "We're building a two-sided network: more cities → more firms → more cities"
  },
  "redFlags": ["If you say 'we'll execute better' or 'they're slow'"]
}
```

## Agent Instructions

Investor questions prepare for skepticism. Anticipate hard questions, draft confident answers with backup data, identify red flags in weak answers, practice pivoting to strengths.

