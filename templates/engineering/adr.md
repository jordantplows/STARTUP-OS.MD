---
template: adr
used-by: [departments/engineering, executives/cto]
produces: company.os.departments['engineering'].memory.adrs[]
---

## Purpose

Architecture Decision Record documenting significant technical decisions, context, options considered, and rationale.

## Schema

```typescript
interface ADR {
  id: string;                      // "adr-001"
  title: string;
  status: "proposed" | "accepted" | "rejected" | "deprecated" | "superseded";
  date: string;
  deciders: string[];              // Who made the decision
  
  context: {
    problem: string;               // What decision needed to be made
    forces: string[];              // Constraints and considerations
  };
  
  decision: string;                // What was decided
  
  options: Array<{
    option: string;
    pros: string[];
    cons: string[];
    cost: string;                  // Time/money/complexity cost
  }>;
  
  rationale: string;               // Why this option was chosen
  
  consequences: {
    positive: string[];
    negative: string[];
    risks: string[];
  };
  
  implementation: {
    effort: string;
    timeline: string;
    dependencies: string[];
  };
  
  relatedDecisions: string[];      // Other ADR IDs
  supersededBy?: string;           // ADR ID if deprecated
}
```

## Agent Instructions

ADRs document why decisions were made. Capture context and constraints, list options considered with pros/cons, explain rationale clearly, document consequences and risks.

