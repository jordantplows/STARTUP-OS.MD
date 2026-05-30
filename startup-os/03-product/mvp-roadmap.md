# MVP Roadmap

> A phased implementation plan that breaks down the path from concept to launch into manageable milestones.

---

## Overview

This roadmap outlines a 12-week journey to MVP launch, organized into 3 phases of 4 weeks each. Use this to:

- Set realistic expectations with stakeholders about timing
- Coordinate work across product, engineering, design, and go-to-market teams
- Track progress and adjust priorities based on learnings
- Communicate upcoming releases to customers and prospects

**Related documents:**
- `product-spec.md` - Detailed requirements for features on this roadmap
- `feature-prioritization.md` - Framework for deciding what to build when
- `success-metrics.md` - KPIs to track at each stage
- `user-personas.md` - Customer needs that inform prioritization

---

## Roadmap Principles

### How We Prioritize

1. **Customer value first** - Features that solve the biggest pain points (from user-personas.md) get built first
2. **Dependencies matter** - Build foundational capabilities before advanced features
3. **Ship to learn** - Get feedback early and often; perfect is the enemy of good
4. **Technical feasibility** - Balance ideal scope with engineering constraints
5. **Business impact** - Prioritize features that unlock revenue or reduce churn

### How We Ship

- **Weekly releases** - Ship small increments continuously rather than big-bang releases
- **Feature flags** - Launch features to subset of users to validate before broad rollout
- **Beta program** - Get 5-10 design partners using the product before general availability
- **Learn and adapt** - Adjust roadmap based on customer feedback and usage data

---

## 12-Week MVP Timeline

```
Phase 1: Foundation (Weeks 1-4)
├─ Week 1-2: Core Infrastructure & Integrations
└─ Week 3-4: Basic Dashboard & Data Model

Phase 2: Core Features (Weeks 5-8)
├─ Week 5-6: Forecast Engine & Analytics
└─ Week 7-8: User Management & Polish

Phase 3: Beta & Launch (Weeks 9-12)
├─ Week 9-10: Beta Program & Iteration
└─ Week 11-12: Launch Prep & Go-to-Market
```

---

## Phase 1: Foundation (Weeks 1-4)

**Goal:** Build the foundational infrastructure and data pipelines that everything else depends on.

**Success criteria:**
- [ ] Salesforce integration working end-to-end
- [ ] Core data model implemented
- [ ] Basic dashboard displaying real data
- [ ] Internal team can use alpha version

---

### Week 1-2: Core Infrastructure & Integrations

#### Engineering

**Sprint goals:**

- Set up cloud infrastructure (AWS/GCP, CI/CD, environments)
- Build authentication system
- Implement Salesforce OAuth and initial data sync
- Create core database schema

**Key deliverables:**

- [ ] [PLACEHOLDER: E.g., "AWS infrastructure provisioned (VPC, RDS, S3, EC2/ECS)"]
- [ ] [PLACEHOLDER: E.g., "CI/CD pipeline configured (GitHub Actions or CircleCI)"]
- [ ] [PLACEHOLDER: E.g., "Dev, Staging, Prod environments live"]
- [ ] [PLACEHOLDER: E.g., "Auth0 integration complete (email/password + Google SSO)"]
- [ ] [PLACEHOLDER: E.g., "Salesforce OAuth flow working"]
- [ ] [PLACEHOLDER: E.g., "Initial data sync pulls Opportunities, Accounts, Contacts from Salesforce"]
- [ ] [PLACEHOLDER: E.g., "PostgreSQL schema for core entities (Organizations, Users, Deals, Forecasts)"]
- [ ] [PLACEHOLDER: E.g., "Background job system for data sync (Sidekiq, Celery, or similar)"]

**Dependencies:**

- [PLACEHOLDER: E.g., "Need AWS account and credentials from DevOps"]
- [PLACEHOLDER: E.g., "Need Salesforce developer account for testing"]

**Risks:**

- [PLACEHOLDER: E.g., "Salesforce API rate limits may require throttling strategy"]
- [PLACEHOLDER: E.g., "Auth0 setup may take longer than expected if SSO requirements are complex"]

