---
name: secrets-scan
description: >
  Scans for accidentally committed secrets by walking entire repo (excluding
  node_modules/.git), entropy-based detection, checks .env in .gitignore,
  checks for committed .env files, runs git log for deleted files that may
  have contained secrets. Writes findings to security report.
department: security
triggers: ["/startup-os security"]
allowed-tools: [Read, Write, Bash]
reads:
  - All files in repository
  - .gitignore
  - git history
writes:
  - _reports/security/secrets-scan.md
---

## What this agent does

Performs comprehensive scan for accidentally committed secrets and credentials. Walks entire repository excluding node_modules/.git, applies entropy-based detection for high-randomness strings (likely keys/tokens), regex patterns for known secret formats (AWS keys, API keys, passwords, tokens, private keys), checks if .env files are properly gitignored, scans for committed .env files, runs git log to find deleted files that may have contained secrets in history. Writes detailed findings with file paths, line numbers, secret types, and remediation steps to _reports/security/secrets-scan.md.

## Instructions

1. Use Bash to find all files in repo (exclude node_modules, .git, dist)
2. Read .gitignore to check if .env patterns are excluded
3. Scan for committed .env files
4. For each file, apply secret detection patterns:
   - High entropy strings (base64, hex, likely random tokens)
   - AWS access keys (AKIA...)
   - Private keys (BEGIN PRIVATE KEY)
   - Generic API keys, passwords, secrets in variable assignments
   - JWT tokens
   - Database connection strings with credentials
5. Run git log --all --diff-filter=D to find deleted files
6. Check if deleted files were .env or contained secrets
7. Calculate severity: Critical (production secrets), High (likely secrets), Medium (possible secrets)
8. Generate remediation recommendations for each finding
9. Include secret rotation checklist
10. Write to _reports/security/secrets-scan.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { join } from 'path'

interface SecretFinding {
  file: string
  line: number
  secretType: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  snippet: string
  inGitHistory: boolean
  recommendation: string
}

function calculateEntropy(str: string): number {
  const freq: Record<string, number> = {}
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1
  }
  
  let entropy = 0
  for (const count of Object.values(freq)) {
    const p = count / str.length
    entropy -= p * Math.log2(p)
  }
  
  return entropy
}

