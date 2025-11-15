# mise - User Package Manager

**mise** (pronounced "meez") is a polyglot tool version manager that works as an alternative to asdf, nvm, rbenv, pyenv, and many others. It allows you to install and manage programming languages, CLIs, and other development tools **without requiring sudo or system package manager permissions**.

## Official Documentation
- Website: https://mise.jdx.dev/
- GitHub: https://github.com/jdx/mise

## Installation Status

✅ **Successfully Installed and Tested**

- **Version:** 2025.11.5 linux-x64 (2025-11-15)
- **Location:** `/root/.local/bin/mise`
- **Installation Method:** Official install script via curl
- **Status:** Fully functional in Claude Code environment

## Installation

mise was installed using the official installation script:

```bash
curl -fsSL https://mise.jdx.dev/install.sh | sh
```

The installation completed successfully and placed the binary at `/root/.local/bin/mise`.

## Activation

To use mise in your shell session, you need to activate it:

```bash
# Add mise to PATH
export PATH="/root/.local/bin:$PATH"

# Activate mise in current session
eval "$(/root/.local/bin/mise activate bash)"
```

For permanent activation, add to `~/.bashrc`:

```bash
echo 'eval "$(/root/.local/bin/mise activate bash)"' >> ~/.bashrc
```

## Capabilities

mise supports multiple backend systems for installing tools:

### Supported Backends

1. **aqua** - 2,146+ baked-in registry tools
2. **asdf** - Compatible with asdf plugins
3. **cargo** - Rust packages via cargo
4. **core** - Built-in tools (mise native)
5. **dotnet** - .NET tools
6. **gem** - Ruby gems
7. **github** - Direct GitHub releases
8. **gitlab** - GitLab releases
9. **go** - Go packages
10. **npm** - Node.js packages
11. **pipx** - Python applications
12. **spm** - Swift packages
13. **http** - Direct HTTP downloads
14. **ubi** - Universal Binary Installer
15. **vfox** - vfox plugins

## Verified Working Examples

### 1. Installing Core Tools (usage CLI)

```bash
mise install usage@latest
```

**Result:** ✅ Successfully installed `usage@2.8.0`
- Download source: GitHub releases
- Install path: `~/.local/share/mise/installs/usage/2.8.0`
- Binary works: `usage --version` → `usage-cli 2.8.0`

### 2. Installing npm Packages (prettier)

```bash
mise install npm:prettier@latest
```

**Result:** ✅ Successfully installed `npm:prettier@3.6.2`
- Backend: npm
- Install path: `~/.local/share/mise/installs/npm-prettier/3.6.2`
- Binary works: `prettier --version` → `3.6.2`

### 3. GitHub Rate Limiting

When installing GitHub-based tools without authentication:

```bash
mise install ripgrep@latest
```

**Result:** ⚠️ GitHub API rate limit exceeded
- **Workaround:** Set `GITHUB_TOKEN` environment variable
- Create token at: https://github.com/settings/tokens (no scopes needed)
- Usage: `export GITHUB_TOKEN=your_token_here`

## Basic Commands

### Installation

```bash
# Install a specific version
mise install node@20.0.0

# Install latest version
mise install node@latest

# Install fuzzy version
mise install node@20

# Install from specific backend
mise install npm:prettier@3
mise install cargo:ripgrep
mise install go:github.com/cli/cli/v2/cmd/gh@latest
```

### Configuration

```bash
# Use a tool (creates/updates mise.toml)
mise use node@20

# Use globally (in ~/.config/mise/config.toml)
mise use -g node@20

# Use with pinned exact version
mise use --pin node@20

# Use environment-specific config
mise use --env staging node@18
```

### Management

```bash
# List installed tools
mise list

# List available versions of a tool
mise ls-remote node

# Uninstall a tool
mise uninstall node@20.0.0

# Update mise itself
mise self-update

# Run diagnostics
mise doctor
```

### Execution

```bash
# Execute command with specific tool version (no config needed)
mise exec node@20 -- node script.js

# Run task
mise run test

# Show current environment
mise env
```

## Configuration Files

mise uses TOML configuration files:

### Local Configuration (`mise.toml`)

Created in project directory:

```toml
[tools]
node = "20"
python = "3.11"
ruby = "3.3"

[env]
NODE_ENV = "development"
```

### Global Configuration (`~/.config/mise/config.toml`)

```toml
[tools]
node = "20"
```

### Environment-Specific (`.mise.local.toml`, `.mise.staging.toml`)

```toml
[tools]
node = "18"  # Different version for this environment
```

## Directory Structure

mise installs files in user directories (no sudo required):

```
~/.cache/mise/              # Cached downloads and temp files
~/.config/mise/             # Configuration files
~/.local/share/mise/        # Installed tools and data
  ├── installs/             # Tool installations
  │   ├── usage/2.8.0/
  │   └── npm-prettier/3.6.2/
  └── shims/                # Executable shims
~/.local/state/mise/        # State files
~/.local/bin/mise           # mise binary
```

## Advantages for Claude Code Environment

✅ **No sudo required** - Installs in user directory
✅ **Works despite apt restrictions** - Bypasses system package manager
✅ **Cross-language support** - One tool for all languages
✅ **Version management** - Multiple versions side-by-side
✅ **Project-specific versions** - Via mise.toml files
✅ **Reproducible environments** - Lock file support
✅ **Fast installations** - Parallel downloads
✅ **Extensive tool support** - 2,000+ tools available

## Limitations in Claude Code Environment

⚠️ **GitHub rate limiting** - Need GITHUB_TOKEN for many tools
⚠️ **Session-based** - Installations don't persist between sessions
⚠️ **Binary compatibility** - Some tools may not work in sandbox
⚠️ **Network proxy** - All downloads go through proxy
⚠️ **Build tools** - Some packages need compilation (cargo, etc.)

