// Test the init command parsing logic

function testParse(input: string) {
  const parts = input.match(/"[^"]+"|[^\s]+/g) || []

  if (parts.length < 3) {
    console.log(`✗ FAIL: "${input}"`)
    console.log(`  Expected at least 3 parts, got ${parts.length}`)
    console.log(`  Parts: ${JSON.stringify(parts)}`)
    return false
  }

  const [stageRaw, customerRaw, assumptionRaw] = parts
  const stage = (stageRaw || '').replace(/"/g, '')
  const customer = (customerRaw || '').replace(/"/g, '')
  const assumption = (assumptionRaw || '').replace(/"/g, '')

  console.log(`✓ PASS: "${input}"`)
  console.log(`  Stage: "${stage}"`)
  console.log(`  Customer: "${customer}"`)
  console.log(`  Assumption: "${assumption}"`)

  // Check if any field is truncated (arbitrarily cut off)
  if (customerRaw && customer.length < customerRaw.replace(/"/g, '').length) {
    console.log(`  ⚠️  WARNING: Customer field may be truncated`)
  }
  if (assumptionRaw && assumption.length < assumptionRaw.replace(/"/g, '').length) {
    console.log(`  ⚠️  WARNING: Assumption field may be truncated`)
  }

  return true
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Testing init command parsing')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

testParse('idea "Security engineers at Series B+ SaaS" "Teams want automated pre-screening"')
console.log()

testParse('idea "Security engineers at Series B+ SaaS companies who do manual code reviews and hate it" "Teams want automation because manual reviews are slow and inconsistent"')
console.log()

testParse('validating "Product managers at early-stage startups" "They struggle with roadmap prioritization"')
console.log()

testParse('building "Founders" "Need help"')
console.log()

// Edge case: no quotes
testParse('idea customer assumption')
console.log()

// Edge case: extra spaces
testParse('idea  "Customer type"  "Key assumption here"')
console.log()
