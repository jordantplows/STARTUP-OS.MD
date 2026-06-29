#!/usr/bin/env node

import { CompanyOSManager } from './company-os.js'
import { coordinateExecutives } from './executive-coordinator.js'
import { log } from './audit-log.js'
import { writeDashboard, openDashboard } from './dashboard.js'

/**
 * Test script to generate mock company data and render dashboard
 */

async function testDashboard() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' Dashboard Test — Generating Mock Company State')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Initialize company
  const os = new CompanyOSManager({
    companyName: 'SecureFlow AI',
    oneline: 'AI-powered code review for security teams',
    industry: 'B2B SaaS',
    businessModel: 'SaaS subscription',
    stage: 'building',
    targetCustomer: 'Security engineers at Series B+ companies',
    revenue: 0
  })

  // Initialize executives
  console.log('Initializing executives...')
  os.initializeExecutive('ceo', {
    status: 'steering',
    currentFocus: 'Coordinating product-market fit validation',
  })

  os.initializeExecutive('finance/exec', {
    status: 'watching',
    currentFocus: 'Tracking burn rate and runway projections',
  })

  os.initializeExecutive('cto', {
    status: 'deciding',
    currentFocus: 'Evaluating build vs buy for ML infrastructure',
  })

  os.initializeExecutive('cmo', {
    status: 'steering',
    currentFocus: 'Testing messaging with first 10 customers',
  })

  os.initializeExecutive('cpo', {
    status: 'watching',
    currentFocus: 'Validating feature priorities with early users',
  })

  os.initializeExecutive('coo', {
    status: 'watching',
    currentFocus: 'Setting up initial sales and support processes',
  })

  // Add some PMF evidence
  console.log('Adding PMF evidence...')
  const state = os.getState()

  // Ensure PMF is initialized
  if (!state.pmf) {
    state.pmf = {
      hypothesis: 'Customers need a solution for [problem]',
      confidence: 0,
      evidence: [],
      lastUpdated: new Date().toISOString(),
      nextValidationStep: 'Conduct first customer interviews'
    }
  }

  state.pmf.hypothesis = 'Security teams need automated pre-screening before manual code review'
  state.pmf.evidence.push({
    source: 'research/customer-intel',
    signal: '3 out of 5 interviewed teams said "we waste time on low-severity issues"',
    direction: 'supports',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  })

  state.pmf.evidence.push({
    source: 'sales/discovery',
    signal: 'Lead from Stripe security team asked "can it prioritize by business impact?"',
    direction: 'supports',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  })

  state.pmf.evidence.push({
    source: 'product/beta-feedback',
    signal: 'Beta user: "This is exactly what we need, but the UI is confusing"',
    direction: 'supports',
    timestamp: new Date().toISOString()
  })

  state.pmf.confidence = 67
  state.pmf.nextValidationStep = 'Run 5 more discovery calls with Series B+ security leads'
  os.save()

  // Add some outbound activity
  console.log('Logging outbound actions...')

  log({
    agent: 'outreach/investor-outreach',
    action: 'sent-cold-email',
    input: { recipient: 'jane@sequoia.com', sequence: 'seed-stage-vcs' },
    output: { sent: true },
    founderApproved: false,
    confidence: 'high',
    outbound: {
      channel: 'email',
      recipient: 'jane@sequoia.com',
      contentPreview: 'Hi Jane — we are building AI code review for security teams. 3 paying customers in 2 weeks...',
      status: 'sent',
      sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    }
  })

  log({
    agent: 'marketing/demand-gen',
    action: 'posted-to-linkedin',
    input: { platform: 'linkedin', content: 'Launch post' },
    output: { posted: true },
    founderApproved: true,
    confidence: 'medium',
    outbound: {
      channel: 'social',
      contentPreview: 'We just launched SecureFlow AI — here is what we learned building for security teams...',
      status: 'sent',
      sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
  })

  log({
    agent: 'sales/cold-outreach',
    action: 'slack-message-to-prospect',
    input: { prospect: 'ACME Corp CISO' },
    output: { pending: true },
    founderApproved: false,
    confidence: 'low',
    outbound: {
      channel: 'slack',
      recipient: 'john@acmecorp.com',
      contentPreview: 'Hey John — saw your talk at BlackHat. Would love to show you what we are building...',
      status: 'pending-approval',
    }
  })

  log({
    agent: 'outreach/investor-outreach',
    action: 'sent-cold-email',
    input: { recipient: 'alex@a16z.com', sequence: 'seed-stage-vcs' },
    output: { failed: true, error: 'Invalid email' },
    founderApproved: false,
    confidence: 'high',
    outbound: {
      channel: 'email',
      recipient: 'alex@a16z.com',
      contentPreview: 'Hi Alex — reaching out about SecureFlow AI. We are seeing strong early traction...',
      status: 'failed'
    }
  })

  // Add a pending decision
  console.log('Adding pending decisions...')
  os.addDecision({
    from: 'cfo',
    question: 'Should we hire a full-time ML engineer now or wait until seed funding?',
    context: 'CTO needs ML expertise to build the core engine. Cost: $180k/year.',
    blocking: ['cto', 'product']
  })

  // Run executive coordination
  console.log('Running executive coordination...')
  await coordinateExecutives(os)

  // Generate dashboard
  console.log('Generating dashboard...')
  writeDashboard(os)

  console.log('\n✓ Dashboard generated successfully!')
  console.log('  Location: workspace/dashboard.html\n')

  // Open dashboard
  console.log('Opening dashboard in browser...')
  openDashboard()

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' Dashboard Sections:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' 1. PMF Tracker — hypothesis, confidence, evidence')
  console.log(' 2. Executive Status — 6 cards showing each exec\'s focus')
  console.log(' 3. Executive Coordination — conflicts and synergies')
  console.log(' 4. Outbound Activity — emails, Slack, social posts')
  console.log(' 5. Pending Decisions — what\'s waiting on founder')
  console.log(' 6. Department Grid — all active departments')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

testDashboard().catch(console.error)
