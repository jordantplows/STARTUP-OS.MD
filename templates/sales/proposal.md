---
template: proposal
used-by: [sales]
produces: company.os.departments['sales'].memory.proposals[]
---

## Purpose

Sales proposal document with customer context, solution, pricing, ROI, and terms.

## Schema

```typescript
interface Proposal {
  id: string;
  customer: {name: string, contact: string, industry: string};
  date: string;
  validUntil: string;
  
  executiveSummary: string;
  
  situation: {
    challenges: string[];
    impact: string;
  };
  
  solution: {
    overview: string;
    features: Array<{name: string, benefit: string}>;
    implementation: string;
  };
  
  roi: {
    timeSavings: string;
    costSavings: string;
    paybackPeriod: string;
  };
  
  pricing: {
    tier: string;
    price: number;
    billingFrequency: string;
    contract: string;
    discount?: {amount: number, reason: string};
  };
  
  timeline: {
    kickoff: string;
    goLive: string;
    milestones: Array<{name: string, date: string}>;
  };
  
  terms: {
    paymentTerms: string;
    supportLevel: string;
    contractLength: string;
  };
  
  nextSteps: string[];
}
```

## Agent Instructions

Proposals close deals. Summarize customer challenges and impact, map solution features to benefits, calculate ROI with customer numbers, present pricing clearly, outline implementation timeline.

