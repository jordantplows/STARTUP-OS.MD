---
template: sales-playbook
used-by: [departments/sales]
produces: company.os.departments['sales'].memory.playbook
---

## Purpose

Sales playbook defining process, qualification, discovery, demo, objections, and closing.

## Schema

```typescript
interface SalesPlaybook {
  idealCustomerProfile: {
    size: string;
    industry: string[];
    budget: string;
    painPoints: string[];
    buyingProcess: string;
  };
  
  salesProcess: {
    stages: Array<{
      name: string;
      entryFields: string[];
      exitCriteria: string[];
      avgDuration: number;
    }>;
  };
  
  qualification: {
    framework: string;             // BANT, MEDDIC, etc.
    questions: string[];
    disqualifiers: string[];
  };
  
  discovery: {
    questions: Array<{
      question: string;
      why: string;
    }>;
    painPoints: string[];
  };
  
  demo: {
    flow: string[];
    customization: string;
    dontShow: string[];
  };
  
  objections: Array<{
    objection: string;
    response: string;
    proof: string;
  }>;
  
  closing: {
    signals: string[];
    techniques: string[];
  };
  
  pricing: {
    tiers: Array<{name: string, price: number, features: string[]}>;
    discounting: {max: number, approval: string};
  };
}
```

## Agent Instructions

Sales playbooks standardize process. Define ICP and qualification criteria, script discovery questions, outline demo flow, prep objection responses, document closing techniques and pricing authority.