async function scanForSecrets() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  console.log('\n=== Secrets Scanner ===\n')
  console.log('Scanning repository for accidentally committed secrets...\n')

  // Find all files (exclude node_modules, .git, dist, etc.)
  const findCommand = `find ${projectRoot} -type f \\
    -not -path "*/node_modules/*" \\
    -not -path "*/.git/*" \\
    -not -path "*/dist/*" \\
    -not -path "*/build/*" \\
    -not -path "*/.next/*" \\
    -not -path "*/coverage/*"`

  let files: string[] = []
  try {
    const output = execSync(findCommand, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 })
    files = output.trim().split('\n').filter(f => f.length > 0)
  } catch (err) {
    console.error('Error finding files:', err)
    files = []
  }

  console.log(`Found ${files.length} files to scan\n`)

  const findings: SecretFinding[] = []

  // Check if .env is in .gitignore
  let gitignoreContent = ''
  let envInGitignore = false
  try {
    gitignoreContent = readFileSync(join(projectRoot, '.gitignore'), 'utf-8')
    envInGitignore = /\\.env/.test(gitignoreContent) || /^\.env$/.test(gitignoreContent)
  } catch (err) {
    console.warn('Warning: .gitignore not found')
  }

  if (!envInGitignore) {
    findings.push({
      file: '.gitignore',
      line: 0,
      secretType: '.env not gitignored',
      severity: 'High',
      snippet: '.env files not excluded in .gitignore',
      inGitHistory: false,
      recommendation: 'Add .env* to .gitignore to prevent accidentally committing secrets.'
    })
  }

  // Secret detection patterns
  const patterns = [
    {
      regex: /AKIA[0-9A-Z]{16}/g,
      type: 'AWS Access Key',
      severity: 'Critical' as const,
      recommendation: 'AWS access key detected. Rotate immediately via AWS IAM console, then add to .gitignore and remove from history using git-filter-repo.'
    },
    {
      regex: /-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/g,
      type: 'Private Key',
      severity: 'Critical' as const,
      recommendation: 'Private key detected. Regenerate key pair, update all systems using this key, remove from repo and history.'
    },
    {
      regex: /eyJ[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+/g,
      type: 'JWT Token',
      severity: 'High' as const,
      recommendation: 'JWT token detected. Revoke token if still valid, ensure tokens are not logged or committed.'
    },
    {
      regex: /(password|passwd|pwd|secret|api[_-]?key|apikey|access[_-]?token|auth[_-]?token|private[_-]?key)\\s*[:=]\\s*["']([^"']{8,})["']/gi,
      type: 'Hardcoded Secret',
      severity: 'High' as const,
      recommendation: 'Hardcoded secret detected. Move to environment variables or secrets manager, remove from code.'
    },
    {
      regex: /(mongodb|postgres|mysql):\\/\\/[^:]+:[^@]+@/gi,
      type: 'Database Connection String',
      severity: 'Critical' as const,
      recommendation: 'Database connection string with credentials detected. Move credentials to environment variables, rotate database password.'
    },
    {
      regex: /sk_live_[0-9a-zA-Z]{24,}/g,
      type: 'Stripe Secret Key',
      severity: 'Critical' as const,
      recommendation: 'Stripe secret key detected. Roll key immediately in Stripe dashboard, update application configuration.'
    },
    {
      regex: /ghp_[0-9a-zA-Z]{36}/g,
      type: 'GitHub Personal Access Token',
      severity: 'Critical' as const,
      recommendation: 'GitHub PAT detected. Revoke token at github.com/settings/tokens, generate new one with minimal scopes.'
    },
    {
      regex: /AIza[0-9A-Za-z\\-_]{35}/g,
      type: 'Google API Key',
      severity: 'High' as const,
      recommendation: 'Google API key detected. Restrict key in Google Cloud Console, rotate if needed, add to environment variables.'
    }
  ]

  // Scan files
  for (const file of files) {
    // Skip binary files and large files
    if (file.match(/\\.(jpg|jpeg|png|gif|pdf|zip|tar|gz|ico|woff|woff2|ttf|eot)$/)) {
      continue
    }

    try {
      const content = readFileSync(file, 'utf-8')
      const lines = content.split('\n')

      // Pattern-based detection
      for (const patternConfig of patterns) {
        const matches = content.matchAll(patternConfig.regex)
        
        for (const match of matches) {
          if (!match.index) continue

          // Find line number
          const beforeMatch = content.substring(0, match.index)
          const lineNumber = beforeMatch.split('\n').length

          // Get snippet
          const lineContent = lines[lineNumber - 1] || ''
          
          // Skip if in comment (basic check)
          if (lineContent.trim().startsWith('//') || lineContent.trim().startsWith('#') || lineContent.trim().startsWith('*')) {
            continue
          }

          // Check if it's a placeholder or example
          if (/example|placeholder|your_|xxx|<your|\\[your/i.test(lineContent)) {
            continue
          }

          findings.push({
            file: file.replace(projectRoot + '/', ''),
            line: lineNumber,
            secretType: patternConfig.type,
            severity: patternConfig.severity,
            snippet: lineContent.trim().substring(0, 100),
            inGitHistory: false,
            recommendation: patternConfig.recommendation
          })
        }
      }

      // Entropy-based detection for high-randomness strings
      const entropyRegex = /["']([a-zA-Z0-9+/=_-]{20,})["']/g
      const entropyMatches = content.matchAll(entropyRegex)
      
      for (const match of entropyMatches) {
        if (!match[1] || !match.index) continue
        
        const str = match[1]
        const entropy = calculateEntropy(str)
        
        // High entropy suggests random string (potential secret)
        if (entropy > 4.5 && str.length >= 20) {
          const beforeMatch = content.substring(0, match.index)
          const lineNumber = beforeMatch.split('\n').length
          const lineContent = lines[lineNumber - 1] || ''
          
          // Skip if in comment
          if (lineContent.trim().startsWith('//') || lineContent.trim().startsWith('#') || lineContent.trim().startsWith('*')) {
            continue
          }
          
          // Skip if looks like a hash or test data
          if (/hash|test|example|mock|fixture/i.test(lineContent)) {
            continue
          }

          findings.push({
            file: file.replace(projectRoot + '/', ''),
            line: lineNumber,
            secretType: 'High Entropy String',
            severity: 'Medium',
            snippet: lineContent.trim().substring(0, 100),
            inGitHistory: false,
            recommendation: 'High-entropy string detected (potential secret). Review to confirm if sensitive, move to environment variables if so.'
          })
        }
      }

      // Check for .env files
      if (file.endsWith('.env') || file.includes('.env.')) {
        findings.push({
          file: file.replace(projectRoot + '/', ''),
          line: 0,
          secretType: 'Committed .env file',
          severity: 'Critical',
          snippet: '.env file committed to repository',
          inGitHistory: false,
          recommendation: 'Remove .env file from repository immediately, add to .gitignore, rotate all secrets contained within.'
        })
      }

    } catch (err) {
      // Skip files we can't read
    }
  }

  // Check git history for deleted .env files or secrets
  console.log('Checking git history for deleted secret files...\n')
  
  try {
    const deletedFiles = execSync('git log --all --diff-filter=D --name-only --pretty=format:', {
      cwd: projectRoot,
      encoding: 'utf-8'
    })
    
    const deletedFilesList = deletedFiles.split('\n').filter(f => f.trim().length > 0)
    
    for (const file of deletedFilesList) {
      if (file.includes('.env') || file.includes('secret') || file.includes('credential') || file.includes('password')) {
        findings.push({
          file: file,
          line: 0,
          secretType: 'Deleted secret file in history',
          severity: 'High',
          snippet: `File ${file} was committed and deleted, but remains in git history`,
          inGitHistory: true,
          recommendation: 'Secrets found in git history. If this file contained sensitive data, use git-filter-repo or BFG Repo-Cleaner to remove from history, then rotate all secrets.'
        })
      }
    }
  } catch (err) {
    console.warn('Warning: Could not check git history (not a git repo or git not available)')
  }

  console.log(`Scan complete. Found ${findings.length} potential secrets.\n`)

  // Sort by severity
  const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 }
  findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  // Generate summary
  const summary = {
    total: findings.length,
    critical: findings.filter(f => f.severity === 'Critical').length,
    high: findings.filter(f => f.severity === 'High').length,
    medium: findings.filter(f => f.severity === 'Medium').length,
    inHistory: findings.filter(f => f.inGitHistory).length,
    byType: {} as Record<string, number>
  }

  for (const finding of findings) {
    summary.byType[finding.secretType] = (summary.byType[finding.secretType] || 0) + 1
  }

  // Generate report with Claude
  const findingsJson = JSON.stringify(findings, null, 2)
  const summaryJson = JSON.stringify(summary, null, 2)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are a secrets security expert. Format these findings into a comprehensive report:

# Summary
${summaryJson}

# Findings
${findingsJson}

Create a report with this structure:

# Secrets Scan Report

**Generated**: ${new Date().toISOString().split('T')[0]}
**Files Scanned**: ${files.length}
**Secrets Found**: ${findings.length}

---

## Executive Summary

[2-3 paragraphs covering:
- Overall secrets security posture
- Critical findings that need immediate action
- Whether secrets are in git history (harder to remediate)
- Immediate next steps]

---

## Summary Statistics

| Severity | Count | Percentage |
|----------|-------|------------|
| 🔴 Critical | ${summary.critical} | ${Math.round(summary.critical / Math.max(summary.total, 1) * 100)}% |
| 🟠 High | ${summary.high} | ${Math.round(summary.high / Math.max(summary.total, 1) * 100)}% |
| 🟡 Medium | ${summary.medium} | ${Math.round(summary.medium / Math.max(summary.total, 1) * 100)}% |
| **Total** | **${summary.total}** | **100%** |

### Findings by Type

| Secret Type | Count |
|-------------|-------|
${Object.entries(summary.byType)
  .sort((a, b) => b[1] - a[1])
  .map(([type, count]) => \`| \${type} | \${count} |\`)
  .join('\n')}

### Git History Contamination

- Secrets in git history: **${summary.inHistory}**
- ${summary.inHistory > 0 ? '⚠️ Requires git history cleanup (git-filter-repo or BFG)' : '✅ No secrets found in deleted files'}

---

## Critical Findings (Immediate Action Required)

${findings.filter(f => f.severity === 'Critical').map((finding, idx) => \`
### ${idx + 1}. ${finding.secretType}

**File**: \\\`${finding.file}\\\`
**Line**: ${finding.line}
${finding.inGitHistory ? '**⚠️ IN GIT HISTORY** — Requires history rewrite' : ''}

**Code**:
\\\`\\\`\\\`
${finding.snippet}
\\\`\\\`\\\`

**Recommendation**: ${finding.recommendation}

**Immediate Actions**:
1. Rotate the exposed secret immediately
2. Remove from codebase and add to .gitignore
3. ${finding.inGitHistory ? 'Clean git history using git-filter-repo' : 'Commit the removal'}
4. Verify the secret is not used elsewhere
5. Add to secrets manager or environment variables

---
\`).join('\n')}

${summary.critical === 0 ? '✅ No critical secrets found!' : ''}

---

## High Severity Findings

${findings.filter(f => f.severity === 'High').map((finding, idx) => \`
### ${idx + 1}. ${finding.secretType}

**File**: \\\`${finding.file}\\\`
**Line**: ${finding.line}
${finding.inGitHistory ? '**⚠️ IN GIT HISTORY**' : ''}

**Code**:
\\\`\\\`\\\`
${finding.snippet}
\\\`\\\`\\\`

**Recommendation**: ${finding.recommendation}

---
\`).join('\n')}

${summary.high === 0 ? '✅ No high-severity secrets found!' : ''}

---

## Medium Severity Findings

${findings.filter(f => f.severity === 'Medium').map((finding, idx) => \`
### ${idx + 1}. ${finding.secretType}

**File**: \\\`${finding.file}\\\`
**Line**: ${finding.line}

**Code**:
\\\`\\\`\\\`
${finding.snippet}
\\\`\\\`\\\`

**Recommendation**: ${finding.recommendation}

---
\`).join('\n')}

${summary.medium === 0 ? '✅ No medium-severity secrets found!' : ''}

---

## Secret Rotation Checklist

If secrets were found, rotate them using this checklist:

### AWS Credentials
- [ ] Deactivate old key in IAM
- [ ] Generate new access key
- [ ] Update application configuration
- [ ] Verify old key is fully deactivated
- [ ] Monitor CloudTrail for unauthorized access

### API Keys
- [ ] Revoke old key in provider dashboard
- [ ] Generate new key
- [ ] Update environment variables
- [ ] Verify old key no longer works
- [ ] Monitor for unauthorized API calls

### Database Credentials
- [ ] Create new database user or change password
- [ ] Update connection strings in application
- [ ] Test connectivity
- [ ] Remove old user or password
- [ ] Review database access logs

### Private Keys (SSH, SSL, etc.)
- [ ] Generate new key pair
- [ ] Update all systems with new public key
- [ ] Update application with new private key
- [ ] Delete old key pair
- [ ] Verify old key no longer grants access

### JWT Signing Keys
- [ ] Generate new signing key
- [ ] Deploy new key to all services
- [ ] Verify new tokens are signed with new key
- [ ] Invalidate tokens signed with old key
- [ ] Update documentation

---

## Git History Cleanup

${summary.inHistory > 0 ? \`
### ⚠️ Secrets found in git history require cleanup

**Why this matters**: Even if you delete a file, it remains in git history. Anyone with access to the repository can retrieve it.

**How to clean history**:

#### Option 1: git-filter-repo (Recommended)

\\\`\\\`\\\`bash
# Install git-filter-repo
pip install git-filter-repo

# Remove specific files
git filter-repo --path .env --invert-paths
git filter-repo --path config/secrets.yml --invert-paths

# Remove specific secrets (replace with [REMOVED])
git filter-repo --replace-text <(echo "YOUR_SECRET_KEY==>REMOVED")

# Force push to remote (WARNING: destructive)
git push origin --force --all
\\\`\\\`\\\`

#### Option 2: BFG Repo-Cleaner

\\\`\\\`\\\`bash
# Download BFG
# https://rtyley.github.io/bfg-repo-cleaner/

# Remove files
java -jar bfg.jar --delete-files .env

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
\\\`\\\`\\\`

**After cleanup**:
1. Notify all team members to re-clone the repository
2. Update any CI/CD systems
3. Verify secrets are fully removed: \\\`git log --all --full-history -- path/to/file\\\`
\` : '✅ No secrets in git history — no cleanup needed'}

---

## Prevention Best Practices

1. **Use .gitignore properly**
   - Add \\\`.env*\\\` to .gitignore before first commit
   - Add \\\`*.pem\\\`, \\\`*.key\\\`, \\\`*secret*\\\` patterns
   - Commit .gitignore in initial commit

2. **Use environment variables**
   - Store all secrets in environment variables
   - Use \\\`.env\\\` files locally (never commit)
   - Use secrets managers in production (AWS Secrets Manager, Vault)

3. **Use pre-commit hooks**
   - Install git-secrets: \\\`brew install git-secrets\\\`
   - Add patterns: \\\`git secrets --register-aws\\\`
   - Scan on commit: prevents accidents

4. **Educate team**
   - Onboarding includes secrets training
   - Review .env.example files (safe to commit)
   - Use 1Password or similar for sharing

5. **Audit regularly**
   - Run this scan weekly
   - Audit git history for leaks
   - Subscribe to Have I Been Pwned API for leaked credentials

---

## Automated Prevention

### Pre-commit Hook

Add to \\\`.git/hooks/pre-commit\\\`:

\\\`\\\`\\\`bash
#!/bin/bash

# Check for common secret patterns
git diff --cached --name-only | while read file; do
  if [[ "$file" == *.env* ]]; then
    echo "❌ Blocked: .env file in commit"
    exit 1
  fi
  
  if grep -E "(password|secret|api[_-]?key)\\s*=\\s*['\"][^'\"]{8,}" "$file" > /dev/null; then
    echo "❌ Blocked: Potential secret in $file"
    exit 1
  fi
done

exit 0
\\\`\\\`\\\`

### CI/CD Integration

Add to your CI pipeline:

\\\`\\\`\\\`yaml
# .github/workflows/security.yml
name: Secrets Scan
on: [push, pull_request]
jobs:
  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0  # Full history
      - name: Run gitleaks
        uses: gitleaks/gitleaks-action@v2
\\\`\\\`\\\`

### Tools to Consider

- **gitleaks**: Fast secrets scanner for git repos
- **truffleHog**: Digs through git history for secrets
- **git-secrets**: Prevents committing secrets (AWS focus)
- **detect-secrets**: Yelp's enterprise-grade scanner

---

## Next Steps

1. **Rotate all exposed secrets immediately** — Do not deploy until complete
2. **Remove secrets from code** — Move to environment variables by [DATE+1 day]
3. **Clean git history if needed** — Use git-filter-repo by [DATE+3 days]
4. **Set up pre-commit hooks** — Prevent future leaks by [DATE+7 days]
5. **Audit team access** — Ensure leaked secrets didn't grant unauthorized access
6. **Re-scan after fixes** — Run this tool again to verify

---

## Resources

- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [gitleaks](https://github.com/gitleaks/gitleaks)
- [Have I Been Pwned](https://haveibeenpwned.com/)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## Revision History

| Date | Secrets Found | Critical | High | In History |
|------|---------------|----------|------|------------|
| ${new Date().toISOString().split('T')[0]} | ${summary.total} | ${summary.critical} | ${summary.high} | ${summary.inHistory} |

Be extremely clear about severity. Make remediation actionable. Emphasize urgency for critical findings. Provide exact commands for cleanup.`
      }
    ]
  })

  // Extract content
  let report = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      report += block.text + '\n'
    }
  }

  if (!report.trim()) {
    report = 'Failed to generate secrets scan report'
  }

  // Write output
  const outputDir = join(projectRoot, '_reports', 'security')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'secrets-scan.md')
  writeFileSync(outputPath, report, 'utf-8')

  console.log(`\nSecrets scan report generated: ${outputPath}`)
  console.log(`\nSummary:`)
  console.log(`  Total findings: ${summary.total}`)
  console.log(`  🔴 Critical: ${summary.critical}`)
  console.log(`  🟠 High: ${summary.high}`)
  console.log(`  🟡 Medium: ${summary.medium}`)
  console.log(`  📜 In git history: ${summary.inHistory}`)
}

scanForSecrets().catch(console.error)
```

## Output

Creates _reports/security/secrets-scan.md with comprehensive secrets scan results. Includes executive summary with security posture and immediate actions, summary statistics with severity breakdown and findings by type, git history contamination status, critical/high/medium findings with file paths/line numbers/code snippets, detailed secret rotation checklist for AWS/API keys/databases/private keys/JWT signing keys, git history cleanup instructions with git-filter-repo and BFG commands, prevention best practices, automated prevention with pre-commit hooks and CI/CD integration examples, tool recommendations (gitleaks, truffleHog, git-secrets), and urgent next steps for remediation.
