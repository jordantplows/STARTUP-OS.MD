import { readFileSync } from 'fs'
import { join } from 'path'

export interface MCPRegistryEntry {
  id: string
  name: string
  activates: string[]
  setupFlow: 'guided-cli' | 'oauth' | 'api-key' | 'credentials' | 'cli-token'
  description: string
  tripwire: boolean
}

export interface MCPRegistry {
  categories: Record<string, MCPRegistryEntry[]>
}

export interface MCPRecommendation {
  tool: MCPRegistryEntry
  category: string
  recommendedBy: string[]
  blockedWithout: boolean
  reason: string
}

export class MCPRegistryLoader {
  private registry: MCPRegistry | null = null
  private registryPath: string

  constructor(customPath?: string) {
    this.registryPath = customPath || join(process.cwd(), 'mcp', 'registry.json')
  }

  load(): MCPRegistry {
    if (this.registry) {
      return this.registry
    }

    try {
      const raw = readFileSync(this.registryPath, 'utf-8')
      this.registry = JSON.parse(raw)
      return this.registry!
    } catch (error) {
      console.warn('Failed to load MCP registry, using empty registry')
      return { categories: {} }
    }
  }

  findTool(toolId: string): { tool: MCPRegistryEntry; category: string } | null {
    const registry = this.load()

    for (const [categoryName, tools] of Object.entries(registry.categories)) {
      const tool = tools.find(t => t.id === toolId || t.name.toLowerCase() === toolId.toLowerCase())
      if (tool) {
        return { tool, category: categoryName }
      }
    }

    return null
  }

  getToolsForDepartments(departments: string[]): MCPRegistryEntry[] {
    const registry = this.load()
    const matchedTools: MCPRegistryEntry[] = []

    for (const tools of Object.values(registry.categories)) {
      for (const tool of tools) {
        // Check if any department matches
        const matches = tool.activates.some(
          dep => departments.includes(dep) || dep === 'all'
        )
        if (matches) {
          matchedTools.push(tool)
        }
      }
    }

    return matchedTools
  }

  getAllTools(): { category: string; tools: MCPRegistryEntry[] }[] {
    const registry = this.load()
    return Object.entries(registry.categories).map(([category, tools]) => ({
      category,
      tools
    }))
  }

  getCategoryName(categoryKey: string): string {
    const names: Record<string, string> = {
      'database': 'DATABASE',
      'product-and-engineering': 'PRODUCT & ENGINEERING',
      'docs-and-knowledge': 'DOCS & KNOWLEDGE',
      'sales-and-crm': 'SALES & CRM',
      'payments-and-finance': 'PAYMENTS & FINANCE',
      'marketing-and-email': 'MARKETING & EMAIL',
      'communication': 'COMMUNICATION',
      'analytics-and-data': 'ANALYTICS & DATA',
      'legal-and-compliance': 'LEGAL & COMPLIANCE',
      'hr-and-people': 'HR & PEOPLE'
    }
    return names[categoryKey] || categoryKey.toUpperCase()
  }
}

export interface DepartmentMCPNeed {
  department: string
  tools: string[]
  reason: string
  blockedWithout: boolean
}

export function detectDepartmentNeeds(
  departmentName: string,
  companyProfile: any,
  registry: MCPRegistryLoader
): DepartmentMCPNeed | null {
  const profile = companyProfile?.profile || companyProfile

  // Product department
  if (departmentName === 'product' || departmentName === 'cpo') {
    const needsDatabase = (
      profile.oneline?.toLowerCase().includes('platform') ||
      profile.oneline?.toLowerCase().includes('saas') ||
      profile.oneline?.toLowerCase().includes('dashboard') ||
      profile.oneline?.toLowerCase().includes('user') ||
      profile.businessModel?.toLowerCase().includes('saas')
    )

    if (needsDatabase) {
      return {
        department: 'product',
        tools: ['supabase'],
        reason: 'Product needs persistent storage for user accounts and saved data',
        blockedWithout: true
      }
    }

    // Also might need Linear for product management
    return {
      department: 'product',
      tools: ['linear', 'notion'],
      reason: 'Product planning, roadmaps, and sprint tracking',
      blockedWithout: false
    }
  }

  // Engineering department
  if (departmentName === 'engineering' || departmentName === 'cto') {
    return {
      department: 'engineering',
      tools: ['github', 'linear', 'vercel'],
      reason: 'Code repos, issue tracking, and deployment monitoring',
      blockedWithout: false
    }
  }

  // Marketing department
  if (departmentName === 'marketing' || departmentName === 'cmo') {
    return {
      department: 'marketing',
      tools: ['resend', 'mailchimp'],
      reason: 'Email campaigns and transactional messaging',
      blockedWithout: false
    }
  }

  // Sales department
  if (departmentName === 'sales') {
    return {
      department: 'sales',
      tools: ['hubspot', 'salesforce'],
      reason: 'CRM, pipeline management, and deal tracking',
      blockedWithout: false
    }
  }

  // Finance department
  if (departmentName === 'finance' || departmentName === 'cfo') {
    const hasRevenue = profile.stage === 'revenue' || (profile.revenue && profile.revenue > 0)
    if (hasRevenue) {
      return {
        department: 'finance',
        tools: ['stripe', 'quickbooks'],
        reason: 'Payment processing and financial tracking',
        blockedWithout: false
      }
    }
  }

  // People/HR department
  if (departmentName === 'people' || departmentName === 'hr') {
    return {
      department: 'people',
      tools: ['greenhouse', 'notion'],
      reason: 'Recruiting, hiring, and team documentation',
      blockedWithout: false
    }
  }

  // Operations department
  if (departmentName === 'operations' || departmentName === 'coo') {
    return {
      department: 'operations',
      tools: ['notion', 'slack'],
      reason: 'Process documentation and team coordination',
      blockedWithout: false
    }
  }

  // Data/Metrics department
  if (departmentName === 'data' || departmentName === 'metrics') {
    return {
      department: 'metrics',
      tools: ['posthog', 'amplitude'],
      reason: 'Product analytics and user behavior tracking',
      blockedWithout: false
    }
  }

  // Customer department
  if (departmentName === 'customer') {
    return {
      department: 'customer',
      tools: ['intercom', 'slack'],
      reason: 'Customer support and communication',
      blockedWithout: false
    }
  }

  // Outreach department
  if (departmentName === 'outreach') {
    return {
      department: 'outreach',
      tools: ['resend', 'linkedin'],
      reason: 'Cold outreach and email campaigns',
      blockedWithout: false
    }
  }

  // Investor department
  if (departmentName === 'investor') {
    return {
      department: 'investor',
      tools: ['gdrive', 'docusign'],
      reason: 'Data room, term sheets, and investor documents',
      blockedWithout: false
    }
  }

  return null
}