---

#### Product & Design

**Sprint goals:**

- Finalize core user flows and wireframes
- Create design system (colors, typography, components)
- Define product analytics events to track

**Key deliverables:**

- [ ] [PLACEHOLDER: E.g., "Wireframes for MVP features (dashboard, onboarding, settings)"]
- [ ] [PLACEHOLDER: E.g., "Design system documented in Figma (buttons, forms, navigation, etc.)"]
- [ ] [PLACEHOLDER: E.g., "Product analytics plan (what events to track, what tools to use)"]
- [ ] [PLACEHOLDER: E.g., "Usability test plan for alpha testing"]

---

### Week 3-4: Basic Dashboard & Data Model

#### Engineering

**Sprint goals:**

- Build dashboard frontend (React/Vue)
- Implement API layer for dashboard data
- Enhance data sync to handle updates and deletes
- Set up monitoring and logging

**Key deliverables:**

- [ ] [PLACEHOLDER: E.g., "React app scaffolded with routing, state management (Redux/Zustand)"]
- [ ] [PLACEHOLDER: E.g., "Dashboard displays list of deals from Salesforce"]
- [ ] [PLACEHOLDER: E.g., "API endpoints for fetching deals, filtering, sorting"]
- [ ] [PLACEHOLDER: E.g., "Data sync handles incremental updates (not just initial load)"]
- [ ] [PLACEHOLDER: E.g., "Basic error handling and retry logic for sync failures"]
- [ ] [PLACEHOLDER: E.g., "Logging infrastructure (CloudWatch, DataDog, or similar)"]
- [ ] [PLACEHOLDER: E.g., "Application monitoring (error tracking with Sentry or Rollbar)"]

**Dependencies:**

- [PLACEHOLDER: E.g., "Requires Week 1-2 infrastructure and auth to be complete"]

**Risks:**

- [PLACEHOLDER: E.g., "Performance issues if dealing with large data sets (50K+ opportunities)"]

---

#### Product & Design

**Sprint goals:**

- Design high-fidelity mockups for dashboard
- Set up analytics tracking (Segment, Amplitude, Mixpanel)
- Prepare alpha test plan and documentation

**Key deliverables:**

- [ ] [PLACEHOLDER: E.g., "High-fidelity dashboard mockups in Figma"]
- [ ] [PLACEHOLDER: E.g., "Interactive prototype for user testing"]
- [ ] [PLACEHOLDER: E.g., "Analytics events instrumented in code"]
- [ ] [PLACEHOLDER: E.g., "Alpha test plan: goals, participants, scenarios, success criteria"]
- [ ] [PLACEHOLDER: E.g., "Internal documentation for alpha testers (how to use, what to test)"]

---

#### Phase 1 Milestones

**End of Week 2:**
- [ ] [PLACEHOLDER: E.g., "Infrastructure complete, team can deploy code to all environments"]
- [ ] [PLACEHOLDER: E.g., "Salesforce connection working, initial data sync functional"]

**End of Week 4:**
- [ ] [PLACEHOLDER: E.g., "Alpha version ready for internal testing"]
- [ ] [PLACEHOLDER: E.g., "Dashboard displays real data from Salesforce"]
- [ ] [PLACEHOLDER: E.g., "Internal team completes alpha test and provides feedback"]

---

## Phase 2: Core Features (Weeks 5-8)

**Goal:** Build the core product features that deliver primary customer value.

**Success criteria:**
- [ ] Forecast engine calculates and displays predictions
- [ ] Deal health scoring identifies at-risk opportunities
- [ ] User management allows team collaboration
- [ ] Ready to invite beta customers

---

### Week 5-6: Forecast Engine & Analytics

#### Engineering

**Sprint goals:**

- Build forecast calculation engine
- Implement forecast dashboard with drill-down
- Add analytics and reporting capabilities
- Optimize performance for large datasets

**Key deliverables:**

