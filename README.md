# Claude Code Remote Environment Documentation

Documentation of the Claude Code remote execution environment available at [claude.ai/code](https://claude.ai/code).

## About This Repository

This repository documents the **specific cloud environment** where Claude Code executes when accessed via the web interface. It contains:
- System specifications and capabilities
- Pre-installed tools and packages
- Configuration discovered in this environment
- Analysis scripts for exploring the environment

**Note:** This is NOT general Claude Code documentation. For official Claude Code on the web documentation, visit [code.claude.com/docs/en/claude-code-on-the-web](https://code.claude.com/docs/en/claude-code-on-the-web).

## Documentation Index

### Core Documentation

- **[CLAUDE_CONFIGURATION.md](CLAUDE_CONFIGURATION.md)** - Complete overview of Claude Code capabilities, tools, and operational instructions
- **[CONFIGURATION.md](CONFIGURATION.md)** - Configuration system, directory structure, hooks, and skills
- **[SUBAGENT_MODEL_SELECTION.md](SUBAGENT_MODEL_SELECTION.md)** - Guide to dynamic model selection for subagents (Haiku/Sonnet/Opus)
- **[MCP_SERVERS.md](MCP_SERVERS.md)** - MCP (Model Context Protocol) servers configuration and testing guide
- **[ALL_OPTIONS_HONEST_ASSESSMENT.md](ALL_OPTIONS_HONEST_ASSESSMENT.md)** - **START HERE** - Upřímný přehled všech 9 možností pro API klíče v remote containeru
- **[REMOTE_MCP_SOLUTION.md](REMOTE_MCP_SOLUTION.md)** - Remote MCP server řešení (základní koncept)
- **[COMPLETE_SOLUTION.md](COMPLETE_SOLUTION.md)** - Kompletní implementační guide
- **[QUICK_IP_DISCOVERY.md](QUICK_IP_DISCOVERY.md)** - Jak zjistit Anthropic IPs (3 metody)
- **[ZERO_SECRETS_IN_GIT.md](ZERO_SECRETS_IN_GIT.md)** - Zero-secrets přístupy (IP whitelist, atd.)
- **[MCP_SECURITY_GUIDE.md](MCP_SECURITY_GUIDE.md)** - Bezpečnostní levels a best practices

### System Environment

- **[SYSTEM_ENVIRONMENT.md](SYSTEM_ENVIRONMENT.md)** - Detailed system overview, resources, and capabilities
- **[system-info.md](system-info.md)** - Auto-generated system information (run `./analyze-system.sh` to update)
- **[installed-packages.md](installed-packages.md)** - Complete list of 675+ installed system packages
- **[mise-package-manager.md](mise-package-manager.md)** - User-space package manager documentation

### Automation Scripts

- **[analyze-system.sh](analyze-system.sh)** - System analysis script (generates system-info.md)
- **[claude-info.sh](claude-info.sh)** - Extracts .claude directory configuration and settings

## Quick Start

### Environment Overview

**Platform:** Ubuntu 24.04.3 LTS (Cloud/KVM)
**Resources:** 16 CPU cores, 13 GB RAM, 30 GB disk
**Location:** Google Cloud (104.155.178.59)

### Available Development Tools

- **Languages:** Python 3.11 (with pip, poetry), Node.js (Latest LTS versions with npm, yarn, pnpm, bun), Java 21, Go 1.24, Ruby 3.1.6/3.2.6/3.3.6 (default: 3.3.6, managed by rbenv), PHP 8.4, Rust 1.91
- **Build Tools:** GCC 13.3, CMake 3.28, Make 4.3, Maven, Gradle
- **Version Control:** Git 2.43
- **Package Managers:** npm, pip, cargo, mise
- **Databases:** PostgreSQL 16, Redis 7.0

### Key Features

**Available:**
- Full development toolchain for multiple languages
- Git operations with full repository access
- Network access via proxy
- File system read/write operations
- Process execution
- Package installation via apt

**Limited:**
- Network diagnostic tools
- System configuration changes

## Getting Help

- **Documentation Issues:** [github.com/anthropics/claude-code/issues](https://github.com/anthropics/claude-code/issues)
- **Official Docs:** [code.claude.com/docs/en/claude-code-on-the-web](https://code.claude.com/docs/en/claude-code-on-the-web)
- **Help Command:** Type `/help` in Claude Code

## What This Environment Supports

The Claude Code remote environment (at claude.ai/code) is optimized for:
- Multi-language development projects
- Building and compiling software
- Web development with modern frameworks
- DevOps scripting and automation
- Data processing and analysis
- Git-based workflows
- Testing and CI/CD preparation

## System Analysis

To generate fresh system information:

```bash
./analyze-system.sh
```

This updates `system-info.md` with current system state, resource usage, and timestamps.

## Environment Variables

Key environment indicators:
```bash
CLAUDECODE=1
CLAUDE_CODE_REMOTE=true
CLAUDE_CODE_VERSION=2.0.34
CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE=cloud_default
```

---

**Documentation Purpose:** Environment analysis of claude.ai/code remote execution environment
**Last Updated:** 2025-11-15
**Environment:** Claude Code Remote Cloud (Sandboxed)
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
