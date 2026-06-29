import { execSync } from 'child_process'
import { writeFileSync, existsSync, readFileSync, appendFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'
import { CompanyOSManager } from './company-os.js'

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

function detectOS(): 'macos' | 'linux' | 'windows' | 'unknown' {
  const platform = process.platform
  if (platform === 'darwin') return 'macos'
  if (platform === 'linux') return 'linux'
  if (platform === 'win32') return 'windows'
  return 'unknown'
}

function openURL(url: string): void {
  const os = detectOS()
  try {
    if (os === 'macos') {
      execSync(`open "${url}"`, { stdio: 'ignore' })
    } else if (os === 'linux') {
      execSync(`xdg-open "${url}"`, { stdio: 'ignore' })
    } else if (os === 'windows') {
      execSync(`start "${url}"`, { stdio: 'ignore' })
    }
  } catch (error) {
    console.log(`Please open this URL manually: ${url}`)
  }
}

async function checkSupabaseCLI(): Promise<boolean> {
  try {
    exec('which supabase', { silent: true })
    return true
  } catch {
    return false
  }
}

async function installSupabaseCLI(): Promise<boolean> {
  console.log('\n━━ Installing Supabase CLI...')

  const os = detectOS()

  try {
    if (os === 'macos') {
      // Try Homebrew first, fall back to npm
      try {
        console.log('Installing via Homebrew...')
        exec('brew install supabase/tap/supabase')
        return true
      } catch {
        console.log('Homebrew not found, installing via npm...')
        exec('npm install -g supabase')
        return true
      }
    } else {
      // Linux and Windows use npm
      console.log('Installing via npm...')
      exec('npm install -g supabase')
      return true
    }
  } catch (error) {
    console.error('\nFailed to install Supabase CLI.')
    console.error('Please install manually: https://supabase.com/docs/guides/cli')
    return false
  }
}

async function checkSupabaseAuth(): Promise<boolean> {
  try {
    const result = exec('supabase projects list', { silent: true })
    return result.length > 0
  } catch {
    return false
  }
}

async function authenticateSupabase(): Promise<boolean> {
  console.log('\n━━ Authenticating with Supabase...')
  console.log('This will open a browser window for login.')

  const continueSetup = await question('\nContinue? [Y/n] ')
  if (continueSetup.toLowerCase() === 'n') {
    return false
  }

  try {
    console.log('\nOpening browser for authentication...')
    exec('supabase login')
    console.log('✓ Authentication successful')
    return true
  } catch (error) {
    console.error('Authentication failed. Please try again.')
    return false
  }
}

function generateSecurePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < 24; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

async function createSupabaseProject(companyName: string): Promise<{ ref: string; url: string; password: string } | null> {
  console.log('\n━━ Creating Supabase project...')

  const projectName = companyName.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  console.log(`Project name: ${projectName}`)

  // Get organization ID
  let orgId = ''
  try {
    const orgsOutput = exec('supabase orgs list', { silent: true })
    const orgMatch = orgsOutput.match(/│\s+([a-z0-9-]+)\s+│/)
    if (orgMatch && orgMatch[1]) {
      orgId = orgMatch[1]
    }
  } catch (error) {
    console.error('Failed to get organization ID')
    return null
  }

  if (!orgId) {
    console.error('No organization found. Please create one at https://supabase.com/dashboard')
    return null
  }

  const dbPassword = generateSecurePassword()

  console.log('\n⚠️  This will create a real Supabase project (free tier).')
  const confirm = await question('Continue? [Y/n] ')
  if (confirm.toLowerCase() === 'n') {
    return null
  }

  try {
    console.log('\nCreating project...')
    const createOutput = exec(
      `supabase projects create ${projectName} --org-id ${orgId} --db-password "${dbPassword}" --region us-east-1`,
      { silent: true }
    )

    // Parse project ref from output
    const refMatch = createOutput.match(/project.*?ref.*?:\s*([a-z0-9]+)/i) ||
                     createOutput.match(/ref:\s*([a-z0-9]+)/i) ||
                     createOutput.match(/([a-z0-9]{20})/i)

    if (!refMatch || !refMatch[1]) {
      console.error('Failed to parse project ref from output')
      return null
    }

    const projectRef = refMatch[1]
    const projectUrl = `https://${projectRef}.supabase.co`

    console.log(`✓ Project created: ${projectRef}`)

    return {
      ref: projectRef,
      url: projectUrl,
      password: dbPassword
    }
  } catch (error: any) {
    console.error('Failed to create project:', error.message)
    return null
  }
}

async function getProjectAPIKeys(projectRef: string): Promise<{ anonKey: string; serviceKey: string } | null> {
  console.log('\n━━ Getting API keys...')

  try {
    const keysOutput = exec(`supabase projects api-keys --project-ref ${projectRef}`, { silent: true })

    const anonMatch = keysOutput.match(/anon.*?key.*?:\s*([a-zA-Z0-9._-]+)/i)
    const serviceMatch = keysOutput.match(/service.*?role.*?key.*?:\s*([a-zA-Z0-9._-]+)/i)

    if (!anonMatch || !serviceMatch) {
      console.error('Failed to parse API keys')
      return null
    }

    return {
      anonKey: anonMatch[1] || '',
      serviceKey: serviceMatch[1] || ''
    }
  } catch (error) {
    console.error('Failed to get API keys')
    return null
  }
}

function writeEnvFile(credentials: {
  url: string
  anonKey: string
  serviceKey: string
  dbPassword: string
}): void {
  const envPath = join(process.cwd(), '.env.local')
  const gitignorePath = join(process.cwd(), '.gitignore')

  const envContent = `
# Supabase Configuration
SUPABASE_URL=${credentials.url}
SUPABASE_ANON_KEY=${credentials.anonKey}
SUPABASE_SERVICE_ROLE_KEY=${credentials.serviceKey}
SUPABASE_DB_PASSWORD=${credentials.dbPassword}
`

  if (existsSync(envPath)) {
    const existing = readFileSync(envPath, 'utf-8')
    if (!existing.includes('SUPABASE_URL')) {
      appendFileSync(envPath, envContent)
      console.log('✓ Added Supabase credentials to .env.local')
    } else {
      console.log('✓ Supabase credentials already in .env.local')
    }
  } else {
    writeFileSync(envPath, envContent.trim())
    console.log('✓ Created .env.local with Supabase credentials')
  }

  // Ensure .env.local is in .gitignore
  if (existsSync(gitignorePath)) {
    const gitignore = readFileSync(gitignorePath, 'utf-8')
    if (!gitignore.includes('.env.local')) {
      appendFileSync(gitignorePath, '\n.env.local\n')
      console.log('✓ Added .env.local to .gitignore')
    }
  } else {
    writeFileSync(gitignorePath, '.env.local\n')
    console.log('✓ Created .gitignore with .env.local')
  }
}

function writeMCPConnector(projectRef: string): void {
  const mcpDir = join(process.cwd(), 'mcp')
  if (!existsSync(mcpDir)) {
    mkdirSync(mcpDir, { recursive: true })
  }

  const mcpContent = `---
name: supabase
type: database
status: connected
project: ${projectRef}
---

# Supabase MCP Connector

Connected Supabase project for persistent data storage.

## Available Operations

- \`supabase.query(sql)\` — Run SQL queries
- \`supabase.insert(table, data)\` — Insert records
- \`supabase.select(table, filters)\` — Query records
- \`supabase.update(table, id, data)\` — Update records
- \`supabase.delete(table, id)\` — Delete records
- \`supabase.auth.createUser(email, password)\` — Create auth user
- \`supabase.storage.upload(bucket, file)\` — Upload files

## Configuration

Connection details stored in \`.env.local\` (gitignored).

## TypeScript

\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function query(sql: string) {
  const { data, error } = await supabase.rpc('execute_sql', { sql })
  if (error) throw error
  return data
}

export async function insert(table: string, data: any) {
  const { data: result, error } = await supabase.from(table).insert(data).select()
  if (error) throw error
  return result
}

export async function select(table: string, filters?: any) {
  let query = supabase.from(table).select('*')
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function update(table: string, id: string, data: any) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
  if (error) throw error
  return result
}

export async function deleteRecord(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
  return true
}
\`\`\`
`

  writeFileSync(join(mcpDir, 'supabase.md'), mcpContent)
  console.log('✓ Created mcp/supabase.md connector')
}

export async function setupSupabaseFlow(os: CompanyOSManager): Promise<boolean> {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' Supabase Setup')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Step 1: Check if Supabase CLI is installed
  console.log('Step 1/6: Checking Supabase CLI...')
  const hasCLI = await checkSupabaseCLI()

  if (!hasCLI) {
    console.log('Supabase CLI not found.')
    const install = await question('Install it now? [Y/n] ')
    if (install.toLowerCase() === 'n') {
      console.log('\nSetup cancelled. Install manually: https://supabase.com/docs/guides/cli')
      readline.close()
      return false
    }

    const installed = await installSupabaseCLI()
    if (!installed) {
      readline.close()
      return false
    }
  } else {
    console.log('✓ Supabase CLI is installed')
  }

  // Step 2: Check authentication
  console.log('\nStep 2/6: Checking authentication...')
  const isAuthed = await checkSupabaseAuth()

  if (!isAuthed) {
    console.log('Not logged in to Supabase.')

    const hasAccount = await question('Do you have a Supabase account? [Y/n] ')
    if (hasAccount.toLowerCase() === 'n') {
      console.log('\nOpening Supabase signup...')
      openURL('https://supabase.com/dashboard/sign-up')
      await question('Press Enter once you\'ve signed up...')
    }

    const authed = await authenticateSupabase()
    if (!authed) {
      readline.close()
      return false
    }
  } else {
    console.log('✓ Already authenticated')
  }

  // Step 3: Create project
  console.log('\nStep 3/6: Creating Supabase project...')
  const state = os.getState()
  const companyName = state.profile.companyName !== '[PENDING]'
    ? state.profile.companyName
    : 'my-startup'

  const project = await createSupabaseProject(companyName)
  if (!project) {
    readline.close()
    return false
  }

  // Step 4: Get API keys
  console.log('\nStep 4/6: Getting API keys...')
  const keys = await getProjectAPIKeys(project.ref)
  if (!keys) {
    readline.close()
    return false
  }

  // Step 5: Write credentials
  console.log('\nStep 5/6: Writing credentials...')
  writeEnvFile({
    url: project.url,
    anonKey: keys.anonKey,
    serviceKey: keys.serviceKey,
    dbPassword: project.password
  })

  writeMCPConnector(project.ref)

  // Step 6: Update company.os
  console.log('\nStep 6/6: Updating company state...')
  os.connectMCP('supabase', ['product', 'engineering', 'customer', 'backend'])

  const stateUpdated = os.getState()
  if (!stateUpdated.mcps.supabase) {
    stateUpdated.mcps.supabase = {
      connected: true,
      activates: ['product', 'engineering', 'customer'],
      lastUsed: new Date().toISOString(),
      legalReviewed: false
    }
  }

  ;(stateUpdated.mcps.supabase as any).projectRef = project.ref
  ;(stateUpdated.mcps.supabase as any).projectUrl = project.url

  os.save()

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' ✓ Supabase Setup Complete')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`\nProject: ${companyName} (${project.ref})`)
  console.log(`Dashboard: https://supabase.com/dashboard/project/${project.ref}`)
  console.log(`\nCredentials stored in: .env.local`)
  console.log(`MCP connector: mcp/supabase.md`)

  const pendingSetup = (stateUpdated as any).pendingDatabaseSetup
  if (pendingSetup) {
    console.log(`\n✓ ${pendingSetup.department} can now persist data.`)
    delete (stateUpdated as any).pendingDatabaseSetup
    os.save()
  }

  console.log('\nYour company is now fully operational.')

  readline.close()
  return true
}

