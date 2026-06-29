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

export interface APIKeyConfig {
  toolName: string
  keyLabel: string
  keyFormat?: RegExp
  additionalFields?: {
    name: string
    label: string
    required: boolean
    format?: RegExp
  }[]
  instructions?: string
  docsUrl?: string
}

export async function apiKeySetup(config: APIKeyConfig): Promise<{
  success: boolean
  credentials?: Record<string, string>
  error?: string
}> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(` ${config.toolName} Setup (API Key)`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  if (config.instructions) {
    console.log(config.instructions)
    console.log()
  }

  if (config.docsUrl) {
    console.log(`Documentation: ${config.docsUrl}\n`)
  }

  const credentials: Record<string, string> = {}

  // Get main API key
  while (true) {
    const apiKey = await question(`${config.keyLabel}: `)

    if (!apiKey) {
      const cancel = await question('No key provided. Cancel setup? [Y/n] ')
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
    if (config.keyFormat && !config.keyFormat.test(apiKey)) {
      console.log(`Invalid key format. Expected pattern: ${config.keyFormat.source}`)
      const retry = await question('Try again? [Y/n] ')
      if (retry.toLowerCase() === 'n') {
        readline.close()
        return {
          success: false,
          error: 'Invalid API key format'
        }
      }
      continue
    }

    credentials.apiKey = apiKey
    break
  }

  // Get additional fields
  if (config.additionalFields) {
    for (const field of config.additionalFields) {
      while (true) {
        const value = await question(`${field.label}${field.required ? '' : ' (optional)'}: `)

        if (!value && !field.required) {
          break
        }

        if (!value && field.required) {
          console.log('This field is required.')
          continue
        }

        if (field.format && value && !field.format.test(value)) {
          console.log(`Invalid format. Expected pattern: ${field.format.source}`)
          const retry = await question('Try again? [Y/n] ')
          if (retry.toLowerCase() === 'n') {
            if (field.required) {
              readline.close()
              return {
                success: false,
                error: `Invalid ${field.label} format`
              }
            }
            break
          }
          continue
        }

        credentials[field.name] = value
        break
      }
    }
  }

  console.log('\n✓ Credentials collected')

  readline.close()
  return {
    success: true,
    credentials
  }
}
