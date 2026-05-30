---
name: type-safety
description: Audits TypeScript type safety and strictness
version: 1.0.0
---

# What

Audits TypeScript code for type safety issues:
- Explicit `any` usage
- Type assertions (`as`) without explanatory comments
- Non-null assertions (`!`) without justification
- `@ts-ignore` or `@ts-expect-error` without explanation
- Missing return types on exported functions
- `unknown` type without proper narrowing

# Instructions

1. Scan all `.ts` files in the project
2. For each file, check for:
   - `any` type usage (count and locations)
   - Type assertions that lack comments
   - Non-null assertions without justification
   - TypeScript suppression comments without explanation
   - Exported functions missing explicit return types
   - `unknown` type without type guards
3. Calculate type safety score
4. Generate report with findings and recommendations
5. Write to `_reports/engineering/type-safety.md`

# Code

```typescript
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

interface TypeSafetyIssue {
  file: string;
  line: number;
  column: number;
  type:
    | 'explicit-any'
    | 'type-assertion'
    | 'non-null-assertion'
    | 'ts-ignore'
    | 'missing-return-type'
    | 'unknown-without-narrowing';
  severity: 'high' | 'medium' | 'low';
  code: string;
  message: string;
  suggestion: string;
}

interface FileAnalysis {
  file: string;
  issues: TypeSafetyIssue[];
  linesOfCode: number;
  typeSafetyScore: number;
}

function findAllTypeScriptFiles(dir: string, files: string[] = []): string[] {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry.startsWith('.') || entry === 'node_modules' || entry === '_reports') {
        continue;
      }

      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        findAllTypeScriptFiles(fullPath, files);
      } else if (entry.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore directories we can't read
  }
  return files;
}

function analyzeFile(filePath: string): FileAnalysis {
  const result: FileAnalysis = {
    file: filePath,
    issues: [],
    linesOfCode: 0,
    typeSafetyScore: 100,
  };

  let content: string;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (error) {
    return result;
  }

  const lines = content.split('\n');
  result.linesOfCode = lines.filter(l => l.trim() && !l.trim().startsWith('//')).length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check for explicit 'any'
    checkExplicitAny(line, lineNum, result);

    // Check for type assertions
    checkTypeAssertions(line, lineNum, lines, i, result);

    // Check for non-null assertions
    checkNonNullAssertions(line, lineNum, lines, i, result);

    // Check for @ts-ignore / @ts-expect-error
    checkTsIgnore(line, lineNum, lines, i, result);

    // Check for missing return types on exports
    checkMissingReturnTypes(line, lineNum, result);

    // Check for unknown without narrowing
    checkUnknownWithoutNarrowing(line, lineNum, content, result);
  }

  // Calculate type safety score (0-100)
  const deductions = result.issues.reduce((sum, issue) => {
    switch (issue.severity) {
      case 'high':
        return sum + 10;
      case 'medium':
        return sum + 5;
      case 'low':
        return sum + 2;
      default:
        return sum;
    }
  }, 0);

  result.typeSafetyScore = Math.max(0, 100 - deductions);

  return result;
}

function checkExplicitAny(line: string, lineNum: number, result: FileAnalysis): void {
  // Match explicit any declarations
  const anyMatches = [
    ...line.matchAll(/:\s*any\b/g),
    ...line.matchAll(/<any>/g),
    ...line.matchAll(/Array<any>/g),
  ];

  for (const match of anyMatches) {
    // Exclude comments
    const beforeMatch = line.substring(0, match.index);
    if (beforeMatch.includes('//')) continue;

    result.issues.push({
      file: result.file,
      line: lineNum,
      column: match.index!,
      type: 'explicit-any',
      severity: 'high',
      code: line.trim(),
      message: 'Explicit `any` type defeats type checking',
      suggestion: 'Use a more specific type or `unknown` with type guards',
    });
  }
}

function checkTypeAssertions(
  line: string,
  lineNum: number,
  lines: string[],
  index: number,
  result: FileAnalysis
): void {
  // Match type assertions: value as Type
  const assertionMatches = line.matchAll(/\bas\s+\w+/g);

  for (const match of assertionMatches) {
    // Check if there's a comment explaining the assertion
    const hasComment =
      line.includes('//') ||
      (index > 0 && lines[index - 1].trim().startsWith('//')) ||
      (index > 0 && lines[index - 1].trim().startsWith('/*'));

    if (!hasComment) {
      result.issues.push({
        file: result.file,
        line: lineNum,
        column: match.index!,
        type: 'type-assertion',
        severity: 'medium',
        code: line.trim(),
        message: 'Type assertion without explanatory comment',
        suggestion: 'Add comment explaining why the assertion is safe',
      });
    }
  }
}

function checkNonNullAssertions(
  line: string,
  lineNum: number,
  lines: string[],
  index: number,
  result: FileAnalysis
): void {
  // Match non-null assertions: value!
  const assertionMatches = line.matchAll(/\w+!/g);

  for (const match of assertionMatches) {
    // Exclude TypeScript syntax like PropertyKey!
    if (match[0].match(/^[A-Z]/)) continue;

    // Check for comment
    const hasComment =
      line.includes('//') ||
      (index > 0 && lines[index - 1].trim().startsWith('//')) ||
      (index > 0 && lines[index - 1].trim().startsWith('/*'));

    if (!hasComment) {
      result.issues.push({
        file: result.file,
        line: lineNum,
        column: match.index!,
        type: 'non-null-assertion',
        severity: 'medium',
        code: line.trim(),
        message: 'Non-null assertion (!) without justification',
        suggestion: 'Add comment or use optional chaining (?.) instead',
      });
    }
  }
}

function checkTsIgnore(
  line: string,
  lineNum: number,
  lines: string[],
  index: number,
  result: FileAnalysis
): void {
  const trimmed = line.trim();

  if (trimmed.startsWith('// @ts-ignore') || trimmed.startsWith('// @ts-expect-error')) {
    // Check if there's an explanation after the directive
    const hasExplanation = trimmed.length > trimmed.indexOf('@ts-') + 20;

    if (!hasExplanation) {
      result.issues.push({
        file: result.file,
        line: lineNum,
        column: 0,
        type: 'ts-ignore',
        severity: 'high',
        code: trimmed,
        message: `${trimmed.includes('ignore') ? '@ts-ignore' : '@ts-expect-error'} without explanation`,
        suggestion: 'Add explanation: // @ts-ignore: reason why this is necessary',
      });
    }
  }
}

function checkMissingReturnTypes(line: string, lineNum: number, result: FileAnalysis): void {
  // Match exported function declarations without return types
  const funcMatch = line.match(/export\s+(?:async\s+)?function\s+(\w+)\s*\([^)]*\)(?!\s*:\s*\w+)/);
  
  if (funcMatch) {
    // Check if return type is on next line or later (arrow functions)
    if (!line.includes(':')) {
      result.issues.push({
        file: result.file,
        line: lineNum,
        column: 0,
        type: 'missing-return-type',
        severity: 'medium',
        code: line.trim(),
        message: `Exported function '${funcMatch[1]}' missing explicit return type`,
        suggestion: 'Add return type annotation for better type inference',
      });
    }
  }

  // Match exported arrow functions without return types
  const arrowMatch = line.match(/export\s+const\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>(?!\s*\w+)/);
  
  if (arrowMatch && !line.includes(':') && !line.includes('{')) {
    result.issues.push({
      file: result.file,
      line: lineNum,
      column: 0,
      type: 'missing-return-type',
      severity: 'medium',
      code: line.trim(),
      message: `Exported arrow function '${arrowMatch[1]}' missing explicit return type`,
      suggestion: 'Add return type annotation for better type inference',
    });
  }
}

function checkUnknownWithoutNarrowing(
  line: string,
  lineNum: number,
  content: string,
  result: FileAnalysis
): void {
  // Check for unknown type declarations
  if (line.includes(': unknown') || line.includes('<unknown>')) {
    const variableMatch = line.match(/(\w+):\s*unknown/);
    if (!variableMatch) return;

    const varName = variableMatch[1];

    // Look ahead for type narrowing (typeof, instanceof, in, hasOwnProperty, etc.)
    const remainingContent = content.substring(content.indexOf(line));
    const nextLines = remainingContent.split('\n').slice(1, 10).join('\n');

    const hasTypeGuard =
      nextLines.includes(`typeof ${varName}`) ||
      nextLines.includes(`${varName} instanceof`) ||
      nextLines.includes(`'${varName}' in`) ||
      nextLines.includes(`${varName}.hasOwnProperty`) ||
      nextLines.includes(`is${varName[0].toUpperCase()}${varName.slice(1)}`) ||
      nextLines.match(new RegExp(`if\\s*\\(${varName}`));

    if (!hasTypeGuard) {
      result.issues.push({
        file: result.file,
        line: lineNum,
        column: 0,
        type: 'unknown-without-narrowing',
        severity: 'low',
        code: line.trim(),
        message: `Variable '${varName}' typed as unknown but no type narrowing detected`,
        suggestion: 'Add type guards (typeof, instanceof, etc.) before using',
      });
    }
  }
}

function generateReport(analyses: FileAnalysis[]): string {
  const now = new Date().toISOString();
  let report = `# Type Safety Audit Report\n\n`;
  report += `**Generated:** ${now}\n\n`;

  // Summary statistics
  const totalFiles = analyses.length;
  const totalIssues = analyses.reduce((sum, a) => sum + a.issues.length, 0);
  const avgScore = totalFiles > 0 
    ? (analyses.reduce((sum, a) => sum + a.typeSafetyScore, 0) / totalFiles).toFixed(1)
    : '0';

  const issuesBySeverity = {
    high: 0,
    medium: 0,
    low: 0,
  };

  const issuesByType = new Map<string, number>();

  for (const analysis of analyses) {
    for (const issue of analysis.issues) {
      issuesBySeverity[issue.severity]++;
      issuesByType.set(issue.type, (issuesByType.get(issue.type) || 0) + 1);
    }
  }

  report += `## Summary\n\n`;
  report += `- **Total Files Analyzed:** ${totalFiles}\n`;
  report += `- **Average Type Safety Score:** ${avgScore}/100\n`;
  report += `- **Total Issues:** ${totalIssues}\n`;
  report += `  - High Severity: ${issuesBySeverity.high}\n`;
  report += `  - Medium Severity: ${issuesBySeverity.medium}\n`;
  report += `  - Low Severity: ${issuesBySeverity.low}\n\n`;

  report += `### Issues by Type\n\n`;
  for (const [type, count] of Array.from(issuesByType.entries()).sort((a, b) => b[1] - a[1])) {
    report += `- **${type}:** ${count}\n`;
  }
  report += `\n`;

  // Files by score
  const sortedByScore = [...analyses].sort((a, b) => a.typeSafetyScore - b.typeSafetyScore);

  const failing = sortedByScore.filter(a => a.typeSafetyScore < 70);
  if (failing.length > 0) {
    report += `## Files Needing Attention (Score < 70)\n\n`;
    for (const analysis of failing) {
      report += `### ${relative(process.cwd(), analysis.file)} - Score: ${analysis.typeSafetyScore}\n\n`;
      report += `**Issues:** ${analysis.issues.length}\n\n`;

      // Group issues by severity
      const high = analysis.issues.filter(i => i.severity === 'high');
      const medium = analysis.issues.filter(i => i.severity === 'medium');
      const low = analysis.issues.filter(i => i.severity === 'low');

      if (high.length > 0) {
        report += `#### High Severity (${high.length})\n\n`;
        for (const issue of high.slice(0, 5)) {
          report += `- Line ${issue.line}: ${issue.message}\n`;
          report += `  \`\`\`typescript\n  ${issue.code}\n  \`\`\`\n`;
          report += `  **Suggestion:** ${issue.suggestion}\n\n`;
        }
        if (high.length > 5) {
          report += `  _...and ${high.length - 5} more high severity issue(s)_\n\n`;
        }
      }

      if (medium.length > 0) {
        report += `#### Medium Severity (${medium.length})\n\n`;
        for (const issue of medium.slice(0, 3)) {
          report += `- Line ${issue.line}: ${issue.message}\n`;
        }
        if (medium.length > 3) {
          report += `  _...and ${medium.length - 3} more_\n`;
        }
        report += `\n`;
      }

      if (low.length > 0) {
        report += `#### Low Severity (${low.length})\n\n`;
      }

      report += `---\n\n`;
    }
  }

  // Top performers
  const excellent = sortedByScore.filter(a => a.typeSafetyScore >= 95).reverse();
  if (excellent.length > 0) {
    report += `## Excellent Type Safety (Score ≥ 95)\n\n`;
    for (const analysis of excellent.slice(0, 10)) {
      report += `- ${relative(process.cwd(), analysis.file)} - **${analysis.typeSafetyScore}**/100\n`;
    }
    if (excellent.length > 10) {
      report += `\n_...and ${excellent.length - 10} more file(s)_\n`;
    }
    report += `\n`;
  }

  // Detailed issue breakdown
  report += `## All Issues by Severity\n\n`;

  for (const severity of ['high', 'medium', 'low'] as const) {
    const severityIssues = analyses.flatMap(a => 
      a.issues.filter(i => i.severity === severity)
    );

    if (severityIssues.length === 0) continue;

    report += `### ${severity.toUpperCase()} (${severityIssues.length})\n\n`;

    for (const issue of severityIssues.slice(0, 20)) {
      report += `- **${relative(process.cwd(), issue.file)}:${issue.line}**\n`;
      report += `  ${issue.message}\n`;
      report += `  \`${issue.code}\`\n\n`;
    }

    if (severityIssues.length > 20) {
      report += `_...and ${severityIssues.length - 20} more ${severity} severity issue(s)_\n\n`;
    }
  }

  // Recommendations
  report += `## Recommendations\n\n`;

  if (issuesBySeverity.high > 0) {
    report += `1. **Address ${issuesBySeverity.high} high-severity issue(s) immediately**\n`;
    report += `   - Replace \`any\` with specific types or \`unknown\`\n`;
    report += `   - Add explanations to all @ts-ignore directives\n\n`;
  }

  if (issuesByType.get('type-assertion')! > 0) {
    report += `2. **Review ${issuesByType.get('type-assertion')} type assertion(s)**\n`;
    report += `   - Add comments explaining why assertions are safe\n`;
    report += `   - Consider refactoring to avoid assertions\n\n`;
  }

  if (issuesByType.get('missing-return-type')! > 0) {
    report += `3. **Add return types to ${issuesByType.get('missing-return-type')} exported function(s)**\n`;
    report += `   - Improves type inference for consumers\n`;
    report += `   - Catches errors at compile time\n\n`;
  }

  if (parseFloat(avgScore) < 80) {
    report += `4. **Overall type safety score is ${avgScore}/100**\n`;
    report += `   - Enable strict mode in tsconfig.json\n`;
    report += `   - Set up pre-commit hooks to catch issues\n`;
    report += `   - Consider gradual adoption with per-file strict mode\n\n`;
  }

  return report;
}

