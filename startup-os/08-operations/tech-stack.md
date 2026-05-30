# Tech Stack

**Version:** 1.0  
**Last Updated:** [PLACEHOLDER - Date]  
**Owner:** [PLACEHOLDER - CTO/Head of Engineering]  
**Status:** Active

## Overview

This document provides a comprehensive inventory of all technology, tools, and infrastructure used by [PLACEHOLDER - Company Name], organized by category. Each tool includes monthly/annual costs, ownership, renewal dates, and justification. This tech stack reconciles with the financial model burn rate in `/04-finance/financial-model.md`.

### Purpose

- Provide single source of truth for all technology decisions
- Track software costs and contract renewals
- Enable vendor negotiation and optimization
- Support security audits and compliance reviews
- Facilitate onboarding and tool provisioning

### Total Cost Summary

| Category | Monthly Cost | Annual Cost | % of Total |
|----------|--------------|-------------|------------|
| Infrastructure | $[PLACEHOLDER - 12,500] | $[PLACEHOLDER - 150,000] | 45% |
| Product & Engineering Tools | $[PLACEHOLDER - 4,200] | $[PLACEHOLDER - 50,400] | 15% |
| Data & Analytics | $[PLACEHOLDER - 2,800] | $[PLACEHOLDER - 33,600] | 10% |
| Security & Compliance | $[PLACEHOLDER - 3,100] | $[PLACEHOLDER - 37,200] | 11% |
| Productivity & Collaboration | $[PLACEHOLDER - 2,400] | $[PLACEHOLDER - 28,800] | 9% |
| Sales & Marketing Tools | $[PLACEHOLDER - 3,000] | $[PLACEHOLDER - 36,000] | 10% |
| **TOTAL TECH STACK** | **$28,000** | **$336,000** | **100%** |

**[CROSS-REFERENCE]** These costs are reflected in `/04-finance/financial-model.md`:
- Infrastructure costs → COGS (Infrastructure & Hosting line item)
- Engineering tools → R&D Operating Expenses (R&D Infrastructure line item)
- Sales/Marketing tools → Sales & Marketing Operating Expenses
- Productivity tools → General & Administrative Operating Expenses

**[ASSUMPTION]** Cost Growth Rate:
- Year 1: $28,000/month average ($336K annual)
- Year 2: $45,000/month average (team scaling, usage-based pricing)
- Year 3: $68,000/month average (enterprise features, multi-region)

---

## Infrastructure & Cloud Services

### Cloud Computing & Hosting

#### Amazon Web Services (AWS)

**Purpose:** Primary cloud infrastructure provider for compute, storage, databases, and networking

**Services Used:**
- EC2 (compute instances)
- RDS (managed databases - PostgreSQL)
- S3 (object storage)
- CloudFront (CDN)
- Route 53 (DNS)
- ELB (load balancing)
- VPC (networking)
- CloudWatch (monitoring)

**Pricing Model:** Usage-based (pay-as-you-go)

**Cost Breakdown:**
- Compute (EC2): $[PLACEHOLDER - 4,500]/month
- Database (RDS): $[PLACEHOLDER - 2,800]/month
- Storage (S3): $[PLACEHOLDER - 1,200]/month
- CDN (CloudFront): $[PLACEHOLDER - 800]/month
- Other Services: $[PLACEHOLDER - 700]/month
- **Monthly Total: $10,000**
- **Annual Total: $120,000**

**Scaling Notes:**
- Year 1: Development + production environments
- Year 2: Multi-region deployment (add $8K/month)
- Year 3: Reserved instances for cost optimization (-15%)

**Owner:** [PLACEHOLDER - Director of Engineering]  
**Contract Type:** Pay-as-you-go (no commitment)  
**Renewal Date:** N/A (monthly billing)  
**Alternatives Evaluated:** Google Cloud Platform, Microsoft Azure  
**Decision Rationale:** Best in class for SaaS startups, extensive service catalog, startup credits program

#### Vercel

**Purpose:** Frontend hosting and deployment platform for web application

**Monthly Cost:** $[PLACEHOLDER - 150]  
**Annual Cost:** $[PLACEHOLDER - 1,800] (Pro Plan)  
**Owner:** [PLACEHOLDER - Lead Frontend Engineer]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Automatic annual renewal  
**Alternatives:** Netlify, AWS Amplify  
**Decision Rationale:** Superior developer experience, edge network, automatic CI/CD

#### MongoDB Atlas

**Purpose:** Managed NoSQL database for user-generated content and document storage

**Monthly Cost:** $[PLACEHOLDER - 580]  
**Annual Cost:** $[PLACEHOLDER - 6,960] (M10 cluster)  
**Owner:** [PLACEHOLDER - Backend Lead]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Monthly billing  
**Alternatives:** AWS DocumentDB, self-hosted MongoDB  
**Decision Rationale:** Fully managed, automatic backups, excellent developer tooling

#### Redis Cloud

**Purpose:** Managed Redis for caching, session storage, and real-time features

