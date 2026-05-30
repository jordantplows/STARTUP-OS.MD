---
name: code-review
description: Reviews TypeScript code for common quality issues
version: 1.0.0
---

# What

Reviews recently changed TypeScript files for:
- Single Responsibility Principle violations
- Missing error handling
- Functions exceeding 40 lines
- Dead exports (exports not imported elsewhere)
- Missing JSDoc on exported functions/classes

# Instructions

1. Get list of recently changed files using `git diff --name-only HEAD~1 HEAD`
2. Filter for `.ts` files (excluding `.test.ts`)
3. Read each file (skip if >8000 characters)
4. Analyze code for violations:
   - SRP: Classes/functions doing multiple unrelated things
   - Error handling: try/catch blocks, error returns, validation
   - Function length: Count lines excluding comments/blank lines
   - Dead exports: Check if exported items are imported in other files
   - JSDoc: Check exported functions/classes have documentation
5. Generate structured report with findings
6. Write to `_reports/engineering/code-review.md`

# Code

```typescript
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

interface CodeIssue {
  file: string;
  line: number;
  type: 'srp' | 'error-handling' | 'long-function' | 'dead-export' | 'missing-docs';
  severity: 'high' | 'medium' | 'low';
  message: string;
  suggestion?: string;
}

interface FileAnalysis {
  file: string;
  issues: CodeIssue[];
  linesOfCode: number;
  skipped: boolean;
  skipReason?: string;
}

const MAX_FILE_SIZE = 8000;
const MAX_FUNCTION_LINES = 40;

function getChangedFiles(): string[] {
  try {
    const output = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf-8' });
    return output
      .split('\n')
      .filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts'))
      .map(f => f.trim())
      .filter(Boolean);
  } catch (error) {
    console.error('Failed to get changed files:', error);
    return [];
  }
}

function getAllTypeScriptFiles(dir: string, files: string[] = []): string[] {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
        getAllTypeScriptFiles(fullPath, files);
      } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore directories we can't read
  }
  return files;
}

function analyzeFile(filePath: string, allFiles: string[]): FileAnalysis {
  const result: FileAnalysis = {
    file: filePath,
    issues: [],
    linesOfCode: 0,
    skipped: false,
  };

  let content: string;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (error) {
    result.skipped = true;
    result.skipReason = 'Failed to read file';
    return result;
  }

  if (content.length > MAX_FILE_SIZE) {
    result.skipped = true;
    result.skipReason = `File exceeds ${MAX_FILE_SIZE} characters`;
    return result;
  }

  const lines = content.split('\n');
  result.linesOfCode = lines.length;

  // Check for missing error handling
  checkErrorHandling(lines, result);

  // Check for long functions
  checkFunctionLength(lines, result);

  // Check for missing JSDoc on exports
  checkMissingDocs(lines, result);

  // Check for dead exports
  checkDeadExports(filePath, lines, allFiles, result);

  // Check for SRP violations (heuristic-based)
  checkSRP(lines, result);

  return result;
}

function checkErrorHandling(lines: string[], result: FileAnalysis): void {
  const functionStarts: { line: number; name: string; hasTryCatch: boolean }[] = [];
  let currentFunction: typeof functionStarts[0] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect function declarations
    const funcMatch = trimmed.match(/(?:export\s+)?(?:async\s+)?function\s+(\w+)|(?:const|let)\s+(\w+)\s*=\s*(?:async\s+)?\(/);
    if (funcMatch) {
      if (currentFunction && !currentFunction.hasTryCatch) {
        // Check if function has async, fetch, or throws
        const funcSlice = lines.slice(currentFunction.line, i).join('\n');
        if (funcSlice.includes('async') || funcSlice.includes('fetch') || funcSlice.includes('throw')) {
          result.issues.push({
            file: result.file,
            line: currentFunction.line + 1,
            type: 'error-handling',
            severity: 'medium',
            message: `Function '${currentFunction.name}' may throw but lacks try/catch block`,
            suggestion: 'Add try/catch or document error conditions',
          });
        }
      }

      currentFunction = {
        line: i,
        name: funcMatch[1] || funcMatch[2],
        hasTryCatch: false,
      };
      functionStarts.push(currentFunction);
    }

    if (currentFunction && trimmed.startsWith('try')) {
      currentFunction.hasTryCatch = true;
    }
  }
}

function checkFunctionLength(lines: string[], result: FileAnalysis): void {
  let currentFunction: { line: number; name: string; startBrace: number } | null = null;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect function start
    const funcMatch = trimmed.match(/(?:export\s+)?(?:async\s+)?function\s+(\w+)|(?:const|let)\s+(\w+)\s*=\s*(?:async\s+)?\(/);
    if (funcMatch && (trimmed.includes('{') || lines[i + 1]?.includes('{'))) {
      currentFunction = {
        line: i,
        name: funcMatch[1] || funcMatch[2],
        startBrace: i,
      };
      braceDepth = 0;
    }

    if (currentFunction) {
      braceDepth += (line.match(/{/g) || []).length;
      braceDepth -= (line.match(/}/g) || []).length;

      if (braceDepth === 0 && line.includes('}')) {
        const functionLines = i - currentFunction.line;
        const codeLines = lines
          .slice(currentFunction.line, i + 1)
          .filter(l => {
            const t = l.trim();
            return t && !t.startsWith('//') && !t.startsWith('/*') && !t.startsWith('*');
          }).length;

        if (codeLines > MAX_FUNCTION_LINES) {
          result.issues.push({
            file: result.file,
            line: currentFunction.line + 1,
            type: 'long-function',
            severity: 'medium',
            message: `Function '${currentFunction.name}' is ${codeLines} lines (max: ${MAX_FUNCTION_LINES})`,
            suggestion: 'Consider breaking into smaller functions',
          });
        }

        currentFunction = null;
      }
    }
  }
}

function checkMissingDocs(lines: string[], result: FileAnalysis): void {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('export') && (line.includes('function') || line.includes('class'))) {
      // Look for JSDoc in previous lines
      let hasJsDoc = false;
      for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
        const prevLine = lines[j].trim();
        if (prevLine.startsWith('/**')) {
          hasJsDoc = true;
          break;
        }
        if (prevLine && !prevLine.startsWith('//') && !prevLine.startsWith('*')) {
          break;
        }
      }

      if (!hasJsDoc) {
        const match = line.match(/(?:function|class)\s+(\w+)/);
        const name = match ? match[1] : 'exported item';
        result.issues.push({
          file: result.file,
          line: i + 1,
          type: 'missing-docs',
          severity: 'low',
          message: `Exported ${line.includes('class') ? 'class' : 'function'} '${name}' lacks JSDoc`,
          suggestion: 'Add JSDoc comment describing purpose and parameters',
        });
      }
    }
  }
}

function checkDeadExports(filePath: string, lines: string[], allFiles: string[], result: FileAnalysis): void {
  const exports: string[] = [];

  for (const line of lines) {
    const exportMatch = line.match(/export\s+(?:async\s+)?(?:function|class|const|let|type|interface)\s+(\w+)/);
    if (exportMatch) {
      exports.push(exportMatch[1]);
    }
  }

  for (const exportName of exports) {
    let isImported = false;

    for (const otherFile of allFiles) {
      if (otherFile === filePath) continue;

      try {
        const otherContent = readFileSync(otherFile, 'utf-8');
        const importRegex = new RegExp(`import\\s+.*\\b${exportName}\\b.*from`);
        if (importRegex.test(otherContent)) {
          isImported = true;
          break;
        }
      } catch {
        // Skip files we can't read
      }
    }

    if (!isImported) {
      const lineNum = lines.findIndex(l => l.includes(`export`) && l.includes(exportName)) + 1;
      result.issues.push({
        file: result.file,
        line: lineNum,
        type: 'dead-export',
        severity: 'low',
        message: `Export '${exportName}' is not imported in any other file`,
        suggestion: 'Remove if unused or convert to internal function',
      });
    }
  }
}

function checkSRP(lines: string[], result: FileAnalysis): void {
  // Heuristic: classes with many methods or files with many exports
  const classMatch = lines.join('\n').match(/class\s+(\w+)/g);
  if (classMatch && classMatch.length > 0) {
    for (const cls of classMatch) {
      const className = cls.replace('class ', '');
      const classStart = lines.findIndex(l => l.includes(cls));
      const methodCount = lines.slice(classStart).filter(l => 
        l.trim().match(/^\w+\s*\(/) || l.trim().match(/^(?:public|private|protected)\s+\w+\s*\(/)
      ).length;

      if (methodCount > 10) {
        result.issues.push({
          file: result.file,
          line: classStart + 1,
          type: 'srp',
          severity: 'medium',
          message: `Class '${className}' has ${methodCount} methods - may violate SRP`,
          suggestion: 'Consider splitting into smaller, focused classes',
        });
      }
    }
  }

  // Check for files with too many exports
  const exportCount = lines.filter(l => l.includes('export')).length;
  if (exportCount > 15) {
    result.issues.push({
      file: result.file,
      line: 1,
      type: 'srp',
      severity: 'low',
      message: `File has ${exportCount} exports - may lack cohesion`,
      suggestion: 'Consider splitting into multiple files by responsibility',
    });
  }
}

function generateReport(analyses: FileAnalysis[]): string {
  const now = new Date().toISOString();
  let report = `# Code Review Report\n\n`;
  report += `**Generated:** ${now}\n\n`;

  const totalFiles = analyses.length;
  const skippedFiles = analyses.filter(a => a.skipped).length;
  const analyzedFiles = totalFiles - skippedFiles;
  const totalIssues = analyses.reduce((sum, a) => sum + a.issues.length, 0);

  report += `## Summary\n\n`;
  report += `- **Total Files:** ${totalFiles}\n`;
  report += `- **Analyzed:** ${analyzedFiles}\n`;
  report += `- **Skipped:** ${skippedFiles}\n`;
  report += `- **Total Issues:** ${totalIssues}\n\n`;

  // Group by severity
  const issuesBySeverity = {
    high: [] as CodeIssue[],
    medium: [] as CodeIssue[],
    low: [] as CodeIssue[],
  };

  for (const analysis of analyses) {
    for (const issue of analysis.issues) {
      issuesBySeverity[issue.severity].push(issue);
    }
  }

  report += `### Issues by Severity\n\n`;
  report += `- **High:** ${issuesBySeverity.high.length}\n`;
  report += `- **Medium:** ${issuesBySeverity.medium.length}\n`;
  report += `- **Low:** ${issuesBySeverity.low.length}\n\n`;

  // Group by type
  const issuesByType = new Map<string, CodeIssue[]>();
  for (const analysis of analyses) {
    for (const issue of analysis.issues) {
      if (!issuesByType.has(issue.type)) {
        issuesByType.set(issue.type, []);
      }
      issuesByType.get(issue.type)!.push(issue);
    }
  }

  report += `### Issues by Type\n\n`;
  for (const [type, issues] of issuesByType) {
    report += `- **${type}:** ${issues.length}\n`;
  }
  report += `\n`;

  // Detailed findings
  report += `## Detailed Findings\n\n`;

  for (const severity of ['high', 'medium', 'low'] as const) {
    const issues = issuesBySeverity[severity];
    if (issues.length === 0) continue;

    report += `### ${severity.toUpperCase()} Severity\n\n`;

    for (const issue of issues) {
      report += `#### ${relative(process.cwd(), issue.file)}:${issue.line}\n\n`;
      report += `**Type:** ${issue.type}\n\n`;
      report += `**Issue:** ${issue.message}\n\n`;
      if (issue.suggestion) {
        report += `**Suggestion:** ${issue.suggestion}\n\n`;
      }
      report += `---\n\n`;
    }
  }

  // Skipped files
  if (skippedFiles > 0) {
    report += `## Skipped Files\n\n`;
    for (const analysis of analyses.filter(a => a.skipped)) {
      report += `- ${relative(process.cwd(), analysis.file)}: ${analysis.skipReason}\n`;
    }
  }

  return report;
}

