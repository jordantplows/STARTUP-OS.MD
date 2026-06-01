---
template: content-brief
used-by: [departments/marketing, departments/growth]
produces: company.os.departments['marketing'].memory.contentBriefs[]
---

## Purpose

Content brief defining topic, angle, audience, SEO keywords, and distribution plan.

## Schema

```typescript
interface ContentBrief {
  id: string;
  title: string;
  type: "blog" | "guide" | "case-study" | "video" | "podcast";
  status: "draft" | "review" | "published";
  
  objective: {
    goal: string;
    audience: string;
    stage: "awareness" | "consideration" | "decision";
  };
  
  content: {
    angle: string;
    keyTakeaways: string[];
    outline: string[];
    wordCount: number;
  };
  
  seo: {
    primaryKeyword: string;
    secondaryKeywords: string[];
    targetUrl: string;
  };
  
  distribution: {
    channels: string[];
    promotionPlan: string;
  };
  
  metrics: {
    views: number;
    leads: number;
    conversions: number;
  };
}
```

## Agent Instructions

Content briefs guide creation. Define objective and audience stage, choose compelling angle, outline key takeaways, target SEO keywords, plan distribution and promotion.

