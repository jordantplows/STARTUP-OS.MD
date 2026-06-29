import { writeFileSync, existsSync, readFileSync, appendFileSync } from 'fs'
import { join } from 'path'
import { CompanyOSManager } from './company-os.js'
import { MCPRegistryLoader, MCPRegistryEntry, MCPRecommendation, detectDepartmentNeeds } from './mcp-registry.js'
import { guidedCLISetup, GuidedCLIConfig } from './mcp-setup/guided-cli.js'
import { oauthSetup, OAuthConfig } from './mcp-setup/oauth.js'
import { apiKeySetup, APIKeyConfig } from './mcp-setup/api-key.js'
import { credentialsSetup, CredentialsConfig } from './mcp-setup/credentials.js'
import { cliTokenSetup, CLITokenConfig } from './mcp-setup/cli-token.js'

export class MCPConnector {
  private registry: MCPRegistryLoader
  private os: CompanyOSManager

  constructor(os: CompanyOSManager) {
    this.os = os
    this.registry = new MCPRegistryLoader()
  }

  async connect(toolId: string): Promise<boolean> {
    const result = this.registry.findTool(toolId)
    if (!result) {
      console.error(`Tool "${toolId}" not found in registry.`)
      return false
    }

    const { tool, category } = result

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(` Connecting ${tool.name}`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`Category: ${category}`)
    console.log(`Description: ${tool.description}`)
    console.log(`Activates: ${tool.activates.join(', ')}`)

    if (tool.tripwire) {
      console.log(`\n⚠️  WARNING: This tool can send data or trigger actions.`)
      console.log(`Review ${tool.name}'s terms and privacy policy before connecting.`)
    }

    // Route to appropriate setup flow
    let setupResult: { success: boolean; credentials?: any; token?: string; error?: string }

    switch (tool.setupFlow) {
      case 'guided-cli':
        setupResult = await this.setupGuidedCLI(tool)
        break
      case 'oauth':
        setupResult = await this.setupOAuth(tool)
        break
      case 'api-key':
        setupResult = await this.setupAPIKey(tool)
        break
      case 'credentials':
        setupResult = await this.setupCredentials(tool)
        break
      case 'cli-token':
        setupResult = await this.setupCLIToken(tool)
        break
      default:
        console.error(`Unknown setup flow: ${tool.setupFlow}`)
        return false
    }

    if (!setupResult.success) {
      console.error(`\nSetup failed: ${setupResult.error}`)
      return false
    }

    // Save credentials to .env.local
    this.saveCredentials(tool, setupResult.credentials || { token: setupResult.token })

    // Update company.os
    this.os.connectMCP(tool.id, tool.activates)

    const state = this.os.getState()
    state.mcps[tool.id] = {
      connected: true,
      activates: tool.activates,
      lastUsed: new Date().toISOString(),
      legalReviewed: false,
      setupFlow: tool.setupFlow,
      activatedDepartments: tool.activates,
      connectedAt: new Date().toISOString(),
      tripwire: tool.tripwire
    }
    this.os.save()

    console.log(`\n✓ ${tool.name} connected successfully`)
    return true
  }

  private async setupGuidedCLI(tool: MCPRegistryEntry): Promise<any> {
    // Tool-specific configurations
    const configs: Record<string, GuidedCLIConfig> = {
      supabase: {
        toolName: 'Supabase',
        cliCommand: 'supabase',
        checkInstalled: 'which supabase',
        installInstructions: {
          macos: 'brew install supabase/tap/supabase',
          linux: 'npm install -g supabase',
          windows: 'npm install -g supabase',
          fallback: 'npm install -g supabase'
        },
        loginCommand: 'supabase login',
        createCommand: 'supabase projects create my-project --org-id [org] --db-password [pass] --region us-east-1',
        getCredsCommand: 'supabase projects api-keys --project-ref [ref]'
      },
      planetscale: {
        toolName: 'PlanetScale',
        cliCommand: 'pscale',
        checkInstalled: 'which pscale',
        installInstructions: {
          macos: 'brew install planetscale/tap/pscale',
          linux: 'curl -fsSL https://raw.githubusercontent.com/planetscale/cli/main/install.sh | bash',
          fallback: 'npm install -g @planetscale/cli'
        },
        loginCommand: 'pscale auth login'
      }
    }

    const config = configs[tool.id]
    if (!config) {
      return { success: false, error: 'No guided CLI config for this tool' }
    }

    return await guidedCLISetup(config)
  }