async function main() {
  console.log('🔒 Starting type safety audit...\n');

  const files = findAllTypeScriptFiles(process.cwd());
  console.log(`Found ${files.length} TypeScript file(s)\n`);

  const analyses: FileAnalysis[] = [];

  for (const file of files) {
    const analysis = analyzeFile(file);
    analyses.push(analysis);

    const status = analysis.typeSafetyScore >= 90 ? '✓' : analysis.typeSafetyScore >= 70 ? '⚠' : '✗';
    console.log(`${status} ${relative(process.cwd(), file)}: ${analysis.typeSafetyScore}/100 (${analysis.issues.length} issues)`);
  }

  console.log('\nGenerating report...');
  const report = generateReport(analyses);

  const reportPath = join(process.cwd(), '_reports', 'engineering', 'type-safety.md');
  writeFileSync(reportPath, report, 'utf-8');

  const avgScore = analyses.length > 0 
    ? (analyses.reduce((sum, a) => sum + a.typeSafetyScore, 0) / analyses.length).toFixed(1)
    : '0';

  console.log(`\n✅ Report written to: ${reportPath}`);
  console.log(`\nAverage Type Safety Score: ${avgScore}/100`);
}

main().catch(console.error);
```

# Output

Report written to `_reports/engineering/type-safety.md` containing:
- Type safety score (0-100) per file and overall average
- Issues grouped by severity and type
- Files needing attention with detailed findings
- Top-performing files
- Actionable recommendations for improvement
