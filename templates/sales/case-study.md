---
template: case-study
used-by: [sales, marketing]
produces: company.os.departments['sales'].memory.caseStudies[]
---

## Purpose

Customer case study showcasing problem, solution, results with quotes and metrics.

## Schema

```typescript
interface CaseStudy {
  id: string;
  customer: {name: string, industry: string, size: string, logo: string};
  published: string;
  
  challenge: {
    situation: string;
    painPoints: string[];
    attempts: string;              // What they tried before
  };
  
  solution: {
    why: string;                   // Why they chose you
    implementation: string;
    features: string[];
  };
  
  results: {
    metrics: Array<{
      metric: string;
      before: string;
      after: string;
      improvement: string;
    }>;
    qualitative: string[];
  };
  
  quotes: Array<{
    text: string;
    name: string;
    title: string;
  }>;
  
  callout: {
    statistic: string;
    label: string;
  };
}
```

## Agent Instructions

Case studies prove value. Tell story of customer challenge and impact, explain why they chose you, showcase quantified results with before/after metrics, include compelling customer quotes.

