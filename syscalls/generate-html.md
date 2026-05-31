---
name: generate-html
description: Generates standalone HTML files — prototypes, style guides, dashboards
syscall: true
returns: filepath (string)
---

## What this syscall does

Generates production-quality HTML files with built-in templates for
common design and business artifacts. Used by design, marketing,
data, and executive departments.

## TypeScript

```typescript
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export type HTMLTemplate =
  | 'design-system'
  | 'prototype'
  | 'style-guide'
  | 'dashboard'
  | 'email-template'
  | 'landing-page'

export function generateHTML(
  content: string,
  outputDir: string,
  filename: string,
  template: HTMLTemplate = 'prototype'
): string {
  mkdirSync(outputDir, { recursive: true })
  const outputPath = join(outputDir, `${filename}.html`)

  const shells: Record<HTMLTemplate, (c: string) => string> = {
    'design-system': (c) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Design System</title>
<style>
  :root {
    --color-primary: #1a1a2e; --color-secondary: #16213e;
    --color-accent: #e94560;  --color-bg: #ffffff;
    --color-surface: #f8f9fa; --color-border: #dee2e6;
    --color-text: #212529;    --color-muted: #6c757d;
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --radius-sm: 4px; --radius-md: 8px; --radius-lg: 16px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,.1);
    --shadow-md: 0 4px 12px rgba(0,0,0,.15);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-sans); color: var(--color-text);
         background: var(--color-bg); }
  .ds-nav { background: var(--color-primary); color: white;
            padding: 1rem 2rem; display: flex; align-items: center; gap: 1rem; }
  .ds-section { padding: 3rem 2rem; border-bottom: 1px solid var(--color-border); }
  .ds-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 1rem; }
  .ds-swatch { height: 80px; border-radius: var(--radius-md); }
  .ds-token { font-family: var(--font-mono); font-size: 0.8rem;
              background: var(--color-surface); padding: 0.25rem 0.5rem;
              border-radius: var(--radius-sm); }
  .btn { padding: 0.5rem 1.25rem; border-radius: var(--radius-md);
         border: none; cursor: pointer; font-family: var(--font-sans);
         font-weight: 500; transition: all 0.2s; }
  .btn-primary { background: var(--color-accent); color: white; }
  .btn-secondary { background: var(--color-primary); color: white; }
  .btn-outline { background: transparent; border: 2px solid var(--color-primary); }
</style>
</head><body>${c}</body></html>`,

    'prototype': (c) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prototype</title>
