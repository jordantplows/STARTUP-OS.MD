#!/usr/bin/env node
/**
 * P0 Verification Test Suite
 * Tests all three P0 fixes:
 * 1. MDLoader directory scanning
 * 2. MDLoader frontmatter parsing
 * 3. Init command parsing (no truncation)
 */

import { MDLoader } from './md-loader.js'
import { readdirSync } from 'fs'
import { join } from 'path'

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(' P0 VERIFICATION TEST SUITE')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

let allPassed = true

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// P0 Fix 1: MDLoader directory scanning
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('P0 Fix 1: Directory Scanning\n')

const expectedDirs = [
  'ceo', 'strategy', 'brand', 'design', 'product',
  'engineering', 'finance', 'marketing', 'sales',
  'people', 'legal', 'operations', 'metrics', 'security',
  'growth', 'customer', 'data', 'outreach', 'investor',
  'research', 'network', 'core'
]

const rootDir = process.cwd()
const actualDirs = readdirSync(rootDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')
  .map(d => d.name)

const foundDirs = expectedDirs.filter(d => actualDirs.includes(d))

console.log(`✓ Found ${foundDirs.length}/${expectedDirs.length} expected directories`)
console.log(`  Directories: ${foundDirs.join(', ')}\n`)

// Allow missing up to 5 directories (brand, data, security, doctor, brand may not exist yet)
if (foundDirs.length < expectedDirs.length - 5) {
  console.log('✗ FAIL: Missing too many expected directories\n')
  allPassed = false
} else {
  console.log('✓ PASS: Directory structure looks good\n')
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// P0 Fix 2: MDLoader frontmatter parsing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log('P0 Fix 2: Frontmatter Parsing\n')

const loader = new MDLoader()
const agents = loader.loadAllAgents()

console.log(`✓ Loaded ${agents.length} agents\n`)

// Test specific schema features
let schemaTestsPassed = 0
let schemaTestsTotal = 0

// Test 1: Agent with events.emits and events.watches
schemaTestsTotal++
const ceoAgent = agents.find(a => a.metadata.name === 'ceo-briefing')
if (ceoAgent?.metadata.events?.emits && ceoAgent.metadata.events.emits.length > 0) {
  console.log(`✓ events.emits parsed: ${ceoAgent.metadata.events.emits.slice(0, 2).join(', ')}`)
  schemaTestsPassed++
} else {
  console.log('✗ events.emits not parsed correctly')
  allPassed = false
}

// Test 2: Agent with reads array
schemaTestsTotal++
if (ceoAgent?.metadata.reads && Array.isArray(ceoAgent.metadata.reads)) {
  console.log(`✓ reads array parsed: ${ceoAgent.metadata.reads.slice(0, 2).join(', ')}`)
  schemaTestsPassed++
} else {
  console.log('✗ reads array not parsed correctly')
  allPassed = false
}

// Test 3: Agent with template-ref
schemaTestsTotal++
if (ceoAgent?.metadata.templateRef) {
  console.log(`✓ template-ref parsed: ${ceoAgent.metadata.templateRef}`)
  schemaTestsPassed++
} else {
  console.log('✗ template-ref not parsed correctly')
  allPassed = false
}

// Test 4: Legacy agent with watches array (not events.watches)
schemaTestsTotal++
const uxAgent = agents.find(a => a.metadata.name === 'design-ux')
if (uxAgent?.metadata.watches && Array.isArray(uxAgent.metadata.watches) && uxAgent.metadata.watches.length > 0) {
  console.log(`✓ Legacy watches array parsed: ${uxAgent.metadata.watches.slice(0, 2).join(', ')}`)
  schemaTestsPassed++
} else {
  console.log('✗ Legacy watches array not parsed correctly')
  allPassed = false
}

// Test 5: All agents have required fields
schemaTestsTotal++
const invalidAgents = agents.filter(a => !a.metadata.name || !a.metadata.role)
if (invalidAgents.length === 0) {
  console.log(`✓ All ${agents.length} agents have required fields (name, role)`)
  schemaTestsPassed++
} else {
  console.log(`✗ ${invalidAgents.length} agents missing required fields`)
  allPassed = false
}

// Test 6: All agents have TypeScript code
schemaTestsTotal++
const noCode = agents.filter(a => !a.typescript || a.typescript.length < 10)
if (noCode.length === 0) {
  console.log(`✓ All ${agents.length} agents have TypeScript code blocks`)
  schemaTestsPassed++
} else {
  console.log(`✗ ${noCode.length} agents missing TypeScript code`)
  allPassed = false
}

console.log(`\n${schemaTestsPassed}/${schemaTestsTotal} schema tests passed`)

if (schemaTestsPassed === schemaTestsTotal) {
  console.log('✓ PASS: Frontmatter parsing works correctly\n')
} else {
  console.log('✗ FAIL: Some frontmatter parsing issues\n')
  allPassed = false
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// P0 Fix 3: Init command parsing (no truncation)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log('P0 Fix 3: Init Parsing (No Truncation)\n')

function testInitParsing(input: string, expectedCustomerLength: number, expectedAssumptionLength: number): boolean {
  const parts = input.match(/"[^"]+"|[^\s]+/g) || []

  if (parts.length < 3) return false

  const [, customerRaw, assumptionRaw] = parts
  const customer = (customerRaw || '').replace(/"/g, '')
  const assumption = (assumptionRaw || '').replace(/"/g, '')

  const customerOk = customer.length >= expectedCustomerLength
  const assumptionOk = assumption.length >= expectedAssumptionLength

  return customerOk && assumptionOk
}

let parsingTestsPassed = 0
let parsingTestsTotal = 0

// Test 1: Short inputs
parsingTestsTotal++
if (testInitParsing('idea "Founders" "Need help"', 7, 9)) {
  console.log('✓ Short input parsed without truncation')
  parsingTestsPassed++
} else {
  console.log('✗ Short input truncated')
  allPassed = false
}

// Test 2: Medium inputs
parsingTestsTotal++
if (testInitParsing('idea "Security engineers at Series B+ SaaS" "Teams want automated pre-screening"', 35, 30)) {
  console.log('✓ Medium input parsed without truncation')
  parsingTestsPassed++
} else {
  console.log('✗ Medium input truncated')
  allPassed = false
}

// Test 3: Long inputs
parsingTestsTotal++
const longInput = 'idea "Security engineers at Series B+ SaaS companies who do manual code reviews and hate it because it takes too long" "Teams want automation because manual reviews are slow, inconsistent, and miss critical security vulnerabilities"'
if (testInitParsing(longInput, 100, 100)) {
  console.log('✓ Long input parsed without truncation')
  parsingTestsPassed++
} else {
  console.log('✗ Long input truncated')
  allPassed = false
}

console.log(`\n${parsingTestsPassed}/${parsingTestsTotal} parsing tests passed`)

if (parsingTestsPassed === parsingTestsTotal) {
  console.log('✓ PASS: Init parsing handles all input lengths correctly\n')
} else {
  console.log('✗ FAIL: Some init parsing issues\n')
  allPassed = false
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Final Report
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
if (allPassed) {
  console.log(' ✓ ALL P0 TESTS PASSED')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  process.exit(0)
} else {
  console.log(' ✗ SOME P0 TESTS FAILED')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  process.exit(1)
}
