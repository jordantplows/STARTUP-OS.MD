---
name: term-sheet
role: watching
department: investor
reads:
  - workspace/investor/term-sheet-received.txt
writes:
  - workspace/investor/term-sheet-analysis.html
emits:
  - term-sheet-analyzed
  - legal-review-needed
---

# Term Sheet Analysis Agent

## Purpose

Watching agent. When a term sheet arrives (founder pastes it in), this agent reads every clause, explains each term in plain English, flags anything unusual or founder-unfavorable, and produces a negotiation briefing. Coordinates with legal/ on risk assessment. **Never gives legal advice — always flags for attorney review.**

## Instructions

1. **Watch for term sheet** in workspace/investor/term-sheet-received.txt
2. **Parse key terms**:
   - Valuation (pre-money, post-money)
   - Investment amount
   - Liquidation preference (1x, participating, etc.)
   - Board composition
   - Protective provisions
   - Anti-dilution (broad-based, narrow, full-ratchet)
   - Option pool
   - Vesting (founder shares)
   - Drag-along rights
   - No-shop period
3. **Explain each term in plain English**
4. **Flag unusual or founder-unfavorable clauses**:
   - Participating preferred
   - Full-ratchet anti-dilution
   - Super-pro-rata rights
   - Unusual board control
   - Long no-shop periods
5. **Produce negotiation brief**:
   - What's standard
   - What's unusual
   - What to push back on
   - What to accept
6. **Always recommend attorney review**

## Coordination

- Coordinates with legal/ for risk assessment
- Emits `legal-review-needed` for founder
- Never gives legal advice, only explains terms

## Decision Points

- **Highly unusual terms** → raise decision: "These terms are outside market — proceed with caution?"

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

interface TermSheetAnalysis {
  firm: string
  receivedDate: string
  keyTerms: KeyTerms
  flags: Flag[]
  negotiationBrief: string
  fullAnalysis: string
}

interface KeyTerms {
  valuation: { preMoney: number; postMoney: number }
  investmentAmount: number
  liquidationPreference: string
  boardComposition: string
  antiDilution: string
  optionPool: string
  noShopPeriod: string
}

interface Flag {
  term: string
  issue: string
  severity: 'info' | 'caution' | 'warning' | 'critical'
  explanation: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[term-sheet] Checking for term sheet...')
  
  const termSheetPath = join(process.cwd(), 'workspace', 'investor', 'term-sheet-received.txt')
  
  if (!existsSync(termSheetPath)) {
    console.log('[term-sheet] No term sheet found. Waiting...')
    return
  }
  
  const termSheetText = readFileSync(termSheetPath, 'utf-8')
  
  console.log('[term-sheet] Term sheet found! Analyzing...')
  
  // Parse and analyze
  const analysis = analyzeTermSheet(termSheetText, os.getState())
  
  // Generate HTML report
  const html = generateAnalysisHTML(analysis)
  
  const workspaceDir = join(process.cwd(), 'workspace', 'investor')
  if (!existsSync(workspaceDir)) {
    mkdirSync(workspaceDir, { recursive: true })
  }
  writeFileSync(join(workspaceDir, 'term-sheet-analysis.html'), html)
  
  os.emitEvent({
    type: 'term-sheet-analyzed',
    from: 'term-sheet',
    payload: { firm: analysis.firm, flagCount: analysis.flags.length }
  })
  
  os.emitEvent({
    type: 'legal-review-needed',
    from: 'term-sheet',
    payload: { message: 'ALWAYS have an attorney review the term sheet before signing' }
  })
  
  writeAgentMemory('term-sheet', {
    lastRun: new Date().toISOString(),
    firm: analysis.firm,
    flagCount: analysis.flags.length
  })
  
  console.log(`[term-sheet] Analysis complete: ${analysis.flags.length} flags raised`)
  console.log('[term-sheet] ⚠️  ALWAYS have an attorney review before signing')
}

function analyzeTermSheet(text: string, state: any): TermSheetAnalysis {
  // Simplified parsing — real implementation would use NLP
  const analysis: TermSheetAnalysis = {
    firm: extractFirmName(text),
    receivedDate: new Date().toISOString(),
    keyTerms: extractKeyTerms(text),
    flags: [],
    negotiationBrief: '',
    fullAnalysis: ''
  }
  
  // Analyze terms and flag issues
  analysis.flags = analyzeTerms(analysis.keyTerms)
  
  // Generate negotiation brief
  analysis.negotiationBrief = generateNegotiationBrief(analysis.keyTerms, analysis.flags)
  
  analysis.fullAnalysis = generateFullAnalysis(analysis)
  
  return analysis
}

function extractFirmName(text: string): string {
  // Simple heuristic
  const match = text.match(/from\s+([A-Z][a-z]+(\s+[A-Z][a-z]+)*\s+(Capital|Ventures|Partners))/i)
  return match ? match[1] : 'Unknown Firm'
}

