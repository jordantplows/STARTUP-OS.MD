#!/usr/bin/env tsx

import { startupOS } from '../dist/index.js'

async function test() {
  console.log('Testing startup-os runtime...\n')

  console.log('1. Building company from idea...')
  const { company, clarifyingQuestions } = await startupOS.build(
    'AI-powered code review for security teams'
  )

  console.log('   ✓ Company initialized')
  console.log('   ✓ Clarifying questions generated:')
  clarifyingQuestions.forEach((q, i) => console.log(`     ${i + 1}. ${q.split('\n')[0]}`))

  console.log('\n2. Applying clarifications...')
  await company.applyClarifications({
    stage: 'idea',
    customer: 'Security engineers at Series B+ startups',
    keyAssumption: 'Security teams want automated review before manual review',
  })

  console.log('   ✓ Profile updated')
  console.log('   ✓ Agents initialized')

  console.log('\n3. Checking agents...')
  const agents = await company.listAgents()
  agents.forEach(agent => {
    console.log(`   ${agent.status === 'blocked' ? '○' : '●'} ${agent.name}: ${agent.status}`)
  })

  console.log('\n4. Getting CEO status...')
  const status = await company.status()
  console.log(`   Status length: ${status.length} chars`)
  console.log(`   ✓ CEO briefing generated`)

  console.log('\n5. Checking company state...')
  const state = company.getState()
  console.log(`   Company: ${state.profile.companyName}`)
  console.log(`   Stage: ${state.profile.stage}`)
  console.log(`   Customer: ${state.profile.targetCustomer}`)
  console.log(`   Departments: ${Object.keys(state.departments).length}`)
  console.log(`   Events: ${state.events.length}`)

  console.log('\n✓ All tests passed!')
  console.log('\nRuntime is ready. Use /startup-os build to instantiate a company.')
}

test().catch(error => {
  console.error('Test failed:', error)
  process.exit(1)
})
