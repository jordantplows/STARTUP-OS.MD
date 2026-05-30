---
name: threat-model
description: >
  Generates STRIDE threat model by reading tech stack and product spec,
  producing asset inventory, attack surface map, STRIDE analysis table
  across 6 categories for all surfaces, top 5 critical threats with
  mitigations, and security controls vs gaps matrix.
department: security
triggers: ["/startup-os security"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
  - product/output/prd-filled.md
  - engineering/output/tech-stack.md
writes:
  - _reports/security/threat-model.md
---

## What this agent does

Reads product spec and tech stack to generate comprehensive STRIDE threat model. Inventories assets (data, systems, APIs), maps attack surface (entry points, trust boundaries), applies STRIDE framework (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) across all surfaces, identifies top 5 critical threats with likelihood/impact scores, recommends mitigations, and creates security controls vs gaps matrix. Writes to _reports/security/threat-model.md.

## Instructions

1. Read CLAUDE.md for product overview and architecture
2. Read product/output/prd-filled.md for features and data flows
3. Read engineering/output/tech-stack.md if available for infrastructure
4. Create asset inventory (user data, code, APIs, databases, keys)
5. Map attack surface (web app, API, mobile, admin panel, integrations)
6. Identify trust boundaries (internet, authenticated users, admin, internal services)
7. Apply STRIDE framework to each attack surface component
8. Score threats by likelihood (1-5) × impact (1-5) = risk score
9. Identify top 5 critical threats (highest risk scores)
10. Recommend mitigations for each critical threat
11. Create security controls matrix (implemented vs gaps)
12. Write to _reports/security/threat-model.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateThreatModel() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  // Read context files
  let claudeMd = ''
  let prd = ''
  let techStack = ''

  try {
    claudeMd = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: CLAUDE.md not found')
  }

  try {
    prd = readFileSync(join(projectRoot, 'product', 'output', 'prd-filled.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: prd-filled.md not found')
  }

  try {
    techStack = readFileSync(join(projectRoot, 'engineering', 'output', 'tech-stack.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: tech-stack.md not found, will infer from product description')
  }

  const fullContext = `
# Product and Architecture Context

## Startup Profile
${claudeMd}

## Product Specification
${prd}

## Tech Stack
${techStack || '[To be inferred from product description]'}
  `.trim()

  // Generate threat model via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are a security threat modeling expert specializing in STRIDE analysis. Based on this context:

${fullContext}

Create a comprehensive STRIDE threat model with the following structure:

# STRIDE Threat Model

**Company**: [Company Name]
**Generated**: ${new Date().toISOString().split('T')[0]}
**Version**: 1.0
**Reviewed by**: [Security Lead / CTO]

---

## Executive Summary

[2-3 paragraphs summarizing:
- Product overview and architecture
- Key security concerns for this type of application
- Overall risk level (Low/Medium/High)
- Top 3 threats that need immediate attention]

---

## Asset Inventory

Assets are valuable resources that need protection. Classified by sensitivity:

### Critical Assets (Compromise = business failure)

| Asset | Type | Sensitivity | Location | Owner | Backup |
|-------|------|-------------|----------|-------|--------|
| [e.g., User PII] | Data | High | [Database] | [Team] | [Yes/No] |
| [e.g., API Keys] | Credentials | Critical | [Secrets Manager] | [Team] | [Yes/No] |
| [e.g., Payment Data] | Data | Critical | [3rd party] | [Team] | [Yes/No] |
| [More critical assets] | ... | ... | ... | ... | ... |

### High-Value Assets (Compromise = significant damage)

| Asset | Type | Sensitivity | Location | Owner | Backup |
|-------|------|-------------|----------|-------|--------|
| [e.g., User Auth Tokens] | Credentials | High | [Storage] | [Team] | [Yes/No] |
| [e.g., Business Logic] | Code | High | [Git repo] | [Team] | [Yes/No] |
| [More high-value assets] | ... | ... | ... | ... | ... |

### Standard Assets (Compromise = limited damage)

| Asset | Type | Sensitivity | Location | Owner | Backup |
|-------|------|-------------|----------|-------|--------|
| [e.g., Public docs] | Data | Low | [CDN] | [Team] | [Yes/No] |
| [More standard assets] | ... | ... | ... | ... | ... |

---

## Attack Surface Map

The attack surface includes all points where an attacker can interact with the system.

### Components & Trust Boundaries

\`\`\`
                    INTERNET (Untrusted)
                           │
                           ↓
                  ┌────────────────┐
                  │   Web App      │ ← Attack Vector 1
                  │   (Frontend)   │
                  └────────────────┘
                           │
        ═══════════════════╪═══════════════════ Trust Boundary 1
                           │
                           ↓
                  ┌────────────────┐
                  │   API Server   │ ← Attack Vector 2
                  │   (Backend)    │
                  └────────────────┘
                           │
        ═══════════════════╪═══════════════════ Trust Boundary 2
                           │
              ┌────────────┴────────────┐
              ↓                         ↓
     ┌─────────────┐          ┌─────────────┐
     │  Database   │          │  3rd Party  │ ← Attack Vector 3
     │             │          │   APIs      │
     └─────────────┘          └─────────────┘
              │                         │
        Internal Only           External Calls
\`\`\`

### Entry Points

| Entry Point | Description | Authentication | Authorization | Input Validation |
|-------------|-------------|----------------|---------------|------------------|
| Public web pages | [Description] | None | None | [Status: Yes/No/Partial] |
| Login endpoint | [Description] | Yes | Yes | [Status] |
| API endpoints | [Description] | Token-based | RBAC | [Status] |
| Admin panel | [Description] | SSO | Admin role | [Status] |
| Webhooks | [Description] | HMAC signature | IP whitelist | [Status] |
| Mobile app | [Description] | OAuth | User role | [Status] |

[Add all entry points based on the product]

---

## STRIDE Analysis

STRIDE is a threat modeling framework:
- **S**poofing: Pretending to be someone/something else
- **T**ampering: Modifying data or code
- **R**epudiation: Denying an action was performed
- **I**nformation Disclosure: Exposing sensitive information
- **D**enial of Service: Making system unavailable
- **E**levation of Privilege: Gaining unauthorized access

### Threat Analysis by Component

#### Component: Web Application (Frontend)

| STRIDE Category | Threat | Likelihood (1-5) | Impact (1-5) | Risk Score | Mitigation Status |
|-----------------|--------|------------------|--------------|------------|-------------------|
| **Spoofing** | Attacker impersonates user via stolen session token | 3 | 4 | 12 | ⚠️ Partial |
| **Tampering** | Attacker modifies client-side validation to bypass rules | 4 | 3 | 12 | ❌ Gap |
| **Repudiation** | User denies performing action (no audit logs) | 2 | 2 | 4 | ✅ Covered |
| **Information Disclosure** | Sensitive data exposed in browser console/network tab | 3 | 4 | 12 | ⚠️ Partial |
| **Denial of Service** | Attacker floods UI with requests | 2 | 2 | 4 | ⚠️ Partial |
| **Elevation of Privilege** | User accesses admin features via URL manipulation | 3 | 5 | 15 | ❌ Gap |

**Top Risks**: Elevation of Privilege (15), multiple 12s
**Recommended Actions**: [2-3 specific mitigations]

---

#### Component: API Server (Backend)

| STRIDE Category | Threat | Likelihood (1-5) | Impact (1-5) | Risk Score | Mitigation Status |
|-----------------|--------|------------------|--------------|------------|-------------------|
| **Spoofing** | Attacker forges API request with stolen token | 3 | 5 | 15 | ⚠️ Partial |
| **Tampering** | SQL injection via unvalidated input | 2 | 5 | 10 | ✅ Covered |
| **Repudiation** | API calls not logged with user context | 3 | 3 | 9 | ❌ Gap |
| **Information Disclosure** | API leaks data in error messages or excessive responses | 4 | 4 | 16 | ❌ Gap |
| **Denial of Service** | No rate limiting allows resource exhaustion | 4 | 4 | 16 | ❌ Gap |
| **Elevation of Privilege** | IDOR vulnerability allows access to other users' data | 3 | 5 | 15 | ⚠️ Partial |

**Top Risks**: Information Disclosure (16), DoS (16), Elevation of Privilege (15)
**Recommended Actions**: [2-3 specific mitigations]

---

#### Component: Database

| STRIDE Category | Threat | Likelihood (1-5) | Impact (1-5) | Risk Score | Mitigation Status |
|-----------------|--------|------------------|--------------|------------|-------------------|
| **Spoofing** | Attacker gains DB credentials | 2 | 5 | 10 | ✅ Covered |
| **Tampering** | Direct DB modification bypassing application logic | 2 | 5 | 10 | ⚠️ Partial |
| **Repudiation** | DB changes not audited | 3 | 3 | 9 | ❌ Gap |
| **Information Disclosure** | Backup stored unencrypted | 2 | 5 | 10 | ❌ Gap |
| **Denial of Service** | DB exhaustion via unbounded queries | 3 | 4 | 12 | ⚠️ Partial |
| **Elevation of Privilege** | DB user has excessive permissions | 3 | 4 | 12 | ⚠️ Partial |

**Top Risks**: Multiple 10-12 risks
**Recommended Actions**: [2-3 specific mitigations]

---

#### Component: Third-Party Integrations

[Same STRIDE table structure]

---

#### Component: Authentication System

[Same STRIDE table structure]

---

[Add more components as relevant: Admin Panel, Mobile App, Webhooks, etc.]

---

## Top 5 Critical Threats

Ranked by risk score (Likelihood × Impact):

### 1. API Information Disclosure (Risk: 16)

**Threat**: API endpoints return excessive data or leak sensitive information in error messages.

**Attack Scenario**: 
1. Attacker enumerates API endpoints
2. Sends malformed requests to trigger detailed error messages
3. Error messages reveal stack traces, database schema, internal paths
4. Attacker uses this to craft targeted attacks

**Impact**: Exposure of system internals, user data, or credentials

**Likelihood**: High (4/5) - Common vulnerability in early-stage APIs

**Current Controls**: 
- ⚠️ Partial: Generic error messages in production (assumed, verify)
- ❌ Gap: No response filtering or data minimization

**Recommended Mitigations**:
1. **Implement response filtering**: Only return fields explicitly needed by client
2. **Generic error handling**: Never expose stack traces, SQL queries, or internal paths in production
3. **API contract validation**: Use OpenAPI/JSON schema to enforce strict response schemas
4. **Logging**: Log full errors server-side, never send to client
5. **Penetration testing**: Test all endpoints for information leakage

**Owner**: Backend team
**Priority**: P0 (fix immediately)
**Timeline**: 1 week

---

### 2. Denial of Service via Rate Limiting Gap (Risk: 16)

**Threat**: No rate limiting allows attacker to exhaust server resources.

**Attack Scenario**:
1. Attacker scripts automated requests to expensive endpoints
2. Server CPU/memory exhausted
3. Legitimate users experience downtime

**Impact**: Service unavailable, revenue loss, reputation damage

**Likelihood**: High (4/5) - Trivial to execute

**Current Controls**:
- ❌ Gap: No rate limiting implemented

**Recommended Mitigations**:
1. **Implement rate limiting**: 
   - Per-IP: 100 req/min for anonymous, 1000 req/min for authenticated
   - Per-user: 10,000 req/hour
   - Per-endpoint: Lower limits for expensive operations (e.g., search, reports)
2. **Use proven libraries**: Express-rate-limit, nginx rate limiting, or API gateway
3. **Add circuit breakers**: Prevent cascading failures
4. **Monitor**: Alert on unusual traffic patterns
5. **DDoS mitigation**: Consider Cloudflare or AWS Shield

**Owner**: DevOps + Backend team
**Priority**: P0
**Timeline**: 1 week

---

### 3. Elevation of Privilege via URL Manipulation (Risk: 15)

**Threat**: User accesses admin features by guessing URLs without proper authorization checks.

**Attack Scenario**:
1. Regular user navigates to /admin
2. Frontend hides link, but backend doesn't enforce RBAC
3. User gains admin capabilities

**Impact**: Unauthorized data access, system manipulation

**Likelihood**: Medium (3/5) - Requires some guessing but common

**Current Controls**:
- ⚠️ Partial: Frontend route guards (easily bypassed)
- ❌ Gap: No backend authorization checks

**Recommended Mitigations**:
1. **Backend authorization**: Every API endpoint must check user role/permissions
2. **RBAC implementation**: Define roles (user, admin, superadmin) with explicit permissions
3. **Authorization middleware**: Centralized auth check before route handlers
4. **Test coverage**: Automated tests for authorization on all protected endpoints
5. **Audit**: Review all endpoints to identify missing authz checks

**Owner**: Backend team
**Priority**: P0
**Timeline**: 2 weeks

---

### 4. API Spoofing via Token Theft (Risk: 15)

**Threat**: Stolen auth tokens allow attacker to impersonate legitimate users.

**Attack Scenario**:
1. Attacker obtains token via XSS, MITM, or phishing
2. Uses token to make API requests as victim
3. Accesses or modifies victim's data

**Impact**: Account takeover, data theft

**Likelihood**: Medium (3/5) - Requires token theft vector

**Current Controls**:
- ⚠️ Partial: HTTPS enforced (prevents MITM)
- ⚠️ Partial: HttpOnly cookies (prevents XSS token theft, if implemented)
- ❌ Gap: No token refresh or expiry

**Recommended Mitigations**:
1. **Short-lived tokens**: Access tokens expire in 15 minutes
2. **Refresh tokens**: Separate long-lived refresh token (stored securely)
3. **Token binding**: Bind tokens to IP or device fingerprint
4. **Anomaly detection**: Alert on unusual usage patterns (e.g., multiple IPs)
5. **Revocation**: Implement token revocation on logout or password change

**Owner**: Auth team
**Priority**: P1
**Timeline**: 3 weeks

---

### 5. IDOR (Insecure Direct Object Reference) (Risk: 15)

**Threat**: Attacker accesses other users' data by changing IDs in API requests.

**Attack Scenario**:
1. User fetches /api/documents/123
2. Attacker changes to /api/documents/124
3. Receives another user's document without authorization check

**Impact**: Unauthorized data access, privacy violation

**Likelihood**: Medium (3/5) - Requires some enumeration

**Current Controls**:
- ⚠️ Partial: Some endpoints check ownership (inconsistent)
- ❌ Gap: No systematic IDOR protection

**Recommended Mitigations**:
1. **Ownership validation**: Every resource fetch must check current_user owns resource
2. **Use UUIDs**: Replace sequential IDs with UUIDs to prevent enumeration
3. **Authorization layer**: Create reusable authz functions (e.g., canAccessDocument)
4. **Test coverage**: Automated tests attempting cross-user access on all endpoints
5. **Code review**: Flag any direct ID usage without ownership check

**Owner**: Backend team
**Priority**: P1
**Timeline**: 2 weeks

---

## Security Controls Matrix

| Control Category | Control | Status | Gap | Priority |
|------------------|---------|--------|-----|----------|
| **Authentication** | Multi-factor authentication | ❌ Not implemented | No MFA option | P1 |
| **Authentication** | Password complexity requirements | ✅ Implemented | None | - |
| **Authentication** | Session timeout | ⚠️ Partial | Long timeout (24h) | P2 |
| **Authorization** | Role-Based Access Control | ⚠️ Partial | Not enforced backend | P0 |
| **Authorization** | Resource ownership checks | ⚠️ Partial | Inconsistent | P0 |
| **Input Validation** | SQL injection prevention | ✅ Implemented | None (using ORM) | - |
| **Input Validation** | XSS prevention | ⚠️ Partial | Some endpoints | P1 |
| **Input Validation** | CSRF protection | ❌ Not implemented | No CSRF tokens | P1 |
| **Data Protection** | Encryption at rest | ✅ Implemented | None (DB encrypted) | - |
| **Data Protection** | Encryption in transit | ✅ Implemented | None (HTTPS) | - |
| **Data Protection** | Backup encryption | ❌ Not implemented | Backups unencrypted | P2 |
| **Logging & Monitoring** | Audit logs | ⚠️ Partial | No user context | P1 |
| **Logging & Monitoring** | Security alerts | ❌ Not implemented | No alerting | P2 |
| **Availability** | Rate limiting | ❌ Not implemented | No limits | P0 |
| **Availability** | DDoS protection | ❌ Not implemented | No mitigation | P2 |
| **Secrets Management** | Environment variables | ✅ Implemented | None | - |
| **Secrets Management** | Secrets rotation | ❌ Not implemented | Manual rotation | P2 |

**Summary**:
- ✅ Implemented: X controls
- ⚠️ Partial: Y controls (need completion)
- ❌ Gaps: Z controls (need implementation)
- **P0 (urgent)**: [count] items
- **P1 (high)**: [count] items
- **P2 (medium)**: [count] items

---

## Compliance Considerations

Based on the product and data types:

| Regulation | Applies? | Key Requirements | Current Status |
|------------|----------|------------------|----------------|
| GDPR | [Yes/No] | [If yes: data minimization, consent, right to deletion] | [Status] |
| CCPA | [Yes/No] | [If yes: disclosure, opt-out, deletion] | [Status] |
| SOC 2 | [Yes/No] | [If yes: security controls, audit trails] | [Status] |
| HIPAA | [Yes/No] | [If yes: PHI protection, access controls] | [Status] |
| PCI DSS | [Yes/No] | [If yes: cardholder data protection] | [Status] |

[Explain which apply based on product context and what gaps exist]

---

## Recommended Security Roadmap

### Phase 1: Critical Gaps (Week 1-2)
1. Implement backend authorization checks (EoP threat)
2. Add rate limiting (DoS threat)
3. Fix API information disclosure (error handling, response filtering)

### Phase 2: High Priority (Week 3-6)
4. Implement CSRF protection
5. Add audit logging with user context
6. Fix IDOR vulnerabilities (ownership checks, UUIDs)
7. Implement token refresh/expiry

### Phase 3: Medium Priority (Month 2-3)
8. Add MFA
9. Implement security alerting
10. Encrypt backups
11. Secrets rotation automation
12. DDoS protection (Cloudflare)

### Phase 4: Ongoing
13. Security code reviews for all PRs
14. Quarterly penetration testing
15. Security training for engineers
16. Dependency vulnerability scanning

---

## Testing & Validation

### Security Testing Checklist

- [ ] **OWASP Top 10**: Test for all OWASP vulnerabilities
- [ ] **Authorization**: Attempt unauthorized access to all endpoints
- [ ] **Input validation**: Fuzz all inputs with malicious payloads
- [ ] **Rate limiting**: Verify limits in place and enforced
- [ ] **Session management**: Test token expiry, revocation, refresh
- [ ] **Error handling**: Verify no sensitive info in error messages
- [ ] **HTTPS**: Verify all traffic encrypted, no mixed content
- [ ] **Dependency scan**: Run \`npm audit\` or \`snyk test\`
- [ ] **Static analysis**: Run SAST tool (e.g., Semgrep, SonarQube)
- [ ] **Penetration test**: Hire external firm for comprehensive test

---

## Next Steps

1. **Review with team** — Present threat model to eng/product by [DATE+7 days]
2. **Prioritize fixes** — Agree on Phase 1 critical gaps to address by [DATE+14 days]
3. **Assign owners** — Each threat mitigation needs an owner by [DATE+7 days]
4. **Track progress** — Add to sprint board, weekly security standup by [DATE+7 days]
5. **Re-assess quarterly** — Update threat model as product evolves by [DATE+90 days]

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| ${new Date().toISOString().split('T')[0]} | 1.0 | Initial threat model | AI Agent |

Use the product and tech context to make threats specific and realistic. Score threats honestly. Prioritize actionable mitigations. Include compliance considerations relevant to the business model. Make the roadmap achievable for a startup with limited security resources.`
      }
    ]
  })

  // Extract content from response
  let threatModel = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      threatModel += block.text + '\n'
    }
  }

  if (!threatModel.trim()) {
    threatModel = 'Failed to generate threat model'
  }

  // Write output
  const outputDir = join(projectRoot, '_reports', 'security')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'threat-model.md')
  writeFileSync(outputPath, threatModel, 'utf-8')

  console.log(`\nThreat model generated successfully: ${outputPath}`)
  console.log(`STRIDE analysis complete`)
  console.log(`Check for P0 critical threats`)
}

generateThreatModel().catch(console.error)
```

## Output

Creates _reports/security/threat-model.md with comprehensive STRIDE threat model. Includes executive summary with overall risk level, asset inventory classified by sensitivity, attack surface map with trust boundaries diagram, STRIDE analysis tables for each component (web app, API, database, integrations) with likelihood/impact scoring, top 5 critical threats ranked by risk score with detailed mitigation plans, security controls matrix showing implemented vs gaps, compliance considerations, phased security roadmap, testing checklist, and quarterly review schedule.
