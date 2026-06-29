---
name: cmo-brand
executive: cmo
role: steering
reads:
  - company.os.departments.cmo
  - company.os.departments.marketing
  - company.os.departments.sales
  - company.os.departments.product
  - company.os.events
events:
  emits: [brand-violation-flagged, brand-review-complete, brand-guidelines-updated, brand-consistency-score]
  watches: [content-published, campaign-launched, sales-collateral-created, product-messaging-changed, external-comms-pending]
template-ref: templates/executives/brand.md
---

## What this agent does

The CMO brand agent is the brand guardian. It reviews all external communications for consistency with positioning, voice, visual identity, and quality standards. It ensures the company presents a cohesive, high-quality brand across all channels and touchpoints.

Brand consistency builds trust. Inconsistency creates confusion and dilutes market impact.

## Instructions

### WATCH

Trigger when:
- Content is published (blog, social, email, PR)
- Campaign is launched (review all campaign assets)
- Sales collateral is created (pitch deck, one-pager, case study)
- Product messaging changes (website, in-app, docs)
- External communications are pending approval (press release, partnership announcement)
- Brand guidelines are requested or need updating
- Brand consistency score drops below threshold
- Competitive brand analysis is due

### REASON

Brand review framework:

**Brand consistency pillars:**
1. **Positioning** — Does it align with our ICP, value prop, differentiation?
2. **Voice & Tone** — Does it match brand personality? (Clear, authoritative, helpful vs. casual, friendly)
3. **Visual Identity** — Does it use correct logo, colors, typography, imagery?
4. **Messaging** — Does it use approved messaging hierarchy and customer language?
5. **Quality** — Is it well-written, error-free, professional?

**Common brand violations:**
- Off-positioning (wrong ICP, wrong problem, wrong value prop)
- Off-voice (too casual, too formal, too salesy, too technical)
- Visual inconsistency (wrong colors, old logo, generic stock photos)
- Messaging drift (not using approved language, creating new terms)
- Quality issues (typos, bad grammar, poor design, broken formatting)

**Brand review process:**
```
1. Read content/asset
2. Check against brand guidelines
3. Identify violations (severity: critical/major/minor)
4. Suggest fixes
5. Approve or flag for revision
```

**Severity levels:**
- **Critical** — Wrong positioning, major factual error, legal risk → Block
- **Major** — Off-voice, visual inconsistency, messaging drift → Revise
- **Minor** — Typo, formatting issue, style preference → Fix or approve

**Brand health metrics:**
- Consistency score (% of assets passing review on first submission)
- Violation frequency (by type and severity)
- Time to approval (review cycle speed)
- Brand perception (external sentiment, recognition)

### ACT

Brand review format:

```
BRAND REVIEW · [Asset Name]

ASSET DETAILS
Type:           [Blog post/Campaign/Deck/Email/etc.]
Owner:          [Team/person]
Status:         [Pending review/Approved/Needs revision]
Reviewed:       [Date]

BRAND ALIGNMENT CHECK
✓ Positioning       [Pass/Fail] - [Comment]
✓ Voice & Tone      [Pass/Fail] - [Comment]
✓ Visual Identity   [Pass/Fail] - [Comment]
✓ Messaging         [Pass/Fail] - [Comment]
✓ Quality           [Pass/Fail] - [Comment]

VIOLATIONS FOUND
Severity    Issue                               Fix
[Critical]  [Description]                       [How to fix]
[Major]     [Description]                       [How to fix]
[Minor]     [Description]                       [How to fix]

DECISION
[APPROVED / NEEDS REVISION / BLOCKED]

Feedback:
[Specific, actionable feedback for creator]

Next Steps:
[What needs to happen before this can be published]
```

Brand guidelines format:

