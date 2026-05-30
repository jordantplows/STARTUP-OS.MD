# startup-os — Ready to Publish! 🚀

Everything is set up for npm publishing with auto-deployment via GitHub Actions.

## ✅ What's Been Completed

### Package Configuration
- [x] Scoped package name: `@jordan.plows/startup-os`
- [x] Author: Jordan Plows <jordan@plows.ai>
- [x] Repository: https://github.com/jordantplows/startup-os
- [x] License: MIT
- [x] Version: 0.1.0

### Build System
- [x] TypeScript compiles with zero errors
- [x] dist/ folder generated correctly
- [x] All 12 departments included (53 agent templates)
- [x] Package size: 247 KB (acceptable)

### Publishing Files
- [x] .npmignore configured (excludes src/, .env*, dev files)
- [x] .gitignore configured (excludes node_modules/, dist/)
- [x] No sensitive files in package
- [x] npm badges added to README.md

### GitHub Actions
- [x] `.github/workflows/ci.yml` — runs on every push
- [x] `.github/workflows/publish.yml` — auto-publishes on version tags

### Documentation
- [x] README.md updated with install instructions
- [x] DEPLOYMENT_GUIDE.md — complete publishing walkthrough
- [x] PUBLISHING.md — internal publishing checklist
- [x] NPM_PACKAGE_COMPLETE.md — comprehensive reference

---

## 🎯 Next Steps — First Publish

Follow these steps in order:

### 1. Login to npm (if not already logged in)

```bash
npm login
```

Enter:
- Username: `jordan.plows`
- Password: (your npm password)
- Email: `jordan@plows.ai`
- OTP: (if 2FA enabled)

### 2. Verify package contents one more time

```bash
npm pack --dry-run | grep -E "(\.env|secret|password|token|key\.)"
```

Should return empty (no sensitive files).

### 3. Publish to npm

```bash
npm publish --access public
```

Expected output:
```
+ @jordan.plows/startup-os@0.1.0
```

### 4. Test the published package

```bash
cd /tmp && mkdir test-startup && cd test-startup
export ANTHROPIC_API_KEY=sk-ant-your-key-here
npx @jordan.plows/startup-os build "AI contract review for small law firms"
```

Should run successfully and generate output files.

---

## 🤖 Set Up Auto-Deployment

### 5. Create npm automation token

1. Go to: https://www.npmjs.com/settings/jordan.plows/tokens
2. Click **"Generate New Token"**
3. Choose **"Automation"** type
4. Name: `github-actions-startup-os`
5. Click **"Generate Token"**
6. **Copy the token** (starts with `npm_...`)

### 6. Add token to GitHub secrets

1. Go to: https://github.com/jordantplows/startup-os/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `NPM_TOKEN`
4. Value: (paste the token)
5. Click **"Add secret"**

### 7. Push to GitHub

```bash
git push origin main
```

Check that CI workflow runs: https://github.com/jordantplows/startup-os/actions

### 8. Test auto-publish

```bash
# Bump version to 0.1.1
npm version patch

# Push tag to trigger auto-publish
git push --follow-tags
```

Watch the workflow: https://github.com/jordantplows/startup-os/actions

Should see:
- ✅ CI workflow passes
- ✅ Publish workflow runs
- ✅ New version appears on npm

### 9. Verify auto-publish worked

```bash
npm view @jordan.plows/startup-os version
# Should show: 0.1.1

npx @jordan.plows/startup-os@latest help
# Should work
```

---

## 📊 Package Details

- **Name:** @jordan.plows/startup-os
- **Version:** 0.1.0 (will be 0.1.1 after auto-publish test)
- **Size:** 247 KB packed, 810 KB unpacked
- **Files:** 79 files total
- **Departments:** 12 departments, 53 agent templates
- **License:** MIT
- **Node:** >= 20.0.0

---

## 🎉 After Publishing

### Share the news

```markdown
🚀 Just published startup-os to npm!

Build a complete startup operating system from a single idea.

One command runs 12 departments (strategy, brand, product, finance, marketing, sales, legal, people, ops, metrics, security, engineering) and generates 50+ investor-ready documents.

Try it:
npx @jordan.plows/startup-os build "your startup idea"

https://www.npmjs.com/package/@jordan.plows/startup-os
https://github.com/jordantplows/startup-os
```

### Monitor

- npm downloads: https://www.npmjs.com/package/@jordan.plows/startup-os
- GitHub Actions: https://github.com/jordantplows/startup-os/actions
- Issues: https://github.com/jordantplows/startup-os/issues

---

## 🔄 Future Releases

Every release is now just:

```bash
# Bug fix: 0.1.1 → 0.1.2
npm run version:patch

# New feature: 0.1.0 → 0.2.0
npm run version:minor

# Breaking change: 0.1.0 → 1.0.0
npm run version:major
```

Each command:
1. Bumps version in package.json
2. Creates git commit and tag
3. Publishes to npm (via the script)
4. GitHub Actions also auto-publishes on tag push

---

## 📚 Documentation

- **For users:** See README.md and README.npm.md
- **For publishing:** See DEPLOYMENT_GUIDE.md
- **For maintenance:** See PUBLISHING.md
- **For architecture:** See NPM_PACKAGE_COMPLETE.md

---

## ✅ Final Checklist

Before you publish, verify:

- [ ] Logged into npm: `npm whoami` → shows `jordan.plows`
- [ ] Package builds: `npm run build` → exits 0
- [ ] No secrets: `npm pack --dry-run | grep "\.env"` → empty
- [ ] All departments present: check output of `npm pack --dry-run`
- [ ] CLI works: `node dist/cli.js help` → shows help text

After first publish:
- [ ] npm automation token created
- [ ] `NPM_TOKEN` secret added to GitHub
- [ ] Pushed to GitHub: `git push origin main`
- [ ] CI workflow passes (green checkmark)
- [ ] Version tag pushed: `npm version patch && git push --follow-tags`
- [ ] Publish workflow passes
- [ ] New version live: `npm view @jordan.plows/startup-os version`

---

**You're ready!** 🎊

Run `npm publish --access public` when you're ready to go live.

See **DEPLOYMENT_GUIDE.md** for detailed step-by-step instructions.
