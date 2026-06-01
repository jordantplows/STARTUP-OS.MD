---
template: vendor-review
used-by: [operations, finance]
produces: company.os.departments['operations'].memory.vendorReviews[]
---

## Purpose

Vendor evaluation and review assessing capabilities, cost, security, and fit.

## Schema

```typescript
interface VendorReview {
  id: string;
  vendor: {name: string, category: string, website: string};
  reviewDate: string;
  status: "evaluating" | "approved" | "rejected" | "contracted";
  
  useCases: string;
  
  capabilities: Array<{
    capability: string;
    rating: 1 | 2 | 3 | 4 | 5;
    notes: string;
  }>;
  
  pricing: {
    model: string;
    cost: number;
    billingFrequency: string;
    commitment: string;
  };
  
  security: {
    soc2: boolean;
    gdpr: boolean;
    dataResidency: string;
    concerns: string[];
  };
  
  integration: {
    apis: boolean;
    complexity: "low" | "medium" | "high";
    effort: string;
  };
  
  support: {
    availability: string;
    responsiveness: string;
    documentation: string;
  };
  
  pros: string[];
  cons: string[];
  
  alternatives: Array<{
    vendor: string;
    comparison: string;
  }>;
  
  recommendation: {
    decision: "approve" | "reject" | "reevaluate";
    reasoning: string;
  };
}
```

## Agent Instructions

Vendor reviews guide procurement. Assess capabilities against needs, evaluate pricing and terms, verify security and compliance, test integration complexity, compare alternatives.

