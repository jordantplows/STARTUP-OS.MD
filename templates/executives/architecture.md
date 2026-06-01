---
template: technical-architecture
used-by: [executives/cto, engineering/architecture, engineering/staff-engineer]
produces: company.os.departments['engineering'].memory.architecture
---

## Purpose

Technical architecture blueprint defining system design, technology choices, scalability plan, and engineering principles.

## Schema

```typescript
interface TechnicalArchitecture {
  lastUpdated: string;             // ISO date
  version: string;                 // Architecture version
  
  overview: {
    description: string;           // High-level architecture summary
    principles: Array<{
      principle: string;
      rationale: string;
      implications: string[];
    }>;
    
    constraints: Array<{
      constraint: string;          // Technical or business constraint
      impact: string;              // How it affects architecture
      mitigation: string;          // How we work within it
    }>;
    
    decisions: Array<{
      decision: string;            // Key architectural decision
      alternatives: string[];      // Options considered
      chosen: string;              // What we chose
      rationale: string;           // Why we chose it
      tradeoffs: string[];         // What we gave up
      revisitTrigger: string;      // When to reconsider
    }>;
  };
  
  stack: {
    frontend: {
      framework: string;
      language: string;
      libraries: string[];
      buildTool: string;
      testing: string[];
      rationale: string;
    };
    
    backend: {
      language: string;
      framework: string;
      runtime: string;
      libraries: string[];
      testing: string[];
      rationale: string;
    };
    
    data: {
      primary: string;             // Primary database
      cache: string;
      queue: string;
      search: string;
      analytics: string;
      rationale: Record<string, string>;
    };
    
    infrastructure: {
      cloud: string;               // AWS | GCP | Azure
      orchestration: string;       // K8s | ECS | etc.
      cicd: string;
      monitoring: string[];
      logging: string;
      rationale: string;
    };
    
    thirdParty: Array<{
      service: string;
      purpose: string;
      criticalPath: boolean;
      alternatives: string[];
      cost: string;
    }>;
  };
  
  system: {
    components: Array<{
      name: string;
      type: "service" | "library" | "database" | "queue" | "frontend";
      responsibility: string;
      technology: string;
      
      interfaces: Array<{
        type: "api" | "queue" | "database" | "event";
        protocol: string;
        consumers: string[];
        sla: string;
      }>;
      
      dependencies: string[];
      dataflow: string;
      scaling: string;
      
      metrics: {
        requests: string;
        latency: string;
        errors: string;
        saturation: string;
      };
    }>;
    
    dataModel: {
      domains: Array<{
        domain: string;
        entities: string[];
        relationships: string;
        ownership: string;
      }>;
      
      storage: Array<{
        entity: string;
        database: string;
        partitioning: string;
        retention: string;
      }>;
    };
    
    integration: Array<{
      integration: string;
      type: "sync" | "async" | "batch";
      protocol: string;
      frequency: string;
      failureMode: string;
    }>;
  };
  
  quality: {
    reliability: {
      availability: string;        // Target availability (99.9%)
      rpo: string;                 // Recovery point objective
      rto: string;                 // Recovery time objective
      
      faultTolerance: Array<{
        failure: string;
        impact: string;
        mitigation: string;
      }>;
      
      disaster: {
        backup: string;
        recovery: string;
        testing: string;
      };
    };
    
    performance: {
      latency: Record<string, string>;  // Target latencies by endpoint
      throughput: Record<string, string>;
      
      optimization: Array<{
        area: string;
        current: string;
        target: string;
        approach: string;
      }>;
    };
    
    security: {
      authentication: string;
      authorization: string;
      encryption: {
        inTransit: string;
        atRest: string;
      };
      
      compliance: string[];        // SOC2, GDPR, HIPAA, etc.
      
      threats: Array<{
        threat: string;
        mitigation: string;
        detection: string;
      }>;
    };
    
    scalability: {
      current: {
        users: number;
        requests: string;
        data: string;
      };
      
      limits: Array<{
        resource: string;
        currentLimit: string;
        maxCapacity: string;
        scalingApproach: string;
      }>;
      
      bottlenecks: Array<{
        bottleneck: string;
        threshold: string;
        solution: string;
        timeline: string;
      }>;
    };
  };
  
  development: {
    practices: {
      workflow: string;            // Git flow, trunk-based, etc.
      review: string;              // Code review process
      testing: string;             // Testing strategy
      deployment: string;          // Deployment process
      monitoring: string;          // How we monitor
    };
    
    standards: Array<{
      area: string;
      standard: string;
      rationale: string;
      enforcement: string;
    }>;
    
    tooling: {
      ide: string[];
      local: string;               // Local development approach
      debugging: string[];
      profiling: string[];
    };
  };
  
  evolution: {
    technical: Array<{
      debt: string;                // Technical debt item
      impact: "high" | "medium" | "low";
      effort: "small" | "medium" | "large";
      priority: number;
      plan: string;
    }>;
    
    roadmap: Array<{
      initiative: string;
      rationale: string;
      timeline: string;
      dependencies: string[];
      risks: string[];
    }>;
    
    migrations: Array<{
      from: string;
      to: string;
      reason: string;
      approach: string;
      timeline: string;
      rollback: string;
    }>;
  };
}
```

