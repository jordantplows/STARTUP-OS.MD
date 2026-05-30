---
name: performance
description: Benchmarks agent performance and analyzes efficiency
version: 1.0.0
---

# What

Benchmarks agent performance by:
- Reading all `.md` agent files
- Extracting TypeScript code blocks
- Measuring parse time for each
- Checking no single agent exceeds 500 lines
- Flagging agents making >5 sequential API calls without batching
- Identifying performance bottlenecks

# Instructions

1. Find all `.md` files in the project (agent definitions)
2. For each file:
   - Extract TypeScript code blocks
   - Measure parse/execution time
   - Count lines of code
   - Analyze for sequential API calls
   - Check for performance anti-patterns
3. Calculate performance metrics
4. Generate baseline report
5. Write to `_reports/engineering/perf-baseline.md`

# Code

```typescript
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

interface AgentPerformance {
  file: string;
  name: string;
  linesOfCode: number;
  codeBlocks: number;
  parseTimeMs: number;
  sequentialAPICalls: number;
  issues: PerformanceIssue[];
  score: number;
}

interface PerformanceIssue {
  type:
    | 'too-long'
    | 'sequential-api-calls'
    | 'missing-error-handling'
    | 'inefficient-loop'
    | 'missing-caching'
    | 'blocking-io';
  severity: 'high' | 'medium' | 'low';
  line?: number;
  message: string;
  suggestion: string;
}

interface BenchmarkResult {
  totalAgents: number;
  totalLinesOfCode: number;
  avgParseTime: number;
  maxParseTime: number;
  agents: AgentPerformance[];
  performanceIssues: number;
}

function findAgentFiles(dir: string, files: string[] = []): string[] {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry.startsWith('.') || entry === 'node_modules' || entry.startsWith('_')) {
        continue;
      }

      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        findAgentFiles(fullPath, files);
      } else if (entry.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore directories we can't read
  }
  return files;
}

function extractCodeBlocks(content: string): { code: string; language: string; startLine: number }[] {
  const blocks: { code: string; language: string; startLine: number }[] = [];
  const lines = content.split('\n');

  let inBlock = false;
  let currentBlock: string[] = [];
  let currentLanguage = '';
  let blockStartLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (!inBlock) {
        inBlock = true;
        currentLanguage = line.substring(3).trim();
        blockStartLine = i + 1;
        currentBlock = [];
      } else {
        inBlock = false;
        blocks.push({
          code: currentBlock.join('\n'),
          language: currentLanguage,
          startLine: blockStartLine,
        });
        currentBlock = [];
      }
    } else if (inBlock) {
      currentBlock.push(line);
    }
  }

  return blocks;
}

function extractAgentName(content: string): string {
  // Try to extract from YAML frontmatter
  const nameMatch = content.match(/^name:\s*(.+)$/m);
  if (nameMatch) {
    return nameMatch[1].trim();
  }

  // Fall back to first heading
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  return 'Unknown';
}

function analyzeAgent(filePath: string): AgentPerformance {
  const result: AgentPerformance = {
    file: filePath,
    name: '',
    linesOfCode: 0,
    codeBlocks: 0,
    parseTimeMs: 0,
    sequentialAPICalls: 0,
    issues: [],
    score: 100,
  };

  let content: string;
  const startTime = performance.now();

  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (error) {
    result.issues.push({
      type: 'blocking-io',
      severity: 'high',
      message: 'Failed to read file',
      suggestion: 'Check file permissions',
    });
    return result;
  }

  result.parseTimeMs = performance.now() - startTime;

  result.name = extractAgentName(content);

  const codeBlocks = extractCodeBlocks(content);
  result.codeBlocks = codeBlocks.length;

  // Analyze TypeScript code blocks
  for (const block of codeBlocks) {
    if (block.language === 'typescript' || block.language === 'ts') {
      const lines = block.code.split('\n');
      result.linesOfCode += lines.length;

      // Check for performance issues
      analyzeCodeBlock(block.code, block.startLine, result);
    }
  }

  // Check if agent is too long
  if (result.linesOfCode > 500) {
    result.issues.push({
      type: 'too-long',
      severity: 'high',
      message: `Agent has ${result.linesOfCode} lines (max: 500)`,
      suggestion: 'Split into smaller, focused agents',
    });
  }

  // Calculate performance score
  result.score = calculateScore(result);

  return result;
}

function analyzeCodeBlock(code: string, startLine: number, result: AgentPerformance): void {
  const lines = code.split('\n');

  // Check for sequential API calls
  const apiCallPatterns = [
    /await\s+fetch\(/,
    /await\s+\w+\.get\(/,
    /await\s+\w+\.post\(/,
    /execSync\(/,
    /readFileSync\(/,
  ];

  let sequentialCalls = 0;
  let lastApiCallLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for API calls
    for (const pattern of apiCallPatterns) {
      if (pattern.test(line)) {
        if (lastApiCallLine >= 0 && i - lastApiCallLine < 3) {
          sequentialCalls++;
        }
        lastApiCallLine = i;
        break;
      }
    }

    // Check for inefficient loops
    if (line.includes('for (') || line.includes('while (')) {
      const loopContent = lines.slice(i, Math.min(i + 20, lines.length)).join('\n');
      
      if (loopContent.includes('readFileSync') || loopContent.includes('writeFileSync')) {
        result.issues.push({
          type: 'blocking-io',
          severity: 'medium',
          line: startLine + i,
          message: 'Synchronous I/O in loop',
          suggestion: 'Use async I/O or batch operations',
        });
      }

      if (loopContent.match(/\.push\(/g)?.length > 10) {
        result.issues.push({
          type: 'inefficient-loop',
          severity: 'low',
          line: startLine + i,
          message: 'Many array push operations in loop',
          suggestion: 'Pre-allocate array or use map/reduce',
        });
      }
    }

    // Check for missing caching
    if (line.includes('readFileSync') || line.includes('execSync')) {
      const funcContext = lines.slice(Math.max(0, i - 10), i + 10).join('\n');
      
      if (funcContext.includes('for (') && !funcContext.includes('cache') && !funcContext.includes('memo')) {
        result.issues.push({
          type: 'missing-caching',
          severity: 'low',
          line: startLine + i,
          message: 'Repeated expensive operation without caching',
          suggestion: 'Add caching layer for repeated reads',
        });
      }
    }

    // Check for missing error handling on I/O
    if ((line.includes('readFileSync') || line.includes('writeFileSync')) && !line.includes('try')) {
      const hasErrorHandling = lines.slice(Math.max(0, i - 5), i).some(l => l.includes('try'));
      
      if (!hasErrorHandling) {
        result.issues.push({
          type: 'missing-error-handling',
          severity: 'medium',
          line: startLine + i,
          message: 'I/O operation without error handling',
          suggestion: 'Wrap in try/catch block',
        });
      }
    }
  }

  result.sequentialAPICalls += sequentialCalls;

  if (sequentialCalls > 5) {
    result.issues.push({
      type: 'sequential-api-calls',
      severity: 'high',
      message: `${sequentialCalls} sequential API calls detected`,
      suggestion: 'Use Promise.all() or Promise.allSettled() to batch calls',
    });
  }
}

function calculateScore(agent: AgentPerformance): number {
  let score = 100;

  // Deduct for issues
  for (const issue of agent.issues) {
    switch (issue.severity) {
      case 'high':
        score -= 15;
        break;
      case 'medium':
        score -= 8;
        break;
      case 'low':
        score -= 3;
        break;
    }
  }

  // Bonus for reasonable size
  if (agent.linesOfCode < 300 && agent.linesOfCode > 50) {
    score += 5;
  }

  // Bonus for fast parse time
  if (agent.parseTimeMs < 10) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

function generateReport(benchmark: BenchmarkResult): string {
  const now = new Date().toISOString();
  let report = `# Agent Performance Baseline Report\n\n`;
  report += `**Generated:** ${now}\n\n`;

  // Summary
  report += `## Summary\n\n`;
  report += `- **Total Agents:** ${benchmark.totalAgents}\n`;
  report += `- **Total Lines of Code:** ${benchmark.totalLinesOfCode.toLocaleString()}\n`;
  report += `- **Average Parse Time:** ${benchmark.avgParseTime.toFixed(2)}ms\n`;
  report += `- **Max Parse Time:** ${benchmark.maxParseTime.toFixed(2)}ms\n`;
  report += `- **Performance Issues:** ${benchmark.performanceIssues}\n`;
  report += `- **Average Score:** ${(benchmark.agents.reduce((sum, a) => sum + a.score, 0) / benchmark.totalAgents).toFixed(1)}/100\n\n`;

  // Agent size distribution
  const small = benchmark.agents.filter(a => a.linesOfCode < 200).length;
  const medium = benchmark.agents.filter(a => a.linesOfCode >= 200 && a.linesOfCode < 400).length;
  const large = benchmark.agents.filter(a => a.linesOfCode >= 400 && a.linesOfCode < 500).length;
  const tooLarge = benchmark.agents.filter(a => a.linesOfCode >= 500).length;

  report += `## Agent Size Distribution\n\n`;
  report += `- **Small (<200 lines):** ${small}\n`;
  report += `- **Medium (200-399 lines):** ${medium}\n`;
  report += `- **Large (400-499 lines):** ${large}\n`;
  report += `- **Too Large (≥500 lines):** ${tooLarge}\n\n`;

  // Performance issues by type
  const issuesByType = new Map<string, number>();
  for (const agent of benchmark.agents) {
    for (const issue of agent.issues) {
      issuesByType.set(issue.type, (issuesByType.get(issue.type) || 0) + 1);
    }
  }

  if (issuesByType.size > 0) {
    report += `## Issues by Type\n\n`;
    for (const [type, count] of Array.from(issuesByType.entries()).sort((a, b) => b[1] - a[1])) {
      report += `- **${type}:** ${count}\n`;
    }
    report += `\n`;
  }

  // Top performers
  const topPerformers = [...benchmark.agents]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (topPerformers.length > 0) {
    report += `## Top Performing Agents\n\n`;
    for (const agent of topPerformers) {
      report += `### ${agent.name} - Score: ${agent.score}/100\n\n`;
      report += `- **File:** ${relative(process.cwd(), agent.file)}\n`;
      report += `- **Lines:** ${agent.linesOfCode}\n`;
      report += `- **Parse Time:** ${agent.parseTimeMs.toFixed(2)}ms\n`;
      report += `- **Issues:** ${agent.issues.length}\n\n`;
    }
  }

  // Agents needing optimization
  const needsOptimization = benchmark.agents
    .filter(a => a.issues.length > 0)
    .sort((a, b) => b.issues.length - a.issues.length);

  if (needsOptimization.length > 0) {
    report += `## Agents Needing Optimization\n\n`;

    for (const agent of needsOptimization) {
      report += `### ${agent.name} - Score: ${agent.score}/100\n\n`;
      report += `**File:** ${relative(process.cwd(), agent.file)}\n\n`;
      report += `**Stats:**\n`;
      report += `- Lines of Code: ${agent.linesOfCode}\n`;
      report += `- Parse Time: ${agent.parseTimeMs.toFixed(2)}ms\n`;
      report += `- Sequential API Calls: ${agent.sequentialAPICalls}\n`;
      report += `- Issues: ${agent.issues.length}\n\n`;

      if (agent.issues.length > 0) {
        report += `**Issues:**\n\n`;

        // Group by severity
        const high = agent.issues.filter(i => i.severity === 'high');
        const medium = agent.issues.filter(i => i.severity === 'medium');
        const low = agent.issues.filter(i => i.severity === 'low');

        if (high.length > 0) {
          report += `#### High Severity\n\n`;
          for (const issue of high) {
            report += `- ${issue.message}\n`;
            report += `  - **Suggestion:** ${issue.suggestion}\n`;
            if (issue.line) report += `  - **Line:** ${issue.line}\n`;
            report += `\n`;
          }
        }

        if (medium.length > 0) {
          report += `#### Medium Severity\n\n`;
          for (const issue of medium) {
            report += `- ${issue.message}\n`;
            report += `  - **Suggestion:** ${issue.suggestion}\n`;
            if (issue.line) report += `  - **Line:** ${issue.line}\n`;
            report += `\n`;
          }
        }

        if (low.length > 0) {
          report += `#### Low Severity\n\n`;
          for (const issue of low.slice(0, 3)) {
            report += `- ${issue.message}\n`;
          }
          if (low.length > 3) {
            report += `\n_...and ${low.length - 3} more low severity issue(s)_\n`;
          }
          report += `\n`;
        }
      }

      report += `---\n\n`;
    }
  }

  // Recommendations
  report += `## Recommendations\n\n`;

  if (tooLarge > 0) {
    report += `1. **Refactor ${tooLarge} large agent(s)**\n`;
    report += `   - Split agents over 500 lines into smaller, focused units\n`;
    report += `   - Extract common functionality into shared modules\n\n`;
  }

  const hasSequentialCalls = benchmark.agents.filter(a => a.sequentialAPICalls > 5).length;
  if (hasSequentialCalls > 0) {
    report += `2. **Optimize ${hasSequentialCalls} agent(s) with sequential API calls**\n`;
    report += `   - Use Promise.all() to batch concurrent operations\n`;
    report += `   - Implement request queuing for rate-limited APIs\n\n`;
  }

  const hasBlockingIO = benchmark.agents.filter(a => a.issues.some(i => i.type === 'blocking-io')).length;
  if (hasBlockingIO > 0) {
    report += `3. **Replace blocking I/O in ${hasBlockingIO} agent(s)**\n`;
    report += `   - Use async/await with fs.promises\n`;
    report += `   - Implement streaming for large files\n\n`;
  }

  const hasMissingCache = benchmark.agents.filter(a => a.issues.some(i => i.type === 'missing-caching')).length;
  if (hasMissingCache > 0) {
    report += `4. **Add caching to ${hasMissingCache} agent(s)**\n`;
    report += `   - Cache repeated file reads\n`;
    report += `   - Use memoization for expensive computations\n\n`;
  }

  report += `## Performance Targets\n\n`;
  report += `- **Agent Size:** <400 lines of code\n`;
  report += `- **Parse Time:** <50ms per agent\n`;
  report += `- **Sequential API Calls:** ≤3 per operation\n`;
  report += `- **Score:** ≥80/100\n\n`;

  report += `## Next Steps\n\n`;
  report += `1. Address high-severity performance issues\n`;
  report += `2. Refactor agents exceeding 500 lines\n`;
  report += `3. Implement batching for API calls\n`;
  report += `4. Add performance tests to CI/CD\n`;
  report += `5. Re-run this benchmark after optimizations\n`;

  return report;
}

