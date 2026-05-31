---
name: generate-pdf
description: Converts markdown or HTML content into a styled PDF file
syscall: true
returns: filepath (string)
depends-on: [puppeteer or markdown-pdf]
---

## What this syscall does

Takes a content string and a filename, renders it to a styled PDF,
and writes it to the agent's output directory.
Used by: pitch deck, legal docs, PRDs, reports, offer letters,
financial summaries, design specs.

## TypeScript

```typescript
import { execSync } from 'child_process'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export async function generatePDF(
  content: string,
  outputDir: string,
  filename: string,
  options: {
    format?: 'A4' | 'Letter'
    orientation?: 'portrait' | 'landscape'
    theme?: 'pitch' | 'legal' | 'report' | 'product' | 'finance'
  } = {}
): Promise<string> {
  mkdirSync(outputDir, { recursive: true })
  const htmlPath = join(outputDir, `${filename}.html`)
  const pdfPath  = join(outputDir, `${filename}.pdf`)

  const themes: Record<string, string> = {
    pitch: `
      body { font-family: 'Inter', sans-serif; color: #0f0f0f; }
      h1 { font-size: 2.5rem; font-weight: 700; color: #1a1a2e; }
      h2 { font-size: 1.5rem; color: #16213e; border-bottom: 2px solid #0f3460; }
      .slide { page-break-after: always; min-height: 100vh;
               padding: 3rem; display: flex; flex-direction: column; justify-content: center; }
      blockquote { border-left: 4px solid #e94560; padding: 1rem 2rem;
                   background: #f8f9fa; font-size: 1.1rem; }
      table { width: 100%; border-collapse: collapse; }
      td, th { padding: 0.75rem; border: 1px solid #dee2e6; }
      th { background: #1a1a2e; color: white; }`,
    legal: `
      body { font-family: 'Georgia', serif; font-size: 11pt; line-height: 1.8;
             color: #1a1a1a; margin: 0; }
      h1 { text-align: center; font-size: 14pt; text-transform: uppercase; }
      h2 { font-size: 12pt; margin-top: 2rem; }
      .signature-block { margin-top: 4rem; display: grid;
                          grid-template-columns: 1fr 1fr; gap: 2rem; }
      .sig-line { border-top: 1px solid black; padding-top: 0.5rem; }`,
    report: `
      body { font-family: 'Inter', sans-serif; font-size: 10pt; color: #333; }
      h1 { color: #1a1a2e; border-bottom: 3px solid #e94560; padding-bottom: 0.5rem; }
      .metric { background: #f8f9fa; border-left: 4px solid #0f3460;
                padding: 1rem; margin: 1rem 0; }
      table { width: 100%; border-collapse: collapse; font-size: 9pt; }
      th { background: #1a1a2e; color: white; padding: 0.5rem; }
      td { padding: 0.4rem; border-bottom: 1px solid #dee2e6; }`,
    finance: `
      body { font-family: 'Courier New', monospace; font-size: 9pt; color: #1a1a1a; }
      h1 { font-family: 'Inter', sans-serif; color: #1a1a2e; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #1a1a2e; color: white; padding: 0.4rem; font-size: 8pt; }
      td { padding: 0.3rem 0.4rem; border: 1px solid #ccc; }
      .positive { color: #198754; } .negative { color: #dc3545; }
      .total { font-weight: bold; background: #f8f9fa; }`,
    product: `
      body { font-family: 'Inter', sans-serif; color: #333; }
      h1 { color: #0f3460; } h2 { color: #16213e; }
      .user-story { background: #fffbf0; border: 1px solid #ffc107;
                    padding: 1rem; margin: 0.5rem 0; border-radius: 4px; }
      .requirement { padding: 0.5rem; border-left: 3px solid #0f3460; margin: 0.25rem 0; }
      .priority-high { border-color: #dc3545; }
      .priority-med  { border-color: #ffc107; }
      .priority-low  { border-color: #198754; }`
  }

  const theme = options.theme ?? 'report'
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  @page { size: ${options.format ?? 'A4'} ${options.orientation ?? 'portrait'};
          margin: 2cm; }
  * { box-sizing: border-box; }
  ${themes[theme]}
</style></head>
<body>${markdownToHtml(content)}</body></html>`

  writeFileSync(htmlPath, html, 'utf-8')

  try {
    // Use puppeteer if available, fall back to wkhtmltopdf
    execSync(
      `node -e "
        const p = require('puppeteer');
        (async () => {
          const b = await p.launch({args:['--no-sandbox']});
          const pg = await b.newPage();
          await pg.goto('file://${htmlPath}',{waitUntil:'networkidle0'});
          await pg.pdf({path:'${pdfPath}',format:'${options.format ?? 'A4'}',
                        printBackground:true});
          await b.close();
        })();"`,
      { stdio: 'pipe' }
    )
  } catch {
    // Fallback: keep the HTML if PDF generation unavailable
    return htmlPath
  }

  return pdfPath
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/`(.+?)`/g,       '<code>$1</code>')
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split(' | ').map((c: string) =>
        `<td>${c.trim()}</td>`).join('')
      return `<tr>${cells}</tr>`
    })
    .replace(/(<tr>.*<\/tr>\n)+/g, m => `<table>${m}</table>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[htp])(.+)$/gm, '<p>$1</p>')
}
```

## Usage Example

```typescript
const pdfPath = await generatePDF(
  markdownContent,
  'stdlib/brand/output',
  'pitch-deck',
  { theme: 'pitch', orientation: 'landscape' }
)
```
