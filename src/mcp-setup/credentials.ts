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

export interface CredentialsField {
  name: string
  label: string
  required: boolean
  format?: RegExp
  secret?: boolean
}

export interface CredentialsConfig {
  toolName: string
  fields: CredentialsField[]
  instructions?: string
  docsUrl?: string
}

export async function credentialsSetup(config: CredentialsConfig): Promise<{
  success: boolean
  credentials?: Record<string, string>
  error?: string
}> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(` ${config.toolName} Setup (Credentials)`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  if (config.instructions) {
    console.log(config.instructions)
    console.log()
  }

  if (config.docsUrl) {
    console.log(`Documentation: ${config.docsUrl}\n`)
  }

  const credentials: Record<string, string> = {}

  for (const field of config.fields) {
    while (true) {
      const prompt = `${field.label}${field.required ? '' : ' (optional)'}${field.secret ? ' (hidden)' : ''}: `
      const value = await question(prompt)

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

  console.log('\n✓ Credentials collected')

  readline.close()
  return {
    success: true,
    credentials
  }
}
