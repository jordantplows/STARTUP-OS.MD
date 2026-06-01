---
template: brand-positioning
used-by: [executives/ceo, executives/cmo, brand/strategy, marketing/brand]
produces: company.os.departments['brand'].memory.positioning
---

## Purpose

Brand positioning framework defining market category, differentiation, target customer, and messaging architecture.

## Schema

```typescript
interface BrandPositioning {
  lastUpdated: string;             // ISO date
  
  foundation: {
    mission: string;               // Why we exist
    vision: string;                // Where we're going (3-5 years)
    values: Array<{
      value: string;
      definition: string;
      behaviors: string[];
    }>;
    
    purpose: {
      functional: string;          // What we do
      emotional: string;           // How we make people feel
      aspirational: string;        // Who we help people become
    };
  };
  
  category: {
    primary: string;               // What category we compete in
    categoryDefinition: string;    // How we define the category
    
    positioning: "leader" | "challenger" | "niche-specialist" | "category-creator";
    positioningStatement: string;  // For [target], we are the [category] that [benefit] because [reason]
    
    alternatives: Array<{
      alternative: string;         // What customers do today
      limitations: string[];       // Why it's inadequate
      ourAdvantage: string;        // How we're better
    }>;
  };
  
  target: {
    icp: {                         // Ideal Customer Profile
      segment: string;             // SMB | Mid-market | Enterprise
      industry: string[];
      size: string;                // Team size, revenue, etc.
      geography: string[];
      technographic: string[];     // What tech they use
    };
    
    persona: {                     // Primary buyer persona
      role: string;                // Title
      level: string;               // IC | Manager | Director | VP | C-level
      responsibilities: string[];
      goals: string[];
      challenges: string[];
      motivations: string[];
      fears: string[];
    };
    
    buyingProcess: {
      trigger: string;             // What starts the search
      journey: Array<{
        stage: string;
        questions: string[];
        content: string[];
      }>;
      stakeholders: string[];
      decision: string;            // How they decide
      timeline: string;            // How long it takes
    };
  };
  
  differentiation: {
    uniqueValue: string;           // The one thing we do that no one else can
    
    pillars: Array<{
      pillar: string;              // Dimension of differentiation
      claim: string;               // What we claim
      proof: string[];             // How we prove it
      competitors: string;         // How competitors fall short
    }>;
    
    moat: {
      type: "technology" | "network-effects" | "brand" | "cost" | "data" | "switching-costs";
      description: string;
      defensibility: "weak" | "moderate" | "strong";
      buildingPlan: string;
    };
  };
  
  messaging: {
    tagline: string;               // 5-10 words
    
    headline: string;              // Homepage hero headline
    subheadline: string;           // Supporting headline
    
    elevator: {
      fifteen: string;             // 15-second version
      thirty: string;              // 30-second version
      sixty: string;               // 60-second version
    };
    
    keyMessages: Array<{
      audience: string;            // Who this is for
      message: string;             // What to say
      proof: string[];             // How to prove it
      cta: string;                 // What we want them to do
    }>;
    
    narrative: {
      problem: string;             // The problem we solve
      impact: string;              // Why it matters
      solution: string;            // How we solve it
      unique: string;              // Why we're different
      proof: string;               // Evidence it works
      vision: string;              // Where this leads
    };
  };
  
  personality: {
    voice: {
      adjectives: string[];        // How we sound
      tone: string;                // Overall tone
      avoid: string[];             // What NOT to sound like
    };
    
    archetype: string;             // Brand archetype (Hero, Sage, etc.)
    
    characteristics: Array<{
      dimension: string;           // Personality dimension
      spectrum: [string, string];  // [left, right] endpoints
      position: number;            // 1-10 where we sit
      examples: string[];
    }>;
  };
  
  visual: {
    description: string;           // Visual identity direction
    moodboards: string[];          // References
    keywords: string[];            // Visual keywords
    avoid: string[];               // What to avoid visually
  };
  
  competitive: {
    competitors: Array<{
      name: string;
      category: "direct" | "indirect" | "alternative";
      positioning: string;
      strengths: string[];
      weaknesses: string[];
      ourDifferentiation: string;
    }>;
    
    matrix: Array<{
      axis1: string;               // Horizontal axis
      axis2: string;               // Vertical axis
      ourPosition: {x: number, y: number};
      competitors: Array<{
        name: string;
        position: {x: number, y: number};
      }>;
    }>;
  };
}
```

