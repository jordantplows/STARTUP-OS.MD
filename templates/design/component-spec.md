---
template: component-spec
used-by: [design/ui-designer, design/design-systems-engineer]
produces: company.os.departments['design'].memory.components[]
---

## Purpose

UI component specification defining behavior, states, props, and implementation details.

## Schema

```typescript
interface ComponentSpec {
  id: string;
  name: string;
  category: "atoms" | "molecules" | "organisms";
  status: "draft" | "review" | "approved" | "implemented";
  
  purpose: string;
  useCases: string[];
  
  variants: Array<{
    name: string;
    description: string;
    props: Record<string, any>;
  }>;
  
  states: string[];                // hover, focus, disabled, loading, error
  
  behavior: {
    interactions: string[];
    accessibility: string[];       // ARIA labels, keyboard nav
    responsive: string;            // Mobile/tablet/desktop behavior
  };
  
  implementation: {
    figmaUrl: string;
    codeLocation: string;
    dependencies: string[];
  };
}
```

## Agent Instructions

Component specs bridge design and engineering. Define all variants and states, specify accessibility requirements, document responsive behavior, link to design files and code.