**Monthly Cost:** $[PLACEHOLDER - 200]  
**Annual Cost:** $[PLACEHOLDER - 2,400]  
**Owner:** [PLACEHOLDER - Backend Lead]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Monthly billing  
**Alternatives:** AWS ElastiCache, self-hosted Redis  
**Decision Rationale:** Low latency, high availability, cost-effective at scale

#### Cloudflare

**Purpose:** DNS, DDoS protection, WAF, and CDN

**Monthly Cost:** $[PLACEHOLDER - 200]  
**Annual Cost:** $[PLACEHOLDER - 2,400] (Pro Plan)  
**Owner:** [PLACEHOLDER - DevOps Engineer]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** AWS CloudFront + Route 53, Fastly  
**Decision Rationale:** Industry-leading DDoS protection, ease of use, low cost

#### Auth0

**Purpose:** Authentication and authorization platform

**Monthly Cost:** $[PLACEHOLDER - 250]  
**Annual Cost:** $[PLACEHOLDER - 3,000] (Essentials Plan)  
**Owner:** [PLACEHOLDER - Security Lead]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Monthly billing  
**Alternatives:** Okta, AWS Cognito, self-built  
**Decision Rationale:** Enterprise SSO, MFA, compliance certifications out of the box

#### Twilio

**Purpose:** SMS notifications, 2FA, and transactional messaging

**Monthly Cost:** $[PLACEHOLDER - 350] (usage-based)  
**Annual Cost:** $[PLACEHOLDER - 4,200]  
**Owner:** [PLACEHOLDER - Product Engineering Lead]  
**Contract End Date:** N/A (pay-as-you-go)  
**Renewal Process:** Monthly usage billing  
**Alternatives:** AWS SNS, Vonage  
**Decision Rationale:** Best deliverability, global coverage, extensive API

#### SendGrid

**Purpose:** Transactional and marketing email delivery

**Monthly Cost:** $[PLACEHOLDER - 150]  
**Annual Cost:** $[PLACEHOLDER - 1,800] (Pro 100K Plan)  
**Owner:** [PLACEHOLDER - Product Engineering Lead]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Monthly billing  
**Alternatives:** AWS SES, Mailgun, Postmark  
**Decision Rationale:** Excellent deliverability rates, email templates, analytics

---

## Product & Engineering Tools

### Development & Version Control

#### GitHub

**Purpose:** Git hosting, version control, CI/CD, and code review

**Monthly Cost:** $[PLACEHOLDER - 21]  
**Annual Cost:** $[PLACEHOLDER - 252] (Team Plan - 15 seats @ $4/seat + Actions usage)  
**Owner:** [PLACEHOLDER - Engineering Manager]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** GitLab, Bitbucket  
**Decision Rationale:** Industry standard, excellent third-party integrations, GitHub Actions

#### Visual Studio Code

**Purpose:** Primary code editor (free, but listed for completeness)

**Monthly Cost:** $0  
**Annual Cost:** $0  
**Owner:** [PLACEHOLDER - Engineering Team]  
**Alternatives:** JetBrains IDEs, Sublime Text  
**Decision Rationale:** Free, extensible, lightweight, excellent for web development

### API Development & Testing

#### Postman

**Purpose:** API development, testing, and documentation

**Monthly Cost:** $[PLACEHOLDER - 144]  
**Annual Cost:** $[PLACEHOLDER - 1,728] (Professional Plan - 12 seats @ $12/seat)  
**Owner:** [PLACEHOLDER - Backend Lead]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Insomnia, curl, custom scripts  
**Decision Rationale:** Team collaboration, automated testing, API documentation generation

### Design & Prototyping

#### Figma

**Purpose:** Product design, prototyping, and design system management

**Monthly Cost:** $[PLACEHOLDER - 135]  
**Annual Cost:** $[PLACEHOLDER - 1,620] (Professional Plan - 3 seats @ $15/seat/month, billed annually @ $12/seat)  
**Owner:** [PLACEHOLDER - Head of Design]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Sketch, Adobe XD, Framer  
**Decision Rationale:** Best collaboration features, component libraries, developer handoff

### Project Management

#### Linear

**Purpose:** Issue tracking, sprint planning, and project management

**Monthly Cost:** $[PLACEHOLDER - 160]  
**Annual Cost:** $[PLACEHOLDER - 1,920] (Standard Plan - 20 seats @ $8/seat)  
**Owner:** [PLACEHOLDER - Engineering Manager]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Jira, Asana, GitHub Projects  
**Decision Rationale:** Fast, keyboard-driven, excellent for engineering teams, GitHub integration

### CI/CD & DevOps

#### CircleCI

**Purpose:** Continuous integration and deployment pipelines

**Monthly Cost:** $[PLACEHOLDER - 150]  
**Annual Cost:** $[PLACEHOLDER - 1,800] (Performance Plan)  
**Owner:** [PLACEHOLDER - DevOps Engineer]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Monthly billing  
**Alternatives:** GitHub Actions, GitLab CI, Jenkins  
**Decision Rationale:** Excellent Docker support, parallel execution, build caching

#### Docker Hub

**Purpose:** Container registry for Docker images