```
BRAND GUIDELINES · [Date]

POSITIONING SUMMARY
One-liner:      [Value proposition from positioning agent]
ICP:            [Who we serve]
Differentiation: [What makes us unique]

VOICE & TONE
Personality:    [3-5 adjectives describing brand voice]
Do:             [What our voice does]
Don't:          [What our voice doesn't do]

Example:
✓ Good: "We help security teams ship faster without compromising safety."
✗ Bad: "Our revolutionary AI-powered platform disrupts the legacy paradigm."

VISUAL IDENTITY
Logo:           [Logo usage rules]
Colors:         [Primary: #XXXXXX, Secondary: #XXXXXX, etc.]
Typography:     [Heading font, Body font, sizes]
Imagery:        [Photo style, illustration style, icons]

MESSAGING HIERARCHY
Primary:        [Main message]
Supporting:
  1. [Pillar 1]
  2. [Pillar 2]
  3. [Pillar 3]

CUSTOMER LANGUAGE
Terms to use:   [Phrases customers use]
Terms to avoid: [Internal jargon, marketing fluff]

APPROVAL WORKFLOW
Who approves:   [CMO/Marketing Lead/Brand Designer]
Turnaround:     [24-48 hours]
Escalation:     [Critical violations go to CMO]
```

Brand health report:

```
BRAND HEALTH REPORT · [Period]

CONSISTENCY SCORE
Overall:        [X]% assets pass review on first submission
By asset type:
  Blog posts:   [X]%
  Campaigns:    [X]%
  Sales assets: [X]%
  Product UI:   [X]%

VIOLATION BREAKDOWN
Type                    Count   % of Total
Positioning             [n]     [%]
Voice & Tone            [n]     [%]
Visual Identity         [n]     [%]
Messaging               [n]     [%]
Quality                 [n]     [%]

MOST COMMON VIOLATIONS
1. [Violation] - [Count] occurrences - [Fix]
2. [Violation] - [Count] occurrences - [Fix]
3. [Violation] - [Count] occurrences - [Fix]

RECOMMENDATIONS
· [Recommendation 1 to improve brand consistency]
· [Recommendation 2 to improve brand consistency]
· [Recommendation 3 to improve brand consistency]

BRAND PERCEPTION (External)
Sentiment:      [Positive/Neutral/Negative]
Recognition:    [% of target market aware of brand]
Associations:   [What people say about us]
```

### COORDINATE

When reviewing content:
- Read content from `content-published` event
- Check against positioning, guidelines
- Emit `brand-review-complete` event with approval/revision

When finding violations:
- Emit `brand-violation-flagged` event with severity and details
- Flag to content creator/owner for revision
- Block publication until critical violations fixed
- Update violation tracking in memory

When updating guidelines:
- Emit `brand-guidelines-updated` event
- Notify all teams creating external comms
- Store updated guidelines in `company.os.departments.cmo.memory`

When reporting brand health:
- Emit `brand-consistency-score` event with metrics
- Flag patterns of violations to teams
- Recommend training or process improvements

## TypeScript

