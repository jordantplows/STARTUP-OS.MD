# Vendor List

**Version:** 1.0  
**Last Updated:** [PLACEHOLDER - Date]  
**Owner:** [PLACEHOLDER - Head of Finance / Head of Operations]  
**Status:** Active

## Overview

This document provides a comprehensive inventory of all vendors, SaaS tools, contractors, and service providers used by [PLACEHOLDER - Company Name]. It includes tool purpose, monthly and annual costs, contract owner, renewal dates, and renewal processes. This vendor list enables cost tracking, contract management, and vendor negotiation.

### Purpose

- Centralized inventory of all vendors and service providers
- Track software spend and identify cost optimization opportunities
- Manage contract renewals and avoid surprise expirations
- Enable vendor performance evaluation and alternatives analysis
- Support budget planning and financial forecasting
- Facilitate security and compliance audits

### Total Vendor Spend Summary

| Category | Vendors | Monthly Cost | Annual Cost | % of Total |
|----------|---------|--------------|-------------|------------|
| Infrastructure & Cloud | 8 | $[PLACEHOLDER - 12,500] | $[PLACEHOLDER - 150,000] | 45% |
| Product & Engineering | 10 | $[PLACEHOLDER - 4,200] | $[PLACEHOLDER - 50,400] | 15% |
| Data & Analytics | 7 | $[PLACEHOLDER - 2,800] | $[PLACEHOLDER - 33,600] | 10% |
| Security & Compliance | 6 | $[PLACEHOLDER - 3,100] | $[PLACEHOLDER - 37,200] | 11% |
| Productivity & Collaboration | 8 | $[PLACEHOLDER - 2,400] | $[PLACEHOLDER - 28,800] | 9% |
| Sales & Marketing | 5 | $[PLACEHOLDER - 3,000] | $[PLACEHOLDER - 36,000] | 10% |
| **TOTAL VENDORS** | **44** | **$28,000** | **$336,000** | **100%** |

**[CROSS-REFERENCE]** This vendor list reconciles with:
- `/08-operations/tech-stack.md` (detailed tech stack breakdown)
- `/04-finance/financial-model.md` (monthly burn rate and operating expenses)

**[VALIDATION]** Total annual vendor spend of $336,000 maps to financial model as follows:
- COGS: $142,560 (Infrastructure + Third-party services)
- R&D OpEx: $42,192 (Engineering tools)
- Sales & Marketing OpEx: $32,304 (Sales/marketing tools)
- G&A OpEx: $40,212 (Productivity tools + Security)
- Data & Analytics: $33,600 (split between COGS and R&D)
- **Subtotal from Financial Model: $290,868**

**[DISCREPANCY NOTE]** Financial model understates actual vendor costs by ~$45K/year. Recommend adjusting financial model to reflect actual bottom-up costs, or identify tools to cut to meet budget.

---

## Vendor Management Process

### Contract Lifecycle

**1. Vendor Evaluation & Selection**
- Business need identified by team or department head
- Alternatives evaluated (minimum 2-3 options)
- Security and compliance review (for tools > $5K/year)
- Trial period (30-90 days recommended)
- Approval based on spend tier (see below)

**2. Contract Negotiation**
- Request annual prepayment discount (typically 10-20%)
- Negotiate startup pricing (many vendors offer 50% off Year 1)
- Review SLA, data ownership, and termination clauses
- Redline contract if needed (involve legal for > $25K/year)

**3. Onboarding & Implementation**
- Provision accounts and SSO integration
- Configure tool and integrations
- Train team and document usage in Notion
- Add to vendor list with renewal date

**4. Ongoing Management**
- Track usage and ROI monthly
- Monitor costs (especially usage-based pricing)
- Review at 90 days before renewal (continue, renegotiate, or cancel)
- Update vendor list with any changes

**5. Renewal or Termination**
- 90 days before renewal: Evaluate performance and alternatives
- 60 days before renewal: Negotiate pricing or initiate RFP for alternatives
- 30 days before renewal: Make decision (renew, switch, cancel)
- If terminating: Export data, deprovision access, confirm no auto-renewal

**[POLICY]** All contracts > $10K/year require CFO approval. All contracts > $50K/year require CEO approval.

### Approval Matrix

| Annual Spend | Approver | Security Review Required |
|--------------|----------|--------------------------|
| < $1,000 | Department Head | No |
| $1,000 - $10,000 | Department Head + CTO/CFO | No |
| $10,000 - $25,000 | CFO + CEO | Yes |
| $25,000 - $50,000 | CFO + CEO | Yes |
| > $50,000 | CFO + CEO + Board (if material) | Yes |

---

## Infrastructure & Cloud Services

### Amazon Web Services (AWS)

**Category:** Cloud Infrastructure  
**Purpose:** Primary cloud provider (compute, storage, databases, networking)

**Monthly Cost:** $[PLACEHOLDER - 10,000]  
**Annual Cost:** $[PLACEHOLDER - 120,000]  
**Pricing Model:** Usage-based (pay-as-you-go)

**Contract Type:** No commitment (can cancel anytime)  
**Contract Owner:** [PLACEHOLDER - Director of Engineering]  
**Renewal Date:** N/A (monthly billing)  
**Payment Method:** Corporate credit card (auto-pay)