## Example

```json
{
  "lastUpdated": "2026-05-31",
  "foundation": {
    "mission": "Make data collaboration as easy as email",
    "vision": "The standard way teams share and work with data across companies",
    "values": [
      {
        "value": "Simplicity",
        "definition": "Complex problems deserve simple solutions",
        "behaviors": ["Choose fewer features over more", "Default to clarity", "Remove friction"]
      }
    ],
    "purpose": {
      "functional": "We connect teams to work with data across systems",
      "emotional": "We eliminate frustration and enable confidence",
      "aspirational": "We help teams become data-first without becoming data experts"
    }
  },
  "category": {
    "primary": "Data Collaboration Platform",
    "categoryDefinition": "Tools that enable teams to securely share, transform, and act on data across organizational boundaries",
    "positioning": "category-creator",
    "positioningStatement": "For data teams at B2B companies, we are the data collaboration platform that enables secure external data sharing because we're API-first and built for developers.",
    "alternatives": [
      {
        "alternative": "Email CSV files back and forth",
        "limitations": ["Insecure", "Manual", "Error-prone", "No audit trail"],
        "ourAdvantage": "Automated, secure, auditable, version-controlled"
      },
      {
        "alternative": "Build custom integrations",
        "limitations": ["Expensive", "Slow", "Maintenance burden"],
        "ourAdvantage": "Ready in hours, not months. We handle the complexity."
      }
    ]
  },
  "target": {
    "icp": {
      "segment": "Mid-market to Enterprise",
      "industry": ["SaaS", "Fintech", "Healthcare", "B2B Services"],
      "size": "50-500 employees",
      "geography": ["North America", "Europe"],
      "technographic": ["Cloud-based", "API-first culture", "Modern data stack"]
    },
    "persona": {
      "role": "Head of Data / Data Engineering Lead",
      "level": "Director",
      "responsibilities": ["Data infrastructure", "Partner integrations", "Compliance"],
      "goals": ["Enable business with data", "Reduce engineering burden", "Maintain security"],
      "challenges": ["Too many custom integrations", "Security concerns", "Limited eng resources"],
      "motivations": ["Ship faster", "Reduce toil", "Enable self-service"],
      "fears": ["Data breach", "Slowing down the business", "Technical debt"]
    }
  },
  "differentiation": {
    "uniqueValue": "API-first data collaboration that developers can integrate in hours, not months",
    "pillars": [
      {
        "pillar": "Speed to Value",
        "claim": "Go from zero to production in under a day",
        "proof": ["5-line code example", "Average customer deploys in 4 hours", "Pre-built connectors"],
        "competitors": "Competitors require weeks of integration work and custom development"
      },
      {
        "pillar": "Built for Developers",
        "claim": "API-first, not UI-first. Code over clicks.",
        "proof": ["Full API coverage", "SDK in 5 languages", "Excellent docs", "Open source examples"],
        "competitors": "Legacy tools are UI-centric, limited APIs, poor developer experience"
      }
    ],
    "moat": {
      "type": "technology",
      "description": "Proprietary data sync engine handles schema evolution and conflict resolution",
      "defensibility": "moderate",
      "buildingPlan": "Patent core sync algorithm, build network effects through connectors"
    }
  },
  "messaging": {
    "tagline": "Data collaboration for developers",
    "headline": "Share data across companies without the engineering burden",
    "subheadline": "API-first platform that connects your data to partners, vendors, and customers in hours, not months.",
    "elevator": {
      "fifteen": "We make data collaboration as easy as email, but secure and automated.",
      "thirty": "We're an API-first platform that lets B2B companies share data with partners securely and automatically. What used to take months of custom integration now takes hours.",
      "sixty": "Companies waste months building custom integrations every time they need to share data with partners. We provide an API-first platform that handles secure data collaboration automatically. Data teams integrate us in hours, then enable their entire company to share data without engineering support. We're currently working with 25 companies in fintech, SaaS, and healthcare."
    },
    "narrative": {
      "problem": "B2B companies spend months building custom integrations every time they need to share data with partners",
      "impact": "This slows down partnerships, blocks revenue, and burns engineering resources on undifferentiated work",
      "solution": "We provide an API-first data collaboration platform that connects companies in hours instead of months",
      "unique": "Built for developers, API-first, handles complex sync scenarios that force others to build custom",
      "proof": "25 companies, average 4-hour integration, handling 10M+ records/day, zero breaches",
      "vision": "Data collaboration becomes infrastructure - ubiquitous, reliable, invisible"
    }
  },
  "personality": {
    "voice": {
      "adjectives": ["Clear", "Confident", "Technical", "Pragmatic", "Human"],
      "tone": "Expert but not condescending. Technical but accessible.",
      "avoid": ["Marketing fluff", "Buzzwords", "Hype", "Corporate speak"]
    },
    "archetype": "The Sage - We demystify complexity and enable mastery"
  },
  "competitive": {
    "competitors": [
      {
        "name": "LegacyCorp",
        "category": "indirect",
        "positioning": "Enterprise data integration platform",
        "strengths": ["Brand recognition", "Sales team", "Enterprise features"],
        "weaknesses": ["Slow", "Expensive", "Poor developer experience", "UI-centric"],
        "ourDifferentiation": "We're API-first and built for speed. They're built for IT procurement."
      }
    ]
  }
}
```