**Monthly Cost:** $[PLACEHOLDER - 5]  
**Annual Cost:** $[PLACEHOLDER - 60] (Pro Plan)  
**Owner:** [PLACEHOLDER - DevOps Engineer]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Monthly billing  
**Alternatives:** AWS ECR, Google Container Registry, GitHub Container Registry  
**Decision Rationale:** Simple, integrated with Docker tooling, affordable

### Testing & Quality Assurance

#### BrowserStack

**Purpose:** Cross-browser and cross-device testing

**Monthly Cost:** $[PLACEHOLDER - 99]  
**Annual Cost:** $[PLACEHOLDER - 1,188] (Team Plan - 5 parallel tests)  
**Owner:** [PLACEHOLDER - QA Lead]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Sauce Labs, LambdaTest, manual testing  
**Decision Rationale:** Comprehensive device coverage, live testing + automated testing

### Error Tracking & Monitoring

#### Sentry

**Purpose:** Error tracking, performance monitoring, and alerting

**Monthly Cost:** $[PLACEHOLDER - 80]  
**Annual Cost:** $[PLACEHOLDER - 960] (Team Plan)  
**Owner:** [PLACEHOLDER - Engineering Manager]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Monthly billing  
**Alternatives:** Rollbar, Bugsnag, custom logging  
**Decision Rationale:** Excellent stack traces, release tracking, integrates with GitHub

#### Datadog

**Purpose:** Infrastructure monitoring, APM, and log aggregation

**Monthly Cost:** $[PLACEHOLDER - 500]  
**Annual Cost:** $[PLACEHOLDER - 6,000] (Pro Plan - 10 hosts)  
**Owner:** [PLACEHOLDER - DevOps Engineer]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** New Relic, Grafana + Prometheus, AWS CloudWatch  
**Decision Rationale:** Unified monitoring, excellent dashboards, alerts, integrations

#### PagerDuty

**Purpose:** Incident management and on-call scheduling

**Monthly Cost:** $[PLACEHOLDER - 125]  
**Annual Cost:** $[PLACEHOLDER - 1,500] (Professional Plan - 5 users)  
**Owner:** [PLACEHOLDER - Engineering Manager]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Opsgenie, VictorOps, custom scripts  
**Decision Rationale:** Reliable alerting, escalation policies, mobile app, status pages

---

## Data & Analytics

### Product Analytics

#### Mixpanel

**Purpose:** Product analytics, user behavior tracking, and funnel analysis

**Monthly Cost:** $[PLACEHOLDER - 249]  
**Annual Cost:** $[PLACEHOLDER - 2,988] (Growth Plan)  
**Owner:** [PLACEHOLDER - Product Manager]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Amplitude, Google Analytics, Heap  
**Decision Rationale:** User-centric analytics, cohort analysis, A/B testing, retention tracking

#### Segment

**Purpose:** Customer data platform (CDP) for event routing and data pipeline

**Monthly Cost:** $[PLACEHOLDER - 120]  
**Annual Cost:** $[PLACEHOLDER - 1,440] (Team Plan)  
**Owner:** [PLACEHOLDER - Data Engineer]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** RudderStack, mParticle, custom ETL  
**Decision Rationale:** Single API for all analytics tools, data governance, destination flexibility

### Business Intelligence

#### Metabase

**Purpose:** Business intelligence dashboards and SQL queries

**Monthly Cost:** $[PLACEHOLDER - 85]  
**Annual Cost:** $[PLACEHOLDER - 1,020] (Pro Cloud - 10 users)  
**Owner:** [PLACEHOLDER - Head of Operations]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Monthly billing  
**Alternatives:** Looker, Tableau, Mode, Retool  
**Decision Rationale:** Self-service BI, no-code query builder, affordable, open-source option available

### Data Warehouse

#### Snowflake

**Purpose:** Cloud data warehouse for analytics and reporting

**Monthly Cost:** $[PLACEHOLDER - 800]  
**Annual Cost:** $[PLACEHOLDER - 9,600] (usage-based)  
**Owner:** [PLACEHOLDER - Data Engineer]  
**Contract End Date:** N/A (pay-as-you-go)  
**Renewal Process:** Monthly usage billing  
**Alternatives:** Google BigQuery, AWS Redshift, Databricks  
**Decision Rationale:** Auto-scaling, separation of storage and compute, data sharing, SQL interface

#### Fivetran

**Purpose:** Data integration and ETL from sources to data warehouse

**Monthly Cost:** $[PLACEHOLDER - 350]  
**Annual Cost:** $[PLACEHOLDER - 4,200] (Starter Plan)  
**Owner:** [PLACEHOLDER - Data Engineer]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Stitch, Airbyte, custom ETL scripts  
**Decision Rationale:** Pre-built connectors, automatic schema management, reliability

#### dbt Cloud

**Purpose:** Data transformation and analytics engineering

**Monthly Cost:** $[PLACEHOLDER - 100]  
**Annual Cost:** $[PLACEHOLDER - 1,200] (Developer Plan - 2 seats)  
**Owner:** [PLACEHOLDER - Data Engineer]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Monthly billing  
**Alternatives:** Self-hosted dbt, custom SQL scripts  
**Decision Rationale:** Version control for data transformations, documentation, testing, scheduler