**Services Used:** EC2, RDS, S3, CloudFront, Route 53, ELB, VPC, CloudWatch  
**Notes:** Enrolled in AWS Startup Credits program ($10K in credits, expires [PLACEHOLDER - Date])

**Alternatives Evaluated:** Google Cloud Platform, Microsoft Azure  
**Last Review Date:** [PLACEHOLDER - Date]  
**Next Review Date:** [PLACEHOLDER - Date] (annual cost review)

**Optimization Opportunities:**
- Switch to Reserved Instances for production workloads (save ~15%)
- Implement auto-scaling to reduce over-provisioning
- Archive old S3 data to Glacier (save ~50% on storage)

---

### Vercel

**Category:** Frontend Hosting  
**Purpose:** Hosting and deployment for web application frontend

**Monthly Cost:** $[PLACEHOLDER - 150]  
**Annual Cost:** $[PLACEHOLDER - 1,800]  
**Pricing Model:** Subscription (Pro Plan)

**Contract Type:** Annual prepay (15% discount vs. monthly)  
**Contract Owner:** [PLACEHOLDER - Lead Frontend Engineer]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card  
**Notice Period:** 30 days

**Notes:** Free tier available but insufficient for production. Pro plan includes custom domains, analytics, and priority support.

**Alternatives Evaluated:** Netlify, AWS Amplify  
**Last Review Date:** [PLACEHOLDER - Date]  
**Next Review Date:** [PLACEHOLDER - 90 days before renewal]

---

### MongoDB Atlas

**Category:** Database (NoSQL)  
**Purpose:** Managed MongoDB for user-generated content and document storage

**Monthly Cost:** $[PLACEHOLDER - 580]  
**Annual Cost:** $[PLACEHOLDER - 6,960]  
**Pricing Model:** Subscription (M10 cluster)

**Contract Type:** Monthly billing (no commitment)  
**Contract Owner:** [PLACEHOLDER - Backend Lead]  
**Renewal Date:** N/A (monthly billing)  
**Payment Method:** Corporate credit card (auto-pay)

**Notes:** Running dedicated M10 cluster in us-east-1. Auto-scaling enabled.

**Alternatives Evaluated:** AWS DocumentDB, self-hosted MongoDB  
**Last Review Date:** [PLACEHOLDER - Date]  
**Next Review Date:** [PLACEHOLDER - Date] (quarterly cost review)

---

### Redis Cloud

**Category:** Database (In-Memory Cache)  
**Purpose:** Caching, session storage, real-time features

**Monthly Cost:** $[PLACEHOLDER - 200]  
**Annual Cost:** $[PLACEHOLDER - 2,400]  
**Pricing Model:** Subscription (based on memory size)

**Contract Type:** Monthly billing (no commitment)  
**Contract Owner:** [PLACEHOLDER - Backend Lead]  
**Renewal Date:** N/A  
**Payment Method:** Corporate credit card (auto-pay)

**Alternatives Evaluated:** AWS ElastiCache, self-hosted Redis  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Cloudflare

**Category:** CDN, DNS, Security  
**Purpose:** DNS, DDoS protection, WAF, CDN

**Monthly Cost:** $[PLACEHOLDER - 200]  
**Annual Cost:** $[PLACEHOLDER - 2,400]  
**Pricing Model:** Subscription (Pro Plan)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - DevOps Engineer]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card  
**Notice Period:** 30 days

**Notes:** Essential for security (DDoS protection, WAF). Free tier available but lacks advanced security features.

**Alternatives Evaluated:** AWS CloudFront + Shield, Fastly  
**Last Review Date:** [PLACEHOLDER - Date]  
**Next Review Date:** [PLACEHOLDER - 60 days before renewal]

---

### Auth0

**Category:** Authentication  
**Purpose:** User authentication, SSO, MFA

**Monthly Cost:** $[PLACEHOLDER - 250]  
**Annual Cost:** $[PLACEHOLDER - 3,000]  
**Pricing Model:** Subscription (Essentials Plan)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Security Lead]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Invoice (NET 30)  
**Notice Period:** 60 days

**Notes:** Critical for security and compliance. Includes enterprise SSO (SAML, OIDC).

**Alternatives Evaluated:** Okta, AWS Cognito, self-built  
**Last Review Date:** [PLACEHOLDER - Date]  
**Next Review Date:** [PLACEHOLDER - 90 days before renewal]

---

### Twilio

**Category:** Communications API  
**Purpose:** SMS notifications, 2FA, transactional messaging

**Monthly Cost:** $[PLACEHOLDER - 350] (usage-based, average)  
**Annual Cost:** $[PLACEHOLDER - 4,200]  
**Pricing Model:** Usage-based (pay-as-you-go)

**Contract Type:** No commitment  
**Contract Owner:** [PLACEHOLDER - Product Engineering Lead]  
**Renewal Date:** N/A  
**Payment Method:** Corporate credit card (auto-pay)

**Notes:** Usage varies by customer volume. Pricing: ~$0.0075/SMS (US).

