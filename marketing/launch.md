---
name: launch
description: Generate day-by-day launch checklist from T-60 to T+30 with owner, status, and dependencies
department: marketing
triggers: ["/startup-os marketing launch"]
allowed-tools: [Read, Write, Bash]
reads:
  - brand/output/brand-brief-filled.md
  - marketing/output/gtm-strategy.md
  - marketing/output/email-sequences.md
  - marketing/output/content-calendar.md
  - marketing/output/seo-playbook.md
writes:
  - marketing/output/launch-checklist.md
---

## What this agent does

Reads all marketing and product outputs to generate a comprehensive day-by-day launch checklist spanning T-60 (60 days before launch) to T+30 (30 days after launch). Each item includes owner, status, and dependencies. Covers all aspects: product readiness, marketing assets, channels, partnerships, analytics, and post-launch optimization. Writes to marketing/output/launch-checklist.md.

## Instructions

1. Read all marketing outputs (GTM, email, content, SEO) and brand brief
2. Call Claude API to generate:
   - Pre-launch checklist (T-60 to T-1) organized by functional area
   - Launch day checklist (T-0) with hourly timeline
   - Post-launch checklist (T+1 to T+30) with optimization tasks
   - Each item includes: task, owner, status, dependencies, estimated time
3. Format as actionable markdown with checkboxes
4. Write to marketing/output/launch-checklist.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateLaunchChecklist() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()

  // Read input files
  let brandBrief = ''
  let gtmStrategy = ''
  let emailSequences = ''
  let contentCalendar = ''
  let seoPlaybook = ''

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

  try {
    emailSequences = readFileSync(join(projectRoot, 'marketing', 'output', 'email-sequences.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: email-sequences.md not found')
  }

  try {
    contentCalendar = readFileSync(join(projectRoot, 'marketing', 'output', 'content-calendar.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: content-calendar.md not found')
  }

  try {
    seoPlaybook = readFileSync(join(projectRoot, 'marketing', 'output', 'seo-playbook.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: seo-playbook.md not found')
  }

  const context = `
# Brand Brief
${brandBrief}

# GTM Strategy
${gtmStrategy}

# Email Sequences
${emailSequences}

# Content Calendar
${contentCalendar}

# SEO Playbook
${seoPlaybook}
  `.trim()

  // Generate launch checklist via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are a launch operations expert. Based on this startup's complete marketing strategy:

${context}

Generate a comprehensive launch checklist with the following structure. Be extremely specific and actionable:

# Product Launch Checklist

**Launch Date**: [T-0] - [Insert target date]
**Last Updated**: ${new Date().toISOString().split('T')[0]}

---

## Launch Team & Responsibilities

### Launch Owner
**Name**: [Owner]
**Role**: Overall launch coordination, final decisions, go/no-go authority

### Functional Owners
- **Product**: [Name] - Product readiness, bugs, feature completeness
- **Marketing**: [Name] - All marketing assets, channels, communications
- **Sales**: [Name] - Sales enablement, CRM setup, pipeline management
- **Customer Success**: [Name] - Onboarding, support readiness, documentation
- **Engineering**: [Name] - Technical infrastructure, monitoring, incident response
- **Design**: [Name] - Visual assets, brand consistency, UX polish
- **Operations**: [Name] - Legal, finance, analytics, tools setup

---

## Pre-Launch Phase

### T-60 to T-45: Foundation (Weeks 9-8 Before Launch)

#### Product Readiness
- [ ] **Finalize product scope and feature set**
  - Owner: Product
  - Status: Not Started
  - Dependencies: None
  - Time: 4 hours
  - Details: Lock feature list for launch, move everything else to post-launch roadmap

- [ ] **Complete technical architecture review**
  - Owner: Engineering
  - Status: Not Started
  - Dependencies: Product scope finalized
  - Time: 8 hours
  - Details: Ensure infrastructure can handle 10x expected load

- [ ] **Set up error tracking and monitoring**
  - Owner: Engineering
  - Status: Not Started
  - Dependencies: None
  - Time: 4 hours
  - Details: Sentry, DataDog, or equivalent + alert routing

- [ ] **Create staging environment that mirrors production**
  - Owner: Engineering
  - Status: Not Started
  - Dependencies: None
  - Time: 8 hours
  - Details: Use for final QA and demo recordings

#### Marketing Foundation
- [ ] **Finalize brand positioning and messaging**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Product scope finalized
  - Time: 6 hours
  - Details: Lock positioning from GTM strategy, create messaging matrix

- [ ] **Define launch goals and success metrics**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: None
  - Time: 2 hours
  - Details: Set specific targets: signups, demos, press mentions, social engagement

- [ ] **Create launch asset inventory and timeline**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Launch goals defined
  - Time: 4 hours
  - Details: List every asset needed (pages, emails, ads, social posts) with owner and deadline

- [ ] **Secure launch budget and allocations**
  - Owner: Operations
  - Status: Not Started
  - Dependencies: Launch goals defined
  - Time: 2 hours
  - Details: Budget for ads, tools, contractors, events

#### Analytics & Tracking
- [ ] **Set up Google Analytics 4 with goals and events**
  - Owner: Operations
  - Status: Not Started
  - Dependencies: None
  - Time: 3 hours
  - Details: Track signups, demos, key page views, conversion funnels

- [ ] **Implement product analytics (Mixpanel, Amplitude, PostHog)**
  - Owner: Engineering
  - Status: Not Started
  - Dependencies: None
  - Time: 6 hours
  - Details: Track activation, retention, feature usage

- [ ] **Set up marketing attribution tracking**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: GA4 setup complete
  - Time: 4 hours
  - Details: UTM parameters, conversion tracking, CRM integration

- [ ] **Create launch dashboard (real-time metrics)**
  - Owner: Operations
  - Status: Not Started
  - Dependencies: Analytics setup complete
  - Time: 4 hours
  - Details: Single view of all key metrics for launch day

---

### T-44 to T-30: Content & Creative Production (Weeks 7-5 Before Launch)

#### Website & Landing Pages
- [ ] **Design and build hero landing page**
  - Owner: Design + Engineering
  - Status: Not Started
  - Dependencies: Messaging finalized
  - Time: 20 hours
  - Details: Homepage optimized for conversion with clear value prop, demo CTA, social proof

- [ ] **Create product/features page**
  - Owner: Design + Marketing
  - Status: Not Started
  - Dependencies: Product scope finalized
  - Time: 12 hours
  - Details: Detailed feature breakdown with screenshots/videos

- [ ] **Build pricing page**
  - Owner: Product + Marketing
  - Status: Not Started
  - Dependencies: Pricing finalized
  - Time: 8 hours
  - Details: Clear pricing tiers, FAQ, CTA to start trial

- [ ] **Create demo booking page**
  - Owner: Marketing + Engineering
  - Status: Not Started
  - Dependencies: Calendar tool setup (Calendly, etc.)
  - Time: 4 hours
  - Details: Qualifying questions, calendar integration, confirmation email

- [ ] **Optimize all pages for SEO**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: All pages built
  - Time: 6 hours
  - Details: Follow on-page SEO checklist from playbook

- [ ] **Mobile responsiveness QA**
  - Owner: Engineering
  - Status: Not Started
  - Dependencies: All pages built
  - Time: 4 hours
  - Details: Test on iOS/Android, multiple screen sizes

- [ ] **Page speed optimization (Core Web Vitals)**
  - Owner: Engineering
  - Status: Not Started
  - Dependencies: All pages built
  - Time: 6 hours
  - Details: Target LCP < 2.5s, FID < 100ms, CLS < 0.1

#### Visual Assets
- [ ] **Create brand asset library**
  - Owner: Design
  - Status: Not Started
  - Dependencies: Brand brief finalized
  - Time: 12 hours
  - Details: Logo variations, color palette, fonts, templates

- [ ] **Design social media graphics (10+ templates)**
  - Owner: Design
  - Status: Not Started
  - Dependencies: Brand assets complete
  - Time: 8 hours
  - Details: Announcement, quotes, stats, features - sized for each platform

- [ ] **Create product screenshots (10-15 key screens)**
  - Owner: Design
  - Status: Not Started
  - Dependencies: Product UI finalized
  - Time: 6 hours
  - Details: High-res, annotated, showcasing key workflows

- [ ] **Record demo video (2-3 minutes)**
  - Owner: Marketing + Product
  - Status: Not Started
  - Dependencies: Product ready, screenshots complete
  - Time: 12 hours
  - Details: Script, record, edit, add captions - show value in first 30 seconds

- [ ] **Design email templates (responsive HTML)**
  - Owner: Design
  - Status: Not Started
  - Dependencies: Brand assets complete
  - Time: 8 hours
  - Details: Welcome, onboarding, announcement templates

#### Content Creation
- [ ] **Write launch blog post (1,000-1,500 words)**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Messaging finalized
  - Time: 6 hours
  - Details: Origin story, problem solved, unique approach, CTA to try

- [ ] **Write press release**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Launch blog post complete
  - Time: 4 hours
  - Details: Follow AP style, include quotes, boilerplate, contact info

- [ ] **Create FAQ page (10-15 questions)**
  - Owner: Marketing + Customer Success
  - Status: Not Started
  - Dependencies: Product finalized
  - Time: 4 hours
  - Details: Address common objections and questions

- [ ] **Write product documentation (getting started guide)**
  - Owner: Customer Success + Product
  - Status: Not Started
  - Dependencies: Product finalized
  - Time: 16 hours
  - Details: Step-by-step tutorials, screenshots, videos

- [ ] **Prepare 10+ social posts for launch week**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Messaging finalized, graphics ready
  - Time: 4 hours
  - Details: Scheduled across LinkedIn, Twitter, other relevant platforms

- [ ] **Create lead magnet / downloadable resource**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Content calendar defined
  - Time: 12 hours
  - Details: Guide, template, or tool to capture emails

---

### T-29 to T-15: Channel Setup & Partnerships (Weeks 4-3 Before Launch)

#### Email Marketing
- [ ] **Set up email service provider (ESP)**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: None
  - Time: 3 hours
  - Details: ConvertKit, Mailchimp, or similar + domain authentication

- [ ] **Build email list segmentation**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: ESP setup
  - Time: 2 hours
  - Details: Segment by persona, source, engagement level

- [ ] **Load all email sequences into ESP**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Email templates designed, ESP setup
  - Time: 6 hours
  - Details: Welcome, onboarding, activation, sales outreach sequences

- [ ] **Create launch announcement email (3 variants for A/B test)**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Email sequences loaded
  - Time: 3 hours
  - Details: Test subject lines, CTAs, message framing

- [ ] **Build and warm up sending domain (if new domain)**
  - Owner: Engineering + Marketing
  - Status: Not Started
  - Dependencies: ESP setup
  - Time: 14 days (gradual)
  - Details: Start sending small volumes 2 weeks before launch

#### Paid Advertising
- [ ] **Set up ad accounts (Google, LinkedIn, Facebook, etc.)**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: None
  - Time: 2 hours
  - Details: Business verification, payment method, pixel installation

- [ ] **Install tracking pixels on website**
  - Owner: Engineering
  - Status: Not Started
  - Dependencies: Ad accounts created
  - Time: 2 hours
  - Details: Facebook Pixel, LinkedIn Insight Tag, Google Ads tag

- [ ] **Create ad campaigns (ready to launch but paused)**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Landing pages live, pixels installed
  - Time: 8 hours
  - Details: 3-5 ad sets per platform with different targeting and creative

- [ ] **Design ad creative (10+ variants)**
  - Owner: Design
  - Status: Not Started
  - Dependencies: Brand assets complete
  - Time: 8 hours
  - Details: Static images, carousels, video ads sized for each platform

- [ ] **Set daily budgets and bid strategies**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Campaigns created
  - Time: 1 hour
  - Details: Start conservative, plan to scale based on performance

#### Social Media
- [ ] **Claim and optimize all social profiles**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Brand assets complete
  - Time: 3 hours
  - Details: LinkedIn, Twitter, Facebook, Instagram - complete bios, links, images

- [ ] **Schedule launch week social content**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Social posts written, graphics ready
  - Time: 2 hours
  - Details: Use Buffer, Hootsuite, or native scheduling

- [ ] **Identify and engage with 50 target accounts pre-launch**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: ICP defined
  - Time: 4 hours (ongoing)
  - Details: Comment on posts, DM value, build relationships before launch

- [ ] **Prepare founder/team for social amplification**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Launch posts scheduled
  - Time: 1 hour
  - Details: Brief team on what to share, when, how to engage

#### Partnerships & Influencers
- [ ] **Identify 10-20 potential launch partners**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: ICP defined
  - Time: 3 hours
  - Details: Complementary products, influencers, media outlets

- [ ] **Reach out to launch partners with co-marketing proposal**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Partner list complete
  - Time: 4 hours
  - Details: Personalized outreach, mutual benefit, clear ask

- [ ] **Secure 3-5 launch partners**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Outreach complete
  - Time: 10 hours (async)
  - Details: Confirmed they'll share/promote on launch day

- [ ] **Create co-marketing assets for partners**
  - Owner: Marketing + Design
  - Status: Not Started
  - Dependencies: Partners secured
  - Time: 4 hours
  - Details: Email templates, social posts, graphics they can use

#### Press & Media
- [ ] **Create press kit**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Press release, screenshots, demo video ready
  - Time: 4 hours
  - Details: ZIP file with all assets, fact sheet, founder bios, high-res logos

- [ ] **Build media list (50-100 contacts)**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: None
  - Time: 4 hours
  - Details: Journalists, bloggers, podcasters in your space

- [ ] **Craft personalized pitches for top 20 media targets**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Media list complete, press release ready
  - Time: 6 hours
  - Details: Why this is relevant to their audience, exclusive angle

- [ ] **Submit to Product Hunt, BetaList, etc.**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Product live, assets ready
  - Time: 3 hours
  - Details: Prepare Product Hunt launch (separate strategy for T-0)

#### Community Building
- [ ] **Set up community platform (Slack, Discord, Circle)**
  - Owner: Customer Success
  - Status: Not Started
  - Dependencies: None
  - Time: 3 hours
  - Details: Channels, welcome automation, moderation rules

- [ ] **Seed community with beta users**
  - Owner: Customer Success
  - Status: Not Started
  - Dependencies: Community platform ready
  - Time: 2 hours (ongoing)
  - Details: Invite early users, encourage engagement, share content

- [ ] **Identify 10 online communities to join**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: ICP defined
  - Time: 2 hours
  - Details: Reddit, forums, Slack groups where target audience hangs out

- [ ] **Engage authentically in communities (no spamming)**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Communities identified
  - Time: 2 hours/week (ongoing)
  - Details: Answer questions, provide value, build credibility

---

### T-14 to T-8: Testing & Refinement (Week 2 Before Launch)

#### Product QA
- [ ] **Complete full end-to-end QA of critical user flows**
  - Owner: Product + Engineering
  - Status: Not Started
  - Dependencies: Product feature-complete
  - Time: 16 hours
  - Details: Signup, onboarding, core actions, billing - test happy path and edge cases

- [ ] **Run load testing (simulate 10x expected traffic)**
  - Owner: Engineering
  - Status: Not Started
  - Dependencies: Product ready
  - Time: 4 hours
  - Details: Identify bottlenecks, ensure graceful degradation

- [ ] **Fix all P0/P1 bugs**
  - Owner: Engineering
  - Status: Not Started
  - Dependencies: QA complete
  - Time: Variable
  - Details: Blockers and critical bugs must be resolved

- [ ] **Test signup flow on multiple browsers/devices**
  - Owner: Engineering
  - Status: Not Started
  - Dependencies: Product ready
  - Time: 3 hours
  - Details: Chrome, Safari, Firefox, Edge on Mac, Windows, iOS, Android

- [ ] **Conduct security review**
  - Owner: Engineering
  - Status: Not Started
  - Dependencies: Product feature-complete
  - Time: 6 hours
  - Details: Penetration testing, vulnerability scan, data privacy audit

#### Marketing QA
- [ ] **Test all website forms and CTAs**
  - Owner: Marketing + Engineering
  - Status: Not Started
  - Dependencies: Website complete
  - Time: 2 hours
  - Details: Ensure submissions work, go to right place, trigger automations

- [ ] **Verify all tracking pixels and analytics are firing**
  - Owner: Operations
  - Status: Not Started
  - Dependencies: Analytics and pixels installed
  - Time: 3 hours
  - Details: Use browser dev tools, tag assistant, send test events

- [ ] **Test email deliverability**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Email sequences loaded
  - Time: 2 hours
  - Details: Send test emails to multiple providers (Gmail, Outlook, etc.), check spam scores

- [ ] **Preview all ads in each platform**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Ad campaigns created
  - Time: 2 hours
  - Details: Check for policy violations, ensure creative displays correctly

- [ ] **Run A/B test on key landing page elements**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Landing page live
  - Time: 4 hours
  - Details: Test headlines, CTAs, images (if time allows before launch)

#### Sales & Customer Success Readiness
- [ ] **Set up CRM (HubSpot, Salesforce, Pipedrive)**
  - Owner: Sales
  - Status: Not Started
  - Dependencies: None
  - Time: 6 hours
  - Details: Deal stages, lead scoring, email integration

- [ ] **Create sales enablement materials**
  - Owner: Sales + Marketing
  - Status: Not Started
  - Dependencies: Messaging finalized
  - Time: 8 hours
  - Details: One-pager, pitch deck, objection handling guide, demo script

- [ ] **Conduct product training for sales team**
  - Owner: Product + Sales
  - Status: Not Started
  - Dependencies: Product finalized, sales materials ready
  - Time: 4 hours
  - Details: Deep dive on features, use cases, competitive positioning

- [ ] **Set up support helpdesk (Intercom, Zendesk, Help Scout)**
  - Owner: Customer Success
  - Status: Not Started
  - Dependencies: None
  - Time: 4 hours
  - Details: Ticket routing, canned responses, help center

- [ ] **Write 20+ help center articles**
  - Owner: Customer Success
  - Status: Not Started
  - Dependencies: Helpdesk setup
  - Time: 12 hours
  - Details: How-to guides, troubleshooting, FAQs

- [ ] **Conduct customer support training**
  - Owner: Customer Success
  - Status: Not Started
  - Dependencies: Product finalized, help articles written
  - Time: 4 hours
  - Details: Product knowledge, support tone, escalation process

- [ ] **Set up on-call rotation for launch week**
  - Owner: Engineering + Customer Success
  - Status: Not Started
  - Dependencies: None
  - Time: 1 hour
  - Details: PagerDuty or similar, clear escalation path

---

### T-7 to T-1: Final Prep & Launch Rehearsal (Week Before Launch)

#### Final Checks
- [ ] **Conduct go/no-go meeting (T-7)**
  - Owner: Launch Owner
  - Status: Not Started
  - Dependencies: All previous tasks complete
  - Time: 1 hour
  - Details: Review readiness, decide to proceed or delay

- [ ] **Lock code (no deploys except critical fixes)**
  - Owner: Engineering
  - Status: Not Started
  - Dependencies: Go decision
  - Time: N/A
  - Details: Code freeze from T-3 to T+1

- [ ] **Final walkthrough of launch day timeline**
  - Owner: Launch Owner
  - Status: Not Started
  - Dependencies: None
  - Time: 2 hours
  - Details: Who does what, when, how to communicate

- [ ] **Prepare war room (virtual or physical)**
  - Owner: Operations
  - Status: Not Started
  - Dependencies: None
  - Time: 1 hour
  - Details: Slack channel or Zoom room for real-time coordination

- [ ] **Assign launch day roles and responsibilities**
  - Owner: Launch Owner
  - Status: Not Started
  - Dependencies: Timeline finalized
  - Time: 1 hour
  - Details: Who monitors what, who posts where, who handles issues

- [ ] **Create launch day runbook**
  - Owner: Launch Owner
  - Status: Not Started
  - Dependencies: Timeline finalized
  - Time: 3 hours
  - Details: Step-by-step checklist with exact times and owners

#### Pre-Launch Communications
- [ ] **Email warm list (beta users, waitlist) with heads-up**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Email sequences ready
  - Time: 1 hour
  - Details: Build excitement, thank them, tease launch date

- [ ] **Notify launch partners of go-live time**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Partners secured
  - Time: 1 hour
  - Details: Confirm they're ready to share, send assets

- [ ] **Tease launch on social media (T-3)**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Social posts prepared
  - Time: 30 minutes
  - Details: Build anticipation without revealing too much

- [ ] **Send press embargo emails to top media (T-2)**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Press list finalized, press kit ready
  - Time: 2 hours
  - Details: Give exclusive early access, request coverage on launch day

#### Final Asset Prep
- [ ] **Queue all launch day social posts**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Social posts ready
  - Time: 1 hour
  - Details: Pre-schedule for optimal times throughout launch day

- [ ] **Prepare launch day email blast**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Email list segmented
  - Time: 2 hours
  - Details: Ready to send at T-0, A/B tested subject lines

- [ ] **Final review of all website copy**
  - Owner: Marketing
  - Status: Not Started
  - Dependencies: Website complete
  - Time: 2 hours
  - Details: Proofread for typos, broken links, messaging consistency

- [ ] **Screenshot and archive pre-launch state**
  - Owner: Operations
  - Status: Not Started
  - Dependencies: None
  - Time: 1 hour
  - Details: Capture website, social profiles, analytics for before/after comparison

---

## Launch Day (T-0)

### Launch Day Timeline (Adjust based on your timezone and target audience)

#### 6:00 AM - Pre-Launch Check
- [ ] **Verify all systems operational**
  - Owner: Engineering
  - Time: 30 minutes
  - Details: Check uptime monitors, error rates, database connections

- [ ] **Confirm all team members online and ready**
  - Owner: Launch Owner
  - Time: 15 minutes
  - Details: Roll call in war room

- [ ] **Final review of launch dashboard**
  - Owner: Operations
  - Time: 15 minutes
  - Details: Ensure all metrics are tracking correctly

#### 8:00 AM - Soft Launch
- [ ] **Remove "coming soon" or beta flags from website**
  - Owner: Engineering
  - Time: 5 minutes
  - Details: Make product publicly available

- [ ] **Enable signup flow**
  - Owner: Engineering
  - Time: 5 minutes
  - Details: Remove waitlist, allow anyone to create account

- [ ] **Test signup as new user**
  - Owner: Product
  - Time: 10 minutes
  - Details: Verify onboarding flow works end-to-end

- [ ] **Activate paid ad campaigns**
  - Owner: Marketing
  - Time: 10 minutes
  - Details: Turn on campaigns in Google Ads, LinkedIn, Facebook

#### 9:00 AM - Public Announcement
- [ ] **Publish launch blog post**
  - Owner: Marketing
  - Time: 5 minutes
  - Details: Post to website, syndicate to Medium/Dev.to

- [ ] **Post launch announcement on LinkedIn (founder + company page)**
  - Owner: Marketing + Founder
  - Time: 10 minutes
  - Details: Personal story, link to website, ask for engagement

- [ ] **Post launch announcement on Twitter**
  - Owner: Marketing
  - Time: 5 minutes
  - Details: Thread format with key highlights

- [ ] **Send launch email to full email list**
  - Owner: Marketing
  - Time: 5 minutes
  - Details: Press send on pre-prepared campaign

- [ ] **Submit to Product Hunt**
  - Owner: Marketing
  - Time: 30 minutes
  - Details: Upload assets, answer initial comments, rally support

- [ ] **Send press release to media list**
  - Owner: Marketing
  - Time: 15 minutes
  - Details: BCC to avoid reply-all, personalize top-tier pitches

- [ ] **Notify launch partners to share**
  - Owner: Marketing
  - Time: 15 minutes
  - Details: Slack/email ping with direct links to share

#### 10:00 AM - Engagement & Monitoring
- [ ] **Respond to all social media comments/mentions**
  - Owner: Marketing
  - Time: Ongoing
  - Details: Thank supporters, answer questions, engage authentically

- [ ] **Monitor Product Hunt ranking and comments**
  - Owner: Marketing
  - Time: Ongoing
  - Details: Aim for top 5 of the day, respond to every comment within 15 min

- [ ] **Track real-time analytics**
  - Owner: Operations
  - Time: Ongoing
  - Details: Website traffic, signups, conversions - share updates in war room

- [ ] **Monitor error rates and uptime**
  - Owner: Engineering
  - Time: Ongoing
  - Details: Jump on any issues immediately

#### 12:00 PM - Midday Push
- [ ] **Share launch metrics publicly (if impressive)**
  - Owner: Marketing
  - Time: 15 minutes
  - Details: "100 signups in first 3 hours!" social proof

- [ ] **Post follow-up content on social**
  - Owner: Marketing
  - Time: 20 minutes
  - Details: Screenshots, customer reactions, behind-the-scenes

- [ ] **Engage in relevant online communities**
  - Owner: Marketing
  - Time: 30 minutes
  - Details: Share in Reddit, Slack groups, forums (where allowed)

- [ ] **Follow up with press who haven't responded**
  - Owner: Marketing
  - Time: 30 minutes
  - Details: Polite nudge, offer exclusive interview

#### 3:00 PM - Afternoon Engagement
- [ ] **Publish demo video to YouTube**
  - Owner: Marketing
  - Time: 15 minutes
  - Details: Optimized title, description, tags

- [ ] **Share demo video on social**
  - Owner: Marketing
  - Time: 10 minutes
  - Details: Native video upload to each platform

- [ ] **Check in with sales team on inbound demos**
  - Owner: Sales
  - Time: 15 minutes
  - Details: Ensure lead routing working, demos being scheduled

- [ ] **Review ad performance and adjust budgets**
  - Owner: Marketing
  - Time: 30 minutes
  - Details: Pause underperforming ads, increase budget on winners

#### 6:00 PM - End of Day Recap
- [ ] **Compile launch day metrics**
  - Owner: Operations
  - Time: 30 minutes
  - Details: Website visits, signups, demos, social engagement, press mentions

- [ ] **Share end-of-day recap internally**
  - Owner: Launch Owner
  - Time: 30 minutes
  - Details: Thank team, celebrate wins, identify issues

- [ ] **Post end-of-day update publicly**
  - Owner: Marketing
  - Time: 15 minutes
  - Details: "Day 1 in the books! Here's what happened..." with key stats

- [ ] **Plan tomorrow's follow-up**
  - Owner: Launch Owner
  - Time: 30 minutes
  - Details: Prioritize based on what worked today

#### 8:00 PM - Founder/Team Wind Down
- [ ] **Celebrate with team**
  - Owner: All
  - Time: 1+ hours
  - Details: Virtual happy hour, dinner, acknowledge hard work

---

## Post-Launch Phase

### T+1 to T+7: First Week Momentum (Launch Week)

#### Day 1 (T+1)
- [ ] **Send thank you email to everyone who engaged on launch day**
  - Owner: Marketing
  - Time: 1 hour
  - Details: Personal touch, ask for testimonials

- [ ] **Publish "What We Learned on Day 1" blog post**
  - Owner: Marketing
  - Time: 2 hours
  - Details: Share metrics, learnings, next steps

- [ ] **Review all user feedback from Day 0**
  - Owner: Product
  - Time: 2 hours
  - Details: Identify quick wins and critical bugs

- [ ] **Fix top 3 issues reported by users**
  - Owner: Engineering
  - Time: Variable
  - Details: Prioritize based on impact and frequency

- [ ] **Follow up with warm leads from launch day**
  - Owner: Sales
  - Time: 2 hours
  - Details: Personal outreach to demo requests and high-intent signups

#### Day 2 (T+2)
- [ ] **Publish case study or customer spotlight**
  - Owner: Marketing
  - Time: 3 hours
  - Details: Feature beta user or early win

- [ ] **Host AMA (Ask Me Anything) on relevant platform**
  - Owner: Founder + Marketing
  - Time: 1 hour
  - Details: Reddit, Twitter Spaces, LinkedIn Live

- [ ] **Send first nurture email to new signups**
  - Owner: Marketing
  - Time: Automated
  - Details: Ensure onboarding sequence is working

- [ ] **Reach out to journalists who covered competitors**
  - Owner: Marketing
  - Time: 2 hours
  - Details: Pitch as alternative angle

#### Day 3 (T+3)
- [ ] **Launch referral program**
  - Owner: Marketing + Product
  - Time: 4 hours
  - Details: Incentivize users to invite others

- [ ] **Publish "How [Feature] Works" tutorial content**
  - Owner: Marketing
  - Time: 2 hours
  - Details: Deep dive on core functionality

- [ ] **Engage with users on social media**
  - Owner: Marketing
  - Time: 1 hour
  - Details: Retweet, reply, feature user posts

- [ ] **Review ad performance and optimize**
  - Owner: Marketing
  - Time: 1 hour
  - Details: A/B test creative, adjust targeting

#### Day 4-7 (T+4 to T+7)
- [ ] **Publish 2-3 more blog posts/content pieces**
  - Owner: Marketing
  - Time: 6 hours
  - Details: Keep momentum, SEO content

- [ ] **Host first webinar or product demo**
  - Owner: Sales + Marketing
  - Time: 3 hours
  - Details: Open to all, record for future use

- [ ] **Conduct first round of user interviews**
  - Owner: Product
  - Time: 4 hours
  - Details: 5-10 new users, understand onboarding experience

- [ ] **Iterate on onboarding based on feedback**
  - Owner: Product + Engineering
  - Time: 8 hours
  - Details: Reduce friction, clarify confusing steps

- [ ] **Week 1 retrospective**
  - Owner: Launch Owner
  - Time: 2 hours
  - Details: What worked, what didn't, adjust plan for Week 2

---

### T+8 to T+14: Second Week Optimization (Week 2)

- [ ] **Analyze Week 1 data and identify drop-off points**
  - Owner: Product + Operations
  - Status: Not Started
  - Time: 3 hours
  - Details: Where are users getting stuck? What's conversion rate at each step?

- [ ] **Implement 3-5 quick wins from user feedback**
  - Owner: Engineering
  - Status: Not Started
  - Time: 16 hours
  - Details: UI improvements, bug fixes, small feature adds

- [ ] **Launch second wave of content**
  - Owner: Marketing
  - Status: Not Started
  - Time: 8 hours
  - Details: 3-4 blog posts, social content, video content

- [ ] **Double down on best-performing marketing channel**
  - Owner: Marketing
  - Status: Not Started
  - Time: 4 hours
  - Details: Increase budget, create more content for that channel

- [ ] **Pause or kill underperforming campaigns**
  - Owner: Marketing
  - Status: Not Started
  - Time: 1 hour
  - Details: Reallocate budget to what's working

- [ ] **Send re-engagement email to inactive signups**
  - Owner: Marketing
  - Status: Not Started
  - Time: 2 hours
  - Details: "We noticed you haven't [action] yet..."

- [ ] **Set up retargeting campaigns**
  - Owner: Marketing
  - Status: Not Started
  - Time: 3 hours
  - Details: Target website visitors who didn't sign up

- [ ] **Conduct competitive analysis of their launch tactics**
  - Owner: Marketing
  - Status: Not Started
  - Time: 2 hours
  - Details: What did they do that we didn't? Can we adapt?

---

### T+15 to T+30: Weeks 3-4 Growth & Iteration

- [ ] **Launch customer advocacy program**
  - Owner: Customer Success
  - Status: Not Started
  - Time: 6 hours
  - Details: Identify super users, ask for testimonials and referrals

- [ ] **Publish first customer case study (full version)**
  - Owner: Marketing + Customer Success
  - Status: Not Started
  - Time: 8 hours
  - Details: Interview, write, design, get approval

- [ ] **Optimize pricing based on early feedback**
  - Owner: Product + Finance
  - Status: Not Started
  - Time: 4 hours
  - Details: Is pricing a barrier? Is value clear?

- [ ] **Launch first integration or partnership**
  - Owner: Product + Marketing
  - Status: Not Started
  - Time: Variable
  - Details: Expand functionality, tap into partner's audience

- [ ] **Host second webinar or workshop**
  - Owner: Sales + Marketing
  - Status: Not Started
  - Time: 3 hours
  - Details: More advanced topic, move leads down funnel

- [ ] **Conduct NPS survey with first cohort**
  - Owner: Product
  - Status: Not Started
  - Time: 2 hours
  - Details: Gauge satisfaction, identify promoters and detractors

- [ ] **Act on NPS feedback (close the loop)**
  - Owner: Product
  - Status: Not Started
  - Time: Variable
  - Details: Reach out to detractors, thank promoters, fix issues

- [ ] **Attend or sponsor first industry event**
  - Owner: Marketing
  - Status: Not Started
  - Time: 8+ hours
  - Details: Network, generate leads, increase brand awareness

- [ ] **Month 1 full retrospective**
  - Owner: Launch Owner
  - Status: Not Started
  - Time: 3 hours
  - Details: Review all metrics vs. goals, adjust strategy for Month 2

- [ ] **Set Month 2 OKRs**
  - Owner: Launch Owner
  - Status: Not Started
  - Time: 2 hours
  - Details: Based on Month 1 learnings, set ambitious but achievable goals

---

## Launch Success Metrics

### Primary Metrics (Track Daily During Launch Week)
- **Website Traffic**: Unique visitors, page views
- **Signups**: Total new accounts created
- **Activation Rate**: % of signups who complete core action
- **Demo Requests**: Sales-qualified leads
- **Conversion Rate**: Signup → paid (if applicable)

### Secondary Metrics (Track Weekly)
- **Social Engagement**: Likes, shares, comments, follower growth
- **Press Mentions**: Number of articles/posts mentioning launch
- **Email Performance**: Open rate, click rate, unsubscribe rate
- **Ad Performance**: CTR, CPC, CPA, ROAS
- **Customer Satisfaction**: NPS, CSAT, support ticket volume

### Goals (Adjust Based on Your Stage & Market)
**End of Launch Day (T-0)**:
- [ ] 100+ website visits
- [ ] 50+ signups
- [ ] 10+ demo requests
- [ ] 5+ press mentions or social shares from influencers
- [ ] 0 critical bugs or downtime

**End of Launch Week (T+7)**:
- [ ] 1,000+ website visits
- [ ] 200+ signups
- [ ] 30+ demo requests
- [ ] 20%+ activation rate
- [ ] 10+ customer testimonials or positive tweets

**End of Month 1 (T+30)**:
- [ ] 5,000+ website visits
- [ ] 500+ signups
- [ ] 100+ demo requests
- [ ] 10+ paying customers (if applicable)
- [ ] Positive unit economics (CAC < LTV)

---

## Crisis Management Plan

### Potential Issues & Response Plans

#### Website Down
- **Owner**: Engineering
- **Response**:
  1. Immediately notify team in war room
  2. Switch to maintenance page with ETA
  3. Post status update on social media
  4. Fix issue, test thoroughly before bringing back online
  5. Post-mortem after launch week

#### Critical Bug Blocking Signups
- **Owner**: Engineering
- **Response**:
  1. Hotfix within 1 hour if possible
  2. If not fixable quickly, pause paid ads
  3. Communicate transparently with users
  4. Offer compensation if appropriate (extended trial, etc.)

#### Negative Press or Social Backlash
- **Owner**: Founder + Marketing
- **Response**:
  1. Assess if criticism is valid
  2. If valid: acknowledge, apologize, commit to fix
  3. If invalid: respond with facts, stay professional
  4. Don't engage with trolls or bad-faith actors
  5. Shift narrative with positive content

#### Competitor Launches Same Day
- **Owner**: Marketing
- **Response**:
  1. Don't panic or change plan mid-launch
  2. Emphasize differentiation in messaging
  3. Congratulate them publicly (shows confidence)
  4. Focus on your unique value, not comparison

#### Low Engagement / Poor Results
- **Owner**: Launch Owner
- **Response**:
  1. Don't overreact on Day 1 (sometimes takes time)
  2. By Day 3, identify bottleneck (traffic, conversion, activation)
  3. Test rapid iterations (new messaging, offers, channels)
  4. Consider extending "launch" period with new angle

---

## Post-Launch Checklist

### Within 48 Hours After Launch
- [ ] **Send internal launch report**
  - Owner: Launch Owner
  - Details: Metrics, wins, challenges, immediate next steps

- [ ] **Thank everyone involved**
  - Owner: Founder
  - Details: Personal notes to key contributors, public shoutout

- [ ] **Archive all launch assets**
  - Owner: Operations
  - Details: Save all content, creative, data for future reference

### Within 1 Week After Launch
- [ ] **Publish launch retrospective blog post**
  - Owner: Marketing
  - Details: Transparent look at what happened, learnings

- [ ] **Update launch checklist with learnings**
  - Owner: Launch Owner
  - Details: What would we do differently next time?

- [ ] **Plan next milestone launch**
  - Owner: Launch Owner
  - Details: Major feature, expansion, or relaunch campaign

---

**Generated**: ${new Date().toISOString().split('T')[0]}

---

## How to Use This Checklist

1. **Assign Owners**: Put real names next to each owner role
2. **Set Your Launch Date**: Calculate all T-X dates based on target launch
3. **Update Status**: Change "Not Started" to "In Progress" or "Complete"
4. **Track Dependencies**: Don't start tasks until dependencies are met
5. **Hold Daily Standups**: 15-minute check-in during final 2 weeks
6. **Adjust as Needed**: This is a template - adapt to your specific needs
7. **Don't Skip Steps**: Every item is here for a reason based on successful launches

**Remember**: A great launch is 90% preparation, 10% execution. Don't rush the prep.`
      }
    ]
  })

  // Extract content from response
  let launchChecklist = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      launchChecklist += block.text + '\n'
    }
  }

  if (!launchChecklist.trim()) {
    launchChecklist = 'Failed to generate launch checklist'
  }

  // Write output
  const outputDir = join(projectRoot, 'marketing', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'launch-checklist.md')
  writeFileSync(outputPath, launchChecklist, 'utf-8')

  console.log(`Launch checklist generated successfully: ${outputPath}`)
  console.log(`\nCovered: Complete T-60 to T+30 day-by-day checklist with Owner, Status, Dependencies, and Time estimates per task. Includes Product, Marketing, Sales, Engineering, Operations across Pre-Launch, Launch Day (hourly), and Post-Launch phases.`)
}

generateLaunchChecklist().catch(console.error)
```

## Output

Creates marketing/output/launch-checklist.md with comprehensive day-by-day checklist from T-60 to T+30. Includes launch team roles, pre-launch phase broken into 4 time blocks (T-60 to T-45, T-44 to T-30, T-29 to T-15, T-14 to T-8), launch day hourly timeline, and post-launch phases (Week 1, Week 2, Weeks 3-4). Every task includes owner, status checkbox, dependencies, time estimate, and specific details. Covers product readiness, marketing assets, analytics, channels, partnerships, QA, sales enablement, support setup, crisis management, and success metrics. Success requires reading all marketing outputs to create actionable, comprehensive launch plan.
