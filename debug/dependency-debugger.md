---
name: dependency-debugger
role: debugger
language: both
triggers: [/debug dependencies, /debug deps, /debug all]
reads:
  - package.json
  - package-lock.json / yarn.lock / pnpm-lock.yaml
  - node_modules (for actual installed versions)
writes:
  - diagnosis report to debug-reports/dependency-diagnosis.md
  - upgrade commands ready to execute
---

# Dependency Debugger

## What This Debugger Diagnoses

### 1. Outdated Packages
- Major version updates available
- Minor version updates available
- Patch version updates available
- Packages multiple versions behind latest

### 2. Known CVEs
- Critical security vulnerabilities
- High severity vulnerabilities
- Medium/low severity vulnerabilities
- Packages with no fix available yet

### 3. Unused Dependencies
- Packages in dependencies but never imported
- Packages in devDependencies but not used in scripts
- Transitive dependencies that could be removed
- Duplicate packages at different versions

### 4. Duplicate Packages
- Same package at multiple versions in tree
- Packages that can be deduplicated
- Version ranges that prevent deduplication
- Conflicting peer dependencies

### 5. Missing Peer Dependencies
- Peer dependencies not installed
- Peer dependencies at wrong version
- Optional peer dependencies that should be installed
- Peer dependency version mismatches

### 6. License Issues
- Packages with restrictive licenses (GPL, etc.)
- Packages with no license information
- License conflicts in dependency tree
- Packages with deprecated licenses

### 7. Bundle Size Impact
- Large packages that could be replaced
- Packages pulling in heavy transitive deps
- Packages with lighter alternatives
- Tree-shaking opportunities

## Diagnostic Process

1. **Inventory Phase**
   - Parse package.json and lock file
   - Read actual installed versions from node_modules
   - Build complete dependency tree
   - Identify direct vs transitive dependencies

2. **Security Audit Phase**
   - Run `npm audit` / `yarn audit` / `pnpm audit`
   - Query CVE databases for known vulnerabilities
   - Check for security advisories
   - Identify packages with no patches

3. **Usage Analysis Phase**
   - Scan codebase for actual imports
   - Match imports to package names
   - Find dependencies never referenced
   - Check devDependencies usage in scripts

4. **Version Check Phase**
   - Query npm registry for latest versions
   - Compare current vs latest versions
   - Check for breaking changes in changelogs
   - Identify safe updates vs risky updates

5. **Optimization Phase**
   - Find duplicate packages
   - Identify bundle size impact
   - Suggest lighter alternatives
   - Check for peer dependency issues

## Diagnostic Output Structure

```typescript
interface DependencyDiagnosis {
  package: string;
  currentVersion: string;
  latestVersion?: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'outdated' | 'cve' | 'unused' | 'duplicate' | 'peer-dep' | 'license' | 'bundle-size';
  issue: string;
  impact: string;
  suggestedAction: string;
  command?: string; // Exact command to run
  breakingChanges?: string[];
}
```

## Example Diagnosis

### Known CVE
```bash
# ❌ CRITICAL: Known security vulnerability
# Package: express@4.17.1
# CVE: CVE-2022-24999 (High Severity)

Issue: Denial of Service via malicious Content-Type header
CVSS Score: 7.5
First Patched: 4.17.3

Current: express@4.17.1
Latest: express@4.19.2

✅ Action: Upgrade to patched version
Command: npm install express@4.19.2

# Why: This vulnerability allows attackers to crash your server
# by sending specially crafted HTTP headers. Upgrade immediately.
```

### Outdated Package
```bash
# ⚠️  WARNING: Major version behind latest
# Package: react@17.0.2

Current: react@17.0.2
Latest: react@18.3.1
Versions behind: 1 major, 3 minor

Breaking changes in v18:
- Automatic batching of state updates
- Concurrent rendering features
- Stricter effects behavior in development

✅ Action: Plan migration to React 18
Command: npm install react@18.3.1 react-dom@18.3.1

# Why: React 18 includes performance improvements and new features.
# Review breaking changes before upgrading.
```

### Unused Dependency
```bash
# ℹ️  INFO: Unused dependency
# Package: lodash@4.17.21

Installed: 4.17.21
Bundle size: 72.4 KB (minified)
Never imported in codebase

✅ Action: Remove unused package
Command: npm uninstall lodash

# Why: Unused dependencies bloat node_modules and lock file.
# Remove to simplify maintenance and reduce install time.
```

### Duplicate Package
```bash
# ⚠️  WARNING: Package duplicated at multiple versions
# Package: uuid

Versions in tree:
- uuid@8.3.2 (required by: package-a, package-b)
- uuid@9.0.0 (required by: package-c)

Bundle impact: +14 KB (both versions bundled)

✅ Action: Align on single version
Commands:
  npm install uuid@9.0.0
  npm dedupe

# Why: Multiple versions increase bundle size and can cause bugs
# if instances are compared with === or instanceof.
```