**Alternatives Evaluated:** AWS SNS, Vonage  
**Last Review Date:** [PLACEHOLDER - Date]  
**Next Review Date:** [PLACEHOLDER - Date] (quarterly cost review)

---

### SendGrid

**Category:** Email Delivery  
**Purpose:** Transactional and marketing emails

**Monthly Cost:** $[PLACEHOLDER - 150]  
**Annual Cost:** $[PLACEHOLDER - 1,800]  
**Pricing Model:** Subscription (Pro 100K Plan)

**Contract Type:** Monthly billing  
**Contract Owner:** [PLACEHOLDER - Product Engineering Lead]  
**Renewal Date:** N/A  
**Payment Method:** Corporate credit card (auto-pay)

**Notes:** Sending ~80K emails/month. Plan includes 100K emails/month, IP reputation monitoring.

**Alternatives Evaluated:** AWS SES, Mailgun, Postmark  
**Last Review Date:** [PLACEHOLDER - Date]  
**Next Review Date:** [PLACEHOLDER - Date]

---

## Product & Engineering Tools

### GitHub

**Category:** Version Control & CI/CD  
**Purpose:** Git hosting, code review, GitHub Actions

**Monthly Cost:** $[PLACEHOLDER - 21]  
**Annual Cost:** $[PLACEHOLDER - 252]  
**Pricing Model:** Subscription (Team Plan - 15 seats @ $4/seat + Actions usage)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Engineering Manager]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card  
**Notice Period:** 30 days

**Notes:** Essential tool. Price scales with team size. Actions usage typically $5-10/month.

**Alternatives Evaluated:** GitLab, Bitbucket  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Postman

**Category:** API Development  
**Purpose:** API testing, documentation, collaboration

**Monthly Cost:** $[PLACEHOLDER - 144]  
**Annual Cost:** $[PLACEHOLDER - 1,728]  
**Pricing Model:** Subscription (Professional Plan - 12 seats @ $12/seat)

**Contract Type:** Annual prepay (20% discount)  
**Contract Owner:** [PLACEHOLDER - Backend Lead]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Alternatives Evaluated:** Insomnia, curl scripts  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Figma

**Category:** Design & Prototyping  
**Purpose:** Product design, design system, prototypes

**Monthly Cost:** $[PLACEHOLDER - 135]  
**Annual Cost:** $[PLACEHOLDER - 1,620]  
**Pricing Model:** Subscription (Professional Plan - 3 seats @ $15/seat, billed annually @ $12/seat)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Design]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Industry-standard design tool. Includes unlimited projects, version history, shared libraries.

**Alternatives Evaluated:** Sketch, Adobe XD, Framer  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Linear

**Category:** Project Management  
**Purpose:** Issue tracking, sprint planning, roadmaps

**Monthly Cost:** $[PLACEHOLDER - 160]  
**Annual Cost:** $[PLACEHOLDER - 1,920]  
**Pricing Model:** Subscription (Standard Plan - 20 seats @ $8/seat)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Engineering Manager]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Fast, keyboard-driven. Excellent GitHub integration. Price scales with team size.

**Alternatives Evaluated:** Jira, Asana, GitHub Projects  
**Last Review Date:** [PLACEHOLDER - Date]

---

### CircleCI

**Category:** CI/CD  
**Purpose:** Continuous integration and deployment pipelines

**Monthly Cost:** $[PLACEHOLDER - 150]  
**Annual Cost:** $[PLACEHOLDER - 1,800]  
**Pricing Model:** Subscription (Performance Plan)

**Contract Type:** Monthly billing  
**Contract Owner:** [PLACEHOLDER - DevOps Engineer]  
**Renewal Date:** N/A  
**Payment Method:** Corporate credit card

**Notes:** Runs ~200 builds/week. Performance plan includes 5 parallel jobs, Docker layer caching.

**Alternatives Evaluated:** GitHub Actions, GitLab CI, Jenkins  
**Last Review Date:** [PLACEHOLDER - Date]

---

### BrowserStack

**Category:** Testing  
**Purpose:** Cross-browser and cross-device testing

**Monthly Cost:** $[PLACEHOLDER - 99]  
**Annual Cost:** $[PLACEHOLDER - 1,188]  
**Pricing Model:** Subscription (Team Plan - 5 parallel tests)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - QA Lead]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Alternatives Evaluated:** Sauce Labs, LambdaTest  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Sentry

**Category:** Error Tracking  
**Purpose:** Error monitoring, performance tracking, alerting

**Monthly Cost:** $[PLACEHOLDER - 80]  
**Annual Cost:** $[PLACEHOLDER - 960]  
**Pricing Model:** Subscription (Team Plan)

**Contract Type:** Monthly billing  
**Contract Owner:** [PLACEHOLDER - Engineering Manager]  
**Renewal Date:** N/A  
**Payment Method:** Corporate credit card

**Notes:** Tracks ~1M events/month. Includes release tracking, performance monitoring, alerting.

**Alternatives Evaluated:** Rollbar, Bugsnag  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Datadog

**Category:** Observability  
**Purpose:** Infrastructure monitoring, APM, log aggregation

