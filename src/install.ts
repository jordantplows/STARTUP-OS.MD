#!/usr/bin/env node

import { existsSync, mkdirSync, cpSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { homedir } from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Registers the /startup-os skill with Claude Code
 * by copying .claude/skills/startup-os/ to the appropriate location
 */
function registerSkill(): void {
  console.log('📦 startup-os: Registering skill with Claude Code...\n')

  // Source: .claude/skills/startup-os/ in the package
  const packageRoot = join(__dirname, '..')
  const skillSource = join(packageRoot, '.claude', 'skills', 'startup-os')

  if (!existsSync(skillSource)) {
    console.error('❌ Error: Skill source not found in package')
    console.error(`   Expected: ${skillSource}`)
    return
  }

  // Try to find Claude Code's skills directory
  // Priority:
  // 1. .claude/skills/ in current working directory (project-specific)
  // 2. ~/.claude/skills/ (global)

  const cwdSkillsDir = join(process.cwd(), '.claude', 'skills')
  const globalSkillsDir = join(homedir(), '.claude', 'skills')

  let targetDir: string | null = null

  // Check if we're in a project with .claude/
  if (existsSync(join(process.cwd(), '.claude'))) {
    targetDir = cwdSkillsDir
    console.log('→ Detected .claude/ in current project')
  } else {
    targetDir = globalSkillsDir
    console.log('→ Using global Claude Code skills directory')
  }

  // Create target directory if it doesn't exist
  if (!existsSync(targetDir)) {
    try {
      mkdirSync(targetDir, { recursive: true })
      console.log(`✓ Created ${targetDir}`)
    } catch (error) {
      console.error('❌ Error: Could not create skills directory')
      console.error(`   ${error}`)
      printManualInstructions(skillSource)
      return
    }
  }

  const targetSkillDir = join(targetDir, 'startup-os')

  // Copy the skill
  try {
    // Remove existing skill if present
    if (existsSync(targetSkillDir)) {
      console.log('→ Updating existing skill')
    }

    cpSync(skillSource, targetSkillDir, { recursive: true, force: true })

    console.log(`\n✅ startup-os registered with Claude Code`)
    console.log(`   Location: ${targetSkillDir}`)
    console.log(`\n→ Open Claude Code and type: /startup-os build "your idea"`)
    console.log(`→ Or run directly: npx startup-os --help\n`)
  } catch (error) {
    console.error('❌ Error: Could not copy skill')
    console.error(`   ${error}`)
    printManualInstructions(skillSource)
  }
}

function printManualInstructions(skillSource: string): void {
  console.log('\n📋 Manual registration instructions:')
  console.log('\n1. Find your Claude Code skills directory:')
  console.log('   - Project-specific: .claude/skills/ in your project')
  console.log('   - Global: ~/.claude/skills/')
  console.log('\n2. Copy the skill:')
  console.log(`   cp -r "${skillSource}" <claude-skills-dir>/`)
  console.log('\n3. Reload Claude Code')
  console.log('\n4. Type: /startup-os build "your idea"\n')
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    registerSkill()
  } catch (error) {
    console.error('❌ Error during skill registration:', error)
    process.exit(1)
  }
}

export { registerSkill }
