# Startup-OS Configuration

This file contains your Startup Profile and configuration for the startup-os system. Claude Code reads this file every time you run a `/startup-os fill` command to ensure all documents are consistent and personalized to your startup.

---

## My Startup Profile

**Company Name**: [Your company name]

**One-line Description**: [Describe your startup in one sentence — what you do, who you serve]

**Industry**: [e.g., B2B SaaS, FinTech, HealthTech, E-commerce, etc.]

**Business Model**: [e.g., B2B SaaS, B2C Marketplace, Freemium, Enterprise, etc.]

**Target Customer**: [Be specific — job title, company size, pain points, etc.]

**Problem You Solve**: [What specific problem does your product solve?]

**Stage**: [Idea / Pre-seed / Seed / Series A]

**Location**: [City, State/Country — affects legal/incorporation advice]

**Founders**: [How many? Names and roles if available]

**Current Revenue**: [MRR/ARR if any, or "Pre-revenue"]

**Fundraising Goal**: [How much are you raising? e.g., "$500K pre-seed"]

**Target Launch/Close Date**: [When do you plan to launch MVP or close your round?]

---

## How This Works

1. **Fill out the profile above** — these answers drive every template in the repo
2. **Run `/startup-os fill <module>`** to fill one module at a time, or
3. **Run `/startup-os fill-all`** to fill all 50 templates in one shot
4. **Review and iterate** — use `/startup-os review <file>` to get investor-grade feedback

All templates read this file for context and cross-reference each other for consistency. If you update your profile (e.g., change pricing or target market), simply re-run the fill commands and Claude will update all affected documents to match.

---

## Notes & Assumptions

Use this space to document any specific assumptions, constraints, or context that Claude should know when filling templates:

- [e.g., "We're targeting mid-market companies (100-500 employees)"]
- [e.g., "Our pricing must stay under $X/month to compete with incumbent"]
- [e.g., "We have a technical co-founder and need to hire a sales leader"]

---

## Version History

Track major changes to your profile here:

- **2026-05-29**: Initial profile created