**Monthly Cost:** $[PLACEHOLDER - 500]  
**Annual Cost:** $[PLACEHOLDER - 6,000]  
**Pricing Model:** Subscription (Pro Plan - 10 hosts)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - DevOps Engineer]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Invoice (NET 30)  
**Notice Period:** 30 days

**Notes:** Monitoring all production and staging infrastructure. Price scales with host count.

**Alternatives Evaluated:** New Relic, Grafana + Prometheus  
**Last Review Date:** [PLACEHOLDER - Date]

---

### PagerDuty

**Category:** Incident Management  
**Purpose:** On-call scheduling, alerting, incident response

**Monthly Cost:** $[PLACEHOLDER - 125]  
**Annual Cost:** $[PLACEHOLDER - 1,500]  
**Pricing Model:** Subscription (Professional Plan - 5 users)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Engineering Manager]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Integrates with Datadog, Sentry. Includes escalation policies, mobile alerts, status pages.

**Alternatives Evaluated:** Opsgenie, VictorOps  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Docker Hub

**Category:** Container Registry  
**Purpose:** Docker image storage and distribution

**Monthly Cost:** $[PLACEHOLDER - 5]  
**Annual Cost:** $[PLACEHOLDER - 60]  
**Pricing Model:** Subscription (Pro Plan)

**Contract Type:** Monthly billing  
**Contract Owner:** [PLACEHOLDER - DevOps Engineer]  
**Renewal Date:** N/A  
**Payment Method:** Corporate credit card

**Alternatives Evaluated:** AWS ECR, GitHub Container Registry  
**Last Review Date:** [PLACEHOLDER - Date]

---

## Data & Analytics

### Mixpanel

**Category:** Product Analytics  
**Purpose:** User behavior tracking, funnel analysis, cohort analysis

**Monthly Cost:** $[PLACEHOLDER - 249]  
**Annual Cost:** $[PLACEHOLDER - 2,988]  
**Pricing Model:** Subscription (Growth Plan)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Product Manager]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Tracking ~500K events/month. Includes unlimited users, cohort analysis, A/B testing.

**Alternatives Evaluated:** Amplitude, Google Analytics, Heap  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Segment

**Category:** Customer Data Platform  
**Purpose:** Event routing, data pipeline, integrations

**Monthly Cost:** $[PLACEHOLDER - 120]  
**Annual Cost:** $[PLACEHOLDER - 1,440]  
**Pricing Model:** Subscription (Team Plan)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Data Engineer]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Routes events to Mixpanel, Salesforce, data warehouse. Includes 2 sources, 5 destinations.

**Alternatives Evaluated:** RudderStack, mParticle  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Metabase

**Category:** Business Intelligence  
**Purpose:** Dashboards, SQL queries, data visualization

**Monthly Cost:** $[PLACEHOLDER - 85]  
**Annual Cost:** $[PLACEHOLDER - 1,020]  
**Pricing Model:** Subscription (Pro Cloud - 10 users)

**Contract Type:** Monthly billing  
**Contract Owner:** [PLACEHOLDER - Head of Operations]  
**Renewal Date:** N/A  
**Payment Method:** Corporate credit card

**Notes:** Self-service BI for non-technical teams. Connects to PostgreSQL, Snowflake.

**Alternatives Evaluated:** Looker, Tableau, Mode  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Snowflake

**Category:** Data Warehouse  
**Purpose:** Cloud data warehouse for analytics

**Monthly Cost:** $[PLACEHOLDER - 800] (usage-based, average)  
**Annual Cost:** $[PLACEHOLDER - 9,600]  
**Pricing Model:** Usage-based (compute + storage)

**Contract Type:** No commitment (pay-as-you-go)  
**Contract Owner:** [PLACEHOLDER - Data Engineer]  
**Renewal Date:** N/A  
**Payment Method:** Corporate credit card (auto-pay)

**Notes:** Usage varies by query volume. Running on XS warehouse, auto-suspend enabled.

**Alternatives Evaluated:** Google BigQuery, AWS Redshift  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Fivetran

**Category:** Data Integration (ETL)  
**Purpose:** Extract data from sources to data warehouse

**Monthly Cost:** $[PLACEHOLDER - 350]  
**Annual Cost:** $[PLACEHOLDER - 4,200]  
**Pricing Model:** Subscription (Starter Plan)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Data Engineer]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Syncing Salesforce, Stripe, Postgres to Snowflake. Includes 5 connectors.

**Alternatives Evaluated:** Stitch, Airbyte  
**Last Review Date:** [PLACEHOLDER - Date]

---

### dbt Cloud

**Category:** Data Transformation  
**Purpose:** Transform raw data in warehouse (SQL-based)

**Monthly Cost:** $[PLACEHOLDER - 100]  
**Annual Cost:** $[PLACEHOLDER - 1,200]  
**Pricing Model:** Subscription (Developer Plan - 2 seats)

**Contract Type:** Monthly billing  
**Contract Owner:** [PLACEHOLDER - Data Engineer]  
**Renewal Date:** N/A  
**Payment Method:** Corporate credit card

**Notes:** Running scheduled transformations daily. Includes documentation, testing, version control.

**Alternatives Evaluated:** Self-hosted dbt Core  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Salesforce

