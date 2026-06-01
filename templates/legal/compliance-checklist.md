---
template: compliance-checklist
used-by: [departments/legal, departments/security]
produces: company.os.departments['legal'].memory.complianceChecklists[]
---

## Purpose

Compliance checklist tracking requirements and status for regulations (GDPR, SOC 2, HIPAA, etc).

## Schema

```typescript
interface ComplianceChecklist {
  id: string;
  regulation: string;              // GDPR, SOC 2, HIPAA, CCPA
  lastReviewed: string;
  certificationStatus: "not-started" | "in-progress" | "certified";
  
  requirements: Array<{
    id: string;
    requirement: string;
    control: string;
    status: "complete" | "in-progress" | "not-started";
    evidence: string[];
    owner: string;
    dueDate: string;
    notes: string;
  }>;
  
  gaps: Array<{
    gap: string;
    remediation: string;
    priority: "high" | "medium" | "low";
  }>;
  
  audit: {
    lastAudit: string;
    nextAudit: string;
    auditor: string;
  };
}
```

## Agent Instructions

Compliance checklists track progress. List all requirements for regulation, track status and evidence, identify gaps with remediation plans, schedule audits.

