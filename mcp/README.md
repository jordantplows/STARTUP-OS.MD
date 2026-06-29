# MCP Connectors

This directory contains Model Context Protocol (MCP) connectors that link your company to external services.

## Connected Services

Connectors are created automatically when you run setup flows through the CLI.

### Supabase

Created via: `startup-os connect supabase`

Provides:
- PostgreSQL database
- Built-in authentication
- File storage
- Real-time subscriptions

Configuration stored in `.env.local` (gitignored for security).

## Creating Custom Connectors

Each connector is a `.md` file with:
1. Frontmatter metadata (name, type, status)
2. Documentation
3. TypeScript implementation

See `supabase.md` for reference structure.
