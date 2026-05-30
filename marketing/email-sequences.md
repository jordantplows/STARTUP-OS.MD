---
name: email-sequences
description: Generate 5 complete email sequences with subject lines, preview text, body copy, and CTAs
department: marketing
triggers: ["/startup-os marketing email"]
allowed-tools: [Read, Write, Bash]
reads:
  - brand/output/brand-brief-filled.md
  - marketing/output/gtm-strategy.md
writes:
  - marketing/output/email-sequences.md
---

## What this agent does

Reads brand voice-and-tone and GTM strategy to generate 5 complete email sequences: Welcome (5 emails), Onboarding (5 emails), Activation (3 emails), Re-engagement (3 emails), and Sales outreach (5 emails). Each email includes subject line with 3 variants, preview text, full body copy, and clear CTA. Writes to marketing/output/email-sequences.md.

## Instructions

1. Read brand brief and GTM strategy for voice, positioning, and persona insights
2. Call Claude API to generate all 5 sequences with:
   - Subject line (3 variants: A/B/C for testing)
   - Preview text
   - Full email body (formatted for plain text + HTML)
   - Primary CTA with specific copy
   - Send timing (days after trigger event)
3. Ensure emails match brand voice and persona-specific messaging
4. Write to marketing/output/email-sequences.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateEmailSequences() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()

  // Read input files
  let brandBrief = ''
  let gtmStrategy = ''

  try {
    brandBrief = readFileSync(join(projectRoot, 'brand', 'output', 'brand-brief-filled.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: brand-brief-filled.md not found')
  }

  try {
    gtmStrategy = readFileSync(join(projectRoot, 'marketing', 'output', 'gtm-strategy.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: gtm-strategy.md not found')
  }

  const context = `
# Brand Brief
${brandBrief}

# GTM Strategy
${gtmStrategy}
  `.trim()

  // Generate email sequences via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are an email marketing expert. Based on this startup's brand and GTM strategy:

${context}

Generate 5 complete email sequences following this exact structure:

# Email Marketing Sequences

---

## Sequence 1: Welcome Series (5 emails)

**Trigger**: User signs up / subscribes to email list
**Goal**: Introduce brand, build trust, set expectations, guide to first value moment

### Email 1: Welcome & Set Expectations
**Send**: Immediately after signup
**Subject Line A**: [Friendly, enthusiastic, sets expectation]
**Subject Line B**: [Curiosity-driven variant]
**Subject Line C**: [Value-forward variant]
**Preview Text**: [50-70 characters that complement subject line]

**Body**:
[Write full email body, 150-250 words. Include:]
- Warm welcome
- Quick context on what they signed up for
- What to expect (frequency, content type)
- One clear next step
- Signature from founder or team

**CTA**: [Button text] → [Destination]

---

### Email 2: Origin Story / Why We Built This
**Send**: Day 2
**Subject Line A**: [Personal angle]
**Subject Line B**: [Problem-focused]
**Subject Line C**: [Mission-driven]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 200-300 words. Include:]
- Brief founder story or company origin
- The problem that sparked the solution
- Who this is built for
- Early wins or social proof
- Soft CTA to engage

**CTA**: [Button text] → [Destination]

---

### Email 3: How [Product] Works / Quick Win
**Send**: Day 4
**Subject Line A**: [Outcome-focused]
**Subject Line B**: [How-to angle]
**Subject Line C**: [Time-saving angle]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 200-300 words. Include:]
- Simple explanation of core value prop
- 3-step process or key feature highlight
- Quick win they can achieve today
- Link to resources (demo, tutorial, docs)

**CTA**: [Button text] → [Destination]

---

### Email 4: Social Proof & Use Cases
**Send**: Day 7
**Subject Line A**: [Customer success angle]
**Subject Line B**: [Specific use case]
**Subject Line C**: [Metric/result-driven]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 200-300 words. Include:]
- Brief customer success story or testimonial
- Specific use case relevant to their persona
- Quantifiable results
- "You could do this too" positioning

**CTA**: [Button text] → [Destination]

---

### Email 5: Next Steps & Engagement
**Send**: Day 10
**Subject Line A**: [Action-oriented]
**Subject Line B**: [Community/support angle]
**Subject Line C**: [Personalization angle]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 150-250 words. Include:]
- Recap of series
- Multiple engagement options (demo, content, community)
- Invitation to reply with questions
- Offer to help or personalize experience

**CTA**: [Button text] → [Destination]

---

## Sequence 2: Onboarding Series (5 emails)

**Trigger**: User signs up for product / starts trial
**Goal**: Drive activation, ensure successful first use, reduce time-to-value