**Category:** CRM  
**Purpose:** Customer relationship management, sales pipeline

**Monthly Cost:** $[PLACEHOLDER - 750]  
**Annual Cost:** $[PLACEHOLDER - 9,000]  
**Pricing Model:** Subscription (Sales Cloud Professional - 10 users @ $75/user)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Sales]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Invoice (NET 30)  
**Notice Period:** 30 days

**Notes:** Standard plan includes reports, dashboards, mobile app. Integrates with Outreach, Segment.

**Alternatives Evaluated:** HubSpot CRM, Pipedrive  
**Last Review Date:** [PLACEHOLDER - Date]

---

## Security & Compliance

### Snyk

**Category:** Security Scanning  
**Purpose:** Vulnerability scanning for code, dependencies, containers

**Monthly Cost:** $[PLACEHOLDER - 450]  
**Annual Cost:** $[PLACEHOLDER - 5,400]  
**Pricing Model:** Subscription (Team Plan)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Security Lead]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Scans PRs automatically. Includes code scanning, dependency scanning, container scanning.

**Alternatives Evaluated:** WhiteSource, Dependabot, Veracode  
**Last Review Date:** [PLACEHOLDER - Date]

---

### 1Password Business

**Category:** Password Management  
**Purpose:** Team password manager, secrets sharing

**Monthly Cost:** $[PLACEHOLDER - 100]  
**Annual Cost:** $[PLACEHOLDER - 1,200]  
**Pricing Model:** Subscription (Business Plan - 25 users @ $8/user, billed annually)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of IT/Security]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Essential for security. Includes shared vaults, CLI for developers, audit logs.

**Alternatives Evaluated:** LastPass, Dashlane, Bitwarden  
**Last Review Date:** [PLACEHOLDER - Date]

---

### AWS Secrets Manager

**Category:** Secrets Management  
**Purpose:** Store and rotate application secrets

**Monthly Cost:** $[PLACEHOLDER - 40] (usage-based)  
**Annual Cost:** $[PLACEHOLDER - 480]  
**Pricing Model:** Usage-based (~$0.40/secret/month + API calls)

**Contract Type:** No commitment  
**Contract Owner:** [PLACEHOLDER - DevOps Engineer]  
**Renewal Date:** N/A  
**Payment Method:** AWS billing (corporate credit card)

**Notes:** Storing ~100 secrets (DB credentials, API keys). Auto-rotation enabled for RDS.

**Alternatives Evaluated:** HashiCorp Vault, GCP Secret Manager  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Vanta

**Category:** Security & Compliance  
**Purpose:** SOC 2, ISO 27001, GDPR compliance automation

**Monthly Cost:** $[PLACEHOLDER - 650]  
**Annual Cost:** $[PLACEHOLDER - 7,800]  
**Pricing Model:** Subscription (Growth Plan)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Security/Compliance]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Invoice (NET 30)  
**Notice Period:** 60 days

**Notes:** Automates evidence collection for SOC 2 Type II audit. Integrates with AWS, GitHub, Google Workspace.

**Alternatives Evaluated:** Drata, Secureframe  
**Last Review Date:** [PLACEHOLDER - Date]

---

### OneTrust

**Category:** Privacy Compliance  
**Purpose:** GDPR, CCPA compliance, cookie consent

**Monthly Cost:** $[PLACEHOLDER - 400]  
**Annual Cost:** $[PLACEHOLDER - 4,800]  
**Pricing Model:** Subscription (Essentials Plan)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Legal/Compliance]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Invoice (NET 30)

**Notes:** Cookie consent banner, data mapping, privacy request automation.

**Alternatives Evaluated:** TrustArc, Osano  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Jamf (macOS Management)

**Category:** Device Management (MDM)  
**Purpose:** Mac device management, security policies

**Monthly Cost:** $[PLACEHOLDER - 125]  
**Annual Cost:** $[PLACEHOLDER - 1,500]  
**Pricing Model:** Subscription (Jamf Now - 25 devices @ $2/device/month + setup)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of IT]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Enforces disk encryption, screen lock, software updates, remote wipe.

**Alternatives Evaluated:** Kandji, Mosyle  
**Last Review Date:** [PLACEHOLDER - Date]

---

## Productivity & Collaboration

### Slack

**Category:** Team Communication  
**Purpose:** Team chat, integrations, notifications

**Monthly Cost:** $[PLACEHOLDER - 200]  
**Annual Cost:** $[PLACEHOLDER - 2,400]  
**Pricing Model:** Subscription (Pro Plan - 25 users @ $8/user, billed annually)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Operations]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Essential tool. Includes unlimited message history, integrations, workflows, screen sharing.

**Alternatives Evaluated:** Microsoft Teams, Discord  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Zoom

**Category:** Video Conferencing  
**Purpose:** Video calls, webinars, screen sharing

**Monthly Cost:** $[PLACEHOLDER - 150]  
**Annual Cost:** $[PLACEHOLDER - 1,800]  
**Pricing Model:** Subscription (Business Plan - 10 licenses @ $15/user)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Operations]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Includes recording, breakout rooms, webinars (up to 100 attendees).

**Alternatives Evaluated:** Google Meet, Microsoft Teams  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Loom

