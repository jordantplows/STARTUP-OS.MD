---
template: email-sequence
used-by: [departments/marketing, departments/sales, departments/growth]
produces: company.os.departments['marketing'].memory.emailSequences[]
---

## Purpose

Email sequence defining drip campaign flow, timing, content, and conversion goals.

## Schema

```typescript
interface EmailSequence {
  id: string;
  name: string;
  trigger: string;                 // What starts this sequence
  audience: string;
  goal: string;
  
  emails: Array<{
    id: string;
    delay: number;                 // Days after previous email
    subject: string;
    preview: string;
    body: string;
    cta: {text: string, url: string};
    exitConditions: string[];      // What stops this sequence
  }>;
  
  metrics: {
    openRate: {target: number, actual: number};
    clickRate: {target: number, actual: number};
    conversionRate: {target: number, actual: number};
  };
}
```

## Agent Instructions

Email sequences nurture leads. Define trigger and audience, write compelling subject lines and preview text, space emails appropriately (2-7 days), include clear CTA, track and optimize metrics.