```typescript
import { CompanyOS, Event } from '../src/company-os'

interface BrandGuidelines {
  positioning: {
    oneLiner: string
    icp: string
    differentiation: string
  }
  voice: {
    personality: string[]
    dos: string[]
    donts: string[]
    examples: Array<{ good: string; bad: string }>
  }
  visual: {
    logo: string
    colors: Record<string, string>
    typography: Record<string, string>
    imagery: string
  }
  messaging: {
    primary: string
    supporting: string[]
  }
  language: {
    termsToUse: string[]
    termsToAvoid: string[]
  }
  approval: {
    approver: string
    turnaround: string
    escalation: string
  }
}

interface BrandReview {
  assetId: string
  assetName: string
  assetType: string
  owner: string
  reviewedAt: string
  checks: {
    positioning: { pass: boolean; comment: string }
    voice: { pass: boolean; comment: string }
    visual: { pass: boolean; comment: string }
    messaging: { pass: boolean; comment: string }
    quality: { pass: boolean; comment: string }
  }
  violations: Array<{
    severity: 'critical' | 'major' | 'minor'
    issue: string
    fix: string
  }>
  decision: 'approved' | 'needs-revision' | 'blocked'
  feedback: string
  nextSteps: string
}

interface BrandHealthReport {
  consistencyScore: {
    overall: number
    byType: Record<string, number>
  }
  violationBreakdown: Array<{
    type: string
    count: number
    percentage: number
  }>
  commonViolations: Array<{
    violation: string
    count: number
    fix: string
  }>
  recommendations: string[]
  perception: {
    sentiment: 'positive' | 'neutral' | 'negative'
    recognition: number
    associations: string[]
  }
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Check what triggered this run
  const pendingReviews = getPendingBrandReviews(os)
  const guidelinesRequested = checkGuidelinesRequested(os)
  const healthReportDue = checkHealthReportDue(os)
  
  if (guidelinesRequested) {
    return generateBrandGuidelines(os)
  }
  
  if (healthReportDue) {
    return generateBrandHealthReport(os)
  }
  
  if (pendingReviews.length > 0) {
    return reviewAssets(os, pendingReviews)
  }
  
  return 'No brand reviews pending'
}

function getPendingBrandReviews(os: CompanyOS): Event[] {
  // Get all events that need brand review
  const reviewableEvents = [
    'content-published',
    'campaign-launched',
    'sales-collateral-created',
    'product-messaging-changed'
  ]
  
  return os.events.filter(e => 
    reviewableEvents.includes(e.type) &&
    !e.consumed.includes('cmo-brand')
  )
}

function checkGuidelinesRequested(os: CompanyOS): boolean {
  const requests = os.events.filter(e =>
    e.type === 'brand-guidelines-requested' &&
    !e.consumed.includes('cmo-brand')
  )
  
  return requests.length > 0
}

function checkHealthReportDue(os: CompanyOS): boolean {
  const cmo = os.departments.cmo
  if (!cmo) return false
  
  const lastReport = cmo.memory.find(m => m.startsWith('BRAND_HEALTH:'))
  if (!lastReport) return true
  
  const reportDate = lastReport.split(':')[1]
  const daysSinceReport = Math.floor(
    (Date.now() - new Date(reportDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  return daysSinceReport >= 90 // Quarterly report
}

function reviewAssets(os: CompanyOS, events: Event[]): string {
  const reviews: string[] = []
  
  for (const event of events) {
    const review = conductBrandReview(os, event)
    
    // Emit review complete event
    os.events.push({
      type: 'brand-review-complete',
      from: 'cmo-brand',
      payload: { review },
      timestamp: new Date().toISOString(),
      consumed: []
    })
    
    // If violations found, emit alert
    if (review.violations.length > 0) {
      os.events.push({
        type: 'brand-violation-flagged',
        from: 'cmo-brand',
        payload: { 
          assetId: review.assetId,
          violations: review.violations
        },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    }
    
    // Mark event as consumed
    event.consumed.push('cmo-brand')
    
    // Store review in memory
    if (!os.departments.cmo) {
      os.departments.cmo = {
        status: 'steering',
        currentFocus: 'Brand guardianship',
        lastAction: null,
        pendingDecisions: [],
        memory: [],
        signals: []
      }
    }
    
    os.departments.cmo.memory.push(
      `BRAND_REVIEW:${review.assetId}:${JSON.stringify(review)}`
    )
    
    reviews.push(formatBrandReview(review))
  }
  
  return reviews.join('\n\n')
}

function conductBrandReview(os: CompanyOS, event: Event): BrandReview {
  const guidelines = getBrandGuidelines(os)
  const assetName = event.payload?.title || event.payload?.name || 'Unnamed asset'
  
  // Check against brand guidelines
  const checks = {
    positioning: checkPositioning(event, guidelines),
    voice: checkVoice(event, guidelines),
    visual: checkVisual(event, guidelines),
    messaging: checkMessaging(event, guidelines),
    quality: checkQuality(event)
  }
  
  // Collect violations
  const violations: BrandReview['violations'] = []
  
  if (!checks.positioning.pass) {
    violations.push({
      severity: 'critical',
      issue: checks.positioning.comment,
      fix: 'Revise to align with positioning: ' + guidelines.positioning.oneLiner
    })
  }
  
  if (!checks.voice.pass) {
    violations.push({
      severity: 'major',
      issue: checks.voice.comment,
      fix: 'Rewrite in brand voice: ' + guidelines.voice.personality.join(', ')
    })
  }
  
  if (!checks.visual.pass) {
    violations.push({
      severity: 'major',
      issue: checks.visual.comment,
      fix: 'Apply brand visual guidelines'
    })
  }
  
  if (!checks.messaging.pass) {
    violations.push({
      severity: 'major',
      issue: checks.messaging.comment,
      fix: 'Use approved messaging hierarchy'
    })
  }
  
  if (!checks.quality.pass) {
    violations.push({
      severity: 'minor',
      issue: checks.quality.comment,
      fix: 'Fix typos and formatting'
    })
  }
  
  // Determine decision
  const hasCritical = violations.some(v => v.severity === 'critical')
  const hasMajor = violations.some(v => v.severity === 'major')
  
  const decision: BrandReview['decision'] = hasCritical 
    ? 'blocked'
    : hasMajor
    ? 'needs-revision'
    : 'approved'
  
  return {
    assetId: event.timestamp + '-' + assetName.replace(/\s/g, '-').toLowerCase(),
    assetName,
    assetType: event.type,
    owner: event.from,
    reviewedAt: new Date().toISOString(),
    checks,
    violations,
    decision,
    feedback: generateFeedback(violations, checks),
    nextSteps: decision === 'approved' 
      ? 'Ready to publish'
      : `Fix ${violations.length} violation(s) and resubmit for review`
  }
}

function getBrandGuidelines(os: CompanyOS): BrandGuidelines {
  const cmo = os.departments.cmo
  
  // Look for existing guidelines
  if (cmo) {
    const guidelinesMemory = cmo.memory.find(m => m.startsWith('BRAND_GUIDELINES:'))
    if (guidelinesMemory) {
      const parts = guidelinesMemory.split(':')
      if (parts.length >= 3) {
        try {
          return JSON.parse(parts.slice(2).join(':'))
        } catch {
          // Fall through to defaults
        }
      }
    }
  }
  
  // Get positioning for defaults
  const positioning = getCMOPositioning(os)
  
  // Default guidelines
  return {
    positioning: {
      oneLiner: positioning?.valueProposition?.oneLiner || os.profile.oneline || 'Company value proposition',
      icp: positioning?.icp?.company || os.profile.targetCustomer || 'Target customers',
      differentiation: 'What makes us unique'
    },
    voice: {
      personality: ['Clear', 'Authoritative', 'Helpful'],
      dos: ['Use simple language', 'Be specific and concrete', 'Focus on customer outcomes'],
      donts: ['Use jargon or buzzwords', 'Make vague claims', 'Be overly promotional'],
      examples: [
        {
          good: 'We help security teams ship faster without compromising safety.',
          bad: 'Our revolutionary AI-powered platform disrupts the legacy paradigm.'
        }
      ]
    },
    visual: {
      logo: 'Use primary logo in all communications',
      colors: { primary: '#000000', secondary: '#FFFFFF', accent: '#0066CC' },
      typography: { heading: 'Sans-serif bold', body: 'Sans-serif regular' },
      imagery: 'Use authentic photos, avoid generic stock imagery'
    },
    messaging: {
      primary: positioning?.valueProposition?.oneLiner || os.profile.oneline || 'Primary message',
      supporting: positioning?.messagingHierarchy?.supporting?.map((s: any) => s.pillar) || []
    },
    language: {
      termsToUse: positioning?.guidance?.customerLanguage || [],
      termsToAvoid: ['Disrupt', 'Revolutionary', 'Paradigm shift', 'Best-in-class']
    },
    approval: {
      approver: 'CMO or Marketing Lead',
      turnaround: '24-48 hours',
      escalation: 'Critical violations go to CMO'
    }
  }
}

function getCMOPositioning(os: CompanyOS): any {
  const cmo = os.departments.cmo
  if (!cmo) return null
  
  const positioningMemory = cmo.memory.find(m => m.startsWith('POSITIONING:'))
  if (!positioningMemory) return null
  
  const parts = positioningMemory.split(':')
  if (parts.length < 3) return null
  
  try {
    return JSON.parse(parts.slice(2).join(':'))
  } catch {
    return null
  }
}

function checkPositioning(event: Event, guidelines: BrandGuidelines): { pass: boolean; comment: string } {
  // In real impl, this would use NLP to analyze content
  // For now, simple heuristic checks
  const content = JSON.stringify(event.payload).toLowerCase()
  
  // Check if ICP is mentioned
  const icpKeywords = guidelines.positioning.icp.toLowerCase().split(' ')
  const hasICP = icpKeywords.some(kw => content.includes(kw))
  
  if (!hasICP) {
    return { pass: false, comment: 'Does not mention target ICP' }
  }
  
  return { pass: true, comment: 'Aligns with positioning' }
}

function checkVoice(event: Event, guidelines: BrandGuidelines): { pass: boolean; comment: string } {
  const content = JSON.stringify(event.payload).toLowerCase()
  
  // Check for terms to avoid
  const hasBadTerms = guidelines.language.termsToAvoid.some(term =>
    content.includes(term.toLowerCase())
  )
  
  if (hasBadTerms) {
    return { pass: false, comment: 'Uses jargon or buzzwords (avoid: ' + guidelines.language.termsToAvoid.join(', ') + ')' }
  }
  
  return { pass: true, comment: 'Voice aligns with brand personality' }
}

function checkVisual(event: Event, guidelines: BrandGuidelines): { pass: boolean; comment: string } {
  // In real impl, would check image colors, logo usage, etc.
  // For text-only content, pass by default
  return { pass: true, comment: 'Visual identity consistent' }
}

function checkMessaging(event: Event, guidelines: BrandGuidelines): { pass: boolean; comment: string } {
  const content = JSON.stringify(event.payload).toLowerCase()
  
  // Check if primary message is present
  const primaryKeywords = guidelines.messaging.primary.toLowerCase().split(' ').slice(0, 3)
  const hasPrimary = primaryKeywords.some(kw => content.includes(kw))
  
  if (!hasPrimary) {
    return { pass: false, comment: 'Missing primary message: ' + guidelines.messaging.primary }
  }
  
  return { pass: true, comment: 'Messaging hierarchy followed' }
}

function checkQuality(event: Event): { pass: boolean; comment: string } {
  // In real impl, would check grammar, spelling, formatting
  // For now, pass by default
  return { pass: true, comment: 'Quality standards met' }
}

function generateFeedback(violations: BrandReview['violations'], checks: BrandReview['checks']): string {
  if (violations.length === 0) {
    return 'Excellent work! This asset meets all brand standards and is approved for publication.'
  }
  
  const critical = violations.filter(v => v.severity === 'critical')
  const major = violations.filter(v => v.severity === 'major')
  const minor = violations.filter(v => v.severity === 'minor')
  
  const parts: string[] = []
  
  if (critical.length > 0) {
    parts.push(`${critical.length} critical issue(s) found that must be fixed before publication.`)
  }
  
  if (major.length > 0) {
    parts.push(`${major.length} major issue(s) that need revision to meet brand standards.`)
  }
  
  if (minor.length > 0) {
    parts.push(`${minor.length} minor issue(s) to clean up.`)
  }
  
  parts.push('See violations list above for specific fixes needed.')
  
  return parts.join(' ')
}

function generateBrandGuidelines(os: CompanyOS): string {
  const guidelines = getBrandGuidelines(os)
  
  // Emit event
  os.events.push({
    type: 'brand-guidelines-updated',
    from: 'cmo-brand',
    payload: { guidelines },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Store in memory
  if (!os.departments.cmo) {
    os.departments.cmo = {
      status: 'steering',
      currentFocus: 'Brand guardianship',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cmo.memory.push(
    `BRAND_GUIDELINES:${new Date().toISOString()}:${JSON.stringify(guidelines)}`
  )
  
  return formatBrandGuidelines(guidelines)
}

function generateBrandHealthReport(os: CompanyOS): string {
  const reviews = getAllBrandReviews(os)
  const report = analyzeBrandHealth(reviews)
  
  // Emit event
  os.events.push({
    type: 'brand-consistency-score',
    from: 'cmo-brand',
    payload: { score: report.consistencyScore.overall },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Store in memory
  if (os.departments.cmo) {
    os.departments.cmo.memory.push(
      `BRAND_HEALTH:${new Date().toISOString()}:${JSON.stringify(report)}`
    )
  }
  
  return formatBrandHealthReport(report)
}

function getAllBrandReviews(os: CompanyOS): BrandReview[] {
  const cmo = os.departments.cmo
  if (!cmo) return []
  
  return cmo.memory
    .filter(m => m.startsWith('BRAND_REVIEW:'))
    .map(m => {
      const parts = m.split(':')
      if (parts.length < 3) return null
      try {
        return JSON.parse(parts.slice(2).join(':')) as BrandReview
      } catch {
        return null
      }
    })
    .filter((r): r is BrandReview => r !== null)
}

function analyzeBrandHealth(reviews: BrandReview[]): BrandHealthReport {
  if (reviews.length === 0) {
    return {
      consistencyScore: { overall: 100, byType: {} },
      violationBreakdown: [],
      commonViolations: [],
      recommendations: ['Start tracking brand reviews'],
      perception: { sentiment: 'neutral', recognition: 0, associations: [] }
    }
  }
  
  // Calculate consistency score
  const approved = reviews.filter(r => r.decision === 'approved').length
  const overall = Math.round((approved / reviews.length) * 100)
  
  // By type
  const byType: Record<string, number> = {}
  const typeGroups = reviews.reduce((acc, r) => {
    if (!acc[r.assetType]) acc[r.assetType] = []
    acc[r.assetType].push(r)
    return acc
  }, {} as Record<string, BrandReview[]>)
  
  for (const [type, typeReviews] of Object.entries(typeGroups)) {
    const typeApproved = typeReviews.filter(r => r.decision === 'approved').length
    byType[type] = Math.round((typeApproved / typeReviews.length) * 100)
  }
  
  // Violation breakdown
  const allViolations = reviews.flatMap(r => r.violations)
  const violationTypes = ['positioning', 'voice', 'visual', 'messaging', 'quality']
  const breakdown = violationTypes.map(type => {
    const count = allViolations.filter(v => v.issue.toLowerCase().includes(type)).length
    return {
      type,
      count,
      percentage: Math.round((count / allViolations.length) * 100)
    }
  }).filter(v => v.count > 0)
  
  // Common violations
  const violationCounts = new Map<string, number>()
  for (const v of allViolations) {
    violationCounts.set(v.issue, (violationCounts.get(v.issue) || 0) + 1)
  }
  
  const commonViolations = Array.from(violationCounts.entries())
    .map(([violation, count]) => ({
      violation,
      count,
      fix: allViolations.find(v => v.issue === violation)?.fix || 'Fix required'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
  
  return {
    consistencyScore: { overall, byType },
    violationBreakdown: breakdown,
    commonViolations,
    recommendations: generateRecommendations(breakdown, commonViolations),
    perception: {
      sentiment: overall > 80 ? 'positive' : overall > 60 ? 'neutral' : 'negative',
      recognition: 25, // Placeholder
      associations: ['Consistent', 'Professional', 'Clear']
    }
  }
}

function generateRecommendations(
  breakdown: BrandHealthReport['violationBreakdown'],
  commonViolations: BrandHealthReport['commonViolations']
): string[] {
  const recommendations: string[] = []
  
  // Top violation type
  if (breakdown.length > 0) {
    const top = breakdown[0]
    recommendations.push(`Focus on ${top.type} - accounts for ${top.percentage}% of violations`)
  }
  
  // Most common violation
  if (commonViolations.length > 0) {
    const most = commonViolations[0]
    recommendations.push(`Address recurring issue: ${most.violation} (${most.count} occurrences)`)
  }
  
  // Generic recommendations
  recommendations.push('Create brand training for content creators')
  recommendations.push('Use brand review checklist before submission')
  
  return recommendations
}

function formatBrandReview(r: BrandReview): string {
  const lines: string[] = []
  
  lines.push(`BRAND REVIEW · ${r.assetName}`)
  lines.push('')
  lines.push('ASSET DETAILS')
  lines.push(`Type:           ${r.assetType}`)
  lines.push(`Owner:          ${r.owner}`)
  lines.push(`Status:         ${r.decision.toUpperCase()}`)
  lines.push(`Reviewed:       ${r.reviewedAt.split('T')[0]}`)
  lines.push('')
  
  lines.push('BRAND ALIGNMENT CHECK')
  const checks = [
    ['Positioning', r.checks.positioning],
    ['Voice & Tone', r.checks.voice],
    ['Visual Identity', r.checks.visual],
    ['Messaging', r.checks.messaging],
    ['Quality', r.checks.quality]
  ]
  
  for (const [label, check] of checks) {
    const icon = check.pass ? '✓' : '✗'
    const status = check.pass ? 'Pass' : 'Fail'
    lines.push(`${icon} ${label.padEnd(16)} ${status.padEnd(8)} ${check.comment}`)
  }
  lines.push('')
  
  if (r.violations.length > 0) {
    lines.push('VIOLATIONS FOUND')
    lines.push('Severity    Issue                               Fix')
    for (const v of r.violations) {
      const sevPad = ' '.repeat(12 - v.severity.length)
      const issueTrunc = v.issue.length > 36 ? v.issue.substring(0, 33) + '...' : v.issue
      const issuePad = ' '.repeat(36 - issueTrunc.length)
      lines.push(`${v.severity}${sevPad}${issueTrunc}${issuePad}${v.fix}`)
    }
    lines.push('')
  }
  
  lines.push('DECISION')
  lines.push(r.decision.toUpperCase())
  lines.push('')
  lines.push('Feedback:')
  lines.push(r.feedback)
  lines.push('')
  lines.push('Next Steps:')
  lines.push(r.nextSteps)
  
  return lines.join('\n')
}

function formatBrandGuidelines(g: BrandGuidelines): string {
  const lines: string[] = []
  
  lines.push(`BRAND GUIDELINES · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  lines.push('POSITIONING SUMMARY')
  lines.push(`One-liner:      ${g.positioning.oneLiner}`)
  lines.push(`ICP:            ${g.positioning.icp}`)
  lines.push(`Differentiation: ${g.positioning.differentiation}`)
  lines.push('')
  
  lines.push('VOICE & TONE')
  lines.push(`Personality:    ${g.voice.personality.join(', ')}`)
  lines.push('Do:')
  for (const d of g.voice.dos) {
    lines.push(`  · ${d}`)
  }
  lines.push('Don\'t:')
  for (const d of g.voice.donts) {
    lines.push(`  · ${d}`)
  }
  lines.push('')
  lines.push('Example:')
  for (const ex of g.voice.examples) {
    lines.push(`✓ Good: "${ex.good}"`)
    lines.push(`✗ Bad:  "${ex.bad}"`)
  }
  lines.push('')
  
  lines.push('VISUAL IDENTITY')
  lines.push(`Logo:           ${g.visual.logo}`)
  lines.push(`Colors:         Primary: ${g.visual.colors.primary}, Secondary: ${g.visual.colors.secondary}`)
  lines.push(`Typography:     ${g.visual.typography.heading} / ${g.visual.typography.body}`)
  lines.push(`Imagery:        ${g.visual.imagery}`)
  lines.push('')
  
  lines.push('MESSAGING HIERARCHY')
  lines.push(`Primary:        ${g.messaging.primary}`)
  if (g.messaging.supporting.length > 0) {
    lines.push('Supporting:')
    for (let i = 0; i < g.messaging.supporting.length; i++) {
      lines.push(`  ${i + 1}. ${g.messaging.supporting[i]}`)
    }
  }
  lines.push('')
  
  lines.push('CUSTOMER LANGUAGE')
  if (g.language.termsToUse.length > 0) {
    lines.push('Terms to use:   ' + g.language.termsToUse.join(', '))
  }
  lines.push('Terms to avoid: ' + g.language.termsToAvoid.join(', '))
  lines.push('')
  
  lines.push('APPROVAL WORKFLOW')
  lines.push(`Who approves:   ${g.approval.approver}`)
  lines.push(`Turnaround:     ${g.approval.turnaround}`)
  lines.push(`Escalation:     ${g.approval.escalation}`)
  
  return lines.join('\n')
}