**Category:** Async Video  
**Purpose:** Screen recording, async video messaging

**Monthly Cost:** $[PLACEHOLDER - 120]  
**Annual Cost:** $[PLACEHOLDER - 1,440]  
**Pricing Model:** Subscription (Business Plan - 20 users @ $12.50/user, billed annually @ $10/user)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Operations]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Great for reducing meetings. Includes transcriptions, custom branding, analytics.

**Alternatives Evaluated:** Soapbox, Vidyard  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Google Workspace

**Category:** Email & Productivity  
**Purpose:** Email, calendar, docs, sheets, drive

**Monthly Cost:** $[PLACEHOLDER - 360]  
**Annual Cost:** $[PLACEHOLDER - 4,320]  
**Pricing Model:** Subscription (Business Standard - 30 users @ $12/user)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Operations]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Essential. Includes unlimited storage, admin controls, mobile device management.

**Alternatives Evaluated:** Microsoft 365  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Notion

**Category:** Documentation & Wiki  
**Purpose:** Company wiki, documentation, project management

**Monthly Cost:** $[PLACEHOLDER - 160]  
**Annual Cost:** $[PLACEHOLDER - 1,920]  
**Pricing Model:** Subscription (Plus Plan - 20 users @ $10/user, billed annually @ $8/user)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Operations]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Single source of truth for all docs. Includes unlimited file uploads, version history, advanced permissions.

**Alternatives Evaluated:** Confluence, Coda  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Calendly

**Category:** Scheduling  
**Purpose:** Meeting scheduling automation

**Monthly Cost:** $[PLACEHOLDER - 96]  
**Annual Cost:** $[PLACEHOLDER - 1,152]  
**Pricing Model:** Subscription (Professional Plan - 12 users @ $12/user, billed annually @ $10/user)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Sales]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** Used by sales team for demo scheduling. Includes round-robin, Salesforce integration.

**Alternatives Evaluated:** Chili Piper, Google Calendar  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Gusto

**Category:** Payroll & HR  
**Purpose:** Payroll processing, benefits, compliance

**Monthly Cost:** $[PLACEHOLDER - 350]  
**Annual Cost:** $[PLACEHOLDER - 4,200]  
**Pricing Model:** Subscription (Complete Plan: $39/month base + $12/person for 25 employees)

**Contract Type:** Monthly billing  
**Contract Owner:** [PLACEHOLDER - Head of Finance/Operations]  
**Renewal Date:** N/A  
**Payment Method:** Corporate bank account (ACH)

**Notes:** Handles payroll, tax filings, benefits (health insurance, 401k). Essential compliance tool.

**Alternatives Evaluated:** Rippling, ADP  
**Last Review Date:** [PLACEHOLDER - Date]

---

### BambooHR

**Category:** HRIS & ATS  
**Purpose:** HR management, applicant tracking, onboarding

**Monthly Cost:** $[PLACEHOLDER - 250]  
**Annual Cost:** $[PLACEHOLDER - 3,000]  
**Pricing Model:** Subscription (Essentials Plan)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of People/HR]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** HRIS + ATS in one platform. Includes onboarding workflows, PTO tracking, performance reviews.

**Alternatives Evaluated:** Rippling, Greenhouse + Namely  
**Last Review Date:** [PLACEHOLDER - Date]

---

## Sales & Marketing Tools

### Outreach

**Category:** Sales Engagement  
**Purpose:** Sales sequences, cadences, dialer

**Monthly Cost:** $[PLACEHOLDER - 600]  
**Annual Cost:** $[PLACEHOLDER - 7,200]  
**Pricing Model:** Subscription (6 sales users @ $100/user)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Sales]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Invoice (NET 30)  
**Notice Period:** 60 days

**Notes:** Core sales tool. Includes sequences, dialer, analytics, Salesforce integration.

**Alternatives Evaluated:** SalesLoft, Apollo  
**Last Review Date:** [PLACEHOLDER - Date]

---

### ZoomInfo

**Category:** Contact Data  
**Purpose:** B2B contact database, lead enrichment

**Monthly Cost:** $[PLACEHOLDER - 800]  
**Annual Cost:** $[PLACEHOLDER - 9,600]  
**Pricing Model:** Subscription (Professional Plan - 3 seats)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Sales]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Invoice (NET 30)  
**Notice Period:** 90 days

**Notes:** Provides accurate contact data for prospecting. Integrates with Salesforce, Outreach.

**Alternatives Evaluated:** Clearbit, Apollo, Lusha  
**Last Review Date:** [PLACEHOLDER - Date]

---

### HubSpot Marketing Hub

**Category:** Marketing Automation  
**Purpose:** Email campaigns, landing pages, workflows

**Monthly Cost:** $[PLACEHOLDER - 800]  
**Annual Cost:** $[PLACEHOLDER - 9,600]  
**Pricing Model:** Subscription (Professional Plan)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Marketing]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Invoice (NET 30)  
**Notice Period:** 30 days

**Notes:** Marketing automation platform. Includes email, landing pages, forms, workflows, attribution.

**Alternatives Evaluated:** Marketo, Pardot  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Webflow

