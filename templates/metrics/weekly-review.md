---
template: weekly-review
used-by: [departments/metrics, executives/ceo]
produces: company.os.departments['metrics'].memory.weeklyReviews[]
---

## Purpose

Weekly metrics review analyzing performance, anomalies, and insights.

## Schema

```typescript
interface WeeklyReview {
  week: string;
  date: string;
  
  summary: {
    headline: string;
    sentiment: "positive" | "neutral" | "concerning";
  };
  
  metrics: Array<{
    metric: string;
    current: number;
    lastWeek: number;
    change: number;
    target: number;
    status: "on-track" | "at-risk" | "off-track";
  }>;
  
  highlights: Array<{
    metric: string;
    observation: string;
    impact: string;
  }>;
  
  concerns: Array<{
    metric: string;
    issue: string;
    cause: string;
    action: string;
  }>;
  
  insights: string[];
  
  nextWeek: {
    focus: string[];
    risks: string[];
  };
}
```

## Agent Instructions

Weekly reviews surface insights. Compare metrics vs last week and targets, identify highlights and concerns, diagnose causes, recommend actions, preview next week focus.

