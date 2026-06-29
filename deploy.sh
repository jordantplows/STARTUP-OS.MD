#!/usr/bin/env bash
set -euo pipefail

# ============================================
# startup-os · deploy script
# Run this from the repo root: ./deploy.sh
# ============================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  startup-os · deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Confirm npm login
echo "→ Checking npm login..."
WHOAMI=$(npm whoami 2>/dev/null || echo "")
if [ -z "$WHOAMI" ]; then
  echo "✗ Not logged in to npm. Run: npm login"
  exit 1
fi
echo "✓ Logged in as $WHOAMI"
echo ""

# 2. Confirm git working directory is clean
echo "→ Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
  echo "✗ Git working directory is not clean."
  echo "  Commit or stash your changes first:"
  git status --short
  exit 1
fi
echo "✓ Working directory clean"
echo ""

# 3. Run tests (if they exist)
if [ -f "package.json" ] && grep -q '"test"' package.json; then
  echo "→ Running tests..."
  npm test || {
    echo "✗ Tests failed"
    exit 1
  }
  echo "✓ Tests passed"
  echo ""
fi

# 4. Build
echo "→ Building..."
npm run build
echo "✓ Build complete"
echo ""

# 5. Verify package contents
echo "→ Verifying package contents (dry run)..."
npm pack --dry-run > /tmp/startup-os-pack-output.txt 2>&1
cat /tmp/startup-os-pack-output.txt

echo ""
echo "  Checking for files that should NOT be included..."
if grep -qE '\.env|\.memory/|\.audit/|node_modules/' /tmp/startup-os-pack-output.txt; then
  echo "✗ Found sensitive or unwanted files in the package."
  echo "  Review .npmignore and package.json 'files' array."
  exit 1
fi
echo "✓ No sensitive files detected in package contents"
echo ""

# 6. Show current version and confirm bump
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "→ Current version: $CURRENT_VERSION"
read -rp "  Enter new version (or press enter to keep current): " NEW_VERSION

if [ -n "$NEW_VERSION" ]; then
  echo "→ Updating version to $NEW_VERSION..."
  npm version "$NEW_VERSION" --no-git-tag-version --allow-same-version

  # Keep plugin.json and marketplace.json in sync
  node -e "
    const fs = require('fs');
    const newVersion = '$NEW_VERSION';

    const pluginPath = '.claude-plugin/plugin.json';
    if (fs.existsSync(pluginPath)) {
      const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf-8'));
      plugin.version = newVersion;
      fs.writeFileSync(pluginPath, JSON.stringify(plugin, null, 2) + '\n');
      console.log('✓ Updated .claude-plugin/plugin.json');
    }

    const marketplacePath = '.claude-plugin/marketplace.json';
    if (fs.existsSync(marketplacePath)) {
      const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf-8'));
      if (Array.isArray(marketplace.plugins)) {
        marketplace.plugins.forEach(p => { p.version = newVersion; });
      }
      fs.writeFileSync(marketplacePath, JSON.stringify(marketplace, null, 2) + '\n');
      console.log('✓ Updated .claude-plugin/marketplace.json');
    }
  "
  VERSION="$NEW_VERSION"
else
  VERSION="$CURRENT_VERSION"
  echo "→ Keeping version $VERSION"
fi
echo ""

# 7. Commit version bump if anything changed
if [ -n "$(git status --porcelain)" ]; then
  echo "→ Committing version bump..."
  git add package.json package-lock.json .claude-plugin/plugin.json .claude-plugin/marketplace.json 2>/dev/null || true
  git commit -m "chore: release v$VERSION"
  echo "✓ Committed"
else
  echo "→ No version files changed, skipping commit"
fi
echo ""

# 8. Publish to npm
echo "→ Publishing v$VERSION to npm..."
npm publish --access public
echo "✓ Published"
echo ""

# 9. Tag and push
echo "→ Tagging and pushing to GitHub..."
git tag "v$VERSION"
git push origin main
git push origin "v$VERSION"
echo "✓ Pushed commit and tag"
echo ""

# 10. Confirm live on npm
echo "→ Confirming on npm registry..."
sleep 3
npm view startup-os version
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓ Deploy complete — startup-os v$VERSION is live"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Install: npx startup-os --version"
echo ""