- [ ] [PLACEHOLDER: E.g., "Forecast algorithm calculates expected revenue based on opportunity stage, historical close rates, and deal age"]
- [ ] [PLACEHOLDER: E.g., "Forecast displayed on dashboard with confidence intervals"]
- [ ] [PLACEHOLDER: E.g., "Users can drill down into forecast to see underlying deals"]
- [ ] [PLACEHOLDER: E.g., "Forecast updates automatically when Salesforce data changes"]
- [ ] [PLACEHOLDER: E.g., "Historical forecast tracking (store daily snapshots for trending)"]
- [ ] [PLACEHOLDER: E.g., "Deal health scoring algorithm flags at-risk deals based on activity, age, stage progression"]
- [ ] [PLACEHOLDER: E.g., "At-risk deals highlighted on dashboard with reasons (e.g., 'No activity in 14 days')"]
- [ ] [PLACEHOLDER: E.g., "Performance optimizations: caching, database indexing, query optimization"]

**Dependencies:**

- [PLACEHOLDER: E.g., "Requires Phase 1 data sync and dashboard to be complete"]

**Risks:**

- [PLACEHOLDER: E.g., "Forecast accuracy may need tuning based on real customer data"]
- [PLACEHOLDER: E.g., "Performance issues with large opportunity sets may require architecture changes"]

---

#### Product & Design

**Sprint goals:**

- Design forecast and analytics UI
- Plan beta program (customer selection, goals, feedback loops)
- Create onboarding flow

**Key deliverables:**

- [ ] [PLACEHOLDER: E.g., "High-fidelity designs for forecast dashboard"]
- [ ] [PLACEHOLDER: E.g., "Onboarding flow wireframes (connect Salesforce, explain key features, see first forecast)"]
- [ ] [PLACEHOLDER: E.g., "Beta program plan: 5-10 design partners, weekly check-ins, feedback surveys"]
- [ ] [PLACEHOLDER: E.g., "Beta invite list and outreach plan"]

---

### Week 7-8: User Management & Polish

#### Engineering

**Sprint goals:**

- Implement user management (invite teammates, roles, permissions)
- Build settings and configuration UI
- Fix bugs from alpha testing
- Prepare for beta launch

**Key deliverables:**

- [ ] [PLACEHOLDER: E.g., "Users can invite teammates via email"]
- [ ] [PLACEHOLDER: E.g., "Role-based access control (Admin, Manager, User roles)"]
- [ ] [PLACEHOLDER: E.g., "Settings page: user profile, organization settings, Salesforce connection management"]
- [ ] [PLACEHOLDER: E.g., "Email notifications (forecast changes, at-risk deals, weekly summaries)"]
- [ ] [PLACEHOLDER: E.g., "Onboarding flow implemented (new user signs up → connects Salesforce → sees first forecast)"]
- [ ] [PLACEHOLDER: E.g., "Bug fixes and polish based on alpha feedback"]
- [ ] [PLACEHOLDER: E.g., "Beta launch checklist complete (monitoring, error tracking, support process)"]

**Dependencies:**

- [PLACEHOLDER: E.g., "Requires forecast engine from Week 5-6"]

**Risks:**

- [PLACEHOLDER: E.g., "Onboarding flow may be too complex for non-technical users"]

---

#### Product & Design

**Sprint goals:**

- Design user management and settings UI
- Create beta customer documentation
- Plan beta launch communication

**Key deliverables:**

- [ ] [PLACEHOLDER: E.g., "High-fidelity designs for settings and user management"]
- [ ] [PLACEHOLDER: E.g., "Beta customer documentation (quick start guide, feature overview, FAQ)"]
- [ ] [PLACEHOLDER: E.g., "Beta launch email and landing page"]
- [ ] [PLACEHOLDER: E.g., "Feedback survey for beta customers"]
- [ ] [PLACEHOLDER: E.g., "Weekly check-in cadence and agenda for beta customers"]

---

#### Phase 2 Milestones

**End of Week 6:**
- [ ] [PLACEHOLDER: E.g., "Forecast engine working, dashboard shows real-time forecast with drill-down"]
- [ ] [PLACEHOLDER: E.g., "Deal health scoring flags at-risk opportunities"]

**End of Week 8:**
- [ ] [PLACEHOLDER: E.g., "Beta version ready to ship"]
- [ ] [PLACEHOLDER: E.g., "User management and onboarding complete"]
- [ ] [PLACEHOLDER: E.g., "Beta customers identified and ready to invite"]