## Agent Instructions

### When to Generate
- During company founding (initial positioning)
- Before major launches or pivots
- Annually for positioning review
- When entering new markets or segments

### How to Populate

1. **Read company.os state**:
   - Strategic plan from strategy department
   - Customer data from sales/product
   - Market research from strategy
   - Competitive intelligence

2. **Define foundation**:
   - Start with mission and vision from strategic plan
   - Define values that guide decisions
   - Articulate functional, emotional, and aspirational purpose

3. **Choose category**:
   - Define what category you compete in
   - Decide: lead existing category or create new one
   - Map alternatives customers use today
   - Show your advantage over alternatives

4. **Target customer**:
   - Define ICP from customer data
   - Build buyer persona from sales insights
   - Map buying process from win/loss analysis
   - Identify key stakeholders and motivations

5. **Differentiate**:
   - Identify unique value (the one thing only you do)
   - Build 2-4 differentiation pillars with proof
   - Define moat and defensibility strategy
   - Show why competitors fall short

6. **Craft messaging**:
   - Write tagline (5-10 words)
   - Develop narrative arc
   - Create elevator pitches (15s/30s/60s)
   - Build key messages by audience

7. **Define personality**:
   - Choose voice characteristics
   - Select brand archetype
   - Map personality dimensions
   - Set visual direction

### What to Write

Write positioning to brand memory:
```
company.os.departments['brand'].memory.positioning
```

Share key messages to marketing:
```
company.os.departments['marketing'].memory.messaging
```

### Events to Emit

```typescript
{
  type: 'positioning-updated',
  timestamp: Date.now(),
  payload: {
    category: 'Data Collaboration Platform',
    target: 'Mid-market data teams',
    uniqueValue: 'API-first, hours not months',
    majorChanges: ['Moved upmarket to enterprise']
  }
}
```

### Notes

- Good positioning is opinionated - it chooses who you're for
- Differentiation must be provable, not aspirational
- Category choice is strategic - lead, challenge, or create
- Messaging should speak to motivations, not just features
- Personality should be distinctive and consistent
- Positioning guides product, marketing, and sales
- Review positioning annually or when market/product changes significantly
- This is structured data for brand direction, not a narrative document
