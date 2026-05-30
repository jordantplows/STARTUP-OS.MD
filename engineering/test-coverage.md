---
name: test-coverage
description: Validates test coverage for TypeScript source files
version: 1.0.0
---

# What

Validates test coverage by:
- Finding all TypeScript source files
- Checking for corresponding `.test.ts` files
- Counting assertions in test files
- Flagging files with no tests
- Flagging tests with no error-path testing
- Running `tsc --noEmit` to capture type errors

# Instructions

1. Scan project for all `.ts` files (excluding `.test.ts`, `node_modules`, `.d.ts`)
2. For each source file, check if matching `.test.ts` exists
3. For files with tests, analyze:
   - Number of test cases
   - Number of assertions (expect, assert, etc.)
   - Presence of error-path tests (try/catch, .rejects, .throws)
4. Run TypeScript compiler in check mode
5. Generate comprehensive coverage report
6. Write to `_reports/engineering/test-coverage.md`

# Code

```typescript
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, basename, relative, extname } from 'path';

interface TestCoverageResult {
  sourceFile: string;
  hasTest: boolean;
  testFile?: string;
  testCount: number;
  assertionCount: number;
  hasErrorPathTests: boolean;
  issues: string[];
}

interface TypeCheckResult {
  success: boolean;
  errors: Array<{ file: string; line: number; message: string }>;
}

function findAllSourceFiles(dir: string, files: string[] = []): string[] {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry.startsWith('.') || entry === 'node_modules' || entry === '_reports') {
        continue;
      }

      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        findAllSourceFiles(fullPath, files);
      } else if (
        entry.endsWith('.ts') &&
        !entry.endsWith('.test.ts') &&
        !entry.endsWith('.spec.ts') &&
        !entry.endsWith('.d.ts')
      ) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore directories we can't read
  }
  return files;
}

function findTestFile(sourceFile: string): string | null {
  const dir = dirname(sourceFile);
  const base = basename(sourceFile, '.ts');
  
  const possibleTestFiles = [
    join(dir, `${base}.test.ts`),
    join(dir, `${base}.spec.ts`),
    join(dir, '__tests__', `${base}.test.ts`),
    join(dir, '__tests__', `${base}.spec.ts`),
  ];

  for (const testFile of possibleTestFiles) {
    if (existsSync(testFile)) {
      return testFile;
    }
  }

  return null;
}

function analyzeTestFile(testFile: string): {
  testCount: number;
  assertionCount: number;
  hasErrorPathTests: boolean;
} {
  let content: string;
  try {
    content = readFileSync(testFile, 'utf-8');
  } catch (error) {
    return { testCount: 0, assertionCount: 0, hasErrorPathTests: false };
  }

  const lines = content.split('\n');
  
  // Count test cases
  let testCount = 0;
  for (const line of lines) {
    if (
      line.match(/^\s*it\s*\(/) ||
      line.match(/^\s*test\s*\(/) ||
      line.match(/^\s*describe\s*\(/)
    ) {
      testCount++;
    }
  }

  // Count assertions
  let assertionCount = 0;
  for (const line of lines) {
    assertionCount += (line.match(/expect\(/g) || []).length;
    assertionCount += (line.match(/assert\./g) || []).length;
    assertionCount += (line.match(/should\./g) || []).length;
  }

  // Check for error-path testing
  const hasErrorPathTests =
    content.includes('.rejects') ||
    content.includes('.throws') ||
    content.includes('try {') ||
    content.includes('catch') ||
    content.includes('toThrow') ||
    content.includes('toThrowError');

  return { testCount, assertionCount, hasErrorPathTests };
}

function analyzeSourceFile(sourceFile: string): TestCoverageResult {
  const result: TestCoverageResult = {
    sourceFile,
    hasTest: false,
    testCount: 0,
    assertionCount: 0,
    hasErrorPathTests: false,
    issues: [],
  };

  const testFile = findTestFile(sourceFile);

  if (!testFile) {
    result.issues.push('No test file found');
    return result;
  }

  result.hasTest = true;
  result.testFile = testFile;

  const analysis = analyzeTestFile(testFile);
  result.testCount = analysis.testCount;
  result.assertionCount = analysis.assertionCount;
  result.hasErrorPathTests = analysis.hasErrorPathTests;

  // Check for test quality issues
  if (result.testCount === 0) {
    result.issues.push('Test file exists but contains no test cases');
  }

  if (result.assertionCount === 0 && result.testCount > 0) {
    result.issues.push('Tests exist but contain no assertions');
  }

  if (result.testCount > 0 && result.assertionCount / result.testCount < 1) {
    result.issues.push('Average assertions per test is less than 1');
  }

  if (!result.hasErrorPathTests) {
    result.issues.push('No error-path tests detected');
  }

  // Check source file for async/throw patterns that should be tested
  try {
    const sourceContent = readFileSync(sourceFile, 'utf-8');
    const hasAsync = sourceContent.includes('async ');
    const hasThrow = sourceContent.includes('throw ');
    const hasErrorClass = sourceContent.includes('extends Error');

    if (hasAsync && !result.hasErrorPathTests) {
      result.issues.push('Source has async code but no async error tests');
    }

    if (hasThrow && !result.hasErrorPathTests) {
      result.issues.push('Source throws errors but no error tests found');
    }

    if (hasErrorClass && result.assertionCount < 2) {
      result.issues.push('Source defines custom error but minimal test coverage');
    }
  } catch (error) {
    // Ignore if we can't read source
  }

  return result;
}

function runTypeCheck(): TypeCheckResult {
  const result: TypeCheckResult = {
    success: true,
    errors: [],
  };

  try {
    execSync('tsc --noEmit', { encoding: 'utf-8', stdio: 'pipe' });
  } catch (error: any) {
    result.success = false;

    if (error.stdout) {
      const output = error.stdout.toString();
      const errorLines = output.split('\n');

      for (const line of errorLines) {
        // Parse TypeScript error format: file.ts(line,col): error TS####: message
        const match = line.match(/^(.+?)\((\d+),\d+\): error TS\d+: (.+)$/);
        if (match) {
          result.errors.push({
            file: match[1],
            line: parseInt(match[2], 10),
            message: match[3],
          });
        }
      }
    }
  }

  return result;
}

function generateReport(results: TestCoverageResult[], typeCheck: TypeCheckResult): string {
  const now = new Date().toISOString();
  let report = `# Test Coverage Report\n\n`;
  report += `**Generated:** ${now}\n\n`;

  // Summary statistics
  const totalFiles = results.length;
  const filesWithTests = results.filter(r => r.hasTest).length;
  const filesWithoutTests = totalFiles - filesWithTests;
  const coveragePercent = totalFiles > 0 ? ((filesWithTests / totalFiles) * 100).toFixed(1) : '0';

  const totalTests = results.reduce((sum, r) => sum + r.testCount, 0);
  const totalAssertions = results.reduce((sum, r) => sum + r.assertionCount, 0);
  const filesWithErrorTests = results.filter(r => r.hasErrorPathTests).length;

  report += `## Summary\n\n`;
  report += `- **Total Source Files:** ${totalFiles}\n`;
  report += `- **Files With Tests:** ${filesWithTests}\n`;
  report += `- **Files Without Tests:** ${filesWithoutTests}\n`;
  report += `- **Coverage:** ${coveragePercent}%\n`;
  report += `- **Total Test Cases:** ${totalTests}\n`;
  report += `- **Total Assertions:** ${totalAssertions}\n`;
  report += `- **Files With Error Tests:** ${filesWithErrorTests}\n`;
  report += `- **Type Check:** ${typeCheck.success ? '✅ Pass' : '❌ Fail'}\n`;
  report += `- **Type Errors:** ${typeCheck.errors.length}\n\n`;

  // Files without tests
  const noTests = results.filter(r => !r.hasTest);
  if (noTests.length > 0) {
    report += `## Files Without Tests (${noTests.length})\n\n`;
    for (const result of noTests) {
      report += `- ${relative(process.cwd(), result.sourceFile)}\n`;
    }
    report += `\n`;
  }

  // Files with test issues
  const withIssues = results.filter(r => r.issues.length > 0);
  if (withIssues.length > 0) {
    report += `## Files With Test Issues (${withIssues.length})\n\n`;
    for (const result of withIssues) {
      report += `### ${relative(process.cwd(), result.sourceFile)}\n\n`;
      if (result.testFile) {
        report += `**Test File:** ${relative(process.cwd(), result.testFile)}\n\n`;
      }
      report += `**Statistics:**\n`;
      report += `- Test Cases: ${result.testCount}\n`;
      report += `- Assertions: ${result.assertionCount}\n`;
      report += `- Has Error Tests: ${result.hasErrorPathTests ? 'Yes' : 'No'}\n\n`;
      report += `**Issues:**\n`;
      for (const issue of result.issues) {
        report += `- ${issue}\n`;
      }
      report += `\n`;
    }
  }

  // Files with good coverage
  const goodCoverage = results.filter(
    r => r.hasTest && r.testCount > 0 && r.assertionCount > 0 && r.hasErrorPathTests && r.issues.length === 0
  );
  if (goodCoverage.length > 0) {
    report += `## Files With Good Coverage (${goodCoverage.length})\n\n`;
    for (const result of goodCoverage) {
      report += `- ${relative(process.cwd(), result.sourceFile)} (${result.testCount} tests, ${result.assertionCount} assertions)\n`;
    }
    report += `\n`;
  }

  // Type errors
  if (!typeCheck.success && typeCheck.errors.length > 0) {
    report += `## Type Errors (${typeCheck.errors.length})\n\n`;

    // Group by file
    const errorsByFile = new Map<string, Array<{ line: number; message: string }>>();
    for (const error of typeCheck.errors) {
      if (!errorsByFile.has(error.file)) {
        errorsByFile.set(error.file, []);
      }
      errorsByFile.get(error.file)!.push({ line: error.line, message: error.message });
    }

    for (const [file, errors] of errorsByFile) {
      report += `### ${file}\n\n`;
      for (const error of errors) {
        report += `- Line ${error.line}: ${error.message}\n`;
      }
      report += `\n`;
    }
  }

  // Recommendations
  report += `## Recommendations\n\n`;

  if (filesWithoutTests > 0) {
    report += `1. **Add tests for ${filesWithoutTests} uncovered file(s)**\n`;
    report += `   - Priority: Files with exported functions or complex logic\n\n`;
  }

  const noErrorTests = results.filter(r => r.hasTest && !r.hasErrorPathTests);
  if (noErrorTests.length > 0) {
    report += `2. **Add error-path tests for ${noErrorTests.length} file(s)**\n`;
    report += `   - Use .rejects, .throws, or try/catch in tests\n\n`;
  }

  const lowAssertions = results.filter(r => r.hasTest && r.testCount > 0 && r.assertionCount / r.testCount < 2);
  if (lowAssertions.length > 0) {
    report += `3. **Increase assertions in ${lowAssertions.length} test file(s)**\n`;
    report += `   - Aim for at least 2-3 assertions per test case\n\n`;
  }

  if (!typeCheck.success) {
    report += `4. **Fix ${typeCheck.errors.length} TypeScript error(s)**\n`;
    report += `   - Run \`tsc --noEmit\` for details\n\n`;
  }

  return report;
}