---

## Phase 3: Beta & Launch (Weeks 9-12)

**Goal:** Get real customers using the product, gather feedback, polish for public launch.

**Success criteria:**
- [ ] 5-10 beta customers actively using product weekly
- [ ] NPS of 40+ from beta customers
- [ ] All P0 and P1 bugs fixed
- [ ] Go-to-market assets ready (website, pricing, sales materials)
- [ ] Ready for public launch

---

### Week 9-10: Beta Program & Iteration

#### Engineering

**Sprint goals:**

- Support beta customers (fix bugs, handle edge cases)
- Iterate on features based on feedback
- Improve performance and reliability
- Prepare for scale

**Key deliverables:**

- [ ] [PLACEHOLDER: E.g., "Beta customers onboarded (Salesforce connected, data syncing)"]
- [ ] [PLACEHOLDER: E.g., "Bug fixes based on beta feedback (prioritize P0 and P1)"]
- [ ] [PLACEHOLDER: E.g., "Performance improvements based on real usage patterns"]
- [ ] [PLACEHOLDER: E.g., "Enhanced error handling and user-facing error messages"]
- [ ] [PLACEHOLDER: E.g., "Load testing to validate system can handle 100+ concurrent users"]
- [ ] [PLACEHOLDER: E.g., "Automated tests covering critical user paths"]
- [ ] [PLACEHOLDER: E.g., "Security review and fixes (SQL injection, XSS, CSRF protection)"]

**Dependencies:**

- [PLACEHOLDER: E.g., "Requires beta customers to be active and providing feedback"]

**Risks:**

- [PLACEHOLDER: E.g., "May discover major bugs or missing features that require more time"]
- [PLACEHOLDER: E.g., "Beta customers may not engage if onboarding is too complex"]

---

#### Product & Design

**Sprint goals:**

- Run weekly check-ins with beta customers
- Analyze usage data and feedback
- Plan v1.1 roadmap based on learnings
- Create launch marketing materials

**Key deliverables:**

- [ ] [PLACEHOLDER: E.g., "Weekly beta customer check-ins (30-min calls to review usage, gather feedback)"]
- [ ] [PLACEHOLDER: E.g., "Beta feedback summary (what's working, what's not, feature requests)"]
- [ ] [PLACEHOLDER: E.g., "Usage analysis (activation rate, retention, feature adoption)"]
- [ ] [PLACEHOLDER: E.g., "V1.1 roadmap draft based on beta learnings"]
- [ ] [PLACEHOLDER: E.g., "Launch marketing plan (channels, messaging, budget)"]
- [ ] [PLACEHOLDER: E.g., "Case study drafts from beta customers"]

---

### Week 11-12: Launch Prep & Go-to-Market

#### Engineering

**Sprint goals:**

- Final bug fixes and polish
- Prepare infrastructure for launch (scaling, monitoring)
- Build launch-specific features (pricing, billing)
- Create launch day playbook

**Key deliverables:**

- [ ] [PLACEHOLDER: E.g., "All P0 and P1 bugs fixed"]
- [ ] [PLACEHOLDER: E.g., "Pricing and billing system integrated (Stripe, Chargebee, or similar)"]
- [ ] [PLACEHOLDER: E.g., "Self-service signup and onboarding flow polished"]
- [ ] [PLACEHOLDER: E.g., "Infrastructure scaled for launch (autoscaling, load balancing)"]
- [ ] [PLACEHOLDER: E.g., "Monitoring and alerting configured (uptime, errors, performance)"]
- [ ] [PLACEHOLDER: E.g., "Launch day playbook (deployment checklist, rollback plan, support coverage)"]
- [ ] [PLACEHOLDER: E.g., "Documentation complete (help center, API docs, admin guides)"]

**Dependencies:**

- [PLACEHOLDER: E.g., "Requires beta phase learnings and feedback"]

**Risks:**

- [PLACEHOLDER: E.g., "Launch day infrastructure issues (traffic spike, downtime)"]
- [PLACEHOLDER: E.g., "Payment processing issues or edge cases"]