### Customer Data & CRM

#### Salesforce

**Purpose:** CRM for sales pipeline, customer relationships, and reporting

**Monthly Cost:** $[PLACEHOLDER - 750]  
**Annual Cost:** $[PLACEHOLDER - 9,000] (Sales Cloud Professional - 10 users @ $75/user)  
**Owner:** [PLACEHOLDER - Head of Sales]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** HubSpot, Pipedrive, Copper  
**Decision Rationale:** Industry standard, extensive integrations, reporting, enterprise features

---

## Security & Compliance

### Security Monitoring & Vulnerability Scanning

#### Snyk

**Purpose:** Continuous security scanning for code, dependencies, containers, and IaC

**Monthly Cost:** $[PLACEHOLDER - 450]  
**Annual Cost:** $[PLACEHOLDER - 5,400] (Team Plan)  
**Owner:** [PLACEHOLDER - Security Lead]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** WhiteSource, Dependabot (free), Veracode  
**Decision Rationale:** Developer-friendly, PR checks, container scanning, excellent coverage

#### 1Password Business

**Purpose:** Password management and secrets sharing for team

**Monthly Cost:** $[PLACEHOLDER - 100]  
**Annual Cost:** $[PLACEHOLDER - 1,200] (Business Plan - 25 users @ $8/user/month, billed annually)  
**Owner:** [PLACEHOLDER - Head of IT/Security]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** LastPass, Dashlane, Bitwarden  
**Decision Rationale:** Security audit passed, team sharing, secrets management, CLI for developers

#### AWS Secrets Manager

**Purpose:** Secrets storage and rotation for applications

**Monthly Cost:** $[PLACEHOLDER - 40]  
**Annual Cost:** $[PLACEHOLDER - 480] (usage-based: ~$0.40/secret/month + API calls)  
**Owner:** [PLACEHOLDER - DevOps Engineer]  
**Contract End Date:** N/A (usage-based)  
**Renewal Process:** Monthly AWS billing  
**Alternatives:** HashiCorp Vault, AWS Parameter Store, GCP Secret Manager  
**Decision Rationale:** Native AWS integration, automatic rotation, audit logs

### Compliance & Security Policies

#### Vanta

**Purpose:** Automated security and compliance monitoring (SOC 2, ISO 27001, GDPR)

**Monthly Cost:** $[PLACEHOLDER - 650]  
**Annual Cost:** $[PLACEHOLDER - 7,800] (Growth Plan)  
**Owner:** [PLACEHOLDER - Head of Security/Compliance]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Drata, Secureframe, manual compliance  
**Decision Rationale:** Automates evidence collection, integrates with tech stack, reduces audit time

#### OneTrust

**Purpose:** Privacy compliance management (GDPR, CCPA)

**Monthly Cost:** $[PLACEHOLDER - 400]  
**Annual Cost:** $[PLACEHOLDER - 4,800] (Essentials Plan)  
**Owner:** [PLACEHOLDER - Legal/Compliance]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** TrustArc, Osano, manual compliance  
**Decision Rationale:** Cookie consent management, data mapping, privacy automation

### Endpoint Security

#### Jamf (for macOS management)

**Purpose:** Device management, security, and compliance for company laptops

**Monthly Cost:** $[PLACEHOLDER - 125]  
**Annual Cost:** $[PLACEHOLDER - 1,500] (Jamf Now - 25 devices @ $2/device/month + setup)  
**Owner:** [PLACEHOLDER - Head of IT]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Kandji, Mosyle, manual MDM  
**Decision Rationale:** macOS-native, security policy enforcement, remote wipe

---

## Productivity & Collaboration

### Communication

#### Slack

**Purpose:** Team chat, async communication, and integrations hub

**Monthly Cost:** $[PLACEHOLDER - 200]  
**Annual Cost:** $[PLACEHOLDER - 2,400] (Pro Plan - 25 users @ $8/user/month, billed annually)  
**Owner:** [PLACEHOLDER - Head of Operations]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Microsoft Teams, Discord, Google Chat  
**Decision Rationale:** Industry standard, extensive integrations, searchable history, workflows

#### Zoom

**Purpose:** Video conferencing, webinars, and screen sharing

**Monthly Cost:** $[PLACEHOLDER - 150]  
**Annual Cost:** $[PLACEHOLDER - 1,800] (Business Plan - 10 licenses @ $15/user/month)  
**Owner:** [PLACEHOLDER - Head of Operations]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Google Meet, Microsoft Teams, Whereby  
**Decision Rationale:** Reliability, recording, breakout rooms, webinar capabilities

#### Loom

**Purpose:** Asynchronous video messaging and screen recording

**Monthly Cost:** $[PLACEHOLDER - 120]  
**Annual Cost:** $[PLACEHOLDER - 1,440] (Business Plan - 20 users @ $12.50/user/month, billed annually @ $10/user)  
**Owner:** [PLACEHOLDER - Head of Operations]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Soapbox, Vidyard, native screen recording  
**Decision Rationale:** Async communication, reduces meetings, great UX, transcriptions

### Document Management & Productivity

#### Google Workspace

