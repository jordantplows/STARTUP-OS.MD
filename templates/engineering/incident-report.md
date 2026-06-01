---
template: incident-report
used-by: [departments/engineering, executives/cto]
produces: company.os.departments['engineering'].memory.incidents[]
---

## Purpose

Incident postmortem documenting what happened, impact, root cause, timeline, and prevention measures.

## Schema

```typescript
interface IncidentReport {
  id: string;
  title: string;
  severity: "sev1" | "sev2" | "sev3" | "sev4";
  status: "investigating" | "resolved" | "closed";
  
  summary: {
    what: string;                  // What happened
    impact: string;                // User/business impact
    duration: {
      start: string;               // ISO datetime
      end: string;
      totalMinutes: number;
    };
  };
  
  timeline: Array<{
    time: string;
    event: string;
    actor: string;                 // Person or system
  }>;
  
  impact: {
    usersAffected: number;
    customersAffected: string[];
    revenueImpact: number;
    dataLoss: boolean;
    externallyVisible: boolean;
  };
  
  rootCause: {
    immediate: string;             // Proximate cause
    underlying: string;            // Systemic cause
    contributingFactors: string[];
  };
  
  detection: {
    how: string;                   // How was incident detected
    delay: number;                 // Minutes to detection
    alertsFired: string[];
  };
  
  resolution: {
    fix: string;                   // How was it resolved
    rollback: boolean;
    workaround: string;
  };
  
  preventionMeasures: Array<{
    action: string;
    type: "process" | "technical" | "monitoring";
    owner: string;
    dueDate: string;
    status: "todo" | "in-progress" | "done";
  }>;
  
  lessonsLearned: string[];
}
```

## Agent Instructions

Incident reports prevent recurrence. Document timeline from detection to resolution, identify root cause not just symptoms, quantify impact, define concrete prevention measures with owners and deadlines.

