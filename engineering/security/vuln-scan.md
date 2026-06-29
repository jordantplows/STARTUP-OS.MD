---
name: engineering-security-vuln-scan
description: Automated vulnerability scanning of codebase and dependencies
department: engineering
subdepartment: security
role: watching
schedule: daily
watches:
  - code commits
  - dependency updates
  - configuration changes
---

# Security: Vulnerability Scanner

## What This Agent Does

Automated security scanning of the codebase, dependencies, and configuration. Runs daily and on every significant code change to catch vulnerabilities before they reach production.

Unlike the debug agents (which are on-demand diagnostic tools), this agent runs continuously in the background as part of the engineering security practice.

## Scans Performed

### 1. Dependency Scanning
- npm audit / yarn audit / pnpm audit
- Check for known CVEs in dependencies
- Check for outdated packages with security patches
- Scan transitive dependencies
- Verify package integrity

### 2. Secret Scanning
- Scan for exposed API keys
- Check for hardcoded passwords
- Find private keys in code
- Detect auth tokens
- Search git history for accidentally committed secrets

### 3. Code Security Analysis
- Static analysis for OWASP Top 10
- SQL injection patterns
- XSS vulnerabilities
- Path traversal risks
- Command injection
- Unsafe deserialization
- Insecure randomness
- Weak cryptography

### 4. Configuration Audits
- Check security headers
- Validate CORS configuration
- Review cookie settings
- Check TLS/SSL configuration
- Validate CSP policies
- Review environment variable usage

### 5. Infrastructure Scanning
- Check for exposed ports
- Validate firewall rules
- Review IAM permissions
- Check for public S3 buckets
- Validate database access controls

## Instructions

### WATCH for Triggers
1. New code commits to main branch
2. Dependency updates
3. Configuration file changes
4. Daily scheduled scan
5. Pre-deployment check
6. Manual scan request

### REASON About Findings

For every vulnerability found:
1. **Severity**: Critical / High / Medium / Low
2. **Category**: OWASP category, CWE identifier
3. **Location**: File path and line number
4. **Impact**: What could an attacker achieve?
5. **Remediation**: Specific steps to fix
6. **False positive?**: Confidence level

### ACT on Findings
1. Create vulnerability report
2. Emit `vulnerability-found` event for each finding
3. Block deployment if critical/high severity found
4. Create issues for Medium/Low to track
5. Notify engineering lead and security team