**Category:** Website CMS  
**Purpose:** Marketing website hosting and CMS

**Monthly Cost:** $[PLACEHOLDER - 42]  
**Annual Cost:** $[PLACEHOLDER - 504]  
**Pricing Model:** Subscription (CMS Plan + Site Plan)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Marketing]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Corporate credit card

**Notes:** No-code website builder for marketing team. Includes CMS, hosting, custom domain.

**Alternatives Evaluated:** WordPress, Contentful  
**Last Review Date:** [PLACEHOLDER - Date]

---

### Intercom

**Category:** Customer Messaging  
**Purpose:** Live chat, support ticketing, product tours

**Monthly Cost:** $[PLACEHOLDER - 450]  
**Annual Cost:** $[PLACEHOLDER - 5,400]  
**Pricing Model:** Subscription (Starter Plan: base + per-user + resolution bot)

**Contract Type:** Annual prepay  
**Contract Owner:** [PLACEHOLDER - Head of Customer Success]  
**Renewal Date:** [PLACEHOLDER - Month/Year]  
**Payment Method:** Invoice (NET 30)

**Notes:** In-app messaging, support ticketing, chatbot. Integrates with product analytics.

**Alternatives Evaluated:** Zendesk, Drift, Help Scout  
**Last Review Date:** [PLACEHOLDER - Date]

---

## Vendor Renewal Calendar

| Vendor | Contract End Date | Annual Cost | Notice Period | Owner | Status | Next Action |
|--------|------------------|-------------|---------------|-------|--------|-------------|
| AWS | N/A (monthly) | $120,000 | N/A | [PLACEHOLDER] | Active | Quarterly cost review |
| Salesforce | [PLACEHOLDER] | $9,000 | 30 days | [PLACEHOLDER] | Up for renewal | Negotiate pricing (90 days out) |
| Datadog | [PLACEHOLDER] | $6,000 | 30 days | [PLACEHOLDER] | Active | Review in Q3 |
| Vanta | [PLACEHOLDER] | $7,800 | 60 days | [PLACEHOLDER] | Active | Prepare for audit |
| HubSpot | [PLACEHOLDER] | $9,600 | 30 days | [PLACEHOLDER] | Negotiating | Exploring alternatives |
| ZoomInfo | [PLACEHOLDER] | $9,600 | 90 days | [PLACEHOLDER] | Active | Review ROI (usage reports) |
| Outreach | [PLACEHOLDER] | $7,200 | 60 days | [PLACEHOLDER] | Active | On track to renew |
| Snowflake | N/A (usage) | $9,600 | N/A | [PLACEHOLDER] | Active | Monitor usage monthly |
| GitHub | [PLACEHOLDER] | $252 | 30 days | [PLACEHOLDER] | Active | Auto-renew |
| Gusto | N/A (monthly) | $4,200 | 30 days | [PLACEHOLDER] | Active | Essential, will renew |

**[POLICY]** All renewals > $5K/year require approval from CFO at least 30 days before renewal date.

---

## Cost Optimization Initiatives

### Active Cost Savings Projects

**1. AWS Reserved Instances (Target: Month 12)**
- **Current State:** On-demand pricing ($10K/month)
- **Target State:** 1-year reserved instances for production workloads
- **Expected Savings:** $1,800/month (15% reduction)
- **Owner:** [PLACEHOLDER - DevOps Engineer]
- **Due Date:** [PLACEHOLDER]

**2. Annual Prepayment Discounts (Ongoing)**
- **Current State:** 40% of vendors billed monthly
- **Target State:** Annual prepay for all vendors > $1K/year
- **Expected Savings:** $3,500/year (10-20% discount average)
- **Owner:** [PLACEHOLDER - Head of Finance]
- **Due Date:** As renewals approach

**3. Tool Consolidation Review (Target: Q2)**
- **Current State:** 44 vendors
- **Target State:** Reduce to 35 by consolidating overlapping tools
- **Candidates for Consolidation:**
  - Migrate SendGrid → AWS SES (save $1,200/year, acceptable trade-off)
  - Consolidate Loom + Zoom Webinars (save $720/year)
  - Use GitHub Actions instead of CircleCI (save $1,800/year, slower builds)
- **Expected Savings:** $5,000/year
- **Owner:** [PLACEHOLDER - CTO]
- **Due Date:** [PLACEHOLDER]

**4. Usage-Based Tool Audits (Monthly)**
- **Current State:** No visibility into per-event or per-query costs
- **Target State:** Monthly audit of Segment, Snowflake, AWS, Twilio usage
- **Expected Savings:** $2,000/month by eliminating wasteful usage
- **Owner:** [PLACEHOLDER - Engineering Manager]
- **Cadence:** Monthly

### Upcoming Vendor Evaluations

**Q3 2024:**
- **Datadog vs. New Relic vs. Honeycomb:** Evaluate cost vs. features for observability
- **Salesforce vs. HubSpot CRM:** Re-evaluate CRM pricing and features as team scales

**Q4 2024:**
- **Twilio vs. AWS SNS:** Evaluate cost savings of switching to AWS SNS for SMS

---

## Vendor Performance & Satisfaction

### Vendor Scorecard (Quarterly Review)

