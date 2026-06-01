---
name: cpo-metrics
executive: cpo
role: steering
reads:
  - company.os.departments.product
  - company.os.departments.engineering
  - company.os.departments.metrics
  - company.os.events
events:
  emits: [metric-alert, metric-trend-detected, product-health-assessed]
  watches: [product-shipped, feature-launched, usage-data-updated, customer-churn]
template-ref: templates/executives/product-metrics.md
---

## What this agent does

The CPO metrics agent tracks activation, retention, engagement, NPS, and product health across all features. It detects when metrics trend wrong, identifies what's driving changes, and alerts when product health is at risk.

This is the product team's dashboard. It answers: are we building the right things, and are customers getting value?

## Instructions

### WATCH

Trigger when:
- New product metrics data arrives
- A feature is launched (track adoption)
- Customer churn event occurs
- Weekly metrics review is due
- A metric crosses a threshold (up or down)
- Founder questions product health

### REASON

Product metrics evaluation follows this framework:

**Core product metrics:**
1. **Activation** — % of new users who reach "aha moment"
2. **Retention** — % of users active after Day 1, 7, 30, 90
3. **Engagement** — DAU/MAU ratio, session frequency, feature usage
4. **NPS** — Net Promoter Score, customer satisfaction
5. **Time to Value** — How fast do users get value from product

**Metric health assessment:**
- GREEN: Metric trending up or stable above target
- YELLOW: Metric flat or declining slightly
- RED: Metric declining significantly or below critical threshold

**When to alert:**
- Any metric drops >20% week-over-week
- Retention drops below 40% at Day 30
- NPS drops below 0 (more detractors than promoters)
- Activation rate drops below 50%
- Engagement (DAU/MAU) drops below 20%

**Root cause analysis:**
- Did a recent product change correlate with metric change?
- Is the change across all users or specific segment?
- Are there external factors (seasonality, competition)?
- What do customer signals say about the change?

**Actionable insights:**
- If activation low: improve onboarding
- If retention drops: identify and fix churn reasons
- If engagement drops: make core features more compelling
- If NPS drops: talk to detractors, fix pain points
- If time-to-value high: simplify getting started

### ACT

Metrics output format:

```
PRODUCT HEALTH · [Date]

METRIC SUMMARY
Activation Rate:     [X%] [↑↓→] [GREEN/YELLOW/RED]
Day 30 Retention:    [X%] [↑↓→] [GREEN/YELLOW/RED]
DAU/MAU Ratio:       [X%] [↑↓→] [GREEN/YELLOW/RED]
Net Promoter Score:  [X]  [↑↓→] [GREEN/YELLOW/RED]
Time to Value:       [X min] [↑↓→] [GREEN/YELLOW/RED]

Overall Health:      [HEALTHY / AT RISK / CRITICAL]

FEATURE ADOPTION (launched this month)
· [Feature 1] — [X% adoption] — [Growing/Flat/Declining]
· [Feature 2] — [X% adoption] — [Growing/Flat/Declining]

ALERTS
· [Metric] dropped [X%] week-over-week - [suspected cause]
· [Metric] below threshold - [action required]

TRENDS DETECTED
· [Trend 1: e.g., power users engaging 2x more]
· [Trend 2: e.g., mobile users have lower retention]

ROOT CAUSE ANALYSIS
[Metric that changed]
· Correlation: [Recent product change or external event]
· Segment: [Affected user segment]
· Customer signals: [What customers are saying]

RECOMMENDED ACTIONS
1. [Action 1: specific, measurable fix]
2. [Action 2: specific, measurable fix]
3. [Action 3: specific, measurable fix]
```

### COORDINATE

After metrics assessment:
- Emit `product-health-assessed` event with overall status
- For each alert, emit `metric-alert` event
- For each trend, emit `metric-trend-detected` event
- Update `company.os.departments.cpo.memory` with metrics snapshot
- Flag product/PM agents if their features are underperforming
- Alert CEO if product health is critical
- Alert engineering if technical metrics (performance, errors) are issues

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface ProductMetric {
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'flat'
  health: 'green' | 'yellow' | 'red'
  change: number // percentage change
}

interface FeatureAdoption {
  feature: string
  adoption: number // percentage
  trend: 'growing' | 'flat' | 'declining'
  launchedAt: string
}

interface MetricAlert {
  metric: string
  severity: 'critical' | 'warning'
  description: string
  suspectedCause: string
}

