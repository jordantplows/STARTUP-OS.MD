---
template: risk-assessment
used-by: [legal]
produces: company.os.departments['legal'].memory.riskAssessments[]
---

## Purpose

Legal risk assessment evaluating potential risks, likelihood, impact, and mitigation strategies.

## Schema

```typescript
interface RiskAssessment {
  id: string;
  area: string;                    // Product, contract, compliance, IP
  date: string;
  
  risks: Array<{
    id: string;
    risk: string;
    category: "regulatory" | "contractual" | "ip" | "data" | "employment";
    likelihood: "high" | "medium" | "low";
    impact: "critical" | "high" | "medium" | "low";
    exposure: string;              // Financial or operational impact
    mitigation: {
      actions: string[];
      status: "implemented" | "in-progress" | "planned";
      owner: string;
    };
    residualRisk: "high" | "medium" | "low";
  }>;
  
  recommendations: string[];
  legalReview: {reviewer: string, date: string, approved: boolean};
}
```

## Agent Instructions

Risk assessments prevent legal issues. Identify risks across categories, assess likelihood and impact, recommend mitigation actions with owners, document residual risk after mitigation.

