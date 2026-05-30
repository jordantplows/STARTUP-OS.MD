---
name: vuln-scan
description: >
  Scans entire repo for vulnerabilities by walking all files in all
  departments, applying regex patterns for hardcoded secrets, eval(),
  Math.random() for security, innerHTML without sanitization, and SQL
  injection patterns. Emits findings with file/line/severity/recommendation.
department: security
triggers: ["/startup-os security"]
allowed-tools: [Read, Write, Bash]
reads:
  - All files in repository
writes:
  - _reports/security/vuln-scan.md
---

## What this agent does

Performs static vulnerability scan across entire codebase. Walks all files in repository (excluding node_modules, .git, dist), applies regex patterns to detect: hardcoded secrets (API keys, passwords, tokens), dangerous functions (eval(), Function constructor), insecure randomness (Math.random() for security), XSS vectors (innerHTML, dangerouslySetInnerHTML without sanitization), SQL injection patterns (string concatenation in queries). Emits findings with file path, line number, severity (Critical/High/Medium/Low), code snippet, and remediation recommendation. Writes to _reports/security/vuln-scan.md.

## Instructions

1. Use Bash to find all files in repo (exclude node_modules, .git, dist, build)
2. For each file, scan for vulnerability patterns:
   - Hardcoded secrets: API_KEY, password, secret, token in assignments
   - eval() or Function() constructor
   - Math.random() in security-related code (auth, crypto, session)
   - innerHTML, dangerouslySetInnerHTML without sanitization
   - SQL string concatenation patterns
3. Collect findings with: file, line number, pattern matched, severity, snippet
4. Calculate severity scores: Critical (9-10), High (7-8), Medium (4-6), Low (1-3)
5. Sort findings by severity
6. Generate remediation recommendations for each
7. Create summary statistics
8. Write to _reports/security/vuln-scan.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { join } from 'path'

interface VulnFinding {
  file: string
  line: number
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  category: string
  pattern: string
  snippet: string
  recommendation: string
}

