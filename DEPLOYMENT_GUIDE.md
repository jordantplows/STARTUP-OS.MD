# Deployment Guide — startup-os npm package

This guide walks through publishing `@jordan.plows/startup-os` to npm with automated GitHub Actions deployment.

## Prerequisites ✅

- [x] npm account created at https://npmjs.com
- [x] Logged into npm: `npm login`
- [x] GitHub repository set up
- [x] `package.json` updated with scoped name: `@jordan.plows/startup-os`

---

## Step 1: Initial Manual Publish

Before setting up auto-deployment, do the first publish manually to verify everything works.

### 1.1 Login to npm

```bash
npm login
# Enter username: jordan.plows
# Enter password: (your npm password)
# Enter email: jordan@plows.ai
# Enter OTP: (if 2FA is enabled)
```

### 1.2 Verify build works

```bash
npm run build
npm pack --dry-run
```

**Check the output carefully:**
- ✅ All 12 department folders present
- ✅ dist/ folder with compiled .js files
- ✅ No .env files
- ✅ No sensitive data

### 1.3 Publish to npm

Since this is a scoped package (`@jordan.plows/...`), it requires `--access public`:

```bash
npm publish --access public
```

You should see:
```
+ @jordan.plows/startup-os@0.1.0
```

### 1.4 Verify the package works

Test from a completely different directory:

```bash
cd /tmp
mkdir test-startup && cd test-startup
export ANTHROPIC_API_KEY=sk-ant-your-key-here
npx @jordan.plows/startup-os build "AI invoicing for freelancers"
```

You should see:
1. Startup profile analysis
2. All 12 departments running
3. Output files generated in current directory

---

## Step 2: Set up GitHub Actions Auto-Deploy

### 2.1 Create npm Access Token

1. Go to https://www.npmjs.com/settings/jordan.plows/tokens
2. Click **"Generate New Token"**
3. Choose **"Automation"** type (for CI/CD)
4. Give it a name: `github-actions-startup-os`
5. Click **"Generate Token"**
6. **Copy the token** (starts with `npm_...`)
   - ⚠️ You won't be able to see it again!

### 2.2 Add Token to GitHub Secrets

1. Go to https://github.com/jordantplows/startup-os/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `NPM_TOKEN`
4. Value: paste the token from step 2.1
5. Click **"Add secret"**

### 2.3 Verify Workflows Are Present

Check that these files exist:

```bash
ls -la .github/workflows/
# Should see:
# - ci.yml
# - publish.yml
```

---

## Step 3: Test Auto-Deploy

### 3.1 Commit and push all changes

```bash
git add -A
git commit -m "feat: add npm publishing and CI/CD workflows"
git push origin main
```

### 3.2 Watch CI workflow run

1. Go to https://github.com/jordantplows/startup-os/actions
2. You should see the **"CI"** workflow running
3. It should pass (green checkmark)

### 3.3 Create a version tag

This triggers the auto-publish workflow:

```bash
# Bump to 0.1.1 and create git tag
npm version patch

# Push the tag to GitHub
git push --follow-tags
```

### 3.4 Watch Publish workflow run

1. Go to https://github.com/jordantplows/startup-os/actions
2. You should see **"Publish to npm"** workflow triggered by the `v0.1.1` tag
3. It should:
   - ✅ Checkout code
   - ✅ Install dependencies
   - ✅ Build TypeScript
   - ✅ Verify package contents
   - ✅ Publish to npm

### 3.5 Verify the new version is live

```bash
npm view @jordan.plows/startup-os version
# Should show: 0.1.1

# Test it works
npx @jordan.plows/startup-os@latest help
```

---

## Future Releases

After the initial setup, every release is just:

```bash
# For bug fixes (0.1.1 → 0.1.2)
npm run version:patch

# For new features (0.1.0 → 0.2.0)
npm run version:minor

# For breaking changes (0.1.0 → 1.0.0)
npm run version:major
```

Each command:
1. Bumps version in `package.json`
2. Creates a git commit
3. Creates a git tag
4. Publishes to npm
5. Pushes to GitHub

The GitHub Actions workflow then automatically publishes to npm registry.

---

## Troubleshooting

### "npm ERR! 402 Payment Required"

You need to make the scoped package public:

```bash
npm publish --access public
```

### "npm ERR! code E401"

Your npm token is invalid or expired:
1. Generate a new token at https://www.npmjs.com/settings/jordan.plows/tokens
2. Update the `NPM_TOKEN` secret in GitHub

### "npm ERR! code ENEEDAUTH"

Not logged in locally:

```bash
npm login
```

### GitHub Actions: "Error: Process completed with exit code 1"

Check the workflow logs:
1. Go to https://github.com/jordantplows/startup-os/actions
2. Click the failed workflow
3. Expand the failing step
4. Common issues:
   - Missing `NPM_TOKEN` secret
   - TypeScript build errors
   - Package name conflict

### Package not found after publish

Wait 5-10 minutes for npm CDN to propagate, then try:

```bash
npm view @jordan.plows/startup-os
```

---

## Monitoring

### Check package stats

```bash
# Current version
npm view @jordan.plows/startup-os version

# All versions
npm view @jordan.plows/startup-os versions

# Download stats
npm view @jordan.plows/startup-os time

# Package page
open https://www.npmjs.com/package/@jordan.plows/startup-os
```

### GitHub Actions

- CI runs on every push to `main` and PRs
- Publish runs only on version tags (`v*`)
- Check status: https://github.com/jordantplows/startup-os/actions

---

## Security Best Practices

1. **Never commit `.env` files** — already in `.gitignore`
2. **Use automation tokens** — not personal access tokens
3. **Enable 2FA on npm** — strongly recommended
4. **Rotate tokens periodically** — every 90 days
5. **Review GitHub Actions logs** — after each publish

---

## Checklist

Before first publish:
- [x] `npm login` successful
- [x] `npm run build` passes
- [x] `npm pack --dry-run` looks correct
- [x] No `.env` files in package
- [x] Package name is `@jordan.plows/startup-os`
- [x] `npm publish --access public` succeeds
- [x] Test with `npx @jordan.plows/startup-os@latest help`

Before enabling auto-deploy:
- [x] npm automation token created
- [x] `NPM_TOKEN` secret added to GitHub
- [x] `.github/workflows/publish.yml` exists
- [x] `.github/workflows/ci.yml` exists
- [x] Test with `npm version patch && git push --follow-tags`
- [x] Verify workflow runs green

---

## Next Steps

1. **Announce the package** 🎉
   - Post on Twitter/X
   - Share in relevant Discord/Slack communities
   - Add to awesome lists

2. **Monitor usage**
   - Check npm download stats weekly
   - Watch GitHub issues for bug reports
   - Respond to user feedback

3. **Iterate and improve**
   - Add more agent templates
   - Improve error messages
   - Add more CLI features

---

## Resources

- npm package: https://www.npmjs.com/package/@jordan.plows/startup-os
- GitHub repo: https://github.com/jordantplows/startup-os
- npm docs: https://docs.npmjs.com/
- GitHub Actions: https://docs.github.com/en/actions

---

**Built with Claude Code** ⚡
