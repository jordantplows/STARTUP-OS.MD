import { createServer, IncomingMessage, ServerResponse } from 'http'
import { createInterface } from 'readline'
import { execSync } from 'child_process'

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

function openURL(url: string): void {
  const platform = process.platform
  try {
    if (platform === 'darwin') {
      execSync(`open "${url}"`, { stdio: 'ignore' })
    } else if (platform === 'linux') {
      execSync(`xdg-open "${url}"`, { stdio: 'ignore' })
    } else if (platform === 'win32') {
      execSync(`start "${url}"`, { stdio: 'ignore' })
    }
  } catch (error) {
    console.log(`Please open this URL manually: ${url}`)
  }
}

export interface OAuthConfig {
  toolName: string
  authUrl: string
  scopes?: string[]
  clientId?: string
  redirectUri?: string
  tokenEndpoint?: string
}

export async function oauthSetup(config: OAuthConfig): Promise<{
  success: boolean
  token?: string
  error?: string
}> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(` ${config.toolName} Setup (OAuth)`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  console.log(`This will open a browser for ${config.toolName} authorization.`)
  const continueSetup = await question('Continue? [Y/n] ')

  if (continueSetup.toLowerCase() === 'n') {
    readline.close()
    return {
      success: false,
      error: 'Setup cancelled by user'
    }
  }

  // Start local server to receive OAuth callback
  const port = 8789
  const redirectUri = config.redirectUri || `http://localhost:${port}/callback`

  return new Promise((resolve) => {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      if (req.url?.startsWith('/callback')) {
        const url = new URL(req.url, `http://localhost:${port}`)
        const code = url.searchParams.get('code')
        const error = url.searchParams.get('error')

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html' })
          res.end(`<html><body><h1>Authorization Failed</h1><p>${error}</p></body></html>`)
          server.close()
          readline.close()
          resolve({
            success: false,
            error: `Authorization failed: ${error}`
          })
          return
        }

        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(`<html><body><h1>Success!</h1><p>You can close this window and return to the terminal.</p></body></html>`)
          server.close()
          readline.close()
          resolve({
            success: true,
            token: code
          })
          return
        }

        res.writeHead(400, { 'Content-Type': 'text/html' })
        res.end(`<html><body><h1>Invalid Request</h1></body></html>`)
      } else {
        res.writeHead(404)
        res.end()
      }
    })

    server.listen(port, () => {
      console.log(`\n✓ Local server started on port ${port}`)

      let authUrl = config.authUrl
      if (config.clientId) {
        const params = new URLSearchParams({
          client_id: config.clientId,
          redirect_uri: redirectUri,
          response_type: 'code',
          scope: config.scopes?.join(' ') || ''
        })
        authUrl = `${config.authUrl}?${params.toString()}`
      }

      console.log('\nOpening browser for authorization...')
      openURL(authUrl)
      console.log(`\nIf the browser doesn't open, visit:\n${authUrl}\n`)
    })

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close()
      readline.close()
      resolve({
        success: false,
        error: 'Authorization timeout (5 minutes)'
      })
    }, 300000)
  })
}