### Email 1: Get Started Now
**Send**: Immediately after signup
**Subject Line A**: [Urgency + value]
**Subject Line B**: [Simple next step]
**Subject Line C**: [Time-to-value promise]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 150-200 words. Include:]
- Confirmation and enthusiasm
- One critical first step to take
- Expected time investment
- Link to getting started guide
- Support contact info

**CTA**: [Button text] → [Destination]

---

### Email 2: Your First [Core Action]
**Send**: 24 hours after signup
**Subject Line A**: [Achievement-focused]
**Subject Line B**: [Helpful tip angle]
**Subject Line C**: [Common mistake avoidance]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 200-250 words. Include:]
- Guide to completing core activation action
- Why this matters for their success
- Step-by-step with screenshots or video link
- Common pitfalls to avoid

**CTA**: [Button text] → [Destination]

---

### Email 3: Unlock [Key Feature]
**Send**: Day 3
**Subject Line A**: [Feature benefit]
**Subject Line B**: [Power user angle]
**Subject Line C**: [Time-saving tip]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 200-250 words. Include:]
- Introduction to second most important feature
- Use case showing why it matters
- Quick tutorial or best practice
- Encouragement to explore

**CTA**: [Button text] → [Destination]

---

### Email 4: You're Making Progress
**Send**: Day 5
**Subject Line A**: [Milestone celebration]
**Subject Line B**: [Next level unlock]
**Subject Line C**: [Personalized progress]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 150-200 words. Include:]
- Acknowledge actions they've taken
- Show progress toward full activation
- Introduce advanced feature or workflow
- Offer to help if stuck

**CTA**: [Button text] → [Destination]

---

### Email 5: Become a Power User
**Send**: Day 7
**Subject Line A**: [Mastery angle]
**Subject Line B**: [Hidden gem reveal]
**Subject Line C**: [Efficiency boost]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 200-250 words. Include:]
- Advanced tips and tricks
- Integration or workflow optimization
- Community or resource links
- Invitation to upgrade (if freemium)

**CTA**: [Button text] → [Destination]

---

## Sequence 3: Activation Series (3 emails)

**Trigger**: User signed up but hasn't completed core activation action
**Goal**: Nudge toward activation, remove friction, offer help

### Email 1: We Noticed You Haven't [Action] Yet
**Send**: 3 days after signup with no activation
**Subject Line A**: [Helpful, non-pushy]
**Subject Line B**: [Remove friction]
**Subject Line C**: [Quick value reminder]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 150-200 words. Include:]
- Gentle observation (not shame)
- Remind them of value they're missing
- Offer to help or answer questions
- Simplify the first step

**CTA**: [Button text] → [Destination]

---

### Email 2: Here's How Others Got Started
**Send**: 6 days after signup with no activation
**Subject Line A**: [Social proof angle]
**Subject Line B**: [Step-by-step help]
**Subject Line C**: [Common blocker removal]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 200-250 words. Include:]
- Quick customer success story
- Common reasons people get stuck
- Simple 3-step activation process
- Offer 1-on-1 help or demo

**CTA**: [Button text] → [Destination]

---

### Email 3: Last Chance to [Benefit]
**Send**: 10 days after signup with no activation
**Subject Line A**: [FOMO angle]
**Subject Line B**: [Direct value reminder]
**Subject Line C**: [Trial expiration if applicable]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 150-200 words. Include:]
- Clear statement of what they're missing out on
- Time-sensitive element if applicable
- Final offer to help personally
- Easy opt-out if not interested

**CTA**: [Button text] → [Destination]

---

## Sequence 4: Re-engagement Series (3 emails)

**Trigger**: User was active but hasn't logged in for 30+ days
**Goal**: Win back inactive users, understand churn reasons, offer path back

### Email 1: We Miss You
**Send**: 30 days after last activity
**Subject Line A**: [Personal, emotional]
**Subject Line B**: [New feature announcement]
**Subject Line C**: ["What happened?" angle]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 150-200 words. Include:]
- Acknowledge absence without guilt
- Highlight what's new since they left
- Ask if there's something we can improve
- Easy path back

**CTA**: [Button text] → [Destination]

---

### Email 2: Here's What You've Missed
**Send**: 45 days after last activity
**Subject Line A**: [Update/changelog angle]
**Subject Line B**: [Specific new value]
**Subject Line C**: [Community growth]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 200-250 words. Include:]
- 3-5 significant updates or improvements
- New social proof or traction
- Invitation to come back and try new features
- Reminder of their previous investment

**CTA**: [Button text] → [Destination]

---

