---
template: sop
used-by: [operations]
produces: company.os.departments['operations'].memory.sops[]
---

## Purpose

Standard Operating Procedure documenting repeatable process with steps, roles, and tools.

## Schema

```typescript
interface SOP {
  id: string;
  title: string;
  process: string;
  owner: string;
  lastUpdated: string;
  version: string;
  
  purpose: string;
  scope: string;
  
  roles: Array<{
    role: string;
    responsibilities: string[];
  }>;
  
  prerequisites: string[];
  
  steps: Array<{
    step: number;
    action: string;
    actor: string;
    tools: string[];
    expectedDuration: string;
    successCriteria: string;
  }>;
  
  exceptions: Array<{
    scenario: string;
    handling: string;
  }>;
  
  tools: Array<{
    tool: string;
    purpose: string;
    access: string;
  }>;
  
  metrics: Array<{
    metric: string;
    target: string;
  }>;
  
  relatedDocs: string[];
}
```

## Agent Instructions

SOPs standardize processes. Define purpose and scope, assign roles and responsibilities, document step-by-step actions with tools and duration, handle exceptions, set success metrics.