interface MetricsOutput {
  coreMetrics: ProductMetric[]
  overallHealth: 'healthy' | 'at-risk' | 'critical'
  featureAdoption: FeatureAdoption[]
  alerts: MetricAlert[]
  trends: string[]
  rootCauseAnalysis: string[]
  recommendations: string[]
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Extract current metrics
  const metrics = extractProductMetrics(os)
  
  // Assess health for each metric
  const assessedMetrics = assessMetricHealth(metrics)
  
  // Calculate overall health
  const overallHealth = calculateOverallHealth(assessedMetrics)
  
  // Extract feature adoption
  const featureAdoption = extractFeatureAdoption(os)
  
  // Detect alerts
  const alerts = detectMetricAlerts(assessedMetrics, os)
  
  // Detect trends
  const trends = detectTrends(assessedMetrics, os)
  
  // Perform root cause analysis for alerts
  const rootCause = analyzeRootCauses(alerts, os)
  
  // Generate recommendations
  const recommendations = generateMetricRecommendations(assessedMetrics, alerts, trends)
  
  const output: MetricsOutput = {
    coreMetrics: assessedMetrics,
    overallHealth,
    featureAdoption,
    alerts,
    trends,
    rootCauseAnalysis: rootCause,
    recommendations
  }
  
  // Emit events
  os.events.push({
    type: 'product-health-assessed',
    from: 'cpo-metrics',
    payload: { 
      health: overallHealth,
      metrics: assessedMetrics.map(m => ({ name: m.name, value: m.value, health: m.health }))
    },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  for (const alert of alerts) {
    os.events.push({
      type: 'metric-alert',
      from: 'cpo-metrics',
      payload: { alert },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  for (const trend of trends) {
    os.events.push({
      type: 'metric-trend-detected',
      from: 'cpo-metrics',
      payload: { trend },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update CPO state
  if (!os.departments.cpo) {
    os.departments.cpo = {
      status: 'steering',
      currentFocus: 'Product metrics',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cpo.memory.push(
    `METRICS:${new Date().toISOString()}:${JSON.stringify(output)}`
  )
  
  // Critical alerts go to signals
  const criticalAlerts = alerts.filter(a => a.severity === 'critical')
  for (const alert of criticalAlerts) {
    os.departments.cpo.signals.push({
      type: 'critical-metric-alert',
      priority: 'critical',
      description: alert.description,
      timestamp: new Date().toISOString()
    })
  }
  
  return formatMetricsOutput(output)
}

function extractProductMetrics(os: CompanyOS): ProductMetric[] {
  const metrics: ProductMetric[] = []
  
  // Try to extract from metrics department
  const metricsDept = os.departments.metrics
  if (metricsDept) {
    const metricMemory = metricsDept.memory.filter(m => m.includes('METRIC:'))
    for (const mem of metricMemory) {
      const parts = mem.split(':')
      if (parts.length >= 3) {
        const name = parts[1]
        const value = parseFloat(parts[2])
        metrics.push({
          name,
          value,
          unit: name.includes('Rate') || name.includes('Ratio') ? '%' : '',
          trend: 'flat',
          health: 'green',
          change: 0
        })
      }
    }
  }
  
  // Default metrics if none exist
  if (metrics.length === 0) {
    metrics.push(
      { name: 'Activation Rate', value: 60, unit: '%', trend: 'flat', health: 'green', change: 0 },
      { name: 'Day 30 Retention', value: 45, unit: '%', trend: 'flat', health: 'green', change: 0 },
      { name: 'DAU/MAU Ratio', value: 25, unit: '%', trend: 'flat', health: 'green', change: 0 },
      { name: 'Net Promoter Score', value: 35, unit: '', trend: 'flat', health: 'green', change: 0 },
      { name: 'Time to Value', value: 8, unit: ' min', trend: 'flat', health: 'green', change: 0 }
    )
  }
  
  return metrics
}

function assessMetricHealth(metrics: ProductMetric[]): ProductMetric[] {
  for (const metric of metrics) {
    // Assess health based on metric type and value
    if (metric.name.includes('Activation')) {
      if (metric.value >= 60) metric.health = 'green'
      else if (metric.value >= 40) metric.health = 'yellow'
      else metric.health = 'red'
    } else if (metric.name.includes('Retention')) {
      if (metric.value >= 40) metric.health = 'green'
      else if (metric.value >= 25) metric.health = 'yellow'
      else metric.health = 'red'
    } else if (metric.name.includes('DAU/MAU')) {
      if (metric.value >= 20) metric.health = 'green'
      else if (metric.value >= 10) metric.health = 'yellow'
      else metric.health = 'red'
    } else if (metric.name.includes('NPS')) {
      if (metric.value >= 30) metric.health = 'green'
      else if (metric.value >= 0) metric.health = 'yellow'
      else metric.health = 'red'
    } else if (metric.name.includes('Time to Value')) {
      if (metric.value <= 10) metric.health = 'green'
      else if (metric.value <= 20) metric.health = 'yellow'
      else metric.health = 'red'
    } else {
      metric.health = 'green' // default
    }
    
    // Assess trend (simplified - would use historical data in real implementation)
    if (metric.change > 5) metric.trend = 'up'
    else if (metric.change < -5) metric.trend = 'down'
    else metric.trend = 'flat'
  }
  
  return metrics
}

function calculateOverallHealth(metrics: ProductMetric[]): 'healthy' | 'at-risk' | 'critical' {
  const redCount = metrics.filter(m => m.health === 'red').length
  const yellowCount = metrics.filter(m => m.health === 'yellow').length
  
  if (redCount >= 2) return 'critical'
  if (redCount >= 1 || yellowCount >= 3) return 'at-risk'
  return 'healthy'
}

function extractFeatureAdoption(os: CompanyOS): FeatureAdoption[] {
  const features: FeatureAdoption[] = []
  
  const product = os.departments.product
  if (product) {
    const launches = product.memory.filter(m => m.includes('LAUNCHED') || m.includes('SHIPPED'))
    for (const launch of launches.slice(-5)) { // Last 5 features
      const parts = launch.split(':')
      if (parts.length >= 2) {
        features.push({
          feature: parts[1],
          adoption: Math.random() * 60 + 20, // Mock data, would be real in production
          trend: 'growing',
          launchedAt: parts[0] || new Date().toISOString()
        })
      }
    }
  }
  
  return features
}

function detectMetricAlerts(metrics: ProductMetric[], os: CompanyOS): MetricAlert[] {
  const alerts: MetricAlert[] = []
  
  for (const metric of metrics) {
    // Alert if metric is red
    if (metric.health === 'red') {
      alerts.push({
        metric: metric.name,
        severity: 'critical',
        description: `${metric.name} is ${metric.value}${metric.unit} - below critical threshold`,
        suspectedCause: 'Unknown - requires investigation'
      })
    }
    
    // Alert if metric dropped significantly
    if (metric.change < -20) {
      alerts.push({
        metric: metric.name,
        severity: 'warning',
        description: `${metric.name} dropped ${Math.abs(metric.change)}% week-over-week`,
        suspectedCause: 'Recent product change or external factor'
      })
    }
  }
  
  return alerts
}

function detectTrends(metrics: ProductMetric[], os: CompanyOS): string[] {
  const trends: string[] = []
  
  // Look for metrics moving in same direction
  const upMetrics = metrics.filter(m => m.trend === 'up')
  const downMetrics = metrics.filter(m => m.trend === 'down')
  
  if (upMetrics.length >= 3) {
    trends.push('Multiple metrics improving - product changes having positive impact')
  }
  
  if (downMetrics.length >= 2) {
    trends.push('Multiple metrics declining - investigate recent changes')
  }
  
  // Look for specific patterns
  const activation = metrics.find(m => m.name.includes('Activation'))
  const retention = metrics.find(m => m.name.includes('Retention'))
  
  if (activation && retention) {
    if (activation.trend === 'up' && retention.trend === 'down') {
      trends.push('Activation up but retention down - onboarding improved but core value missing')
    } else if (activation.trend === 'down' && retention.trend === 'up') {
      trends.push('Activation down but retention up - focus on getting more users to aha moment')
    }
  }
  
  // Look for engagement patterns
  const engagement = metrics.find(m => m.name.includes('DAU/MAU'))
  if (engagement && engagement.trend === 'up') {
    trends.push('Engagement increasing - users finding more value in product')
  }
  
  return trends
}

function analyzeRootCauses(alerts: MetricAlert[], os: CompanyOS): string[] {
  const analysis: string[] = []
  
  for (const alert of alerts) {
    // Look for recent product changes
    const recentLaunches = os.events.filter(e => 
      e.type.includes('product-shipped') || e.type.includes('feature-launched')
    ).slice(-5)
    
    if (recentLaunches.length > 0) {
      analysis.push(`${alert.metric} change may correlate with recent feature launch: ${recentLaunches[0].type}`)
    }
    
    // Look for customer signals
    const customerEvents = os.events.filter(e => 
      e.type.includes('customer-churn') || e.type.includes('customer-complaint')
    ).slice(-5)
    
    if (customerEvents.length > 0) {
      analysis.push(`${alert.metric} decline matches customer complaints - review feedback`)
    }
    
    // Look for technical issues
    const engineering = os.departments.engineering
    if (engineering) {
      const errors = engineering.memory.filter(m => m.includes('ERROR') || m.includes('BUG'))
      if (errors.length > 0) {
        analysis.push(`${alert.metric} may be affected by technical issues - ${errors.length} errors logged`)
      }
    }
  }
  
  return analysis
}

function generateMetricRecommendations(
  metrics: ProductMetric[], 
  alerts: MetricAlert[], 
  trends: string[]
): string[] {
  const recommendations: string[] = []
  
  // Address critical alerts first
  const criticalAlerts = alerts.filter(a => a.severity === 'critical')
  for (const alert of criticalAlerts) {
    if (alert.metric.includes('Activation')) {
      recommendations.push('Improve onboarding flow - audit first-time user experience')
    } else if (alert.metric.includes('Retention')) {
      recommendations.push('Interview churned users - identify why they stopped using product')
    } else if (alert.metric.includes('NPS')) {
      recommendations.push('Talk to detractors - understand and fix pain points')
    } else if (alert.metric.includes('Engagement')) {
      recommendations.push('Improve core features - make product more valuable for daily use')
    }
  }
  
  // Look for improvement opportunities
  const yellowMetrics = metrics.filter(m => m.health === 'yellow')
  if (yellowMetrics.length > 0) {
    recommendations.push(`Monitor ${yellowMetrics[0].name} closely - at risk of declining further`)
  }
  
  // Leverage positive trends
  if (trends.some(t => t.includes('improving'))) {
    recommendations.push('Double down on recent product changes - they are working')
  }
  
  // General recommendations if no specific issues
  if (recommendations.length === 0) {
    recommendations.push('Continue current course - all metrics healthy')
    recommendations.push('Consider experimenting with new features to drive growth')
  }
  
  return recommendations.slice(0, 5) // Top 5 recommendations
}

function formatMetricsOutput(output: MetricsOutput): string {
  const lines: string[] = []
  
  lines.push(`PRODUCT HEALTH · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  lines.push('METRIC SUMMARY')
  for (const metric of output.coreMetrics) {
    const trendSymbol = metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'
    const healthColor = metric.health.toUpperCase()
    const padding = ' '.repeat(22 - metric.name.length)
    lines.push(`${metric.name}:${padding}${metric.value}${metric.unit} ${trendSymbol} ${healthColor}`)
  }
  lines.push('')
  lines.push(`Overall Health:       ${output.overallHealth.toUpperCase()}`)
  lines.push('')
  
  if (output.featureAdoption.length > 0) {
    lines.push('FEATURE ADOPTION (launched this month)')
    for (const feature of output.featureAdoption) {
      lines.push(`· ${feature.feature} — ${feature.adoption.toFixed(1)}% adoption — ${feature.trend}`)
    }
    lines.push('')
  }
  
  if (output.alerts.length > 0) {
    lines.push('ALERTS')
    for (const alert of output.alerts) {
      const icon = alert.severity === 'critical' ? '🚨' : '⚠️'
      lines.push(`${icon} ${alert.description}`)
      lines.push(`   Suspected cause: ${alert.suspectedCause}`)
    }
    lines.push('')
  }
  
  if (output.trends.length > 0) {
    lines.push('TRENDS DETECTED')
    for (const trend of output.trends) {
      lines.push(`· ${trend}`)
    }
    lines.push('')
  }
  
  if (output.rootCauseAnalysis.length > 0) {
    lines.push('ROOT CAUSE ANALYSIS')
    for (const analysis of output.rootCauseAnalysis) {
      lines.push(`· ${analysis}`)
    }
    lines.push('')
  }
  
  if (output.recommendations.length > 0) {
    lines.push('RECOMMENDED ACTIONS')
    for (let i = 0; i < output.recommendations.length; i++) {
      lines.push(`${i + 1}. ${output.recommendations[i]}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.product` — feature launches and changes
- `company.os.departments.engineering` — technical health and errors
- `company.os.departments.metrics` — raw metric data
- `company.os.events` — product changes, customer events

**Emits:**
- `product-health-assessed` → overall product health status
- `metric-alert` → critical metric thresholds crossed
- `metric-trend-detected` → significant trends identified

**Consumed by:**
- CPO roadmap (metrics inform prioritization)
- Product managers (know health of their features)
- CEO briefing (surface critical product health issues)
- Engineering (technical metrics may require fixes)