  private async setupOAuth(tool: MCPRegistryEntry): Promise<any> {
    // Tool-specific OAuth configurations
    const configs: Record<string, OAuthConfig> = {
      github: {
        toolName: 'GitHub',
        authUrl: 'https://github.com/login/oauth/authorize',
        scopes: ['repo', 'read:org']
      },
      linear: {
        toolName: 'Linear',
        authUrl: 'https://linear.app/oauth/authorize',
        scopes: ['read', 'write']
      },
      notion: {
        toolName: 'Notion',
        authUrl: 'https://api.notion.com/v1/oauth/authorize',
        scopes: ['read_content', 'update_content']
      },
      slack: {
        toolName: 'Slack',
        authUrl: 'https://slack.com/oauth/v2/authorize',
        scopes: ['chat:write', 'channels:read']
      }
    }

    const config = configs[tool.id]
    if (!config) {
      return { success: false, error: 'No OAuth config for this tool' }
    }

    return await oauthSetup(config)
  }

  private async setupAPIKey(tool: MCPRegistryEntry): Promise<any> {
    // Tool-specific API key configurations
    const configs: Record<string, APIKeyConfig> = {
      stripe: {
        toolName: 'Stripe',
        keyLabel: 'Stripe Secret Key',
        keyFormat: /^sk_(test|live)_[a-zA-Z0-9]{24,}$/,
        docsUrl: 'https://dashboard.stripe.com/apikeys'
      },
      resend: {
        toolName: 'Resend',
        keyLabel: 'Resend API Key',
        keyFormat: /^re_[a-zA-Z0-9]{32,}$/,
        docsUrl: 'https://resend.com/api-keys'
      },
      posthog: {
        toolName: 'PostHog',
        keyLabel: 'PostHog API Key',
        additionalFields: [
          {
            name: 'projectUrl',
            label: 'PostHog Project URL',
            required: true
          }
        ],
        docsUrl: 'https://posthog.com/docs/api'
      }
    }

    const config = configs[tool.id]
    if (!config) {
      // Generic API key setup
      return await apiKeySetup({
        toolName: tool.name,
        keyLabel: `${tool.name} API Key`
      })
    }

    return await apiKeySetup(config)
  }

  private async setupCredentials(tool: MCPRegistryEntry): Promise<any> {
    // Tool-specific credential configurations
    const configs: Record<string, CredentialsConfig> = {
      postgres: {
        toolName: 'PostgreSQL',
        fields: [
          { name: 'host', label: 'Host', required: true },
          { name: 'port', label: 'Port', required: false, format: /^\d+$/ },
          { name: 'database', label: 'Database', required: true },
          { name: 'username', label: 'Username', required: true },
          { name: 'password', label: 'Password', required: true, secret: true }
        ]
      },
      mongodb: {
        toolName: 'MongoDB',
        fields: [
          { name: 'connectionString', label: 'Connection String (mongodb://...)', required: true }
        ]
      }
    }

    const config = configs[tool.id]
    if (!config) {
      return { success: false, error: 'No credentials config for this tool' }
    }

    return await credentialsSetup(config)
  }

  private async setupCLIToken(tool: MCPRegistryEntry): Promise<any> {
    // Tool-specific CLI + token configurations
    const configs: Record<string, CLITokenConfig> = {
      vercel: {
        toolName: 'Vercel',
        cliCommand: 'vercel',
        checkInstalled: 'which vercel',
        installInstructions: {
          fallback: 'npm install -g vercel'
        },
        tokenGenerationInstructions: 'Generate a token at: https://vercel.com/account/tokens',
        tokenLabel: 'Vercel Token'
      }
    }

    const config = configs[tool.id]
    if (!config) {
      return { success: false, error: 'No CLI token config for this tool' }
    }

    return await cliTokenSetup(config)
  }

