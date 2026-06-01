---
template: operations-monitoring
used-by: [executives/coo, operations/*]
produces: company.os.departments['operations'].memory.monitoring
---

## Purpose

Operations monitoring framework tracking systems, processes, vendors, efficiency metrics, and operational health.

## Schema

```typescript
interface OperationsMonitoring {
  lastUpdated: string;             // ISO date
  
  systems: Array<{
    system: string;                // Name of system/tool
    category: "productivity" | "infrastructure" | "security" | "finance" | "hr" | "sales" | "marketing";
    vendor: string;
    purpose: string;
    
    users: {
      total: number;
      active: number;               // Last 30 days
      byDepartment: Record<string, number>;
    };
    
    cost: {
      monthly: number;
      priceModel: string;          // "per-seat" | "usage" | "flat"
      contract: {
        term: string;              // "monthly" | "annual"
        renewal: string;           // ISO date
        cancellationNotice: number; // Days
      };
    };
    
    health: {
      status: "healthy" | "attention" | "critical";
      uptime: number;              // % last 30 days
      issues: string[];
      lastIncident: string;        // ISO date
    };
    
    satisfaction: {
      score: number;               // 1-5
      feedback: string[];
      alternatives: string[];      // What team suggests instead
    };
    
    integration: {
      connectedSystems: string[];
      critical: boolean;           // Is this in critical path?
      dependencies: string[];
      sso: boolean;
      apiAccess: boolean;
    };
    
    compliance: {
      dataProcessing: boolean;     // Does it process customer data?
      soc2: boolean;
      gdpr: boolean;
      reviewed: string;            // ISO date of last security review
    };
  }>;
  
  processes: Array<{
    process: string;
    owner: string;
    category: "hiring" | "onboarding" | "finance" | "sales" | "support" | "engineering";
    
    description: string;
    steps: Array<{
      step: string;
      owner: string;
      duration: string;
      automation: "manual" | "semi-automated" | "automated";
      tools: string[];
    }>;
    
    metrics: {
      frequency: string;           // How often it runs
      volume: number;              // How many per period
      cycleTime: {
        p50: number;               // Median time (days/hours)
        p95: number;
        target: number;
      };
      efficiency: {
        manualHours: number;       // Hours of manual work
        automationPotential: number; // % that could be automated
      };
      quality: {
        errorRate: number;         // % errors/rework
        satisfactionScore: number; // 1-5
      };
    };
    
    issues: Array<{
      issue: string;
      impact: "low" | "medium" | "high";
      frequency: string;
      rootCause: string;
      solution: string;
    }>;
    
    improvements: Array<{
      improvement: string;
      impact: string;              // Expected benefit
      effort: "small" | "medium" | "large";
      priority: number;
      status: "backlog" | "in-progress" | "done";
    }>;
  }>;
  
  vendors: Array<{
    vendor: string;
    category: string;
    services: string[];
    
    financial: {
      monthlySpend: number;
      annualContract: number;
      paymentTerms: string;
      renewalDate: string;         // ISO date
      priceIncreases: string;      // History or expected
    };
    
    relationship: {
      contacts: Array<{
        name: string;
        role: string;
        email: string;
      }>;
      accountManager: string;
      supportTier: string;
      sla: string;
    };
    
    performance: {
      satisfactionScore: number;   // 1-5
      responseTime: string;
      resolutionTime: string;
      incidents: number;           // Last 90 days
      uptime: number;              // %
    };
    
    risk: {
      businessCritical: boolean;
      alternatives: string[];
      switchingCost: "low" | "medium" | "high";
      concerns: string[];
    };
    
    review: {
      lastReviewed: string;        // ISO date
      nextReview: string;          // ISO date
      decision: "renew" | "renegotiate" | "replace" | "cancel";
      notes: string;
    };
  }>;
  
  efficiency: {
    overall: {
      revenuePerEmployee: number;
      operatingMargin: number;     // %
      burnEfficiency: number;      // Net new ARR / burn
      
      trends: {
        quarterlyChange: number;   // %
        trajectory: "improving" | "stable" | "declining";
      };
    };
    
    byDepartment: Record<string, {
      headcount: number;
      cost: number;
      output: string;              // Department-specific metric
      efficiency: number;          // Output per dollar
    }>;
    
    timeAllocation: Record<string, {
      productive: number;          // % time on value-adding work
      overhead: number;            // % time on admin/meetings
      blocked: number;             // % time waiting/blocked
      target: number;              // Target productive %
    }>;
    
    bottlenecks: Array<{
      bottleneck: string;
      department: string;
      impact: string;
      throughput: string;          // Current capacity
      demand: string;              // Current demand
      solution: string;
      timeline: string;
    }>;
  };
  
  automation: Array<{
    opportunity: string;
    process: string;
    currentState: string;          // How it works today
    
    impact: {
      timeSaved: string;           // Hours per week/month
      costSaved: number;           // Annual savings
      qualityImprovement: string;
      speedImprovement: string;
    };
    
    implementation: {
      approach: string;            // How to automate
      tools: string[];
      effort: "small" | "medium" | "large";
      cost: number;
      roi: number;                 // Months to payback
    };
    
    priority: number;
    status: "identified" | "planned" | "in-progress" | "completed";
  }>;
  
  incidents: Array<{
    id: string;
    date: string;                  // ISO date
    system: string;
    severity: "minor" | "major" | "critical";
    
    impact: {
      usersAffected: number;
      downtime: string;            // Duration
      revenue: number;             // Lost revenue
      reputational: string;
    };
    
    resolution: {
      resolvedDate: string;        // ISO date
      rootCause: string;
      fix: string;
      prevention: string;          // How to prevent recurrence
    };
    
    followUp: Array<{
      action: string;
      owner: string;
      deadline: string;
      status: "open" | "in-progress" | "done";
    }>;
  }>;
}
```

## Example

```json
{
  "lastUpdated": "2026-05-31",
  "systems": [
    {
      "system": "Slack",
      "category": "productivity",
      "vendor": "Slack Technologies",
      "purpose": "Team communication and collaboration",
      "users": {
        "total": 12,
        "active": 12,
        "byDepartment": {"Engineering": 6, "Product": 2, "Sales": 2, "Operations": 2}
      },
      "cost": {
        "monthly": 96,
        "priceModel": "per-seat",
        "contract": {"term": "annual", "renewal": "2027-01-15", "cancellationNotice": 30}
      },
      "health": {
        "status": "healthy",
        "uptime": 99.9,
        "issues": [],
        "lastIncident": "2026-03-15"
      },
      "satisfaction": {
        "score": 4,
        "feedback": ["Works well", "Too many channels"],
        "alternatives": []
      },
      "integration": {
        "connectedSystems": ["GitHub", "Linear", "PagerDuty"],
        "critical": true,
        "dependencies": ["SSO via Google"],
        "sso": true,
        "apiAccess": true
      },
      "compliance": {
        "dataProcessing": true,
        "soc2": true,
        "gdpr": true,
        "reviewed": "2026-05-01"
      }
    }
  ],
  "processes": [
    {
      "process": "Engineer Onboarding",
      "owner": "CTO",
      "category": "onboarding",
      "description": "Full onboarding process for new engineering hires from offer accept to productive",
      "steps": [
        {"step": "Ship laptop and access", "owner": "Operations", "duration": "2 days", "automation": "semi-automated", "tools": ["Brex", "Google Admin"]},
        {"step": "First week orientation", "owner": "CTO", "duration": "1 week", "automation": "manual", "tools": ["Notion docs"]},
        {"step": "Pair programming", "owner": "Engineering Lead", "duration": "2 weeks", "automation": "manual", "tools": []}
      ],
      "metrics": {
        "frequency": "Monthly (1-2 new hires)",
        "volume": 2,
        "cycleTime": {"p50": 21, "p95": 30, "target": 14},
        "efficiency": {"manualHours": 40, "automationPotential": 30},
        "quality": {"errorRate": 5, "satisfactionScore": 4}
      },
      "issues": [
        {
          "issue": "Laptop shipping delays cause lost first week",
          "impact": "medium",
          "frequency": "33% of hires",
          "rootCause": "Waiting for approval + shipping time",
          "solution": "Pre-order laptops, keep 2 in stock"
        }
      ],
      "improvements": [
        {
          "improvement": "Automate access provisioning via Okta",
          "impact": "Save 4 hours per hire, reduce errors",
          "effort": "medium",
          "priority": 1,
          "status": "backlog"
        }
      ]
    }
  ],
  "efficiency": {
    "overall": {
      "revenuePerEmployee": 50000,
      "operatingMargin": -90,
      "burnEfficiency": 1.5,
      "trends": {"quarterlyChange": 15, "trajectory": "improving"}
    },
    "bottlenecks": [
      {
        "bottleneck": "Engineering velocity",
        "department": "Engineering",
        "impact": "Blocking $120k ARR in sales pipeline",
        "throughput": "2 features per quarter",
        "demand": "5 features per quarter",
        "solution": "Hire 2 senior engineers",
        "timeline": "Q2-Q3 2026"
      }
    ]
  },
  "automation": [
    {
      "opportunity": "Automate customer onboarding checklist",
      "process": "Customer onboarding",
      "currentState": "Manual checklist in Notion, copy-paste for each customer",
      "impact": {
        "timeSaved": "5 hours per week",
        "costSaved": 15000,
        "qualityImprovement": "Consistent experience, no missed steps",
        "speedImprovement": "50% faster onboarding"
      },
      "implementation": {
        "approach": "Build workflow automation in Customer.io",
        "tools": ["Customer.io", "Zapier", "Notion API"],
        "effort": "small",
        "cost": 2000,
        "roi": 2
      },
      "priority": 1,
      "status": "planned"
    }
  ]
}
```

## Agent Instructions

### When to Generate
- Weekly for system health monitoring
- Monthly for process efficiency review
- Quarterly for vendor review
- When incidents occur

### How to Populate

1. **Read company.os state**:
   - Current systems from `company.os.integrations`
   - Financial data from finance department
   - Team feedback from people/surveys
   - Usage data from system APIs

2. **Monitor systems**:
   - Track active users by system
   - Calculate cost per user
   - Monitor uptime and incidents
   - Collect user satisfaction feedback

3. **Analyze processes**:
   - Map key operational processes
   - Measure cycle time and efficiency
   - Identify bottlenecks and issues
   - Prioritize improvement opportunities

4. **Review vendors**:
   - Track spending by vendor
   - Monitor performance and SLAs
   - Assess business criticality
   - Plan renewal decisions

5. **Measure efficiency**:
   - Calculate revenue per employee
   - Track time allocation (productive vs overhead)
   - Identify departmental bottlenecks
   - Monitor trends over time

6. **Identify automation**:
   - Find repetitive manual processes
   - Calculate ROI of automation
   - Prioritize by impact and effort
   - Track implementation status

### What to Write

Write monitoring state to operations memory:
```
company.os.departments['operations'].memory.monitoring
```

Update system health in snapshot:
```
company.os.snapshot.systemHealth
```

### Events to Emit

When system goes down:
```typescript
{
  type: 'system-incident',
  timestamp: Date.now(),
  payload: {
    system: 'Slack',
    severity: 'major',
    usersAffected: 12,
    status: 'investigating'
  }
}
```

When process bottleneck identified:
```typescript
{
  type: 'bottleneck-identified',
  timestamp: Date.now(),
  payload: {
    process: 'Engineering velocity',
    impact: 'Blocking $120k ARR',
    solution: 'Hire 2 engineers'
  }
}
```

When automation opportunity found:
```typescript
{
  type: 'automation-opportunity',
  timestamp: Date.now(),
  payload: {
    opportunity: 'Customer onboarding',
    timeSaved: '5 hours/week',
    roi: 2
  }
}
```

### Notes

- Operations health directly impacts team velocity
- Track not just cost but value per system
- Good processes scale, bad processes slow you down
- Automate repetitive work before hiring for it
- Vendor consolidation can reduce complexity and cost
- Bottlenecks are where to focus - find and fix them
- Measure efficiency to know where to invest
- This is structured data for operational health, not a narrative document
