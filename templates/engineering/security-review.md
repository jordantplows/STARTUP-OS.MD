# Security Review: {{FEATURE_NAME}}

## Metadata
- **Review Date**: {{REVIEW_DATE}}
- **Reviewer**: {{REVIEWER}}
- **Feature/Change**: {{FEATURE_NAME}}
- **Risk Level**: {{RISK_LEVEL}} (Low / Medium / High / Critical)
- **Status**: {{STATUS}} (Pending / Approved / Rejected / Conditional)

---

## Change Summary

{{CHANGE_DESCRIPTION}}

**Files Modified**:
{{#each FILES_MODIFIED}}
- {{this}}
{{/each}}

**Type of Change**:
{{#each CHANGE_TYPES}}
- [ ] {{this}}
{{/each}}

---

## Threat Model

### Assets Involved
{{#each ASSETS}}
- {{this.name}}: {{this.sensitivity}} ({{this.description}})
{{/each}}

### Threat Actors
{{#each THREAT_ACTORS}}
- {{this.type}}: {{this.capability}}
{{/each}}

### STRIDE Analysis

#### Spoofing
{{STRIDE.SPOOFING}}

#### Tampering
{{STRIDE.TAMPERING}}

#### Repudiation
{{STRIDE.REPUDIATION}}

#### Information Disclosure
{{STRIDE.DISCLOSURE}}

#### Denial of Service
{{STRIDE.DOS}}

#### Elevation of Privilege
{{STRIDE.PRIVILEGE}}

---

## Security Findings

### Critical ({{CRITICAL_COUNT}})
{{#each CRITICAL_FINDINGS}}
#### {{@index}}. {{this.title}}
**CWE**: {{this.cwe}}  
**CVSS**: {{this.cvss}}

**Description**: {{this.description}}

**Attack Scenario**:
{{this.attack_scenario}}

**Impact**: {{this.impact}}

**Remediation**:
{{this.remediation}}

**Status**: {{this.status}}

---
{{/each}}

### High ({{HIGH_COUNT}})
{{#each HIGH_FINDINGS}}
#### {{@index}}. {{this.title}}
**Description**: {{this.description}}
**Remediation**: {{this.remediation}}
**Status**: {{this.status}}

---
{{/each}}

### Medium ({{MEDIUM_COUNT}})
{{#each MEDIUM_FINDINGS}}
#### {{@index}}. {{this.title}}
**Remediation**: {{this.remediation}}

---
{{/each}}

### Low ({{LOW_COUNT}})
{{#if LOW_FINDINGS}}
{{#each LOW_FINDINGS}}
- {{this.title}} — {{this.remediation}}
{{/each}}
{{else}}
None
{{/if}}

---

## Security Controls

### Authentication
- [ ] Authentication required? {{AUTH.REQUIRED}}
- [ ] Authentication method: {{AUTH.METHOD}}
- [ ] Session management: {{AUTH.SESSION}}
- [ ] Token expiration: {{AUTH.TOKEN_EXPIRY}}

### Authorization
- [ ] Authorization checks implemented? {{AUTHZ.IMPLEMENTED}}
- [ ] Role-based access control: {{AUTHZ.RBAC}}
- [ ] Resource ownership validated: {{AUTHZ.OWNERSHIP}}
- [ ] Principle of least privilege: {{AUTHZ.LEAST_PRIVILEGE}}

### Input Validation
- [ ] All inputs validated: {{INPUT.VALIDATED}}
- [ ] Allowlist validation: {{INPUT.ALLOWLIST}}
- [ ] Length limits enforced: {{INPUT.LENGTH_LIMITS}}
- [ ] Type checking: {{INPUT.TYPE_CHECKING}}
- [ ] SQL injection protection: {{INPUT.SQL_PROTECTION}}
- [ ] XSS protection: {{INPUT.XSS_PROTECTION}}

### Output Encoding
- [ ] User data properly encoded: {{OUTPUT.ENCODED}}
- [ ] Context-appropriate encoding: {{OUTPUT.CONTEXT_AWARE}}
- [ ] No dangerouslySetInnerHTML with user data: {{OUTPUT.NO_DANGEROUS_HTML}}

### Cryptography
- [ ] Strong algorithms used: {{CRYPTO.STRONG_ALGORITHMS}}
- [ ] Keys properly managed: {{CRYPTO.KEY_MANAGEMENT}}
- [ ] Sensitive data encrypted at rest: {{CRYPTO.ENCRYPTION_AT_REST}}
- [ ] TLS for data in transit: {{CRYPTO.TLS}}

### Logging & Monitoring
- [ ] Security events logged: {{LOGGING.SECURITY_EVENTS}}
- [ ] Audit trail for sensitive actions: {{LOGGING.AUDIT_TRAIL}}
- [ ] No sensitive data in logs: {{LOGGING.NO_SENSITIVE_DATA}}
- [ ] Log integrity protected: {{LOGGING.INTEGRITY}}

### Error Handling
- [ ] Generic error messages to users: {{ERROR.GENERIC_MESSAGES}}
- [ ] Detailed errors logged server-side: {{ERROR.DETAILED_LOGGING}}
- [ ] No stack traces exposed: {{ERROR.NO_STACK_TRACES}}

### Rate Limiting
- [ ] Rate limiting implemented: {{RATE_LIMIT.IMPLEMENTED}}
- [ ] Limits appropriate for endpoint: {{RATE_LIMIT.APPROPRIATE}}
- [ ] DDoS protection: {{RATE_LIMIT.DDOS_PROTECTION}}

---

## Testing

### Security Tests Performed
{{#each TESTS_PERFORMED}}
- [ ] {{this.name}}: {{this.status}}
  {{#if this.findings}}
  - Findings: {{this.findings}}
  {{/if}}
{{/each}}

### Required Tests
- [ ] Authentication bypass attempts
- [ ] Authorization bypass attempts
- [ ] SQL injection testing
- [ ] XSS testing
- [ ] CSRF testing
- [ ] Input validation testing
- [ ] Session management testing
- [ ] Rate limiting testing

---

## Compliance

### OWASP Top 10
{{#each OWASP_COMPLIANCE}}
- {{this.item}}: {{this.status}}
{{/each}}

### Regulatory Requirements
{{#if GDPR}}
- **GDPR**: {{GDPR_STATUS}}
  - Right to deletion: {{GDPR.RIGHT_TO_DELETE}}
  - Data minimization: {{GDPR.DATA_MINIMIZATION}}
  - Consent management: {{GDPR.CONSENT}}
{{/if}}

{{#if PCI_DSS}}
- **PCI DSS**: {{PCI_STATUS}}
  - No card data storage: {{PCI.NO_STORAGE}}
  - Encryption in transit: {{PCI.ENCRYPTION}}
{{/if}}

{{#if HIPAA}}
- **HIPAA**: {{HIPAA_STATUS}}
  - PHI encrypted: {{HIPAA.ENCRYPTION}}
  - Access logs: {{HIPAA.ACCESS_LOGS}}
{{/if}}

---

## Risk Assessment

### Risk Matrix
| Threat | Likelihood | Impact | Risk Level | Mitigated? |
|--------|-----------|---------|------------|------------|
{{#each RISK_MATRIX}}
| {{this.threat}} | {{this.likelihood}} | {{this.impact}} | {{this.risk}} | {{this.mitigated}} |
{{/each}}

### Overall Risk
**Before Mitigations**: {{RISK_BEFORE}}  
**After Mitigations**: {{RISK_AFTER}}

---

## Recommendations

### Must Fix (Blocking)
{{#each MUST_FIX}}
{{@index}}. {{this.description}}
   - **Why**: {{this.justification}}
   - **How**: {{this.remediation}}
   - **Effort**: {{this.effort}}
{{/each}}

### Should Fix (Before Release)
{{#each SHOULD_FIX}}
{{@index}}. {{this.description}} ({{this.effort}})
{{/each}}

### Consider Fixing (Future)
{{#each CONSIDER_FIX}}
{{@index}}. {{this.description}}
{{/each}}

---

## Decision

**Reviewer**: {{REVIEWER}}  
**Decision**: {{DECISION}} (Approved / Rejected / Conditional / Requires Changes)  
**Date**: {{DECISION_DATE}}

{{#if DECISION_CONDITIONAL}}
**Conditions for Approval**:
{{#each APPROVAL_CONDITIONS}}
- [ ] {{this}}
{{/each}}
{{/if}}

**Reviewer Comments**:
{{REVIEWER_COMMENTS}}

**Signature**: {{REVIEWER_SIGNATURE}}

---

## Follow-up

### Issues Created
{{#each ISSUES_CREATED}}
- {{this.id}}: {{this.title}} ({{this.priority}})
{{/each}}

### Re-review Required?
{{REREVIW_REQUIRED}} (Yes / No)

{{#if REREVIEW_REQUIRED}}
**Re-review Trigger**: {{REREVIEW_TRIGGER}}
{{/if}}

---

*This security review was conducted as part of the startup-os engineering security practice.*  
*Review template version: 1.0*  
*Framework: OWASP, STRIDE*
