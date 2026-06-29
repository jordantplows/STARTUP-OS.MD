#!/usr/bin/env node
/**
 * P1 Fix 4: Test atomic write-rename with concurrent writes
 * This simulates 20 agents all writing events concurrently
 * and verifies that none are lost.
 */

import { CompanyOSManager } from './company-os.js'
import { existsSync, rmSync } from 'fs'
import { join } from 'path'

import { mkdirSync } from 'fs'

const TEST_DIR = '/tmp/startup-os-concurrent-test'
const STATE_DIR = join(TEST_DIR, '.startup-os')

function cleanup() {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true })
  }
}

async function testConcurrentWrites() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' P1 Fix 4: Concurrent Write Test')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  cleanup()

  // Create test directory and change into it
  mkdirSync(TEST_DIR, { recursive: true })
  const originalCwd = process.cwd()
  process.chdir(TEST_DIR)

  try {
    // Create initial state
    const os = new CompanyOSManager({ oneline: 'Test company' })

  console.log('✓ Created initial company state\n')

  // Simulate 20 concurrent agent writes
  const agentCount = 20
  const writes: Promise<void>[] = []

  console.log(`Starting ${agentCount} concurrent event writes...\n`)

  for (let i = 0; i < agentCount; i++) {
    const agentName = `agent-${i}`
    const promise = Promise.resolve().then(() => {
      // Each agent creates its own manager instance (simulates parallel agents)
      const agentOS = new CompanyOSManager()

      // Write an event
      agentOS.emitEvent({
        type: `event-from-${agentName}`,
        from: agentName,
        payload: { index: i, timestamp: Date.now() }
      })

      console.log(`✓ ${agentName} wrote event`)
    })

    writes.push(promise)
  }

  // Wait for all writes to complete
  await Promise.all(writes)

  console.log(`\n✓ All ${agentCount} writes completed\n`)

  // Reload state and verify all events are present
  const finalOS = new CompanyOSManager()
  const finalState = finalOS.getState()

  console.log(`Events in final state: ${finalState.events.length}\n`)

  // Check for each expected event
  let found = 0
  const missing: string[] = []

  for (let i = 0; i < agentCount; i++) {
    const agentName = `agent-${i}`
    const hasEvent = finalState.events.some(
      e => e.from === agentName && e.type === `event-from-${agentName}`
    )

    if (hasEvent) {
      found++
    } else {
      missing.push(agentName)
    }
  }

  console.log(`Found ${found}/${agentCount} expected events`)

    if (missing.length > 0) {
      console.log(`\n✗ FAIL: Missing events from: ${missing.join(', ')}`)
      console.log(`\nThis indicates a race condition where concurrent writes`)
      console.log(`clobbered each other. The atomic write-rename pattern should`)
      console.log(`prevent corruption, but without proper queuing or locking,`)
      console.log(`last-write-wins means some updates are lost.\n`)
      process.chdir(originalCwd)
      cleanup()
      process.exit(1)
    } else {
      console.log(`\n✓ PASS: All events preserved, no lost writes!`)
      console.log(`\nThe write queue successfully prevented race conditions.\n`)
      process.chdir(originalCwd)
      cleanup()
      process.exit(0)
    }
  } catch (error) {
    process.chdir(originalCwd)
    cleanup()
    throw error
  }
}

testConcurrentWrites()
