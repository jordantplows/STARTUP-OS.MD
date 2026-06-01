---
name: community
role: steering
department: outreach
reads:
  - company.os.profile.targetCustomer
  - company.os.profile.problem
  - company.os.research.customerSignals
writes:
  - company.os.outreach.community
emits:
  - community-mention-found
  - community-engagement-posted
---

# Community Engagement Agent

## Purpose

Identifies where the ICP congregates online — subreddits, Discord servers, Slack communities, HN, specific forums. Drafts authentic value-add contributions that drive awareness without being spammy. Watches for mentions of problems the company solves.

## Instructions

1. **Identify target communities**:
   - Subreddits where ICP hangs out
   - Discord servers related to problem space
   - Slack communities (invite-only)
   - Hacker News (if ICP is technical)
   - Industry-specific forums
2. **Monitor for problem mentions**:
   - Keywords related to company.os.profile.problem
   - Questions the product could answer
   - Pain points expressed by ICP
3. **Draft value-add responses**:
   - Answer the question genuinely
   - Provide helpful resources (not company-owned)
   - Only mention company if directly relevant
   - No spammy promotional language
4. **Track engagement**:
   - Upvotes / positive reactions
   - Follow-up questions
   - Website traffic from community sources
   - Leads generated

## Coordination

- Reads ICP and problem from company.os.profile
- Reads customer signals from research/customer-intel.md
- Writes community activity to company.os.outreach.community
- Emits `community-mention-found` when relevant thread detected
- Coordinates with cmo/ on content strategy

## Decision Points

- **Community rules unclear** → raise decision: "Is self-promotion allowed here?"
- **Negative response to mention** → pause community, reassess approach

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'

interface Community {
  name: string
  platform: 'reddit' | 'discord' | 'slack' | 'hn' | 'forum'
  url: string
  memberCount: number
  icpMatch: 'high' | 'medium' | 'low'
  allowsSelfPromo: boolean
  keywords: string[]
}

interface CommunityMention {
  communityName: string
  url: string
  content: string
  keywords: string[]
  relevanceScore: number
  responseDraft: string
  status: 'draft' | 'posted' | 'responded'
}

interface CommunityStrategy {
  targetCommunities: Community[]
  watchedKeywords: string[]
  recentMentions: CommunityMention[]
  engagementMetrics: {
    mentionsFound: number
    responsesPosted: number
    upvotes: number
    leadsGenerated: number
  }
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[community] Building community engagement strategy...')
  
  const state = os.getState()
  const memory = readAgentMemory('community')
  
  const icp = state.profile.targetCustomer
  const problem = state.profile.problem
  
  if (icp === '[PENDING]' || problem === '[PENDING]') {
    console.log('[community] ICP or problem not defined. Waiting...')
    return
  }
  
  // Identify target communities
  const targetCommunities = identifyTargetCommunities(state)
  
  // Extract keywords to monitor
  const watchedKeywords = extractKeywords(problem)
  
  // Build strategy
  const strategy: CommunityStrategy = {
    targetCommunities,
    watchedKeywords,
    recentMentions: [],
    engagementMetrics: {
      mentionsFound: 0,
      responsesPosted: 0,
      upvotes: 0,
      leadsGenerated: 0
    }
  }
  
  // Write to company.os
  if (!(state as any).outreach) {
    (state as any).outreach = { sequences: [], replies: [], pipeline: [], community: null }
  }
  
  (state as any).outreach.community = strategy
  os.save()
  
  writeAgentMemory('community', {
    lastRun: new Date().toISOString(),
    communitiesIdentified: targetCommunities.length,
    keywords: watchedKeywords
  })
  
  console.log(`[community] Monitoring ${targetCommunities.length} communities for ${watchedKeywords.length} keywords`)
}

function identifyTargetCommunities(state: any): Community[] {
  const icp = state.profile.targetCustomer.toLowerCase()
  const industry = state.profile.industry.toLowerCase()
  
  const communities: Community[] = []
  
  // Reddit communities
  if (icp.includes('developer') || icp.includes('engineer')) {
    communities.push({
      name: 'r/programming',
      platform: 'reddit',
      url: 'https://reddit.com/r/programming',
      memberCount: 5000000,
      icpMatch: 'high',
      allowsSelfPromo: false,
      keywords: extractKeywords(state.profile.problem)
    })
    
    communities.push({
      name: 'r/devops',
      platform: 'reddit',
      url: 'https://reddit.com/r/devops',
      memberCount: 300000,
      icpMatch: 'high',
      allowsSelfPromo: false,
      keywords: extractKeywords(state.profile.problem)
    })
  }
  
  if (icp.includes('founder') || icp.includes('startup')) {
    communities.push({
      name: 'Hacker News',
      platform: 'hn',
      url: 'https://news.ycombinator.com',
      memberCount: 1000000,
      icpMatch: 'high',
      allowsSelfPromo: true,
      keywords: extractKeywords(state.profile.problem)
    })
    
    communities.push({
      name: 'r/startups',
      platform: 'reddit',
      url: 'https://reddit.com/r/startups',
      memberCount: 1000000,
      icpMatch: 'medium',
      allowsSelfPromo: false,
      keywords: extractKeywords(state.profile.problem)
    })
  }
  
  // Industry-specific communities would be added here
  // based on state.profile.industry
  
  return communities
}

function extractKeywords(problem: string): string[] {
  // Extract meaningful keywords from problem statement
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']
  
  return problem
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 10)
}
```