---

#### Product & Design

**Sprint goals:**

- Finalize go-to-market assets
- Train sales and support teams
- Execute launch plan
- Set up post-launch tracking

**Key deliverables:**

- [ ] [PLACEHOLDER: E.g., "Launch website live (homepage, pricing, product pages)"]
- [ ] [PLACEHOLDER: E.g., "Launch blog post and press release"]
- [ ] [PLACEHOLDER: E.g., "Sales deck and demo script"]
- [ ] [PLACEHOLDER: E.g., "Customer support playbook (common questions, how to escalate)"]
- [ ] [PLACEHOLDER: E.g., "Launch day social media posts and outreach plan"]
- [ ] [PLACEHOLDER: E.g., "Post-launch metrics dashboard (signups, activations, MRR)"]
- [ ] [PLACEHOLDER: E.g., "Customer feedback loops (NPS surveys, in-app feedback widget)"]

---

#### Phase 3 Milestones

**End of Week 10:**
- [ ] [PLACEHOLDER: E.g., "Beta program complete, feedback collected and prioritized"]
- [ ] [PLACEHOLDER: E.g., "5+ beta customers using product weekly"]
- [ ] [PLACEHOLDER: E.g., "NPS of 40+ from beta customers"]

**End of Week 12:**
- [ ] [PLACEHOLDER: E.g., "Product launched to public"]
- [ ] [PLACEHOLDER: E.g., "Website, pricing, and sales materials live"]
- [ ] [PLACEHOLDER: E.g., "First paying customers signed up"]
- [ ] [PLACEHOLDER: E.g., "Post-launch metrics tracking in place"]

---

## Dependencies & Blockers

### Cross-functional Dependencies

| Milestone | Depends On | Owner | Status |
|-----------|------------|-------|--------|
| [PLACEHOLDER: E.g., "Week 2: Salesforce integration"] | [PLACEHOLDER: E.g., "Salesforce developer account"] | [PLACEHOLDER: E.g., "Engineering"] | [PLACEHOLDER: E.g., "In Progress"] |
| [PLACEHOLDER: E.g., "Week 4: Alpha testing"] | [PLACEHOLDER: E.g., "Dashboard complete, internal team available to test"] | [PLACEHOLDER: E.g., "Product + Eng"] | [PLACEHOLDER: E.g., "Not Started"] |
| [PLACEHOLDER: E.g., "Week 8: Beta launch"] | [PLACEHOLDER: E.g., "Beta customers recruited, onboarding docs ready"] | [PLACEHOLDER: E.g., "Product + Marketing"] | [PLACEHOLDER: E.g., "Not Started"] |
| [PLACEHOLDER: E.g., "Week 12: Public launch"] | [PLACEHOLDER: E.g., "Website live, pricing finalized, sales team trained"] | [PLACEHOLDER: E.g., "Marketing + Sales"] | [PLACEHOLDER: E.g., "Not Started"] |

---

### Known Risks

| Risk | Impact | Likelihood | Mitigation Plan | Owner |
|------|--------|------------|-----------------|-------|
| [PLACEHOLDER: E.g., "Salesforce API rate limits"] | [PLACEHOLDER: E.g., "High - could block data sync"] | [PLACEHOLDER: E.g., "Medium"] | [PLACEHOLDER: E.g., "Implement smart throttling, batch requests"] | [PLACEHOLDER: E.g., "Engineering"] |
| [PLACEHOLDER: E.g., "Beta customers don't engage"] | [PLACEHOLDER: E.g., "High - can't validate PMF"] | [PLACEHOLDER: E.g., "Medium"] | [PLACEHOLDER: E.g., "Over-recruit (10 instead of 5), offer incentives"] | [PLACEHOLDER: E.g., "Product"] |
| [PLACEHOLDER: E.g., "Performance issues at scale"] | [PLACEHOLDER: E.g., "Medium - affects UX"] | [PLACEHOLDER: E.g., "Medium"] | [PLACEHOLDER: E.g., "Load test early, optimize before launch"] | [PLACEHOLDER: E.g., "Engineering"] |
| [PLACEHOLDER: E.g., "Feature scope creep"] | [PLACEHOLDER: E.g., "High - delays launch"] | [PLACEHOLDER: E.g., "High"] | [PLACEHOLDER: E.g., "Ruthlessly prioritize, move non-MVP features to v1.1"] | [PLACEHOLDER: E.g., "Product"] |

