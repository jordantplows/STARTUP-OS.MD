---
name: ci
description: Validates CI/CD setup and generates workflow if missing
version: 1.0.0
---

# What

Validates CI/CD configuration:
- Checks for `.github/workflows/` directory
- Validates workflows run build, test, and lint
- Checks branch protection is documented
- Verifies required scripts in root `package.json`
- Generates complete CI workflow if none exists

# Instructions

1. Check if `.github/workflows/` exists
2. If workflows exist, validate they include:
   - Build step
   - Test step with coverage
   - Lint/type-check step
   - Dependency installation
3. Check for required scripts in `package.json`:
   - `build`
   - `test`
   - `lint`
   - `type-check`
4. Check for branch protection documentation
5. If no CI exists, generate `.github/workflows/ci.yml`
6. Write findings to `_reports/engineering/ci-report.md`

# Code

```typescript
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { join, relative } from 'path';

interface CIValidationResult {
  hasCIDirectory: boolean;
  workflows: WorkflowAnalysis[];
  packageJsonScripts: PackageScripts;
  branchProtection: BranchProtectionStatus;
  issues: string[];
  recommendations: string[];
}

interface WorkflowAnalysis {
  file: string;
  name: string;
  hasBuild: boolean;
  hasTest: boolean;
  hasLint: boolean;
  hasTypeCheck: boolean;
  hasCoverage: boolean;
  triggers: string[];
  issues: string[];
}

interface PackageScripts {
  hasBuild: boolean;
  hasTest: boolean;
  hasLint: boolean;
  hasTypeCheck: boolean;
  missing: string[];
}

interface BranchProtectionStatus {
  documented: boolean;
  location?: string;
}

function checkCIDirectory(): { exists: boolean; workflows: string[] } {
  const ciDir = join(process.cwd(), '.github', 'workflows');
  
  if (!existsSync(ciDir)) {
    return { exists: false, workflows: [] };
  }

  try {
    const files = readdirSync(ciDir);
    const workflows = files.filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
    return { exists: true, workflows };
  } catch (error) {
    return { exists: false, workflows: [] };
  }
}

function analyzeWorkflow(workflowFile: string): WorkflowAnalysis {
  const result: WorkflowAnalysis = {
    file: workflowFile,
    name: '',
    hasBuild: false,
    hasTest: false,
    hasLint: false,
    hasTypeCheck: false,
    hasCoverage: false,
    triggers: [],
    issues: [],
  };

  let content: string;
  try {
    content = readFileSync(workflowFile, 'utf-8');
  } catch (error) {
    result.issues.push('Failed to read workflow file');
    return result;
  }

  // Extract workflow name
  const nameMatch = content.match(/name:\s*(.+)/);
  if (nameMatch) {
    result.name = nameMatch[1].trim();
  }

  // Check triggers
  if (content.includes('on:')) {
    if (content.includes('push:')) result.triggers.push('push');
    if (content.includes('pull_request:')) result.triggers.push('pull_request');
    if (content.includes('schedule:')) result.triggers.push('schedule');
    if (content.includes('workflow_dispatch:')) result.triggers.push('manual');
  }

  // Check for build step
  result.hasBuild =
    content.includes('npm run build') ||
    content.includes('yarn build') ||
    content.includes('pnpm build') ||
    content.includes('tsc');

  // Check for test step
  result.hasTest =
    content.includes('npm test') ||
    content.includes('npm run test') ||
    content.includes('yarn test') ||
    content.includes('pnpm test');

  // Check for lint
  result.hasLint =
    content.includes('npm run lint') ||
    content.includes('yarn lint') ||
    content.includes('pnpm lint') ||
    content.includes('eslint');

  // Check for type checking
  result.hasTypeCheck =
    content.includes('type-check') ||
    content.includes('tsc --noEmit') ||
    content.includes('typecheck');

  // Check for coverage
  result.hasCoverage =
    content.includes('--coverage') ||
    content.includes('coverage') ||
    content.includes('codecov');

  // Validate completeness
  if (!result.hasBuild) {
    result.issues.push('Missing build step');
  }

  if (!result.hasTest) {
    result.issues.push('Missing test step');
  }

  if (!result.hasLint) {
    result.issues.push('Missing lint step');
  }

  if (!result.hasCoverage) {
    result.issues.push('No coverage reporting configured');
  }

  if (result.triggers.length === 0) {
    result.issues.push('No triggers configured');
  }

  if (!result.triggers.includes('pull_request')) {
    result.issues.push('Missing pull_request trigger');
  }

  return result;
}

function checkPackageJsonScripts(): PackageScripts {
  const result: PackageScripts = {
    hasBuild: false,
    hasTest: false,
    hasLint: false,
    hasTypeCheck: false,
    missing: [],
  };

  const packageJsonPath = join(process.cwd(), 'package.json');
  
  if (!existsSync(packageJsonPath)) {
    result.missing = ['package.json not found'];
    return result;
  }

  let packageJson: any;
  try {
    packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  } catch (error) {
    result.missing = ['Failed to parse package.json'];
    return result;
  }

  const scripts = packageJson.scripts || {};

  result.hasBuild = 'build' in scripts;
  result.hasTest = 'test' in scripts;
  result.hasLint = 'lint' in scripts;
  result.hasTypeCheck = 'type-check' in scripts || 'typecheck' in scripts;

  if (!result.hasBuild) result.missing.push('build');
  if (!result.hasTest) result.missing.push('test');
  if (!result.hasLint) result.missing.push('lint');
  if (!result.hasTypeCheck) result.missing.push('type-check');

  return result;
}

function checkBranchProtection(): BranchProtectionStatus {
  const result: BranchProtectionStatus = {
    documented: false,
  };

  // Check common documentation locations
  const docsToCheck = [
    'CONTRIBUTING.md',
    'README.md',
    'DEVELOPMENT.md',
    '.github/CONTRIBUTING.md',
  ];

  for (const doc of docsToCheck) {
    const docPath = join(process.cwd(), doc);
    if (existsSync(docPath)) {
      try {
        const content = readFileSync(docPath, 'utf-8');
        if (
          content.toLowerCase().includes('branch protection') ||
          content.toLowerCase().includes('protected branch') ||
          content.toLowerCase().includes('status checks')
        ) {
          result.documented = true;
          result.location = doc;
          break;
        }
      } catch (error) {
        // Ignore read errors
      }
    }
  }

  return result;
}

function generateCIWorkflow(): string {
  return `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build

      - name: Test
        run: npm test -- --coverage

      - name: Upload coverage to Codecov
        if: matrix.node-version == '20.x'
        uses: codecov/codecov-action@v4
        with:
          token: \${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          fail_ci_if_error: false

  security:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Audit dependencies
        run: npm audit --audit-level=high

      - name: Check for outdated dependencies
        run: npm outdated || true

  quality:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check formatting
        run: npm run format:check || echo "Format check not configured"

      - name: Run complexity analysis
        run: |
          npx -y ts-complexity-checker || echo "Complexity check not configured"

      - name: Bundle size check
        if: github.event_name == 'pull_request'
        run: |
          npm run build
          npx -y bundlesize || echo "Bundle size check not configured"
`;
}

function performValidation(): CIValidationResult {
  const result: CIValidationResult = {
    hasCIDirectory: false,
    workflows: [],
    packageJsonScripts: { hasBuild: false, hasTest: false, hasLint: false, hasTypeCheck: false, missing: [] },
    branchProtection: { documented: false },
    issues: [],
    recommendations: [],
  };

  // Check CI directory
  const ciCheck = checkCIDirectory();
  result.hasCIDirectory = ciCheck.exists;

  if (!ciCheck.exists) {
    result.issues.push('No .github/workflows/ directory found');
    result.recommendations.push('Generate CI workflow using this agent');
  } else if (ciCheck.workflows.length === 0) {
    result.issues.push('.github/workflows/ exists but contains no workflow files');
    result.recommendations.push('Add at least one CI workflow (e.g., ci.yml)');
  } else {
    // Analyze workflows
    for (const workflow of ciCheck.workflows) {
      const workflowPath = join(process.cwd(), '.github', 'workflows', workflow);
      const analysis = analyzeWorkflow(workflowPath);
      result.workflows.push(analysis);

      if (analysis.issues.length > 0) {
        result.issues.push(`Workflow ${workflow} has issues: ${analysis.issues.join(', ')}`);
      }
    }
  }

  // Check package.json scripts
  result.packageJsonScripts = checkPackageJsonScripts();

  if (result.packageJsonScripts.missing.length > 0) {
    result.issues.push(`Missing package.json scripts: ${result.packageJsonScripts.missing.join(', ')}`);
    result.recommendations.push('Add missing npm scripts to package.json');
  }

  // Check branch protection
  result.branchProtection = checkBranchProtection();

  if (!result.branchProtection.documented) {
    result.issues.push('Branch protection rules not documented');
    result.recommendations.push('Document branch protection in CONTRIBUTING.md');
  }

  return result;
}

function generateReport(validation: CIValidationResult, generated: boolean): string {
  const now = new Date().toISOString();
  let report = `# CI/CD Validation Report\n\n`;
  report += `**Generated:** ${now}\n\n`;

  // Summary
  report += `## Summary\n\n`;
  report += `- **CI Directory Exists:** ${validation.hasCIDirectory ? '✅' : '❌'}\n`;
  report += `- **Workflows Found:** ${validation.workflows.length}\n`;
  report += `- **Issues Found:** ${validation.issues.length}\n`;
  report += `- **CI Workflow Generated:** ${generated ? '✅' : 'N/A'}\n\n`;

  // Package.json scripts
  report += `## Package.json Scripts\n\n`;
  report += `- **Build:** ${validation.packageJsonScripts.hasBuild ? '✅' : '❌'}\n`;
  report += `- **Test:** ${validation.packageJsonScripts.hasTest ? '✅' : '❌'}\n`;
  report += `- **Lint:** ${validation.packageJsonScripts.hasLint ? '✅' : '❌'}\n`;
  report += `- **Type Check:** ${validation.packageJsonScripts.hasTypeCheck ? '✅' : '❌'}\n\n`;

  if (validation.packageJsonScripts.missing.length > 0) {
    report += `**Missing Scripts:** ${validation.packageJsonScripts.missing.join(', ')}\n\n`;
  }

  // Workflows analysis
  if (validation.workflows.length > 0) {
    report += `## Workflow Analysis\n\n`;

    for (const workflow of validation.workflows) {
      report += `### ${workflow.name || relative(process.cwd(), workflow.file)}\n\n`;
      report += `**File:** \`${relative(process.cwd(), workflow.file)}\`\n\n`;
      report += `**Triggers:** ${workflow.triggers.join(', ') || 'None'}\n\n`;
      report += `**Steps:**\n`;
      report += `- Build: ${workflow.hasBuild ? '✅' : '❌'}\n`;
      report += `- Test: ${workflow.hasTest ? '✅' : '❌'}\n`;
      report += `- Lint: ${workflow.hasLint ? '✅' : '❌'}\n`;
      report += `- Type Check: ${workflow.hasTypeCheck ? '✅' : '❌'}\n`;
      report += `- Coverage: ${workflow.hasCoverage ? '✅' : '❌'}\n\n`;

      if (workflow.issues.length > 0) {
        report += `**Issues:**\n`;
        for (const issue of workflow.issues) {
          report += `- ${issue}\n`;
        }
        report += `\n`;
      }
    }
  }

  // Branch protection
  report += `## Branch Protection\n\n`;
  if (validation.branchProtection.documented) {
    report += `✅ **Documented** in \`${validation.branchProtection.location}\`\n\n`;
  } else {
    report += `❌ **Not Documented**\n\n`;
    report += `Branch protection should be documented with:\n`;
    report += `- Required status checks\n`;
    report += `- Required reviews\n`;
    report += `- Restrictions on who can push\n\n`;
  }

  // Issues
  if (validation.issues.length > 0) {
    report += `## Issues\n\n`;
    for (let i = 0; i < validation.issues.length; i++) {
      report += `${i + 1}. ${validation.issues[i]}\n`;
    }
    report += `\n`;
  }

  // Recommendations
  if (validation.recommendations.length > 0) {
    report += `## Recommendations\n\n`;
    for (let i = 0; i < validation.recommendations.length; i++) {
      report += `${i + 1}. ${validation.recommendations[i]}\n`;
    }
    report += `\n`;
  }

  // Generated workflow
  if (generated) {
    report += `## Generated Workflow\n\n`;
    report += `A complete CI workflow has been generated at \`.github/workflows/ci.yml\`\n\n`;
    report += `**Features:**\n`;
    report += `- Runs on push and pull requests\n`;
    report += `- Tests on multiple Node.js versions (18.x, 20.x)\n`;
    report += `- Includes build, test, lint, and type-check steps\n`;
    report += `- Uploads coverage to Codecov\n`;
    report += `- Runs security audit\n`;
    report += `- Includes code quality checks\n\n`;
    report += `**Next Steps:**\n`;
    report += `1. Review and customize the workflow\n`;
    report += `2. Add \`CODECOV_TOKEN\` to repository secrets (optional)\n`;
    report += `3. Enable branch protection rules on GitHub\n`;
    report += `4. Document branch protection requirements\n`;
  }

  return report;
}