**Purpose:** Email, calendar, docs, sheets, drive, and collaboration

**Monthly Cost:** $[PLACEHOLDER - 360]  
**Annual Cost:** $[PLACEHOLDER - 4,320] (Business Standard - 30 users @ $12/user/month)  
**Owner:** [PLACEHOLDER - Head of Operations]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Microsoft 365, Notion (docs only), Zoho Workplace  
**Decision Rationale:** Familiar interface, unlimited storage, integrations, reliability

#### Notion

**Purpose:** Wiki, documentation, project management, and knowledge base

**Monthly Cost:** $[PLACEHOLDER - 160]  
**Annual Cost:** $[PLACEHOLDER - 1,920] (Plus Plan - 20 users @ $10/user/month, billed annually @ $8/user)  
**Owner:** [PLACEHOLDER - Head of Operations]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Confluence, Coda, Slite  
**Decision Rationale:** All-in-one workspace, databases, integrations, flexible structure

#### Calendly

**Purpose:** Meeting scheduling automation

**Monthly Cost:** $[PLACEHOLDER - 96]  
**Annual Cost:** $[PLACEHOLDER - 1,152] (Professional Plan - 12 users @ $12/user/month, billed annually @ $10/user)  
**Owner:** [PLACEHOLDER - Head of Sales]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Chili Piper, Google Calendar native, Microsoft Bookings  
**Decision Rationale:** Round-robin scheduling, integrations with Salesforce, routing logic

### HR & Payroll

#### Gusto

**Purpose:** Payroll, benefits administration, HR compliance

**Monthly Cost:** $[PLACEHOLDER - 350]  
**Annual Cost:** $[PLACEHOLDER - 4,200] (Complete Plan: $39/month base + $12/person for 25 employees)  
**Owner:** [PLACEHOLDER - Head of Finance/Operations]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Rippling, ADP, Justworks  
**Decision Rationale:** Easy to use, benefits integration, compliance support, affordable for startups

#### BambooHR

**Purpose:** HRIS, applicant tracking, onboarding, PTO tracking

**Monthly Cost:** $[PLACEHOLDER - 250]  
**Annual Cost:** $[PLACEHOLDER - 3,000] (Essentials Plan)  
**Owner:** [PLACEHOLDER - Head of People/HR]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Rippling, Workable, Greenhouse + Namely  
**Decision Rationale:** ATS included, employee self-service, reporting, integrates with Gusto

---

## Sales & Marketing Tools

### Sales Enablement

#### Outreach

**Purpose:** Sales engagement platform for sequences, cadences, and outbound

**Monthly Cost:** $[PLACEHOLDER - 600]  
**Annual Cost:** $[PLACEHOLDER - 7,200] (6 sales users @ $100/user/month)  
**Owner:** [PLACEHOLDER - Head of Sales]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** SalesLoft, Apollo, HubSpot Sales  
**Decision Rationale:** Multi-channel sequences, analytics, Salesforce integration, dialer

#### ZoomInfo

**Purpose:** B2B contact data and lead enrichment

**Monthly Cost:** $[PLACEHOLDER - 800]  
**Annual Cost:** $[PLACEHOLDER - 9,600] (Professional Plan - 3 seats)  
**Owner:** [PLACEHOLDER - Head of Sales]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Clearbit, Apollo, Lusha  
**Decision Rationale:** Data accuracy, integrations, technographics, intent data

### Marketing Automation

#### HubSpot Marketing Hub

**Purpose:** Marketing automation, email campaigns, landing pages, forms

**Monthly Cost:** $[PLACEHOLDER - 800]  
**Annual Cost:** $[PLACEHOLDER - 9,600] (Professional Plan)  
**Owner:** [PLACEHOLDER - Head of Marketing]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Marketo, Pardot, ActiveCampaign  
**Decision Rationale:** Integrates with HubSpot CRM (or Salesforce), workflows, attribution

#### Webflow

**Purpose:** Marketing website CMS and hosting

**Monthly Cost:** $[PLACEHOLDER - 42]  
**Annual Cost:** $[PLACEHOLDER - 504] (CMS Plan + Site Plan)  
**Owner:** [PLACEHOLDER - Head of Marketing]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** WordPress, Contentful + custom frontend, Framer  
**Decision Rationale:** No-code editor for marketers, SEO tools, fast, designer-friendly

### Customer Support

#### Intercom

**Purpose:** Customer messaging, live chat, support ticketing, product tours

**Monthly Cost:** $[PLACEHOLDER - 450]  
**Annual Cost:** $[PLACEHOLDER - 5,400] (Starter Plan: base + per-user + resolution bot)  
**Owner:** [PLACEHOLDER - Head of Customer Success]  
**Contract End Date:** [PLACEHOLDER - Month/Year]  
**Renewal Process:** Annual renewal  
**Alternatives:** Zendesk, Drift, Help Scout  
**Decision Rationale:** In-app messaging, automation, integrates with product analytics, self-serve support

---

## Vendor Management & Optimization

### Renewal Calendar

