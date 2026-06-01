---
template: assumption-audit
used-by: [red-team]
produces: company.os.redTeam.memory.assumptionAudits[]
---

## Purpose

Assumption audit challenging core beliefs about market, customers, product, and business model.

## Schema

```typescript
interface AssumptionAudit {
  date: string;
  area: "market" | "product" | "business-model" | "team";
  
  assumptions: Array<{
    assumption: string;
    criticality: "high" | "medium" | "low";
    validated: boolean;
    evidence: string[];
    counterEvidence: string[];
    
    challenge: {
      whatIfWrong: string;
      probability: number;         // % chance this is wrong
      impact: "catastrophic" | "high" | "medium" | "low";
    };
    
    test: {
      howToValidate: string;
      cost: string;
      timeline: string;
      owner: string;
    };
  }>;
  
  criticalRisks: Array<{
    risk: string;
    mitigation: string;
  }>;
}
```

## Agent Instructions

Assumption audits prevent blind spots. List core assumptions, assess criticality and validation, challenge each assumption with "what if wrong", design cheap tests to validate.