  private saveCredentials(tool: MCPRegistryEntry, credentials: Record<string, string>): void {
    const envPath = join(process.cwd(), '.env.local')
    const toolPrefix = tool.id.toUpperCase().replace(/-/g, '_')

    const envLines: string[] = [`\n# ${tool.name} Configuration`]

    for (const [key, value] of Object.entries(credentials)) {
      const envKey = `${toolPrefix}_${key.toUpperCase()}`
      envLines.push(`${envKey}=${value}`)
    }

    if (existsSync(envPath)) {
      const existing = readFileSync(envPath, 'utf-8')
      if (!existing.includes(`# ${tool.name} Configuration`)) {
        appendFileSync(envPath, envLines.join('\n') + '\n')
      }
    } else {
      writeFileSync(envPath, envLines.join('\n').trim() + '\n')
    }

    // Ensure .env.local is in .gitignore
    const gitignorePath = join(process.cwd(), '.gitignore')
    if (existsSync(gitignorePath)) {
      const gitignore = readFileSync(gitignorePath, 'utf-8')
      if (!gitignore.includes('.env.local')) {
        appendFileSync(gitignorePath, '\n.env.local\n')
      }
    } else {
      writeFileSync(gitignorePath, '.env.local\n')
    }
  }

  getRecommendations(): MCPRecommendation[] {
    const state = this.os.getState()
    const allRecommendations: Map<string, MCPRecommendation> = new Map()

    // Collect needs from all departments
    const departments = Object.keys(state.departments)

    for (const dept of departments) {
      const needs = detectDepartmentNeeds(dept, state.profile, this.registry)
      if (!needs) continue

      for (const toolId of needs.tools) {
        const toolResult = this.registry.findTool(toolId)
        if (!toolResult) continue

        const existing = allRecommendations.get(toolId)
        if (existing) {
          // Add this department to the list
          if (!existing.recommendedBy.includes(needs.department)) {
            existing.recommendedBy.push(needs.department)
          }
          // If any department blocks on it, mark as blocked
          if (needs.blockedWithout) {
            existing.blockedWithout = true
          }
        } else {
          allRecommendations.set(toolId, {
            tool: toolResult.tool,
            category: toolResult.category,
            recommendedBy: [needs.department],
            blockedWithout: needs.blockedWithout,
            reason: needs.reason
          })
        }
      }
    }

    // Sort: blockedWithout first, then by number of departments recommending
    return Array.from(allRecommendations.values()).sort((a, b) => {
      if (a.blockedWithout && !b.blockedWithout) return -1
      if (!a.blockedWithout && b.blockedWithout) return 1
      return b.recommendedBy.length - a.recommendedBy.length
    })
  }

  displayRecommendations(showAll: boolean = false): void {
    const recommendations = this.getRecommendations()

    if (recommendations.length === 0) {
      console.log('\nNo MCP recommendations at this time.\n')
      return
    }

    if (!showAll) {
      // Show top 5
      console.log('\n━━ CONNECT TOOLS TO ACTIVATE YOUR COMPANY ━━━━━━━')
      console.log('Your company is compiled but not yet running.\n')

      const top = recommendations.slice(0, 5)
      top.forEach((rec, idx) => {
        const tripwireSymbol = rec.tool.tripwire ? ' ⚠' : ''
        const depts = rec.recommendedBy.join(', ')
        console.log(`[${idx + 1}] ${rec.tool.name} → unlocks ${depts}${tripwireSymbol}`)
        console.log(`    ${rec.reason}`)
        console.log(`    [${rec.tool.setupFlow} — ~2-5 minutes]\n`)
      })

      if (recommendations.length > 5) {
        console.log(`[${top.length + 1}] Show ${recommendations.length - 5} more options\n`)
      }

      console.log('Type a number, "show more", or "later":\n')
    } else {
      // Show all grouped by category
      console.log('\n━━ ALL AVAILABLE MCPS ━━━━━━━━━━━━━━━━━━━━━━━━━\n')

      const byCategory = new Map<string, MCPRecommendation[]>()
      for (const rec of recommendations) {
        const existing = byCategory.get(rec.category) || []
        existing.push(rec)
        byCategory.set(rec.category, existing)
      }

      for (const [category, recs] of byCategory.entries()) {
        console.log(this.registry.getCategoryName(category))
        for (const rec of recs) {
          const star = rec.recommendedBy.length > 0 ? '⭐ ' : '   '
          const depts = rec.recommendedBy.length > 0
            ? ` → ${rec.recommendedBy.join(', ')}`
            : ''
          console.log(`${star}${rec.tool.name}${depts}`)
        }
        console.log()
      }

      console.log('⭐ = recommended based on your current company state\n')
      console.log('Type any tool name to connect it, or "back":\n')
    }
  }
}