| Tool | Contract End Date | Cost | Notice Period | Owner | Status |
|------|------------------|------|---------------|-------|--------|
| AWS | N/A (monthly) | $10K/mo | N/A | [PLACEHOLDER] | Active |
| Salesforce | [PLACEHOLDER] | $9K/yr | 30 days | [PLACEHOLDER] | Up for renewal |
| Datadog | [PLACEHOLDER] | $6K/yr | 30 days | [PLACEHOLDER] | Active |
| Vanta | [PLACEHOLDER] | $7.8K/yr | 60 days | [PLACEHOLDER] | Active |
| HubSpot | [PLACEHOLDER] | $9.6K/yr | 30 days | [PLACEHOLDER] | Negotiating |
| Snowflake | N/A (usage) | $9.6K/yr | N/A | [PLACEHOLDER] | Active |
| ZoomInfo | [PLACEHOLDER] | $9.6K/yr | 90 days | [PLACEHOLDER] | Active |
| Outreach | [PLACEHOLDER] | $7.2K/yr | 60 days | [PLACEHOLDER] | Active |

### Cost Optimization Initiatives

**[INITIATIVE 1] AWS Reserved Instances (Target: Month 12)**
- **Current State:** On-demand pricing for all EC2 instances
- **Target State:** 1-year reserved instances for production workloads
- **Expected Savings:** $1,800/month (15% reduction on compute)
- **Owner:** [PLACEHOLDER - DevOps Engineer]
- **Due Date:** [PLACEHOLDER]

**[INITIATIVE 2] Annual Prepayment Discounts (Ongoing)**
- **Current State:** Monthly billing on 40% of tools
- **Target State:** Annual prepayment for all tools > $1,000/year
- **Expected Savings:** $3,500/year (10-20% discount average)
- **Owner:** [PLACEHOLDER - Head of Finance]
- **Due Date:** As renewals come up

**[INITIATIVE 3] Tool Consolidation Review (Target: Q2)**
- **Current State:** 45+ tools in tech stack
- **Target State:** Reduce to 35 tools by consolidating overlapping functionality
- **Examples:**
  - Migrate from SendGrid to AWS SES (save $1,200/year, lose features)
  - Consolidate Loom + Zoom Webinars (save $720/year)
  - Use GitHub Actions instead of CircleCI (save $1,800/year, slower builds)
- **Expected Savings:** $5,000/year
- **Owner:** [PLACEHOLDER - CTO]
- **Due Date:** [PLACEHOLDER]

**[INITIATIVE 4] Usage-Based Tool Audits (Monthly)**
- **Current State:** No visibility into per-user or per-event costs
- **Target State:** Monthly audit of Segment events, Snowflake queries, AWS usage
- **Expected Savings:** $2,000/month by eliminating wasteful usage
- **Owner:** [PLACEHOLDER - Engineering Manager]
- **Cadence:** Monthly

### Vendor Evaluation Process

When evaluating new tools, use this framework:

**[DECISION CRITERIA]**
1. **Must-Have Capability:** Does this solve a critical problem?
2. **Build vs. Buy:** Would building take > 200 engineering hours?
3. **Integration:** Does it integrate with our existing stack?
4. **Security & Compliance:** Does it meet SOC 2, GDPR requirements?
5. **Cost:** Does it fit within budget constraints?
6. **Scalability:** Will it scale with us to 10,000+ customers?
7. **Alternatives:** Have we evaluated at least 2 alternatives?

**[APPROVAL REQUIRED]**
- < $1,000/year: Engineering Manager approval
- $1,000-$10,000/year: CTO approval
- > $10,000/year: CEO + CFO approval

**[TRIAL PERIOD]** All new tools require a 30-90 day trial before committing to annual contracts.

---

## Security & Access Management

### Access Control Principles

**[POLICY]** All tools must support:
- Single Sign-On (SSO) via Google Workspace or Auth0 (required for tools > $5K/year)
- Multi-Factor Authentication (MFA) enforced company-wide
- Role-Based Access Control (RBAC) for least-privilege access
- Audit logs for security and compliance reviews

### Provisioning & Deprovisioning

**[PROCESS]** Onboarding (Day 1):
1. Google Workspace account created (triggers SSO access)
2. Slack invitation
3. GitHub team assignment
4. Tool access provisioned based on role (see role matrix below)
5. 1Password vault access granted
6. BambooHR onboarding tasks assigned

**[PROCESS]** Offboarding (Same Day):
1. Google Workspace account suspended (revokes SSO)
2. Slack account deactivated
3. GitHub access revoked
4. 1Password vault access removed
5. Manual review of admin-level access (Salesforce, AWS, etc.)

### Tool Access Matrix by Role

| Tool | Engineering | Product | Sales | Marketing | Customer Success | Operations |
|------|-------------|---------|-------|-----------|-----------------|------------|
| GitHub | Full | Read | None | None | None | None |
| AWS Console | Admin (Leads) | None | None | None | None | Read |
| Figma | Read | Full | None | Edit | Read | Read |
| Salesforce | Read | Full | Full | Read | Full | Admin |
| Linear | Full | Full | Read | Read | Read | Full |
| Datadog | Full | Read | None | None | None | Read |
| Mixpanel | Read | Full | Read | Full | Full | Full |
| HubSpot | None | Read | Read | Full | Read | Admin |
| Notion | Edit | Edit | Edit | Edit | Edit | Edit |
| Google Workspace | Full | Full | Full | Full | Full | Full |

