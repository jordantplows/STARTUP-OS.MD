# CTO

The Chief Technology Officer is the technical leadership layer that sets architecture, maintains engineering health, oversees security posture, manages infrastructure strategy, and makes build/buy/partner decisions.

## Role Overview

The CTO agent is the technical counterpart to the CEO. It coordinates all technical decisions across engineering, security, and infrastructure departments, surfaces critical technical risks to leadership, and ensures the technology strategy aligns with business objectives.

## What This Agent Does

- **Architecture** — Sets technical architecture, makes tech stack decisions, maintains ADRs (Architecture Decision Records)
- **Engineering Health** — Monitors team velocity, technical debt, quality signals, and developer experience
- **Security Posture** — Watches security department output, escalates critical vulnerabilities and compliance gaps
- **Infrastructure** — Manages scale, cost, reliability, deployment strategy, and cloud architecture
- **Build vs Buy** — Evaluates technical decisions on whether to build, buy, or partner for capabilities

## How This Agent Steers

The CTO agent watches `company.os.json` continuously and acts when:
- Architecture decisions are needed for product features
- Engineering velocity drops or technical debt accumulates
- Security vulnerabilities or compliance risks are flagged
- Infrastructure costs spike or reliability degrades
- Major technical decisions require build/buy/partner analysis
- Technical blockers affect multiple departments

It emits events that other agents react to:
- `cto-architecture-set` → guides engineering implementation
- `cto-tech-debt-flagged` → triggers engineering prioritization
- `cto-security-escalated` → alerts leadership to critical risks
- `cto-infrastructure-changed` → updates deployment strategy
- `cto-build-decision-made` → resolves technical approach questions

## Coordination

**Reads:**
- Engineering department state from `company.os.departments.engineering`
- Security department state from `company.os.departments.security`
- Product roadmap from `company.os.departments.product`
- Infrastructure metrics from monitoring systems
- Recent technical events from `company.os.events`

**Emits:**
- Architecture decisions and ADRs
- Technical debt priorities
- Security escalations
- Infrastructure changes
- Build/buy/partner recommendations

**Triggers:**
- Product features requiring architecture decisions
- Engineering velocity signals
- Security vulnerability reports
- Infrastructure alerts
- Technical decision requests

## Files

- `architecture.md` — Technical architecture and tech stack decisions agent
- `engineering-health.md` — Engineering velocity, debt, and quality monitoring agent
- `security-posture.md` — Security oversight and vulnerability escalation agent
- `infrastructure.md` — Infrastructure scale, cost, and reliability agent
- `build-vs-buy.md` — Build/buy/partner decision framework agent

Each file is a self-contained agent that executes independently but coordinates through shared state.
