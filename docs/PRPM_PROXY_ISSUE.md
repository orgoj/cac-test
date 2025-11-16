# PRPM Usage in Claude Code Container Environment

## Overview

This document describes the issue encountered when using [prpm](https://github.com/pr-pm/prpm) (Package Manager for AI Prompts) within the Claude Code container environment.

## What is PRPM?

PRPM is a package manager for AI prompts and rules, designed to work across multiple AI editors (Cursor, Claude, Continue, Windsurf, GitHub Copilot). It hosts over 2,100+ packages including:
- Cursor rules
- Claude Agent Skills
- Slash commands
- Workflow collections

Official site: https://prpm.dev

## Installation

PRPM can be installed successfully via npm:

```bash
npm install -g prpm
```

**Installation result:** ✅ SUCCESS
```
added 61 packages in 4s
```

## The Problem: DNS Resolution Failure

While prpm installs successfully, all runtime operations fail with DNS resolution errors.

### Error Example

```bash
$ prpm search flutter
```

**Error output:**
```
⚠️  Could not load manifest schema, skipping schema validation

❌ Search failed: fetch failed

Error: getaddrinfo EAI_AGAIN app.posthog.com
Error: getaddrinfo EAI_AGAIN registry.prpm.dev
```

### Root Cause Analysis

The Claude Code container environment uses an HTTP proxy for all outbound connections. The environment variables are properly configured:

```bash
HTTP_PROXY=http://...@21.0.0.93:15004
HTTPS_PROXY=http://...@21.0.0.93:15004
http_proxy=http://...@21.0.0.93:15004
https_proxy=http://...@21.0.0.93:15004
GLOBAL_AGENT_HTTP_PROXY=http://...@21.0.0.93:15004
```

**Why npm works but prpm doesn't:**

| Tool | DNS Resolution | Proxy Handling | Result |
|------|---------------|----------------|--------|
| **npm** | Via HTTP proxy | ✅ Full proxy support | ✅ Works |
| **curl** | Via HTTP proxy | ✅ Respects proxy env vars | ✅ Works |
| **prpm** | Direct DNS lookup | ❌ DNS before proxy | ❌ Fails |

### Technical Details

1. **prpm uses Node.js `undici`/`fetch()`** which performs DNS resolution **before** applying HTTP proxy settings
2. **Direct DNS lookup fails** in container environment:
   ```javascript
   const dns = require('dns');
   dns.lookup('registry.prpm.dev', (err, address) => {
     // Error: getaddrinfo EAI_AGAIN registry.prpm.dev
   });
   ```

3. **HTTP requests via curl work** because they respect proxy fully:
   ```bash
   $ curl -I https://registry.prpm.dev
   HTTP/1.1 200 OK  # ✅ Works through proxy
   ```

### Verification Tests

**Test 1: Node.js DNS lookup (fails)**
```bash
$ node -e "const dns = require('dns'); dns.lookup('registry.prpm.dev', (err, address) => { if (err) console.error('Error:', err); else console.log('IP:', address); });"
```
Result: `Error: getaddrinfo EAI_AGAIN registry.prpm.dev`

**Test 2: curl via proxy (works)**
```bash
$ curl -I https://registry.prpm.dev
```
Result: `HTTP/1.1 200 OK` (via proxy at 21.0.0.93)

**Test 3: npm install (works)**
```bash
$ npm install -g prpm
```
Result: ✅ Success - npm properly uses HTTP_PROXY

## Impact

All prpm commands fail in this environment:
- ❌ `prpm search <query>`
- ❌ `prpm install <package>`
- ❌ `prpm list`
- ❌ `prpm trending`
- ❌ Any operation requiring network access

## Proposed Solutions

### Option 1: Use HTTP client that respects proxy environment variables
Replace `undici`/`fetch()` with a client like:
- `node-fetch` with `https-proxy-agent`
- `axios` (has built-in proxy support)
- `got` (respects proxy environment variables)

Example with axios:
```javascript
const axios = require('axios');
// Automatically uses HTTP_PROXY/HTTPS_PROXY environment variables
const response = await axios.get('https://registry.prpm.dev/search?q=flutter');
```

### Option 2: Add proxy configuration options
Allow users to explicitly configure proxy:
```bash
prpm config set proxy http://proxy.example.com:8080
prpm config set https-proxy http://proxy.example.com:8080
```

### Option 3: Support global-agent
Integrate with [global-agent](https://github.com/gajus/global-agent) which properly patches Node.js HTTP stack for proxy environments.

### Option 4: Add environment variable to disable DNS lookup
Add option to force all requests through proxy without DNS resolution:
```bash
PRPM_FORCE_PROXY=true prpm search flutter
```

## Workaround

Currently, there is **no workaround** in this environment. Users must:
1. Manually create Skills following the [Agent Skills format](https://docs.claude.com/en/docs/agents-and-tools/agent-skills)
2. Find Skill content via web browser at https://prpm.dev
3. Create Skill directories and SKILL.md files manually

## Example: Manual Skill Creation

Instead of:
```bash
prpm install @username/flutter-development
```

Manual process:
```bash
# 1. Create skill directory
mkdir -p .claude/skills/flutter-development

# 2. Create SKILL.md file
cat > .claude/skills/flutter-development/SKILL.md << 'EOF'
---
name: flutter-development
description: Build cross-platform mobile apps with Flutter and Dart
---
# Flutter Development
...
EOF
```

## Environment Information

- **Environment:** Claude Code container (sandbox)
- **Node.js version:** v22.21.1
- **npm version:** 10.x
- **OS:** Linux (container)
- **Proxy:** HTTP proxy at 21.0.0.93:15004
- **DNS:** Direct DNS resolution not available
- **prpm version:** latest (installed via npm)

## Related Issues

This is a known issue with Node.js `fetch()`/`undici` in proxy environments:
- Node.js fetch doesn't respect proxy environment variables for DNS resolution
- DNS lookup happens before proxy is applied
- Common in containerized/sandboxed environments

## Testing in Different Environments

### Works in:
- ✅ Standard desktop/laptop environments with direct internet access
- ✅ Environments with proper DNS servers
- ✅ npm/yarn operations (different HTTP client)

### Fails in:
- ❌ Claude Code container environment
- ❌ Corporate networks with HTTP-only proxy
- ❌ Any environment where direct DNS resolution is blocked
- ❌ Containerized environments without DNS access

## Recommendations for PRPM Maintainers

1. **Investigate HTTP client choice:** Consider switching from `undici`/`fetch()` to a library with better proxy support
2. **Add proxy configuration:** Allow explicit proxy configuration
3. **Test in proxy environments:** Add CI/CD tests for proxy scenarios
4. **Document proxy requirements:** Clearly state DNS requirements in documentation
5. **Provide proxy troubleshooting guide:** Help users debug proxy-related issues

## Issue Template for PRPM Repository

```markdown
### Bug Report: prpm fails in HTTP proxy environments with DNS resolution errors

**Environment:**
- Node.js: v22.21.1
- prpm: latest
- Environment: Claude Code container / HTTP proxy environment

**Problem:**
prpm fails with `getaddrinfo EAI_AGAIN` when DNS resolution must go through HTTP proxy

**Root cause:**
prpm uses undici/fetch() which performs DNS lookup before applying proxy settings

**Expected behavior:**
prpm should respect HTTP_PROXY/HTTPS_PROXY environment variables like npm does

**Actual behavior:**
All operations fail with DNS resolution errors despite proxy being properly configured

**Proposed solutions:**
1. Switch to HTTP client that respects proxy env vars (axios, got, node-fetch + agent)
2. Add explicit proxy configuration options
3. Support global-agent for proxy environments

See full analysis: [link to this documentation]
```

## Additional Resources

- PRPM Repository: https://github.com/pr-pm/prpm
- PRPM Website: https://prpm.dev
- Claude Agent Skills Documentation: https://docs.claude.com/en/docs/agents-and-tools/agent-skills
- Node.js proxy issues: https://github.com/nodejs/undici/issues?q=proxy

## Conclusion

While prpm is a valuable tool for managing AI prompts and Skills, it currently cannot function in the Claude Code container environment due to DNS resolution happening before proxy application. This affects any environment that requires HTTP proxy for outbound connections.

The recommended solution is for prpm maintainers to switch to an HTTP client library that properly respects HTTP_PROXY environment variables throughout the entire request lifecycle, including DNS resolution.