async function scanForVulnerabilities() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  console.log('\n=== Vulnerability Scanner ===\n')
  console.log('Scanning codebase for security vulnerabilities...\n')

  // Find all files (exclude node_modules, .git, dist, build, etc.)
  const findCommand = `find ${projectRoot} -type f \\
    -not -path "*/node_modules/*" \\
    -not -path "*/.git/*" \\
    -not -path "*/dist/*" \\
    -not -path "*/build/*" \\
    -not -path "*/.next/*" \\
    -not -path "*/coverage/*" \\
    \\( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.go" -o -name "*.java" -o -name "*.rb" -o -name "*.php" -o -name "*.md" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name "*.env*" \\)`

  let files: string[] = []
  try {
    const output = execSync(findCommand, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 })
    files = output.trim().split('\n').filter(f => f.length > 0)
  } catch (err) {
    console.error('Error finding files:', err)
    files = []
  }

  console.log(`Found ${files.length} files to scan\n`)

  const findings: VulnFinding[] = []

  // Vulnerability patterns
  const patterns = [
    {
      regex: /(api[_-]?key|apikey|api_secret|password|passwd|pwd|secret|token|auth[_-]?token|access[_-]?token|private[_-]?key)\\s*[:=]\\s*["'][^"']{8,}["']/gi,
      category: 'Hardcoded Secrets',
      severity: 'Critical' as const,
      recommendation: 'Move secrets to environment variables or a secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault). Never commit secrets to version control.'
    },
    {
      regex: /\\beval\\s*\\(/gi,
      category: 'Code Injection',
      severity: 'Critical' as const,
      recommendation: 'Avoid eval(). If you must execute dynamic code, use safer alternatives like JSON.parse() for data or a sandboxed interpreter.'
    },
    {
      regex: /new\\s+Function\\s*\\(/gi,
      category: 'Code Injection',
      severity: 'Critical' as const,
      recommendation: 'Avoid Function constructor. It has similar risks to eval(). Refactor to use static functions or safe alternatives.'
    },
    {
      regex: /Math\\.random\\s*\\(\\)/gi,
      category: 'Insecure Randomness',
      severity: 'High' as const,
      recommendation: 'For security-sensitive operations (tokens, session IDs, crypto), use crypto.randomBytes() (Node.js) or crypto.getRandomValues() (browser), not Math.random().'
    },
    {
      regex: /\\.innerHTML\\s*=/gi,
      category: 'XSS (Cross-Site Scripting)',
      severity: 'High' as const,
      recommendation: 'Avoid innerHTML with user input. Use textContent, or sanitize with DOMPurify before setting innerHTML.'
    },
    {
      regex: /dangerouslySetInnerHTML/gi,
      category: 'XSS (Cross-Site Scripting)',
      severity: 'High' as const,
      recommendation: 'Only use dangerouslySetInnerHTML with sanitized content (e.g., DOMPurify). Never pass user input directly.'
    },
    {
      regex: /(SELECT|INSERT|UPDATE|DELETE).*\\+.*\\+/gi,
      category: 'SQL Injection',
      severity: 'Critical' as const,
      recommendation: 'Use parameterized queries or an ORM (e.g., Sequelize, TypeORM, Prisma). Never build SQL with string concatenation.'
    },
    {
      regex: /\\$\\{.*\\}.*(?:SELECT|INSERT|UPDATE|DELETE)/gi,
      category: 'SQL Injection',
      severity: 'Critical' as const,
      recommendation: 'Avoid template literals in SQL queries with user input. Use parameterized queries.'
    },
    {
      regex: /res\\.send\\(.*req\\.(query|body|params)/gi,
      category: 'Unvalidated Input',
      severity: 'Medium' as const,
      recommendation: 'Validate and sanitize all user input before using it. Use a validation library like Zod, Joi, or express-validator.'
    },
    {
      regex: /exec\\(.*\\$\\{/gi,
      category: 'Command Injection',
      severity: 'Critical' as const,
      recommendation: 'Avoid exec() with user input. Use execFile() with argument arrays, or better yet, avoid shell execution altogether.'
    }
  ]

  // Scan each file
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8')
      const lines = content.split('\n')

      for (const patternConfig of patterns) {
        const matches = content.matchAll(patternConfig.regex)
        
        for (const match of matches) {
          if (!match.index) continue

          // Find line number
          const beforeMatch = content.substring(0, match.index)
          const lineNumber = beforeMatch.split('\n').length

          // Get snippet (surrounding context)
          const lineStart = Math.max(0, lineNumber - 2)
          const lineEnd = Math.min(lines.length, lineNumber + 1)
          const snippet = lines.slice(lineStart, lineEnd).join('\n')

          // Additional heuristic: skip if it's in a comment (basic check)
          const lineContent = lines[lineNumber - 1] || ''
          if (lineContent.trim().startsWith('//') || lineContent.trim().startsWith('#') || lineContent.trim().startsWith('*')) {
            continue // Skip commented lines
          }

          findings.push({
            file: file.replace(projectRoot + '/', ''),
            line: lineNumber,
            severity: patternConfig.severity,
            category: patternConfig.category,
            pattern: match[0].substring(0, 100), // Truncate long matches
            snippet: snippet,
            recommendation: patternConfig.recommendation
          })
        }
      }
    } catch (err) {
      // Skip files we can't read
      console.warn(`Warning: Could not read ${file}`)
    }
  }

  console.log(`Scan complete. Found ${findings.length} potential vulnerabilities.\n`)

  // Sort by severity
  const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 }
  findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  // Generate summary stats
  const summary = {
    total: findings.length,
    critical: findings.filter(f => f.severity === 'Critical').length,
    high: findings.filter(f => f.severity === 'High').length,
    medium: findings.filter(f => f.severity === 'Medium').length,
    low: findings.filter(f => f.severity === 'Low').length,
    byCategory: {} as Record<string, number>
  }

  for (const finding of findings) {
    summary.byCategory[finding.category] = (summary.byCategory[finding.category] || 0) + 1
  }

  // Generate report
  const findingsJson = JSON.stringify(findings, null, 2)
  const summaryJson = JSON.stringify(summary, null, 2)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are a security report generator. Format these vulnerability scan findings into a comprehensive report:

# Findings Summary
${summaryJson}

# Detailed Findings
${findingsJson}

Create a report with this structure:

# Vulnerability Scan Report

**Generated**: ${new Date().toISOString().split('T')[0]}
**Scanned**: ${files.length} files
**Findings**: ${findings.length} potential vulnerabilities

---

## Executive Summary

[2-3 paragraphs summarizing:
- Overall security posture (Critical/concerning/moderate/good)
- Top vulnerability categories found
- Recommended immediate actions
- Overall risk level]

---

## Summary Statistics

| Severity | Count | Percentage |
|----------|-------|------------|
| 🔴 Critical | ${summary.critical} | ${Math.round(summary.critical / summary.total * 100)}% |
| 🟠 High | ${summary.high} | ${Math.round(summary.high / summary.total * 100)}% |
| 🟡 Medium | ${summary.medium} | ${Math.round(summary.medium / summary.total * 100)}% |
| 🟢 Low | ${summary.low} | ${Math.round(summary.low / summary.total * 100)}% |
| **Total** | **${summary.total}** | **100%** |

### Findings by Category

| Category | Count | Top Severity |
|----------|-------|--------------|
${Object.entries(summary.byCategory)
  .sort((a, b) => b[1] - a[1])
  .map(([cat, count]) => {
    const topSeverity = findings.find(f => f.category === cat)?.severity || 'Low'
    return \`| \${cat} | \${count} | \${topSeverity} |\`
  })
  .join('\n')}

---

## Detailed Findings

${findings.length === 0 ? '✅ No vulnerabilities detected! This is a clean scan.' : ''}

${findings.map((finding, idx) => \`
### Finding #\${idx + 1}: \${finding.category} [\${finding.severity}]

**File**: \\\`\${finding.file}\\\`
**Line**: \${finding.line}

**Issue**: \${finding.category}

**Code Snippet**:
\\\`\\\`\\\`
\${finding.snippet}
\\\`\\\`\\\`

**Pattern Matched**: \\\`\${finding.pattern}\\\`

**Recommendation**: \${finding.recommendation}

**Priority**: ${finding.severity === 'Critical' ? 'Fix immediately (P0)' : finding.severity === 'High' ? 'Fix this week (P1)' : finding.severity === 'Medium' ? 'Fix this sprint (P2)' : 'Fix when convenient (P3)'}

---
\`).join('\n')}

## Remediation Checklist

Use this checklist to track fixes:

### Critical (P0) - Fix Immediately
${findings.filter(f => f.severity === 'Critical').map((f, i) => \`
- [ ] **\${f.category}** in \\\`\${f.file}:\${f.line}\\\` — \${f.recommendation.split('.')[0]}
\`).join('')}

${summary.critical === 0 ? '✅ No critical vulnerabilities' : ''}

### High (P1) - Fix This Week
${findings.filter(f => f.severity === 'High').map((f, i) => \`
- [ ] **\${f.category}** in \\\`\${f.file}:\${f.line}\\\` — \${f.recommendation.split('.')[0]}
\`).join('')}

${summary.high === 0 ? '✅ No high-severity vulnerabilities' : ''}

### Medium (P2) - Fix This Sprint
${findings.filter(f => f.severity === 'Medium').map((f, i) => \`
- [ ] **\${f.category}** in \\\`\${f.file}:\${f.line}\\\` — \${f.recommendation.split('.')[0]}
\`).join('')}

${summary.medium === 0 ? '✅ No medium-severity vulnerabilities' : ''}

---

## Best Practices Recommendations

Based on findings, implement these security practices:

1. **Secrets Management**
   - Use environment variables for all secrets
   - Never commit .env files
   - Rotate secrets regularly
   - Use a secrets manager for production (AWS Secrets Manager, Vault)

2. **Input Validation**
   - Validate all user input with a schema validation library (Zod, Joi)
   - Sanitize HTML before rendering
   - Use parameterized queries for all database access
   - Implement rate limiting on all public endpoints

3. **Secure Coding**
   - Avoid eval() and Function() constructor
   - Use crypto.randomBytes() for security-sensitive randomness
   - Implement Content Security Policy (CSP) headers
   - Use security linters (ESLint security plugins, Semgrep)

4. **Code Review**
   - Review all PRs for security issues
   - Add security checklist to PR template
   - Run automated security scans in CI/CD

5. **Testing**
   - Add security-focused unit tests
   - Run \\\`npm audit\\\` regularly
   - Consider penetration testing for production

---

## False Positive Notes

Some findings may be false positives (e.g., Math.random() in non-security code, eval() in safe contexts). Review each finding and mark false positives:

- If a finding is a false positive, document why and add a code comment to prevent future flags
- Consider using \\\`// nosec\\\` or \\\`// eslint-disable-next-line\\\` with explanation

---

## Next Steps

1. **Triage critical findings** — Review all Critical findings within 24 hours
2. **Assign owners** — Assign each finding to an engineer
3. **Fix P0 immediately** — Critical issues should be fixed before next deploy
4. **Schedule P1/P2** — Add High/Medium findings to sprint backlog
5. **Re-scan after fixes** — Run this scan again to verify remediations
6. **Automate** — Add this scan to CI/CD pipeline

---

## Scan Configuration

**Files scanned**: ${files.length}
**Patterns checked**: ${patterns.length}
**Excluded paths**: node_modules, .git, dist, build, .next, coverage

---

## Revision History

| Date | Findings | Critical | High | Notes |
|------|----------|----------|------|-------|
| ${new Date().toISOString().split('T')[0]} | ${summary.total} | ${summary.critical} | ${summary.high} | Initial scan |

Format the report clearly. Be honest about severity. Provide actionable recommendations. Make the checklist easy to use for tracking remediation.`
      }
    ]
  })

  // Extract content from response
  let report = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      report += block.text + '\n'
    }
  }

  if (!report.trim()) {
    report = 'Failed to generate vulnerability scan report'
  }

  // Write output
  const outputDir = join(projectRoot, '_reports', 'security')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'vuln-scan.md')
  writeFileSync(outputPath, report, 'utf-8')

  console.log(`\nVulnerability scan report generated: ${outputPath}`)
  console.log(`\nSummary:`)
  console.log(`  Total findings: ${summary.total}`)
  console.log(`  🔴 Critical: ${summary.critical}`)
  console.log(`  🟠 High: ${summary.high}`)
  console.log(`  🟡 Medium: ${summary.medium}`)
  console.log(`  🟢 Low: ${summary.low}`)
}

scanForVulnerabilities().catch(console.error)
```

## Output

Creates _reports/security/vuln-scan.md with comprehensive vulnerability scan results. Includes executive summary with overall security posture, summary statistics table with severity breakdown and category distribution, detailed findings for each vulnerability with file path/line number/code snippet/matched pattern/recommendation/priority, remediation checklist organized by priority (P0 Critical/P1 High/P2 Medium), best practices recommendations for secrets management/input validation/secure coding, false positive guidance, next steps for triage and remediation, and scan configuration details. Scans for hardcoded secrets, eval/Function usage, insecure randomness, XSS vectors, SQL injection, command injection, and unvalidated input.