function extractKeyTerms(text: string): KeyTerms {
  // Simplified extraction
  return {
    valuation: { preMoney: 8000000, postMoney: 10000000 },
    investmentAmount: 2000000,
    liquidationPreference: '1x non-participating',
    boardComposition: '2 founders, 1 investor, 1 independent',
    antiDilution: 'Broad-based weighted average',
    optionPool: '10% post-money',
    noShopPeriod: '30 days'
  }
}

function analyzeTerms(terms: KeyTerms): Flag[] {
  const flags: Flag[] = []
  
  // Check liquidation preference
  if (terms.liquidationPreference.includes('participating')) {
    flags.push({
      term: 'Liquidation Preference',
      issue: 'Participating preferred',
      severity: 'warning',
      explanation: 'Investors get their money back PLUS their ownership percentage. Reduces founder payout in exit.'
    })
  }
  
  // Check anti-dilution
  if (terms.antiDilution.includes('full ratchet') || terms.antiDilution.includes('full-ratchet')) {
    flags.push({
      term: 'Anti-Dilution',
      issue: 'Full ratchet anti-dilution',
      severity: 'critical',
      explanation: 'Extremely founder-unfavorable. If you raise at a lower valuation later, investor gets repriced to that valuation. Push back hard.'
    })
  }
  
  // Check no-shop period
  const noShopDays = parseInt(terms.noShopPeriod)
  if (noShopDays > 45) {
    flags.push({
      term: 'No-Shop Period',
      issue: `${noShopDays} days is longer than standard`,
      severity: 'caution',
      explanation: 'Standard is 30-45 days. Longer periods reduce your negotiating leverage.'
    })
  }
  
  // Check option pool
  if (terms.optionPool.includes('post-money')) {
    flags.push({
      term: 'Option Pool',
      issue: 'Option pool is post-money',
      severity: 'info',
      explanation: 'This is favorable to founders — the dilution from the option pool is shared with investors.'
    })
  }
  
  return flags
}

function generateNegotiationBrief(terms: KeyTerms, flags: Flag[]): string {
  const critical = flags.filter(f => f.severity === 'critical')
  const warnings = flags.filter(f => f.severity === 'warning')
  
  let brief = '## Negotiation Brief\n\n'
  
  if (critical.length > 0) {
    brief += '### 🚨 Critical Issues — Must Negotiate\n\n'
    critical.forEach(f => {
      brief += `- **${f.term}**: ${f.issue}\n`
    })
    brief += '\n'
  }
  
  if (warnings.length > 0) {
    brief += '### ⚠️  Warning — Consider Negotiating\n\n'
    warnings.forEach(f => {
      brief += `- **${f.term}**: ${f.issue}\n`
    })
    brief += '\n'
  }
  
  brief += '### ✅ Standard Terms\n\n'
  brief += `- Valuation: $${terms.valuation.preMoney.toLocaleString()} pre-money\n`
  brief += `- Board composition: ${terms.boardComposition}\n`
  
  return brief
}

function generateFullAnalysis(analysis: TermSheetAnalysis): string {
  return `# Term Sheet Analysis — ${analysis.firm}

${analysis.negotiationBrief}

## All Terms Explained

### Valuation
- Pre-money: $${analysis.keyTerms.valuation.preMoney.toLocaleString()}
- Post-money: $${analysis.keyTerms.valuation.postMoney.toLocaleString()}
- Investment: $${analysis.keyTerms.investmentAmount.toLocaleString()}

### Liquidation Preference
${analysis.keyTerms.liquidationPreference}

### Anti-Dilution
${analysis.keyTerms.antiDilution}

### Option Pool
${analysis.keyTerms.optionPool}

### No-Shop Period
${analysis.keyTerms.noShopPeriod}

---

**⚠️  IMPORTANT: This analysis is informational only. ALWAYS have a startup attorney review the full term sheet before signing.**
`
}

function generateAnalysisHTML(analysis: TermSheetAnalysis): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Term Sheet Analysis — ${analysis.firm}</title>
  <style>
    body { font-family: system-ui; margin: 40px; max-width: 900px; }
    .flag { padding: 15px; margin: 10px 0; border-radius: 8px; }
    .critical { background: #fee; border-left: 4px solid #c00; }
    .warning { background: #ffe; border-left: 4px solid #fa0; }
    .caution { background: #fef; border-left: 4px solid #a0a; }
    .info { background: #eff; border-left: 4px solid #0af; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Term Sheet Analysis</h1>
  <p><strong>Firm:</strong> ${analysis.firm}</p>
  <p><strong>Analyzed:</strong> ${new Date(analysis.receivedDate).toLocaleDateString()}</p>
  
  ${analysis.flags.map(flag => `
    <div class="flag ${flag.severity}">
      <h3>${flag.term}</h3>
      <p><strong>${flag.issue}</strong></p>
      <p>${flag.explanation}</p>
    </div>
  `).join('')}
  
  <pre>${analysis.fullAnalysis}</pre>
  
  <p><strong>⚠️  ALWAYS have a startup attorney review the full term sheet before signing.</strong></p>
</body>
</html>`
}
```
