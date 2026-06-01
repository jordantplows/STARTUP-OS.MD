---
template: tech-spec
used-by: [engineering, executives/cto]
produces: company.os.departments['engineering'].memory.techSpecs[]
---

## Purpose

Technical specification detailing implementation approach, architecture, data model, API contracts, and testing strategy.

## Schema

```typescript
interface TechSpec {
  id: string;
  feature: string;
  prdId?: string;
  author: string;
  status: "draft" | "review" | "approved" | "implemented";
  created: string;
  
  overview: {
    summary: string;
    goals: string[];
    nonGoals: string[];
  };
  
  architecture: {
    components: Array<{
      name: string;
      responsibility: string;
      technology: string;
    }>;
    dataFlow: string;              // How data moves through system
    diagram?: string;              // URL or ASCII diagram
  };
  
  dataModel: {
    tables: Array<{
      name: string;
      fields: Array<{
        name: string;
        type: string;
        constraints: string;
      }>;
      indexes: string[];
    }>;
    migrations: string[];          // Migration strategy
  };
  
  apiContracts: Array<{
    endpoint: string;
    method: string;
    request: object;
    response: object;
    errors: Array<{
      code: number;
      description: string;
    }>;
  }>;
  
  security: {
    authentication: string;
    authorization: string;
    dataProtection: string[];
    threatModel: string[];
  };
  
  performance: {
    targets: Array<{
      metric: string;
      target: string;
    }>;
    scalability: string;
  };
  
  testing: {
    unit: string;
    integration: string;
    e2e: string;
    coverage: number;              // Target %
  };
  
  deployment: {
    strategy: string;              // Blue-green, canary, etc.
    rollback: string;
    monitoring: string[];
  };
  
  timeline: {
    phases: Array<{
      phase: string;
      duration: string;
      deliverables: string[];
    }>;
  };
  
  risks: Array<{
    risk: string;
    mitigation: string;
  }>;
  
  openQuestions: Array<{
    question: string;
    owner: string;
  }>;
}
```

## Agent Instructions

Tech specs translate PRDs into implementation plans. Define system architecture and components, specify data model with migrations, document API contracts, set performance and security requirements, plan testing and deployment strategy.

