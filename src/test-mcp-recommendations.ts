#!/usr/bin/env node

import { CompanyOSManager } from './company-os.js'
import { MCPConnector } from './mcp-connector.js'

/**
 * Test script to demonstrate MCP recommendations across different company profiles
 */

async function testRecommendations() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' MCP Registry & Recommendation Engine Test')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Test 1: SaaS Product Company
  console.log('TEST 1: SaaS Product Company\n')
  const saasOS = new CompanyOSManager({
    companyName: 'Test SaaS',
    oneline: 'AI-powered dashboard for security teams',
    industry: 'B2B SaaS',
    businessModel: 'SaaS subscription',
    stage: 'building'
  })

  // Initialize departments
  saasOS.initializeDepartment('product', { currentFocus: 'Building MVP', status: 'watching' })
  saasOS.initializeDepartment('engineering', { currentFocus: 'Setting up infrastructure', status: 'watching' })
  saasOS.initializeDepartment('marketing', { currentFocus: 'Planning launch', status: 'watching' })

  const saasConnector = new MCPConnector(saasOS)
  const saasRecs = saasConnector.getRecommendations()

  console.log('Recommendations for SaaS company:')
  saasRecs.slice(0, 5).forEach((rec, idx) => {
    const blocked = rec.blockedWithout ? ' [REQUIRED]' : ''
    console.log(`  ${idx + 1}. ${rec.tool.name}${blocked}`)
    console.log(`     → Unlocks: ${rec.recommendedBy.join(', ')}`)
    console.log(`     → Reason: ${rec.reason}`)
    console.log(`     → Setup: ${rec.tool.setupFlow}\n`)
  })

  // Test 2: Revenue-Stage Company
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('TEST 2: Revenue-Stage Company\n')
  const revenueOS = new CompanyOSManager({
    companyName: 'Test Revenue Co',
    oneline: 'B2B sales platform',
    industry: 'SaaS',
    businessModel: 'Enterprise SaaS',
    stage: 'revenue',
    revenue: 50000
  })

  // Initialize more departments
  revenueOS.initializeDepartment('product', { currentFocus: 'Feature expansion', status: 'watching' })
  revenueOS.initializeDepartment('sales', { currentFocus: 'Scaling pipeline', status: 'watching' })
  revenueOS.initializeDepartment('finance', { currentFocus: 'Revenue tracking', status: 'watching' })
  revenueOS.initializeDepartment('people', { currentFocus: 'Hiring', status: 'watching' })

  const revenueConnector = new MCPConnector(revenueOS)
  const revenueRecs = revenueConnector.getRecommendations()

  console.log('Recommendations for revenue-stage company:')
  revenueRecs.slice(0, 5).forEach((rec, idx) => {
    const blocked = rec.blockedWithout ? ' [REQUIRED]' : ''
    const tripwire = rec.tool.tripwire ? ' ⚠' : ''
    console.log(`  ${idx + 1}. ${rec.tool.name}${blocked}${tripwire}`)
    console.log(`     → Unlocks: ${rec.recommendedBy.join(', ')}`)
    console.log(`     → Reason: ${rec.reason}`)
    console.log(`     → Setup: ${rec.tool.setupFlow}\n`)
  })

  // Test 3: Show all MCPs for a department
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('TEST 3: All Available MCPs (Show More View)\n')

  saasConnector.displayRecommendations(true)

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' Test Complete')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

testRecommendations().catch(console.error)