## Example

```json
{
  "lastUpdated": "2026-05-31",
  "version": "2.0",
  "overview": {
    "description": "API-first, event-driven microservices architecture on AWS",
    "principles": [
      {
        "principle": "API-first design",
        "rationale": "Our product IS an API - the architecture should reflect this",
        "implications": ["All features exposed as API", "Internal services use same API", "API versioning is critical"]
      },
      {
        "principle": "Eventual consistency",
        "rationale": "Enables horizontal scaling and resilience",
        "implications": ["Design for async", "Handle conflicts", "Idempotent operations"]
      }
    ],
    "decisions": [
      {
        "decision": "Use PostgreSQL as primary datastore",
        "alternatives": ["MongoDB", "DynamoDB", "MySQL"],
        "chosen": "PostgreSQL",
        "rationale": "Strong consistency, JSONB for flexibility, excellent tooling, team expertise",
        "tradeoffs": ["Not as scalable as NoSQL", "More complex sharding"],
        "revisitTrigger": "If we exceed 10TB or need multi-region active-active"
      }
    ]
  },
  "stack": {
    "backend": {
      "language": "TypeScript",
      "framework": "Node.js with Express",
      "runtime": "Node 20 LTS",
      "libraries": ["Prisma ORM", "Bull for queues", "Winston logging"],
      "testing": ["Jest", "Supertest", "Testcontainers"],
      "rationale": "Team expertise, excellent async support, same language as frontend"
    },
    "data": {
      "primary": "PostgreSQL 15",
      "cache": "Redis 7",
      "queue": "Bull (Redis-backed)",
      "search": "Elasticsearch 8",
      "analytics": "ClickHouse",
      "rationale": {
        "primary": "Strong consistency, JSONB, team expertise",
        "cache": "Industry standard, simple, reliable",
        "search": "Full-text search, excellent relevance"
      }
    }
  },
  "system": {
    "components": [
      {
        "name": "API Gateway",
        "type": "service",
        "responsibility": "Authentication, rate limiting, routing",
        "technology": "Node.js/Express",
        "interfaces": [
          {
            "type": "api",
            "protocol": "REST/HTTP",
            "consumers": ["Web app", "Mobile app", "Customer APIs"],
            "sla": "99.9% availability, <100ms p95 latency"
          }
        ],
        "dependencies": ["Auth Service", "Backend Services"],
        "dataflow": "Stateless, routes to backend services",
        "scaling": "Horizontal, autoscale on CPU",
        "metrics": {
          "requests": "requests/sec by endpoint",
          "latency": "p50/p95/p99 by endpoint",
          "errors": "5xx rate, 4xx rate",
          "saturation": "CPU, memory"
        }
      }
    ]
  },
  "quality": {
    "reliability": {
      "availability": "99.9% (8.76 hours downtime/year)",
      "rpo": "15 minutes",
      "rto": "1 hour",
      "disaster": {
        "backup": "Continuous PostgreSQL replication + S3 snapshots every 6 hours",
        "recovery": "Restore from snapshot + replay WAL logs",
        "testing": "Monthly disaster recovery drills"
      }
    },
    "security": {
      "authentication": "JWT tokens with refresh rotation",
      "authorization": "RBAC with policy engine",
      "encryption": {
        "inTransit": "TLS 1.3 for all connections",
        "atRest": "AES-256 for databases and S3"
      },
      "compliance": ["SOC2 Type II", "GDPR"],
      "threats": [
        {
          "threat": "SQL injection",
          "mitigation": "Parameterized queries, ORM, input validation",
          "detection": "WAF rules, query pattern monitoring"
        }
      ]
    },
    "scalability": {
      "current": {
        "users": 500,
        "requests": "1000 req/min",
        "data": "50GB"
      },
      "bottlenecks": [
        {
          "bottleneck": "PostgreSQL write throughput",
          "threshold": "5000 writes/sec",
          "solution": "Implement read replicas, separate analytics queries",
          "timeline": "Q3 2026"
        }
      ]
    }
  },
  "evolution": {
    "technical": [
      {
        "debt": "Monolithic codebase needs service extraction",
        "impact": "high",
        "effort": "large",
        "priority": 1,
        "plan": "Extract payment service Q2, data sync service Q3"
      }
    ],
    "roadmap": [
      {
        "initiative": "Multi-region deployment",
        "rationale": "Enterprise customers need data residency",
        "timeline": "Q4 2026",
        "dependencies": ["Database replication strategy", "Region routing"],
        "risks": ["Increased complexity", "Consistency challenges"]
      }
    ]
  }
}
```