---

## Developer Environment Standards

### Required Local Tools (Engineering Team)

**[STANDARD]** All engineers must install:
- **Git** (version control)
- **Docker** (containerization)
- **Node.js** (LTS version via nvm)
- **Python 3.10+** (via pyenv)
- **PostgreSQL Client** (psql)
- **AWS CLI** (for S3, RDS access)
- **Postman** (API testing)
- **VS Code** (or approved IDE) + standard extensions

**[STANDARD]** VS Code Extensions:
- ESLint
- Prettier
- GitLens
- Docker
- Python
- AWS Toolkit
- GitHub Copilot (optional, team licenses available)

### Development Environment Setup

**[DOCUMENTATION]** Engineers should reference:
- `/docs/engineering/local-setup.md` (full onboarding guide)
- `/docs/engineering/docker-compose.yml` (local development stack)
- `/.env.example` (environment variable template)

**[ASSUMPTION]** Engineers provision their own laptops (MacBook Pro, company-provided). All tools are installed via Homebrew where possible.

---

## Disaster Recovery & Business Continuity

### Critical Systems & Recovery Time Objectives (RTO)

| System | Criticality | RTO | RPO | Backup Strategy | Owner |
|--------|-------------|-----|-----|-----------------|-------|
| AWS Production | P0 | 1 hour | 5 minutes | Multi-AZ, auto-failover | [PLACEHOLDER] |
| PostgreSQL RDS | P0 | 1 hour | 5 minutes | Automated snapshots, point-in-time recovery | [PLACEHOLDER] |
| MongoDB Atlas | P0 | 1 hour | 15 minutes | Continuous backup, cross-region | [PLACEHOLDER] |
| Salesforce | P1 | 4 hours | 1 day | Weekly exports, sandbox | [PLACEHOLDER] |
| Google Workspace | P1 | 4 hours | 1 day | Google Vault, Spanning Backup | [PLACEHOLDER] |
| GitHub | P1 | 24 hours | 1 day | Local clones, GitHub Arctic Code Vault | [PLACEHOLDER] |

**[ASSUMPTION]** Disaster recovery testing quarterly. Runbooks maintained in `/docs/runbooks/`.

---

## Technology Roadmap & Future Additions

### Planned Additions (Next 6 Months)

**[ROADMAP]** Feature Flagging System
- **Tool:** LaunchDarkly or Flagsmith
- **Cost:** $[PLACEHOLDER - 300]/month
- **Rationale:** Safe feature rollouts, A/B testing, kill switches
- **Owner:** [PLACEHOLDER - Product Engineering Lead]
- **Target Date:** [PLACEHOLDER - Q3 2024]

**[ROADMAP]** Customer Success Platform
- **Tool:** ChurnZero or Vitally
- **Cost:** $[PLACEHOLDER - 600]/month
- **Rationale:** Health scores, playbooks, automated outreach
- **Owner:** [PLACEHOLDER - Head of Customer Success]
- **Target Date:** [PLACEHOLDER - Q4 2024]

**[ROADMAP]** Data Quality Monitoring
- **Tool:** Monte Carlo or Great Expectations
- **Cost:** $[PLACEHOLDER - 400]/month
- **Rationale:** Data pipeline monitoring, anomaly detection
- **Owner:** [PLACEHOLDER - Data Engineer]
- **Target Date:** [PLACEHOLDER - Q3 2024]

### Under Evaluation

**[EVALUATION]** Observability Platform Upgrade
- **Current:** Datadog
- **Alternative:** Honeycomb or New Relic
- **Decision Date:** [PLACEHOLDER - Month/Year]
- **Rationale:** Evaluating cost vs. advanced tracing capabilities

**[EVALUATION]** Experimentation Platform
- **Options:** Optimizely, Split.io, LaunchDarkly
- **Decision Date:** [PLACEHOLDER - Month/Year]
- **Rationale:** Native A/B testing for product features

---

## Reconciliation with Financial Model

**[CROSS-REFERENCE]** The tech stack costs in this document map to `/04-finance/financial-model.md` as follows:

### COGS Mapping

| Financial Model Line Item | Tech Stack Components | Monthly Cost | Annual Cost |
|---------------------------|----------------------|--------------|-------------|
| Infrastructure & Hosting | AWS, Vercel, MongoDB Atlas, Redis, Cloudflare | $11,130 | $133,560 |
| Third-Party Services | Twilio, SendGrid, Auth0, Stripe (payment processing in separate line) | $750 | $9,000 |

**[VALIDATION]** Financial model assumes $10,000/month infrastructure costs in Year 1. Actual detailed tech stack shows $11,130/month. **Variance: +11%**. This is acceptable as financial model includes buffer for usage spikes.

### Operating Expense Mapping

**R&D Infrastructure:**

