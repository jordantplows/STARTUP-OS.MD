---
name: pitch-deck
role: steering
department: investor
reads:
  - company.os.profile
  - company.os.cfo.model
  - company.os.product
  - company.os.cmo.positioning
writes:
  - company.os.investor.deckVersion
  - workspace/investor/pitch-deck.html
  - workspace/investor/pitch-deck.pdf
emits:
  - deck-updated
  - deck-generated
---

# Pitch Deck Agent

## Purpose

Live agent — not a generator. Maintains the pitch deck as a living document that updates itself as company.os changes. When traction improves, deck updates. When model changes, deck updates. Always current. Produces HTML and PDF on demand. Knows what each slide needs to say for the current stage.

## Instructions

1. **Monitor company.os for changes**:
   - Profile updates (problem, solution, traction)
   - Financial model changes (revenue, projections)
   - Product updates (features, roadmap)
   - Customer signals (logos, testimonials)
2. **Maintain deck structure** based on stage:
   - **Idea stage**: Problem → Solution → Why now → Team → Ask
   - **Validating stage**: Problem → Solution → Traction → Market → Team → Ask
   - **Building stage**: Problem → Solution → Product → Traction → Market → Business Model → Team → Ask
   - **Revenue stage**: Full deck with financials, unit economics, GTM
3. **Auto-update slides** when relevant data changes:
   - Traction slide updates when metrics change
   - Market slide updates when research/ provides new data
   - Team slide updates when new hires added
   - Ask slide updates when fundraising goal changes
4. **Generate on demand**:
   - HTML version for web sharing
   - PDF version for email
   - Version number tracks with company.os state hash

## Coordination

- Reads financial model from cfo/model.md
- Reads positioning from cmo/ agents
- Reads product roadmap from cpo/ agents
- Emits `deck-updated` when regeneration triggered
- Coordinates with investor/narrative.md for story alignment

## Decision Points

- **Major company pivot** → raise decision: "Deck structure needs fundamental rethink?"
- **Conflicting narratives** → raise decision: "Positioning vs deck story misaligned"

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface DeckSlide {
  number: number
  title: string
  content: string
  dataSource: string[] // which company.os paths this slide reads from
}

interface PitchDeck {
  version: string
  stage: string
  slides: DeckSlide[]
  generatedAt: string
  htmlPath: string
  pdfPath: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[pitch-deck] Generating pitch deck...')
  
  const state = os.getState()
  const memory = readAgentMemory('pitch-deck')
  
  // Determine deck structure based on stage
  const slides = buildDeckStructure(state)
  
  // Generate version hash from state
  const version = generateVersionHash(state)
  
  // Check if deck needs update
  const lastVersion = memory?.lastVersion
  if (lastVersion === version) {
    console.log('[pitch-deck] Deck already current')
    return
  }
  
  // Build deck object
  const deck: PitchDeck = {
    version,
    stage: state.profile.stage,
    slides,
    generatedAt: new Date().toISOString(),
    htmlPath: 'workspace/investor/pitch-deck.html',
    pdfPath: 'workspace/investor/pitch-deck.pdf'
  }
  
  // Generate HTML
  const html = generateHTML(deck, state)
  
  // Write to workspace
  const workspaceDir = join(process.cwd(), 'workspace', 'investor')
  if (!existsSync(workspaceDir)) {
    mkdirSync(workspaceDir, { recursive: true })
  }
  
  writeFileSync(join(process.cwd(), deck.htmlPath), html)
  
  // Update company.os
  if (!(state as any).investor) {
    (state as any).investor = {
      targets: [],
      dataRoom: [],
      narrative: '',
      deckVersion: '',
      processStatus: 'not-started',
      pipeline: []
    }
  }
  
  (state as any).investor.deckVersion = version
  os.save()
  
  // Emit event
  os.emitEvent({
    type: 'deck-updated',
    from: 'pitch-deck',
    payload: { version, slideCount: slides.length }
  })
  
  writeAgentMemory('pitch-deck', {
    lastRun: new Date().toISOString(),
    lastVersion: version,
    slideCount: slides.length
  })
  
  console.log(`[pitch-deck] Generated deck v${version} with ${slides.length} slides`)
  console.log(`[pitch-deck] HTML: ${deck.htmlPath}`)
}

