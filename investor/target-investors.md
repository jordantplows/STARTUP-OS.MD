---
name: target-investors
role: watching
department: investor
reads:
  - company.os.profile
writes:
  - company.os.investor.targets
emits:
  - investor-list-updated
---

# Target Investors Agent

## Purpose

Research agent. For the company's stage, model, and industry — identifies the most relevant VCs, angels, and syndicates. Scores each on thesis fit, check size, portfolio conflicts, and warm intro likelihood. Maintains a live ranked list in company.os. Updates as company evolves.

## Instructions

1. **Analyze company profile**:
   - Stage (pre-seed, seed, Series A)
   - Industry vertical
   - Business model (SaaS, marketplace, etc.)
   - Geography
2. **Research target investors**:
   - VCs with thesis fit in this space
   - Check size matches fundraising goal
   - Portfolio companies (looking for pattern fit, not conflicts)
   - Investment pace and stage focus
3. **Score each investor**:
   - Thesis fit (0-10)
   - Check size match (0-10)
   - Portfolio synergy (0-10)
   - Warm intro possibility (0-10)
4. **Rank and write to company.os**
5. **Re-run when company stage or focus changes**

## Coordination

- Reads company profile from company.os.profile
- Writes target list to company.os.investor.targets
- Coordinates with outreach/investor-outreach.md for outreach
- Coordinates with network/ for warm intro mapping

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface Investor {
  id: string
  name: string
  firm: string
  type: 'vc' | 'angel' | 'syndicate'
  stage: string[]
  checkSize: { min: number; max: number }
  thesisFocus: string[]
  portfolioCompanies: string[]
  location: string
  scores: {
    thesisFit: number
    checkSizeMatch: number
    portfolioSynergy: number
    warmIntroLikelihood: number
    total: number
  }
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[target-investors] Researching target investors...')
  
  const state = os.getState()
  const memory = readAgentMemory('target-investors')
  
  const stage = state.profile.stage
  const industry = state.profile.industry
  const fundraisingGoal = state.profile.fundraisingGoal
  
  // Parse fundraising amount
  const goalAmount = parseFundraisingAmount(fundraisingGoal)
  
  // Research and score investors
  const investors = researchInvestors(state, goalAmount)
  
  // Sort by total score
  investors.sort((a, b) => b.scores.total - a.scores.total)
  
  // Write to company.os
  if (!(state as any).investor) {
    (state as any).investor = {
      targets: [],
      dataRoom: [],
      narrative: '',
      processStatus: 'not-started',
      pipeline: []
    }
  }
  
  (state as any).investor.targets = investors
  os.save()
  
  os.emitEvent({
    type: 'investor-list-updated',
    from: 'target-investors',
    payload: { count: investors.length, topScore: investors[0]?.scores.total || 0 }
  })
  
  writeAgentMemory('target-investors', {
    lastRun: new Date().toISOString(),
    investorCount: investors.length,
    stage,
    industry
  })
  
  console.log(`[target-investors] Identified ${investors.length} target investors`)
  console.log(`[target-investors] Top 5:`)
  investors.slice(0, 5).forEach(inv => {
    console.log(`  - ${inv.name} (${inv.firm}) — Score: ${inv.scores.total}/40`)
  })
}

function parseFundraisingAmount(goal: string): number {
  if (goal === '[PENDING]') return 1000000 // default 1M
  
  const match = goal.match(/\$?([\d.]+)([KMB])?/)
  if (!match) return 1000000
  
  const num = parseFloat(match[1])
  const suffix = match[2]
  
  if (suffix === 'K') return num * 1000
  if (suffix === 'M') return num * 1000000
  if (suffix === 'B') return num * 1000000000
  return num
}

