---
template: design-brief
used-by: [design/ui-designer, design/ux-designer, design/brand-designer]
produces: company.os.departments['design'].memory.briefs[]
---

## Purpose

Design brief defining direction, goals, constraints, and success criteria for a design project.

## Schema

```typescript
interface DesignBrief {
  id: string;
  project: string;
  type: "product" | "marketing" | "brand";
  created: string;
  designer: string;
  
  objective: {
    what: string;                  // What we're designing
    why: string;                   // Business goal or user need
    success: string[];             // How we'll measure success
  };
  
  audience: {
    primary: string;               // Primary user/audience
    secondary: string[];           // Secondary audiences
    context: string;               // Where/when they'll use this
  };
  
  requirements: {
    functional: string[];          // What it must do
    emotional: string[];           // How it should feel
    constraints: string[];         // Limitations (technical, brand, time)
  };
  
  inspiration: {
    references: Array<{
      url: string;
      why: string;
    }>;
    keywords: string[];            // Design direction keywords
  };
  
  deliverables: Array<{
    item: string;
    format: string;
    dueDate: string;
  }>;
  
  brandGuidelines: {
    colors: string[];
    typography: string[];
    tone: string;
  };
}
```

## Agent Instructions

Design briefs guide the creative process. Read from product PRDs and brand guidelines, define clear objectives and constraints, provide inspiration without over-specifying, set measurable success criteria.