## Agent Instructions

### When to Generate
- During initial system design
- Before major architectural changes
- Quarterly architecture review
- When scaling challenges emerge

### How to Populate

1. **Read company.os state**:
   - Current codebase and infrastructure
   - Product roadmap from product department
   - Scale requirements from growth projections
   - Security requirements from compliance needs

2. **Define principles**:
   - Set 3-5 core architectural principles
   - Tie principles to product strategy
   - Document implications for decisions
   - Identify constraints (technical, business, team)

3. **Choose stack**:
   - Select technologies based on principles
   - Consider team expertise and hiring
   - Document alternatives and tradeoffs
   - Define when to revisit choices

4. **Design system**:
   - Map components and responsibilities
   - Define interfaces and contracts
   - Document dependencies and dataflow
   - Plan for scaling and resilience

5. **Set quality attributes**:
   - Define reliability targets (availability, RTO, RPO)
   - Set performance targets (latency, throughput)
   - Design security controls and compliance
   - Plan scalability approach and limits

6. **Plan evolution**:
   - Identify technical debt with impact/effort
   - Prioritize architectural improvements
   - Plan migrations and timeline
   - Define rollback strategies

### What to Write

Write architecture to engineering memory:
```
company.os.departments['engineering'].memory.architecture
```

Share key decisions with team:
```
company.os.departments['engineering'].memory.adr
```

### Events to Emit

```typescript
{
  type: 'architecture-updated',
  timestamp: Date.now(),
  payload: {
    version: '2.0',
    majorChanges: ['Moved to microservices', 'Added event-driven patterns'],
    migrations: ['Monolith → services Q2-Q3']
  }
}
```

When technical debt prioritized:
```typescript
{
  type: 'tech-debt-prioritized',
  timestamp: Date.now(),
  payload: {
    debt: 'Service extraction',
    impact: 'high',
    timeline: 'Q2-Q3 2026'
  }
}
```

### Notes

- Architecture should serve product strategy, not the reverse
- Good architecture enables velocity, not just correctness
- Document decisions and tradeoffs explicitly (ADRs)
- Plan for evolution - architecture is never "done"
- Set clear quality attributes with measurable targets
- Consider team size and expertise in technology choices
- Scalability planning should align with growth projections
- This is structured data for system design, not a narrative document