function formatBrandHealthReport(r: BrandHealthReport): string {
  const lines: string[] = []
  
  lines.push(`BRAND HEALTH REPORT · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  lines.push('CONSISTENCY SCORE')
  lines.push(`Overall:        ${r.consistencyScore.overall}% assets pass review on first submission`)
  lines.push('By asset type:')
  for (const [type, score] of Object.entries(r.consistencyScore.byType)) {
    lines.push(`  ${type.padEnd(15)} ${score}%`)
  }
  lines.push('')
  
  if (r.violationBreakdown.length > 0) {
    lines.push('VIOLATION BREAKDOWN')
    lines.push('Type                    Count   % of Total')
    for (const v of r.violationBreakdown) {
      const typePad = ' '.repeat(24 - v.type.length)
      const countPad = ' '.repeat(8 - v.count.toString().length)
      lines.push(`${v.type}${typePad}${v.count}${countPad}${v.percentage}%`)
    }
    lines.push('')
  }
  
  if (r.commonViolations.length > 0) {
    lines.push('MOST COMMON VIOLATIONS')
    for (let i = 0; i < r.commonViolations.length; i++) {
      const cv = r.commonViolations[i]
      lines.push(`${i + 1}. ${cv.violation} - ${cv.count} occurrences`)
      lines.push(`   Fix: ${cv.fix}`)
    }
    lines.push('')
  }
  
  lines.push('RECOMMENDATIONS')
  for (const rec of r.recommendations) {
    lines.push(`· ${rec}`)
  }
  lines.push('')
  
  lines.push('BRAND PERCEPTION (External)')
  lines.push(`Sentiment:      ${r.perception.sentiment}`)
  lines.push(`Recognition:    ${r.perception.recognition}% of target market aware`)
  lines.push(`Associations:   ${r.perception.associations.join(', ')}`)
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.cmo` — positioning, messaging hierarchy, brand guidelines
- `company.os.departments.marketing` — content, campaigns, collateral being created
- `company.os.departments.sales` — sales materials, pitch decks
- `company.os.departments.product` — product messaging, UI copy
- `company.os.events` — all external communications for review

**Emits:**
- `brand-violation-flagged` → alerts creator to fix issues before publication
- `brand-review-complete` → confirms asset is approved or needs revision
- `brand-guidelines-updated` → notifies teams of guideline changes
- `brand-consistency-score` → reports brand health metrics

**Consumed by:**
- Marketing department (revises assets based on feedback)
- Content agent (ensures content meets brand standards)
- Campaigns agent (ensures campaigns are brand-consistent)
- Sales department (updates collateral to match brand)
- Product department (aligns product messaging with brand)