---

## Post-MVP Roadmap (Months 4-12)

### Q2 2026 (Months 4-6): V1.1 - Expand Core Value

**Goals:**
- Increase retention with advanced features
- Expand to more customer segments
- Improve forecast accuracy with ML

**Key features:**

- [PLACEHOLDER: E.g., "Advanced forecast scenarios (best case, worst case, most likely)"]
- [PLACEHOLDER: E.g., "HubSpot CRM integration (for non-Salesforce customers)"]
- [PLACEHOLDER: E.g., "Slack/Teams integration for notifications"]
- [PLACEHOLDER: E.g., "Custom reporting builder"]
- [PLACEHOLDER: E.g., "Historical trending and cohort analysis"]
- [PLACEHOLDER: E.g., "Mobile-optimized responsive design improvements"]

**Success metrics:**
- [PLACEHOLDER: E.g., "100 paying customers"]
- [PLACEHOLDER: E.g., "$200K MRR"]
- [PLACEHOLDER: E.g., "85%+ weekly active usage"]
- [PLACEHOLDER: E.g., "92%+ net revenue retention"]

---

### Q3 2026 (Months 7-9): V2.0 - AI & Automation

**Goals:**
- Differentiate with AI-powered insights
- Increase average deal size with enterprise features
- Expand into new use cases (CS, Marketing)

**Key features:**

- [PLACEHOLDER: E.g., "ML-powered deal scoring (replace heuristics with trained models)"]
- [PLACEHOLDER: E.g., "Predictive analytics (which deals will close, when, at what amount)"]
- [PLACEHOLDER: E.g., "AI-generated insights and recommendations (e.g., 'Your Q4 forecast is at risk because...')"]
- [PLACEHOLDER: E.g., "Customer success forecasting (expansion, renewal, churn prediction)"]
- [PLACEHOLDER: E.g., "SSO via SAML (Okta, OneLogin, Azure AD)"]
- [PLACEHOLDER: E.g., "Advanced role-based permissions"]

**Success metrics:**
- [PLACEHOLDER: E.g., "250 paying customers"]
- [PLACEHOLDER: E.g., "$500K MRR"]
- [PLACEHOLDER: E.g., "Average deal size increases 50% (enterprise tier)"]

---

### Q4 2026 (Months 10-12): V2.5 - Platform & Ecosystem

**Goals:**
- Build platform for third-party integrations
- Expand to more data sources
- Enable ecosystem of partners and apps

**Key features:**

- [PLACEHOLDER: E.g., "Public API for custom integrations"]
- [PLACEHOLDER: E.g., "Marketplace for third-party apps and data sources"]
- [PLACEHOLDER: E.g., "Data warehouse integration (Snowflake, BigQuery, Redshift)"]
- [PLACEHOLDER: E.g., "Conversation intelligence integration (Gong, Chorus)"]
- [PLACEHOLDER: E.g., "White-label/reseller program"]
- [PLACEHOLDER: E.g., "Advanced customization (custom fields, formulas, workflows)"]

**Success metrics:**
- [PLACEHOLDER: E.g., "500 paying customers"]
- [PLACEHOLDER: E.g., "$1M MRR"]
- [PLACEHOLDER: E.g., "10+ third-party integrations in marketplace"]

---

## Feature Parking Lot

### Ideas to Consider (Not Yet Prioritized)

**High potential:**

- [PLACEHOLDER: E.g., "Territory planning and quota optimization"]
- [PLACEHOLDER: E.g., "Sales coaching and playbooks based on top performer patterns"]
- [PLACEHOLDER: E.g., "Automated data enrichment (e.g., pull company data from Clearbit)"]
- [PLACEHOLDER: E.g., "Multi-currency and multi-region support for global companies"]

**Medium potential:**

