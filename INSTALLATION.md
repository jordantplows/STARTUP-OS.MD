# Installation Guide

## For Plugin Users (Recommended)

Install startup-os once as a global Claude Code plugin:

```bash
claude plugin install github:your-org/startup-os
```

Then use it anywhere:

```bash
cd ~/my-new-startup
/startup-os init
```

Claude will:
1. Scaffold the full 10-module structure (50 template files)
2. Walk you through your Startup Profile (12 questions)
3. Create a progress tracker
4. Give you next steps

---

## For Manual Installation

If you prefer to work directly with this repo:

```bash
# Clone the repo
git clone https://github.com/your-org/startup-os.git

# Copy the template structure to your project
cp -r startup-os/startup-os/ ~/my-new-startup/
cd ~/my-new-startup

# Fill out your profile
# Edit CLAUDE.md and complete the "My Startup Profile" section

# Start filling templates
claude
> /startup-os fill 01-foundation
```

---

## Verifying Installation

After installing as a plugin, verify it's loaded:

```bash
claude
> /help
```

You should see `startup-os` in the available skills list.

---

## Troubleshooting

**Plugin not showing up?**
- Ensure you're running Claude Code 2.1.101 or higher: `claude --version`
- Try restarting Claude Code after installation
- Check plugin was installed: `claude plugin list`

**Missing templates after init?**
- Verify you're in an empty directory before running `/startup-os init`
- Check that all 10 module folders (01-foundation through 10-metrics) were created
- Re-run init if needed (it won't overwrite existing files)

**Fills not working?**
- Ensure `CLAUDE.md` has your Startup Profile filled out (all fields)
- Check that you're in the root directory of the startup-os repo
- Try filling one module at a time: `/startup-os fill 01-foundation`

---

## Next Steps

Once installed:

1. **Initialize**: `/startup-os init` in your project directory
2. **Profile**: Answer the 12 guided questions
3. **Fill**: Run `/startup-os fill-all` or fill module-by-module
4. **Review**: Use `/startup-os review <file>` for feedback
5. **Iterate**: Update your profile and re-fill as needed

---

## Uninstalling

To remove the plugin:

```bash
claude plugin uninstall startup-os
```

Your generated repos remain untouched — only the plugin itself is removed.