async function main() {
  console.log('🔧 Starting CI/CD validation...\n');

  const validation = performValidation();

  console.log(`CI Directory: ${validation.hasCIDirectory ? '✓' : '✗'}`);
  console.log(`Workflows: ${validation.workflows.length}`);
  console.log(`Issues: ${validation.issues.length}\n`);

  let generated = false;

  // Generate CI workflow if missing
  if (!validation.hasCIDirectory || validation.workflows.length === 0) {
    console.log('No CI workflows found. Generating...');

    const workflowsDir = join(process.cwd(), '.github', 'workflows');
    mkdirSync(workflowsDir, { recursive: true });

    const ciWorkflow = generateCIWorkflow();
    const ciWorkflowPath = join(workflowsDir, 'ci.yml');

    writeFileSync(ciWorkflowPath, ciWorkflow, 'utf-8');
    console.log(`✓ Generated: ${ciWorkflowPath}\n`);

    generated = true;
  }

  console.log('Generating report...');
  const report = generateReport(validation, generated);

  const reportPath = join(process.cwd(), '_reports', 'engineering', 'ci-report.md');
  writeFileSync(reportPath, report, 'utf-8');

  console.log(`\n✅ Report written to: ${reportPath}`);

  if (generated) {
    console.log(`\n🎉 CI workflow generated at .github/workflows/ci.yml`);
    console.log('Review and commit the workflow to enable CI/CD');
  }
}

main().catch(console.error);
```

# Output

Report written to `_reports/engineering/ci-report.md` containing:
- CI directory and workflow status
- Package.json script validation
- Detailed workflow analysis
- Branch protection documentation status
- Issues and recommendations
- Complete GitHub Actions workflow generated at `.github/workflows/ci.yml` if none exists