async function main() {
  console.log('⚡ Starting agent performance benchmark...\n');

  const agentFiles = findAgentFiles(process.cwd());
  console.log(`Found ${agentFiles.length} agent file(s)\n`);

  const agents: AgentPerformance[] = [];

  for (const file of agentFiles) {
    const analysis = analyzeAgent(file);
    agents.push(analysis);

    const status = analysis.score >= 80 ? '✓' : analysis.score >= 60 ? '⚠' : '✗';
    console.log(
      `${status} ${analysis.name} (${relative(process.cwd(), file)}): ` +
      `${analysis.linesOfCode} LOC, ${analysis.parseTimeMs.toFixed(1)}ms, ` +
      `score ${analysis.score}/100`
    );
  }

  const benchmark: BenchmarkResult = {
    totalAgents: agents.length,
    totalLinesOfCode: agents.reduce((sum, a) => sum + a.linesOfCode, 0),
    avgParseTime: agents.reduce((sum, a) => sum + a.parseTimeMs, 0) / agents.length,
    maxParseTime: Math.max(...agents.map(a => a.parseTimeMs)),
    agents,
    performanceIssues: agents.reduce((sum, a) => sum + a.issues.length, 0),
  };

  console.log('\nGenerating baseline report...');
  const report = generateReport(benchmark);

  const reportPath = join(process.cwd(), '_reports', 'engineering', 'perf-baseline.md');
  writeFileSync(reportPath, report, 'utf-8');

  console.log(`\n✅ Report written to: ${reportPath}`);
  console.log(`\nAverage Score: ${(agents.reduce((sum, a) => sum + a.score, 0) / agents.length).toFixed(1)}/100`);
  console.log(`Performance Issues: ${benchmark.performanceIssues}`);
}

main().catch(console.error);
```

# Output

Report written to `_reports/engineering/perf-baseline.md` containing:
- Performance baseline metrics
- Agent size distribution
- Parse times and efficiency scores
- Sequential API call analysis
- Top performing agents
- Agents needing optimization with specific issues
- Actionable recommendations
- Performance targets for future benchmarking
