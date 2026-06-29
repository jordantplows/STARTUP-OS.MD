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

export interface CLITokenConfig {
  toolName: string
  cliCommand: string
  checkInstalled: string
  installInstructions: {
    macos?: string
    linux?: string
    windows?: string
    fallback: string
  }
  tokenGenerationInstructions: string
  tokenLabel: string
  tokenFormat?: RegExp
}

export async function cliTokenSetup(config: CLITokenConfig): Promise<{
  success: boolean
  token?: string
  error?: string
}> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(` ${config.toolName} Setup (CLI + Token)`)
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

  // Step 2: Get token
  console.log(`\nStep 2: Getting ${config.toolName} token...`)
  console.log(config.tokenGenerationInstructions)
  console.log()

  while (true) {
    const token = await question(`${config.tokenLabel}: `)

    if (!token) {
      const cancel = await question('No token provided. Cancel setup? [Y/n] ')
      if (cancel.toLowerCase() !== 'n') {
        readline.close()
        return {
          success: false,
          error: 'Setup cancelled by user'
        }
      }
      continue
    }

    // Validate format if provided
    if (config.tokenFormat && !config.tokenFormat.test(token)) {
      console.log(`Invalid token format. Expected pattern: ${config.tokenFormat.source}`)
      const retry = await question('Try again? [Y/n] ')
      if (retry.toLowerCase() === 'n') {
        readline.close()
        return {
          success: false,
          error: 'Invalid token format'
        }
      }
      continue
    }

    console.log('\n✓ Token collected')
    readline.close()
    return {
      success: true,
      token
    }
  }
}