| Vendor | Cost | Uptime/Reliability | Support Quality | Feature Set | Overall Score | Notes |
|--------|------|-------------------|----------------|-------------|---------------|-------|
| AWS | $10K/mo | 99.9% | Good | Excellent | 9/10 | Reliable, expensive |
| Salesforce | $750/mo | 99.5% | Good | Good | 7/10 | Expensive, clunky UI |
| Datadog | $500/mo | 99.9% | Excellent | Excellent | 9/10 | Best-in-class monitoring |
| Vanta | $650/mo | 99% | Excellent | Good | 8/10 | Saves audit time |
| HubSpot | $800/mo | 98% | Fair | Good | 6/10 | Considering alternatives |
| Linear | $160/mo | 99.9% | Excellent | Excellent | 10/10 | Team loves it |
| Notion | $160/mo | 98% | Good | Excellent | 9/10 | Occasional sync issues |

**Scoring:** 1-10 scale (1 = poor, 10 = excellent)

**Action Items from Scorecard:**
- HubSpot scored low (6/10) → Explore Marketo or Pardot alternatives
- Notion occasional sync issues → Monitor and escalate if worsens

---

## Vendor Security & Compliance

### Security Review Checklist

**For all vendors > $5K/year, verify:**
- ✅ SOC 2 Type II report (within last 12 months)
- ✅ Data Processing Agreement (DPA) signed
- ✅ GDPR & CCPA compliance confirmed
- ✅ SSO (Single Sign-On) enabled where available
- ✅ MFA (Multi-Factor Authentication) enforced
- ✅ Data encryption at rest and in transit
- ✅ Security incident response process documented
- ✅ Vendor added to Vanta for continuous monitoring

**Vendors requiring annual security review:**
- AWS, Salesforce, Datadog, Auth0, MongoDB Atlas, Snowflake, HubSpot, Intercom

**[CROSS-REFERENCE]** See `/08-operations/tech-stack.md` for full security policies.

---

## Next Steps

### Immediate Actions (Month 0-1)

1. **Finalize Vendor Contracts**
   - Negotiate annual contracts for top 10 vendors (AWS, Salesforce, Datadog, etc.)
   - Request startup pricing (50% discount Year 1 where available)
   - Lock in contracts before end of quarter
   - Owner: [PLACEHOLDER - CFO / Head of Operations]
   - Due: [PLACEHOLDER]

2. **Set Up Renewal Tracking**
   - Add all renewal dates to shared calendar (Google Calendar)
   - Set reminders 90 days, 60 days, 30 days before renewal
   - Create renewal approval workflow (who approves what spend tier)
   - Owner: [PLACEHOLDER - Head of Operations]
   - Due: [PLACEHOLDER]

3. **Vendor Security Audit**
   - Collect SOC 2 reports from all vendors > $5K/year
   - Sign DPAs where missing
   - Enable SSO for all tools that support it
   - Add vendors to Vanta for continuous monitoring
   - Owner: [PLACEHOLDER - Head of Security]
   - Due: [PLACEHOLDER]

### Ongoing (Monthly/Quarterly)

4. **Track Actual Costs**
   - Monitor usage-based vendors (AWS, Snowflake, Twilio) for overages
   - Compare actual vs. budgeted costs
   - Flag variances > 20% to finance team
   - Owner: [PLACEHOLDER - Engineering Manager + Finance Team]
   - Cadence: Monthly

5. **Vendor Renewals**
   - Review renewal calendar 90 days in advance
   - Evaluate alternatives and negotiate pricing
   - Seek annual prepayment discounts (10-20%)
   - Owner: [PLACEHOLDER - Department Heads + Finance]
   - Cadence: As renewals approach

6. **Quarterly Vendor Review**
   - Score vendors on cost, reliability, support, features (scorecard)
   - Identify underperforming vendors for replacement
   - Identify cost optimization opportunities
   - Present findings to leadership team
   - Owner: [PLACEHOLDER - CTO + CFO]
   - Cadence: Quarterly

---

## Appendix

### Glossary

**SaaS:** Software as a Service  
**Annual Prepay:** Paying for full year upfront (typically 10-20% discount)  
**Usage-Based Pricing:** Cost varies based on consumption (e.g., API calls, storage, compute)  
**Notice Period:** How far in advance you must notify vendor to cancel (e.g., 60 days)  
**NET 30:** Payment due within 30 days of invoice date  
**SSO:** Single Sign-On (one login for all tools)  
**MFA:** Multi-Factor Authentication  
**DPA:** Data Processing Agreement (required for GDPR compliance)

### Document Control

**Review Cycle:** Monthly (cost tracking), Quarterly (vendor performance), Annually (full audit)  
**Approvers:** CFO, CTO (for technical tools), CEO (for > $50K contracts)  
**Distribution:** Finance Team, Department Heads, Leadership Team  
**Classification:** Internal - Confidential (contains vendor pricing)

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [PLACEHOLDER] | [PLACEHOLDER] | Initial vendor list |

---

*This vendor list is current as of [PLACEHOLDER - Date]. Costs are estimates and may vary based on usage, team size, and contract negotiations. Review monthly to ensure accuracy.*
