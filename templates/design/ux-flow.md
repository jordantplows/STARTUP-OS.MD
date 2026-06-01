---
template: ux-flow
used-by: [departments/design/ux-designer]
produces: company.os.departments['design'].memory.flows[]
---

## Purpose

User flow documenting step-by-step journey through a feature or task.

## Schema

```typescript
interface UXFlow {
  id: string;
  feature: string;
  scenario: string;
  persona: string;
  
  steps: Array<{
    id: string;
    screen: string;
    userAction: string;
    systemResponse: string;
    nextStep: string;              // ID of next step
  }>;
  
  alternativePaths: Array<{
    trigger: string;
    steps: string[];               // Alternate flow
  }>;
  
  errorStates: Array<{
    error: string;
    handling: string;
  }>;
  
  entryPoints: string[];
  exitPoints: string[];
}
```

## Agent Instructions

UX flows map the user journey. Start with entry point, document each step with user action and system response, include alternative paths and error handling, show exit points.

