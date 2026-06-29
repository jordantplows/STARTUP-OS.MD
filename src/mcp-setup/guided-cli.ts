import { execSync } from 'child_process'
import { createInterface } from 'readline'

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt: string): Promise<string> {
  return new Promise(resolve => {
    readline.question(prompt, answer => {
      resolve(answer.trim())
    })
  })
}

function exec(command: string, options?: { silent?: boolean }): string {
  try {
    const result = execSync(command, {
      encoding: 'utf-8',
      stdio: options?.silent ? 'pipe' : 'inherit'
    })
    return result
  } catch (error: any) {
    if (!options?.silent) {
      console.error(`Command failed: ${command}`)
      console.error(error.message)
    }
    throw error
  }
}

export interface GuidedCLIConfig {
  toolName: string
  cliCommand: string
  checkInstalled: string
  installInstructions: {
    macos?: string
    linux?: string
    windows?: string
    fallback: string
  }
  loginCommand?: string
  createCommand?: string
  getCredsCommand?: string
}

export async function guidedCLISetup(config: GuidedCLIConfig): Promise<{
  success: boolean
  credentials?: Record<string, string>
  error?: string
}> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(` ${config.toolName} Setup (Guided CLI)`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  // Step 1: Check CLI installation
  console.log(`Step 1: Checking ${config.toolName} CLI...`)
  try {
    exec(config.checkInstalled, { silent: true })
    console.log(`✓ ${config.toolName} CLI is installed`)
  } catch {
    console.log(`${config.toolName} CLI not found.`)

    const platform = process.platform
    let installCmd = config.installInstructions.fallback

    if (platform === 'darwin' && config.installInstructions.macos) {
      installCmd = config.installInstructions.macos
    } else if (platform === 'linux' && config.installInstructions.linux) {
      installCmd = config.installInstructions.linux
    } else if (platform === 'win32' && config.installInstructions.windows) {
      installCmd = config.installInstructions.windows
    }

    console.log(`\nTo install, run:\n  ${installCmd}\n`)
    const shouldInstall = await question('Try installing now? [Y/n] ')

    if (shouldInstall.toLowerCase() !== 'n') {
      try {
        exec(installCmd)
        console.log(`✓ ${config.toolName} CLI installed`)
      } catch (error: any) {
        readline.close()
        return {
          success: false,
          error: `Failed to install ${config.toolName} CLI: ${error.message}`
        }
      }
    } else {
      readline.close()
      return {
        success: false,
        error: 'Setup cancelled - CLI not installed'
      }
    }
  }

  // Step 2: Authentication
  if (config.loginCommand) {
    console.log(`\nStep 2: Authenticating...`)
    const continueAuth = await question('Continue with authentication? [Y/n] ')

    if (continueAuth.toLowerCase() === 'n') {
      readline.close()
      return {
        success: false,
        error: 'Setup cancelled by user'
      }
    }

    try {
      exec(config.loginCommand)
      console.log('✓ Authentication successful')
    } catch (error: any) {
      readline.close()
      return {
        success: false,
        error: `Authentication failed: ${error.message}`
      }
    }
  }

  // Step 3: Create resource (if applicable)
  let credentials: Record<string, string> = {}

  if (config.createCommand) {
    console.log(`\nStep 3: Creating ${config.toolName} resource...`)
    const createNow = await question('Create new resource? [Y/n] ')

    if (createNow.toLowerCase() !== 'n') {
      try {
        const output = exec(config.createCommand, { silent: true })
        console.log(`✓ Resource created`)

        // Try to parse credentials from output
        if (config.getCredsCommand) {
          const credsOutput = exec(config.getCredsCommand, { silent: true })
          // Parse credentials - this is tool-specific
          // For now, just store the raw output
          credentials.rawOutput = credsOutput
        }
      } catch (error: any) {
        readline.close()
        return {
          success: false,
          error: `Failed to create resource: ${error.message}`
        }
      }
    }
  }

  readline.close()
  return {
    success: true,
    credentials
  }
}
