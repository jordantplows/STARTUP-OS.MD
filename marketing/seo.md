---
name: seo
description: Use Claude with web search to find keyword opportunities, generate priority matrix, on-page checklist, technical SEO foundation, 90-day quick wins
department: marketing
triggers: ["/startup-os marketing seo"]
allowed-tools: [Read, Write, Bash]
reads:
  - brand/output/brand-brief-filled.md
  - marketing/output/gtm-strategy.md
writes:
  - marketing/output/seo-playbook.md
---

## What this agent does

Uses Claude API with web search to research keyword opportunities in your space. Generates keyword priority matrix ranked by volume × difficulty × business value, complete on-page SEO checklist, technical SEO foundation requirements, and 90-day quick wins roadmap. Writes to marketing/output/seo-playbook.md.

## Instructions

1. Read brand brief and GTM strategy to understand ICP, positioning, and target market
2. Call Claude API to:
   - Research keyword landscape using web search
   - Generate keyword priority matrix with volume, difficulty, business value scores
   - Create on-page SEO checklist
   - Define technical SEO foundation requirements
   - Build 90-day quick wins roadmap
3. Format as structured markdown with actionable tactics
4. Write to marketing/output/seo-playbook.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateSEOPlaybook() {
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

  // Generate SEO playbook via Claude API with web search
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are an SEO strategist. Based on this startup's brand and GTM strategy:

${context}

Generate a comprehensive SEO playbook with the following structure. Use your knowledge of SEO best practices and keyword research strategies to create actionable recommendations:

# SEO Playbook

---

## Executive Summary

**Primary Goal**: [Drive X organic visitors per month by Month 6]
**Target Audience**: [ICP from GTM strategy]
**Competitive Position**: [Current state and opportunity]
**Success Metrics**: [3-5 key metrics to track]

---

## Keyword Research & Strategy

### Keyword Priority Matrix

For each keyword cluster, score on:
- **Search Volume**: Monthly searches (High = 1000+, Medium = 100-1000, Low = <100)
- **SEO Difficulty**: Competition level (Low = 0-30, Medium = 30-60, High = 60+)
- **Business Value**: How well it aligns with ICP and intent (High/Medium/Low)
- **Priority Score**: Volume × Business Value ÷ Difficulty

#### Cluster 1: [Category/Theme]
| Keyword | Volume | Difficulty | Business Value | Priority Score | Intent |
|---------|--------|-----------|---------------|---------------|--------|
| [primary keyword] | [#] | [score] | High | [calculated] | Commercial |
| [long-tail variant 1] | [#] | [score] | High | [calculated] | Commercial |
| [long-tail variant 2] | [#] | [score] | Medium | [calculated] | Informational |
| [long-tail variant 3] | [#] | [score] | Medium | [calculated] | Commercial |

**Content Strategy**: [What type of content to create for this cluster]
**Target URLs**: [Which pages should target these keywords]

#### Cluster 2: [Category/Theme]
[Same table structure with 4-6 keywords]

#### Cluster 3: [Category/Theme]
[Same table structure]

#### Cluster 4: [Category/Theme]
[Same table structure]

#### Cluster 5: [Category/Theme]
[Same table structure]

[Include 5-8 total clusters]

---

### Keyword Categories by Funnel Stage

#### Top of Funnel (Awareness)
**Intent**: Educational, problem-aware but not solution-aware
**Volume**: High
**Competition**: Low-Medium
**Keywords**:
- [keyword 1] - [monthly searches]
- [keyword 2] - [monthly searches]
- [keyword 3] - [monthly searches]
**Content Types**: Guides, comparisons, educational blog posts

#### Middle of Funnel (Consideration)
**Intent**: Solution-aware, researching options
**Volume**: Medium
**Competition**: Medium
**Keywords**:
- [keyword 1] - [monthly searches]
- [keyword 2] - [monthly searches]
- [keyword 3] - [monthly searches]
**Content Types**: Comparison pages, use case articles, tool reviews

#### Bottom of Funnel (Decision)
**Intent**: Ready to buy, evaluating specific solutions
**Volume**: Low-Medium
**Competition**: High
**Keywords**:
- [keyword 1] - [monthly searches]
- [keyword 2] - [monthly searches]
- [keyword 3] - [monthly searches]
**Content Types**: Landing pages, pricing pages, product pages, "[competitor] alternative"

---

## On-Page SEO Checklist

Use this checklist for every page you optimize or create.

### Title Tag
- [ ] Includes primary keyword (preferably near the beginning)
- [ ] 50-60 characters (displays fully in search results)
- [ ] Compelling and click-worthy (not just keyword stuffing)
- [ ] Unique across all pages on site
- [ ] Includes brand name if space allows (e.g., "Keyword | Brand")

### Meta Description
- [ ] Includes primary keyword and related terms
- [ ] 150-160 characters (displays fully in search results)
- [ ] Compelling value proposition or call to action
- [ ] Unique across all pages
- [ ] Accurately summarizes page content

### URL Structure
- [ ] Includes primary keyword (lowercase, hyphens between words)
- [ ] Short and descriptive (< 60 characters ideal)
- [ ] No unnecessary parameters or session IDs
- [ ] Uses HTTPS
- [ ] Follows logical site hierarchy

### Header Tags (H1-H6)
- [ ] One H1 per page with primary keyword
- [ ] H2s for main sections (include related keywords)
- [ ] H3s for subsections (natural language, scannable)
- [ ] Logical hierarchy (H1 → H2 → H3, no skipping levels)
- [ ] Descriptive and help readers scan content

### Content Optimization
- [ ] Primary keyword appears in first 100 words
- [ ] Primary keyword density 1-2% (natural, not forced)
- [ ] 5-10 related keywords and synonyms naturally included
- [ ] Content is comprehensive (matches or exceeds top 3 competitors' length)
- [ ] Original insights, data, or examples (not just rehashed content)
- [ ] Updated with current information and dates
- [ ] Minimum 1,500 words for pillar content, 800+ for blog posts

### Internal Linking
- [ ] 3-5 internal links to related content
- [ ] Descriptive anchor text (not "click here")
- [ ] Links to higher authority pages (homepage, top resources)
- [ ] Receives internal links from other relevant pages
- [ ] No broken internal links

### Images & Media
- [ ] All images have descriptive alt text with keywords
- [ ] File names are descriptive (keyword-rich-image-name.jpg)
- [ ] Images compressed and optimized (< 100KB each)
- [ ] Uses next-gen formats (WebP) when possible
- [ ] Includes at least one original image (not stock)
- [ ] Video or interactive media if relevant to topic

### User Experience
- [ ] Clear, scannable formatting (short paragraphs, bullet points)
- [ ] Loads in < 3 seconds on mobile
- [ ] Mobile-responsive design
- [ ] Clear call-to-action above the fold
- [ ] No intrusive popups (especially on mobile)
- [ ] Easy navigation (breadcrumbs, related content)

### Schema Markup
- [ ] Article schema for blog posts
- [ ] Product schema for product pages
- [ ] FAQ schema if page has Q&A section
- [ ] Organization schema on homepage
- [ ] Breadcrumb schema if applicable
- [ ] Review schema if applicable

---

## Technical SEO Foundation

### Site Architecture
**Goal**: Create crawlable, logical site structure that distributes link equity

#### Critical Requirements
- [ ] **XML Sitemap**: Submit to Google Search Console and Bing Webmaster Tools
- [ ] **Robots.txt**: Properly configured to allow crawling of important pages
- [ ] **Site Speed**: Core Web Vitals passing (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] **Mobile-First**: Fully responsive, mobile-friendly design
- [ ] **HTTPS**: SSL certificate installed, all pages secure
- [ ] **Canonical Tags**: Prevent duplicate content issues
- [ ] **404 Page**: Custom, helpful 404 page with navigation

#### Site Structure Best Practices
- Homepage → Category Pages → Individual Pages (max 3 clicks to any page)
- Breadcrumb navigation on all pages
- Clear category hierarchy
- Pagination implemented correctly (rel="next"/"prev" or load more)

### Crawl Optimization
- [ ] No orphaned pages (every page linked from at least one other page)
- [ ] Clean URL structure (no excessive parameters)
- [ ] Redirect chains resolved (301 redirects go directly to final destination)
- [ ] No redirect loops
- [ ] Broken links identified and fixed (use Screaming Frog or Sitebulb)
- [ ] Crawl budget optimized (block admin, duplicate, low-value pages)

### Indexing
- [ ] All important pages indexed (check via site:yourdomain.com in Google)
- [ ] No accidental noindex tags on important pages
- [ ] Duplicate content identified and resolved (canonical tags or 301 redirects)
- [ ] Pagination handled correctly
- [ ] International/multilingual setup if applicable (hreflang tags)

### Core Web Vitals Optimization
- [ ] **Largest Contentful Paint (LCP)**: < 2.5 seconds
  - Optimize server response time
  - Eliminate render-blocking resources
  - Use CDN for images and assets
- [ ] **First Input Delay (FID)**: < 100 milliseconds
  - Minimize JavaScript execution time
  - Use web workers for heavy computations
  - Break up long tasks
- [ ] **Cumulative Layout Shift (CLS)**: < 0.1
  - Set explicit width/height for images and embeds
  - Avoid inserting content above existing content
  - Use CSS aspect-ratio

### Tools to Use
- **Google Search Console**: Monitor indexing, rankings, errors
- **Google PageSpeed Insights**: Check Core Web Vitals
- **Screaming Frog**: Crawl site and identify technical issues
- **Ahrefs/Semrush**: Backlink analysis and keyword tracking
- **GTmetrix**: Detailed performance analysis

---

## Content Strategy

### Content Hub Model

#### Pillar Page (Hub)
**Topic**: [Broad topic you want to rank for]
**URL**: /resources/[topic]
**Word Count**: 3,000-5,000 words
**Purpose**: Comprehensive overview of topic, linking to all related subtopic pages
**Target Keyword**: [high-volume, high-competition keyword]

#### Cluster Pages (Spokes)
**Cluster 1**: [Subtopic 1]
- URL: /resources/[topic]/[subtopic-1]
- Word Count: 1,500-2,000
- Target Keyword: [related long-tail keyword]
- Link to pillar page and related cluster pages

**Cluster 2**: [Subtopic 2]
[Same structure]

**Cluster 3**: [Subtopic 3]
[Same structure]

[Define 2-3 pillar pages with 5-8 cluster pages each]

---

### Blog Content Plan

#### Month 1: Foundation
**Week 1**:
- [ ] [Blog post title] - [target keyword] - [word count]
- [ ] [Blog post title] - [target keyword] - [word count]

**Week 2**:
- [ ] [Blog post title] - [target keyword] - [word count]
- [ ] [Blog post title] - [target keyword] - [word count]

**Week 3**:
- [ ] [Blog post title] - [target keyword] - [word count]
- [ ] [Blog post title] - [target keyword] - [word count]

**Week 4**:
- [ ] [Blog post title] - [target keyword] - [word count]
- [ ] [Blog post title] - [target keyword] - [word count]

#### Month 2: Scale
[8-10 blog posts with topics and keywords]

#### Month 3: Optimize
[8-10 blog posts, plus update/optimize Month 1 posts]

---

## Link Building Strategy

### Tier 1: Foundational Links (Low Effort, High Control)
**Goal**: Establish baseline authority

- [ ] **Business Directories**: Google Business Profile, Yelp, industry-specific directories
- [ ] **Social Profiles**: LinkedIn, Twitter, Facebook, Instagram (complete profiles with website links)
- [ ] **Review Sites**: G2, Capterra, TrustPilot (if applicable)
- [ ] **Local Citations**: Chamber of commerce, local business associations (if local)
- [ ] **Partner/Customer Logos**: Get listed on partner/integration pages

**Timeline**: Complete in first 2 weeks
**Expected Links**: 10-20

### Tier 2: Content-Driven Links (Medium Effort, High Value)
**Goal**: Earn links through valuable content

- [ ] **Original Research/Data**: Publish industry survey or data analysis others will cite
- [ ] **Ultimate Guides**: Comprehensive resources that become go-to references
- [ ] **Tools & Calculators**: Free tools that attract links naturally
- [ ] **Infographics**: Shareable visual content with embed code
- [ ] **Case Studies**: Detailed success stories partners/customers will share

**Timeline**: One major asset per month
**Expected Links**: 5-10 per asset over time

### Tier 3: Outreach & Relationships (High Effort, High Value)
**Goal**: Build relationships that generate ongoing links

- [ ] **Guest Posting**: Write for industry blogs (link in author bio or content)
- [ ] **Podcast Appearances**: Get featured on relevant podcasts (show notes link)
- [ ] **Expert Roundups**: Contribute quotes to roundup articles
- [ ] **HARO (Help A Reporter Out)**: Respond to journalist queries
- [ ] **Broken Link Building**: Find broken links on relevant sites, suggest your content
- [ ] **Resource Page Link Building**: Get added to curated resource lists

**Timeline**: 2-4 outreach campaigns per month
**Expected Links**: 3-5 per month

### Link Quality Checklist
- [ ] Domain Authority (DA) > 30 (Ahrefs/Moz)
- [ ] Relevant to your industry/topic
- [ ] Real organic traffic (not a link farm)
- [ ] Dofollow link (nofollow has limited value)
- [ ] Contextual (in body content, not footer/sidebar)

---

## Local SEO (If Applicable)

### Google Business Profile Optimization
- [ ] Claim and verify listing
- [ ] Complete all profile sections (description, hours, categories, attributes)
- [ ] Add high-quality photos (logo, cover, interior, team, products)
- [ ] Collect and respond to reviews regularly
- [ ] Post updates weekly (offers, events, news)
- [ ] Use Google Q&A to address common questions

### Local Citations
- [ ] NAP (Name, Address, Phone) consistent across all platforms
- [ ] Listed in top 10 local directories (Yelp, Yellow Pages, etc.)
- [ ] Industry-specific directories
- [ ] Chamber of commerce and local business associations

### Location Pages (If Multi-Location)
- [ ] Unique content for each location (not templated)
- [ ] Embedded Google Map
- [ ] Local testimonials and photos
- [ ] Location-specific keywords

---

## 90-Day Quick Wins Roadmap

### Days 1-30: Foundation & Quick Fixes

#### Week 1: Technical Audit
- [ ] Run technical SEO audit (Screaming Frog or Sitebulb)
- [ ] Fix critical errors (broken links, missing title tags, duplicate content)
- [ ] Set up Google Search Console and Analytics if not already done
- [ ] Submit XML sitemap to search engines
- [ ] Install and configure SEO plugin (Yoast, Rank Math, etc.)

#### Week 2: On-Page Optimization
- [ ] Optimize homepage (title, meta, H1, content)
- [ ] Optimize top 5 landing pages
- [ ] Add schema markup to key pages
- [ ] Improve internal linking (add 3-5 internal links to each page)
- [ ] Compress and optimize all images

#### Week 3: Content Creation Begins
- [ ] Publish first pillar page (3,000+ words)
- [ ] Publish 2 blog posts targeting low-competition keywords
- [ ] Set up content hub structure
- [ ] Create content calendar for next 60 days

#### Week 4: Link Building Kickoff
- [ ] Complete all Tier 1 foundational links
- [ ] Identify 10 guest posting opportunities
- [ ] Create link building tracker (spreadsheet or tool)
- [ ] Begin first outreach campaign

**Month 1 Goal**: Fix technical issues, optimize existing pages, publish 3-5 pieces of new content, secure 10-20 foundational links

---

### Days 31-60: Content Production & Link Building

#### Week 5
- [ ] Publish 2-3 blog posts
- [ ] Build 5-8 links (guest posts, outreach, directories)
- [ ] Update and optimize 2 old blog posts
- [ ] Monitor rankings and traffic in GSC

#### Week 6
- [ ] Publish second pillar page
- [ ] Launch first link magnet asset (tool, research, infographic)
- [ ] Pitch link magnet to 20+ relevant sites
- [ ] Engage in 2-3 online communities (Reddit, forums)

#### Week 7
- [ ] Publish 2-3 blog posts
- [ ] Build 5-8 links
- [ ] Create FAQ schema for relevant pages
- [ ] Conduct competitor backlink analysis (find link opportunities)

#### Week 8
- [ ] Publish 2-3 blog posts
- [ ] Build 5-8 links
- [ ] Review Month 1 content performance, optimize top performers
- [ ] Set Month 3 goals based on data

**Month 2 Goal**: Publish 10-12 new pieces of content, secure 20-30 new links, see first ranking improvements for low-competition keywords

---

### Days 61-90: Scale & Optimize

#### Week 9
- [ ] Publish 3 blog posts
- [ ] Build 8-10 links
- [ ] Launch second link magnet asset
- [ ] Begin tracking featured snippet opportunities

#### Week 10
- [ ] Publish third pillar page
- [ ] Build 8-10 links
- [ ] Optimize pages currently ranking positions 11-20 (quick wins)
- [ ] Update old content with new data/examples

#### Week 11
- [ ] Publish 3 blog posts
- [ ] Build 8-10 links
- [ ] Conduct full content audit (what's working, what's not)
- [ ] Plan content strategy for Month 4

#### Week 12
- [ ] Publish 3 blog posts
- [ ] Build 8-10 links
- [ ] Quarter 1 SEO review: rankings, traffic, conversions
- [ ] Set Q2 SEO OKRs

**Month 3 Goal**: Publish 12-15 new pieces of content, secure 30-40 new links, rank for 5-10 low-competition keywords, see measurable organic traffic growth

---

## Performance Tracking

### Key Metrics to Monitor

#### Weekly
- Keyword rankings (top 20 target keywords)
- Organic traffic (Google Analytics)
- Indexed pages (Google Search Console)
- New backlinks (Ahrefs/Semrush)
- Core Web Vitals scores

#### Monthly
- Organic traffic growth (MoM %)
- Keyword ranking improvements
- Total indexed pages
- Domain authority / Domain rating
- Conversion rate from organic traffic
- Top performing content (pages driving most traffic/conversions)

#### Quarterly
- Overall organic visibility
- Market share of voice (share of rankings vs. competitors)
- Backlink profile growth
- Content ROI (traffic and conversions per piece)
- Technical SEO score

### Success Benchmarks

**Month 3**:
- 10+ keywords ranking in top 50
- 3-5 keywords in top 20
- 500+ organic visitors/month
- 20+ indexed content pages
- 50+ referring domains

**Month 6**:
- 30+ keywords ranking in top 50
- 10+ keywords in top 20
- 3-5 keywords in top 10
- 2,000+ organic visitors/month
- 50+ indexed content pages
- 100+ referring domains

**Month 12**:
- 100+ keywords ranking in top 50
- 30+ keywords in top 20
- 10+ keywords in top 10
- 10,000+ organic visitors/month
- 100+ indexed content pages
- 250+ referring domains

---

## Tools & Resources

### Essential SEO Tools
- **Google Search Console** (free): Monitor indexing, rankings, clicks
- **Google Analytics 4** (free): Track traffic, user behavior, conversions
- **Ahrefs or Semrush** ($99-199/mo): Keyword research, backlink analysis, rank tracking
- **Screaming Frog** (free up to 500 URLs): Technical SEO audit
- **PageSpeed Insights** (free): Core Web Vitals and performance
- **Yoast or Rank Math** (free + premium): On-page optimization plugin

### Helpful Resources
- Google's SEO Starter Guide
- Ahrefs Blog / Backlinko (SEO education)
- Search Engine Journal (industry news)
- Google Search Central (official updates)

---

Generated: ${new Date().toISOString().split('T')[0]}`
      }
    ]
  })

  // Extract content from response
  let seoPlaybook = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      seoPlaybook += block.text + '\n'
    }
  }

  if (!seoPlaybook.trim()) {
    seoPlaybook = 'Failed to generate SEO playbook'
  }

  // Write output
  const outputDir = join(projectRoot, 'marketing', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'seo-playbook.md')
  writeFileSync(outputPath, seoPlaybook, 'utf-8')

  console.log(`SEO playbook generated successfully: ${outputPath}`)
  console.log(`\nCovered: Keyword Priority Matrix (volume × difficulty × business value), On-Page SEO Checklist, Technical SEO Foundation, Link Building Strategy, 90-Day Quick Wins Roadmap`)
}

generateSEOPlaybook().catch(console.error)
```

## Output

Creates marketing/output/seo-playbook.md with keyword priority matrix scored by volume × difficulty × business value across 5-8 keyword clusters, complete on-page SEO checklist for every page, technical SEO foundation requirements (site architecture, crawl optimization, Core Web Vitals), link building strategy across 3 tiers, and 90-day quick wins roadmap broken down week-by-week with specific tactics and success benchmarks. Success requires reading brand and GTM inputs to research relevant keyword opportunities and create actionable SEO strategy.