### Missing Peer Dependency
```bash
# ❌ CRITICAL: Missing peer dependency
# Package: @types/react@18.2.0

Required peer: react@^18.0.0
Installed: (none)

This will cause TypeScript errors when importing React types.

✅ Action: Install peer dependency
Command: npm install react@18.3.1

# Why: @types/react references React's type definitions.
# Without React installed, TypeScript can't resolve types.
```

### Large Bundle Size
```bash
# ℹ️  INFO: Large dependency with smaller alternative
# Package: moment@2.29.4

Bundle size: 232 KB (minified)
Usage: Only using .format() and .diff()

Alternative: date-fns@3.6.0
Bundle size: ~15 KB (tree-shakeable, import only what you need)

✅ Action: Consider switching to date-fns
Commands:
  npm install date-fns
  npm uninstall moment
  # Migrate imports and usage

# Why: moment is not tree-shakeable and includes all locales.
# date-fns is modular and only bundles what you import.
```

### License Issue
```bash
# ⚠️  WARNING: Package with restrictive license
# Package: package-with-gpl@1.0.0

License: GPL-3.0
Issue: GPL requires derivative works to also be GPL

This may conflict with your MIT-licensed project.

✅ Action: Review license compatibility or find alternative
Alternative: similar-package@2.0.0 (MIT licensed)

# Why: GPL license requires you to open-source your code.
# If building proprietary software, find MIT/Apache licensed alternative.
```

### Version Range Too Loose
```bash
# ⚠️  WARNING: Overly permissive version range
# Package: axios

package.json: "axios": "*"
Installed: 1.6.0
Latest: 1.7.2

Issue: "*" allows ANY version including breaking changes

✅ Action: Pin to specific version or use caret range
Recommended: "axios": "^1.7.2"

# Why: "*" can cause unexpected breakage when new major versions release.
# Use ^ for automatic minor/patch updates while preventing breaking changes.
```

## Output Format

The debugger writes a structured diagnosis report to `debug-reports/dependency-diagnosis.md`:

```markdown
# Dependency Diagnosis Report
Generated: 2026-05-31 14:23:45

## Summary
- Total dependencies: 243 (87 direct, 156 transitive)
- Critical issues: 2 (CVEs)
- Warnings: 15
- Info: 8
- Outdated packages: 23
- Unused packages: 4
- Duplicates: 7

## Health Score: C+ (73/100)
- Security: 85/100 (2 CVEs)
- Freshness: 68/100 (23 outdated)
- Efficiency: 75/100 (4 unused, 7 duplicates)

## Critical Issues (2)

### 1. Known CVE in express
**Package**: express@4.17.1  
**Severity**: Critical  
**CVE**: CVE-2022-24999 (CVSS 7.5)

[Issue details]
[Suggested action]
[Exact command]

---

[Additional issues...]

## Warnings (15)
[Similar format...]

## Info (8)
[Similar format...]

## Upgrade Plan

### Immediate (Critical)
```bash
# Fix CVEs - run these now
npm install express@4.19.2
npm install webpack@5.90.0
```

### Short Term (Warnings)
```bash
# Update outdated packages - plan this week
npm install react@18.3.1 react-dom@18.3.1
npm install typescript@5.4.5
npm install eslint@8.57.0
```

### Long Term (Info)
```bash
# Cleanup and optimization - plan this month
npm uninstall lodash moment unused-lib
npm dedupe
npm install date-fns  # Replace moment
```

## Bundle Size Opportunities
Current total: 1.2 MB (minified)
Potential savings: 320 KB

1. Replace moment with date-fns: -217 KB
2. Remove unused lodash: -72 KB  
3. Dedupe uuid: -14 KB
4. Tree-shake @mui/icons-material: -17 KB

## Breaking Changes Summary
Packages with breaking changes available:
- react: 17 → 18 (automatic batching, concurrent features)
- webpack: 4 → 5 (new defaults, removed APIs)
- eslint: 7 → 8 (new rules, Node 12+ required)

Review changelogs before upgrading.

## Next Steps
1. Fix 2 critical CVEs immediately (commands above)
2. Review and apply 15 warnings this week
3. Plan major version upgrades (React 18, webpack 5)
4. Clean up 4 unused dependencies
5. Run `npm dedupe` to resolve 7 duplicates
```

## Continuous Monitoring

Set up automated dependency checking:

```bash
# Weekly audit in CI
npm audit --audit-level=moderate

# Monthly outdated check
npm outdated

# Automated PR creation
# Use Dependabot or Renovate to auto-open PRs for updates
```

## Integration

The Dependency Debugger can be invoked:
- Via CLI: `/debug dependencies` or `/debug deps`
- Pre-merge: Before merging dependency updates
- Weekly: Scheduled cron job for health check
- CI/CD: Fail builds on critical CVEs

Reports include exact commands ready to copy-paste and execute.