## Use Cases

### 1. Install Specific Language Versions

```bash
# Install specific Python version
mise install python@3.11.5

# Install specific Node.js version
mise install node@18.16.0

# Use in project
mise use python@3.11 node@18
```

### 2. Install CLI Tools

```bash
# Install development tools
mise install ripgrep         # Fast grep
mise install fd              # Fast find
mise install npm:vercel      # Vercel CLI
mise install go:github.com/charmbracelet/glow@latest  # Markdown viewer
```

### 3. Project Environment

Create `mise.toml` in project:

```toml
[tools]
node = "20"
python = "3.11"
npm:prettier = "3"

[env]
NODE_ENV = "production"
API_URL = "https://api.example.com"
```

Then just run `mise install` in the project directory.

### 4. Quick Execution Without Installation

```bash
# Run node script with specific version (downloads if needed)
mise exec node@18 -- node ./script.js

# Run npm package without installing globally
mise exec npm:cowsay -- cowsay "Hello World"
```

## Diagnostic Information

Current mise installation details:

```
Version: 2025.11.5 linux-x64 (2025-11-15)
Target: x86_64-unknown-linux-gnu
Features: OPENSSL, RUSTLS_NATIVE_ROOTS, SELF_UPDATE
Built: Sat, 15 Nov 2025 02:22:26 +0000
Rust Version: rustc 1.91.1

Shell: /bin/bash (GNU bash 5.2.21)
Backends: 15 backends available
Aqua Registry: 2,146 tools
```

## Comparison with Other Tools

| Feature | mise | asdf | nvm | pyenv |
|---------|------|------|-----|-------|
| Languages | Many | Many | Node only | Python only |
| Speed | Fast | Slow | Fast | Medium |
| Rust-based | ✅ | ❌ | ❌ | ❌ |
| Config format | TOML | `.tool-versions` | None | None |
| Plugin system | Multiple backends | Plugin-based | Built-in | Built-in |
| Tasks/Scripts | ✅ | ❌ | ❌ | ❌ |
| Env management | ✅ | Partial | ❌ | ✅ |

## Testing Results

### Test 1: Core Tool Installation ✅

```bash
$ mise install usage@latest
INFO  usage@2.8.0     install
INFO  usage@2.8.0     download usage-x86_64-unknown-linux-musl.tar.gz
INFO  usage@2.8.0     checksum usage-x86_64-unknown-linux-musl.tar.gz
INFO  usage@2.8.0     extract usage-x86_64-unknown-linux-musl.tar.gz
INFO  usage@2.8.0   ✓ installed

$ mise list
usage  2.8.0

$ usage --version
usage-cli 2.8.0
```

### Test 2: npm Package Installation ✅

```bash
$ mise install npm:prettier@latest
mise npm:prettier@3.6.2 install
mise npm:prettier@3.6.2 added 1 package in 2s
mise npm:prettier@3.6.2 ✓ installed

$ mise list
npm:prettier  3.6.2
usage         2.8.0

$ prettier --version
3.6.2
```

### Test 3: GitHub Tool Installation (with rate limit) ⚠️

```bash
$ mise install ripgrep@latest
WARN  GitHub rate limit exceeded. Resets at 2025-11-15 08:13:39 +00:00
WARN  GITHUB_TOKEN is not set.
Error: Failed to install aqua:BurntSushi/ripgrep@latest: HTTP status client error (403 Forbidden)
```

**Solution:** Set GITHUB_TOKEN before installation.

## Recommendations

### For This Environment

1. **Best for:** Installing CLI tools and language-specific packages
2. **Avoid:** Tools requiring GitHub API without token
3. **Use backends:** npm, cargo, core, pipx when possible
4. **Set GITHUB_TOKEN** if installing many tools from GitHub
5. **Test in `/tmp`** first before committing to project

### Example Workflow

```bash
# 1. Activate mise in session
export PATH="/root/.local/bin:$PATH"
eval "$(/root/.local/bin/mise activate bash)"

# 2. Create project with specific versions
cd ~/my-project
mise use node@20 python@3.11

# 3. Install additional tools
mise install npm:prettier npm:eslint
mise install pipx:black pipx:ruff

# 4. Verify
mise list

# 5. Work with tools (they're automatically in PATH)
node --version    # Uses mise-installed version
prettier --write .
```

## Troubleshooting

### Issue: GitHub Rate Limit

**Solution:**
```bash
export GITHUB_TOKEN=ghp_your_token_here
mise install <tool>
```

### Issue: mise not in PATH

**Solution:**
```bash
export PATH="/root/.local/bin:$PATH"
```

### Issue: Tool not activated

**Solution:**
```bash
eval "$(/root/.local/bin/mise activate bash)"
# Or use full path
/root/.local/share/mise/installs/<tool>/<version>/bin/<binary>
```

### Issue: Broken pipe errors

**Solution:** Don't pipe mise output through grep/sed, use mise commands directly

## Conclusion

mise successfully works in the Claude Code environment and provides a powerful way to install and manage development tools without requiring sudo privileges or system package manager access. It's particularly useful for:

- Installing specific versions of programming languages
- Managing project-specific tool versions
- Installing CLI utilities that aren't in the system packages
- Creating reproducible development environments

The main limitation is GitHub API rate limiting for unauthenticated requests, which can be resolved by setting a GITHUB_TOKEN.

---

**Installation Date:** 2025-11-15
**mise Version:** 2025.11.5
**Status:** ✅ Fully Functional
**Tested Tools:** usage, npm:prettier
