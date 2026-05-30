---
name: dependency-audit
description: >
  Audits npm dependencies by reading package.json, querying OSV API
  (https://api.osv.dev/v1/query) for each dependency to find known CVEs,
  flags unmaintained packages (>2 years), wildcard versions, and creates
  risk-scored table with remediation recommendations.
department: security
triggers: ["/startup-os security"]
allowed-tools: [Read, Write, Bash]
reads:
  - package.json
writes:
  - _reports/security/dependency-audit.md
---

## What this agent does

Performs security audit of npm dependencies. Reads root package.json, queries OSV (Open Source Vulnerabilities) API for each dependency to identify known CVEs, checks for unmaintained packages (last published >2 years ago), flags wildcard or loose version constraints, calculates risk scores based on severity/exploitability/maintenance status, and generates prioritized remediation table. Writes comprehensive audit report to _reports/security/dependency-audit.md.

## Instructions

1. Read package.json from project root
2. Extract all dependencies and devDependencies
3. For each dependency:
   - Query OSV API (https://api.osv.dev/v1/query) for known vulnerabilities
   - Check npm registry API for last publish date (flag if >2 years old)
   - Flag wildcard versions (^, ~, *, latest)
4. Calculate risk score: CVE severity + maintenance status + version constraint
5. Sort by risk score (highest first)
6. Generate remediation recommendations for each high-risk dependency
7. Create summary statistics (total deps, vulnerable, unmaintained, total CVEs)
8. Write to _reports/security/dependency-audit.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import https from 'https'

interface Dependency {
  name: string
  version: string
  isDev: boolean
  vulnerabilities: Vulnerability[]
  lastPublished?: string
  isUnmaintained: boolean
  hasWildcard: boolean
  riskScore: number
}

interface Vulnerability {
  id: string
  summary: string
  severity: string
  cvss?: number
  fixed?: string
}

function httpsRequest(url: string, options?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (err) {
          resolve(data)
        }
      })
    })
    req.on('error', reject)
    if (options?.body) {
      req.write(JSON.stringify(options.body))
    }
    req.end()
  })
}

async function queryOSV(packageName: string, ecosystem: string = 'npm'): Promise<Vulnerability[]> {
  try {
    const response = await httpsRequest('https://api.osv.dev/v1/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        package: { name: packageName, ecosystem: ecosystem }
      }
    })

    if (!response.vulns) return []

    return response.vulns.map((v: any) => ({
      id: v.id || 'UNKNOWN',
      summary: v.summary || v.details || 'No details available',
      severity: v.severity?.[0]?.type || 'MODERATE',
      cvss: v.severity?.[0]?.score || 5.0,
      fixed: v.affected?.[0]?.ranges?.[0]?.events?.find((e: any) => e.fixed)?.fixed
    }))
  } catch (err) {
    console.warn(`Failed to query OSV for ${packageName}:`, err)
    return []
  }
}

async function getLastPublishDate(packageName: string): Promise<string | undefined> {
  try {
    const response = await httpsRequest(`https://registry.npmjs.org/${packageName}`)
    const versions = Object.keys(response.time || {})
    const publishDates = versions.map(v => response.time[v]).filter(d => d !== 'modified' && d !== 'created')
    if (publishDates.length === 0) return undefined
    
    // Get most recent publish date
    publishDates.sort()
    return publishDates[publishDates.length - 1]
  } catch (err) {
    console.warn(`Failed to get publish date for ${packageName}`)
    return undefined
  }
}