async function main() {
  console.log('🔍 Starting code review...\n');

  const changedFiles = getChangedFiles();
  
  if (changedFiles.length === 0) {
    console.log('No TypeScript files changed in last commit.');
    return;
  }

  console.log(`Found ${changedFiles.length} changed TypeScript file(s)\n`);

  // Get all TypeScript files for dead export checking
  const allFiles = getAllTypeScriptFiles(process.cwd());
  
  const analyses: FileAnalysis[] = [];
  
  for (const file of changedFiles) {
    console.log(`Analyzing: ${relative(process.cwd(), file)}`);
    const analysis = analyzeFile(file, allFiles);
    analyses.push(analysis);
    
    if (analysis.skipped) {
      console.log(`  ⚠️  Skipped: ${analysis.skipReason}`);
    } else {
      console.log(`  ✓ Found ${analysis.issues.length} issue(s)`);
    }
  }

  console.log('\nGenerating report...');
  const report = generateReport(analyses);

  const reportPath = join(process.cwd(), '_reports', 'engineering', 'code-review.md');
  writeFileSync(reportPath, report, 'utf-8');

  console.log(`\n✅ Report written to: ${reportPath}`);
  console.log(`\nTotal issues found: ${analyses.reduce((sum, a) => sum + a.issues.length, 0)}`);
}

main().catch(console.error);
```

# Output

Report written to `_reports/engineering/code-review.md` containing:
- Summary statistics
- Issues grouped by severity and type
- Detailed findings with file locations
- Suggestions for each issue
- List of skipped files