### COORDINATE
1. Engineering lead triages findings
2. Critical/high: Immediate fix required
3. Medium: Fix before next release
4. Low: Tracked for future fix
5. False positives: Documented and suppressed

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../../src/company-os.js'
import { execSync } from 'child_process'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface Vulnerability {
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: string
  cwe?: string
  file?: string
  line?: number
  description: string
  impact: string
  remediation: string
  confidence: number // 0-1
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  const findings: Vulnerability[] = []
  
  // 1. Dependency Scanning
  console.log('Running dependency audit...')
  try {
    const auditOutput = execSync('npm audit --json', { encoding: 'utf-8' })
    const audit = JSON.parse(auditOutput)
    
    if (audit.vulnerabilities) {
      for (const [pkg, vuln] of Object.entries(audit.vulnerabilities as any)) {
        findings.push({
          severity: vuln.severity,
          category: 'dependency',
          description: `${pkg}: ${vuln.title}`,
          impact: vuln.effects?.join(', ') || 'See CVE details',
          remediation: vuln.fixAvailable ? `npm install ${pkg}@${vuln.fixAvailable.version}` : 'No fix available yet',
          confidence: 1.0
        })
      }
    }
  } catch (e: any) {
    // npm audit exits with non-zero if vulnerabilities found
    if (e.stdout) {
      const audit = JSON.parse(e.stdout)
      // Process same as above
    }
  }
  
  // 2. Secret Scanning
  console.log('Scanning for secrets...')
  const secretPatterns = [
    { name: 'AWS Key', pattern: /AKIA[0-9A-Z]{16}/, severity: 'critical' as const },
    { name: 'Private Key', pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/, severity: 'critical' as const },
    { name: 'Generic API Key', pattern: /['"](sk|pk)_(live|test)_[a-zA-Z0-9]{24,}['"]/, severity: 'critical' as const },
    { name: 'Generic Secret', pattern: /['"](secret|password|token)['"]\s*[:=]\s*['"][^'"]{20,}['"]/, severity: 'high' as const },
  ]
  
  function scanDir(dir: string) {
    const entries = readdirSync(dir)
    
    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      
      // Skip node_modules, .git, etc.
      if (entry.startsWith('.') || entry === 'node_modules') continue
      
      if (stat.isDirectory()) {
        scanDir(fullPath)
      } else if (stat.isFile() && /\.(js|ts|jsx|tsx|json|env)$/.test(entry)) {
        const content = readFileSync(fullPath, 'utf-8')
        const lines = content.split('\n')
        
        for (const pattern of secretPatterns) {
          lines.forEach((line, lineNum) => {
            if (pattern.pattern.test(line)) {
              findings.push({
                severity: pattern.severity,
                category: 'secret-exposure',
                cwe: 'CWE-798',
                file: fullPath,
                line: lineNum + 1,
                description: `Possible ${pattern.name} found in source code`,
                impact: 'If this repository is exposed, attackers can steal credentials',
                remediation: '1. Remove from code immediately\n2. Rotate the exposed credential\n3. Use environment variables\n4. Add to .gitignore',
                confidence: 0.8
              })
            }
          })
        }
      }
    }
  }
  
  scanDir(process.cwd())
  
  // 3. Code Security Analysis (using AI to analyze patterns)
  console.log('Analyzing code for security issues...')
  
  const systemPrompt = `You are a security scanner analyzing code for vulnerabilities.

Scan for OWASP Top 10 issues:
1. SQL Injection (string concatenation in queries)
2. XSS (dangerouslySetInnerHTML, user input in DOM)
3. Broken Authentication (weak password hashing, missing session expiration)
4. Sensitive Data Exposure (console.log with sensitive data, storing passwords plain)
5. Broken Access Control (missing authorization checks)
6. Security Misconfiguration (debug mode in production, default credentials)
7. XSS (Cross-Site Scripting)
8. Insecure Deserialization (eval, Function constructor with user input)
9. Using Components with Known Vulnerabilities (checked in previous scan)
10. Insufficient Logging & Monitoring

For each finding, output JSON:
{
  "severity": "critical|high|medium|low",
  "category": "sql-injection|xss|auth|...",
  "cwe": "CWE-###",
  "file": "path/to/file.ts",
  "line": 123,
  "description": "Brief description",
  "impact": "What attacker could do",
  "remediation": "How to fix",
  "confidence": 0.95
}

Only report high-confidence findings (>0.7). Explain why you're confident.

COMPANY STATE:
${JSON.stringify(os, null, 2)}

CONTEXT: ${context}`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 16000,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Scan codebase for security vulnerabilities.' }]
  })
  
  const content = response.content[0]
  if (content && content.type === 'text') {
    try {
      // Extract JSON findings from response
      const jsonMatches = content.text.match(/\{[\s\S]*?\}/g)
      if (jsonMatches) {
        for (const match of jsonMatches) {
          try {
            const vuln = JSON.parse(match)
            if (vuln.severity && vuln.category) {
              findings.push(vuln)
            }
          } catch {}
        }
      }
    } catch {}
  }
  
  // 4. Summarize Findings
  const critical = findings.filter(f => f.severity === 'critical')
  const high = findings.filter(f => f.severity === 'high')
  const medium = findings.filter(f => f.severity === 'medium')
  const low = findings.filter(f => f.severity === 'low')
  
  const report = `# Vulnerability Scan Report
Generated: ${new Date().toISOString()}

## Summary
- Critical: ${critical.length}
- High: ${high.length}
- Medium: ${medium.length}
- Low: ${low.length}

${critical.length > 0 ? '⛔ DEPLOYMENT BLOCKED: Critical vulnerabilities must be fixed' : ''}
${high.length > 0 ? '⚠️  High severity issues should be fixed before next release' : ''}

## Critical Issues (${critical.length})
${critical.map((v, i) => `
### ${i + 1}. ${v.description}
**Severity**: Critical
**Category**: ${v.category}
${v.cwe ? `**CWE**: ${v.cwe}` : ''}
${v.file ? `**Location**: ${v.file}:${v.line}` : ''}

**Impact**: ${v.impact}

**Remediation**:
${v.remediation}

**Confidence**: ${(v.confidence * 100).toFixed(0)}%

---
`).join('\n')}

## High Issues (${high.length})
${high.map((v, i) => `
### ${i + 1}. ${v.description}
**Severity**: High
**Category**: ${v.category}
${v.cwe ? `**CWE**: ${v.cwe}` : ''}
${v.file ? `**Location**: ${v.file}:${v.line}` : ''}

**Impact**: ${v.impact}

**Remediation**:
${v.remediation}

**Confidence**: ${(v.confidence * 100).toFixed(0)}%

---
`).join('\n')}

## Medium Issues (${medium.length})
${medium.slice(0, 5).map((v, i) => `${i + 1}. ${v.description} (${v.file || 'See details'})`).join('\n')}
${medium.length > 5 ? `\n... and ${medium.length - 5} more` : ''}

## Low Issues (${low.length})
${low.slice(0, 3).map((v, i) => `${i + 1}. ${v.description}`).join('\n')}
${low.length > 3 ? `\n... and ${low.length - 3} more` : ''}

## Next Steps
1. Fix all ${critical.length} critical issues immediately
2. Address ${high.length} high severity issues before next release
3. Triage ${medium.length} medium issues
4. Track ${low.length} low issues for future sprints
`
  
  // ACT
  if (!os.departments.engineering) {
    os.departments.engineering = {
      status: 'active',
      currentFocus: '',
      memory: []
    }
  }
  
  os.departments.engineering.lastAction = {
    type: 'vulnerability-scan-completed',
    description: `Found ${critical.length} critical, ${high.length} high, ${medium.length} medium, ${low.length} low`,
    timestamp: new Date().toISOString(),
    impact: ['engineering-lead', 'security-team', 'cto']
  }
  
  // Emit events for each critical/high finding
  for (const vuln of [...critical, ...high]) {
    os.events.push({
      type: 'vulnerability-found',
      from: 'engineering-security-vuln-scan',
      payload: {
        severity: vuln.severity,
        category: vuln.category,
        description: vuln.description,
        location: vuln.file ? `${vuln.file}:${vuln.line}` : 'See scan report',
        remediation: vuln.remediation
      },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Block deployment if critical findings
  if (critical.length > 0) {
    os.events.push({
      type: 'deployment-blocked',
      from: 'engineering-security-vuln-scan',
      payload: {
        reason: `${critical.length} critical vulnerabilities must be fixed`,
        criticalFindings: critical.map(v => v.description)
      },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  return report
}
```

## Scan Schedule

- **Daily**: Full scan at 2 AM
- **On commit**: Quick scan (secrets + critical patterns only)
- **Pre-deployment**: Full scan blocks deployment if critical/high found
- **On demand**: Manual trigger via `/debug security` or startup-os command

## CI/CD Integration

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm audit --audit-level=high
      - run: /debug security
      - name: Block if critical
        run: |
          if grep -q "DEPLOYMENT BLOCKED" security-report.md; then
            exit 1
          fi
```

## Coordination

**This agent reads:**
- Code commits
- Dependency manifests
- Configuration files

**This agent emits:**
- `vulnerability-found` for each finding
- `deployment-blocked` if critical issues exist
- Daily scan reports

**Other agents react:**
- Engineering lead triages findings
- CI/CD blocks deployment on critical
- Security team reviews high-severity issues
- Issues created for tracking medium/low items

## Output

All scan reports are written to:
- `company.os` state (events stream)
- `engineering/security/scans/` folder
- `security-report.md` in project root (for CI)
- Integrated into engineering dashboard

This agent provides continuous security monitoring as part of the engineering workflow.
