# Publishing Checklist for startup-os

## Pre-publish checklist

- [x] `ANTHROPIC_API_KEY` is NOT hardcoded anywhere in `src/`
- [x] All 12 department folders are listed in `"files"` in `package.json`
- [x] `npm run build` completes with zero TypeScript errors
- [x] `npm pack --dry-run` shows all department .md files included
- [x] `node dist/cli.js help` prints the help text correctly
- [ ] `node dist/cli.js build "test idea"` runs without crashing (requires API key)
- [x] `.npmignore` excludes `src/`, test files, and `.env*`
- [x] `README.md` has the correct install and usage instructions
- [x] Shebang (`#!/usr/bin/env node`) is present in dist/cli.js

## Local testing

Before publishing, test the package locally:

```bash
# 1. Build the package
npm run build

# 2. Create a test directory
cd /tmp
mkdir startup-test && cd startup-test

# 3. Install your local package
npm install /Users/jordan/Dev/startup-os

# 4. Set API key
export ANTHROPIC_API_KEY=sk-ant-...

# 5. Test the command
npx startup-os init
npx startup-os build "AI contract review for small law firms"
npx startup-os status
```

## Publishing commands

```bash
# First time: login to npm
npm login

# Publish to npm
npm publish --access public

# Or use version scripts
npm run version:patch   # 0.1.0 → 0.1.1
npm run version:minor   # 0.1.0 → 0.2.0
npm run version:major   # 0.1.0 → 1.0.0
```

## Post-publish verification

```bash
# Install from npm registry
npx startup-os@latest init
npx startup-os@latest build "test idea"
```

## Updating the package

1. Make your changes to `src/`
2. Run `npm run build`
3. Test locally (see above)
4. Bump version: `npm run version:patch`
5. Push tags: `git push --follow-tags`

## Package info

- Package name: `startup-os`
- Current version: 0.1.0
- Registry: https://www.npmjs.com/package/startup-os
- GitHub: https://github.com/your-org/startup-os

## Notes

- The package includes all department agent files (~78 .md files)
- Total package size is ~600KB
- Requires Node.js 20+
- Users must provide their own ANTHROPIC_API_KEY
- Works as both global install and npx