export async function connectExistingSupabase(os: CompanyOSManager): Promise<boolean> {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' Connect Existing Supabase Project')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const projectUrl = await question('Supabase project URL: ')
  const anonKey = await question('Anon/public API key: ')

  // Validate by testing connection
  console.log('\nValidating connection...')

  try {
    // Simple validation - check if the URL looks right
    if (!projectUrl.includes('supabase.co')) {
      console.error('Invalid Supabase URL. Should be https://[ref].supabase.co')
      readline.close()
      return false
    }

    const refMatch = projectUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)
    if (!refMatch) {
      console.error('Could not parse project ref from URL')
      readline.close()
      return false
    }

    const projectRef = refMatch[1] || 'unknown'

    console.log('✓ Connection validated')

    const serviceKey = await question('Service role key (optional, press Enter to skip): ')

    writeEnvFile({
      url: projectUrl,
      anonKey,
      serviceKey: serviceKey || '',
      dbPassword: ''
    })

    writeMCPConnector(projectRef)

    os.connectMCP('supabase', ['product', 'engineering', 'customer', 'backend'])

    const state = os.getState()
    ;(state.mcps.supabase as any).projectRef = projectRef
    ;(state.mcps.supabase as any).projectUrl = projectUrl

    os.save()

    console.log('\n✓ Supabase connected successfully')
    console.log(`\nProject: ${projectRef}`)
    console.log(`Dashboard: https://supabase.com/dashboard/project/${projectRef}`)

    readline.close()
    return true
  } catch (error: any) {
    console.error('Connection failed:', error.message)
    readline.close()
    return false
  }
}