<style>
  * { box-sizing: border-box; } body { margin: 0; font-family: system-ui, sans-serif; }
  .screen { min-height: 100vh; display: flex; flex-direction: column; }
  .nav { background: #1a1a2e; color: white; padding: 1rem 2rem;
         display: flex; align-items: center; justify-content: space-between; }
  .content { flex: 1; padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }
  .card { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.1);
          padding: 1.5rem; margin-bottom: 1rem; }
  .btn { padding: 0.5rem 1.5rem; border-radius: 6px; border: none;
         cursor: pointer; font-size: 0.9rem; font-weight: 500; }
  .btn-primary { background: #e94560; color: white; }
  input, select, textarea { width: 100%; padding: 0.5rem 0.75rem;
    border: 1px solid #dee2e6; border-radius: 6px; font-family: inherit; }
  label { display: block; font-size: 0.85rem; font-weight: 500;
          color: #495057; margin-bottom: 0.25rem; }
  .form-group { margin-bottom: 1rem; }
  .annotation { background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;
                padding: 0.5rem; font-size: 0.8rem; color: #856404; }
</style>
</head><body>${c}</body></html>`,

    'style-guide': (c) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>Brand Style Guide</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<style>
  body { font-family: system-ui; max-width: 900px; margin: 0 auto; padding: 2rem; }
  h1 { font-size: 3rem; margin-bottom: 0.25rem; }
  .chapter { margin: 4rem 0; padding-top: 2rem;
             border-top: 3px solid #1a1a2e; }
  .do-dont { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .do { border: 2px solid #198754; border-radius: 8px; padding: 1rem; }
  .dont { border: 2px solid #dc3545; border-radius: 8px; padding: 1rem; }
  .do::before { content: '✓ Do'; color: #198754; font-weight: 700; display: block; }
  .dont::before { content: '✗ Don\\'t'; color: #dc3545; font-weight: 700; display: block; }
  .type-sample { font-size: 2rem; margin: 1rem 0; }
  .color-row { display: flex; gap: 1rem; flex-wrap: wrap; margin: 1rem 0; }
  .color-chip { width: 100px; }
  .color-chip-swatch { height: 60px; border-radius: 8px; margin-bottom: 0.5rem; }
  .voice-example { background: #f8f9fa; padding: 1rem 1.5rem;
                   border-left: 4px solid #1a1a2e; margin: 0.5rem 0; }
</style></head><body>${c}</body></html>`,

    'dashboard': (c) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>Metrics Dashboard</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: system-ui; background: #f0f2f5; margin: 0; }
  .dash-header { background: #1a1a2e; color: white;
                 padding: 1rem 2rem; display: flex; justify-content: space-between; }
  .dash-body { padding: 2rem; }
  .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr));
              gap: 1rem; margin-bottom: 2rem; }
  .kpi-card { background: white; border-radius: 12px; padding: 1.5rem;
              box-shadow: 0 2px 8px rgba(0,0,0,.06); }
  .kpi-value { font-size: 2rem; font-weight: 700; color: #1a1a2e; }
  .kpi-label { color: #6c757d; font-size: 0.85rem; margin-top: 0.25rem; }
  .kpi-delta { font-size: 0.85rem; margin-top: 0.5rem; }
  .kpi-delta.up { color: #198754; } .kpi-delta.down { color: #dc3545; }
  .chart-area { background: white; border-radius: 12px; padding: 1.5rem;
                box-shadow: 0 2px 8px rgba(0,0,0,.06); }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f8f9fa; padding: 0.75rem; text-align: left;
       font-size: 0.8rem; text-transform: uppercase; color: #6c757d; }
  td { padding: 0.75rem; border-bottom: 1px solid #f0f2f5; }
</style></head><body>${c}</body></html>`,

    'email-template': (c) => `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head><body style="margin:0;padding:0;background:#f4f4f4;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:20px 0;">
<table width="600" cellpadding="0" cellspacing="0"
       style="background:white;border-radius:8px;overflow:hidden;
              box-shadow:0 2px 8px rgba(0,0,0,.1);">
<tr><td style="background:#1a1a2e;padding:24px 32px;">
  <h1 style="color:white;margin:0;font-size:1.5rem;">[COMPANY NAME]</h1></td></tr>
<tr><td style="padding:32px;">${c}</td></tr>
<tr><td style="background:#f8f9fa;padding:16px 32px;color:#6c757d;font-size:0.8rem;">
  Unsubscribe · Privacy Policy · [Company Address]</td></tr>
</table></td></tr></table></body></html>`,

    'landing-page': (c) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Landing Page</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #1a1a2e; }
  .hero { min-height: 80vh; display: flex; align-items: center;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          color: white; padding: 2rem; }
  .hero-content { max-width: 700px; margin: 0 auto; text-align: center; }
  .hero h1 { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; }
  .hero p { font-size: 1.25rem; opacity: 0.85; margin-bottom: 2rem; }
  .cta { display: inline-block; background: #e94560; color: white;
         padding: 1rem 2.5rem; border-radius: 50px; font-size: 1.1rem;
         font-weight: 600; text-decoration: none; }
  .section { padding: 5rem 2rem; }
  .section-inner { max-width: 1100px; margin: 0 auto; }
  .feature-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 2rem; }
  .feature { padding: 2rem; border: 1px solid #dee2e6; border-radius: 12px; }
</style></head><body>${c}</body></html>`
  }

  const html = shells[template](content)
  writeFileSync(outputPath, html, 'utf-8')
  return outputPath
}
```

## Usage Example

```typescript
const htmlPath = generateHTML(
  '<div class="hero-content"><h1>Welcome</h1><p>Build faster.</p></div>',
  'stdlib/design/output',
  'landing-page',
  'landing-page'
)
```