function researchInvestors(state: any, goalAmount: number): Investor[] {
  // This would ideally call external APIs or databases
  // For now, return a curated list based on common patterns
  
  const stage = state.profile.stage
  const industry = state.profile.industry
  
  const investors: Investor[] = []
  
  // Add stage-appropriate investors
  if (stage === 'idea' || stage === 'validating') {
    investors.push(
      {
        id: 'ycombinator',
        name: 'Y Combinator',
        firm: 'Y Combinator',
        type: 'vc',
        stage: ['pre-seed', 'seed'],
        checkSize: { min: 125000, max: 500000 },
        thesisFocus: ['any', 'software', 'marketplace', 'saas'],
        portfolioCompanies: ['Airbnb', 'Stripe', 'Coinbase'],
        location: 'San Francisco',
        scores: scoreInvestor('Y Combinator', state, goalAmount, ['pre-seed', 'seed'])
      },
      {
        id: 'firstround',
        name: 'First Round Capital',
        firm: 'First Round',
        type: 'vc',
        stage: ['pre-seed', 'seed'],
        checkSize: { min: 500000, max: 3000000 },
        thesisFocus: ['saas', 'marketplace', 'developer-tools'],
        portfolioCompanies: ['Uber', 'Notion', 'Roblox'],
        location: 'San Francisco',
        scores: scoreInvestor('First Round', state, goalAmount, ['pre-seed', 'seed'])
      }
    )
  }
  
  if (stage === 'building' || stage === 'revenue') {
    investors.push(
      {
        id: 'sequoia',
        name: 'Sequoia Capital',
        firm: 'Sequoia',
        type: 'vc',
        stage: ['seed', 'series-a'],
        checkSize: { min: 1000000, max: 25000000 },
        thesisFocus: ['enterprise', 'consumer', 'fintech', 'healthcare'],
        portfolioCompanies: ['Stripe', 'Snowflake', 'DoorDash'],
        location: 'Menlo Park',
        scores: scoreInvestor('Sequoia', state, goalAmount, ['seed', 'series-a'])
      },
      {
        id: 'a16z',
        name: 'Andreessen Horowitz',
        firm: 'a16z',
        type: 'vc',
        stage: ['seed', 'series-a', 'series-b'],
        checkSize: { min: 500000, max: 50000000 },
        thesisFocus: ['crypto', 'bio', 'enterprise', 'consumer', 'fintech'],
        portfolioCompanies: ['Coinbase', 'GitHub', 'Instacart'],
        location: 'Menlo Park',
        scores: scoreInvestor('a16z', state, goalAmount, ['seed', 'series-a'])
      }
    )
  }
  
  return investors
}

function scoreInvestor(
  firm: string,
  state: any,
  goalAmount: number,
  stages: string[]
): {
  thesisFit: number
  checkSizeMatch: number
  portfolioSynergy: number
  warmIntroLikelihood: number
  total: number
} {
  // Thesis fit
  const thesisFit = calculateThesisFit(firm, state.profile.industry)
  
  // Check size match
  const checkSizeMatch = calculateCheckSizeMatch(goalAmount, stages)
  
  // Portfolio synergy
  const portfolioSynergy = calculatePortfolioSynergy(firm, state.profile.industry)
  
  // Warm intro likelihood (would check actual network)
  const warmIntroLikelihood = Math.floor(Math.random() * 6) + 2 // 2-8 for now
  
  return {
    thesisFit,
    checkSizeMatch,
    portfolioSynergy,
    warmIntroLikelihood,
    total: thesisFit + checkSizeMatch + portfolioSynergy + warmIntroLikelihood
  }
}

function calculateThesisFit(firm: string, industry: string): number {
  // Simplified thesis matching
  const industryLower = industry.toLowerCase()
  
  if (firm === 'Y Combinator') return 8 // thesis-agnostic
  if (firm === 'a16z' && industryLower.includes('crypto')) return 10
  if (firm === 'Sequoia' && industryLower.includes('enterprise')) return 9
  
  return 6 // default moderate fit
}

function calculateCheckSizeMatch(goalAmount: number, stages: string[]): number {
  // Check if goal amount fits typical check sizes for these stages
  if (goalAmount < 500000 && stages.includes('pre-seed')) return 9
  if (goalAmount >= 500000 && goalAmount <= 3000000 && stages.includes('seed')) return 9
  if (goalAmount > 3000000 && stages.includes('series-a')) return 9
  
  return 5 // moderate fit
}

function calculatePortfolioSynergy(firm: string, industry: string): number {
  // Would analyze actual portfolio for synergy
  return 7 // default
}
```