| Financial Model (Year 1) | Actual Tech Stack | Variance |
|--------------------------|-------------------|----------|
| $36,000/year ($3K/month) | GitHub, Postman, Figma, Linear, CircleCI, Docker Hub, BrowserStack, Sentry, Datadog, PagerDuty, Segment, dbt = $3,516/month ($42,192/year) | +17% |

**[ACTION REQUIRED]** Update financial model R&D infrastructure line to $42,000/year.

**Sales & Marketing:**

| Financial Model (Year 1) | Actual Tech Stack | Variance |
|--------------------------|-------------------|----------|
| Included in $240K marketing budget | Outreach, ZoomInfo, HubSpot, Webflow, Intercom = $2,692/month ($32,304/year) | Within budget |

**G&A:**

| Financial Model (Year 1) | Actual Tech Stack | Variance |
|--------------------------|-------------------|----------|
| Included in $385K G&A budget | Slack, Zoom, Loom, Google Workspace, Notion, Calendly, Gusto, BambooHR = $1,586/month ($19,032/year) | Within budget |

**Security:**

| Financial Model (Year 1) | Actual Tech Stack | Variance |
|--------------------------|-------------------|----------|
| Not explicitly broken out | Snyk, 1Password, Vanta, OneTrust, Jamf, AWS Secrets Manager = $1,765/month ($21,180/year) | **Missing in financial model** |

**[ACTION REQUIRED]** Add Security & Compliance line item to G&A operating expenses: $21,180/year (Year 1).

### Total Reconciliation

**Tech Stack Total:** $28,000/month = $336,000/year  
**Financial Model Allocation:**
- COGS: $133,560 + third-party ($9,000) = $142,560
- R&D: $42,192
- Sales & Marketing: $32,304
- G&A: $19,032
- Security (missing): $21,180
- **Subtotal:** $257,268

**[DISCREPANCY]** Financial model is missing ~$78,732/year in detailed tech stack costs, primarily due to:
1. Data & Analytics tools ($19,248) - should be in COGS or R&D
2. Detailed infrastructure costs being higher than assumed
3. Security tools not broken out as separate line item

**[RECOMMENDATION]** Revise financial model to reflect actual bottom-up tech stack costs, or revise tech stack to fit financial model constraints.

---

## Next Steps

### Immediate Actions (Month 0-1)

1. **Finalize Tool Contracts**
   - Negotiate annual contracts with AWS, Salesforce, Datadog for Year 1 discounts
   - Lock in startup pricing with Vanta, Segment, Snowflake (often 50% off first year)
   - Owner: [PLACEHOLDER - CFO/Head of Operations]
   - Due: [PLACEHOLDER - Date]

2. **Reconcile Financial Model**
   - Update `/04-finance/financial-model.md` with detailed tech stack costs
   - Add Security & Compliance operating expense line item
   - Adjust R&D infrastructure budget to $42K/year
   - Owner: [PLACEHOLDER - CFO]
   - Due: [PLACEHOLDER - Date]

3. **Set Up SSO & Security**
   - Configure Google Workspace as SSO provider
   - Enable MFA across all tools
   - Audit admin access and implement least-privilege
   - Owner: [PLACEHOLDER - Head of Security/IT]
   - Due: [PLACEHOLDER - Date]

### Ongoing Management (Monthly)

4. **Track Actual Costs**
   - Monitor usage-based tools (AWS, Snowflake, Twilio, SendGrid) for overages
   - Compare actual vs. budgeted costs
   - Flag variances > 20% to finance team
   - Owner: [PLACEHOLDER - Engineering Manager + Finance]
   - Cadence: Monthly

5. **Vendor Renewals**
   - Review renewal calendar 90 days in advance
   - Negotiate pricing, evaluate alternatives
   - Seek annual prepayment discounts
   - Owner: [PLACEHOLDER - Head of Operations]
   - Cadence: As renewals approach

### Quarterly Reviews

6. **Tech Stack Optimization**
   - Audit tool usage (are we using all the features we're paying for?)
   - Identify consolidation opportunities
   - Benchmark costs against industry standards
   - Present findings to executive team
   - Owner: [PLACEHOLDER - CTO + CFO]
   - Cadence: Quarterly

---

## Appendix

### Glossary

**COGS:** Cost of Goods Sold - direct costs to deliver product to customers  
**OpEx:** Operating Expenses - indirect costs to run the business  
**MRR:** Monthly Recurring Revenue  
**ARR:** Annual Recurring Revenue  
**SSO:** Single Sign-On  
**MFA:** Multi-Factor Authentication  
**RTO:** Recovery Time Objective - how quickly to restore after outage  
**RPO:** Recovery Point Objective - maximum acceptable data loss

### Document Control

**Review Cycle:** Quarterly (tech stack changes), Monthly (cost tracking)  
**Approvers:** CTO, CFO  
**Distribution:** Executive Team, Engineering Leads, Finance Team  
**Classification:** Internal - Confidential

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [PLACEHOLDER] | [PLACEHOLDER] | Initial tech stack documentation |

---

*This tech stack is current as of [PLACEHOLDER - Date] and reflects planned costs for Year 1. Actual costs may vary based on usage, team size, and feature adoption. Review quarterly.*