- [PLACEHOLDER: E.g., "Native mobile apps (iOS and Android)"]
- [PLACEHOLDER: E.g., "Voice interface (Alexa, Google Assistant for forecast updates)"]
- [PLACEHOLDER: E.g., "Competitive intelligence (track win/loss reasons, competitor mentions)"]

**Low potential (for now):**

- [PLACEHOLDER: E.g., "On-premise deployment"]
- [PLACEHOLDER: E.g., "White-label multi-tenant architecture"]
- [PLACEHOLDER: E.g., "Industry-specific versions (e.g., 'RevForecast for HealthTech')"]

**Why they're parked:**

[PLACEHOLDER: E.g., "These are interesting ideas but don't solve the core problem as directly as MVP features. We'll revisit after we've validated product-market fit and have customer data to inform prioritization."]

---

## Release Process

### How We Ship

**Development → Staging → Production:**

1. [PLACEHOLDER: E.g., "Feature branch merged to main after PR review + tests pass"]
2. [PLACEHOLDER: E.g., "Auto-deployed to Staging environment"]
3. [PLACEHOLDER: E.g., "QA testing in Staging (manual + automated)"]
4. [PLACEHOLDER: E.g., "Deploy to Production (manual approval required)"]
5. [PLACEHOLDER: E.g., "Monitor for errors/performance issues for 24 hours"]
6. [PLACEHOLDER: E.g., "Announce to customers via changelog + email"]

---

### Release Cadence

**During MVP development (Weeks 1-12):**
- [PLACEHOLDER: E.g., "Deploy to Production weekly (every Friday)"]
- [PLACEHOLDER: E.g., "Hotfixes deployed as needed for critical bugs"]

**Post-launch (Month 4+):**
- [PLACEHOLDER: E.g., "Major releases monthly (new features)"]
- [PLACEHOLDER: E.g., "Minor releases weekly (bug fixes, small improvements)"]
- [PLACEHOLDER: E.g., "Hotfixes deployed same-day for critical issues"]

---

### Feature Flags

**When to use:**

- [PLACEHOLDER: E.g., "New features that need testing before broad rollout"]
- [PLACEHOLDER: E.g., "Features that may impact performance or stability"]
- [PLACEHOLDER: E.g., "Features being built incrementally over multiple sprints"]

**Process:**

- [PLACEHOLDER: E.g., "Deploy code to Production with feature flag OFF"]
- [PLACEHOLDER: E.g., "Enable for internal team first (dogfooding)"]
- [PLACEHOLDER: E.g., "Enable for beta customers (opt-in or 10% rollout)"]
- [PLACEHOLDER: E.g., "Monitor metrics and feedback"]
- [PLACEHOLDER: E.g., "Enable for all users once validated"]

---

## Tracking Progress

### Weekly Status Updates

**Format:**

- **What shipped last week:** [List of completed features/fixes]
- **What's shipping this week:** [List of planned work]
- **Blockers:** [Any issues preventing progress]
- **Metrics:** [Usage, activation, engagement, bugs]

**Distribution:**

[PLACEHOLDER: E.g., "Slack #product-updates channel every Monday, email to investors/advisors monthly"]

---

### Dashboards

**Engineering metrics:**

- [PLACEHOLDER: E.g., "Deployment frequency (target: weekly)"]
- [PLACEHOLDER: E.g., "Lead time (commit to deploy, target: < 24 hours)"]
- [PLACEHOLDER: E.g., "Change failure rate (target: < 10%)"]
- [PLACEHOLDER: E.g., "Time to restore (target: < 1 hour)"]

**Product metrics:**

- [PLACEHOLDER: E.g., "Signups per week"]
- [PLACEHOLDER: E.g., "Activation rate (% who connect Salesforce and see forecast)"]
- [PLACEHOLDER: E.g., "Weekly active users"]
- [PLACEHOLDER: E.g., "Feature adoption (% using each core feature)"]
- [PLACEHOLDER: E.g., "NPS score"]

**Business metrics:**

- [PLACEHOLDER: E.g., "MRR"]
- [PLACEHOLDER: E.g., "Customer count"]
- [PLACEHOLDER: E.g., "Net revenue retention"]
- [PLACEHOLDER: E.g., "CAC payback period"]

