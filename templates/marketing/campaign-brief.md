---
template: campaign-brief
used-by: [marketing, growth]
produces: company.os.departments['marketing'].memory.campaigns[]
---

## Purpose

Marketing campaign brief defining objective, audience, message, channels, budget, and success metrics.

## Schema

```typescript
interface CampaignBrief {
  id: string;
  name: string;
  type: "launch" | "demand-gen" | "brand" | "retention";
  status: "planning" | "active" | "complete";
  
  objective: {
    goal: string;
    target: string;                // Metric and number
    timeline: {start: string, end: string};
  };
  
  audience: {
    segment: string;
    size: number;
    characteristics: string[];
  };
  
  message: {
    headline: string;
    value: string;
    cta: string;
  };
  
  channels: Array<{
    channel: string;
    tactics: string[];
    budget: number;
  }>;
  
  budget: {
    total: number;
    allocation: Record<string, number>;
  };
  
  creative: {
    assets: string[];
    messaging: string[];
  };
  
  metrics: {
    primary: string;
    secondary: string[];
  };
}
```

## Agent Instructions

Campaign briefs align marketing execution. Define clear objective and measurable target, specify audience and message, allocate budget across channels, set success metrics.

