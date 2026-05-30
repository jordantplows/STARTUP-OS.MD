---
name: content-calendar
description: Generate 4-week content calendar with posts, pillar definitions, repurposing matrix, and distribution checklist
department: marketing
triggers: ["/startup-os marketing content"]
allowed-tools: [Read, Write, Bash]
reads:
  - brand/output/brand-brief-filled.md
  - marketing/output/gtm-strategy.md
writes:
  - marketing/output/content-calendar.md
---

## What this agent does

Reads GTM strategy and brand voice to generate a 4-week content calendar with date, platform, format, topic, hook, and CTA per post. Includes content pillar definitions, repurposing matrix showing how to turn 1 piece into 10, and distribution checklist. Writes to marketing/output/content-calendar.md.

## Instructions

1. Read brand brief and GTM strategy for voice, channels, and messaging
2. Call Claude API to generate:
   - 3-5 content pillar definitions aligned with messaging
   - 4-week content calendar (5-7 posts per week across platforms)
   - Repurposing matrix: 1 core asset → 10 derivative pieces
   - Distribution checklist per content type
3. Format as structured markdown with actionable detail
4. Write to marketing/output/content-calendar.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateContentCalendar() {
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

  // Generate content calendar via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are a content strategist. Based on this startup's brand and GTM strategy:

${context}

Generate a comprehensive content marketing plan with the following structure:

# Content Marketing Calendar

---

## Content Pillars

Define 3-5 content pillars that align with your messaging framework and support the buyer journey.

### Pillar 1: [Name]
**Purpose**: [Why this pillar exists - what stage of buyer journey it serves]
**Key Themes**: [3-5 specific topics within this pillar]
**Content Types**: [Best formats for this pillar - blog, video, case study, etc.]
**Target Personas**: [Which personas care most about this pillar]
**Success Metrics**: [How you'll measure if this content works]

### Pillar 2: [Name]
[Same structure]

### Pillar 3: [Name]
[Same structure]

### Pillar 4: [Name]
[Same structure]

### Pillar 5: [Name]
[Same structure]

---

## 4-Week Content Calendar

### Week 1 (Starting [Date])

#### Monday
**Platform**: [LinkedIn/Twitter/Blog/etc.]
**Format**: [Post type - carousel, thread, article, video, etc.]
**Pillar**: [Which content pillar]
**Topic**: [Specific topic/angle]
**Hook**: [Opening line or headline that grabs attention]
**Key Points**:
- [Point 1]
- [Point 2]
- [Point 3]
**CTA**: [Specific call to action]
**Time to Create**: [estimated hours]
**Status**: [ ] Not Started

---

#### Tuesday
**Platform**: [Platform]
**Format**: [Format]
**Pillar**: [Pillar]
**Topic**: [Topic]
**Hook**: [Hook]
**Key Points**:
- [Point 1]
- [Point 2]
- [Point 3]
**CTA**: [CTA]
**Time to Create**: [hours]
**Status**: [ ] Not Started

---

#### Wednesday
[Same structure for each day]

---

#### Thursday
[Same structure]

---

#### Friday
[Same structure]

---

[Continue for all 4 weeks with 5-7 posts per week = 20-28 total posts]

### Week 2 (Starting [Date])
[Full week of posts]

### Week 3 (Starting [Date])
[Full week of posts]

### Week 4 (Starting [Date])
[Full week of posts]

---

## Content Repurposing Matrix

**Concept**: Create 1 core asset, derive 10+ pieces from it

### Core Asset: [Example: In-Depth Blog Post / Webinar / Case Study]

#### Original Format
**Topic**: [Specific example topic]
**Length**: [word count or time]
**Platform**: [Where it lives]
**Effort**: [hours to create]

#### Repurposed Into:

1. **LinkedIn Carousel (10 slides)**
   - Pull 10 key insights, one per slide
   - Add data visualizations
   - Effort: 1 hour

2. **Twitter/X Thread (8-12 tweets)**
   - Thread format with key takeaways
   - Hook + 7-10 insights + CTA
   - Effort: 30 minutes

3. **Instagram Posts (3-5 quote cards)**
   - Pull most quotable lines
   - Design branded graphics
   - Effort: 1 hour

4. **Email Newsletter Section**
   - 200-word summary with link
   - 3 key takeaways in bullets
   - Effort: 20 minutes

5. **YouTube Short / TikTok / Reel**
   - 60-second video hitting main point
   - On-screen text + voiceover
   - Effort: 2 hours

6. **Podcast Episode or Audio Snippet**
   - Record 10-15 minute deep dive
   - Or pull 2-minute highlight clip
   - Effort: 1 hour

7. **Infographic**
   - Visualize data or framework
   - Shareable on all platforms
   - Effort: 2 hours

8. **Guest Article / Syndication**
   - Adapt for industry publication
   - Include backlinks
   - Effort: 1 hour editing

9. **LinkedIn Article**
   - Repost with platform-specific intro
   - Encourage comments and discussion
   - Effort: 15 minutes

10. **Slide Deck / Lead Magnet**
    - Expand into downloadable resource
    - Gate behind email capture
    - Effort: 2 hours

**Total New Pieces**: 10+ from 1 core asset
**Total Additional Time**: ~11 hours (vs. creating 10 from scratch = 40+ hours)

---

## Content Distribution Checklist

Use this checklist every time you publish content to maximize reach.

### Pre-Publication
- [ ] Content aligns with target keyword/topic
- [ ] Includes internal links to related content
- [ ] Has clear CTA
- [ ] Optimized for target platform (formatting, length, style)
- [ ] Images/media are sized correctly and compressed
- [ ] Preview text / meta description written
- [ ] Scheduled for optimal posting time

### Day 0 (Publication Day)
- [ ] Publish on primary platform
- [ ] Share to company social accounts (LinkedIn, Twitter, etc.)
- [ ] Post in relevant Slack/Discord communities
- [ ] Email to internal team (encourage engagement)
- [ ] Pin to top of profile if high priority
- [ ] Respond to early comments within first hour

### Days 1-2 (Amplification)
- [ ] Repurpose into 2-3 derivative formats
- [ ] Share in niche communities (Reddit, forums, industry groups)
- [ ] Tag relevant people/brands who are mentioned
- [ ] Cross-post to Medium, Dev.to, or other platforms
- [ ] Add to email newsletter (if weekly)
- [ ] Boost with paid promotion if performance warrants

### Days 3-7 (Sustained Engagement)
- [ ] Respond to all comments and questions
- [ ] Engage with others' content using similar themes
- [ ] Repurpose into additional formats (infographic, video)
- [ ] Pitch to newsletters or curated lists in your niche
- [ ] Update internal content calendar with performance notes

### Ongoing
- [ ] Monitor analytics (views, engagement, conversions)
- [ ] Update content if new info emerges (evergreen strategy)
- [ ] Link to content in future related pieces
- [ ] Repost top performers every 3-6 months

---

## Content Creation Workflows

### Blog Post Workflow
1. Research keywords and outline (1 hour)
2. Write first draft (2-3 hours)
3. Add data, examples, screenshots (1 hour)
4. Edit and optimize for SEO (1 hour)
5. Design header image (30 minutes)
6. Schedule and distribute (30 minutes)
**Total**: 6-7 hours

### Social Post Workflow (LinkedIn/Twitter)
1. Identify topic and key message (15 minutes)
2. Draft post copy (20 minutes)
3. Create visual if needed (30 minutes)
4. Schedule across platforms (10 minutes)
5. Engage with comments (15 minutes)
**Total**: 1.5 hours

### Video Content Workflow
1. Script writing (1 hour)
2. Record video (1-2 hours including retakes)
3. Edit and add graphics (2-3 hours)
4. Create thumbnail and description (30 minutes)
5. Upload and optimize (30 minutes)
6. Distribute clips across platforms (1 hour)
**Total**: 6-8 hours

### Case Study Workflow
1. Customer interview (1 hour)
2. Outline and first draft (2 hours)
3. Pull quotes and data (1 hour)
4. Customer review and approval (async)
5. Design layout (2 hours)
6. Create promotion materials (1 hour)
**Total**: 7 hours + approval time

---

## Platform-Specific Best Practices

### LinkedIn
- **Best Times**: Tuesday-Thursday, 9-11am
- **Optimal Length**: 150-200 words or 1200+ words for articles
- **Engagement Tactics**: Ask questions, use line breaks for readability, tag relevant people
- **Content Types**: Personal stories, industry insights, company updates, thought leadership

### Twitter/X
- **Best Times**: Monday-Friday, 9am-3pm
- **Optimal Length**: 100-280 characters for single tweets, 8-12 tweets for threads
- **Engagement Tactics**: Lead with hook, use numbered threads, add images/GIFs, engage in replies
- **Content Types**: Quick tips, hot takes, threads, live commentary, visual memes

### Blog
- **Best Times**: Tuesday-Thursday mornings
- **Optimal Length**: 1500-2500 words for SEO value
- **Engagement Tactics**: Clear H2/H3 structure, bullet points, images every 300 words, internal links
- **Content Types**: How-to guides, listicles, case studies, thought leadership, product updates

### YouTube
- **Best Times**: Thursday-Saturday, 2-4pm
- **Optimal Length**: 7-15 minutes (sweet spot for watch time)
- **Engagement Tactics**: Hook in first 10 seconds, pattern interrupts every 60 seconds, strong CTA at end
- **Content Types**: Tutorials, demos, interviews, behind-the-scenes, educational series

### Email Newsletter
- **Best Times**: Tuesday-Wednesday, 9-11am
- **Optimal Length**: 200-500 words (scannable)
- **Engagement Tactics**: Personal subject lines, preview text, clear sections, one primary CTA
- **Content Types**: Curated insights, original analysis, product updates, exclusive content

---

## Monthly Content Themes

### Month 1: [Theme Name]
**Focus**: [What this month emphasizes]
**Key Messages**: [2-3 core messages to reinforce]
**Content Mix**: [Ratio of content types - e.g., 40% educational, 30% social proof, 30% thought leadership]

### Month 2: [Theme Name]
[Same structure]

### Month 3: [Theme Name]
[Same structure]

---

## Content Performance Metrics

### Awareness Stage
- Impressions / Reach
- Page Views
- New Visitors
- Social Followers Growth
- Brand Search Volume

### Consideration Stage
- Engagement Rate (likes, comments, shares)
- Time on Page / Video Watch Time
- Content Downloads (lead magnets)
- Email Subscribers Added
- Return Visitors

### Conversion Stage
- CTR on CTAs
- Demo Requests from Content
- MQLs Attributed to Content
- Content-Assisted Conversions
- Sales Opportunities Influenced

### Goal Benchmarks (Adjust based on stage)
- **Blog**: 1,000+ monthly visitors by Month 3
- **LinkedIn**: 15% engagement rate on posts
- **Twitter**: 5% engagement rate, 2% CTR on links
- **Email**: 25%+ open rate, 3%+ CTR
- **Video**: 50%+ average view duration

---

Generated: ${new Date().toISOString().split('T')[0]}`
      }
    ]
  })

  // Extract content from response
  let contentCalendar = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      contentCalendar += block.text + '\n'
    }
  }

  if (!contentCalendar.trim()) {
    contentCalendar = 'Failed to generate content calendar'
  }

  // Write output
  const outputDir = join(projectRoot, 'marketing', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'content-calendar.md')
  writeFileSync(outputPath, contentCalendar, 'utf-8')

  console.log(`Content calendar generated successfully: ${outputPath}`)
  console.log(`\nCovered: 3-5 Content Pillars, 4-Week Calendar (20-28 posts), Repurposing Matrix (1→10), Distribution Checklist, Platform Best Practices, Performance Metrics`)
}

generateContentCalendar().catch(console.error)
```

## Output

Creates marketing/output/content-calendar.md with 3-5 content pillar definitions, complete 4-week content calendar (20-28 posts) with date/platform/format/topic/hook/CTA per post, repurposing matrix showing how to turn 1 core asset into 10+ pieces, comprehensive distribution checklist per content type, platform-specific best practices, and content performance metrics with benchmarks. Success requires reading brand and GTM inputs to align content with messaging and voice.
