---
name: pitch-deck
description: Generate 12-slide pitch deck with headlines, bullets, and speaker notes
department: brand
triggers: ["/startup-os brand"]
allowed-tools: [Read, Write, Bash]
reads:
  - strategy/output/idea-canvas.md
  - strategy/output/lean-canvas.md
  - strategy/output/market-research.md
  - strategy/output/competitor-analysis.md
  - brand/output/brand-brief-filled.md
  - brand/output/voice-and-tone-filled.md
writes:
  - brand/output/pitch-deck.md
---

## What this agent does

Reads all strategy and brand outputs to synthesize the complete business story, then uses Claude API to generate a 12-slide pitch deck with headlines, bullet points, and speaker notes for each slide. Follows standard investor deck structure. Outputs to brand/output/pitch-deck.md.

## Instructions

1. Read all strategy outputs (idea-canvas, lean-canvas, market-research, competitor-analysis)
2. Read brand outputs (brand-brief-filled, voice-and-tone-filled) for messaging consistency
3. Call Claude API to generate 12-slide pitch deck structure:
   - Cover, Problem, Solution, Why Now, Market, Product, Business Model, Traction, Go-to-Market, Team, Financials, Ask
4. For each slide provide: headline, 3-5 bullet points, detailed speaker notes
5. Format as structured markdown
6. Write to brand/output/pitch-deck.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generatePitchDeck() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  const strategyOutputDir = join(projectRoot, 'strategy', 'output')
  const brandOutputDir = join(projectRoot, 'brand', 'output')

  // Read strategy outputs
  let ideaCanvas = ''
  let leanCanvas = ''
  let marketResearch = ''
  let competitorAnalysis = ''

  try {
    ideaCanvas = readFileSync(join(strategyOutputDir, 'idea-canvas.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: idea-canvas.md not found')
  }

  try {
    leanCanvas = readFileSync(join(strategyOutputDir, 'lean-canvas.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: lean-canvas.md not found')
  }

  try {
    marketResearch = readFileSync(join(strategyOutputDir, 'market-research.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: market-research.md not found')
  }

  try {
    competitorAnalysis = readFileSync(join(strategyOutputDir, 'competitor-analysis.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: competitor-analysis.md not found')
  }

  // Read brand outputs
  let brandBrief = ''
  let voiceAndTone = ''

  try {
    brandBrief = readFileSync(join(brandOutputDir, 'brand-brief-filled.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: brand-brief-filled.md not found')
  }

  try {
    voiceAndTone = readFileSync(join(brandOutputDir, 'voice-and-tone-filled.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: voice-and-tone-filled.md not found')
  }

  const fullContext = `
# Strategy Context

## Idea Canvas
${ideaCanvas}

## Lean Canvas
${leanCanvas}

## Market Research
${marketResearch}

## Competitor Analysis
${competitorAnalysis}

# Brand Context

## Brand Brief
${brandBrief}

## Voice and Tone
${voiceAndTone}
  `.trim()

  // Generate pitch deck via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are a pitch deck expert. Based on this complete startup foundation:

${fullContext}

Generate a comprehensive 12-slide pitch deck following standard investor deck structure. For each slide provide:
1. Headline (compelling, concise)
2. 3-5 bullet points (key facts, not full sentences)
3. Speaker notes (2-3 paragraphs of what to say)

Use the brand voice from the voice and tone guide. Make it compelling and data-driven.

# Pitch Deck

---

## Slide 1: Cover

### Headline
[Company Name]
[One-line tagline that captures what you do]

### Bullets
- [Presenter name & title]
- [Contact information]
- [Date]

### Speaker Notes

[2-3 paragraphs covering:
- Brief introduction of yourself
- Hook that captures attention
- What you'll cover in this presentation
- Set expectations for Q&A timing]

---

## Slide 2: Problem

### Headline
[Headline that captures the core problem]

### Bullets
- [Specific pain point #1 with quantification if possible]
- [Specific pain point #2 with quantification if possible]
- [Specific pain point #3 with quantification if possible]
- [The cost/impact of this problem going unsolved]

### Speaker Notes

[2-3 paragraphs covering:
- Story or example that illustrates the problem
- Why this problem matters now
- Who experiences this problem most acutely
- What happens if it goes unsolved
- Transition to solution]

---

## Slide 3: Solution

### Headline
[Headline describing your solution approach]

### Bullets
- [What you built/do in simple terms]
- [Key capability #1]
- [Key capability #2]
- [Key capability #3]
- [The outcome/benefit customers get]

### Speaker Notes

[2-3 paragraphs covering:
- High-level explanation of the solution
- Why this approach is different/better
- Quick example of it in action
- The transformation it creates
- Transition to timing]

---

## Slide 4: Why Now

### Headline
[Headline about market timing/catalysts]

### Bullets
- [Market trend or technology shift #1]
- [Market trend or technology shift #2]
- [Market trend or technology shift #3]
- [Regulatory, social, or economic catalyst if applicable]

### Speaker Notes

[2-3 paragraphs covering:
- Why this couldn't be built 5 years ago
- What's changed in the market/technology landscape
- Why customers are ready now
- Window of opportunity
- Transition to market size]

---

## Slide 5: Market Size

### Headline
[Headline about market opportunity]

### Bullets
- **TAM**: $[X]B - [Brief definition]
- **SAM**: $[X]B - [Brief definition]
- **SOM**: $[X]M - [Brief definition]
- [Key growth rate or market dynamic]

### Speaker Notes

[2-3 paragraphs covering:
- Explanation of TAM/SAM/SOM methodology
- Market growth trends
- Why this market is attractive
- How you'll capture SOM
- Transition to product]

---

## Slide 6: Product

### Headline
[Headline about your product/demo]

### Bullets
- [Key feature #1 and benefit]
- [Key feature #2 and benefit]
- [Key feature #3 and benefit]
- [Key differentiator]
- [Screenshot, mockup, or demo note]

### Speaker Notes

[2-3 paragraphs covering:
- Walk through key user flow or use case
- Highlight what makes it unique
- Technical innovation if relevant
- User feedback or validation
- Transition to business model]

---

## Slide 7: Business Model

### Headline
[Headline about how you make money]

### Bullets
- **Revenue Model**: [Subscription, transaction fee, usage-based, etc.]
- **Pricing**: [Price points and tiers if applicable]
- **Unit Economics**: [Key metrics like CAC, LTV, gross margin]
- **Path to Profitability**: [When and how]

### Speaker Notes

[2-3 paragraphs covering:
- Detailed explanation of revenue model
- Why customers pay
- Economics that drive profitability
- Comparable models or benchmarks
- Transition to traction]

---

## Slide 8: Traction

### Headline
[Headline about momentum/validation]

### Bullets
- [Key metric #1: users, revenue, growth rate]
- [Key metric #2: engagement, retention, NPS]
- [Key milestone or customer logo]
- [Growth trajectory or acceleration]

### Speaker Notes

[2-3 paragraphs covering:
- Story of what you've achieved so far
- Key learnings or pivots
- What metrics prove product-market fit
- Momentum and trajectory
- Transition to go-to-market strategy]

---

## Slide 9: Go-to-Market Strategy

### Headline
[Headline about customer acquisition]

### Bullets
- **Target Customer**: [Primary segment you're going after first]
- **Acquisition Channels**: [Top 2-3 channels with early proof]
- **CAC**: $[X] - [Payback period]
- **Sales Motion**: [Self-serve, sales-led, hybrid]

### Speaker Notes

[2-3 paragraphs covering:
- Detailed customer acquisition strategy
- Why these channels work for your ICP
- Early proof points or experiments
- Plan to scale
- Transition to team]

---

## Slide 10: Team

### Headline
[Headline about why this team can win]

### Bullets
- **[Founder 1 Name, Role]**: [Relevant background/expertise]
- **[Founder 2 Name, Role]**: [Relevant background/expertise]
- **[Key Hire/Advisor]**: [Relevant background/expertise]
- [Key domain expertise or unfair advantage]

### Speaker Notes

[2-3 paragraphs covering:
- Why this team is uniquely suited to build this
- Relevant experience or domain expertise
- Complementary skills
- Advisors or supporters
- Transition to financials]

---

## Slide 11: Financials

### Headline
[Headline about financial projections]

### Bullets
- **Current**: [Revenue, burn, runway]
- **12-month projection**: [Revenue target, key milestones]
- **3-year projection**: [Revenue trajectory, path to profitability]
- **Key assumptions**: [Growth rate, unit economics, etc.]

### Speaker Notes

[2-3 paragraphs covering:
- Financial trajectory and assumptions
- Key milestones that derisk the business
- Capital efficiency story
- When you reach profitability
- Transition to ask]

---

## Slide 12: The Ask

### Headline
[Headline about fundraising]

### Bullets
- **Raising**: $[X]M [Round type]
- **Use of Funds**: [Allocation across hiring, product, marketing, etc.]
- **Milestones**: [What this round unlocks]
- **Timeline**: [When you're closing, urgency if applicable]

### Speaker Notes

[2-3 paragraphs covering:
- What you're raising and why
- Detailed use of funds
- Milestones this capital unlocks
- What success looks like in 12-18 months
- Call to action for investors
- Thank you and open for questions]

---

Make the deck compelling, data-driven, and authentic to the brand voice. Use specific numbers where available. Keep bullets concise (not full sentences). Make speaker notes detailed enough to guide the full presentation.`
      }
    ]
  })

  // Extract content from response
  let pitchDeck = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      pitchDeck += block.text + '\n'
    }
  }

  if (!pitchDeck.trim()) {
    pitchDeck = 'Failed to generate pitch deck'
  }

  // Write output
  const outputDir = join(projectRoot, 'brand', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'pitch-deck.md')
  writeFileSync(outputPath, pitchDeck, 'utf-8')

  console.log(`Pitch deck generated successfully: ${outputPath}`)
  console.log(`\nGenerated: 12 slides with headlines, bullets, and speaker notes`)
}

generatePitchDeck().catch(console.error)
```

## Output

Creates brand/output/pitch-deck.md with 12 complete slides following standard investor deck structure: Cover, Problem, Solution, Why Now, Market, Product, Business Model, Traction, Go-to-Market, Team, Financials, and Ask. Each slide includes a compelling headline, 3-5 concise bullet points, and 2-3 paragraphs of detailed speaker notes. Success requires synthesizing all strategy and brand inputs into a cohesive, compelling narrative aligned with brand voice. Output should be presentation-ready.