async function main() {
  console.log('📊 Starting test coverage analysis...\n');

  const sourceFiles = findAllSourceFiles(process.cwd());
  console.log(`Found ${sourceFiles.length} source file(s)\n`);

  const results: TestCoverageResult[] = [];

  for (const sourceFile of sourceFiles) {
    console.log(`Analyzing: ${relative(process.cwd(), sourceFile)}`);
    const result = analyzeSourceFile(sourceFile);
    results.push(result);

    if (result.hasTest) {
      console.log(`  ✓ Has tests (${result.testCount} cases, ${result.assertionCount} assertions)`);
    } else {
      console.log(`  ⚠️  No tests found`);
    }
  }

  console.log('\nRunning type check...');
  const typeCheck = runTypeCheck();

  if (typeCheck.success) {
    console.log('  ✓ No type errors');
  } else {
    console.log(`  ⚠️  Found ${typeCheck.errors.length} type error(s)`);
  }

  console.log('\nGenerating report...');
  const report = generateReport(results, typeCheck);

  const reportPath = join(process.cwd(), '_reports', 'engineering', 'test-coverage.md');
  writeFileSync(reportPath, report, 'utf-8');

  console.log(`\n✅ Report written to: ${reportPath}`);

  const filesWithoutTests = results.filter(r => !r.hasTest).length;
  const coveragePercent = results.length > 0 
    ? ((results.filter(r => r.hasTest).length / results.length) * 100).toFixed(1) 
    : '0';
  
  console.log(`\nCoverage: ${coveragePercent}% (${filesWithoutTests} files without tests)`);
}

main().catch(console.error);
```

# Output

Report written to `_reports/engineering/test-coverage.md` containing:
- Coverage statistics and percentages
- List of files without tests
- Files with test quality issues
- Files with good coverage
- TypeScript compilation errors
- Prioritized recommendations
