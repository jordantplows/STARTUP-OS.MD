---
template: kpi-dashboard
used-by: [metrics, executives/ceo]
produces: company.os.departments['metrics'].memory.kpiDashboard
---

## Purpose

KPI dashboard defining key metrics, targets, current values, and trends.

## Schema

```typescript
interface KPIDashboard {
  lastUpdated: string;
  
  northStar: {
    metric: string;
    current: number;
    target: number;
    trend: "up" | "down" | "flat";
  };
  
  categories: Array<{
    category: "revenue" | "growth" | "engagement" | "efficiency";
    metrics: Array<{
      metric: string;
      current: number;
      target: number;
      unit: string;
      trend: "up" | "down" | "flat";
      change: number;              // % change from last period
      status: "green" | "yellow" | "red";
    }>;
  }>;
  
  cohorts: Array<{
    cohort: string;
    metric: string;
    values: Array<{period: string, value: number}>;
  }>;
}
```

## Agent Instructions

KPI dashboards track progress. Define north star metric, organize metrics by category, set targets and status thresholds, track trends and period-over-period changes.