### Email 3: One Last Thing Before You Go
**Send**: 60 days after last activity
**Subject Line A**: [Breakup email angle]
**Subject Line B**: [Final offer]
**Subject Line C**: [Feedback request]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 150-200 words. Include:]
- Respect their decision to leave
- Ask for feedback (1-question survey)
- Special offer or incentive to return (if appropriate)
- Easy unsubscribe option

**CTA**: [Button text] → [Destination]

---

## Sequence 5: Sales Outreach Series (5 emails)

**Trigger**: Manual outreach to qualified prospect (cold or warm)
**Goal**: Start conversation, book demo, move prospect into sales pipeline

### Email 1: Personalized Introduction
**Send**: Day 0 (initial outreach)
**Subject Line A**: [Mutual connection or relevant trigger]
**Subject Line B**: [Specific pain point]
**Subject Line C**: [Provocative question]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 100-150 words. Include:]
- Personalized first line (research-based)
- Clear relevance statement (why you're reaching out)
- One compelling insight or value statement
- Soft ask (reply, not demo)

**CTA**: [Question to prompt reply]

---

### Email 2: Value-Add Follow-up
**Send**: Day 3 (if no reply)
**Subject Line A**: [Helpful resource]
**Subject Line B**: [Industry insight]
**Subject Line C**: [Specific use case]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 150-200 words. Include:]
- Share valuable resource (article, case study, tool)
- Tie resource to their specific challenge
- No ask, just value
- PS with soft follow-up question

**CTA**: [Link to resource]

---

### Email 3: Social Proof & Case Study
**Send**: Day 7 (if no reply)
**Subject Line A**: [Company name or result]
**Subject Line B**: [Metric-driven]
**Subject Line C**: ["How [Similar Company] Did X"]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 150-200 words. Include:]
- Brief case study of similar customer
- Specific results and timeline
- Relevance to their situation
- Offer to discuss applicability

**CTA**: [Question or meeting link]

---

### Email 4: Breakup Email
**Send**: Day 14 (if no reply)
**Subject Line A**: ["Should I stay or should I go?"]
**Subject Line B**: [Assume not interested]
**Subject Line C**: [Direct question]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 75-100 words. Include:]
- Acknowledge no response
- Assume they're not interested
- Give clear opt-out
- Leave door open for future

**CTA**: [Simple yes/no or unsubscribe]

---

### Email 5: Re-engagement (if they reply to #4)
**Send**: Immediately after response
**Subject Line A**: [Enthusiastic re-engagement]
**Subject Line B**: [Next step confirmation]
**Subject Line C**: [Time-specific]
**Preview Text**: [50-70 characters]

**Body**:
[Write full email body, 100-150 words. Include:]
- Thanks for responding
- Acknowledge timing or context
- Propose specific next step
- Make scheduling easy

**CTA**: [Calendar link or specific time options]

---

## Email Copywriting Guidelines

### Voice & Tone Principles
- [Extract 3-5 key voice/tone principles from brand brief]

### Formatting Best Practices
- Keep paragraphs to 2-3 lines max
- Use bullet points for scanability
- Bold key phrases sparingly
- One clear CTA per email
- Mobile-first formatting

### Subject Line Testing
- A variant: [describe approach]
- B variant: [describe approach]
- C variant: [describe approach]

### Personalization Tokens
- {{firstName}}: First name
- {{companyName}}: Company name
- {{productName}}: Product or feature name
- {{specificAction}}: Action they took or should take
- {{daysInTrial}}: Trial day count

---

Generated: ${new Date().toISOString().split('T')[0]}`
      }
    ]
  })

  // Extract content from response
  let emailSequences = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      emailSequences += block.text + '\n'
    }
  }

  if (!emailSequences.trim()) {
    emailSequences = 'Failed to generate email sequences'
  }

  // Write output
  const outputDir = join(projectRoot, 'marketing', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'email-sequences.md')
  writeFileSync(outputPath, emailSequences, 'utf-8')

  console.log(`Email sequences generated successfully: ${outputPath}`)
  console.log(`\nCovered: Welcome (5), Onboarding (5), Activation (3), Re-engagement (3), Sales Outreach (5) - Total 21 emails with subject variants, preview text, body, and CTAs`)
}

generateEmailSequences().catch(console.error)
```

## Output

Creates marketing/output/email-sequences.md with 5 complete email sequences totaling 21 emails: Welcome series (5 emails), Onboarding series (5 emails), Activation series (3 emails), Re-engagement series (3 emails), and Sales outreach series (5 emails). Each email includes 3 subject line variants, preview text, full body copy in brand voice, and clear CTA with timing instructions. Success requires reading brand and GTM inputs to match voice and messaging.