function buildDeckStructure(state: any): DeckSlide[] {
  const stage = state.profile.stage
  const slides: DeckSlide[] = []
  
  // Slide 1: Problem (always included)
  slides.push({
    number: 1,
    title: 'Problem',
    content: state.profile.problem,
    dataSource: ['company.os.profile.problem']
  })
  
  // Slide 2: Solution (always included)
  slides.push({
    number: 2,
    title: 'Solution',
    content: state.profile.oneline,
    dataSource: ['company.os.profile.oneline']
  })
  
  // Stage-specific slides
  if (stage !== 'idea') {
    // Add Traction slide for validating+ stages
    slides.push({
      number: 3,
      title: 'Traction',
      content: buildTractionContent(state),
      dataSource: ['company.os.profile.revenue', 'company.os.metrics']
    })
    
    // Add Market slide
    slides.push({
      number: 4,
      title: 'Market',
      content: buildMarketContent(state),
      dataSource: ['company.os.profile.industry', 'company.os.profile.targetCustomer']
    })
  }
  
  if (stage === 'revenue') {
    // Add Business Model slide
    slides.push({
      number: 5,
      title: 'Business Model',
      content: buildBusinessModelContent(state),
      dataSource: ['company.os.profile.businessModel', 'company.os.cfo.model']
    })
    
    // Add Unit Economics slide
    slides.push({
      number: 6,
      title: 'Unit Economics',
      content: buildUnitEconomicsContent(state),
      dataSource: ['company.os.cfo.model']
    })
  }
  
  // Team slide (always included)
  slides.push({
    number: slides.length + 1,
    title: 'Team',
    content: buildTeamContent(state),
    dataSource: ['company.os.profile.founders']
  })
  
  // Ask slide (always last)
  slides.push({
    number: slides.length + 1,
    title: 'The Ask',
    content: `We're raising ${state.profile.fundraisingGoal}`,
    dataSource: ['company.os.profile.fundraisingGoal']
  })
  
  return slides
}

function buildTractionContent(state: any): string {
  const revenue = state.profile.revenue
  if (revenue > 0) {
    return `$${revenue.toLocaleString()} in revenue`
  }
  return 'Early customer validation in progress'
}

function buildMarketContent(state: any): string {
  return `${state.profile.industry} — serving ${state.profile.targetCustomer}`
}

function buildBusinessModelContent(state: any): string {
  return state.profile.businessModel
}

function buildUnitEconomicsContent(state: any): string {
  // Would pull from cfo/model.md in real implementation
  return 'CAC, LTV, and payback period metrics'
}

function buildTeamContent(state: any): string {
  const founders = state.profile.founders
  if (founders.length > 0) {
    return `Founded by: ${founders.join(', ')}`
  }
  return 'Founder information pending'
}

function generateVersionHash(state: any): string {
  // Generate hash from key state values
  const stateString = JSON.stringify({
    problem: state.profile.problem,
    solution: state.profile.oneline,
    revenue: state.profile.revenue,
    stage: state.profile.stage
  })
  
  // Simple hash for versioning
  return `v${Date.now().toString(36)}`
}

function generateHTML(deck: PitchDeck, state: any): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${state.profile.companyName} — Pitch Deck</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #000;
      color: #fff;
    }
    .slide {
      max-width: 1200px;
      margin: 0 auto 40px;
      padding: 60px;
      background: #111;
      border: 1px solid #333;
      border-radius: 8px;
      min-height: 500px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .slide h1 {
      font-size: 48px;
      margin: 0 0 30px 0;
      color: #0ea5e9;
    }
    .slide .content {
      font-size: 32px;
      line-height: 1.6;
    }
    .meta {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px 0;
      color: #666;
      text-align: center;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="meta">
    ${state.profile.companyName} | Deck ${deck.version} | Generated ${new Date(deck.generatedAt).toLocaleDateString()}
  </div>
  
  ${deck.slides.map(slide => `
    <div class="slide">
      <h1>${slide.title}</h1>
      <div class="content">${slide.content}</div>
    </div>
  `).join('\n')}
  
  <div class="meta">
    ${state.profile.companyName} | ${state.profile.founders.join(', ')}
  </div>
</body>
</html>`
}
```