async function auditDependencies() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  console.log('\n=== Dependency Security Audit ===\n')

  // Read package.json
  let packageJson: any
  try {
    const content = readFileSync(join(projectRoot, 'package.json'), 'utf-8')
    packageJson = JSON.parse(content)
  } catch (err) {
    console.error('Error: Could not read package.json')
    return
  }

  const dependencies: Record<string, string> = packageJson.dependencies || {}
  const devDependencies: Record<string, string> = packageJson.devDependencies || {}
  
  const allDeps = [
    ...Object.entries(dependencies).map(([name, version]) => ({ name, version: version as string, isDev: false })),
    ...Object.entries(devDependencies).map(([name, version]) => ({ name, version: version as string, isDev: true }))
  ]

  console.log(`Found ${allDeps.length} dependencies (${Object.keys(dependencies).length} prod, ${Object.keys(devDependencies).length} dev)\n`)
  console.log('Querying OSV API for vulnerabilities... (this may take a minute)\n')

  const auditResults: Dependency[] = []

  for (const dep of allDeps) {
    console.log(`Checking ${dep.name}...`)

    // Query OSV for vulnerabilities
    const vulnerabilities = await queryOSV(dep.name)

    // Get last publish date
    const lastPublished = await getLastPublishDate(dep.name)
    
    // Check if unmaintained (>2 years since last publish)
    let isUnmaintained = false
    if (lastPublished) {
      const lastPubDate = new Date(lastPublished)
      const twoYearsAgo = new Date()
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
      isUnmaintained = lastPubDate < twoYearsAgo
    }

    // Check for wildcard versions
    const hasWildcard = /[\^~\*]|latest/.test(dep.version)

    // Calculate risk score
    let riskScore = 0
    riskScore += vulnerabilities.length * 10 // 10 points per vulnerability
    riskScore += vulnerabilities.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH').length * 20 // Extra for critical
    riskScore += isUnmaintained ? 15 : 0 // 15 points if unmaintained
    riskScore += hasWildcard ? 5 : 0 // 5 points for wildcards

    auditResults.push({
      name: dep.name,
      version: dep.version,
      isDev: dep.isDev,
      vulnerabilities,
      lastPublished,
      isUnmaintained,
      hasWildcard,
      riskScore
    })
  }

  // Sort by risk score
  auditResults.sort((a, b) => b.riskScore - a.riskScore)

  console.log(`\nAudit complete!\n`)

  // Generate summary
  const summary = {
    total: auditResults.length,
    prod: auditResults.filter(d => !d.isDev).length,
    dev: auditResults.filter(d => d.isDev).length,
    vulnerable: auditResults.filter(d => d.vulnerabilities.length > 0).length,
    unmaintained: auditResults.filter(d => d.isUnmaintained).length,
    wildcard: auditResults.filter(d => d.hasWildcard).length,
    totalVulns: auditResults.reduce((sum, d) => sum + d.vulnerabilities.length, 0),
    criticalVulns: auditResults.reduce((sum, d) => sum + d.vulnerabilities.filter(v => v.severity === 'CRITICAL').length, 0),
    highVulns: auditResults.reduce((sum, d) => sum + d.vulnerabilities.filter(v => v.severity === 'HIGH').length, 0)
  }

  // Generate report with Claude
  const auditJson = JSON.stringify(auditResults, null, 2)
  const summaryJson = JSON.stringify(summary, null, 2)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are a dependency security audit expert. Format these findings into a comprehensive report:

# Audit Summary
${summaryJson}

# Detailed Results
${auditJson}

Create a report with this structure:

# Dependency Security Audit

**Generated**: ${new Date().toISOString().split('T')[0]}
**Total Dependencies**: ${summary.total} (${summary.prod} prod, ${summary.dev} dev)
**Vulnerabilities Found**: ${summary.totalVulns} CVEs in ${summary.vulnerable} packages

---

## Executive Summary

[2-3 paragraphs covering:
- Overall security posture of dependencies
- Critical vulnerabilities that need immediate attention
- Unmaintained packages that pose risk
- Recommended immediate actions]

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Dependencies | ${summary.total} |
| Production Dependencies | ${summary.prod} |
| Dev Dependencies | ${summary.dev} |
| Vulnerable Packages | ${summary.vulnerable} |
| Total CVEs | ${summary.totalVulns} |
| Critical CVEs | ${summary.criticalVulns} |
| High Severity CVEs | ${summary.highVulns} |
| Unmaintained Packages (>2 years) | ${summary.unmaintained} |
| Wildcard Versions | ${summary.wildcard} |

**Risk Level**: ${summary.criticalVulns > 0 ? '🔴 CRITICAL' : summary.highVulns > 5 ? '🟠 HIGH' : summary.highVulns > 0 ? '🟡 MEDIUM' : '🟢 LOW'}

---

## High-Risk Dependencies

These dependencies have the highest risk scores and should be addressed first:

${auditResults.filter(d => d.riskScore > 20).map((dep, idx) => \`
### ${idx + 1}. \\\`${dep.name}\\\` (Risk Score: ${dep.riskScore})

**Current Version**: \\\`${dep.version}\\\`
**Type**: ${dep.isDev ? 'Dev Dependency' : 'Production Dependency'}
**Vulnerabilities**: ${dep.vulnerabilities.length}
${dep.isUnmaintained ? '⚠️ **Unmaintained** (no updates in 2+ years)' : ''}
${dep.hasWildcard ? '⚠️ **Wildcard version** (pins recommended)' : ''}
${dep.lastPublished ? \`**Last Published**: \${dep.lastPublished.split('T')[0]}\` : ''}

${dep.vulnerabilities.length > 0 ? \`
**Known Vulnerabilities**:

${dep.vulnerabilities.map((v, i) => \`
- **\${v.id}** (\${v.severity}, CVSS: \${v.cvss || 'N/A'})
  - \${v.summary.substring(0, 150)}\${v.summary.length > 150 ? '...' : ''}
  - ${v.fixed ? \`Fixed in: \\\`\${v.fixed}\\\`\` : 'No fix available yet'}
\`).join('\n')}
\` : ''}

**Recommendation**:
${dep.vulnerabilities.length > 0 && dep.vulnerabilities[0].fixed 
  ? \`Update to \\\`${dep.name}@\${dep.vulnerabilities[0].fixed}\\\` or later immediately.\`
  : dep.vulnerabilities.length > 0 
    ? \`No fix available. Consider alternative packages or apply workarounds from vulnerability reports.\`
    : dep.isUnmaintained
      ? \`Package is unmaintained. Consider migrating to an actively maintained alternative.\`
      : 'Pin version to avoid unexpected breaking changes.'}

---
\`).join('\n')}

${auditResults.filter(d => d.riskScore > 20).length === 0 ? '✅ No high-risk dependencies detected!' : ''}

---

## All Vulnerable Dependencies

Complete list of all packages with known vulnerabilities:

| Package | Version | Type | CVEs | Severity | Risk Score | Status |
|---------|---------|------|------|----------|------------|--------|
${auditResults.filter(d => d.vulnerabilities.length > 0).map(dep => {
  const highestSeverity = dep.vulnerabilities.reduce((max, v) => {
    if (v.severity === 'CRITICAL') return 'CRITICAL'
    if (v.severity === 'HIGH' && max !== 'CRITICAL') return 'HIGH'
    if (v.severity === 'MODERATE' && max !== 'CRITICAL' && max !== 'HIGH') return 'MODERATE'
    return max
  }, 'LOW')
  return \`| \\\`\${dep.name}\\\` | \${dep.version} | \${dep.isDev ? 'Dev' : 'Prod'} | \${dep.vulnerabilities.length} | \${highestSeverity} | \${dep.riskScore} | ${dep.vulnerabilities[0].fixed ? '✅ Fix available' : '⚠️ No fix'} |\`
}).join('\n')}

${auditResults.filter(d => d.vulnerabilities.length > 0).length === 0 ? '✅ No vulnerable dependencies!' : ''}

---

## Unmaintained Dependencies

These packages haven't been updated in over 2 years:

| Package | Version | Last Published | Recommendation |
|---------|---------|----------------|----------------|
${auditResults.filter(d => d.isUnmaintained).map(dep => 
  \`| \\\`\${dep.name}\\\` | \${dep.version} | \${dep.lastPublished?.split('T')[0] || 'Unknown'} | ${dep.isDev ? 'Consider alternative or remove if unused' : '⚠️ Find maintained alternative'} |\`
).join('\n')}

${auditResults.filter(d => d.isUnmaintained).length === 0 ? '✅ All dependencies are actively maintained!' : ''}

---

## Wildcard Version Constraints

These packages use wildcards (^, ~, *) which may introduce breaking changes:

| Package | Current | Recommendation |
|---------|---------|----------------|
${auditResults.filter(d => d.hasWildcard).map(dep => 
  \`| \\\`\${dep.name}\\\` | \${dep.version} | Pin to specific version or use lockfile |\`
).join('\n')}

${auditResults.filter(d => d.hasWildcard).length === 0 ? '✅ All dependencies use pinned versions!' : ''}

---

## Remediation Checklist

### Critical (P0) - Fix Immediately (Today)

${auditResults.filter(d => d.vulnerabilities.some(v => v.severity === 'CRITICAL')).map((dep, i) => \`
- [ ] **\${dep.name}** — \${dep.vulnerabilities.filter(v => v.severity === 'CRITICAL').length} critical CVE(s)
  - \\\`npm install \${dep.name}@\${dep.vulnerabilities.find(v => v.fixed)?.fixed || 'latest'}\\\`
\`).join('')}

${auditResults.filter(d => d.vulnerabilities.some(v => v.severity === 'CRITICAL')).length === 0 ? '✅ No critical vulnerabilities' : ''}

### High Priority (P1) - Fix This Week

${auditResults.filter(d => d.vulnerabilities.some(v => v.severity === 'HIGH') && !d.vulnerabilities.some(v => v.severity === 'CRITICAL')).map((dep, i) => \`
- [ ] **\${dep.name}** — \${dep.vulnerabilities.filter(v => v.severity === 'HIGH').length} high-severity CVE(s)
  - \\\`npm install \${dep.name}@\${dep.vulnerabilities.find(v => v.fixed)?.fixed || 'latest'}\\\`
\`).join('')}

${auditResults.filter(d => d.vulnerabilities.some(v => v.severity === 'HIGH') && !d.vulnerabilities.some(v => v.severity === 'CRITICAL')).length === 0 ? '✅ No high-severity vulnerabilities' : ''}

### Medium Priority (P2) - Fix This Sprint

${auditResults.filter(d => d.isUnmaintained && !d.vulnerabilities.some(v => v.severity === 'CRITICAL' || v.severity === 'HIGH')).map((dep, i) => \`
- [ ] **\${dep.name}** — Unmaintained (last update: \${dep.lastPublished?.split('T')[0]})
  - Research alternatives and migrate
\`).join('')}

${auditResults.filter(d => d.isUnmaintained && !d.vulnerabilities.some(v => v.severity === 'CRITICAL' || v.severity === 'HIGH')).length === 0 ? '✅ No unmaintained dependencies needing replacement' : ''}

---

## Best Practices

1. **Keep dependencies updated**
   - Run \\\`npm audit\\\` weekly
   - Subscribe to security advisories for critical packages
   - Use Dependabot or Renovate for automated updates

2. **Pin versions in production**
   - Use exact versions for production dependencies
   - Commit package-lock.json to version control
   - Use \\\`npm ci\\\` in CI/CD instead of \\\`npm install\\\`

3. **Audit before every release**
   - Run dependency audit before deploying
   - Block deploys if critical CVEs detected
   - Document accepted risks for unfixable vulnerabilities

4. **Minimize dependencies**
   - Only add dependencies when necessary
   - Review transitive dependencies (\\\`npm ls\\\`)
   - Consider bundle size and maintenance burden

5. **Monitor continuously**
   - Integrate \\\`npm audit\\\` into CI/CD pipeline
   - Use Snyk or similar for continuous monitoring
   - Set up alerts for new vulnerabilities

---

## Automation Recommendations

Add to your CI/CD pipeline:

\\\`\\\`\\\`yaml
# .github/workflows/security.yml
name: Dependency Security Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm audit --audit-level=high
      - run: npm outdated
\\\`\\\`\\\`

Consider these tools:
- **Snyk**: Continuous vulnerability scanning
- **Dependabot**: Automated dependency updates (GitHub native)
- **Renovate**: Advanced automated updates with customization
- **npm audit**: Built-in npm vulnerability scanner

---

## Next Steps

1. **Triage critical CVEs** — Review and fix all P0 vulnerabilities today
2. **Update dependencies** — Run updates for all fixable vulnerabilities by [DATE+7 days]
3. **Research alternatives** — For unmaintained packages, identify replacements by [DATE+14 days]
4. **Set up automation** — Add \\\`npm audit\\\` to CI/CD pipeline by [DATE+7 days]
5. **Re-audit** — Run this audit monthly or before major releases

---

## Resources

- [OSV Database](https://osv.dev/) - Open Source Vulnerability database
- [npm audit docs](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk Vulnerability DB](https://snyk.io/vuln/)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)

---

## Revision History

| Date | Total Deps | Vulnerable | Critical | High | Notes |
|------|------------|------------|----------|------|-------|
| ${new Date().toISOString().split('T')[0]} | ${summary.total} | ${summary.vulnerable} | ${summary.criticalVulns} | ${summary.highVulns} | Initial audit |

Be clear and actionable. Prioritize by risk. Provide specific remediation commands. Make it easy to track progress.`
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
    report = 'Failed to generate dependency audit report'
  }

  // Write output
  const outputDir = join(projectRoot, '_reports', 'security')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'dependency-audit.md')
  writeFileSync(outputPath, report, 'utf-8')

  console.log(`\nDependency audit report generated: ${outputPath}`)
  console.log(`\nSummary:`)
  console.log(`  Total dependencies: ${summary.total}`)
  console.log(`  Vulnerable packages: ${summary.vulnerable}`)
  console.log(`  Total CVEs: ${summary.totalVulns}`)
  console.log(`  🔴 Critical: ${summary.criticalVulns}`)
  console.log(`  🟠 High: ${summary.highVulns}`)
  console.log(`  Unmaintained: ${summary.unmaintained}`)
}

auditDependencies().catch(console.error)
```

## Output

Creates _reports/security/dependency-audit.md with comprehensive dependency security audit. Includes executive summary with overall posture assessment, summary statistics table with total deps/CVEs/severity breakdown, high-risk dependencies section with risk scores and vulnerability details from OSV API, complete vulnerable dependencies table with severity and fix availability, unmaintained dependencies list (>2 years since last publish), wildcard version constraints recommendations, prioritized remediation checklist (P0 Critical/P1 High/P2 Medium) with specific npm install commands, best practices for dependency management, CI/CD automation recommendations with YAML examples, and monthly audit schedule.