---

## Retrospectives

### What We'll Learn

After each phase, we'll run a retrospective to reflect on:

- **What went well:** [What should we keep doing?]
- **What didn't go well:** [What should we stop doing?]
- **What did we learn:** [What surprised us? What would we do differently?]
- **Actions for next phase:** [Concrete changes to make]

**Schedule:**

- [PLACEHOLDER: E.g., "Phase 1 retro: End of Week 4"]
- [PLACEHOLDER: E.g., "Phase 2 retro: End of Week 8"]
- [PLACEHOLDER: E.g., "Phase 3 retro: End of Week 12"]
- [PLACEHOLDER: E.g., "Monthly retros post-launch"]

---

## Roadmap Changes

### How We Adjust

**Reasons to change the roadmap:**

- [PLACEHOLDER: E.g., "Customer feedback reveals we're building wrong thing"]
- [PLACEHOLDER: E.g., "Technical blocker forces re-scoping"]
- [PLACEHOLDER: E.g., "Competitive threat requires urgent response"]
- [PLACEHOLDER: E.g., "Usage data shows feature isn't being adopted"]

**Process:**

1. [PLACEHOLDER: E.g., "Product lead proposes change with rationale"]
2. [PLACEHOLDER: E.g., "Team reviews impact on timeline and dependencies"]
3. [PLACEHOLDER: E.g., "Stakeholders approve or reject"]
4. [PLACEHOLDER: E.g., "Roadmap updated and communicated"]

**Communication:**

[PLACEHOLDER: E.g., "Major roadmap changes announced in weekly all-hands, emailed to beta customers, posted in changelog"]

---

## Success Criteria by Milestone

### Week 4: Alpha Complete
- [ ] [PLACEHOLDER: E.g., "Dashboard displays real Salesforce data"]
- [ ] [PLACEHOLDER: E.g., "5 internal team members complete alpha test"]
- [ ] [PLACEHOLDER: E.g., "No P0 bugs blocking beta launch"]

### Week 8: Beta Ready
- [ ] [PLACEHOLDER: E.g., "Forecast engine and deal scoring working"]
- [ ] [PLACEHOLDER: E.g., "Onboarding flow complete"]
- [ ] [PLACEHOLDER: E.g., "5-10 beta customers recruited"]

### Week 12: Public Launch
- [ ] [PLACEHOLDER: E.g., "5+ beta customers active weekly"]
- [ ] [PLACEHOLDER: E.g., "NPS of 40+ from beta customers"]
- [ ] [PLACEHOLDER: E.g., "Website and sales materials live"]
- [ ] [PLACEHOLDER: E.g., "First paying customers signed up"]

### Month 3: Early Traction
- [ ] [PLACEHOLDER: E.g., "20+ paying customers"]
- [ ] [PLACEHOLDER: E.g., "$50K+ MRR"]
- [ ] [PLACEHOLDER: E.g., "80%+ weekly active usage"]
- [ ] [PLACEHOLDER: E.g., "NPS of 50+"]

### Month 6: Product-Market Fit
- [ ] [PLACEHOLDER: E.g., "100+ paying customers"]
- [ ] [PLACEHOLDER: E.g., "$200K+ MRR"]
- [ ] [PLACEHOLDER: E.g., "90%+ net revenue retention"]
- [ ] [PLACEHOLDER: E.g., "Organic word-of-mouth referrals (20%+ signups from referrals)"]

### Month 12: Scale
- [ ] [PLACEHOLDER: E.g., "500+ paying customers"]
- [ ] [PLACEHOLDER: E.g., "$1M+ MRR"]
- [ ] [PLACEHOLDER: E.g., "Profitable unit economics (CAC payback < 12 months)"]
- [ ] [PLACEHOLDER: E.g., "Ready for Series A fundraise"]

---

## Next Steps

1. **2026-06-02**: Finalize Phase 1 engineering tasks and assign sprint work to team members
2. **2026-06-05**: Recruit 10 beta customer candidates (reach out to early users, warm network, Pavilion community)
3. **2026-06-12**: Complete weekly roadmap review process - create template for tracking progress and blockers
